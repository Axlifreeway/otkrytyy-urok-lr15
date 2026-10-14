// Сборка 3D-лаб: src/main.js → game.js (один файл, работает без сервера).
// node tools/build.mjs          — собрать
// node tools/build.mjs --check  — проверить, что game.js в репозитории собран из текущих исходников
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LABS = ['lr13-3d', 'lr14-3d'];
const check = process.argv.includes('--check');
let stale = 0;
for (const lab of LABS) {
  const outfile = join(ROOT, lab, 'game.js');
  const r = await build({entryPoints: [join(ROOT, lab, 'src/main.js')], bundle: true, format: 'iife', minify: true, outfile, write: !check});
  if (check) {
    const same = Buffer.compare(r.outputFiles[0].contents, readFileSync(outfile)) === 0;
    if (!same) stale++;
    console.log(`${lab}/game.js: ${same ? 'актуален' : 'УСТАРЕЛ — выполните npm run build'}`);
  } else console.log(`${lab}/game.js собран`);
}
process.exit(stale ? 1 : 0);
