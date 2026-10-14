// Данные и задания варианта зависят только от номера студента. Рефакторинг не должен их менять:
// иначе у студента «поедет» рассадка, а сохранённый прогресс перестанет совпадать с базой.
// Обновить снимок (только если данные меняются намеренно): UPDATE_SNAPSHOT=1 node --test tests/
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';

const FILE = new URL('./fixtures/variants.json', import.meta.url);
const LABS = {
  lr13: () => import('../lr13-3d/src/data.js'),
  lr14: () => import('../lr14-3d/src/data.js'),
};
const hash = v => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 16);

async function current() {
  const out = {};
  for (const [lab, load] of Object.entries(LABS)) {
    const m = await load();
    out[lab] = {};
    for (let seed = 0; seed <= 60; seed++) {
      const D = m.makeData(seed);
      out[lab][seed] = hash({D, base: m.baseSql(D), levels: m.levels(D)});
    }
  }
  return out;
}

test('данные вариантов 0–60 не изменились', async () => {
  const cur = await current();
  if (process.env.UPDATE_SNAPSHOT) writeFileSync(FILE, JSON.stringify(cur, null, 1) + '\n');
  assert.deepEqual(cur, JSON.parse(readFileSync(FILE, 'utf8')));
});
