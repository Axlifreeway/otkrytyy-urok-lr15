// Справочник SQL в карточке уровня: синтаксис с примерами на учебной таблице crew (её в базе нет —
// примеры не подсказывают решение, а показывают форму команды). Открывается на любом уровне,
// подсказкой не считается; на уровнях с lv.sel помечен «пригодится здесь» и раскрыт сразу.
import {esc} from './util.js';
import {highlight} from './sqlhl.js';

const CREW =
  'Примеры — на таблицах crew (id, name, city, post, age, base_id), base (id, city, region_id) и region (id, title); в вашей базе их нет.';

export const SELECT_REF = [
  ['Посмотреть строки — SELECT ничего не меняет', "SELECT id, name, city FROM crew WHERE city = 'Казань';"],
  ['Все столбцы и сколько строк', 'SELECT * FROM crew;\nSELECT count(*) FROM crew;'],
  [
    'Два условия сразу: AND — оба верны, OR — хотя бы одно',
    "SELECT * FROM crew WHERE post = 'пилот' AND age >= 40;\nSELECT * FROM crew WHERE city = 'Казань' OR city = 'Омск';",
  ],
  ['Сравнения', 'age = 30   age <> 30   age > 30   age >= 30   age < 30   age <= 30'],
  ['Пустое значение — только IS NULL (не «= NULL»)', 'SELECT * FROM crew WHERE base_id IS NULL;'],
];
export const WHERE_REF = [
  [
    'Текст начинается с… — LIKE и знак %',
    "SELECT * FROM crew WHERE name LIKE 'Ив%';   -- Иванов, Ивлев…\nSELECT * FROM crew WHERE name LIKE '%ов';   -- заканчивается на «ов»",
  ],
  ['Одно из нескольких значений — IN (список)', "SELECT * FROM crew WHERE city IN ('Казань', 'Омск', 'Тула');"],
  [
    'Список из другой таблицы — IN (SELECT …)',
    "-- у кого база в Сочи: id баз берём запросом в скобках\nSELECT * FROM crew WHERE base_id IN (SELECT id FROM base WHERE city = 'Сочи');",
  ],
  ['AND и OR вместе — ставьте скобки', "… WHERE age > 30 AND (city = 'Казань' OR city = 'Омск')"],
];
export const INSERT_REF = [
  ['Вставить строку', "INSERT INTO crew (id, name, city) VALUES (7, 'Орлова', 'Тула');"],
  ['Несколько строк одной командой', "INSERT INTO crew (id, name) VALUES (8, 'Ким'), (9, 'Лебедев');"],
  [
    'Неизвестно — NULL, по умолчанию — DEFAULT (без кавычек)',
    "INSERT INTO crew (id, name, age, post) VALUES (10, 'Сафин', NULL, DEFAULT);",
  ],
];
export const UPDATE_REF = [
  ['Изменить — UPDATE … SET … WHERE', "UPDATE crew SET post = 'старший' WHERE id = 7;"],
  ['Новое значение из старого', "UPDATE crew SET age = age + 1 WHERE city = 'Тула';"],
  ['Удалить строки', 'DELETE FROM crew WHERE base_id IS NULL;'],
  [
    'Сначала прицелиться: тот же WHERE в SELECT',
    "SELECT * FROM crew WHERE city = 'Тула';   -- кого заденет?\nUPDATE crew SET age = age + 1 WHERE city = 'Тула';",
  ],
];

export const ORDER_REF = [
  ['Диапазон — BETWEEN (обе границы включаются)', 'SELECT name, age FROM crew WHERE age BETWEEN 30 AND 40;'],
  ['Порядок строк — ORDER BY, по убыванию — DESC', 'SELECT name, city, age FROM crew ORDER BY city, age DESC;'],
  ['Первые строки — LIMIT', 'SELECT name, age FROM crew ORDER BY age DESC LIMIT 3;'],
  ['Без повторов — DISTINCT', 'SELECT DISTINCT city FROM crew;'],
];
export const ALTER_REF = [
  ['Ограничение к готовой таблице (имя: pk_, fk_, uq_, ck_)', 'ALTER TABLE crew ADD CONSTRAINT pk_crew PRIMARY KEY (id);'],
  [
    'Внешний ключ и поведение при удалении',
    'ALTER TABLE crew ADD CONSTRAINT fk_crew_base\n  FOREIGN KEY (base_id) REFERENCES base (id) ON DELETE RESTRICT;',
  ],
  [
    'Отказ? Найти мешающие строки',
    '-- DETAIL: Key (base_id)=(9) is not present in table "base"\nSELECT id, name, base_id FROM crew WHERE base_id = 9;',
  ],
  [
    'Ключ выдаёт СУБД',
    "ALTER TABLE crew ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;\nALTER TABLE crew ALTER COLUMN id RESTART WITH 31;   -- наибольший + 1\nINSERT INTO crew (name) VALUES ('Ким');   -- id не указываем",
  ],
];
export const JOIN_REF = [
  ['Две таблицы: условие — по ключам связи', 'SELECT c.name, b.city\nFROM crew c\nJOIN base b ON b.id = c.base_id;'],
  [
    'Псевдонимы: crew c, base b — дальше c.name, b.city',
    "SELECT c.name, b.city FROM crew c JOIN base b ON b.id = c.base_id WHERE b.city = 'Сочи';",
  ],
  [
    'Три таблицы — каждая своим условием',
    'SELECT c.name, b.city, r.title\nFROM crew c\nJOIN base b ON b.id = c.base_id\nJOIN region r ON r.id = b.region_id;',
  ],
  [
    '«Кто ни разу не…» — LEFT JOIN и IS NULL',
    '-- базы, где нет ни одного сотрудника\nSELECT b.city\nFROM base b\nLEFT JOIN crew c ON c.base_id = b.id\nWHERE c.id IS NULL;',
  ],
  ['Без условия соединения — каждая строка с каждой', 'SELECT c.name, b.city FROM crew c, base b;   -- строк: crew × base'],
];

export function sqlRef(groups, need = false) {
  const items = groups
    .flat()
    .map(([t, ex]) => `<div class="ref-i"><b>${esc(t)}</b><pre class="sqlhl ref">${highlight(ex, ['crew', 'base', 'region'])}</pre></div>`)
    .join('');
  return `<details class="sqlref"${need ? ' open' : ''}><summary>📖 Справочник SQL${need ? ' <span class="need">пригодится здесь</span>' : ''}</summary><p class="mu">${esc(CREW)}</p>${items}</details>`;
}
