// Коэффициент доверия к набору (common/trust.js): переписывание с телефона — низкий, обычная работа — высокий.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scoreLevel, scoreLab, rhythmic, WHY} from '../common/trust.js';

const m = o => ({
  t0: 0,
  first: 20000,
  n: 80,
  del: 6,
  rework: 2,
  chunks: [],
  mid: 10,
  pauses: 5,
  midWord: 1,
  dead: 0,
  awayMs: 0,
  ins: 0,
  paste: 0,
  ...o,
});

test('доверие: обычная работа — 100%', () => {
  assert.deepEqual(scoreLevel(m(), 2), {s: 100, why: [], n: 80});
});

test('доверие: переписывание — подряд, без правок, паузы посреди слов, долго ждал', () => {
  const r = scoreLevel(m({first: 150000, del: 0, rework: 0, mid: 0, pauses: 8, midWord: 6}), 1);
  assert.deepEqual(r.why.sort(), ['glance', 'line', 'rework', 'wait']);
  assert.equal(r.s, 5); // 15+15+20+15 и +30 за совпадение четырёх признаков
  assert.ok(r.why.every(c => WHY[c]));
});

test('доверие: много запусков смягчает признаки набора, но не уходы и не текст без клавиатуры', () => {
  const a = scoreLevel(m({mid: 0}), 1),
    b = scoreLevel(m({mid: 0}), 4);
  assert.ok(b.s > a.s);
  // без переделок лишние запуски — опечатки при переписывании, скидки нет
  assert.equal(scoreLevel(m({mid: 0, rework: 0}), 4).s, scoreLevel(m({mid: 0, rework: 0}), 1).s);
  assert.equal(scoreLevel(m({ins: 1}), 4).s, 55);
  assert.equal(scoreLevel(m({awayMs: 60000}), 4).s, 70);
});

test('доверие: на телефоне не судим по паузам и порядку набора', () => {
  const r = scoreLevel(m({rework: 0, mid: 0, pauses: 8, midWord: 6, chunks: [8, 9, 8, 10, 9, 8]}), 1, true);
  assert.deepEqual(r.why, ['rework']);
});

test('доверие: короткий набор без других признаков не оценивается', () => {
  assert.equal(scoreLevel(m({n: 10}), 1), null);
  assert.equal(scoreLevel(m({n: 10, awayMs: 20000}), 1).why[0], 'away');
});

test('доверие по лабе: среднее, взвешенное длиной набора', () => {
  const r = scoreLab([{tr: 100, tn: 300, tw: ''}, {tr: 40, tn: 100, tw: 'line,glance'}, {done: true}, undefined]);
  assert.equal(r.s, 63); // среднее 85 пополам с худшим уровнем 40
  assert.deepEqual(r.why.sort(), ['glance', 'line']);
  assert.equal(scoreLab([{done: true}]), null);
});

test('доверие: пульт преподавателя знает все признаки по-русски', () => {
  const html = readFileSync(new URL('../teacher/index.html', import.meta.url), 'utf8');
  const m = /const TRUST_WHY = (\{[^\n]*\});/.exec(html);
  assert.ok(m, 'в пульте нет TRUST_WHY');
  assert.deepEqual(JSON.parse(m[1].replace(/(\w+):/g, '"$1":').replace(/'/g, '"')), WHY);
});

test('доверие: опечатки исправлял, но переделок нет, ритм ровный кусками — переписывание с телефона', () => {
  const r = scoreLevel(m({del: 9, rework: 0, mid: 0, chunks: [9, 7, 11, 8, 10, 9, 8]}), 2);
  assert.deepEqual(r.why.sort(), ['line', 'rework', 'rhythm']);
  assert.ok(r.s < 50, String(r.s));
});

test('доверие: неровный ритм думающего человека — не кусочный', () => {
  assert.equal(rhythmic([3, 25, 6, 40, 2, 14]), false);
  assert.equal(rhythmic([9, 8]), false);
  assert.equal(rhythmic([8, 9, 8, 10, 9]), true);
});
