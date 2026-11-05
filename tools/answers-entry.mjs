// Эталоны для пульта преподавателя: tools/build.mjs собирает отсюда teacher/answers.js.
// window.labAnswers('lr15', seed) — уровни лабы для варианта студента: название, условие и эталонные команды.
// Эталон берётся так же, как в демо-режиме лабы (common/shell.js): sol, иначе ref, иначе ask.
import * as lr13 from '../lr13-3d/src/data.js';
import * as lr14 from '../lr14-3d/src/data.js';
import * as lr15 from '../lr15-3d/src/data.js';
import * as lr16 from '../lr16-3d/src/data.js';
import {levels as l17} from '../lr17-3d/src/levels.js';
import {levels as l18} from '../lr18-3d/src/levels.js';
import {levels as l19} from '../lr19-3d/src/levels.js';
import {levels as l20} from '../lr20-3d/src/levels.js';
import {levels as l21} from '../lr21-3d/src/levels.js';
import {levels as l22} from '../lr22-3d/src/levels.js';
import {levels as l23} from '../lr23-3d/src/levels.js';
import {levels as l24} from '../lr24-3d/src/levels.js';
import {makeData as pizza} from '../common/pizzadata.js';
import {makeData as lib} from '../common/libdata.js';

const LABS = {
  lr13: [lr13.makeData, lr13.levels],
  lr14: [lr14.makeData, lr14.levels],
  lr15: [lr15.makeData, lr15.levels],
  lr16: [lr16.makeData, lr16.levels],
  lr17: [pizza, l17],
  lr18: [pizza, l18],
  lr19: [pizza, l19],
  lr20: [pizza, l20],
  lr21: [lib, l21],
  lr22: [lib, l22],
  lr23: [lib, l23],
  lr24: [lib, l24],
};
const cache = new Map();
window.labAnswers = (lab, seed) => {
  const f = LABS[lab];
  if (!f || !Number.isInteger(seed)) return null;
  const k = lab + ':' + seed;
  if (!cache.has(k)) {
    let out = null;
    try {
      out = f[1](f[0](seed)).map(l => ({
        key: l.key,
        title: l.title,
        text: l.text || '',
        goals: l.goals || [],
        sol: l.sol || l.ref || (l.ask ? [l.ask] : []),
        note: l.cmds || '',
        hint: l.hint || '',
      }));
    } catch (e) {
      /* вариант не собрался — пульт покажет, что эталона нет */
    }
    cache.set(k, out);
  }
  return cache.get(k);
};
