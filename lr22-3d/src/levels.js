// ЛР-22 · «План выполнения запроса: EXPLAIN» — book наполняется до 20 000 строк, у четырёх запросов смотрятся планы:
// поиск по ключу, по неключевому столбцу, по диапазону, соединение со справочником.
// База — библиотека (common/libdata.js); проверки планов — common/libcheck.js.
import {FILL, authorName} from '../../common/libdata.js';
import {planPair, explains, readOf} from '../../common/libcheck.js';

const ALLOW = ['SELECT', 'EXPLAIN', 'INSERT'];

export function levels(D) {
  const key = 4000 + (D.seed % 900),
    title = `Книга ${1000 + (D.seed % 7000)}`,
    from = 590,
    au = D.AU[(D.seed % 30) + 3];
  const small = (D.seed % 50) + 5,
    pre = `Книга ${(D.seed % 8) + 1}2`,
    auId = (D.seed % 40) + 1;
  // план запроса, подходящего под cond: EXPLAIN ANALYZE (если нужен) и способ чтения book — в отметку уровня
  const one =
    (cond, need = 'ANALYZE') =>
    c => {
      const ex = explains(c.trail, cond);
      const an = ex.find(x => x.plan.analyze);
      if (!ex.length) return null;
      if (need === 'ANALYZE' && !an)
        return {wait: `План: ${readOf(ex[0].plan, 'book')}. Теперь EXPLAIN ANALYZE того же запроса — запишите время.`};
      const x = an || ex[0];
      return {
        ok: true,
        note: `${x.plan.nodes.map(n => n.kind + (n.index ? ' using ' + n.index : '')).join(' ← ')}${x.plan.time ? ` · ${x.plan.time} ms` : ''}`,
      };
    };
  return [
    // ═══════════════════════════════ часть 1 · большая таблица
    {
      key: 'small',
      early: true, // имеет смысл только до наполнения таблицы
      title: 'Пока книг 60',
      lab: 'ч. 1 · план на маленькой таблице',
      text: `Прежде чем наполнять таблицу, посмотрите план поиска книги по ключу: EXPLAIN SELECT * FROM book WHERE id = ${small}. Запишите способ чтения — после 20 000 книг сравните.`,
      q: 'Пойдёт ли СУБД по индексу, если книг всего 60?',
      goals: [`EXPLAIN SELECT * FROM book WHERE id = ${small}`, 'Способ чтения — в отчёт'],
      sol: [`EXPLAIN SELECT * FROM book WHERE id = ${small}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: one(new RegExp(`\\bid\\s*=\\s*${small}\\b`), 'plain'),
      hint: `EXPLAIN SELECT * FROM book WHERE id = ${small};`,
      ok: 'Все 60 книг помещаются на одну страницу — прочитать её подряд дешевле, чем идти через индекс. Индекс окупается на больших таблицах.',
    },
    {
      key: 'fill',
      title: '20 000 книг',
      lab: 'ч. 1 · № 1–2 · INSERT … SELECT',
      text: 'На 60 книгах все планы одинаковые: СУБД быстрее прочитать всё подряд. Наполните book до 20 000 строк одной командой INSERT … SELECT по образцу — номер n подставляется в значения, author_id — существующий: n % 40 + 1 (авторов 40).',
      q: 'Как добавить 20 000 строк одной командой?',
      goals: [
        'INSERT INTO book (…) SELECT … FROM generate_series(1, 20000) AS g(n)',
        'id — 1000 + n (не пересекается с прежними)',
        'author_id — n % 40 + 1',
      ],
      doc: `<pre class="sqlhl ref">${FILL.replace(/&/g, '&amp;').replace(/</g, '&lt;')};</pre>`,
      ref: [FILL, 'ANALYZE'],
      sol: [FILL],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const n = (await c.q('SELECT count(*)::int AS n FROM book'))[0].n;
        return n >= 20000 ? {ok: true, note: `INSERT 0 ${n - D.BK.length} · в book ${n} строк`} : null;
      },
      hint: 'generate_series(1, 20000) даёт числа 1…20000 — по одной строке на каждое.',
      ok: 'Таблица большая — теперь СУБД есть что выбирать: читать подряд или по индексу.',
    },
    {
      key: 'count',
      title: 'Сколько книг',
      lab: 'ч. 1 · № 3 · count(*)',
      text: 'Покажите число строк таблицы book запросом.',
      q: 'Сколько строк в book?',
      goals: ['Число строк book — одним запросом'],
      ask: 'SELECT count(*) FROM book',
      allow: ALLOW,
      hint: 'SELECT count(*) FROM book;',
      ok: 'Двадцать тысяч с лишним — на такой таблице планы различаются.',
    },
    // ═══════════════════════════════ часть 2 · планы четырёх запросов
    {
      key: 'pk',
      title: 'Запрос 1 · по ключу',
      lab: 'ч. 2 · № 4–5 · поиск по первичному ключу',
      text: `Запрос 1 — книга с id = ${key}. Выполните EXPLAIN — запишите способ чтения таблицы (первые слова строки плана), затем EXPLAIN ANALYZE того же запроса — запишите время.`,
      q: 'Как СУБД ищет строку по первичному ключу?',
      goals: [`EXPLAIN SELECT * FROM book WHERE id = ${key}`, 'EXPLAIN ANALYZE того же запроса', 'Способ чтения и время — в отчёт'],
      sol: [`EXPLAIN SELECT * FROM book WHERE id = ${key}`, `EXPLAIN ANALYZE SELECT * FROM book WHERE id = ${key}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: planPair(new RegExp(`\\bid\\s*=\\s*${key}\\b`), 'book', 'запрос 1'),
      hint: 'EXPLAIN [запрос]; — план без выполнения. EXPLAIN ANALYZE [запрос]; — выполнить и показать время.',
      ok: 'Index Scan using pk_book: для первичного ключа СУБД сама создала индекс — и сразу пошла к нужной строке.',
    },
    {
      key: 'nonkey',
      title: 'Запрос 2 · по названию',
      lab: 'ч. 2 · № 6–7 · поиск по неключевому столбцу',
      text: `Запрос 2 — книга «${title}» (условие по title). EXPLAIN — способ чтения, EXPLAIN ANALYZE — время. Посмотрите и на строку Rows Removed by Filter: сколько строк прочитано зря.`,
      q: 'Как СУБД ищет по столбцу без индекса?',
      goals: [`EXPLAIN SELECT * FROM book WHERE title = '${title}'`, 'EXPLAIN ANALYZE того же запроса'],
      sol: [`EXPLAIN SELECT * FROM book WHERE title = '${title}'`, `EXPLAIN ANALYZE SELECT * FROM book WHERE title = '${title}'`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: planPair(/\btitle\s*=/i, 'book', 'запрос 2'),
      hint: "… WHERE title = 'Книга …' — текст в одинарных кавычках.",
      ok: 'Seq Scan: индекса по title нет — робот обошёл все стеллажи, а подошла одна книга.',
    },
    {
      key: 'like',
      title: 'По началу названия',
      lab: 'ч. 2 · LIKE без индекса',
      text: `Книги, название которых начинается на «${pre}» (title LIKE '${pre}%'). EXPLAIN ANALYZE — способ чтения, время и сколько строк прочитано зря.`,
      q: 'Помогает ли LIKE найти строки быстрее?',
      goals: [`EXPLAIN ANALYZE SELECT * FROM book WHERE title LIKE '${pre}%'`],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE title LIKE '${pre}%'`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: one(/\btitle\s+like\b/i),
      hint: `… WHERE title LIKE '${pre}%' — процент: «дальше что угодно».`,
      ok: 'Seq Scan: по title индекса нет — каждое название сверено с образцом.',
    },
    {
      key: 'range',
      title: 'Запрос 3 · диапазон',
      lab: 'ч. 2 · № 8–9 · отбор по диапазону',
      text: `Запрос 3 — толстые книги: больше ${from} страниц (pages > ${from}). EXPLAIN — способ чтения, EXPLAIN ANALYZE — время.`,
      q: 'Как СУБД отбирает диапазон по столбцу без индекса?',
      goals: [`EXPLAIN SELECT * FROM book WHERE pages > ${from}`, 'EXPLAIN ANALYZE того же запроса'],
      sol: [`EXPLAIN SELECT * FROM book WHERE pages > ${from}`, `EXPLAIN ANALYZE SELECT * FROM book WHERE pages > ${from}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: planPair(/\bpages\s*(>|<|between)/i, 'book', 'запрос 3'),
      hint: `… WHERE pages > ${from}`,
      ok: 'Снова Seq Scan: по pages индекса нет, проверить пришлось каждую строку.',
    },
    {
      key: 'byauthor',
      title: 'По внешнему ключу',
      lab: 'ч. 2 · ссылка — ещё не индекс',
      text: `Книги автора с id ${auId}: условие author_id = ${auId}. На этом столбце внешний ключ fk_book_author. EXPLAIN ANALYZE — есть ли индекс?`,
      q: 'Создаёт ли внешний ключ индекс?',
      goals: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${auId}`],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${auId}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Как СУБД прочитает book?',
        choices: [
          {k: 'idx', t: 'по индексу — это же внешний ключ'},
          {k: 'seq', t: 'подряд — индекса на author_id нет'},
        ],
        answer: 'seq',
      },
      verify: one(/\bauthor_id\s*=/i),
      hint: `… WHERE author_id = ${auId}`,
      ok: 'Seq Scan: первичный ключ получает индекс сам, а внешний ключ — нет. Его создают отдельно — это ЛР-23.',
    },
    {
      key: 'whole',
      title: 'Вся таблица',
      lab: 'ч. 2 · план без условия',
      text: 'EXPLAIN SELECT * FROM book — без условия. В плане — оценка: rows (сколько строк ждёт СУБД) и cost (условная стоимость). Сравните rows с count(*).',
      q: 'Что СУБД знает о таблице заранее?',
      goals: ['EXPLAIN SELECT * FROM book', 'rows в плане ≈ count(*)'],
      sol: ['EXPLAIN SELECT * FROM book'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: one(/^\s*explain\s+(analyze\s+)?select\s+\*\s+from\s+book\s*;?\s*$/i, 'plain'),
      hint: 'EXPLAIN SELECT * FROM book;',
      ok: 'Оценку rows СУБД берёт из статистики (ANALYZE): она знает размер таблицы, ничего не читая.',
    },
    {
      key: 'join',
      hard: true,
      title: 'Запрос 4 · со справочником',
      lab: 'сложный · № 10–11 · соединение со справочником',
      text: `Запрос 4 — книги автора ${au.full_name}: название книги и имя автора, соединение book с author, отбор по имени автора. EXPLAIN — способы чтения обеих таблиц и способ соединения, EXPLAIN ANALYZE — время.`,
      q: 'Как СУБД читает две таблицы при соединении?',
      goals: ['Столбцы: название книги и имя автора', 'EXPLAIN и EXPLAIN ANALYZE'],
      sol: [
        `EXPLAIN SELECT b.title, a.full_name FROM book b JOIN author a ON a.id = b.author_id WHERE a.full_name = '${au.full_name}'`,
        `EXPLAIN ANALYZE SELECT b.title, a.full_name FROM book b JOIN author a ON a.id = b.author_id WHERE a.full_name = '${au.full_name}'`,
      ],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const v = planPair(/\bjoin\b[\s\S]*\bauthor\b|\bauthor\b[\s\S]*\bjoin\b/i, 'book', 'запрос 4')(c);
        if (!v || !v.ok) return v;
        const an = explains(c.trail, /\bjoin\b/i).find(x => x.plan.analyze);
        const j = an.plan.nodes.find(n => !n.table);
        return {
          ok: true,
          note: `${j ? j.kind + ': ' : ''}book — ${readOf(an.plan, 'book')}, author — ${readOf(an.plan, 'author')} · ${an.plan.time} ms`,
        };
      },
      hint: 'План читается снизу вверх: сначала чтение таблиц (Seq Scan …), над ними — соединение (Hash Join).',
      ok: 'Обе таблицы читаются подряд, а соединяет их Hash Join: автор попадает в хеш-таблицу, книги проверяются по ней.',
    },
    // ═══════════════════════════════ часть 3 · сортировка, итог, «почти все строки»
    {
      key: 'sort',
      title: 'Первые десять',
      lab: 'ч. 3 · ORDER BY … LIMIT',
      text: 'Два плана: первые 10 книг по id (ORDER BY id LIMIT 10) и первые 10 по числу страниц (ORDER BY pages LIMIT 10). Выполните EXPLAIN ANALYZE обоих и сравните: где появилась сортировка (Sort)?',
      q: 'Когда СУБД приходится сортировать?',
      goals: ['EXPLAIN ANALYZE … ORDER BY id LIMIT 10', 'EXPLAIN ANALYZE … ORDER BY pages LIMIT 10'],
      sol: ['EXPLAIN ANALYZE SELECT * FROM book ORDER BY id LIMIT 10', 'EXPLAIN ANALYZE SELECT * FROM book ORDER BY pages LIMIT 10'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const a = explains(c.trail, /order\s+by\s+id\b/i).find(x => x.plan.analyze),
          b = explains(c.trail, /order\s+by\s+pages\b/i).find(x => x.plan.analyze);
        if (!a && !b) return null;
        if (!a || !b) return {wait: `Один план есть. Теперь EXPLAIN ANALYZE с ORDER BY ${a ? 'pages' : 'id'} LIMIT 10.`};
        const srt = p => (p.sort ? 'Sort ← ' : '') + readOf(p, 'book');
        return {ok: true, note: `по id: ${srt(a.plan)} · ${a.plan.time} ms; по pages: ${srt(b.plan)} · ${b.plan.time} ms`};
      },
      hint: 'EXPLAIN ANALYZE SELECT * FROM book ORDER BY id LIMIT 10; и то же с pages.',
      ok: 'По id строки уже лежат в индексе по порядку — первые 10 берутся сразу. По pages индекса нет: всё читается и сортируется.',
    },
    {
      key: 'agg',
      title: 'Сколько стоит count(*)',
      lab: 'ч. 3 · план итогового запроса',
      text: 'EXPLAIN ANALYZE SELECT count(*) FROM book. Над чтением таблицы появится узел Aggregate. Запишите время: так дорого обходится одно число на 20 000 строк.',
      q: 'Как СУБД считает строки?',
      goals: ['EXPLAIN ANALYZE SELECT count(*) FROM book'],
      sol: ['EXPLAIN ANALYZE SELECT count(*) FROM book'],
      check: 'tx',
      allow: ALLOW,
      verify: one(/count\s*\(\s*\*\s*\)/i),
      hint: 'EXPLAIN ANALYZE SELECT count(*) FROM book;',
      ok: 'Чтобы сосчитать строки, их нужно прочитать — count(*) без условия всегда проходит таблицу целиком.',
    },
    {
      key: 'most',
      hard: true,
      title: 'Почти все по ключу',
      lab: 'сложный · индекс есть, а не нужен',
      text: 'Книги с id > 100 — это почти вся таблица. EXPLAIN ANALYZE: пойдёт ли СУБД по индексу первичного ключа?',
      q: 'Всегда ли СУБД идёт по индексу, если он есть?',
      goals: ['EXPLAIN ANALYZE SELECT * FROM book WHERE id > 100'],
      sol: ['EXPLAIN ANALYZE SELECT * FROM book WHERE id > 100'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Способ чтения будет…',
        choices: [
          {k: 'idx', t: 'Index Scan — по ключу же'},
          {k: 'seq', t: 'Seq Scan — строк слишком много'},
        ],
        answer: 'seq',
      },
      verify: one(/\bid\s*>\s*100\b/i),
      hint: 'EXPLAIN ANALYZE SELECT * FROM book WHERE id > 100;',
      ok: 'Seq Scan: когда нужна почти вся таблица, ходить через индекс — лишняя работа. СУБД выбирает по оценке строк.',
    },
    // ═══════════════════════════════ контрольный
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Диапазон по ключу',
      lab: 'сложный · контрольный',
      text: `Тот же диапазон, но по первичному ключу: книги с id от ${key} до ${key + 20}. Выполните EXPLAIN ANALYZE и сравните способ чтения с запросом 3 (диапазон по pages).`,
      q: 'Пойдёт ли по индексу диапазон по ключу?',
      goals: [`EXPLAIN ANALYZE … WHERE id BETWEEN ${key} AND ${key + 20}`],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE id BETWEEN ${key} AND ${key + 20}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const an = explains(c.trail, /\bid\s+between\b|\bid\s*>=?[\s\S]*\bid\s*<=?/i).find(x => x.plan.analyze);
        return an ? {ok: true, note: `${readOf(an.plan, 'book')} · ${an.plan.time} ms`} : null;
      },
      ok: 'По ключу и диапазон идёт по индексу: в индексе ключи лежат по порядку — СУБД берёт кусок подряд.',
    },
  ];
}
