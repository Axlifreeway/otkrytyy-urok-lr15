#!/usr/bin/env python3
"""Сервер событий лабораторных ОПЦ.07.

Студентские страницы шлют события (запуск команды, ошибка, уровень пройден, ушёл со вкладки…),
хранят прогресс (можно начать на паре и закончить дома), студенты входят по группе, фамилии и PIN (списков групп наружу сервер не отдаёт).
Преподавательская панель /teacher/ получает сводку и ведёт списки групп.
Только стандартная библиотека Python, база — SQLite.

Запуск:  LABS_KEY=секрет python3 labsrv.py
Слушает 127.0.0.1:8090 (снаружи доступен только через nginx: location /api/).

Ключ преподавателя и токен студента передаются в заголовках X-Labs-Key и X-Labs-Token
(чтобы не попадать в журналы nginx). Старый способ — параметром в адресе — тоже принимается.
"""
import collections
import csv
import hashlib
import hmac
import io
import json
import logging
import mimetypes
import os
import re
import sqlite3
import threading
import time
import traceback
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, quote, urlparse

KEY = os.environ.get('LABS_KEY', '')
PORT = int(os.environ.get('LABS_PORT', '8090'))
DB = os.environ.get('LABS_DB', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'labs.db'))
STATIC = os.environ.get('LABS_STATIC', '')  # только для проверки без nginx: раздавать файлы лаб самому
STATUS_MIN = float(os.environ.get('LABS_STATUS_MIN', '5'))   # раз в сколько минут писать строку состояния в журнал (0 — не писать)
SLOW_MS = 1500                              # запрос дольше — пишется в журнал как медленный
HEALTH_DAYS = 30                            # сколько дней хранить строки состояния в базе (таблица health)

LOG = logging.getLogger('labsrv')

TYPES = {'hello', 'level', 'run', 'lint', 'rollback', 'done', 'paste', 'away', 'submit', 'hb', 'shot', 'practice', 'trace'}   # 'report' пишет сам сервер
LEVELS = {'lr13': 19, 'lr14': 20, 'lr15': 22, 'lr16': 17, 'lr17': 22, 'lr18': 19, 'lr19': 22, 'lr20': 24, 'lr21': 18, 'lr22': 14, 'lr23': 13, 'lr24': 15}   # число уровней в лабе — для панели преподавателя
GATED = ('lr17', 'lr18', 'lr19', 'lr20', 'lr21', 'lr22', 'lr23', 'lr24')   # пиццерия и библиотека: открывает преподаватель
MAX_BODY = 400000
MAX_AGE = 12 * 3600 * 1000                  # насколько в прошлое можно дослать событие после обрыва связи
MAX_REPORT = 350000                         # снимок протокола (HTML) — обычно 30–80 КБ
REPORT_VERSIONS = 10                        # сколько последних отправок одного отчёта хранить
REPORT_LABS = {'lr13', 'lr14', 'lr15', 'lr16', 'lr17', 'lr18', 'lr19', 'lr20', 'lr21', 'lr22', 'lr23', 'lr24', 'lr13t', 'lr14t', 'lr16t'}   # 3D-лабы и тетради (…t)
RATE_PER_SEC = 200                          # вся группа может сидеть за одним IP колледжа
PIN_TRIES = 8
# защита от «захвата» чужих аккаунтов: первый вход задаёт PIN, поэтому с одного устройства
# впервые войти можно только в один аккаунт за CLAIM_WINDOW; неверные PIN считаются и по устройству, и по IP
CLAIM_WINDOW_MS = 30 * 60000
FAIL_WINDOW_MS = 10 * 60000
FAILS_PER_DEVICE = 10
FAILS_PER_IP = 60                           # вся группа может сидеть за одним IP колледжа
PIN_LOCK_MS = 600000

SCHEMA = '''
CREATE TABLE IF NOT EXISTS ev (
  id INTEGER PRIMARY KEY, ts INTEGER, client TEXT, lab TEXT, fio TEXT, grp TEXT, seed INTEGER, type TEXT, data TEXT, ip TEXT);
CREATE INDEX IF NOT EXISTS ev_ts ON ev(ts);
CREATE INDEX IF NOT EXISTS ev_client ON ev(client, ts);
CREATE INDEX IF NOT EXISTS ev_type ON ev(type, client);
CREATE TABLE IF NOT EXISTS grp (name TEXT PRIMARY KEY, ord INTEGER);
CREATE TABLE IF NOT EXISTS student (
  id INTEGER PRIMARY KEY, grp TEXT, name TEXT, idx INTEGER, pin TEXT, fails INTEGER DEFAULT 0, lock_until INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS progress (sid INTEGER, lab TEXT, data TEXT, ts INTEGER, PRIMARY KEY (sid, lab));
CREATE TABLE IF NOT EXISTS say (id INTEGER PRIMARY KEY, ts INTEGER, grp TEXT, text TEXT, mode TEXT);
CREATE TABLE IF NOT EXISTS report (
  id INTEGER PRIMARY KEY, ts INTEGER, client TEXT, lab TEXT, fio TEXT, grp TEXT, seed INTEGER, pts REAL, done INTEGER, html TEXT);
CREATE INDEX IF NOT EXISTS report_ts ON report(ts);
CREATE INDEX IF NOT EXISTS report_client ON report(client, lab, ts);
CREATE TABLE IF NOT EXISTS setting (k TEXT PRIMARY KEY, v TEXT);
CREATE TABLE IF NOT EXISTS trace (id INTEGER PRIMARY KEY, ts INTEGER, client TEXT, lab TEXT, grp TEXT, data TEXT);
CREATE INDEX IF NOT EXISTS trace_ts ON trace(ts);
CREATE TABLE IF NOT EXISTS label (client TEXT, lab TEXT, lv INTEGER, val TEXT, ts INTEGER, PRIMARY KEY (client, lab, lv));
CREATE TABLE IF NOT EXISTS health (ts INTEGER PRIMARY KEY, data TEXT);
'''
MAX_TRACE = 60000                           # трасса набора одного уровня (common/trust.js) — обычно 2–15 КБ
LABELS = {'honest', 'copy'}                 # пометка преподавателя для разбора: честно / переписывал
# столбцы, добавленные позже: (таблица, столбец, тип) — для баз, созданных старой версией
COLUMNS = [
    ('student', 'pin_dev', 'TEXT'),         # с какого устройства задан PIN
    ('say', 'sid', 'INTEGER'),              # объявление одному студенту (NULL — всем / группе)
]


def now_ms():
    return int(time.time() * 1000)


def clip(v, n):
    return str(v or '')[:n]


def short(name):
    w = str(name).split()
    return w[0] + (' ' + w[1][0] + '.' if len(w) > 1 else '')


def words(name):
    """«Иванов  И.» → ['иванов', 'и']: для сравнения введённой фамилии со списком группы."""
    return re.sub(r'[^\w\- ]', ' ', str(name).lower().replace('ё', 'е')).split()


# ═══════════════════════════════════════════════════════════ прогресс ══
# уровни, добавленные в уже идущие лабы: кто прошёл лабу раньше (контрольный пройден), получает их зачтёнными.
# То же — в common/shell.js (cfg.added), чтобы и в лабе, и в панели работа оставалась законченной.
ADDED = {
    'lr13': ['meal2', 'nulls', 'badmeal', 'heavy', 'school', 'dupid', 'newbag'],
    'lr14': ['dest', 'loyal', 'rename', 'two', 'light', 'gold', 'byear', 'back'],
    'lr15': ['loyal', 'grams', 'noteq', 'ge', 'notin', 'noyear', 'letter', 'meals', 'oldest'],
    'lr16': ['mybags', 'weight', 'sorted', 'cardbags', 'dest3', 'leftall', 'noflight'],
    'lr17': ['minmax1', 'qty', 'uniq', 'bydist', 'veg', 'transport', 'avgdist', 'busy', 'hotdays'],
    'lr18': ['belowavg', 'minrow', 'firstday', 'bytransport', 'nophone', 'unsold', 'quiet', 'exists', 'corr'],
    'lr19': ['veg', 'fleet', 'pickup', 'cheap', 'district', 'percour', 'months'],
    'lr20': ['qtyfix', 'phone', 'cancel', 'guarded', 'forget', 'txcommit', 'swap'],
    'lr21': ['dupcard', 'newcard', 'reauthor', 'addnull', 'notnull', 'dropcol', 'return'],
    'lr22': ['small', 'like', 'byauthor', 'whole', 'sort', 'agg', 'most'],
    'lr23': ['order', 'func', 'uniq', 'uniqfail', 'pages', 'wide', 'size'],
    'lr24': ['dp', 'who', 'colgrant', 'colcheck', 'again'],
}


FINAL = {'lr19': 'check'}   # ключ последнего (контрольного) уровня, если он не 'final'


def credit(lab, d):
    lv = (d or {}).get('lv') or {}
    if lab not in ADDED or not (lv.get(FINAL.get(lab, 'final')) or {}).get('done'):
        return d
    lv = dict(lv)
    for k in ADDED[lab]:
        if not (lv.get(k) or {}).get('done'):
            lv[k] = {'done': True, 'auto': True, 'runs': 0, 'fails': 0}
    return {**d, 'lv': lv}


def mark(pts):
    """Оценка за уровни 3D-лабы (из 9 баллов, без ответов на вопросы) — та же шкала, что в common/shell.js (MARK)."""
    return '5' if pts >= 8.5 else '4' if pts >= 6.5 else '3' if pts >= 4.5 else '2'


def merge(a, b):
    """Объединить прогресс с двух устройств: пройденные уровни не теряются ни с одной стороны.
    Та же логика — в common/login.js (mergeP); их совпадение проверяет tests/common.test.mjs."""
    if not a:
        return b or {}
    if not b:
        return a
    out = dict(a)
    lv = dict(a.get('lv') or {})
    for k, r in (b.get('lv') or {}).items():
        x = lv.get(k)
        if not x or (r.get('done') and not x.get('done')) or (bool(r.get('done')) == bool(x.get('done')) and (r.get('runs') or 0) > (x.get('runs') or 0)):
            lv[k] = r
    out['lv'] = lv
    out['pred'] = {**(b.get('pred') or {}), **(a.get('pred') or {})}
    ja = a.get('journal') or []
    key = lambda e: (e.get('t'), str(e.get('q') or '')[:200])   # команды приходят укороченными до 200 символов
    seen = {key(e) for e in ja if isinstance(e, dict)}
    out['journal'] = (ja + [e for e in (b.get('journal') or []) if isinstance(e, dict) and key(e) not in seen])[-800:]
    ans = dict(a.get('answers') or {})
    for k, v in (b.get('answers') or {}).items():
        if v and len(str(v)) >= len(str(ans.get(k) or '')):
            ans[k] = v
    out['answers'] = ans
    for k in ('lints', 'away', 'awayMs', 'pastes', 'inserts', 'cur', 'practice', 'sentAt'):
        out[k] = max(a.get(k) or 0, b.get(k) or 0)
    out['fio'] = b.get('fio') or a.get('fio') or ''
    # порядок уровней: «старый» с любого устройства побеждает — иначе студента откатит назад
    order = 'old' if 'old' in (a.get('order'), b.get('order')) else a.get('order') or b.get('order')
    if order:
        out['order'] = order
    return out


# ═══════════════════════════════════════════════════ сводка для панели ══
def _person(ts, client, lab, fio, grp, seed):
    return {'client': client, 'lab': lab, 'fio': fio, 'grp': grp, 'seed': seed, 'first': ts, 'last': ts,
            'lv': 1, 'lvSince': ts, 'done': [], 'pts': 0, 'runs': 0, 'errors': 0, 'lints': 0, 'lvErrors': 0,
            'lastErr': '', 'lastErrTs': 0, 'lastSql': '', 'away': 0, 'awayMs': 0, 'pastes': 0, 'inserts': 0, 'shots': 0, 'submit': None, 'report': None, 'practice': 0,
            'hidden': False, 'stars': {}, 'starsAt': 0, 'doneN': 0, 'trust': None, 'trustWhy': '', 'trustLv': {}}


def _error(p, d, ts, lv, text):
    if lv == p['lv']:
        p['lvErrors'] += 1
    p['lastErr'] = clip(text, 300)
    p['lastErrTs'] = ts


def summarize(rows, now, live=True):
    """Сводка по каждому студенту (client) из событий за выбранный период; live=False — прошлый день, «застрял» не считается."""
    people = {}
    for (ts, client, lab, fio, grp, seed, typ, data) in rows:
        try:
            d = json.loads(data or '{}')
        except ValueError:
            d = {}
        p = people.setdefault(client, _person(ts, client, lab, fio, grp, seed))
        p['last'] = max(p['last'], ts)
        if typ == 'report':                     # отчёт может быть и из тетради — текущую лабу он не меняет
            p['report'] = {'id': d.get('id'), 'ts': ts, 'lab': lab}
            continue
        p['lab'], p['fio'], p['grp'] = lab or p['lab'], fio or p['fio'], grp or p['grp']
        if seed is not None:
            p['seed'] = seed
        lv = d.get('lv')
        if typ in ('level', 'hello', 'hb') and lv and lv != p['lv']:
            p['lv'], p['lvSince'], p['lvErrors'] = lv, ts, 0
        if isinstance(d.get('tAll'), (int, float)) and not isinstance(d.get('tAll'), bool):   # коэффициент доверия к набору (common/trust.js)
            p['trust'], p['trustWhy'] = d['tAll'], clip(d.get('tWhy'), 120)
        if typ == 'run':
            p['runs'] += 1
            p['lastSql'] = clip(d.get('sql'), 600)
            if not d.get('ok'):
                p['errors'] += 1
                _error(p, d, ts, lv, d.get('txt') or d.get('out'))
        elif typ == 'lint':
            p['lints'] += 1
            p['lastSql'] = clip(d.get('sql'), 600)
            _error(p, d, ts, lv, d.get('msg'))
        elif typ == 'rollback':                 # команда выполнилась, но результат не совпал с заданием
            _error(p, d, ts, lv, d.get('msg'))
        elif typ == 'done':
            k = d.get('key')
            if k and k not in p['done']:
                p['done'].append(k)
            if lv:
                p['stars'][str(lv)] = d.get('stars', 0)
                p['starsAt'] = ts               # проектор: при равенстве звёзд выше тот, кто набрал их раньше
                if isinstance(d.get('trust'), (int, float)):
                    p['trustLv'][str(lv)] = d['trust']
            p['pts'] = max(p['pts'], d.get('pts') or 0)
        elif typ == 'paste':                   # via='input' — текст появился без вставки и без клавиш
            p['inserts' if d.get('via') == 'input' else 'pastes'] += 1
        elif typ == 'shot':                    # нажат Print Screen
            p['shots'] += 1
        elif typ == 'away':
            p['away'] += 1
            p['awayMs'] += int(d.get('ms') or 0)
        elif typ == 'practice':                 # задание тренировки решено (без баллов)
            p['practice'] = max(p['practice'], int(d.get('n') or 0))
        elif typ == 'submit':
            p['submit'] = {'ts': ts, 'pts': d.get('pts'), 'done': d.get('done')}
        elif typ in ('hb', 'hello'):
            p['pts'] = max(p['pts'], d.get('pts') or 0)
            p['doneN'] = max(p['doneN'], d.get('done') or 0)
            if typ == 'hb':
                p['hidden'] = bool(d.get('hidden'))
    out = []
    for p in people.values():
        p['doneN'] = max(p['doneN'], len(p['done']))
        p['starsN'] = sum(int(x or 0) for x in p['stars'].values())
        p['idle'] = now - p['last']
        p['onLevel'] = now - p['lvSince']
        p['total'] = LEVELS.get(p['lab'], 12)
        reasons = []
        if live and not p['submit']:
            if p['onLevel'] > 7 * 60000:
                reasons.append(f"на уровне {p['onLevel'] // 60000} мин")
            if p['lvErrors'] >= 3:
                reasons.append(f"ошибок на уровне: {p['lvErrors']}")
            if 3 * 60000 < p['idle'] < 40 * 60000:
                reasons.append(f"нет действий {p['idle'] // 60000} мин")
        p['stuck'] = reasons
        out.append(p)
    return out


# ════════════════════════════════════════════════════════════ данные ══
class Store:
    """База SQLite и все операции с ней (под одним замком: сервер многопоточный)."""

    def __init__(self, path, key):
        self.key = key
        self.path = path
        self.lock = threading.Lock()
        self.con = sqlite3.connect(path, check_same_thread=False)
        self.con.execute('PRAGMA journal_mode=WAL')
        self.migrate(path)
        self.claims = {}                    # устройство → (время, номер студента) последнего первого входа
        self.fails = {}                     # 'd:устройство' / 'i:IP' → времена неверных PIN

    def migrate(self, path):
        """Обновление схемы только добавлением: новые таблицы и столбцы, старые строки не трогаются.
        Перед изменением старой базы рядом кладётся её копия labs.db.before-<время>."""
        con = self.con
        have = {r[0] for r in con.execute("SELECT name FROM sqlite_master WHERE type = 'table'")}
        cols = lambda t: {r[1] for r in con.execute(f'PRAGMA table_info({t})')}
        need_tables = set(re.findall(r'CREATE TABLE IF NOT EXISTS (\w+)', SCHEMA)) - have
        need_cols = [(t, c, d) for t, c, d in COLUMNS if t in have and c not in cols(t)]
        if have and (need_tables or need_cols):
            dst = sqlite3.connect(f'{path}.before-{time.strftime("%Y%m%d-%H%M%S")}')
            con.backup(dst)
            dst.close()
        con.executescript(SCHEMA)
        for t, c, d in COLUMNS:
            if c not in cols(t):
                con.execute(f'ALTER TABLE {t} ADD COLUMN {c} {d}')
        con.commit()

    # ── токены и PIN ──
    def pin_hash(self, sid, pin):
        return hashlib.sha256(f'{sid}:{pin}:{self.key}'.encode()).hexdigest()

    def token_for(self, sid):
        return f"{sid}.{hmac.new(self.key.encode(), str(sid).encode(), 'sha256').hexdigest()[:24]}"

    def sid_from(self, token):
        try:
            sid = int(str(token).split('.', 1)[0])
        except ValueError:
            return None
        return sid if self.key and hmac.compare_digest(self.token_for(sid), str(token)) else None

    def key_ok(self, key):
        return bool(self.key) and hmac.compare_digest(str(key or '').encode(), self.key.encode())   # байты: ключ не из ASCII ронял обработчик

    # ── студенты ──
    def has_groups(self):
        with self.lock:
            return bool(self.con.execute('SELECT 1 FROM grp LIMIT 1').fetchone())

    def student(self, sid):
        """(ФИО, группа, вариант) студента или None."""
        with self.lock:
            r = self.con.execute('SELECT s.name, s.grp, g.ord * 100 + s.idx FROM student s JOIN grp g ON g.name = s.grp WHERE s.id = ?', (sid,)).fetchone()
        return r

    def groups(self):
        with self.lock:
            return [r[0] for r in self.con.execute('SELECT name FROM grp ORDER BY ord')]

    def _recent_fails(self, key, now):
        ts = [t for t in self.fails.get(key, []) if now - t < FAIL_WINDOW_MS]
        self.fails[key] = ts
        return len(ts)

    def _limited(self, dev, ip, now):
        return (dev and self._recent_fails('d:' + dev, now) >= FAILS_PER_DEVICE) or (ip and self._recent_fails('i:' + ip, now) >= FAILS_PER_IP)

    def _fail(self, dev, ip, now):
        for k in (['d:' + dev] if dev else []) + (['i:' + ip] if ip else []):
            self.fails.setdefault(k, []).append(now)

    def find(self, grp, name, dev='', ip=''):
        """Студент группы по введённой фамилии (можно с именем или инициалом) → (номер, None) или (None, (код, тело)).
        Списков групп наружу сервер не отдаёт, поэтому промахи считаются как неверные PIN — перебирать фамилии долго."""
        want, now = words(name), now_ms()
        with self.lock:
            if self._limited(dev, ip, now):
                return None, (429, {'err': 'С этого компьютера слишком много неудачных попыток входа. Подождите 10 минут или подойдите к преподавателю.'})
            if not want:
                return None, (400, {'err': 'Впишите свою фамилию'})
            rows = self.con.execute('SELECT id, name FROM student WHERE grp = ? AND idx > 0', (grp,)).fetchall()
            hit = [sid for sid, n in rows
                   if len(words(n)) >= len(want) and words(n)[0] == want[0] and all(a.startswith(b) for a, b in zip(words(n)[1:], want[1:]))]
            if not hit:
                self._fail(dev, ip, now)
        if not hit:
            return None, (404, {'err': 'В этой группе нет такой фамилии. Проверьте группу и написание, например: Иванов.'})
        if len(hit) > 1:
            return None, (409, {'err': 'В группе несколько студентов с такой фамилией — впишите ещё и имя, например: Иванов Пётр.'})
        return hit[0], None

    def login(self, sid, pin, dev='', ip=''):
        """→ (код ответа, тело). dev — номер устройства (браузера), ip — адрес."""
        now = now_ms()
        with self.lock:
            if self._limited(dev, ip, now):
                return 429, {'err': 'С этого компьютера слишком много неверных PIN. Подождите 10 минут или подойдите к преподавателю.'}
            r = self.con.execute('SELECT s.id, s.grp, s.name, s.idx, s.pin, s.fails, s.lock_until, g.ord FROM student s JOIN grp g ON g.name = s.grp WHERE s.id = ?', (sid,)).fetchone()
            if not r or not r[3]:
                return 404, {'err': 'Нет такого студента в списке группы'}
            sid, grp, name, idx, ph, fails, lock_until, ord_ = r
            if lock_until and lock_until > now:
                return 429, {'err': f'Слишком много неверных PIN. Подождите {max(1, (lock_until - now) // 60000)} мин или попросите преподавателя сбросить PIN.'}
            first = not ph
            if first:
                prev = self.claims.get(dev) if dev else None
                if prev and prev[1] != sid and now - prev[0] < CLAIM_WINDOW_MS:
                    other = self.con.execute('SELECT name FROM student WHERE id = ?', (prev[1],)).fetchone()
                    return 403, {'err': f'С этого компьютера недавно уже вошли как {short(other[0]) if other else "другой студент"}. '
                                        'Войти впервые в ещё один аккаунт можно через 30 минут. Ошиблись в выборе — подойдите к преподавателю.'}
                self.claims[dev] = (now, sid)
                self.con.execute('UPDATE student SET pin = ?, fails = 0, pin_dev = ? WHERE id = ?', (self.pin_hash(sid, pin), dev or None, sid))
            elif not hmac.compare_digest(ph, self.pin_hash(sid, pin)):
                self._fail(dev, ip, now)
                fails = (fails or 0) + 1
                locked = fails >= PIN_TRIES
                self.con.execute('UPDATE student SET fails = ?, lock_until = ? WHERE id = ?', (0 if locked else fails, now + PIN_LOCK_MS if locked else 0, sid))
                self.con.commit()
                return 403, {'err': 'Неверный PIN' + (' — вход закрыт на 10 минут' if locked else f' (осталось попыток: {PIN_TRIES - fails})')}
            else:
                self.con.execute('UPDATE student SET fails = 0 WHERE id = ?', (sid,))
            self.con.commit()
        return 200, {'token': self.token_for(sid), 'sid': sid, 'fio': name, 'grp': grp, 'seed': ord_ * 100 + idx, 'idx': idx, 'first': first}

    # ── события ──
    def add_event(self, ts, client, lab, fio, grp, seed, typ, data, ip):
        with self.lock:
            self.con.execute('INSERT INTO ev (ts, client, lab, fio, grp, seed, type, data, ip) VALUES (?,?,?,?,?,?,?,?,?)',
                             (ts, clip(client, 40), clip(lab, 10), clip(fio, 60), clip(grp, 20), seed, typ,
                              json.dumps(data or {}, ensure_ascii=False)[:4000], ip))
            self.con.commit()

    def events(self, since, lab='', until=None):
        sql, args = 'SELECT ts, client, lab, fio, grp, seed, type, data FROM ev WHERE ts >= ? AND ts < ?', [since, until or 1 << 62]
        if lab:
            sql += ' AND lab = ?'
            args.append(lab)
        with self.lock:
            return self.con.execute(sql + ' ORDER BY ts', args).fetchall()

    def log(self, client, since, until=None):
        with self.lock:
            rows = self.con.execute('SELECT ts, type, data FROM ev WHERE client = ? AND ts >= ? AND ts < ? ORDER BY ts',
                                    (client, since, until or 1 << 62)).fetchall()
        return [{'ts': r[0], 'type': r[1], 'data': json.loads(r[2] or '{}')} for r in rows if r[1] != 'hb']

    # ── трассы набора и пометки для разбора коэффициента доверия ──
    def add_trace(self, ts, client, lab, grp, data):
        body = json.dumps(data if isinstance(data, dict) else {}, ensure_ascii=False)
        if len(body) > MAX_TRACE:
            return
        with self.lock:
            self.con.execute('INSERT INTO trace (ts, client, lab, grp, data) VALUES (?,?,?,?,?)',
                             (ts, clip(client, 40), clip(lab, 10), clip(grp, 20), body))
            self.con.commit()

    def set_label(self, client, lab, lv, val):
        with self.lock:
            if val in LABELS:
                self.con.execute('INSERT OR REPLACE INTO label (client, lab, lv, val, ts) VALUES (?,?,?,?,?)', (client, lab, lv, val, now_ms()))
            else:
                self.con.execute('DELETE FROM label WHERE client = ? AND lab = ? AND lv = ?', (client, lab, lv))
            self.con.commit()

    def labels(self, client, lab):
        with self.lock:
            return {str(r[0]): r[1] for r in self.con.execute('SELECT lv, val FROM label WHERE client = ? AND lab = ?', (client, lab))}

    def anon_salt(self):
        with self.lock:
            r = self.con.execute("SELECT v FROM setting WHERE k = 'anon_salt'").fetchone()
            if r:
                return r[0]
            v = os.urandom(16).hex()            # своя соль: псевдонимы постоянны между выгрузками, но по ним не узнать студента
            self.con.execute("INSERT INTO setting (k, v) VALUES ('anon_salt', ?)", (v,))
            self.con.commit()
            return v

    def export_traces(self, since=0, lab='', with_sql=True):
        """Обезличенная выгрузка: без ФИО, IP, устройства; студент и группа — псевдонимы.
        Строка — один пройденный уровень: трасса набора, итог доверия, пометка преподавателя, команды уровня."""
        salt = self.anon_salt().encode()
        pid = lambda c: hmac.new(salt, str(c).encode(), 'sha256').hexdigest()[:12]
        sql, args = 'SELECT ts, client, lab, grp, data FROM trace WHERE ts >= ?', [since]
        if lab:
            sql += ' AND lab = ?'
            args.append(lab)
        with self.lock:
            rows = self.con.execute(sql + ' ORDER BY ts', args).fetchall()
            labels = {(r[0], r[1], r[2]): r[3] for r in self.con.execute('SELECT client, lab, lv, val FROM label')}
            journals = {}
            if with_sql:
                for sid, lb, data in self.con.execute('SELECT sid, lab, data FROM progress'):
                    try:
                        journals[(f's{sid}', lb)] = json.loads(data).get('journal') or []
                    except (ValueError, AttributeError):
                        pass
        groups = {g: f'g{i + 1}' for i, g in enumerate(sorted({r[3] or '' for r in rows}))}
        for ts, client, lb, grp, data in rows:
            d = json.loads(data or '{}')
            lv = d.get('lv') if isinstance(d.get('lv'), int) else 0
            out = {'student': pid(client), 'group': groups[grp or ''], 'lab': lb, 'day': time.strftime('%Y-%m-%d', time.localtime(ts / 1000)), **d,
                   'label': labels.get((client, lb, lv)) or labels.get((client, lb, 0))}
            if with_sql:
                out['sql'] = [j.get('q') for j in journals.get((client, lb), []) if isinstance(j, dict) and j.get('lv') == d.get('key')][-20:]
            yield out

    # ── робот говорит: объявления преподавателя ──
    def add_say(self, grp, text, mode, sid=None):
        with self.lock:
            i = self.con.execute('INSERT INTO say (ts, grp, text, mode, sid) VALUES (?,?,?,?,?)', (now_ms(), grp, text, mode, sid)).lastrowid
            self.con.commit()
        return i

    def says(self, since, grp, sid=None):
        """Новые объявления (не старше 2 минут) для студента sid из группы grp; since < 0 — только номер последнего."""
        with self.lock:
            last = self.con.execute('SELECT coalesce(max(id), 0) FROM say').fetchone()[0]
            if since < 0:
                return last, []
            rows = self.con.execute("SELECT id, text, mode FROM say WHERE id > ? AND ts > ? AND (grp = '' OR grp = ?) "
                                    "AND (sid IS NULL OR sid = ?) ORDER BY id", (since, now_ms() - 120000, grp or '', sid or -1)).fetchall()
        return last, [{'id': r[0], 'text': r[1], 'mode': r[2]} for r in rows]

    def recent_says(self):
        with self.lock:
            return [{'id': r[0], 'ts': r[1], 'grp': r[2], 'text': r[3], 'mode': r[4], 'to': r[5]}
                    for r in self.con.execute('SELECT s.id, s.ts, s.grp, s.text, s.mode, st.name FROM say s LEFT JOIN student st ON st.id = s.sid ORDER BY s.id DESC LIMIT 10')]

    # ── какие лабы открыты студентам ──
    def labs_open(self):
        with self.lock:
            on = {k[5:] for (k,) in self.con.execute("SELECT k FROM setting WHERE k LIKE 'open:%' AND v = '1'")}
        return {lab: lab not in GATED or lab in on for lab in LEVELS}

    def set_lab_open(self, lab, on):
        with self.lock:
            self.con.execute('INSERT OR REPLACE INTO setting (k, v) VALUES (?, ?)', ('open:' + lab, '1' if on else '0'))
            self.con.commit()

    # ── отчёты: снимок протокола, который студент отправил преподавателю ──
    def add_report(self, client, lab, fio, grp, seed, pts, done, html):
        with self.lock:
            i = self.con.execute('INSERT INTO report (ts, client, lab, fio, grp, seed, pts, done, html) VALUES (?,?,?,?,?,?,?,?,?)',
                                 (now_ms(), client, lab, fio, grp, seed, pts, done, html)).lastrowid
            # старые версии того же отчёта сверх REPORT_VERSIONS — лишние (новая содержит всё то же и больше)
            self.con.execute('DELETE FROM report WHERE client = ? AND lab = ? AND id NOT IN '
                             '(SELECT id FROM report WHERE client = ? AND lab = ? ORDER BY id DESC LIMIT ?)',
                             (client, lab, client, lab, REPORT_VERSIONS))
            self.con.commit()
        return i

    def reports(self, since=0, until=None, client=''):
        sql, args = 'SELECT id, ts, client, lab, fio, grp, seed, pts, done FROM report WHERE ts >= ? AND ts < ?', [since, until or 1 << 62]
        if client:
            sql += ' AND client = ?'
            args.append(client)
        keys = ('id', 'ts', 'client', 'lab', 'fio', 'grp', 'seed', 'pts', 'done')
        with self.lock:
            return [dict(zip(keys, r)) for r in self.con.execute(sql + ' ORDER BY id DESC LIMIT 1000', args)]

    def report(self, rid):
        with self.lock:
            r = self.con.execute('SELECT id, ts, client, lab, fio, grp, seed, pts, done, html FROM report WHERE id = ?', (rid,)).fetchone()
        return dict(zip(('id', 'ts', 'client', 'lab', 'fio', 'grp', 'seed', 'pts', 'done', 'html'), r)) if r else None

    # ── прогресс ──
    def ev_progress(self, sid=None, lab=None):
        """Прогресс по событиям done/practice: {(номер, лаба): {'lv': …, 'practice': n}}. Вызывать под замком.
        Событие уходит из своей очереди с повторами и доходит, даже когда сохранение прогресса не дошло, —
        по нему пройденные уровни не теряются ни в списке группы, ни при входе с другого компьютера."""
        sql, args = "SELECT client, lab, type, data, ts FROM ev WHERE type IN ('done', 'practice') AND client LIKE 's%'", []
        if sid is not None:
            sql += ' AND client = ? AND lab = ?'
            args += [f's{sid}', lab]
        out = {}
        for client, lb, typ, data, ts in self.con.execute(sql, args):
            try:
                n, d = int(client[1:]), json.loads(data or '{}')
            except ValueError:
                continue
            if not isinstance(d, dict):
                continue
            p = out.setdefault((n, lb), {'lv': {}})
            if typ == 'practice':
                p['practice'] = max(p.get('practice', 0), d.get('n') if isinstance(d.get('n'), int) else 0)
            elif isinstance(d.get('key'), str) and d['key'] != 'practice':
                p['lv'].setdefault(d['key'], {'done': True, 'runs': 0, 'fails': d.get('fails') if isinstance(d.get('fails'), int) else 0,
                                              'at': time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime(ts / 1000))})
        return out

    def progress(self, sid, lab):
        with self.lock:
            r = self.con.execute('SELECT data, ts FROM progress WHERE sid = ? AND lab = ?', (sid, lab)).fetchone()
            ev = self.ev_progress(sid, lab).get((sid, lab))
        data = json.loads(r[0]) if r else None
        if ev:                              # пустая запись — того же вида, что сохраняет лаба (журнал, ответы…)
            data = merge(data or {'lv': {}, 'pred': {}, 'journal': [], 'answers': {}, 'cur': 0}, ev)
        return credit(lab, data) if data else data, (r[1] if r else 0)

    def save_progress(self, sid, lab, data):
        with self.lock:
            r = self.con.execute('SELECT data FROM progress WHERE sid = ? AND lab = ?', (sid, lab)).fetchone()
            data = merge(json.loads(r[0]) if r else None, data)
            self.con.execute('INSERT OR REPLACE INTO progress (sid, lab, data, ts) VALUES (?,?,?,?)', (sid, lab, json.dumps(data, ensure_ascii=False), now_ms()))
            self.con.commit()
        return data

    # ── группы (панель преподавателя) ──
    def admin_groups(self):
        with self.lock:
            # только отметки уровней: разбирать целиком журналы всех студентов под замком — долго
            prog = {(sid, lab): {'lv': json.loads(lv or '{}')} for sid, lab, lv in self.con.execute("SELECT sid, lab, json_extract(data, '$.lv') FROM progress")}
            for k, ev in self.ev_progress().items():
                prog[k] = merge(prog.get(k), ev)
            done = {}
            for (sid, lab), d in prog.items():
                d = credit(lab, d)
                n = sum(1 for k, r in (d.get('lv') or {}).items() if r.get('done') and k != 'practice')
                done.setdefault(sid, {})[lab] = min(n, LEVELS.get(lab, n))
            out = []
            for name, o in self.con.execute('SELECT name, ord FROM grp ORDER BY ord').fetchall():
                st = [{'id': sid, 'name': n, 'idx': idx, 'pin': bool(pin), 'seed': o * 100 + idx, 'labs': done.get(sid, {}), 'dev': dev}
                      for sid, n, idx, pin, dev in self.con.execute('SELECT id, name, idx, pin IS NOT NULL, pin_dev FROM student WHERE grp = ? ORDER BY idx', (name,))]
                # несколько аккаунтов, заведённых с одного устройства, — подозрительно
                by = {}
                for x in st:
                    if x['dev']:
                        by.setdefault(x['dev'], []).append(x['name'])
                for x in st:
                    x['sameDev'] = [n for n in by.get(x.pop('dev') or '', []) if n != x['name']]
                out.append({'name': name, 'students': st})
        return out

    def save_group(self, name, names, old=''):
        """Сохранить список. Порядок строк задаёт варианты; PIN и прогресс оставшихся сохраняются.
        old — прежнее название, если группу переименовали (номер группы и варианты не меняются).
        Возвращает текст ошибки или None."""
        with self.lock:
            con = self.con
            if old and old != name:
                if not con.execute('SELECT 1 FROM grp WHERE name = ?', (old,)).fetchone():
                    return f'Группы {old} уже нет'
                if con.execute('SELECT 1 FROM grp WHERE name = ?', (name,)).fetchone():
                    return f'Группа {name} уже есть — выберите другое название'
                con.execute('UPDATE grp SET name = ? WHERE name = ?', (name, old))
                for t in ('student', 'ev', 'say', 'report'):
                    con.execute(f'UPDATE {t} SET grp = ? WHERE grp = ?', (name, old))
            if not con.execute('SELECT 1 FROM grp WHERE name = ?', (name,)).fetchone():
                o = (con.execute('SELECT max(ord) FROM grp').fetchone()[0] or 0) + 1
                con.execute('INSERT INTO grp (name, ord) VALUES (?, ?)', (name, o))
            old = {r[1].lower(): r[0] for r in con.execute('SELECT id, name FROM student WHERE grp = ?', (name,))}
            keep = set()
            for i, n in enumerate(names, 1):
                sid = old.get(n.lower())
                if sid:
                    con.execute('UPDATE student SET idx = ?, name = ? WHERE id = ?', (i, n, sid))
                else:
                    sid = con.execute('INSERT INTO student (grp, name, idx) VALUES (?,?,?)', (name, n, i)).lastrowid
                keep.add(sid)
            for sid in old.values():
                if sid in keep:
                    continue
                if con.execute('SELECT 1 FROM progress WHERE sid = ?', (sid,)).fetchone():
                    con.execute('UPDATE student SET idx = 0 WHERE id = ?', (sid,))   # убран из списка, но работа сохраняется
                else:
                    con.execute('DELETE FROM student WHERE id = ?', (sid,))
            con.commit()
        return None

    def show_pin(self, sid):
        """PIN хранится хешем, но цифр всего четыре: перебор 10 000 вариантов — доли секунды."""
        with self.lock:
            r = self.con.execute('SELECT pin FROM student WHERE id = ?', (sid,)).fetchone()
        if not r or not r[0]:
            return None
        return next((p for p in (f'{i:04d}' for i in range(10000)) if hmac.compare_digest(r[0], self.pin_hash(sid, p))), None)

    def reset_pin(self, sid):
        with self.lock:
            self.con.execute('UPDATE student SET pin = NULL, fails = 0, lock_until = 0 WHERE id = ?', (sid,))
            self.con.commit()

    def delete_group(self, name):
        with self.lock:
            self.con.execute('DELETE FROM progress WHERE sid IN (SELECT id FROM student WHERE grp = ?)', (name,))
            self.con.execute('DELETE FROM student WHERE grp = ?', (name,))
            self.con.execute('DELETE FROM grp WHERE name = ?', (name,))
            self.con.commit()


    # ── журнал состояния сервера ──
    def db_bytes(self):
        return sum(os.path.getsize(f) for f in (self.path, self.path + '-wal') if os.path.isfile(f))

    def counts(self):
        with self.lock:
            q = lambda sql: self.con.execute(sql).fetchone()[0]
            return {'students': q('SELECT count(*) FROM student'), 'withPin': q('SELECT count(*) FROM student WHERE pin IS NOT NULL'),
                    'events': q('SELECT coalesce(max(id), 0) FROM ev'), 'reports': q('SELECT count(*) FROM report')}

    def add_health(self, ts, data):
        with self.lock:
            self.con.execute('INSERT OR REPLACE INTO health (ts, data) VALUES (?, ?)', (ts, json.dumps(data, ensure_ascii=False)))
            self.con.execute('DELETE FROM health WHERE ts < ?', (ts - HEALTH_DAYS * 86400000,))
            self.con.commit()

    def health(self, since):
        with self.lock:
            return [{'ts': ts, **json.loads(d)} for ts, d in self.con.execute('SELECT ts, data FROM health WHERE ts >= ? ORDER BY ts', (since,))]

    # ── итоги студентов для ведомости (пульт → «Выгрузка результатов») ──
    def results(self, grp='', lab=''):
        """Строка — студент × лаба: обычные уровни (пройдено, звёзды, промахи, баллы), бесконечная тренировка
        (решено, с первой попытки), доверие, команды, время работы, отчёт. Студенты без работы тоже попадают
        в выгрузку — пустой строкой, чтобы ведомость была полной."""
        cond, args = '', []
        if grp:
            cond, args = ' WHERE s.grp = ?', [grp]
        with self.lock:
            students = self.con.execute('SELECT s.id, s.name, s.grp, g.ord * 100 + s.idx, s.idx FROM student s JOIN grp g ON g.name = s.grp'
                                        + cond + ' ORDER BY g.ord, s.idx = 0, s.idx, s.name', args).fetchall()
            prog = {}
            for sid, lb, lv, px in self.con.execute("SELECT sid, lab, json_extract(data, '$.lv'), json_extract(data, '$.practice') FROM progress"):
                try:
                    prog[(sid, lb)] = {'lv': json.loads(lv or '{}'), 'practice': int(px or 0)}
                except (ValueError, TypeError):
                    pass
            for k, e in self.ev_progress().items():
                prog[k] = merge(prog.get(k), e)
            ev = self.con.execute("SELECT client, lab, type, ts, json_extract(data, '$.pts'), json_extract(data, '$.fails'), "
                                  "json_extract(data, '$.tAll'), json_extract(data, '$.ok') FROM ev WHERE client LIKE 's%' AND type != 'report' ORDER BY ts").fetchall()
            reps = self.con.execute('SELECT client, lab, ts, pts, done FROM report WHERE client LIKE \'s%\' ORDER BY id').fetchall()
        A = {}
        new = lambda: {'pts': None, 'trust': None, 'runs': 0, 'errors': 0, 'pxN': 0, 'pxFirst': 0, 'pxFails': 0, 'first': 0, 'last': 0,
                       'activeMs': 0, 'prev': 0, 'days': set(), 'rep': None, 'reps': 0}
        for client, lb, typ, ts, pts, fails, tall, ok in ev:
            a = A.setdefault((client, lb), new())
            if isinstance(pts, (int, float)) and typ in ('done', 'hb', 'hello', 'submit'):
                a['pts'] = max(a['pts'] or 0, pts)
            if isinstance(tall, (int, float)):
                a['trust'] = tall
            if typ == 'hb':                     # пульс идёт и от открытой, но брошенной вкладки — во время работы не входит
                continue
            a['first'] = a['first'] or ts
            a['last'] = ts
            if a['prev'] and ts - a['prev'] < 5 * 60000:
                a['activeMs'] += ts - a['prev']
            a['prev'] = ts
            a['days'].add(time.strftime('%Y-%m-%d', time.localtime(ts / 1000)))
            if typ == 'run':
                a['runs'] += 1
                a['errors'] += 0 if ok else 1
            elif typ == 'lint':
                a['runs'] += 1
                a['errors'] += 1
            elif typ == 'practice':
                a['pxN'] += 1
                a['pxFirst'] += 1 if not fails else 0
                a['pxFails'] += fails if isinstance(fails, int) else 0
        for client, lb, ts, pts, done in reps:
            a = A.setdefault((client, lb), new())
            a['rep'], a['reps'] = {'ts': ts, 'pts': pts, 'done': done}, a['reps'] + 1
        out = []
        for sid, name, g, seed, idx in students:
            labs = sorted({lb for (c, lb) in A if c == f's{sid}'} | {lb for (n, lb) in prog if n == sid})
            if lab:
                labs = [lab]
            for lb in labs or ['']:
                a = A.get((f's{sid}', lb)) or new()
                d = credit(lb, prog.get((sid, lb)) or {})
                lv = {k: r for k, r in (d.get('lv') or {}).items() if k != 'practice' and isinstance(r, dict) and r.get('done')}
                own = [r for r in lv.values() if not r.get('auto')]
                fails = [int(r.get('fails') or 0) for r in own]
                total = LEVELS.get(lb)
                pts = round(a['pts'], 1) if a['pts'] is not None else (a['rep'] or {}).get('pts')
                out.append({
                    'fio': name, 'grp': g, 'seed': seed, 'inList': bool(idx), 'lab': lb,
                    'done': min(len(lv), total or len(lv)), 'total': total, 'auto': len(lv) - len(own),
                    'final': bool((lv.get(FINAL.get(lb, 'final')) or {})) if total else None,
                    'stars': sum(3 if f == 0 else 2 if f <= 2 else 1 for f in fails), 'fails': sum(fails),
                    'pts': pts, 'mark': mark(pts) if total and pts is not None else '',
                    'practice': max(a['pxN'], int(d.get('practice') or 0)), 'pxFirst': a['pxFirst'], 'pxFails': a['pxFails'],
                    'trust': a['trust'], 'runs': a['runs'], 'errors': a['errors'],
                    'minutes': round(a['activeMs'] / 60000), 'days': len(a['days']), 'first': a['first'] or None, 'last': a['last'] or None,
                    'report': a['rep'], 'reports': a['reps'],
                })
        return out


class RateLimit:
    """Не больше N запросов в секунду с одного IP."""

    def __init__(self, per_sec):
        self.per_sec, self.win, self.lock = per_sec, {}, threading.Lock()

    def allow(self, ip):
        now = int(time.time())
        with self.lock:
            if len(self.win) > 5000:            # старые окна не копятся
                self.win = {k: v for k, v in self.win.items() if v[0] == now}
            w = self.win.get(ip)
            if not w or w[0] != now:
                self.win[ip] = [now, 1]
                return True
            w[1] += 1
            return w[1] <= self.per_sec


class Stats:
    """Счётчики для журнала состояния: запросы и ответы за окно (между строками состояния) и с запуска,
    кто из студентов сейчас работает, последние ошибки (их видно в пульте → «Сервер»)."""

    def __init__(self):
        self.lock = threading.Lock()
        self.started = now_ms()
        self.total = collections.Counter()
        self.win = collections.Counter()
        self.slowest = 0
        self.active = {}                    # client → время последнего события
        self.problems = collections.deque(maxlen=50)

    def hit(self, method, path, code, ms):
        kind = 'ok' if code < 400 else 'err4' if code < 500 else 'err5'
        with self.lock:
            for c in (self.total, self.win):
                c['req'] += 1
                c[kind] += 1
                if code == 429:
                    c['rate'] += 1
                if ms > SLOW_MS:
                    c['slow'] += 1
                if path == '/api/ev' and code == 200:
                    c['ev'] += 1
            self.slowest = max(self.slowest, ms)
        if ms > SLOW_MS:
            self.problem('slow', f'{method} {path} — {ms} мс')

    def seen(self, client):
        with self.lock:
            self.active[client] = now_ms()

    def problem(self, kind, text):
        with self.lock:
            self.problems.append({'ts': now_ms(), 'kind': kind, 'text': clip(text, 2000)})
        (LOG.error if kind == 'error' else LOG.warning)('%s: %s', kind, text)

    def snapshot(self, store, reset=False):
        """Текущее состояние: работают (по событиям за 2 и 15 минут), запросы за окно, база, память."""
        now = now_ms()
        with self.lock:
            self.active = {c: t for c, t in self.active.items() if now - t < 3600000}
            act2 = sum(1 for t in self.active.values() if now - t < 120000)
            act15 = sum(1 for t in self.active.values() if now - t < 900000)
            win, slowest = dict(self.win), self.slowest
            if reset:
                self.win, self.slowest = collections.Counter(), 0
        return {'now': now, 'uptimeMin': (now - self.started) // 60000, 'active2': act2, 'active15': act15,
                'req': win.get('req', 0), 'ev': win.get('ev', 0), 'err4': win.get('err4', 0), 'err5': win.get('err5', 0),
                'rate': win.get('rate', 0), 'slow': win.get('slow', 0), 'slowestMs': slowest,
                'dbMb': round(store.db_bytes() / 1048576, 1), 'memMb': mem_mb(), 'threads': threading.active_count()}


def mem_mb():
    try:
        with open('/proc/self/status') as f:
            return round(int(next(x for x in f if x.startswith('VmRSS:')).split()[1]) / 1024, 1)
    except (OSError, StopIteration, ValueError, IndexError):
        return None


def status_line(s):
    return (f"состояние: работают {s['active2']} (за 15 мин — {s['active15']}), запросов {s['req']}, событий {s['ev']}, "
            f"ошибок 4xx {s['err4']} / 5xx {s['err5']}, отказов по частоте {s['rate']}, медленных {s['slow']} "
            f"(самый долгий {s['slowestMs']} мс), база {s['dbMb']} МБ, память {s['memMb']} МБ, потоков {s['threads']}")


def monitor(store, stats, every_min, stop=None):
    """Раз в every_min минут — строка состояния в журнал (journalctl -u labsrv) и в таблицу health (график в пульте)."""
    stop = stop or threading.Event()
    while not stop.wait(every_min * 60):
        try:
            s = stats.snapshot(store, reset=True)
            LOG.info(status_line(s))
            store.add_health(s['now'], {k: v for k, v in s.items() if k != 'now'})
        except Exception:                   # журнал не должен ронять сервер
            LOG.exception('monitor')


# ═══════════════════════════════════════════════════════════════ HTTP ══
class Handler(BaseHTTPRequestHandler):
    server_version = 'labsrv/2'
    store = None          # задаются в make_server
    rate = None
    stats = None
    static_root = ''
    code = 0

    def log_message(self, *a):
        pass                  # обычный журнал запросов не пишем: его ведёт nginx; ошибки и состояние — через Stats

    def send_response(self, code, message=None):
        self.code = code
        super().send_response(code, message)

    def run(self, method, fn):
        """Выполнить обработчик: время, код ответа и необработанные исключения — в Stats и журнал."""
        t0 = time.monotonic()
        try:
            fn()
        except (BrokenPipeError, ConnectionResetError):
            pass                              # студент закрыл вкладку посреди ответа
        except Exception:
            self.stats.problem('error', f'{method} {urlparse(self.path).path}\n{traceback.format_exc()}')
            if not self.code:
                try:
                    self.send(500, {'err': 'server'})
                except OSError:
                    pass
        path = urlparse(self.path).path
        if path.startswith('/api/'):
            self.stats.hit(method, path, self.code or 500, int((time.monotonic() - t0) * 1000))

    # ── ответ и разбор запроса ──
    def send(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def ip(self):
        return self.headers.get('X-Real-IP') or self.client_address[0]

    def body(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0 or n > MAX_BODY:
            return None
        try:
            return json.loads(self.rfile.read(n).decode('utf-8'))
        except ValueError:
            return None

    def key_ok(self, q):
        return self.store.key_ok(self.headers.get('X-Labs-Key') or q.get('key'))

    def sid(self, q):
        return self.store.sid_from(self.headers.get('X-Labs-Token') or q.get('token'))

    # ── маршруты ──
    def do_GET(self):
        self.run('GET', self._get)

    def do_POST(self):
        self.run('POST', self._post)

    def _get(self):
        u = urlparse(self.path)
        q = {k: v[0] for k, v in parse_qs(u.query).items()}
        route = GET_ROUTES.get(u.path)
        if route:
            fn, admin = route
            if admin and not self.key_ok(q):
                return self.send(403, {'err': 'key'})
            return fn(self, q)
        if self.static_root and not u.path.startswith('/api/'):
            return self.static(u.path)
        return self.send(404, {'err': 'not found'})

    def _post(self):
        path = urlparse(self.path).path
        if not self.rate.allow(self.ip()):
            return self.send(429, {'err': 'rate'})
        e = self.body()
        if not isinstance(e, dict):
            return self.send(400, {'err': 'body'})
        route = POST_ROUTES.get(path)
        if not route:
            return self.send(404, {'err': 'not found'})
        fn, admin = route
        if admin and not self.key_ok({'key': e.get('key')}):
            return self.send(403, {'err': 'key'})
        return fn(self, e)

    # GET
    def ping(self, q):
        self.send(200, {'ok': True, 'auth': bool(self.store.key)})

    def get_groups(self, q):
        self.send(200, {'groups': self.store.groups()})

    def get_progress(self, q):
        sid = self.sid(q)
        if not sid:
            return self.send(403, {'err': 'token'})
        data, ts = self.store.progress(sid, q.get('lab', ''))
        self.send(200, {'data': data, 'ts': ts})

    def admin_groups(self, q):
        self.send(200, {'groups': self.store.admin_groups(), 'levels': LEVELS})

    def get_says(self, q):
        sid = self.sid(q)
        st = self.store.student(sid) if sid else None
        try:
            since = int(q.get('since', -1))
        except ValueError:
            since = -1
        last, items = self.store.says(since, st[1] if st else '', sid if st else None)
        self.send(200, {'last': last, 'items': items})

    def admin_says(self, q):
        self.send(200, {'items': self.store.recent_says()})

    @staticmethod
    def span(q, now):
        """Период из ?since=…&until=… (мс); по умолчанию — последние 6 часов."""
        def num(k, d):
            try:
                return int(q.get(k) or d)
            except ValueError:
                return d
        since = num('since', now - 6 * 3600 * 1000)
        return since, max(since, num('until', now + 1))

    def state(self, q):
        now = now_ms()
        since, until = self.span(q, now)
        # прошлый день считается «на его конец»: простой и «на уровне» — относительно until
        people = summarize(self.store.events(since, q.get('lab') or '', until), min(now, until), until >= now)
        self.send(200, {'now': now, 'since': since, 'until': until, 'levels': LEVELS, 'people': people})

    def log(self, q):
        now = now_ms()
        since, until = self.span(q, now)
        self.send(200, {'now': now, 'events': self.store.log(q.get('client', ''), since, until)})

    def admin_reports(self, q):
        now = now_ms()
        since, until = self.span(q, now) if q.get('since') else (0, None)
        self.send(200, {'items': self.store.reports(since, until, q.get('client', ''))})

    def admin_report(self, q):
        try:
            r = self.store.report(int(q.get('id') or 0))
        except ValueError:
            r = None
        self.send(200, r) if r else self.send(404, {'err': 'not found'})

    def admin_labels(self, q):
        self.send(200, {'labels': self.store.labels(q.get('client', ''), q.get('lab', ''))})

    def admin_traces(self, q):
        """JSONL для скачивания (пульт → «Данные набора»): ?since=мс&lab=lr15&sql=0"""
        try:
            since = int(q.get('since') or 0)
        except ValueError:
            since = 0
        lines = [json.dumps(r, ensure_ascii=False) for r in self.store.export_traces(since, q.get('lab') or '', q.get('sql') != '0')]
        body = ('\n'.join(lines) + ('\n' if lines else '')).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/x-ndjson; charset=utf-8')
        self.send_header('Content-Disposition', f'attachment; filename="traces-{time.strftime("%Y%m%d")}.jsonl"')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def admin_health(self, q):
        """Пульт → «Сервер»: состояние сейчас, строки состояния за сутки (или ?hours=…), последние ошибки."""
        try:
            hours = min(max(float(q.get('hours') or 24), 1), 24 * HEALTH_DAYS)
        except ValueError:
            hours = 24
        now = now_ms()
        with self.stats.lock:
            problems = list(self.stats.problems)[::-1]
            total = dict(self.stats.total)
        self.send(200, {'now': self.stats.snapshot(self.store), 'total': total, 'counts': self.store.counts(),
                        'history': self.store.health(now - int(hours * 3600000)), 'problems': problems, 'everyMin': STATUS_MIN})

    RESULT_COLS = [   # (ключ, заголовок) — длинная выгрузка: строка — студент × лаба
        ('grp', 'Группа'), ('fio', 'ФИО'), ('seed', 'Вариант'), ('lab', 'Лаба'),
        ('done', 'Уровней пройдено'), ('total', 'Уровней всего'), ('auto', 'Зачтено автоматически'), ('final', 'Контрольный пройден'),
        ('stars', 'Звёзды'), ('fails', 'Промахов на уровнях'), ('pts', 'Баллы за уровни (из 9)'), ('mark', 'Оценка по баллам'),
        ('practice', 'Тренировка: решено'), ('pxFirst', 'Тренировка: с первой попытки'), ('pxFails', 'Тренировка: промахов'),
        ('trust', 'Доверие, %'), ('runs', 'Команд'), ('errors', 'Из них с ошибкой'), ('minutes', 'Время работы, мин'), ('days', 'Дней работы'),
        ('first', 'Начал'), ('last', 'Последнее действие'), ('repTs', 'Отчёт отправлен'), ('repPts', 'Баллы в отчёте'), ('reports', 'Отправок отчёта'),
        ('inList', 'В списке группы'),
    ]
    WIDE = [('done', 'уровней'), ('stars', 'звёзд'), ('pts', 'баллы'), ('mark', 'оценка'), ('practice', '∞ решено'), ('trust', 'доверие'), ('repPts', 'отчёт')]

    @staticmethod
    def cell(k, v):
        if v is None or v == '':
            return ''
        if isinstance(v, bool):
            return 'да' if v else 'нет'
        if k in ('first', 'last', 'repTs'):
            return time.strftime('%Y-%m-%d %H:%M', time.localtime(v / 1000))
        if k == 'lab':
            return 'ЛР-' + v[2:].replace('t', ' тетрадь') if v.startswith('lr') else v
        if isinstance(v, float):
            return f'{v:g}'.replace('.', ',')      # Excel с русскими настройками ждёт запятую
        return v

    def admin_results(self, q):
        """Выгрузка итогов: ?grp=…&lab=…&view=long|wide&fmt=csv|json. CSV — для Excel: «;», UTF-8 с BOM."""
        rows = self.store.results(clip(q.get('grp'), 20), clip(q.get('lab'), 10))
        for r in rows:
            rep = r.pop('report') or {}
            r['repTs'], r['repPts'] = rep.get('ts'), rep.get('pts')
        if q.get('fmt') == 'json':
            return self.send(200, {'rows': rows, 'levels': LEVELS})
        buf = io.StringIO()
        w = csv.writer(buf, delimiter=';', lineterminator='\r\n')
        if q.get('view') == 'wide':             # строка — студент, по столбцу на каждую лабу
            labs = sorted({r['lab'] for r in rows if r['lab']}, key=lambda x: (int(re.sub(r'\D', '', x) or 0), x))
            w.writerow(['Группа', 'ФИО', 'Вариант'] + [f'{self.cell("lab", lb)}: {t}' for lb in labs for _, t in self.WIDE])
            people = {}
            for r in rows:
                people.setdefault((r['grp'], r['fio'], r['seed']), {})[r['lab']] = r
            for (g, fio, seed), by in people.items():
                w.writerow([g, fio, seed] + [self.cell(k, (by.get(lb) or {}).get(k)) for lb in labs for k, _ in self.WIDE])
        else:
            w.writerow([t for _, t in self.RESULT_COLS])
            for r in rows:
                w.writerow([self.cell(k, r.get(k)) for k, _ in self.RESULT_COLS])
        body = ('﻿' + buf.getvalue()).encode('utf-8')
        name = '-'.join(x for x in ('results', q.get('grp') or '', q.get('lab') or '', time.strftime('%Y%m%d')) if x)
        self.send_response(200)
        self.send_header('Content-Type', 'text/csv; charset=utf-8')
        self.send_header('Content-Disposition', f"attachment; filename=\"results.csv\"; filename*=UTF-8''{quote(name)}.csv")
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    # POST
    def admin_label(self, e):
        try:
            lv = int(e.get('lv') or 0)
        except (TypeError, ValueError):
            return self.send(400, {'err': 'lv'})
        client, lab = clip(e.get('client'), 40), clip(e.get('lab'), 10)
        if not client or not lab:
            return self.send(400, {'err': 'client'})
        self.store.set_label(client, lab, lv, e.get('val'))
        self.send(200, {'labels': self.store.labels(client, lab)})

    def closed(self, lab):
        return lab in GATED and not self.store.labs_open().get(lab)

    def ev(self, e):
        if self.closed(e.get('lab')):
            return self.send(403, {'err': 'closed'})
        typ = e.get('type')
        if typ not in TYPES or not e.get('client'):
            return self.send(400, {'err': 'type'})
        seed = e.get('seed') if isinstance(e.get('seed'), int) else None
        client, fio, grp = e['client'], e.get('fio'), e.get('grp')
        sid = self.sid(e)
        if sid:                                 # кто это — знает сервер, а не страница
            st = self.store.student(sid)
            if not st:
                return self.send(403, {'err': 'token'})
            fio, grp, seed = st
            client = f's{sid}'
        elif self.store.has_groups():           # есть списки групп — события только от вошедших
            return self.send(403, {'err': 'token'})
        # событие, досланное после обрыва связи, — со своим временем: age — сколько оно ждало в очереди у студента
        age = e.get('age') if isinstance(e.get('age'), int) and not isinstance(e.get('age'), bool) else 0
        ts = now_ms() - min(max(age, 0), MAX_AGE)
        self.stats.seen(client)
        if typ == 'trace':                      # сырые данные набора — отдельно, в сводку и журнал пульта не идут
            self.store.add_trace(ts, client, e.get('lab'), grp, e.get('data'))
        else:
            self.store.add_event(ts, client, e.get('lab'), fio, grp, seed, typ, e.get('data'), self.ip())
        self.send(200, {'ok': True})

    def login(self, e):
        pin = str(e.get('pin') or '')
        if not re.fullmatch(r'\d{4}', pin):
            return self.send(400, {'err': 'PIN — ровно 4 цифры'})
        dev = clip(e.get('dev'), 40)
        # входят только по группе и фамилии: по номеру нельзя — номера идут подряд, и чужой ещё не занятый аккаунт нашёлся бы перебором
        sid, err = self.store.find(clip(e.get('grp'), 20), clip(e.get('name'), 60), dev, self.ip())
        if err:
            return self.send(*err)
        code, r = self.store.login(sid, pin, dev, self.ip())
        if 'закрыт' in str(r.get('err', '')):
            self.stats.problem('pin', f'вход закрыт на 10 минут: студент № {sid}, IP {self.ip()}')
        self.send(code, r)

    def post_progress(self, e):
        sid = self.sid(e)
        lab = clip(e.get('lab'), 10)
        if self.closed(lab):
            return self.send(403, {'err': 'closed'})
        if not sid or not lab or not isinstance(e.get('data'), dict):
            return self.send(403, {'err': 'token'})
        self.store.save_progress(sid, lab, e['data'])
        # без самого прогресса в ответе: с журналом он дорастает до сотен КБ на каждое сохранение,
        # и через полчаса пары канал сервера не успевал — у студентов «нет связи»
        self.send(200, {'ok': True})

    def post_report(self, e):
        html, lab = e.get('html'), clip(e.get('lab'), 10)
        if not isinstance(html, str) or not html.strip() or lab not in REPORT_LABS:
            return self.send(400, {'err': 'html'})
        if self.closed(lab):
            return self.send(403, {'err': 'Лаба ещё закрыта'})
        if len(html) > MAX_REPORT:
            return self.send(413, {'err': 'Отчёт слишком большой'})
        seed = e.get('seed') if isinstance(e.get('seed'), int) else None
        client, fio, grp = clip(e.get('client'), 40), clip(e.get('fio'), 60), clip(e.get('grp'), 20)
        sid = self.sid(e)
        if sid:
            st = self.store.student(sid)
            if not st:
                return self.send(403, {'err': 'token'})
            fio, grp, seed = st
            client = f's{sid}'
        elif self.store.has_groups() or not client:
            return self.send(403, {'err': 'token'})
        try:
            pts, done = float(e.get('pts') or 0), int(e.get('done') or 0)
        except (TypeError, ValueError):
            pts, done = 0.0, 0
        rid = self.store.add_report(client, lab, fio, grp, seed, pts, done, html)
        self.store.add_event(now_ms(), client, lab, fio, grp, seed, 'report', {'id': rid, 'pts': pts, 'done': done}, self.ip())
        self.send(200, {'id': rid})

    def admin_group(self, e):
        name = clip(e.get('name'), 20).strip()
        if not name:
            return self.send(400, {'err': 'name'})
        err = self.store.save_group(name, [clip(x, 60).strip() for x in (e.get('names') or []) if str(x).strip()], clip(e.get('old'), 20).strip())
        if err:
            return self.send(409, {'err': err})
        self.send(200, {'ok': True})

    def admin_say(self, e):
        text = clip(e.get('text'), 300).strip()
        if not text:
            return self.send(400, {'err': 'text'})
        try:
            sid = int(e.get('sid') or 0) or None
        except (TypeError, ValueError):
            sid = None
        self.send(200, {'id': self.store.add_say('' if sid else clip(e.get('grp'), 20), text, 'normal', sid)})

    def get_labs(self, q):
        self.send(200, {'open': self.store.labs_open(), 'gated': list(GATED)})

    def admin_labs(self, e):
        lab = clip(e.get('lab'), 10)
        if lab not in GATED:
            return self.send(400, {'err': 'lab'})
        self.store.set_lab_open(lab, bool(e.get('open')))
        self.send(200, {'open': self.store.labs_open()})

    def admin_resetpin(self, e):
        self.store.reset_pin(int(e.get('id') or 0))
        self.send(200, {'ok': True})

    def admin_showpin(self, e):
        pin = self.store.show_pin(int(e.get('id') or 0))
        if pin is None:
            return self.send(404, {'err': 'PIN ещё не задан'})
        self.send(200, {'pin': pin})

    def admin_delgroup(self, e):
        self.store.delete_group(clip(e.get('name'), 20))
        self.send(200, {'ok': True})

    # только для проверки без nginx
    def static(self, path):
        root = os.path.realpath(self.static_root)
        f = os.path.realpath(os.path.join(root, path.lstrip('/')))
        if os.path.isdir(f):
            f = os.path.join(f, 'index.html')
        if not (f == root or f.startswith(root + os.sep)) or not os.path.isfile(f):
            return self.send(404, {'err': 'not found'})
        with open(f, 'rb') as fh:
            body = fh.read()
        ctype = 'application/wasm' if f.endswith('.wasm') else mimetypes.guess_type(f)[0] or 'application/octet-stream'
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


# путь → (обработчик, нужен ли ключ преподавателя)
GET_ROUTES = {
    '/api/ping': (Handler.ping, False),
    '/api/groups': (Handler.get_groups, False),
    '/api/progress': (Handler.get_progress, False),
    '/api/admin/groups': (Handler.admin_groups, True),
    '/api/say': (Handler.get_says, False),
    '/api/admin/says': (Handler.admin_says, True),
    '/api/state': (Handler.state, True),
    '/api/log': (Handler.log, True),
    '/api/admin/reports': (Handler.admin_reports, True),
    '/api/labs': (Handler.get_labs, False),
    '/api/admin/report': (Handler.admin_report, True),
    '/api/admin/labels': (Handler.admin_labels, True),
    '/api/admin/traces': (Handler.admin_traces, True),
    '/api/admin/health': (Handler.admin_health, True),
    '/api/admin/results': (Handler.admin_results, True),
}
POST_ROUTES = {
    '/api/ev': (Handler.ev, False),
    '/api/login': (Handler.login, False),
    '/api/progress': (Handler.post_progress, False),
    '/api/report': (Handler.post_report, False),
    '/api/admin/group': (Handler.admin_group, True),
    '/api/admin/resetpin': (Handler.admin_resetpin, True),
    '/api/admin/showpin': (Handler.admin_showpin, True),
    '/api/admin/say': (Handler.admin_say, True),
    '/api/admin/delgroup': (Handler.admin_delgroup, True),
    '/api/admin/labs': (Handler.admin_labs, True),
    '/api/admin/label': (Handler.admin_label, True),
}


class Server(ThreadingHTTPServer):
    request_queue_size = 128     # по умолчанию 5: группа, разом приславшая события, получала отказ в подключении (у nginx — 502)
    daemon_threads = True


def make_server(port=PORT, db=DB, key=KEY, static=STATIC, host='127.0.0.1', status_min=0):
    """status_min > 0 — раз в столько минут строка состояния в журнал и в таблицу health."""
    store, stats = Store(db, key), Stats()
    h = type('H', (Handler,), {'store': store, 'rate': RateLimit(RATE_PER_SEC), 'stats': stats, 'static_root': static})
    srv = Server((host, port), h)
    srv.stats = stats
    if status_min > 0:
        threading.Thread(target=monitor, args=(store, stats, status_min), daemon=True).start()
    return srv


if __name__ == '__main__':
    # в systemd строки уходят в journald: journalctl -u labsrv (время ставит сам journald)
    logging.basicConfig(level=logging.INFO, format='%(levelname)s %(message)s')
    if not KEY:
        LOG.warning('не задан LABS_KEY — панель преподавателя будет недоступна')
    srv = make_server(status_min=STATUS_MIN)
    c = srv.RequestHandlerClass.store.counts()
    LOG.info('labsrv запущен: 127.0.0.1:%s, база %s (%s МБ), студентов %s, событий %s, отчётов %s, строка состояния — раз в %s мин',
             PORT, DB, round(srv.RequestHandlerClass.store.db_bytes() / 1048576, 1), c['students'], c['events'], c['reports'], STATUS_MIN)
    srv.serve_forever()
