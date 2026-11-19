// ЛР-23 · «Индексы: создание и проверка по плану» — запрос без индекса, CREATE INDEX под запрос, индекс на внешний ключ,
// список индексов, лишний индекс. Таблица book — сразу 20 000 строк (common/libmain.js, base).
import {explains, readOf, byIndex} from '../../common/libcheck.js';

const ALLOW = ['SELECT', 'EXPLAIN', 'CREATE', 'DROP', 'VACUUM'];
// индексы таблицы book: [{name, def}]
const indexes = async c =>
  c.q(`SELECT indexname AS name, indexdef AS def FROM pg_indexes WHERE tablename = 'book' AND schemaname = 'library'`);
// индекс по одному столбцу col: «… (col)»
const onCol = (list, col) => list.find(i => new RegExp(`\\(${col}\\)$`).test(i.def));

export function levels(D) {
  const title = `Book ${1000 + (D.seed % 7000)}`,
    au = (D.seed % 37) + 2,
    isbn = `978-5-${(D.seed * 37) % 20000}`;
  const Q1 = `SELECT * FROM book WHERE title = '${title}'`;
  // те же запросы 1–4, что в таблице ЛР-22 (ключ, автор — по тем же правилам варианта)
  const from = 575 + (D.seed % 22); // как в ЛР-22
  const key = 4000 + (D.seed % 900),
    au4 = D.AU[(D.seed % 30) + 3];
  const low = title.toLowerCase();
  // новые обычные уровни: начало названия, автор и год с общими книгами (как в ЛР-22)
  const pre = `Book ${100 + (D.seed % 800)}`,
    cA = ((D.seed + 5) % 40) + 1,
    cY = 1950 + ((cA - 1) % 5) + 5 * (D.seed % 15);
  // сверхсложные: числа варианта
  const nA = ((D.seed + 13) % 40) + 1,
    nN = 3 + (D.seed % 6),
    lp = `book ${10 + (D.seed % 89)}`,
    T = 590 + (D.seed % 5),
    cY2 = 1950 + (D.seed % 75),
    P2 = 300 + (D.seed % 200),
    kA = ((D.seed + 29) % 40) + 1,
    ix = (cond, re) => c => explains(c.trail, cond).filter(x => x.plan.analyze && (!re || re(x.plan))); // EXPLAIN ANALYZE под условие
  const tip = (cond, what) => c =>
    explains(c.trail, cond).length && !explains(c.trail, cond).some(x => x.plan.analyze)
      ? {wait: `План есть. Нужен EXPLAIN ANALYZE ${what}.`}
      : null;
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
      text: 'Создайте индекс по столбцу из условия запроса — имя по правилу ix_таблица_столбец — и повторите EXPLAIN ANALYZE того же запроса. В дереве объектов он появится в Tables → book → Indexes.',
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
      ok: 'Index Scan using ix_book_title: СУБД находит строку по новому индексу, не читая таблицу целиком.',
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
      key: 'likeidx',
      title: 'Начало названия',
      lab: 'ч. 2 · LIKE по индексу',
      text: `Книги, название которых начинается на «${pre}». В ЛР-22 такой поиск шёл подряд. Индекс ix_book_title теперь есть — выполните EXPLAIN ANALYZE запроса с LIKE и посмотрите строку Index Cond.`,
      q: 'Помогает ли индекс поиску по началу строки?',
      goals: [`EXPLAIN ANALYZE SELECT * FROM book WHERE title LIKE '${pre}%'`, 'Способ чтения и Index Cond — в отчёт'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE title LIKE '${pre}%'`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Как СУБД прочитает book для LIKE по началу названия?',
        choices: [
          {k: 'idx', t: 'по ix_book_title — начало строки известно'},
          {k: 'seq', t: 'подряд — как в ЛР-22'},
        ],
        answer: 'idx',
      },
      verify: plan1(
        /\btitle\s+like\b/i,
        p => byIndex(p, 'book', 'ix_book_title'),
        'План без ix_book_title. Проверьте: образец должен начинаться с текста, а % — только в конце.',
      ),
      hint: `… WHERE title LIKE '${pre}%' — процент только в конце.`,
      ok: 'По индексу: СУБД превратила LIKE в диапазон строк от «…» до следующей буквы (Index Cond: title >= … AND title < …) — в индексе названия лежат по алфавиту. С % в начале образца так не выйдет.',
    },
    {
      key: 'onlyidx',
      title: 'Только из индекса',
      lab: 'ч. 2 · Index Only Scan',
      text: `Нужно только название — есть ли книга «${title}»: выберите один столбец title, а не *. Выполните EXPLAIN ANALYZE и сравните способ чтения с уровнем «Индекс под запрос».`,
      q: 'Можно ли ответить на запрос, не открывая таблицу?',
      goals: [`EXPLAIN ANALYZE SELECT title FROM book WHERE title = '${title}'`, 'Способ чтения — в отчёт'],
      sol: [`EXPLAIN ANALYZE SELECT title FROM book WHERE title = '${title}'`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: plan1(
        /^\s*explain\s+analyze\s+select\s+(\w+\.)?title\s+from\b/i,
        p => p.nodes.some(n => n.table === 'book' && n.kind === 'Index Only Scan'),
        'Способ чтения не Index Only Scan: в SELECT должен быть только title.',
      ),
      hint: 'SELECT title FROM … — только столбец, который есть в индексе.',
      ok: 'Index Only Scan: всё, что нужно, — название — лежит в самом индексе, таблицу открывать незачем.',
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
      key: 'exprix',
      title: 'Индекс по выражению',
      lab: 'ч. 2 · индекс на lower(title)',
      text: `Поиск без учёта регистра — частый. Создайте индекс по выражению lower(title) (имя ix_book_lower_title) и повторите EXPLAIN ANALYZE запроса с уровня «Функция над столбцом»: lower(title) = '${low}'.`,
      q: 'Как сделать, чтобы условие с функцией шло по индексу?',
      goals: ['Индекс ix_book_lower_title по lower(title)', 'EXPLAIN ANALYZE того же запроса'],
      ref: ['CREATE INDEX ix_book_lower_title ON book (lower(title))'],
      sol: ['CREATE INDEX ix_book_lower_title ON book (lower(title))', `EXPLAIN ANALYZE SELECT * FROM book WHERE lower(title) = '${low}'`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const ixs = (await indexes(c)).filter(i => /lower\(/i.test(i.def));
        if (!ixs.length) return null;
        if (!ixs.some(i => i.name === 'ix_book_lower_title'))
          return {fail: `Индекс назван ${ixs[0].name}, а нужно ix_book_lower_title. Удалите его и создайте заново.`};
        return plan1(
          /lower\s*\(\s*title\s*\)/i,
          p => byIndex(p, 'book', 'ix_book_lower_title'),
          'Индекс создан. Повторите EXPLAIN ANALYZE запроса с lower(title).',
        )(c);
      },
      hint: 'CREATE INDEX … ON book (lower(title)); — в скобках выражение, а не столбец.',
      ok: 'Теперь по индексу: в нём лежат уже вычисленные lower(title). Индекс работает, когда условие записано тем же выражением, что и индекс.',
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
      key: 'multi',
      title: 'Составной индекс',
      lab: 'ч. 2 · индекс по двум столбцам',
      text: `Книги автора № ${cA} ${cY} года ищут вместе. Создайте один индекс сразу по двум столбцам — сначала author_id, потом year (имя ix_book_author_id_year) — и выполните EXPLAIN ANALYZE запроса с обоими условиями. Посмотрите Index Cond.`,
      q: 'Может ли индекс отвечать на два условия сразу?',
      goals: ['Индекс ix_book_author_id_year (author_id, year)', 'EXPLAIN ANALYZE: автор и год'],
      ref: ['CREATE INDEX ix_book_author_id_year ON book (author_id, year)'],
      sol: [
        'CREATE INDEX ix_book_author_id_year ON book (author_id, year)',
        `EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${cA} AND year = ${cY}`,
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const ixs = (await indexes(c)).filter(i => /\(author_id, year\)$/.test(i.def));
        if (!ixs.length) return null;
        if (!ixs.some(i => i.name === 'ix_book_author_id_year'))
          return {fail: `Индекс назван ${ixs[0].name}, а нужно ix_book_author_id_year.`};
        return plan1(
          /\bauthor_id\b[\s\S]*\byear\b|\byear\b[\s\S]*\bauthor_id\b/i,
          p => byIndex(p, 'book', 'ix_book_author_id_year'),
          'Индекс создан. Теперь EXPLAIN ANALYZE запроса с условиями на автора и год.',
        )(c);
      },
      hint: 'CREATE INDEX ix_book_author_id_year ON book (author_id, year); — порядок столбцов важен.',
      ok: 'В Index Cond — оба условия: индекс разложен сначала по автору, внутри автора — по году, и СУБД сразу находит нужный кусок.',
    },
    {
      key: 'multiord',
      title: 'Первые по году',
      lab: 'ч. 2 · составной индекс и ORDER BY',
      text: `Пять самых ранних книг автора № ${cA}: условие на автора, сортировка по году, LIMIT 5. Выполните EXPLAIN ANALYZE — понадобился ли узел Sort?`,
      q: 'Помогает ли составной индекс сортировке?',
      goals: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${cA} ORDER BY year LIMIT 5`],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${cA} ORDER BY year LIMIT 5`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: plan1(
        /order\s+by\s+(\w+\.)?year\b/i,
        p => !p.sort && byIndex(p, 'book'),
        'В плане есть Sort или чтение подряд — проверьте условие на автора и ORDER BY year.',
      ),
      hint: `… WHERE author_id = ${cA} ORDER BY year LIMIT 5`,
      ok: 'Без Sort: внутри одного автора книги в индексе уже лежат по году — СУБД взяла первые пять и остановилась.',
    },
    {
      key: 'list',
      title: 'Список индексов',
      lab: 'ч. 2 · № 7 · \\d таблица',
      text: 'Покажите список индексов таблицы book — команда psql \\d book (или \\di). В списке — индекс первичного ключа и все ваши: по названию, по lower(title), по автору и составной.',
      q: 'Какие индексы есть у book?',
      goals: ['\\d book', 'pk_book и ваши индексы'],
      sol: ['\\d book'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const m = c.trail.find(x => x.kind === 'META' && !x.code && /ix_book_title/.test(x.out) && /ix_book_author_id/.test(x.out));
        return m ? {ok: true, note: 'pk_book · ix_book_title · ix_book_author_id'} : null;
      },
      hint: '\\d book — столбцы и индексы таблицы; \\di — все индексы.',
      ok: 'Индекс первичного ключа СУБД создала сама, остальные — ваши.',
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
      text: `Толстые книги — больше ${from} страниц — ищут часто. Создайте индекс ix_book_pages и выполните EXPLAIN ANALYZE запроса pages > ${from}.`,
      q: 'Пойдёт ли диапазон по индексу?',
      goals: ['Индекс ix_book_pages', `EXPLAIN ANALYZE запроса pages > ${from}`],
      ref: ['CREATE INDEX ix_book_pages ON book (pages)'],
      sol: ['CREATE INDEX ix_book_pages ON book (pages)', `EXPLAIN ANALYZE SELECT * FROM book WHERE pages > ${from}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const ix = onCol(await indexes(c), 'pages');
        if (!ix) return null;
        if (ix.name !== 'ix_book_pages') return {fail: `Индекс назван ${ix.name}, а по правилу — ix_book_pages.`};
        return plan1(
          new RegExp(`\\bpages\\s*>\\s*${from}\\b`, 'i'),
          p => byIndex(p, 'book', 'ix_book_pages'),
          `Индекс создан. Теперь EXPLAIN ANALYZE запроса pages > ${from}.`,
        )(c);
      },
      hint: 'CREATE INDEX ix_book_pages ON book (pages);',
      ok: 'Таких книг — пара процентов: СУБД собрала их по индексу.',
    },
    {
      key: 'bitmapor',
      title: 'Или — по двум индексам',
      lab: 'ч. 3 · OR и BitmapOr',
      text: `Книга «${title}» или любая толще ${from} страниц — одним запросом через OR. В ЛР-22 такой запрос шёл подряд. Теперь индексы есть на обоих столбцах — выполните EXPLAIN ANALYZE и найдите в плане узел BitmapOr.`,
      q: 'Как СУБД использует два индекса в одном запросе?',
      goals: ['Запрос: название или толщина — через OR', 'EXPLAIN ANALYZE', 'Узел BitmapOr — в отчёт'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE title = '${title}' OR pages > ${from}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Индексы есть и на title, и на pages. Как СУБД прочитает book?',
        choices: [
          {k: 'seq', t: 'подряд — с OR индекс не работает'},
          {k: 'idx', t: 'по обоим индексам — и объединит найденное'},
        ],
        answer: 'idx',
      },
      verify: plan1(
        /\btitle\b[\s\S]*\bor\b[\s\S]*\bpages\b|\bpages\b[\s\S]*\bor\b[\s\S]*\btitle\b/i,
        p => /BitmapOr/.test(p.text),
        'В плане нет BitmapOr — проверьте, что условия соединены через OR.',
      ),
      hint: `… WHERE title = '${title}' OR pages > ${from}`,
      ok: 'BitmapOr: СУБД прошла по каждому индексу, сложила найденные строки в одну «карту» страниц и прочитала только их. С OR индекс помогает, только если он есть у каждого условия.',
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
      key: 'after',
      title: 'Таблица «после»',
      lab: 'отчёт · запросы 1–4 с индексами',
      text: 'В ЛР-22 вы свели в таблицу планы запросов 1–4 без индексов. Теперь индексы ix_book_title, ix_book_author_id и ix_book_pages есть — заполните ту же таблицу заново: как читалась book до (из протокола ЛР-22), как читается теперь, время и сколько строк отброшено фильтром. Сравните — это и есть ответ, зачем нужны индексы.',
      q: 'Какие запросы ускорились от индексов, а какие нет?',
      goals: ['«До» — из таблицы ЛР-22', '«После» — по нынешним планам', 'Проверить таблицу'],
      form: {
        t: 'book',
        cols: [
          {k: 'before', h: 'До индексов (ЛР-22)', kind: 'pick'},
          {k: 'read', h: 'После', kind: 'read'},
          {k: 'ms', h: 'Время, ms', kind: 'ms'},
          {k: 'rm', h: 'Отброшено фильтром', kind: 'rm'},
        ],
        rows: [
          {label: 'Запрос 1', what: `по ключу: id = ${key}`, sql: `SELECT * FROM book WHERE id = ${key}`, before: 'Index Scan'},
          {label: 'Запрос 2', what: `по названию: «${title}»`, sql: Q1, before: 'Seq Scan'},
          {label: 'Запрос 3', what: `диапазон: pages > ${from}`, sql: `SELECT * FROM book WHERE pages > ${from}`, before: 'Seq Scan'},
          {
            label: 'Запрос 4',
            what: `соединение с author: ${au4.full_name}`,
            sql: `SELECT b.title, a.full_name FROM book b JOIN author a ON a.id = b.author_id WHERE a.full_name = '${au4.full_name}'`,
            before: 'Seq Scan',
          },
        ],
      },
      check: 'form',
      cmds: 'Таблица проверяется кнопкой «Проверить таблицу». Запросы выполнять можно — чтобы снять планы и время',
      allow: ALLOW,
      star: true,
      hint: '«До» без индексов: по ключу — Index Scan (индекс первичного ключа был всегда), остальные — Seq Scan. «После» — выполните EXPLAIN ANALYZE каждого запроса.',
      ok: 'До и после — в протоколе: по названию, диапазону и автору СУБД теперь идёт через индексы и почти ничего не читает зря; по ключу ничего не изменилось — индекс там был всегда.',
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
      ok: 'Лишний индекс удалён: индекс без запросов только занимал место и замедлял изменения.',
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
      ref: ['CREATE INDEX ix_book_isbn ON book (isbn)'],
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
    // ═══════════════════════════════ сверхсложные · после контрольного, для «5»: без подсказок, индекс и доказательство — сами
    {
      sup: true,
      key: 'maxpages',
      title: 'Самая толстая — сразу',
      lab: 'сверхсложный · максимум по индексу',
      text: 'Сколько страниц у самой толстой книги? Напишите запрос и докажите EXPLAIN ANALYZE, что СУБД прочитала из book одну-единственную строку, а не все 20 000.',
      q: 'Как найти максимум, не читая таблицу?',
      goals: ['Запрос: наибольшее число страниц', 'EXPLAIN ANALYZE: book — по индексу, прочитана одна строка'],
      sol: ['EXPLAIN ANALYZE SELECT max(pages) FROM book'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const ok = ix(/max\s*\(\s*pages\s*\)|order\s+by\s+(\w+\.)?pages\s+desc/i, p =>
          p.nodes.some(n => n.table === 'book' && n.index && n.rows <= 1),
        )(c).pop();
        if (ok) return {ok: true, note: `${readOf(ok.plan, 'book')} · прочитано 1 · ${ok.plan.time} ms`};
        const any = ix(/max\s*\(\s*pages\s*\)|order\s+by\s+(\w+\.)?pages\s+desc/i)(c).pop();
        return any
          ? {
              wait: `В плане book прочитана так: ${readOf(any.plan, 'book')}, строк — ${(any.plan.nodes.find(n => n.table === 'book') || {}).rows}. Нужна одна строка по индексу.`,
            }
          : tip(/max\s*\(\s*pages\s*\)|order\s+by\s+(\w+\.)?pages\s+desc/i, 'запроса')(c);
      },
      ok: 'Index Only Scan Backward: индекс по pages прочитан с конца, первая же строка — максимум. Узел Limit остановил чтение.',
    },
    {
      sup: true,
      key: 'newest',
      title: 'Новинки автора',
      lab: 'сверхсложный · обратный порядок без Sort',
      text: `${nN} самых новых книг автора № ${nA} — от новой к старой. Докажите EXPLAIN ANALYZE, что в плане нет узла Sort и book прочитана по индексу.`,
      q: 'Умеет ли индекс отдавать строки в обратном порядке?',
      goals: [`Запрос: ${nN} самых новых книг автора № ${nA}`, 'EXPLAIN ANALYZE: без Sort, по индексу'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${nA} ORDER BY year DESC LIMIT ${nN}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const cond = new RegExp(
          `\\bauthor_id\\s*=\\s*${nA}\\b[\\s\\S]*order\\s+by\\s+(\\w+\\.)?year\\s+desc\\b[\\s\\S]*limit\\s+${nN}\\b`,
          'i',
        );
        const ok = ix(cond, p => !p.sort && byIndex(p, 'book'))(c).pop();
        if (ok) return {ok: true, note: `${readOf(ok.plan, 'book')} · без Sort · ${ok.plan.time} ms`};
        return ix(cond)(c).length ? {wait: 'В плане есть Sort или чтение подряд.'} : tip(cond, 'запроса')(c);
      },
      ok: 'Index Scan Backward по ix_book_author_id_year: внутри автора индекс прочитан от последнего года к первому — сортировать нечего.',
    },
    {
      sup: true,
      key: 'ordermulti',
      title: 'Каталог по авторам',
      lab: 'сверхсложный · сортировка по двум столбцам',
      text: 'Первые 10 книг каталога: по номеру автора, а у одного автора — по году. Докажите EXPLAIN ANALYZE, что СУБД не сортировала 20 000 строк, а прочитала ровно 10.',
      q: 'Когда сортировка по двум столбцам бесплатна?',
      goals: ['Запрос: 10 книг, порядок — автор, затем год', 'EXPLAIN ANALYZE: без Sort, прочитано 10'],
      sol: ['EXPLAIN ANALYZE SELECT * FROM book ORDER BY author_id, year LIMIT 10'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const cond = /order\s+by\s+(\w+\.)?author_id\s*(asc\s*)?,\s*(\w+\.)?year\b(?!\s+desc)[\s\S]*limit\s+10\b/i;
        const ok = ix(cond, p => !p.sort && p.nodes.some(n => n.table === 'book' && n.index && n.rows === 10))(c).pop();
        if (ok) return {ok: true, note: `${readOf(ok.plan, 'book')} · прочитано 10 · без Sort`};
        return ix(cond)(c).length ? {wait: 'В плане есть Sort или прочитано больше 10 строк.'} : tip(cond, 'запроса')(c);
      },
      ok: 'Порядок ORDER BY совпал с порядком столбцов индекса (author_id, year) — СУБД просто прочитала индекс с начала.',
    },
    {
      sup: true,
      key: 'lowerlike',
      title: 'Начало — в любом регистре',
      lab: 'сверхсложный · LIKE по индексу выражения',
      text: `Читатель набирает «${lp.toUpperCase()}» — найдите книги, название которых начинается с этого текста без учёта регистра. Докажите EXPLAIN ANALYZE, что поиск идёт по индексу, и число найденных книг сходится с ответом запроса.`,
      q: 'Как совместить поиск без регистра и по началу строки?',
      goals: ['Запрос без учёта регистра, по началу названия', 'EXPLAIN ANALYZE: по индексу'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE lower(title) LIKE '${lp}%'`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const n = (await c.q(`SELECT count(*)::int AS n FROM library.book WHERE lower(title) LIKE '${lp}%'`))[0].n;
        const ok = ix(/\blike\b/i, p => p.nodes.some(x => x.table === 'book' && x.index && x.rows === n))(c).pop();
        if (ok) return {ok: true, note: `${readOf(ok.plan, 'book')} · найдено ${n}`};
        const any = ix(/\blike\b/i)(c).pop();
        if (!any) return tip(/\blike\b/i, 'запроса')(c);
        const b = any.plan.nodes.find(x => x.table === 'book') || {};
        return {
          wait: b.index
            ? `По индексу, но найдено ${b.rows}, а таких книг ${n}: проверьте образец.`
            : 'План без индекса. Условие должно совпасть с выражением одного из индексов.',
        };
      },
      ok: 'lower(title) LIKE … пошёл по ix_book_lower_title: условие записано тем же выражением, что индекс, а образец начинается с текста — получился диапазон в индексе.',
    },
    {
      sup: true,
      key: 'dupidx',
      title: 'Индекс-дубль',
      lab: 'сверхсложный · лишний из-за составного',
      text: `Один индекс book стал лишним, когда появился составной ix_book_author_id_year. Найдите его (\\d book), удалите и докажите EXPLAIN ANALYZE, что книги автора № ${kA} по-прежнему ищутся по индексу.`,
      q: 'Какой индекс дублирует начало составного?',
      goals: ['Найти и удалить лишний индекс', `EXPLAIN ANALYZE книг автора № ${kA}: по индексу`],
      ref: ['DROP INDEX ix_book_author_id'],
      sol: ['DROP INDEX ix_book_author_id', `EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${kA}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const names = (await indexes(c)).map(i => i.name);
        if (!names.includes('ix_book_author_id_year'))
          return {fail: 'Удалён составной индекс — а лишним был другой. Составной отвечает и на автора, и на автора с годом.'};
        if (!['ix_book_title', 'ix_book_pages', 'ix_book_isbn', 'ix_book_lower_title'].every(n => names.includes(n)))
          return {fail: 'Удалён нужный индекс: им пользуются запросы прошлых уровней. Лишний — тот, что повторяет начало составного.'};
        if (names.includes('ix_book_author_id')) return null;
        const cond = new RegExp(`\\bauthor_id\\s*=\\s*${kA}\\b`, 'i');
        const ok = ix(cond, p => byIndex(p, 'book', 'ix_book_author_id_year'))(c).pop();
        return ok
          ? {ok: true, note: `DROP INDEX ix_book_author_id · ${readOf(ok.plan, 'book')}`}
          : {wait: 'Индекс удалён. Теперь EXPLAIN ANALYZE книг автора — по какому индексу?'};
      },
      ok: 'ix_book_author_id повторял первый столбец составного: индекс (author_id, year) отвечает и на одно условие по автору. Дубль только занимал место и замедлял запись.',
    },
    {
      sup: true,
      key: 'partial',
      title: 'Индекс на часть таблицы',
      lab: 'сверхсложный · частичный индекс',
      text: `Ищут только толстые книги — больше ${T} страниц, а ix_book_pages хранит все 20 000. Замените его частичным индексом ix_book_pages_thick — только на такие книги — и докажите планом, что запрос pages > ${T} идёт по новому индексу. Сравните размеры двух индексов (pg_relation_size).`,
      q: 'Можно ли индексировать не всю таблицу?',
      goals: [
        'ix_book_pages удалён',
        'ix_book_pages_thick — только книги толще заданного',
        `EXPLAIN ANALYZE pages > ${T}: по ix_book_pages_thick`,
      ],
      ref: ['DROP INDEX ix_book_pages', `CREATE INDEX ix_book_pages_thick ON book (pages) WHERE pages > ${T}`],
      sol: [
        'DROP INDEX ix_book_pages',
        `CREATE INDEX ix_book_pages_thick ON book (pages) WHERE pages > ${T}`,
        `EXPLAIN ANALYZE SELECT * FROM book WHERE pages > ${T}`,
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const L = await indexes(c),
          th = L.find(i => i.name === 'ix_book_pages_thick');
        if (!th) return null;
        if (!/\bWHERE\b/i.test(th.def))
          return {fail: 'ix_book_pages_thick — обычный индекс на все книги. Частичный — с условием WHERE после списка столбцов.'};
        if (L.some(i => i.name === 'ix_book_pages'))
          return {wait: 'Частичный индекс есть, но полный ix_book_pages остался — по заданию его нужно заменить.'};
        const ok = ix(new RegExp(`\\bpages\\s*>\\s*${T}\\b`, 'i'), p => byIndex(p, 'book', 'ix_book_pages_thick'))(c).pop();
        return ok
          ? {ok: true, note: `${readOf(ok.plan, 'book')} · ${ok.plan.time} ms`}
          : {wait: `Индекс готов. Теперь EXPLAIN ANALYZE запроса pages > ${T} — он должен пойти по ix_book_pages_thick.`};
      },
      ok: 'Частичный индекс хранит только толстые книги — он в разы меньше полного, а нужный запрос обслуживает так же. СУБД берёт его, когда условие запроса укладывается в условие индекса.',
    },
    {
      sup: true,
      key: 'choose',
      title: 'Отчёт тормозит',
      lab: 'сверхсложный · подобрать индекс',
      text: `Отчёт «книги ${cY2} года толще ${P2} страниц» тормозит. Подберите и создайте индекс (имя — по правилу ix_book_…), после которого EXPLAIN ANALYZE этого запроса покажет: book читается по индексу и Rows Removed by Filter нет — ни одной строки, прочитанной зря.`,
      q: 'Какой индекс отвечает на оба условия сразу?',
      goals: ['Индекс под оба условия', 'EXPLAIN ANALYZE: по индексу, 0 строк зря'],
      ref: ['CREATE INDEX ix_book_year_pages ON book (year, pages)'],
      sol: [
        'CREATE INDEX ix_book_year_pages ON book (year, pages)',
        `EXPLAIN ANALYZE SELECT * FROM book WHERE year = ${cY2} AND pages > ${P2}`,
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const cond = new RegExp(
          `(\\byear\\s*=\\s*${cY2}\\b[\\s\\S]*\\bpages\\s*>\\s*${P2}\\b|\\bpages\\s*>\\s*${P2}\\b[\\s\\S]*\\byear\\s*=\\s*${cY2}\\b)`,
          'i',
        );
        const all = ix(cond)(c);
        if (!all.length) return tip(cond, 'запроса')(c);
        const ok = all.filter(x => byIndex(x.plan, 'book') && x.plan.removed === 0).pop();
        if (ok) return {ok: true, note: `${readOf(ok.plan, 'book')} · зря прочитано 0 · ${ok.plan.time} ms`};
        const x = all.pop();
        return {
          wait: `Сейчас: ${readOf(x.plan, 'book')}, зря прочитано ${x.plan.removed}. Нужен индекс, у которого в Index Cond окажутся оба условия.`,
        };
      },
      ok: 'Составной (year, pages): равенство — первым столбцом, диапазон — вторым. Оба условия ушли в Index Cond, и ни одна строка не прочитана зря.',
    },
    {
      sup: true,
      key: 'uniqisbn',
      title: 'ISBN — уникальный',
      lab: 'сверхсложный · заменить индекс уникальным',
      text: `ISBN у книги один. Замените обычный ix_book_isbn уникальным индексом ux_book_isbn — так СУБД и ищет быстро, и не пустит повтор. Два индекса на одном столбце — лишнее. Докажите EXPLAIN ANALYZE, что поиск isbn = '${isbn}' идёт по ux_book_isbn.`,
      q: 'Чем уникальный индекс лучше обычного?',
      goals: ['ix_book_isbn удалён', 'Уникальный ux_book_isbn по isbn', 'EXPLAIN ANALYZE: по ux_book_isbn'],
      ref: ['DROP INDEX ix_book_isbn', 'CREATE UNIQUE INDEX ux_book_isbn ON book (isbn)'],
      sol: [
        'DROP INDEX ix_book_isbn',
        'CREATE UNIQUE INDEX ux_book_isbn ON book (isbn)',
        `EXPLAIN ANALYZE SELECT * FROM book WHERE isbn = '${isbn}'`,
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const L = (await indexes(c)).filter(i => /\(isbn\)$/.test(i.def));
        const ux = L.find(i => i.name === 'ux_book_isbn');
        if (!ux) return L.some(i => /UNIQUE/i.test(i.def)) ? {fail: 'Уникальный индекс назван не по правилу — нужно ux_book_isbn.'} : null;
        if (!/UNIQUE/i.test(ux.def)) return {fail: 'ux_book_isbn создан без UNIQUE.'};
        if (L.length > 1) return {wait: 'Уникальный индекс есть, но обычный по isbn остался — удалите дубль.'};
        const ok = ix(/\bisbn\s*=/i, p => byIndex(p, 'book', 'ux_book_isbn'))(c).pop();
        return ok
          ? {ok: true, note: `${readOf(ok.plan, 'book')} · ${ok.plan.time} ms`}
          : {wait: 'Индексы в порядке. Теперь EXPLAIN ANALYZE поиска по ISBN.'};
      },
      ok: 'Уникальный индекс и ищет, и сторожит: повтор ISBN СУБД теперь отклонит. Второй индекс на тот же столбец только занимал бы место.',
    },
    {
      sup: true,
      key: 'covering',
      title: 'Не открывая таблицу',
      lab: 'сверхсложный · покрывающий индекс',
      text: `Списку «названия книг автора № ${kA}» хватит индекса, если в нём будут и автор, и название. Создайте такой индекс (имя ix_book_author_id_title, название — через INCLUDE или вторым столбцом) и добейтесь в EXPLAIN ANALYZE Index Only Scan с Heap Fetches: 0 — ни одного обращения к таблице. Подсказки нет: почему СУБД всё-таки заглядывает в таблицу и как это исправить — найдите сами.`,
      q: 'Когда Index Only Scan действительно не трогает таблицу?',
      goals: ['Индекс: автор и название', `EXPLAIN ANALYZE названий книг автора № ${kA}`, 'Index Only Scan, Heap Fetches: 0'],
      ref: ['CREATE INDEX ix_book_author_id_title ON book (author_id) INCLUDE (title)'],
      sol: [
        'CREATE INDEX ix_book_author_id_title ON book (author_id) INCLUDE (title)',
        'VACUUM book',
        `EXPLAIN ANALYZE SELECT title FROM book WHERE author_id = ${kA}`,
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const cond = new RegExp(`select\\s+(\\w+\\.)?title\\s+from[\\s\\S]*\\bauthor_id\\s*=\\s*${kA}\\b`, 'i');
        const all = ix(cond)(c);
        if (!all.length) return tip(cond, 'запроса')(c);
        const ok = all
          .filter(x => x.plan.nodes.some(n => n.table === 'book' && n.kind === 'Index Only Scan') && /Heap Fetches: 0\b/.test(x.plan.text))
          .pop();
        if (ok) return {ok: true, note: `${readOf(ok.plan, 'book')} · Heap Fetches: 0 · ${ok.plan.time} ms`};
        const x = all.pop(),
          hf = (/Heap Fetches: (\d+)/.exec(x.plan.text) || [])[1];
        return {wait: `Сейчас: ${readOf(x.plan, 'book')}${hf ? ', Heap Fetches: ' + hf : ''}.`};
      },
      ok: 'Index Only Scan, Heap Fetches: 0. Индекс покрыл запрос, а VACUUM отметил страницы таблицы «все строки видимы» — СУБД поверила индексу и в таблицу не пошла.',
    },
    {
      sup: true,
      key: 'sizes',
      title: 'Кто сколько весит',
      lab: 'сверхсложный · индексы из каталога',
      text: 'Все индексы таблицы book и их размер в байтах: имя индекса (name) и размер (bytes) — от самого большого; при равном размере — по имени. Каталог pg_indexes знает имена индексов, функция pg_relation_size — размер.',
      q: 'Какие индексы book самые тяжёлые?',
      goals: ['Столбцы: name, bytes', 'Только индексы book', 'Порядок: размер по убыванию, затем имя'],
      ask: "SELECT indexname AS name, pg_relation_size(indexname::regclass) AS bytes FROM pg_indexes WHERE schemaname = 'library' AND tablename = 'book' ORDER BY bytes DESC, name",
      order: true,
      allow: ALLOW,
      ok: 'Индексы по текстовым столбцам — самые тяжёлые, частичный — самый лёгкий. Каждый из них СУБД обновляет при каждой записи в book.',
    },
  ];
}
