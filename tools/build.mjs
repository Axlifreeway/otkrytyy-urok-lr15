// Сборка 3D-лаб: src/main.js → game.js (один файл, работает без сервера).
// node tools/build.mjs          — собрать
// node tools/build.mjs --check  — проверить, что game.js в репозитории собран из текущих исходников
// Заодно — teacher/levels.js: названия уровней каждой лабы для пульта преподавателя.
import {build} from 'esbuild';
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {createHash} from 'node:crypto';
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
  // версия в адресе game.js и стилей: после выкладки браузер берёт новый файл по обычному F5, а не из кэша
  const ver = buf => createHash('sha256').update(buf).digest('hex').slice(0, 10);
  const page = join(ROOT, lab, 'index.html'),
    html = readFileSync(page, 'utf8');
  const js = check ? r.outputFiles[0].contents : readFileSync(outfile);
  const next = html
    .replace(/src="game\.js(\?v=\w+)?"/, `src="game.js?v=${ver(js)}"`)
    .replace(
      /href="\.\.\/common\/lab3d\.css(\?v=\w+)?"/,
      `href="../common/lab3d.css?v=${ver(readFileSync(join(ROOT, 'common/lab3d.css')))}"`,
    )
    // ЛР-21–24 — вид как в pgAdmin, свои стили
    .replace(/href="\.\.\/common\/pg\.css(\?v=\w+)?"/, `href="../common/pg.css?v=${ver(readFileSync(join(ROOT, 'common/pg.css')))}"`);
  if (check) {
    if (next !== html) {
      stale++;
      console.log(`${lab}/index.html: версия файлов УСТАРЕЛА — выполните npm run build`);
    }
  } else if (next !== html) writeFileSync(page, next);
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
// эталоны для пульта (клик по уровню студента): teacher/answers.js из tools/answers-entry.mjs
{
  const outfile = join(ROOT, 'teacher/answers.js');
  const r = await build({
    entryPoints: [join(ROOT, 'tools/answers-entry.mjs')],
    bundle: true,
    format: 'iife',
    minify: true,
    outfile,
    write: !check,
  });
  if (check) {
    const same = existsSync(outfile) && Buffer.compare(r.outputFiles[0].contents, readFileSync(outfile)) === 0;
    if (!same) stale++;
    console.log(`teacher/answers.js: ${same ? 'актуален' : 'УСТАРЕЛ — выполните npm run build'}`);
  } else console.log('teacher/answers.js собран');
  // версия в адресе answers.js — после выкладки пульт берёт новые эталоны, а не из кэша
  const page = join(ROOT, 'teacher/index.html'),
    html = readFileSync(page, 'utf8');
  const js = check ? r.outputFiles[0].contents : readFileSync(outfile);
  const next = html.replace(/'answers\.js\?v=\w+'/, `'answers.js?v=${createHash('sha256').update(js).digest('hex').slice(0, 10)}'`);
  if (check && next !== html) {
    stale++;
    console.log('teacher/index.html: версия answers.js УСТАРЕЛА — выполните npm run build');
  } else if (next !== html) writeFileSync(page, next);
}
const names = {},
  keys = {};
for (const lab of LABS) names[lab.slice(0, 4)] = await levelNames(lab);
// ключи уровней по порядку — карточка студента в пульте сопоставляет по ним сохранённый прогресс
for (const lab of LABS) {
  const n = +lab.slice(2, 4),
    air = n <= 16;
  const {levels} = await import(join(ROOT, lab, air ? 'src/data.js' : 'src/levels.js'));
  const {makeData} = await import(join(ROOT, air ? `${lab}/src/data.js` : n < 21 ? 'common/pizzadata.js' : 'common/libdata.js'));
  keys[lab.slice(0, 4)] = levels(makeData(1)).map(l => l.key);
}
const namesOut = join(ROOT, 'teacher/levels.js');
const namesJs = `// Собрано tools/build.mjs из levels() лаб — не править вручную.\nwindow.LEVEL_NAMES = ${JSON.stringify(names, null, 1)};\nwindow.LEVEL_KEYS = ${JSON.stringify(keys)};\n`;
if (check) {
  const same = existsSync(namesOut) && readFileSync(namesOut, 'utf8') === namesJs;
  if (!same) stale++;
  console.log(`teacher/levels.js: ${same ? 'актуален' : 'УСТАРЕЛ — выполните npm run build'}`);
} else {
  writeFileSync(namesOut, namesJs);
  console.log('teacher/levels.js собран');
}
process.exit(stale ? 1 : 0);
