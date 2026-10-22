// ЛР-22 · «План выполнения запроса: EXPLAIN» — библиотека. Общий запуск — common/libmain.js.
import {libLab} from '../../common/libmain.js';
import {levels} from './levels.js';
import {PLAN_REF, SELECT_REF, JOIN_REF} from '../../common/sqlref.js';

libLab({
  lab: 'lr22',
  title: 'План выполнения запроса: команда EXPLAIN',
  intro:
    'Как робот-СУБД ищет книгу среди 20 000: обходит все стеллажи подряд (Seq Scan) или идёт к шкафу каталога и сразу к нужной полке (Index Scan). EXPLAIN показывает план, EXPLAIN ANALYZE — ещё и время.',
  about: '7 уровней: большая таблица, планы четырёх запросов из задания и контрольный — диапазон по ключу.',
  levels,
  PTS: {fill: 1, count: 0.5, pk: 1.5, nonkey: 1.5, range: 1.25, join: 1.5, final: 1.75},
  REF: [PLAN_REF, SELECT_REF, JOIN_REF],
  REF_NEED: ['fill', 'pk', 'nonkey', 'join', 'final'],
  questions: [
    'Сведите в таблицу: № запроса — запрос словами — способ чтения — время, мс (запросы 1–4).',
    'Почему запрос 1 идёт по индексу, а запрос 2 — нет? (одной строкой)',
    'Запрос 2: сколько строк прочитано зря (Rows Removed by Filter)?',
    'Контрольный: почему диапазон по ключу идёт по индексу, а диапазон по pages — нет?',
  ],
});
