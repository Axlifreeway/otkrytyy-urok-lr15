// Сравнение двух папок со снимками сцены (из SHOTS=… npm run e2e): доля заметно отличающихся пикселей.
// node tests/shotdiff.mjs папка-до папка-после
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
let chromium;
try {
  ({chromium} = require('playwright'));
} catch (e) {
  ({chromium} = require(join(process.execPath, '../../lib/node_modules/playwright')));
}

const [A, B] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage();
const url = f => 'data:image/png;base64,' + readFileSync(f).toString('base64');
let worst = 0;
for (const f of readdirSync(A)
  .filter(x => x.endsWith('.png'))
  .sort()) {
  const share = await page.evaluate(
    async ([a, b]) => {
      const img = async u => {
        const i = new Image();
        i.src = u;
        await i.decode();
        const c = new OffscreenCanvas(i.width, i.height);
        const x = c.getContext('2d');
        x.drawImage(i, 0, 0);
        return x.getImageData(0, 0, i.width, i.height);
      };
      const p = await img(a),
        q = await img(b);
      if (p.width !== q.width || p.height !== q.height) return 1;
      let n = 0;
      for (let i = 0; i < p.data.length; i += 4)
        if (Math.abs(p.data[i] - q.data[i]) + Math.abs(p.data[i + 1] - q.data[i + 1]) + Math.abs(p.data[i + 2] - q.data[i + 2]) > 60) n++;
      return n / (p.width * p.height);
    },
    [url(join(A, f)), url(join(B, f))],
  );
  worst = Math.max(worst, share);
  console.log(`${f}  ${(share * 100).toFixed(2)} %`);
}
await browser.close();
console.log(`наибольшее отличие: ${(worst * 100).toFixed(2)} %`);
