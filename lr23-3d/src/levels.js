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
  const low = title.toLowerCase();
  // EXPLAIN ANALYZE запроса cond: способ чтения book в отметку; want — каким он должен быть (иначе — подсказка)
  const plan1 = (cond, want, miss) => c => {
    const an = explains(c.trail, cond)
      .filter(x => x.plan.analyze)
      .pop();
    if (!an) return explains(c.trail, cond).length ? {wait: 'Нужен именно EXPLAIN ANALYZE — с временем выполнения.'} : null;
    if (want && !want(an.plan)) return {wait: miss};
    return {ok: true, note: `${an.plan.sort ? 'Sort ← ' : ''}${readOf(an.plan, 'book')} · ${an.plan.time} ms`};
  };
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
      goals: ['Индекс по столбцу из условия — имя по правилу', 'EXPLAIN ANALYZE того же запроса', 'Способ чтения и время — до и после'],
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
      key: 'order',
      title: 'Индекс и сортировка',
      lab: 'ч. 2 · ORDER BY по индексу',
      text: 'Каталог печатает первые 10 книг по алфавиту: ORDER BY title LIMIT 10. Выполните EXPLAIN ANALYZE — понадобилась ли сортировка?',
      q: 'Помогает ли индекс сортировке?',
      goals: ['EXPLAIN ANALYZE SELECT * FROM book ORDER BY title LIMIT 10'],
      sol: ['EXPLAIN ANALYZE SELECT * FROM book ORDER BY title LIMIT 10'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: plan1(/order\s+by\s+title\b/i),
      hint: 'EXPLAIN ANALYZE SELECT * FROM book ORDER BY title LIMIT 10;',
      ok: 'Index Scan using ix_book_title без узла Sort: в индексе названия уже лежат по алфавиту — СУБД взяла первые десять.',
    },
    {
      key: 'func',
      title: 'Функция над столбцом',
      lab: 'ч. 2 · когда индекс не помогает',
      text: `Поиск без учёта регистра: lower(title) = '${low}'. Индекс ix_book_title есть — EXPLAIN ANALYZE покажет, пригодился ли он.`,
      q: 'Работает ли индекс, если столбец обёрнут функцией?',
      goals: [`EXPLAIN ANALYZE SELECT * FROM book WHERE lower(title) = '${low}'`],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE lower(title) = '${low}'`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Как СУБД прочитает book?',
        choices: [
          {k: 'idx', t: 'по ix_book_title — столбец тот же'},
          {k: 'seq', t: 'подряд — в индексе title, а не lower(title)'},
        ],
        answer: 'seq',
      },
      verify: plan1(/lower\s*\(\s*title\s*\)/i),
      hint: `… WHERE lower(title) = '${low}'`,
      ok: 'Seq Scan: в индексе лежат значения title, а условие — на lower(title). Индекс работает, только если условие на сам столбец.',
    },
    {
      key: 'fk',
      title: 'Индекс на внешний ключ',
      lab: 'ч. 2 · № 5–6 · отбор по внешнему ключу',
      text: `Для первичного ключа индекс СУБД создаёт сама, а для внешнего — нет. Создайте индекс на book.author_id (ix_book_author_id) и выполните EXPLAIN ANALYZE запроса «все книги автора ${au}» (author_id = ${au}).`,
      q: 'Пойдёт ли отбор по внешнему ключу через индекс?',
      goals: ['Индекс ix_book_author_id', 'EXPLAIN ANALYZE книг автора'],
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
    {
      key: 'uniq',
      title: 'UNIQUE — тоже индекс',
      lab: 'ч. 2 · индекс ограничения',
      text: 'Покажите \\d reader. У номера билета — ограничение UNIQUE (uq_reader_card). Найдите его в списке индексов: СУБД проверяет уникальность по индексу.',
      q: 'Как СУБД быстро проверяет уникальность?',
      goals: ['\\d reader', 'uq_reader_card — в списке индексов'],
      sol: ['\\d reader'],
      check: 'tx',
      allow: ALLOW,
      verify: c =>
        c.trail.some(x => x.kind === 'META' && !x.code && /uq_reader_card/.test(x.out))
          ? {ok: true, note: 'pk_reader · uq_reader_card'}
          : null,
      hint: '\\d reader — столбцы, индексы и ограничения таблицы.',
      ok: 'PRIMARY KEY и UNIQUE СУБД обеспечивает индексами сама: иначе проверка каждого нового билета читала бы всю таблицу.',
    },
    {
      key: 'uniqfail',
      title: 'Уникальный — не на всё',
      lab: 'ч. 2 · CREATE UNIQUE INDEX на повторах',
      check: 'error',
      code: '23505',
      errMsg: /could not create unique index/,
      allow: ALLOW,
      text: 'Попробуйте создать уникальный индекс по автору: CREATE UNIQUE INDEX ux_book_author_id ON book (author_id). У автора много книг — прочитайте отказ СУБД.',
      q: 'Встанет ли уникальный индекс на столбец с повторами?',
      goals: ['CREATE UNIQUE INDEX ux_book_author_id ON book (author_id)', 'Отказ СУБД'],
      sol: ['CREATE UNIQUE INDEX ux_book_author_id ON book (author_id)'],
      wait: 'Команда прошла без отказа — нужен именно UNIQUE-индекс по author_id.',
      other: 'Это другой отказ — проверьте запись команды.',
      hint: 'UNIQUE INDEX запрещает повторы — и проверяет строки, которые уже есть.',
      ok: 'СУБД нашла повторы (Key (author_id)=… is duplicated) — уникальный индекс не создан. Обычный индекс повторы допускает.',
    },
    // ═══════════════════════════════ часть 3 · диапазон, место на диске, лишний индекс
    {
      key: 'pages',
      title: 'Индекс на диапазон',
      lab: 'ч. 3 · узкий диапазон по индексу',
      text: 'Толстые книги — больше 590 страниц — ищут часто. Создайте индекс ix_book_pages и выполните EXPLAIN ANALYZE запроса pages > 590.',
      q: 'Пойдёт ли диапазон по индексу?',
      goals: ['Индекс ix_book_pages', 'EXPLAIN ANALYZE запроса pages > 590'],
      ref: ['CREATE INDEX ix_book_pages ON book (pages)'],
      sol: ['CREATE INDEX ix_book_pages ON book (pages)', 'EXPLAIN ANALYZE SELECT * FROM book WHERE pages > 590'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const ix = onCol(await indexes(c), 'pages');
        if (!ix) return null;
        if (ix.name !== 'ix_book_pages') return {fail: `Индекс назван ${ix.name}, а по правилу — ix_book_pages.`};
        return plan1(
          /\bpages\s*>\s*590\b/i,
          p => byIndex(p, 'book', 'ix_book_pages'),
          'Индекс создан. Теперь EXPLAIN ANALYZE запроса pages > 590.',
        )(c);
      },
      hint: 'CREATE INDEX ix_book_pages ON book (pages);',
      ok: 'Таких книг — пара процентов: СУБД собрала их по индексу.',
    },
    {
      key: 'wide',
      title: 'Широкий диапазон',
      lab: 'ч. 3 · индекс есть — а чтение подряд',
      text: 'Теперь «книги больше 200 страниц» — pages > 200. Индекс ix_book_pages есть. EXPLAIN ANALYZE — каким способом прочитана таблица?',
      q: 'Всегда ли СУБД берёт индекс?',
      goals: ['EXPLAIN ANALYZE SELECT * FROM book WHERE pages > 200'],
      sol: ['EXPLAIN ANALYZE SELECT * FROM book WHERE pages > 200'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Способ чтения будет…',
        choices: [
          {k: 'idx', t: 'по ix_book_pages'},
          {k: 'seq', t: 'Seq Scan — под условие попадает большинство строк'},
        ],
        answer: 'seq',
      },
      verify: plan1(/\bpages\s*>\s*200\b/i),
      hint: 'EXPLAIN ANALYZE SELECT * FROM book WHERE pages > 200;',
      ok: 'Seq Scan: нужны четыре строки из пяти — по индексу пришлось бы прыгать почти по каждой странице. Подряд дешевле.',
    },
    {
      key: 'size',
      title: 'Сколько весит индекс',
      lab: 'ч. 3 · место на диске',
      text: 'Индекс — отдельная структура на диске. Каталог СУБД pg_class знает обо всех таблицах и индексах. Выведите имя (relname) и размер — pg_size_pretty(pg_relation_size(oid)) AS size — для двух объектов: book и ix_book_title.',
      q: 'Сколько места занимает индекс по сравнению с таблицей?',
      goals: ['Таблица pg_class', 'Столбцы: relname, size', "relname IN ('book', 'ix_book_title')"],
      ask: "SELECT relname, pg_size_pretty(pg_relation_size(oid)) AS size FROM pg_class WHERE relname IN ('book', 'ix_book_title')",
      allow: ALLOW,
      hint: "SELECT relname, pg_size_pretty(pg_relation_size(oid)) AS size FROM pg_class WHERE relname IN ('book', 'ix_book_title');",
      ok: 'Индекс по одному столбцу занимает заметную долю таблицы — и каждый INSERT пишет и в таблицу, и в каждый индекс.',
    },

    {
      key: 'extra',
      title: 'Лишний индекс',
      lab: 'ч. 3 · № 8–9 · создать и удалить',
      text: 'Создайте индекс по столбцу, по которому запросы не ищут, — например, по году (ix_book_year). Подумайте, почему он лишний (ответ — в протокол), и удалите его командой DROP INDEX.',
      q: 'Почему индекс «на всякий случай» — лишний?',
      goals: ['Лишний индекс — по столбцу, по которому не ищут', 'Удалить его'],
      sol: ['CREATE INDEX ix_book_year ON book (year)', 'DROP INDEX ix_book_year'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const T = c.trail;
        const cr = T.filter(x => x.kind === 'CREATE' && !x.code && /index/i.test(x.sql));
        const mk = cr.map(x => /create\s+index\s+(\w+)\s+on\s+(?:\w+\.)?book\s*\(\s*(\w+)/i.exec(x.sql) || []).filter(m => m[1]);
        const odd = mk.find(m => !['title', 'author_id', 'id', 'pages'].includes(m[2].toLowerCase()));
        if (!odd)
          return mk.length
            ? {fail: 'Этот столбец уже нужен запросам. Лишний индекс — по столбцу, по которому не ищут: year или isbn.'}
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
      goals: ['EXPLAIN ANALYZE — до', 'Индекс — имя по правилу', 'EXPLAIN ANALYZE — после: другой способ чтения'],
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
