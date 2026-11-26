// ЛР-25 · «Представления: сохранённый запрос как интерфейс пользователя» — CREATE VIEW, запросы к представлению,
// CREATE OR REPLACE и его пределы, представление над представлением и зависимости, право только на представление
// (роль не видит таблицу), изменение данных через простое представление, WITH CHECK OPTION, материализованное
// представление и REFRESH, контрольный — рабочее место выдачи. После контрольного — 10 сверхсложных: представление
// по условию словами, без подсказок.
// Представление появляется в дереве объектов (Schemas → library → Views), \dv — список, \d имя — столбцы и запрос.

const ALLOW = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'GRANT', 'REVOKE', 'REFRESH', 'SET', 'RESET'];
const DAY = '2026-10-21'; // «сегодня» в задачах про выдачи

// столбцы представления (обычного или материализованного) по порядку; [] — такого представления нет
const viewCols = async (c, v) =>
  (
    await c.q(`SELECT a.attname AS c FROM pg_attribute a JOIN pg_class t ON t.oid = a.attrelid JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE n.nspname = 'library' AND t.relname = '${v}' AND t.relkind IN ('v', 'm') AND a.attnum > 0 AND NOT a.attisdropped ORDER BY a.attnum`)
  ).map(r => r.c);
const viewDef = async (c, v) =>
  ((await c.q(`SELECT definition AS d FROM pg_views WHERE schemaname = 'library' AND viewname = '${v}'`))[0] || {}).d || '';
const checkOpt = async (c, v) =>
  ((await c.q(`SELECT check_option AS o FROM information_schema.views WHERE table_schema = 'library' AND table_name = '${v}'`))[0] || {})
    .o || 'NONE';
const cell = v => (v === null || v === undefined ? null : v instanceof Date ? v.toISOString().slice(0, 10) : String(v));
const bag = rows =>
  rows
    .map(r => JSON.stringify(Object.values(r).map(cell)))
    .sort()
    .join('\n');
// представление v: столбцы cols (по порядку) и те же строки, что у эталонного запроса sql (порядок строк не важен)
async function sameView(c, v, cols, sql) {
  const have = await viewCols(c, v);
  if (!have.length) return null;
  if (have.join() !== cols.join())
    return {fail: `Столбцы ${v}: ${have.join(', ')}, а нужны ${cols.join(', ')} — именно с такими именами и в таком порядке.`};
  const got = await c.q(`SELECT ${cols.join(', ')} FROM library.${v}`),
    exp = await c.q(sql);
  if (bag(got) !== bag(exp))
    return {
      fail: `В ${v} ${got.length} строк, а должно быть ${exp.length}${got.length === exp.length ? ' — число то же, но значения другие' : ''}. Проверьте соединение и условие отбора.`,
    };
  return {ok: true, note: `${v}: ${cols.join(', ')} · ${got.length} строк`};
}
const viewLevel = (v, cols, sql, more) => async c => {
  const r = await sameView(c, v, cols, sql);
  if (!r || !r.ok || !more) return r;
  return (await more(c)) || r;
};
const fromView = v => [
  {re: new RegExp(`\\bfrom\\s+(library\\.)?${v}\\b`, 'i'), msg: `запрос нужен к представлению ${v}, а не к таблицам.`},
];

export function levels(D) {
  const R = D.role,
    pass = 'Rd-2026-x';
  // автор варианта — у него не меньше трёх книг
  const cnt = id => D.BK.filter(b => b.author_id === id).length;
  const A3 = D.AU.filter(a => cnt(a.id) >= 3),
    AX = A3[D.seed % A3.length],
    AN = AX.full_name;
  const tX = D.BK.find(b => b.author_id === AX.id).title;
  const newT = `New Arrival ${(D.seed % 90) + 10}`;
  const P = 300 + 20 * (D.seed % 10); // «толстая» книга — больше P страниц
  const rid = (D.seed % 14) + 1,
    newName = 'Vetrova Ya. Yu.',
    phone = `+7 900 ${200 + (D.seed % 700)}-11-22`;
  // книга на руках дольше N дней: 21, а если таких в варианте нет — меньше
  const held = D.LN.filter(l => !l.returned).map(l => (Date.parse(DAY) - Date.parse(l.taken)) / 864e5);
  const N = [21, 14, 7, 3].find(n => held.some(d => d > n)) ?? 0;
  const CAT = 'SELECT b.title, a.full_name AS author, b.year FROM book b JOIN author a ON a.id = b.author_id';
  const CAT4 = 'SELECT b.title, a.full_name AS author, b.year, b.pages FROM book b JOIN author a ON a.id = b.author_id';
  const ONLOAN =
    'SELECT r.full_name AS reader, b.title, l.taken FROM loan l JOIN reader r ON r.id = l.reader_id JOIN book b ON b.id = l.book_id WHERE l.returned IS NULL';
  const STATS = 'SELECT author, count(*) AS books, sum(pages) AS pages FROM v_catalog GROUP BY author';
  const STATS_T =
    'SELECT a.full_name AS author, count(*) AS books, sum(b.pages) AS pages FROM book b JOIN author a ON a.id = b.author_id GROUP BY a.full_name';
  const THICK = `SELECT id, title, author_id, pages FROM book WHERE pages > ${P}`;
  const DESK =
    'SELECT r.card, r.full_name AS reader, b.title, l.taken FROM loan l JOIN reader r ON r.id = l.reader_id JOIN book b ON b.id = l.book_id WHERE l.returned IS NULL';
  const RSTATS =
    'SELECT r.full_name AS reader, count(*) AS loans, count(*) FILTER (WHERE l.returned IS NULL) AS on_hand FROM loan l JOIN reader r ON r.id = l.reader_id GROUP BY r.id, r.full_name';
  // ход команд: индекс первой подходящей
  const at = (T, f, from = -1) => T.findIndex((x, i) => i > from && f(x));
  return [
    // ═══════════════════════════════ часть 1 · представление: создать и спросить
    {
      key: 'first',
      title: 'Каталог для читателя',
      lab: 'ч. 1 · № 3 · CREATE VIEW',
      text: 'Читателю не нужны номера авторов — ему нужен каталог: название книги, имя автора, год. Сохраните такой запрос в базе представлением v_catalog со столбцами title, author, year. Представление появится в дереве: library → Views.',
      q: 'Что хранит представление — строки или запрос?',
      goals: ['Представление v_catalog', 'Столбцы: title, author, year', 'Все книги — с именем автора'],
      ref: [`CREATE VIEW v_catalog AS ${CAT}`],
      check: 'tx',
      allow: ALLOW,
      verify: c => sameView(c, 'v_catalog', ['title', 'author', 'year'], CAT),
      hint: 'CREATE VIEW v_catalog AS SELECT b.title, a.full_name AS author, b.year FROM book b JOIN author a ON …;',
      ok: 'В базе сохранён запрос, а не строки: каждое обращение к v_catalog выполняет его заново.',
    },
    {
      key: 'use',
      title: 'Спросить представление',
      lab: 'ч. 1 · № 4 · запрос к VIEW',
      text: `Книги автора ${AN} — название и год, от старых к новым (при равном годе — по названию). Запрос — к v_catalog, как к таблице: соединять ничего не нужно.`,
      q: 'Чем запрос к представлению проще запроса к таблицам?',
      goals: ['FROM v_catalog', `Только книги ${AN}`, 'Столбцы: title, year; порядок — год, название'],
      ask: `SELECT title, year FROM v_catalog WHERE author = '${AN}' ORDER BY year, title`,
      must: fromView('v_catalog'),
      order: true,
      ok: 'Соединение спрятано в представлении: пользователь пишет простой запрос, а СУБД подставляет сохранённый.',
    },
    {
      key: 'bygroup',
      title: 'Сколько книг у автора',
      lab: 'ч. 1 · группировка по представлению',
      text: 'По v_catalog: у каждого автора — число книг (author, books). Сначала авторы с большим числом книг, при равенстве — по имени.',
      q: 'Можно ли группировать строки представления?',
      goals: ['FROM v_catalog', 'Столбцы: author, books', 'Порядок: books по убыванию, затем author'],
      ask: 'SELECT author, count(*) AS books FROM v_catalog GROUP BY author ORDER BY books DESC, author',
      must: fromView('v_catalog'),
      order: true,
      names: true,
      ok: 'С представлением работают как с таблицей: WHERE, GROUP BY, ORDER BY — всё то же.',
    },
    {
      key: 'live',
      title: 'Новая книга — сразу в каталоге',
      lab: 'ч. 1 · представление не хранит данные',
      text: `Поступила книга: id 101, «${newT}», автор № ${AX.id}, 2026 год, 240 страниц. Добавьте её в book — и покажите запросом к v_catalog, что она уже в каталоге, хотя представление никто не трогал.`,
      q: 'Нужно ли обновлять представление после INSERT?',
      goals: ['INSERT в book', `SELECT из v_catalog — «${newT}» на месте`],
      ref: [`INSERT INTO book (id, title, author_id, year, pages) VALUES (101, '${newT}', ${AX.id}, 2026, 240)`],
      sol: [
        `INSERT INTO book (id, title, author_id, year, pages) VALUES (101, '${newT}', ${AX.id}, 2026, 240)`,
        `SELECT title, author, year FROM v_catalog WHERE title = '${newT}'`,
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        const i = at(c.trail, x => x.kind === 'INSERT' && x.table === 'book' && !x.code);
        if (i < 0) return null;
        if (!(await c.q(`SELECT 1 FROM library.book WHERE title = '${newT}'`)).length)
          return {fail: `В book нет книги «${newT}» — сверьте название.`};
        const s = at(c.trail, x => x.kind === 'SELECT' && x.table === 'v_catalog' && !x.code && x.n > 0, i);
        return s >= 0
          ? {ok: true, note: `INSERT в book → «${newT}» видна в v_catalog`}
          : {wait: 'Книга добавлена. Теперь найдите её запросом к v_catalog.'};
      },
      hint: `INSERT INTO book (…) VALUES (…); SELECT * FROM v_catalog WHERE title = '${newT}';`,
      ok: 'Обновлять ничего не нужно: представление каждый раз читает таблицы заново.',
    },
    {
      key: 'readers',
      title: 'Читатели без телефонов',
      lab: 'ч. 1 · представление — часть столбцов',
      text: 'На стойке регистрации видят читателей, но не их телефоны. Создайте представление v_reader_public: id, full_name, card — все читатели, без phone.',
      q: 'Как открыть пользователю не все столбцы таблицы?',
      goals: ['Представление v_reader_public', 'Столбцы: id, full_name, card', 'Все читатели'],
      ref: ['CREATE VIEW v_reader_public AS SELECT id, full_name, card FROM reader'],
      check: 'tx',
      allow: ALLOW,
      verify: c => sameView(c, 'v_reader_public', ['id', 'full_name', 'card'], 'SELECT id, full_name, card FROM reader'),
      hint: 'CREATE VIEW v_reader_public AS SELECT … FROM reader;',
      ok: 'Телефонов в представлении нет — и показать их через него нельзя. Дальше по нему выдадим права.',
    },
    {
      key: 'onloan',
      title: 'Книги на руках',
      lab: 'ч. 1 · представление на три таблицы',
      text: 'Представление v_on_loan — книги, которые ещё не вернули: reader (имя читателя), title, taken. Здесь соединяются три таблицы.',
      q: 'Какое условие отличает книгу на руках?',
      goals: ['Представление v_on_loan', 'Столбцы: reader, title, taken', 'Только невозвращённые'],
      ref: [`CREATE VIEW v_on_loan AS ${ONLOAN}`],
      check: 'tx',
      allow: ALLOW,
      verify: c => sameView(c, 'v_on_loan', ['reader', 'title', 'taken'], ONLOAN),
      hint: '… FROM loan l JOIN reader r ON … JOIN book b ON … WHERE l.returned IS NULL',
      ok: 'Запрос на три таблицы теперь — одно слово: v_on_loan.',
    },
    {
      key: 'overdue',
      title: 'Кто держит книгу долго',
      lab: 'ч. 1 · вычисление по представлению',
      text: `По v_on_loan: на ${DAY} — книги, которые на руках дольше ${N} дней. Столбцы reader, title и days — сколько дней прошло (дата минус дата — число дней). Сначала самые долгие, при равенстве — по читателю.`,
      q: 'Сколько дней книга на руках?',
      goals: ['FROM v_on_loan', 'Столбцы: reader, title, days', `Только дольше ${N} дней; порядок — days по убыванию, reader`],
      ask: `SELECT reader, title, DATE '${DAY}' - taken AS days FROM v_on_loan WHERE DATE '${DAY}' - taken > ${N} ORDER BY days DESC, reader`,
      must: fromView('v_on_loan'),
      order: true,
      names: true,
      ok: 'Представление — как таблица: к его столбцам применяют вычисления и условия.',
    },
    {
      key: 'replace',
      title: 'Дописать столбец',
      lab: 'ч. 1 · CREATE OR REPLACE VIEW',
      text: 'В каталоге нужен ещё и объём книги. Замените v_catalog так, чтобы после title, author, year шёл столбец pages — командой CREATE OR REPLACE VIEW, не удаляя представление.',
      q: 'Что позволяет CREATE OR REPLACE?',
      goals: ['CREATE OR REPLACE VIEW v_catalog', 'Столбцы: title, author, year, pages'],
      ref: [`CREATE OR REPLACE VIEW v_catalog AS ${CAT4}`],
      check: 'tx',
      allow: ALLOW,
      verify: c => sameView(c, 'v_catalog', ['title', 'author', 'year', 'pages'], CAT4),
      hint: 'CREATE OR REPLACE VIEW v_catalog AS SELECT b.title, a.full_name AS author, b.year, b.pages FROM …;',
      ok: 'Новый столбец дописан в конец — старые запросы к v_catalog работают как раньше.',
    },
    {
      key: 'replacefail',
      title: 'Убрать столбец нельзя',
      lab: 'ч. 1 · предел CREATE OR REPLACE',
      text: 'Попробуйте тем же способом убрать из v_catalog столбец year: CREATE OR REPLACE VIEW v_catalog AS SELECT b.title, a.full_name AS author, b.pages FROM … Прочитайте ответ СУБД.',
      q: 'Что ответит СУБД?',
      goals: ['CREATE OR REPLACE без year', 'Отказ СУБД: cannot …'],
      sol: [
        'CREATE OR REPLACE VIEW v_catalog AS SELECT b.title, a.full_name AS author, b.pages FROM book b JOIN author a ON a.id = b.author_id',
      ],
      check: 'error',
      code: '42P16',
      allow: ALLOW,
      hint: 'Уберите b.year из списка столбцов и выполните CREATE OR REPLACE.',
      ok: 'CREATE OR REPLACE только дописывает столбцы в конец. Убрать или переставить — DROP VIEW и CREATE VIEW заново: на представление могут опираться другие запросы.',
    },
    {
      key: 'stats',
      hard: true,
      title: 'Представление над представлением',
      lab: 'сложный · сводка по v_catalog',
      text: 'Сводка для отчёта: представление v_author_stats — author, books (число книг), pages (страниц всего). Постройте его по v_catalog, а не по таблицам.',
      q: 'Можно ли строить представление на представлении?',
      goals: ['Представление v_author_stats', 'Столбцы: author, books, pages', 'FROM v_catalog'],
      ref: [`CREATE VIEW v_author_stats AS ${STATS}`],
      check: 'tx',
      allow: ALLOW,
      verify: viewLevel('v_author_stats', ['author', 'books', 'pages'], STATS_T, async c =>
        /v_catalog/.test(await viewDef(c, 'v_author_stats'))
          ? null
          : {fail: 'v_author_stats построено по таблицам, а нужно — по v_catalog.'},
      ),
      hint: 'CREATE VIEW v_author_stats AS SELECT author, count(*) AS books, sum(pages) AS pages FROM v_catalog GROUP BY author;',
      ok: 'Представление опирается на представление: поменяется v_catalog — изменится и сводка.',
    },
    {
      key: 'dropfail',
      title: 'Удалить нельзя — на нём держатся',
      lab: 'ч. 1 · зависимости',
      text: 'Попробуйте удалить v_catalog: DROP VIEW v_catalog. Прочитайте отказ: кто от него зависит?',
      q: 'Почему СУБД не удаляет представление?',
      goals: ['DROP VIEW v_catalog', 'Отказ: другие объекты зависят от него'],
      sol: ['DROP VIEW v_catalog'],
      check: 'error',
      code: '2BP01',
      allow: ALLOW,
      hint: 'DROP VIEW v_catalog;',
      ok: 'v_author_stats построено на v_catalog — без него оно сломается. Удалить можно только вместе: DROP VIEW … CASCADE (и это нужно делать осознанно).',
    },
    // ═══════════════════════════════ часть 2 · права через представление
    {
      key: 'grantview',
      title: 'Право — только на представление',
      lab: 'ч. 2 · GRANT на VIEW',
      text: `Роль стойки регистрации — ${R} (со входом по паролю, например '${pass}'). Создайте её и выдайте USAGE на схему library и SELECT только на v_reader_public — на саму таблицу reader прав не давайте.`,
      q: 'Как открыть роли часть таблицы?',
      goals: [`Роль ${R}: вход по паролю`, 'USAGE на схему library', 'SELECT на v_reader_public, не на reader'],
      ref: [
        `CREATE ROLE ${R} LOGIN PASSWORD '${pass}'`,
        `GRANT USAGE ON SCHEMA library TO ${R}`,
        `GRANT SELECT ON library.v_reader_public TO ${R}`,
      ],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const r = (await c.q(`SELECT rolcanlogin AS l FROM pg_roles WHERE rolname = '${R}'`))[0];
        if (!r) return null;
        if (!r.l) return {fail: 'Роли нужен вход: LOGIN.'};
        const t = (await c.q(`SELECT has_table_privilege('${R}', 'library.reader', 'SELECT') AS ok`))[0].ok;
        if (t) return {fail: 'Роль получила SELECT на саму reader — а должна видеть только представление.'};
        const v = (await c.q(`SELECT has_table_privilege('${R}', 'library.v_reader_public', 'SELECT') AS ok`))[0].ok,
          u = (await c.q(`SELECT has_schema_privilege('${R}', 'library', 'USAGE') AS ok`))[0].ok;
        if (v && u) return {ok: true, note: `${R}: SELECT на v_reader_public`};
        return {wait: `Роль есть. Осталось: ${[!u && 'USAGE на схему', !v && 'SELECT на v_reader_public'].filter(Boolean).join('; ')}.`};
      },
      hint: `CREATE ROLE …; GRANT USAGE ON SCHEMA library TO ${R}; GRANT SELECT ON library.v_reader_public TO ${R};`,
      ok: 'Права выдаются на представление так же, как на таблицу.',
    },
    {
      key: 'asrole',
      title: 'Видно только своё',
      lab: 'ч. 2 · проверка под ролью',
      text: `Подключитесь под ролью (\\c library ${R}) и покажите: v_reader_public читается, а таблица reader — отказ.`,
      q: 'Что видит роль?',
      goals: [`\\c library ${R}`, 'SELECT из v_reader_public — строки', 'SELECT из reader — отказ'],
      sol: [`\\c library ${R}`, 'SELECT * FROM v_reader_public', 'SELECT * FROM reader'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Представление читает таблицу reader. Прочитает ли его роль, у которой нет права на reader?',
        choices: [
          {k: 'yes', t: 'да — у неё есть право на представление'},
          {k: 'no', t: 'нет — у неё нет права на reader'},
        ],
        answer: 'yes',
      },
      verify: c => {
        const T = c.trail.filter(x => x.kind === 'SELECT' && x.role === R);
        const yes = T.find(x => x.table === 'v_reader_public' && !x.code),
          no = T.find(x => x.table === 'reader' && x.code === '42501');
        if (yes && no) return {ok: true, note: 'v_reader_public — читается · reader — permission denied'};
        if (yes) return {wait: 'Представление читается. Теперь попробуйте саму таблицу reader.'};
        if (no) return {wait: 'reader закрыта. Теперь прочитайте v_reader_public.'};
        return c.trail.some(x => x.kind === 'SELECT' && !x.role) ? {wait: `Это вы под своим именем. Сначала \\c library ${R}.`} : null;
      },
      hint: `\\c library ${R}; SELECT * FROM v_reader_public; SELECT * FROM reader;`,
      ok: 'Представление читает таблицу с правами своего владельца: роль видит три столбца и не видит телефонов.',
    },
    // ═══════════════════════════════ часть 3 · изменение через представление
    {
      key: 'updview',
      title: 'Изменить через представление',
      lab: 'ч. 3 · простое представление изменяемо',
      text: `Читательница № ${rid} сменила фамилию — теперь она ${newName}. Исправьте full_name через v_reader_public (UPDATE v_reader_public …), не трогая reader напрямую. Проверьте, что в reader строка изменилась.`,
      q: 'Можно ли менять данные через представление?',
      goals: ['UPDATE v_reader_public', `reader: № ${rid} — ${newName}`],
      ref: [`UPDATE v_reader_public SET full_name = '${newName}' WHERE id = ${rid}`],
      sol: [`UPDATE v_reader_public SET full_name = '${newName}' WHERE id = ${rid}`, `SELECT id, full_name FROM reader WHERE id = ${rid}`],
      check: 'tx',
      allow: ALLOW,
      tables: ['reader'],
      verify: async c => {
        if (c.trail.some(x => x.kind === 'UPDATE' && x.table === 'reader' && !x.code))
          return {fail: 'Это UPDATE самой таблицы reader, а нужно — через представление v_reader_public.'};
        const u = c.trail.find(x => x.kind === 'UPDATE' && x.table === 'v_reader_public' && !x.code);
        if (!u) return null;
        if (c.wrong.length) return {fail: `Изменилось не то: нужна одна строка — читатель № ${rid}.`};
        return c.atTarget
          ? {ok: true, note: `UPDATE ${u.n} через v_reader_public → reader`}
          : {wait: 'Строка не изменилась — проверьте WHERE и новое имя.'};
      },
      hint: `UPDATE v_reader_public SET full_name = '${newName}' WHERE id = ${rid};`,
      ok: 'Простое представление — одна таблица, без группировки и соединений — СУБД умеет менять: UPDATE ушёл в reader.',
    },
    {
      key: 'thick',
      title: 'Толстые книги',
      lab: 'ч. 3 · представление с условием',
      text: `Полка «толстых» книг: представление v_thick — id, title, author_id, pages книг больше ${P} страниц.`,
      q: 'Какие книги покажет представление?',
      goals: ['Представление v_thick', 'Столбцы: id, title, author_id, pages', `Только pages > ${P}`],
      ref: [`CREATE VIEW v_thick AS ${THICK}`],
      check: 'tx',
      allow: ALLOW,
      verify: c => sameView(c, 'v_thick', ['id', 'title', 'author_id', 'pages'], THICK),
      hint: `CREATE VIEW v_thick AS SELECT id, title, author_id, pages FROM book WHERE pages > ${P};`,
      ok: 'Представление с WHERE — «полка» с правилом отбора.',
    },
    {
      key: 'leak',
      title: 'Записал — и не видно',
      lab: 'ч. 3 · строка мимо условия',
      text: `Через v_thick вставьте тонкую книгу: id 102, «Thin Notes», автор № ${AX.id}, 120 страниц. Затем найдите её в v_thick по id. Где она оказалась?`,
      q: 'Пропустит ли представление строку, которая не подходит под его условие?',
      goals: ['INSERT INTO v_thick … (120 страниц)', 'SELECT из v_thick WHERE id = 102 — пусто'],
      ref: [`INSERT INTO v_thick (id, title, author_id, pages) VALUES (102, 'Thin Notes', ${AX.id}, 120)`],
      sol: [
        `INSERT INTO v_thick (id, title, author_id, pages) VALUES (102, 'Thin Notes', ${AX.id}, 120)`,
        'SELECT * FROM v_thick WHERE id = 102',
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      pred: {
        q: 'Что сделает СУБД с INSERT тонкой книги через v_thick?',
        choices: [
          {k: 'ok', t: 'вставит в book — хотя в v_thick её не будет'},
          {k: 'no', t: 'откажет — книга не подходит под условие'},
        ],
        answer: 'ok',
      },
      verify: async c => {
        const i = at(c.trail, x => x.kind === 'INSERT' && x.table === 'v_thick' && !x.code);
        if (i < 0)
          return c.trail.some(x => x.kind === 'INSERT' && x.table === 'book')
            ? {fail: 'Вставка — через v_thick, а не в book напрямую.'}
            : null;
        if (!(await c.q('SELECT 1 FROM library.book WHERE id = 102')).length) return {fail: 'Книги 102 в book нет — проверьте id.'};
        const s = at(c.trail, x => x.kind === 'SELECT' && x.table === 'v_thick' && !x.code, i);
        return s >= 0
          ? {ok: true, note: `INSERT через v_thick · в book — есть · в v_thick — ${c.trail[s].n} строк`}
          : {wait: 'Строка вставлена. Теперь поищите её в v_thick.'};
      },
      hint: `INSERT INTO v_thick (id, title, author_id, pages) VALUES (102, 'Thin Notes', ${AX.id}, 120); SELECT * FROM v_thick WHERE id = 102;`,
      ok: 'Книга записана в book, но на «полку» не попала: условие представления при записи не проверяется. Так через представление «теряют» строки.',
    },
    {
      key: 'checkopt',
      hard: true,
      title: 'Сторож на входе',
      lab: 'сложный · WITH CHECK OPTION',
      text: `Пересоздайте v_thick с WITH CHECK OPTION (CREATE OR REPLACE VIEW … WITH CHECK OPTION) и попробуйте вставить через него ещё одну тонкую книгу: id 103, «Thin Notes 2», автор № ${AX.id}, 96 страниц.`,
      q: 'Как запретить запись, которую представление не покажет?',
      goals: ['v_thick — WITH CHECK OPTION', 'INSERT тонкой книги — отказ'],
      ref: [`CREATE OR REPLACE VIEW v_thick AS ${THICK} WITH CHECK OPTION`],
      sol: [
        `CREATE OR REPLACE VIEW v_thick AS ${THICK} WITH CHECK OPTION`,
        `INSERT INTO v_thick (id, title, author_id, pages) VALUES (103, 'Thin Notes 2', ${AX.id}, 96)`,
      ],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const o = await checkOpt(c, 'v_thick');
        if (c.trail.some(x => x.kind === 'INSERT' && x.table === 'v_thick' && !x.code && /\b103\b/.test(x.sql)))
          return {fail: 'Тонкая книга прошла — у представления ещё нет WITH CHECK OPTION.'};
        if (o === 'NONE') return null;
        const r = await sameView(c, 'v_thick', ['id', 'title', 'author_id', 'pages'], THICK);
        if (r && !r.ok) return r;
        return c.trail.some(x => x.kind === 'INSERT' && x.table === 'v_thick' && x.code === '44000')
          ? {ok: true, note: 'WITH CHECK OPTION · INSERT — отказ 44000'}
          : {wait: 'CHECK OPTION стоит. Теперь вставьте через v_thick тонкую книгу.'};
      },
      hint: `CREATE OR REPLACE VIEW v_thick AS SELECT … WHERE pages > ${P} WITH CHECK OPTION;`,
      ok: 'new row violates check option: теперь через v_thick нельзя записать книгу, которую v_thick не покажет.',
    },
    {
      key: 'noupd',
      title: 'Через соединение — нельзя',
      lab: 'ч. 3 · сложное представление',
      text: `Попробуйте через v_catalog поменять год книги «${tX}»: UPDATE v_catalog SET year = 2000 WHERE title = '${tX}'. Прочитайте ответ СУБД.`,
      q: 'Любое ли представление изменяемо?',
      goals: ['UPDATE v_catalog …', 'Отказ СУБД: cannot update view'],
      sol: [`UPDATE v_catalog SET year = 2000 WHERE title = '${tX}'`],
      check: 'error',
      code: '55000',
      allow: ALLOW,
      pred: {
        q: 'Изменит ли СУБД год книги через v_catalog?',
        choices: [
          {k: 'yes', t: 'да — как через v_reader_public'},
          {k: 'no', t: 'нет — в v_catalog соединены две таблицы'},
        ],
        answer: 'no',
      },
      hint: `UPDATE v_catalog SET year = 2000 WHERE title = '${tX}';`,
      ok: 'В v_catalog две таблицы — СУБД не берётся решать, что менять. Данные меняют в самих таблицах (или через простое представление).',
    },
    // ═══════════════════════════════ часть 4 · материализованное представление
    {
      key: 'matview',
      hard: true,
      title: 'Сводка, которая хранится',
      lab: 'сложный · MATERIALIZED VIEW и REFRESH',
      text: `Сводку смотрят часто — пусть она хранится готовой: создайте материализованное представление mv_author_stats как SELECT * FROM v_author_stats. Затем добавьте книгу автора № ${AX.id} (id 104, «Second Edition», 2026 год, 300 страниц), посмотрите в mv_author_stats его строку — изменилась ли? — выполните REFRESH MATERIALIZED VIEW и посмотрите снова.`,
      q: 'Чем материализованное представление отличается от обычного?',
      goals: ['mv_author_stats', 'INSERT книги → в mv — старое число', 'REFRESH → новое число'],
      ref: [
        'CREATE MATERIALIZED VIEW mv_author_stats AS SELECT * FROM v_author_stats',
        `INSERT INTO book (id, title, author_id, year, pages) VALUES (104, 'Second Edition', ${AX.id}, 2026, 300)`,
        'REFRESH MATERIALIZED VIEW mv_author_stats',
      ],
      sol: [
        'CREATE MATERIALIZED VIEW mv_author_stats AS SELECT * FROM v_author_stats',
        `INSERT INTO book (id, title, author_id, year, pages) VALUES (104, 'Second Edition', ${AX.id}, 2026, 300)`,
        `SELECT * FROM mv_author_stats WHERE author = '${AN}'`,
        'REFRESH MATERIALIZED VIEW mv_author_stats',
        `SELECT * FROM mv_author_stats WHERE author = '${AN}'`,
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        if (!(await c.q(`SELECT 1 FROM pg_matviews WHERE schemaname = 'library' AND matviewname = 'mv_author_stats'`)).length) return null;
        const T = c.trail;
        const i = at(T, x => x.kind === 'INSERT' && x.table === 'book' && !x.code);
        if (i < 0) return {wait: `mv_author_stats есть. Добавьте книгу автора № ${AX.id}.`};
        const s = at(T, x => x.kind === 'SELECT' && x.table === 'mv_author_stats' && !x.code, i),
          r = at(T, x => x.kind === 'REFRESH' && !x.code, i);
        if (r < 0) return {wait: 'Книга добавлена. Посмотрите строку автора в mv_author_stats, затем REFRESH MATERIALIZED VIEW.'};
        if (s < 0 || s > r)
          return {
            wait: `REFRESH выполнен раньше, чем вы посмотрели старое число. Добавьте ещё одну книгу автора № ${AX.id} (с другим id) и повторите по порядку: SELECT из mv_author_stats, REFRESH, SELECT.`,
          };
        const m = (await c.q(`SELECT books::int AS n FROM library.mv_author_stats WHERE author = '${AN}'`))[0],
          v = (await c.q(`SELECT books::int AS n FROM library.v_author_stats WHERE author = '${AN}'`))[0];
        return m && v && m.n === v.n
          ? {ok: true, note: `до REFRESH — старое число, после — ${m.n}`}
          : {wait: 'Сводка в mv_author_stats отстаёт от v_author_stats — выполните REFRESH ещё раз.'};
      },
      hint: 'CREATE MATERIALIZED VIEW mv_author_stats AS SELECT * FROM v_author_stats; … REFRESH MATERIALIZED VIEW mv_author_stats;',
      ok: 'Материализованное хранит строки, как таблица: читается быстро, но устаревает — до REFRESH оно показывает то, что было при последнем пересчёте.',
    },
    // ═══════════════════════════════ контрольный
    {
      key: 'final',
      final: true,
      title: 'Рабочее место выдачи',
      lab: 'контрольный · № 11',
      text: `Сотруднику выдачи нужно одно окно: представление v_desk — card (билет), reader (имя), title, taken для книг, которые ещё не вернули. Выдайте роли ${R} право читать v_desk и докажите под ролью, что окно работает: SELECT count(*) FROM v_desk.`,
      q: 'Из чего собрано рабочее место?',
      goals: ['v_desk: card, reader, title, taken', 'Только книги на руках', `${R} читает v_desk`],
      ref: [`CREATE VIEW v_desk AS ${DESK}`, `GRANT SELECT ON library.v_desk TO ${R}`],
      sol: [`CREATE VIEW v_desk AS ${DESK}`, `GRANT SELECT ON library.v_desk TO ${R}`, `\\c library ${R}`, 'SELECT count(*) FROM v_desk'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const r = await sameView(c, 'v_desk', ['card', 'reader', 'title', 'taken'], DESK);
        if (!r || !r.ok) return r;
        if (!(await c.q(`SELECT has_table_privilege('${R}', 'library.v_desk', 'SELECT') AS ok`))[0].ok)
          return {wait: `v_desk готово. Выдайте роли ${R} право SELECT на него.`};
        const s = c.trail.filter(x => x.kind === 'SELECT' && x.role === R && x.table === 'v_desk').pop();
        if (!s) return {wait: `Право выдано. Подключитесь под ${R} и прочитайте v_desk.`};
        return s.code ? {fail: `Под ролью отказ: ${s.msg}.`} : {ok: true, note: `v_desk · ${R} читает — ${r.note.split('· ')[1]}`};
      },
      ok: 'Рабочее место собрано: сотрудник видит одно окно с нужными столбцами и не видит таблиц, из которых оно собрано.',
    },
    // ═══════════════════════════════ сверхсложные: без подсказок, после контрольного
    {
      sup: true,
      key: 'authors',
      title: 'Все авторы',
      lab: 'сверхсложный · представление с нулями',
      text: 'Представление v_author_books: каждый автор — author (имя), country, books (число книг). В нём должны быть все авторы, в том числе те, у кого книг нет (у них books = 0).',
      q: 'Как не потерять авторов без книг?',
      goals: ['v_author_books: author, country, books', 'Все авторы из author', 'Без книг — 0'],
      ref: [
        'CREATE VIEW v_author_books AS SELECT a.full_name AS author, a.country, count(b.id) AS books FROM author a LEFT JOIN book b ON b.author_id = a.id GROUP BY a.id, a.full_name, a.country',
      ],
      check: 'tx',
      allow: ALLOW,
      verify: c =>
        sameView(
          c,
          'v_author_books',
          ['author', 'country', 'books'],
          'SELECT a.full_name AS author, a.country, count(b.id) AS books FROM author a LEFT JOIN book b ON b.author_id = a.id GROUP BY a.id, a.full_name, a.country',
        ),
      ok: 'LEFT JOIN сохранил всех авторов, а count(b.id) не считает пустые пары — у авторов без книг 0.',
    },
    {
      sup: true,
      key: 'never',
      title: 'Ни разу не выдавали',
      lab: 'сверхсложный · представление с NOT EXISTS',
      text: 'Представление v_never_loaned — книги, которых нет ни в одной выдаче: title и author (имя автора).',
      q: 'Какие книги не спрашивают?',
      goals: ['v_never_loaned: title, author', 'Только книги без выдач'],
      ref: [
        'CREATE VIEW v_never_loaned AS SELECT b.title, a.full_name AS author FROM book b JOIN author a ON a.id = b.author_id WHERE NOT EXISTS (SELECT 1 FROM loan l WHERE l.book_id = b.id)',
      ],
      check: 'tx',
      allow: ALLOW,
      verify: c =>
        sameView(
          c,
          'v_never_loaned',
          ['title', 'author'],
          'SELECT b.title, a.full_name AS author FROM book b JOIN author a ON a.id = b.author_id WHERE NOT EXISTS (SELECT 1 FROM loan l WHERE l.book_id = b.id)',
        ),
      ok: 'Подзапрос живёт внутри представления — и пересчитывается при каждом обращении: выдали книгу — она из списка ушла.',
    },
    {
      sup: true,
      key: 'rstats',
      title: 'Карточка читателя',
      lab: 'сверхсложный · два счёта в одной группе',
      text: 'Представление v_reader_stats — читатели, у которых были выдачи: reader (имя), loans (сколько выдач всего), on_hand (сколько книг сейчас не вернул).',
      q: 'Как в одной группе посчитать и все выдачи, и невозвращённые?',
      goals: ['v_reader_stats: reader, loans, on_hand', 'Только читатели с выдачами'],
      ref: [`CREATE VIEW v_reader_stats AS ${RSTATS}`],
      check: 'tx',
      allow: ALLOW,
      verify: c => sameView(c, 'v_reader_stats', ['reader', 'loans', 'on_hand'], RSTATS),
      ok: 'count(*) — все выдачи группы, count(*) FILTER (WHERE …) (или sum(CASE …)) — только подходящие.',
    },
    {
      sup: true,
      key: 'busy',
      title: 'Больше всех на руках',
      lab: 'сверхсложный · представление над v_reader_stats',
      text: 'Представление v_busy_readers — по v_reader_stats: читатели (reader, on_hand), у которых на руках больше всего книг. Если таких несколько — все.',
      q: 'Как найти максимум и всех, кто его набрал?',
      goals: ['v_busy_readers: reader, on_hand', 'FROM v_reader_stats', 'Все, у кого on_hand — максимум'],
      ref: [
        'CREATE VIEW v_busy_readers AS SELECT reader, on_hand FROM v_reader_stats WHERE on_hand = (SELECT max(on_hand) FROM v_reader_stats)',
      ],
      check: 'tx',
      allow: ALLOW,
      verify: viewLevel(
        'v_busy_readers',
        ['reader', 'on_hand'],
        `SELECT reader, on_hand FROM (${RSTATS}) t WHERE on_hand = (SELECT max(on_hand) FROM (${RSTATS}) u)`,
        async c => (/v_reader_stats/.test(await viewDef(c, 'v_busy_readers')) ? null : {fail: 'Нужно построить по v_reader_stats.'}),
      ),
      ok: 'Подзапрос с max — внутри представления над представлением. Вернули книгу — список пересчитается сам.',
    },
    {
      sup: true,
      key: 'recent',
      title: 'Год не назад',
      lab: 'сверхсложный · CHECK OPTION на UPDATE',
      text: 'Представление v_recent — id, title, year книг 2000 года и новее; через него нельзя сделать книгу старше 2000 года. Создайте его и докажите отказом: через v_recent поставьте любой его книге 1999 год.',
      q: 'Работает ли CHECK OPTION на UPDATE?',
      goals: ['v_recent: id, title, year', 'Только year >= 2000', 'UPDATE на 1999 через v_recent — отказ'],
      ref: ['CREATE VIEW v_recent AS SELECT id, title, year FROM book WHERE year >= 2000 WITH CHECK OPTION'],
      sol: [
        'CREATE VIEW v_recent AS SELECT id, title, year FROM book WHERE year >= 2000 WITH CHECK OPTION',
        'UPDATE v_recent SET year = 1999 WHERE id = 101',
      ],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        if (c.trail.some(x => x.kind === 'UPDATE' && x.table === 'v_recent' && !x.code && x.n > 0))
          return {fail: 'Книга стала старше 2000 года через v_recent — у представления нет WITH CHECK OPTION.'};
        const r = await sameView(c, 'v_recent', ['id', 'title', 'year'], 'SELECT id, title, year FROM book WHERE year >= 2000');
        if (!r || !r.ok) return r;
        if ((await checkOpt(c, 'v_recent')) === 'NONE') return {fail: 'v_recent без WITH CHECK OPTION — через него можно испортить год.'};
        return c.trail.some(x => x.kind === 'UPDATE' && x.table === 'v_recent' && x.code === '44000')
          ? {ok: true, note: 'v_recent · UPDATE на 1999 — отказ 44000'}
          : {wait: 'Представление готово. Теперь попробуйте поставить книге 1999 год через v_recent.'};
      },
      ok: 'CHECK OPTION проверяет и INSERT, и UPDATE: строка, которая после изменения выпадет из представления, не пройдёт.',
    },
    {
      sup: true,
      key: 'phone',
      title: 'Телефон — только через окно',
      lab: 'сверхсложный · права на столбец представления',
      text: `Стойка регистрации обновляет телефоны — только через представление v_reader_phone (id, full_name, phone) и только телефон. Создайте его, выдайте ${R} нужные права и докажите под ролью: телефон читателя № ${rid} через v_reader_phone меняется на '${phone}', а UPDATE самой reader — отказ.`,
      q: 'Как разрешить менять один столбец и только через представление?',
      goals: [
        'v_reader_phone: id, full_name, phone',
        `${R}: читать v_reader_phone, менять — только phone`,
        'Под ролью: через представление — да, reader — нет',
      ],
      ref: [
        'CREATE VIEW v_reader_phone AS SELECT id, full_name, phone FROM reader',
        `GRANT SELECT, UPDATE (phone) ON library.v_reader_phone TO ${R}`,
      ],
      sol: [
        'CREATE VIEW v_reader_phone AS SELECT id, full_name, phone FROM reader',
        `GRANT SELECT, UPDATE (phone) ON library.v_reader_phone TO ${R}`,
        `\\c library ${R}`,
        `UPDATE v_reader_phone SET phone = '${phone}' WHERE id = ${rid}`,
        `UPDATE reader SET phone = '${phone}' WHERE id = ${rid}`,
      ],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const r = await sameView(c, 'v_reader_phone', ['id', 'full_name', 'phone'], 'SELECT id, full_name, phone FROM reader');
        if (!r) return null;
        if (!r.ok) return r;
        const cp = async (col, p) =>
          (await c.q(`SELECT has_column_privilege('${R}', 'library.v_reader_phone', '${col}', '${p}') AS ok`))[0].ok;
        if (await cp('full_name', 'UPDATE'))
          return {fail: 'Роль может менять через представление и имя — право UPDATE нужно только на phone.'};
        const T = c.trail.filter(x => x.kind === 'UPDATE' && x.role === R);
        const yes = T.find(x => x.table === 'v_reader_phone' && !x.code && x.n === 1),
          no = T.find(x => x.table === 'reader' && x.code === '42501');
        if (yes && no) return {ok: true, note: 'через v_reader_phone — UPDATE 1 · reader — permission denied'};
        if (!(await cp('phone', 'UPDATE')) || !(await cp('id', 'SELECT')))
          return {wait: 'Представление готово. Выдайте роли права на него.'};
        return {
          wait: yes
            ? 'Через представление — прошло. Теперь под ролью попробуйте UPDATE самой reader.'
            : `Под ролью смените телефон читателя № ${rid} через v_reader_phone.`,
        };
      },
      ok: 'Роль меняет только телефон и только через окно: права на сам reader у неё нет, а представление пишет в таблицу с правами владельца.',
    },
    {
      sup: true,
      key: 'addcol',
      title: 'Страна автора в каталоге',
      lab: 'сверхсложный · дописать столбец при зависимых',
      text: 'В каталоге нужна и страна автора: добавьте в v_catalog столбец country так, чтобы зависимые представления (v_author_stats и сводка mv_author_stats) остались на месте.',
      q: 'Куда можно добавить столбец, не ломая зависимых?',
      goals: ['v_catalog: title, author, year, pages, country', 'v_author_stats и mv_author_stats — на месте'],
      ref: [
        'CREATE OR REPLACE VIEW v_catalog AS SELECT b.title, a.full_name AS author, b.year, b.pages, a.country FROM book b JOIN author a ON a.id = b.author_id',
      ],
      check: 'tx',
      allow: ALLOW,
      verify: viewLevel(
        'v_catalog',
        ['title', 'author', 'year', 'pages', 'country'],
        'SELECT b.title, a.full_name AS author, b.year, b.pages, a.country FROM book b JOIN author a ON a.id = b.author_id',
        async c =>
          (await viewCols(c, 'v_author_stats')).length && (await viewCols(c, 'mv_author_stats')).length
            ? null
            : {
                fail: 'Зависимые представления пропали — значит, v_catalog удаляли вместе с ними (CASCADE). Столбец можно было дописать в конец.',
              },
      ),
      ok: 'Дописать столбец в конец CREATE OR REPLACE может даже тогда, когда на представлении держатся другие.',
    },
    {
      sup: true,
      key: 'rename',
      title: 'Новое имя — права те же',
      lab: 'сверхсложный · ALTER VIEW … RENAME',
      text: `Представление v_reader_public переименовали в документации в v_readers. Переименуйте его в базе и докажите под ролью ${R}, что новое имя читается без новых GRANT.`,
      q: 'Что происходит с правами при переименовании?',
      goals: ['v_readers вместо v_reader_public', `Под ${R}: SELECT из v_readers — строки`],
      ref: ['ALTER VIEW v_reader_public RENAME TO v_readers'],
      sol: ['ALTER VIEW v_reader_public RENAME TO v_readers', `\\c library ${R}`, 'SELECT count(*) FROM v_readers'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        if (!(await viewCols(c, 'v_readers')).length) return null;
        if ((await viewCols(c, 'v_reader_public')).length)
          return {wait: 'v_readers есть, но и v_reader_public осталось — нужно переименовать, а не создать второе.'};
        if (c.trail.some(x => x.kind === 'GRANT'))
          return {fail: 'Новый GRANT не нужен: права переезжают вместе с представлением. Проверьте без него.'};
        const s = c.trail.filter(x => x.kind === 'SELECT' && x.role === R && x.table === 'v_readers').pop();
        if (!s) return {wait: `Переименовано. Теперь под ${R} прочитайте v_readers.`};
        return s.code ? {fail: `Под ролью отказ: ${s.msg}.`} : {ok: true, note: 'ALTER VIEW … RENAME · права на месте'};
      },
      ok: 'Права выданы объекту, а не имени: после RENAME роль читает v_readers так же, как раньше v_reader_public.',
    },
    {
      sup: true,
      key: 'catalog',
      title: 'Представления из каталога',
      lab: 'сверхсложный · information_schema',
      text: 'Сколько столбцов в каждом обычном представлении схемы library? Столбцы view_name и cols, по имени представления. Материализованные не считаются. Ответ — из каталога information_schema.',
      q: 'Какие представления есть в схеме?',
      goals: ['Столбцы: view_name, cols', 'Только обычные представления library', 'По имени'],
      ask: "SELECT table_name AS view_name, count(*) AS cols FROM information_schema.columns WHERE table_schema = 'library' AND table_name IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'library') GROUP BY table_name ORDER BY table_name",
      order: true,
      names: true,
      allow: ALLOW,
      ok: 'information_schema.views знает представления, information_schema.columns — их столбцы, как у таблиц. Материализованных в views нет — они в pg_matviews.',
    },
    {
      sup: true,
      key: 'top',
      title: 'Пятёрка самых читаемых',
      lab: 'сверхсложный · представление с порядком и LIMIT',
      text: 'Представление v_top_books — пять книг, которые выдавали чаще всего: title и loans (число выдач). При равном числе — по названию.',
      q: 'Можно ли сохранить в представлении «первые пять»?',
      goals: ['v_top_books: title, loans', 'Пять книг: loans по убыванию, затем title'],
      ref: [
        'CREATE VIEW v_top_books AS SELECT b.title, count(*) AS loans FROM loan l JOIN book b ON b.id = l.book_id GROUP BY b.id, b.title ORDER BY loans DESC, b.title LIMIT 5',
      ],
      check: 'tx',
      allow: ALLOW,
      verify: c =>
        sameView(
          c,
          'v_top_books',
          ['title', 'loans'],
          'SELECT b.title, count(*) AS loans FROM loan l JOIN book b ON b.id = l.book_id GROUP BY b.id, b.title ORDER BY loans DESC, b.title LIMIT 5',
        ),
      ok: 'ORDER BY и LIMIT внутри представления решают, какие пять строк в нём окажутся. Изменять данные через такое представление нельзя.',
    },
  ];
}
