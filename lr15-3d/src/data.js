// ЛР-15 · «Посадка по запросу» — выборка данных: SELECT, WHERE, ORDER BY.
// Тот же салон, что в ЛР-14, но база «разошлась с моделью»: у багажа нет первичного и внешнего ключа,
// номер пассажира вводят руками. Сначала база доводится до состояния, когда ответам можно верить, потом — запросы.
import {rng} from '../../common/rng.js';
export {rng};
export const ROWS = 8,
  LET = ['A', 'B', 'C', 'D', 'E', 'F'];
export const FLIGHT = 'ИИ-714';
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
const CITIES = ['Тюмень', 'Тюмень', 'Тюмень', 'Москва', 'Сургут', 'Тобольск', 'Ишим', 'Омск', 'Ялуторовск'];
const INI = 'АБВГДЕИКЛМНОПРСТ';
export const seatRow = s => parseInt(s, 10);
export const shelfOf = row => Math.ceil(row / 2);
const MEALS = ['стандарт', 'стандарт', 'стандарт', 'вегетарианское', 'ресторан'];
const cnt = (a, f) => a.filter(f).length;

export function makeData(seed) {
  const r = rng(seed * 7919 + 1515);
  const seats = [];
  for (let row = 1; row <= ROWS; row++) for (const L of LET) seats.push(row + L);
  // пассажиры; номера — с пропусками (кого-то сняли с рейса раньше)
  const P = [];
  let id = 0;
  const kids = new Set(r.take([...seats.keys()], 7));
  seats.forEach((s, i) => {
    if (!kids.has(i) && r() < 0.24) return;
    id += r() < 0.18 ? 2 : 1;
    const kid = kids.has(i),
      female = r() < 0.5;
    P.push({
      id,
      flight_no: FLIGHT,
      seat: s,
      full_name: `${r.pick(SURN)}${female ? 'а' : ''} ${INI[r.int(0, 15)]}. ${INI[r.int(0, 15)]}.`,
      birth_year: kid ? r.int(2012, 2020) : r() < 0.12 ? r.int(1946, 1959) : r.int(1962, 2005),
      city: r.pick(CITIES),
      loyalty: kid ? null : r.pick(['золото', 'серебро', 'серебро', 'базовая', 'базовая', null, null]),
      meal: kid ? (r() < 0.75 ? 'детское' : 'стандарт') : r() < 0.08 ? null : r.pick(MEALS),
      active: true,
      kid,
      female,
      old: false,
    });
  });
  P.forEach(p => {
    p.old = p.birth_year < 1960;
  });
  // год рождения неизвестен у двоих взрослых
  const adults = P.filter(p => !p.kid);
  r.take(adults, 2).forEach(p => {
    p.birth_year = null;
  });
  // багаж: на полке над рядом владельца
  const B = [];
  const tags = new Set();
  const tag = () => {
    let t;
    do t = 'Б' + r.int(1000, 9999);
    while (tags.has(t));
    tags.add(t);
    return t;
  };
  P.forEach(p => {
    const n = r() < 0.5 ? 1 : r() < 0.3 ? 2 : 0;
    for (let k = 0; k < n; k++) B.push({tag: tag(), passenger_id: p.id, shelf: shelfOf(seatRow(p.seat)), weight_kg: r.int(3, 27)});
  });
  // десять самых тяжёлых — с разным весом (иначе порядок ответа неоднозначен)
  B.slice()
    .sort((a, b) => b.weight_kg - a.weight_kg)
    .slice(0, 6)
    .forEach((b, i) => {
      b.weight_kg = 32 - i * 2 - (i > 2 ? 1 : 0);
    });
  // «чужие» чемоданы: владелец снят с рейса вчера, а багаж остался — номера такого пассажира нет
  const used = new Set(P.map(p => p.id));
  let gone = 2;
  while (used.has(gone)) gone++;
  const orphans = [0, 1].map(() => ({tag: tag(), passenger_id: gone, shelf: r.int(1, 4), weight_kg: r.int(6, 20)}));
  B.push(...orphans);
  B.splice(0, B.length, ...r.take(B, B.length));
  // новый пассажир для проверки автогенерации ключа
  const occ = new Set(P.map(p => p.seat));
  const freeSeat = r.pick(seats.filter(s => !occ.has(s)));
  const maxId = Math.max(...P.map(p => p.id));
  const fem = r() < 0.5;
  const newP = {
    id: maxId + 1,
    flight_no: FLIGHT,
    seat: freeSeat,
    full_name: `${r.pick(SURN)}${fem ? 'а' : ''} ${INI[r.int(0, 15)]}. ${INI[r.int(0, 15)]}.`,
    birth_year: r.int(1970, 2000),
    city: r.pick(['Сургут', 'Омск', 'Ишим']),
  };
  const all = [...P, {...newP, loyalty: null, meal: null, kid: false}];
  // город для отбора по равенству: 3–6 пассажиров
  const byCity = c => cnt(all, p => p.city === c);
  const cities = [...new Set(all.map(p => p.city))];
  const city = r.pick(
    cities
      .filter(c => byCity(c) >= 3 && byCity(c) <= 6)
      .concat(cities.filter(c => byCity(c) >= 2))
      .slice(0, 4),
  );
  // перечень: два «малых» города, отличных от первого
  const small = cities.filter(c => c !== city).sort((a, b) => byCity(a) - byCity(b));
  const two = [small[0], small[1]].sort();
  // диапазон годов рождения: от 4 до 9 человек
  const ys = all
    .map(p => p.birth_year)
    .filter(y => y != null)
    .sort((a, b) => a - b);
  let y1 = 1975,
    y2 = 1985;
  for (let k = 0; k < 30; k++) {
    const a = r.int(1965, 1995),
      b = a + r.int(6, 12);
    const n = cnt(ys, y => y >= a && y <= b);
    if (n >= 4 && n <= 9) {
      y1 = a;
      y2 = b;
      break;
    }
  }
  // буква фамилии: у 2–5 пассажиров
  const first = all.map(p => p.full_name[0]);
  const letters = [...new Set(first)].filter(ch => cnt(first, x => x === ch) >= 2 && cnt(first, x => x === ch) <= 5);
  const letter = letters.length ? r.pick(letters) : first[0];
  // скобки: «город X И (золото ИЛИ серебро)» против «город X И золото ИЛИ серебро»
  const gs = p => p.loyalty === 'золото' || p.loyalty === 'серебро';
  const pc = cities
    .map(c => ({
      c,
      ok: cnt(all, p => p.city === c && gs(p)),
      loose: cnt(all, p => (p.city === c && p.loyalty === 'золото') || p.loyalty === 'серебро'),
    }))
    .filter(x => x.ok >= 1 && x.loose > x.ok);
  const paren = pc.length ? r.pick(pc) : {c: city, ok: 0, loose: 0};
  // контрольный вопрос: питание в первых рядах
  const meals = r.pick([
    ['детское', 'вегетарианское'],
    ['вегетарианское', 'ресторан'],
    ['детское', 'ресторан'],
  ]);
  const upto = r.int(3, 5);
  return {seed, P, B, FLIGHT, gone, orphans, newP, maxId, city, two, y1, y2, letter, paren, meals, upto};
}

// база разошлась с моделью: у baggage нет ни первичного, ни внешнего ключа; passenger.id вводят руками
export const SCHEMA = `
CREATE TABLE flight (
  flight_no varchar(7)  CONSTRAINT pk_flight PRIMARY KEY,
  dest      varchar(40) NOT NULL
);
CREATE TABLE loyalty (
  tier     varchar(10) CONSTRAINT pk_loyalty PRIMARY KEY,
  discount integer     NOT NULL
);
CREATE TABLE passenger (
  id         integer     CONSTRAINT pk_passenger PRIMARY KEY,
  flight_no  varchar(7)  NOT NULL CONSTRAINT fk_passenger_flight REFERENCES flight (flight_no),
  seat       varchar(3)  NOT NULL,
  full_name  varchar(60) NOT NULL,
  birth_year integer,
  city       varchar(40),
  loyalty    varchar(10) CONSTRAINT fk_passenger_loyalty REFERENCES loyalty (tier) ON DELETE SET NULL,
  meal       varchar(20),
  active     boolean     NOT NULL DEFAULT true
);
CREATE TABLE baggage (
  tag          varchar(6) NOT NULL,
  passenger_id integer    NOT NULL,
  shelf        integer    NOT NULL,
  weight_kg    integer    NOT NULL CONSTRAINT ck_baggage_weight CHECK (weight_kg BETWEEN 1 AND 32)
);`;
export const lit = v =>
  v === null || v === undefined
    ? 'NULL'
    : typeof v === 'number' || typeof v === 'boolean'
      ? String(v)
      : "'" + String(v).replace(/'/g, "''") + "'";
export function baseSql(D) {
  return (
    SCHEMA +
    `INSERT INTO flight VALUES ('${FLIGHT}', 'Сочи'), ('ИИ-715', 'Казань');
INSERT INTO loyalty VALUES ('золото', 15), ('серебро', 10), ('базовая', 5);
INSERT INTO passenger (id, flight_no, seat, full_name, birth_year, city, loyalty, meal) VALUES ` +
    D.P.map(
      p =>
        `(${p.id}, ${lit(p.flight_no)}, ${lit(p.seat)}, ${lit(p.full_name)}, ${lit(p.birth_year)}, ${lit(p.city)}, ${lit(p.loyalty)}, ${lit(p.meal)})`,
    ).join(',\n') +
    ';\nINSERT INTO baggage (tag, passenger_id, shelf, weight_kg) VALUES ' +
    D.B.map(b => `(${lit(b.tag)}, ${b.passenger_id}, ${b.shelf}, ${b.weight_kg})`).join(',\n') +
    ';'
  );
}
export const TABLES = {passenger: 'id', baggage: 'tag', loyalty: 'tier', flight: 'flight_no'};
export const COLS = {
  passenger: ['id', 'flight_no', 'seat', 'full_name', 'birth_year', 'city', 'loyalty', 'meal', 'active'],
  baggage: ['tag', 'passenger_id', 'shelf', 'weight_kg'],
  loyalty: ['tier', 'discount'],
  flight: ['flight_no', 'dest'],
};

const ALL = ['ALTER', 'SELECT', 'INSERT', 'UPDATE', 'DELETE'];
export function levels(D) {
  const n = D.newP;
  const rowsLike = Array.from({length: D.upto}, (_, i) => `seat LIKE '${i + 1}%'`).join(' OR ');
  return [
    // ═══════════════════════════════ часть 1 · готовность базы к запросам
    {
      key: 'pk',
      title: 'Паспорт багажа',
      lab: 'ч. 1 · первичный ключ к готовой таблице',
      text: 'Прежде чем спрашивать базу, проверьте, можно ли ей верить. Откройте «Структуру базы» под заданием: у таблицы baggage нет первичного ключа — две строки с одной биркой база бы приняла. Объявите его командой ALTER TABLE.',
      goals: ['Первичный ключ baggage по бирке (tag)', 'Имя по правилу: pk_baggage'],
      check: 'schema',
      allow: ALL,
      need: [{t: 'baggage', type: 'p', cols: 'tag', label: 'первичный ключ baggage (tag)'}],
      ref: ['ALTER TABLE baggage ADD CONSTRAINT pk_baggage PRIMARY KEY (tag)'],
      cmds: 'Одна команда ALTER TABLE … ADD CONSTRAINT …',
      hint: 'ALTER TABLE [таблица] ADD CONSTRAINT [имя] PRIMARY KEY ([столбец]);',
      ok: 'У каждого чемодана теперь своя бирка — повтор база не примет.',
    },
    {
      key: 'fk',
      hard: true,
      title: 'Чемоданы без хозяина',
      lab: 'сложный · внешний ключ со второй попытки',
      text: `Связь «чемодан → пассажир» есть в модели, но в базе не объявлена. Объявите внешний ключ baggage.passenger_id → passenger.id (при удалении пассажира его багаж удаляется). СУБД откажет: вчера с рейса сняли пассажира, а его багаж остался. Найдите эти строки запросом и снимите их с борта — потом повторите ту же команду.`,
      goals: ['Внешний ключ fk_baggage_passenger, ON DELETE CASCADE', 'Строки без пары найдены и удалены', 'Остальной багаж на месте'],
      check: 'schema',
      allow: ALL,
      tables: ['baggage'],
      need: [{t: 'baggage', type: 'f', cols: 'passenger_id', ref: 'passenger', label: 'внешний ключ baggage.passenger_id → passenger'}],
      ref: [
        `DELETE FROM baggage WHERE passenger_id = ${D.gone}`,
        'ALTER TABLE baggage ADD CONSTRAINT fk_baggage_passenger FOREIGN KEY (passenger_id) REFERENCES passenger (id) ON DELETE CASCADE',
      ],
      cmds: 'ALTER TABLE → отказ → SELECT мешающих строк → исправление → ALTER TABLE ещё раз',
      hint: 'Отказ называет мешающее значение: Key (passenger_id)=(…). Посмотрите эти строки: SELECT tag, passenger_id FROM baggage WHERE passenger_id = …',
      ok: 'Правило введено после того, как данные ему соответствуют. Чемоданов «в никуда» больше не будет.',
    },
    {
      key: 'ident',
      hard: true,
      title: 'Номер выдаёт СУБД',
      lab: 'сложный · автогенерация ключа',
      text: `Номер пассажира вводят руками — так и до повторов недалеко. Передайте выдачу номера СУБД (GENERATED ALWAYS AS IDENTITY) и сдвиньте счётчик выше наибольшего номера: иначе первая же вставка упрётся в занятое значение. Проверьте одной вставкой, где id не указан.`,
      goals: ['passenger.id — GENERATED ALWAYS AS IDENTITY', 'Счётчик — с наибольшего номера + 1', `Новый пассажир — без id в команде`],
      doc: `<table class="doc"><tr><th>место</th><th>пассажир</th><th>г. р.</th><th>город</th><th>рейс</th></tr><tr><td>${n.seat}</td><td>${n.full_name}</td><td>${n.birth_year}</td><td>${n.city}</td><td>${FLIGHT}</td></tr></table>`,
      check: 'schema',
      allow: ALL,
      tables: ['passenger'],
      identity: {t: 'passenger', col: 'id'},
      ref: [
        'ALTER TABLE passenger ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY',
        `ALTER TABLE passenger ALTER COLUMN id RESTART WITH ${D.maxId + 1}`,
        `INSERT INTO passenger (flight_no, seat, full_name, birth_year, city) VALUES (${lit(FLIGHT)}, ${lit(n.seat)}, ${lit(n.full_name)}, ${n.birth_year}, ${lit(n.city)})`,
      ],
      cmds: 'Наибольший номер — SELECT … ORDER BY id DESC LIMIT 1; потом ALTER COLUMN … и INSERT без id',
      hint: 'ALTER TABLE passenger ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY; затем ALTER COLUMN id RESTART WITH [наибольший + 1];',
      ok: `Номер ${D.maxId + 1} выдала СУБД. Руками ключ больше не вводится.`,
    },
    // ═══════════════════════════════ часть 2 · шесть запросов
    {
      key: 'cols',
      title: 'Посадочная ведомость',
      lab: 'ч. 2 · перечень столбцов',
      text: 'Бригадиру нужен список: кто где сидит. Только эти два столбца — без «звёздочки»: в ответе ровно то, о чём спрашивали.',
      q: 'Кто из пассажиров на каком месте?',
      goals: ['Столбцы: full_name, seat', 'Все пассажиры'],
      ask: 'SELECT full_name, seat FROM passenger',
      hint: 'SELECT [столбец], [столбец] FROM [таблица];',
      ok: 'Ровно два столбца — ровно то, о чём спрашивали.',
    },
    {
      key: 'eq',
      title: `Земляки из города ${D.city}`,
      lab: 'ч. 2 · отбор по равенству',
      text: `Встречающая сторона просит список пассажиров из города ${D.city}: фамилия и место.`,
      q: `Кто летит из города ${D.city}?`,
      goals: [`Только город ${D.city}`, 'Столбцы: full_name, seat'],
      ask: `SELECT full_name, seat FROM passenger WHERE city = ${lit(D.city)}`,
      hint: "WHERE столбец = 'значение' — текст в одинарных кавычках.",
      ok: 'Робот проверил каждого — в ответ попали только земляки.',
    },
    {
      key: 'range',
      title: 'Ровесники',
      lab: 'ч. 2 · отбор по диапазону',
      text: `Для опроса нужны пассажиры, родившиеся с ${D.y1} по ${D.y2} год включительно: фамилия и год рождения.`,
      q: `Кто родился с ${D.y1} по ${D.y2} год?`,
      goals: [`birth_year от ${D.y1} до ${D.y2} включительно`, 'Столбцы: full_name, birth_year'],
      ask: `SELECT full_name, birth_year FROM passenger WHERE birth_year BETWEEN ${D.y1} AND ${D.y2}`,
      hint: 'BETWEEN [от] AND [до] — обе границы включаются.',
      ok: 'BETWEEN включает обе границы.',
    },
    {
      key: 'inlist',
      title: 'Два города',
      lab: 'ч. 2 · отбор по перечню',
      text: `Автобус после посадки развозит в ${D.two[0]} и ${D.two[1]}. Кто в нём поедет: фамилия и город.`,
      q: `Кто из пассажиров едет в ${D.two[0]} или ${D.two[1]}?`,
      goals: [`city — одно из: ${D.two.join(', ')}`, 'Столбцы: full_name, city'],
      ask: `SELECT full_name, city FROM passenger WHERE city IN (${D.two.map(lit).join(', ')})`,
      hint: "IN ('значение', 'значение') — короче, чем OR.",
      ok: 'IN — перечень вместо цепочки OR.',
    },
    {
      key: 'like',
      title: `Фамилии на «${D.letter}»`,
      lab: 'ч. 2 · поиск по образцу',
      text: `Стюард помнит только первую букву фамилии — «${D.letter}». Найдите таких пассажиров: фамилия и место.`,
      q: `У кого фамилия начинается на «${D.letter}»?`,
      goals: [`full_name начинается с «${D.letter}»`, 'Столбцы: full_name, seat'],
      ask: `SELECT full_name, seat FROM passenger WHERE full_name LIKE '${D.letter}%'`,
      hint: "LIKE 'А%' — знак % значит «дальше что угодно».",
      ok: 'LIKE с % нашёл всех на нужную букву.',
    },
    {
      key: 'order2',
      title: 'Разгрузка по полкам',
      lab: 'ч. 2 · упорядочение по двум столбцам',
      text: 'Грузчикам нужен список чемоданов: по полкам, а на полке — от тяжёлых к лёгким. Бирка, полка, вес.',
      q: 'В каком порядке снимать чемоданы с полок?',
      goals: ['Столбцы: tag, shelf, weight_kg', 'По полке, на полке — по убыванию веса'],
      ask: 'SELECT tag, shelf, weight_kg FROM baggage ORDER BY shelf, weight_kg DESC',
      order: ['shelf', 'weight_kg'],
      hint: 'ORDER BY [первый], [второй] DESC — DESC относится только к столбцу перед ним.',
      ok: 'Сначала по полке, внутри полки — по весу. Номера на чемоданах — порядок ответа.',
    },
    // ═══════════════════════════════ часть 3 · условия посложнее
    {
      key: 'paren',
      title: 'Скобки решают',
      lab: 'ч. 3 · составное условие',
      text: `Приглашение в бизнес-зал: пассажирам из города ${D.paren.c} с золотой или серебряной картой. Три сравнения, AND и OR — и важно, где стоят скобки.`,
      q: `Кто из города ${D.paren.c} с золотой или серебряной картой?`,
      goals: [`city = '${D.paren.c}'`, 'loyalty — золото или серебро', 'Столбцы: full_name, loyalty'],
      ask: `SELECT full_name, loyalty FROM passenger WHERE city = ${lit(D.paren.c)} AND (loyalty = 'золото' OR loyalty = 'серебро')`,
      pred: {
        q: `Если скобки убрать: city = '${D.paren.c}' AND loyalty = 'золото' OR loyalty = 'серебро' — строк будет…`,
        choices: [
          {k: 'more', t: 'больше'},
          {k: 'same', t: 'столько же'},
          {k: 'less', t: 'меньше'},
        ],
        answer: 'more',
      },
      hint: 'AND выполняется раньше OR. Без скобок в ответ попадут все серебряные карты из любого города.',
      ok: `Со скобками — ${D.paren.ok}, без скобок было бы ${D.paren.loose}: AND связывает сильнее OR.`,
    },
    {
      key: 'null',
      title: 'Год не указан',
      lab: 'ч. 3 · пустое значение',
      text: 'У кого в анкете не указан год рождения? Фамилия и место.',
      q: 'У кого не заполнен год рождения?',
      goals: ['birth_year не заполнен', 'Столбцы: full_name, seat'],
      ask: 'SELECT full_name, seat FROM passenger WHERE birth_year IS NULL',
      pred: {
        q: 'Что вернёт условие WHERE birth_year = NULL?',
        choices: [
          {k: 'rows', t: 'тех, у кого год не указан'},
          {k: 'none', t: 'ни одной строки'},
          {k: 'err', t: 'ошибку'},
        ],
        answer: 'none',
      },
      hint: 'Пустое значение не равно ничему — даже самому себе. Проверяется только так: IS NULL.',
      ok: 'IS NULL — единственный способ найти пустое значение.',
    },
    {
      key: 'distinct',
      title: 'Откуда мы',
      lab: 'ч. 3 · различные значения',
      text: 'Для статистики: из каких городов пассажиры этого рейса? Каждый город — один раз.',
      q: 'Из каких городов пассажиры?',
      goals: ['Столбец: city', 'Без повторов'],
      ask: 'SELECT DISTINCT city FROM passenger',
      hint: 'SELECT DISTINCT [столбец] FROM …',
      ok: 'DISTINCT убрал повторы — каждый город один раз.',
    },
    {
      key: 'top',
      title: 'Пять самых тяжёлых',
      lab: 'ч. 3 · первые строки по убыванию',
      text: 'Для центровки самолёта нужны пять самых тяжёлых чемоданов: бирка и вес, от тяжёлого к лёгкому.',
      q: 'Какие пять чемоданов самые тяжёлые?',
      goals: ['Столбцы: tag, weight_kg', 'По убыванию веса', 'Только пять'],
      ask: 'SELECT tag, weight_kg FROM baggage ORDER BY weight_kg DESC LIMIT 5',
      order: ['weight_kg'],
      hint: 'ORDER BY … DESC LIMIT 5',
      ok: 'Упорядочили — и отрезали первые пять.',
    },
    // ═══════════════════════════════ часть 4 · ответ заказчику
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Вопрос заказчика',
      lab: 'сложный · контрольный · без подсказок',
      text: `Служба питания загружает тележки. Ей нужно знать, кому в рядах с 1 по ${D.upto} заказано питание «${D.meals[0]}» или «${D.meals[1]}»: место, фамилия и питание — по номеру места.`,
      q: `Кому в рядах 1–${D.upto} нужно «${D.meals[0]}» или «${D.meals[1]}»?`,
      goals: [`Ряды с 1 по ${D.upto}`, `meal — «${D.meals[0]}» или «${D.meals[1]}»`, 'Столбцы: seat, full_name, meal; по месту'],
      ask: `SELECT seat, full_name, meal FROM passenger WHERE meal IN (${D.meals.map(lit).join(', ')}) AND (${rowsLike}) ORDER BY seat`,
      order: ['seat'],
      ok: 'Ответ заказчику готов. Сверьте число строк с тем, сколько ожидали.',
    },
  ];
}
