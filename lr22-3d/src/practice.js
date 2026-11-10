// ЛР-22 · тренировка после уровней: бесконечные задания «условие словами → запрос → план».
// Студент сам пишет запрос, выполняет EXPLAIN ANALYZE и вписывает способ чтения, сколько строк нашлось
// и сколько отброшено фильтром. Проверка — по настоящему плану (lv.form, common/qlab.js): запрос с другим
// условием даёт другие числа — не пройдёт. В book к этому моменту 20 000 строк (id 1001…21000:
// автор n % 40 + 1, год 1950 + n % 75, pages 100 + n % 500, isbn '978-5-n').
const ALLOW = ['SELECT', 'EXPLAIN'];
const COLS = [
  {k: 'read', h: 'Способ чтения book', kind: 'read'},
  {k: 'rows', h: 'Найдено строк', kind: 'rows'},
  {k: 'rm', h: 'Отброшено фильтром', kind: 'rm'},
];
const pick = (a, r) => a[Math.floor(r() * a.length)];
const int = (a, b, r) => a + Math.floor(r() * (b - a + 1));

export function practice(D, st, r) {
  const T = [];
  const n = int(1, 20000, r);
  // условие → запрос; re — чем должен быть записан запрос студента (для проверки «выполнил сам»)
  const task = (title, what, where, re, hint) =>
    T.push({
      title,
      text: `Запрос: ${what}. Напишите его сами, выполните EXPLAIN ANALYZE и заполните строку таблицы по плану.`,
      q: 'Как СУБД прочитает book и сколько строк прочитает зря?',
      goals: ['Запрос — по условию', 'EXPLAIN ANALYZE', 'Способ чтения, найдено, отброшено — в таблицу'],
      form: {t: 'book', need: true, cols: COLS, rows: [{label: 'Запрос', what, sql: `SELECT * FROM book WHERE ${where}`, re}]},
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE ${where}`],
      hint,
    });
  const id = 1000 + n;
  task('Книга по номеру', `книга № ${id}`, `id = ${id}`, new RegExp(`\\bid\\s*=\\s*${id}\\b`), 'Условие по первичному ключу.');
  task('По названию', `книга «Book ${n}»`, `title = 'Book ${n}'`, new RegExp(`Book ${n}'`), "Текст — в одинарных кавычках: 'Book …'.");
  const a = int(1, 40, r);
  task(
    'Книги автора',
    `все книги автора № ${a}`,
    `author_id = ${a}`,
    new RegExp(`\\bauthor_id\\s*=\\s*${a}\\b`),
    'Номер автора — author_id.',
  );
  const y = int(1955, 2020, r),
    p = 100 + int(5, 45, r) * 10;
  task(
    'Год и толщина',
    `книги ${y} года толще ${p} страниц`,
    `year = ${y} AND pages > ${p}`,
    new RegExp(`\\b${y}\\b[\\s\\S]*\\b${p}\\b|\\b${p}\\b[\\s\\S]*\\b${y}\\b`),
    'Два условия — через AND; «толще» — строго больше.',
  );
  const k = 1000 + int(1, 19000, r),
    w = pick([5, 10, 20, 50], r);
  task(
    'Узкий диапазон номеров',
    `книги с номерами от ${k} до ${k + w} включительно`,
    `id BETWEEN ${k} AND ${k + w}`,
    new RegExp(`\\b${k}\\b[\\s\\S]*\\b${k + w}\\b`),
    'BETWEEN включает оба края.',
  );
  const big = 1000 + int(2, 6, r) * 500;
  task(
    'Почти все номера',
    `книги с номером больше ${big}`,
    `id > ${big}`,
    new RegExp(`\\bid\\s*>\\s*${big}\\b`),
    'Строк будет много — подумайте, нужен ли тут индекс.',
  );
  const p1 = 100 + int(0, 40, r) * 10;
  task(
    'Диапазон страниц',
    `книги от ${p1} до ${p1 + 30} страниц включительно`,
    `pages BETWEEN ${p1} AND ${p1 + 30}`,
    new RegExp(`\\b${p1}\\b[\\s\\S]*\\b${p1 + 30}\\b`),
    'pages BETWEEN … AND …',
  );
  const pre = `Book ${int(1, 9, r)}${int(0, 9, r)}`;
  task(
    'Начало названия',
    `книги, название которых начинается на «${pre}»`,
    `title LIKE '${pre}%'`,
    new RegExp(`${pre}%`),
    "LIKE '…%' — процент: «дальше что угодно».",
  );
  const isbn = `978-5-${int(1, 20000, r)}`;
  task('По ISBN', `книга с ISBN ${isbn}`, `isbn = '${isbn}'`, new RegExp(isbn), 'isbn — текст, в кавычках.');
  const t = pick(T, r);
  return {...t, allow: ALLOW, star: true, check: 'form', cmds: 'Запрос с EXPLAIN ANALYZE, потом — таблица и «Проверить таблицу»'};
}
