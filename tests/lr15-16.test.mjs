// Свойства вариантов ЛР-15 и ЛР-16: в каждом варианте задание однозначно и ловит типичную ошибку.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compareResult, layoutHint} from '../common/select.js';
import * as A from '../lr15-3d/src/data.js';
import * as J from '../lr16-3d/src/data.js';

const SEEDS = Array.from({length: 61}, (_, i) => i);
const cnt = (a, f) => a.filter(f).length;

test('ЛР-15: пять самых тяжёлых — без ничьей на границе', () => {
  for (const s of SEEDS) {
    const w = A.makeData(s)
      .B.map(b => b.weight_kg)
      .sort((a, b) => b - a);
    assert.ok(w[4] > w[5], `вариант ${s}: ${w.slice(0, 6)}`);
  }
});

test('ЛР-15: «тяжелее» и «не легче» дают разный ответ, BETWEEN — с человеком на границе', () => {
  for (const s of SEEDS) {
    const D = A.makeData(s);
    assert.ok(
      D.B.some(b => b.weight_kg === D.heavy),
      `вариант ${s}: нет чемодана ровно ${D.heavy} кг`,
    );
    const n = cnt(D.B, b => b.weight_kg > D.heavy);
    assert.ok(n >= 3 && n <= 5, `вариант ${s}: тяжелее ${D.heavy} — ${n}`);
    assert.ok(
      D.P.some(p => p.birth_year === D.y1 || p.birth_year === D.y2),
      `вариант ${s}: на границах диапазона никого`,
    );
  }
});

test('ЛР-15: питание не выбрано хотя бы у двоих, город — не больше шести пассажиров', () => {
  for (const s of SEEDS) {
    const D = A.makeData(s);
    assert.ok(cnt(D.P, p => p.meal === null) >= 2, `вариант ${s}`);
    assert.ok(cnt(D.P, p => p.city === D.city) <= 6, `вариант ${s}: ${D.city}`);
  }
});

test('ЛР-16: золотых владельцев с багажом не меньше двух, в контрольном есть чемодан владельца без карты', () => {
  for (const s of SEEDS) {
    const D = J.makeData(s);
    const all = D.P.map(p => ({...p, loyalty: D.bronze.includes(p.id) ? 'базовая' : p.loyalty}));
    const owner = b => all.find(p => p.id === b.passenger_id);
    assert.ok(cnt(D.B, b => owner(b).loyalty === 'золото') >= 2, `вариант ${s}: мало строк в «Приоритетной выдаче»`);
    assert.ok(
      D.B.some(b => b.weight_kg > D.heavy && !owner(b).loyalty),
      `вариант ${s}: обычный JOIN в контрольном дал бы тот же ответ`,
    );
    assert.ok(D.B.every(b => b.weight_kg <= 32));
  }
});

test('compareResult: names — вычисляемому столбцу нужно имя', () => {
  const exp = {fields: ['full_name', 'age'], rows: [['Иванов', 30]]};
  assert.equal(compareResult({fields: ['full_name', '?column?'], rows: [['Иванов', 30]]}, exp, {names: true}).ok, false);
  assert.equal(compareResult({fields: ['full_name', '?column?'], rows: [['Иванов', 30]]}, exp).ok, true);
  assert.equal(compareResult({fields: ['full_name', 'AGE'], rows: [['Иванов', 30]]}, exp, {names: true}).ok, true);
});

test('layoutHint: буква не в той раскладке', () => {
  const ask = "SELECT full_name, seat FROM passenger WHERE seat LIKE '%A' OR seat LIKE '%F'";
  assert.match(layoutHint("SELECT full_name, seat FROM passenger WHERE seat LIKE '%А' OR seat LIKE '%F'", ask), /русской/);
  assert.match(layoutHint("SELECT * FROM passenger WHERE full_name LIKE 'E%'", "… LIKE 'Е%'"), /английской/);
  assert.equal(layoutHint(ask, ask), '');
  assert.equal(layoutHint("SELECT 1 WHERE x = 'Омск'", "… = 'Ишим'"), '');
});

test('ЛР-15, 16: эталонные запросы выполняются в PostgreSQL, ответ не пуст', async () => {
  const {PGlite} = await import('../vendor/pglite/index.js');
  const db = new PGlite();
  for (const M of [A, J])
    for (const s of SEEDS.slice(0, 30)) {
      const D = M.makeData(s);
      await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
      await db.exec(M.baseSql(D));
      for (const lv of M.levels(D)) {
        // уровень на схему (ЛР-16 «Связи базы») меняет базу — эталон выполняется, как в лабе
        if (lv.check === 'schema') for (const q of lv.ref) await db.query(q);
        if (!lv.ask) continue;
        const r = await db.query(lv.ask);
        assert.ok(r.rows.length > 0, `${lv.key}, вариант ${s}: пустой ответ`);
      }
    }
  await db.close();
});
