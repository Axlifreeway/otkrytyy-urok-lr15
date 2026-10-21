// Пиццерия (ЛР-17–20): в каждом варианте у вопросов однозначный и непустой ответ, ловушки срабатывают.
// Запросы выполняются в настоящем PostgreSQL (PGlite из vendor/).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeData, baseSql} from '../common/pizzadata.js';
import {levels as L17} from '../lr17-3d/src/levels.js';
import {levels as L18} from '../lr18-3d/src/levels.js';
import {levels as L19} from '../lr19-3d/src/levels.js';
import {levels as L20} from '../lr20-3d/src/levels.js';
import {parseSelect, subqueries} from '../common/select.js';

const {PGlite} = await import('../vendor/pglite/index.js');
const db = new PGlite();
// варианты: номера без сервера (0–40) и места в списках групп (101…, 201…)
const SEEDS = [
  ...Array.from({length: 41}, (_, i) => i),
  ...Array.from({length: 15}, (_, i) => 101 + i),
  ...Array.from({length: 15}, (_, i) => 201 + i),
];
const load = async D => {
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
  await db.exec(baseSql(D));
};
const rows = async sql => (await db.query(sql, [], {rowMode: 'array'})).rows;

test('пиццерия: в данных есть всё, на чём держатся вопросы', () => {
  for (const s of SEEDS) {
    const D = makeData(s),
      O = D.OR;
    assert.ok(!O.some(o => o.pizza_id === D.unused), `${s}: пицца без заказов`);
    assert.ok(!O.some(o => o.courier_id === D.idle), `${s}: курьер без доставок`);
    assert.ok(!O.some(o => o.client_id === D.quiet), `${s}: гость без заказов`);
    assert.ok(O.filter(o => o.courier_id === null).length >= 2, `${s}: самовывоз`);
    const per = id => O.filter(o => o.pizza_id === id).length;
    assert.ok(
      D.PZ.every(p => p.id === D.fav || per(p.id) < per(D.fav)),
      `${s}: самая популярная пицца одна`,
    );
    assert.ok(
      D.PZ.some(p => per(p.id) === 1),
      `${s}: пицца, заказанная один раз`,
    );
    assert.ok(O.some(o => o.ordered.startsWith('2026-09')) && O.some(o => o.ordered.startsWith('2026-10')), `${s}: два месяца`);
    assert.ok(D.CL.filter(c => c.phone === null).length >= 1, `${s}: гость без телефона`);
    assert.equal(new Set(D.CL.map(c => c.full_name)).size, D.CL.length, `${s}: фамилии гостей не повторяются`);
  }
});

test('ЛР-17, 18, 19: эталонные запросы выполняются, ответ не пуст', async () => {
  for (const s of SEEDS) {
    const D = makeData(s);
    await load(D);
    for (const [lab, L] of [
      ['ЛР-17', L17],
      ['ЛР-18', L18],
      ['ЛР-19', L19],
    ])
      for (const lv of L(D)) {
        if (!lv.ask) continue;
        const r = await rows(lv.ask);
        assert.ok(r.length > 0, `${lab} ${lv.key}, вариант ${s}: пустой ответ`);
        // HAVING должен что-то отбрасывать — иначе уровень не про него
        if (/\bhaving\b/i.test(lv.ask) && lv.key !== 'final') {
          const all = await rows(lv.ask.replace(/\s+HAVING[\s\S]*$/i, ''));
          assert.ok(all.length > r.length, `${lab} ${lv.key}, вариант ${s}: HAVING ничего не отбросил`);
        }
      }
  }
});

test('ЛР-17: агрегат в WHERE даёт отказ 42803', async () => {
  const D = makeData(7);
  await load(D);
  const lv = L17(D).find(l => l.key === 'aggwhere');
  await assert.rejects(rows(lv.sol[0]), e => e.code === lv.code && lv.errMsg.test(e.message));
});

test('ЛР-18: NOT IN без отбора NULL — ни одной строки; подзапрос и соединение совпадают', async () => {
  for (const s of SEEDS.slice(0, 25)) {
    const D = makeData(s);
    await load(D);
    const L = L18(D),
      by = k => L.find(l => l.key === k);
    assert.equal((await rows('SELECT name FROM courier WHERE id NOT IN (SELECT courier_id FROM orders)')).length, 0, `вариант ${s}`);
    const ne = await rows(by('notexists').ask),
      ni = await rows(by('notin').ask);
    assert.deepEqual(ni.map(String).sort(), ne.map(String).sort(), `вариант ${s}: NOT IN и NOT EXISTS`);
    const a = await rows(by('sub2').ask),
      b = await rows(by('join2').ask),
      nb = await rows(by('join2').ask.replace('SELECT DISTINCT', 'SELECT'));
    assert.deepEqual(b.map(String).sort(), a.map(String).sort(), `вариант ${s}: подзапрос и соединение`);
    assert.ok(nb.length > b.length, `вариант ${s}: без DISTINCT соединение должно давать повторы`);
  }
});

test('ЛР-19: проверка № 15 совпадает с № 8', async () => {
  for (const s of SEEDS.slice(0, 20)) {
    const D = makeData(s);
    await load(D);
    const L = L19(D);
    const [[total]] = await rows(L.find(l => l.key === 'total').ask);
    const [[check]] = await rows(L.find(l => l.key === 'check').ask);
    assert.equal(String(check), String(total), `вариант ${s}`);
  }
});

test('ЛР-20: эталон каждого уровня выполняется по порядку; ошибка — только там, где задумана', async () => {
  for (const s of SEEDS.slice(0, 25)) {
    const D = makeData(s);
    await load(D);
    for (const lv of L20(D)) {
      for (const q of lv.sol || lv.ref) {
        try {
          await db.query(q);
        } catch (e) {
          assert.ok(lv.key === 'abort' && ['23502', '25P02'].includes(e.code), `вариант ${s}, ${lv.key}: ${q} → ${e.message}`);
        }
      }
      // после уровня база — как после его эталона (ref): в транзакционных уровнях всё откатано
      try {
        await db.query('ROLLBACK');
      } catch (e) {
        /* нет транзакции */
      }
    }
    // контрольный задевает хотя бы один самовывоз
    const fin = L20(D).find(l => l.key === 'final');
    assert.ok(/courier_id IS NULL/.test(fin.ref[0]), `вариант ${s}`);
  }
});

test('разбор: HAVING, агрегаты и подзапросы', () => {
  const p = parseSelect(
    'SELECT c.name, count(*) AS n FROM orders o JOIN courier c ON c.id = o.courier_id WHERE o.qty > 1 GROUP BY c.name HAVING count(*) > 2 ORDER BY n DESC',
  );
  assert.equal(p.where, 'o.qty > 1');
  assert.equal(p.group, 'c.name');
  assert.equal(p.having, 'count(*) > 2');
  assert.equal(p.order, 'n DESC');
  assert.equal(p.agg, true);
  assert.equal(parseSelect('SELECT name FROM pizza WHERE price > (SELECT avg(price) FROM pizza)').agg, false);
  assert.deepEqual(
    subqueries("id IN (SELECT pizza_id FROM orders WHERE qty >= 3) AND price > (SELECT avg(price) FROM pizza WHERE name <> '(x)')"),
    ['SELECT pizza_id FROM orders WHERE qty >= 3', "SELECT avg(price) FROM pizza WHERE name <> '(x)'"],
  );
  assert.deepEqual(subqueries('x IN (SELECT a FROM t WHERE b IN (SELECT c FROM u))'), ['SELECT a FROM t WHERE b IN (SELECT c FROM u)']);
});
