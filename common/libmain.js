// Общий запуск лаб библиотеки (ЛР-21–24): рабочее место как в pgAdmin — common/pgworld.js (дерево объектов,
// окно запросов, вкладки результата), ход лабы — common/qlab.js, вход, прогресс, вердикты, протокол — common/shell.js.
// main.js лабы передаёт только своё: уровни, баллы, вопросы. 3D-сцена библиотеки (common/three/library.js) этим лабам
// больше не нужна: в них работают со структурой базы, а студенты дальше пойдут в настоящий pgAdmin.
import {createPgWorld, sleep} from './pgworld.js';
import {sound} from './sfx.js';
import {makeData, baseSql, TABLES, COLS, sel} from './libdata.js';
import {$} from './util.js';
import {initShell, boot, G} from './shell.js';
import {queryLab} from './qlab.js';

// значения в примерах справочника — по-английски, как и данные этих лаб (сам справочник общий с ЛР-13–20)
const EN = {
  Орлова: 'Orlova',
  Тула: 'Tula',
  Ким: 'Kim',
  Лебедев: 'Lebedev',
  Сафин: 'Safin',
  старший: 'senior',
  'Имя ': 'Name ',
  Казань: 'Kazan',
  пилот: 'pilot',
  Омск: 'Omsk',
  Сочи: 'Sochi',
};
const enRef = groups => groups.map(g => g.map(([t, ex]) => [t, ex.replace(/'([^']*)'/g, (m, v) => (v in EN ? `'${EN[v]}'` : m))]));

// base — своя исходная база (ЛР-23 начинает с таблицы на 20 000 строк)
export function libLab({lab, title, intro, about, levels, PTS, REF, REF_NEED = [], questions, practice, added, base = baseSql}) {
  const W = createPgWorld($('stage'), {db: 'library'});
  sound.muted = true; // без звуков: рабочая среда, а не игра
  const Q = queryLab({
    W,
    TABLES,
    COLS,
    sleep,
    maxRows: 500,
    tablesHint:
      'Таблицы схемы <code>library</code>: <code>book</code> — книги, <code>author</code> — авторы, <code>reader</code> — читатели, <code>loan</code> — выдачи. Объекты базы — в дереве слева, оно обновляется после каждой команды. Метакоманды psql: <code>\\d book</code>, <code>\\di</code>, <code>\\dp</code>.',
  });
  const head = more =>
    `<span class="tag">${lab.replace('lr', 'ЛР-')}</span><h2>${title}</h2><p>${intro}</p><p class="mu">${about} ${more}</p>`;
  initShell({
    lab,
    storeKey: `library-${lab}-`,
    world: W,
    makeData,
    levels,
    baseSql: base,
    sel,
    REF: enRef(REF),
    REF_NEED,
    PTS,
    added,
    TABLES,
    COLS,
    gated: true,
    flat: true,
    lockIcon: '·',
    head: head('Вариант задаётся вашим местом в списке группы — у соседа данные другие.'),
    legacyHead: head('Номер в журнале задаёт данные и вопросы — у соседа они другие.'),
    startLabel: 'Начать',
    closedTitle: 'Лабораторная ещё закрыта',
    finalIcon: 'К',
    flight: () => 'Библиотека',
    endTitle: () => 'Лабораторная пройдена',
    variant: () => 'городская библиотека, схема library',
    end: {tag: title, stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0), 'неверных ответов']},
    protoTitle: `${lab.replace('lr', 'ЛР-')} «${title}»`,
    questions,
    run: Q.run,
    startLevel: Q.startLevel,
    renderMission: Q.renderMission,
    pick: Q.pick,
    practice,
  });
  boot();
}
