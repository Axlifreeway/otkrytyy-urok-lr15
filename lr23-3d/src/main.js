// ЛР-23 · «Индексы: создание и проверка по плану» — библиотека. Общий запуск — common/libmain.js.
import {libLab} from '../../common/libmain.js';
import {baseSql, FILL} from '../../common/libdata.js';
import {levels} from './levels.js';
import {INDEX_REF, PLAN_REF} from '../../common/sqlref.js';

libLab({
  lab: 'lr23',
  title: 'Индексы: создание и проверка по плану',
  intro:
    'Индекс — шкаф каталога: по карточке робот-СУБД сразу находит полку, не обходя все стеллажи. Каждый CREATE INDEX ставит в зал новый шкаф, DROP INDEX — убирает. Помогает ли индекс, доказывает план — EXPLAIN ANALYZE до и после.',
  about:
    '6 уровней: запрос без индекса, индекс под запрос, индекс на внешний ключ, список индексов, лишний индекс и контрольный. В book — 20 000 строк.',
  levels,
  base: D => baseSql(D) + FILL + ';\nANALYZE;\n',
  PTS: {before: 1.25, create: 2, fk: 1.5, list: 0.75, extra: 1.5, final: 2},
  REF: [INDEX_REF, PLAN_REF],
  REF_NEED: ['create', 'fk', 'extra', 'final'],
  questions: [
    'Сведите в таблицу: запрос — способ чтения до — способ чтения после — время до / после, мс.',
    'Уровень «Поиск без индекса»: сколько строк прочитано зря (Rows Removed by Filter)?',
    'Уровень «Индекс на внешний ключ»: какой способ чтения получился и почему СУБД не создаёт такой индекс сама?',
    'Уровень «Лишний индекс»: почему он лишний? (одной строкой)',
  ],
});
