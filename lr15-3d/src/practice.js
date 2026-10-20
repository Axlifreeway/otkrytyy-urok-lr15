// ЛР-15 · тренировка после уровней: бесконечные вопросы к базе, собранные из её текущих строк.
// Каждое задание — обычный уровень с эталонным запросом ask (ответ сверяется с его результатом), только без баллов.
import {lit, YEAR, seatRow} from './data.js';
import {plural} from '../../common/util.js';

const pick = (a, r) => a[Math.floor(r() * a.length)];
const int = (a, b, r) => a + Math.floor(r() * (b - a + 1));
const uniq = a => [...new Set(a)].filter(v => v !== null && v !== undefined);
const cnt = (a, f) => a.filter(f).length;

export function practice(D, st, r) {
  const P = st.passenger,
    B = st.baggage,
    T = [];
  const cities = uniq(P.map(p => p.city)),
    meals = uniq(P.map(p => p.meal)),
    tiers = uniq(P.map(p => p.loyalty)),
    years = uniq(P.map(p => p.birth_year)).sort((a, b) => a - b),
    weights = uniq(B.map(b => b.weight_kg)).sort((a, b) => a - b),
    shelves = uniq(B.map(b => b.shelf)),
    rows = uniq(P.map(p => seatRow(p.seat)));

  // отбор по равенству
  if (cities.length)
    (() => {
      const c = pick(cities, r);
      T.push({
        title: `Пассажиры из города ${c}`,
        text: `Встречающим нужен список пассажиров из города ${c}: фамилия, место и программа лояльности.`,
        q: `Кто летит из города ${c}?`,
        goals: [`Только город ${c}`, 'Столбцы: full_name, seat, loyalty'],
        ask: `SELECT full_name, seat, loyalty FROM passenger WHERE city = ${lit(c)}`,
        hint: "WHERE city = 'значение' — текст в одинарных кавычках.",
      });
    })();
  // отбор по сравнению: знак — случайный, порог — вес одного из чемоданов
  if (weights.length >= 3)
    (() => {
      const w = weights[int(1, weights.length - 2, r)],
        op = pick(
          [
            ['>', `тяжелее ${w} кг`],
            ['>=', `не легче ${w} кг`],
            ['<', `легче ${w} кг`],
            ['<=', `не тяжелее ${w} кг`],
          ],
          r,
        );
      T.push({
        title: 'Весы у ленты',
        text: `Грузчикам нужны чемоданы ${op[1]}: бирка, полка и вес.`,
        q: `Какие чемоданы ${op[1]}?`,
        goals: [`weight_kg — ${op[1]}`, 'Столбцы: tag, shelf, weight_kg'],
        ask: `SELECT tag, shelf, weight_kg FROM baggage WHERE weight_kg ${op[0]} ${w}`,
        hint: '«Тяжелее» — строго больше (>), «не легче» — больше или равно (>=). Число — без кавычек.',
      });
    })();
  // диапазон
  if (years.length >= 4)
    (() => {
      const i = int(0, years.length - 3, r),
        a = years[i],
        b = years[Math.min(years.length - 1, i + int(2, 5, r))];
      T.push({
        title: 'Ровесники',
        text: `Для опроса нужны пассажиры, родившиеся с ${a} по ${b} год включительно: фамилия и год рождения.`,
        q: `Кто родился с ${a} по ${b} год?`,
        goals: [`birth_year от ${a} до ${b} включительно`, 'Столбцы: full_name, birth_year'],
        ask: `SELECT full_name, birth_year FROM passenger WHERE birth_year BETWEEN ${a} AND ${b}`,
        hint: 'BETWEEN [от] AND [до] — обе границы включаются.',
      });
    })();
  // перечень
  if (cities.length >= 3)
    (() => {
      const two = [...cities].sort(() => r() - 0.5).slice(0, 2);
      T.push({
        title: 'Два города',
        text: `Туроператор встречает пассажиров из городов ${two[0]} и ${two[1]}: фамилия, город и место.`,
        q: `Кто летит из города ${two[0]} или ${two[1]}?`,
        goals: [`city — одно из: ${two.join(', ')}`, 'Столбцы: full_name, city, seat'],
        ask: `SELECT full_name, city, seat FROM passenger WHERE city IN (${two.map(lit).join(', ')})`,
        hint: "IN ('значение', 'значение') — короче, чем OR.",
      });
    })();
  // по образцу: первая буква фамилии
  const letters = uniq(P.map(p => p.full_name[0])).filter(ch => cnt(P, p => p.full_name[0] === ch) >= 2);
  if (letters.length)
    (() => {
      const ch = pick(letters, r);
      T.push({
        title: `Фамилии на «${ch}»`,
        text: `Посадочные талоны раскладывают по алфавиту. Найдите пассажиров, чья фамилия начинается на «${ch}»: фамилия и место.`,
        q: `У кого фамилия на «${ch}»?`,
        goals: [`full_name начинается на «${ch}»`, 'Столбцы: full_name, seat'],
        ask: `SELECT full_name, seat FROM passenger WHERE full_name LIKE ${lit(ch + '%')}`,
        hint: "LIKE 'К%' — «начинается на К, дальше что угодно». Буква — русская.",
      });
    })();
  // по образцу: ряд
  if (rows.length)
    (() => {
      const n = pick(rows, r);
      T.push({
        title: `Ряд ${n}`,
        text: `Бортпроводник проверяет ряд ${n}: фамилия, место и питание каждого, кто в нём сидит.`,
        q: `Кто сидит в ряду ${n}?`,
        goals: [`Место начинается с ${n}`, 'Столбцы: full_name, seat, meal'],
        ask: `SELECT full_name, seat, meal FROM passenger WHERE seat LIKE '${n}%'`,
        hint: `Номер ряда — начало места: seat LIKE '${n}%'.`,
      });
    })();
  // пустые значения
  const nulls = [
    ['birth_year', 'год рождения не указан'],
    ['loyalty', 'нет карты лояльности'],
    ['meal', 'питание не выбрано'],
  ].filter(([c]) => P.some(p => p[c] === null));
  if (nulls.length)
    (() => {
      const [c, t] = pick(nulls, r);
      T.push({
        title: 'Пустые анкеты',
        text: `Стойка регистрации уточняет анкеты: нужны пассажиры, у которых ${t}. Фамилия и место.`,
        q: `У кого ${t}?`,
        goals: [`${c} не заполнен`, 'Столбцы: full_name, seat'],
        ask: `SELECT full_name, seat FROM passenger WHERE ${c} IS NULL`,
        hint: `Сравнение «= NULL» всегда «неизвестно» — пустое значение ищут через ${c} IS NULL.`,
      });
    })();
  // ловушка NULL: «не такое-то» вместе с пустыми
  if (meals.length >= 2 && P.some(p => p.meal === null))
    (() => {
      const m = pick(meals, r);
      T.push({
        title: 'Кроме одного меню',
        text: `Бортпроводник обходит всех, кому не заказано питание «${m}», — и тех, у кого питание не выбрано вовсе. Фамилия, место, питание.`,
        q: `К кому подойти, кроме заказавших «${m}»?`,
        goals: [`meal — не «${m}»`, 'И те, у кого meal не заполнен', 'Столбцы: full_name, seat, meal'],
        ask: `SELECT full_name, seat, meal FROM passenger WHERE meal <> ${lit(m)} OR meal IS NULL`,
        hint: 'Сравнение с пустым значением — «неизвестно», такие строки WHERE отбрасывает. Добавьте их: … OR meal IS NULL.',
      });
    })();
  // скобки: город И (программа ИЛИ программа)
  const pc = cities.filter(c => cnt(P, p => p.city === c && p.loyalty !== null) >= 1);
  if (pc.length && tiers.length >= 2)
    (() => {
      const c = pick(pc, r),
        two = [...tiers].sort(() => r() - 0.5).slice(0, 2);
      T.push({
        title: 'Скобки решают',
        text: `Приглашение в бизнес-зал: пассажирам из города ${c} с картой «${two[0]}» или «${two[1]}». Фамилия и программа.`,
        q: `Кто из города ${c} с картой «${two[0]}» или «${two[1]}»?`,
        goals: [`city = '${c}'`, `loyalty — «${two[0]}» или «${two[1]}»`, 'Столбцы: full_name, loyalty'],
        ask: `SELECT full_name, loyalty FROM passenger WHERE city = ${lit(c)} AND (loyalty = ${lit(two[0])} OR loyalty = ${lit(two[1])})`,
        hint: 'AND выполняется раньше OR — условие с OR возьмите в скобки (или замените на IN).',
      });
    })();
  // вычисляемый столбец
  if (cities.length)
    (() => {
      const c = pick(cities, r);
      T.push({
        title: 'Возраст земляков',
        text: `Бригадиру нужен список пассажиров из города ${c}: фамилия и возраст в ${YEAR} году. Столбца с возрастом нет — посчитайте его и назовите age.`,
        q: `Сколько лет пассажирам из города ${c}?`,
        goals: [`Только город ${c}`, 'Столбцы: full_name, age', `age — возраст в ${YEAR} году`],
        ask: `SELECT full_name, ${YEAR} - birth_year AS age FROM passenger WHERE city = ${lit(c)}`,
        names: true,
        hint: `${YEAR} - birth_year AS age — вычисляемый столбец с именем.`,
      });
    })();
  // упорядочение внутри отбора
  if (shelves.length)
    (() => {
      const s = pick(shelves, r),
        desc = r() < 0.5;
      T.push({
        title: `Полка ${s}`,
        text: `Грузчик снимает чемоданы с полки ${s} — ${desc ? 'от тяжёлых к лёгким' : 'от лёгких к тяжёлым'}. Бирка и вес.`,
        q: `В каком порядке снимать чемоданы с полки ${s}?`,
        goals: [`Только полка ${s}`, 'Столбцы: tag, weight_kg', desc ? 'По убыванию веса' : 'По возрастанию веса'],
        ask: `SELECT tag, weight_kg FROM baggage WHERE shelf = ${s} ORDER BY weight_kg${desc ? ' DESC' : ''}`,
        order: ['weight_kg'],
        hint: 'WHERE … ORDER BY weight_kg — по возрастанию; DESC — по убыванию.',
      });
    })();
  // различные значения
  if (tiers.length)
    (() => {
      const t = pick(tiers, r);
      T.push({
        title: 'Откуда владельцы карт',
        text: `Отдел лояльности хочет знать, из каких городов летят владельцы карты «${t}». Каждый город — один раз, по алфавиту.`,
        q: `Из каких городов владельцы карты «${t}»?`,
        goals: ['Столбец: city', `Только loyalty = «${t}»`, 'Без повторов, по алфавиту'],
        ask: `SELECT DISTINCT city FROM passenger WHERE loyalty = ${lit(t)} ORDER BY city`,
        order: ['city'],
        hint: 'SELECT DISTINCT … WHERE … ORDER BY …',
      });
    })();
  // первые строки: у самых тяжёлых чемоданов вес разный, ничьей на границе нет
  if (B.length >= 6)
    (() => {
      const n = int(2, 5, r),
        bags = plural(n, 'чемодан', 'чемодана', 'чемоданов');
      T.push({
        title: `${n} самых тяжёлых`,
        text: `Для центровки нужны ${n} самых тяжёлых ${bags}: бирка, полка и вес — от тяжёлого к лёгкому.`,
        q: `Какие ${n} ${bags} самые тяжёлые?`,
        goals: ['Столбцы: tag, shelf, weight_kg', 'По убыванию веса', `Только ${n}`],
        ask: `SELECT tag, shelf, weight_kg FROM baggage ORDER BY weight_kg DESC LIMIT ${n}`,
        order: ['weight_kg'],
        hint: `ORDER BY … DESC LIMIT ${n}`,
      });
    })();
  return pick(T, r);
}
