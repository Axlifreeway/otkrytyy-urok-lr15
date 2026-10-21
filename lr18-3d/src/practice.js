// ЛР-18 · тренировка после уровней: бесконечные вопросы на подзапросы, собранные из текущих строк базы.
import {lit} from '../../common/pizzadata.js';

const pick = (a, r) => a[Math.floor(r() * a.length)];
const uniq = a => [...new Set(a)].filter(v => v !== null && v !== undefined);
const SUB = {re: /\(\s*select\b/i, msg: 'нужен подзапрос (SELECT …) в скобках.'};

export function practice(D, st, r) {
  const T = [];
  const dists = uniq(st.client.map(c => c.district)),
    pizzas = st.pizza,
    couriers = st.courier.filter(c => st.orders.some(o => o.courier_id === c.id));
  T.push({
    title: 'Дешевле среднего',
    text: 'Какие пиццы в меню дешевле средней цены по меню? Название и цена.',
    q: 'Какие пиццы дешевле средней?',
    goals: ['Столбцы: name, price', 'price < (SELECT avg(price) FROM pizza)'],
    ask: 'SELECT name, price FROM pizza WHERE price < (SELECT avg(price) FROM pizza)',
    must: [SUB],
    hint: 'WHERE price < (SELECT avg(price) FROM pizza)',
  });
  T.push({
    title: 'Самая дорогая пицца',
    text: 'Какая пицца в меню самая дорогая? Название и цена — подзапросом с max.',
    q: 'Какая пицца самая дорогая?',
    goals: ['Столбцы: name, price', 'price = (SELECT max(price) FROM pizza)'],
    ask: 'SELECT name, price FROM pizza WHERE price = (SELECT max(price) FROM pizza)',
    must: [SUB],
    hint: 'WHERE price = (SELECT max(price) FROM pizza)',
  });
  const d = pick(dists, r);
  T.push({
    title: `Пиццы района ${d}`,
    text: `Какие пиццы заказывали гости из района ${d}? Только названия, подзапросами.`,
    q: `Какие пиццы заказывали в районе ${d}?`,
    goals: ['Столбец: name', 'Без JOIN: IN (SELECT …) внутри IN (SELECT …)'],
    ask: `SELECT name FROM pizza WHERE id IN (SELECT pizza_id FROM orders WHERE client_id IN (SELECT id FROM client WHERE district = ${lit(d)}))`,
    must: [SUB],
    hint: 'pizza ← orders ← client: подзапрос в подзапросе.',
  });
  T.push({
    title: 'Пицца без заказов',
    text: 'Какую пиццу из меню не заказывали ни разу? Название — через NOT EXISTS.',
    q: 'Какую пиццу не заказывали ни разу?',
    goals: ['Столбец: name', 'NOT EXISTS (SELECT 1 FROM orders o WHERE o.pizza_id = p.id)'],
    ask: 'SELECT p.name FROM pizza p WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.pizza_id = p.id)',
    must: [{re: /\bnot\s+exists\b/i, msg: 'нужен NOT EXISTS.'}],
    hint: 'FROM pizza p WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.pizza_id = p.id)',
  });
  T.push({
    title: 'Гость без заказов',
    text: 'Кто из гостей не сделал ни одного заказа? Фамилия — через NOT IN (в orders.client_id пустых нет).',
    q: 'Кто не сделал ни одного заказа?',
    goals: ['Столбец: full_name', 'id NOT IN (SELECT client_id FROM orders)'],
    ask: 'SELECT full_name FROM client WHERE id NOT IN (SELECT client_id FROM orders)',
    must: [{re: /\bnot\s+in\s*\(/i, msg: 'нужен NOT IN.'}],
    hint: 'WHERE id NOT IN (SELECT client_id FROM orders)',
  });
  if (couriers.length) {
    const c = pick(couriers, r);
    T.push({
      title: `Гости курьера ${c.name}`,
      text: `Кому привозил заказы курьер ${c.name}? Фамилии гостей — подзапросом, номер курьера тоже найдите подзапросом по имени.`,
      q: `Кому возил заказы ${c.name}?`,
      goals: ['Столбец: full_name', 'Номер курьера — подзапросом по имени', 'Без JOIN'],
      ask: `SELECT full_name FROM client WHERE id IN (SELECT client_id FROM orders WHERE courier_id = (SELECT id FROM courier WHERE name = ${lit(c.name)}))`,
      must: [SUB],
      hint: '… courier_id = (SELECT id FROM courier WHERE name = …)',
    });
  }
  const p = pick(pizzas, r);
  T.push({
    title: `Дороже, чем «${p.name}»`,
    text: `Какие пиццы дороже, чем «${p.name}»? Название и цена. Цену «${p.name}» не вписывайте — подзапросом.`,
    q: `Какие пиццы дороже «${p.name}»?`,
    goals: ['Столбцы: name, price', `price > (SELECT price FROM pizza WHERE name = '${p.name}')`],
    ask: `SELECT name, price FROM pizza WHERE price > (SELECT price FROM pizza WHERE name = ${lit(p.name)})`,
    must: [SUB],
    hint: 'Подзапрос вернёт одно число — цену этой пиццы.',
  });
  return pick(T, r);
}
