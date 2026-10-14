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
        return {s['name']: s['id'] for s in self.call('/api/roster?grp=' + quote('ИИ-25'))[1]['students']}

    def login(self, sid, pin='1234'):
        return self.call('/api/login', {'id': sid, 'pin': pin})

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
        st, r = self.login(ids['Иванов И.'])
        self.assertEqual(st, 200)
        self.assertTrue(r['first'])
        self.assertEqual(r['seed'], 101)                       # группа 1, строка 1
        self.assertEqual(self.login(ids['Иванов И.'], '0000')[0], 403)
        self.assertEqual(self.login(ids['Иванов И.'])[1]['token'], r['token'])
        self.assertEqual(self.call('/api/login', {'id': 'abc', 'pin': '1234'})[0], 404)
        self.assertEqual(self.call('/api/login', {'id': 1, 'pin': '12'})[0], 400)

    def test_pin_lockout(self):
        sid = self.group()['Петрова А.']
        self.login(sid)
        for _ in range(labsrv.PIN_TRIES):
            st, r = self.login(sid, '9999')
        self.assertIn('закрыт', r['err'])
        self.assertEqual(self.login(sid)[0], 429)
        self.call('/api/admin/resetpin', {'key': KEY, 'id': sid})
        self.assertEqual(self.login(sid, '5555')[0], 200)

    def test_progress_merge_and_token(self):
        sid = self.group()['Иванов И.']
        tok = self.login(sid)[1]['token']
        self.assertEqual(self.call('/api/progress', {'token': 'bad', 'lab': 'lr13', 'data': {}})[0], 403)
        self.call('/api/progress', {'token': tok, 'lab': 'lr13', 'data': {'lv': {'a': {'done': True}}}})
        self.call('/api/progress', {'token': tok, 'lab': 'lr13', 'data': {'lv': {'b': {'runs': 1}}}})
        st, r = self.call('/api/progress?lab=lr13', headers={'X-Labs-Token': tok})
        self.assertEqual(st, 200)
        self.assertEqual(set(r['data']['lv']), {'a', 'b'})
        self.assertEqual(self.call('/api/progress?lab=lr13')[0], 403)

    def test_events_identity_comes_from_token(self):
        sid = self.group()['Иванов И.']
        tok = self.login(sid)[1]['token']
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
        tok = self.login(ids['Петрова А.'])[1]['token']
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


class RateLimitTest(unittest.TestCase):
    def test_limit(self):
        r = labsrv.RateLimit(3)
        self.assertEqual([r.allow('ip') for _ in range(5)], [True, True, True, False, False])


if __name__ == '__main__':
    unittest.main()
