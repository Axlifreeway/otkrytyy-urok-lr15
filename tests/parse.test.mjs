// Разбор команд пульта и мелкие общие функции.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {splitTop, statements, findTop} from '../common/sql.js';
import {sha256, isTeacherCode} from '../common/teacher.js';
import {plural} from '../common/util.js';
import * as p13 from '../lr13-3d/src/parse.js';
import * as p14 from '../lr14-3d/src/parse.js';

test('splitTop и statements не режут внутри кавычек и скобок', () => {
  assert.deepEqual(splitTop("'a,b', (1, 2), 3", ','), ["'a,b'", ' (1, 2)', ' 3']);
  assert.deepEqual(splitTop("'it''s; ok'; x", ';'), ["'it''s; ok'", ' x']);
  assert.deepEqual(statements("SELECT 1; -- коммент; ещё\nSELECT ';';"), ['SELECT 1', "SELECT ';'"]);
});

test('findTop: ключевое слово вне скобок и кавычек', () => {
  const s = "meal = (SELECT m FROM x WHERE id = 1) WHERE id = 2";
  assert.equal(s.slice(findTop(s, 'where') + 1), 'WHERE id = 2');
  assert.equal(findTop("a = ' where ' ", 'where'), -1);
  assert.equal(findTop('a = 1', 'where'), -1);
});

test('ЛР-14: UPDATE с подзапросом в SET', () => {
  const q = p14.parse("UPDATE passenger SET meal = (SELECT meal FROM passenger WHERE id = 1), city = 'Тюмень, центр' WHERE id = 2;");
  assert.equal(q.kind, 'UPDATE');
  assert.equal(q.where, 'id = 2');
  assert.deepEqual(q.sets.map(s => s.col), ['meal', 'city']);
  assert.equal(q.sets[1].expr, "'Тюмень, центр'");
});

test('ЛР-14: разбор UPDATE, DELETE, SELECT и отказ в остальном', () => {
  assert.equal(p14.parse("UPDATE passenger SET meal = 'детское' WHERE birth_year >= 2012").where, 'birth_year >= 2012');
  assert.equal(p14.parse('UPDATE baggage SET weight_kg = weight_kg + 2').where, null);
  assert.deepEqual([p14.parse('delete from passenger where id = 5').kind, p14.parse('delete from passenger where id = 5').where], ['DELETE', 'id = 5']);
  assert.equal(p14.parse('SELECT * FROM baggage WHERE shelf = 2 ORDER BY tag').where, 'shelf = 2');
  assert.match(p14.parse('UPDATE planes SET x = 1').err, /Таблицы planes нет/);
  assert.match(p14.parse('INSERT INTO flight VALUES (1)').err, /SELECT, UPDATE и DELETE/);
  assert.match(p14.parse('UPDATE passenger SET meal').err, /Не разобрал SET/);
  assert.equal(p14.parse('  -- пусто\n'), null);
});

test('ЛР-14: подстановка значений строки в условие', () => {
  assert.equal(p14.subst('passenger', "birth_year >= 2012 AND city = 'birth_year'", {birth_year: 2015, city: 'Ишим'}), "2015 >= 2012 AND 'Ишим' = 'birth_year'");
  assert.equal(p14.normW('  Id =  5 '), 'id=5');
});

test('ЛР-13: VALUES, проверка значений до запуска', () => {
  const q = p13.parse("INSERT INTO seat (seat_no, cls) VALUES ('1A', 'бизнес'), ('1C', DEFAULT);");
  assert.equal(q.kind, 'INSERT');
  assert.deepEqual(q.cols, ['seat_no', 'cls']);
  assert.deepEqual(q.tuples.map(t => t.vals), [["'1A'", "'бизнес'"], ["'1C'", 'DEFAULT']]);
  assert.match(p13.parse('INSERT INTO seat VALUES (1A)').err, /без кавычек/);
  assert.match(p13.parse('INSERT INTO seat VALUES ("1A")').err, /двойных кавычках/);
  assert.match(p13.parse("INSERT INTO seat VALUES ('1A)").err, /Не закрыта/);
  assert.match(p13.parse("INSERT INTO seat VALUES ('1A', )").err, /Пустое значение/);
  assert.match(p13.parse('INSERT INTO seat SELECT * FROM seat').err, /через VALUES/);
  assert.equal(p13.parse('SELECT count(*) FROM baggage').count, true);
  assert.deepEqual([p13.litVal("'it''s'"), p13.litVal('NULL'), p13.litVal('DEFAULT'), p13.litVal('42')], ["it's", null, undefined, 42]);
});

test('ЛР-13: какой столбец подсветить при отказе', () => {
  assert.equal(p13.badCol({constraint: 'ck_seat_no'}, 'seat'), 'seat_no');
  assert.equal(p13.badCol({constraint: 'passenger_pkey'}, 'passenger'), 'id');
  assert.match(p13.explain({code: '23503', constraint: 'fk_passenger_seat'}), /Сначала кресло/);
});

test('sha256 совпадает с node:crypto; код преподавателя проверяется по хэшу', () => {
  for (const s of ['', 'abc', 'boeing747', 'Ёжик в тумане '.repeat(20)]) assert.equal(sha256(s), createHash('sha256').update(s).digest('hex'));
  assert.equal(isTeacherCode('boeing747'), true);
  assert.equal(isTeacherCode(' boeing747 '), true);
  assert.equal(isTeacherCode('boeing'), false);
  assert.equal(isTeacherCode(''), false);
});

test('plural', () => {
  assert.deepEqual([1, 2, 5, 11, 21, 22, 112].map(n => plural(n, 'строка', 'строки', 'строк')), ['строка', 'строки', 'строк', 'строк', 'строка', 'строки', 'строк']);
});

test('подсветка SQL: ключевые слова только при верном написании, место ошибки', async () => {
  const {highlight, errorSpan} = await import('../common/sqlhl.js');
  const h = highlight("SELEKT * FROM passenger WHERE meal = 'x' -- c", ['passenger']);
  assert.match(h, /<span class="k">FROM<\/span>/);
  assert.doesNotMatch(h, /<span class="k">SELEKT/);
  assert.match(h, /<span class="t">passenger<\/span>/);
  assert.match(h, /<span class="s">&#39;x&#39;<\/span>/);
  assert.match(h, /<span class="c">-- c<\/span>/);
  const t = 'UPDATE passenger SET meal = 1 WHERE birth_yar > 2';
  assert.deepEqual(errorSpan(t, {message: 'column "birth_yar" does not exist'}), {from: 36, to: 45});
  assert.equal(errorSpan(t, {message: 'syntax error at or near "WHERE"'}).from, 30);
  assert.equal(errorSpan(t, 'Значение A9 без кавычек.'), null);
});
