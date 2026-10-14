#!/usr/bin/env python3
"""Сервер событий лабораторных ОПЦ.07.

Студентские страницы шлют события (запуск команды, ошибка, уровень пройден, ушёл со вкладки…),
хранят прогресс (можно начать на паре и закончить дома), студенты входят по группе и PIN.
Преподавательская панель /teacher/ получает сводку и ведёт списки групп.
Только стандартная библиотека Python, база — SQLite.

Запуск:  LABS_KEY=секрет python3 labsrv.py
Слушает 127.0.0.1:8090 (снаружи доступен только через nginx: location /api/).

Ключ преподавателя и токен студента передаются в заголовках X-Labs-Key и X-Labs-Token
(чтобы не попадать в журналы nginx). Старый способ — параметром в адресе — тоже принимается.
"""
import hashlib
import hmac
import json
import mimetypes
import os
import re
import sqlite3
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

KEY = os.environ.get('LABS_KEY', '')
PORT = int(os.environ.get('LABS_PORT', '8090'))
DB = os.environ.get('LABS_DB', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'labs.db'))
STATIC = os.environ.get('LABS_STATIC', '')  # только для проверки без nginx: раздавать файлы лаб самому

TYPES = {'hello', 'level', 'run', 'lint', 'rollback', 'done', 'paste', 'away', 'submit', 'hb', 'shot'}
LEVELS = {'lr13': 12, 'lr14': 12}           # число уровней в лабе — для панели преподавателя
MAX_BODY = 400000
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
CREATE TABLE IF NOT EXISTS grp (name TEXT PRIMARY KEY, ord INTEGER);
CREATE TABLE IF NOT EXISTS student (
  id INTEGER PRIMARY KEY, grp TEXT, name TEXT, idx INTEGER, pin TEXT, fails INTEGER DEFAULT 0, lock_until INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS progress (sid INTEGER, lab TEXT, data TEXT, ts INTEGER, PRIMARY KEY (sid, lab));
'''


def now_ms():
    return int(time.time() * 1000)


def clip(v, n):
    return str(v or '')[:n]


def short(name):
    w = str(name).split()
    return w[0] + (' ' + w[1][0] + '.' if len(w) > 1 else '')


# ═══════════════════════════════════════════════════════════ прогресс ══
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
    for k in ('lints', 'away', 'awayMs', 'pastes', 'cur'):
        out[k] = max(a.get(k) or 0, b.get(k) or 0)
    out['fio'] = b.get('fio') or a.get('fio') or ''
    return out


# ═══════════════════════════════════════════════════ сводка для панели ══
def _person(ts, client, lab, fio, grp, seed):
    return {'client': client, 'lab': lab, 'fio': fio, 'grp': grp, 'seed': seed, 'first': ts, 'last': ts,
            'lv': 1, 'lvSince': ts, 'done': [], 'pts': 0, 'runs': 0, 'errors': 0, 'lints': 0, 'lvErrors': 0,
            'lastErr': '', 'lastErrTs': 0, 'lastSql': '', 'away': 0, 'awayMs': 0, 'pastes': 0, 'shots': 0, 'submit': None,
            'hidden': False, 'stars': {}, 'doneN': 0}


def _error(p, d, ts, lv, text):
    if lv == p['lv']:
        p['lvErrors'] += 1
    p['lastErr'] = clip(text, 300)
    p['lastErrTs'] = ts


def summarize(rows, now):
    """Сводка по каждому студенту (client) из событий за выбранный период."""
    people = {}
    for (ts, client, lab, fio, grp, seed, typ, data) in rows:
        try:
            d = json.loads(data or '{}')
        except ValueError:
            d = {}
        p = people.setdefault(client, _person(ts, client, lab, fio, grp, seed))
        p['last'] = max(p['last'], ts)
        p['lab'], p['fio'], p['grp'] = lab or p['lab'], fio or p['fio'], grp or p['grp']
        if seed is not None:
            p['seed'] = seed
        lv = d.get('lv')
        if typ in ('level', 'hello', 'hb') and lv and lv != p['lv']:
            p['lv'], p['lvSince'], p['lvErrors'] = lv, ts, 0
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
            p['pts'] = max(p['pts'], d.get('pts') or 0)
        elif typ == 'paste':
            p['pastes'] += 1
        elif typ == 'shot':                    # нажат Print Screen
            p['shots'] += 1
        elif typ == 'away':
            p['away'] += 1
            p['awayMs'] += int(d.get('ms') or 0)
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
        p['idle'] = now - p['last']
        p['onLevel'] = now - p['lvSince']
        p['total'] = LEVELS.get(p['lab'], 12)
        reasons = []
        if not p['submit']:
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
        self.lock = threading.Lock()
        self.con = sqlite3.connect(path, check_same_thread=False)
        self.con.execute('PRAGMA journal_mode=WAL')
        self.con.executescript(SCHEMA)
        if 'pin_dev' not in [r[1] for r in self.con.execute('PRAGMA table_info(student)')]:
            self.con.execute('ALTER TABLE student ADD COLUMN pin_dev TEXT')     # с какого устройства задан PIN
        self.con.commit()
        self.claims = {}                    # устройство → (время, номер студента) последнего первого входа
        self.fails = {}                     # 'd:устройство' / 'i:IP' → времена неверных PIN

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
        return bool(self.key) and hmac.compare_digest(str(key or ''), self.key)

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

    def roster(self, grp):
        with self.lock:
            rows = self.con.execute('SELECT id, name, pin IS NOT NULL FROM student WHERE grp = ? AND idx > 0 ORDER BY name', (grp,)).fetchall()
        return [{'id': r[0], 'name': short(r[1]), 'pin': bool(r[2])} for r in rows]

    def _recent_fails(self, key, now):
        ts = [t for t in self.fails.get(key, []) if now - t < FAIL_WINDOW_MS]
        self.fails[key] = ts
        return len(ts)

    def login(self, sid, pin, dev='', ip=''):
        """→ (код ответа, тело). dev — номер устройства (браузера), ip — адрес."""
        now = now_ms()
        with self.lock:
            if (dev and self._recent_fails('d:' + dev, now) >= FAILS_PER_DEVICE) or (ip and self._recent_fails('i:' + ip, now) >= FAILS_PER_IP):
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
                for k in (['d:' + dev] if dev else []) + (['i:' + ip] if ip else []):
                    self.fails.setdefault(k, []).append(now)
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

    def events(self, since, lab=''):
        sql, args = 'SELECT ts, client, lab, fio, grp, seed, type, data FROM ev WHERE ts >= ?', [since]
        if lab:
            sql += ' AND lab = ?'
            args.append(lab)
        with self.lock:
            return self.con.execute(sql + ' ORDER BY ts', args).fetchall()

    def log(self, client, since):
        with self.lock:
            rows = self.con.execute('SELECT ts, type, data FROM ev WHERE client = ? AND ts >= ? ORDER BY ts', (client, since)).fetchall()
        return [{'ts': r[0], 'type': r[1], 'data': json.loads(r[2] or '{}')} for r in rows if r[1] != 'hb']

    # ── прогресс ──
    def progress(self, sid, lab):
        with self.lock:
            r = self.con.execute('SELECT data, ts FROM progress WHERE sid = ? AND lab = ?', (sid, lab)).fetchone()
        return (json.loads(r[0]), r[1]) if r else (None, 0)

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
            done = {}
            for sid, lab, data in self.con.execute('SELECT sid, lab, data FROM progress'):
                d = json.loads(data)
                done.setdefault(sid, {})[lab] = sum(1 for r in (d.get('lv') or {}).values() if r.get('done'))
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

    def save_group(self, name, names):
        """Сохранить список. Порядок строк задаёт варианты; PIN и прогресс оставшихся сохраняются."""
        with self.lock:
            con = self.con
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


# ═══════════════════════════════════════════════════════════════ HTTP ══
class Handler(BaseHTTPRequestHandler):
    server_version = 'labsrv/2'
    store = None          # задаются в make_server
    rate = None
    static_root = ''

    def log_message(self, *a):
        pass

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

    def do_POST(self):
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

    def get_roster(self, q):
        self.send(200, {'students': self.store.roster(q.get('grp', ''))})

    def get_progress(self, q):
        sid = self.sid(q)
        if not sid:
            return self.send(403, {'err': 'token'})
        data, ts = self.store.progress(sid, q.get('lab', ''))
        self.send(200, {'data': data, 'ts': ts})

    def admin_groups(self, q):
        self.send(200, {'groups': self.store.admin_groups(), 'levels': LEVELS})

    def state(self, q):
        now = now_ms()
        since = int(q.get('since') or now - 6 * 3600 * 1000)
        self.send(200, {'now': now, 'since': since, 'levels': LEVELS, 'people': summarize(self.store.events(since, q.get('lab') or ''), now)})

    def log(self, q):
        now = now_ms()
        self.send(200, {'now': now, 'events': self.store.log(q.get('client', ''), int(q.get('since') or now - 6 * 3600 * 1000))})

    # POST
    def ev(self, e):
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
        self.store.add_event(now_ms(), client, e.get('lab'), fio, grp, seed, typ, e.get('data'), self.ip())
        self.send(200, {'ok': True})

    def login(self, e):
        pin = str(e.get('pin') or '')
        if not re.fullmatch(r'\d{4}', pin):
            return self.send(400, {'err': 'PIN — ровно 4 цифры'})
        try:
            sid = int(e.get('id') or 0)
        except (TypeError, ValueError):
            sid = 0
        self.send(*self.store.login(sid, pin, clip(e.get('dev'), 40), self.ip()))

    def post_progress(self, e):
        sid = self.sid(e)
        lab = clip(e.get('lab'), 10)
        if not sid or not lab or not isinstance(e.get('data'), dict):
            return self.send(403, {'err': 'token'})
        self.send(200, {'data': self.store.save_progress(sid, lab, e['data'])})

    def admin_group(self, e):
        name = clip(e.get('name'), 20).strip()
        if not name:
            return self.send(400, {'err': 'name'})
        self.store.save_group(name, [clip(x, 60).strip() for x in (e.get('names') or []) if str(x).strip()])
        self.send(200, {'ok': True})

    def admin_resetpin(self, e):
        self.store.reset_pin(int(e.get('id') or 0))
        self.send(200, {'ok': True})

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
    '/api/roster': (Handler.get_roster, False),
    '/api/progress': (Handler.get_progress, False),
    '/api/admin/groups': (Handler.admin_groups, True),
    '/api/state': (Handler.state, True),
    '/api/log': (Handler.log, True),
}
POST_ROUTES = {
    '/api/ev': (Handler.ev, False),
    '/api/login': (Handler.login, False),
    '/api/progress': (Handler.post_progress, False),
    '/api/admin/group': (Handler.admin_group, True),
    '/api/admin/resetpin': (Handler.admin_resetpin, True),
    '/api/admin/delgroup': (Handler.admin_delgroup, True),
}


def make_server(port=PORT, db=DB, key=KEY, static=STATIC, host='127.0.0.1'):
    h = type('H', (Handler,), {'store': Store(db, key), 'rate': RateLimit(RATE_PER_SEC), 'static_root': static})
    return ThreadingHTTPServer((host, port), h)


if __name__ == '__main__':
    if not KEY:
        print('ВНИМАНИЕ: не задан LABS_KEY — панель преподавателя будет недоступна')
    print(f'labsrv: 127.0.0.1:{PORT}, база {DB}')
    make_server().serve_forever()
