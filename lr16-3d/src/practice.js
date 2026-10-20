// ЛР-16 · тренировка после уровней: бесконечные вопросы на соединение, собранные из текущих строк базы.
// Каждое задание — обычный уровень с эталонным запросом ask (ответ сверяется с его результатом), только без баллов.
import {lit, seatRow} from './data.js';

const pick = (a, r) => a[Math.floor(r() * a.length)];
const uniq = a => [...new Set(a)].filter(v => v !== null && v !== undefined);

export function practice(D, st, r) {
  const P = st.passenger,
    B = st.baggage,
    T = [];
  const owner = new Map(P.map(p => [p.id, p])),
    hasBag = new Set(B.map(b => b.passenger_id)),
    cities = uniq(P.map(p => p.city)),
    tiers = uniq(P.map(p => p.loyalty)),
    shelves = uniq(B.map(b => b.shelf)),
    weights = uniq(B.map(b => b.weight_kg)).sort((a, b) => a - b),
    rows = uniq(P.map(p => seatRow(p.seat)));
  const BP = 'FROM baggage b JOIN passenger p ON p.id = b.passenger_id';

  // две таблицы: отбор по столбцу baggage
  if (shelves.length)
    (() => {
      const s = pick(shelves, r);
      T.push({
        title: `Полка ${s}`,
        text: `Грузчик снимает чемоданы с полки ${s} и сразу зовёт владельцев. Нужны бирка, фамилия и место владельца.`,
        q: `Чьи чемоданы на полке ${s}?`,
        goals: ['Столбцы: tag (baggage), full_name, seat (passenger)', `Только полка ${s}`],
        minTables: 2,
        ask: `SELECT b.tag, p.full_name, p.seat ${BP} WHERE b.shelf = ${s}`,
        alias: true,
        hint: 'FROM baggage b JOIN passenger p ON … — номер владельца хранится в b.passenger_id. Полка — условие в WHERE.',
      });
    })();
  // две таблицы: отбор и порядок
  if (weights.length >= 3)
    (() => {
      const w = weights[Math.floor(weights.length * (0.55 + r() * 0.3))];
      T.push({
        title: 'Тяжёлые — к владельцам',
        text: `Чемоданы тяжелее ${w} кг выдают с тележки прямо в руки. Нужны бирка, вес и фамилия владельца — от тяжёлых к лёгким.`,
        q: `Чьи чемоданы тяжелее ${w} кг?`,
        goals: ['Столбцы: tag, weight_kg, full_name', `weight_kg больше ${w}`, 'По убыванию веса'],
        minTables: 2,
        ask: `SELECT b.tag, b.weight_kg, p.full_name ${BP} WHERE b.weight_kg > ${w} ORDER BY b.weight_kg DESC`,
        order: ['weight_kg'],
        alias: true,
        hint: 'Соединение — в FROM … JOIN … ON, отбор — в WHERE, порядок — ORDER BY … DESC.',
      });
    })();
  // две таблицы: условие по столбцу passenger
  const bagCities = cities.filter(c => B.some(b => owner.get(b.passenger_id)?.city === c));
  if (bagCities.length)
    (() => {
      const c = pick(bagCities, r);
      T.push({
        title: `Багаж из города ${c}`,
        text: `Служба досмотра проверяет багаж пассажиров из города ${c}: бирка, вес и фамилия владельца.`,
        q: `Чьи чемоданы из города ${c}?`,
        goals: ['Столбцы: tag, weight_kg, full_name', `Владелец — из города ${c}`],
        minTables: 2,
        ask: `SELECT b.tag, b.weight_kg, p.full_name ${BP} WHERE p.city = ${lit(c)}`,
        alias: true,
        hint: 'Город — в passenger, бирка — в baggage: соедините, потом отберите в WHERE.',
      });
    })();
  // багаж по месту: без соединения не обойтись
  const seats = P.filter(p => hasBag.has(p.id)).map(p => p.seat);
  if (seats.length)
    (() => {
      const s = pick(seats, r);
      T.push({
        title: `Место ${s}`,
        text: `Пассажир с места ${s} просит перечислить его чемоданы. Бирка и вес — одним запросом, номер владельца вручную не подставлять.`,
        q: `Какие чемоданы у пассажира с места ${s}?`,
        goals: ['Столбцы: tag, weight_kg', `Владелец — на месте ${s}`, 'Одним запросом с соединением'],
        minTables: 2,
        ask: `SELECT b.tag, b.weight_kg ${BP} WHERE p.seat = ${lit(s)}`,
        alias: true,
        hint: 'Место — в passenger, чемоданы — в baggage. Соедините их и отберите по p.seat.',
      });
    })();
  // справочник программ
  if (cities.some(c => P.some(p => p.city === c && p.loyalty)))
    (() => {
      const c = pick(
        cities.filter(c => P.some(p => p.city === c && p.loyalty)),
        r,
      );
      T.push({
        title: `Скидки: ${c}`,
        text: `Касса считает скидки пассажирам из города ${c}: фамилия и размер скидки по карте. Без карты — не показывать.`,
        q: `Какая скидка у пассажиров из города ${c}?`,
        goals: ['Столбцы: full_name, discount', `Только город ${c}`, 'Только владельцы карт'],
        minTables: 2,
        ask: `SELECT p.full_name, l.discount FROM passenger p JOIN loyalty l ON l.tier = p.loyalty WHERE p.city = ${lit(c)}`,
        alias: true,
        hint: 'Скидка — в loyalty, связь — p.loyalty = l.tier. Обычное соединение само отбросит тех, у кого карты нет.',
      });
    })();
  // рейс
  if (rows.length)
    (() => {
      const n = pick(rows, r);
      T.push({
        title: `Куда летит ряд ${n}`,
        text: `Бортпроводнику ряда ${n} нужны фамилия, номер рейса и город назначения каждого пассажира.`,
        q: `Куда летят пассажиры ряда ${n}?`,
        goals: ['Столбцы: full_name, flight_no, dest', `Только ряд ${n}`],
        minTables: 2,
        ask: `SELECT p.full_name, f.flight_no, f.dest FROM passenger p JOIN flight f ON f.flight_no = p.flight_no WHERE p.seat LIKE '${n}%'`,
        alias: true,
        hint: "Город назначения — в flight, связь — по номеру рейса. Ряд — начало места: LIKE 'N%'.",
      });
    })();
  // три таблицы
  const bagTiers = tiers.filter(t => B.some(b => owner.get(b.passenger_id)?.loyalty === t));
  if (bagTiers.length)
    (() => {
      const t = pick(bagTiers, r);
      T.push({
        title: `Багаж карты «${t}»`,
        text: `Чемоданы владельцев карты «${t}» везут отдельной тележкой. Нужны бирка, фамилия владельца и его скидка.`,
        q: `Чьи чемоданы везти тележкой «${t}»?`,
        goals: ['Столбцы: tag, full_name, discount', `Программа — «${t}»`, 'Три таблицы, два условия соединения'],
        minTables: 3,
        ask: `SELECT b.tag, p.full_name, l.discount ${BP} JOIN loyalty l ON l.tier = p.loyalty WHERE l.tier = ${lit(t)}`,
        alias: true,
        hint: 'baggage → passenger → loyalty: у каждого JOIN своё ON. Отбор программы — в WHERE.',
      });
    })();
  // левое соединение: кто без багажа в ряду
  const bagless = rows.filter(n => P.some(p => seatRow(p.seat) === n && !hasBag.has(p.id)));
  if (bagless.length)
    (() => {
      const n = pick(bagless, r);
      T.push({
        title: `Налегке в ряду ${n}`,
        text: `Кто в ряду ${n} летит без багажа? Фамилия и место. В baggage таких пассажиров нет вовсе.`,
        q: `У кого в ряду ${n} нет ни одного чемодана?`,
        goals: ['Столбцы: full_name, seat', `Только ряд ${n}`, 'Без единого чемодана'],
        minTables: 2,
        ask: `SELECT p.full_name, p.seat FROM passenger p LEFT JOIN baggage b ON b.passenger_id = p.id WHERE b.tag IS NULL AND p.seat LIKE '${n}%'`,
        alias: true,
        hint: 'Слева — passenger, справа — baggage. У пассажира без чемодана b.tag пустой: … WHERE b.tag IS NULL AND …',
      });
    })();
  // левое соединение: показать и тех, у кого карты нет
  const mixed = cities.filter(c => P.some(p => p.city === c && !p.loyalty) && P.some(p => p.city === c && p.loyalty));
  if (mixed.length)
    (() => {
      const c = pick(mixed, r);
      T.push({
        title: `Все из города ${c}`,
        text: `Касса просит всех пассажиров из города ${c} с их скидкой: фамилия и discount. У кого карты нет — тоже показать, скидка у них пустая.`,
        q: `Какая скидка у каждого пассажира из города ${c}?`,
        goals: ['Столбцы: full_name, discount', `Все пассажиры из города ${c}`, 'Без карты — тоже в ответе'],
        minTables: 2,
        ask: `SELECT p.full_name, l.discount FROM passenger p LEFT JOIN loyalty l ON l.tier = p.loyalty WHERE p.city = ${lit(c)}`,
        alias: true,
        hint: 'Обычный JOIN выбросит пассажиров без карты. Нужен passenger p LEFT JOIN loyalty l.',
      });
    })();
  return pick(T, r);
}
