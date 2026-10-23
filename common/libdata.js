// «Городская библиотека» — одна база на ЛР-21–24: авторы (author), книги (book), читатели (reader), выдачи (loan).
// Таблицы — в своей схеме library (как в задании: у студента своя схема); search_path = library, public.
// Вариант — номер студента: у соседа другие книги, читатели и выдачи.
//   ЛР-21 меняет данные и структуру; ЛР-22 и ЛР-23 наполняют book до 20 000 строк и смотрят планы;
//   ЛР-24 — роли, права и копия схемы library.
import {rng} from './rng.js';
export {rng};

export const SCHEMA_NAME = 'library';
export const YEAR = 2026;
// авторы: 40 — чтобы отбор по одному автору среди 20 000 книг шёл по индексу (≈ 2,5 % строк)
const AUTHORS = [
  ['Пушкин А. С.', 'Россия'],
  ['Лермонтов М. Ю.', 'Россия'],
  ['Гоголь Н. В.', 'Россия'],
  ['Толстой Л. Н.', 'Россия'],
  ['Достоевский Ф. М.', 'Россия'],
  ['Чехов А. П.', 'Россия'],
  ['Тургенев И. С.', 'Россия'],
  ['Гончаров И. А.', 'Россия'],
  ['Островский А. Н.', 'Россия'],
  ['Лесков Н. С.', 'Россия'],
  ['Бунин И. А.', 'Россия'],
  ['Куприн А. И.', 'Россия'],
  ['Булгаков М. А.', 'Россия'],
  ['Паустовский К. Г.', 'Россия'],
  ['Шолохов М. А.', 'Россия'],
  ['Платонов А. П.', 'Россия'],
  ['Ершов П. П.', 'Россия'],
  ['Бажов П. П.', 'Россия'],
  ['Мамин-Сибиряк Д. Н.', 'Россия'],
  ['Крылов И. А.', 'Россия'],
  ['Жуковский В. А.', 'Россия'],
  ['Некрасов Н. А.', 'Россия'],
  ['Тютчев Ф. И.', 'Россия'],
  ['Фет А. А.', 'Россия'],
  ['Блок А. А.', 'Россия'],
  ['Есенин С. А.', 'Россия'],
  ['Маяковский В. В.', 'Россия'],
  ['Ахматова А. А.', 'Россия'],
  ['Цветаева М. И.', 'Россия'],
  ['Пастернак Б. Л.', 'Россия'],
  ['Жюль Верн', 'Франция'],
  ['Гюго В.', 'Франция'],
  ['Дюма А.', 'Франция'],
  ['Диккенс Ч.', 'Англия'],
  ['Конан Дойл А.', 'Англия'],
  ['Стивенсон Р. Л.', 'Англия'],
  ['Твен М.', 'США'],
  ['Лондон Дж.', 'США'],
  ['Андерсен Х. К.', 'Дания'],
  ['Сервантес М.', 'Испания'],
];
const W1 = ['Тихий', 'Северный', 'Старый', 'Белый', 'Дальний', 'Последний', 'Зимний', 'Синий', 'Тайный', 'Весенний', 'Золотой', 'Ночной'];
const W2 = ['берег', 'сад', 'город', 'остров', 'дом', 'лес', 'путь', 'маяк', 'перевал', 'двор', 'мост', 'край'];
const SURN = [
  'Иванов',
  'Петров',
  'Смирнов',
  'Кузнецов',
  'Попов',
  'Соколов',
  'Лебедев',
  'Козлов',
  'Новиков',
  'Морозов',
  'Волков',
  'Егоров',
  'Павлов',
  'Орлов',
  'Макаров',
  'Титов',
  'Зуев',
  'Фомин',
  'Котов',
  'Быков',
];
const INI = 'АБВГДЕИКЛМНОПРСТ';
const pad = n => String(n).padStart(2, '0');
export const iso = (m, d) => `${YEAR}-${pad(m)}-${pad(d)}`;

export function makeData(seed) {
  const r = rng(seed * 7919 + 2121);
  const AU = AUTHORS.map(([full_name, country], i) => ({id: i + 1, full_name, country}));
  // книги: 60 штук, названия «Прилагательное существительное» без повторов
  const titles = new Set();
  const BK = [];
  for (let i = 1; i <= 60; i++) {
    let t;
    do t = `${r.pick(W1)} ${r.pick(W2)}`;
    while (titles.has(t));
    titles.add(t);
    BK.push({
      id: i,
      title: t,
      author_id: r.int(1, 12),
      year: r.int(1960, 2025),
      pages: r.int(8, 64) * 10,
      isbn: `978-5-${r.int(1000, 9999)}-${r.int(1000, 9999)}-${r.int(0, 9)}`,
    });
  }
  // читатели: 14, у троих не указан телефон
  const RD = [];
  const used = new Set();
  for (let i = 1; i <= 14; i++) {
    let n;
    do n = `${r.pick(SURN)}${r() < 0.5 ? 'а' : ''} ${INI[r.int(0, 15)]}. ${INI[r.int(0, 15)]}.`;
    while (used.has(n));
    used.add(n);
    RD.push({
      id: i,
      full_name: n,
      card: `Б-${r.int(10000, 99999)}`,
      phone: r() < 0.2 ? null : `+7 9${r.int(10, 99)} ${r.int(100, 999)}-${r.int(10, 99)}-${r.int(10, 99)}`,
    });
  }
  // выдачи: 30, часть книг ещё не вернули (returned пуст)
  const LN = [];
  for (let i = 1; i <= 30; i++) {
    const m = r() < 0.5 ? 9 : 10,
      d = r.int(1, m === 9 ? 30 : 20);
    LN.push({
      id: i,
      book_id: r.int(1, BK.length),
      reader_id: r.int(1, RD.length),
      taken: iso(m, d),
      returned: r() < 0.35 ? null : iso(10, Math.min(21, d + r.int(3, 15))),
    });
  }
  // автор, у которого есть книги (его нельзя удалить), и редкий год для поиска
  const busy = BK[r.int(0, BK.length - 1)].author_id;
  return {seed, AU, BK, RD, LN, busy, role: `s${pad(seed % 100)}_reader`};
}

export const SCHEMA = `
DROP SCHEMA IF EXISTS library CASCADE;
DROP SCHEMA IF EXISTS library_old CASCADE;
CREATE SCHEMA library;
SET search_path TO library, public;
CREATE TABLE author (
  id        integer     CONSTRAINT pk_author PRIMARY KEY,
  full_name varchar(40) NOT NULL,
  country   varchar(20) NOT NULL
);
CREATE TABLE book (
  id        integer     CONSTRAINT pk_book PRIMARY KEY,
  title     varchar(60) NOT NULL,
  author_id integer     NOT NULL CONSTRAINT fk_book_author REFERENCES author (id),
  year      integer,
  pages     integer     NOT NULL,
  isbn      varchar(20)
);
CREATE TABLE reader (
  id        integer     CONSTRAINT pk_reader PRIMARY KEY,
  full_name varchar(60) NOT NULL,
  card      varchar(10) NOT NULL CONSTRAINT uq_reader_card UNIQUE,
  phone     varchar(20)
);
CREATE TABLE loan (
  id        integer CONSTRAINT pk_loan PRIMARY KEY,
  book_id   integer NOT NULL CONSTRAINT fk_loan_book REFERENCES book (id),
  reader_id integer NOT NULL CONSTRAINT fk_loan_reader REFERENCES reader (id),
  taken     date    NOT NULL,
  returned  date
);`;
export const lit = v =>
  v === null || v === undefined
    ? 'NULL'
    : typeof v === 'number' || typeof v === 'boolean'
      ? String(v)
      : "'" + String(v).replace(/'/g, "''") + "'";
const rows = (t, cols, list) =>
  `INSERT INTO ${t} (${cols.join(', ')}) VALUES ` + list.map(x => `(${cols.map(c => lit(x[c])).join(', ')})`).join(',\n') + ';\n';
// роли живут вне схемы — их убирают отдельно (ЛР-24)
const dropRole = role =>
  `DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${role}') THEN EXECUTE 'DROP OWNED BY ${role}'; EXECUTE 'DROP ROLE ${role}'; END IF; END $$;\n`;
export function baseSql(D) {
  return (
    dropRole(D.role) +
    SCHEMA +
    '\n' +
    rows('author', ['id', 'full_name', 'country'], D.AU) +
    rows('book', ['id', 'title', 'author_id', 'year', 'pages', 'isbn'], D.BK) +
    rows('reader', ['id', 'full_name', 'card', 'phone'], D.RD) +
    rows('loan', ['id', 'book_id', 'reader_id', 'taken', 'returned'], D.LN) +
    'ANALYZE;\n'
  );
}
// схема library заново — то, что вернёт восстановление из копии в ЛР-24 (без DROP: старая схема переименована),
// с правами, которые к этому моменту выданы роли
export function restoreSql(D) {
  return (
    SCHEMA.replace(/^[\s\S]*?CREATE SCHEMA library;/, 'CREATE SCHEMA library;') +
    '\n' +
    rows('library.author', ['id', 'full_name', 'country'], D.AU) +
    rows('library.book', ['id', 'title', 'author_id', 'year', 'pages', 'isbn'], D.BK) +
    rows('library.reader', ['id', 'full_name', 'card', 'phone'], D.RD) +
    rows('library.loan', ['id', 'book_id', 'reader_id', 'taken', 'returned'], D.LN) +
    `GRANT USAGE ON SCHEMA library TO ${D.role};\nGRANT SELECT ON library.book TO ${D.role};\nGRANT SELECT (full_name, id) ON library.reader TO ${D.role};\n`
  );
}
// 20 000 книг — как в образце задания ЛР-22: INSERT … SELECT … FROM generate_series
export const FILL = `INSERT INTO book (id, title, author_id, year, pages, isbn)
SELECT 1000 + n, 'Книга ' || n, n % 40 + 1, 1950 + n % 75, 100 + n % 500, '978-5-' || n
FROM generate_series(1, 20000) AS g(n)`;
export const TABLES = {author: 'id', book: 'id', reader: 'id', loan: 'id'};
export const COLS = {
  author: ['id', 'full_name', 'country'],
  book: ['id', 'title', 'author_id', 'year', 'pages', 'isbn'],
  reader: ['id', 'full_name', 'card', 'phone'],
  loan: ['id', 'book_id', 'reader_id', 'taken', 'returned'],
};
// снимок таблицы для сцены и проверки: даты — текстом; книг на полках — не больше 240 (20 000 в зал не помещаются)
export const sel = t =>
  t === 'book'
    ? `SELECT ${COLS.book.join(', ')} FROM book ORDER BY id LIMIT 240`
    : `SELECT ${COLS[t].map(c => (c === 'taken' || c === 'returned' ? `${c}::text AS ${c}` : c)).join(', ')} FROM ${t}`;
export const authorName = (D, id) => (D.AU.find(a => a.id === id) || {}).full_name;
