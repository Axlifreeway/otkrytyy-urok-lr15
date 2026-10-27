// ЛР-20 · «Касса» — изменение данных в транзакции. Общий ход лаб на запросы — common/qlab.js,
// вход, прогресс, вердикты, протокол — common/shell.js, сцена — пиццерия (common/three/pizzeria.js).
import {createPizzeria, sleep} from '../../common/three/pizzeria.js';
import {makeData, baseSql, TABLES, COLS, sel, pizzaColor} from '../../common/pizzadata.js';
import {levels} from './levels.js';
import {$} from '../../common/util.js';
import {initShell, boot, G} from '../../common/shell.js';
import {queryLab} from '../../common/qlab.js';
import {TX_REF, INSERT_REF, UPDATE_REF, SELECT_REF} from '../../common/sqlref.js';

const PTS = {
  ins2: 0.5,
  upd1: 0.5,
  aim: 0.6,
  del: 0.5,
  qtyfix: 0.5,
  phone: 0.45,
  cancel: 0.5,
  guarded: 0.45,
  forget: 0.45,
  txroll: 0.6,
  txcommit: 0.5,
  oops: 0.5,
  swap: 0.6,
  parent: 0.7,
  abort: 0.7,
  final: 0.95,
};
// уровни, добавленные позже: тем, кто прошёл лабу раньше, засчитываются сами
const ADDED = ['qtyfix', 'phone', 'cancel', 'guarded', 'forget', 'txcommit', 'swap'];
const W = createPizzeria($('stage'), {pizzaColor});
W.setSpeed(3);
const Q = queryLab({
  W,
  TABLES,
  COLS,
  sleep,
  tablesHint:
    'Таблицы: <code>pizza</code> (витрина), <code>orders</code> (коробки на столе выдачи), <code>client</code> (за столиками), <code>courier</code> (у двери). Изменения видны сразу — и внутри транзакции тоже.',
});

const INTRO = `<p>Касса пиццерии меняет данные: новые пиццы, цены, гости и заказы. Робот-СУБД выполняет изменения в транзакции — несколько команд, которые проходят целиком или не проходят совсем. Над пультом — приглашение как в psql: <code>pizza=*&gt;</code> — транзакция идёт, <code>pizza=!&gt;</code> — прервана ошибкой.</p>`;
const head = more => `<span class="tag">ЛР-20</span><h2>Изменение данных в транзакции</h2>${INTRO}
    <p class="mu">16 уровней: повторение INSERT, UPDATE, DELETE и внешнего ключа; BEGIN, COMMIT и ROLLBACK, родитель и ссылка в одной транзакции, ошибка внутри транзакции. Каждое изменение проверяется запросом SELECT. ${more}</p>`;
initShell({
  lab: 'lr20',
  storeKey: 'pizza-lr20-',
  world: W,
  makeData,
  levels,
  baseSql,
  sel,
  REF: [TX_REF, INSERT_REF, UPDATE_REF, SELECT_REF],
  REF_NEED: ['txroll', 'oops', 'parent', 'abort', 'final'],
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
  endTitle: () => 'Касса закрыта',
  variant: () => 'пиццерия SQL Pizza',
  end: {tag: 'Касса', stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0), 'неверных ответов']},
  protoTitle: 'ЛР-20 «Изменение данных в транзакции»',
  questions: [
    'Сведите в таблицу: команда — ответ СУБД — что стало с данными (по всем уровням).',
    'Уровень «Сначала прицелиться»: сколько строк вернул SELECT и сколько изменил UPDATE? Зачем перед UPDATE и DELETE выполнять SELECT с тем же условием?',
    'Уровни «Передумали» и «Забыли WHERE»: что видно внутри транзакции до ROLLBACK и что — после?',
    'Уровень «Новый гость и его заказ»: почему гостя и заказ добавляют в одной транзакции? Что было бы, если бы второй INSERT не прошёл?',
    'Уровень «Ошибка посреди транзакции»: приведите ответ СУБД на SELECT после ошибки и объясните, почему верное изменение тоже отменено.',
  ],
  run: Q.run,
  startLevel: Q.startLevel,
  renderMission: Q.renderMission,
  pick: Q.pick,
});
boot();
