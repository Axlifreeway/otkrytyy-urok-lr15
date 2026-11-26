// ЛР-24 · «Защита данных: права доступа и резервная копия» — роль, GRANT и REVOKE, проверка прав под ролью,
// права на столбцы и на запись без чтения, групповая роль, закрытый вход, копия схемы pg_dump, переименование,
// восстановление psql -f, сверка и удаление старой схемы. После контрольного — 10 сверхсложных: роль библиотекаря,
// права через группу, права по умолчанию для новых таблиц, вторая копия, срок действия роли, удаление группы, права из каталога.
// В браузере одна база: «подключиться под ролью» — \c library роль (или SET ROLE), вернуться — \c library postgres.
// pg_dump и psql -f пульт выполняет сам (common/qlab.js): копия строится по каталогу базы, файл можно открыть.
import {restoreSql} from '../../common/libdata.js';
import {statements} from '../../common/sql.js';

const ALLOW = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'GRANT', 'REVOKE', 'SET', 'RESET', 'ALTER', 'DROP', 'PG_DUMP', 'PSQL'];
const after = (T, from, f) => T.findIndex((x, i) => i > from && f(x));
const priv = async (c, role, t, p = 'SELECT') =>
  (await c.q(`SELECT has_table_privilege('${role}', 'library.${t}', '${p}') AS ok`).catch(() => [{ok: false}]))[0].ok;
const colPriv = async (c, role, col, p = 'SELECT') =>
  (await c.q(`SELECT has_column_privilege('${role}', 'library.reader', '${col}', '${p}') AS ok`).catch(() => [{ok: false}]))[0].ok;
const roleExists = async (c, role) => (await c.q(`SELECT 1 FROM pg_roles WHERE rolname = '${role}'`)).length > 0;
// право выдано роли напрямую (а не через группу)
const direct = async (c, role, t, p = 'SELECT') =>
  (
    await c.q(
      `SELECT 1 FROM information_schema.role_table_grants WHERE grantee = '${role}' AND table_schema = 'library' AND table_name = '${t}' AND privilege_type = '${p}'`,
    )
  ).length > 0;
const member = async (c, group, role) =>
  (
    await c.q(
      `SELECT 1 FROM pg_auth_members m JOIN pg_roles g ON g.oid = m.roleid JOIN pg_roles u ON u.oid = m.member WHERE g.rolname = '${group}' AND u.rolname = '${role}'`,
    )
  ).length > 0;

export function levels(D) {
  const R = D.role,
    S = D.staff,
    LB = D.librarian,
    pass = 'Rd-2026-x';
  // числа варианта: читатель, которому меняют телефон, новая выдача, выдача на руках (её возвращает библиотекарь)
  const rid = (D.seed % 14) + 1,
    phone = `+7 900 ${100 + (D.seed % 900)}-20-30`,
    nb = (D.seed % 60) + 1,
    nr = ((D.seed + 3) % 14) + 1,
    open = D.LN.filter(l => !l.returned),
    oL = open.length ? open[D.seed % open.length].id : 1;
  const grants = [`GRANT USAGE ON SCHEMA library TO ${R}`, `GRANT SELECT ON library.book, library.author TO ${R}`];
  return [
    // ═══════════════════════════════ часть 1 · права доступа
    {
      key: 'role',
      title: 'Читательская роль',
      lab: 'ч. 1 · № 1 · CREATE ROLE',
      text: `Создайте роль ${R} с правом входа и паролем (например, '${pass}'). Имя — по правилу s<NN>_reader.`,
      q: 'Как завести учётную запись для чтения?',
      goals: [`Роль ${R}: вход по паролю`],
      ref: [`CREATE ROLE ${R} LOGIN PASSWORD '${pass}'`],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const r = (await c.q(`SELECT rolcanlogin AS l, rolpassword IS NOT NULL AS p FROM pg_authid WHERE rolname = '${R}'`))[0];
        if (!r) return null;
        if (!r.l) return {fail: 'Роли нужен вход: LOGIN.'};
        return r.p ? {ok: true, note: 'CREATE ROLE'} : {fail: "Роли нужен пароль: PASSWORD '…'."};
      },
      hint: `CREATE ROLE ${R} LOGIN PASSWORD '${pass}';`,
      ok: 'Роль есть, но прав у неё пока нет никаких.',
    },
    {
      key: 'grant',
      title: 'Выдать права',
      lab: 'ч. 1 · № 2 · GRANT',
      text: `Выдайте роли ${R} право USAGE на схему library и SELECT на две таблицы: book и author. Проверить, кто что может: \\dp.`,
      q: 'Какие права нужны, чтобы читать таблицу схемы?',
      goals: ['Право на схему library', 'SELECT на book и author'],
      ref: grants,
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const u = (await c.q(`SELECT has_schema_privilege('${R}', 'library', 'USAGE') AS ok`))[0].ok;
        const b = await priv(c, R, 'book'),
          a = await priv(c, R, 'author');
        if (b && a && !u) return {wait: 'SELECT выдан, но без USAGE на схему роль не увидит её таблиц. Выдайте и его.'};
        return u && b && a ? {ok: true, note: 'GRANT USAGE · GRANT SELECT ×2'} : null;
      },
      hint: 'USAGE — право «войти» в схему, SELECT — читать таблицу. Нужны оба.',
      ok: 'Роль может войти в схему и читать книги и авторов — и только.',
    },
    {
      key: 'dp',
      title: 'Кто что может',
      lab: 'ч. 1 · \\dp — таблица прав',
      text: `Покажите права на таблицы схемы командой psql \\dp. Найдите строки, где упомянута роль ${R}, — что ей разрешено?`,
      q: 'Где посмотреть выданные права?',
      goals: ['\\dp', `Права роли ${R}: SELECT на book и author`],
      sol: ['\\dp'],
      check: 'tx',
      allow: ALLOW,
      verify: c =>
        c.trail.some(x => x.kind === 'META' && !x.code && /\\dp|\\z/.test(x.sql) && x.out.includes(R))
          ? {ok: true, note: `\\dp: ${R} — SELECT на book, author`}
          : null,
      hint: '\\dp — права на таблицы (как \\z).',
      ok: 'Права видны: кто, на какую таблицу, что может.',
    },
    {
      key: 'asrole',
      title: 'Под ролью',
      lab: 'ч. 1 · № 3 · подключиться и прочитать',
      text: `Подключитесь под ролью — \\c library ${R} — и выполните SELECT к book. Запишите число строк. Над пультом видно, от чьего имени идут команды.`,
      q: 'Что видит роль с правом SELECT?',
      goals: [`\\c library ${R}`, 'SELECT count(*) FROM book'],
      sol: [`\\c library ${R}`, 'SELECT count(*) FROM book'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const s = c.trail.find(x => x.kind === 'SELECT' && !x.code && x.role === R && x.table === 'book');
        if (s) return {ok: true, note: `под ${R}: SELECT — ${s.n} строк`};
        return c.trail.some(x => x.kind === 'SELECT' && !x.code && !x.role && x.table === 'book')
          ? {wait: `Это вы под своим именем. Сначала \\c library ${R}.`}
          : null;
      },
      hint: `\\c library ${R} — дальше команды идут от имени роли; вернуться: \\c library postgres.`,
      ok: 'Роль читает — право SELECT работает.',
    },
    {
      key: 'who',
      title: 'Кто я',
      lab: 'ч. 1 · current_user',
      text: `Под ролью (\\c library ${R}) спросите СУБД, от чьего имени идут команды, — вместе с числом книг: SELECT current_user, count(*) FROM book.`,
      q: 'Как узнать, под кем вы работаете?',
      goals: [`\\c library ${R}`, 'SELECT current_user, count(*) FROM book'],
      sol: [`\\c library ${R}`, 'SELECT current_user, count(*) FROM book'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const s = c.trail.find(x => x.kind === 'SELECT' && !x.code && /current_user/i.test(x.sql));
        if (!s) return null;
        return s.role === R
          ? {ok: true, note: `current_user = ${R}`}
          : {wait: `Это ответ под вашим именем. Подключитесь: \\c library ${R}.`};
      },
      hint: 'current_user — имя роли, от которой выполняется команда: SELECT current_user, count(*) FROM book;',
      ok: 'СУБД проверяет права именно этой роли — у неё их ровно столько, сколько выдали.',
    },
    {
      key: 'deny',
      title: 'Удалить нельзя',
      lab: 'ч. 1 · № 4 · действие без права',
      text: `Под той же ролью попробуйте удалить одну книгу (DELETE FROM book WHERE id = 1). Запишите ответ СУБД.`,
      q: 'Что ответит СУБД на действие без права?',
      goals: [`Под ролью ${R}`, 'DELETE FROM book WHERE id = 1', 'Отказ СУБД: permission denied'],
      sol: [`\\c library ${R}`, 'DELETE FROM book WHERE id = 1'],
      check: 'tx',
      allow: ALLOW,
      tables: ['book'],
      ref: [],
      verify: c => {
        const d = c.trail.find(x => x.kind === 'DELETE');
        if (!d) return null;
        if (d.code === '42501' && d.role === R) return {ok: true, note: `ERROR: ${d.msg}`};
        if (!d.code) return {fail: `Удаление прошло — вы под своим именем. Сначала \\c library ${R}.`};
        return {fail: 'Это другой отказ. Нужен DELETE под ролью — и ответ «permission denied».'};
      },
      hint: 'Права DELETE роли не выдавали — СУБД откажет.',
      ok: 'permission denied: права на удаление нет — принцип наименьших привилегий в действии.',
    },
    {
      key: 'revoke',
      title: 'Отобрать право',
      lab: 'ч. 1 · № 5 · REVOKE',
      text: `Вернитесь под своим именем (\\c library postgres) и отберите у роли ${R} право SELECT на author.`,
      q: 'Как отобрать право?',
      goals: ['Под своим именем', 'Отобрать SELECT на author'],
      ref: [`REVOKE SELECT ON library.author FROM ${R}`],
      sol: ['\\c library postgres', `REVOKE SELECT ON library.author FROM ${R}`],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        if (c.trail.some(x => x.kind === 'REVOKE' && x.code === '42501'))
          return {wait: 'Отбирать права может владелец таблицы — вернитесь под своим именем: \\c library postgres.'};
        const a = await priv(c, R, 'author'),
          b = await priv(c, R, 'book');
        if (!b) return {fail: 'Право на book нужно оставить — отобрать только author.'};
        return a ? null : {ok: true, note: 'REVOKE'};
      },
      hint: `REVOKE SELECT ON library.author FROM ${R};`,
      ok: 'Право на author отобрано, на book осталось.',
    },
    {
      key: 'check',
      title: 'Проверка под ролью',
      lab: 'ч. 1 · № 6 · одна таблица — да, другая — нет',
      text: `Снова подключитесь под ролью и покажите: author читать нельзя, а book — можно.`,
      q: 'Что изменил REVOKE?',
      goals: ['Под ролью: author — отказ', 'book — строки'],
      sol: [`\\c library ${R}`, 'SELECT count(*) FROM author', 'SELECT count(*) FROM book'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const T = c.trail.filter(x => x.kind === 'SELECT' && x.role === R);
        const no = T.find(x => x.table === 'author' && x.code === '42501'),
          yes = T.find(x => x.table === 'book' && !x.code);
        if (no && yes) return {ok: true, note: 'author — permission denied · book — читается'};
        if (no) return {wait: 'author — отказ. Теперь покажите, что book читается.'};
        if (yes) return {wait: 'book читается. Теперь покажите отказ на author.'};
        return null;
      },
      hint: 'Обе команды — под ролью: SELECT … FROM author; SELECT … FROM book;',
      ok: 'Права проверены делом: одна таблица закрыта, другая открыта.',
    },
    {
      key: 'colgrant',
      title: 'Права на столбцы',
      lab: 'ч. 1 · GRANT на часть столбцов',
      text: `Справочный стол должен видеть имена читателей, но не их телефоны. Под своим именем выдайте роли ${R} SELECT только на столбцы id и full_name таблицы reader.`,
      q: 'Можно ли выдать право не на всю таблицу?',
      goals: ['Под своим именем', 'SELECT только на id и full_name таблицы reader'],
      ref: [`GRANT SELECT (id, full_name) ON library.reader TO ${R}`],
      sol: ['\\c library postgres', `GRANT SELECT (id, full_name) ON library.reader TO ${R}`],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const n = await colPriv(c, R, 'full_name'),
          id = await colPriv(c, R, 'id'),
          ph = await colPriv(c, R, 'phone');
        if (ph)
          return {
            fail: 'Роль видит и телефон — право выдано на всю таблицу. Отберите его (REVOKE SELECT ON library.reader …) и выдайте на два столбца.',
          };
        return n && id ? {ok: true, note: 'GRANT SELECT (id, full_name)'} : null;
      },
      hint: `GRANT SELECT (id, full_name) ON library.reader TO ${R}; — столбцы в скобках после SELECT.`,
      ok: 'Право выдано на два столбца — телефон закрыт.',
    },
    {
      key: 'colcheck',
      title: 'Имя — да, телефон — нет',
      lab: 'ч. 1 · проверка прав на столбцы',
      text: `Под ролью покажите: SELECT id, full_name FROM reader — читается, а SELECT phone FROM reader — отказ.`,
      q: 'Что увидит роль в таблице reader?',
      goals: [`\\c library ${R}`, 'SELECT id, full_name FROM reader — строки', 'SELECT phone FROM reader — отказ'],
      sol: [`\\c library ${R}`, 'SELECT id, full_name FROM reader', 'SELECT phone FROM reader'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail.filter(x => x.kind === 'SELECT' && x.role === R && x.table === 'reader');
        const yes = T.find(x => !x.code),
          no = T.find(x => x.code === '42501');
        if (yes && no) return {ok: true, note: 'id, full_name — читаются · phone — permission denied'};
        if (yes) return {wait: 'Имена читаются. Теперь попробуйте телефон: SELECT phone FROM reader.'};
        if (no) return {wait: 'Отказ есть. Теперь покажите, что id и full_name читаются.'};
        return null;
      },
      hint: 'SELECT * тоже получит отказ: звёздочка просит и телефон.',
      ok: 'Права проверяются по каждому столбцу запроса: хоть один закрытый — отказ.',
    },
    {
      key: 'updcol',
      title: 'Менять можно только телефон',
      lab: 'ч. 1 · GRANT UPDATE на столбец',
      text: `Справочный стол обновляет телефоны читателей, но не их имена. Под своим именем выдайте роли ${R} право UPDATE только на столбец phone таблицы reader. Под ролью смените телефон читателя № ${rid} на '${phone}' — пройдёт, а попытка поменять ему full_name — отказ.`,
      q: 'Можно ли разрешить менять только один столбец?',
      goals: ['UPDATE только на reader.phone', `Под ролью: телефон читателя № ${rid} — меняется`, 'Под ролью: full_name — отказ'],
      ref: [`GRANT UPDATE (phone) ON library.reader TO ${R}`],
      sol: [
        '\\c library postgres',
        `GRANT UPDATE (phone) ON library.reader TO ${R}`,
        `\\c library ${R}`,
        `UPDATE reader SET phone = '${phone}' WHERE id = ${rid}`,
        `UPDATE reader SET full_name = 'Test T. T.' WHERE id = ${rid}`,
      ],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        if (await colPriv(c, R, 'full_name', 'UPDATE'))
          return {fail: 'Роль может менять и имя — право выдано на всю таблицу. Отберите его и выдайте UPDATE только на phone.'};
        const T = c.trail.filter(x => x.kind === 'UPDATE' && x.role === R && x.table === 'reader');
        const yes = T.find(x => !x.code && /\bphone\b/i.test(x.sql) && x.n > 0),
          no = T.find(x => x.code === '42501' && /full_name/i.test(x.sql));
        if (!(await colPriv(c, R, 'phone', 'UPDATE')))
          return T.length ? {wait: 'Под ролью отказ: права UPDATE на phone ещё нет. Выдайте его под своим именем.'} : null;
        if (yes && no) return {ok: true, note: 'phone — UPDATE 1 · full_name — permission denied'};
        if (yes) return {wait: 'Телефон сменился. Теперь под ролью попробуйте поменять full_name — должен быть отказ.'};
        if (no) return {wait: `Отказ на full_name есть. Теперь под ролью смените телефон читателя № ${rid}.`};
        return T.some(x => !x.code && !x.n) ? {wait: `UPDATE не изменил ни одной строки — проверьте WHERE id = ${rid}.`} : null;
      },
      hint: `GRANT UPDATE (phone) ON library.reader TO ${R}; — затем \\c library ${R} и UPDATE reader SET phone = … WHERE id = ${rid};`,
      ok: 'Право на запись тоже выдаётся по столбцам: телефон роль меняет, имя — нет. WHERE id сработал, потому что читать id ей можно.',
    },
    {
      key: 'insgrant',
      title: 'Записать, но не прочитать',
      lab: 'ч. 1 · INSERT без SELECT',
      text: `Терминал выдачи только записывает выдачи. Выдайте роли ${R} право INSERT на loan — и ничего больше. Под ролью запишите выдачу: id 31, книга № ${nb}, читатель № ${nr}, дата '2026-10-21'. Затем попробуйте прочитать loan — что ответит СУБД?`,
      q: 'Нужно ли право SELECT, чтобы добавить строку?',
      goals: ['INSERT на loan', 'Под ролью: INSERT — проходит', 'Под ролью: SELECT из loan — отказ'],
      ref: [`GRANT INSERT ON library.loan TO ${R}`],
      sol: [
        `GRANT INSERT ON library.loan TO ${R}`,
        `\\c library ${R}`,
        `INSERT INTO loan (id, book_id, reader_id, taken) VALUES (31, ${nb}, ${nr}, '2026-10-21')`,
        'SELECT * FROM loan',
      ],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        if (await priv(c, R, 'loan'))
          return {fail: 'У роли есть и SELECT на loan — по заданию терминал только записывает. Отберите SELECT.'};
        const ins = c.trail.find(x => x.kind === 'INSERT' && x.role === R && x.table === 'loan' && !x.code),
          no = c.trail.find(x => x.kind === 'SELECT' && x.role === R && x.table === 'loan' && x.code === '42501');
        if (!(await priv(c, R, 'loan', 'INSERT')))
          return c.trail.some(x => x.kind === 'INSERT' && x.role === R)
            ? {wait: 'Отказ: права INSERT ещё нет — выдайте его под своим именем.'}
            : null;
        if (ins && no) return {ok: true, note: 'INSERT 0 1 · SELECT — permission denied'};
        if (ins) return {wait: 'Выдача записана. Теперь под ролью попробуйте прочитать loan.'};
        if (no) return {wait: 'Чтение закрыто — так и задумано. Теперь под ролью запишите выдачу.'};
        return null;
      },
      hint: `GRANT INSERT ON library.loan TO ${R}; — потом под ролью INSERT INTO loan (id, book_id, reader_id, taken) VALUES (…);`,
      ok: 'INSERT и SELECT — разные права: роль добавила строку, но прочитать таблицу не может. Внешний ключ при этом проверен — его проверяет сама СУБД.',
    },
    {
      key: 'group',
      title: 'Групповая роль',
      lab: 'ч. 1 · права — группе',
      text: `Сотрудников выдачи будет много — права выдают не каждому, а группе. Создайте роль ${S} без права входа (NOLOGIN), выдайте ей USAGE на схему library и SELECT на loan, а роль ${R} сделайте её членом. Самой ${R} SELECT на loan не выдавайте.`,
      q: 'Зачем нужна роль без права входа?',
      goals: [`Роль ${S}: NOLOGIN`, `${S}: USAGE на схему и SELECT на loan`, `${R} — член ${S}`],
      ref: [
        `CREATE ROLE ${S} NOLOGIN`,
        `GRANT USAGE ON SCHEMA library TO ${S}`,
        `GRANT SELECT ON library.loan TO ${S}`,
        `GRANT ${S} TO ${R}`,
      ],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const r = (await c.q(`SELECT rolcanlogin AS l FROM pg_roles WHERE rolname = '${S}'`))[0];
        if (!r) return null;
        if (r.l) return {fail: `Группе вход не нужен: ${S} — NOLOGIN (ALTER ROLE ${S} NOLOGIN).`};
        if (await direct(c, R, 'loan'))
          return {fail: `SELECT на loan выдан самой ${R} — а должен прийти через группу. Отберите его у ${R}.`};
        const sel = await priv(c, S, 'loan'),
          us = (await c.q(`SELECT has_schema_privilege('${S}', 'library', 'USAGE') AS ok`))[0].ok,
          m = await member(c, S, R);
        const left = [!us && `USAGE на схему для ${S}`, !sel && `SELECT на loan для ${S}`, !m && `GRANT ${S} TO ${R}`].filter(Boolean);
        return left.length
          ? {wait: `Группа есть. Осталось: ${left.join('; ')}.`}
          : {ok: true, note: `${S}: SELECT на loan · ${R} — член ${S}`};
      },
      hint: `CREATE ROLE ${S} NOLOGIN; GRANT … TO ${S}; GRANT ${S} TO ${R};`,
      ok: 'Права — у группы, люди — её члены. Пришёл новый сотрудник — одна команда GRANT группа TO человек, ушёл — REVOKE.',
    },
    {
      key: 'member',
      title: 'Право пришло от группы',
      lab: 'ч. 1 · проверка под ролью',
      text: `Подключитесь под ролью ${R} и прочитайте loan: SELECT count(*) FROM loan. Своего права SELECT у роли нет — получится ли?`,
      q: 'Действуют ли права группы для её члена?',
      goals: [`\\c library ${R}`, 'SELECT count(*) FROM loan — строки'],
      sol: [`\\c library ${R}`, 'SELECT count(*) FROM loan'],
      check: 'tx',
      allow: ALLOW,
      pred: {
        q: `Что ответит СУБД на SELECT из loan под ${R}?`,
        choices: [
          {k: 'ok', t: 'прочитает — право есть у группы'},
          {k: 'no', t: 'permission denied — своего права нет'},
        ],
        answer: 'ok',
      },
      verify: c => {
        const s = c.trail.find(x => x.kind === 'SELECT' && x.role === R && x.table === 'loan');
        if (!s)
          return c.trail.some(x => x.kind === 'SELECT' && !x.role) ? {wait: `Это вы под своим именем. Сначала \\c library ${R}.`} : null;
        return s.code
          ? {fail: `Отказ: ${s.msg}. Проверьте, что ${R} — член ${S}, а у ${S} есть SELECT на loan.`}
          : {ok: true, note: `под ${R}: loan — через ${S}`};
      },
      hint: `\\c library ${R}; SELECT count(*) FROM loan;`,
      ok: 'Член группы пользуется её правами (INHERIT по умолчанию): своего SELECT нет, а читать можно.',
    },
    {
      key: 'lock',
      title: 'Вход закрыт',
      lab: 'ч. 1 · ALTER ROLE … NOLOGIN',
      text: `Сотрудник в отпуске — вход по роли ${R} закрывают, не удаляя её прав. Под своим именем закройте вход (NOLOGIN), попробуйте подключиться — \\c library ${R} — и прочитайте ответ. Затем откройте вход снова.`,
      q: 'Как временно закрыть вход, не теряя прав?',
      goals: ['ALTER ROLE … NOLOGIN', `\\c library ${R} — отказ`, 'Вход снова открыт: LOGIN'],
      ref: [`ALTER ROLE ${R} NOLOGIN`, `ALTER ROLE ${R} LOGIN`],
      sol: ['\\c library postgres', `ALTER ROLE ${R} NOLOGIN`, `\\c library ${R}`, `ALTER ROLE ${R} LOGIN`],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const no = c.trail.find(x => x.kind === 'META' && x.code === '28000');
        const l = ((await c.q(`SELECT rolcanlogin AS l FROM pg_roles WHERE rolname = '${R}'`))[0] || {}).l;
        if (!no) return l === false ? {wait: `Вход закрыт. Попробуйте подключиться: \\c library ${R}.`} : null;
        return l
          ? {ok: true, note: 'NOLOGIN → отказ входа → LOGIN'}
          : {wait: `Отказ получен. Теперь откройте вход: ALTER ROLE ${R} LOGIN.`};
      },
      hint: `ALTER ROLE ${R} NOLOGIN; — и обратно: ALTER ROLE ${R} LOGIN;`,
      ok: 'is not permitted to log in: роль и её права на месте, только войти под ней нельзя. LOGIN — и всё работает, как раньше.',
    },
    // ═══════════════════════════════ часть 2 · резервная копия
    {
      key: 'dump',
      title: 'Копия схемы',
      lab: 'ч. 2 · № 7 · pg_dump',
      text: 'Сделайте копию схемы library в файл — в командной строке это pg_dump; в пульте он работает так же: pg_dump -U postgres -d library -n library -f kopiya.sql. Откройте файл «в блокноте» и найдите CREATE TABLE своих таблиц.',
      q: 'Что попадает в копию схемы?',
      goals: ['pg_dump … -n library -f kopiya.sql', 'В файле — CREATE TABLE, строки, права'],
      sol: ['pg_dump -U postgres -d library -n library -f kopiya.sql'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const f = Object.entries(c.files).find(([, t]) => /CREATE TABLE library\.book/.test(t));
        return f ? {ok: true, note: `файл ${f[0]} — ${f[1].split('\n').length} строк`} : null;
      },
      hint: '-n — какая схема, -f — в какой файл.',
      ok: 'В копии — таблицы, строки, ключи и выданные права: по ней схему можно собрать заново.',
    },
    {
      key: 'rename',
      title: 'Старая схема',
      lab: 'ч. 2 · № 8 · ALTER SCHEMA … RENAME',
      text: 'Только когда файл копии создан и не пуст: переименуйте схему library в library_old. Таблицы library перестанут находиться — так и задумано.',
      q: 'Зачем переименовывать, а не удалять сразу?',
      goals: ['Файл копии есть', 'Схема library теперь называется library_old'],
      ref: ['ALTER SCHEMA library RENAME TO library_old'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const old = (await c.q(`SELECT 1 FROM pg_namespace WHERE nspname = 'library_old'`)).length;
        if (!old) return null;
        const f = Object.values(c.files).some(t => /CREATE TABLE library\.book/.test(t));
        return f
          ? {ok: true, note: 'ALTER SCHEMA'}
          : {fail: 'Копии нет — схему переименовывают только после того, как файл создан. Вернитесь к уровню «Копия схемы».'};
      },
      hint: 'ALTER SCHEMA library RENAME TO library_old;',
      ok: 'Старая схема цела — если копия окажется плохой, её можно вернуть.',
    },
    {
      key: 'restore',
      hard: true,
      title: 'Восстановить из копии',
      lab: 'сложный · № 9 · psql -f и сверка',
      text: 'Восстановите схему из файла: psql -U postgres -d library -f kopiya.sql. Сравните число строк book в library и library_old — двумя запросами.',
      q: 'Совпало ли число строк после восстановления?',
      goals: ['Схема восстановлена из файла', 'Число книг — в library и в library_old'],
      ref: statements(restoreSql(D)), // эталон выполняется по одной команде
      sol: ['psql -U postgres -d library -f kopiya.sql', 'SELECT count(*) FROM library.book', 'SELECT count(*) FROM library_old.book'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: async c => {
        if (!(await c.q(`SELECT 1 FROM pg_namespace WHERE nspname = 'library'`)).length) return null;
        const T = c.trail.filter(x => x.kind === 'SELECT' && !x.code && /count/i.test(x.sql));
        const a = T.find(x => /library\.book/i.test(x.sql)),
          b = T.find(x => /library_old\.book/i.test(x.sql));
        if (!a || !b)
          return {wait: 'Схема восстановлена. Сравните число строк: SELECT count(*) FROM library.book; и то же для library_old.book.'};
        const n1 = (await c.q('SELECT count(*)::int AS n FROM library.book'))[0].n,
          n2 = (await c.q('SELECT count(*)::int AS n FROM library_old.book'))[0].n;
        return n1 === n2 ? {ok: true, note: `library.book — ${n1}, library_old.book — ${n2}`} : {fail: `Числа не совпали: ${n1} и ${n2}.`};
      },
      hint: 'Таблицу другой схемы называют полностью: схема.таблица.',
      ok: 'Числа совпали — копия рабочая.',
    },
    {
      key: 'again',
      title: 'Роль после восстановления',
      lab: 'ч. 2 · права приехали с копией',
      text: `Схема собрана заново из файла. Подключитесь под ролью и прочитайте book новой схемы — права должны были восстановиться вместе с таблицами.`,
      q: 'Восстанавливаются ли права вместе со схемой?',
      goals: [`\\c library ${R}`, 'SELECT count(*) FROM book — строки'],
      sol: [`\\c library ${R}`, 'SELECT count(*) FROM book'],
      check: 'tx',
      allow: ALLOW,
      star: true,
      verify: c => {
        const s = c.trail.find(x => x.kind === 'SELECT' && x.role === R && x.table === 'book');
        if (!s) return null;
        return s.code
          ? {fail: `Отказ: ${s.msg}. Похоже, в копии не было прав — проверьте файл.`}
          : {ok: true, note: `под ${R}: book — ${s.n} строк`};
      },
      hint: `\\c library ${R}; SELECT count(*) FROM book;`,
      ok: 'В копии были и GRANT — роль читает восстановленную таблицу.',
    },
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Убрать старую схему',
      lab: 'сложный · контрольный · № 10',
      text: 'Числа совпали — удалите старую схему вместе с таблицами: DROP SCHEMA library_old CASCADE. Затем покажите, что роль по-прежнему читает book (права пришли из копии): \\dp.',
      q: 'Что осталось после восстановления?',
      goals: ['DROP SCHEMA library_old CASCADE', '\\dp — права роли на месте'],
      ref: ['DROP SCHEMA library_old CASCADE'],
      sol: ['DROP SCHEMA library_old CASCADE', '\\dp'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const old = (await c.q(`SELECT 1 FROM pg_namespace WHERE nspname = 'library_old'`)).length;
        if (old) return null;
        if (!(await roleExists(c, R)) || !(await priv(c, R, 'book')))
          return {fail: `У роли ${R} нет права на book — значит, копия была без прав или их отобрали.`};
        return c.trail.some(x => x.kind === 'META' && /\\dp|\\z/.test(x.sql))
          ? {ok: true, note: 'DROP SCHEMA · права роли на месте'}
          : {wait: 'Старая схема удалена. Покажите права командой \\dp.'};
      },
      ok: 'Схема восстановлена из копии вместе с правами, старая — удалена.',
    },
    // ═══════════════════════════════ сверхсложные: без подсказок, после контрольного
    {
      sup: true,
      key: 'librarian',
      title: 'Роль библиотекаря',
      lab: 'сверхсложный · набор прав под должность',
      text: `Библиотекарь читает всю схему library, записывает и исправляет выдачи (loan), но не удаляет их. Заведите ему роль ${LB} со входом по паролю и выдайте ровно эти права — не перечисляя таблицы для чтения по одной.`,
      q: 'Какие права нужны библиотекарю?',
      goals: [`Роль ${LB}: вход по паролю`, 'Чтение — всех таблиц схемы', 'loan: INSERT и UPDATE, без DELETE'],
      ref: [
        `CREATE ROLE ${LB} LOGIN PASSWORD 'Lb-2026-x'`,
        `GRANT USAGE ON SCHEMA library TO ${LB}`,
        `GRANT SELECT ON ALL TABLES IN SCHEMA library TO ${LB}`,
        `GRANT INSERT, UPDATE ON library.loan TO ${LB}`,
      ],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const r = (await c.q(`SELECT rolcanlogin AS l, rolpassword IS NOT NULL AS p FROM pg_authid WHERE rolname = '${LB}'`))[0];
        if (!r) return null;
        if (!r.l || !r.p) return {fail: 'Библиотекарю нужен вход по паролю: LOGIN PASSWORD.'};
        if (await priv(c, LB, 'loan', 'DELETE')) return {fail: 'Библиотекарь может удалять выдачи — а по заданию нельзя.'};
        const us = (await c.q(`SELECT has_schema_privilege('${LB}', 'library', 'USAGE') AS ok`))[0].ok;
        const miss = [];
        if (!us) miss.push('USAGE на схему');
        for (const t of ['author', 'book', 'reader', 'loan']) if (!(await priv(c, LB, t))) miss.push(`SELECT на ${t}`);
        for (const p of ['INSERT', 'UPDATE']) if (!(await priv(c, LB, 'loan', p))) miss.push(`${p} на loan`);
        return miss.length
          ? {wait: `Не хватает: ${miss.join(', ')}.`}
          : {ok: true, note: `${LB}: SELECT на все таблицы · INSERT, UPDATE на loan`};
      },
      ok: 'GRANT … ON ALL TABLES IN SCHEMA выдаёт право на все таблицы, которые есть в схеме сейчас. DELETE не выдан — удалить выдачу библиотекарь не сможет.',
    },
    {
      sup: true,
      key: 'libcheck',
      title: 'Вернуть можно, удалить нельзя',
      lab: 'сверхсложный · проверка под ролью',
      text: `Под ролью библиотекаря отметьте возврат выдачи № ${oL} датой '2026-10-21' — пройдёт. Затем попробуйте удалить эту выдачу — СУБД должна отказать.`,
      q: 'Что может библиотекарь с выдачей?',
      goals: [`Под ${LB}: возврат выдачи № ${oL} записан`, 'Удаление — отказ'],
      sol: [`\\c library ${LB}`, `UPDATE loan SET returned = '2026-10-21' WHERE id = ${oL}`, `DELETE FROM loan WHERE id = ${oL}`],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const up = c.trail.find(
            x => x.kind === 'UPDATE' && x.role === LB && x.table === 'loan' && !x.code && x.n === 1 && /returned/i.test(x.sql),
          ),
          del = c.trail.find(x => x.kind === 'DELETE' && x.role === LB && x.table === 'loan' && x.code === '42501');
        if (c.trail.some(x => (x.kind === 'UPDATE' || x.kind === 'DELETE') && !x.role))
          return {fail: `Это команда под вашим именем, а нужно под ${LB}.`};
        if (up && del) return {ok: true, note: 'UPDATE 1 · DELETE — permission denied'};
        if (up) return {wait: 'Возврат записан. Теперь попробуйте удалить выдачу.'};
        if (del) return {wait: 'Удалить нельзя — верно. Теперь запишите возврат.'};
        return null;
      },
      ok: 'UPDATE с WHERE прошёл: у библиотекаря есть и UPDATE, и SELECT (WHERE читает id). DELETE не выдан — отказ.',
    },
    {
      sup: true,
      key: 'viagroup',
      title: 'Чтение — через группу',
      lab: 'сверхсложный · заменить прямое право групповым',
      // группе staff права на восстановленную схему выдаются здесь: у начавших до её появления она создана после копии
      pre: [`GRANT USAGE ON SCHEMA library TO ${S}`, `GRANT SELECT ON library.loan TO ${S}`],
      text: `Группа ${S} читает выдачи. Пусть библиотекарь читает loan не своим правом, а как член этой группы: прямое SELECT на loan у ${LB} убрать. Докажите под ролью библиотекаря, что выдачи по-прежнему читаются.`,
      q: 'Как перевести право с человека на группу?',
      goals: [`${LB} — член ${S}`, `У ${LB} нет своего SELECT на loan`, `Под ${LB}: loan читается`],
      ref: [`GRANT ${S} TO ${LB}`, `REVOKE SELECT ON library.loan FROM ${LB}`],
      sol: [`GRANT ${S} TO ${LB}`, `REVOKE SELECT ON library.loan FROM ${LB}`, `\\c library ${LB}`, 'SELECT count(*) FROM loan'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const m = await member(c, S, LB),
          d = await direct(c, LB, 'loan');
        const s = c.trail.filter(x => x.kind === 'SELECT' && x.role === LB && x.table === 'loan').pop();
        if (!m && !d) return {fail: `У ${LB} нет ни своего права на loan, ни группы — сначала членство в ${S}.`};
        if (!m) return c.trail.length ? {wait: `${LB} ещё не член ${S}.`} : null;
        if (d) return {wait: `Членство есть, но своё SELECT на loan у ${LB} осталось — уберите его.`};
        if (!s) return {wait: `Права настроены. Теперь под ${LB} прочитайте loan.`};
        return s.code ? {fail: `Под ${LB} отказ: ${s.msg}.`} : {ok: true, note: `${LB} читает loan через ${S}`};
      },
      ok: 'Своего права нет, а читать можно: право пришло от группы. Выдачи теперь открывают и закрывают одной командой — группе.',
    },
    {
      sup: true,
      key: 'whoreads',
      title: 'Кто читает книги',
      lab: 'сверхсложный · права из каталога',
      text: 'Какие роли получили право SELECT на таблицу book схемы library — кроме владельца postgres? Ответ — из каталога information_schema.role_table_grants (в нём столбцы grantee, table_schema, table_name, privilege_type): один столбец grantee, по алфавиту.',
      q: 'Кому выдано чтение book?',
      goals: ['Столбец grantee', 'Только SELECT на library.book, без postgres', 'По алфавиту'],
      ask: `SELECT grantee FROM information_schema.role_table_grants WHERE table_schema = 'library' AND table_name = 'book' AND privilege_type = 'SELECT' AND grantee <> 'postgres' ORDER BY grantee`,
      order: true,
      names: true,
      allow: ALLOW,
      ok: 'Читатель и библиотекарь: право у каждого выдано напрямую. Группа staff сюда не попала — ей выдан только loan.',
    },
    {
      sup: true,
      key: 'canread',
      title: 'Что может читатель',
      lab: 'сверхсложный · has_table_privilege по всем таблицам',
      text: `Для каждой таблицы схемы library: может ли роль ${R} прочитать её целиком? Столбцы tablename и can_read (true/false), по имени таблицы. Список таблиц — из pg_tables, ответ — функцией has_table_privilege.`,
      q: 'Какие таблицы роль читает — и почему?',
      goals: ['Столбцы: tablename, can_read', 'Все таблицы схемы library', 'По имени таблицы'],
      ask: `SELECT tablename, has_table_privilege('${R}', 'library.' || tablename, 'SELECT') AS can_read FROM pg_tables WHERE schemaname = 'library' ORDER BY tablename`,
      order: true,
      names: true,
      allow: ALLOW,
      ok: 'book — своим правом, loan — через группу. author отобран, а reader открыт только по столбцам: целиком его роль не прочитает — функция отвечает false.',
    },
    {
      sup: true,
      key: 'defpriv',
      title: 'Права для будущих таблиц',
      lab: 'сверхсложный · ALTER DEFAULT PRIVILEGES',
      text: `В схеме появится справочник жанров genre (id integer — первичный ключ pk_genre, name varchar(30) NOT NULL). Сделайте так, чтобы роль ${R} читала любые новые таблицы схемы сама, без отдельного GRANT на каждую: это права по умолчанию — ALTER DEFAULT PRIVILEGES IN SCHEMA … GRANT … ON TABLES TO … (пример — в справочнике). Затем создайте genre и докажите под ролью, что она читается.`,
      q: 'Как выдать право на таблицы, которых ещё нет?',
      goals: ['Права по умолчанию для новых таблиц схемы', 'Таблица genre', `Под ${R}: genre читается`],
      ref: [
        `ALTER DEFAULT PRIVILEGES IN SCHEMA library GRANT SELECT ON TABLES TO ${R}`,
        'CREATE TABLE genre (id integer CONSTRAINT pk_genre PRIMARY KEY, name varchar(30) NOT NULL)',
      ],
      sol: [
        `ALTER DEFAULT PRIVILEGES IN SCHEMA library GRANT SELECT ON TABLES TO ${R}`,
        'CREATE TABLE genre (id integer CONSTRAINT pk_genre PRIMARY KEY, name varchar(30) NOT NULL)',
        `\\c library ${R}`,
        'SELECT count(*) FROM genre',
      ],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const g = (await c.q(`SELECT to_regclass('library.genre') AS r`))[0].r;
        const def = (
          await c.q(
            `SELECT 1 FROM pg_default_acl a JOIN pg_namespace n ON n.oid = a.defaclnamespace WHERE n.nspname = 'library' AND a.defaclobjtype = 'r' AND a.defaclacl::text LIKE '%${R}=r%'`,
          )
        ).length;
        if (!g) return def ? {wait: 'Права по умолчанию настроены. Теперь создайте genre.'} : null;
        if (!def)
          return {
            fail: 'genre создана, но права по умолчанию не настроены — значит, следующая таблица снова будет закрыта. Настраивать их нужно до создания таблицы.',
          };
        if (!(await priv(c, R, 'genre')))
          return {fail: 'genre создана раньше, чем настроены права по умолчанию: на неё они не подействовали.'};
        const s = c.trail.filter(x => x.kind === 'SELECT' && x.role === R && x.table === 'genre').pop();
        if (!s) return {wait: `genre есть. Под ${R} прочитайте её.`};
        return s.code ? {fail: `Под ролью отказ: ${s.msg}.`} : {ok: true, note: `ALTER DEFAULT PRIVILEGES · под ${R}: genre читается`};
      },
      ok: 'Права по умолчанию применяются к каждой новой таблице, которую postgres создаёт в схеме library: GRANT на неё СУБД выдала сама.',
    },
    {
      sup: true,
      key: 'dump2',
      title: 'Свежая копия',
      lab: 'сверхсложный · копия после изменений',
      text: `Схема изменилась — нужна новая копия в файл kopiya2.sql. Проверьте в файле: есть ли в нём таблица genre и право ${R} на неё.`,
      q: 'Что попало в новую копию?',
      goals: ['Файл kopiya2.sql', 'В нём — CREATE TABLE genre', `В нём — GRANT на genre для ${R}`],
      sol: ['pg_dump -U postgres -d library -n library -f kopiya2.sql'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const f = c.files['kopiya2.sql'];
        if (!f)
          return Object.keys(c.files).some(k => k !== 'kopiya.sql')
            ? {wait: 'Копия сделана, но файл должен называться kopiya2.sql.'}
            : null;
        if (!/CREATE TABLE library\.genre/.test(f)) return {fail: 'В копии нет genre: таблицы нет в схеме library.'};
        if (!new RegExp(`GRANT SELECT ON TABLE library\\.genre TO ${R}`).test(f)) return {fail: `В копии нет права ${R} на genre.`};
        return {ok: true, note: `kopiya2.sql — ${f.split('\n').length} строк, genre и права на месте`};
      },
      ok: 'Копия делается заново после каждого изменения схемы: в старой kopiya.sql нет ни genre, ни права на неё.',
    },
    {
      sup: true,
      key: 'limit',
      title: 'Вход с ограничениями',
      lab: 'сверхсложный · CONNECTION LIMIT и VALID UNTIL',
      text: `Читательский вход по роли ${R}: не больше двух сеансов одновременно и только до 31 декабря 2026 года. Настройте это у самой роли, не создавая новую: ALTER ROLE … CONNECTION LIMIT … VALID UNTIL '…' (пример — в справочнике).`,
      q: 'Какие ограничения входа хранятся у роли?',
      goals: ['Не больше двух сеансов', 'Срок — до 2026-12-31'],
      ref: [`ALTER ROLE ${R} CONNECTION LIMIT 2 VALID UNTIL '2026-12-31'`],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const r = (await c.q(`SELECT rolconnlimit AS n, rolvaliduntil::date::text AS d FROM pg_roles WHERE rolname = '${R}'`))[0];
        if (!r) return {fail: `Роли ${R} нет — её нужно было изменить, а не удалять.`};
        const lim = r.n === 2,
          till = r.d === '2026-12-31';
        if (lim && till) return {ok: true, note: 'CONNECTION LIMIT 2 · VALID UNTIL 2026-12-31'};
        if (r.n === -1 && !r.d) return null;
        return {wait: `Сейчас: ${r.n === -1 ? 'сеансов — без ограничения' : 'сеансов — ' + r.n}, срок — ${r.d || 'бессрочно'}.`};
      },
      ok: 'Оба ограничения — свойства роли: после 31 декабря пароль перестанет действовать, а третий одновременный вход СУБД не пустит.',
    },
    {
      sup: true,
      key: 'dropstaff',
      title: 'Группа больше не нужна',
      lab: 'сверхсложный · DROP ROLE с правами',
      text: `Группу ${S} упраздняют: удалите роль. Библиотекарь при этом должен по-прежнему читать выдачи. С первой попытки СУБД, скорее всего, откажет — прочитайте почему и вспомните REVOKE (или DROP OWNED BY — в справочнике).`,
      q: 'Почему роль с правами не удаляется сразу?',
      goals: [`Роли ${S} нет`, `${LB} читает loan`, `${R} и ${LB} на месте`],
      ref: [`DROP OWNED BY ${S}`, `DROP ROLE ${S}`, `GRANT SELECT ON library.loan TO ${LB}`],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        if (!(await roleExists(c, R)) || !(await roleExists(c, LB))) return {fail: `Удалена не та роль: ${R} и ${LB} должны остаться.`};
        if (await roleExists(c, S)) return null;
        return (await priv(c, LB, 'loan'))
          ? {ok: true, note: `DROP ROLE ${S} · ${LB} читает loan`}
          : {wait: `Группы нет — и вместе с ней ${LB} потерял чтение выдач. Верните ему право.`};
      },
      ok: 'Роль удаляется, только когда на неё ничего не ссылается: права отбирают (REVOKE или DROP OWNED BY), потом DROP ROLE. Членство в группе исчезает вместе с ней.',
    },
    {
      sup: true,
      key: 'summary',
      title: 'Сводка прав читателя',
      lab: 'сверхсложный · права одной строкой на таблицу',
      text: `Сводка прав роли ${R} по таблицам схемы library — из information_schema.role_table_grants: table_name и privileges — права одной строкой через запятую с пробелом, по алфавиту: склеивает строки группы функция string_agg(столбец, ', ' ORDER BY столбец). Таблицы — по имени. Права на отдельные столбцы в этот каталог не входят.`,
      q: 'Какие права на таблицы у читателя остались?',
      goals: ['Столбцы: table_name, privileges', 'Одна строка на таблицу', 'Права — по алфавиту через «, »'],
      ask: `SELECT table_name, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privileges FROM information_schema.role_table_grants WHERE grantee = '${R}' AND table_schema = 'library' GROUP BY table_name ORDER BY table_name`,
      order: true,
      names: true,
      allow: ALLOW,
      ok: 'Права одной роли на каждую таблицу — одной строкой: string_agg собирает их из строк каталога, как count(*) считает строки группы.',
    },
  ];
}
