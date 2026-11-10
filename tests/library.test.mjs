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
      const want = lv.check === 'error' ? [lv.code] : lv.solErr || [];
      if (lv.check === 'error') {
        await assert.rejects(db.query(lv.sol[0]), e => e.code === lv.code && (!lv.errMsg || lv.errMsg.test(e.message)), `${s} ${lv.key}`);
        continue;
      }
      for (const q of lv.pre || []) await db.query(q);
      await play(lv, want);
      try {
        await db.query('ROLLBACK');
      } catch (e) {
        /* нет транзакции */
      }
    }
    const ck = await db.query(`SELECT 1 FROM pg_constraint WHERE conname IN ('ck_book_pages', 'ck_loan_dates')`);
    assert.equal(ck.rows.length, 2, `${s}: ограничения ck_book_pages и ck_loan_dates`);
    // транзакция с ошибкой откатилась целиком: телефона из уровня «Ошибка посреди транзакции» нет
    const tx = (await db.query(`SELECT count(*)::int AS n FROM reader WHERE phone = '+7 900 000-00-00'`)).rows[0].n;
    assert.equal(tx, 0, `${s}: ROLLBACK отменил и верный UPDATE`);
  }
});

test('ЛР-21: новые уровни — с данными, на которых они имеют смысл', () => {
  for (const s of [...SEEDS, 2, 3, 4, 5, 6, 8, 9, 10, 33, 59]) {
    const D = makeData(s),
      L = L21(D),
      by = k => L.find(l => l.key === k);
    assert.equal(L.length, 21, 'ЛР-21: 21 уровень');
    assert.ok(L.filter(l => l.check === 'error').length <= 3, 'ЛР-21: уровней «вызвать отказ» — немного');
    assert.match(by('thick').ref[0], /author_id = \d+$/, `${s}: thick`);
    assert.match(by('delaim').ref[0], /reader_id = \d+ AND/, `${s}: delaim`);
    // у читателя есть закрытые формуляры — DELETE не пустой
    const arch = +/reader_id = (\d+)/.exec(by('delaim').ref[0])[1];
    assert.ok(
      D.LN.some(l => l.reader_id === arch && l.returned !== null),
      `${s}: у читателя ${arch} есть закрытые формуляры`,
    );
    // правило для дат встаёт на исходных данных
    assert.ok(
      D.LN.every(l => l.returned === null || l.returned >= l.taken),
      `${s}: даты возврата не раньше выдачи`,
    );
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
  assert.equal((await read('keyrange')).kind, 'Index Scan', 'узкий диапазон по ключу — по индексу');
  assert.ok((await plan(by('keyrange').sol[0])).time > 0, 'EXPLAIN ANALYZE даёт время');
});

test('ЛР-22: прогнозы сходятся с планами, контрольный и таблица — с настоящими цифрами', async () => {
  for (const s of [0, 7, 23, 115]) {
    const D = makeData(s);
    const L = L22(D),
      by = k => L.find(l => l.key === k);
    assert.equal(L.length, 24, 'ЛР-22: 24 уровня');
    await reset(baseSql(D) + FILL + ';\nANALYZE;');
    const isIdx = n => !!n.index;
    // прогнозы «по индексу / подряд»: в уровнях-прогнозах запрос — в эталоне по порядку
    for (const k of ['guess3', 'guess3b']) {
      const lv = by(k);
      for (let i = 0; i < lv.preds.length; i++) {
        const n = (await plan(lv.sol[i])).nodes.find(x => x.table === 'book');
        assert.equal(isIdx(n) ? 'idx' : 'seq', lv.preds[i].answer, `${s} ${k} ${i + 1}: ${n.kind}`);
      }
    }
    assert.equal((await plan(by('most').sol[0])).nodes[0].kind, 'Seq Scan');
    // соединение трёх таблиц: book — по индексу (прогноз «idx»), узлов соединения два
    const j3 = await plan(by('join3').sol[0]);
    assert.equal(j3.nodes.filter(n => !n.table).length, 2, `${s}: два узла соединения`);
    assert.ok(isIdx(j3.nodes.find(n => n.table === 'book')), `${s}: book в соединении трёх таблиц — по индексу`);
    assert.equal(by('join3').pred.answer, 'idx');
    // группировка, составное условие, диапазон годов: ответ не пустой, всё — подряд
    assert.match((await db.query(by('group').sol[0])).rows.map(r => Object.values(r)[0]).join('\n'), /HashAggregate|GroupAggregate/);
    for (const k of ['combo', 'decade']) {
      const p = await plan(by(k).sol[0]),
        n = p.nodes.find(x => x.table === 'book');
      assert.equal(n.kind, 'Seq Scan', `${s} ${k}`);
      assert.ok(n.rows > 0 && p.removed > 0, `${s} ${k}: найдено ${n.rows}, отброшено ${p.removed}`);
    }
    assert.ok(isIdx((await plan(by('twoids').sol[0])).nodes[0]), `${s}: две книги по номерам — по индексу`);
    const lim = await plan(by('limit').sol[0]);
    const n = +/LIMIT (\d+)/.exec(by('limit').sol[0])[1];
    assert.equal(lim.nodes[0].rows, n, `LIMIT ${n} — Seq Scan прочитал ${n} строк`);
    // контрольный: A — Seq Scan и почти всё зря (нужен индекс), B — по индексу, C — подряд, но зря мало
    const F = by('final').form.rows;
    const facts = [];
    for (const r of F) facts.push(await plan('EXPLAIN ANALYZE ' + r.sql));
    assert.equal(facts[0].nodes[0].kind, 'Seq Scan');
    assert.ok(facts[0].removed > 20000, `${s}: ISBN — зря ${facts[0].removed}`);
    assert.equal(facts[1].nodes[0].kind, 'Index Scan');
    assert.equal(facts[2].nodes[0].kind, 'Seq Scan');
    assert.ok(facts[2].removed < 5000, `${s}: толще 150 — зря ${facts[2].removed}`);
    assert.deepEqual(
      F.map(r => r.need),
      ['да', 'нет', 'нет'],
    );
    F.forEach((r, i) => assert.ok(r.re.test(by('final').sol[i]), `${s}: эталон контрольного ${r.label} подходит под проверку`));
    // таблица для отчёта: те же четыре запроса, что на уровнях 4, 5, 7, 10
    const R = by('report').form.rows;
    assert.equal(R.length, 4);
    assert.equal((await plan('EXPLAIN ' + R[0].sql)).nodes[0].kind, 'Index Scan');
    assert.equal((await plan('EXPLAIN ' + R[1].sql)).nodes[0].kind, 'Seq Scan');
  }
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
    // таблица «после»: «до» в строках — как без индексов; после — запросы 2 и 3 по индексу
    const A = by('after').form.rows;
    assert.deepEqual(
      A.map(r => r.before),
      ['Index Scan', 'Seq Scan', 'Seq Scan', 'Seq Scan'],
    );
    const L22v = L22(D).find(l => l.key === 'report').form.rows;
    assert.deepEqual(
      A.map(r => r.sql),
      L22v.map(r => r.sql),
      `${s}: в ЛР-23 те же запросы 1–4, что в таблице ЛР-22`,
    );
    assert.ok((await plan('EXPLAIN ' + A[1].sql)).nodes[0].index, 'запрос 2 после индекса');
    assert.ok((await plan('EXPLAIN ' + A[2].sql)).nodes[0].index, 'запрос 3 после индекса');
    assert.equal((await db.query(by('size').ask)).rows.length, 2);
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

// тренировка после уровней: эталон каждого вида задания выполним на базе после всех уровней
test('ЛР-21 и ЛР-22: тренировка — все виды заданий выполнимы', async () => {
  const {practice: P21} = await import('../lr21-3d/src/practice.js');
  const {practice: P22} = await import('../lr22-3d/src/practice.js');
  const D = makeData(7);
  const all = async lv => {
    let sql = baseSql(D);
    for (const l of lv) if (l.ref) sql += '\n' + l.ref.map(q => q + ';').join('\n');
    return sql;
  };
  const state = async () => ({
    author: (await db.query('SELECT * FROM author')).rows,
    book: (await db.query('SELECT * FROM book ORDER BY id LIMIT 240')).rows,
    reader: (await db.query('SELECT * FROM reader')).rows,
    loan: (await db.query('SELECT id, book_id, reader_id, taken::text AS taken, returned::text AS returned FROM loan')).rows,
  });
  for (const [P, L] of [
    [P21, L21],
    [P22, L22],
  ]) {
    const base = await all(L(D));
    await reset(base);
    const st = await state();
    const seen = new Map();
    let k = 1;
    const rnd = () => ((k = (k * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 400; i++) {
      const t = P(D, st, rnd);
      if (!seen.has(t.title)) seen.set(t.title, t);
    }
    assert.ok(seen.size >= 7, `видов заданий: ${seen.size}`);
    for (const t of seen.values()) {
      await reset(base);
      if (t.form) {
        for (const q of t.sol) {
          await db.query(q);
          assert.ok(t.form.rows[0].re.test(q), `${t.title}: эталон подходит под проверку`);
        }
        continue;
      }
      const before = JSON.stringify(await state());
      for (const q of t.ref) await db.query(q);
      assert.notEqual(JSON.stringify(await state()), before, `${t.title}: команда что-то меняет`);
    }
  }
});

test('ЛР-22: больше половины уровней — таблица по плану, и числа в ней у вариантов разные', async () => {
  const facts = {};
  for (const s of [0, 7, 23]) {
    const D = makeData(s),
      L = L22(D);
    const forms = L.filter(l => l.form);
    assert.ok(forms.length > L.length / 2, `${s}: уровней-таблиц ${forms.length} из ${L.length}`);
    await reset(baseSql(D) + FILL + ';\nANALYZE;');
    for (const lv of forms) {
      const got = [];
      for (const r of lv.form.rows) {
        const lines = (await db.query('EXPLAIN ANALYZE ' + r.sql)).rows.map(x => Object.values(x)[0]);
        const n = planNodes(lines).nodes.find(x => x.table === 'book');
        assert.ok(n, `${s} ${lv.key}: в плане есть чтение book`);
        const rm = lines.reduce((a, l) => a + +((/Rows Removed by Filter: (\d+)/.exec(l) || [])[1] || 0), 0);
        got.push(`${r.sql}|${n.rows}|${rm}`);
        // запрос строки — тот, что студент пишет сам: эталон уровня подходит под условие строки
        if (r.re && lv.form.need)
          assert.ok(
            lv.sol.some(q => r.re.test(q)),
            `${s} ${lv.key}: эталон подходит под условие строки ${r.label}`,
          );
      }
      (facts[lv.key] = facts[lv.key] || new Set()).add(got.join(';'));
    }
  }
  for (const [k, v] of Object.entries(facts)) assert.ok(v.size > 1, `${k}: у вариантов 0, 7 и 23 одинаковая таблица`);
});
