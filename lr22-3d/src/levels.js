// ЛР-22 · «План выполнения запроса: EXPLAIN» — book наполняется до 20 000 строк, у четырёх запросов смотрятся планы:
// поиск по ключу, по неключевому столбцу, по диапазону, соединение со справочником; планы сводятся в таблицу для отчёта.
// С части 3 запрос пишет сам студент — в задании только условие словами; прогноз до запуска — основная механика
// (lv.preds — блок в задании). Контрольный — таблица: какому из трёх запросов нужен индекс.
// База — библиотека (common/libdata.js); проверки планов — common/libcheck.js.
import {FILL, authorName} from '../../common/libdata.js';
import {planPair, explains, readOf} from '../../common/libcheck.js';

const ALLOW = ['SELECT', 'EXPLAIN', 'INSERT'];

export function levels(D) {
  const key = 4000 + (D.seed % 900),
    title = `Book ${1000 + (D.seed % 7000)}`,
    from = 590,
    au = D.AU[(D.seed % 30) + 3];
  const small = (D.seed % 50) + 5,
    pre = `Book ${(D.seed % 8) + 1}2`,
    auId = (D.seed % 40) + 1;
  // часть 3: числа варианта. Книги наполнения — id 1001…21000: автор n % 40 + 1, год 1950 + n % 75, pages 100 + n % 500
  const g1 = 6000 + (D.seed % 700) * 3,
    gp = 120 + (D.seed % 30) * 10,
    k1 = 9000 + (D.seed % 500),
    k2 = k1 + 777,
    gx = 12000 + (D.seed % 800),
    gy = ((D.seed + 11) % 40) + 1;
  // автор и год с общими книгами: n ≡ cA − 1 (mod 40) и n ≡ cY − 1950 (mod 75) решаемо, если остатки равны по модулю 5
  const cA = ((D.seed + 5) % 40) + 1,
    cY = 1950 + ((cA - 1) % 5) + 5 * (D.seed % 15);
  const isbn = `978-5-${1 + ((D.seed * 37) % 20000)}`,
    kk = 15000 + (D.seed % 900);
  // EXPLAIN ANALYZE запроса cond, у которого book дала ровно столько строк, сколько вернёт countSql (условие записано верно)
  const counted = (cond, countSql, what) => async c => {
    const ex = explains(c.trail, cond);
    if (!ex.length) return null;
    const an = ex.filter(x => x.plan.analyze).pop();
    if (!an) return {wait: 'План есть. Нужен EXPLAIN ANALYZE — с настоящим числом строк и временем.'};
    const n = (await c.q(countSql))[0].n,
      sc = an.plan.nodes.find(x => x.table === 'book');
    if (!sc || sc.rows !== n)
      return {
        wait: `В плане найдено строк: ${sc ? sc.rows : 0}, а ${what} — ${n}. Проверьте условие WHERE и выполните EXPLAIN ANALYZE ещё раз.`,
      };
    return {ok: true, note: `${readOf(an.plan, 'book')} · найдено ${n} · отброшено ${an.plan.removed} · ${an.plan.time} ms`};
  };
  // планы всех запросов из списка (у каждого — своё условие)
  const every = conds => c => {
    const got = conds.map(re => explains(c.trail, re)[0]);
    if (!got.some(Boolean)) return null;
    const left = got.map((x, i) => (x ? 0 : i + 1)).filter(Boolean);
    if (left.length) return {wait: `Планы есть не у всех запросов: осталось — ${left.join(', ')}.`};
    return {ok: true, note: got.map((x, i) => `${i + 1}: ${readOf(x.plan, 'book')}`).join(' · ')};
  };
  const IDX = [
    {k: 'idx', t: 'по индексу'},
    {k: 'seq', t: 'подряд — Seq Scan'},
  ];
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
      hint: "… WHERE title = 'Book …' — текст в одинарных кавычках.",
      ok: 'Seq Scan: индекса по title нет — СУБД прочитала всю таблицу, а подошла одна книга.',
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
    // ═══════════════════════════════ отчёт · таблица запросов 1–4
    {
      key: 'report',
      title: 'Таблица для отчёта',
      lab: 'отчёт · запросы 1–4 в одну таблицу',
      text: 'Сведите планы запросов 1–4 в таблицу: способ чтения book, время (Execution Time) и сколько строк отброшено фильтром (Rows Removed by Filter: нет такой строки — 0, несколько — сложите). Записи с прошлых уровней пригодятся; можно и выполнить запросы ещё раз. Таблица уйдёт в протокол, а в ЛР-23 вы заполните её снова — уже с индексами — и сравните.',
      q: 'Чем отличаются планы четырёх запросов?',
      goals: ['Четыре строки таблицы — по планам', 'Проверить таблицу'],
      form: {
        t: 'book',
        rows: [
          {label: 'Запрос 1', what: `по ключу: id = ${key}`, sql: `SELECT * FROM book WHERE id = ${key}`},
          {label: 'Запрос 2', what: `по названию: «${title}»`, sql: `SELECT * FROM book WHERE title = '${title}'`},
          {label: 'Запрос 3', what: `диапазон: pages > ${from}`, sql: `SELECT * FROM book WHERE pages > ${from}`},
          {
            label: 'Запрос 4',
            what: `соединение с author: ${au.full_name}`,
            sql: `SELECT b.title, a.full_name FROM book b JOIN author a ON a.id = b.author_id WHERE a.full_name = '${au.full_name}'`,
          },
        ],
      },
      check: 'form',
      cmds: 'Таблица проверяется кнопкой «Проверить таблицу». Запросы выполнять можно — чтобы снять время',
      allow: ALLOW,
      star: true,
      hint: 'Время у каждого своё — проверяется только, что оно записано. Способ чтения и Rows Removed by Filter должны совпасть с планом.',
      ok: 'Таблица в протоколе: по ключу — индекс и ноль лишних строк, по названию и диапазону — вся таблица, при соединении — Seq Scan и фильтр по справочнику.',
    },
    // ═══════════════════════════════ часть 3 · запрос пишете сами
    {
      key: 'guess3',
      title: 'Прогноз: три запроса',
      lab: 'ч. 3 · сначала прогноз, потом план',
      text: 'Три запроса — в блоке прогноза. Для каждого отметьте, как СУБД прочитает book, и только потом выполните EXPLAIN каждого — проверьте себя. Ошибка в прогнозе баллов не снимает, но попадает в протокол.',
      q: 'Можно ли угадать план, не запуская запрос?',
      preds: [
        {q: `SELECT * FROM book WHERE id BETWEEN ${g1} AND ${g1 + 5}`, choices: IDX, answer: 'idx'},
        {q: `SELECT * FROM book WHERE pages = ${gp}`, choices: IDX, answer: 'seq'},
        {q: 'SELECT * FROM book WHERE id > 2000', choices: IDX, answer: 'seq'},
      ],
      goals: ['Прогноз — для всех трёх', 'EXPLAIN каждого запроса', 'Сверить прогноз с планом'],
      sol: [
        `EXPLAIN SELECT * FROM book WHERE id BETWEEN ${g1} AND ${g1 + 5}`,
        `EXPLAIN SELECT * FROM book WHERE pages = ${gp}`,
        'EXPLAIN SELECT * FROM book WHERE id > 2000',
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: every([new RegExp(`\\bid\\s+between\\s+${g1}\\b`, 'i'), new RegExp(`\\bpages\\s*=\\s*${gp}\\b`, 'i'), /\bid\s*>\s*2000\b/i]),
      hint: 'Индекс есть только на id. Но и по id СУБД идёт через индекс, только если строк нужно немного.',
      ok: 'Узкий диапазон по ключу — по индексу; pages без индекса — подряд; id > 2000 — это 19 000 строк из 20 000, подряд дешевле.',
    },
    {
      key: 'limit',
      title: 'Любые пять',
      lab: 'ч. 3 · LIMIT без сортировки',
      text: 'Запрос: любые пять книг — без условия и без сортировки. Напишите его сами и выполните EXPLAIN ANALYZE. Сравните у Seq Scan оценку rows (в первых скобках) и сколько строк прочитано на деле (actual … rows).',
      q: 'Всегда ли Seq Scan читает всю таблицу?',
      goals: ['EXPLAIN ANALYZE запроса «любые пять книг»', 'Оценка rows и actual rows у Seq Scan — в отчёт'],
      sol: ['EXPLAIN ANALYZE SELECT * FROM book LIMIT 5'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const an = explains(c.trail, /^\s*explain\s+analyze\s+select\s[\s\S]*\bfrom\s+book\s+limit\s+5\s*;?\s*$/i).pop();
        if (!an)
          return explains(c.trail, /\blimit\s+5\b/i).length
            ? {wait: 'Нужен EXPLAIN ANALYZE запроса без WHERE и ORDER BY — только FROM book и LIMIT 5.'}
            : null;
        const sc = an.plan.nodes.find(n => n.table === 'book');
        return {ok: true, note: `Limit ← ${readOf(an.plan, 'book')} · прочитано ${sc ? sc.rows : '?'} · ${an.plan.time} ms`};
      },
      hint: 'LIMIT 5 — в самом конце запроса.',
      ok: 'Limit остановил чтение: Seq Scan отдал пять строк и закончил. Подряд — не значит «всё»: без ORDER BY первым строкам незачем ждать остальные.',
    },
    {
      key: 'sort',
      title: 'Первые десять',
      lab: 'ч. 3 · ORDER BY … LIMIT',
      text: 'Два запроса, оба — с EXPLAIN ANALYZE: первые 10 книг по порядку номеров и 10 самых тонких книг. Напишите их сами и сравните планы: в каком появился узел Sort и сколько он занял времени?',
      q: 'Когда СУБД приходится сортировать?',
      goals: ['EXPLAIN ANALYZE: первые 10 по номеру', 'EXPLAIN ANALYZE: 10 самых тонких', 'Где Sort — в отчёт'],
      sol: ['EXPLAIN ANALYZE SELECT * FROM book ORDER BY id LIMIT 10', 'EXPLAIN ANALYZE SELECT * FROM book ORDER BY pages LIMIT 10'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const a = explains(c.trail, /order\s+by\s+id\b/i).find(x => x.plan.analyze),
          b = explains(c.trail, /order\s+by\s+pages\b/i).find(x => x.plan.analyze);
        if (!a && !b) return null;
        if (!a || !b)
          return {wait: `Один план есть. Теперь EXPLAIN ANALYZE второго запроса — ${a ? 'самые тонкие книги' : 'первые по номеру'}.`};
        const srt = p => (p.sort ? 'Sort ← ' : '') + readOf(p, 'book');
        return {ok: true, note: `по id: ${srt(a.plan)} · ${a.plan.time} ms; по pages: ${srt(b.plan)} · ${b.plan.time} ms`};
      },
      hint: '«Первые по порядку» — ORDER BY … LIMIT 10. Самые тонкие — меньше всего страниц.',
      ok: 'По id строки уже лежат в индексе по порядку — первые 10 берутся сразу. По pages индекса нет: всё читается и сортируется.',
    },
    {
      key: 'agg',
      title: 'Сколько стоит count(*)',
      lab: 'ч. 3 · план итогового запроса',
      text: 'Сколько всего книг — тот же вопрос, что на уровне «Сколько книг», но теперь посмотрите план этого запроса с временем. Над чтением таблицы появится узел Aggregate. Запишите время: так обходится одно число на 20 000 строк.',
      q: 'Как СУБД считает строки?',
      goals: ['EXPLAIN ANALYZE запроса с count(*)', 'Время — в отчёт'],
      sol: ['EXPLAIN ANALYZE SELECT count(*) FROM book'],
      check: 'tx',
      allow: ALLOW,
      verify: one(/count\s*\(\s*\*\s*\)/i),
      hint: 'EXPLAIN ANALYZE ставится перед тем же запросом, что и на уровне «Сколько книг».',
      ok: 'Чтобы сосчитать строки, их нужно прочитать — count(*) без условия всегда проходит таблицу целиком.',
    },
    {
      key: 'group',
      title: 'Книг у каждого автора',
      lab: 'ч. 3 · план группировки',
      text: 'Сколько книг у каждого автора: номер автора и число его книг. Напишите запрос с группировкой и выполните EXPLAIN ANALYZE. Найдите узел, который собрал группы, и сколько строк он выдал.',
      q: 'Каким узлом СУБД группирует строки?',
      goals: ['Запрос: author_id и число книг', 'EXPLAIN ANALYZE', 'Узел группировки и число групп — в отчёт'],
      sol: ['EXPLAIN ANALYZE SELECT author_id, count(*) FROM book GROUP BY author_id'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const ex = explains(c.trail, /group\s+by\s+(\w+\.)?author_id\b/i);
        if (!ex.length) return null;
        const an = ex.filter(x => x.plan.analyze).pop();
        if (!an) return {wait: 'План есть. Нужен EXPLAIN ANALYZE — с настоящим числом строк.'};
        const g = /(HashAggregate|GroupAggregate)[^\n]*?actual[^\n]*?rows=(\d+)/.exec(an.plan.text);
        if (!g) return {wait: 'В плане нет узла группировки — проверьте, что в запросе есть GROUP BY author_id и count(*).'};
        return {ok: true, note: `${g[1]} · групп ${g[2]} ← ${readOf(an.plan, 'book')} · ${an.plan.time} ms`};
      },
      hint: 'SELECT author_id, count(*) … GROUP BY author_id — и EXPLAIN ANALYZE перед ним.',
      ok: 'HashAggregate: СУБД прочитала таблицу один раз и разложила строки по хеш-таблице — по корзине на автора. Строк на выходе столько, сколько групп.',
    },
    {
      key: 'combo',
      title: 'Автор и год',
      lab: 'ч. 3 · два условия сразу',
      text: `Книги автора № ${cA}, изданные в ${cY} году. Напишите запрос сами и выполните EXPLAIN ANALYZE: каким узлом прочитана book, стоят ли в строке Filter оба условия, сколько строк найдено и сколько отброшено фильтром.`,
      q: 'Помогает ли второе условие прочитать меньше?',
      goals: ['Запрос с двумя условиями', 'EXPLAIN ANALYZE', 'Найдено и отброшено — в отчёт'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${cA} AND year = ${cY}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: counted(
        /\bauthor_id\b[\s\S]*\byear\b|\byear\b[\s\S]*\bauthor_id\b/i,
        `SELECT count(*)::int AS n FROM library.book WHERE author_id = ${cA} AND year = ${cY}`,
        `книг автора ${cA} за ${cY} год`,
      ),
      hint: 'Оба условия сразу — через AND.',
      ok: 'Seq Scan: оба условия — в одной строке Filter, их проверяют у каждой строки. Второе условие сократило ответ, но не чтение: прочитана вся таблица.',
    },
    {
      key: 'decade',
      title: 'Девяностые, толстые',
      lab: 'ч. 3 · диапазон и условие',
      text: 'Книги 1990-х годов (с 1990 по 1999 включительно) толщиной больше 400 страниц. Напишите запрос сами, выполните EXPLAIN ANALYZE и запишите: способ чтения, сколько строк нашлось и сколько отброшено.',
      q: 'Как СУБД отбирает строки по двум столбцам без индексов?',
      goals: ['Запрос: годы 1990–1999 и больше 400 страниц', 'EXPLAIN ANALYZE', 'Способ чтения, найдено и отброшено — в отчёт'],
      sol: ['EXPLAIN ANALYZE SELECT * FROM book WHERE year BETWEEN 1990 AND 1999 AND pages > 400'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: counted(
        /\byear\b[\s\S]*\bpages\b|\bpages\b[\s\S]*\byear\b/i,
        'SELECT count(*)::int AS n FROM library.book WHERE year BETWEEN 1990 AND 1999 AND pages > 400',
        'книг 1990-х толще 400 страниц',
      ),
      hint: 'BETWEEN включает оба края. «Больше 400» — строго больше.',
      ok: 'Условие на два столбца без индексов — снова Seq Scan: чтобы найти пару процентов строк, СУБД прочитала все.',
    },
    {
      key: 'twoids',
      title: 'Две книги по номерам',
      lab: 'ч. 3 · несколько значений ключа',
      text: `Читатель спрашивает две книги: № ${k1} и № ${k2}. Выведите обе одним запросом и посмотрите план EXPLAIN ANALYZE. Пойдёт ли СУБД по индексу, если номеров два? Посмотрите и строку Index Cond.`,
      q: 'Работает ли индекс для списка значений?',
      goals: ['Один запрос — обе книги', 'EXPLAIN ANALYZE', 'Способ чтения и Index Cond — в отчёт'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE id IN (${k1}, ${k2})`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: counted(
        new RegExp(`\\b${k1}\\b[\\s\\S]*\\b${k2}\\b|\\b${k2}\\b[\\s\\S]*\\b${k1}\\b`),
        `SELECT count(*)::int AS n FROM library.book WHERE id IN (${k1}, ${k2})`,
        'книг с этими номерами',
      ),
      hint: 'Список значений — IN (…, …) или два условия через OR.',
      ok: 'По индексу: и IN (…), и OR превращаются в Index Cond: id = ANY (…) — СУБД ищет в индексе каждый номер из списка.',
    },
    {
      key: 'most',
      title: 'Почти все по ключу',
      lab: 'ч. 3 · индекс есть, а не нужен',
      text: 'Все книги, кроме первой сотни номеров, — с id больше 100. Это почти вся таблица. Сначала прогноз, потом запрос и EXPLAIN ANALYZE: пойдёт ли СУБД по индексу первичного ключа?',
      q: 'Всегда ли СУБД идёт по индексу, если он есть?',
      goals: ['Запрос: id больше 100', 'EXPLAIN ANALYZE'],
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
      hint: 'WHERE id > 100 — и EXPLAIN ANALYZE перед запросом.',
      ok: 'Seq Scan: когда нужна почти вся таблица, ходить через индекс — лишняя работа. СУБД выбирает по оценке строк.',
    },
    {
      key: 'keyrange',
      title: 'Диапазон по ключу',
      lab: 'ч. 3 · узкий диапазон по индексу',
      text: `Книги с номерами от ${key} до ${key + 20} включительно — тот же диапазон, что в запросе 3, но по первичному ключу. Напишите запрос, выполните EXPLAIN ANALYZE и сравните способ чтения с запросом 3 (pages > ${from}).`,
      q: 'Пойдёт ли по индексу диапазон по ключу?',
      goals: [`Запрос: id от ${key} до ${key + 20}`, 'EXPLAIN ANALYZE', 'Сравнить с запросом 3'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE id BETWEEN ${key} AND ${key + 20}`],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: counted(
        /\bid\s+between\b|\bid\s*>=?[\s\S]*\bid\s*<=?/i,
        `SELECT count(*)::int AS n FROM library.book WHERE id BETWEEN ${key} AND ${key + 20}`,
        'книг в этом диапазоне номеров',
      ),
      hint: '«Включительно» — BETWEEN … AND … или >= и <=.',
      ok: 'По ключу и диапазон идёт по индексу: в индексе ключи лежат по порядку — СУБД берёт кусок подряд.',
    },
    {
      key: 'join3',
      hard: true,
      title: 'Кто что читает',
      lab: 'сложный · соединение трёх таблиц',
      text: 'Для каждого формуляра выведите название книги и ФИО читателя — соединение loan с book и reader. Напишите запрос сами и выполните EXPLAIN ANALYZE. Как прочитана каждая таблица, какими узлами они соединены и сколько строк book прочитано на деле? План читается снизу вверх.',
      q: 'Какие соединения выберет СУБД для трёх таблиц?',
      goals: ['Запрос: название книги и ФИО читателя по формулярам', 'EXPLAIN ANALYZE', 'Узлы соединения и чтение book — в отчёт'],
      sol: ['EXPLAIN ANALYZE SELECT b.title, r.full_name FROM loan l JOIN book b ON b.id = l.book_id JOIN reader r ON r.id = l.reader_id'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Формуляров 30, книг 20 000. Как СУБД прочитает book?',
        choices: [
          {k: 'seq', t: 'подряд — все 20 000 книг'},
          {k: 'idx', t: 'по индексу pk_book — только нужное'},
        ],
        answer: 'idx',
      },
      verify: c => {
        const ex = explains(c.trail, /\bloan\b/i).filter(x => ['loan', 'book', 'reader'].every(t => x.plan.nodes.some(n => n.table === t)));
        if (!ex.length)
          return explains(c.trail, /\bloan\b/i).length ? {wait: 'В плане должны быть все три таблицы: loan, book и reader.'} : null;
        const an = ex.filter(x => x.plan.analyze).pop();
        if (!an) return {wait: 'План есть. Нужен EXPLAIN ANALYZE — видно, сколько строк прочитано на деле.'};
        const joins = an.plan.nodes.filter(n => !n.table).map(n => n.kind),
          bk = an.plan.nodes.find(n => n.table === 'book');
        return {
          ok: true,
          note: `${joins.join(' ← ')} · loan — ${readOf(an.plan, 'loan')}, book — ${readOf(an.plan, 'book')} (прочитано ${bk.rows}), reader — ${readOf(an.plan, 'reader')} · ${an.plan.time} ms`,
        };
      },
      hint: 'FROM loan l JOIN book b ON … JOIN reader r ON … — два условия соединения.',
      ok: 'Два узла соединения: сначала loan с book, к результату — reader. Формуляры ссылаются только на первые книги — СУБД идёт по индексу pk_book по порядку и останавливается, не дочитав 20 000.',
    },
    {
      key: 'guess3b',
      title: 'Прогноз по условию',
      lab: 'ч. 3 · прогноз, запрос — сами',
      text: `Три запроса — словами: (1) книга № ${gx}; (2) книги автора № ${gy}; (3) книги с номером меньше 1100. Отметьте прогноз для каждого, потом напишите запросы сами и выполните EXPLAIN — проверьте себя.`,
      q: 'Где СУБД пойдёт по индексу?',
      preds: [
        {q: `(1) книга № ${gx}`, choices: IDX, answer: 'idx'},
        {q: `(2) книги автора № ${gy}`, choices: IDX, answer: 'seq'},
        {q: '(3) книги с номером меньше 1100', choices: IDX, answer: 'idx'},
      ],
      goals: ['Прогноз — для всех трёх', 'Три запроса — сами, с EXPLAIN', 'Сверить прогноз с планом'],
      sol: [
        `EXPLAIN SELECT * FROM book WHERE id = ${gx}`,
        `EXPLAIN SELECT * FROM book WHERE author_id = ${gy}`,
        'EXPLAIN SELECT * FROM book WHERE id < 1100',
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: every([new RegExp(`\\bid\\s*=\\s*${gx}\\b`), new RegExp(`\\bauthor_id\\s*=\\s*${gy}\\b`), /\bid\s*<=?\s*(1100|1099)\b/]),
      hint: 'Индекс есть на id, а на author_id — нет (внешний ключ индекса не создаёт). Номеров меньше 1100 — около 160 из 20 000.',
      ok: 'По индексу — там, где по ключу нужно немного строк; по author_id индекса нет — подряд, сколько бы строк ни подошло.',
    },
    // ═══════════════════════════════ контрольный
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Кому нужен индекс',
      lab: 'сложный · контрольный · выбор по плану',
      text: `Библиотекарь жалуется, что поиск «тормозит». Три запроса: (A) книга с ISBN ${isbn}; (B) книга № ${kk}; (C) книги толще 150 страниц. Напишите каждый сами и выполните EXPLAIN ANALYZE, заполните таблицу и отметьте, какому запросу нужен новый индекс. Обоснование — в протокол.`,
      q: 'Какому из трёх запросов поможет индекс — и почему именно ему?',
      goals: ['EXPLAIN ANALYZE всех трёх запросов', 'Таблица: способ чтения и отброшено фильтром', 'Нужен ли индекс — для каждого'],
      form: {
        t: 'book',
        need: true,
        cols: [
          {k: 'read', h: 'Способ чтения', kind: 'read'},
          {k: 'rm', h: 'Отброшено фильтром', kind: 'rm'},
          {k: 'need', h: 'Нужен индекс?', kind: 'yn'},
        ],
        rows: [
          {label: 'A', what: `ISBN ${isbn}`, sql: `SELECT * FROM book WHERE isbn = '${isbn}'`, re: /\bisbn\s*=/i, need: 'да'},
          {
            label: 'B',
            what: `книга № ${kk}`,
            sql: `SELECT * FROM book WHERE id = ${kk}`,
            re: new RegExp(`\\bid\\s*=\\s*${kk}\\b`),
            need: 'нет',
          },
          {label: 'C', what: 'толще 150 страниц', sql: 'SELECT * FROM book WHERE pages > 150', re: /\bpages\s*>\s*150\b/i, need: 'нет'},
        ],
      },
      sol: [
        `EXPLAIN ANALYZE SELECT * FROM book WHERE isbn = '${isbn}'`,
        `EXPLAIN ANALYZE SELECT * FROM book WHERE id = ${kk}`,
        'EXPLAIN ANALYZE SELECT * FROM book WHERE pages > 150',
      ],
      check: 'form',
      cmds: 'Запросы — с EXPLAIN ANALYZE, по одному или через ;. Потом — таблица и кнопка «Проверить таблицу»',
      allow: ALLOW,
      star: true,
      ok: 'Индекс нужен запросу A: Seq Scan и 20 059 строк из 20 060 прочитаны зря. B уже идёт по индексу ключа, а C нужна почти вся таблица — индекс её не ускорит. В ЛР-23 вы создадите индекс для A.',
    },
  ];
}
