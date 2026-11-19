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
    from = 575 + (D.seed % 22), // то же правило — в ЛР-23 (таблица «после индексов»)
    au = D.AU[(D.seed % 30) + 3];
  const small = (D.seed % 50) + 5,
    pre = `Book ${10 + (D.seed % 89)}`,
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
  // уровни-таблицы: у каждого варианта свои числа — найдено, отброшено, оценка
  const lim = 3 + (D.seed % 7),
    top = 5 + (D.seed % 11),
    dec = 1950 + 10 * (D.seed % 6),
    thickP = 300 + 10 * (D.seed % 20),
    most = 10 + (D.seed % 45),
    kw = 10 + (D.seed % 25),
    gw = 20 + (D.seed % 40);
  const isbn = `978-5-${1 + ((D.seed * 37) % 20000)}`,
    kk = 15000 + (D.seed % 900);
  // часть 4: трудные планы — числа варианта
  const per = [10, 15, 20, 25][D.seed % 4],
    page = 300 + ((D.seed * 7) % 400), // страница каталога: прочитано (page − 1) · per + per строк
    shift = 3 + (D.seed % 17),
    rid = 5000 + ((D.seed * 13) % 9000), // книга, которую «не видит» индекс: id + shift = rid + shift
    oX = 10000 + ((D.seed * 11) % 5000),
    oP = 450 + ((D.seed * 7) % 140),
    // автор и толщины с общими книгами: n % 40 = eA − 1 и n % 500 = p − 100 совместны, если равны по модулю 20;
    // толщин в списке eK, у каждой — 20 книг автора, а СУБД ждёт по одной
    eA = ((D.seed + 17) % 40) + 1,
    eK = 2 + (D.seed % 3),
    eP = Array.from({length: eK}, (_, i) => 100 + ((eA - 1) % 20) + 20 * (D.seed % 20) + 20 * i),
    // группы с HAVING: в диапазоне hN книг — у каждого автора по hT или hT + 1, больше hT — у hN % 40 авторов
    h1 = 3000 + (D.seed % 60) * 50,
    hN = 413 + (D.seed % 20),
    hT = Math.floor(hN / 40),
    // страница без OFFSET: книги по порядку — 1…60, потом 1001…; на позиции k > 60 стоит книга № 940 + k
    lastPrev = 940 + (page - 1) * per,
    tA = ((D.seed + 23) % 40) + 1,
    rT = 1 + (D.seed % 2);
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
  // таблица уровня: строки — запросы, столбцы — что вписать по плану; need — каждый запрос выполнить с EXPLAIN ANALYZE здесь
  const C = {
    read: {k: 'read', h: 'Способ чтения', kind: 'read'},
    rows: {k: 'rows', h: 'Найдено строк', kind: 'rows'},
    rm: {k: 'rm', h: 'Отброшено фильтром', kind: 'rm'},
    ms: {k: 'ms', h: 'Время, ms', kind: 'ms'},
    est: {k: 'est', h: 'Оценка rows', kind: 'est'},
    out: {k: 'out', h: 'Строк на выходе', kind: 'out'},
    agg: {k: 'agg', h: 'Узел группировки', kind: 'agg'},
    sort: {k: 'sort', h: 'Есть Sort?', kind: 'sortyn'},
  };
  const tab = (cols, rows) => ({t: 'book', need: true, cols: cols.map(k => C[k]), rows});
  const FORM_CMDS = 'Сначала запрос с EXPLAIN ANALYZE, потом таблица по своему плану и кнопка «Проверить таблицу»';
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
      text: `Запрос 2 — книга «${title}» (условие по title). EXPLAIN — способ чтения, EXPLAIN ANALYZE — время и строка Rows Removed by Filter: сколько строк прочитано зря. Впишите в таблицу, что увидели в плане.`,
      q: 'Как СУБД ищет по столбцу без индекса?',
      goals: [`EXPLAIN и EXPLAIN ANALYZE: SELECT * FROM book WHERE title = '${title}'`, 'Таблица: способ чтения, найдено, отброшено'],
      sol: [`EXPLAIN SELECT * FROM book WHERE title = '${title}'`, `EXPLAIN ANALYZE SELECT * FROM book WHERE title = '${title}'`],
      form: tab(
        ['read', 'rows', 'rm'],
        [{label: 'Запрос 2', what: `title = '${title}'`, sql: `SELECT * FROM book WHERE title = '${title}'`, re: /\btitle\s*=/i}],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: "… WHERE title = 'Book …' — текст в одинарных кавычках. Найдено — actual rows у Seq Scan, отброшено — Rows Removed by Filter.",
      ok: 'Seq Scan: индекса по title нет — СУБД прочитала всю таблицу, а подошла одна книга. Остальные отброшены фильтром.',
    },
    {
      key: 'range',
      title: 'Запрос 3 · диапазон',
      lab: 'ч. 2 · № 8–9 · отбор по диапазону',
      text: `Запрос 3 — толстые книги: больше ${from} страниц (pages > ${from}). EXPLAIN — способ чтения, EXPLAIN ANALYZE — время. В таблицу — способ чтения, сколько книг нашлось и сколько отброшено.`,
      q: 'Как СУБД отбирает диапазон по столбцу без индекса?',
      goals: [`EXPLAIN и EXPLAIN ANALYZE: SELECT * FROM book WHERE pages > ${from}`, 'Таблица: способ чтения, найдено, отброшено'],
      sol: [`EXPLAIN SELECT * FROM book WHERE pages > ${from}`, `EXPLAIN ANALYZE SELECT * FROM book WHERE pages > ${from}`],
      form: tab(
        ['read', 'rows', 'rm'],
        [
          {
            label: 'Запрос 3',
            what: `pages > ${from}`,
            sql: `SELECT * FROM book WHERE pages > ${from}`,
            re: new RegExp(`\\bpages\\s*>\\s*${from}\\b`, 'i'),
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: `… WHERE pages > ${from}. Найдено + отброшено = все строки таблицы.`,
      ok: 'Снова Seq Scan: по pages индекса нет, проверить пришлось каждую строку. Найдено и отброшено вместе — вся таблица.',
    },
    {
      key: 'byauthor',
      title: 'По внешнему ключу',
      lab: 'ч. 2 · ссылка — ещё не индекс',
      text: `Книги автора с id ${auId}: условие author_id = ${auId}. На этом столбце внешний ключ fk_book_author. Сначала прогноз, потом EXPLAIN ANALYZE и таблица: есть ли индекс, сколько книг у автора, сколько строк прочитано зря.`,
      q: 'Создаёт ли внешний ключ индекс?',
      goals: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${auId}`, 'Таблица: способ чтения, найдено, отброшено'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${auId}`],
      form: tab(
        ['read', 'rows', 'rm'],
        [
          {
            label: 'Автор',
            what: `author_id = ${auId}`,
            sql: `SELECT * FROM book WHERE author_id = ${auId}`,
            re: new RegExp(`\\bauthor_id\\s*=\\s*${auId}\\b`, 'i'),
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
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
      hint: `… WHERE author_id = ${auId}`,
      ok: 'Seq Scan: первичный ключ получает индекс сам, а внешний ключ — нет. Его создают отдельно — это ЛР-23.',
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
      title: 'Любые несколько',
      lab: 'ч. 3 · LIMIT без сортировки',
      text: `Запрос: любые ${lim} книг — без условия и без сортировки. Напишите его сами и выполните EXPLAIN ANALYZE. В таблицу — у строки Seq Scan: оценку rows (первые скобки, cost=…) и сколько строк прочитано на деле (вторые скобки, actual … rows).`,
      q: 'Всегда ли Seq Scan читает всю таблицу?',
      goals: [`EXPLAIN ANALYZE запроса «любые ${lim} книг»`, 'Таблица: оценка и прочитано на деле'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book LIMIT ${lim}`],
      form: tab(
        ['est', 'rows'],
        [
          {
            label: 'LIMIT',
            what: `любые ${lim} книг`,
            sql: `SELECT * FROM book LIMIT ${lim}`,
            re: new RegExp(`\\bfrom\\s+book\\s+limit\\s+${lim}\\s*;?\\s*$`, 'i'),
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: `LIMIT ${lim} — в самом конце запроса, без WHERE и ORDER BY.`,
      ok: 'Оценка — вся таблица, а прочитано столько, сколько попросили: Limit остановил чтение. Без ORDER BY первым строкам незачем ждать остальные.',
    },
    {
      key: 'sort',
      title: 'Первые по порядку',
      lab: 'ч. 3 · ORDER BY … LIMIT',
      text: `Два запроса, оба — с EXPLAIN ANALYZE: первые ${top} книг по порядку номеров и ${top} самых тонких книг. Напишите их сами и заполните таблицу: как прочитана book, есть ли в плане узел Sort и сколько занял запрос.`,
      q: 'Когда СУБД приходится сортировать?',
      goals: [`EXPLAIN ANALYZE: первые ${top} по номеру`, `EXPLAIN ANALYZE: ${top} самых тонких`, 'Таблица: способ чтения, Sort, время'],
      sol: [
        `EXPLAIN ANALYZE SELECT * FROM book ORDER BY id LIMIT ${top}`,
        `EXPLAIN ANALYZE SELECT * FROM book ORDER BY pages LIMIT ${top}`,
      ],
      form: tab(
        ['read', 'sort', 'ms'],
        [
          {
            label: 'По номеру',
            what: `первые ${top} по id`,
            sql: `SELECT * FROM book ORDER BY id LIMIT ${top}`,
            re: /order\s+by\s+(\w+\.)?id\b/i,
          },
          {
            label: 'Самые тонкие',
            what: `${top} с наименьшим pages`,
            sql: `SELECT * FROM book ORDER BY pages LIMIT ${top}`,
            re: /order\s+by\s+(\w+\.)?pages\b/i,
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: `«Первые по порядку» — ORDER BY … LIMIT ${top}. Самые тонкие — меньше всего страниц.`,
      ok: 'По id строки уже лежат в индексе по порядку — первые берутся сразу, без Sort. По pages индекса нет: всё читается и сортируется.',
    },
    {
      key: 'group',
      title: 'Книг каждого года',
      lab: 'ч. 3 · план группировки',
      text: `Среди книг с номерами от ${g1} до ${g1 + gw} включительно посчитайте, сколько книг каждого года издания: год и число книг. Напишите запрос с группировкой и выполните EXPLAIN ANALYZE. В таблицу — узел, который собрал группы, сколько групп он выдал и как прочитана book.`,
      q: 'Каким узлом СУБД группирует строки?',
      goals: ['Запрос: year и число книг, по номерам из задания', 'EXPLAIN ANALYZE', 'Таблица: узел группировки, групп, способ чтения'],
      sol: [`EXPLAIN ANALYZE SELECT year, count(*) FROM book WHERE id BETWEEN ${g1} AND ${g1 + gw} GROUP BY year`],
      form: tab(
        ['agg', 'out', 'read'],
        [
          {
            label: 'GROUP BY',
            what: `год и число книг, id ${g1}–${g1 + gw}`,
            sql: `SELECT year, count(*) FROM book WHERE id BETWEEN ${g1} AND ${g1 + gw} GROUP BY year`,
            re: /group\s+by\s+(\w+\.)?year\b/i,
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: `SELECT year, count(*) … WHERE id BETWEEN ${g1} AND ${g1 + gw} GROUP BY year. Групп столько, сколько разных годов, — это rows у верхнего узла.`,
      ok: 'Узел группировки собрал строки по годам: на выходе столько строк, сколько групп. А читала их СУБД по индексу — диапазон номеров узкий.',
    },
    {
      key: 'combo',
      title: 'Автор и год',
      lab: 'ч. 3 · два условия сразу',
      text: `Книги автора № ${cA}, изданные в ${cY} году. Напишите запрос сами и выполните EXPLAIN ANALYZE: каким узлом прочитана book, стоят ли в строке Filter оба условия, сколько строк найдено и сколько отброшено фильтром. Числа — в таблицу.`,
      q: 'Помогает ли второе условие прочитать меньше?',
      goals: ['Запрос с двумя условиями', 'EXPLAIN ANALYZE', 'Таблица: способ чтения, найдено, отброшено'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${cA} AND year = ${cY}`],
      form: tab(
        ['read', 'rows', 'rm'],
        [
          {
            label: 'Два условия',
            what: `автор № ${cA}, ${cY} год`,
            sql: `SELECT * FROM book WHERE author_id = ${cA} AND year = ${cY}`,
            re: /\bauthor_id\b[\s\S]*\byear\b|\byear\b[\s\S]*\bauthor_id\b/i,
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: 'Оба условия сразу — через AND.',
      ok: 'Seq Scan: оба условия — в одной строке Filter, их проверяют у каждой строки. Второе условие сократило ответ, но не чтение: прочитана вся таблица.',
    },
    {
      key: 'decade',
      title: 'Десятилетие, толстые',
      lab: 'ч. 3 · диапазон и условие',
      text: `Книги ${dec}-х годов (с ${dec} по ${dec + 9} включительно) толщиной больше ${thickP} страниц. Напишите запрос сами, выполните EXPLAIN ANALYZE и заполните таблицу: способ чтения, сколько строк нашлось и сколько отброшено.`,
      q: 'Как СУБД отбирает строки по двум столбцам без индексов?',
      goals: [`Запрос: годы ${dec}–${dec + 9} и больше ${thickP} страниц`, 'EXPLAIN ANALYZE', 'Таблица: способ чтения, найдено, отброшено'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE year BETWEEN ${dec} AND ${dec + 9} AND pages > ${thickP}`],
      form: tab(
        ['read', 'rows', 'rm'],
        [
          {
            label: 'Десятилетие',
            what: `${dec}–${dec + 9}, больше ${thickP} страниц`,
            sql: `SELECT * FROM book WHERE year BETWEEN ${dec} AND ${dec + 9} AND pages > ${thickP}`,
            re: /\byear\b[\s\S]*\bpages\b|\bpages\b[\s\S]*\byear\b/i,
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: `BETWEEN включает оба края. «Больше ${thickP}» — строго больше.`,
      ok: 'Условие на два столбца без индексов — снова Seq Scan: чтобы найти малую часть строк, СУБД прочитала все.',
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
      text: `Все книги, кроме первых ${most} номеров, — с id больше ${most}. Это почти вся таблица. Сначала прогноз, потом запрос и EXPLAIN ANALYZE: пойдёт ли СУБД по индексу первичного ключа? В таблицу — способ чтения, найдено и отброшено.`,
      q: 'Всегда ли СУБД идёт по индексу, если он есть?',
      goals: [`Запрос: id больше ${most}`, 'EXPLAIN ANALYZE', 'Таблица: способ чтения, найдено, отброшено'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE id > ${most}`],
      form: tab(
        ['read', 'rows', 'rm'],
        [
          {
            label: 'id > ' + most,
            what: `все, кроме первых ${most}`,
            sql: `SELECT * FROM book WHERE id > ${most}`,
            re: new RegExp(`\\bid\\s*>\\s*${most}\\b`, 'i'),
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
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
      hint: `WHERE id > ${most} — и EXPLAIN ANALYZE перед запросом.`,
      ok: 'Seq Scan: когда нужна почти вся таблица, ходить через индекс — лишняя работа. Отброшены как раз первые номера.',
    },
    {
      key: 'keyrange',
      title: 'Диапазон по ключу',
      lab: 'ч. 3 · узкий диапазон по индексу',
      text: `Книги с номерами от ${key} до ${key + kw} включительно — диапазон, как в запросе 3, но по первичному ключу. Напишите запрос, выполните EXPLAIN ANALYZE и заполните таблицу. Сравните способ чтения с запросом 3 (pages > ${from}).`,
      q: 'Пойдёт ли по индексу диапазон по ключу?',
      goals: [`Запрос: id от ${key} до ${key + kw}`, 'EXPLAIN ANALYZE', 'Таблица: способ чтения, найдено, время'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE id BETWEEN ${key} AND ${key + kw}`],
      form: tab(
        ['read', 'rows', 'ms'],
        [
          {
            label: 'Диапазон id',
            what: `${key}–${key + kw}`,
            sql: `SELECT * FROM book WHERE id BETWEEN ${key} AND ${key + kw}`,
            re: /\bid\s+between\b|\bid\s*>=?[\s\S]*\bid\s*<=?/i,
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
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
    // ═══════════════════════════════ сверхсложные · после контрольного, для «5»: без подсказок, запрос и выводы — сами
    {
      key: 'orcond',
      sup: true,
      title: 'Или — или',
      lab: 'сверхсложный · OR с неключевым столбцом',
      text: `Читатель ищет книгу № ${oX} или любую книгу толще ${oP} страниц — одним запросом, через OR. Индекс по id есть. Сначала прогноз, потом напишите запрос сами, выполните EXPLAIN ANALYZE и заполните таблицу.`,
      q: 'Помогает ли индекс, если одно из условий OR — без индекса?',
      goals: ['Прогноз', 'Запрос: номер или толщина — через OR', 'EXPLAIN ANALYZE', 'Таблица: способ чтения, найдено, отброшено'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE id = ${oX} OR pages > ${oP}`],
      form: tab(
        ['read', 'rows', 'rm'],
        [
          {
            label: 'OR',
            what: `№ ${oX} или толще ${oP} страниц`,
            sql: `SELECT * FROM book WHERE id = ${oX} OR pages > ${oP}`,
            re: new RegExp(`\\b${oX}\\b[\\s\\S]*\\bor\\b[\\s\\S]*\\bpages\\b|\\bpages\\b[\\s\\S]*\\bor\\b[\\s\\S]*\\b${oX}\\b`, 'i'),
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      pred: {
        q: `Как СУБД прочитает book для id = ${oX} OR pages > ${oP}?`,
        choices: [
          {k: 'idx', t: 'по индексу — в условии же есть id'},
          {k: 'seq', t: 'подряд — по pages индекса нет'},
        ],
        answer: 'seq',
      },
      hint: 'Строку подходит хотя бы одно условие из двух. Найдено — actual rows у строки чтения, отброшено — Rows Removed by Filter.',
      ok: 'Seq Scan: строке достаточно одного условия, а книги нужной толщины по индексу id не найти — значит, читать всё подряд. Индекс по id не спас ни одной строки.',
    },
    {
      key: 'estmiss',
      sup: true,
      title: 'СУБД ошиблась',
      lab: 'сверхсложный · оценка против факта',
      text: `Книги автора № ${eA} толщиной ровно ${eP.join(', ')} страниц (любое из этих чисел). Напишите запрос сами и выполните EXPLAIN ANALYZE. В таблицу — оценку rows у строки чтения book (первые скобки), сколько книг нашлось на деле (вторые скобки) и сколько отброшено. Во сколько раз СУБД ошиблась — объясните в протоколе.`,
      q: 'Откуда СУБД берёт оценку для двух условий сразу?',
      goals: ['Запрос: автор и число страниц', 'EXPLAIN ANALYZE', 'Таблица: оценка, найдено, отброшено'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${eA} AND pages IN (${eP.join(', ')})`],
      form: tab(
        ['est', 'rows', 'rm'],
        [
          {
            label: 'Автор и страницы',
            what: `автор № ${eA}, ${eP.join(' / ')} страниц`,
            sql: `SELECT * FROM book WHERE author_id = ${eA} AND pages IN (${eP.join(', ')})`,
            re: /\bauthor_id\b[\s\S]*\bpages\b|\bpages\b[\s\S]*\bauthor_id\b/i,
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      pred: {
        q: `Авторов 40, разных толщин 500, в списке — ${eK}. Сколько книг найдётся?`,
        choices: [
          {k: 'one', t: `около ${eK} — 20 000 / 40 / 500 × ${eK}`},
          {k: 'many', t: 'в разы больше, чем ждёт СУБД'},
        ],
        answer: 'many',
      },
      hint: 'Список значений — pages IN (…). Оценка — rows= в скобках cost=…, факт — rows= в скобках actual …. Наполнение книг — в задании уровня «20 000 книг»: автор и толщина считаются от одного и того же n.',
      ok: 'СУБД перемножила доли: 1/40 автора × 1/500 толщины — и ждала по одной книге на каждую толщину. Но в наших данных автор и толщина зависят от одного n, и условия совпадают куда чаще. Статистика по столбцам по отдельности не знает о связи столбцов.',
    },
    {
      key: 'having',
      sup: true,
      title: 'Плодовитые авторы',
      lab: 'сверхсложный · группы и HAVING',
      text: `Среди книг с номерами от ${h1} до ${h1 + hN - 1} включительно найдите авторов, у которых в этом диапазоне больше ${hT} книг: номер автора и число книг. Напишите запрос сами, выполните EXPLAIN ANALYZE и заполните таблицу: узел группировки, сколько групп осталось на выходе после HAVING и как прочитана book.`,
      q: 'Где в плане работает HAVING?',
      goals: [
        'Запрос: номер автора и число книг, только у кого больше, чем в задании',
        'EXPLAIN ANALYZE',
        'Таблица: узел группировки, групп на выходе, способ чтения',
      ],
      sol: [
        `EXPLAIN ANALYZE SELECT author_id, count(*) FROM book WHERE id BETWEEN ${h1} AND ${h1 + hN - 1} GROUP BY author_id HAVING count(*) > ${hT}`,
      ],
      form: tab(
        ['agg', 'out', 'read'],
        [
          {
            label: 'HAVING',
            what: `id ${h1}–${h1 + hN - 1}, больше ${hT} книг`,
            sql: `SELECT author_id, count(*) FROM book WHERE id BETWEEN ${h1} AND ${h1 + hN - 1} GROUP BY author_id HAVING count(*) > ${hT}`,
            re: /\bhaving\b/i,
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: 'Отбор групп — HAVING count(*) > …, после GROUP BY. Его Filter стоит у узла группировки, а не у чтения таблицы.',
      ok: 'HAVING — это Filter у самого узла группировки: сначала собраны все группы, потом лишние отброшены. На чтение таблицы он не влияет — его сократило условие WHERE на диапазон номеров.',
    },
    {
      key: 'offset',
      sup: true,
      title: 'Страница каталога',
      lab: 'сверхсложный · LIMIT … OFFSET',
      text: `Электронный каталог показывает книги по порядку номеров, по ${per} на странице. Читатель открыл страницу № ${page}. Выведите её одним запросом, выполните EXPLAIN ANALYZE и заполните таблицу: как прочитана book, сколько строк book прочитано на деле и сколько строк выдал запрос.`,
      q: 'Дёшево ли открыть далёкую страницу, если есть индекс?',
      goals: [`Запрос: страница № ${page} по ${per} книг`, 'EXPLAIN ANALYZE', 'Таблица: способ чтения, прочитано, на выходе'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book ORDER BY id LIMIT ${per} OFFSET ${(page - 1) * per}`],
      form: {
        t: 'book',
        need: true,
        cols: [C.read, {k: 'rows', h: 'Прочитано строк book', kind: 'rows'}, C.out],
        rows: [
          {
            label: `Страница ${page}`,
            what: `по ${per} книг, по номерам`,
            sql: `SELECT * FROM book ORDER BY id LIMIT ${per} OFFSET ${(page - 1) * per}`,
            re: /\boffset\b/i,
          },
        ],
      },
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      pred: {
        q: `Сколько строк book прочитает СУБД для страницы № ${page}?`,
        choices: [
          {k: 'page', t: `только ${per} — индекс сразу ведёт на страницу`},
          {k: 'all', t: 'все строки всех страниц до неё и её саму'},
        ],
        answer: 'all',
      },
      hint: `OFFSET — сколько строк пропустить: страницы до № ${page} — это (${page} − 1) × ${per} строк. Прочитано — actual rows у Index Scan, на выходе — у верхней строки Limit.`,
      ok: 'Index Scan прочитал все строки до нужной страницы: OFFSET их не перепрыгивает, а отсчитывает по одной и выбрасывает. Чем дальше страница, тем дороже. Быстрее — «продолжить с последнего номера»: WHERE id > … ORDER BY id LIMIT ….',
    },
    {
      key: 'rewrite',
      sup: true,
      title: 'Запрос не видит индекс',
      lab: 'сверхсложный · перепишите условие',
      text: `Коллега ищет книгу так: SELECT * FROM book WHERE id + ${shift} = ${rid + shift}. Выполните его с EXPLAIN ANALYZE, затем перепишите условие так, чтобы запрос вернул ту же книгу, но пошёл по индексу pk_book, — и тоже EXPLAIN ANALYZE. Таблица — по обоим планам.`,
      q: 'Почему выражение над столбцом мешает индексу?',
      goals: [
        'EXPLAIN ANALYZE запроса коллеги',
        'Переписанный запрос — та же книга, по индексу',
        'Таблица: способ чтения и отброшено — у обоих',
      ],
      sol: [
        `EXPLAIN ANALYZE SELECT * FROM book WHERE id + ${shift} = ${rid + shift}`,
        `EXPLAIN ANALYZE SELECT * FROM book WHERE id = ${rid}`,
      ],
      form: tab(
        ['read', 'rows', 'rm'],
        [
          {
            label: 'Как у коллеги',
            what: `id + ${shift} = ${rid + shift}`,
            sql: `SELECT * FROM book WHERE id + ${shift} = ${rid + shift}`,
            re: new RegExp(`\\bid\\s*\\+\\s*${shift}\\s*=\\s*${rid + shift}\\b`, 'i'),
          },
          {
            label: 'Переписан',
            what: 'та же книга, по индексу',
            sql: `SELECT * FROM book WHERE id = ${rid}`,
            re: new RegExp(`\\bid\\s*=\\s*${rid}\\b`, 'i'),
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: 'Индекс хранит сами значения id, а не id + число. Перенесите число в другую часть равенства: столбец должен остаться один.',
      ok: 'У коллеги — Seq Scan: чтобы проверить id + число, СУБД вычислила выражение для каждой из 20 000 строк. Столбец «в чистом виде» — и сразу Index Scan, ни одной лишней строки. Правило: не оборачивайте индексированный столбец в выражения и функции.',
    },
    {
      key: 'joinagg',
      sup: true,
      title: 'Самые читаемые авторы',
      lab: 'сверхсложный · соединение и группировка',
      text: 'Для каждого автора, чьи книги брали в библиотеке, выведите его имя и сколько раз выдавали его книги. Нужны три таблицы: loan, book, author. Напишите запрос сами, выполните EXPLAIN ANALYZE и заполните таблицу: верхний узел соединения, узел группировки, сколько строк book прочитано на деле и сколько авторов в ответе.',
      q: 'Сколько из 20 000 книг пришлось прочитать, чтобы сосчитать выдачи?',
      goals: [
        'Запрос: имя автора и число выдач — loan, book, author',
        'EXPLAIN ANALYZE',
        'Таблица: соединение, группировка, прочитано книг, авторов',
      ],
      sol: [
        'EXPLAIN ANALYZE SELECT a.full_name, count(*) FROM loan l JOIN book b ON b.id = l.book_id JOIN author a ON a.id = b.author_id GROUP BY a.full_name',
      ],
      form: {
        t: 'book',
        need: true,
        cols: [
          {k: 'join', h: 'Верхнее соединение', kind: 'join'},
          C.agg,
          {k: 'rows', h: 'Прочитано строк book', kind: 'rows'},
          {k: 'out', h: 'Авторов в ответе', kind: 'out'},
        ],
        rows: [
          {
            label: 'Выдачи по авторам',
            what: 'loan + book + author, GROUP BY',
            sql: 'SELECT a.full_name, count(*) FROM loan l JOIN book b ON b.id = l.book_id JOIN author a ON a.id = b.author_id GROUP BY a.full_name',
            re: /^(?=[\s\S]*\bloan\b)(?=[\s\S]*\bauthor\b)(?=[\s\S]*\bgroup\s+by\b)/i,
          },
        ],
      },
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      hint: 'FROM loan l JOIN book b ON … JOIN author a ON … GROUP BY …. План — снизу вверх: верхняя строка с Join или Nested Loop — последнее соединение, над ним — узел группировки.',
      ok: 'Выдачи ссылаются только на первые книги — по индексу pk_book СУБД прочитала их немного и остановилась. Соединение собрало пары «выдача — автор», узел группировки свёл их в одну строку на автора.',
    },
    {
      sup: true,
      key: 'keyset',
      title: 'Страница без OFFSET',
      lab: 'сверхсложный · продолжить с последнего номера',
      text: `Та же страница каталога № ${page} по ${per} книг, но быстрее: последняя книга на предыдущей странице — № ${lastPrev}. Выведите следующие ${per} книг по порядку номеров без OFFSET, выполните EXPLAIN ANALYZE и заполните таблицу. Сравните «прочитано» с уровнем «Страница каталога».`,
      q: 'Как открыть далёкую страницу, не перебирая всё до неё?',
      goals: ['Запрос без OFFSET — та же страница', 'EXPLAIN ANALYZE', 'Таблица: способ чтения, прочитано, на выходе'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE id > ${lastPrev} ORDER BY id LIMIT ${per}`],
      form: {
        t: 'book',
        need: true,
        cols: [C.read, {k: 'rows', h: 'Прочитано строк book', kind: 'rows'}, C.out],
        rows: [
          {
            label: `Страница ${page}`,
            what: `после № ${lastPrev}, по ${per}`,
            sql: `SELECT * FROM book WHERE id > ${lastPrev} ORDER BY id LIMIT ${per}`,
            re: new RegExp(`^(?![\\s\\S]*\\boffset\\b)[\\s\\S]*\\bid\\s*>=?\\s*${lastPrev}\\b`, 'i'),
          },
        ],
      },
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      ok: 'Index Scan начал прямо с нужного номера и прочитал ровно одну страницу: условие на ключ ведёт в индекс сразу к месту. Так листают каталоги и ленты на больших таблицах.',
    },
    {
      sup: true,
      key: 'notloaned',
      title: 'Ни разу не выдавали',
      lab: 'сверхсложный · NOT EXISTS в плане',
      text: 'Среди первых 60 книг (номера 1–60) найдите те, которые ни разу не выдавали: номер и название, условие — через NOT EXISTS по таблице loan. Выполните EXPLAIN ANALYZE и заполните таблицу: как прочитана book, сколько её строк прочитано и сколько книг в ответе.',
      q: 'Как СУБД выполняет NOT EXISTS?',
      goals: ['Запрос: номер и название, NOT EXISTS по loan', 'EXPLAIN ANALYZE', 'Таблица: способ чтения, прочитано, в ответе'],
      sol: [
        'EXPLAIN ANALYZE SELECT b.id, b.title FROM book b WHERE b.id <= 60 AND NOT EXISTS (SELECT 1 FROM loan l WHERE l.book_id = b.id)',
      ],
      form: {
        t: 'book',
        need: true,
        cols: [C.read, {k: 'rows', h: 'Прочитано строк book', kind: 'rows'}, {k: 'out', h: 'Книг в ответе', kind: 'out'}],
        rows: [
          {
            label: 'Не выдавали',
            what: 'номера 1–60, NOT EXISTS',
            sql: 'SELECT b.id, b.title FROM book b WHERE b.id <= 60 AND NOT EXISTS (SELECT 1 FROM loan l WHERE l.book_id = b.id)',
            re: /\bnot\s+exists\b/i,
          },
        ],
      },
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      ok: 'В плане нет подзапроса, который выполняется для каждой книги: СУБД превратила NOT EXISTS в Anti Join — выдачи сложены в хеш-таблицу, и каждая из 60 книг проверена по ней один раз.',
    },
    {
      sup: true,
      key: 'topthick',
      title: 'Пять самых толстых',
      lab: 'сверхсложный · отбор, сортировка, LIMIT',
      text: `${top} самых толстых книг автора № ${tA}. Напишите запрос, выполните EXPLAIN ANALYZE и заполните таблицу: как прочитана book, есть ли Sort, сколько строк дошло до сортировки и сколько отброшено фильтром.`,
      q: 'Сколько строк приходится сортировать ради нескольких первых?',
      goals: [`Запрос: ${top} самых толстых книг автора № ${tA}`, 'EXPLAIN ANALYZE', 'Таблица: способ чтения, Sort, найдено, отброшено'],
      sol: [`EXPLAIN ANALYZE SELECT * FROM book WHERE author_id = ${tA} ORDER BY pages DESC LIMIT ${top}`],
      form: tab(
        ['read', 'sort', 'rows', 'rm'],
        [
          {
            label: 'Самые толстые',
            what: `автор № ${tA}, ${top} шт.`,
            sql: `SELECT * FROM book WHERE author_id = ${tA} ORDER BY pages DESC LIMIT ${top}`,
            re: /order\s+by\s+(\w+\.)?pages\s+desc\b/i,
          },
        ],
      ),
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      ok: 'Seq Scan отобрал все книги автора, Sort упорядочил их, Limit взял первые. Сортировка «top-N» держит в памяти только лучшие строки — но прочитать пришлось всю таблицу: индекса на author_id нет.',
    },
    {
      sup: true,
      key: 'readers',
      title: 'Активные читатели',
      lab: 'сверхсложный · соединение, группы, HAVING',
      text: `Читатели, которые брали книги больше ${rT} раз: ФИО и число выдач. Напишите запрос (reader и loan), выполните EXPLAIN ANALYZE и заполните таблицу: узел соединения, узел группировки и сколько читателей в ответе.`,
      q: 'В каком порядке СУБД соединяет, группирует и отбирает группы?',
      goals: ['Запрос: ФИО и число выдач, только больше заданного', 'EXPLAIN ANALYZE', 'Таблица: соединение, группировка, в ответе'],
      sol: [
        `EXPLAIN ANALYZE SELECT r.full_name, count(*) FROM reader r JOIN loan l ON l.reader_id = r.id GROUP BY r.full_name HAVING count(*) > ${rT}`,
      ],
      form: {
        t: 'reader',
        need: true,
        cols: [{k: 'join', h: 'Соединение', kind: 'join'}, C.agg, {k: 'out', h: 'Читателей в ответе', kind: 'out'}],
        rows: [
          {
            label: 'Активные',
            what: `больше ${rT} выдач`,
            sql: `SELECT r.full_name, count(*) FROM reader r JOIN loan l ON l.reader_id = r.id GROUP BY r.full_name HAVING count(*) > ${rT}`,
            re: /^(?=[\s\S]*\breader\b)(?=[\s\S]*\bloan\b)(?=[\s\S]*\bhaving\b)/i,
          },
        ],
      },
      check: 'form',
      cmds: FORM_CMDS,
      allow: ALLOW,
      star: true,
      ok: 'Снизу вверх: обе таблицы прочитаны, соединены, сгруппированы по читателю, и только потом HAVING отбросил группы — его Filter стоит у узла группировки.',
    },
  ];
}
