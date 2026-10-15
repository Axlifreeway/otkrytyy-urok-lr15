// ЛР-14 · тренировка после уровней: бесконечные задания на UPDATE и DELETE из текущей базы студента.
// Каждое задание — обычный уровень (проверка — сравнением с базой после эталона), только без баллов.
// Условия описаны словами, а не SQL: WHERE студент собирает сам (справочник SQL — в карточке задания).
import {lit} from './data.js';

const pick = (a, r) => a[Math.floor(r() * a.length)];
const MEALS = ['стандарт', 'детское', 'вегетарианское', 'ресторан'];
const uniq = a => [...new Set(a.filter(x => x != null))];
const pn = p => `${p.full_name} (id ${p.id}, место ${p.seat})`;

export function practice(D, st, r) {
  const P = st.passenger.filter(p => p.active !== false),
    B = st.baggage,
    T = [];
  const cities = uniq(P.map(p => p.city)).filter(c => P.filter(p => p.city === c).length >= 2);
  const shelves = uniq(B.map(b => b.shelf));
  const rows = uniq(P.map(p => parseInt(p.seat, 10)));

  if (cities.length) {
    const c = pick(cities, r),
      m = pick(
        MEALS.filter(x => x !== 'детское'),
        r,
      );
    T.push({
      title: 'Питание по городу',
      text: `Для всех пассажиров из города ${c} авиакомпания заказала питание «${m}».`,
      goals: [`Всем из города ${c}: meal = '${m}'`, 'Остальных не трогать'],
      tables: ['passenger'],
      ref: [`UPDATE passenger SET meal = ${lit(m)} WHERE city = ${lit(c)}`],
      hint: 'Меняется один столбец, отбор — по городу.',
    });
  }
  const years = uniq(P.map(p => p.birth_year)).sort((a, b) => a - b);
  if (years.length > 3) {
    const y = years[Math.floor(years.length * (0.6 + r() * 0.3))];
    T.push({
      title: 'Детское питание',
      text: `Всем, кто родился в ${y} году и позже, положено детское питание.`,
      goals: [`birth_year ${y} и позже: meal = 'детское'`],
      tables: ['passenger'],
      ref: [`UPDATE passenger SET meal = 'детское' WHERE birth_year >= ${y}`],
      hint: 'Какой знак сравнения отберёт «этот год и позже»?',
    });
  }
  if (shelves.length) {
    const s = pick(shelves, r),
      k = 1 + Math.floor(r() * 3);
    T.push({
      title: 'Весы на полке',
      text: `Весы у полки ${s} показывали на ${k} кг меньше. Исправьте вес каждого чемодана на этой полке.`,
      goals: [`Полка ${s}: каждому чемодану +${k} кг`],
      tables: ['baggage'],
      ref: [`UPDATE baggage SET weight_kg = weight_kg + ${k} WHERE shelf = ${s}`],
      hint: 'Новое значение считается из старого: SET столбец = столбец + …',
    });
    const ws = B.filter(b => b.shelf === s).map(b => b.weight_kg);
    if (ws.length >= 2) {
      const w = [...ws].sort((a, b) => a - b)[Math.floor(ws.length / 2)];
      T.push({
        title: 'Лёгкие — на нижнюю',
        text: `На полке ${s} чемоданы легче ${w} кг переложили на полку ${s === 1 ? 2 : 1}.`,
        goals: [`Полка ${s}, вес меньше ${w} кг → полка ${s === 1 ? 2 : 1}`],
        tables: ['baggage'],
        ref: [`UPDATE baggage SET shelf = ${s === 1 ? 2 : 1} WHERE shelf = ${s} AND weight_kg < ${w}`],
        hint: 'Два условия сразу — через AND.',
      });
    }
  }
  if (B.length >= 3) {
    const w = [...B.map(b => b.weight_kg)].sort((a, b) => a - b)[Math.floor(B.length * 0.75)];
    T.push({
      title: 'Перевес',
      text: `Чемоданы тяжелее ${w} кг не прошли контроль — снимите их с борта.`,
      goals: [`Удалить чемоданы тяжелее ${w} кг`],
      tables: ['baggage'],
      ref: [`DELETE FROM baggage WHERE weight_kg > ${w}`],
      hint: 'DELETE с условием по весу. «Тяжелее» — строго больше.',
    });
  }
  if (rows.length >= 2) {
    const [a, b] = [...rows].sort(() => r() - 0.5),
      m = pick(['вегетарианское', 'ресторан', 'стандарт'], r);
    T.push({
      title: 'Два ряда',
      text: `Пассажирам в рядах ${a} и ${b} меняем питание на «${m}».`,
      goals: [`Ряды ${a} и ${b}: meal = '${m}'`],
      tables: ['passenger'],
      ref: [`UPDATE passenger SET meal = ${lit(m)} WHERE seat LIKE '${a}%' OR seat LIKE '${b}%'`],
      hint: "Номер места начинается с номера ряда: LIKE '7%'. Два ряда — два условия через OR.",
      sel: true,
    });
  }
  if (cities.length) {
    const c = pick(cities, r);
    T.push({
      title: 'Багаж по городу',
      text: `Багаж пассажиров из города ${c} отправят следующим рейсом — снимите его с борта. Самих пассажиров не трогайте.`,
      goals: [`Удалить чемоданы владельцев из города ${c}`, 'Пассажиров не удалять'],
      tables: ['passenger', 'baggage'],
      ref: [`DELETE FROM baggage WHERE passenger_id IN (SELECT id FROM passenger WHERE city = ${lit(c)})`],
      hint: 'В baggage нет города. Список id владельцев вернёт SELECT в скобках после IN.',
      sel: true,
    });
  }
  const tiers = uniq(P.map(p => p.loyalty));
  if (tiers.length && shelves.length) {
    const t = pick(tiers, r);
    T.push({
      title: 'Приоритет',
      text: `Чемоданам владельцев с картой «${t}» ставят отметку: +1 кг на упаковку.`,
      goals: [`Владелец с картой «${t}»: каждому его чемодану +1 кг`],
      tables: ['baggage'],
      ref: [`UPDATE baggage SET weight_kg = weight_kg + 1 WHERE passenger_id IN (SELECT id FROM passenger WHERE loyalty = ${lit(t)})`],
      hint: 'Карта — в passenger, вес — в baggage: id владельцев с картой даст подзапрос.',
      sel: true,
    });
  }
  if (P.some(p => p.loyalty == null)) {
    T.push({
      title: 'Без карты',
      text: 'Всем, у кого ещё нет карты лояльности, выдали базовую.',
      goals: ["loyalty не заполнена → 'базовая'"],
      tables: ['passenger'],
      ref: ["UPDATE passenger SET loyalty = 'базовая' WHERE loyalty IS NULL"],
      hint: 'Пустое значение ищется через IS NULL, а не «= NULL».',
    });
  }
  if (P.length) {
    const p = pick(P, r);
    T.push({
      title: 'Снят с рейса',
      text: `${pn(p)} снят с рейса вместе с багажом.`,
      goals: ['Пассажир удалён', 'Его чемоданы — тоже'],
      tables: ['passenger', 'baggage'],
      ref: [`DELETE FROM passenger WHERE id = ${p.id}`],
      hint: 'Удаляйте пассажира по первичному ключу. Что внешний ключ сделает с его чемоданами?',
    });
    const q = pick(P, r);
    T.push({
      title: 'Возврат билета',
      text: `${pn(q)} сдал билет. Историю продаж храним: пассажира пометьте недействующим, не удаляя.`,
      goals: ['active = false — только у него'],
      tables: ['passenger'],
      ref: [`UPDATE passenger SET active = false WHERE id = ${q.id}`],
      hint: 'Пометка — это UPDATE столбца active по id.',
    });
  }
  return pick(T, r);
}
