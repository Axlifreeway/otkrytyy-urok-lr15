// ЛР-19 · «Закрепление» — пятнадцать коротких запросов к своей базе: отбор и порядок, соединение и группировка,
// подзапросы и проверка. Новых команд нет; у каждого запроса — число строк ответа.
import {lit, nameOf, YEAR} from '../../common/pizzadata.js';

export function levels(D) {
  const O = D.OR;
  const from = `${YEAR}-09-01`,
    to = `${YEAR}-09-30`;
  // порог суммы: в ответе 5–9 заказов
  const amounts = [...new Set(O.map(o => o.amount))].sort((a, b) => a - b);
  const thr =
    amounts.find(a => {
      const n = O.filter(o => o.amount > a).length;
      return n >= 5 && n <= 9;
    }) || amounts[Math.floor(amounts.length * 0.7)];
  // буква фамилии: у 2–4 гостей
  const first = D.CL.map(c => c.full_name[0]);
  const letter =
    [...new Set(first)].find(ch => first.filter(x => x === ch).length >= 2 && first.filter(x => x === ch).length <= 4) || first[0];
  const pz = nameOf(D, D.fav);
  const POJ = 'FROM orders o JOIN pizza p ON p.id = o.pizza_id';
  // район, откуда больше всего заказов (при равенстве — первый по алфавиту)
  const perDist = new Map();
  O.forEach(o => {
    const d = D.CL.find(c => c.id === o.client_id).district;
    perDist.set(d, (perDist.get(d) || 0) + 1);
  });
  const dist = [...perDist].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
  const L = (key, title, lab, text, q, goals, ask, more = {}) => ({key, title, lab, text, q, goals, ask, ...more});
  return [
    // ═══════════════════════════════ часть 1 · отбор и сортировка
    L(
      'menu',
      'Меню по алфавиту',
      'ч. 1 · № 1 · справочник по порядку',
      'Выведите всё меню — все столбцы таблицы pizza — по алфавиту названия.',
      'Что есть в меню?',
      ['Все столбцы pizza', 'По названию по алфавиту'],
      'SELECT * FROM pizza ORDER BY name',
      {star: true, order: ['name'], hint: 'SELECT * FROM pizza ORDER BY name;'},
    ),
    L(
      'month',
      'Заказы сентября',
      'ч. 1 · № 2 · строки за месяц, новые сверху',
      'Заказы за сентябрь: номер, дата и сумма. Новые — сверху.',
      'Какие заказы были в сентябре?',
      ['Столбцы: id, ordered, amount', 'Только сентябрь', 'Новые — сверху'],
      `SELECT id, ordered, amount FROM orders WHERE ordered BETWEEN ${lit(from)} AND ${lit(to)} ORDER BY ordered DESC`,
      {order: ['ordered'], hint: "BETWEEN '2026-09-01' AND '2026-09-30' … ORDER BY ordered DESC"},
    ),
    L(
      'big',
      'Крупные заказы',
      'ч. 1 · № 3 · больше порога, по убыванию',
      `Заказы дороже ${thr} ₽: номер и сумма, от больших к меньшим.`,
      `Какие заказы дороже ${thr} ₽?`,
      ['Столбцы: id, amount', 'По убыванию суммы'],
      `SELECT id, amount FROM orders WHERE amount > ${thr} ORDER BY amount DESC`,
      {order: ['amount'], hint: 'WHERE amount > … ORDER BY amount DESC'},
    ),
    L(
      'letter',
      `Гости на «${letter}»`,
      'ч. 1 · № 4 · LIKE',
      `Найдите гостей, чья фамилия начинается на «${letter}»: номер и фамилия.`,
      `У кого фамилия на «${letter}»?`,
      ['Столбцы: id, full_name'],
      `SELECT id, full_name FROM client WHERE full_name LIKE ${lit(letter + '%')}`,
      {hint: `LIKE '${letter}%' — буква, затем что угодно.`},
    ),
    L(
      'nophone',
      'Без телефона',
      'ч. 1 · № 5 · IS NULL',
      'Кому не позвонить — у кого не указан телефон? Номер и фамилия.',
      'У кого не указан телефон?',
      ['Столбцы: id, full_name'],
      'SELECT id, full_name FROM client WHERE phone IS NULL',
      {hint: 'Пустое значение — IS NULL, а не = NULL.'},
    ),
    // ═══════════════════════════════ часть 2 · соединение и группировка
    L(
      'named',
      'Заказы с названиями',
      'ч. 2 · № 6 · название вместо кода',
      'Все заказы: номер, название пиццы вместо её кода и количество.',
      'Что заказывали — по названиям?',
      ['Столбцы: id, name, qty'],
      `SELECT o.id, p.name, o.qty ${POJ}`,
      {minTables: 2, hint: 'FROM orders o JOIN pizza p ON p.id = o.pizza_id'},
    ),
    L(
      'one',
      `Только «${pz}»`,
      'ч. 2 · № 7 · то же для одной позиции',
      `То же, но только заказы пиццы «${pz}».`,
      `Какие заказы пиццы «${pz}»?`,
      ['Столбцы: id, name, qty'],
      `SELECT o.id, p.name, o.qty ${POJ} WHERE p.name = ${lit(pz)}`,
      {minTables: 2, hint: 'К соединению добавьте WHERE p.name = …'},
    ),
    L(
      'total',
      'Сколько заказов',
      'ч. 2 · № 8 · число строк',
      'Посчитайте число строк основной таблицы — сколько всего заказов.',
      'Сколько всего заказов?',
      ['Ответ — одно число'],
      'SELECT count(*) FROM orders',
      {hint: 'SELECT count(*) FROM orders;'},
    ),
    L(
      'per',
      'По каждой пицце',
      'ч. 2 · № 9 · GROUP BY',
      'Сколько заказов у каждой пиццы — по названию. Запомните числа: в № 15 их сумма должна совпасть с № 8.',
      'Сколько заказов у каждой пиццы?',
      ['Столбцы: name, число заказов'],
      `SELECT p.name, count(*) ${POJ} GROUP BY p.name`,
      {minTables: 2, hint: 'GROUP BY p.name'},
    ),
    L(
      'twice',
      'Не меньше двух раз',
      'ч. 2 · № 10 · HAVING',
      'Оставьте только пиццы, которые заказывали не меньше двух раз.',
      'Какие пиццы заказывали хотя бы дважды?',
      ['Столбцы: name, число заказов'],
      `SELECT p.name, count(*) ${POJ} GROUP BY p.name HAVING count(*) >= 2`,
      {minTables: 2, hint: 'HAVING count(*) >= 2'},
    ),
    L(
      'avgp',
      'Средняя сумма по пицце',
      'ч. 2 · № 11 · сумма или среднее по группам',
      'Для каждой пиццы — средняя сумма заказа, округлённая до рубля.',
      'Какая средняя сумма заказа у каждой пиццы?',
      ['Столбцы: name, средняя сумма', 'Округлить до рубля'],
      `SELECT p.name, round(avg(o.amount)) ${POJ} GROUP BY p.name`,
      {minTables: 2, hint: 'round(avg(o.amount)) … GROUP BY p.name'},
    ),
    // ═══════════════════════════════ часть 3 · подзапросы и проверка
    L(
      'over',
      'Выше среднего',
      'ч. 3 · № 12 · больше среднего',
      'Заказы, сумма которых больше средней по всей таблице: номер и сумма.',
      'Какие заказы дороже среднего?',
      ['Столбцы: id, amount', 'Среднее — подзапросом'],
      'SELECT id, amount FROM orders WHERE amount > (SELECT avg(amount) FROM orders)',
      {must: [{re: /\(\s*select\b/i, msg: 'среднее нужно подзапросом.'}], hint: 'WHERE amount > (SELECT avg(amount) FROM orders)'},
    ),
    L(
      'never',
      'Ни разу не заказывали',
      'ч. 3 · № 13 · позиции без пары',
      'Какие пиццы из меню ни разу не встречаются в заказах? Название. Годится LEFT JOIN … IS NULL или NOT EXISTS.',
      'Какую пиццу не заказывали?',
      ['Столбец: name', 'Пиццы без единого заказа'],
      'SELECT p.name FROM pizza p LEFT JOIN orders o ON o.pizza_id = p.id WHERE o.id IS NULL',
      {hint: 'FROM pizza p LEFT JOIN orders o ON o.pizza_id = p.id WHERE o.id IS NULL'},
    ),
    L(
      'newest',
      'Самый новый заказ',
      'ч. 3 · № 14 · max() в подзапросе',
      'Найдите самые новые заказы — за последний день работы — подзапросом с max(): номер, дата, сумма.',
      'Какие заказы самые новые?',
      ['Столбцы: id, ordered, amount', 'Дата — подзапросом'],
      'SELECT id, ordered, amount FROM orders WHERE ordered = (SELECT max(ordered) FROM orders)',
      {
        must: [{re: /\(\s*select\s+max\s*\(/i, msg: 'дату нужно найти подзапросом (SELECT max(ordered) FROM orders).'}],
        hint: 'WHERE ordered = (SELECT max(ordered) FROM orders)',
      },
    ),
    // ═══════════════════════════════ часть 4 · дополнительные запросы (на оставшееся время пары)
    L(
      'veg',
      'Вегетарианское меню',
      'ч. 4 · доп. 1 · логический столбец, сортировка',
      'Вегетарианские пиццы (veg): название и цена, от дешёвых к дорогим.',
      'Какие пиццы вегетарианские?',
      ['Столбцы: name, price', 'Только veg', 'По цене по возрастанию'],
      'SELECT name, price FROM pizza WHERE veg ORDER BY price',
      {order: ['price'], hint: 'WHERE veg — логический столбец сам является условием; можно и veg = true.'},
    ),
    L(
      'fleet',
      'Курьеры по транспорту',
      'ч. 4 · доп. 2 · сортировка по двум столбцам',
      'Список курьеров: имя и транспорт. Сначала по транспорту, внутри — по имени.',
      'Кто из курьеров на чём ездит?',
      ['Столбцы: name, transport', 'По транспорту, внутри — по имени'],
      'SELECT name, transport FROM courier ORDER BY transport, name',
      {order: ['transport', 'name'], hint: 'ORDER BY transport, name — второй столбец решает при равенстве первого.'},
    ),
    L(
      'pickup',
      'Самовывоз',
      'ч. 4 · доп. 3 · count с IS NULL',
      'Сколько заказов гости забрали сами — без курьера?',
      'Сколько было самовывозов?',
      ['Ответ — одно число'],
      'SELECT count(*) FROM orders WHERE courier_id IS NULL',
      {hint: 'WHERE courier_id IS NULL'},
    ),
    L(
      'cheap',
      'Самая дешёвая',
      'ч. 4 · доп. 4 · min() в подзапросе',
      'Самая дешёвая пицца меню: название и цена. Цену найдите подзапросом с min().',
      'Какая пицца самая дешёвая?',
      ['Столбцы: name, price', 'Цена — подзапросом'],
      'SELECT name, price FROM pizza WHERE price = (SELECT min(price) FROM pizza)',
      {
        must: [{re: /\(\s*select\s+min\s*\(/i, msg: 'цену нужно найти подзапросом (SELECT min(price) FROM pizza).'}],
        hint: 'WHERE price = (SELECT min(price) FROM pizza)',
      },
    ),
    L(
      'district',
      `Заказы района ${dist}`,
      'ч. 4 · доп. 5 · соединение с условием',
      `Заказы гостей из района ${dist}: номер заказа, фамилия гостя и сумма.`,
      `Что заказывали в районе ${dist}?`,
      ['Столбцы: id, full_name, amount'],
      `SELECT o.id, c.full_name, o.amount FROM orders o JOIN client c ON c.id = o.client_id WHERE c.district = ${lit(dist)}`,
      {minTables: 2, hint: 'FROM orders o JOIN client c ON c.id = o.client_id WHERE c.district = …'},
    ),
    L(
      'percour',
      'У каждого курьера',
      'ч. 4 · доп. 6 · LEFT JOIN и count(столбец)',
      'Сколько доставок у каждого курьера — включая того, у кого их нет (у него 0). Имя и число.',
      'Сколько доставок у каждого курьера, включая нули?',
      ['Столбцы: name, число доставок', 'Курьер без доставок — с нулём'],
      'SELECT c.name, count(o.id) FROM courier c LEFT JOIN orders o ON o.courier_id = c.id GROUP BY c.name',
      {
        minTables: 2,
        hint: 'LEFT JOIN оставит курьера без пары; count(o.id) не считает пустые — у него будет 0, а count(*) дал бы 1.',
      },
    ),
    L(
      'months',
      'Выручка по месяцам',
      'ч. 4 · доп. 7 · группа по части даты',
      'Выручка по месяцам: номер месяца (столбец m) и сумма, по порядку месяцев.',
      'Сколько заработано в каждом месяце?',
      ['Столбцы: m, выручка', 'По порядку месяцев'],
      'SELECT extract(month FROM ordered) AS m, sum(amount) FROM orders GROUP BY m ORDER BY m',
      {order: ['m'], hint: 'extract(month FROM ordered) — номер месяца из даты; по нему и группируйте.'},
    ),
    L(
      'check',
      'Проверка № 9 по № 8',
      'контрольный · сумма по группам равна итогу',
      'Проверьте запрос № 9 одним запросом: сложите числа из его ответа (подзапрос на месте таблицы) — столбец total. Число должно совпасть с ответом № 8.',
      'Сходится ли сумма по группам с числом всех заказов?',
      ['Столбец: total', 'Должно совпасть с № 8'],
      `SELECT sum(n) AS total FROM (SELECT p.name, count(*) AS n ${POJ} GROUP BY p.name) AS t`,
      {
        final: true,
        hard: true,
        must: [{re: /\(\s*select\b/i, msg: 'нужно сложить ответ запроса № 9 — подзапросом на месте таблицы.'}],
        ok: `Сумма по группам совпала с числом всех заказов — ${O.length}.`,
      },
    ),
  ].map(l => ({ok: 'Готово — запишите число строк ответа в таблицу отчёта.', ...l}));
}
