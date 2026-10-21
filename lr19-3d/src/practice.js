// ЛР-19 · тренировка после уровней: вопросы на итоги (ЛР-17) и на подзапросы (ЛР-18) вперемешку.
import {practice as groups} from '../../lr17-3d/src/practice.js';
import {practice as subs} from '../../lr18-3d/src/practice.js';

export const practice = (D, st, r) => (r() < 0.5 ? groups : subs)(D, st, r);
