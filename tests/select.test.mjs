// Разбор SELECT и сверка результата с ответом (ЛР-15, ЛР-16).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseSelect, compareResult, kindOf} from '../common/select.js';

test('kindOf: первое слово команды', () => {
  assert.equal(kindOf('  -- вопрос\n select 1'), 'SELECT');
  assert.equal(kindOf('ALTER TABLE x ADD CONSTRAINT …'), 'ALTER');
  assert.equal(kindOf(''), '');
});

test('parseSelect: части запроса', () => {
  const p = parseSelect(
    "SELECT DISTINCT city, seat FROM passenger WHERE city IN ('Омск', 'Ишим') AND x = 1 ORDER BY city, seat DESC LIMIT 5;",
  );
  assert.equal(p.distinct, true);
  assert.deepEqual(p.cols, ['city', 'seat']);
  assert.equal(p.where, "city IN ('Омск', 'Ишим') AND x = 1");
  assert.equal(p.order, 'city, seat DESC');
  assert.equal(p.limit, 5);
  assert.deepEqual(p.tables, [{t: 'passenger', alias: 'passenger', kind: 'from'}]);
  assert.equal(p.star, false);
  assert.equal(parseSelect('SELECT * FROM baggage').star, true);
  assert.equal(parseSelect('SELECT count(*) FROM baggage').star, false);
  assert.equal(parseSelect('SELECT p.* FROM passenger p').star, true);
  assert.ok(parseSelect('SELECT 1').err);
  // WHERE подзапроса не путается с внешним
  assert.equal(
    parseSelect('SELECT tag FROM baggage WHERE passenger_id IN (SELECT id FROM passenger WHERE city = 1)').where.includes('SELECT id'),
    true,
  );
});

test('parseSelect: соединения и псевдонимы', () => {
  const p = parseSelect(
    'SELECT b.tag, p.full_name FROM baggage b JOIN passenger p ON p.id = b.passenger_id LEFT JOIN loyalty AS l ON l.tier = p.loyalty WHERE l.tier IS NULL',
  );
  assert.deepEqual(
    p.tables.map(x => [x.t, x.alias, x.kind]),
    [
      ['baggage', 'b', 'from'],
      ['passenger', 'p', 'inner'],
      ['loyalty', 'l', 'left'],
    ],
  );
  assert.equal(p.left, true);
  assert.equal(p.cross, false);
  const q = parseSelect('SELECT tag, full_name FROM baggage JOIN passenger ON passenger.id = baggage.passenger_id');
  assert.deepEqual(
    q.tables.map(x => x.alias),
    ['baggage', 'passenger'],
  );
  assert.equal(parseSelect('SELECT b.tag, p.full_name FROM baggage b, passenger p').cross, true);
  assert.equal(parseSelect('SELECT b.tag FROM baggage b CROSS JOIN passenger p').cross, true);
  assert.equal(parseSelect('SELECT b.tag FROM baggage b, passenger p WHERE p.id = b.passenger_id').cross, false);
});

test('compareResult: строки, столбцы, порядок', () => {
  const exp = {
    fields: ['full_name', 'seat'],
    rows: [
      ['Иванов', '1A'],
      ['Петрова', '2C'],
    ],
  };
  // те же строки в другом порядке столбцов и строк
  assert.equal(
    compareResult(
      {
        fields: ['seat', 'full_name'],
        rows: [
          ['2C', 'Петрова'],
          ['1A', 'Иванов'],
        ],
      },
      exp,
    ).ok,
    true,
  );
  // порядок важен
  const r = compareResult(
    {
      fields: ['full_name', 'seat'],
      rows: [
        ['Петрова', '2C'],
        ['Иванов', '1A'],
      ],
    },
    exp,
    {order: true},
  );
  assert.equal(r.ok, false);
  assert.match(r.msg, /ORDER BY/);
  // порядок по столбцу: равные значения — в любом порядке
  const w = {
    fields: ['tag', 'w'],
    rows: [
      ['a', 9],
      ['b', 7],
      ['c', 7],
    ],
  };
  assert.equal(
    compareResult(
      {
        fields: ['tag', 'w'],
        rows: [
          ['a', 9],
          ['c', 7],
          ['b', 7],
        ],
      },
      w,
      {order: ['w']},
    ).ok,
    true,
  );
  assert.equal(
    compareResult(
      {
        fields: ['tag', 'w'],
        rows: [
          ['c', 7],
          ['a', 9],
          ['b', 7],
        ],
      },
      w,
      {order: ['w']},
    ).ok,
    false,
  );
  // лишний столбец
  const c = compareResult({fields: ['full_name', 'seat', 'city'], rows: []}, exp);
  assert.equal(c.cols, true);
  assert.match(c.msg, /лишние: city/);
  // лишняя строка, другие имена столбцов (псевдонимы) — сверка по порядку
  const x = compareResult(
    {
      fields: ['ФИО', 'место'],
      rows: [
        ['Иванов', '1A'],
        ['Петрова', '2C'],
        ['Сидоров', '3B'],
      ],
    },
    exp,
  );
  assert.equal(x.ok, false);
  assert.match(x.msg, /Получено строк: 3, а в ответе на вопрос их 2.*Лишние \(1\): Сидоров · 3B/);
  // NULL и числа
  assert.equal(compareResult({fields: ['a'], rows: [[null], [5]]}, {fields: ['a'], rows: [[5], [null]]}).ok, true);
  assert.equal(compareResult({fields: ['a'], rows: [[null]]}, {fields: ['a'], rows: [['NULL']]}).ok, false);
});
