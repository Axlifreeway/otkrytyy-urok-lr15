// Справочник SQL в карточке уровня: синтаксис с примерами на учебной таблице crew (её в базе нет —
// примеры не подсказывают решение, а показывают форму команды). Открывается на любом уровне,
// подсказкой не считается; на уровнях с lv.sel помечен «пригодится здесь» и раскрыт сразу.
import {esc} from './util.js';
import {highlight} from './sqlhl.js';

const CREW = 'Примеры — на таблицах crew (id, name, city, post, age, base_id) и base (id, city); в вашей базе их нет.';

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

export function sqlRef(groups, need = false) {
  const items = groups
    .flat()
    .map(([t, ex]) => `<div class="ref-i"><b>${esc(t)}</b><pre class="sqlhl ref">${highlight(ex, ['crew', 'base'])}</pre></div>`)
    .join('');
  return `<details class="sqlref"${need ? ' open' : ''}><summary>📖 Справочник SQL${need ? ' <span class="need">пригодится здесь</span>' : ''}</summary><p class="mu">${esc(CREW)}</p>${items}</details>`;
}
