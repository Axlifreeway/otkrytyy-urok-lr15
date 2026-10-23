// ЛР-17 · «Итоги смены» — группировка и итоги: count, sum, avg, min, max, GROUP BY, HAVING.
// База — пиццерия (common/pizzadata.js); студент только задаёт вопросы, данные не меняются.
import {lit, dayRu, rub, YEAR} from '../../common/pizzadata.js';

const by = (a, f) => a.reduce((m, x) => m.set(f(x), (m.get(f(x)) || 0) + 1), new Map());
const sumBy = (a, f, v) => a.reduce((m, x) => m.set(f(x), (m.get(f(x)) || 0) + v(x)), new Map());
// порог, при котором условию «> порог» (или «>= порог») отвечают от lo до hi значений из vals;
// если так не выходит — любой, при котором хоть одно значение проходит и хоть одно отбрасывается
function cut(vals, lo, hi, strict = true) {
  const u = [...new Set(vals)].sort((a, b) => a - b);
  const n = t => vals.filter(v => (strict ? v > t : v >= t)).length;
  const ok = u.filter(t => n(t) >= lo && n(t) <= hi && n(t) < vals.length);
  if (ok.length) return ok[Math.floor(ok.length / 2)];
  const some = u.filter(t => n(t) >= 1 && n(t) < vals.length);
  return some.length ? some[Math.floor(some.length / 2)] : u[0];
}

export function levels(D) {
  const O = D.OR;
  const perDay = by(O, o => o.ordered);
  const day = [...perDay].filter(([, n]) => n >= 3).map(([d]) => d)[0] || D.days[0];
  const OCT = `${YEAR}-10-01`;
  const perPizza = by(O, o => o.pizza_id);
  const nHave = cut([...perPizza.values()], 2, 4);
  const perClient = sumBy(
    O,
    o => o.client_id,
    o => o.amount,
  );
  const tSum = Math.round(cut([...perClient.values()], 3, 5) / 100) * 100;
  const dist = by(
    O.filter(o => o.courier_id !== null),
    o => D.CL.find(c => c.id === o.client_id).district,
  );
  const kDist = cut([...dist.values()], 2, 3, false);
  const oct = O.filter(o => o.ordered >= OCT);
  const kFin = Math.max(2, cut([...by(oct, o => o.pizza_id).values()], 2, 4, false));
  const nWhere = cut([...perPizza.values()], 2, 4);
  const POJ = 'FROM orders o JOIN pizza p ON p.id = o.pizza_id';
  const kBusy = cut(
    [
      ...by(
        O.filter(o => o.courier_id !== null),
        o => o.courier_id,
      ).values(),
    ],
    1,
    3,
    false,
  );
  const tDay =
    Math.round(
      cut(
        [
          ...sumBy(
            O,
            o => o.ordered,
            o => o.amount,
          ).values(),
        ],
        3,
        5,
      ) / 100,
    ) * 100;
  return [
    // ═══════════════════════════════ часть 1 · итог по всей таблице
    {
      key: 'count',
      title: 'Сколько заказов за день',
      lab: 'ч. 1 · количество строк по условию',
      text: `Управляющий спрашивает, сколько заказов было ${dayRu(day)}. Ответ — одно число: робот пересчитает коробки этого дня.`,
      q: `Сколько заказов было ${dayRu(day)}?`,
      goals: ['Таблица orders', `ordered = '${day}'`, 'Ответ — одно число: count(*)'],
      ask: `SELECT count(*) FROM orders WHERE ordered = ${lit(day)}`,
      hint: "SELECT count(*) FROM [таблица] WHERE [условие]; — дата пишется как текст: ordered = 'ГГГГ-ММ-ДД'.",
      ok: 'count(*) свёл все подходящие строки к одному числу.',
    },
    {
      key: 'sum',
      title: 'Выручка за октябрь',
      lab: 'ч. 1 · сумма по числовому столбцу',
      text: 'Бухгалтер считает выручку за октябрь — сумму столбца amount по заказам с 1 октября.',
      q: 'На какую сумму продано в октябре?',
      goals: [`ordered не раньше '${OCT}'`, 'Ответ — sum(amount)'],
      ask: `SELECT sum(amount) FROM orders WHERE ordered >= ${lit(OCT)}`,
      hint: "sum([столбец]) складывает значения отобранных строк: … WHERE ordered >= '2026-10-01'.",
      ok: 'sum сложил суммы всех октябрьских заказов.',
    },
    {
      key: 'avg',
      title: 'Средний чек',
      lab: 'ч. 1 · среднее значение',
      text: 'Маркетолог хочет знать средний чек — среднюю сумму заказа за всё время, округлённую до рубля.',
      q: 'Какой средний чек?',
      goals: ['Среднее amount по всем заказам', 'Округлить до рубля: round(avg(amount))'],
      ask: 'SELECT round(avg(amount)) FROM orders',
      hint: 'avg([столбец]) — среднее; round(…) — округление до целого.',
      ok: 'avg — сумма, делённая на число строк; round убрал копейки.',
    },
    {
      key: 'nulls',
      title: 'Где курьер?',
      lab: 'ч. 1 · count(*) и count(столбец)',
      text: 'Сравните два числа одним запросом: сколько всего заказов — count(*) — и у скольких заполнен курьер — count(courier_id). Самовывоз курьера не имеет.',
      q: 'Сколько всего заказов и сколько из них с курьером?',
      goals: ['Два столбца: count(*) и count(courier_id)', 'Вся таблица orders'],
      ask: 'SELECT count(*), count(courier_id) FROM orders',
      pred: {
        q: 'count(courier_id) по сравнению с count(*) будет…',
        choices: [
          {k: 'more', t: 'больше'},
          {k: 'same', t: 'столько же'},
          {k: 'less', t: 'меньше'},
        ],
        answer: 'less',
      },
      hint: 'count(*) считает строки, count(courier_id) — только строки, где курьер заполнен.',
      ok: 'Разница между числами — заказы с пустым courier_id, то есть самовывоз. Агрегаты пропускают NULL.',
    },
    {
      key: 'minmax1',
      title: 'Крайние заказы',
      lab: 'ч. 1 · min и max по всей таблице',
      text: 'Кассир сверяет чеки: какой заказ был самым мелким и какой самым крупным? Два числа одним запросом.',
      q: 'Какая самая маленькая и самая большая сумма заказа?',
      goals: ['Два столбца: min(amount), max(amount)', 'Вся таблица orders'],
      ask: 'SELECT min(amount), max(amount) FROM orders',
      hint: 'SELECT min([столбец]), max([столбец]) FROM orders; — агрегатов в SELECT может быть несколько.',
      ok: 'min и max прошли по всем строкам и вернули по одному числу.',
    },
    {
      key: 'qty',
      title: 'Коробки за сентябрь',
      lab: 'ч. 1 · сумма по условию',
      text: `Склад считает коробки: сколько пицц (штук, столбец qty) отдали в сентябре — до ${dayRu(OCT)}?`,
      q: 'Сколько пицц продано в сентябре?',
      goals: [`ordered раньше '${OCT}'`, 'Ответ — sum(qty)'],
      ask: `SELECT sum(qty) FROM orders WHERE ordered < ${lit(OCT)}`,
      hint: "sum(qty) — штуки, а не заказы: в одном заказе может быть несколько пицц. … WHERE ordered < '2026-10-01'.",
      ok: 'sum(qty) больше числа сентябрьских заказов — в части заказов по две-три пиццы.',
    },
    {
      key: 'uniq',
      title: 'Сколько разных гостей',
      lab: 'ч. 1 · count(DISTINCT …)',
      text: 'Сколько разных гостей хоть раз заказывали? Один гость с пятью заказами — это один гость.',
      q: 'Сколько разных гостей делали заказы?',
      goals: ['Таблица orders', 'Ответ — count(DISTINCT client_id)'],
      ask: 'SELECT count(DISTINCT client_id) FROM orders',
      must: [{re: /count\s*\(\s*distinct/i, msg: 'посчитайте прямо в orders: count(DISTINCT client_id).'}],
      pred: {
        q: 'Это число по сравнению с числом строк в client будет…',
        choices: [
          {k: 'more', t: 'больше'},
          {k: 'same', t: 'столько же'},
          {k: 'less', t: 'меньше'},
        ],
        answer: 'less',
      },
      hint: 'count(DISTINCT [столбец]) считает разные значения, повторы — один раз.',
      ok: `Гостей в client — ${D.CL.length}, а заказывали меньше: один гость не заказал ничего.`,
    },
    // ═══════════════════════════════ часть 2 · итоги по группам
    {
      key: 'bypizza',
      title: 'Заказы по пиццам',
      lab: 'ч. 2 · количество по группам',
      text: 'Кухня планирует тесто: сколько раз заказывали каждую пиццу? Пока хватит кода пиццы — pizza_id и число заказов. Робот разложит коробки по стопкам.',
      q: 'Сколько заказов у каждой пиццы?',
      goals: ['Столбцы: pizza_id, count(*)', 'GROUP BY pizza_id'],
      ask: 'SELECT pizza_id, count(*) FROM orders GROUP BY pizza_id',
      hint: 'SELECT [столбец], count(*) FROM orders GROUP BY [столбец]; — столбец группировки обязан быть и в SELECT.',
      ok: 'Каждая стопка — группа. Сложите числа по группам: сумма равна числу всех заказов.',
    },
    {
      key: 'sumcour',
      title: 'Выручка курьеров',
      lab: 'ч. 2 · сумма по группам через соединение',
      text: 'Курьерам платят процент с доставленного. Нужна сумма доставленных заказов у каждого курьера — по имени, а не по коду.',
      q: 'На какую сумму доставил каждый курьер?',
      goals: ['Столбцы: name (courier), sum(amount)', 'Соединение orders с courier', 'GROUP BY по имени курьера'],
      ask: 'SELECT c.name, sum(o.amount) FROM orders o JOIN courier c ON c.id = o.courier_id GROUP BY c.name',
      minTables: 2,
      hint: 'FROM orders o JOIN courier c ON c.id = o.courier_id … GROUP BY c.name — группа по названию из справочника.',
      ok: 'Самовывоз в соединение не попал — у него нет пары в courier. А курьер без доставок — нет пары в orders.',
    },
    {
      key: 'minmax',
      title: 'Самый маленький и самый большой',
      lab: 'ч. 2 · min и max по группам',
      text: 'По каждой пицце (по названию): самая маленькая и самая большая сумма заказа.',
      q: 'Какой заказ каждой пиццы был самым маленьким и самым большим?',
      goals: ['Столбцы: name, min(amount), max(amount)', 'Соединение с pizza', 'GROUP BY по названию пиццы'],
      ask: `SELECT p.name, min(o.amount), max(o.amount) ${POJ} GROUP BY p.name`,
      minTables: 2,
      hint: 'В одном SELECT может быть несколько агрегатов: min(o.amount), max(o.amount).',
      ok: 'У пиццы, которую заказывали один раз, min и max совпадают.',
    },
    {
      key: 'byday',
      title: 'Заказы по дням',
      lab: 'ч. 2 · количество по периоду',
      text: 'График нагрузки кухни: сколько заказов было в каждый день работы. Дни — по порядку.',
      q: 'Сколько заказов было в каждый день?',
      goals: ['Столбцы: ordered, count(*)', 'GROUP BY ordered', 'По дате по возрастанию'],
      ask: 'SELECT ordered, count(*) FROM orders GROUP BY ordered ORDER BY ordered',
      order: ['ordered'],
      hint: 'GROUP BY ordered … ORDER BY ordered — сортировка идёт уже по группам.',
      ok: `Дней работы — ${D.days.length}, у каждого свой итог.`,
    },
    {
      key: 'bydist',
      title: 'Гости по районам',
      lab: 'ч. 2 · группы в справочнике',
      text: 'Где живут гости? Сколько гостей из каждого района — таблица client, заказы не нужны.',
      q: 'Сколько гостей в каждом районе?',
      goals: ['Таблица client', 'Столбцы: district, count(*)', 'GROUP BY district'],
      ask: 'SELECT district, count(*) FROM client GROUP BY district',
      hint: 'SELECT district, count(*) FROM client GROUP BY district;',
      ok: `Сумма по районам — ${D.CL.length}, все гости.`,
    },
    {
      key: 'veg',
      title: 'Вегетарианское меню',
      lab: 'ч. 2 · группа по логическому столбцу',
      text: 'Шеф решает, расширять ли вегетарианское меню. Выручка двумя строками: вегетарианские пиццы (veg = true) и остальные.',
      q: 'Сколько принесли вегетарианские пиццы и сколько — остальные?',
      goals: ['Столбцы: veg, sum(amount)', 'Соединение с pizza', 'GROUP BY veg'],
      ask: `SELECT p.veg, sum(o.amount) ${POJ} GROUP BY p.veg`,
      minTables: 2,
      hint: 'GROUP BY p.veg — у столбца два значения, true и false, значит, и групп две.',
      ok: 'Группа — не обязательно название: любой столбец с повторяющимися значениями делит строки на стопки.',
    },
    {
      key: 'transport',
      title: 'На чём возят',
      lab: 'ч. 2 · количество по группам через соединение',
      text: 'Парк курьеров: самокаты, велосипеды, авто. Сколько доставок сделано на каждом виде транспорта?',
      q: 'Сколько доставок на каждом виде транспорта?',
      goals: ['Столбцы: transport, count(*)', 'Соединение orders с courier', 'GROUP BY transport'],
      ask: 'SELECT c.transport, count(*) FROM orders o JOIN courier c ON c.id = o.courier_id GROUP BY c.transport',
      minTables: 2,
      hint: 'FROM orders o JOIN courier c ON c.id = o.courier_id GROUP BY c.transport',
      ok: 'Самовывоз в итог не попал: у него нет курьера, а значит, и транспорта.',
    },
    {
      key: 'avgdist',
      title: 'Средний чек по районам',
      lab: 'ч. 2 · среднее по группам',
      text: 'В каком районе заказывают дороже? Район и средняя сумма заказа, округлённая до рубля (столбец avg_check). Сначала самый высокий чек.',
      q: 'Какой средний чек в каждом районе?',
      goals: ['Столбцы: district, avg_check', 'Соединение orders с client', 'round(avg(amount)) AS avg_check', 'По avg_check, от большего'],
      ask: 'SELECT c.district, round(avg(o.amount)) AS avg_check FROM orders o JOIN client c ON c.id = o.client_id GROUP BY c.district ORDER BY avg_check DESC',
      order: ['avg_check'],
      minTables: 2,
      hint: 'round(avg(o.amount)) AS avg_check … GROUP BY c.district ORDER BY avg_check DESC',
      ok: 'Сортировать можно по псевдониму итога — ORDER BY выполняется после SELECT.',
    },
    // ═══════════════════════════════ часть 3 · отбор групп
    {
      key: 'having',
      title: 'Хиты продаж',
      lab: 'ч. 3 · HAVING по количеству',
      text: `Хитом считается пицца, которую заказывали больше ${nHave} раз. Название и число заказов.`,
      q: `Какие пиццы заказывали больше ${nHave} раз?`,
      goals: ['Столбцы: name, count(*)', `Только группы, где count(*) > ${nHave}`],
      ask: `SELECT p.name, count(*) ${POJ} GROUP BY p.name HAVING count(*) > ${nHave}`,
      minTables: 2,
      hint: `HAVING count(*) > ${nHave} — после GROUP BY: отбирает группы по их итогу.`,
      ok: 'HAVING погасил стопки, у которых итог не прошёл условие.',
    },
    {
      key: 'havsum',
      title: 'Постоянные гости',
      lab: 'ч. 3 · HAVING по сумме',
      text: `Скидочную карту получают гости, заказавшие в сумме больше чем на ${rub(tSum)}. Фамилия и сумма.`,
      q: `Кто заказал больше чем на ${rub(tSum)}?`,
      goals: ['Столбцы: full_name, sum(amount)', 'Соединение с client', `sum(amount) > ${tSum}`],
      ask: `SELECT c.full_name, sum(o.amount) FROM orders o JOIN client c ON c.id = o.client_id GROUP BY c.full_name HAVING sum(o.amount) > ${tSum}`,
      minTables: 2,
      hint: 'GROUP BY c.full_name HAVING sum(o.amount) > [порог]',
      ok: 'Группа — гость, итог — сумма его заказов, HAVING оставил тех, кто выше порога.',
    },
    {
      key: 'busy',
      title: 'Загруженные курьеры',
      lab: 'ч. 3 · HAVING по количеству через соединение',
      text: `Курьерам, сделавшим не меньше ${kBusy} доставок, — премия. Имя курьера и число доставок.`,
      q: `Кто из курьеров сделал не меньше ${kBusy} доставок?`,
      goals: ['Столбцы: name, count(*)', 'Соединение orders с courier', `count(*) >= ${kBusy}`],
      ask: `SELECT c.name, count(*) FROM orders o JOIN courier c ON c.id = o.courier_id GROUP BY c.name HAVING count(*) >= ${kBusy}`,
      minTables: 2,
      hint: `GROUP BY c.name HAVING count(*) >= ${kBusy}`,
      ok: 'Курьер без доставок отпал ещё на соединении, остальные — на HAVING.',
    },
    {
      key: 'hotdays',
      title: 'Горячие дни',
      lab: 'ч. 3 · HAVING по сумме за день',
      text: `Горячий день — выручка больше ${rub(tDay)}. В такие дни нужен второй повар. Дата и выручка, по дате.`,
      q: `В какие дни выручка была больше ${rub(tDay)}?`,
      goals: ['Столбцы: ordered, sum(amount)', `sum(amount) > ${tDay}`, 'По дате по возрастанию'],
      ask: `SELECT ordered, sum(amount) FROM orders GROUP BY ordered HAVING sum(amount) > ${tDay} ORDER BY ordered`,
      order: ['ordered'],
      hint: `GROUP BY ordered HAVING sum(amount) > ${tDay} ORDER BY ordered`,
      ok: 'Порядок частей запроса: WHERE → GROUP BY → HAVING → ORDER BY.',
    },
    {
      key: 'wherehav',
      hard: true,
      title: 'Районы доставки',
      lab: 'сложный · WHERE и HAVING вместе',
      text: `Логист открывает в районе второй пункт, если туда привезли не меньше ${kDist} заказов. Самовывоз не считается. Район и число доставок.`,
      q: `В какие районы привезли не меньше ${kDist} заказов?`,
      goals: ['Столбцы: district, count(*)', 'Только доставка: courier_id заполнен', `count(*) >= ${kDist}`],
      ask: `SELECT c.district, count(*) FROM orders o JOIN client c ON c.id = o.client_id WHERE o.courier_id IS NOT NULL GROUP BY c.district HAVING count(*) >= ${kDist}`,
      minTables: 2,
      pred: {
        q: 'Условие «только доставка» нужно записать…',
        choices: [
          {k: 'where', t: 'в WHERE — это условие на строку'},
          {k: 'having', t: 'в HAVING — это условие на группу'},
          {k: 'any', t: 'всё равно куда'},
        ],
        answer: 'where',
      },
      hint: 'WHERE o.courier_id IS NOT NULL — отбирает строки до группировки; HAVING count(*) >= … — группы после.',
      ok: 'WHERE убрал самовывоз ещё до группировки, HAVING отбросил районы с малым итогом.',
    },
    {
      key: 'aggwhere',
      title: 'Агрегат в WHERE',
      lab: 'ч. 3 · отказ СУБД',
      check: 'error',
      code: '42803',
      errMsg: /not allowed in WHERE/,
      allow: ['SELECT'],
      text: `Проверим правило на деле. Возьмите запрос «пиццы, которых заказали больше ${nWhere} раз» (pizza_id и count(*)) и перенесите условие count(*) > ${nWhere} из HAVING в WHERE. Нужен отказ СУБД — прочитайте его.`,
      q: 'Что ответит СУБД на агрегат в WHERE?',
      goals: ['SELECT pizza_id, count(*) FROM orders', `WHERE count(*) > ${nWhere}`, 'GROUP BY pizza_id', 'Получить отказ СУБД'],
      sol: [`SELECT pizza_id, count(*) FROM orders WHERE count(*) > ${nWhere} GROUP BY pizza_id`],
      wait: 'Запрос выполнился — значит, агрегата в WHERE нет. Перенесите count(*) > … именно в WHERE.',
      other: 'Отказ есть, но другой. Нужен именно агрегат count(*) в WHERE — остальное в запросе должно быть верным.',
      hint: 'Порядок вычисления: FROM → WHERE → GROUP BY → HAVING → SELECT. На шаге WHERE групп ещё нет.',
      ok: 'СУБД отказала: в WHERE агрегатной функции быть не может — групп ещё нет. Условие на итог — только в HAVING.',
    },
    // ═══════════════════════════════ контрольный
    {
      key: 'final',
      hard: true,
      final: true,
      title: 'Отчёт за октябрь',
      lab: 'сложный · контрольный · без подсказок',
      text: `Владелец просит отчёт за октябрь: по каждой пицце, которую в октябре заказали не меньше ${kFin} раз, — название, число заказов (orders_n) и выручка (revenue). Сначала самые доходные.`,
      q: `Какие пиццы в октябре заказали не меньше ${kFin} раз и сколько они принесли?`,
      goals: ['Столбцы: name, orders_n, revenue', `Только октябрь: ordered >= '${OCT}'`, `count(*) >= ${kFin}`, 'По выручке, от большей'],
      ask: `SELECT p.name, count(*) AS orders_n, sum(o.amount) AS revenue ${POJ} WHERE o.ordered >= ${lit(OCT)} GROUP BY p.name HAVING count(*) >= ${kFin} ORDER BY revenue DESC`,
      order: ['revenue'],
      minTables: 2,
      ok: 'Отчёт готов. Проверьте: сумма orders_n не больше числа октябрьских заказов — HAVING часть групп отбросил.',
    },
  ];
}
