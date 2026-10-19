// ЛР-15 · «Посадка по запросу» — выборка данных. Общий ход лаб на запросы — common/qlab.js,
// вход, прогресс, вердикты, протокол — common/shell.js, сцена — зал ожидания у выхода (common/three/terminal.js).
import {createTerminal, sleep} from '../../common/three/terminal.js';
import {makeData, baseSql, levels, TABLES, COLS, FLIGHT} from './data.js';
import {$} from '../../common/util.js';
import {initShell, boot, G} from '../../common/shell.js';
import {queryLab} from '../../common/qlab.js';
import {SELECT_REF, WHERE_REF, ORDER_REF} from '../../common/sqlref.js';

const PTS = {
  star: 0.5,
  cols: 0.5,
  eq: 0.75,
  cmp: 0.75,
  range: 0.75,
  inlist: 0.5,
  like: 0.75,
  order2: 0.75,
  paren: 0.75,
  null: 0.75,
  distinct: 0.5,
  top: 0.5,
  final: 1.25,
};
const W = createTerminal($('stage'), {kind: 'gate'}); // зал ожидания у выхода C15
W.setSpeed(3);
const Q = queryLab({
  W,
  TABLES,
  COLS,
  sleep,
  tablesHint:
    'Таблицы: <code>passenger</code>, <code>baggage</code>, <code>loyalty</code>, <code>flight</code>. Щёлкните пассажира, чемодан или табличку — увидите строку.',
});

const INTRO = `<p>Робот-СУБД отвечает на вопросы: обходит строки, у каждой проверяет условие <code>WHERE</code> и кладёт в ответ только подходящие — в зале видно, кого он выбрал.</p>`;
const head = more => `<span class="tag">ЛР-15</span><h2>Выборка данных: SELECT, WHERE, ORDER BY</h2>${INTRO}
    <p class="mu">13 уровней: первые запросы, отбор строк, условия посложнее и ответ заказчику. Перед каждым запросом — вопрос, после — число строк. ${more}</p>`;
initShell({
  lab: 'lr15',
  storeKey: 'air3d-lr15-',
  world: W,
  makeData,
  levels,
  baseSql,
  REF: [SELECT_REF, WHERE_REF, ORDER_REF],
  REF_NEED: ['cmp', 'range', 'order2', 'distinct', 'top', 'final'],
  PTS,
  TABLES,
  COLS,
  prepare: D => {
    D.meta = new Map(D.P.map(p => [p.id, {kid: p.kid, female: p.female, old: p.old}]));
  },
  head: head('Вариант задаётся вашим местом в списке группы — у соседа данные другие.'),
  legacyHead: head('Номер в журнале задаёт данные и вопросы — у соседа они другие.'),
  startLabel: 'На борт',
  flight: () => FLIGHT,
  end: {tag: 'Смена окончена', stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0), 'неверных ответов']},
  protoTitle: 'ЛР-15 «Выборка данных: SELECT, WHERE, ORDER BY»',
  questions: [
    'Уровень «Весь рейс»: сколько строк вернул SELECT * FROM passenger и почему в ответ попали все пассажиры?',
    'Уровень «Тяжёлый багаж»: почему число в условии пишется без кавычек, а название города — в кавычках?',
    'Уровень «Скобки решают»: сколько строк со скобками и сколько было бы без них? Почему разница?',
    'Почему условие birth_year = NULL не возвращает строк, а birth_year IS NULL возвращает?',
    'Уровень «Вопрос заказчика»: сколько строк вы ожидали и сколько получили?',
  ],
  run: Q.run,
  startLevel: Q.startLevel,
  renderMission: Q.renderMission,
  pick: Q.pick,
});
boot();
