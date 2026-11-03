// ЛР-20 · «Касса» — изменение данных в транзакции: INSERT, UPDATE, DELETE, BEGIN, COMMIT, ROLLBACK, ошибка внутри транзакции.
// Проверка уровня (lv.check 'tx', см. common/qlab.js) смотрит и на базу, и на ход команд: ctx.trail — что выполнено,
// с каким ответом СУБД и в каком состоянии транзакции ('' — нет, '*' — идёт, '!' — прервана ошибкой).
import {lit, nameOf, YEAR} from '../../common/pizzadata.js';

const ALLOW = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'BEGIN', 'COMMIT', 'ROLLBACK'];
const SPARE = [
  ['Тюменская', 570, false],
  ['Сибирская', 630, false],
  ['Шпинат и фета', 560, true],
  ['Барбекю', 650, false],
];
// индекс первой команды после from, подходящей под f
const after = (T, from, f) => T.findIndex((x, i) => i > from && f(x));

export function levels(D) {
  const O = D.OR;
  const used = new Set(D.PZ.map(p => p.name));
  const [n1, n2] = SPARE.filter(s => !used.has(s[0]));
  const newId = D.PZ.length + 1;
  const pk = D.PZ.find(p => p.id !== D.unused);
  const price2 = pk.price + 40;
  const pr = D.PZ[(D.PZ.indexOf(pk) + 2) % D.PZ.length];
  const vegN = D.PZ.filter(p => p.veg).length;
  const nextOrder = O.length + 1;
  const guest = {id: D.CL.length + 1, full_name: 'Новикова А. Б.', district: 'Центр'};
  const today = `${YEAR}-10-21`;
  // контрольный: самовывоз последнего дня, где он был, — отдать курьеру, который ещё не возил
  const lastPick = [...O].reverse().find(o => o.courier_id === null).ordered;
  const idleName = D.CR.find(c => c.id === D.idle).name;
  const parentRef = [
    `INSERT INTO client (id, full_name, district, phone) VALUES (${guest.id}, ${lit(guest.full_name)}, ${lit(guest.district)}, NULL)`,
    `INSERT INTO orders (id, client_id, pizza_id, courier_id, qty, amount, ordered) VALUES (${nextOrder}, ${guest.id}, ${D.fav}, NULL, 1, (SELECT price FROM pizza WHERE id = ${D.fav}), ${lit(today)})`,
  ]; // сумма — по цене на момент уровня: к нему цены уже менялись (вегетарианские +30 ₽, обмен ценами)
  // новые уровни: заказ с опечаткой в количестве, заказ на отмену (оба — с курьером), гость без телефона,
  // гость с заказами (его удалить нельзя), курьер, сменивший транспорт, две пиццы для обмена ценами
  const withCour = O.filter(o => o.courier_id !== null && o.ordered !== lastPick);
  const fix = withCour.find(o => o.qty === 1) || withCour[0];
  const cancel = withCour.filter(o => o !== fix).at(-1);
  const noPhone = D.CL.find(c => c.phone === null);
  const busyGuest = D.CL.find(c => c.id !== D.quiet && O.some(o => o.client_id === c.id));
  const cr = D.CR.find(c => c.id !== D.idle);
  const tr2 = ['самокат', 'велосипед', 'авто'].find(t => t !== cr.transport);
  const cur = p => p.price + (p.veg ? 30 : 0); // цена после уровня «Сначала прицелиться»
  const pool = D.PZ.filter(p => p.id !== pk.id && p.id !== D.unused);
  const sa = pool[0],
    sb = pool.find(p => cur(p) !== cur(sa));
  // ч. 3 (доп.): у каждого уровня — свои строки, которые не трогают ни прежние уровни, ни контрольный
  const pickO = o => o.courier_id === null && o.ordered === lastPick; // самовывозы контрольного
  const CRs = D.CR.filter(c => c.id !== D.idle);
  const nOf = id => O.filter(o => o.courier_id === id && o.id !== cancel.id).length;
  const sick = [...CRs].sort((a, b) => nOf(b.id) - nOf(a.id))[0],
    heir = CRs.find(c => c.id !== sick.id && nOf(c.id) > 0) || CRs.find(c => c.id !== sick.id);
  const raiseP = D.PZ.find(p => ![D.fav, D.unused, pk.id, sa.id, sb.id, pr.id].includes(p.id)) || D.PZ.find(p => p.id !== D.unused);
  const guests = D.CL.filter(c => c.id !== D.quiet && c.id !== busyGuest.id && O.some(o => o.client_id === c.id));
  const leaver = guests.find(c => !O.some(o => o.client_id === c.id && (pickO(o) || o.id === fix.id || o.id === cancel.id)));
  const repeater = guests.find(c => c.id !== leaver.id && O.some(o => o.client_id === c.id && o.id !== cancel.id));
  const mover = D.CL.find(c => c.id !== D.quiet && ![leaver.id, repeater.id].includes(c.id));
  const nb = D.CL.find(c => c.id !== D.quiet && c.id !== leaver.id && c.district !== mover.district) || D.CL.find(c => c.id !== mover.id);
  const dropP = D.PZ.find(
    p =>
      ![D.fav, D.unused, raiseP.id].includes(p.id) &&
      O.some(o => o.pizza_id === p.id && o.client_id !== leaver.id && o.id !== cancel.id) &&
      !O.some(o => o.pizza_id === p.id && pickO(o)),
  );
  // верно: изменения — в транзакции, подтверждены COMMIT, база — как у эталона; aim — перед этой командой SELECT с тем же WHERE
  const commitCheck = aim => c => {
    const T = c.trail;
    const ch = T.filter(x => ['UPDATE', 'DELETE', 'INSERT'].includes(x.kind) && !x.code);
    if (ch.some(x => !x.tx)) return {fail: 'Изменение выполнено без транзакции. Начните с BEGIN.'};
    if (c.wrong.length && !c.tx) return {fail: 'Данные изменились не так, как в задании.'};
    const cm = T.findIndex(x => x.kind === 'COMMIT' && x.tag === 'COMMIT');
    if (cm < 0) return ch.length ? {wait: 'Изменения в транзакции. Проверьте их SELECT и подтвердите COMMIT.'} : null;
    if (!c.atTarget) return {fail: 'После COMMIT данные не такие, как в задании.'};
    if (aim) {
      const u = T.findIndex(x => x.kind === aim && !x.code);
      if (!T.slice(0, u).some(x => x.kind === 'SELECT' && !x.code && x.where && x.where === T[u].where))
        return {fail: `Перед ${aim} не было SELECT с тем же условием WHERE.`};
    }
    return {ok: true, note: ['BEGIN', ...ch.map(x => x.tag), 'COMMIT'].join(' · ')};
  };
  const X = (key, title, lab, text, q, goals, ref, tables, hint, ok, more = {}) => ({
    key,
    title,
    lab,
    text,
    q,
    goals,
    ref,
    sol: ['BEGIN', ...(more.pre || []), ...ref, 'COMMIT'],
    tables,
    check: 'tx',
    allow: ALLOW,
    verify: commitCheck(more.aim),
    hint,
    ok,
    ...more,
  });
  const insTwo = `INSERT INTO pizza (id, name, price, veg) VALUES (${newId}, ${lit(n1[0])}, ${n1[1]}, ${n1[2]}), (${newId + 1}, ${lit(n2[0])}, ${n2[1]}, ${n2[2]})`;
  return [
    // ═══════════════════════════════ часть 1 · повторение
    {
      key: 'ins2',
      title: 'Две новинки в меню',
      lab: 'ч. 1 · № 1 · две строки одной командой',
      text: `В меню две новинки: «${n1[0]}» (id ${newId}, ${n1[1]} ₽, ${n1[2] ? 'вегетарианская' : 'не вегетарианская'}) и «${n2[0]}» (id ${newId + 1}, ${n2[1]} ₽, ${n2[2] ? 'вегетарианская' : 'не вегетарианская'}). Добавьте обе одной командой INSERT и запишите ответ СУБД.`,
      q: 'Как добавить две строки одной командой?',
      goals: ['Одна команда INSERT', `id ${newId} и ${newId + 1} — как в задании`, 'Ответ СУБД: INSERT 0 2'],
      ref: [insTwo],
      tables: ['pizza'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: 'Строки не такие, как в задании.'};
        if (!c.atTarget) return null;
        return c.trail.some(x => x.kind === 'INSERT' && !x.code && x.n === 2)
          ? {ok: true, note: 'INSERT 0 2'}
          : {fail: 'Обе строки добавлены, но разными командами — нужна одна: VALUES (…), (…).'};
      },
      hint: 'INSERT INTO pizza (id, name, price, veg) VALUES (…), (…); — строки через запятую.',
      ok: 'Одна команда — две строки: INSERT 0 2.',
    },
    {
      key: 'upd1',
      title: 'Новая цена',
      lab: 'ч. 1 · № 2 · строка по ключу: до и после',
      text: `«${pk.name}» (id ${pk.id}) теперь стоит ${price2} ₽. Покажите строку запросом SELECT по ключу, измените цену и тем же SELECT покажите её снова.`,
      q: `Как изменить цену пиццы id ${pk.id} и доказать это?`,
      goals: ['SELECT строки по ключу — до', 'Новая цена', 'Тот же SELECT — после'],
      ref: [`UPDATE pizza SET price = ${price2} WHERE id = ${pk.id}`],
      sol: [
        `SELECT * FROM pizza WHERE id = ${pk.id}`,
        `UPDATE pizza SET price = ${price2} WHERE id = ${pk.id}`,
        `SELECT * FROM pizza WHERE id = ${pk.id}`,
      ],
      tables: ['pizza'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: 'Изменилось не то, что нужно.'};
        const T = c.trail,
          u = T.findIndex(x => x.kind === 'UPDATE' && !x.code && x.n === 1);
        if (u < 0) return null;
        if (!T.slice(0, u).some(x => x.kind === 'SELECT' && !x.code))
          return {fail: 'Сначала — SELECT: строку нужно показать до изменения.'};
        if (!c.atTarget) return null;
        return after(T, u, x => x.kind === 'SELECT' && !x.code) > 0
          ? {ok: true, note: 'UPDATE 1'}
          : {wait: 'Цена изменена — покажите строку тем же SELECT ещё раз.'};
      },
      hint: `SELECT * FROM pizza WHERE id = ${pk.id}; UPDATE …; SELECT * FROM pizza WHERE id = ${pk.id};`,
      ok: 'До и после — одним и тем же запросом: так видно, что изменилось.',
    },
    {
      key: 'aim',
      title: 'Сначала прицелиться',
      lab: 'ч. 1 · № 3–4 · SELECT и UPDATE с одним условием',
      text: `Все вегетарианские пиццы дорожают на 30 ₽. Сначала SELECT с условием veg — запишите число строк, потом UPDATE с тем же условием. Число в ответе UPDATE должно совпасть.`,
      q: 'Сколько строк изменит UPDATE?',
      goals: ['SELECT вегетарианских пицц — до UPDATE', 'UPDATE с тем же условием', 'UPDATE N = числу строк SELECT'],
      ref: ['UPDATE pizza SET price = price + 30 WHERE veg'],
      sol: ['SELECT name, price FROM pizza WHERE veg', 'UPDATE pizza SET price = price + 30 WHERE veg'],
      tables: ['pizza'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: 'Цены изменились не так: +30 ₽ только вегетарианским.'};
        if (!c.atTarget) return null;
        const T = c.trail,
          u = T.findLastIndex(x => x.kind === 'UPDATE' && !x.code);
        const s = T.slice(0, u).findLast(x => x.kind === 'SELECT' && !x.code && x.where && x.where === T[u].where);
        if (!s) return {fail: 'Перед UPDATE не было SELECT с тем же условием WHERE — неизвестно, что заденет команда.'};
        return s.n === T[u].n
          ? {ok: true, note: `SELECT: ${s.n} строк · UPDATE ${T[u].n}`}
          : {fail: `SELECT вернул ${s.n}, а UPDATE изменил ${T[u].n}.`};
      },
      hint: 'Условия должны совпадать дословно: WHERE veg и там, и там.',
      ok: `SELECT показал ${vegN} — UPDATE изменил столько же. Прицелились — и попали.`,
    },
    {
      key: 'del',
      title: 'Новинка не пошла',
      lab: 'ч. 1 · № 5 · удалить одну строку',
      text: `Одну из новинок (id ${newId} или ${newId + 1}) убираем из меню. Удалите одну строку по ключу и проверьте SELECT.`,
      q: 'Как удалить ровно одну строку?',
      goals: ['Одна новинка удалена по ключу', 'Остальное меню — на месте'],
      ref: [`DELETE FROM pizza WHERE id = ${newId + 1}`],
      tables: ['pizza'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (!c.st) return null;
        const was = new Map(c.start.pizza.map(p => [p.id, JSON.stringify(p)])),
          now = new Map(c.st.pizza.map(p => [p.id, JSON.stringify(p)]));
        const gone = [...was.keys()].filter(k => !now.has(k)),
          changed = [...now].some(([k, v]) => was.get(k) !== v);
        if (changed || gone.some(k => k < newId)) return {fail: 'Удалить можно только одну из новинок, остальное меню не трогать.'};
        if (gone.length > 1) return {fail: 'Удалено больше одной строки.'};
        return gone.length === 1 ? {ok: true, note: `DELETE 1 · id ${gone[0]}`} : null;
      },
      hint: `DELETE FROM pizza WHERE id = ${newId + 1};`,
      ok: 'По ключу удаляется ровно одна строка.',
    },
    {
      key: 'qtyfix',
      title: 'Опечатка в заказе',
      lab: 'ч. 1 · два столбца одной командой',
      text: `В заказе № ${fix.id} на самом деле ${fix.qty + 1} пиццы, а не ${fix.qty}. Исправьте количество и сумму (${fix.amount} ₽ за штуку → ${(fix.amount / fix.qty) * (fix.qty + 1)} ₽) одной командой UPDATE.`,
      q: 'Как изменить два столбца одной командой?',
      goals: ['Количество и сумма — одной командой', 'Остальные заказы не тронуты'],
      ref: [`UPDATE orders SET qty = ${fix.qty + 1}, amount = ${(fix.amount / fix.qty) * (fix.qty + 1)} WHERE id = ${fix.id}`],
      tables: ['orders'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: 'Изменилось не то, что нужно: только заказ № ' + fix.id + '.'};
        if (!c.atTarget) return null;
        return c.trail.filter(x => x.kind === 'UPDATE' && !x.code).length === 1
          ? {ok: true, note: 'UPDATE 1 · два столбца'}
          : {fail: 'Получилось, но двумя командами. Начните уровень заново и сделайте одной: SET qty = …, amount = ….'};
      },
      hint: 'SET qty = 2, amount = … — пары «столбец = значение» через запятую.',
      ok: 'В SET можно перечислить сколько угодно столбцов — строка меняется за один проход.',
    },
    {
      key: 'phone',
      title: 'Телефон нашёлся',
      lab: 'ч. 1 · пустое значение заполняется',
      text: `Гость ${noPhone.full_name} (id ${noPhone.id}) оставил телефон: +7 900 123-45-67. Запишите его — по ключу.`,
      q: 'Как заполнить пустой столбец?',
      goals: ['Телефон записан гостю по ключу'],
      ref: [`UPDATE client SET phone = '+7 900 123-45-67' WHERE id = ${noPhone.id}`],
      tables: ['client'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length)
          return {fail: 'Изменилось не то: телефон нужен только у гостя id ' + noPhone.id + ', и ровно такой, как в задании.'};
        return c.atTarget ? {ok: true, note: 'UPDATE 1'} : null;
      },
      hint: "UPDATE client SET phone = '…' WHERE id = …; — телефон — текст, в кавычках.",
      ok: 'NULL заменяется значением обычным UPDATE.',
    },
    {
      key: 'cancel',
      title: 'Отмена заказа',
      lab: 'ч. 1 · DELETE с прицелом',
      text: `Гость отменил заказ № ${cancel.id}. Сначала покажите его SELECT по ключу, затем удалите DELETE с тем же условием.`,
      q: 'Как удалить и не промахнуться?',
      goals: ['SELECT заказа по ключу — до', 'DELETE с тем же условием'],
      ref: [`DELETE FROM orders WHERE id = ${cancel.id}`],
      sol: [`SELECT * FROM orders WHERE id = ${cancel.id}`, `DELETE FROM orders WHERE id = ${cancel.id}`],
      tables: ['orders'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: 'Удалено не то: только заказ № ' + cancel.id + '.'};
        if (!c.atTarget) return null;
        const T = c.trail,
          d = T.findLastIndex(x => x.kind === 'DELETE' && !x.code);
        return T.slice(0, d).some(x => x.kind === 'SELECT' && !x.code && x.where === T[d].where)
          ? {ok: true, note: 'SELECT 1 · DELETE 1'}
          : {fail: 'Перед DELETE не было SELECT с тем же условием WHERE.'};
      },
      hint: `SELECT * FROM orders WHERE id = ${cancel.id}; DELETE FROM orders WHERE id = ${cancel.id};`,
      ok: 'SELECT показал ровно ту строку, которую удалил DELETE.',
    },
    {
      key: 'guarded',
      title: 'Гостя с заказами не удалить',
      lab: 'ч. 1 · внешний ключ защищает',
      text: `Попробуйте удалить гостя ${busyGuest.full_name} (id ${busyGuest.id}). У него есть заказы — прочитайте отказ СУБД.`,
      q: 'Что будет, если удалить строку, на которую ссылаются?',
      goals: ['Удалить гостя с заказами', 'Прочитать отказ СУБД', 'База не изменилась'],
      ref: [],
      sol: [`DELETE FROM client WHERE id = ${busyGuest.id}`],
      tables: ['client', 'orders'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const e = c.trail.find(x => x.kind === 'DELETE' && x.code === '23503');
        if (!e) return c.atStart ? null : {fail: 'База изменилась. Здесь нужно только увидеть отказ.'};
        return c.atStart ? {ok: true, note: 'ERROR 23503 · fk_orders_client'} : {fail: 'База изменилась — а должна остаться прежней.'};
      },
      hint: 'Отказ 23503: на строку ссылаются заказы (orders.client_id). Сначала пришлось бы удалить их.',
      ok: 'Внешний ключ не даёт оставить заказы без гостя: DELETE отклонён целиком.',
    },
    {
      key: 'forget',
      title: 'Гость без заказов',
      lab: 'ч. 1 · DELETE строки без ссылок',
      text: `Гость id ${D.quiet} ни разу не заказывал и просит удалить его данные. Удалите — здесь внешний ключ не помешает.`,
      q: 'Почему этого гостя удалить можно?',
      goals: ['Гость без заказов удалён по ключу'],
      ref: [`DELETE FROM client WHERE id = ${D.quiet}`],
      tables: ['client'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        if (c.wrong.length) return {fail: 'Удалено не то: только гость id ' + D.quiet + '.'};
        return c.atTarget ? {ok: true, note: 'DELETE 1'} : null;
      },
      hint: `DELETE FROM client WHERE id = ${D.quiet};`,
      ok: 'На эту строку не ссылается ни один заказ — удаление прошло.',
    },
    // ═══════════════════════════════ часть 2 · транзакция
    {
      key: 'txroll',
      title: 'Передумали',
      lab: 'ч. 2 · № 6–7 · BEGIN … ROLLBACK',
      text: `Откройте транзакцию, поставьте пицце «${pr.name}» (id ${pr.id}) цену 1 ₽ и покажите SELECT, что значение изменилось. Затем ROLLBACK — и тем же SELECT покажите, что цена вернулась. Следите за приглашением над пультом: pizza=*> — транзакция идёт.`,
      q: 'Что отменяет ROLLBACK?',
      goals: ['BEGIN', 'Цена 1 ₽ — SELECT это показывает', 'ROLLBACK и тот же SELECT — цена прежняя'],
      ref: [],
      sol: [
        'BEGIN',
        `UPDATE pizza SET price = 1 WHERE id = ${pr.id}`,
        `SELECT name, price FROM pizza WHERE id = ${pr.id}`,
        'ROLLBACK',
        `SELECT name, price FROM pizza WHERE id = ${pr.id}`,
      ],
      tables: ['pizza', 'orders', 'client', 'courier'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail,
          b = T.findIndex(x => x.kind === 'BEGIN' && !x.code);
        const u = after(T, b, x => x.kind === 'UPDATE' && !x.code && x.tx === '*' && x.n >= 1);
        if (b < 0 || u < 0) {
          if (T.some(x => x.kind === 'UPDATE' && !x.code && !x.tx))
            return {fail: 'UPDATE выполнен без транзакции — он уже подтверждён, ROLLBACK его не вернёт. Начните с BEGIN.'};
          return null;
        }
        const s = after(T, u, x => x.kind === 'SELECT' && !x.code && x.tx === '*');
        if (s < 0) return {wait: 'Транзакция идёт, цена изменена. Покажите это запросом SELECT — до ROLLBACK.'};
        const r = after(T, s, x => x.kind === 'ROLLBACK');
        if (r < 0)
          return after(T, s, x => x.kind === 'COMMIT') > 0
            ? {fail: 'COMMIT подтвердил изменение — а нужно было отменить.'}
            : {wait: 'Изменение видно. Теперь ROLLBACK.'};
        const s2 = after(T, r, x => x.kind === 'SELECT' && !x.code && !x.tx);
        if (s2 < 0) return {wait: 'Откатили. Покажите тем же SELECT, что цена вернулась.'};
        return c.atStart
          ? {ok: true, note: 'BEGIN · UPDATE 1 · SELECT · ROLLBACK · SELECT'}
          : {fail: 'После ROLLBACK база должна быть как в начале.'};
      },
      hint: 'BEGIN; UPDATE …; SELECT …; ROLLBACK; SELECT …;',
      ok: 'ROLLBACK отменил всё, что сделано после BEGIN: цена прежняя.',
    },
    {
      key: 'txcommit',
      title: 'Подтвердили',
      lab: 'ч. 2 · BEGIN … COMMIT',
      text: `Курьер ${cr.name} (id ${cr.id}) пересел на транспорт «${tr2}». Внесите это в транзакции: BEGIN, UPDATE, COMMIT — и покажите строку SELECT после подтверждения.`,
      q: 'Что делает COMMIT?',
      goals: ['BEGIN', 'Новый транспорт курьера', 'COMMIT', 'SELECT после COMMIT'],
      ref: [`UPDATE courier SET transport = ${lit(tr2)} WHERE id = ${cr.id}`],
      sol: [
        'BEGIN',
        `UPDATE courier SET transport = ${lit(tr2)} WHERE id = ${cr.id}`,
        'COMMIT',
        `SELECT * FROM courier WHERE id = ${cr.id}`,
      ],
      tables: ['courier'],
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
          : {wait: 'Подтверждено. Покажите строку SELECT.'};
      },
      hint: 'BEGIN; UPDATE …; COMMIT; SELECT …;',
      ok: 'После COMMIT изменение окончательное: ROLLBACK его уже не отменит.',
    },
    {
      key: 'oops',
      title: 'Забыли WHERE',
      lab: 'ч. 2 · транзакция страхует',
      text: 'Кассир хотел удалить один заказ, но забыл WHERE. Повторите это безопасно: BEGIN, DELETE FROM orders без WHERE — коробки исчезнут, SELECT count(*) FROM orders — ноль. Потом ROLLBACK и тот же count(*) — все заказы на месте.',
      q: 'Как транзакция спасает от DELETE без WHERE?',
      goals: ['BEGIN', 'Удаление без WHERE — count(*) показывает 0', 'ROLLBACK и тот же count(*) — все на месте'],
      ref: [],
      sol: ['BEGIN', 'DELETE FROM orders', 'SELECT count(*) FROM orders', 'ROLLBACK', 'SELECT count(*) FROM orders'],
      tables: ['pizza', 'orders', 'client', 'courier'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        const d = T.findIndex(x => x.kind === 'DELETE' && !x.code && x.table === 'orders' && !x.where);
        if (d < 0) return null;
        if (T[d].tx !== '*') return {fail: 'DELETE выполнен без транзакции — заказы удалены насовсем. Начните с BEGIN.'};
        const s = after(T, d, x => x.kind === 'SELECT' && !x.code && x.tx === '*');
        if (s < 0) return {wait: `Удалено ${T[d].n}. Посчитайте заказы SELECT count(*) — до ROLLBACK.`};
        const r = after(T, s, x => x.kind === 'ROLLBACK');
        if (r < 0)
          return after(T, s, x => x.kind === 'COMMIT') > 0
            ? {fail: 'COMMIT подтвердил удаление всех заказов!'}
            : {wait: 'Видно, что пусто. Теперь ROLLBACK.'};
        const s2 = after(T, r, x => x.kind === 'SELECT' && !x.code && !x.tx);
        if (s2 < 0) return {wait: 'Откатили. Посчитайте заказы ещё раз.'};
        return c.atStart
          ? {ok: true, note: `DELETE ${T[d].n} · ROLLBACK · все ${T[d].n} на месте`}
          : {fail: 'После ROLLBACK база должна быть как в начале.'};
      },
      hint: 'BEGIN; DELETE FROM orders; SELECT count(*) FROM orders; ROLLBACK; SELECT count(*) FROM orders;',
      ok: 'Пока нет COMMIT, любую ошибку можно отменить.',
    },
    {
      key: 'swap',
      title: 'Обмен ценами',
      lab: 'ч. 2 · два изменения — одно целое',
      text: `Ценники перепутали: «${sa.name}» (id ${sa.id}) должна стоить ${cur(sb)} ₽, а «${sb.name}» (id ${sb.id}) — ${cur(sa)} ₽. Поменяйте цены двумя UPDATE в одной транзакции и подтвердите COMMIT — гость не должен увидеть меню, где обе пиццы стоят одинаково.`,
      q: 'Зачем два UPDATE в одной транзакции?',
      goals: ['Обе цены — в одной транзакции', 'Подтвердить COMMIT'],
      ref: [`UPDATE pizza SET price = ${cur(sb)} WHERE id = ${sa.id}`, `UPDATE pizza SET price = ${cur(sa)} WHERE id = ${sb.id}`],
      sol: [
        'BEGIN',
        `UPDATE pizza SET price = ${cur(sb)} WHERE id = ${sa.id}`,
        `UPDATE pizza SET price = ${cur(sa)} WHERE id = ${sb.id}`,
        'COMMIT',
      ],
      tables: ['pizza'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        const ch = T.filter(x => x.kind === 'UPDATE' && !x.code);
        if (ch.some(x => !x.tx)) return {fail: 'UPDATE выполнен без транзакции. Начните с BEGIN.'};
        if (c.wrong.length && !c.tx) return {fail: 'Цены изменились не так, как в задании.'};
        const cm = T.findIndex(x => x.kind === 'COMMIT' && x.tag === 'COMMIT');
        if (cm < 0) return ch.length >= 2 ? {wait: 'Оба UPDATE в транзакции. Подтвердите: COMMIT.'} : null;
        return c.atTarget ? {ok: true, note: 'BEGIN · UPDATE 1 · UPDATE 1 · COMMIT'} : {fail: 'После COMMIT цены не такие, как в задании.'};
      },
      hint: 'BEGIN; UPDATE pizza SET price = … WHERE id = …; UPDATE …; COMMIT;',
      ok: 'Между двумя UPDATE другие сеансы видели старое меню, а после COMMIT — сразу новое.',
    },
    {
      key: 'parent',
      hard: true,
      title: 'Новый гость и его заказ',
      lab: 'сложный · № 8 · родитель и ссылка — в одной транзакции',
      text: `Новый гость — ${guest.full_name}, район ${guest.district}, телефона нет (id ${guest.id}) — сразу делает заказ № ${nextOrder}: «${nameOf(D, D.fav)}» (id ${D.fav}), 1 шт., самовывоз, ${today}; сумма — по текущей цене этой пиццы в таблице pizza (цену можно взять подзапросом). Добавьте гостя и заказ в одной транзакции, подтвердите COMMIT и покажите обе строки SELECT.`,
      q: 'Как добавить строку и ссылку на неё одним целым?',
      goals: ['Гость и заказ — как в задании', 'SELECT обеих строк после подтверждения'],
      ref: parentRef,
      sol: ['BEGIN', ...parentRef, 'COMMIT', `SELECT * FROM orders WHERE client_id = ${guest.id}`],
      tables: ['client', 'orders'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        if (c.wrong.length && !c.tx) return {fail: 'Строки не такие, как в задании.'};
        const ins = T.filter(x => x.kind === 'INSERT' && !x.code);
        if (ins.some(x => !x.tx))
          return {fail: 'INSERT выполнен без транзакции. Начните с BEGIN — гость и заказ должны появиться одним целым.'};
        const cm = T.findIndex(x => x.kind === 'COMMIT' && x.tag === 'COMMIT');
        if (cm < 0) return ins.length >= 2 ? {wait: 'Обе строки в транзакции. Подтвердите: COMMIT.'} : null;
        if (!c.atTarget) return {fail: 'После COMMIT строки не такие, как в задании.'};
        const s = after(T, cm, x => x.kind === 'SELECT' && !x.code);
        return s < 0
          ? {wait: 'Подтверждено. Покажите обе строки запросом SELECT.'}
          : {ok: true, note: 'BEGIN · INSERT 0 1 · INSERT 0 1 · COMMIT'};
      },
      hint: 'BEGIN; INSERT INTO client …; INSERT INTO orders …; COMMIT; SELECT …;',
      ok: 'Гость и его заказ появились вместе: без гостя заказ не вставился бы — внешний ключ.',
    },
    {
      key: 'abort',
      hard: true,
      title: 'Ошибка посреди транзакции',
      lab: 'сложный · № 9–10 · ошибка, «!» и ROLLBACK',
      text: `В транзакции: сначала верное изменение — «${pr.name}» (id ${pr.id}) стоит ${pr.price + 50} ₽, потом добавьте пиццу (id ${newId + 5}, 'Ошибка') без цены — СУБД откажет: price NOT NULL. Затем выполните любой SELECT и прочитайте ответ. ROLLBACK — и SELECT покажет, что верное изменение тоже отменено.`,
      q: 'Что делает СУБД после ошибки внутри транзакции?',
      goals: ['Прочитать ответ СУБД после ошибки', 'В конце база как в начале'],
      ref: [],
      sol: [
        'BEGIN',
        `UPDATE pizza SET price = ${pr.price + 50} WHERE id = ${pr.id}`,
        `INSERT INTO pizza (id, name) VALUES (${newId + 5}, 'Ошибка')`,
        `SELECT name, price FROM pizza WHERE id = ${pr.id}`,
        'ROLLBACK',
        `SELECT name, price FROM pizza WHERE id = ${pr.id}`,
      ],
      tables: ['pizza', 'orders', 'client', 'courier'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        const u = T.findIndex(x => (x.kind === 'UPDATE' || x.kind === 'INSERT' || x.kind === 'DELETE') && !x.code && x.tx === '*');
        if (u < 0)
          return T.some(x => x.kind === 'UPDATE' && !x.code && !x.tx) ? {fail: 'UPDATE выполнен без транзакции. Начните с BEGIN.'} : null;
        const e = after(T, u, x => x.code === '23502' && x.tx === '*');
        if (e < 0) return {wait: 'Верное изменение есть. Теперь команда, которая нарушит NOT NULL: пицца без цены.'};
        const s = after(T, e, x => x.kind === 'SELECT' && x.code === '25P02');
        if (s < 0) return {wait: 'Транзакция прервана (pizza=!>). Выполните любой SELECT и прочитайте ответ СУБД.'};
        const r = after(T, s, x => x.kind === 'ROLLBACK' || (x.kind === 'COMMIT' && x.tag === 'ROLLBACK'));
        if (r < 0) return {wait: 'СУБД ничего не выполняет. Выход один — ROLLBACK.'};
        const s2 = after(T, r, x => x.kind === 'SELECT' && !x.code);
        if (s2 < 0) return {wait: 'Откатили. Покажите SELECT, что и верное изменение отменено.'};
        return c.atStart
          ? {ok: true, note: 'UPDATE 1 · ERROR 23502 · ERROR 25P02 · ROLLBACK'}
          : {fail: 'После ROLLBACK база должна быть как в начале.'};
      },
      hint: "INSERT INTO pizza (id, name) VALUES (…, 'Ошибка'); — цены нет, NOT NULL откажет.",
      ok: 'После ошибки транзакция «всё или ничего» выбрала «ничего»: отменено и верное изменение.',
    },
    // ═══════════════════════════════ часть 3 · ещё транзакции (условие — частью в зале, ★)
    X(
      'raise',
      'Подорожание по отметке',
      'ч. 3 · № 1 · вычисление в SET',
      'Пицца, отмеченная ★ на витрине, дорожает на 10 % (округлить до рубля). В транзакции, с COMMIT.',
      'Как поднять цену на процент?',
      ['Цена пиццы с ★ — на 10 % больше, округлена', 'BEGIN … COMMIT'],
      [`UPDATE pizza SET price = round(price * 1.1) WHERE id = ${raiseP.id}`],
      ['pizza'],
      'SET price = round(price * 1.1) — новое значение считается из старого.',
      'Новое значение вычислено из старого прямо в SET.',
      {clue: {t: 'pizza', k: raiseP.id, where: 'пицца с ★ на витрине'}},
    ),
    X(
      'sick',
      'Курьер заболел',
      'ч. 3 · № 2 · все строки по условию',
      `Курьер, отмеченный ★ у двери, заболел. Все его заказы передайте курьеру ${heir.name} (id ${heir.id}). Сначала SELECT этих заказов, затем UPDATE с тем же условием — в транзакции, с COMMIT.`,
      'Как передать все заказы одного курьера другому?',
      ['SELECT заказов курьера с ★ — до UPDATE', 'UPDATE с тем же условием', 'COMMIT'],
      [`UPDATE orders SET courier_id = ${heir.id} WHERE courier_id = ${sick.id}`],
      ['orders'],
      'WHERE courier_id = … — номер курьера посмотрите щелчком по нему.',
      'Условие одно и то же — SELECT показал ровно то, что изменил UPDATE.',
      {
        aim: 'UPDATE',
        pre: [`SELECT id, courier_id FROM orders WHERE courier_id = ${sick.id}`],
        clue: {t: 'courier', k: sick.id, where: 'курьер с ★ у двери'},
      },
    ),
    X(
      'repeat',
      'Повторите мой заказ',
      'ч. 3 · № 3 · INSERT … SELECT',
      `Гость с ★ за столиком просит повторить свой последний заказ (с самым большим номером): новый заказ № ${nextOrder + 1}, та же пицца, количество, сумма и курьер, дата ${today}. Одной командой INSERT … SELECT, в транзакции, с COMMIT.`,
      'Как вставить строку, взяв значения из другой строки?',
      ['Заказ № ' + (nextOrder + 1) + ' — копия последнего заказа гостя с ★', 'Одна команда INSERT … SELECT', 'COMMIT'],
      [
        `INSERT INTO orders (id, client_id, pizza_id, courier_id, qty, amount, ordered) SELECT ${nextOrder + 1}, client_id, pizza_id, courier_id, qty, amount, ${lit(today)} FROM orders WHERE id = (SELECT max(id) FROM orders WHERE client_id = ${repeater.id})`,
      ],
      ['orders'],
      `INSERT INTO orders (…) SELECT ${nextOrder + 1}, client_id, … FROM orders WHERE id = (SELECT max(id) …);`,
      'INSERT … SELECT берёт значения прямо из базы — переписывать их руками не нужно.',
      {
        clue: {t: 'client', k: repeater.id, where: 'гость с ★ за столиком'},
      },
    ),
    X(
      'leave',
      'Гость уходит насовсем',
      'ч. 3 · № 4 · ссылки, затем родитель',
      'Гость с ★ за столиком просит удалить все его данные — и заказы, и его самого. Сделайте это одной транзакцией. Подумайте, что удалять первым: внешний ключ не даст оставить заказы без гостя.',
      'В каком порядке удалять родителя и ссылки на него?',
      ['Заказы гостя с ★ удалены', 'Сам гость удалён', 'Всё — одной транзакцией, COMMIT'],
      [`DELETE FROM orders WHERE client_id = ${leaver.id}`, `DELETE FROM client WHERE id = ${leaver.id}`],
      ['orders', 'client'],
      'Сначала DELETE FROM orders WHERE client_id = …, потом DELETE FROM client WHERE id = ….',
      'Сначала ссылки, потом родитель — и всё одним целым.',
      {clue: {t: 'client', k: leaver.id, where: 'гость с ★ за столиком'}},
    ),
    X(
      'cheapup',
      'Дешевле среднего',
      'ч. 3 · № 5 · условие с подзапросом',
      'Все пиццы, которые дешевле средней цены меню, дорожают на 20 ₽. Сначала SELECT с этим условием (среднее — подзапросом), затем UPDATE с тем же условием — в транзакции, с COMMIT.',
      'Сколько пицц дешевле среднего — и все ли они подорожали?',
      ['SELECT с подзапросом — до UPDATE', 'UPDATE с тем же условием', 'COMMIT'],
      ['UPDATE pizza SET price = price + 20 WHERE price < (SELECT avg(price) FROM pizza)'],
      ['pizza'],
      'WHERE price < (SELECT avg(price) FROM pizza) — одинаково в SELECT и в UPDATE.',
      'Условие с подзапросом работает в UPDATE так же, как в SELECT.',
      {aim: 'UPDATE', pre: ['SELECT name, price FROM pizza WHERE price < (SELECT avg(price) FROM pizza)']},
    ),
    X(
      'late',
      'Опоздал — скидка',
      'ч. 3 · № 6 · вычисление по условию',
      'Курьер с ★ у двери опаздывал: по всем его заказам сумма снижается на 10 % (округлить до рубля). Перед UPDATE посчитайте общую выручку sum(amount), после — ещё раз, и только тогда COMMIT.',
      'Насколько уменьшилась выручка?',
      ['Суммы заказов курьера с ★ — на 10 % меньше', 'sum(amount) до и после', 'COMMIT'],
      [`UPDATE orders SET amount = round(amount * 0.9) WHERE courier_id = ${heir.id}`],
      ['orders'],
      'SET amount = round(amount * 0.9) WHERE courier_id = …',
      'Выручку до и после видно до COMMIT — ошибку ещё можно было бы откатить.',
      {
        sol: [
          'BEGIN',
          'SELECT sum(amount) FROM orders',
          `UPDATE orders SET amount = round(amount * 0.9) WHERE courier_id = ${heir.id}`,
          'SELECT sum(amount) FROM orders',
          'COMMIT',
        ],
        clue: {t: 'courier', k: heir.id, where: 'курьер с ★ у двери'},
        verify: c => {
          const r = commitCheck()(c);
          if (!r || !r.ok) return r;
          const T = c.trail,
            u = T.findIndex(x => x.kind === 'UPDATE' && !x.code);
          const sums = i => T.slice(...i).some(x => x.kind === 'SELECT' && !x.code && /sum\s*\(\s*amount\s*\)/i.test(x.sql));
          return sums([0, u]) && sums([u + 1]) ? r : {fail: 'Нужна выручка sum(amount) и до UPDATE, и после него (до COMMIT).'};
        },
      },
    ),
    X(
      'move',
      'Переезд',
      'ч. 3 · № 7 · значение из другой строки',
      `Гость с ★ за столиком переехал — теперь он живёт в том же районе, что и ${nb.full_name} (id ${nb.id}). Обновите район одной командой (район возьмите подзапросом), в транзакции, с COMMIT.`,
      'Как взять значение для SET из другой строки?',
      ['Район гостя с ★ — как у ' + nb.full_name, 'COMMIT'],
      [`UPDATE client SET district = (SELECT district FROM client WHERE id = ${nb.id}) WHERE id = ${mover.id}`],
      ['client'],
      'SET district = (SELECT district FROM client WHERE id = …) WHERE id = …',
      'Подзапрос в SET подставил значение из другой строки.',
      {clue: {t: 'client', k: mover.id, where: 'гость с ★ за столиком'}},
    ),
    X(
      'dropmenu',
      'Снять с продажи',
      'ч. 3 · № 8 · две таблицы — одно целое',
      'Пицца с ★ на витрине снимается с продажи: её заказы отменяются, а сама она убирается из меню. Перед удалением заказов покажите их SELECT с тем же условием. Всё — одной транзакцией.',
      'Как убрать пиццу, на которую ссылаются заказы?',
      ['SELECT заказов этой пиццы — до DELETE', 'Заказы и пицца удалены', 'COMMIT'],
      [`DELETE FROM orders WHERE pizza_id = ${dropP.id}`, `DELETE FROM pizza WHERE id = ${dropP.id}`],
      ['orders', 'pizza'],
      'SELECT … WHERE pizza_id = …; DELETE FROM orders WHERE pizza_id = …; DELETE FROM pizza WHERE id = …;',
      'Ссылки, затем родитель — одной транзакцией: меню и заказы согласованы.',
      {
        aim: 'DELETE',
        hard: true,
        pre: [`SELECT id, pizza_id FROM orders WHERE pizza_id = ${dropP.id}`],
        clue: {t: 'pizza', k: dropP.id, where: 'пицца с ★ на витрине'},
      },
    ),
    // ═══════════════════════════════ контрольный
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Закрытие кассы',
      lab: 'сложный · контрольный · без подсказок',
      text: `Закрываем кассу одной транзакцией. 1) Все заказы-самовывозы за ${lastPick} отдаём курьеру ${idleName} (id ${D.idle}) — перед UPDATE покажите их SELECT с тем же условием. 2) Пиццу «${nameOf(D, D.unused)}» (id ${D.unused}) никто не заказывал — убрать из меню. Подтвердите COMMIT.`,
      q: 'Как провести несколько изменений одним целым?',
      goals: ['SELECT перед UPDATE — с тем же условием', 'Всё подтверждено одним COMMIT'],
      ref: [
        `UPDATE orders SET courier_id = ${D.idle} WHERE courier_id IS NULL AND ordered = ${lit(lastPick)}`,
        `DELETE FROM pizza WHERE id = ${D.unused}`,
      ],
      sol: [
        'BEGIN',
        `SELECT id, courier_id FROM orders WHERE courier_id IS NULL AND ordered = ${lit(lastPick)}`,
        `UPDATE orders SET courier_id = ${D.idle} WHERE courier_id IS NULL AND ordered = ${lit(lastPick)}`,
        `DELETE FROM pizza WHERE id = ${D.unused}`,
        'COMMIT',
      ],
      tables: ['orders', 'pizza'],
      check: 'tx',
      allow: ALLOW,
      verify: c => {
        const T = c.trail;
        const ch = T.filter(x => ['UPDATE', 'DELETE', 'INSERT'].includes(x.kind) && !x.code);
        if (ch.some(x => !x.tx)) return {fail: 'Изменение выполнено без транзакции. Начните с BEGIN.'};
        if (c.wrong.length && !c.tx) return {fail: 'Данные изменились не так, как в задании.'};
        const cm = T.findIndex(x => x.kind === 'COMMIT' && x.tag === 'COMMIT');
        if (cm < 0) return ch.length >= 2 ? {wait: 'Оба изменения в транзакции. Осталось COMMIT.'} : null;
        if (!c.atTarget) return {fail: 'После COMMIT данные не такие, как в задании.'};
        const u = T.findIndex(x => x.kind === 'UPDATE' && !x.code);
        const s = T.slice(0, u).findLast(x => x.kind === 'SELECT' && !x.code && x.where === T[u].where);
        return s
          ? {ok: true, note: `SELECT ${s.n} · UPDATE ${T[u].n} · DELETE 1 · COMMIT`}
          : {fail: 'Перед UPDATE не было SELECT с тем же условием.'};
      },
      ok: 'Касса закрыта: оба изменения подтверждены одним COMMIT.',
    },
  ].map(l => ({star: true, ...l})); // в этой лабе SELECT * — обычный способ показать строку до и после
}
