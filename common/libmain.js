// Общий запуск лаб библиотеки (ЛР-21–24): сцена common/three/library.js, ход лабы — common/qlab.js,
// вход, прогресс, вердикты, протокол — common/shell.js. main.js лабы передаёт только своё: уровни, баллы, вопросы.
import {createLibrary, sleep} from './three/library.js';
import {makeData, baseSql, TABLES, COLS, sel} from './libdata.js';
import {$} from './util.js';
import {initShell, boot, G} from './shell.js';
import {queryLab} from './qlab.js';

// base — своя исходная база (ЛР-23 начинает с таблицы на 20 000 строк)
export function libLab({lab, title, intro, about, levels, PTS, REF, REF_NEED = [], questions, practice, added, base = baseSql}) {
  const W = createLibrary($('stage'));
  W.setSpeed(3);
  const Q = queryLab({
    W,
    TABLES,
    COLS,
    sleep,
    tablesHint:
      'Таблицы схемы <code>library</code>: <code>book</code> (стеллажи), <code>author</code> (портреты), <code>reader</code> (читальный зал), <code>loan</code> (формуляры на кафедре). Шкафы каталога — индексы. Метакоманды psql: <code>\\d book</code>, <code>\\di</code>, <code>\\dp</code>.',
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
    REF,
    REF_NEED,
    PTS,
    added,
    TABLES,
    COLS,
    gated: true,
    head: head('Вариант задаётся вашим местом в списке группы — у соседа данные другие.'),
    legacyHead: head('Номер в журнале задаёт данные и вопросы — у соседа они другие.'),
    startLabel: 'В библиотеку',
    closedTitle: 'Библиотека ещё закрыта',
    finalIcon: '📚',
    flight: () => 'Библиотека',
    endTitle: () => 'Смена в библиотеке окончена',
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
