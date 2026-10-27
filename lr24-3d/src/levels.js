// ЛР-24 · «Защита данных: права доступа и резервная копия» — роль, GRANT и REVOKE, проверка прав под ролью,
// копия схемы pg_dump, переименование, восстановление psql -f, сверка и удаление старой схемы.
// В браузере одна база: «подключиться под ролью» — \c library роль (или SET ROLE), вернуться — \c library postgres.
// pg_dump и psql -f пульт выполняет сам (common/qlab.js): копия строится по каталогу базы, файл можно открыть.
import {restoreSql} from '../../common/libdata.js';
import {statements} from '../../common/sql.js';

const ALLOW = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'GRANT', 'REVOKE', 'SET', 'RESET', 'ALTER', 'DROP', 'PG_DUMP', 'PSQL'];
const after = (T, from, f) => T.findIndex((x, i) => i > from && f(x));
const priv = async (c, role, t) =>
  (await c.q(`SELECT has_table_privilege('${role}', 'library.${t}', 'SELECT') AS ok`).catch(() => [{ok: false}]))[0].ok;
const colPriv = async (c, role, col) =>
  (await c.q(`SELECT has_column_privilege('${role}', 'library.reader', '${col}', 'SELECT') AS ok`).catch(() => [{ok: false}]))[0].ok;
const roleExists = async (c, role) => (await c.q(`SELECT 1 FROM pg_roles WHERE rolname = '${role}'`)).length > 0;

export function levels(D) {
  const R = D.role,
    pass = 'Rd-2026-x';
  const grants = [`GRANT USAGE ON SCHEMA library TO ${R}`, `GRANT SELECT ON library.book, library.author TO ${R}`];
  return [
    // ═══════════════════════════════ часть 1 · права доступа
    {
      key: 'role',
      title: 'Читательская роль',
      lab: 'ч. 1 · № 1 · CREATE ROLE',
      text: `Создайте роль ${R} с правом входа и паролем (например, '${pass}'). Имя — по правилу s<NN>_reader.`,
      q: 'Как завести учётную запись для чтения?',
      goals: [`CREATE ROLE ${R} LOGIN PASSWORD '…'`],
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
      goals: [`GRANT USAGE ON SCHEMA library TO ${R}`, `GRANT SELECT ON library.book, library.author TO ${R}`],
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
      goals: ['\\c library postgres', `REVOKE SELECT ON library.author FROM ${R}`],
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
      goals: [`\\c library ${R}`, 'SELECT … FROM author — отказ', 'SELECT … FROM book — строки'],
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
      goals: ['\\c library postgres', `GRANT SELECT (id, full_name) ON library.reader TO ${R}`],
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
      goals: ['Файл копии есть', 'ALTER SCHEMA library RENAME TO library_old'],
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
      goals: ['psql … -f kopiya.sql', 'SELECT count(*) FROM library.book', 'SELECT count(*) FROM library_old.book'],
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
  ];
}
