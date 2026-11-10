// ЛР-21 · «Закрепление: изменение данных и структуры» — INSERT, отказы внешнего ключа и NOT NULL, SELECT и UPDATE/DELETE
// с тем же условием, UPDATE с выражением, ADD COLUMN … DEFAULT, CHECK после приведения данных и по двум столбцам,
// транзакции — и транзакция, прерванная ошибкой. Отказов «нарочно» немного: внешний ключ (два), CHECK на живых данных и ошибка в транзакции.
// База — библиотека (common/libdata.js). Проверка уровня — lv.check: 'tx' (ход команд и состояние базы) или 'error' (нужный отказ).
import {lit, authorName} from '../../common/libdata.js';

const ALLOW = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALTER', 'BEGIN', 'COMMIT', 'ROLLBACK'];
const NEW = [
  [41, 'Rasputin V. G.', 'Russia'],
  [42, 'Astafyev V. P.', 'Russia'],
  [43, 'Shukshin V. M.', 'Russia'],
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
  const guest = {id: D.RD.length + 1, full_name: 'Novikova A. B.', card: 'L-00001'};
  const lend = B[3];
  // новые уровни: читатель, которому меняют билет, и чужой билет; книга нового автора; невозвращённая книга
  const [r1, r2] = D.RD;
  const moved = B[10];
  const back = D.LN.find(l => l.returned === null);
  // уровни 2-й волны: второй автор для pages + 16, читатель с закрытыми формулярами, ошибка посреди транзакции
  const au2 = [...new Set(B.map(b => b.author_id))]
    .filter(a => a !== au && a !== thin.author_id && per(a) >= 2)
    .sort((a, b) => Math.abs(per(a) - 4) - Math.abs(per(b) - 4) || a - b)[0];
  const closed = id => D.LN.filter(l => l.reader_id === id && l.returned !== null).length;
  const arch = D.RD.map(r => r.id).sort((a, b) => closed(b) - closed(a) || a - b)[0];
  const [, , r3, r4] = D.RD;
  const phone2 = `+7 912 ${100 + (D.seed % 900)}-40-40`;
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
      text: `В каталог поступили книги трёх новых авторов: ${NEW.map(([id, n]) => `${n} (id ${id})`).join(', ')}, страна — Russia. Добавьте их в справочник author одной командой INSERT, запишите ответ СУБД и покажите таблицу запросом.`,
      q: 'Как добавить три строки одной командой?',
      goals: ['Одна команда INSERT — три строки', 'SELECT — показать таблицу'],
      ref: [ins3],
      sol: [ins3, 'SELECT * FROM author ORDER BY id DESC LIMIT 5'],
      tables: ['author'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length)
          return {fail: 'Строки author не совпали с заданием: сверьте id, ФИО (латиницей, как в задании) и страну Russia у трёх авторов.'};
        if (!c.atTarget) return null;
        const i = c.trail.findIndex(x => x.kind === 'INSERT' && !x.code && x.n === 3);
        if (i < 0)
          return {fail: 'Авторы добавлены, но не одной командой. Здесь нужен один INSERT с тремя наборами значений: VALUES (…), (…), (…).'};
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
      goals: ['Книга со ссылкой на несуществующего автора', 'Прочитать отказ СУБД'],
      sol: ["INSERT INTO book (id, title, author_id, pages) VALUES (900, 'Test Book', 99, 300)"],
      wait: 'Книга добавилась без отказа — значит, такой автор в справочнике есть. Возьмите author_id, которого нет (например, 99), и нажмите «↺ Сброс уровня», чтобы убрать добавленную книгу.',
      other:
        'Это отказ другого ограничения, а нужен отказ внешнего ключа fk_book_author (author_id ссылается на автора, которого нет). Если книга 900 уже добавилась прошлой попыткой — «↺ Сброс уровня».',
      hint: 'Внешний ключ fk_book_author не даёт сослаться на строку, которой нет в author.',
      ok: 'Внешний ключ проверил ссылку: автора 99 нет — строка не добавлена.',
    },
    {
      key: 'noyear',
      title: 'Год неизвестен',
      lab: 'ч. 1 · INSERT не всех столбцов',
      text: `Поступила книга нового автора ${NEW[0][1]} (author_id = ${NEW[0][0]}): id 902, название «Farewell to Matyora», 240 страниц. Год издания в накладной не указан — перечислите в INSERT только известные столбцы, без year. Покажите книгу запросом SELECT: что оказалось в year?`,
      q: 'Что получает столбец, которого нет в INSERT?',
      goals: ['INSERT: id, title, author_id, pages — без year', 'SELECT — книга 902 и её year'],
      ref: [`INSERT INTO book (id, title, author_id, pages) VALUES (902, 'Farewell to Matyora', ${NEW[0][0]}, 240)`],
      sol: [
        `INSERT INTO book (id, title, author_id, pages) VALUES (902, 'Farewell to Matyora', ${NEW[0][0]}, 240)`,
        'SELECT * FROM book WHERE id = 902',
      ],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length)
          return {
            fail: `Строка книги 902 не такая, как в задании: id 902, название 'Farewell to Matyora', author_id = ${NEW[0][0]}, pages = 240, а year — пустой (не перечисляйте его в INSERT).`,
          };
        if (!c.atTarget) return null;
        const i = c.trail.findLastIndex(x => x.kind === 'INSERT' && !x.code);
        return after(c.trail, i, x => x.kind === 'SELECT' && !x.code) > 0
          ? {ok: true, note: 'INSERT 0 1 · year = NULL'}
          : {wait: 'Книга добавлена. Покажите её запросом SELECT — посмотрите, что в year.'};
      },
      hint: 'INSERT INTO book (id, title, author_id, pages) VALUES (…); — у year нет DEFAULT, и он не NOT NULL.',
      ok: 'Столбец, которого нет в списке INSERT, получает значение по умолчанию, а если его нет — NULL. Для title так нельзя: он NOT NULL, и СУБД отказала бы.',
    },
    {
      key: 'aim',
      title: 'Переиздание',
      lab: 'ч. 1 · № 3–4 · SELECT и UPDATE с одним условием',
      text: `Все книги автора ${authorName(D, au)} (author_id = ${au}) переизданы в ${reborn} году. Сначала SELECT с условием author_id = ${au} — запишите число строк, потом UPDATE year с тем же условием. Числа должны совпасть.`,
      q: 'Сколько строк изменит UPDATE?',
      goals: ['SELECT книг автора — до', 'UPDATE с тем же условием', 'UPDATE N = числу строк SELECT'],
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
        if (!s)
          return {
            fail: `Перед UPDATE нужен SELECT с тем же условием WHERE author_id = ${au} — чтобы заранее узнать, сколько строк изменится.`,
          };
        return s.n === T[u].n
          ? {ok: true, note: `SELECT: ${s.n} строк · UPDATE ${T[u].n}`}
          : {
              fail: `SELECT вернул ${s.n} строк, а UPDATE изменил ${T[u].n}: условия WHERE у них разные. Запишите в обоих одно и то же условие.`,
            };
      },
      hint: 'Условие — дословно одно и то же: WHERE author_id = … и там, и там.',
      ok: 'Прицелились SELECT — и UPDATE изменил ровно столько же строк.',
    },
    {
      key: 'thick',
      title: 'С иллюстрациями',
      lab: 'ч. 1 · UPDATE с выражением',
      text: `Книги автора ${authorName(D, au2)} (author_id = ${au2}) переизданы с иллюстрациями: в каждой стало на 16 страниц больше, чем было. Измените все такие книги одной командой UPDATE — у каждой своё число страниц, поэтому новое значение считается из старого.`,
      q: 'Как прибавить к значению, не зная его заранее?',
      goals: ['Одна команда UPDATE — все книги автора', 'Каждой книге — её pages + 16'],
      ref: [`UPDATE book SET pages = pages + 16 WHERE author_id = ${au2}`],
      sol: [`SELECT id, pages FROM book WHERE author_id = ${au2}`, `UPDATE book SET pages = pages + 16 WHERE author_id = ${au2}`],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: `Изменилось не то: +16 страниц — только книгам автора ${au2}.`};
        if (!c.atTarget) return null;
        const u = c.trail.findLast(x => x.kind === 'UPDATE' && !x.code);
        return {ok: true, note: `UPDATE ${u ? u.n : per(au2)} · pages = pages + 16`};
      },
      hint: 'SET pages = pages + 16 — справа от знака = стоит старое значение столбца этой же строки.',
      ok: 'В SET справа — выражение: СУБД берёт старое значение каждой строки и прибавляет 16. Одна команда — у каждой книги своё число.',
    },
    {
      key: 'delnew',
      title: 'Лишний автор',
      lab: 'ч. 1 · № 5 · удалить одну из добавленных строк',
      text: `Книги ${NEW[2][1]} (id ${NEW[2][0]}) в фонд так и не поступили. Удалите его из справочника по ключу и проверьте SELECT.`,
      q: 'Как удалить ровно одну строку?',
      goals: ['Автор удалён по ключу', 'Остальные авторы — на месте'],
      ref: [`DELETE FROM author WHERE id = ${NEW[2][0]}`],
      tables: ['author'],
      check: 'tx',
      allow: ALLOW,
      verify: c =>
        c.wrong.length
          ? {fail: `Удалить нужно только автора ${NEW[2][0]} — по ключу: WHERE id = ${NEW[2][0]}.`}
          : c.atTarget
            ? {ok: true, note: 'DELETE 1'}
            : null,
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
      goals: ['Удалить автора с книгами', 'Прочитать отказ СУБД'],
      sol: [`DELETE FROM author WHERE id = ${D.busy}`],
      wait: 'Запрос выполнился — значит, удаления не было. Нужен DELETE автора, у которого есть книги.',
      other: 'Это другой отказ — нужен DELETE автора, на которого ссылаются книги.',
      hint: 'Внешний ключ fk_book_author защищает и от удаления: книги ссылались бы в никуда.',
      ok: 'СУБД отказала: на автора ссылаются книги (still referenced). Сначала пришлось бы убрать или переназначить книги.',
    },
    {
      key: 'delaim',
      title: 'Закрытые формуляры',
      lab: 'ч. 1 · DELETE с двумя условиями',
      text: `Закрытые формуляры читателя ${D.RD[arch - 1].full_name} (reader_id = ${arch}) — те, где книга уже возвращена, — перенесены в бумажный архив. Удалите из loan только их: открытые формуляры этого читателя и формуляры других читателей остаются. Сначала SELECT с тем же условием — запишите число строк, — потом DELETE.`,
      q: 'Как удалить ровно те строки, которые нужно?',
      goals: ['SELECT — до, с тем же условием', 'DELETE: этот читатель и книга возвращена', 'DELETE N = числу строк SELECT'],
      ref: [`DELETE FROM loan WHERE reader_id = ${arch} AND returned IS NOT NULL`],
      sol: [
        `SELECT * FROM loan WHERE reader_id = ${arch} AND returned IS NOT NULL`,
        `DELETE FROM loan WHERE reader_id = ${arch} AND returned IS NOT NULL`,
      ],
      tables: ['loan'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: 'Удалилось не то: только закрытые формуляры этого читателя (returned IS NOT NULL).'};
        if (!c.atTarget) return null;
        const T = c.trail,
          d = T.findLastIndex(x => x.kind === 'DELETE' && !x.code);
        const s = T.slice(0, d).findLast(x => x.kind === 'SELECT' && !x.code && x.where && x.where === T[d].where);
        if (!s) return {fail: 'Перед DELETE нужен SELECT с тем же условием WHERE — тем же текстом, что и в DELETE.'};
        return s.n === T[d].n
          ? {ok: true, note: `SELECT: ${s.n} строк · DELETE ${T[d].n}`}
          : {
              fail: `SELECT вернул ${s.n} строк, а DELETE удалил ${T[d].n}: условия WHERE у них разные. Запишите в обоих одно и то же условие.`,
            };
      },
      hint: 'Два условия — через AND. «Возвращена» — returned IS NOT NULL (с NULL сравнивают только через IS).',
      ok: 'Прицелились SELECT с двумя условиями — и DELETE удалил ровно столько же. На формуляры ничто не ссылается — отказа нет.',
    },
    {
      key: 'newcard',
      title: 'Новый билет',
      lab: 'ч. 1 · UPDATE по ключу',
      text: `Выдайте читателю ${r1.full_name} (id ${r1.id}) новый билет L-00777 и покажите его строку SELECT.`,
      q: 'Как изменить одно значение одной строки?',
      goals: ['Новый билет — читателю по ключу', 'SELECT — строка с новым билетом'],
      ref: [`UPDATE reader SET card = 'L-00777' WHERE id = ${r1.id}`],
      sol: [`UPDATE reader SET card = 'L-00777' WHERE id = ${r1.id}`, `SELECT * FROM reader WHERE id = ${r1.id}`],
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
      hint: `UPDATE reader SET card = 'L-00777' WHERE id = ${r1.id}; SELECT * FROM reader WHERE id = ${r1.id};`,
      ok: 'Этот номер свободен — UNIQUE пропустил.',
    },
    {
      key: 'twocol',
      title: 'Два столбца сразу',
      lab: 'ч. 1 · UPDATE нескольких столбцов',
      text: `Читатель ${r2.full_name} (id ${r2.id}) пришёл с новым номером телефона ${phone2} и сменил билет на L-00888. Измените оба значения одной командой UPDATE и покажите его строку SELECT.`,
      q: 'Как изменить два столбца одной командой?',
      goals: ['Одна команда UPDATE — phone и card', 'SELECT — строка читателя'],
      ref: [`UPDATE reader SET phone = '${phone2}', card = 'L-00888' WHERE id = ${r2.id}`],
      sol: [`UPDATE reader SET phone = '${phone2}', card = 'L-00888' WHERE id = ${r2.id}`, `SELECT * FROM reader WHERE id = ${r2.id}`],
      tables: ['reader'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: `Изменилось не то: менять нужно только читателя ${r2.id} — телефон ${phone2} и билет L-00888.`};
        if (!c.atTarget) return null;
        const ups = c.trail.filter(x => x.kind === 'UPDATE' && !x.code);
        if (ups.length > 1)
          return {fail: 'Значения верные, но команд UPDATE было несколько. Здесь — одна: SET phone = …, card = … через запятую.'};
        const u = c.trail.findLastIndex(x => x.kind === 'UPDATE' && !x.code);
        return after(c.trail, u, x => x.kind === 'SELECT' && !x.code) > 0
          ? {ok: true, note: 'UPDATE 1 · два столбца'}
          : {wait: 'Оба значения изменены. Покажите строку читателя запросом SELECT.'};
      },
      hint: "UPDATE reader SET phone = '…', card = '…' WHERE id = …; — пары «столбец = значение» через запятую.",
      ok: 'В SET через запятую можно перечислить сколько угодно столбцов — они меняются вместе, в одной строке.',
    },
    {
      key: 'reauthor',
      title: 'Не тот автор',
      lab: 'ч. 1 · ссылка на новую строку',
      text: `Книгу «${moved.title}» (id ${moved.id}) в каталоге приписали не тому автору — её написал ${NEW[0][1]} (id ${NEW[0][0]}), которого вы добавили в начале. Исправьте ссылку.`,
      q: 'Можно ли сослаться на только что добавленную строку?',
      goals: ['Ссылка на автора исправлена у одной книги'],
      ref: [`UPDATE book SET author_id = ${NEW[0][0]} WHERE id = ${moved.id}`],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: c =>
        c.wrong.length
          ? {fail: `Изменить нужно только книгу ${moved.id}: author_id = ${NEW[0][0]}. Условие — по ключу книги.`}
          : c.atTarget
            ? {ok: true, note: 'UPDATE 1'}
            : null,
      hint: `UPDATE book SET author_id = ${NEW[0][0]} WHERE id = ${moved.id};`,
      ok: `Автор ${NEW[0][0]} есть в справочнике — внешний ключ пропустил ссылку. Теперь и его удалить не получится.`,
    },
    // ═══════════════════════════════ часть 2 · изменение структуры
    {
      key: 'addcol',
      title: 'Статус читателя',
      lab: 'ч. 2 · № 6 · столбец со значением по умолчанию',
      text: "Читателям нужен статус. Добавьте в reader столбец status varchar(10) NOT NULL DEFAULT 'active' и покажите SELECT, что у всех существующих читателей он уже заполнен.",
      q: 'Чем заполнится новый столбец у старых строк?',
      goals: ['Столбец status — тип и умолчание как в задании', 'SELECT — status заполнен у всех'],
      ref: ["ALTER TABLE reader ADD COLUMN status varchar(10) NOT NULL DEFAULT 'active'"],
      sol: ["ALTER TABLE reader ADD COLUMN status varchar(10) NOT NULL DEFAULT 'active'", 'SELECT full_name, status FROM reader'],
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
      goals: ['Столбец genre — без DEFAULT и NOT NULL', 'SELECT — genre у старых строк'],
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
      key: 'genre',
      title: 'Заполнить и закрепить',
      lab: 'ч. 2 · сначала данные, потом NOT NULL',
      text: `Заполните жанр: книгам автора ${authorName(D, au)} (author_id = ${au}) — 'poetry', всем остальным — 'prose'. Когда пустых жанров не останется, сделайте столбец обязательным: ALTER TABLE book ALTER COLUMN genre SET NOT NULL.`,
      q: 'Почему NOT NULL вводят после заполнения?',
      goals: [`Книгам автора ${au} — 'poetry'`, "Остальным — 'prose'", 'genre — NOT NULL'],
      ref: [
        `UPDATE book SET genre = 'poetry' WHERE author_id = ${au}`,
        `UPDATE book SET genre = 'prose' WHERE genre IS NULL`,
        'ALTER TABLE book ALTER COLUMN genre SET NOT NULL',
      ],
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const [g] = await c.q(
          `SELECT count(*) FILTER (WHERE genre IS NULL)::int AS e, count(*) FILTER (WHERE author_id = ${au} AND genre IS DISTINCT FROM 'poetry')::int AS p, count(*) FILTER (WHERE author_id <> ${au} AND genre IS DISTINCT FROM 'prose')::int AS r FROM library.book`,
        );
        const col = (await c.q(COL))[0];
        if (!col) return {fail: 'Столбца genre нет — его добавляли на прошлом уровне. Нажмите «↺ Сброс уровня».'};
        const nn = col.is_nullable === 'NO';
        if (!c.trail.some(x => x.kind === 'UPDATE' && !x.code) && !nn) return null;
        if (g.e) return {wait: `Пустых жанров ещё ${g.e}. Заполните их — иначе NOT NULL не встанет.`};
        if (g.p || g.r)
          return {
            fail: `Жанры не те: ${g.p ? `у книг автора ${au} должно быть 'poetry' (неверно у ${g.p})` : ''}${g.p && g.r ? ', а ' : ''}${g.r ? `у остальных — 'prose' (неверно у ${g.r})` : ''}.`,
          };
        if (!nn) return {wait: 'Жанры заполнены у всех. Теперь — ALTER TABLE book ALTER COLUMN genre SET NOT NULL.'};
        return {ok: true, note: 'UPDATE · UPDATE · SET NOT NULL'};
      },
      hint: 'Два UPDATE: сначала книги автора, потом все, где genre IS NULL. Затем ALTER COLUMN genre SET NOT NULL.',
      ok: 'NOT NULL проверяется на всех строках, которые уже есть: пока хоть у одной книги пусто — СУБД откажет. Поэтому сначала данные, потом правило.',
    },
    {
      key: 'dropcol',
      title: 'Жанр — потом',
      lab: 'ч. 2 · удалить столбец',
      text: 'Жанры решено вести отдельным справочником — столбец genre в book больше не нужен. Удалите его и покажите \\d book или SELECT, что его нет.',
      q: 'Как удалить столбец?',
      goals: ['Столбец genre удалён', 'Проверка: столбца нет'],
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
      key: 'fix',
      hard: true,
      title: 'Правило на живых данных',
      lab: 'сложный · № 7–9 · CHECK на данных с ошибкой',
      pre: [`UPDATE book SET pages = 0 WHERE id = ${thin.id}`], // при переносе каталога у одной книги потерялись страницы
      text: `Правило: у книги больше нуля страниц. Введите его ограничением с именем ck_book_pages: CHECK (pages > 0). Но при переносе каталога у одной книги число страниц потерялось (стало 0) — СУБД откажет. Прочитайте отказ, найдите эту книгу запросом (pages <= 0), исправьте — у неё на самом деле ${thin.pages} страниц — и введите ограничение ещё раз.`,
      q: 'В каком порядке вводят ограничение на живые данные?',
      goals: ['Ограничение — отказ СУБД', 'Нарушающая строка найдена запросом', 'Исправлена', 'Ограничение ck_book_pages введено'],
      ref: [
        `UPDATE book SET pages = ${thin.pages} WHERE id = ${thin.id}`,
        'ALTER TABLE book ADD CONSTRAINT ck_book_pages CHECK (pages > 0)',
      ],
      sol: [
        'ALTER TABLE book ADD CONSTRAINT ck_book_pages CHECK (pages > 0)',
        'SELECT id, title, pages FROM book WHERE pages <= 0',
        `UPDATE book SET pages = ${thin.pages} WHERE id = ${thin.id}`,
        'ALTER TABLE book ADD CONSTRAINT ck_book_pages CHECK (pages > 0)',
      ],
      solErr: ['23514'], // первая попытка ввести ограничение — отказ, так и задумано
      tables: ['book'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const ck = (await c.q(`SELECT pg_get_constraintdef(oid) AS d FROM pg_constraint WHERE conname = 'ck_book_pages'`))[0];
        if (!ck) {
          if (c.trail.some(x => x.code === '23514'))
            return {
              wait: 'Это и есть отказ: «is violated by some row» — одна строка уже нарушает правило. Найдите её: SELECT … FROM book WHERE pages <= 0.',
            };
          return null;
        }
        if (!c.trail.some(x => x.kind === 'SELECT' && !x.code && /pages/.test(x.where)))
          return {
            fail: 'Ограничение встало, но нарушающую строку вы не искали запросом. Порядок такой: SELECT … WHERE pages <= 0 — найти, UPDATE — исправить, и только потом ADD CONSTRAINT.',
          };
        return c.wrong.length
          ? {fail: `Исправить нужно только книгу ${thin.id}: pages = ${thin.pages}. Остальные строки book трогать не нужно.`}
          : {ok: true, note: 'ERROR 23514 · SELECT · UPDATE 1 · ALTER TABLE'};
      },
      hint: 'ALTER TABLE … ADD CONSTRAINT … → отказ; SELECT … WHERE pages <= 0; UPDATE …; ALTER TABLE … ADD CONSTRAINT … ещё раз.',
      ok: 'Данные приведены — ограничение встало. Теперь ноль страниц СУБД не пропустит ни в INSERT, ни в UPDATE.',
    },
    {
      key: 'ckloan',
      title: 'Правило для дат',
      lab: 'ч. 2 · CHECK по двум столбцам',
      text: 'Введите в loan правило ограничением ck_loan_dates: книгу нельзя вернуть раньше, чем её выдали, — дата возврата не меньше даты выдачи. У невозвращённых книг returned пуст — им правило не мешает. Сначала убедитесь запросом, что нарушающих строк нет.',
      q: 'Нужно ли в CHECK отдельно разрешать NULL?',
      goals: ['Запрос: формуляров с возвратом раньше выдачи нет', 'Ограничение ck_loan_dates на loan'],
      ref: ['ALTER TABLE loan ADD CONSTRAINT ck_loan_dates CHECK (returned >= taken)'],
      sol: ['SELECT * FROM loan WHERE returned < taken', 'ALTER TABLE loan ADD CONSTRAINT ck_loan_dates CHECK (returned >= taken)'],
      check: 'tx',
      allow: ALLOW,
      verify: async c => {
        const ck = (
          await c.q(
            `SELECT conname AS n, pg_get_constraintdef(oid) AS d FROM pg_constraint WHERE conrelid = 'library.loan'::regclass AND contype = 'c'`,
          )
        ).find(x => /returned/.test(x.d) && /taken/.test(x.d));
        if (!ck) return null;
        if (ck.n !== 'ck_loan_dates') return {fail: `Ограничение названо ${ck.n}, а по правилу — ck_loan_dates.`};
        return {ok: true, note: 'ALTER TABLE · ' + ck.d};
      },
      hint: 'ALTER TABLE loan ADD CONSTRAINT ck_loan_dates CHECK (…); — внутри сравнение двух столбцов одной строки.',
      ok: 'Встало сразу: нарушающих строк нет. NULL отдельно разрешать не нужно — сравнение с NULL даёт «неизвестно», а CHECK отказывает только на «ложь».',
    },
    // ═══════════════════════════════ часть 3 · транзакция
    {
      key: 'txdel',
      title: 'Чистка формуляров',
      lab: 'ч. 3 · № 10–11 · BEGIN … ROLLBACK',
      text: 'Откройте транзакцию, удалите формуляры уже возвращённых книг (returned IS NOT NULL), покажите запросом, что их нет, и отмените транзакцию. Тем же запросом покажите, что строки вернулись.',
      q: 'Что отменяет ROLLBACK?',
      goals: ['BEGIN', 'Формуляры возвращённых книг удалены — запрос показывает, что их нет', 'ROLLBACK и тот же запрос — вернулись'],
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
          : {
              fail: 'После ROLLBACK база не вернулась к началу: похоже, часть изменений сделана до BEGIN или после ROLLBACK. Нажмите «↺ Сброс уровня» и повторите всё внутри одной транзакции.',
            };
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
      goals: ['BEGIN', 'Возврат отмечен по формуляру', 'COMMIT', 'SELECT после COMMIT'],
      ref: [`UPDATE loan SET returned = '2026-10-22' WHERE id = ${back.id}`],
      sol: ['BEGIN', `UPDATE loan SET returned = '2026-10-22' WHERE id = ${back.id}`, 'COMMIT', `SELECT * FROM loan WHERE id = ${back.id}`],
      tables: ['loan'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        if (c.wrong.length && !c.tx)
          return {fail: `Изменилось не то: отметить нужно только возврат по формуляру № ${back.id} — returned = '2026-10-22'.`};
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
      key: 'txerr',
      hard: true,
      title: 'Ошибка посреди транзакции',
      lab: 'сложный · транзакция, прерванная ошибкой',
      text: `Откройте транзакцию и запишите читателю ${r3.full_name} (id ${r3.id}) телефон +7 900 000-00-00. Следом тем же читателю по ошибке впишите билет ${r4.card} — он уже у читателя ${r4.full_name}. После отказа попробуйте выполнить SELECT и прочитайте ответ СУБД. Закончите транзакцию и покажите запросом, сохранился ли телефон.`,
      q: 'Что стало с правильной командой, выполненной до ошибки?',
      goals: ['BEGIN и телефон — в транзакции', 'Ошибка внутри транзакции (чужой билет)', 'ROLLBACK', 'SELECT — телефон не сохранился'],
      sol: [
        'BEGIN',
        `UPDATE reader SET phone = '+7 900 000-00-00' WHERE id = ${r3.id}`,
        `UPDATE reader SET card = ${lit(r4.card)} WHERE id = ${r3.id}`,
        `SELECT * FROM reader WHERE id = ${r3.id}`,
        'ROLLBACK',
        `SELECT * FROM reader WHERE id = ${r3.id}`,
      ],
      solErr: ['23505', '25P02'], // в эталоне ошибки задуманы: чужой билет и команда после него
      tables: ['reader'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        const u = T.findIndex(x => x.kind === 'UPDATE' && !x.code);
        if (u < 0) return null;
        if (!T[u].tx) return {fail: 'UPDATE выполнен без транзакции — телефон записан насовсем. Начните с BEGIN.'};
        const e = after(T, u, x => x.code && x.tx === '*');
        if (e < 0)
          return after(T, u, x => x.kind === 'COMMIT' && x.tag === 'COMMIT') > 0
            ? {fail: 'COMMIT подтвердил телефон до ошибки, а нужно было довести транзакцию до ошибки.'}
            : {wait: 'Телефон записан в транзакции. Теперь — чужой билет тому же читателю.'};
        const r = after(T, e, x => x.kind === 'ROLLBACK' || (x.kind === 'COMMIT' && x.tag === 'ROLLBACK'));
        if (r < 0) return {wait: 'Ошибка прервала транзакцию (приглашение library=!>). Закончите её: ROLLBACK.'};
        if (after(T, r, x => x.kind === 'SELECT' && !x.code && !x.tx) < 0)
          return {wait: 'Транзакция закончена. Покажите SELECT, сохранился ли телефон.'};
        if (!c.atStart)
          return {
            fail: 'После ROLLBACK читатель изменён: какую-то команду вы выполнили вне транзакции. «↺ Сброс уровня» — и всё заново, начиная с BEGIN.',
          };
        const tried = T.some((x, i) => i > e && x.code === '25P02');
        return {
          ok: true,
          note: `BEGIN · UPDATE 1 · ERROR ${T[e].code}${tried ? ' · ERROR 25P02' : ''} · ${T[r].kind === 'ROLLBACK' ? 'ROLLBACK' : 'COMMIT → ROLLBACK'} · телефона нет`,
        };
      },
      hint: 'После ошибки внутри BEGIN транзакция прервана: СУБД отвечает «current transaction is aborted» на всё, кроме ROLLBACK.',
      ok: 'Ошибка прервала всю транзакцию: ROLLBACK отменил и правильный UPDATE, сделанный до неё. Транзакция — всё или ничего.',
    },
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Новый читатель берёт книгу',
      lab: 'сложный · контрольный · № 12 · два связанных изменения',
      text: `Новый читатель — ${guest.full_name}, билет ${guest.card}, телефона нет (id ${guest.id}) — сразу берёт книгу «${lend.title}» (id ${lend.id}): формуляр № ${D.LN.length + 1}, выдана 2026-10-22, не возвращена. Читатель и формуляр — в одной транзакции, подтвердите COMMIT.`,
      q: 'Как провести два связанных изменения одним целым?',
      goals: ['Читатель и формуляр — как в задании', 'Подтверждено одним COMMIT'],
      ref: finRef,
      sol: ['BEGIN', ...finRef, 'COMMIT'],
      tables: ['reader', 'loan'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        const ins = T.filter(x => x.kind === 'INSERT' && !x.code);
        if (ins.some(x => !x.tx)) return {fail: 'INSERT выполнен без транзакции. Начните с BEGIN.'};
        if (c.wrong.length && !c.tx)
          return {
            fail: 'Строки reader или loan не совпали с заданием: сверьте id, ФИО, билет, книгу и даты; телефон и returned — пустые (NULL).',
          };
        const cm = T.findIndex(x => x.kind === 'COMMIT' && x.tag === 'COMMIT');
        if (cm < 0) return ins.length >= 2 ? {wait: 'Обе строки в транзакции. Подтвердите: COMMIT.'} : null;
        return c.atTarget
          ? {ok: true, note: 'BEGIN · INSERT 0 1 · INSERT 0 1 · COMMIT'}
          : {
              fail: 'COMMIT прошёл, но строки reader или loan не такие, как в задании: сверьте id, билет, книгу и дату выдачи; телефон и returned — NULL.',
            };
      },
      ok: 'Читатель и его формуляр появились вместе — одним COMMIT.',
    },
  ].map(l => ({star: true, ...l})); // SELECT * — обычный способ показать таблицу до и после
}
