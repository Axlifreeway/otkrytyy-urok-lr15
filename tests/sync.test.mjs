// Синхронизация прогресса: выжимка помещается в лимиты, при сбое связи отправка повторяется до успеха.
import {test, mock} from 'node:test';
import assert from 'node:assert/strict';
import {compact, mergeP, syncInit, push} from '../common/login.js';

const big = () => ({
  lv: Object.fromEntries(Array.from({length: 12}, (_, i) => [`l${i}`, {done: true, runs: 9, fails: 2, sql: 'x'.repeat(2400), tag: 'INSERT 0 1\n'.repeat(4)}])),
  pred: {}, answers: {0: 'ответ '.repeat(200)}, fio: 'Иванов',
  journal: Array.from({length: 800}, (_, i) => ({t: `10:${String(i % 60).padStart(2, '0')}:${i}`, lv: 'l1', q: 'SELECT '.repeat(90), o: 'ok'})),
});

test('выжимка большого прогресса помещается в фоновую отправку (64 КБ)', () => {
  const P = big();
  assert.ok(JSON.stringify(P).length > 400000);           // так прогресс упирался в лимит сервера
  assert.ok(JSON.stringify(compact(P)).length < 60000);
  assert.equal(compact(P).journal.length, 80);
  assert.equal(P.journal.length, 800);                     // своё не трогаем
});

test('объединение не дублирует команды, укороченные при отправке', () => {
  const local = big(), server = compact(big());
  assert.equal(mergeP(server, local).journal.length, 800);
  assert.equal(mergeP(local, server).journal.length, 800);
});

test('при сбоях связи отправка повторяется, пока не дойдёт', async () => {
  mock.timers.enable({apis: ['setTimeout']});
  const calls = [];
  globalThis.fetch = async (url, opt) => { calls.push(JSON.parse(opt.body)); if (calls.length < 3) throw new Error('offline'); return {ok: true, status: 200}; };
  const st = [];
  syncInit({token: '1.abc'}, 'lr13', s => st.push(s));
  push({lv: {a: {done: true}}, journal: []});
  mock.timers.tick(1200); await new Promise(r => setImmediate(r));
  assert.equal(calls.length, 1);
  mock.timers.tick(3000); await new Promise(r => setImmediate(r));
  assert.equal(calls.length, 2);
  mock.timers.tick(6000); await new Promise(r => setImmediate(r));
  assert.equal(calls.length, 3);
  assert.equal(st.at(-1), 'ok');
  mock.timers.tick(120000); await new Promise(r => setImmediate(r));
  assert.equal(calls.length, 3);                           // дошло — больше не шлём
  assert.ok(calls.every(c => c.token === '1.abc' && c.lab === 'lr13'));
  mock.timers.reset();
});
