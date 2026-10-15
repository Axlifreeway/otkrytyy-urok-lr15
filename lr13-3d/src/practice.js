// ЛР-13 · тренировка после уровней: бесконечные задания на INSERT, собранные из текущей базы студента.
// Каждое задание — обычный уровень (проверка — сравнением с базой после эталона), только без баллов.
import {SURN, CITIES, INI, LET, ROWS, insP, insB, pDoc, bDoc, nDoc, LEGEND, lit} from './data.js';

const pick = (a, r) => a[Math.floor(r() * a.length)];
const int = (a, b, r) => a + Math.floor(r() * (b - a + 1));

export function practice(D, st, r) {
  const F = D.FLIGHT,
    T = [],
    taken = new Set(st.passenger.map(p => p.seat_no)),
    seats = new Set(st.seat.map(s => s.seat_no)),
    free = st.seat.filter(s => !taken.has(s.seat_no)).map(s => s.seat_no),
    all = [];
  for (let row = 1; row <= ROWS; row++) for (const l of LET) all.push(row + l);
  const missing = all.filter(s => !seats.has(s));
  const ids = new Set(st.passenger.map(p => p.id)),
    tags = new Set(st.baggage.map(b => b.tag));
  const newId = () => {
    let v;
    do v = int(101, 989, r);
    while (ids.has(v));
    ids.add(v);
    return v;
  };
  const newTag = () => {
    let t;
    do t = 'Б' + int(1000, 9999, r);
    while (tags.has(t));
    tags.add(t);
    return t;
  };
  const person = (seat, o = {}) => {
    const female = r() < 0.5,
      kid = !!o.kid;
    return {
      id: newId(),
      flight_no: F,
      seat_no: seat,
      full_name: `${pick(SURN, r)}${female ? 'а' : ''} ${pick([...INI], r)}. ${pick([...INI], r)}.`,
      birth_year: o.nullYear ? null : kid ? int(2015, 2020, r) : int(1958, 2003, r),
      city: pick(CITIES, r),
      meal: o.meal || null,
      female,
      kid,
    };
  };
  const takeFree = () => free.splice(Math.floor(r() * free.length), 1)[0];
  const ins = (ps, meal) =>
    insP(ps, meal)
      .replace(/, null\)/g, ', NULL)')
      .replace(/, null,/g, ', NULL,');

  // пассажир на свободное место
  if (free.length)
    (() => {
      const p = person(takeFree());
      T.push({
        title: 'Ещё один пассажир',
        text: `К трапу подошёл пассажир с билетом на место ${p.seat_no}. Зарегистрируйте его на рейс ${F}.`,
        goals: [`Пассажир ${p.full_name} — на месте ${p.seat_no}`],
        doc: pDoc([p]),
        queue: [p],
        tables: ['passenger'],
        ref: [ins([p])],
        hint: 'INSERT INTO passenger (id, flight_no, seat_no, full_name, birth_year, city) VALUES (…); — значения в том же порядке, что столбцы.',
      });
    })();
  // год рождения неизвестен
  if (free.length)
    (() => {
      const p = person(takeFree(), {nullYear: true});
      T.push({
        title: 'Без года рождения',
        text: `Пассажир на место ${p.seat_no} не указал год рождения. Зарегистрируйте его — год оставьте неизвестным.`,
        goals: [`${p.full_name}, место ${p.seat_no}`, 'Год рождения — неизвестен'],
        doc: pDoc([p]) + LEGEND,
        queue: [p],
        tables: ['passenger'],
        ref: [ins([p])],
        hint: 'Неизвестное значение — NULL без кавычек.',
      });
    })();
  // семья с ребёнком: несколько строк, питание
  if (free.length >= 2)
    (() => {
      const a = person(takeFree()),
        k = person(takeFree(), {kid: true, meal: 'детское'});
      k.full_name = a.full_name.split(' ')[0].replace(/а$/, '') + (k.female ? 'а' : '') + ' ' + k.full_name.split(' ').slice(1).join(' ');
      T.push({
        title: 'Взрослый с ребёнком',
        text: `Взрослый с ребёнком летят на местах ${a.seat_no} и ${k.seat_no}. Ребёнку нужно детское питание, взрослому — по умолчанию. Одной командой.`,
        goals: ['Две строки — одной командой INSERT', 'Ребёнку — детское питание'],
        doc: pDoc([a, k], true) + LEGEND,
        queue: [a, k],
        tables: ['passenger'],
        ref: [ins([a, k], true)],
        one: 2,
        hint: 'Если в перечне столбцов есть meal, значение нужно в каждой скобке: взрослому — DEFAULT.',
      });
    })();
  // новое кресло
  if (missing.length)
    (() => {
      const s = pick(missing, r),
        cls = r() < 0.3 ? 'бизнес' : 'эконом';
      T.push({
        title: 'Кресло из ремонта',
        text: `Кресло ${s} вернули из ремонта. Добавьте его в салон, класс — ${cls}.`,
        goals: [`Кресло ${s}, класс «${cls}»`],
        ghosts: [s],
        tables: ['seat'],
        ref: [`INSERT INTO seat (seat_no, cls) VALUES (${lit(s)}, ${lit(cls)})`],
        hint: 'INSERT INTO seat (seat_no, cls) VALUES (…, …); — класс «эконом» стоит по умолчанию, его можно не указывать.',
      });
    })();
  // кресла ещё нет — сначала кресло, потом пассажир
  if (missing.length)
    (() => {
      const s = pick(missing, r),
        p = person(s);
      T.push({
        title: 'Место, которого нет',
        text: `Пассажиру продали место ${s}, а такого кресла в салоне ещё нет (эконом). Поставьте кресло и посадите пассажира.`,
        goals: [`Кресло ${s}`, `Пассажир ${p.full_name} на нём`],
        doc: pDoc([p]),
        queue: [p],
        ghosts: [s],
        tables: ['seat', 'passenger'],
        ref: [`INSERT INTO seat (seat_no) VALUES (${lit(s)})`, ins([p])],
        hint: 'Строка, на которую ссылаются (кресло), должна появиться раньше пассажира.',
      });
    })();
  // багаж по месту владельца
  if (st.passenger.length)
    (() => {
      const owners = [...st.passenger].sort(() => r() - 0.5).slice(0, 2);
      const bs = owners.map(o => ({tag: newTag(), passenger_id: o.id, weight_kg: int(5, 30, r), owner: o}));
      T.push({
        title: 'Багаж по местам',
        text: 'На тележке чемоданы. На бирках — места владельцев, а в таблицу нужен id. Щёлкните пассажира на месте — увидите его строку.',
        goals: [`${bs.length} чемодана — в baggage`],
        doc: bDoc(bs),
        cart: bs,
        tables: ['baggage'],
        ref: [insB(bs)],
        hint: 'INSERT INTO baggage (tag, passenger_id, weight_kg) VALUES (…), (…); — passenger_id найдите по месту.',
      });
    })();
  // багаж по фамилии — найти id через SELECT
  const uniq = st.passenger.filter(p => st.passenger.filter(q => q.full_name === p.full_name && q.city === p.city).length === 1);
  if (uniq.length)
    (() => {
      const o = pick(uniq, r),
        b = {tag: newTag(), passenger_id: o.id, weight_kg: int(5, 30, r), owner: o};
      T.push({
        title: 'Чей чемодан?',
        text: `На бирке только фамилия и город владельца. Найдите его id запросом SELECT и оформите чемодан.`,
        goals: ['Найти владельца через SELECT', 'Чемодан — в baggage'],
        doc: nDoc([b]),
        cart: [b],
        tables: ['baggage'],
        ref: [insB([b])],
        sel: true,
        hint: "SELECT id, full_name, city, seat_no FROM passenger WHERE full_name = '…';",
      });
    })();
  return pick(T, r);
}
