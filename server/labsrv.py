#!/usr/bin/env python3
"""Сервер событий лабораторных ОПЦ.07.

Студентские страницы шлют события (запуск команды, ошибка, уровень пройден, ушёл со вкладки…),
хранят прогресс (можно начать на паре и закончить дома), студенты входят по группе и PIN.
Преподавательская панель /teacher/ получает сводку и ведёт списки групп.
Только стандартная библиотека Python, база — SQLite.

Запуск:  LABS_KEY=секрет python3 labsrv.py
Слушает 127.0.0.1:8090 (снаружи доступен только через nginx: location /api/).
"""
import hashlib
import hmac
import json
import re
import os
import sqlite3
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

KEY = os.environ.get('LABS_KEY', '')
PORT = int(os.environ.get('LABS_PORT', '8090'))
DB = os.environ.get('LABS_DB', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'labs.db'))
STATIC = os.environ.get('LABS_STATIC', '')  # только для проверки без nginx: раздавать файлы лаб самому
TYPES = {'hello', 'level', 'run', 'lint', 'done', 'paste', 'away', 'submit', 'hb'}
LEVELS = {'lr13': 12, 'lr14': 12}

lock = threading.Lock()
con = sqlite3.connect(DB, check_same_thread=False)
con.execute('PRAGMA journal_mode=WAL')
con.execute('''CREATE TABLE IF NOT EXISTS ev (
  id INTEGER PRIMARY KEY, ts INTEGER, client TEXT, lab TEXT, fio TEXT, grp TEXT, seed INTEGER, type TEXT, data TEXT, ip TEXT)''')
con.execute('CREATE INDEX IF NOT EXISTS ev_ts ON ev(ts)')
con.execute('CREATE INDEX IF NOT EXISTS ev_client ON ev(client, ts)')
con.execute('CREATE TABLE IF NOT EXISTS grp (name TEXT PRIMARY KEY, ord INTEGER)')
con.execute('''CREATE TABLE IF NOT EXISTS student (
  id INTEGER PRIMARY KEY, grp TEXT, name TEXT, idx INTEGER, pin TEXT, fails INTEGER DEFAULT 0, lock_until INTEGER DEFAULT 0)''')
con.execute('CREATE TABLE IF NOT EXISTS progress (sid INTEGER, lab TEXT, data TEXT, ts INTEGER, PRIMARY KEY (sid, lab))')
con.commit()

rate = {}  # ip -> [окно, счётчик]


def allowed(ip):
    now = int(time.time())
    w = rate.get(ip)
    if not w or w[0] != now:
        rate[ip] = [now, 1]
        return True
    w[1] += 1
    return w[1] <= 200  # вся группа может сидеть за одним IP колледжа


def clip(v, n):
    return str(v or '')[:n]


def pin_hash(sid, pin):
    return hashlib.sha256(f'{sid}:{pin}:{KEY}'.encode()).hexdigest()


def token_for(sid):
    return f"{sid}.{hmac.new(KEY.encode(), str(sid).encode(), 'sha256').hexdigest()[:24]}"


def sid_from(token):
    try:
        sid = int(str(token).split('.', 1)[0])
    except ValueError:
        return None
    return sid if KEY and hmac.compare_digest(token_for(sid), str(token)) else None


def short(name):
    w = str(name).split()
    return w[0] + (' ' + w[1][0] + '.' if len(w) > 1 else '')


def merge(a, b):
    """Объединить прогресс с двух устройств: пройденные уровни не теряются ни с одной стороны."""
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
    seen = {(e.get('t'), e.get('q')) for e in ja if isinstance(e, dict)}
    out['journal'] = (ja + [e for e in (b.get('journal') or []) if isinstance(e, dict) and (e.get('t'), e.get('q')) not in seen])[-800:]
    ans = dict(a.get('answers') or {})
    for k, v in (b.get('answers') or {}).items():
        if v and len(str(v)) >= len(str(ans.get(k) or '')):
            ans[k] = v
    out['answers'] = ans
    for k in ('lints', 'away', 'awayMs', 'pastes', 'cur'):
        out[k] = max(a.get(k) or 0, b.get(k) or 0)
    out['fio'] = b.get('fio') or a.get('fio') or ''
    return out


def summarize(rows, now):
    """Сводка по каждому студенту (client) из событий за выбранный период."""
    people = {}
    for (ts, client, lab, fio, grp, seed, typ, data) in rows:
        try:
            d = json.loads(data or '{}')
        except ValueError:
            d = {}
        p = people.setdefault(client, {
            'client': client, 'lab': lab, 'fio': fio, 'grp': grp, 'seed': seed, 'first': ts, 'last': ts,
            'lv': 1, 'lvSince': ts, 'done': [], 'pts': 0, 'runs': 0, 'errors': 0, 'lints': 0, 'lvErrors': 0,
            'lastErr': '', 'lastErrTs': 0, 'lastSql': '', 'away': 0, 'awayMs': 0, 'pastes': 0, 'submit': None,
            'hidden': False, 'stars': {}})
        p['last'] = max(p['last'], ts)
        p['lab'], p['fio'], p['grp'], p['seed'] = lab or p['lab'], fio or p['fio'], grp or p['grp'], seed if seed is not None else p['seed']
        lv = d.get('lv')
        if typ == 'level' and lv:
            if lv != p['lv']:
                p['lv'], p['lvSince'], p['lvErrors'] = lv, ts, 0
        elif typ == 'run':
            p['runs'] += 1
            p['lastSql'] = clip(d.get('sql'), 600)
            if not d.get('ok'):
                p['errors'] += 1
                if lv == p['lv']:
                    p['lvErrors'] += 1
                p['lastErr'] = clip(d.get('txt') or d.get('out'), 300)
                p['lastErrTs'] = ts
        elif typ == 'lint':
            p['lints'] += 1
            if lv == p['lv']:
                p['lvErrors'] += 1
            p['lastErr'] = clip(d.get('msg'), 300)
            p['lastErrTs'] = ts
            p['lastSql'] = clip(d.get('sql'), 600)
        elif typ == 'done':
            k = d.get('key')
            if k and k not in p['done']:
                p['done'].append(k)
            if lv:
                p['stars'][str(lv)] = d.get('stars', 0)
            p['pts'] = max(p['pts'], d.get('pts') or 0)
        elif typ == 'paste':
            p['pastes'] += 1
        elif typ == 'away':
            p['away'] += 1
            p['awayMs'] += int(d.get('ms') or 0)
        elif typ == 'submit':
            p['submit'] = {'ts': ts, 'pts': d.get('pts'), 'done': d.get('done')}
        if typ in ('hb', 'hello'):
            p['pts'] = max(p['pts'], d.get('pts') or 0)
            p['doneN'] = max(p.get('doneN', 0), d.get('done') or 0)
            if typ == 'hb':
                p['hidden'] = bool(d.get('hidden'))
            if lv and lv != p['lv']:
                p['lv'], p['lvSince'], p['lvErrors'] = lv, ts, 0
    out = []
    for p in people.values():
        p['doneN'] = max(p.get('doneN', 0), len(p['done']))
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


class H(BaseHTTPRequestHandler):
    server_version = 'labsrv/1'

    def log_message(self, *a):
        pass

    def send(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def static(self, path):
        import mimetypes
        root = os.path.realpath(STATIC)
        f = os.path.realpath(os.path.join(root, path.lstrip('/')))
        if os.path.isdir(f):
            f = os.path.join(f, 'index.html')
        if not f.startswith(root) or not os.path.isfile(f):
            return self.send(404, {'err': 'not found'})
        body = open(f, 'rb').read()
        ctype = 'application/wasm' if f.endswith('.wasm') else mimetypes.guess_type(f)[0] or 'application/octet-stream'
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def ip(self):
        return self.headers.get('X-Real-IP') or self.client_address[0]

    def body(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0 or n > 400000:
            return None
        try:
            return json.loads(self.rfile.read(n).decode('utf-8'))
        except ValueError:
            return None

    def do_POST(self):
        path = urlparse(self.path).path
        if not allowed(self.ip()):
            return self.send(429, {'err': 'rate'})
        e = self.body()
        if e is None:
            return self.send(400, {'err': 'body'})
        if path == '/api/ev':
            return self.ev(e)
        if path == '/api/login':
            return self.login(e)
        if path == '/api/progress':
            return self.save_progress(e)
        if path.startswith('/api/admin/'):
            if not KEY or e.get('key') != KEY:
                return self.send(403, {'err': 'key'})
            return self.admin(path[11:], e)
        return self.send(404, {'err': 'not found'})

    def ev(self, e):
        typ = e.get('type')
        if typ not in TYPES or not e.get('client'):
            return self.send(400, {'err': 'type'})
        seed = e.get('seed')
        seed = seed if isinstance(seed, int) else None
        with lock:
            con.execute('INSERT INTO ev (ts, client, lab, fio, grp, seed, type, data, ip) VALUES (?,?,?,?,?,?,?,?,?)',
                        (int(time.time() * 1000), clip(e['client'], 40), clip(e.get('lab'), 10), clip(e.get('fio'), 60),
                         clip(e.get('grp'), 20), seed, typ, json.dumps(e.get('data') or {}, ensure_ascii=False)[:4000], self.ip()))
            con.commit()
        self.send(200, {'ok': True})

    def login(self, e):
        pin = str(e.get('pin') or '')
        if not re.fullmatch(r'\d{4}', pin):
            return self.send(400, {'err': 'PIN — ровно 4 цифры'})
        now = int(time.time() * 1000)
        with lock:
            r = con.execute('SELECT s.id, s.grp, s.name, s.idx, s.pin, s.fails, s.lock_until, g.ord FROM student s JOIN grp g ON g.name = s.grp WHERE s.id = ?', (int(e.get('id') or 0),)).fetchone()
            if not r or not r[3]:
                return self.send(404, {'err': 'Нет такого студента в списке группы'})
            sid, grp, name, idx, ph, fails, lock_until, ord_ = r
            if lock_until and lock_until > now:
                return self.send(429, {'err': f'Слишком много неверных PIN. Подождите {max(1, (lock_until - now) // 60000)} мин или попросите преподавателя сбросить PIN.'})
            first = not ph
            if first:
                con.execute('UPDATE student SET pin = ?, fails = 0 WHERE id = ?', (pin_hash(sid, pin), sid))
            elif not hmac.compare_digest(ph, pin_hash(sid, pin)):
                fails = (fails or 0) + 1
                con.execute('UPDATE student SET fails = ?, lock_until = ? WHERE id = ?', (0 if fails >= 8 else fails, now + 600000 if fails >= 8 else 0, sid))
                con.commit()
                return self.send(403, {'err': 'Неверный PIN' + (' — вход закрыт на 10 минут' if fails >= 8 else f' (осталось попыток: {8 - fails})')})
            else:
                con.execute('UPDATE student SET fails = 0 WHERE id = ?', (sid,))
            con.commit()
        self.send(200, {'token': token_for(sid), 'sid': sid, 'fio': name, 'grp': grp, 'seed': ord_ * 100 + idx, 'idx': idx, 'first': first})

    def save_progress(self, e):
        sid = sid_from(e.get('token'))
        lab = clip(e.get('lab'), 10)
        if not sid or not lab or not isinstance(e.get('data'), dict):
            return self.send(403, {'err': 'token'})
        with lock:
            r = con.execute('SELECT data FROM progress WHERE sid = ? AND lab = ?', (sid, lab)).fetchone()
            data = merge(json.loads(r[0]) if r else None, e['data'])
            con.execute('INSERT OR REPLACE INTO progress (sid, lab, data, ts) VALUES (?,?,?,?)', (sid, lab, json.dumps(data, ensure_ascii=False), int(time.time() * 1000)))
            con.commit()
        self.send(200, {'data': data})

    def admin(self, what, e):
        with lock:
            if what == 'group':
                name = clip(e.get('name'), 20).strip()
                names = [clip(x, 60).strip() for x in (e.get('names') or []) if str(x).strip()]
                if not name:
                    return self.send(400, {'err': 'name'})
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
                for n, sid in old.items():
                    if sid not in keep:
                        has = con.execute('SELECT 1 FROM progress WHERE sid = ?', (sid,)).fetchone()
                        if has:
                            con.execute('UPDATE student SET idx = 0 WHERE id = ?', (sid,))
                        else:
                            con.execute('DELETE FROM student WHERE id = ?', (sid,))
            elif what == 'resetpin':
                con.execute('UPDATE student SET pin = NULL, fails = 0, lock_until = 0 WHERE id = ?', (int(e.get('id') or 0),))
            elif what == 'delgroup':
                name = clip(e.get('name'), 20)
                ids = [r[0] for r in con.execute('SELECT id FROM student WHERE grp = ?', (name,))]
                for sid in ids:
                    con.execute('DELETE FROM progress WHERE sid = ?', (sid,))
                con.execute('DELETE FROM student WHERE grp = ?', (name,))
                con.execute('DELETE FROM grp WHERE name = ?', (name,))
            else:
                return self.send(404, {'err': 'not found'})
            con.commit()
        self.send(200, {'ok': True})

    def do_GET(self):
        u = urlparse(self.path)
        q = {k: v[0] for k, v in parse_qs(u.query).items()}
        if u.path == '/api/ping':
            return self.send(200, {'ok': True, 'auth': bool(KEY)})
        if u.path == '/api/groups':
            with lock:
                return self.send(200, {'groups': [r[0] for r in con.execute('SELECT name FROM grp ORDER BY ord')]})
        if u.path == '/api/roster':
            with lock:
                rows = con.execute('SELECT id, name, pin IS NOT NULL FROM student WHERE grp = ? AND idx > 0 ORDER BY name', (q.get('grp', ''),)).fetchall()
            return self.send(200, {'students': [{'id': r[0], 'name': short(r[1]), 'pin': bool(r[2])} for r in rows]})
        if u.path == '/api/progress':
            sid = sid_from(q.get('token'))
            if not sid:
                return self.send(403, {'err': 'token'})
            with lock:
                r = con.execute('SELECT data, ts FROM progress WHERE sid = ? AND lab = ?', (sid, q.get('lab', ''))).fetchone()
            return self.send(200, {'data': json.loads(r[0]) if r else None, 'ts': r[1] if r else 0})
        if u.path == '/api/admin/groups':
            if not KEY or q.get('key') != KEY:
                return self.send(403, {'err': 'key'})
            with lock:
                gs = con.execute('SELECT name, ord FROM grp ORDER BY ord').fetchall()
                out = []
                for name, o in gs:
                    st = []
                    for sid, n, idx, pin in con.execute('SELECT id, name, idx, pin IS NOT NULL FROM student WHERE grp = ? ORDER BY idx', (name,)):
                        labs = {}
                        for lab, data in con.execute('SELECT lab, data FROM progress WHERE sid = ?', (sid,)):
                            d = json.loads(data)
                            labs[lab] = sum(1 for r in (d.get('lv') or {}).values() if r.get('done'))
                        st.append({'id': sid, 'name': n, 'idx': idx, 'pin': bool(pin), 'seed': o * 100 + idx, 'labs': labs})
                    out.append({'name': name, 'students': st})
            return self.send(200, {'groups': out})
        if u.path not in ('/api/state', '/api/log'):
            if STATIC and not u.path.startswith('/api/'):
                return self.static(u.path)
            return self.send(404, {'err': 'not found'})
        if not KEY or q.get('key') != KEY:
            return self.send(403, {'err': 'key'})
        now = int(time.time() * 1000)
        since = int(q.get('since') or now - 6 * 3600 * 1000)
        lab = q.get('lab') or ''
        with lock:
            if u.path == '/api/log':
                rows = con.execute('SELECT ts, type, data FROM ev WHERE client = ? AND ts >= ? ORDER BY ts', (q.get('client', ''), since)).fetchall()
                return self.send(200, {'now': now, 'events': [{'ts': r[0], 'type': r[1], 'data': json.loads(r[2] or '{}')} for r in rows if r[1] != 'hb']})
            sql = 'SELECT ts, client, lab, fio, grp, seed, type, data FROM ev WHERE ts >= ?'
            args = [since]
            if lab:
                sql += ' AND lab = ?'
                args.append(lab)
            rows = con.execute(sql + ' ORDER BY ts', args).fetchall()
        self.send(200, {'now': now, 'since': since, 'people': summarize(rows, now)})


if __name__ == '__main__':
    if not KEY:
        print('ВНИМАНИЕ: не задан LABS_KEY — панель преподавателя будет недоступна')
    print(f'labsrv: 127.0.0.1:{PORT}, база {DB}')
    ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
