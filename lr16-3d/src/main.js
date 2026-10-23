// ЛР-16 · «Зал выдачи багажа» — соединение таблиц. Общий ход лаб на запросы — common/qlab.js,
// вход, прогресс, вердикты, протокол — common/shell.js, сцена — зал выдачи багажа (common/three/terminal.js).
import {createTerminal, sleep} from '../../common/three/terminal.js';
import {makeData, baseSql, levels, TABLES, COLS, FLIGHT, TIERS} from './data.js';
import {$} from '../../common/util.js';
import {initShell, boot, G} from '../../common/shell.js';
import {queryLab} from '../../common/qlab.js';
import {practice} from './practice.js';
import {SELECT_REF, JOIN_REF, ALTER_REF} from '../../common/sqlref.js';

const PTS = {
  links: 0.8,
  owner: 0.45,
  mybags: 0.45,
  dest: 0.45,
  city: 0.45,
  weight: 0.45,
  sorted: 0.45,
  disc: 0.5,
  cardbags: 0.4,
  cross: 0.45,
  three: 0.65,
  dest3: 0.5,
  leftall: 0.5,
  empty: 0.65,
  noflight: 0.5,
  nobag: 0.5,
  final: 0.85,
};
// уровни, добавленные позже: тем, кто прошёл лабу раньше, засчитываются сами
const ADDED = ['mybags', 'weight', 'sorted', 'cardbags', 'dest3', 'leftall', 'noflight'];
const W = createTerminal($('stage'), {kind: 'claim', tiers: TIERS}); // зал выдачи багажа
W.setSpeed(3);
const Q = queryLab({
  W,
  TABLES,
  COLS,
  sleep,
  tablesHint:
    'Таблицы: <code>passenger</code>, <code>baggage</code>, <code>loyalty</code>, <code>flight</code>. Жёлтые стержни — пары, которые собрал JOIN; «∅» — пары нет.',
});

const INTRO = `<p>Ответ на вопрос часто лежит в нескольких таблицах сразу: бирка — в <code>baggage</code>, фамилия — в <code>passenger</code>, скидка — в <code>loyalty</code>. Робот-СУБД соединяет строки по ключам связи — и показывает каждую пару стержнем.</p>`;
const head = more => `<span class="tag">ЛР-16</span><h2>Соединение таблиц в запросе</h2>${INTRO}
    <p class="mu">17 уровней: связи базы, две таблицы, три таблицы, строки без пары. Перед каждым запросом — вопрос, после — число строк. ${more}</p>`;
initShell({
  lab: 'lr16',
  storeKey: 'air3d-lr16-',
  world: W,
  makeData,
  levels,
  baseSql,
  REF: [JOIN_REF, ALTER_REF, SELECT_REF],
  REF_NEED: ['links', 'owner', 'three', 'empty', 'final'],
  PTS,
  added: ADDED,
  TABLES,
  COLS,
  prepare: D => {
    D.meta = new Map(D.P.map(p => [p.id, {kid: p.kid, female: p.female, old: p.old}]));
  },
  head: head('Вариант задаётся вашим местом в списке группы — у соседа данные другие.'),
  legacyHead: head('Номер в журнале задаёт данные и вопросы — у соседа они другие.'),
  startLabel: 'В зал выдачи',
  flight: () => FLIGHT,
  end: {tag: 'Смена окончена', stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0), 'неверных ответов']},
  protoTitle: 'ЛР-16 «Соединение таблиц в запросе»',
  questions: [
    'Уровень «Связи базы»: что ответила СУБД, какие строки помешали и как вы их исправили? Почему без внешнего ключа соединение может молча потерять строки?',
    'Уровень «Забыли условие»: сколько строк вернул запрос без условия соединения и почему именно столько?',
    'Уровень «Приоритетная выдача»: запишите путь соединения (какая таблица с какой и по какому ключу) и разберите одну строку ответа — из каких строк исходных таблиц она собрана.',
    'Уровни «Пустая табличка» и «Налегке»: сколько строк дало левое соединение и сколько дало бы обычное? Откуда в левом соединении пустые значения?',
  ],
  run: Q.run,
  startLevel: Q.startLevel,
  renderMission: Q.renderMission,
  pick: Q.pick,
  practice,
});
boot();
