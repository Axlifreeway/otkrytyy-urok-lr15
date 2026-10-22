// ЛР-21 · «Закрепление: изменение данных и структуры» — INSERT, отказ внешнего ключа, SELECT и UPDATE с одним условием,
// DELETE и ссылки, ADD COLUMN … DEFAULT, CHECK после приведения данных, транзакции.
// База — библиотека (common/libdata.js). Проверка уровня — lv.check: 'tx' (ход команд и состояние базы) или 'error' (нужный отказ).
import {lit, authorName} from '../../common/libdata.js';

const ALLOW = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALTER', 'BEGIN', 'COMMIT', 'ROLLBACK'];
const NEW = [
  [41, 'Распутин В. Г.', 'Россия'],
  [42, 'Астафьев В. П.', 'Россия'],
  [43, 'Шукшин В. М.', 'Россия'],
];
// индекс первой команды после from, подходящей под f
const after = (T, from, f) => T.findIndex((x, i) => i > from && f(x));

export function levels(D) {
  const B = D.BK;
  // автор, у которого 3–8 книг, — для SELECT и UPDATE с одним условием
  const per = id => B.filter(b => b.author_id === id).length;
  const au = [...new Set(B.map(b => b.author_id))].sort((a, b) => Math.abs(per(a) - 5) - Math.abs(per(b) - 5))[0];
  const thin = B[7],
    reborn = 2026;
  const ins3 = `INSERT INTO author (id, full_name, country) VALUES ${NEW.map(([id, n, c]) => `(${id}, ${lit(n)}, ${lit(c)})`).join(', ')}`;
  const guest = {id: D.RD.length + 1, full_name: 'Новикова А. Б.', card: 'Б-00001'};
  const lend = B[3];
  // новые уровни: читатель, которому меняют билет, и чужой билет; книга нового автора; невозвращённая книга
  const [r1, r2] = D.RD;
  const moved = B[10];
  const back = D.LN.find(l => l.returned === null);
  const COL = `SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'library' AND table_name = 'book' AND column_name = 'genre'`;
  const finRef = [
    `INSERT INTO reader (id, full_name, card, phone) VALUES (${guest.id}, ${lit(guest.full_name)}, ${lit(guest.card)}, NULL)`,
    `INSERT INTO loan (id, book_id, reader_id, taken, returned) VALUES (${D.LN.length + 1}, ${lend.id}, ${guest.id}, '2026-10-22', NULL)`,
  ];
  return [
    // ═══════════════════════════════ часть 1 · изменение данных
    {
      key: 'ins3',
      title: 'Три новых автора',
      lab: 'ч. 1 · № 1 · три строки одной командой',
      text: `В каталог поступили книги трёх новых авторов: ${NEW.map(([id, n]) => `${n} (id ${id})`).join(', ')}, страна — Россия. Добавьте их в справочник author одной командой INSERT, запишите ответ СУБД и покажите таблицу запросом.`,
      q: 'Как добавить три строки одной командой?',
      goals: ['Одна команда INSERT — три строки', 'Перечень столбцов: (id, full_name, country)', 'SELECT — показать таблицу'],
      ref: [ins3],
      sol: [ins3, 'SELECT * FROM author ORDER BY id DESC LIMIT 5'],
      tables: ['author'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: 'Строки не такие, как в задании.'};
        if (!c.atTarget) return null;
        const i = c.trail.findIndex(x => x.kind === 'INSERT' && !x.code && x.n === 3);
        if (i < 0) return {fail: 'Все три строки — одной командой: VALUES (…), (…), (…).'};
        return after(c.trail, i, x => x.kind === 'SELECT' && !x.code) > 0
          ? {ok: true, note: 'INSERT 0 3'}
          : {wait: 'INSERT 0 3 — теперь покажите таблицу запросом SELECT.'};
      },
      hint: 'INSERT INTO author (id, full_name, country) VALUES (…), (…), (…);',
      ok: 'Одна команда — три строки: INSERT 0 3.',
    },
    {
      key: 'fkfail',
      title: 'Книга без автора',
      lab: 'ч. 1 · № 2 · ссылка на несуществующую строку',
      check: 'error',
      code: '23503',
      allow: ALLOW,
      text: 'Добавьте книгу (id 900, название любое, 300 страниц) со ссылкой на автора, которого в справочнике нет, — например, author_id = 99. Прочитайте отказ СУБД.',
      q: 'Что ответит СУБД на ссылку в никуда?',
      goals: ['INSERT INTO book …', 'author_id — несуществующий', 'Отказ СУБД: foreign key'],
      sol: ["INSERT INTO book (id, title, author_id, pages) VALUES (900, 'Пробная', 99, 300)"],
      other: 'Это другой отказ. Нужна ошибка внешнего ключа: author_id ссылается на автора, которого нет.',
      hint: 'Внешний ключ fk_book_author не даёт сослаться на строку, которой нет в author.',
      ok: 'Внешний ключ проверил ссылку: автора 99 нет — строка не добавлена.',
    },
    {
      key: 'aim',
      title: 'Переиздание',
      lab: 'ч. 1 · № 3–4 · SELECT и UPDATE с одним условием',
      text: `Все книги автора ${authorName(D, au)} (author_id = ${au}) переизданы в ${reborn} году. Сначала SELECT с условием author_id = ${au} — запишите число строк, потом UPDATE year с тем же условием. Числа должны совпасть.`,
      q: 'Сколько строк изменит UPDATE?',
      goals: [
        `SELECT … WHERE author_id = ${au}`,
        `UPDATE book SET year = ${reborn} WHERE author_id = ${au}`,
        'UPDATE N = числу строк SELECT',
      ],
      ref: [`UPDATE book SET year = ${reborn} WHERE author_id = ${au}`],
      sol: [`SELECT id, title, year FROM book WHERE author_id = ${au}`, `UPDATE book SET year = ${reborn} WHERE author_id = ${au}`],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: `Изменилось не то: год ${reborn} — только книгам автора ${au}.`};
        if (!c.atTarget) return null;
        const T = c.trail,
          u = T.findLastIndex(x => x.kind === 'UPDATE' && !x.code);
        const s = T.slice(0, u).findLast(x => x.kind === 'SELECT' && !x.code && x.where && x.where === T[u].where);
        if (!s) return {fail: 'Перед UPDATE не было SELECT с тем же условием WHERE.'};
        return s.n === T[u].n
          ? {ok: true, note: `SELECT: ${s.n} строк · UPDATE ${T[u].n}`}
          : {fail: `SELECT вернул ${s.n}, а UPDATE изменил ${T[u].n}.`};
      },
      hint: 'Условие — дословно одно и то же: WHERE author_id = … и там, и там.',
      ok: 'Прицелились SELECT — и UPDATE изменил ровно столько же строк.',
    },
    {
      key: 'delnew',
      title: 'Лишний автор',
      lab: 'ч. 1 · № 5 · удалить одну из добавленных строк',
      text: `Книги ${NEW[2][1]} (id ${NEW[2][0]}) в фонд так и не поступили. Удалите его из справочника по ключу и проверьте SELECT.`,
      q: 'Как удалить ровно одну строку?',
      goals: [`DELETE FROM author WHERE id = ${NEW[2][0]}`, 'Остальные авторы — на месте'],
      ref: [`DELETE FROM author WHERE id = ${NEW[2][0]}`],
      tables: ['author'],
      check: 'tx',
      allow: ALLOW,
      verify: c =>
        c.wrong.length ? {fail: 'Удалить нужно только автора ' + NEW[2][0] + '.'} : c.atTarget ? {ok: true, note: 'DELETE 1'} : null,
      hint: `DELETE FROM author WHERE id = ${NEW[2][0]};`,
      ok: 'На этого автора не ссылается ни одна книга — удаление прошло.',
    },
    {
      key: 'delref',
      title: 'Автор с книгами',
      lab: 'ч. 1 · № 5 · удалить строку, на которую есть ссылки',
      check: 'error',
      code: '23503',
      errMsg: /update or delete on table "author"/,
      allow: ALLOW,
      text: `Попробуйте удалить автора ${authorName(D, D.busy)} (id ${D.busy}) — у него в фонде есть книги. Прочитайте ответ СУБД.`,
      q: 'Можно ли удалить строку, на которую ссылаются?',
      goals: [`DELETE FROM author WHERE id = ${D.busy}`, 'Отказ СУБД: на строку есть ссылки'],
      sol: [`DELETE FROM author WHERE id = ${D.busy}`],
      wait: 'Запрос выполнился — значит, удаления не было. Нужен DELETE автора, у которого есть книги.',
      other: 'Это другой отказ — нужен DELETE автора, на которого ссылаются книги.',
      hint: 'Внешний ключ fk_book_author защищает и от удаления: книги ссылались бы в никуда.',
      ok: 'СУБД отказала: на автора ссылаются книги (still referenced). Сначала пришлось бы убрать или переназначить книги.',
    },
    {
      key: 'dupcard',
      title: 'Чужой билет',
      lab: 'ч. 1 · уникальность при UPDATE',
      check: 'error',
      code: '23505',
      errMsg: /uq_reader_card/,
      allow: ALLOW,
      text: `Читатель ${r1.full_name} (id ${r1.id}) потерял билет. Библиотекарь по ошибке вписывает ему номер ${r2.card} — а это билет читателя ${r2.full_name}. Выполните такой UPDATE и прочитайте отказ СУБД.`,
      q: 'Пропустит ли СУБД два одинаковых номера билета?',
      goals: [`UPDATE reader SET card = '${r2.card}' WHERE id = ${r1.id}`, 'Отказ СУБД: uq_reader_card'],
      sol: [`UPDATE reader SET card = ${lit(r2.card)} WHERE id = ${r1.id}`],
      wait: 'Команда выполнилась без отказа — проверьте номер билета: он должен совпасть с чужим.',
      other: 'Это другой отказ — нужен повтор номера билета (ограничение uq_reader_card).',
      hint: 'Ограничение UNIQUE проверяется и при UPDATE, а не только при INSERT.',
      ok: 'UNIQUE не дал двум читателям один билет: UPDATE отклонён целиком.',
    },
    {
      key: 'newcard',
      title: 'Новый билет',
      lab: 'ч. 1 · UPDATE по ключу',
      text: `Выдайте читателю ${r1.full_name} (id ${r1.id}) новый билет Б-00777 и покажите его строку SELECT.`,
      q: 'Как изменить одно значение одной строки?',
      goals: [`UPDATE reader SET card = 'Б-00777' WHERE id = ${r1.id}`, 'SELECT — строка с новым билетом'],
      ref: [`UPDATE reader SET card = 'Б-00777' WHERE id = ${r1.id}`],
      sol: [`UPDATE reader SET card = 'Б-00777' WHERE id = ${r1.id}`, `SELECT * FROM reader WHERE id = ${r1.id}`],
      tables: ['reader'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: `Изменилось не то: новый билет — только читателю ${r1.id}.`};
        if (!c.atTarget) return null;
        const u = c.trail.findLastIndex(x => x.kind === 'UPDATE' && !x.code);
        return after(c.trail, u, x => x.kind === 'SELECT' && !x.code) > 0
          ? {ok: true, note: 'UPDATE 1'}
          : {wait: 'Билет заменён — покажите строку запросом SELECT.'};
      },
      hint: `UPDATE reader SET card = 'Б-00777' WHERE id = ${r1.id}; SELECT * FROM reader WHERE id = ${r1.id};`,
      ok: 'Этот номер свободен — UNIQUE пропустил.',
    },
    {
      key: 'reauthor',
      title: 'Не тот автор',
      lab: 'ч. 1 · ссылка на новую строку',
      text: `Книгу «${moved.title}» (id ${moved.id}) в каталоге приписали не тому автору — её написал ${NEW[0][1]} (id ${NEW[0][0]}), которого вы добавили в начале. Исправьте ссылку.`,
      q: 'Можно ли сослаться на только что добавленную строку?',
      goals: [`UPDATE book SET author_id = ${NEW[0][0]} WHERE id = ${moved.id}`],
      ref: [`UPDATE book SET author_id = ${NEW[0][0]} WHERE id = ${moved.id}`],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: c => (c.wrong.length ? {fail: `Измените только книгу ${moved.id}.`} : c.atTarget ? {ok: true, note: 'UPDATE 1'} : null),
      hint: `UPDATE book SET author_id = ${NEW[0][0]} WHERE id = ${moved.id};`,
      ok: `Автор ${NEW[0][0]} есть в справочнике — внешний ключ пропустил ссылку. Теперь и его удалить не получится.`,
    },
    // ═══════════════════════════════ часть 2 · изменение структуры
    {
      key: 'addcol',
      title: 'Статус читателя',
      lab: 'ч. 2 · № 6 · столбец со значением по умолчанию',
      text: "Читателям нужен статус. Добавьте в reader столбец status varchar(10) NOT NULL DEFAULT 'активен' и покажите SELECT, что у всех существующих читателей он уже заполнен.",
      q: 'Чем заполнится новый столбец у старых строк?',
      goals: ["ALTER TABLE reader ADD COLUMN status varchar(10) NOT NULL DEFAULT 'активен'", 'SELECT — status заполнен у всех'],
      ref: ["ALTER TABLE reader ADD COLUMN status varchar(10) NOT NULL DEFAULT 'активен'"],
      sol: ["ALTER TABLE reader ADD COLUMN status varchar(10) NOT NULL DEFAULT 'активен'", 'SELECT full_name, status FROM reader'],
      tables: ['reader'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const col = (
          await c.q(
            `SELECT is_nullable, column_default FROM information_schema.columns WHERE table_name = 'reader' AND column_name = 'status' AND table_schema = 'library'`,
          )
        )[0];
        if (!col) return null;
        if (col.is_nullable !== 'NO' || !col.column_default) return {fail: 'Столбец нужен NOT NULL и со значением по умолчанию (DEFAULT).'};
        const a = c.trail.findIndex(x => x.kind === 'ALTER' && !x.code);
        return after(c.trail, a, x => x.kind === 'SELECT' && !x.code) > 0
          ? {ok: true, note: 'ALTER TABLE · status заполнен'}
          : {wait: 'Столбец добавлен. Покажите SELECT, чем он заполнен у старых строк.'};
      },
      hint: 'ALTER TABLE … ADD COLUMN … NOT NULL DEFAULT …; — DEFAULT сразу заполняет существующие строки.',
      ok: 'DEFAULT заполнил столбец у всех существующих строк — поэтому NOT NULL встал без ошибки.',
    },
    {
      key: 'addnull',
      title: 'Жанр без умолчания',
      lab: 'ч. 2 · столбец без DEFAULT',
      text: 'Книгам нужен жанр. Добавьте в book столбец genre varchar(20) — без DEFAULT и без NOT NULL — и покажите SELECT, чем он заполнен у старых книг.',
      q: 'Чем заполнится новый столбец без DEFAULT?',
      goals: ['ALTER TABLE book ADD COLUMN genre varchar(20)', 'SELECT — genre у старых строк'],
      ref: ['ALTER TABLE book ADD COLUMN genre varchar(20)'],
      sol: ['ALTER TABLE book ADD COLUMN genre varchar(20)', 'SELECT id, title, genre FROM book'],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const col = (await c.q(COL))[0];
        if (!col) return null;
        if (col.is_nullable !== 'YES' || col.column_default) return {fail: 'Здесь столбец нужен без NOT NULL и без DEFAULT.'};
        const a = c.trail.findIndex(x => x.kind === 'ALTER' && !x.code);
        return after(c.trail, a, x => x.kind === 'SELECT' && !x.code) > 0
          ? {ok: true, note: 'ALTER TABLE · genre пуст (NULL)'}
          : {wait: 'Столбец добавлен. Покажите SELECT, чем он заполнен.'};
      },
      hint: 'ALTER TABLE book ADD COLUMN genre varchar(20); SELECT id, title, genre FROM book;',
      ok: 'Без DEFAULT у старых строк в новом столбце NULL — значение неизвестно.',
    },
    {
      key: 'notnull',
      title: 'Жанр обязателен?',
      lab: 'ч. 2 · SET NOT NULL на пустом столбце',
      check: 'error',
      code: '23502',
      allow: ALLOW,
      text: 'Сделайте жанр обязательным: ALTER TABLE book ALTER COLUMN genre SET NOT NULL. Жанры ещё никто не заполнил — прочитайте отказ СУБД.',
      q: 'Встанет ли NOT NULL на столбец, где одни NULL?',
      goals: ['ALTER TABLE book ALTER COLUMN genre SET NOT NULL', 'Отказ СУБД'],
      sol: ['ALTER TABLE book ALTER COLUMN genre SET NOT NULL'],
      other: 'Это другой отказ — проверьте запись команды: ALTER COLUMN genre SET NOT NULL.',
      hint: 'NOT NULL, как и CHECK, проверяется на всех строках, которые уже есть.',
      ok: 'СУБД отказала: в столбце есть NULL. Сравните со «Статусом читателя» — там DEFAULT заполнил строки заранее.',
    },
    {
      key: 'dropcol',
      title: 'Жанр — потом',
      lab: 'ч. 2 · удалить столбец',
      text: 'Заполнять жанры некому — столбец пока убираем. Удалите genre из book и покажите \\d book или SELECT, что его нет.',
      q: 'Как удалить столбец?',
      goals: ['ALTER TABLE book DROP COLUMN genre', 'Проверка: столбца нет'],
      ref: ['ALTER TABLE book DROP COLUMN genre'],
      sol: ['ALTER TABLE book DROP COLUMN genre', 'SELECT * FROM book LIMIT 3'],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        if ((await c.q(COL)).length) return null;
        const a = c.trail.findIndex(x => x.kind === 'ALTER' && !x.code);
        if (a < 0) return null;
        return after(c.trail, a, x => (x.kind === 'SELECT' || x.kind === 'META') && !x.code) > 0
          ? {ok: true, note: 'ALTER TABLE · DROP COLUMN'}
          : {wait: 'Столбец удалён. Покажите, что его нет: \\d book или SELECT * FROM book.'};
      },
      hint: 'ALTER TABLE book DROP COLUMN genre;',
      ok: 'Столбец удалён вместе со всеми значениями — в отличие от DELETE, это меняет структуру, а не строки.',
    },
    {
      key: 'break',
      title: 'Ошибка в данных',
      lab: 'ч. 2 · № 7 · нарушить правило',
      text: `Правило: у книги больше нуля страниц. Нарушьте его: книге «${thin.title}» (id ${thin.id}) поставьте pages = 0. Ограничения пока нет — СУБД пропустит.`,
      q: 'Пропустит ли СУБД ноль страниц без ограничения?',
      goals: [`UPDATE book SET pages = 0 WHERE id = ${thin.id}`],
      ref: [`UPDATE book SET pages = 0 WHERE id = ${thin.id}`],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: c => (c.wrong.length ? {fail: 'Измените только эту книгу.'} : c.atTarget ? {ok: true, note: 'UPDATE 1 · pages = 0'} : null),
      hint: `UPDATE book SET pages = 0 WHERE id = ${thin.id};`,
      ok: 'Без ограничения СУБД хранит что угодно — даже книгу без страниц.',
    },
    {
      key: 'checkfail',
      title: 'Правило — ограничением',
      lab: 'ч. 2 · № 8 · CHECK на данных с нарушением',
      check: 'error',
      code: '23514',
      allow: ALLOW,
      text: 'Введите правило ограничением с именем: ALTER TABLE book ADD CONSTRAINT ck_book_pages CHECK (pages > 0). В таблице уже есть нарушающая строка — запишите отказ СУБД.',
      q: 'Встанет ли ограничение на данные, которые его нарушают?',
      goals: ['ALTER TABLE book ADD CONSTRAINT ck_book_pages CHECK (pages > 0)', 'Отказ СУБД'],
      sol: ['ALTER TABLE book ADD CONSTRAINT ck_book_pages CHECK (pages > 0)'],
      other: 'Отказ есть, но другой — проверьте запись ограничения.',
      hint: 'Имя ограничения — ck_таблица_смысл. CHECK проверяется на всех строках сразу.',
      ok: 'СУБД проверила все строки — одна нарушает правило, ограничение не встало.',
    },
    {
      key: 'fix',
      hard: true,
      title: 'Привести данные',
      lab: 'сложный · № 9 · найти, исправить, повторить',
      text: `Найдите нарушающую строку запросом (pages <= 0), исправьте её — у книги на самом деле ${thin.pages} страниц — и повторите ввод ограничения ck_book_pages.`,
      q: 'В каком порядке вводят ограничение на живые данные?',
      goals: ['SELECT … WHERE pages <= 0', `UPDATE … pages = ${thin.pages}`, 'ADD CONSTRAINT ck_book_pages CHECK (pages > 0)'],
      ref: [
        `UPDATE book SET pages = ${thin.pages} WHERE id = ${thin.id}`,
        'ALTER TABLE book ADD CONSTRAINT ck_book_pages CHECK (pages > 0)',
      ],
      sol: [
        'SELECT id, title, pages FROM book WHERE pages <= 0',
        `UPDATE book SET pages = ${thin.pages} WHERE id = ${thin.id}`,
        'ALTER TABLE book ADD CONSTRAINT ck_book_pages CHECK (pages > 0)',
      ],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const ck = (await c.q(`SELECT pg_get_constraintdef(oid) AS d FROM pg_constraint WHERE conname = 'ck_book_pages'`))[0];
        if (!ck) return null;
        if (!c.trail.some(x => x.kind === 'SELECT' && !x.code && /pages/.test(x.where)))
          return {fail: 'Сначала найдите нарушающую строку запросом SELECT … WHERE pages <= 0.'};
        return c.wrong.length
          ? {fail: `Исправить нужно только книгу ${thin.id}: ${thin.pages} страниц.`}
          : {ok: true, note: 'SELECT · UPDATE 1 · ALTER TABLE'};
      },
      hint: 'SELECT … WHERE pages <= 0; UPDATE …; ALTER TABLE … ADD CONSTRAINT …;',
      ok: 'Данные приведены — ограничение встало. Теперь ноль страниц СУБД не пропустит.',
    },
    // ═══════════════════════════════ часть 3 · транзакция
    {
      key: 'txdel',
      title: 'Чистка формуляров',
      lab: 'ч. 3 · № 10–11 · BEGIN … ROLLBACK',
      text: 'Откройте транзакцию, удалите формуляры уже возвращённых книг (returned IS NOT NULL), покажите запросом, что их нет, и отмените транзакцию. Тем же запросом покажите, что строки вернулись.',
      q: 'Что отменяет ROLLBACK?',
      goals: ['BEGIN', 'DELETE FROM loan WHERE returned IS NOT NULL и SELECT — их нет', 'ROLLBACK и тот же SELECT — вернулись'],
      ref: [],
      sol: [
        'BEGIN',
        'DELETE FROM loan WHERE returned IS NOT NULL',
        'SELECT count(*) FROM loan WHERE returned IS NOT NULL',
        'ROLLBACK',
        'SELECT count(*) FROM loan WHERE returned IS NOT NULL',
      ],
      tables: ['loan', 'book', 'reader', 'author'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        const d = T.findIndex(x => x.kind === 'DELETE' && !x.code && x.table === 'loan');
        if (d < 0) return null;
        if (T[d].tx !== '*') return {fail: 'DELETE выполнен без транзакции — строки удалены насовсем. Начните с BEGIN.'};
        const s = after(T, d, x => x.kind === 'SELECT' && !x.code && x.tx === '*');
        if (s < 0) return {wait: `Удалено ${T[d].n}. Покажите запросом, что их нет, — до ROLLBACK.`};
        const r = after(T, s, x => x.kind === 'ROLLBACK');
        if (r < 0)
          return after(T, s, x => x.kind === 'COMMIT') > 0
            ? {fail: 'COMMIT подтвердил удаление, а нужно было отменить.'}
            : {wait: 'Видно, что их нет. Теперь ROLLBACK.'};
        const s2 = after(T, r, x => x.kind === 'SELECT' && !x.code && !x.tx);
        if (s2 < 0) return {wait: 'Откатили. Покажите тем же запросом, что строки вернулись.'};
        return c.atStart
          ? {ok: true, note: `DELETE ${T[d].n} · ROLLBACK · строки на месте`}
          : {fail: 'После ROLLBACK база должна быть как в начале.'};
      },
      hint: 'BEGIN; DELETE …; SELECT …; ROLLBACK; SELECT …;',
      ok: 'ROLLBACK вернул всё, что удалено после BEGIN.',
    },
    {
      key: 'return',
      title: 'Книгу вернули',
      lab: 'ч. 3 · BEGIN … COMMIT',
      text: `Читатель вернул книгу по формуляру № ${back.id}. Отметьте возврат (returned = '2026-10-22') в транзакции, подтвердите COMMIT и покажите формуляр SELECT.`,
      q: 'Что делает COMMIT?',
      goals: ['BEGIN', `UPDATE loan SET returned = '2026-10-22' WHERE id = ${back.id}`, 'COMMIT', 'SELECT после COMMIT'],
      ref: [`UPDATE loan SET returned = '2026-10-22' WHERE id = ${back.id}`],
      sol: ['BEGIN', `UPDATE loan SET returned = '2026-10-22' WHERE id = ${back.id}`, 'COMMIT', `SELECT * FROM loan WHERE id = ${back.id}`],
      tables: ['loan'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        if (c.wrong.length && !c.tx) return {fail: 'Изменилось не то, что нужно.'};
        const u = T.findIndex(x => x.kind === 'UPDATE' && !x.code);
        if (u < 0) return null;
        if (!T[u].tx) return {fail: 'UPDATE выполнен без транзакции. Начните с BEGIN.'};
        const cm = after(T, u, x => x.kind === 'COMMIT' && x.tag === 'COMMIT');
        if (cm < 0) return {wait: 'Изменение в транзакции. Подтвердите: COMMIT.'};
        if (!c.atTarget) return {fail: 'После COMMIT данные не такие, как в задании.'};
        return after(T, cm, x => x.kind === 'SELECT' && !x.code) > 0
          ? {ok: true, note: 'BEGIN · UPDATE 1 · COMMIT · SELECT'}
          : {wait: 'Подтверждено. Покажите формуляр SELECT.'};
      },
      hint: "BEGIN; UPDATE loan SET returned = '2026-10-22' WHERE id = …; COMMIT; SELECT …;",
      ok: 'После COMMIT изменение окончательное — ROLLBACK его уже не вернёт.',
    },
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Новый читатель берёт книгу',
      lab: 'сложный · контрольный · № 12 · два связанных изменения',
      text: `Новый читатель — ${guest.full_name}, билет ${guest.card}, телефона нет (id ${guest.id}) — сразу берёт книгу «${lend.title}» (id ${lend.id}): формуляр № ${D.LN.length + 1}, выдана 2026-10-22, не возвращена. Читатель и формуляр — в одной транзакции, подтвердите COMMIT.`,
      q: 'Как провести два связанных изменения одним целым?',
      goals: [
        'BEGIN',
        `INSERT INTO reader … (id ${guest.id})`,
        `INSERT INTO loan … (id ${D.LN.length + 1}, reader_id ${guest.id})`,
        'COMMIT',
      ],
      ref: finRef,
      sol: ['BEGIN', ...finRef, 'COMMIT'],
      tables: ['reader', 'loan'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        const ins = T.filter(x => x.kind === 'INSERT' && !x.code);
        if (ins.some(x => !x.tx)) return {fail: 'INSERT выполнен без транзакции. Начните с BEGIN.'};
        if (c.wrong.length && !c.tx) return {fail: 'Строки не такие, как в задании.'};
        const cm = T.findIndex(x => x.kind === 'COMMIT' && x.tag === 'COMMIT');
        if (cm < 0) return ins.length >= 2 ? {wait: 'Обе строки в транзакции. Подтвердите: COMMIT.'} : null;
        return c.atTarget
          ? {ok: true, note: 'BEGIN · INSERT 0 1 · INSERT 0 1 · COMMIT'}
          : {fail: 'После COMMIT строки не такие, как в задании.'};
      },
      ok: 'Читатель и его формуляр появились вместе — одним COMMIT.',
    },
  ].map(l => ({star: true, ...l})); // SELECT * — обычный способ показать таблицу до и после
}
