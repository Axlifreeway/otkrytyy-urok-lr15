// «SQL Pizza» — одна база на ЛР-17–20: меню (pizza), курьеры (courier), гости (client), заказы (orders).
// Вариант — номер студента: у соседа другие пиццы, цены, гости и заказы.
// Данные строятся так, чтобы у вопросов лаб был однозначный и непустой ответ:
//   одну пиццу из меню не заказывали ни разу, один курьер не сделал ни одной доставки, один гость ничего не заказал;
//   часть заказов — самовывоз (courier_id пуст): на этом ломается NOT IN; самая популярная пицца — одна,
//   а одну пиццу заказали ровно один раз.
import {rng} from './rng.js';
export {rng};

export const YEAR = 2026;
// название, цена, вегетарианская, цвет начинки
const MENU = [
  ['Маргарита', 490, true, 0xd2483c],
  ['Пепперони', 590, false, 0xb83a2a],
  ['Четыре сыра', 650, true, 0xf2c94c],
  ['Гавайская', 560, false, 0xf0a04b],
  ['Баварская', 620, false, 0x9b5a33],
  ['Грибная', 540, true, 0xa58b6a],
  ['Песто', 580, true, 0x5c8a3a],
  ['Мясная', 690, false, 0x7a2e22],
  ['Овощная', 520, true, 0x79a84a],
  ['Диабло', 640, false, 0xe0402a],
  ['Карбонара', 610, false, 0xefe2b8],
  ['Сырная с грушей', 670, true, 0xe9d38a],
];
const COURIERS = ['Ахмедов Р.', 'Белова К.', 'Гусев Д.', 'Зайцева М.', 'Ким А.', 'Лаптев С.', 'Орлова Т.', 'Сафин И.'];
const TRANSPORT = ['самокат', 'велосипед', 'авто'];
export const DISTRICTS = ['Центр', 'Заречный', 'КПД', 'Лесобаза', 'Тарманы'];
const SURN = [
  'Иванов',
  'Петров',
  'Смирнов',
  'Кузнецов',
  'Попов',
  'Соколов',
  'Лебедев',
  'Козлов',
  'Новиков',
  'Морозов',
  'Волков',
  'Егоров',
  'Павлов',
  'Орлов',
  'Макаров',
  'Титов',
  'Зуев',
  'Фомин',
  'Котов',
  'Быков',
  'Панов',
  'Савин',
  'Лукин',
  'Рябов',
  'Громов',
  'Жуков',
  'Ершов',
  'Гусев',
  'Ильин',
  'Карпов',
];
const INI = 'АБВГДЕИКЛМНОПРСТ';
const pad = n => String(n).padStart(2, '0');
export const iso = (m, d) => `${YEAR}-${pad(m)}-${pad(d)}`;

export function makeData(seed) {
  const r = rng(seed * 7919 + 1717);
  // меню: 8 пицц, цена ±30 ₽ от базовой
  const menu = r.take(MENU, 8);
  const PZ = menu.map(([name, price, veg, color], i) => ({id: i + 1, name, price: price + r.int(-3, 3) * 10, veg, color}));
  // курьеры: пятеро, один (не первый) ни разу не возил
  const CR = r.take(COURIERS, 5).map((name, i) => ({id: i + 1, name, transport: r.pick(TRANSPORT)}));
  const idle = CR[r.int(1, CR.length - 1)].id;
  // гости: 14 человек, телефон не указан у троих
  const used = new Set();
  const CL = [];
  for (let i = 1; i <= 14; i++) {
    let n;
    do {
      const female = r() < 0.5;
      n = `${r.pick(SURN)}${female ? 'а' : ''} ${INI[r.int(0, 15)]}. ${INI[r.int(0, 15)]}.`;
    } while (used.has(n));
    used.add(n);
    CL.push({
      id: i,
      full_name: n,
      district: r.pick(DISTRICTS),
      phone: `+7 9${r.int(10, 99)} ${r.int(100, 999)}-${r.int(10, 99)}-${r.int(10, 99)}`,
    });
  }
  r.take(CL, 3).forEach(c => {
    c.phone = null;
  });
  const quiet = CL[r.int(0, CL.length - 1)].id; // этот гость ничего не заказывал
  // дни работы: 5 в сентябре, 7 в октябре
  const days = [
    ...r
      .take(
        [...Array(30).keys()].map(d => d + 1),
        5,
      )
      .sort((a, b) => a - b)
      .map(d => iso(9, d)),
    ...r
      .take(
        [...Array(20).keys()].map(d => d + 1),
        7,
      )
      .sort((a, b) => a - b)
      .map(d => iso(10, d)),
  ];
  // заказы: одна пицца из меню (unused) не продавалась; самая популярная — с перевесом
  const unused = PZ[r.int(0, PZ.length - 1)].id;
  const sold = PZ.filter(p => p.id !== unused);
  const fav = r.pick(sold).id;
  const n = r.int(32, 37);
  const OR = [];
  const guests = CL.filter(c => c.id !== quiet);
  const couriers = CR.filter(c => c.id !== idle);
  for (let i = 0; i < n; i++) {
    const pz = r() < 0.1 ? PZ.find(p => p.id === fav) : r.pick(sold);
    const qty = r() < 0.55 ? 1 : r() < 0.65 ? 2 : r() < 0.7 ? 3 : 4;
    OR.push({
      id: i + 1,
      client_id: r.pick(guests).id,
      pizza_id: pz.id,
      courier_id: r() < 0.24 ? null : r.pick(couriers).id,
      qty,
      amount: pz.price * qty,
      ordered: '',
    });
  }
  // каждый гость (кроме одного) хоть раз заказывал, самовывоз есть хотя бы дважды
  guests.forEach((c, i) => {
    if (!OR.some(o => o.client_id === c.id)) OR[(i * 5) % OR.length].client_id = c.id;
  });
  if (OR.filter(o => o.courier_id === null).length < 2) OR.slice(0, 2).forEach(o => (o.courier_id = null));
  couriers.forEach((c, i) => {
    if (!OR.some(o => o.courier_id === c.id)) OR[OR.length - 1 - i].courier_id = c.id;
  });
  const cnt = id => OR.filter(o => o.pizza_id === id).length;
  // одну пиццу заказали ровно один раз — иначе «не меньше двух раз» (HAVING) ничего не отбрасывает
  const rare = sold.filter(p => p.id !== fav).sort((a, b) => cnt(a.id) - cnt(b.id))[0];
  OR.filter(o => o.pizza_id === rare.id)
    .slice(1)
    .forEach(o => {
      o.pizza_id = fav;
      o.amount = PZ.find(p => p.id === fav).price * o.qty;
    });
  if (!cnt(rare.id)) {
    const o = OR.find(o => o.pizza_id === fav);
    o.pizza_id = rare.id;
    o.amount = rare.price * o.qty;
  }
  // у самой популярной пиццы — строго больше заказов, чем у любой другой
  for (let k = 0; k < 20; k++) {
    const top = Math.max(...sold.filter(p => p.id !== fav).map(p => cnt(p.id)));
    if (cnt(fav) > top) break;
    const o = OR.find(o => o.pizza_id !== fav && cnt(o.pizza_id) === top);
    o.pizza_id = fav;
    o.amount = PZ.find(p => p.id === fav).price * o.qty;
  }
  // даты: заказы идут по дням по порядку номеров, в каждом дне хотя бы один
  const per = days.map(() => 1);
  for (let k = days.length; k < OR.length; k++) per[r.int(0, days.length - 1)]++;
  let d = 0,
    left = per[0];
  OR.forEach(o => {
    while (!left) left = per[++d];
    o.ordered = days[d];
    left--;
  });
  return {seed, PZ, CR, CL, OR, idle, quiet, unused, fav, days};
}

export const SCHEMA = `
CREATE TABLE pizza (
  id    integer     CONSTRAINT pk_pizza PRIMARY KEY,
  name  varchar(30) NOT NULL CONSTRAINT uq_pizza_name UNIQUE,
  price integer     NOT NULL CONSTRAINT ck_pizza_price CHECK (price > 0),
  veg   boolean     NOT NULL DEFAULT false
);
CREATE TABLE courier (
  id        integer     CONSTRAINT pk_courier PRIMARY KEY,
  name      varchar(40) NOT NULL,
  transport varchar(12) NOT NULL
);
CREATE TABLE client (
  id        integer     CONSTRAINT pk_client PRIMARY KEY,
  full_name varchar(60) NOT NULL,
  district  varchar(20) NOT NULL,
  phone     varchar(20)
);
CREATE TABLE orders (
  id         integer CONSTRAINT pk_orders PRIMARY KEY,
  client_id  integer NOT NULL CONSTRAINT fk_orders_client REFERENCES client (id),
  pizza_id   integer NOT NULL CONSTRAINT fk_orders_pizza REFERENCES pizza (id),
  courier_id integer CONSTRAINT fk_orders_courier REFERENCES courier (id),
  qty        integer NOT NULL CONSTRAINT ck_orders_qty CHECK (qty BETWEEN 1 AND 9),
  amount     integer NOT NULL,
  ordered    date    NOT NULL
);`;
export const lit = v =>
  v === null || v === undefined
    ? 'NULL'
    : typeof v === 'number' || typeof v === 'boolean'
      ? String(v)
      : "'" + String(v).replace(/'/g, "''") + "'";
export function baseSql(D) {
  const rows = (t, cols, list) =>
    `INSERT INTO ${t} (${cols.join(', ')}) VALUES ` + list.map(x => `(${cols.map(c => lit(x[c])).join(', ')})`).join(',\n') + ';\n';
  return (
    SCHEMA +
    '\n' +
    rows('pizza', ['id', 'name', 'price', 'veg'], D.PZ) +
    rows('courier', ['id', 'name', 'transport'], D.CR) +
    rows('client', ['id', 'full_name', 'district', 'phone'], D.CL) +
    rows('orders', ['id', 'client_id', 'pizza_id', 'courier_id', 'qty', 'amount', 'ordered'], D.OR)
  );
}
export const TABLES = {pizza: 'id', courier: 'id', client: 'id', orders: 'id'};
export const COLS = {
  pizza: ['id', 'name', 'price', 'veg'],
  courier: ['id', 'name', 'transport'],
  client: ['id', 'full_name', 'district', 'phone'],
  orders: ['id', 'client_id', 'pizza_id', 'courier_id', 'qty', 'amount', 'ordered'],
};
// снимок таблицы для сцены и проверки: дата — текстом, чтобы одинаково сравнивалась везде
export const sel = t => `SELECT ${COLS[t].map(c => (c === 'ordered' ? 'ordered::text AS ordered' : c)).join(', ')} FROM ${t}`;
// цвет начинки на крышке коробки и на витрине: по названию (новые пиццы ЛР-20 — по номеру)
const COLOR = new Map(MENU.map(m => [m[0], m[3]]));
const SPARE = [0x6b4f9a, 0x2f6f73, 0x3b4d7a, 0xc77d2e, 0x8a3b6b];
export const pizzaColor = p => COLOR.get(p.name) ?? SPARE[p.id % SPARE.length];
// подписи для текста заданий
export const nameOf = (D, id) => (D.PZ.find(p => p.id === id) || {}).name;
export const rub = n => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;
export const MONTHS = [
  '',
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];
export const dayRu = s => {
  const [, m, d] = s.split('-').map(Number);
  return `${d} ${['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][m]}`;
};
