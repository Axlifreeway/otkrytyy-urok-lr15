// ЛР-16 · «Зал выдачи багажа» — соединение таблиц в запросе.
// Тот же салон: чемодан связан с владельцем, владелец — с программой лояльности и рейсом.
// В базе не закреплены две связи (passenger → loyalty с «висячей» программой «бронза», passenger → flight);
// в справочнике программ есть «платина», которой нет ни у кого, — для левого соединения.
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
export const TIERS = ['платина', 'золото', 'серебро', 'базовая'];
export const DISCOUNT = {платина: 20, золото: 15, серебро: 10, базовая: 5};
export const seatRow = s => parseInt(s, 10);
export const shelfOf = row => Math.ceil(row / 2);
const cnt = (a, f) => a.filter(f).length;

export function makeData(seed) {
  const r = rng(seed * 7919 + 1616);
  const seats = [];
  for (let row = 1; row <= ROWS; row++) for (const L of LET) seats.push(row + L);
  const P = [];
  let id = 0;
  const kids = new Set(r.take([...seats.keys()], 6));
  seats.forEach((s, i) => {
    if (!kids.has(i) && r() < 0.26) return;
    id++;
    const kid = kids.has(i),
      female = r() < 0.5;
    const by = kid ? r.int(2012, 2020) : r() < 0.12 ? r.int(1946, 1959) : r.int(1962, 2005);
    P.push({
      id,
      flight_no: FLIGHT,
      seat: s,
      full_name: `${r.pick(SURN)}${female ? 'а' : ''} ${INI[r.int(0, 15)]}. ${INI[r.int(0, 15)]}.`,
      birth_year: by,
      city: r.pick(CITIES),
      loyalty: kid ? null : r.pick(['золото', 'серебро', 'серебро', 'базовая', 'базовая', 'базовая', null, null]),
      meal: kid ? 'детское' : 'стандарт',
      active: true,
      kid,
      female,
      old: by < 1960,
    });
  });
  // «бронза»: программу закрыли в прошлом году, а у двоих она осталась в анкете
  const bronze = r.take(
    P.filter(p => !p.kid),
    2,
  );
  bronze.forEach(p => {
    p.loyalty = 'бронза';
  });
  // багаж: у части пассажиров чемоданов нет
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
    const n = r() < 0.45 ? 1 : r() < 0.3 ? 2 : 0;
    for (let k = 0; k < n; k++) B.push({tag: tag(), passenger_id: p.id, shelf: shelfOf(seatRow(p.seat)), weight_kg: r.int(3, 30)});
  });
  // золотых карт — хотя бы две, и у их владельцев есть багаж: в «Приоритетной выдаче» больше одной строки
  const gold = P.filter(p => p.loyalty === 'золото');
  if (gold.length < 2)
    r.take(
      P.filter(p => !p.kid && !bronze.includes(p) && p.loyalty !== 'золото'),
      2 - gold.length,
    ).forEach(p => {
      p.loyalty = 'золото';
    });
  P.filter(p => p.loyalty === 'золото')
    .slice(0, 2)
    .forEach(p => {
      if (!B.some(b => b.passenger_id === p.id))
        B.push({tag: tag(), passenger_id: p.id, shelf: shelfOf(seatRow(p.seat)), weight_kg: r.int(8, 24)});
    });
  B.splice(0, B.length, ...r.take(B, B.length));
  const all = P.map(p => ({...p, loyalty: bronze.includes(p) ? 'базовая' : p.loyalty}));
  // город для соединения с отбором: у его пассажиров 2–7 чемоданов
  const bagsOfCity = c => cnt(B, b => all.find(p => p.id === b.passenger_id).city === c);
  const cities = [...new Set(all.map(p => p.city))];
  const okC = cities.filter(c => bagsOfCity(c) >= 2 && bagsOfCity(c) <= 7);
  const city = okC.length ? r.pick(okC) : cities.sort((a, b) => bagsOfCity(b) - bagsOfCity(a))[0];
  // ряд для «куда летит»
  const row = r.pick([...new Set(all.map(p => seatRow(p.seat)))].filter(n => cnt(all, p => seatRow(p.seat) === n) >= 3));
  // вес для контрольного вопроса: 3–8 чемоданов тяжелее
  const ws = B.map(b => b.weight_kg).sort((a, b) => b - a);
  const heavy = ws[Math.min(ws.length - 1, r.int(3, 7))] - 1;
  // в контрольном среди тяжёлых чемоданов есть чемодан владельца без карты — иначе обычный JOIN вместо LEFT пройдёт
  if (!B.some(b => b.weight_kg > heavy && !all.find(p => p.id === b.passenger_id).loyalty)) {
    const p = r.pick(all.filter(x => !x.loyalty));
    B.push({tag: tag(), passenger_id: p.id, shelf: shelfOf(seatRow(p.seat)), weight_kg: Math.min(32, heavy + r.int(1, 3))});
  }
  const noBag = cnt(all, p => !B.some(b => b.passenger_id === p.id));
  return {seed, P, B, FLIGHT, bronze: bronze.map(p => p.id), city, row, heavy, noBag, nP: P.length, nB: B.length};
}

// закреплена только связь baggage → passenger; passenger → loyalty и passenger → flight — нет
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
  id         integer     GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_passenger PRIMARY KEY,
  flight_no  varchar(7)  NOT NULL,
  seat       varchar(3)  NOT NULL,
  full_name  varchar(60) NOT NULL,
  birth_year integer,
  city       varchar(40),
  loyalty    varchar(10),
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
    `INSERT INTO flight VALUES ('${FLIGHT}', 'Сочи'), ('ИИ-715', 'Казань'), ('ИИ-716', 'Анапа');
INSERT INTO loyalty VALUES ${TIERS.map(t => `('${t}', ${DISCOUNT[t]})`).join(', ')};
INSERT INTO passenger (id, flight_no, seat, full_name, birth_year, city, loyalty, meal) OVERRIDING SYSTEM VALUE VALUES ` +
    D.P.map(
      p =>
        `(${p.id}, ${lit(p.flight_no)}, ${lit(p.seat)}, ${lit(p.full_name)}, ${lit(p.birth_year)}, ${lit(p.city)}, ${lit(p.loyalty)}, ${lit(p.meal)})`,
    ).join(',\n') +
    `;\nALTER TABLE passenger ALTER COLUMN id RESTART WITH ${D.nP + 1};\nINSERT INTO baggage (tag, passenger_id, shelf, weight_kg) VALUES ` +
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
  return [
    // ═══════════════════════════════ часть 1 · связи базы
    {
      key: 'links',
      hard: true,
      title: 'Связи базы',
      lab: 'сложный · внешние ключи по самой базе',
      text: 'Соединять можно и без внешнего ключа, но тогда в столбце связи может лежать значение, которого нет в другой таблице, — и внутреннее соединение молча потеряет такую строку. Откройте «Структуру базы»: у passenger не закреплены две связи — с программой лояльности (loyalty.tier) и с рейсом (flight.flight_no). Объявите оба внешних ключа. Программу «бронза» закрыли в прошлом году, её участникам выдали базовую карту — исправьте анкеты по смыслу, когда СУБД откажет.',
      goals: [
        'fk_passenger_loyalty: passenger.loyalty → loyalty.tier',
        'fk_passenger_flight: passenger.flight_no → flight.flight_no',
        '«Бронза» исправлена на «базовая»',
      ],
      check: 'schema',
      allow: ALL,
      tables: ['passenger'],
      need: [
        {t: 'passenger', type: 'f', cols: 'loyalty', ref: 'loyalty', label: 'внешний ключ passenger.loyalty → loyalty'},
        {t: 'passenger', type: 'f', cols: 'flight_no', ref: 'flight', label: 'внешний ключ passenger.flight_no → flight'},
      ],
      ref: [
        "UPDATE passenger SET loyalty = 'базовая' WHERE loyalty = 'бронза'",
        'ALTER TABLE passenger ADD CONSTRAINT fk_passenger_loyalty FOREIGN KEY (loyalty) REFERENCES loyalty (tier) ON DELETE SET NULL',
        'ALTER TABLE passenger ADD CONSTRAINT fk_passenger_flight FOREIGN KEY (flight_no) REFERENCES flight (flight_no) ON DELETE RESTRICT',
      ],
      cmds: 'ALTER TABLE … ADD CONSTRAINT … FOREIGN KEY … — для каждой связи; при отказе — найти, исправить, повторить',
      hint: 'Отказ называет значение: Key (loyalty)=(бронза). Посмотрите, у кого оно: SELECT id, full_name, loyalty FROM passenger WHERE loyalty = …',
      ok: 'Связи закреплены: ссылок «в никуда» больше нет. Пустое значение (у кого карты нет) внешний ключ не запрещает — такие строки обычное соединение по-прежнему выбросит.',
    },
    // ═══════════════════════════════ часть 2 · две таблицы
    {
      key: 'owner',
      title: 'Чей чемодан',
      lab: 'ч. 2 · соединение двух таблиц',
      text: 'В зале выдачи на ленте чемоданы, на бирках — только номер владельца. Служба розыска просит: бирка, вес и фамилия владельца. Фамилии в baggage нет — она в passenger: соедините таблицы по ключу связи, с псевдонимами.',
      q: 'Чей каждый чемодан?',
      goals: ['Столбцы: tag, weight_kg (из baggage), full_name (из passenger)', 'Условие соединения — по ключу связи', 'Псевдонимы таблиц'],
      ask: 'SELECT b.tag, b.weight_kg, p.full_name FROM baggage b JOIN passenger p ON p.id = b.passenger_id',
      alias: true,
      hint: 'FROM baggage b JOIN passenger p ON … — какой столбец baggage хранит номер владельца? Дальше пишите b.tag, p.full_name.',
      ok: 'Каждый чемодан нашёл владельца — робот протянул связь от бирки к пассажиру.',
    },
    {
      key: 'dest',
      title: `Куда летит ряд ${D.row}`,
      lab: 'ч. 2 · соединение с отбором',
      text: `Бортпроводнику ряда ${D.row} нужно знать, кто куда летит: фамилия и город назначения. Город — в таблице рейсов flight.`,
      q: `Куда летят пассажиры ряда ${D.row}?`,
      goals: ['Столбцы: full_name (passenger), dest (flight)', `Только ряд ${D.row}`],
      minTables: 2,
      ask: `SELECT p.full_name, f.dest FROM passenger p JOIN flight f ON f.flight_no = p.flight_no WHERE p.seat LIKE '${D.row}%'`,
      alias: true,
      hint: 'Рейс пассажира записан в passenger, город назначения — в flight: соедините их по номеру рейса. Ряд — первая цифра места.',
      ok: 'Отбор в WHERE работает и после соединения.',
    },
    {
      key: 'city',
      title: `Багаж из города ${D.city}`,
      lab: 'ч. 2 · соединение и условие по второй таблице',
      text: `Служба досмотра проверяет багаж пассажиров из города ${D.city}: бирка, фамилия владельца и его место.`,
      q: `Чьи чемоданы из города ${D.city}?`,
      goals: ['Столбцы: tag, full_name, seat', `Владелец — из города ${D.city}`],
      ask: `SELECT b.tag, p.full_name, p.seat FROM baggage b JOIN passenger p ON p.id = b.passenger_id WHERE p.city = ${lit(D.city)}`,
      alias: true,
      hint: 'Город — в passenger, бирка — в baggage. Условие отбора — в WHERE, после соединения.',
      ok: 'Город есть только у пассажира — без соединения такой вопрос не задать.',
    },
    {
      key: 'disc',
      title: 'Скидки по картам',
      lab: 'ч. 2 · соединение со справочником и порядок',
      text: 'Кассе нужна таблица скидок: фамилия пассажира, его программа и скидка — от больших скидок к меньшим. Размер скидки — в справочнике loyalty.',
      q: 'Какая скидка у каждого владельца карты?',
      goals: ['Столбцы: full_name, tier, discount', 'По убыванию скидки'],
      ask: 'SELECT p.full_name, l.tier, l.discount FROM passenger p JOIN loyalty l ON l.tier = p.loyalty ORDER BY l.discount DESC',
      order: ['discount'],
      alias: true,
      hint: 'Справочник loyalty присоединяется по названию программы: какой столбец passenger его хранит? Порядок — ORDER BY … DESC.',
      ok: 'Пассажиры без карты в ответ не попали: у них loyalty пустой, пары в справочнике нет — внешний ключ этого не запрещает.',
    },
    {
      key: 'cross',
      title: 'Забыли условие',
      lab: 'ч. 2 · соединение без условия',
      text: `Стажёр соединил чемоданы с пассажирами и забыл условие. Повторите его ошибку один раз — чтобы увидеть результат: FROM baggage b, passenger p (или CROSS JOIN) без ON. Чемоданов ${D.nB}, пассажиров ${D.nP}.`,
      q: 'Что будет, если не указать условие соединения?',
      goals: ['Две таблицы, без условия соединения', 'Сравнить число строк с исходными таблицами'],
      check: 'cross',
      ref: ['SELECT b.tag, p.full_name FROM baggage b CROSS JOIN passenger p'],
      pred: {
        q: `Чемоданов ${D.nB}, пассажиров ${D.nP}. Сколько строк вернёт соединение без условия?`,
        choices: [
          {k: 'b', t: `${D.nB} — по числу чемоданов`},
          {k: 'err', t: 'ошибку синтаксиса'},
          {k: 'mul', t: `${D.nB * D.nP} — каждый с каждым`},
        ],
        answer: 'mul',
      },
      hint: 'FROM baggage b CROSS JOIN passenger p — или через запятую, без ON и без условия в WHERE.',
      ok: `Каждый чемодан «соединился» с каждым пассажиром: ${D.nB} × ${D.nP} = ${D.nB * D.nP}. Ошибки нет — и именно этим опасно.`,
    },
    // ═══════════════════════════════ часть 3 · три таблицы
    {
      key: 'three',
      hard: true,
      title: 'Приоритетная выдача',
      lab: 'сложный · три таблицы',
      text: 'Чемоданы владельцев золотых и платиновых карт выдают первыми. Нужны бирка, фамилия владельца и его программа. Путь соединения: baggage → passenger → loyalty — каждая таблица присоединяется своим условием.',
      q: 'Чьи чемоданы выдать первыми?',
      goals: ['Столбцы: tag, full_name, tier', 'Только золото и платина', 'Три таблицы, два условия соединения'],
      minTables: 3,
      ask: "SELECT b.tag, p.full_name, l.tier FROM baggage b JOIN passenger p ON p.id = b.passenger_id JOIN loyalty l ON l.tier = p.loyalty WHERE l.tier IN ('золото', 'платина')",
      alias: true,
      hint: 'Сначала baggage с passenger, затем к ним loyalty — второй JOIN со своим ON. Отбор программ — в WHERE после всех соединений.',
      ok: 'Путь собран: чемодан → владелец → его программа.',
    },
    // ═══════════════════════════════ часть 4 · строки без пары
    {
      key: 'empty',
      hard: true,
      title: 'Пустая табличка',
      lab: 'сложный · левое соединение: «ни разу не…»',
      text: 'Отдел маркетинга спрашивает: какие программы лояльности есть в справочнике, но ни у одного пассажира этого рейса их нет? Обычное соединение такие строки выбросит — нужно левое и условие IS NULL.',
      q: 'Какие программы ни разу не использованы?',
      goals: ['Столбец: tier', 'LEFT JOIN и IS NULL по столбцу правой таблицы'],
      minTables: 2,
      ask: 'SELECT l.tier FROM loyalty l LEFT JOIN passenger p ON p.loyalty = l.tier WHERE p.id IS NULL',
      alias: true,
      pred: {
        q: 'Тот же запрос, но с обычным JOIN вместо LEFT JOIN, вернёт…',
        choices: [
          {k: 'same', t: 'те же строки'},
          {k: 'all', t: 'все программы'},
          {k: 'none', t: 'ни одной строки'},
        ],
        answer: 'none',
      },
      hint: 'Слева — справочник loyalty, справа — passenger: LEFT JOIN оставит все программы. У программы без пары столбцы passenger пустые — отберите такие строки через IS NULL.',
      ok: 'У «платины» пары нет: левое соединение оставило её с пустыми значениями, а IS NULL их и отобрал.',
    },
    {
      key: 'nobag',
      title: 'Налегке',
      lab: 'ч. 4 · кто без багажа',
      text: 'Кто летит без багажа? Фамилия и место. В baggage таких пассажиров нет вовсе — значит, снова левое соединение.',
      q: 'У кого из пассажиров нет ни одного чемодана?',
      goals: ['Столбцы: full_name, seat', 'Пассажиры без единого чемодана'],
      ask: 'SELECT p.full_name, p.seat FROM passenger p LEFT JOIN baggage b ON b.passenger_id = p.id WHERE b.tag IS NULL',
      alias: true,
      pred: {
        q: 'Откуда в левом соединении берутся пустые значения в столбцах baggage?',
        choices: [
          {k: 'db', t: 'они записаны в таблице baggage'},
          {k: 'join', t: 'СУБД подставляет их, когда пары нет'},
          {k: 'err', t: 'это ошибка в данных'},
        ],
        answer: 'join',
      },
      hint: 'Теперь слева passenger, справа baggage. У пассажира без чемодана столбцы baggage пустые — проверьте любой из них, который у настоящих чемоданов всегда заполнен.',
      ok: `Без багажа — ${D.noBag}. Пустые значения подставила СУБД: пары для них в baggage не нашлось.`,
    },
    // ═══════════════════════════════ контрольный
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Перевес со скидкой',
      lab: 'сложный · контрольный · без подсказок',
      text: `За чемодан тяжелее ${D.heavy} кг берут доплату, а владельцам карт её уменьшают на их скидку. Касса просит: бирка, вес, фамилия владельца и его скидка — от тяжёлых к лёгким. Владельцев без карты тоже показать: у них скидка пустая.`,
      q: `Кому и с какой скидкой выставить доплату за перевес больше ${D.heavy} кг?`,
      goals: [
        `Чемоданы тяжелее ${D.heavy} кг`,
        'Столбцы: tag, weight_kg, full_name, discount',
        'Без карты — тоже в ответе',
        'По убыванию веса',
      ],
      minTables: 3,
      ask: `SELECT b.tag, b.weight_kg, p.full_name, l.discount FROM baggage b JOIN passenger p ON p.id = b.passenger_id LEFT JOIN loyalty l ON l.tier = p.loyalty WHERE b.weight_kg > ${D.heavy} ORDER BY b.weight_kg DESC`,
      order: ['weight_kg'],
      alias: true,
      ok: 'Касса получила ответ. Три таблицы, внутреннее и левое соединение в одном запросе.',
    },
  ];
}
