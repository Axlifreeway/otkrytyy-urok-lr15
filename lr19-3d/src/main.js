// ЛР-19 · «Закрепление» — запросы к своей базе. Общий ход лаб на запросы — common/qlab.js,
// вход, прогресс, вердикты, протокол — common/shell.js, сцена — пиццерия (common/three/pizzeria.js).
import {createPizzeria, sleep} from '../../common/three/pizzeria.js';
import {makeData, baseSql, TABLES, COLS, sel, pizzaColor} from '../../common/pizzadata.js';
import {levels} from './levels.js';
import {$} from '../../common/util.js';
import {initShell, boot, G} from '../../common/shell.js';
import {queryLab} from '../../common/qlab.js';
import {practice} from './practice.js';
import {SELECT_REF, WHERE_REF, ORDER_REF, JOIN_REF, GROUP_REF, SUBQ_REF} from '../../common/sqlref.js';

// ч. 1 — по 0,35; ч. 2 — по 0,4; ч. 3 — по 0,45; ч. 4 (дополнительные) — по 0,4; проверка — 0,7 (всего 9)
const PTS = {
  menu: 0.35,
  month: 0.35,
  big: 0.35,
  letter: 0.35,
  nophone: 0.35,
  named: 0.4,
  one: 0.4,
  total: 0.4,
  per: 0.4,
  twice: 0.4,
  avgp: 0.4,
  over: 0.45,
  never: 0.45,
  newest: 0.45,
  veg: 0.4,
  fleet: 0.4,
  pickup: 0.4,
  cheap: 0.4,
  district: 0.4,
  percour: 0.4,
  months: 0.4,
  check: 0.7,
};
// уровни, добавленные позже: тем, кто прошёл лабу раньше, засчитываются сами
const ADDED = ['veg', 'fleet', 'pickup', 'cheap', 'district', 'percour', 'months'];
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

const INTRO = `<p>Новых команд нет — пятнадцать запросов задания к своей пиццерии (отбор и порядок, соединение и группировка, подзапросы) и семь дополнительных. Робот показывает каждый ответ на кухне, у каждого запроса — число строк.</p>`;
const head = more => `<span class="tag">ЛР-19</span><h2>Закрепление: запросы к своей базе</h2>${INTRO}
    <p class="mu">22 уровня: по одному на каждый запрос задания и семь дополнительных. Последний — проверка запроса № 9 по запросу № 8. ${more}</p>`;
initShell({
  lab: 'lr19',
  storeKey: 'pizza-lr19-',
  world: W,
  makeData,
  levels,
  baseSql,
  sel,
  REF: [SELECT_REF, WHERE_REF, ORDER_REF, JOIN_REF, GROUP_REF, SUBQ_REF],
  REF_NEED: [],
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
  endTitle: () => 'Пятнадцать запросов — пятнадцать ответов',
  variant: () => 'пиццерия SQL Pizza',
  end: {tag: 'Закрепление', stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0), 'неверных ответов']},
  protoTitle: 'ЛР-19 «Закрепление: запросы к своей базе»',
  questions: [
    'Сведите в таблицу: № запроса — что нужно было найти — число строк ответа (все 15).',
    'Проверка: какое число дал запрос № 8 и какую сумму — запрос № 15? Совпали ли они и почему должны совпадать?',
    'Запрос № 13: каким способом вы нашли пиццы без заказов (LEFT JOIN … IS NULL или NOT EXISTS) и почему он даёт верный ответ?',
  ],
  run: Q.run,
  startLevel: Q.startLevel,
  renderMission: Q.renderMission,
  pick: Q.pick,
  practice,
});
boot();
