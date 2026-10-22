// Библиотека (ЛР-21–24): эталоны уровней выполняются по цепочке, ошибки — только там, где задуманы,
// планы на 20 000 книг дают ожидаемые способы чтения, копия ЛР-24 восстанавливается. Запросы — в настоящем PostgreSQL (PGlite).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeData, baseSql, FILL} from '../common/libdata.js';
import {planNodes} from '../common/qlab.js';
import {levels as L21} from '../lr21-3d/src/levels.js';
import {levels as L22} from '../lr22-3d/src/levels.js';
import {levels as L23} from '../lr23-3d/src/levels.js';
import {levels as L24} from '../lr24-3d/src/levels.js';

const {PGlite} = await import('../vendor/pglite/index.js');
const db = new PGlite();
const SEEDS = [0, 1, 7, 23, 101, 107, 115, 203];
const reset = async sql => {
  try {
    await db.query('ROLLBACK');
  } catch (e) {
    /* нет транзакции */
  }
  await db.query('RESET ROLE');
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
  await db.exec(sql);
};
// выполнить решение уровня: ошибки допускаются только с кодами из allow
async function play(lv, allow = []) {
  for (const q of lv.sol || lv.ref || [lv.ask]) {
    if (/^\s*(\\|pg_dump|psql)/.test(q)) continue; // метакоманды и pg_dump пульт выполняет сам — здесь не проверяются
    try {
      await db.query(q);
    } catch (e) {
      assert.ok(allow.includes(e.code), `${lv.key}: ${q} → ${e.code} ${e.message}`);
    }
  }
}
const plan = async q => planNodes((await db.query(q)).rows.map(r => Object.values(r)[0]));

test('библиотека: варианты различаются, роль — по правилу sNN_reader', () => {
  const a = makeData(101),
    b = makeData(102);
  assert.notDeepEqual(a.BK, b.BK);
  assert.equal(makeData(107).role, 's07_reader');
  for (const s of SEEDS) {
    const D = makeData(s);
    assert.equal(new Set(D.BK.map(x => x.title)).size, D.BK.length, `${s}: названия книг не повторяются`);
    assert.ok(
      D.BK.some(x => x.author_id === D.busy),
      `${s}: у автора busy есть книги`,
    );
  }
});

test('ЛР-21: решения уровней по цепочке; отказы — там, где задуманы', async () => {
  for (const s of SEEDS) {
    const D = makeData(s);
    await reset(baseSql(D));
    for (const lv of L21(D)) {
      const want = lv.check === 'error' ? [lv.code] : [];
      if (lv.check === 'error') {
        await assert.rejects(db.query(lv.sol[0]), e => e.code === lv.code && (!lv.errMsg || lv.errMsg.test(e.message)), `${s} ${lv.key}`);
        continue;
      }
      await play(lv, want);
      try {
        await db.query('ROLLBACK');
      } catch (e) {
        /* нет транзакции */
      }
    }
    const ck = await db.query(`SELECT 1 FROM pg_constraint WHERE conname = 'ck_book_pages'`);
    assert.equal(ck.rows.length, 1, `${s}: ограничение ck_book_pages`);
  }
});

test('ЛР-22: на 20 000 книг ключ — по индексу, название и диапазон — подряд, соединение — Hash Join', async () => {
  const D = makeData(107);
  const L = L22(D),
    by = k => L.find(l => l.key === k);
  // на 60 книгах и по ключу — подряд: одна страница дешевле индекса
  await reset(baseSql(D));
  assert.equal((await plan(by('small').sol[0])).nodes.find(n => n.table === 'book').kind, 'Seq Scan');
  await db.exec(FILL + ';\nANALYZE;');
  assert.equal((await db.query('SELECT count(*)::int AS n FROM book')).rows[0].n, 20000 + D.BK.length);
  const read = async (k, i = 0) => (await plan(by(k).sol[i])).nodes.find(n => n.table === 'book');
  assert.equal((await read('pk')).kind, 'Index Scan');
  assert.equal((await read('nonkey')).kind, 'Seq Scan');
  assert.equal((await read('range')).kind, 'Seq Scan');
  assert.ok((await plan(by('join').sol[0])).nodes.some(n => n.kind === 'Hash Join'));
  assert.equal((await read('like')).kind, 'Seq Scan');
  assert.equal((await read('byauthor')).kind, 'Seq Scan', 'внешний ключ — без индекса');
  assert.equal((await read('most')).kind, 'Seq Scan', 'почти вся таблица — подряд, хоть и по ключу');
  assert.equal((await read('sort', 0)).kind, 'Index Scan', 'ORDER BY id LIMIT — по индексу');
  assert.ok((await plan(by('sort').sol[1])).sort, 'ORDER BY pages — сортировка');
  assert.ok(!(await plan(by('sort').sol[0])).sort, 'ORDER BY id — без сортировки');
  assert.ok((await plan(by('agg').sol[0])).agg);
  const fin = await plan(by('final').sol[0]);
  assert.equal(fin.nodes[0].kind, 'Index Scan');
  assert.ok(fin.time > 0, 'EXPLAIN ANALYZE даёт время');
});

test('ЛР-23: после CREATE INDEX — по индексу; внешний ключ — Bitmap по ix_book_author_id', async () => {
  for (const s of [7, 115]) {
    const D = makeData(s);
    await reset(baseSql(D) + FILL + ';\nANALYZE;');
    const L = L23(D),
      by = k => L.find(l => l.key === k);
    const before = await plan(by('before').sol[0]);
    assert.equal(before.nodes[0].kind, 'Seq Scan');
    assert.ok(before.removed > 19000, 'прочитано зря');
    await db.query(by('create').sol[0]);
    assert.equal((await plan(by('create').sol[1])).nodes[0].index, 'ix_book_title');
    const ord = await plan(by('order').sol[0]);
    assert.ok(ord.nodes[0].index === 'ix_book_title' && !ord.sort, 'ORDER BY title — по индексу, без сортировки');
    assert.equal((await plan(by('func').sol[0])).nodes[0].kind, 'Seq Scan', 'lower(title) — мимо индекса');
    await db.query(by('fk').sol[0]);
    const fk = (await plan(by('fk').sol[1])).nodes[0];
    assert.equal(fk.index, 'ix_book_author_id', `${s}: ${fk.kind}`);
    await assert.rejects(db.query(by('uniqfail').sol[0]), e => e.code === '23505' && by('uniqfail').errMsg.test(e.message));
    await db.query(by('pages').sol[0]);
    assert.equal((await plan(by('pages').sol[1])).nodes[0].index, 'ix_book_pages');
    assert.equal((await plan(by('wide').sol[0])).nodes[0].kind, 'Seq Scan', 'широкий диапазон — подряд');
    assert.equal((await db.query(by('size').ask)).rows.length, 1);
    await play(by('extra'));
    const fin = by('final');
    assert.equal((await plan(fin.sol[0])).nodes[0].kind, 'Seq Scan');
    await db.query(fin.sol[1]);
    assert.equal((await plan(fin.sol[2])).nodes[0].index, 'ix_book_isbn');
  }
});

test('ЛР-24: права действуют под ролью; эталон восстановления собирает схему заново', async () => {
  for (const s of [7, 203]) {
    const D = makeData(s),
      R = D.role;
    await reset(baseSql(D));
    const L = L24(D),
      by = k => L.find(l => l.key === k);
    for (const k of ['role', 'grant']) for (const q of by(k).ref) await db.query(q);
    await db.query(`SET ROLE ${R}`);
    assert.ok((await db.query('SELECT count(*) FROM book')).rows[0].count > 0);
    await assert.rejects(db.query('DELETE FROM book WHERE id = 1'), e => e.code === '42501');
    await db.query('RESET ROLE');
    for (const q of by('revoke').ref) await db.query(q);
    await db.query(`SET ROLE ${R}`);
    await assert.rejects(db.query('SELECT count(*) FROM author'), e => e.code === '42501');
    await db.query('RESET ROLE');
    // права на столбцы: имя читается, телефон — нет
    for (const q of by('colgrant').ref) await db.query(q);
    await db.query(`SET ROLE ${R}`);
    assert.ok((await db.query('SELECT id, full_name FROM reader')).rows.length > 0);
    await assert.rejects(db.query('SELECT phone FROM reader'), e => e.code === '42501');
    await db.query('RESET ROLE');
    for (const q of by('rename').ref) await db.query(q);
    await assert.rejects(db.query('SELECT count(*) FROM book'), e => e.code === '42P01');
    for (const q of by('restore').ref) await db.query(q);
    const n1 = (await db.query('SELECT count(*)::int AS n FROM library.book')).rows[0].n,
      n2 = (await db.query('SELECT count(*)::int AS n FROM library_old.book')).rows[0].n;
    assert.equal(n1, n2, `${s}: число строк после восстановления`);
    await db.query('DROP SCHEMA library_old CASCADE');
    await db.query(`SET ROLE ${R}`);
    assert.ok((await db.query('SELECT count(*) FROM book')).rows[0].count > 0, `${s}: права роли — из копии`);
    await assert.rejects(db.query('SELECT phone FROM reader'), e => e.code === '42501', `${s}: права на столбцы — из копии`);
    assert.ok((await db.query('SELECT full_name FROM reader')).rows.length > 0);
    await db.query('RESET ROLE');
    // база перезагружается и с ролью, у которой есть права (уровень заново)
    await reset(baseSql(D));
  }
});
