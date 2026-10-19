"""Тесты сервера: python3 -m unittest discover -s server -p 'test_*.py'"""
import json
import os
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from urllib.parse import quote

import labsrv

KEY = 'test-key'


class ServerTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.srv = labsrv.make_server(port=0, db=os.path.join(self.tmp.name, 'labs.db'), key=KEY, static='')
        self.base = f'http://127.0.0.1:{self.srv.server_address[1]}'
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()

    def tearDown(self):
        self.srv.shutdown()
        self.srv.server_close()
        self.srv.RequestHandlerClass.store.con.close()
        self.tmp.cleanup()

    def call(self, path, body=None, headers=None):
        req = urllib.request.Request(self.base + path, data=json.dumps(body).encode() if body is not None else None,
                                     headers={'Content-Type': 'application/json', **(headers or {})})
        try:
            with urllib.request.urlopen(req) as r:
                return r.status, json.loads(r.read())
        except urllib.error.HTTPError as e:
            return e.code, json.loads(e.read() or b'{}')

    def group(self, names=('Иванов Иван', 'Петрова Анна')):
        self.assertEqual(self.call('/api/admin/group', {'key': KEY, 'name': 'ИИ-25', 'names': list(names)})[0], 200)
        g = self.call('/api/admin/groups', headers={'X-Labs-Key': KEY})[1]['groups'][0]
        return {labsrv.short(s['name']): s['id'] for s in g['students']}

    def login(self, name, pin='1234', dev=''):
        return self.call('/api/login', {'grp': 'ИИ-25', 'name': name, 'pin': pin, 'dev': dev})

    def test_ping(self):
        self.assertEqual(self.call('/api/ping'), (200, {'ok': True, 'auth': True}))

    def test_admin_needs_key(self):
        self.assertEqual(self.call('/api/state')[0], 403)
        self.assertEqual(self.call('/api/state', headers={'X-Labs-Key': 'wrong'})[0], 403)
        self.assertEqual(self.call('/api/state', headers={'X-Labs-Key': KEY})[0], 200)
        self.assertEqual(self.call('/api/state?key=' + KEY)[0], 200)           # старый способ
        self.assertEqual(self.call('/api/admin/group', {'name': 'x', 'names': ['a']})[0], 403)

    def test_login_pin_and_seed(self):
        ids = self.group()
        st, r = self.login('Иванов')
        self.assertEqual(st, 200)
        self.assertTrue(r['first'])
        self.assertEqual(r['sid'], ids['Иванов И.'])
        self.assertEqual(r['seed'], 101)                       # группа 1, строка 1
        self.assertEqual(self.login('Иванов', '0000')[0], 403)
        self.assertEqual(self.login(' иванов  и. ')[1]['token'], r['token'])   # регистр, пробелы, инициал
        self.assertEqual(self.login('Сидоров')[0], 404)
        self.assertEqual(self.login('Иванов', '12')[0], 400)
        self.assertEqual(self.login('')[0], 400)

    def test_no_public_roster(self):
        self.group()
        self.assertEqual(self.call('/api/roster?grp=' + quote('ИИ-25'))[0], 404)
        self.assertEqual(self.call('/api/login', {'grp': 'ИИ-25', 'id': 1, 'pin': '1234'})[0], 400)   # по номеру не входят
        self.assertNotIn('Иванов', json.dumps(self.call('/api/groups')[1], ensure_ascii=False))

    def test_namesakes_need_first_name(self):
        self.group(['Иванов Иван', 'Иванов Пётр', 'Ёлкина Анна'])
        self.assertEqual(self.login('Иванов')[0], 409)
        self.assertEqual(self.login('Иванов П')[0], 200)
        self.assertEqual(self.login('Иванов Иван')[1]['fio'], 'Иванов Иван')
        self.assertEqual(self.login('елкина')[0], 200)          # ё = е

    def test_guessing_names_limited(self):
        self.group()
        for i in range(labsrv.FAILS_PER_DEVICE):
            self.assertEqual(self.login(f'Нетакой{i}', dev='bad')[0], 404)
        self.assertEqual(self.login('Иванов', dev='bad')[0], 429)
        self.assertEqual(self.login('Иванов', dev='good')[0], 200)

    def test_one_device_cannot_claim_many_accounts(self):
        self.group(['Иванов Иван', 'Петрова Анна', 'Сидоров Пётр'])
        claim = lambda name, dev: self.login(name, '1111', dev)
        self.assertEqual(claim('Иванов', 'pc1')[0], 200)
        self.assertEqual(claim('Иванов', 'pc1')[0], 200)                         # свой аккаунт — сколько угодно
        st, r = claim('Петрова', 'pc1')
        self.assertEqual(st, 403)
        self.assertIn('Иванов И.', r['err'])
        self.assertEqual(claim('Петрова', 'pc2')[0], 200)               # с другого компьютера — можно
        g = self.call('/api/admin/groups', headers={'X-Labs-Key': KEY})[1]['groups'][0]
        self.assertEqual({s['name']: s['sameDev'] for s in g['students']}['Иванов Иван'], [])

    def test_shared_device_is_flagged(self):
        self.group(['Иванов Иван', 'Петрова Анна'])
        srv = self.srv.RequestHandlerClass.store
        self.login('Иванов', '1111', 'pc9')
        srv.claims.clear()                                                       # прошло полчаса
        self.login('Петрова', '2222', 'pc9')
        g = self.call('/api/admin/groups', headers={'X-Labs-Key': KEY})[1]['groups'][0]
        self.assertEqual({s['name']: s['sameDev'] for s in g['students']}['Иванов Иван'], ['Петрова Анна'])

    def test_wrong_pins_limited_per_device(self):
        ids = self.group(['Иванов Иван', 'Петрова Анна', 'Сидоров Пётр'])
        for name in ids:
            self.login(name, '1111', 'own-' + name)
        codes = []
        for i in range(labsrv.FAILS_PER_DEVICE + 1):
            name = list(ids)[i % 3]                                             # перебор по разным аккаунтам
            codes.append(self.login(name, '9999', 'bad')[0])
        self.assertEqual(codes[-1], 429)
        self.assertEqual(self.login('Иванов', '1111', 'good')[0], 200)

    def test_pin_lockout(self):
        sid = self.group()['Петрова А.']
        self.login('Петрова')
        for _ in range(labsrv.PIN_TRIES):
            st, r = self.login('Петрова', '9999')
        self.assertIn('закрыт', r['err'])
        self.assertEqual(self.login('Петрова')[0], 429)
        self.call('/api/admin/resetpin', {'key': KEY, 'id': sid})
        self.assertEqual(self.login('Петрова', '5555')[0], 200)

    def test_progress_merge_and_token(self):
        sid = self.group()['Иванов И.']
        tok = self.login('Иванов')[1]['token']
        self.assertEqual(self.call('/api/progress', {'token': 'bad', 'lab': 'lr13', 'data': {}})[0], 403)
        self.call('/api/progress', {'token': tok, 'lab': 'lr13', 'data': {'lv': {'a': {'done': True}}}})
        self.call('/api/progress', {'token': tok, 'lab': 'lr13', 'data': {'lv': {'b': {'runs': 1}}}})
        st, r = self.call('/api/progress?lab=lr13', headers={'X-Labs-Token': tok})
        self.assertEqual(st, 200)
        self.assertEqual(set(r['data']['lv']), {'a', 'b'})
        self.assertEqual(self.call('/api/progress?lab=lr13')[0], 403)

    def test_events_identity_comes_from_token(self):
        sid = self.group()['Иванов И.']
        tok = self.login('Иванов')[1]['token']
        ev = {'type': 'run', 'client': 'fake', 'lab': 'lr13', 'fio': 'Кто-то другой', 'grp': 'X', 'seed': 5, 'data': {'lv': 1, 'ok': False, 'out': 'ERROR'}}
        self.assertEqual(self.call('/api/ev', ev)[0], 403)            # списки есть — без входа нельзя
        self.assertEqual(self.call('/api/ev', {**ev, 'token': tok})[0], 200)
        people = self.call('/api/state', headers={'X-Labs-Key': KEY})[1]['people']
        self.assertEqual(len(people), 1)
        p = people[0]
        self.assertEqual((p['client'], p['fio'], p['grp'], p['seed'], p['errors']), (f's{sid}', 'Иванов Иван', 'ИИ-25', 101, 1))

    def test_events_without_groups_and_rollback(self):
        for typ, data in (('level', {'lv': 2}), ('rollback', {'lv': 2, 'msg': 'не совпало'}), ('done', {'lv': 2, 'key': 'k', 'pts': 1.5})):
            self.assertEqual(self.call('/api/ev', {'type': typ, 'client': 'c1', 'lab': 'lr14', 'fio': 'Без входа', 'data': data})[0], 200)
        self.assertEqual(self.call('/api/ev', {'type': 'nope', 'client': 'c1'})[0], 400)
        p = self.call('/api/state', headers={'X-Labs-Key': KEY})[1]['people'][0]
        self.assertEqual((p['lv'], p['lvErrors'], p['lastErr'], p['done'], p['pts'], p['total']), (2, 1, 'не совпало', ['k'], 1.5, 12))

    def test_group_edit_keeps_progress(self):
        ids = self.group()
        tok = self.login('Петрова А.')[1]['token']
        self.call('/api/progress', {'token': tok, 'lab': 'lr14', 'data': {'lv': {'a': {'done': True}}}})
        self.group(['Петрова Анна', 'Сидоров Пётр'])                 # Иванов убран, Петрова — первая
        g = self.call('/api/admin/groups', headers={'X-Labs-Key': KEY})[1]['groups'][0]
        by = {s['name']: s for s in g['students']}
        self.assertEqual((by['Петрова Анна']['idx'], by['Петрова Анна']['labs']), (1, {'lr14': 1}))
        self.assertNotIn('Иванов Иван', by)                         # без прогресса — удалён
        self.assertTrue(by['Петрова Анна']['pin'])
        self.call('/api/admin/delgroup', {'key': KEY, 'name': 'ИИ-25'})
        self.assertEqual(self.call('/api/groups')[1], {'groups': []})

    def test_bad_body(self):
        req = urllib.request.Request(self.base + '/api/ev', data=b'[1,2]', headers={'Content-Type': 'application/json'})
        with self.assertRaises(urllib.error.HTTPError) as c:
            urllib.request.urlopen(req)
        self.assertEqual(c.exception.code, 400)

    def test_robot_announcement_reaches_group(self):
        ids = self.group()
        tok = self.login('Иванов И.')[1]['token']
        h = {'X-Labs-Token': tok}
        last = self.call('/api/say?since=-1', headers=h)[1]['last']
        self.assertEqual(self.call('/api/admin/say', {'key': KEY, 'text': ''})[0], 400)
        self.assertEqual(self.call('/api/admin/say', {'text': 'нет ключа'})[0], 403)
        self.call('/api/admin/say', {'key': KEY, 'text': 'Всем: проверьте WHERE!', 'mode': 'scream'})  # режим игнорируется
        self.call('/api/admin/say', {'key': KEY, 'text': 'Другой группе', 'grp': 'Б-2'})
        self.call('/api/admin/say', {'key': KEY, 'text': 'Вашей группе', 'grp': 'ИИ-25'})
        self.call('/api/admin/say', {'key': KEY, 'text': 'Лично Иванову', 'sid': ids['Иванов И.']})
        self.call('/api/admin/say', {'key': KEY, 'text': 'Лично Петровой', 'sid': ids['Петрова А.']})
        items = self.call(f'/api/say?since={last}', headers=h)[1]['items']
        self.assertEqual([i['text'] for i in items], ['Всем: проверьте WHERE!', 'Вашей группе', 'Лично Иванову'])
        recent = self.call('/api/admin/says', headers={'X-Labs-Key': KEY})[1]['items']
        self.assertEqual((len(recent), recent[0]['to']), (5, 'Петрова Анна'))

    def test_report_sent_and_viewed(self):
        ids = self.group()
        tok = self.login('Иванов И.')[1]['token']
        A = {'X-Labs-Key': KEY}
        body = {'lab': 'lr13', 'html': '<!doctype html><p>Протокол</p>', 'pts': 7.5, 'done': 11, 'fio': 'Подделка'}
        self.assertEqual(self.call('/api/report', body)[0], 403)                      # без входа — нельзя
        self.assertEqual(self.call('/api/report', {**body, 'html': ''}, {'X-Labs-Token': tok})[0], 400)
        self.assertEqual(self.call('/api/report', {**body, 'lab': 'lr99'}, {'X-Labs-Token': tok})[0], 400)
        self.assertEqual(self.call('/api/report', {**body, 'html': 'x' * (labsrv.MAX_REPORT + 1)}, {'X-Labs-Token': tok})[0], 413)
        st, r = self.call('/api/report', body, {'X-Labs-Token': tok})
        self.assertEqual(st, 200)
        self.assertEqual(self.call('/api/admin/reports')[0], 403)
        items = self.call('/api/admin/reports', headers=A)[1]['items']
        self.assertEqual([(i['fio'], i['pts'], i['done'], i['lab']) for i in items], [('Иванов Иван', 7.5, 11, 'lr13')])   # ФИО — с сервера
        rep = self.call(f'/api/admin/report?id={r["id"]}', headers=A)[1]
        self.assertEqual(rep['html'], body['html'])
        self.assertEqual(self.call('/api/admin/report?id=999', headers=A)[0], 404)
        p = self.call('/api/state', headers=A)[1]['people'][0]
        self.assertEqual(p['report']['id'], r['id'])
        for _ in range(labsrv.REPORT_VERSIONS + 2):                                    # хранятся последние версии
            self.call('/api/report', body, {'X-Labs-Token': tok})
        self.assertEqual(len(self.call('/api/admin/reports?client=s%d' % ids['Иванов И.'], headers=A)[1]['items']), labsrv.REPORT_VERSIONS)

    def test_state_for_past_day(self):
        store = self.srv.RequestHandlerClass.store
        day = 24 * 3600 * 1000
        t0 = labsrv.now_ms() - 2 * day
        store.add_event(t0, 'c1', 'lr13', 'Вчерашний В.', 'ИИ-25', 5, 'level', {'lv': 3}, '')
        store.add_event(t0 + 60000, 'c1', 'lr13', 'Вчерашний В.', 'ИИ-25', 5, 'run', {'lv': 3, 'ok': False, 'sql': 'INSERT', 'txt': 'ERROR'}, '')
        A = {'X-Labs-Key': KEY}
        self.assertEqual(self.call('/api/state', headers=A)[1]['people'], [])            # по умолчанию — последние 6 часов
        r = self.call(f'/api/state?since={t0 - 1000}&until={t0 + day}', headers=A)[1]
        self.assertEqual([(p['fio'], p['lv'], p['errors'], p['stuck']) for p in r['people']], [('Вчерашний В.', 3, 1, [])])
        self.assertEqual(self.call(f'/api/state?since={t0 - 1000}&until={t0 + 1000}', headers=A)[1]['people'][0]['errors'], 0)
        ev = self.call(f'/api/log?client=c1&since={t0 - 1000}&until={t0 + day}', headers=A)[1]['events']
        self.assertEqual([e['type'] for e in ev], ['level', 'run'])

    def test_gated_labs_closed_until_teacher_opens(self):
        ids = self.group()
        tok = self.login('Иванов')[1]['token']
        h = {'X-Labs-Token': tok}
        self.assertEqual(self.call('/api/labs')[1]['open'], {'lr13': True, 'lr14': True, 'lr15': False, 'lr16': False, 'lr17': False, 'lr18': False})
        self.assertEqual(self.call('/api/ev', {'type': 'hello', 'client': 'x', 'lab': 'lr15'}, h)[0], 403)
        self.assertEqual(self.call('/api/progress', {'lab': 'lr15', 'data': {'lv': {}}}, h)[0], 403)
        self.assertEqual(self.call('/api/report', {'lab': 'lr16', 'html': '<p>x</p>'}, h)[0], 403)
        self.assertEqual(self.call('/api/ev', {'type': 'hello', 'client': 'x', 'lab': 'lr14'}, h)[0], 200)   # открытые — как раньше
        self.assertEqual(self.call('/api/admin/labs', {'lab': 'lr15', 'open': True})[0], 403)               # только с ключом
        self.assertEqual(self.call('/api/admin/labs', {'key': KEY, 'lab': 'lr13', 'open': False})[0], 400)  # 13 и 14 не закрываются
        self.assertEqual(self.call('/api/admin/labs', {'key': KEY, 'lab': 'lr15', 'open': True})[1]['open']['lr15'], True)
        self.assertEqual(self.call('/api/ev', {'type': 'hello', 'client': 'x', 'lab': 'lr15'}, h)[0], 200)
        self.assertEqual(self.call('/api/progress', {'lab': 'lr15', 'data': {'lv': {}}}, h)[0], 200)
        self.call('/api/admin/labs', {'key': KEY, 'lab': 'lr15', 'open': False})
        self.assertEqual(self.call('/api/labs')[1]['open']['lr15'], False)


class RateLimitTest(unittest.TestCase):
    def test_limit(self):
        r = labsrv.RateLimit(3)
        self.assertEqual([r.allow('ip') for _ in range(5)], [True, True, True, False, False])


if __name__ == '__main__':
    unittest.main()


# схема базы из первой версии сервера (ветка main до рефакторинга) — на ней уже есть данные студентов
OLD_SCHEMA = '''
CREATE TABLE ev (id INTEGER PRIMARY KEY, ts INTEGER, client TEXT, lab TEXT, fio TEXT, grp TEXT, seed INTEGER, type TEXT, data TEXT, ip TEXT);
CREATE INDEX ev_ts ON ev(ts);
CREATE INDEX ev_client ON ev(client, ts);
CREATE TABLE grp (name TEXT PRIMARY KEY, ord INTEGER);
CREATE TABLE student (id INTEGER PRIMARY KEY, grp TEXT, name TEXT, idx INTEGER, pin TEXT, fails INTEGER DEFAULT 0, lock_until INTEGER DEFAULT 0);
CREATE TABLE progress (sid INTEGER, lab TEXT, data TEXT, ts INTEGER, PRIMARY KEY (sid, lab));
'''


class MigrationTest(unittest.TestCase):
    """Новая версия сервера на базе старой: PIN, токены, прогресс и журнал остаются, схема дополняется."""

    def test_old_database_keeps_students(self):
        import sqlite3
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, 'labs.db')
            con = sqlite3.connect(path)
            con.executescript(OLD_SCHEMA)
            old = labsrv.Store.__new__(labsrv.Store)
            old.key = KEY
            prog = {'lv': {'insert1': {'done': True, 'runs': 3, 'fails': 1}}, 'journal': [{'t': 1, 'q': 'INSERT …'}]}
            con.execute("INSERT INTO grp VALUES ('ИИ-25', 1)")
            con.execute("INSERT INTO student (id, grp, name, idx, pin) VALUES (7, 'ИИ-25', 'Иванов Иван', 1, ?)", (old.pin_hash(7, '4321'),))
            con.execute("INSERT INTO progress VALUES (7, 'lr13', ?, 5)", (json.dumps(prog),))
            con.execute("INSERT INTO ev (ts, client, lab, type, data) VALUES (1, 's7', 'lr13', 'run', '{}')")
            con.commit()
            con.close()

            st = labsrv.Store(path, KEY)
            self.assertEqual(st.login(7, '4321')[0], 200)                       # старый PIN подходит
            self.assertEqual(st.login(7, '1111')[0], 403)
            self.assertEqual(st.sid_from(old.token_for(7)), 7)                  # выданные раньше токены действуют
            self.assertEqual(st.progress(7, 'lr13')[0], prog)
            self.assertEqual(len(st.log('s7', 0)), 1)
            self.assertIn('pin_dev', [r[1] for r in st.con.execute('PRAGMA table_info(student)')])
            self.assertTrue(st.con.execute("SELECT 1 FROM sqlite_master WHERE name = 'say'").fetchone())
            st.con.close()
            backups = [f for f in os.listdir(tmp) if f.startswith('labs.db.before-')]
            self.assertEqual(len(backups), 1)                                    # копия до изменения схемы
            b = sqlite3.connect(os.path.join(tmp, backups[0]))
            self.assertEqual(b.execute('SELECT data FROM progress WHERE sid = 7').fetchone()[0], json.dumps(prog))
            self.assertIsNone(b.execute("SELECT 1 FROM sqlite_master WHERE name = 'say'").fetchone())
            b.close()

            st = labsrv.Store(path, KEY)                                        # второй запуск: схема та же — копии нет
            st.con.close()
            self.assertEqual(len([f for f in os.listdir(tmp) if f.startswith('labs.db.before-')]), 1)

    def test_fresh_database(self):
        with tempfile.TemporaryDirectory() as tmp:
            st = labsrv.Store(os.path.join(tmp, 'labs.db'), KEY)
            self.assertIn('pin_dev', [r[1] for r in st.con.execute('PRAGMA table_info(student)')])
            st.con.close()
            self.assertEqual([f for f in os.listdir(tmp) if '.before-' in f], [])
