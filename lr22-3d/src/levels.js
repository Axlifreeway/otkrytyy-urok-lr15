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
  return [
    // ═══════════════════════════════ часть 1 · большая таблица
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
      goals: ['SELECT count(*) FROM book'],
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
      key: 'join',
      hard: true,
      title: 'Запрос 4 · со справочником',
      lab: 'сложный · № 10–11 · соединение со справочником',
      text: `Запрос 4 — книги автора ${au.full_name}: название книги и имя автора, соединение book с author, отбор по имени автора. EXPLAIN — способы чтения обеих таблиц и способ соединения, EXPLAIN ANALYZE — время.`,
      q: 'Как СУБД читает две таблицы при соединении?',
      goals: ['book b JOIN author a ON a.id = b.author_id', `a.full_name = '${au.full_name}'`, 'EXPLAIN и EXPLAIN ANALYZE'],
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
