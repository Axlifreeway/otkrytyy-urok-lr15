// Сборка 3D-лаб: src/main.js → game.js (один файл, работает без сервера).
// node tools/build.mjs          — собрать
// node tools/build.mjs --check  — проверить, что game.js в репозитории собран из текущих исходников
// Заодно — teacher/levels.js: названия уровней каждой лабы для пульта преподавателя.
import {build} from 'esbuild';
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LABS = [
  'lr13-3d',
  'lr14-3d',
  'lr15-3d',
  'lr16-3d',
  'lr17-3d',
  'lr18-3d',
  'lr19-3d',
  'lr20-3d',
  'lr21-3d',
  'lr22-3d',
  'lr23-3d',
  'lr24-3d',
].filter(l => existsSync(join(ROOT, l, 'src/main.js')));
const check = process.argv.includes('--check');
let stale = 0;
for (const lab of LABS) {
  const outfile = join(ROOT, lab, 'game.js');
  const r = await build({
    entryPoints: [join(ROOT, lab, 'src/main.js')],
    bundle: true,
    format: 'iife',
    minify: true,
    outfile,
    write: !check,
  });
  if (check) {
    const same = Buffer.compare(r.outputFiles[0].contents, readFileSync(outfile)) === 0;
    if (!same) stale++;
    console.log(`${lab}/game.js: ${same ? 'актуален' : 'УСТАРЕЛ — выполните npm run build'}`);
  } else console.log(`${lab}/game.js собран`);
}

// названия уровней для пульта: у части уровней в названии — данные варианта («Земляки из города Омск»);
// такая часть заменяется на «…», чтобы пульт не показывал всем город первого варианта
async function levelNames(lab) {
  const n = +lab.slice(2, 4);
  const air = n <= 16;
  const {levels} = await import(join(ROOT, lab, air ? 'src/data.js' : 'src/levels.js'));
  const {makeData} = await import(join(ROOT, air ? `${lab}/src/data.js` : n < 21 ? 'common/pizzadata.js' : 'common/libdata.js'));
  const runs = [1, 2, 3, 4, 5].map(seed => levels(makeData(seed)).map(l => l.title));
  return runs[0].map((t, i) => {
    const all = runs.map(r => r[i]);
    if (all.every(x => x === t)) return t;
    let k = 0;
    while (all.every(x => x[k] === t[k])) k++;
    return t.slice(0, k).replace(/[\s«]*$/, '') + ' …';
  });
}
const names = {};
for (const lab of LABS) names[lab.slice(0, 4)] = await levelNames(lab);
const namesOut = join(ROOT, 'teacher/levels.js');
const namesJs = `// Собрано tools/build.mjs из levels() лаб — не править вручную.\nwindow.LEVEL_NAMES = ${JSON.stringify(names, null, 1)};\n`;
if (check) {
  const same = existsSync(namesOut) && readFileSync(namesOut, 'utf8') === namesJs;
  if (!same) stale++;
  console.log(`teacher/levels.js: ${same ? 'актуален' : 'УСТАРЕЛ — выполните npm run build'}`);
} else {
  writeFileSync(namesOut, namesJs);
  console.log('teacher/levels.js собран');
}
process.exit(stale ? 1 : 0);
