// ПРОБА: ЛР-17 «Итоги смены» в пиццерии из готовых моделей (KayKit + Kenney, см. testing/README.md).
// Уровни, проверка и тренировка — те же, что в lr17-3d; другая только обстановка сцены (testing/src/kit.js).
import {createPizzeria, sleep} from '../../common/three/pizzeria.js';
import {makeData, baseSql, TABLES, COLS, sel, pizzaColor} from '../../common/pizzadata.js';
import {levels} from '../../lr17-3d/src/levels.js';
import {loadKit} from './kit.js';
import {$} from '../../common/util.js';
import {initShell, boot, G} from '../../common/shell.js';
import {queryLab} from '../../common/qlab.js';
import {practice} from '../../lr17-3d/src/practice.js';
import {GROUP_REF, SELECT_REF, JOIN_REF} from '../../common/sqlref.js';

const PTS = {
  count: 0.5,
  sum: 0.5,
  avg: 0.5,
  nulls: 0.5,
  bypizza: 0.5,
  sumcour: 0.75,
  minmax: 0.75,
  byday: 0.75,
  having: 0.75,
  havsum: 0.75,
  wherehav: 1,
  aggwhere: 0.5,
  final: 1.25,
};
(async () => {
  // модели грузятся до сцены: без них зал пустой
  const kit = await loadKit();
  const W = createPizzeria($('stage'), {pizzaColor, kit});
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
    <p class="mu">13 уровней: итог по всей таблице, итоги по группам, отбор групп и контрольный отчёт. Перед каждым запросом — вопрос, после — проверка суммой. ${more}</p>`;
  initShell({
    lab: 'lr17',
    storeKey: 'pizza-kit-lr17-', // отдельно от настоящей ЛР-17
    world: W,
    makeData,
    levels,
    baseSql,
    sel,
    REF: [GROUP_REF, JOIN_REF, SELECT_REF],
    REF_NEED: ['bypizza', 'having', 'wherehav', 'aggwhere', 'final'],
    PTS,
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
})();
