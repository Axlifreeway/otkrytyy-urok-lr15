// Сквозной прогон в браузере: каждая 3D-лаба проходит все уровни эталонными решениями
// в демо-режиме, плюс открываются тетради labs/, mvp и панель преподавателя.
// Запуск: npm run e2e   (нужны Python 3 и Chromium для Playwright)
// Итог пишется в tests/out/e2e.json — по нему удобно сравнивать до/после правок.
import {spawn} from 'node:child_process';
import {mkdirSync, writeFileSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let chromium;
try {
  ({chromium} = require('playwright'));
} catch (e) {
  ({chromium} = require(join(process.execPath, '../../lib/node_modules/playwright')));
}

const PORT = 8000 + Math.floor(Math.random() * 900);
const BASE = `http://127.0.0.1:${PORT}`;
const KEY = 'e2e-key';
const SEED = +(process.env.SEED || 7);
const only = process.argv.slice(2);
const SHOTS = process.env.SHOTS || ''; // папка для снимков сцены (необязательно)
if (SHOTS) mkdirSync(SHOTS, {recursive: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));

const srv = spawn('python3', [join(ROOT, 'server/labsrv.py')], {
  env: {
    ...process.env,
    LABS_KEY: KEY,
    LABS_PORT: String(PORT),
    LABS_STATIC: ROOT,
    LABS_DB: join(mkdtempSync(join(tmpdir(), 'labs-')), 'labs.db'),
  },
  stdio: ['ignore', 'pipe', 'inherit'],
});
for (let i = 0; i < 50; i++) {
  try {
    if ((await fetch(BASE + '/api/ping')).ok) break;
  } catch (e) {
    /* ещё стартует */
  }
  await sleep(100);
}

// E2E_CHANNEL=chrome — взять установленный Chrome, если браузеры Playwright не скачаны
const browser = await chromium.launch({
  channel: process.env.E2E_CHANNEL,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const out = {};
const fails = [];

async function open(path, init) {
  const page = await browser.newPage({viewport: {width: 1366, height: 768}});
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push('console: ' + m.text());
  });
  page.on('request', r => {
    if (/jsdelivr|unpkg/.test(r.url())) errors.push('PGlite не нашёлся рядом, грузится с CDN: ' + r.url());
  });
  page.on('response', r => {
    if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(`http ${r.status()}: ${r.url().replace(BASE, '')}`);
  });
  if (init) await page.addInitScript(init.fn, init.arg);
  await page.goto(BASE + path);
  return {page, errors};
}

// эталонные команды уровня; null — уровня без эталона нет
function script(lab, lv, D) {
  if (lab === 'lr14' && lv.key === 'restrict') return [`DELETE FROM flight WHERE flight_no = '${D.FLIGHT}'`];
  if (lab === 'lr14' && lv.key === 'hunt')
    return [
      `UPDATE passenger SET seat = '${D.pair.seat}' WHERE id = ${D.pair.id}`,
      'UPDATE baggage SET weight_kg = 99',
      "UPDATE passenger SET meal = 'x'",
      "UPDATE passenger SET loyalty = 'x'",
      'UPDATE baggage SET passenger_id = -1',
    ];
  if (lab === 'lr13' && lv.key === 'hunt') {
    const p = D.p,
      v = (id, seat) => `(${id}, '${p.flight_no}', '${seat}', '${p.full_name}')`,
      ins = 'INSERT INTO passenger (id, flight_no, seat_no, full_name) VALUES ';
    return [
      ins + v(p.id, p.seat_no),
      ins + v(9001, p.seat_no),
      ins + v(9002, D.noSeat),
      "INSERT INTO seat (seat_no) VALUES ('9Z')",
      `INSERT INTO passenger (id, flight_no, seat_no) VALUES (9003, '${p.flight_no}', '${D.freeSeat}')`,
    ];
  }
  if (!lv.ref) return null;
  const s = [];
  if (lv.prefill) s.push(lv.prefill);
  s.push(...lv.ref);
  if (lv.needCount) s.push(`SELECT count(*) FROM ${lv.needCount}`);
  return s;
}

async function lab3d(lab, dir) {
  const {page, errors} = await open(`/${dir}/index.html`);
  await page.waitForFunction(() => window.LAB && document.getElementById('loading').hidden, null, {timeout: 60000});
  // прогнозы: всегда первый вариант
  await page.evaluate(() =>
    setInterval(() => {
      const b = document.querySelector('#modal:not([hidden]) [data-k]');
      if (b) b.click();
    }, 50),
  );
  await page.evaluate(async seed => {
    window.LAB.speed = 50;
    await window.LAB.begin(seed, true);
  }, SEED);
  const n = await page.evaluate(() => window.LAB.L.length);
  const res = [];
  for (let i = 0; i < n; i++) {
    const lv = await page.evaluate(i => {
      const l = window.LAB.L[i];
      return {key: l.key, ref: l.sol || (l.ask ? [l.ask] : l.ref), prefill: l.prefill, needCount: l.needCount, check: l.check};
    }, i);
    await page.evaluate(i => window.LAB.startLevel(i), i);
    await page.waitForFunction(() => !window.LAB.running);
    if (SHOTS) {
      // снимок сцены в начале уровня — для сравнения до/после правок
      await page.evaluate(() => {
        document.getElementById('sql').blur();
        const W = window.LAB.W;
        W.setQuality('low');
        W.home();
      });
      await sleep(400);
      await page.evaluate(() => {
        const c = window.LAB.W.camS;
        Object.assign(c, {cx: c.tx, cz: c.tz, cy: 0, cur: c.zoom});
      });
      await sleep(600);
      await page.locator('#stage').screenshot({path: join(SHOTS, `${lab}-${String(i + 1).padStart(2, '0')}.png`)});
    }
    const D = await page.evaluate(async lab => {
      const db = await window.__pg,
        q = async s => (await db.query(s)).rows;
      if (lab !== 'lr13' && lab !== 'lr14') return {};
      if (lab === 'lr14')
        return {
          FLIGHT: (await q('SELECT flight_no FROM passenger LIMIT 1'))[0].flight_no,
          pair: (await q('SELECT a.id, b.seat FROM passenger a JOIN passenger b ON a.flight_no = b.flight_no AND a.id <> b.id LIMIT 1'))[0],
        };
      const seats = (await q('SELECT seat_no FROM seat')).map(r => r.seat_no),
        taken = (await q('SELECT seat_no FROM passenger')).map(r => r.seat_no);
      const all = [1, 2, 3, 4, 5, 6].flatMap(r => [...'ABCDEF'].map(l => r + l));
      return {
        p: (await q('SELECT id, flight_no, seat_no, full_name FROM passenger ORDER BY id LIMIT 1'))[0],
        noSeat: all.find(s => !seats.includes(s)),
        freeSeat: seats.find(s => !taken.includes(s)),
      };
    }, lab);
    const cmds = script(lab, lv, D);
    if (!cmds) {
      res.push({key: lv.key, skipped: true});
      continue;
    }
    for (const c of cmds) {
      await page.evaluate(c => {
        document.getElementById('sql').value = c;
        return window.LAB.run();
      }, c);
      await page.waitForFunction(() => !window.LAB.running, null, {timeout: 60000});
    }
    await sleep(300);
    const r = await page.evaluate(
      k => ({
        done: !!(window.LAB.G.P.lv[k] || {}).done,
        result: document.getElementById('result').innerText.trim(),
        verdict: document.getElementById('verdict').innerText.trim().split('\n')[0],
        slots: window.LAB.G.slots,
      }),
      lv.key,
    );
    res.push({key: lv.key, ...r});
    if (!r.done) fails.push(`${lab} ${lv.key}: не пройден (${r.verdict || r.result})`);
    if (lv.key === 'final') await sleep(8000); // взлёт и экран итогов
  }
  const end = await page.evaluate(
    () => !document.getElementById('modal').hidden && document.getElementById('modal').innerText.slice(0, 60),
  );
  out[lab] = {levels: res, end, errors};
  errors.forEach(e => fails.push(`${lab}: ${e}`));
  await page.close();
}

// тетрадь labs/: смена с номером SEED, каждый уровень — эталонные команды (у кого они есть)
async function workbook(name, path) {
  const {page, errors} = await open(path, {
    fn: seed => {
      try {
        localStorage.setItem('air-seed', String(seed));
      } catch (e) {
        /* нет */
      }
    },
    arg: SEED,
  });
  const idle = () => page.waitForFunction(() => W.api.S && !W.api.S.busy && W.db, null, {timeout: 60000});
  await page.waitForFunction(() => typeof W !== 'undefined' && W.api.S && W.api.S.levels, null, {timeout: 60000});
  await page.evaluate(() => document.querySelector('[data-tab="shift"]').click());
  await idle();
  const n = await page.evaluate(() => W.api.S.levels.length);
  const res = [];
  for (let i = 0; i < n; i++) {
    // кнопка уровня перерисовывается после каждого запуска — дождаться её, а не щёлкать наугад
    await page.waitForSelector(`[data-l="${i}"]`, {timeout: 30000});
    await page.click(`[data-l="${i}"]`);
    await sleep(200);
    await idle();
    const ref = await page.evaluate(i => W.api.S.levels[i].ref || null, i);
    if (!ref) {
      res.push({i, skipped: true});
      continue;
    }
    // правило «сначала SELECT с тем же условием»: перед UPDATE/DELETE — прицельный SELECT
    await page.evaluate(ref => {
      const sql = ref.flatMap(q => {
        const w = /^(update|delete)/i.test(q.trim()) && W.whereOf(q);
        return w && w.where ? [`SELECT * FROM ${w.table} WHERE ${w.where}`, q] : [q];
      });
      document.getElementById('sql').value = sql.map(q => q + ';').join('\n');
      document.getElementById('runBtn').click();
    }, ref);
    await sleep(200);
    await idle();
    res.push({
      i,
      done: await page.evaluate(i => !!(W.api.S.P.levels[i] || {}).done, i),
      out: await page.evaluate(() => document.getElementById('side').innerText.slice(0, 120)),
    });
  }
  out[name] = {levels: res, errors};
  errors.forEach(e => fails.push(`${name}: ${e}`));
  await page.close();
}

async function plain(name, path, ready) {
  const {page, errors} = await open(path);
  try {
    await page.waitForFunction(ready, null, {timeout: 60000});
  } catch (e) {
    errors.push('не дождались готовности');
  }
  out[name] = {errors, title: await page.title()};
  errors.forEach(e => fails.push(`${name}: ${e}`));
  await page.close();
}

// вход по группе и PIN → прогресс на сервере → студент в панели преподавателя
async function serverFlow() {
  const post = (path, body) =>
    fetch(BASE + path, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then(r => r.json());
  await post('/api/admin/group', {key: KEY, name: 'E2E-1', names: ['Тестов Тест', 'Проверкина Анна']});
  const {page, errors} = await open('/lr14-3d/index.html');
  await page.waitForSelector('#lgS', {timeout: 60000});
  await page.fill('#lgS', 'Тестов');
  await page.fill('#lgP', '4321');
  await page.click('#lgGo');
  await page.waitForFunction(() => window.LAB && window.LAB.G && window.LAB.G.lv === 0 && !window.LAB.running, null, {timeout: 60000});
  const seed = await page.evaluate(() => window.LAB.G.seed);
  await page.evaluate(() => {
    window.LAB.speed = 99;
    document.getElementById('sql').value = window.LAB.L[0].ref[0];
    return window.LAB.run();
  });
  await page.waitForFunction(() => !window.LAB.running && (window.LAB.G.P.lv.kids || {}).done, null, {timeout: 60000});
  await sleep(2500); // прогресс уходит с задержкой
  const st = await fetch(BASE + '/api/state?lab=lr14', {headers: {'X-Labs-Key': KEY}}).then(r => r.json());
  const p = st.people.find(x => x.fio === 'Тестов Тест');
  const groups = await fetch(BASE + '/api/admin/groups', {headers: {'X-Labs-Key': KEY}}).then(r => r.json());
  const saved = groups.groups[0].students.find(x => x.name === 'Тестов Тест').labs.lr14;
  const ok = p && p.grp === 'E2E-1' && p.seed === seed && p.done.includes('kids') && saved === 1;
  if (!ok)
    fails.push(
      `server-flow: студент не дошёл до панели как надо: ${JSON.stringify({p: p && {fio: p.fio, grp: p.grp, seed: p.seed, done: p.done}, seed, saved})}`,
    );
  // без входа события не принимаются, раз есть списки групп
  const anon = await fetch(BASE + '/api/ev', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({type: 'run', client: 'x', fio: 'Чужой'}),
  });
  if (anon.status !== 403) fails.push('server-flow: событие без входа принято');
  // отчёт: «Сдать» → протокол → ответ на вопрос → «Отправить преподавателю» → панель открывает его
  await page.click('#subBtn');
  await page.click('#subGo');
  await page.fill('#proto [data-a="0"]', 'Потому что NULL не равен ничему — e2e');
  await page.click('#sendRep');
  await page.waitForSelector('#sendMsg.ok', {timeout: 15000}).catch(() => fails.push('server-flow: отчёт не отправился: ' + ''));
  const t = await open(`/teacher/index.html?key=${KEY}`);
  await t.page.waitForSelector('tr.row [data-rep]', {timeout: 15000}).catch(() => fails.push('server-flow: в панели нет кнопки отчёта'));
  await t.page.click('#repBtn');
  await t.page.click('#repList tr.row');
  const frame = await (await t.page.waitForSelector('#rvFrame')).contentFrame();
  await frame
    .waitForFunction(() => document.body && document.body.innerText.includes('NULL не равен ничему'), null, {timeout: 15000})
    .catch(() => fails.push('server-flow: отчёт не открылся в панели'));
  if (await frame.$('textarea, input, button, script')) fails.push('server-flow: в снимке отчёта остались поля или скрипты');
  if (SHOTS) await t.page.screenshot({path: join(SHOTS, 'teacher-report.png')});
  await t.page.click('#rvX');
  await t.page.click('tr.row');
  await t.page
    .waitForSelector('#drawer pre .k', {timeout: 15000})
    .catch(() => fails.push('server-flow: SQL в журнале панели не подсвечен'));
  if (SHOTS) await t.page.screenshot({path: join(SHOTS, 'teacher-drawer.png')});
  await t.page.click('#dx');
  // день назад: студента сегодняшнего дня в таблице нет
  await t.page.click('#prevDay');
  await t.page
    .waitForFunction(() => !document.querySelector('#rows tr.row') && document.getElementById('newPair').hidden, null, {timeout: 15000})
    .catch(() => fails.push('server-flow: ◀ не переключил день'));
  if (SHOTS) await t.page.screenshot({path: join(SHOTS, 'teacher-prevday.png')});
  t.errors.forEach(e => errors.push('панель: ' + e));
  await t.page.close();
  out['server-flow'] = {ok, errors};
  errors.forEach(e => fails.push(`server-flow: ${e}`));
  await page.close();
  await post('/api/admin/delgroup', {key: KEY, name: 'E2E-1'});
}

// тренировка после уровней: генератор даёт выполнимые задания, эталон каждого засчитывается
async function practiceRun(lab, dir) {
  const {page, errors} = await open(`/${dir}/index.html`);
  await page.waitForFunction(() => window.LAB && document.getElementById('loading').hidden, null, {timeout: 60000});
  await page.evaluate(async seed => {
    window.LAB.speed = 99;
    await window.LAB.begin(seed, true);
  }, SEED);
  const res = [];
  for (let k = 0; k < 12; k++) {
    await page.evaluate(() => window.LAB.startPractice());
    await page.waitForFunction(() => !window.LAB.running && window.LAB.L.at(-1).practice, null, {timeout: 30000});
    const lv = await page.evaluate(() => {
      const l = window.LAB.L.at(-1);
      return {title: l.title, ref: l.ref || [l.ask], n: window.LAB.G.P.practice || 0};
    });
    for (const q of lv.ref) {
      await page.evaluate(q => {
        document.getElementById('sql').value = q;
        return window.LAB.run();
      }, q);
      await page.waitForFunction(() => !window.LAB.running, null, {timeout: 60000});
    }
    const n = await page.evaluate(() => window.LAB.G.P.practice || 0);
    res.push(lv.title + (n === lv.n + 1 ? '' : ' — НЕ ЗАСЧИТАНО'));
    if (n !== lv.n + 1) fails.push(`${lab}-practice: «${lv.title}» не засчитано эталоном: ${lv.ref.join('; ')}`);
  }
  const sc = await page.evaluate(() => ({
    lv: Object.keys(window.LAB.G.P.lv),
    json: JSON.stringify(window.LAB.G.P).includes('"practice":{'),
  }));
  if (sc.lv.includes('practice') || sc.json) fails.push(`${lab}-practice: запись тренировки попала в сохраняемый прогресс`);
  out[lab + '-practice'] = {tasks: res, errors};
  errors.forEach(e => fails.push(`${lab}-practice: ${e}`));
  await page.close();
}

// ЛР-15 и ЛР-16 открыты без преподавателя: талоны на главной активны, лаба не «задержана»
async function gate() {
  const errors = [];
  for (const lab of ['lr15', 'lr16']) {
    const {page, errors: e} = await open(`/${lab}-3d/index.html`);
    await page.waitForSelector('#modal:not([hidden]) .dlg', {timeout: 60000});
    if (await page.$('.closed')) fails.push(`gate: ${lab} «задержана», хотя открыта по умолчанию`);
    await page.close();
    errors.push(...e);
  }
  const home = await open('/airport/');
  await sleep(1500);
  const shut = await home.page.evaluate(() => [...document.querySelectorAll('.pass.shut')].map(x => x.getAttribute('href')));
  if (shut.length) fails.push('gate: на главной аэропорта есть «задержанные» талоны: ' + shut);
  await home.page.close();
  out.gate = {shut, errors: errors.concat(home.errors)};
  errors.concat(home.errors).forEach(e => fails.push('gate: ' + e));
}

// телефон (iPhone 13, стоя и боком): страница не шире экрана, панели 3D-лабы не налезают друг на друга
async function mobile() {
  const {devices} = (() => {
    try {
      return require('playwright');
    } catch (e) {
      return require(join(process.execPath, '../../lib/node_modules/playwright'));
    }
  })();
  const errors = [];
  for (const dev of ['iPhone 13', 'iPhone 13 landscape']) {
    const ctx = await browser.newContext({...devices[dev]});
    await ctx.addInitScript(seed => {
      try {
        localStorage.setItem('air-seed', String(seed));
      } catch (e) {
        /* нет */
      }
    }, SEED);
    for (const path of ['/airport/', '/?map', '/pizza/', '/labs/lr13.html', '/labs/lr14.html', '/labs/lr16.html', '/teacher/?key=' + KEY]) {
      const page = await ctx.newPage();
      await page.goto(BASE + path);
      await sleep(2500);
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      if (w[0] > w[1] + 1) errors.push(`${dev} ${path}: страница шире экрана (${w[0]} > ${w[1]})`);
      await page.close();
    }
    for (const lab of ['lr13-3d', 'lr14-3d']) {
      const page = await ctx.newPage();
      page.on('pageerror', e => errors.push(`${dev} ${lab}: ${e.message}`));
      await page.goto(`${BASE}/${lab}/index.html`);
      await page.waitForFunction(() => window.LAB && document.getElementById('loading').hidden, null, {timeout: 60000});
      await page.evaluate(() => {
        document.getElementById('modal').hidden = true;
        return window.LAB.begin(7, true);
      });
      await page.waitForFunction(() => !window.LAB.running);
      await page.evaluate(() => document.getElementById('side').classList.add('min'));
      const r = await page.evaluate(() => {
        const s = document.getElementById('side').getBoundingClientRect(),
          d = document.getElementById('deck').getBoundingClientRect(),
          t = document.getElementById('topR').getBoundingClientRect();
        return {
          side: [s.left, s.top, s.right, s.bottom],
          deck: [d.left, d.top, d.right, d.bottom],
          top: [t.left, t.top, t.right, t.bottom],
          w: innerWidth,
          h: innerHeight,
        };
      });
      const hit = (a, b) => a[0] < b[2] - 1 && b[0] < a[2] - 1 && a[1] < b[3] - 1 && b[1] < a[3] - 1;
      if (hit(r.side, r.deck)) errors.push(`${dev} ${lab}: задание налезает на пульт`);
      if (hit(r.side, r.top)) errors.push(`${dev} ${lab}: задание налезает на кнопки`);
      if (r.deck[2] > r.w + 1 || r.deck[3] > r.h + 1) errors.push(`${dev} ${lab}: пульт выходит за экран`);
      await page.close();
    }
    await ctx.close();
  }
  out.mobile = {errors};
  errors.forEach(e => fails.push(`mobile: ${e}`));
}

const jobs = {
  lr13: () => lab3d('lr13', 'lr13-3d'),
  lr14: () => lab3d('lr14', 'lr14-3d'),
  lr15: () => lab3d('lr15', 'lr15-3d'),
  lr16: () => lab3d('lr16', 'lr16-3d'),
  lr17: () => lab3d('lr17', 'lr17-3d'),
  lr18: () => lab3d('lr18', 'lr18-3d'),
  lr19: () => lab3d('lr19', 'lr19-3d'),
  lr20: () => lab3d('lr20', 'lr20-3d'),
  testing: () => lab3d('testing', 'testing'), // проба: ЛР-17 из готовых моделей
  // город: пока ЛР-17–20 закрыты, «/» ведёт в аэропорт; карта — по /?map; у пиццерии четыре заказа
  city: async () => {
    const {page, errors} = await open('/');
    await page
      .waitForURL(/\/airport\/$/, {timeout: 15000})
      .catch(() => fails.push('city: «/» не перевёл в аэропорт, хотя ЛР-17–20 закрыты'));
    await page.goto(BASE + '/?map');
    await page
      .waitForFunction(
        () => document.querySelectorAll('#city .bld').length === 3 && document.querySelectorAll('.world').length === 2,
        null,
        {timeout: 15000},
      )
      .catch(() => fails.push('city: карта не нарисовалась'));
    // у ссылок внутри SVG href — не строка: берём атрибут
    for (const href of await page.evaluate(() =>
      [...document.querySelectorAll('a[href]')].map(a => new URL(a.getAttribute('href'), location.href).href),
    ))
      if (!(await fetch(href)).ok) errors.push(`карта: ссылка ${href} не открывается`);
    await page.goto(BASE + '/pizza/');
    await page
      .waitForFunction(
        () => document.querySelectorAll('#tickets .ticket').length === 4 && document.querySelectorAll('.receipt').length === 4,
        null,
        {timeout: 15000},
      )
      .catch(() => fails.push('city: страница пиццерии пустая'));
    if (SHOTS) await page.screenshot({path: join(SHOTS, 'pizza.png'), fullPage: true});
    out.city = {errors};
    errors.forEach(e => fails.push(`city: ${e}`));
    await page.close();
  },
  home: async () => {
    const {page, errors} = await open('/airport/');
    await page.waitForFunction(
      () => document.querySelectorAll('#rows .row').length === 4 && document.querySelectorAll('.pass').length === 4,
    );
    for (const href of await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href))) {
      const r = await fetch(href);
      if (!r.ok) errors.push(`главная: ссылка ${href} → ${r.status}`);
    }
    out.home = {errors};
    errors.forEach(e => fails.push(`home: ${e}`));
    await page.close();
  },
  hub: () => plain('hub', '/labs/index.html', () => document.querySelectorAll('.lc').length > 0),
  'labs-lr13': () => workbook('labs-lr13', '/labs/lr13.html'),
  'labs-lr14': () => workbook('labs-lr14', '/labs/lr14.html'),
  'labs-lr16': () => workbook('labs-lr16', '/labs/lr16.html'),
  mvp: () => plain('mvp', '/mvp/index.html', () => document.body.innerText.length > 200),
  mobile,
  'lr13-practice': () => practiceRun('lr13', 'lr13-3d'),
  'lr14-practice': () => practiceRun('lr14', 'lr14-3d'),
  'lr15-practice': () => practiceRun('lr15', 'lr15-3d'),
  'lr16-practice': () => practiceRun('lr16', 'lr16-3d'),
  'lr17-practice': () => practiceRun('lr17', 'lr17-3d'),
  'lr18-practice': () => practiceRun('lr18', 'lr18-3d'),
  'lr19-practice': () => practiceRun('lr19', 'lr19-3d'),
  gate,
  'server-flow': serverFlow,
  teacher: () =>
    plain('teacher', `/teacher/index.html?key=${KEY}`, () => document.getElementById('app') && !document.getElementById('app').hidden),
};
// проба /testing/ (анимированные модели) в программной отрисовке идёт долго — только по имени: node tests/e2e.mjs testing
const ONLY_BY_NAME = ['testing'];
try {
  for (const [k, f] of Object.entries(jobs))
    if (only.length ? only.includes(k) : !ONLY_BY_NAME.includes(k)) {
      process.stdout.write(k + '… ');
      await f();
      console.log('ok');
    }
} finally {
  await browser.close();
  srv.kill();
}
mkdirSync(join(ROOT, 'tests/out'), {recursive: true});
writeFileSync(join(ROOT, 'tests/out/e2e.json'), JSON.stringify(out, null, 1));
for (const [lab, o] of Object.entries(out))
  if (o.levels) console.log(lab, o.levels.map(l => `${l.key ?? l.i + 1}:${l.skipped ? 'skip' : l.done ? 'ok' : 'нет'}`).join(' '));
if (fails.length) {
  console.log('\nПроблемы:\n' + fails.join('\n'));
  process.exit(1);
}
console.log('\nВсё прошло.');
