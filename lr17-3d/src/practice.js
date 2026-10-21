// ЛР-17 · тренировка после уровней: бесконечные вопросы на итоги и группировку, собранные из текущих строк базы.
// Каждое задание — обычный уровень с эталонным запросом ask, только без баллов.
import {lit, dayRu} from '../../common/pizzadata.js';

const pick = (a, r) => a[Math.floor(r() * a.length)];
const uniq = a => [...new Set(a)].filter(v => v !== null && v !== undefined);
const count = (a, f) => a.reduce((m, x) => m.set(f(x), (m.get(f(x)) || 0) + 1), new Map());

export function practice(D, st, r) {
  const O = st.orders,
    T = [];
  const days = uniq(O.map(o => o.ordered)),
    dists = uniq(st.client.map(c => c.district));
  // итог по условию
  (() => {
    const d = pick(days, r);
    T.push({
      title: `Выручка ${dayRu(d)}`,
      text: `Сколько заказов было ${dayRu(d)} и на какую сумму? Два числа одним запросом.`,
      q: `Сколько заказов и на какую сумму было ${dayRu(d)}?`,
      goals: ['Столбцы: count(*), sum(amount)', `ordered = '${d}'`],
      ask: `SELECT count(*), sum(amount) FROM orders WHERE ordered = ${lit(d)}`,
      hint: 'Несколько агрегатов — через запятую в одном SELECT.',
    });
  })();
  // группировка по справочнику
  T.push({
    title: 'Порции по пиццам',
    text: 'Сколько штук (qty) каждой пиццы продано всего? Название пиццы и сумма qty.',
    q: 'Сколько штук каждой пиццы продано?',
    goals: ['Столбцы: name, sum(qty)', 'Соединение с pizza', 'GROUP BY по названию'],
    ask: 'SELECT p.name, sum(o.qty) FROM orders o JOIN pizza p ON p.id = o.pizza_id GROUP BY p.name',
    minTables: 2,
    hint: 'sum(o.qty) по группам p.name.',
  });
  T.push({
    title: 'Средний чек района',
    text: 'Средний чек по районам гостей, округлённый до рубля: район и round(avg(amount)).',
    q: 'Какой средний чек в каждом районе?',
    goals: ['Столбцы: district, round(avg(amount))', 'Соединение с client', 'GROUP BY district'],
    ask: 'SELECT c.district, round(avg(o.amount)) FROM orders o JOIN client c ON c.id = o.client_id GROUP BY c.district',
    minTables: 2,
    hint: 'round(avg(o.amount)) … GROUP BY c.district',
  });
  T.push({
    title: 'Рекорд курьера',
    text: 'Самый дорогой заказ, который отвёз каждый курьер: имя курьера и max(amount).',
    q: 'Какой самый дорогой заказ у каждого курьера?',
    goals: ['Столбцы: name, max(amount)', 'Соединение с courier', 'GROUP BY по имени'],
    ask: 'SELECT c.name, max(o.amount) FROM orders o JOIN courier c ON c.id = o.courier_id GROUP BY c.name',
    minTables: 2,
    hint: 'max(o.amount) … GROUP BY c.name',
  });
  // HAVING
  const perClient = [...count(O, o => o.client_id).values()];
  const k = pick(
    uniq(perClient).filter(v => perClient.filter(x => x >= v).length >= 2 && v >= 2),
    r,
  );
  if (k)
    T.push({
      title: 'Частые гости',
      text: `Кто заказывал не меньше ${k} раз? Фамилия и число заказов.`,
      q: `Кто заказывал не меньше ${k} раз?`,
      goals: ['Столбцы: full_name, count(*)', 'Соединение с client', `count(*) >= ${k}`],
      ask: `SELECT c.full_name, count(*) FROM orders o JOIN client c ON c.id = o.client_id GROUP BY c.full_name HAVING count(*) >= ${k}`,
      minTables: 2,
      hint: `HAVING count(*) >= ${k}`,
    });
  // WHERE + HAVING
  const d = pick(dists, r);
  T.push({
    title: `Пиццы района ${d}`,
    text: `Какие пиццы гости из района ${d} заказывали больше одного раза? Название и число заказов.`,
    q: `Какие пиццы в районе ${d} заказывали больше одного раза?`,
    goals: ['Столбцы: name, count(*)', `Только гости района ${d}`, 'count(*) > 1'],
    ask: `SELECT p.name, count(*) FROM orders o JOIN pizza p ON p.id = o.pizza_id JOIN client c ON c.id = o.client_id WHERE c.district = ${lit(d)} GROUP BY p.name HAVING count(*) > 1`,
    minTables: 3,
    hint: 'Три таблицы: orders, pizza, client. Район — в WHERE, «больше одного раза» — в HAVING.',
  });
  // группировка по двум столбцам
  T.push({
    title: 'Доставка или самовывоз',
    text: 'Сколько заказов с курьером и сколько самовывозом в каждый день? День, признак доставки (courier_id IS NOT NULL AS delivery) и число — по дням.',
    q: 'Сколько доставок и самовывозов было в каждый день?',
    goals: ['Столбцы: ordered, delivery, count(*)', 'delivery — courier_id IS NOT NULL', 'GROUP BY по дню и признаку', 'По дню'],
    ask: 'SELECT ordered, courier_id IS NOT NULL AS delivery, count(*) FROM orders GROUP BY ordered, delivery ORDER BY ordered',
    order: ['ordered'],
    hint: 'Группировать можно по нескольким столбцам: GROUP BY ordered, delivery.',
  });
  return pick(T, r);
}
