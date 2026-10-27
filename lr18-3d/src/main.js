// ЛР-18 · «Заказ в заказе» — подзапросы. Общий ход лаб на запросы — common/qlab.js,
// вход, прогресс, вердикты, протокол — common/shell.js, сцена — пиццерия (common/three/pizzeria.js).
import {createPizzeria, sleep} from '../../common/three/pizzeria.js';
import {makeData, baseSql, TABLES, COLS, sel, pizzaColor} from '../../common/pizzadata.js';
import {levels} from './levels.js';
import {$} from '../../common/util.js';
import {initShell, boot, G} from '../../common/shell.js';
import {queryLab} from '../../common/qlab.js';
import {practice} from './practice.js';
import {SUBQ_REF, GROUP_REF, JOIN_REF} from '../../common/sqlref.js';

const PTS = {
  aboveavg: 0.4,
  maxrow: 0.4,
  belowavg: 0.4,
  minrow: 0.4,
  firstday: 0.4,
  biggroup: 0.55,
  inlist: 0.4,
  incond: 0.4,
  bytransport: 0.4,
  nophone: 0.4,
  notexists: 0.4,
  notin: 0.55,
  unsold: 0.4,
  quiet: 0.4,
  sub2: 0.4,
  join2: 0.55,
  exists: 0.4,
  corr: 0.55,
  final: 1.2,
};
// уровни, добавленные позже: тем, кто прошёл лабу раньше, засчитываются сами
const ADDED = ['belowavg', 'minrow', 'firstday', 'bytransport', 'nophone', 'unsold', 'quiet', 'exists', 'corr'];
const W = createPizzeria($('stage'), {pizzaColor});
W.setSpeed(3);
const Q = queryLab({
  W,
  TABLES,
  COLS,
  sleep,
  tablesHint:
    'Таблицы: <code>orders</code> (коробки на столе выдачи), <code>pizza</code> (витрина), <code>courier</code> (у двери), <code>client</code> (за столиками). Подзапрос робот выполняет первым — его результат виден над пультом.',
});

const INTRO = `<p>Ответ на вопрос часто зависит от другого ответа: «дороже среднего», «у самой популярной пиццы», «ни разу не возил». Робот-СУБД сначала выполняет внутренний запрос — подзапрос, — подставляет его результат и только потом проверяет каждую строку внешнего.</p>`;
const head = more => `<span class="tag">ЛР-18</span><h2>Подзапросы</h2>${INTRO}
    <p class="mu">19 уровней: подзапрос вместо числа, подзапрос со списком, EXISTS, NOT EXISTS и ловушка NOT IN, связанный подзапрос, один вопрос — два решения. ${more}</p>`;
initShell({
  lab: 'lr18',
  storeKey: 'pizza-lr18-',
  world: W,
  makeData,
  levels,
  baseSql,
  sel,
  REF: [SUBQ_REF, GROUP_REF, JOIN_REF],
  REF_NEED: ['aboveavg', 'inlist', 'notexists', 'notin', 'final'],
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
  endTitle: () => 'Все заказы собраны',
  variant: () => 'пиццерия SQL Pizza',
  end: {tag: 'Заказ в заказе', stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0), 'неверных ответов']},
  protoTitle: 'ЛР-18 «Подзапросы»',
  questions: [
    'Уровень «Дороже среднего»: какое число вернул подзапрос сам по себе и как оно объясняет ответ внешнего запроса?',
    'Уровень «Самая популярная»: какой код пиццы вернул подзапрос и сколько у неё заказов?',
    'Уровни «Курьер без доставок» и «Тот же вопрос через NOT IN»: сколько строк дал каждый способ? Почему NOT IN без отбора пустых значений не вернул бы ни одной строки?',
    'Уровни «Вегетарианцы»: сколько строк дал подзапрос и сколько соединение (с DISTINCT и без)? Какое решение вы оставили бы в рабочей системе и почему?',
    'Уровень «Лучшие гости»: какую среднюю трату гостя вернул подзапрос на месте таблицы?',
  ],
  run: Q.run,
  startLevel: Q.startLevel,
  renderMission: Q.renderMission,
  pick: Q.pick,
  practice,
});
boot();
