// Эталоны в пульте преподавателя (teacher/answers.js, из tools/answers-entry.mjs): у каждой лабы и варианта —
// столько же уровней, сколько названий в teacher/levels.js, и почти у всех уровней есть готовые команды.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const win = {};
vm.runInNewContext(fs.readFileSync(new URL('teacher/levels.js', root), 'utf8'), {window: win});
vm.runInNewContext(fs.readFileSync(new URL('teacher/answers.js', root), 'utf8'), {window: win});

for (const lab of Object.keys(win.LEVEL_NAMES)) {
  test(`эталоны ${lab}`, () => {
    for (const seed of [101, 203, 315]) {
      const A = win.labAnswers(lab, seed);
      assert.ok(A, `${lab}: вариант ${seed} не собрался`);
      assert.equal(A.length, win.LEVEL_NAMES[lab].length, `${lab}: число уровней`);
      for (const a of A) assert.ok(a.key && a.title && Array.isArray(a.sol), `${lab}: ${a.title}`);
      assert.ok(A.filter(a => a.sol.length).length >= A.length / 3, `${lab}: мало уровней с эталоном`);
    }
  });
}
test('эталон зависит от варианта', () => {
  const s = seed => JSON.stringify(win.labAnswers('lr20', seed).map(a => a.sol));
  assert.notEqual(s(101), s(203));
});
