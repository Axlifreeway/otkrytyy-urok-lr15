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
  [
    'Пустое значение — только IS NULL (не «= NULL»)',
    'SELECT * FROM crew WHERE base_id IS NULL;       -- пусто\nSELECT * FROM crew WHERE base_id IS NOT NULL;   -- заполнено',
  ],
  ['Вычисляемый столбец и его имя — AS', 'SELECT name, age + 5 AS age_later FROM crew;   -- возраст через 5 лет'],
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
export const GROUP_REF = [
  ['Итог по всей таблице — одно число', "SELECT count(*), sum(age), round(avg(age)) FROM crew WHERE city = 'Омск';"],
  ['count(*) и count(столбец)', 'SELECT count(*), count(base_id) FROM crew;   -- разница — строки, где base_id пуст'],
  ['Итог по группам — GROUP BY', 'SELECT city, count(*), max(age)\nFROM crew\nGROUP BY city;   -- столбец группы — и в SELECT'],
  ['Группа по названию из справочника', 'SELECT b.city, count(*)\nFROM crew c\nJOIN base b ON b.id = c.base_id\nGROUP BY b.city;'],
  [
    'Отбор групп — HAVING (после GROUP BY)',
    "SELECT post, count(*)\nFROM crew\nWHERE city <> 'Омск'      -- строки — до группировки\nGROUP BY post\nHAVING count(*) >= 3;     -- группы — после",
  ],
  ['Порядок вычисления', 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY'],
];
export const SUBQ_REF = [
  ['Подзапрос вместо числа', 'SELECT name, age FROM crew\nWHERE age > (SELECT avg(age) FROM crew);'],
  ['Подзапрос со списком — IN', "SELECT name FROM crew\nWHERE base_id IN (SELECT id FROM base WHERE city = 'Сочи');"],
  [
    '«Ни разу не…» — NOT EXISTS',
    '-- базы без сотрудников\nSELECT b.city FROM base b\nWHERE NOT EXISTS (SELECT 1 FROM crew c WHERE c.base_id = b.id);',
  ],
  [
    'NOT IN и пустые значения',
    '-- если в списке есть NULL, NOT IN не вернёт ни одной строки:\nSELECT city FROM base WHERE id NOT IN (SELECT base_id FROM crew WHERE base_id IS NOT NULL);',
  ],
  ['Подзапрос на месте таблицы', 'SELECT avg(n) FROM (\n  SELECT city, count(*) AS n FROM crew GROUP BY city\n) AS t;'],
];
export const TX_REF = [
  [
    'Транзакция: всё или ничего',
    "BEGIN;\nUPDATE crew SET age = age + 1 WHERE city = 'Тула';\nSELECT name, age FROM crew WHERE city = 'Тула';   -- уже видно\nCOMMIT;   -- или ROLLBACK;",
  ],
  ['Передумали — ROLLBACK', 'BEGIN;\nDELETE FROM crew;   -- забыли WHERE\nROLLBACK;          -- строки на месте'],
  [
    'Ошибка внутри транзакции',
    'BEGIN;\nUPDATE crew SET age = 31 WHERE id = 7;\nINSERT INTO crew (id, name) VALUES (8, NULL);   -- ERROR: not-null\nSELECT * FROM crew;   -- ERROR: current transaction is aborted\nROLLBACK;             -- отменено и верное изменение',
  ],
  [
    'Родитель и ссылка на него — в одной транзакции',
    "BEGIN;\nINSERT INTO base (id, city) VALUES (5, 'Тула');\nINSERT INTO crew (id, name, base_id) VALUES (12, 'Ким', 5);\nCOMMIT;",
  ],
];
export const PLAN_REF = [
  ['План без выполнения — EXPLAIN', "EXPLAIN SELECT * FROM crew WHERE name = 'Ким';\n-- Seq Scan on crew …   Filter: (name = 'Ким')"],
  [
    'План и время — EXPLAIN ANALYZE',
    'EXPLAIN ANALYZE SELECT * FROM crew WHERE id = 7;\n-- Index Scan using pk_crew on crew …\n-- Execution Time: 0.041 ms',
  ],
  [
    'Много строк одной командой',
    "INSERT INTO crew (id, name, base_id)\nSELECT 100 + n, 'Имя ' || n, n % 5 + 1\nFROM generate_series(1, 20000) AS g(n);",
  ],
  [
    'Как читать план',
    'Seq Scan — подряд все строки; Index Scan — по индексу сразу к нужным;\nRows Removed by Filter — прочитано зря; план читается снизу вверх',
  ],
];
export const INDEX_REF = [
  ['Создать индекс (имя: ix_таблица_столбец)', 'CREATE INDEX ix_crew_name ON crew (name);'],
  ['Проверить планом', "EXPLAIN ANALYZE SELECT * FROM crew WHERE name = 'Ким';\n-- Index Scan using ix_crew_name on crew …"],
  ['Индекс на внешний ключ', 'CREATE INDEX ix_crew_base_id ON crew (base_id);'],
  ['Список индексов таблицы (psql)', '\\d crew\n\\di'],
  ['Удалить индекс', 'DROP INDEX ix_crew_city;'],
];
export const ROLE_REF = [
  ['Роль с правом входа', "CREATE ROLE crew_reader LOGIN PASSWORD 'Rd-2026-x';"],
  ['Права: схема и таблицы', 'GRANT USAGE ON SCHEMA crewdb TO crew_reader;\nGRANT SELECT ON crewdb.crew, crewdb.base TO crew_reader;'],
  ['Подключиться под ролью и вернуться (psql)', '\\c crewdb crew_reader\n\\c crewdb postgres'],
  ['Отобрать право', 'REVOKE SELECT ON crewdb.base FROM crew_reader;'],
  ['Кто что может (psql)', '\\dp\n\\du'],
];
export const DUMP_REF = [
  ['Копия схемы в файл (командная строка)', 'pg_dump -U postgres -d crewdb -n crewdb -f kopiya.sql'],
  ['Переименовать схему', 'ALTER SCHEMA crewdb RENAME TO crewdb_old;'],
  ['Восстановить из файла', 'psql -U postgres -d crewdb -f kopiya.sql'],
  [
    'Сравнить и удалить старую',
    'SELECT count(*) FROM crewdb.crew;\nSELECT count(*) FROM crewdb_old.crew;\nDROP SCHEMA crewdb_old CASCADE;',
  ],
];

export function sqlRef(groups, need = false) {
  const items = groups
    .flat()
    .map(([t, ex]) => `<div class="ref-i"><b>${esc(t)}</b><pre class="sqlhl ref">${highlight(ex, ['crew', 'base', 'region'])}</pre></div>`)
    .join('');
  return `<details class="sqlref"${need ? ' open' : ''}><summary>📖 Справочник SQL${need ? ' <span class="need">пригодится здесь</span>' : ''}</summary><p class="mu">${esc(CREW)}</p>${items}</details>`;
}
