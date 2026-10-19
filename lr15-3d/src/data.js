// ЛР-15 · «Посадка по запросу» — выборка данных: SELECT, WHERE, ORDER BY.
// Тот же рейс, что в ЛР-14: база готова, студент только задаёт вопросы.
import {rng} from '../../common/rng.js';
export {rng};
export const ROWS = 8,
  LET = ['A', 'B', 'C', 'D', 'E', 'F'];
export const FLIGHT = 'ИИ-714';
export const YEAR = 2026; // год для вычисления возраста
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
  // питание не выбрано хотя бы у двоих взрослых — для уровня с ловушкой NULL
  const noMeal = adults.filter(p => p.meal === null).length;
  if (noMeal < 2)
    r.take(
      adults.filter(p => p.meal !== null),
      2 - noMeal,
    ).forEach(p => {
      p.meal = null;
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
  // шесть самых тяжёлых — с разным весом (32, 30, 28, 25, 23, 21), остальные не тяжелее 20:
  // иначе на границе «пяти самых тяжёлых» бывает ничья и ответ неоднозначен
  const top6 = B.slice()
    .sort((a, b) => b.weight_kg - a.weight_kg)
    .slice(0, 6);
  top6.forEach((b, i) => {
    b.weight_kg = 32 - i * 2 - (i > 2 ? 1 : 0);
  });
  B.forEach(b => {
    if (!top6.includes(b)) b.weight_kg = Math.min(b.weight_kg, 20);
  });
  B.splice(0, B.length, ...r.take(B, B.length));
  const all = P;
  // порог веса — вес одного из чемоданов: «тяжелее» (>) и «не легче» (>=) дают разный ответ; тяжелее — от 3 до 5
  const heavy = r.pick([21, 23, 25]);
  // город для отбора по равенству: 3–6 пассажиров
  const byCity = c => cnt(all, p => p.city === c);
  const cities = [...new Set(all.map(p => p.city))];
  const okCity = cities.filter(c => byCity(c) >= 3 && byCity(c) <= 6);
  const city = okCity.length
    ? r.pick(okCity)
    : cities
        .slice()
        .sort((a, b) => byCity(a) - byCity(b))
        .find(c => byCity(c) >= 2) || cities[0];
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
  const ys0 = ys.filter(y => y >= 1965 && y <= 1993);
  for (let k = 0; k < 30; k++) {
    const a = ys0.length ? r.pick(ys0) : r.int(1965, 1995),
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
  return {seed, P, B, FLIGHT, heavy, city, two, y1, y2, letter, paren, meals, upto};
}

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
  tag          varchar(6) CONSTRAINT pk_baggage PRIMARY KEY,
  passenger_id integer    NOT NULL CONSTRAINT fk_baggage_passenger REFERENCES passenger (id) ON DELETE CASCADE,
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

export function levels(D) {
  const rowsLike = Array.from({length: D.upto}, (_, i) => `seat LIKE '${i + 1}%'`).join(' OR ');
  return [
    // ═══════════════════════════════ часть 1 · первые запросы
    {
      key: 'star',
      title: 'Весь рейс',
      lab: 'ч. 1 · все строки и все столбцы',
      text: 'Начнём с самого простого вопроса: кто вообще летит этим рейсом? Попросите у базы всю таблицу passenger — все строки, все столбцы. Робот обойдёт каждого пассажира.',
      q: 'Кто летит этим рейсом?',
      goals: ['Таблица passenger', 'Все столбцы — звёздочка *'],
      ask: 'SELECT * FROM passenger',
      star: true,
      hint: 'SELECT * FROM [таблица]; — звёздочка значит «все столбцы».',
      ok: 'Без WHERE в ответ попадают все строки. Звёздочка — все столбцы.',
    },
    {
      key: 'cols',
      title: 'Посадочная ведомость',
      lab: 'ч. 1 · перечень столбцов и вычисляемый столбец',
      text: `Бригадиру нужен список: фамилия, место и возраст пассажира в ${YEAR} году. Столбца с возрастом в таблице нет — его можно посчитать прямо в запросе из года рождения. Назовите этот столбец age.`,
      q: 'Кто где сидит и сколько ему лет?',
      goals: ['Столбцы: full_name, seat, age', `age — возраст в ${YEAR} году`, 'Все пассажиры'],
      ask: `SELECT full_name, seat, ${YEAR} - birth_year AS age FROM passenger`,
      names: true,
      hint: `В списке столбцов можно считать: ${YEAR} - birth_year. Имя такому столбцу даёт AS: … AS age.`,
      ok: 'Значения столбца age не хранятся в базе — СУБД посчитала их для каждой строки. У кого год не указан, возраст тоже пустой.',
    },
    // ═══════════════════════════════ часть 2 · отбор строк
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
      key: 'cmp',
      title: 'Тяжёлый багаж',
      lab: 'ч. 2 · отбор по сравнению',
      text: `Грузчики просят заранее показать чемоданы тяжелее ${D.heavy} кг — их снимают вдвоём. Бирка и вес.`,
      q: `Какие чемоданы тяжелее ${D.heavy} кг?`,
      goals: [`weight_kg больше ${D.heavy}`, 'Столбцы: tag, weight_kg'],
      ask: `SELECT tag, weight_kg FROM baggage WHERE weight_kg > ${D.heavy}`,
      hint: 'WHERE [столбец] > [число] — число без кавычек. «Тяжелее» — строго больше: чемодан ровно на границе в ответ не входит.',
      ok: `Робот взвесил каждый чемодан — в ответе только те, что тяжелее ${D.heavy} кг.`,
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
      text: `Авиакомпания дарит сувениры землякам из двух городов — ${D.two[0]} и ${D.two[1]}. Кому их вручить: фамилия и город.`,
      q: `Кто из пассажиров из города ${D.two[0]} или ${D.two[1]}?`,
      goals: [`city — одно из: ${D.two.join(', ')}`, 'Столбцы: full_name, city'],
      ask: `SELECT full_name, city FROM passenger WHERE city IN (${D.two.map(lit).join(', ')})`,
      hint: "IN ('значение', 'значение') — короче, чем OR.",
      ok: 'IN — перечень вместо цепочки OR.',
    },
    {
      key: 'like',
      title: 'Места у окна',
      lab: 'ч. 2 · поиск по образцу',
      text: 'Стюард раздаёт пледы пассажирам у окна — это места A и F в любом ряду. Найдите их: фамилия и место. Номер ряда в месте бывает любым, важна только последняя буква.',
      q: 'Кто сидит у окна?',
      goals: ['Место заканчивается на A или на F', 'Столбцы: full_name, seat'],
      ask: "SELECT full_name, seat FROM passenger WHERE seat LIKE '%A' OR seat LIKE '%F'",
      hint: "Знак % может стоять и в начале образца: LIKE '%A' — «что угодно, а в конце A». Буквы мест — латинские.",
      ok: 'Знак % в начале образца — «заканчивается на». Два образца связаны через OR.',
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
      hard: true,
      title: 'Кого спросить о питании',
      lab: 'сложный · пустое значение в условии',
      text: 'Бортпроводник обходит салон с особым меню: ему нужны все, у кого питание не «стандарт», и те, у кого питание не выбрано вовсе — их нужно спросить. Фамилия, место и питание.',
      q: 'К кому подойти с меню?',
      goals: ['meal — не «стандарт»', 'И те, у кого meal не заполнен', 'Столбцы: full_name, seat, meal'],
      ask: "SELECT full_name, seat, meal FROM passenger WHERE meal <> 'стандарт' OR meal IS NULL",
      pred: {
        q: "У пассажира питание не выбрано (meal пуст). Условие meal <> 'стандарт' для него…",
        choices: [
          {k: 'yes', t: 'истинно — он попадёт в ответ'},
          {k: 'unk', t: 'неизвестно — в ответ он не попадёт'},
          {k: 'err', t: 'вызовет ошибку'},
        ],
        answer: 'unk',
      },
      hint: 'Любое сравнение с пустым значением даёт «неизвестно», и WHERE такую строку отбрасывает. Пустые добавьте отдельно: … OR meal IS NULL.',
      ok: 'Сравнение с NULL — «неизвестно», поэтому пустые значения нужно звать по имени: IS NULL.',
    },
    {
      key: 'distinct',
      title: 'Откуда летят дети',
      lab: 'ч. 3 · различные значения и порядок',
      text: 'Детской комнате аэропорта нужно знать, из каких городов летят дети — родившиеся в 2012 году и позже. Каждый город — один раз, по алфавиту.',
      q: 'Из каких городов летят дети?',
      goals: ['Столбец: city', 'Только родившиеся в 2012 году и позже', 'Без повторов, по алфавиту'],
      ask: 'SELECT DISTINCT city FROM passenger WHERE birth_year >= 2012 ORDER BY city',
      order: ['city'],
      hint: 'SELECT DISTINCT … WHERE … ORDER BY … — DISTINCT убирает повторы уже среди отобранных строк.',
      ok: 'WHERE отобрал детей, DISTINCT убрал повторы, ORDER BY расставил по алфавиту.',
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
      text: `Служба питания загружает тележки. Ей нужно знать, кому в рядах с 1 по ${D.upto} заказано питание «${D.meals[0]}» или «${D.meals[1]}»: место, фамилия и питание. Тележки грузят по видам питания — сначала по питанию, внутри — по номеру места.`,
      q: `Кому в рядах 1–${D.upto} нужно «${D.meals[0]}» или «${D.meals[1]}»?`,
      goals: [
        `Ряды с 1 по ${D.upto}`,
        `meal — «${D.meals[0]}» или «${D.meals[1]}»`,
        'Столбцы: seat, full_name, meal',
        'По питанию, внутри — по месту',
      ],
      ask: `SELECT seat, full_name, meal FROM passenger WHERE meal IN (${D.meals.map(lit).join(', ')}) AND (${rowsLike}) ORDER BY meal, seat`,
      order: ['meal', 'seat'],
      ok: 'Ответ заказчику готов. Сверьте число строк с тем, сколько ожидали.',
    },
  ];
}
