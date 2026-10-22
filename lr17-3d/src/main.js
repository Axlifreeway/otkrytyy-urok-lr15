// ЛР-17 · «Итоги смены» — группировка и итоги. Общий ход лаб на запросы — common/qlab.js,
// вход, прогресс, вердикты, протокол — common/shell.js, сцена — пиццерия (common/three/pizzeria.js).
import {createPizzeria, sleep} from '../../common/three/pizzeria.js';
import {makeData, baseSql, TABLES, COLS, sel, pizzaColor} from '../../common/pizzadata.js';
import {levels} from './levels.js';
import {$} from '../../common/util.js';
import {initShell, boot, G} from '../../common/shell.js';
import {queryLab} from '../../common/qlab.js';
import {practice} from './practice.js';
import {GROUP_REF, SELECT_REF, JOIN_REF} from '../../common/sqlref.js';

const PTS = {
  count: 0.35,
  sum: 0.35,
  avg: 0.35,
  nulls: 0.35,
  minmax1: 0.35,
  qty: 0.35,
  uniq: 0.35,
  bypizza: 0.35,
  sumcour: 0.4,
  minmax: 0.4,
  byday: 0.4,
  bydist: 0.35,
  veg: 0.4,
  transport: 0.4,
  avgdist: 0.4,
  having: 0.4,
  havsum: 0.4,
  busy: 0.4,
  hotdays: 0.4,
  wherehav: 0.6,
  aggwhere: 0.35,
  final: 0.9,
};
// уровни, добавленные позже: тем, кто прошёл лабу раньше, засчитываются сами
const ADDED = ['minmax1', 'qty', 'uniq', 'bydist', 'veg', 'transport', 'avgdist', 'busy', 'hotdays'];
const W = createPizzeria($('stage'), {pizzaColor});
W.setSpeed(3);
const Q = queryLab({
  W,
  TABLES,
  COLS,
  sleep,
  tablesHint:
    'Таблицы: <code>orders</code> (коробки на столе выдачи), <code>pizza</code> (витрина), <code>courier</code> (у двери), <code>client</code> (за столиками). Щёлкните — увидите строку.',
});

const INTRO = `<p>Робот-СУБД считает итоги прямо на кухне: отбирает заказы по <code>WHERE</code>, раскладывает коробки стопками по <code>GROUP BY</code>, над каждой стопкой — итог, а <code>HAVING</code> гасит лишние стопки.</p>`;
const head = more => `<span class="tag">ЛР-17</span><h2>Группировка и итоги: GROUP BY и HAVING</h2>${INTRO}
    <p class="mu">22 уровня: итог по всей таблице, итоги по группам, отбор групп и контрольный отчёт. Перед каждым запросом — вопрос, после — проверка суммой. ${more}</p>`;
initShell({
  lab: 'lr17',
  storeKey: 'pizza-lr17-',
  world: W,
  makeData,
  levels,
  baseSql,
  sel,
  REF: [GROUP_REF, JOIN_REF, SELECT_REF],
  REF_NEED: ['bypizza', 'having', 'wherehav', 'aggwhere', 'final'],
  PTS,
  added: ADDED,
  TABLES,
  COLS,
  gated: true,
  head: head('Вариант задаётся вашим местом в списке группы — у соседа данные другие.'),
  legacyHead: head('Номер в журнале задаёт данные и вопросы — у соседа они другие.'),
  startLabel: 'На смену',
  closedTitle: 'Пиццерия ещё закрыта',
  finalIcon: '🍕',
  flight: () => 'SQL Pizza',
  endTitle: () => 'Смена закрыта — отчёт у владельца',
  variant: () => 'пиццерия SQL Pizza',
  end: {tag: 'Итоги смены', stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0), 'неверных ответов']},
  protoTitle: 'ЛР-17 «Группировка и итоги: GROUP BY и HAVING»',
  questions: [
    'Уровень «Где курьер?»: какие числа дали count(*) и count(courier_id) и на что указывает разница?',
    'Уровень «Заказы по пиццам»: сложите количества по группам и сравните с числом всех заказов. Совпало? Если бы не совпало — из-за чего?',
    'Уровень «Выручка курьеров»: почему сумма выручки курьеров меньше выручки за всё время?',
    'Уровень «Районы доставки»: что отбирает WHERE и что отбирает HAVING (одной строкой каждое)?',
    'Уровень «Агрегат в WHERE»: приведите текст отказа СУБД и объясните, почему агрегат нельзя писать в WHERE.',
    'Уровень «Отчёт за октябрь»: сколько строк вы ожидали и сколько получили?',
  ],
  run: Q.run,
  startLevel: Q.startLevel,
  renderMission: Q.renderMission,
  pick: Q.pick,
  practice,
});
boot();
