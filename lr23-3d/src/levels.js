// ЛР-23 · «Индексы: создание и проверка по плану» — запрос без индекса, CREATE INDEX под запрос, индекс на внешний ключ,
// список индексов, лишний индекс. Таблица book — сразу 20 000 строк (common/libmain.js, base).
import {explains, readOf, byIndex} from '../../common/libcheck.js';

const ALLOW = ['SELECT', 'EXPLAIN', 'CREATE', 'DROP'];
// индексы таблицы book: [{name, def}]
const indexes = async c =>
  c.q(`SELECT indexname AS name, indexdef AS def FROM pg_indexes WHERE tablename = 'book' AND schemaname = 'library'`);
// индекс по одному столбцу col: «… (col)»
const onCol = (list, col) => list.find(i => new RegExp(`\\(${col}\\)$`).test(i.def));

export function levels(D) {
  const title = `Книга ${1000 + (D.seed % 7000)}`,
    au = (D.seed % 37) + 2,
    isbn = `978-5-${(D.seed * 37) % 20000}`;
  const Q1 = `SELECT * FROM book WHERE title = '${title}'`;
  return [
    // ═══════════════════════════════ часть 1 · запрос без индекса
    {
      key: 'before',
      title: 'Поиск без индекса',
      lab: 'ч. 1 · № 1–2 · план до индекса',
      text: `Читатели ищут книги по названию. Запрос — книга «${title}». Выполните EXPLAIN ANALYZE: запишите способ чтения, время и сколько строк прочитано зря (Rows Removed by Filter).`,
      q: 'Как СУБД ищет по названию без индекса?',
      goals: [`EXPLAIN ANALYZE ${Q1}`, 'Способ чтения, время, Rows Removed by Filter'],
      sol: [`EXPLAIN ANALYZE ${Q1}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const an = explains(c.trail, /\btitle\s*=/i).find(x => x.plan.analyze);
        if (!an) return explains(c.trail, /\btitle\s*=/i).length ? {wait: 'Нужен именно EXPLAIN ANALYZE — с временем выполнения.'} : null;
        return {ok: true, note: `${readOf(an.plan, 'book')} · ${an.plan.time} ms · зря прочитано ${an.plan.removed}`};
      },
      hint: 'EXPLAIN ANALYZE SELECT * FROM book WHERE title = …;',
      ok: 'Seq Scan: двадцать тысяч строк прочитано, чтобы найти одну.',
    },
    // ═══════════════════════════════ часть 2 · индекс
    {
      key: 'create',
      hard: true,
      title: 'Индекс под запрос',
      lab: 'сложный · № 3–4 · CREATE INDEX и план после',
      text: 'Создайте индекс по столбцу из условия запроса — имя по правилу ix_таблица_столбец — и повторите EXPLAIN ANALYZE того же запроса. В зале появится новый шкаф каталога.',
      q: 'Как сменится план после индекса?',
      goals: ['CREATE INDEX ix_book_title ON book (title)', `EXPLAIN ANALYZE ${Q1}`, 'Способ чтения и время — до и после'],
      ref: ['CREATE INDEX ix_book_title ON book (title)'],
      sol: ['CREATE INDEX ix_book_title ON book (title)', `EXPLAIN ANALYZE ${Q1}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const ix = onCol(await indexes(c), 'title');
        if (!ix) return null;
        if (ix.name !== 'ix_book_title')
          return {fail: `Индекс назван ${ix.name}, а по правилу — ix_book_title. Удалите его (DROP INDEX ${ix.name}) и создайте заново.`};
        const an = explains(c.trail, /\btitle\s*=/i)
          .filter(x => x.plan.analyze)
          .pop();
        if (!an || !byIndex(an.plan, 'book', 'ix_book_title'))
          return {wait: 'Индекс создан. Повторите EXPLAIN ANALYZE того же запроса — посмотрите, как изменился способ чтения.'};
        return {ok: true, note: `${readOf(an.plan, 'book')} · ${an.plan.time} ms`};
      },
      hint: 'CREATE INDEX ix_book_title ON book (title);',
      ok: 'Index Scan using ix_book_title: робот идёт к новому шкафу каталога и сразу к нужной полке.',
    },
    {
      key: 'fk',
      title: 'Индекс на внешний ключ',
      lab: 'ч. 2 · № 5–6 · отбор по внешнему ключу',
      text: `Для первичного ключа индекс СУБД создаёт сама, а для внешнего — нет. Создайте индекс на book.author_id (ix_book_author_id) и выполните EXPLAIN ANALYZE запроса «все книги автора ${au}» (author_id = ${au}).`,
      q: 'Пойдёт ли отбор по внешнему ключу через индекс?',
      goals: ['CREATE INDEX ix_book_author_id ON book (author_id)', `EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${au}`],
      ref: ['CREATE INDEX ix_book_author_id ON book (author_id)'],
      sol: ['CREATE INDEX ix_book_author_id ON book (author_id)', `EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${au}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const ix = onCol(await indexes(c), 'author_id');
        if (!ix) return null;
        if (ix.name !== 'ix_book_author_id') return {fail: `Индекс назван ${ix.name}, а по правилу — ix_book_author_id.`};
        const an = explains(c.trail, /\bauthor_id\s*=/i)
          .filter(x => x.plan.analyze)
          .pop();
        if (!an || !byIndex(an.plan, 'book', 'ix_book_author_id'))
          return {wait: 'Индекс создан. Теперь EXPLAIN ANALYZE запроса с отбором по author_id.'};
        return {ok: true, note: `${readOf(an.plan, 'book')} · ${an.plan.time} ms`};
      },
      hint: 'Bitmap Heap Scan — тоже по индексу: СУБД сначала собирает по индексу «карту» нужных страниц, потом читает их.',
      ok: 'Книг автора сотни — СУБД собрала их по индексу (Bitmap Index Scan) и прочитала только нужные страницы.',
    },
    {
      key: 'list',
      title: 'Список индексов',
      lab: 'ч. 2 · № 7 · \\d таблица',
      text: 'Покажите список индексов таблицы book — команда psql \\d book (или \\di). В списке — индекс первичного ключа и два ваших.',
      q: 'Какие индексы есть у book?',
      goals: ['\\d book', 'pk_book, ix_book_title, ix_book_author_id'],
      sol: ['\\d book'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const m = c.trail.find(x => x.kind === 'META' && !x.code && /ix_book_title/.test(x.out) && /ix_book_author_id/.test(x.out));
        return m ? {ok: true, note: 'pk_book · ix_book_title · ix_book_author_id'} : null;
      },
      hint: '\\d book — столбцы и индексы таблицы; \\di — все индексы.',
      ok: 'Индекс первичного ключа СУБД создала сама, два других — ваши.',
    },
    // ═══════════════════════════════ часть 3 · лишний индекс
    {
      key: 'extra',
      title: 'Лишний индекс',
      lab: 'ч. 3 · № 8–9 · создать и удалить',
      text: 'Создайте индекс по столбцу, по которому запросы не ищут, — например, по году (ix_book_year). Подумайте, почему он лишний (ответ — в протокол), и удалите его командой DROP INDEX.',
      q: 'Почему индекс «на всякий случай» — лишний?',
      goals: ['CREATE INDEX ix_book_… ON book (…) — столбец, по которому не ищут', 'DROP INDEX ix_book_…'],
      sol: ['CREATE INDEX ix_book_year ON book (year)', 'DROP INDEX ix_book_year'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const T = c.trail;
        const cr = T.filter(x => x.kind === 'CREATE' && !x.code && /index/i.test(x.sql));
        const mk = cr.map(x => /create\s+index\s+(\w+)\s+on\s+(?:\w+\.)?book\s*\(\s*(\w+)/i.exec(x.sql) || []).filter(m => m[1]);
        const odd = mk.find(m => !['title', 'author_id', 'id'].includes(m[2].toLowerCase()));
        if (!odd)
          return mk.length
            ? {fail: 'Этот столбец уже нужен запросам. Лишний индекс — по столбцу, по которому не ищут: year, pages, isbn.'}
            : null;
        const name = odd[1].toLowerCase();
        const dropped = T.some(x => x.kind === 'DROP' && !x.code && new RegExp(`\\b${name}\\b`, 'i').test(x.sql));
        if (!dropped)
          return {wait: `Индекс ${name} создан. Он только занимает место и замедляет INSERT и UPDATE — удалите: DROP INDEX ${name}.`};
        return (await indexes(c)).some(i => i.name === name) ? null : {ok: true, note: `CREATE INDEX ${name} · DROP INDEX`};
      },
      hint: 'Индекс создают под запрос, а не «на всякий случай»: каждый INSERT и UPDATE обновляет все индексы таблицы.',
      ok: 'Лишний шкаф каталога убран: индекс без запросов только занимал место и замедлял изменения.',
    },
    // ═══════════════════════════════ контрольный
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Поиск по ISBN',
      lab: 'сложный · контрольный · без подсказок',
      text: `Кафедра выдачи сканирует ISBN и ищет книгу. Запрос: isbn = '${isbn}'. Докажите планами, что поиск ускорился: EXPLAIN ANALYZE до индекса, индекс по правилу имени, EXPLAIN ANALYZE после.`,
      q: 'Как ускорить поиск по ISBN и доказать это?',
      goals: ['EXPLAIN ANALYZE — до', 'CREATE INDEX ix_book_isbn …', 'EXPLAIN ANALYZE — после: другой способ чтения'],
      sol: [
        `EXPLAIN ANALYZE SELECT * FROM book WHERE isbn = '${isbn}'`,
        'CREATE INDEX ix_book_isbn ON book (isbn)',
        `EXPLAIN ANALYZE SELECT * FROM book WHERE isbn = '${isbn}'`,
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const ex = explains(c.trail, /\bisbn\s*=/i).filter(x => x.plan.analyze);
        const ix = onCol(await indexes(c), 'isbn');
        if (!ix) return ex.length ? {wait: 'План «до» есть. Теперь индекс по isbn.'} : null;
        if (ix.name !== 'ix_book_isbn') return {fail: `Индекс назван ${ix.name}, а по правилу — ix_book_isbn.`};
        const before = ex.find(x => !byIndex(x.plan, 'book')),
          aft = ex.find(x => byIndex(x.plan, 'book', 'ix_book_isbn'));
        if (!before) return {fail: 'Не было плана «до» индекса — нечем доказать ускорение. Удалите индекс и начните с EXPLAIN ANALYZE.'};
        if (!aft) return {wait: 'Индекс есть. Повторите EXPLAIN ANALYZE — план «после».'};
        return {
          ok: true,
          note: `до: ${readOf(before.plan, 'book')} · ${before.plan.time} ms → после: ${readOf(aft.plan, 'book')} · ${aft.plan.time} ms`,
        };
      },
      ok: 'Доказано планами: до — Seq Scan по всем строкам, после — Index Scan сразу к нужной.',
    },
  ];
}
