// Общие модули лабораторных: проверка результата и объединение прогресса.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {judge, describe, keyHint} from '../common/judge.js';
import {mergeP} from '../common/login.js';

const TABLES = {passenger: 'id'};
const row = (id, seat, meal = null) => ({id, seat, meal});

test('judge: сделано, осталось, неверно', () => {
  const start = {passenger: [row(1, '1A'), row(2, '1B'), row(3, '1C')]};
  const tgt = {passenger: [row(1, '1A', 'детское'), row(2, '1B', 'детское'), row(3, '1C')]};
  assert.equal(judge(tgt, tgt, start, ['passenger'], TABLES).ok, true);
  const half = judge({passenger: [row(1, '1A', 'детское'), row(2, '1B'), row(3, '1C')]}, tgt, start, ['passenger'], TABLES);
  assert.deepEqual([half.ok, half.wrong.length, half.pending.length], [false, 0, 1]);
  const bad = judge(
    {passenger: [row(1, '1A', 'детское'), row(2, '1B', 'детское'), row(3, '1C', 'стандарт')]},
    tgt,
    start,
    ['passenger'],
    TABLES,
  );
  assert.equal(bad.wrong.length, 1);
  assert.match(describe(bad.wrong)[0], /meal = 'стандарт', а нужно NULL/);
});

test('judge: строку, которую ещё предстоит удалить, можно менять', () => {
  const start = {passenger: [row(1, '1A'), row(2, '1B')]};
  const tgt = {passenger: [row(1, '1A')]};
  const j = judge({passenger: [row(1, '1A'), row(2, '1B', 'детское')]}, tgt, start, ['passenger'], TABLES);
  assert.deepEqual([j.wrong.length, j.pending.length], [0, 1]);
});

test('describe и keyHint: русская буква вместо латинской', () => {
  const start = {passenger: [row(1, '1A')]};
  const tgt = {passenger: [row(1, '1C')]};
  const j = judge({passenger: [row(1, '1С')]}, tgt, start, ['passenger'], TABLES); // кириллическая С
  assert.match(describe(j.wrong)[0], /русской раскладке/);
  const k = judge({flight: [{no: 'ИИ-1'}, {no: 'A1'}]}, {flight: [{no: 'ИИ-1'}, {no: 'А1'}]}, {flight: [{no: 'ИИ-1'}]}, ['flight'], {
    flight: 'no',
  });
  assert.match(keyHint(k.wrong, k.pending), /набран не так/);
});

const A = {
  lv: {a: {done: true, runs: 2}, b: {runs: 5}},
  pred: {a: {right: true}},
  journal: [{t: '1', q: 'x'}],
  answers: {0: 'длинный ответ'},
  lints: 1,
  away: 3,
  fio: '',
};
const B = {
  lv: {a: {runs: 9}, b: {done: true, runs: 1}, c: {runs: 1}},
  pred: {a: {right: false}, b: {right: true}},
  journal: [
    {t: '1', q: 'x'},
    {t: '2', q: 'y'},
  ],
  answers: {0: 'коротко', 1: 'да'},
  lints: 4,
  away: 1,
  fio: 'Иванов',
};

test('mergeP: пройденное не теряется ни с одной стороны', () => {
  const m = mergeP(A, B);
  assert.equal(m.lv.a.done, true);
  assert.equal(m.lv.b.done, true);
  assert.ok(m.lv.c);
  assert.equal(m.pred.a.right, true); // своё устройство важнее
  assert.equal(m.journal.length, 2);
  assert.equal(m.answers[0], 'длинный ответ');
  assert.deepEqual([m.lints, m.away, m.fio], [4, 3, 'Иванов']);
  assert.equal(mergeP({...A, practice: 7}, {...B, practice: 3}).practice, 7); // счётчик тренировки — больший
  assert.equal(mergeP(null, B), B);
  assert.equal(mergeP(A, null), A);
  // порядок уровней: «старый» с любого устройства побеждает
  assert.equal(mergeP({...A, order: 'new'}, {...B, order: 'old'}).order, 'old');
  assert.equal(mergeP({...A, order: 'new'}, B).order, 'new');
  assert.equal(mergeP(A, B).order, undefined);
});

test('mergeP в браузере и merge на сервере дают одно и то же', () => {
  const py = execFileSync(
    'python3',
    [
      '-c',
      `
import json, sys
sys.argv = ['x']
sys.path.insert(0, ${JSON.stringify(fileURLToPath(new URL('../server', import.meta.url)))})
from labsrv import merge
a, b = json.loads(sys.stdin.read())
print(json.dumps(merge(a, b), ensure_ascii=False, sort_keys=True))`,
    ],
    {
      input: JSON.stringify([
        {...A, order: 'new'},
        {...B, order: 'old'},
      ]),
    },
  ).toString();
  const sort = v =>
    Array.isArray(v)
      ? v.map(sort)
      : v && typeof v === 'object'
        ? Object.fromEntries(
            Object.keys(v)
              .sort()
              .map(k => [k, sort(v[k])]),
          )
        : v;
  const js = JSON.parse(JSON.stringify(mergeP({...A, order: 'new'}, {...B, order: 'old'})));
  delete js.pastes;
  delete js.awayMs;
  delete js.cur;
  const p = JSON.parse(py);
  delete p.pastes;
  delete p.awayMs;
  delete p.cur;
  assert.deepEqual(sort(p), sort(js));
});
