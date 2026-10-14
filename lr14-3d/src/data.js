// ЛР-14 · данные рейса по номеру в журнале, схема базы и уровни.
import {rng} from '../../common/rng.js';
export const ROWS = 8,
  LET = ['A', 'B', 'C', 'D', 'E', 'F'];
export const FLIGHT = 'ИИ-714';
export {rng};
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
export const seatRow = s => parseInt(s, 10);
export const seatL = s => s.slice(-1);
export const shelfOf = row => Math.ceil(row / 2);

export function makeData(seed) {
  const r = rng(seed * 7919 + 1414);
  const seats = [];
  for (let row = 1; row <= ROWS; row++) for (const L of LET) seats.push(row + L);
  const kidIdx = new Set(r.take([...seats.keys()], 8));
  const kids = [...kidIdx];
  const nullKid = kids[7];
  let nullAdult;
  do nullAdult = r.int(0, seats.length - 1);
  while (kidIdx.has(nullAdult));
  const P = [];
  let id = 1;
  seats.forEach((s, i) => {
    const kid = kidIdx.has(i);
    if (!kid && i !== nullAdult && r() < 0.2) return;
    const by =
      i === nullKid || i === nullAdult
        ? null
        : kid
          ? i === kids[0]
            ? 2012
            : r.int(2013, 2020)
          : r() < 0.15
            ? r.int(1944, 1958)
            : r.int(1965, 2004);
    const female = r() < 0.5;
    P.push({
      id: id++,
      flight_no: FLIGHT,
      seat: s,
      full_name: `${r.pick(SURN)}${female ? 'а' : ''} ${'АБВГДЕИКЛМНОПРСТ'[r.int(0, 15)]}. ${'АБВГДЕИКЛМНОПРСТ'[r.int(0, 15)]}.`,
      birth_year: by,
      city: r.pick(CITIES),
      loyalty: kid ? null : r.pick(['золото', 'серебро', 'серебро', 'базовая', 'базовая', null, null]),
      meal: null,
      active: true,
      kid,
      female,
      old: by != null && by < 1960,
    });
  });
  const adult = p => !p.kid && p.birth_year !== null;
  // уровень «К окну»: взрослый на среднем месте или у прохода, свободное окно в салоне
  const occ = new Set(P.map(p => p.seat));
  let freeWin = seats.filter(s => /[AF]$/.test(s) && !occ.has(s));
  if (!freeWin.length) {
    const v = P.find(p => /[AF]$/.test(p.seat) && adult(p));
    P.splice(P.indexOf(v), 1);
    occ.delete(v.seat);
    freeWin = [v.seat];
  }
  const win = r.pick(freeWin);
  let pool = P.filter(p => adult(p) && /[BCDE]$/.test(p.seat) && Math.abs(seatRow(p.seat) - seatRow(win)) <= 3);
  if (!pool.length) pool = P.filter(p => adult(p) && /[BCDE]$/.test(p.seat));
  const mover = r.pick(pool);
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
    const n = r() < 0.5 ? 1 : r() < 0.25 ? 2 : 0;
    for (let k = 0; k < n; k++) B.push({tag: tag(), passenger_id: p.id, shelf: shelfOf(seatRow(p.seat)), weight_kg: r.int(4, 26)});
  });
  const bagsOf = p => B.filter(b => b.passenger_id === p.id);
  const shelves = r.take([1, 2, 3, 4], 4);
  const S1 = shelves[0],
    S2 = shelves[1],
    S3 = shelves[2];
  const need = (s, n) => {
    let k = 0;
    while (B.filter(b => b.shelf === s).length < n && k++ < 50) {
      const p = r.pick(P.filter(q => shelfOf(seatRow(q.seat)) === s));
      B.push({tag: tag(), passenger_id: p.id, shelf: s, weight_kg: r.int(4, 22)});
    }
  };
  need(S1, 4);
  need(S2, 5);
  need(S3, 3);
  // неявка — без багажа; снятый с рейса — ровно с двумя чемоданами
  const noShow = r.pick(P.filter(p => adult(p) && p !== mover && !bagsOf(p).length));
  const Q = r.pick(P.filter(p => adult(p) && p !== mover && p !== noShow && shelfOf(seatRow(p.seat)) !== S2));
  while (bagsOf(Q).length < 2) B.push({tag: tag(), passenger_id: Q.id, shelf: shelfOf(seatRow(Q.seat)), weight_kg: r.int(6, 20)});
  while (bagsOf(Q).length > 2) B.splice(B.indexOf(bagsOf(Q)[2]), 1);
  // порядок хранения: по пассажирам; на полке S2 тяжёлый чемодан — последним
  B.sort((a, b) => a.passenger_id - b.passenger_id || a.tag.localeCompare(b.tag));
  const s2 = B.filter(b => b.shelf === S2);
  const heavy = s2[s2.length - 1];
  heavy.weight_kg = 31;
  s2.slice(0, -1).forEach(b => {
    if (b.weight_kg > 26) b.weight_kg = 26;
  });
  // возврат билетов: город с 3–5 пассажирами (не задетыми раньше)
  const live = P.filter(p => p !== noShow && p !== Q);
  const cnt = {};
  live.forEach(p => {
    cnt[p.city] = (cnt[p.city] || 0) + 1;
  });
  const cs = Object.keys(cnt).filter(c => cnt[c] >= 3 && cnt[c] <= 6);
  const city = cs.length ? r.pick(cs) : Object.keys(cnt).sort((a, b) => Math.abs(cnt[a] - 4) - Math.abs(cnt[b] - 4))[0];
  // финал
  const act = live.filter(p => p.city !== city && p !== mover);
  const cA = r.pick(act.filter(p => adult(p)));
  const cSeat = mover.seat; // место, освободившееся на уровне «К окну»
  const cC = r.pick(act.filter(p => p !== cA && B.some(b => b.passenger_id === p.id)));
  if (!P.some(p => p.loyalty === 'серебро'))
    P.filter(adult)
      .slice(0, 4)
      .forEach(p => {
        p.loyalty = 'серебро';
      });
  // финал: у кого-то из владельцев чемоданов на полке S3 — золотая карта
  const s3own = [...new Set(B.filter(b => b.shelf === S3).map(b => b.passenger_id))]
    .map(id => P.find(p => p.id === id))
    .filter(p => p && p !== noShow && p !== Q && p !== cC && p.city !== city);
  const gold = s3own.length ? r.pick(s3own) : null;
  if (gold) gold.loyalty = 'золото';
  return {seed, P, B, mover, win, S1, S2, S3, heavy, noShow, Q, city, cA, cSeat, cC, gold};
}

export const SCHEMA = `
CREATE TABLE flight (
  flight_no varchar(7)  PRIMARY KEY,
  dest      varchar(40) NOT NULL
);
CREATE TABLE loyalty (
  tier     varchar(10) PRIMARY KEY,
  discount integer     NOT NULL
);
CREATE TABLE passenger (
  id         integer     PRIMARY KEY,
  flight_no  varchar(7)  NOT NULL CONSTRAINT fk_passenger_flight
             REFERENCES flight (flight_no) ON DELETE RESTRICT,
  seat       varchar(3)  NOT NULL,
  full_name  varchar(60) NOT NULL,
  birth_year integer,
  city       varchar(40),
  loyalty    varchar(10) CONSTRAINT fk_passenger_loyalty
             REFERENCES loyalty (tier) ON DELETE SET NULL,
  meal       varchar(20) CONSTRAINT ck_passenger_meal
             CHECK (meal IN ('стандарт', 'детское', 'вегетарианское', 'ресторан')),
  active     boolean     NOT NULL DEFAULT true,
  CONSTRAINT uq_passenger_seat UNIQUE (flight_no, seat)
);
CREATE TABLE baggage (
  tag          varchar(6) PRIMARY KEY,
  passenger_id integer    NOT NULL CONSTRAINT fk_baggage_passenger
               REFERENCES passenger (id) ON DELETE CASCADE,
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
INSERT INTO passenger (id, flight_no, seat, full_name, birth_year, city, loyalty, meal, active) VALUES ` +
    D.P.map(
      p =>
        `(${p.id}, ${lit(p.flight_no)}, ${lit(p.seat)}, ${lit(p.full_name)}, ${lit(p.birth_year)}, ${lit(p.city)}, ${lit(p.loyalty)}, NULL, true)`,
    ).join(',\n') +
    ';\n' +
    'INSERT INTO baggage (tag, passenger_id, shelf, weight_kg) VALUES ' +
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

const FK = [
  {k: 'only', t: 'Удалится только эта строка'},
  {k: 'cascade', t: 'Удалится вместе со всеми, кто на неё ссылается'},
  {k: 'setnull', t: 'Удалится, а у ссылавшихся строк ссылка станет NULL'},
  {k: 'restrict', t: 'Отказ: на эту строку ссылаются'},
];

// ═══════════════════════════════════════════════════════════ уровни ══
export function levels(D) {
  const pn = p => `${p.full_name} (id ${p.id}, место ${p.seat})`;
  return [
    {
      key: 'kids',
      title: 'Детское питание',
      lab: 'ч. 1 · изменение нескольких строк по условию',
      text: 'Кейтеринг привёз детские подносы. Назначьте их одной командой.',
      goals: ["Всем, кто родился в 2012 году и позже, — meal = 'детское'", 'Взрослых не трогать'],
      tables: ['passenger'],
      ref: ["UPDATE passenger SET meal = 'детское' WHERE birth_year >= 2012"],
      hint: 'Менять — столбец meal, отбирать — по году рождения. Какой знак сравнения отберёт «2012 и позже»? Текст значения — в одинарных кавычках.',
      ok: 'Все дети с подносами. Ребёнок без года рождения получил «?»: сравнение с NULL не даёт «да».',
    },
    {
      key: 'rest',
      title: 'Остальным — стандарт',
      lab: 'ч. 1 · заполнение пустого столбца',
      text: 'Теперь всем, у кого питание ещё не назначено, — стандартное. Включая ребёнка, у которого не указан год рождения.',
      goals: ["Где meal пусто — meal = 'стандарт'", 'Детские подносы не трогать'],
      tables: ['passenger'],
      ref: ["UPDATE passenger SET meal = 'стандарт' WHERE meal IS NULL"],
      hint: 'Пустое значение ищется не через «= NULL», а через IS NULL. Попробуйте оба и посмотрите на метки робота.',
      ok: 'Готово. «meal = NULL» дало бы «не знаю» на каждой строке и 0 изменений; IS NULL отвечает «да» или «нет».',
    },
    {
      key: 'window',
      title: 'К окну',
      lab: 'ч. 1 · замена значения в одной строке',
      text: `Пассажир ${pn(D.mover)} просит пересадить его к окну — место ${D.win} свободно.`,
      goals: [`Пассажиру id ${D.mover.id} — место ${D.win}`, 'Остальных не трогать'],
      tables: ['passenger'],
      ref: [`UPDATE passenger SET seat = '${D.win}' WHERE id = ${D.mover.id}`],
      say: [{id: D.mover.id, t: `Можно к окну? ${D.win} свободно!`}],
      ghost: D.win,
      hint: 'Одну строку надёжнее всего найти по первичному ключу: WHERE id = …. Робот тогда идёт сразу к ней — по индексу, не перебирая всех.',
      ok: 'Пересел. Условие по первичному ключу — и СУБД не обходит таблицу, а сразу находит строку.',
    },
    {
      key: 'scale',
      title: 'Весы врали',
      lab: 'ч. 1 · новое значение от текущего',
      text: `Весы у полки ${D.S1} занижали вес на 2 кг. Исправьте вес всех чемоданов этой полки — пусть СУБД посчитает сама.`,
      goals: [`Чемоданы полки ${D.S1}: weight_kg на 2 больше`, 'Остальные полки не трогать'],
      tables: ['baggage'],
      ref: [`UPDATE baggage SET weight_kg = weight_kg + 2 WHERE shelf = ${D.S1}`],
      hint: 'SET weight_kg = weight_kg + 2 — справа текущее значение каждой строки. Таблица — baggage.',
      ok: 'Каждый чемодан получил +2 к своему весу.',
    },
    {
      key: 'atomic',
      title: 'Не пролезло',
      lab: 'ч. 3 · команда целиком или никак',
      text: `Полка ${D.S2}: всем чемоданам +3 кг. Но предел — 32 кг, а там есть тяжёлый. Сначала попробуйте добавить всем и посмотрите, что сделает СУБД. Потом решите задачу.`,
      goals: [`Полка ${D.S2}: +3 кг всем, кто не станет тяжелее 32 кг`, 'Тяжёлый чемодан не трогать'],
      tables: ['baggage'],
      ref: [`UPDATE baggage SET weight_kg = weight_kg + 3 WHERE shelf = ${D.S2} AND weight_kg <= 29`],
      pred: {
        q: `Команда «всем на полке ${D.S2} +3 кг». Последний из них уже весит 31 кг. Что будет?`,
        choices: [
          {k: 'all', t: 'Изменятся все'},
          {k: 'some', t: 'Изменятся все, кроме тяжёлого'},
          {k: 'none', t: 'Не изменится ни один'},
        ],
        answer: 'none',
      },
      hint: 'Добавьте второе условие через AND: только те, у кого weight_kg <= 29.',
      ok: 'Если бы хоть одна строка нарушила правило, СУБД отменила бы всю команду — вы это видели.',
    },
    {
      key: 'noshow',
      title: 'Неявка',
      lab: 'ч. 2 · удаление строки',
      text: `Посадка окончена. Пассажир ${pn(D.noShow)} не пришёл — кресло пустое, а в базе он есть. Багажа у него нет. Удалите только его.`,
      goals: [`Удалить пассажира id ${D.noShow.id}`, 'Больше никого'],
      tables: ['passenger', 'baggage'],
      ref: [`DELETE FROM passenger WHERE id = ${D.noShow.id}`],
      absent: D.noShow.id,
      hint: 'Удаляется одна строка. Как найти ровно её, не задев соседей? Подумайте о первичном ключе.',
      ok: 'Строка удалена, место свободно.',
    },
    {
      key: 'cascade',
      title: 'Снят с рейса',
      lab: 'ч. 2 · удаление строки, на которую ссылаются',
      text: `Пассажир ${pn(D.Q)} снят с рейса, его багаж — с борта. Удалите только пассажира — и посмотрите на полку.`,
      goals: [`Удалить пассажира id ${D.Q.id}`, 'Его чемоданы — тоже (но не вручную)'],
      tables: ['passenger', 'baggage'],
      ref: [`DELETE FROM passenger WHERE id = ${D.Q.id}`],
      say: [{id: D.Q.id, t: 'Я никуда не пойду!'}],
      pred: {q: 'Вы удаляете строку пассажира. Что СУБД сделает с его чемоданами?', choices: FK, answer: 'cascade'},
      hint: 'Удаляйте только пассажира. Что сделает с его чемоданами внешний ключ baggage.passenger_id? Загляните в правило ON DELETE.',
      noManual: 'baggage',
      ok: 'Чемоданы улетели сами: ON DELETE CASCADE.',
    },
    {
      key: 'setnull',
      title: 'Программа закрыта',
      lab: 'ч. 2 · удаление строки справочника',
      text: 'Программа лояльности «серебро» закрывается. Удалите её из справочника loyalty. Пассажиров не трогайте — смотрите на серебряные значки.',
      goals: ["Удалить строку 'серебро' из loyalty", 'Пассажиров не удалять'],
      tables: ['loyalty', 'passenger'],
      ref: ["DELETE FROM loyalty WHERE tier = 'серебро'"],
      pred: {q: 'Что станет с пассажирами, у которых серебряная карта?', choices: FK, answer: 'setnull'},
      hint: 'Удаляется строка справочника loyalty, а не пассажиры. Какой у справочника первичный ключ?',
      ok: 'Пассажиры на месте, значков нет: ON DELETE SET NULL.',
    },
    {
      key: 'restrict',
      title: 'Неудаляемый рейс',
      lab: 'ч. 2 · правило RESTRICT',
      text: `Стажёр хочет «почистить» табло — удалить рейс ${FLIGHT}. На борту пассажиры. Попробуйте — и прочитайте ответ СУБД.`,
      goals: [`Выполнить DELETE рейса ${FLIGHT}`, 'Получить отказ СУБД'],
      check: 'custom',
      verify: res =>
        (res.err && res.err.code === '23001') || (res.err && res.err.code === '23503')
          ? true
          : 'Нужен отказ СУБД при DELETE FROM flight … — на рейс ссылаются пассажиры.',
      pred: {q: `На рейс ${FLIGHT} ссылаются пассажиры. Что сделает СУБД при удалении рейса?`, choices: FK, answer: 'restrict'},
      hint: 'Попробуйте удалить строку нашего рейса из flight и внимательно прочитайте, что ответит СУБД.',
      ok: 'Отказ — и правильно: ON DELETE RESTRICT защищает пассажиров.',
    },
    {
      key: 'soft',
      hard: true,
      title: 'Возврат билетов',
      lab: 'сложный · пометка вместо удаления + подзапрос',
      text: `Пассажиры из города ${D.city} сдали билеты. Историю продаж терять нельзя: самих пассажиров не удаляйте, а пометьте недействующими. А вот их багаж с борта нужно снять — удалить. В baggage нет города: чемоданы ищутся через их владельцев.`,
      goals: [
        `Всем из города ${D.city}: active = false`,
        'Их чемоданы — удалить из baggage',
        'Пассажиров не удалять, чужой багаж не трогать',
      ],
      tables: ['passenger', 'baggage'],
      ref: [
        `UPDATE passenger SET active = false WHERE city = '${D.city}'`,
        `DELETE FROM baggage WHERE passenger_id IN (SELECT id FROM passenger WHERE city = '${D.city}')`,
      ],
      hint: 'Пометка — это UPDATE столбца active. В baggage города нет: нужен список id пассажиров из этого города — его вернёт SELECT в скобках после IN.',
      ok: 'Пассажиры стали «призраками», их чемоданы сняты, история продаж цела.',
    },
    {
      key: 'hunt',
      hard: true,
      title: 'Охота на ограничения',
      lab: 'сложный · ограничения при изменении',
      check: 'custom',
      slotBy: 'constraint',
      slots: ['uq_passenger_seat', 'ck_baggage_weight', 'ck_passenger_meal', 'fk_passenger_loyalty', 'fk_baggage_passenger'],
      slotNames: {
        uq_passenger_seat: 'uq_passenger_seat',
        ck_baggage_weight: 'ck_baggage_weight',
        ck_passenger_meal: 'ck_passenger_meal',
        fk_passenger_loyalty: 'fk_passenger_loyalty',
        fk_baggage_passenger: 'fk_baggage_passenger',
      },
      text: 'Инспектор проверяет защиту базы. Добейтесь, чтобы СУБД отклонила изменение (UPDATE) именно по каждому из пяти правил — имя правила должно совпасть. Каждое — отдельной командой.',
      goals: ['uq_passenger_seat', 'ck_baggage_weight', 'ck_passenger_meal', 'fk_passenger_loyalty', 'fk_baggage_passenger'],
      hint: 'Подумайте, какой столбец проверяет каждое правило: место, вес, питание, программа лояльности, владелец чемодана.',
      ok: 'Все пять правил сработали. База защищена ограничениями.',
    },
    {
      key: 'final',
      hard: true,
      title: 'Последний рейс',
      lab: 'сложный · контрольный · без подсказок',
      final: true,
      text: 'Три распоряжения перед вылетом. Условия придётся собрать самим.',
      goals: [
        "Всем, кто сидит в рядах 7 и 8: meal = 'ресторан'",
        `Полка ${D.S3}: +1 кг каждому чемодану, владелец которого — с золотой картой`,
        `${pn(D.cC)} снят с рейса вместе с багажом`,
      ],
      tables: ['passenger', 'baggage'],
      ref: [
        `UPDATE passenger SET meal = 'ресторан' WHERE seat LIKE '7%' OR seat LIKE '8%'`,
        `UPDATE baggage SET weight_kg = weight_kg + 1 WHERE shelf = ${D.S3} AND passenger_id IN (SELECT id FROM passenger WHERE loyalty = 'золото')`,
        `DELETE FROM passenger WHERE id = ${D.cC.id}`,
      ],
      ok: 'Борт закрыт. Взлетаем!',
    },
  ];
}
