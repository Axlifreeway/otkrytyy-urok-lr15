// Списки уровней живут в нескольких местах: levels() лабы, баллы PTS в main.js, ключи на главной (common/home.js),
// число уровней и «добавленные позже» уровни на сервере (server/labsrv.py). Здесь проверяется, что они не разошлись.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const AIR = {lr13: 'lr13-3d/src/data.js', lr14: 'lr14-3d/src/data.js', lr15: 'lr15-3d/src/data.js', lr16: 'lr16-3d/src/data.js'};
const LABS = Array.from({length: 12}, (_, i) => 'lr' + (13 + i));

async function keysOf(lab) {
  const n = +lab.slice(2);
  const src = AIR[lab] || `lr${n}-3d/src/levels.js`;
  const {levels} = await import(new URL(src, root));
  const data = AIR[lab] ? AIR[lab] : n < 21 ? 'common/pizzadata.js' : 'common/libdata.js';
  const {makeData} = await import(new URL(data, root));
  return levels(makeData(3)).map(l => l.key);
}
// значения из vm — из другого «мира»: deepEqual их не признаёт, пока не пересобрать
const plain = v => (v == null ? v : JSON.parse(JSON.stringify(v)));
// объект-литерал из исходника: «PTS = {…}» или «PTS: {…}»
const literal = (text, name) => {
  const m = new RegExp(`\\b${name}\\s*[:=]\\s*(\\{[\\s\\S]*?\\}|\\[[\\s\\S]*?\\])`).exec(text);
  return m ? plain(vm.runInNewContext('(' + m[1] + ')')) : null;
};
const sources = lab => {
  const n = lab.slice(2);
  return [`lr${n}-3d/src/main.js`, `lr${n}-3d/src/data.js`]
    .filter(p => fs.existsSync(new URL(p, root)))
    .map(read)
    .join('\n');
};

// главная: обычный скрипт, кладёт Home в window
const ctx = {window: {}, document: {getElementById: () => null}, location: {protocol: 'file:', search: '', href: ''}};
vm.runInNewContext(read('common/home.js'), ctx);
const HOME = plain(ctx.window.Home.LABS);
// сервер: словари LEVELS, ADDED и FINAL — в синтаксисе Python, но годятся и как JS
const py = read('server/labsrv.py');
const pyDict = name => plain(vm.runInNewContext('(' + new RegExp(`^${name} = (\\{[\\s\\S]*?\\n?\\})`, 'm').exec(py)[1] + ')'));
const LEVELS = pyDict('LEVELS'),
  ADDED = pyDict('ADDED'),
  FINAL = pyDict('FINAL');

test('уровни: главная, сервер и баллы совпадают с levels() лабы', async () => {
  for (const lab of LABS) {
    const keys = await keysOf(lab);
    assert.equal(new Set(keys).size, keys.length, `${lab}: ключи уровней не повторяются`);
    assert.deepEqual(HOME[lab].levels, keys, `${lab}: common/home.js`);
    assert.equal(LEVELS[lab], keys.length, `${lab}: LEVELS в server/labsrv.py`);
    const pts = literal(sources(lab), 'PTS');
    assert.deepEqual(Object.keys(pts).sort(), [...keys].sort(), `${lab}: ключи PTS`);
    const sum = Object.values(pts).reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sum - 9) < 1e-9, `${lab}: баллы в сумме ${sum}, а нужно 9`);
  }
});

test('добавленные позже уровни: одни и те же в лабе и на сервере, контрольный — последний', async () => {
  for (const lab of LABS) {
    const keys = await keysOf(lab);
    const client = literal(sources(lab), 'ADDED') || literal(sources(lab), 'added');
    assert.deepEqual(client || undefined, ADDED[lab], `${lab}: added в лабе и ADDED на сервере`);
    if (!client) continue;
    client.forEach(k => assert.ok(keys.includes(k), `${lab}: ${k} — нет такого уровня`));
    assert.equal(keys.at(-1), FINAL[lab] || 'final', `${lab}: последний уровень — ${keys.at(-1)}, сервер ждёт ${FINAL[lab] || 'final'}`);
    assert.ok(!client.includes(keys.at(-1)), `${lab}: контрольный не может быть «добавленным»`);
  }
});
