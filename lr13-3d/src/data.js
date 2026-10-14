// ЛР-13 · «Открытие рейса» — данные по номеру в журнале, схема и уровни.
export const ROWS = 6, LET = ['A', 'B', 'C', 'D', 'E', 'F'], BIZ = ['A', 'C', 'D', 'F'];
export function rng(seed) {
  let a = seed >>> 0;
  const f = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));
  f.pick = a => a[Math.floor(f() * a.length)];
  f.take = (a, n) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
  return f;
}
const SURN = ['Иванов', 'Петров', 'Смирнов', 'Кузнецов', 'Попов', 'Соколов', 'Лебедев', 'Козлов', 'Новиков', 'Морозов', 'Волков', 'Егоров', 'Павлов', 'Орлов', 'Макаров', 'Титов', 'Зуев', 'Фомин', 'Котов', 'Быков', 'Панов', 'Савин', 'Лукин', 'Рябов', 'Громов', 'Жуков', 'Ершов', 'Гусев', 'Ильин', 'Карпов'];
const CITIES = ['Тюмень', 'Тюмень', 'Тюмень', 'Москва', 'Сургут', 'Тобольск', 'Ишим', 'Омск', 'Ялуторовск'];
const DEST = ['Сочи', 'Казань', 'Москва', 'Калининград', 'Анапа', 'Новосибирск', 'Уфа', 'Минеральные Воды', 'Махачкала', 'Самара'];
const INI = 'АБВГДЕИКЛМНОПРСТ';
export const seatRow = s => parseInt(s, 10);
export const seatL = s => String(s).slice(-1);
export const shelfOf = row => Math.ceil(row / 2);
const hm = r => String(r.int(6, 22)).padStart(2, '0') + ':' + r.pick(['00', '10', '15', '20', '30', '40', '45', '50']);

export function makeData(seed) {
  const r = rng(seed * 7919 + 1313);
  const ids = new Set(), tags = new Set();
  const id = () => { let v; do v = r.int(101, 989); while (ids.has(v)); ids.add(v); return v; };
  const tag = () => { let t; do t = 'Б' + r.int(1000, 9999); while (tags.has(t)); tags.add(t); return t; };
  const dest = r.take(DEST, 3);
  const n0 = r.int(701, 789);
  const F0 = {flight_no: 'ИИ-' + n0, dest: dest[0], dep_time: hm(r), gate: 'A' + r.int(1, 9)};
  const F1 = {flight_no: 'ЮТ-' + r.int(101, 499), dest: dest[1], dep_time: hm(r), gate: 'B' + r.int(1, 9)};
  const F2 = {flight_no: 'ИИ-' + (n0 + r.int(3, 9)), dest: dest[2], dep_time: hm(r), gate: null};
  const FLIGHT = F0.flight_no;
  const person = (o = {}) => {
    const female = o.female ?? r() < .5;
    const sur = o.sur || r.pick(SURN);
    return {id: id(), flight_no: FLIGHT, seat_no: null, full_name: `${sur}${female ? 'а' : ''} ${INI[r.int(0, 15)]}. ${INI[r.int(0, 15)]}.`,
      birth_year: o.kid ? r.int(2015, 2020) : r.int(1958, 2003), city: r.pick(CITIES), meal: null, female, kid: !!o.kid};
  };
  // кресла: ряды 4–5 стоят с завода, кроме одного (на ремонте)
  const repair = '5' + r.pick(LET);
  const baseSeats = [];
  for (const row of [4, 5]) for (const L of LET) if (row + L !== repair) baseSeats.push(row + L);
  const bizSeats = [1, 2].flatMap(row => BIZ.map(L => row + L)), biz1 = BIZ.map(L => '1' + L), biz2 = BIZ.map(L => '2' + L);
  const row3 = LET.map(L => '3' + L), row6 = LET.map(L => '6' + L);
  // ур. 5: первый пассажир — бизнес
  const p1 = person(); p1.seat_no = r.pick(bizSeats);
  // ур. 6: семья в ряду 4
  const half = r() < .5 ? ['A', 'B', 'C'] : ['D', 'E', 'F'];
  const sur = r.pick(SURN);
  const fam = [person({sur, female: false}), person({sur, female: true}), person({sur, kid: true})];
  fam.forEach((p, i) => { p.seat_no = '4' + half[i]; });
  fam[2].meal = 'детское'; fam[2].birth_year = r.int(2015, 2020);
  // ур. 7: три чемодана, на бирке только место
  const bags = [
    {tag: tag(), owner: p1, weight_kg: r.int(8, 24)},
    {tag: tag(), owner: fam[0], weight_kg: 32},
    {tag: tag(), owner: fam[1], weight_kg: r.int(6, 20)},
  ].map(b => ({...b, passenger_id: b.owner.id}));
  // ур. 8: ряд 6 ещё без кресел, двое с билетами в него
  const l6 = r.take(LET, 2).sort();
  const row6need = l6.map(L => '6' + L);
  const pair = [person(), person()]; pair.forEach((p, i) => { p.seat_no = '6' + l6[i]; });
  // ур. 9: группа в ряд 3, одному продали занятое место
  const g3 = r.take(LET, 4);
  const group = [person(), person(), person(), person()];
  group.forEach((p, i) => { p.seat_no = '3' + g3[i]; });
  const wrong = group[1];
  const wrongSeat = r.pick(fam.slice(0, 2)).seat_no;        // занято семьёй
  // финал: кресло с ремонта, двое опоздавших
  // ур. 11: багаж по фамилиям — у одного владельца есть полный тёзка, ещё один владелец только подходит к трапу
  const twin = group[3];
  twin.full_name = fam[0].full_name; twin.female = false;
  if (twin.city === fam[0].city) twin.city = CITIES.find(c => c !== fam[0].city);
  const walker = person(); walker.seat_no = '3' + LET.filter(L => !g3.includes(L))[0];
  const lkBags = [twin, pair[0], group[0], walker].map(o => ({tag: tag(), owner: o, passenger_id: o.id, weight_kg: r.int(5, 25)}));
  // финал: кресло с ремонта и кресло в ряду 6, трое опоздавших, у одного два чемодана
  const late = [person(), person(), person({kid: true})];
  late[0].seat_no = repair;
  late[1].seat_no = r.pick(bizSeats.filter(s => s !== p1.seat_no)); late[1].meal = 'ресторан'; late[1].birth_year = null;
  late[2].seat_no = '6' + LET.filter(L => !l6.includes(L))[r.int(0, 3)]; late[2].meal = 'детское';
  const lbags = [late[0], late[0], late[1]].map((p, i) => ({tag: tag(), owner: p, passenger_id: p.id, weight_kg: i === 1 ? 32 : r.int(7, 23)}));
  return {seed, F0, F1, F2, FLIGHT, repair, twin, walker, lkBags, baseSeats, bizSeats, biz1, biz2, row3, row6, row6need, p1, fam, bags, pair, group, wrong, wrongSeat, late, lbags};
}

export const SCHEMA = `
CREATE TABLE flight (
  flight_no varchar(7)  PRIMARY KEY,
  dest      varchar(40) NOT NULL,
  dep_time  time        NOT NULL,
  gate      varchar(3)
);
CREATE TABLE seat (
  seat_no varchar(3)  PRIMARY KEY CONSTRAINT ck_seat_no CHECK (seat_no ~ '^[1-6][A-F]$'),
  cls     varchar(10) NOT NULL DEFAULT 'эконом' CONSTRAINT ck_seat_cls CHECK (cls IN ('бизнес', 'эконом'))
);
CREATE TABLE passenger (
  id         integer     PRIMARY KEY,
  flight_no  varchar(7)  NOT NULL CONSTRAINT fk_passenger_flight REFERENCES flight (flight_no),
  seat_no    varchar(3)  NOT NULL CONSTRAINT fk_passenger_seat REFERENCES seat (seat_no),
  full_name  varchar(60) NOT NULL,
  birth_year integer     CONSTRAINT ck_passenger_birth CHECK (birth_year BETWEEN 1920 AND 2026),
  city       varchar(40),
  meal       varchar(20) NOT NULL DEFAULT 'стандарт' CONSTRAINT ck_passenger_meal
             CHECK (meal IN ('стандарт', 'детское', 'вегетарианское', 'ресторан')),
  CONSTRAINT uq_passenger_seat UNIQUE (flight_no, seat_no)
);
CREATE TABLE baggage (
  tag          varchar(5) PRIMARY KEY,
  passenger_id integer    NOT NULL CONSTRAINT fk_baggage_passenger REFERENCES passenger (id),
  weight_kg    integer    NOT NULL CONSTRAINT ck_baggage_weight CHECK (weight_kg BETWEEN 1 AND 32)
);`;
export const lit = v => v === null || v === undefined ? 'NULL' : typeof v === 'number' || typeof v === 'boolean' ? String(v) : "'" + String(v).replace(/'/g, "''") + "'";
export const TABLES = {flight: 'flight_no', seat: 'seat_no', passenger: 'id', baggage: 'tag'};
export const COLS = {
  flight: ['flight_no', 'dest', 'dep_time', 'gate'],
  seat: ['seat_no', 'cls'],
  passenger: ['id', 'flight_no', 'seat_no', 'full_name', 'birth_year', 'city', 'meal'],
  baggage: ['tag', 'passenger_id', 'weight_kg'],
};
export function baseSql(D) {
  return SCHEMA + '\nINSERT INTO seat (seat_no) VALUES ' + D.baseSeats.map(s => `('${s}')`).join(', ') + ';' +
    '\nINSERT INTO seat (seat_no, cls) VALUES ' + D.biz2.map(s => `('${s}', 'бизнес')`).join(', ') + ';';
}
const insFl = fs => 'INSERT INTO flight (flight_no, dest, dep_time, gate) VALUES ' + fs.map(f => `(${lit(f.flight_no)}, ${lit(f.dest)}, ${lit(f.dep_time)}, ${lit(f.gate)})`).join(', ');
const insP = (ps, meal) => `INSERT INTO passenger (id, flight_no, seat_no, full_name, birth_year, city${meal ? ', meal' : ''}) VALUES ` +
  ps.map(p => `(${p.id}, ${lit(p.flight_no)}, ${lit(p.seat_no)}, ${lit(p.full_name)}, ${p.birth_year}, ${lit(p.city)}${meal ? ', ' + lit(p.meal || 'стандарт') : ''})`).join(', ');
const insB = bs => 'INSERT INTO baggage (tag, passenger_id, weight_kg) VALUES ' + bs.map(b => `(${lit(b.tag)}, ${b.passenger_id}, ${b.weight_kg})`).join(', ');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// документы, которые видит студент
const tbl = (head, rows) => `<table class="doc"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c == null ? '<i>—</i>' : esc(c)}</td>`).join('')}</tr>`).join('')}</table>`;
const flDoc = fs => tbl(['рейс', 'куда', 'вылет', 'выход'], fs.map(f => [f.flight_no, f.dest, f.dep_time, f.gate ?? 'NULL — не назначен']));
const pDoc = (ps, meal) => tbl(['№', 'место', 'пассажир', 'г. р.', 'город'].concat(meal ? ['питание'] : []), ps.map(p => [p.id, p.seat_no, p.full_name, p.birth_year ?? 'NULL — неизвестен', p.city].concat(meal ? [p.meal || 'по умолчанию'] : [])));
const nDoc = bs => tbl(['бирка', 'вес', 'владелец', 'город владельца'], bs.map(b => [b.tag, b.weight_kg + ' кг', b.owner.full_name, b.owner.city]));
const bDoc = bs => tbl(['бирка', 'вес', 'рейс', 'место владельца'], bs.map(b => [b.tag, b.weight_kg + ' кг', b.owner.flight_no, b.owner.seat_no]));
const LEGEND = `<div class="legend"><b>NULL</b> — значение неизвестно: так и пишем <code>NULL</code>, без кавычек.<br><b>по умолчанию</b> — пишем <code>DEFAULT</code> или вовсе не указываем столбец.</div>`;
export const talon = p => ({id: p.id, flight_no: p.flight_no, seat_no: p.seat_no, full_name: p.full_name, birth_year: p.birth_year, city: p.city, meal: p.meal, kid: p.kid, female: p.female});
export const tagOf = b => ({tag: b.tag, weight_kg: b.weight_kg, flight_no: b.owner.flight_no, seat_no: b.owner.seat_no});

// исход вставки — варианты для прогноза
const OUT = [
  {k: 'ok', t: 'Строки добавятся'},
  {k: 'fk', t: 'Отказ: ссылка на несуществующую строку (FOREIGN KEY)'},
  {k: 'notnull', t: 'Отказ: не заполнен обязательный столбец (NOT NULL)'},
  {k: 'check', t: 'Отказ: значение нарушает правило (CHECK)'},
];

// ═══════════════════════════════════════════════════════════ уровни ══
export const PTS = {board: .5, board2: .5, biz: .5, eco: .5, first: .5, family: .5, bags: .5, row6: .5, group: .5, hunt: 1.5, lookup: 1.5, final: 1.5};
export function levels(D) {
  const F = D.FLIGHT;
  const groupFixed = D.group.map(p => p === D.wrong ? {...p, seat_no: D.wrong.seat_no} : p);
  const groupTicket = D.group.map(p => p === D.wrong ? {...p, seat_no: D.wrongSeat} : p);
  return [
    {key: 'board', title: 'Рейс на табло', lab: 'ч. 1 · одна строка',
      text: `Терминал открывается. Самолёт пуст, табло тоже. Первым делом — наш рейс ${F}: внесите его в таблицу flight.`,
      goals: [`Рейс ${F} — в flight со всеми четырьмя значениями`, 'Буква в номере выхода — латинская (раскладка EN)'],
      doc: flDoc([D.F0]), tables: ['flight'], ref: [insFl([D.F0])],
      hint: `INSERT INTO flight (flight_no, dest, dep_time, gate) VALUES ('${F}', '…', '…', '…'); — текст и время в одинарных кавычках.`,
      ok: 'Рейс на табло. Каждое значение встало в свой столбец — по порядку перечня.'},
    {key: 'board2', title: 'Ещё два рейса', lab: 'ч. 1 · несколько строк одной командой',
      text: 'Диспетчер прислал ещё два рейса этого утра. Внесите оба одной командой. У одного выход на посадку ещё не назначен.',
      goals: ['Оба рейса — одной командой INSERT', 'Неизвестный выход — NULL, а не пустая строка'],
      doc: flDoc([D.F1, D.F2]) + LEGEND, tables: ['flight'], ref: [insFl([D.F1, D.F2])], one: 2,
      hint: "После VALUES — две скобки через запятую. Неизвестное значение пишется NULL без кавычек: 'NULL' в кавычках — это текст из четырёх букв.",
      ok: 'Два рейса за одну команду. У второго выход пуст — NULL значит «пока неизвестно».'},
    {key: 'biz', title: 'Бизнес-класс', lab: 'ч. 1 · справочник seat',
      text: 'Ряд 1 после ремонта стоит без кресел. Ряд 2 уже готов — щёлкните его кресло и посмотрите строку. Поставьте в ряд 1 бизнес-класс: места A, C, D, F.',
      goals: ['4 кресла: 1A 1C 1D 1F', "cls = 'бизнес'", 'Одной командой'],
      doc: tbl(['ряд', 'места', 'класс'], [['1', 'A, C, D, F', 'бизнес']]), ghosts: D.biz1,
      tables: ['seat'], ref: ['INSERT INTO seat (seat_no, cls) VALUES ' + D.biz1.map(s => `('${s}', 'бизнес')`).join(', ')], one: 4,
      hint: "INSERT INTO seat (seat_no, cls) VALUES ('1A', 'бизнес'), ('1C', 'бизнес'), …; — четыре скобки.",
      ok: 'Четыре кресла на месте. Пунктирные контуры исчезли — каждое совпало со строкой.'},
    {key: 'eco', title: 'Эконом по умолчанию', lab: 'ч. 1 · значение по умолчанию',
      text: "Ряд 3 — обычный эконом, шесть кресел A–F. У столбца cls есть значение по умолчанию 'эконом' — пусть его подставит СУБД.",
      goals: ['6 кресел ряда 3 одной командой', 'Столбец cls в команде не указывать'],
      doc: tbl(['ряд', 'места', 'класс'], [['3', 'A–F', 'по умолчанию']]), ghosts: D.row3,
      tables: ['seat'], ref: ['INSERT INTO seat (seat_no) VALUES ' + D.row3.map(s => `('${s}')`).join(', ')], one: 6, noCol: 'cls',
      hint: "INSERT INTO seat (seat_no) VALUES ('3A'), ('3B'), …; — только номер места.",
      ok: "Кресла получили cls = 'эконом' без вашего участия: это DEFAULT."},
    {key: 'first', title: 'Первый пассажир', lab: 'ч. 1 · пассажир со ссылками',
      text: 'У трапа — первый пассажир. Щёлкните его: в руках посадочный. Номер посадочного — это id. Питание он не заказывал.',
      goals: ['Пассажир — в passenger, на своё место', 'Столбец meal не указывать'],
      doc: pDoc([D.p1]), queue: [D.p1],
      tables: ['passenger'], ref: [insP([D.p1])], noCol: 'meal',
      pred: {q: 'У столбца meal стоит NOT NULL, а вы его не указываете. Что сделает СУБД?', choices: [{k: 'nn', t: 'Откажет: обязательный столбец пуст'}, {k: 'null', t: 'Запишет NULL'}, {k: 'def', t: "Подставит значение по умолчанию 'стандарт'"}], answer: 'def'},
      hint: `INSERT INTO passenger (id, flight_no, seat_no, full_name, birth_year, city) VALUES (${D.p1.id}, '${F}', …);`,
      ok: 'Пассажир прошёл к своему креслу. Поднос стандартный — его подставил DEFAULT.'},
    {key: 'family', title: 'Семья', lab: 'ч. 2 · строки с разным набором значений',
      text: "Семья из трёх человек, ряд 4. Ребёнку заказано детское питание, взрослым — ничего. Всех — одной командой. Раз meal есть в перечне столбцов, значение нужно в каждой скобке: взрослым пишите DEFAULT (без кавычек) — СУБД подставит 'стандарт'.",
      goals: ['Трое — одной командой INSERT', "Ребёнку meal = 'детское'", "Взрослым — стандартное"],
      doc: pDoc(D.fam, true) + LEGEND + `<div class="legend ex">Пример строки: <code>(…, 'Тюмень', DEFAULT)</code></div>`, queue: D.fam, hint1: true,
      tables: ['passenger'], ref: [insP(D.fam, true)], one: 3,
      hint: "Если в перечне есть meal, значение нужно в каждой скобке. Для взрослых можно написать DEFAULT — без кавычек.",
      ok: 'Вся семья на местах. Слово DEFAULT внутри VALUES — тоже способ попросить значение по умолчанию.'},
    {key: 'bags', title: 'Багаж', lab: 'ч. 1 · внешний ключ на пассажира',
      text: 'На тележке три чемодана. На бирке нет номера пассажира — только место. Найдите владельца в салоне (щёлкните его) и возьмите его id.',
      goals: ['Три чемодана — в baggage', 'passenger_id — настоящий номер владельца'],
      doc: bDoc(D.bags), cart: D.bags,
      tables: ['baggage'], ref: [insB(D.bags)],
      hint: 'Щёлкните пассажира на месте с бирки — в карточке строки будет id. INSERT INTO baggage (tag, passenger_id, weight_kg) VALUES …',
      ok: 'Чемоданы легли на полку над рядом владельца. 32 кг — ровно на границе правила, и это допустимо.'},
    {key: 'row6', title: 'Сначала кресло', lab: 'ч. 3 · порядок вставки',
      text: `Двое с билетами в ряд 6. Но в ряду 6 кресел нет — их ещё не поставили. Поставьте два кресла, на которые проданы билеты (эконом), и посадите пассажиров.`,
      goals: [`Кресла ${D.row6need.join(' и ')}`, 'Двое пассажиров — на свои места'],
      doc: pDoc(D.pair), queue: D.pair, ghosts: D.row6need,
      tables: ['seat', 'passenger'], ref: ['INSERT INTO seat (seat_no) VALUES ' + D.row6need.map(s => `('${s}')`).join(', '), insP(D.pair)],
      pred: {q: 'Если зарегистрировать этих двоих прямо сейчас, пока кресел ряда 6 нет, что ответит СУБД?', choices: OUT, answer: 'fk'},
      hint: 'Две команды: сначала INSERT INTO seat, потом INSERT INTO passenger. Строка, на которую ссылаются, должна появиться раньше.',
      ok: 'Сначала родитель, потом ссылка на него. Наоборот СУБД не пропустит — внешний ключ.'},
    {key: 'group', title: 'Ошибка в списке', lab: 'ч. 3 · команда целиком или никак',
      text: `Тургруппа, ряд 3. Список уже набран в пульте — запустите его как есть. Потом исправьте: пассажиру № ${D.wrong.id} продали место ${D.wrongSeat}, а оно занято. Посадите его на ${D.wrong.seat_no}.`,
      goals: ['Запустить список как есть и посмотреть', `№ ${D.wrong.id} — на место ${D.wrong.seat_no}`, 'Вся группа на местах'],
      doc: pDoc(groupTicket), queue: groupFixed, prefill: insP(groupTicket) + ';',
      tables: ['passenger'], ref: [insP(groupFixed)],
      pred: {q: 'В команде четыре строки, ошибка только во второй. Сколько пассажиров добавится?', choices: [{k: '4', t: 'Четыре'}, {k: '3', t: 'Три — все, кроме ошибочного'}, {k: '1', t: 'Один — до ошибки'}, {k: '0', t: 'Ни одного'}], answer: '0'},
      hint: `Исправьте во второй скобке место '${D.wrongSeat}' на '${D.wrong.seat_no}' и запустите снова.`,
      ok: 'Ошибка в одной строке отменяет всю команду. Исправили — и вошли все.'},
    {key: 'hunt', hard: true, cmds: 'По одной команде INSERT на каждое ограничение: после отказа робот дальше не идёт', title: 'Охота на ограничения', lab: 'сложный · ч. 3 · что база не принимает', check: 'custom', slotBy: 'constraint',
      slots: ['passenger_pkey', 'uq_passenger_seat', 'fk_passenger_seat', 'ck_seat_no', 'notnull'],
      slotNames: {passenger_pkey: 'passenger_pkey', uq_passenger_seat: 'uq_passenger_seat', fk_passenger_seat: 'fk_passenger_seat', ck_seat_no: 'ck_seat_no', notnull: 'NOT NULL'},
      text: 'Служба безопасности проверяет защиту базы. Добейтесь, чтобы СУБД отклонила вставку именно по каждому из пяти правил ниже — имя правила должно совпасть. Откройте «Структуру таблиц» и подумайте, какое значение нарушит каждое.',
      goals: ['passenger_pkey — повтор первичного ключа', 'uq_passenger_seat — двое на одном месте рейса', 'fk_passenger_seat — кресла нет', 'ck_seat_no — номер места не по правилу', 'NOT NULL — пропущен обязательный столбец'],
      hint: 'Каждое правило — отдельная команда. Возьмите существующего пассажира (щёлкните его) и меняйте по одному значению.',
      ok: 'Все пять правил сработали. Теперь вы знаете, от чего защищена база.'},
    {key: 'lookup', hard: true, cmds: 'Несколько команд: найти владельцев (SELECT), вставить, доложить count(*)', title: 'Багаж по фамилиям', lab: 'сложный · поиск id, порядок вставки, сверка', needCount: 'baggage',
      text: `На тележке ещё четыре чемодана. На бирках нет ни id, ни места — только фамилия и город. Номера владельцев найдите запросом SELECT … WHERE. Осторожно: в салоне есть полные тёзки. Один владелец ещё стоит у трапа — его сначала нужно зарегистрировать. В конце доложите, сколько всего чемоданов на борту: SELECT count(*) FROM baggage.`,
      goals: ['Найти id владельцев через SELECT', 'Зарегистрировать пассажира у трапа', 'Четыре чемодана — в baggage', 'Доклад: SELECT count(*) FROM baggage'],
      doc: nDoc(D.lkBags) + pDoc([D.walker]), queue: [D.walker], cart: D.lkBags,
      tables: ['passenger', 'baggage'], ref: [insP([D.walker]), insB(D.lkBags)],
      hint: "SELECT id, full_name, city, seat_no FROM passenger WHERE full_name = '…'; — если строк две, добавьте AND city = '…'.",
      ok: 'Владельцы найдены, тёзки не перепутаны, доклад принят.'},
    {key: 'final', hard: true, cmds: 'Три команды (кресла, пассажиры, багаж) — порядок важен', title: 'Последние на борт', lab: 'сложный · контрольный · без подсказок', final: true,
      text: `Перед вылетом: кресло ${D.repair} вернули из ремонта, а одному опоздавшему продали место в ряду 6, где кресла ещё нет. Трое опоздавших у трапа, у одного два чемодана. Год рождения одного неизвестен, у всех разное питание. Порядок команд — ваш, но база должна принять каждую.`,
      goals: ['Два недостающих кресла (эконом)', 'Трое пассажиров — с нужным питанием, неизвестное — NULL', 'Три чемодана на полках'],
      doc: pDoc(D.late, true) + bDoc(D.lbags) + LEGEND, queue: D.late, cart: D.lbags, ghosts: [D.repair, D.late[2].seat_no],
      tables: ['seat', 'passenger', 'baggage'],
      ref: [`INSERT INTO seat (seat_no) VALUES ('${D.repair}'), ('${D.late[2].seat_no}')`, insP(D.late, true), insB(D.lbags)],
      ok: 'Борт заполнен. Взлетаем!'},
  ];
}
