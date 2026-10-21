// ЛР-18 · «Заказ в заказе» — подзапросы: вместо числа, со списком (IN), NOT EXISTS и NOT IN, подзапрос или соединение.
// База — пиццерия (common/pizzadata.js); студент только задаёт вопросы, данные не меняются.
import {lit, nameOf} from '../../common/pizzadata.js';

const NO_JOIN = {re: /^(?![\s\S]*\bjoin\b)/i, msg: 'здесь ответ нужен подзапросом — без JOIN.'};
const SUB = {
  re: /\(\s*select\b/i,
  msg: 'значение нужно получить подзапросом (SELECT …) в скобках, а не вписать числом — иначе запрос устареет, как только изменятся данные.',
};

export function levels(D) {
  const O = D.OR;
  // район, из которого заказывали 3–8 раз
  const perDist = new Map();
  O.forEach(o => {
    const d = D.CL.find(c => c.id === o.client_id).district;
    perDist.set(d, (perDist.get(d) || 0) + 1);
  });
  const dist = [...perDist].sort((a, b) => Math.abs(a[1] - 5) - Math.abs(b[1] - 5))[0][0];
  // «брали по K штук и больше»: 2–5 пицц
  const kQty = [4, 3, 2].find(k => new Set(O.filter(o => o.qty >= k).map(o => o.pizza_id)).size >= 2) || 2;
  const fav = nameOf(D, D.fav);
  return [
    // ═══════════════════════════════ часть 1 · подзапрос вместо числа
    {
      key: 'aboveavg',
      title: 'Дороже среднего',
      lab: 'ч. 1 · подзапрос вместо числа: avg',
      text: 'Какие заказы дороже среднего чека? Средний чек не вписывайте числом — пусть его посчитает подзапрос. Робот сначала выполнит его, потом сравнит каждый заказ с полученным числом.',
      q: 'Какие заказы дороже среднего чека?',
      goals: ['Столбцы: id, amount', 'amount > (SELECT avg(amount) FROM orders)'],
      ask: 'SELECT id, amount FROM orders WHERE amount > (SELECT avg(amount) FROM orders)',
      must: [SUB],
      hint: 'WHERE amount > (SELECT avg(amount) FROM orders) — подзапрос в скобках стоит на месте числа.',
      ok: 'Подзапрос вычислился первым, его число подставилось в условие каждой строки.',
    },
    {
      key: 'maxrow',
      title: 'Рекордный заказ',
      lab: 'ч. 1 · подзапрос вместо числа: max',
      text: 'Найдите самый дорогой заказ: номер, гость (client_id) и сумма. Если рекорд поделили несколько заказов — нужны все.',
      q: 'Какой заказ самый дорогой?',
      goals: ['Столбцы: id, client_id, amount', 'amount = (SELECT max(amount) FROM orders)'],
      ask: 'SELECT id, client_id, amount FROM orders WHERE amount = (SELECT max(amount) FROM orders)',
      must: [SUB],
      hint: 'WHERE amount = (SELECT max(amount) FROM orders)',
      ok: 'ORDER BY … LIMIT 1 потерял бы второй заказ с той же суммой, а подзапрос с max — нет.',
    },
    {
      key: 'biggroup',
      hard: true,
      title: 'Самая популярная',
      lab: 'сложный · подзапрос вместо числа: самая большая группа',
      text: 'Покажите заказы самой популярной пиццы — той, у которой больше всего заказов: номер, дата и количество. Код пиццы вручную не подставлять — пусть его найдёт подзапрос с группировкой.',
      q: 'Какие заказы у самой популярной пиццы?',
      goals: ['Столбцы: id, ordered, qty', 'pizza_id = (подзапрос: код пиццы с наибольшим count(*))'],
      ask: 'SELECT id, ordered, qty FROM orders WHERE pizza_id = (SELECT pizza_id FROM orders GROUP BY pizza_id ORDER BY count(*) DESC LIMIT 1)',
      must: [SUB],
      hint: '(SELECT pizza_id FROM orders GROUP BY pizza_id ORDER BY count(*) DESC LIMIT 1) — одно число: код самой частой пиццы.',
      ok: `Подзапрос нашёл код самой популярной пиццы (это «${fav}»), внешний запрос — её заказы.`,
    },
    // ═══════════════════════════════ часть 2 · подзапрос со списком
    {
      key: 'inlist',
      title: `Заказы района ${dist}`,
      lab: 'ч. 2 · IN: список из другой таблицы',
      text: `Какие заказы сделали гости из района ${dist}? Номер и сумма. Номера гостей возьмите подзапросом из client.`,
      q: `Какие заказы сделали гости из района ${dist}?`,
      goals: ['Столбцы: id, amount', `client_id IN (SELECT id FROM client WHERE district = '${dist}')`],
      ask: `SELECT id, amount FROM orders WHERE client_id IN (SELECT id FROM client WHERE district = ${lit(dist)})`,
      must: [{re: /\bin\s*\(\s*select/i, msg: 'список гостей нужен подзапросом: client_id IN (SELECT id FROM client WHERE …).'}, NO_JOIN],
      hint: 'IN (SELECT id FROM client WHERE district = …) — подзапрос возвращает столбец номеров.',
      ok: 'Подзапрос вернул список номеров гостей, IN проверил по нему каждый заказ.',
    },
    {
      key: 'incond',
      title: 'Большие заказы',
      lab: 'ч. 2 · IN: список с условием',
      text: `Какие пиццы хоть раз заказывали по ${kQty} штуки и больше? Только названия. Коды пицц — подзапросом из orders.`,
      q: `Какие пиццы брали по ${kQty} и больше за раз?`,
      goals: ['Столбец: name', `id IN (SELECT pizza_id FROM orders WHERE qty >= ${kQty})`],
      ask: `SELECT name FROM pizza WHERE id IN (SELECT pizza_id FROM orders WHERE qty >= ${kQty})`,
      must: [{re: /\bin\s*\(\s*select/i, msg: 'коды пицц нужны подзапросом: id IN (SELECT pizza_id FROM orders WHERE …).'}, NO_JOIN],
      hint: `WHERE id IN (SELECT pizza_id FROM orders WHERE qty >= ${kQty})`,
      ok: 'Повторы в списке подзапроса не мешают: каждая пицца в ответе — один раз.',
    },
    {
      key: 'notexists',
      title: 'Курьер без доставок',
      lab: 'ч. 2 · NOT EXISTS: «ни разу не…»',
      text: 'Какие курьеры не сделали ни одной доставки? Имя курьера. Подзапрос ищет хотя бы один заказ этого курьера — NOT EXISTS оставляет тех, у кого не нашлось ни одного.',
      q: 'Какие курьеры ни разу не возили заказ?',
      goals: ['Столбец: name', 'NOT EXISTS (SELECT 1 FROM orders o WHERE o.courier_id = c.id)'],
      ask: 'SELECT c.name FROM courier c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.courier_id = c.id)',
      must: [{re: /\bnot\s+exists\b/i, msg: 'вопрос этого уровня — именно про NOT EXISTS.'}],
      hint: 'FROM courier c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.courier_id = c.id) — подзапрос ссылается на строку внешнего запроса.',
      ok: 'Подзапрос выполнялся для каждого курьера заново: для одного не нашлось ни одного заказа.',
    },
    {
      key: 'notin',
      hard: true,
      title: 'Тот же вопрос через NOT IN',
      lab: 'сложный · NOT IN и пустые значения',
      text: 'Ответьте на тот же вопрос через NOT IN: id NOT IN (список курьеров из заказов). Ответ должен совпасть с NOT EXISTS. Помните: у самовывоза courier_id пуст.',
      q: 'Какие курьеры ни разу не возили заказ (через NOT IN)?',
      goals: ['Столбец: name', 'id NOT IN (SELECT courier_id FROM orders …)', 'Ответ — как у NOT EXISTS'],
      ask: 'SELECT name FROM courier WHERE id NOT IN (SELECT courier_id FROM orders WHERE courier_id IS NOT NULL)',
      must: [{re: /\bnot\s+in\s*\(/i, msg: 'вопрос этого уровня — именно про NOT IN.'}],
      pred: {
        q: 'Если записать просто id NOT IN (SELECT courier_id FROM orders), строк будет…',
        choices: [
          {k: 'same', t: 'столько же, сколько у NOT EXISTS'},
          {k: 'zero', t: 'ни одной'},
          {k: 'all', t: 'все курьеры'},
        ],
        answer: 'zero',
      },
      hint: 'В списке есть NULL (самовывоз): «id <> NULL» — неизвестно, и NOT IN не пропускает ни одной строки. Уберите NULL в подзапросе: … WHERE courier_id IS NOT NULL.',
      ok: 'NOT IN споткнулся бы о пустой courier_id. Без NULL в списке ответ совпал с NOT EXISTS.',
    },
    // ═══════════════════════════════ часть 3 · один вопрос — два решения
    {
      key: 'sub2',
      title: 'Вегетарианцы: подзапрос',
      lab: 'ч. 3 · решение подзапросом',
      text: 'Какие гости заказывали вегетарианские пиццы (veg)? Только фамилия. Решите подзапросами, без JOIN: гости — по списку номеров из orders, а заказы — по списку вегетарианских пицц.',
      q: 'Кто заказывал вегетарианскую пиццу?',
      goals: ['Столбец: full_name', 'IN (SELECT client_id FROM orders WHERE pizza_id IN (SELECT id FROM pizza WHERE veg))', 'Без JOIN'],
      ask: 'SELECT full_name FROM client WHERE id IN (SELECT client_id FROM orders WHERE pizza_id IN (SELECT id FROM pizza WHERE veg))',
      must: [SUB, NO_JOIN],
      hint: 'Подзапрос можно вложить в подзапрос: … IN (SELECT client_id FROM orders WHERE pizza_id IN (SELECT id FROM pizza WHERE veg)).',
      ok: 'Запишите число строк — следующий уровень решает тот же вопрос соединением.',
    },
    {
      key: 'join2',
      title: 'Вегетарианцы: соединение',
      lab: 'ч. 3 · то же соединением',
      text: 'Тот же вопрос — соединением: client, orders и pizza через JOIN, отбор veg в WHERE. Ответ должен совпасть с подзапросом — и по числу строк тоже.',
      q: 'Кто заказывал вегетарианскую пиццу (через JOIN)?',
      goals: ['Столбец: full_name', 'client → orders → pizza через JOIN', 'Каждый гость — один раз'],
      ask: 'SELECT DISTINCT c.full_name FROM client c JOIN orders o ON o.client_id = c.id JOIN pizza p ON p.id = o.pizza_id WHERE p.veg',
      minTables: 3,
      must: [{re: /^(?![\s\S]*\(\s*select\b)/i, msg: 'здесь ответ нужен соединением — без подзапроса.'}],
      pred: {
        q: 'Без DISTINCT соединение вернёт строк…',
        choices: [
          {k: 'same', t: 'столько же, сколько подзапрос'},
          {k: 'more', t: 'больше — гость повторится за каждый заказ'},
          {k: 'less', t: 'меньше'},
        ],
        answer: 'more',
      },
      hint: 'Соединение даёт строку на каждый заказ — гость с двумя вегетарианскими заказами повторится. SELECT DISTINCT убирает повторы.',
      ok: 'Подзапрос отвечает «кто», соединение — «кто и какой заказ»; чтобы совпало, понадобился DISTINCT.',
    },
    // ═══════════════════════════════ контрольный
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Лучшие гости',
      lab: 'сложный · контрольный · без подсказок',
      text: 'Владелец хочет поблагодарить гостей, которые потратили больше, чем гость в среднем. Средняя трата гостя — среднее от сумм заказов каждого гостя: это подзапрос на месте таблицы. Фамилия и сумма (total), от большей.',
      q: 'Кто потратил больше среднего гостя?',
      goals: ['Столбцы: full_name, total', 'total — сумма заказов гостя', 'total > средняя сумма на гостя', 'От большей суммы'],
      ask: 'SELECT c.full_name, sum(o.amount) AS total FROM client c JOIN orders o ON o.client_id = c.id GROUP BY c.full_name HAVING sum(o.amount) > (SELECT avg(t.s) FROM (SELECT sum(amount) AS s FROM orders GROUP BY client_id) AS t) ORDER BY total DESC',
      order: ['total'],
      must: [SUB],
      ok: 'Внутренний запрос посчитал траты гостей, средний — их среднее, внешний — отобрал щедрых.',
    },
  ];
}
