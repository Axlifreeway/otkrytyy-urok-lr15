// ЛР-13 · «Открытие рейса» — уровни, робот-СУБД для INSERT и SELECT, проверка, протокол.
import {createWorld, sleep} from './scene.js';
import {makeData, baseSql, levels as mkLevels, TABLES, COLS, talon, tagOf, PTS} from './data.js';
import {report, setCtx, clientId, watchAway, guardPaste} from '../../common/net.js';
import {loginScreen, session, mergeP, syncInit, pull, push} from '../../common/login.js';
import {judge, describe, keyHint} from '../../common/judge.js';
const TEACHER_CODE = 'boeing747';           // код преподавателя: открывает все уровни и кнопку «Решение»

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const W = createWorld($('stage'));
let db = null, D = null, L = [], G = null, running = false;
const LAB_KEY = 'air3d-lr13-';

// ═════════════════════════════════════════════════════════════ звук ══
let ac = null, muted = false;
function tone(f, d, o = {}) {
  if (muted) return;
  try { ac = ac || new AudioContext(); } catch (e) { return; }
  const t = ac.currentTime + (o.at || 0), osc = ac.createOscillator(), g = ac.createGain();
  osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t); if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + d);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(o.vol || .12, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + d);
  osc.connect(g); g.connect(ac.destination); osc.start(t); osc.stop(t + d + .02);
}
const SFX = {
  yes: () => { tone(660, .08, {type: 'triangle'}); tone(990, .1, {type: 'triangle', at: .07}); },
  no: () => tone(220, .09, {type: 'triangle', vol: .08}),
  unk: () => { tone(440, .07, {vol: .08}); tone(415, .1, {vol: .08, at: .08}); },
  pop: () => tone(520, .09, {to: 1000, vol: .1}),
  ok: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .2, {type: 'triangle', at: i * .08})),
  err: () => { tone(160, .3, {type: 'square', vol: .1}); tone(120, .35, {type: 'square', vol: .09, at: .15}); },
  rew: () => { for (let i = 0; i < 8; i++) tone(900 - i * 80, .05, {type: 'square', vol: .05, at: i * .05}); },
  unlock: () => [392, 523, 659].forEach((f, i) => tone(f, .15, {type: 'triangle', at: i * .06})),
};

// ═══════════════════════════════════════════════════════════ база ══
async function loadSql(sql) {
  try { await db.query('ROLLBACK'); } catch (e) { /* нет транзакции */ }
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
  await db.exec(sql);
}
const SEL = t => `SELECT ${COLS[t].map(c => c === 'dep_time' ? "to_char(dep_time, 'HH24:MI') AS dep_time" : c).join(', ')} FROM ${t}`;
async function state() {
  const o = {};
  for (const t of Object.keys(TABLES)) o[t] = (await db.query(`${SEL(t)} ORDER BY ctid`)).rows;
  return o;
}
const keyed = (rows, pk) => new Map(rows.map(r => [String(r[pk]), JSON.stringify(r)]));
function compare(cur, tgt, tables) {
  const res = {missing: [], extra: [], wrong: []};
  tables.forEach(t => {
    const pk = TABLES[t], C = keyed(cur[t], pk), T = keyed(tgt[t], pk);
    T.forEach((v, k) => { if (!C.has(k)) res.missing.push({t, k}); else if (C.get(k) !== v) res.wrong.push({t, k}); });
    C.forEach((v, k) => { if (!T.has(k)) res.extra.push({t, k}); });
  });
  res.ok = !res.missing.length && !res.extra.length && !res.wrong.length;
  return res;
}
function canon(i) {
  let sql = baseSql(D);
  for (let k = 0; k < i; k++) if (L[k].ref) sql += '\n' + L[k].ref.map(q => q + ';').join('\n');
  return sql;
}

// ════════════════════════════════════════════════════ разбор команды ══
function splitTop(s, sep) {
  const out = []; let depth = 0, q = false, cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === "'") { if (s[i + 1] === "'") { cur += s[++i]; } else q = false; } continue; }
    if (c === "'") { q = true; cur += c; continue; }
    if (c === '(') depth++; if (c === ')') depth--;
    if (c === sep && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}
function tuplesOf(s) {
  const out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[\s,]/.test(c)) { i++; continue; }
    if (c !== '(') return null;
    let depth = 0, q = false, j = i;
    for (; j < s.length; j++) {
      const d = s[j];
      if (q) { if (d === "'") { if (s[j + 1] === "'") j++; else q = false; } continue; }
      if (d === "'") q = true; else if (d === '(') depth++; else if (d === ')') { depth--; if (!depth) break; }
    }
    if (depth) return null;
    const inner = s.slice(i + 1, j);
    out.push({raw: '(' + inner + ')', vals: splitTop(inner, ',').map(v => v.trim())});
    i = j + 1;
  }
  return out;
}
function parse(sql) {
  const s = sql.replace(/--[^\n]*/g, ' ').replace(/\s+/g, ' ').trim().replace(/;\s*$/, '');
  if (!s) return null;
  let m;
  if (/^insert\s+into\s+\w+\s*(\([^)]*\))?\s*\(?\s*select\b/i.test(s)) return {err: 'В этой лабораторной строки добавляются через VALUES.'};
  if ((m = /^insert\s+into\s+(\w+)\s*(?:\(([^)]*)\))?\s*values\s*([\s\S]+)$/i.exec(s))) {
    const t = m[1].toLowerCase();
    if (!TABLES[t]) return {err: `Таблицы ${m[1]} нет. Есть: ${Object.keys(TABLES).join(', ')}.`};
    if (((m[3].match(/'/g) || []).length) % 2) return {err: "Не закрыта одинарная кавычка: у каждого текста кавычка ' нужна и в начале, и в конце.", lint: true};
    const tuples = tuplesOf(m[3]);
    if (!tuples || !tuples.length) return {err: 'После VALUES — скобки со значениями через запятую: (…), (…).', lint: true};
    for (let i = 0; i < tuples.length; i++) for (const v of tuples[i].vals) {
      const e = lintVal(v);
      if (e) return {err: (tuples.length > 1 ? `Строка ${i + 1}: ` : '') + e, lint: true};
    }
    const cols = m[2] != null ? m[2].split(',').map(c => c.trim().toLowerCase()) : null;
    return {kind: 'INSERT', t, sql: s, cols, tuples};
  }
  if ((m = /^select\s+([\s\S]+?)\s+from\s+(\w+)(?:\s+where\s+([\s\S]+?))?(?:\s+order\s+by\s+[\s\S]+)?$/i.exec(s))) {
    const t = m[2].toLowerCase();
    if (!TABLES[t]) return {err: `Таблицы ${m[2]} нет. Есть: ${Object.keys(TABLES).join(', ')}.`};
    return {kind: 'SELECT', t, sql: s, where: m[3] || null, count: /count\s*\(/i.test(m[1])};
  }
  if (/^(update|delete|drop|alter|create|truncate|begin|commit|rollback)/i.test(s)) return {err: 'На этой смене пульт выполняет INSERT и SELECT. Ошиблись — «Сброс уровня» вернёт базу к началу.'};
  return {err: 'Не понял команду. Начните с INSERT INTO … или SELECT.'};
}
// значение в VALUES, похожее на текст без кавычек, — частая ошибка; объясняем до запуска
function lintVal(v) {
  if (!v) return 'Пустое значение между запятыми — пропущено значение или лишняя запятая.';
  if (/^'(?:[^']|'')*'$/.test(v) || /^-?\d+(\.\d+)?$/.test(v) || /^(null|default|true|false)$/i.test(v) || /^\(/.test(v) || /^\w+\s*\(/.test(v)) return null;
  if (/^".*"$/.test(v)) return `Значение ${v} в двойных кавычках. В SQL двойные кавычки — для имён столбцов, а текст пишется в одинарных: '${v.slice(1, -1)}'.`;
  if (/[‘’«»“”`]/.test(v)) return `В ${v} не те кавычки. Нужна прямая одинарная кавычка ' (в английской раскладке — клавиша Э).`;
  if (/^'/.test(v) || /'$/.test(v)) return `В ${v} кавычка только с одной стороны — нужна и в начале, и в конце.`;
  return `Значение ${v} без кавычек. Текст, время и номера вроде 3A или ИИ-750 пишутся в одинарных кавычках: '${v}'. Без кавычек пишутся только числа, NULL и DEFAULT.`;
}
function litVal(raw) {
  const v = raw.trim(); let m;
  if ((m = /^'((?:[^']|'')*)'$/.exec(v))) return m[1].replace(/''/g, "'");
  if (/^null$/i.test(v)) return null;
  if (/^default$/i.test(v)) return undefined;
  if (/^-?\d+$/.test(v)) return +v;
  return v;
}
const fmt = v => v === null || v === undefined ? 'NULL' : typeof v === 'string' ? `'${v}'` : String(v);
const COLOF = {ck_baggage_weight: 'weight_kg', ck_seat_no: 'seat_no', ck_seat_cls: 'cls', ck_passenger_birth: 'birth_year', ck_passenger_meal: 'meal',
  fk_passenger_flight: 'flight_no', fk_passenger_seat: 'seat_no', fk_baggage_passenger: 'passenger_id', uq_passenger_seat: 'seat_no'};
const badCol = (e, t) => e.column || COLOF[e.constraint] || (/_pkey$/.test(e.constraint || '') ? TABLES[t] : null);
function explain(e) {
  const c = e.constraint || '';
  switch (e.code) {
    case '23514': return ({ck_baggage_weight: 'Вес чемодана — от 1 до 32 кг.', ck_seat_no: 'Номер места: ряд 1–6 и буква A–F, например 3C.', ck_seat_cls: "Класс — только 'бизнес' или 'эконом'.",
      ck_passenger_birth: 'Год рождения — от 1920 до 2026.', ck_passenger_meal: "Питание: 'стандарт', 'детское', 'вегетарианское' или 'ресторан'."})[c] || 'Значение нарушает правило CHECK.';
    case '23505': return c === 'uq_passenger_seat' ? 'Это место на этом рейсе уже занято: двое в одном кресле невозможны.' : 'Строка с таким ключом уже есть — первичный ключ должен быть уникальным.';
    case '23503': return ({fk_passenger_flight: 'Такого рейса нет в flight. Сначала рейс — потом пассажиры на него.', fk_passenger_seat: 'Такого кресла нет в seat. Сначала кресло — потом пассажир на него.',
      fk_baggage_passenger: 'Пассажира с таким id нет. Проверьте номер владельца.'})[c] || 'Ссылка указывает на строку, которой нет.';
    case '23502': return `Столбец ${e.column || ''} обязателен (NOT NULL), а значения у него нет и по умолчанию тоже.`;
    case '42703': return 'Такого столбца нет — проверьте имя в перечне.';
    case '42601': return /more expressions|more target/i.test(e.message) ? 'Число значений в скобке не совпадает с числом столбцов в перечне.' : 'Синтаксическая ошибка — проверьте слово, названное в сообщении, и что перед ним.';
    case '22P02': case '42804': case '22007': case '22008': return 'Значение не подходит к типу столбца: числа — без кавычек, текст и время — в одинарных кавычках.';
    case '22001': return 'Значение длиннее, чем допускает столбец.';
    case '42P01': return 'Такой таблицы нет.';
    default: return '';
  }
}

// русская буква вместо латинской (и наоборот) — выглядят одинаково, а для базы разные
const HOMO = {'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H', 'К': 'K', 'М': 'M', 'О': 'O', 'Р': 'P', 'Т': 'T', 'Х': 'X', 'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x', 'у': 'y'};
const lat = v => String(v ?? '').replace(/[АВСЕНКМОРТХасеорху]/g, c => HOMO[c]);
function homoText(a, b, where) {
  a = String(a); b = String(b);
  const i = [...a].findIndex((c, k) => c !== [...b][k]);
  const ch = [...a][i] || '', ru = /[А-яЁё]/.test(ch);
  return `В ${where} '${a}' буква «${ch}» набрана в ${ru ? 'русской' : 'английской'} раскладке, а в документе — ${ru ? 'латинская' : 'русская'}. На экране они одинаковые, но для базы это разные символы. ${ru ? 'Переключите раскладку на EN и наберите заново.' : ''}`;
}
function homoNote(cur, tgt, cmp) {
  for (const x of cmp.wrong) {
    const pk = TABLES[x.t], a = cur[x.t].find(r => String(r[pk]) === x.k), b = tgt[x.t].find(r => String(r[pk]) === x.k);
    for (const c of COLS[x.t]) if (a[c] !== b[c] && a[c] != null && b[c] != null && lat(a[c]) === lat(b[c])) return homoText(a[c], b[c], `${x.t}.${c}`);
  }
  for (const x of cmp.extra) { const m = cmp.missing.find(y => y.t === x.t && lat(y.k) === lat(x.k)); if (m) return homoText(x.k, m.k, `${x.t}.${TABLES[x.t]}`); }
  return '';
}
const ERRT = {'23505': 'unique', '23514': 'check', '23503': 'fk', '23502': 'notnull'};

// ═══════════════════════════════════════════════════ выполнение ══
function cmdBar(html) { $('cmd').innerHTML = html || ''; $('cmd').hidden = !html; }
function hud(done, yes, total, word = 'проверено', word2 = 'подошло') { $('cnt').innerHTML = total == null ? '' : `<b>${done}</b>/${total} ${word} · <b>${yes}</b> ${word2}`; $('cnt').hidden = total == null; }
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c;
const hold = async n => { while (window.LAB && window.LAB.holdAt != null && n >= window.LAB.holdAt) await sleep(100); };

function statements(sql) { return splitTop(sql.replace(/--[^\n]*/g, ' '), ';').map(x => x.trim()).filter(Boolean); }
async function run() {
  if (running || !db || !G || G.lv == null) return;
  const all = $('sql').value.trim();
  const st = statements(all);
  if (!st.length) return;
  pushHist(all);
  const qs = st.map(parse);
  const lv = L[G.lv];
  $('verdict').innerHTML = '';
  const bad = qs.findIndex(q => q && q.err);
  if (bad >= 0) {
    const msg = (st.length > 1 ? `Команда ${bad + 1}: ` : '') + qs[bad].err;
    $('result').innerHTML = `<span class="bad">${esc(msg)}</span>`;
    SFX.err(); W.play('jump', true); setTimeout(() => W.play('idle'), 700);
    errBox('Ошибка в записи команды', msg);
    report('lint', {lv: G.lv + 1, key: lv.key, sql: st[bad].slice(0, 600), msg});
    G.P.lints = (G.P.lints || 0) + 1; save();
    return;
  }
  if (lv.pred && !G.P.pred[lv.key] && qs.some(q => q.kind === 'INSERT')) await predict(lv);
  running = true; $('runBtn').disabled = true;
  W.clearChips(); W.hideCard(); W.clearSay();
  const rec = G.P.lv[lv.key] = G.P.lv[lv.key] || {runs: 0, fails: 0};
  try {
    for (let i = 0; i < qs.length; i++) {
      G.stmtTag = qs.length > 1 ? `команда ${i + 1} из ${qs.length} · ` : '';
      rec.runs++;
      const info = qs[i].kind === 'INSERT' ? await runInsert(qs[i], st[i]) : await runSelect(qs[i], st[i]);
      const left = qs.length - 1 - i;
      if (info && info.err && left) { $('result').insertAdjacentHTML('beforeend', `<div class="ru">Команды после ошибки (${left}) не выполнялись.</div>`); break; }
      if ((G.P.lv[lv.key] || {}).done && left && G.lv === L.indexOf(lv)) break;
    }
  } finally {
    G.stmtTag = '';
    cmdBar(null); hud(); W.camS.follow = false; W.focus(null); W.beamOff();
    running = false; $('runBtn').disabled = false;
  }
}
async function fin(q, info) { await afterRun(q, info); return info; }

async function runInsert(q, sql) {
  const cols = q.cols || COLS[q.t];
  const colPart = q.cols ? ` (${q.cols.join(', ')})` : '';
  // 1. команда целиком — есть ли ошибка, которая не про конкретную строку
  let whole = null;
  await db.exec('BEGIN');
  try { await db.query(q.sql); } catch (e) { whole = e; }
  await db.exec('ROLLBACK');
  if (whole && !/^23/.test(whole.code || '')) {
    W.play('jump', true); setTimeout(() => W.play('idle'), 700);
    $('result').innerHTML = `<span class="bad">ERROR: ${esc(whole.message)}</span><div class="ru">${esc(explain(whole))}</div>`;
    SFX.err(); journal(sql, 'ERROR ' + (whole.code || ''));
    return fin(q, {err: whole});
  }
  // 2. пробный прогон по строкам — что подставит СУБД и где откажет
  const got = []; let failAt = -1, failErr = null;
  await db.exec('BEGIN');
  for (let i = 0; i < q.tuples.length; i++) {
    try { got.push((await db.query(`INSERT INTO ${q.t}${colPart} VALUES ${q.tuples[i].raw} RETURNING ${SEL(q.t).slice(7).replace(/ FROM \w+$/, '')}`)).rows[0]); }
    catch (e) { failAt = i; failErr = e; break; }
  }
  await db.exec('ROLLBACK');
  if (whole && failAt < 0) { failAt = q.tuples.length - 1; failErr = whole; }
  // 3. робот несёт строки по одной
  const n = q.tuples.length;
  cmdBar(`<span class="k">${G.stmtTag || ''}INSERT INTO ${esc(q.t)}${esc(colPart)}</span><span class="w">${n} ${plural(n, 'строка', 'строки', 'строк')} в VALUES — по одной, сверху вниз</span>`);
  W.camS.follow = true;
  hud(0, 0, n, 'строк', 'принято');
  const jobs = [];
  const fast = () => W.speed >= 50;
  for (let i = 0; i < n; i++) {
    const tu = q.tuples[i], ok = i !== failAt;
    const given = Object.fromEntries(cols.slice(0, tu.vals.length).map((c, k) => [c, tu.vals[k]]));
    const row = ok ? got[i] : Object.fromEntries(cols.map(c => [c, litVal(given[c] ?? 'NULL')]));
    const loc = W.locate(q.t, row);
    if (!fast() || !ok) {
      W.focus(loc.aim);
      await W.robotGo(loc.x, loc.z); W.face(loc.face); W.aimBeam(loc.aim);
      const bc = ok ? null : badCol(failErr, q.t);
      const lines = COLS[q.t].map(c => {
        const has = c in given;
        const v = has ? given[c] : null, dv = /^default$/i.test(v || '');
        const val = has && !dv ? `<b>${esc(v)}</b>` : ok ? `<b>${esc(fmt(row[c]))}</b><em>${row[c] === null ? 'пусто' : 'по умолчанию'}</em>` : '<b>—</b><em>не указан</em>';
        return `<div class="${c === bc ? 'bad' : has && !dv ? '' : 'def'}"><span>${c}</span>${val}</div>`;
      }).join('');
      const v = ok ? `<div class="rc-v yes">ПРИНЯТО</div>` : `<div class="rc-v err">ОТКАЗ · ${esc(failErr.constraint || failErr.column || failErr.code)}</div><div class="rc-t">${esc(explain(failErr))}</div>`;
      W.showCard(loc.obj[0], loc.obj[1], `<div class="rc-h">${esc(q.t)} · строка ${i + 1} из ${n}</div>${lines}${v}`, ok ? 'ins' : 'err');
      ok ? SFX.yes() : SFX.err();
      await sleep(Math.max(120, 700 / W.speed));
      await hold(i + 1);
    }
    if (!ok) {
      W.beamOff(); W.play('jump', true); W.shake();
      hud(i, i, n, 'строк', 'принято');
      const cyr = Object.values(given).find(v => /^'.*[АВСЕНКМОРТХ].*'$/.test(v || '') && /^'[1-9][АВСЕНКМОРТХA-Z0-9]*'$/.test(v));
      const ruNote = cyr ? ` В ${cyr} русская буква — номера мест и выходов пишутся латиницей (раскладка EN).` : '';
      $('result').innerHTML = `<span class="bad">ERROR: ${esc(failErr.message)}</span><div class="ru">${esc(explain(failErr) + ruNote)} Команда не выполнена — строки, вставленные до этой, тоже отменяются.</div>`;
      await Promise.all(jobs);
      await sleep(1500);
      $('rewind').hidden = false; SFX.rew();
      W.hideCard();
      await W.sync(await state(), true);
      await sleep(400); $('rewind').hidden = true;
      W.clearChips(); W.play('idle');
      journal(sql, 'ERROR ' + (failErr.constraint || failErr.code));
      await W.robotGo(W.HOME.x, 0); W.face(-Math.PI / 2);
      return fin(q, {err: failErr});
    }
    W.hideCard(); SFX.pop();
    jobs.push(W.insertRow(q.t, row, true));
    const k = String(row[TABLES[q.t]]);
    W.chip(q.t, k, 'yes', '+');
    if (!fast()) { W.play('jump', true); await sleep(Math.max(80, 380 / W.speed)); W.play('idle'); }
    hud(i + 1, i + 1, n, 'строк', 'принято');
  }
  W.beamOff();
  // 4. настоящая команда
  let r;
  try { r = await db.query(q.sql); } catch (e) { $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span>`; await W.sync(await state(), true); return fin(q, {err: e}); }
  const tag = `INSERT 0 ${r.affectedRows}`;
  $('result').innerHTML = `<span class="ok">${esc(tag)}</span><div class="ru">${r.affectedRows} ${plural(r.affectedRows, 'строка добавлена', 'строки добавлены', 'строк добавлено')} одной командой.</div>`;
  journal(sql, tag);
  await Promise.all(jobs);
  await W.robotGo(W.HOME.x, 0); W.face(-Math.PI / 2);
  W.camS.follow = false;
  await W.sync(await state(), true);
  return fin(q, {err: null, n: r.affectedRows, cols: q.cols});
}

async function runSelect(q, sql) {
  const pk = TABLES[q.t];
  let rows, r;
  try {
    rows = (await db.query(`SELECT *, ${q.where ? `(${q.where})` : 'true'} AS __w FROM (${SEL(q.t)}) x ORDER BY 1`)).rows;
    r = await db.query(q.sql);
  } catch (e) {
    W.play('jump', true); setTimeout(() => W.play('idle'), 700);
    $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span><div class="ru">${esc(explain(e))}</div>`;
    SFX.err(); journal(sql, 'ошибка');
    return fin(q, {err: e});
  }
  cmdBar(`<span class="k">${G.stmtTag || ''}SELECT … FROM ${esc(q.t)}</span><span class="w">${q.where ? 'WHERE ' + esc(q.where) : q.count ? 'count(*) — робот считает строки' : 'все строки'}</span>`);
  W.camS.follow = true;
  let done = 0, yes = 0;
  const one = q.t === 'flight';
  hud(0, 0, rows.length);
  for (const row of rows) {
    const k = String(row[pk]);
    const loc = W.locate(q.t, row);
    const v = row.__w, kind = v === true ? 'yes' : v === false ? 'no' : 'unk';
    if (W.speed < 50 && (!one || done === 0)) {
      W.focus(loc.aim);
      await W.robotGo(loc.x, loc.z); W.face(loc.face); W.aimBeam(loc.aim);
      SFX[kind]();
      await sleep(Math.max(40, (q.count ? 120 : 380) / W.speed));
      await hold(done + 1);
    }
    done++; if (v === true) yes++;
    if (!one) W.chip(loc.obj[0], loc.obj[1], kind, q.count && v === true ? String(yes) : kind === 'yes' ? '✓' : '?');
    hud(done, yes, rows.length);
  }
  if (one) W.chip('flight', '*', 'yes', String(yes));
  W.beamOff(); W.fadeNo();
  const n = r.rows.length;
  const val = q.count && r.rows[0] ? Object.values(r.rows[0])[0] : null;
  const tag = q.count && n === 1 ? `count = ${val}` : `(${n} ${plural(n, 'строка', 'строки', 'строк')})`;
  const cols = r.rows[0] ? Object.keys(r.rows[0]) : [];
  const grid = !q.count && n ? `<table class="res"><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${r.rows.slice(0, 12).map(row => `<tr>${cols.map(c => `<td>${esc(row[c] == null ? 'NULL' : row[c])}</td>`).join('')}</tr>`).join('')}</table>${n > 12 ? `<div class="ru">…и ещё ${n - 12}</div>` : ''}` : '';
  $('result').innerHTML = `<span class="ok">${esc(tag)}</span>${grid}<div class="ru">Это только просмотр — база не изменилась.</div>`;
  journal(sql, tag);
  await W.robotGo(W.HOME.x, 0); W.face(-Math.PI / 2);
  return fin(q, {err: null, value: val != null ? Number(val) : null});
}
function journal(sql, out) {
  G.P.journal.push({t: new Date().toISOString().slice(11, 19), lv: L[G.lv].key, q: sql.slice(0, 600), o: out}); save();
  report('run', {lv: G.lv + 1, key: L[G.lv].key, sql: sql.slice(0, 600), out, ok: !/^ERROR|ошибка/.test(out), txt: ($('result').innerText || '').slice(0, 300)});
}

// ═════════════════════════════════════════════════ проверка уровня ══
async function afterRun(q, info) {
  const lv = L[G.lv], rec = G.P.lv[lv.key];
  if (rec.done && !lv.final) { if (!info.err) verdict(true, 'Уровень уже пройден — можно идти дальше.', '', true, true); return; }
  let ok = false, msg = '';
  if (lv.check === 'custom') {
    if (lv.slotBy === 'constraint' && q.kind === 'INSERT') {
      if (info.err) {
        const key = info.err.code === '23502' ? 'notnull' : info.err.constraint;
        if (lv.slots.includes(key)) G.slots[key] = info.err.code === '23502' ? 'столбец ' + (info.err.column || '') : 'отказ получен';
        else msg = `Отказ по правилу ${key || info.err.code} — его нет в списке. Нужны: ${lv.slots.filter(x => G.slots[x] == null).map(x => lv.slotNames[x]).join(', ')}.`;
      } else msg = 'Эту строку СУБД приняла. Нужна такая, которую она отклонит именно по одному из правил списка.';
    }
    renderSlots();
    ok = lv.slots.every(s => G.slots[s] != null);
    if (ok) rec.note = lv.slots.map(s => `${lv.slotNames[s]}: ${G.slots[s]}`).join('; ');
    if (!ok) { if (msg) verdict(false, msg); return; }
    return success(lv, rec);
  }
  if (q.kind === 'SELECT') {
    if (!lv.needCount || info.err || !q.count || q.t !== lv.needCount || q.where) return;
    const jj = judge(await state(), G.target, G.start, lv.tables, TABLES);
    if (!jj.ok) { verdict(null, 'Сначала загрузите все чемоданы — потом считайте.'); return; }
    rec.note = `count(*) FROM ${q.t} = ${info.value}`;
    return success(lv, rec);
  }
  if (info.err) {
    errBox('Ошибка — команда не выполнена', `${explain(info.err) || info.err.message} База не изменилась.`);
    if (info.err.code === '23505' && lv.key === 'group') G.sawFail = true;
    if (!(lv.prefill && rec.runs === 1)) rec.fails++;
    save(); renderMission(); return;
  }
  G.maxN = Math.max(G.maxN || 0, info.n || 0);
  if (lv.noCol && info.cols && info.cols.includes(lv.noCol)) G.usedCol = true;
  const cur = await state();
  const j = judge(cur, G.target, G.start, lv.tables, TABLES);
  if (j.wrong.length) {
    j.wrong.forEach(x => W.chip(x.t, x.k, 'extra', x.c && !x.g ? 'лишняя' : 'не то'));
    const kh = keyHint(j.wrong, j.pending);
    return rollback(rec, 'Не совпадает с документом. ' + (kh || describe(j.wrong).join(' ')));
  }
  if (j.pending.length) {
    verdict(null, `Принято. Осталось добавить: ${j.pending.length} ${plural(j.pending.length, 'строку', 'строки', 'строк')}.`);
    renderMission(); return;
  }
  if (lv.one && G.maxN < lv.one) return rollback(rec, 'Строки верные, но их нужно было добавить одной командой: VALUES (…), (…), (…).');
  if (lv.noCol && G.usedCol) return rollback(rec, `Строки верные, но столбец ${lv.noCol} вы указали сами. Его значение по умолчанию подставляет СУБД — уберите ${lv.noCol} из перечня столбцов.`);
  if (lv.key === 'group' && !G.sawFail) return rollback(rec, 'Группа на месте, но сначала нужно было запустить список как есть и увидеть отказ. Список снова в пульте — запустите его.', true);
  if (lv.needCount) { verdict(null, `Все строки на месте. Осталось доложить: SELECT count(*) FROM ${lv.needCount};`); renderMission(); return; }
  return success(lv, rec);
}
const starsOf = r => !r || !r.done ? 0 : (r.fails || 0) === 0 ? 3 : r.fails <= 2 ? 2 : 1;
// неверный результат: сообщение остаётся на экране, база сама возвращается к началу уровня
async function rollback(rec, msg, prefill) {
  rec.fails++; save();
  errBox('Не совпало — откат', msg + ' База возвращена к началу уровня, команда осталась в пульте: исправьте её и запустите снова.');
  report('rollback', {lv: G.lv + 1, key: L[G.lv].key, msg: msg.slice(0, 300)});
  await sleep(1400);
  $('rewind').hidden = false; SFX.rew();
  await loadSql(G.startSql);
  await W.sync(await state(), true);
  await sleep(300); $('rewind').hidden = true;
  W.clearChips();
  G.maxN = 0; G.usedCol = false;
  if (prefill && L[G.lv].prefill) $('sql').value = L[G.lv].prefill;
  renderMission();
}
function errBox(title, text) {
  $('verdict').innerHTML = `<div class="v-bad"><b>${esc(title)}</b>${esc(text)}<button class="vx" id="vx" title="Скрыть">✕</button></div>`;
  $('vx').onclick = () => { $('verdict').innerHTML = ''; };
}
async function success(lv, rec) {
  rec.done = true; rec.at = new Date().toISOString(); setTimeout(() => push(G.P, true), 0);
  report('done', {lv: G.lv + 1, key: lv.key, fails: rec.fails || 0, stars: starsOf(rec), pts: score().sum});
  const js = G.P.journal.filter(j => j.lv === lv.key && !/^ERROR|ошибка/.test(j.o));
  rec.sql = js.slice(-4).map(j => j.q).join('\n'); rec.tag = js.slice(-4).map(j => j.o).join('\n');
  save();
  SFX.ok(); W.play('jump', true); W.confetti();
  const pred = lv.pred && G.P.pred[lv.key];
  const pr = pred ? `<div class="pr ${pred.right ? 'ok' : 'no'}">Ваш прогноз: «${esc(pred.label)}» — ${pred.right ? 'верно' : 'на деле «' + esc(pred.alabel) + '»'}</div>` : '';
  const st = `<div class="stars">${'★'.repeat(starsOf(rec))}${'☆'.repeat(3 - starsOf(rec))}<span>${(rec.fails || 0) === 0 ? 'без промахов' : 'промахов: ' + rec.fails}</span></div>`;
  if (lv.final) { verdict(true, lv.ok, st + pr, false); await sleep(1600); await W.takeoff(); endScreen(); return; }
  verdict(true, lv.ok, st + pr, true);
  renderLevels(); renderMission();
}
function verdict(ok, text, extra = '', next = false, quiet = false) {
  const cls = ok === null ? 'v-mid' : ok ? 'v-ok' : 'v-bad';
  const head = ok === null ? '' : `<b>${ok ? (quiet ? 'Готово' : 'Уровень пройден') : 'Не совпало'}</b>`;
  $('verdict').innerHTML = `<div class="${cls}">${head}${esc(text)}${extra}
    ${next && G.lv + 1 < L.length ? '<button class="nextBtn" id="nextBtn">Следующий уровень →</button>' : ''}
</div>`;
  if ($('nextBtn')) $('nextBtn').onclick = () => { SFX.unlock(); startLevel(G.lv + 1); };
}

// ═════════════════════════════════════════════════════ уровни ══
function unlocked(i) { return G.demo || i === 0 || !!(G.P.lv[L[i - 1].key] || {}).done; }
function renderLevels() {
  $('levels').innerHTML = L.map((lv, i) => {
    const rec = G.P.lv[lv.key] || {};
    return `<button class="lvb${i === G.lv ? ' on' : ''}${rec.done ? ' done' : ''}${lv.final ? ' fin' : ''}${lv.hard ? ' hard' : ''}" data-i="${i}" ${unlocked(i) ? '' : 'disabled'} title="${esc(lv.title)}">${unlocked(i) ? (lv.final ? '✈' : i + 1) : '🔒'}${rec.done ? `<i class="st">${'★'.repeat(starsOf(rec))}</i>` : ''}</button>`;
  }).join('') + (G.demo ? '<span class="demo">ДЕМО</span>' : `<span class="pts">${score().sum.toFixed(1).replace('.0', '')}<small>/9</small></span>${G.sess ? '<span id="sync" class="sync ok">☁ сохранено</span>' : ''}`);
  $('levels').querySelectorAll('[data-i]').forEach(b => b.onclick = () => { if (!running) startLevel(+b.dataset.i); });
}
function renderSlots() {
  const lv = L[G.lv];
  if (!lv.slots || !$('slots')) return;
  $('slots').innerHTML = lv.slots.map(s => `<div class="slot${G.slots[s] != null ? ' on' : ''}${lv.key === 'count' ? ' cnt' : ''}"><b>${esc(lv.slotNames[s])}</b><span>${G.slots[s] != null ? esc(G.slots[s]) : lv.key === 'count' ? '?' : 'нет отказа'}</span></div>`).join('');
}
function cmdsLine(lv) {
  if (lv.cmds) return lv.cmds;
  const n = (lv.ref || []).length;
  return n <= 1 ? 'Решение — одна команда' : `Решение — ${n} команды: по одной или вместе через ;`;
}
const SCHEMA_HTML = `<details class="schema"><summary>Структура таблиц</summary>
  <div><b>flight</b> flight_no <i>PK</i>, dest <i>NOT NULL</i>, dep_time <i>time, NOT NULL</i>, gate</div>
  <div><b>seat</b> seat_no <i>PK, CHECK '1A'…'6F'</i>, cls <i>DEFAULT 'эконом', CHECK бизнес/эконом</i></div>
  <div><b>passenger</b> id <i>PK</i>, flight_no <i>→ flight</i>, seat_no <i>→ seat</i>, full_name <i>NOT NULL</i>, birth_year <i>CHECK 1920–2026</i>, city, meal <i>DEFAULT 'стандарт'</i> · <i>UNIQUE (flight_no, seat_no)</i></div>
  <div class="ru-n">Номера мест (1A…6F) и выходов (A1) — латиницей, раскладка EN.</div>
  <div><b>baggage</b> tag <i>PK</i>, passenger_id <i>→ passenger</i>, weight_kg <i>CHECK 1–32</i></div></details>`;
function renderMission() {
  const lv = L[G.lv], rec = G.P.lv[lv.key] || {};
  $('mission').innerHTML = `<span class="tag">${lv.final ? 'КОНТРОЛЬНЫЙ' : 'УРОВЕНЬ ' + (G.lv + 1) + ' / ' + L.length}</span>${lv.hard ? '<span class="tag hardt">СЛОЖНЫЙ · ' + String(PTS[lv.key]).replace('.', ',') + ' балла</span>' : ''}
    <h1>${esc(lv.title)}</h1><div class="lab">${esc(lv.lab)}</div>
    <p>${esc(lv.text)}</p>
    <ul>${lv.goals.map(g => `<li class="${rec.done ? 'done' : ''}">${esc(g)}</li>`).join('')}</ul>
    <div class="ncmd">${esc(cmdsLine(lv))}</div>
    ${lv.doc ? `<div class="docw">${lv.doc}</div>` : ''}
    <div id="slots" class="slots"></div>
    <div class="mbtn">${!lv.final && lv.hint && (rec.fails || 0) >= (lv.hint1 ? 1 : 2) ? '<button class="btn sm" id="hintBtn">Подсказка</button>' : ''}${G.demo && lv.ref ? '<button class="btn sm" id="solBtn">Решение</button>' : ''}</div>
    <div id="hintBox"></div>
    ${SCHEMA_HTML}
    <div class="hint">Щёлкните кресло, пассажира, чемодан или табло — увидите строку. У трапа щелчок по пассажиру покажет посадочный.</div>`;
  if ($('solBtn')) $('solBtn').onclick = () => { $('sql').value = lv.ref.map(q => q + ';').join('\n'); };
  if ($('hintBtn')) $('hintBtn').onclick = () => { $('hintBox').innerHTML = `<div class="hintx">${esc(lv.hint)}</div>`; rec.hint = true; save(); };
  renderSlots();
}
async function startLevel(i) {
  if (!unlocked(i)) return;
  running = true;
  const same = G.lv === i;
  G.lv = i; G.slots = {}; G.maxN = 0; G.usedCol = false; G.sawFail = false;
  const lv = L[i];
  $('verdict').innerHTML = ''; $('result').innerHTML = '';
  renderLevels(); renderMission();
  const sql = canon(i);
  G.target = null;
  if (lv.ref) { await loadSql(sql); for (const q of lv.ref) await db.query(q); G.target = await state(); }
  await loadSql(sql);
  G.startSql = sql; G.start = await state();
  W.resetRoot(); W.clearConfetti();
  W.build(await state(), {flight: D.FLIGHT, queue: (lv.queue || []).map(talon), cart: (lv.cart || []).map(tagOf), ghosts: lv.ghosts});
  W.home();
  if (!same || !$('sql').value.trim()) $('sql').value = lv.prefill || '';
  if (lv.prefill) paste.add(lv.prefill);
  G.P.cur = i; save();
  report('level', {lv: i + 1, key: lv.key, reset: same});
  running = false;
  $('sql').focus();
}

// ═════════════════════════════════════════════════ предсказание ══
function predict(lv) {
  return new Promise(res => {
    const p = lv.pred, m = $('modal');
    m.hidden = false;
    m.innerHTML = `<div class="dlg panel"><span class="tag">Сначала прогноз</span><div class="dlg-q">${esc(p.q)}</div>
      <div class="dlg-ch">${p.choices.map(c => `<button data-k="${c.k}">${esc(c.t)}</button>`).join('')}</div>
      <div class="mu">Ответ запишется в протокол, потом робот выполнит вашу команду.</div></div>`;
    m.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
      const k = b.dataset.k, c = p.choices.find(x => x.k === k), a = p.choices.find(x => x.k === p.answer);
      G.P.pred[lv.key] = {q: p.q, label: c.t, alabel: a.t, right: k === p.answer};
      save(); m.hidden = true; m.innerHTML = ''; res();
    });
  });
}

// ═════════════════════════════════════════════════ итоги, протокол ══
const QUESTIONS = [
  'Уровни «Эконом по умолчанию» и «Первый пассажир»: что записала СУБД в cls и meal, хотя вы их не указывали? Откуда она взяла эти значения?',
  'Уровень «Ещё два рейса»: чем NULL в столбце gate отличается от текста \'NULL\' и от пустой строки \'\'?',
  'Уровень «Сначала кресло»: почему пассажира нельзя было вставить раньше кресла? В каком порядке заполнять flight, seat, passenger, baggage?',
  'Уровень «Ошибка в списке»: сколько строк добавила команда, в которой ошибка была только во второй строке, и почему?',
];
function score() {
  const rows = L.map(l => ({l, pts: PTS[l.key] || 0, ok: !!(G.P.lv[l.key] || {}).done}));
  return {rows, sum: Math.round(rows.reduce((t, r) => t + (r.ok ? r.pts : 0), 0) * 10) / 10};
}
const MARK = s => s >= 8.5 ? '5' : s >= 6.5 ? '4' : s >= 4.5 ? '3' : '2';
function endScreen() {
  const m = $('modal'); m.hidden = false;
  const sum = score().sum;
  const preds = Object.values(G.P.pred), pr = preds.filter(p => p.right).length;
  const fails = Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0);
  m.innerHTML = `<div class="dlg panel end"><span class="tag">Рейс открыт</span><h2>${esc(D.FLIGHT)} в воздухе</h2>
    <div class="end-row"><div><b>${L.filter(l => (G.P.lv[l.key] || {}).done).length}/${L.length}</b><span>уровней</span></div><div><b>${pr}/${preds.length}</b><span>прогнозов верно</span></div>
      <div><b>${fails}</b><span>промахов</span></div><div><b>${sum}/9</b><span>баллов автоматически</span></div></div>
    <div class="btns"><button class="nextBtn" id="protoBtn">Протокол для отчёта</button><button class="btn" id="backBtn">Вернуться</button></div></div>`;
  $('protoBtn').onclick = protocol;
  $('backBtn').onclick = () => { m.hidden = true; W.resetRoot(); startLevel(G.lv); };
}
function protocol() {
  const P = G.P, pr = $('proto');
  const sc = score(), done = sc.rows.filter(r => r.ok).length;
  const awayMin = Math.round((P.awayMs || 0) / 60000);
  pr.hidden = false;
  pr.innerHTML = `<div class="pr-bar"><button class="nextBtn" onclick="window.print()">Печать / PDF</button><button class="btn" onclick="document.getElementById('proto').hidden=true">Закрыть</button></div>
  <div class="pr-doc"><div class="pr-eye">ФГАОУ ВО «Тюменский государственный университет» · Колледж ИИ · ОПЦ.07</div>
  <h2>Протокол · ЛР-13 «Наполнение базы данными: оператор INSERT»</h2>
  <div class="pr-meta"><span>Студент</span><span><input id="fio" value="${esc(P.fio || [G.fio, G.grp].filter(Boolean).join(', '))}" placeholder="Фамилия И. О., группа"></span>
    <span>Вариант</span><span>№ ${G.seed} · рейс ${esc(D.FLIGHT)}</span>
    <span>Сдано</span><span>${new Date().toLocaleString('ru-RU')} · пройдено ${done} из ${L.length}${done < L.length ? ' (досрочно)' : ''}</span>
    <span>Запусков</span><span>${P.journal.length} · ошибок записи команд: ${P.lints || 0} · уходов со вкладки: ${P.away || 0}${awayMin ? ` (≈${awayMin} мин)` : ''} · заблокировано вставок: ${P.pastes || 0}</span></div>
  <h3>Уровни</h3><table><tr><th>Уровень</th><th>Команды</th><th>Ответ СУБД</th><th>Промахов</th><th>Баллы</th></tr>
  ${sc.rows.map(({l, pts, ok}) => { const r = P.lv[l.key] || {}; return `<tr><td>${esc(l.title)}<div class="pr-mu">${esc(l.lab)}</div></td><td><pre>${ok ? esc(r.sql) : 'не пройден'}</pre></td><td><pre>${esc(r.note || r.tag || '')}</pre></td><td>${ok ? r.fails || 0 : ''}</td><td>${ok ? String(pts).replace('.', ',') : '0'} / ${String(pts).replace('.', ',')}</td></tr>`; }).join('')}</table>
  <h3>Прогнозы</h3><table><tr><th>Вопрос</th><th>Ответ</th><th>На деле</th></tr>${Object.values(P.pred).map(p => `<tr><td>${esc(p.q)}</td><td>${esc(p.label)}</td><td>${p.right ? '✓' : esc(p.alabel)}</td></tr>`).join('')}</table>
  <h3>Ответы на вопросы</h3>${QUESTIONS.map((q, i) => `<div class="pr-q"><b>${i + 1}. ${esc(q)}</b><textarea data-a="${i}">${esc((P.answers || {})[i] || '')}</textarea></div>`).join('')}
  <h3>Оценка</h3><table><tr><td>Уровни (автоматически)</td><td><b>${String(sc.sum).replace('.', ',')}</b> из 9</td></tr><tr><td>Ответы на вопросы</td><td>до 1 — проверяет преподаватель</td></tr><tr><td>Защита</td><td>обязательна</td></tr>
  <tr><td>Шкала (уровни + ответы)</td><td>8,5–10 → «5» · 6,5–8,4 → «4» · 4,5–6,4 → «3»</td></tr></table>
  <p style="margin-top:22px">Проверил: Алёшкин А. А. ______________</p></div>`;
  $('fio').oninput = e => { P.fio = e.target.value; save(); };
  const fitT = t => { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 4) + 'px'; };
  pr.querySelectorAll('[data-a]').forEach(t => { fitT(t); t.oninput = () => { fitT(t); P.answers = P.answers || {}; P.answers[t.dataset.a] = t.value; save(); }; });
}
// досрочная сдача: протокол с тем, что пройдено сейчас
function submitDialog() {
  if (running || !G || G.lv == null) return;
  const sc = score(), done = sc.rows.filter(r => r.ok).length, m = $('modal');
  m.hidden = false;
  m.innerHTML = `<div class="dlg panel"><span class="tag">Сдать работу</span><h2>${done} из ${L.length} уровней</h2>
    <p>Сейчас набрано <b>${String(sc.sum).replace('.', ',')} из 9</b> баллов за уровни. Без ответов на вопросы это ${MARK(sc.sum) === '2' ? 'пока ниже «3»' : 'не меньше чем на «' + MARK(sc.sum) + '»'}; ответы добавят до 1 балла. Шкала: 8,5+ → «5», 6,5+ → «4», 4,5+ → «3».</p>
    <p class="mu">После сдачи можно продолжить — протокол просто сформируется заново.</p>
    <div class="btns"><button class="nextBtn" id="subGo">Сформировать протокол</button><button class="btn" id="subBack">Продолжить работу</button></div></div>`;
  $('subGo').onclick = () => { m.hidden = true; report('submit', {done, pts: sc.sum}); protocol(); };
  $('subBack').onclick = () => { m.hidden = true; };
}

// ═════════════════════════════════════════════════════ запуск ══
const save = () => { if (G.demo) return; try { localStorage.setItem(G.lkey, JSON.stringify(G.P)); } catch (e) { /* без хранилища */ } push(G.P); };
const loadKey = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
const load = s => { try { return JSON.parse(localStorage.getItem(LAB_KEY + s)); } catch (e) { return null; } };
const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k) || ''; localStorage.setItem(k, v); } catch (e) { return ''; } };
const HEAD = `<span class="tag">ОПЦ.07 · ЛР-13</span><h2>INSERT: открытие рейса</h2>
    <p>Самолёт пуст: ни рейса на табло, ни кресел, ни пассажиров. Всё, что появится на борту, появится из ваших команд <code>INSERT</code>. <b>Робот-СУБД</b> несёт каждую строку на её место и проверяет: есть ли всё обязательное, не нарушено ли правило, существует ли то, на что строка ссылается.</p>
    <p class="mu">12 уровней, каждый открывается после предыдущего. За каждый уровень — баллы; сдать можно в любой момент (кнопка «Сдать»). Вариант задаётся вашим местом в списке группы — у соседа данные другие.</p>`;
function startScreen() {
  loginScreen($('modal'), {head: HEAD, teacherCode: TEACHER_CODE, legacy: legacyScreen, onGo: s => begin(s.seed, !!s.demo, s.fio, s.grp, s)});
}
function legacyScreen() {
  let seed = null; try { seed = JSON.parse(localStorage.getItem('air-seed')); } catch (e) { /* нет */ }
  const qs = new URLSearchParams(location.search).get('n'); if (qs != null) seed = +qs;
  const m = $('modal'); m.hidden = false;
  const has = seed != null && load(seed);
  m.innerHTML = `<div class="dlg panel start"><span class="tag">ОПЦ.07 · ЛР-13</span><h2>INSERT: открытие рейса</h2>
    <p>Самолёт пуст: ни рейса на табло, ни кресел, ни пассажиров. Всё, что появится на борту, появится из ваших команд <code>INSERT</code>. <b>Робот-СУБД</b> несёт каждую строку на её место и проверяет: есть ли всё обязательное, не нарушено ли правило, существует ли то, на что строка ссылается.</p>
    <p class="mu">12 уровней, каждый открывается после предыдущего. За каждый уровень — баллы; сдать можно в любой момент (кнопка «Сдать»). Номер в журнале задаёт рейс, пассажиров и багаж — у соседа они другие.</p>
    <div class="dlg-id"><input id="fioIn" value="${esc(ls('air-fio'))}" placeholder="Фамилия Имя"><input id="grpIn" value="${esc(ls('air-grp'))}" placeholder="Группа"></div>
    <div class="dlg-num"><input id="seedIn" value="${seed != null ? seed : ''}" placeholder="№" autocomplete="off"><span>номер в журнале</span></div>
    <div id="startErr" class="bad"></div>
    <div class="btns"><button class="nextBtn" id="goBtn">${has ? 'Продолжить' : 'Открыть рейс'}</button>${has ? '<button class="btn" id="newBtn">Начать заново</button>' : ''}</div></div>`;
  const go = fresh => {
    const raw = $('seedIn').value.trim();
    const dm = raw.split(/\s+/);
    if (dm[0] === TEACHER_CODE) { m.hidden = true; begin(+(dm[1] || 0) || 0, true); return; }
    const v = parseInt(raw, 10), fio = $('fioIn').value.trim(), grp = $('grpIn').value.trim();
    if (fio.length < 3) { $('startErr').textContent = 'Впишите фамилию и имя — так преподаватель увидит вашу работу.'; $('fioIn').focus(); return; }
    if (isNaN(v) || v < 0 || v > 60 || String(v) !== raw) { $('startErr').textContent = 'Номер в журнале — число от 0 до 60.'; $('seedIn').focus(); return; }
    ls('air-fio', fio); ls('air-grp', grp);
    try { localStorage.setItem('air-seed', JSON.stringify(v)); if (fresh) localStorage.removeItem(LAB_KEY + v); } catch (e) { /* нет */ }
    m.hidden = true; begin(v, false, fio, grp);
  };
  $('goBtn').onclick = () => go(false);
  if ($('newBtn')) $('newBtn').onclick = () => go(true);
  ['seedIn', 'fioIn', 'grpIn'].forEach(id => { $(id).onkeydown = e => { if (e.key === 'Enter') go(false); }; });
}
async function begin(seed, demo = false, fio = '', grp = '', sess = null) {
  D = makeData(seed);
  L = mkLevels(D);
  const lkey = demo ? LAB_KEY + 'demo' : sess && sess.sid ? LAB_KEY + 's' + sess.sid : LAB_KEY + seed;
  syncInit(demo ? null : sess, 'lr13', st => { const el = $('sync'); if (el) { el.className = 'sync ' + st; el.textContent = {ok: '☁ сохранено', wait: '☁ …', off: '⚠ нет связи — сохраню позже', auth: '⚠ войдите заново'}[st] || ''; } });
  const server = demo ? null : await pull();
  const P = demo ? null : mergeP(server, loadKey(lkey));
  G = {seed, demo, fio, grp, lkey, sess, P: P || {lv: {}, pred: {}, journal: [], answers: {}, fio: '', cur: 0}, lv: null, slots: {}, hist: []};
  setCtx({lab: 'lr13', fio, grp, seed, client: sess && sess.sid ? 's' + sess.sid : clientId(), demo});
  report('hello', {done: L.filter(l => (G.P.lv[l.key] || {}).done).length, pts: score().sum});
  if (server || P) save();
  let i = demo ? 0 : G.P.cur || 0;
  if (L[i] && (G.P.lv[L[i].key] || {}).done) { const nd = L.findIndex(l => !(G.P.lv[l.key] || {}).done); if (nd >= 0) i = nd; }
  while (i > 0 && !unlocked(i)) i--;
  await startLevel(i);
}
// история команд: Ctrl+↑ / Ctrl+↓
function pushHist(t) { if (!G.hist.length || G.hist[G.hist.length - 1] !== t) G.hist.push(t); G.hi = G.hist.length; paste.add(t); }
function histKey(e) {
  if (!(e.ctrlKey || e.altKey) || !G || !G.hist || !G.hist.length) return;
  if (e.key === 'ArrowUp') { e.preventDefault(); G.hi = Math.max(0, (G.hi ?? G.hist.length) - 1); $('sql').value = G.hist[G.hi]; }
  if (e.key === 'ArrowDown') { e.preventDefault(); G.hi = Math.min(G.hist.length, (G.hi ?? G.hist.length) + 1); $('sql').value = G.hist[G.hi] || ''; }
}
let toastT = null;
function toast(t) { const el = $('toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 4200); }
let paste = {add: () => {}};
const rowCard = (title, obj) => `<div class="rc-h">${esc(title)}</div>${Object.entries(obj).map(([c, v]) => `<div><span>${esc(c)}</span><b>${esc(v == null ? 'NULL' : v)}</b></div>`).join('')}`;
async function boot() {
  W.frame();
  await W.loadRobot();
  while (!window.__pg) await sleep(30);
  db = await window.__pg;
  $('loading').hidden = true;
  $('runBtn').onclick = run;
  $('sql').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } else histKey(e); });
  paste = guardPaste($('sql'), () => { if (G && G.demo) return; toast('Вставка из других мест отключена — наберите команду сами. Свои прошлые команды: Ctrl+↑'); if (G) { G.P.pastes = (G.P.pastes || 0) + 1; save(); } });
  watchAway(ms => { if (G && !G.demo) { G.P.away = (G.P.away || 0) + 1; G.P.awayMs = (G.P.awayMs || 0) + ms; save(); } },
    () => G ? {lv: G.lv + 1, key: L[G.lv] && L[G.lv].key, done: L.filter(l => (G.P.lv[l.key] || {}).done).length, pts: score().sum, fails: (G.P.lv[(L[G.lv] || {}).key] || {}).fails || 0} : {});
  $('subBtn').onclick = submitDialog;
  $('rsDeck').onclick = () => { if (!running && G) startLevel(G.lv); };
  const gfx = () => { $('gfxBtn').textContent = W.quality === 'high' ? 'Графика: выс.' : 'Графика: низ.'; };
  W.hooks.quality = gfx; gfx();
  $('gfxBtn').onclick = () => W.setQuality(W.quality === 'high' ? 'low' : 'high', true);
  $('mission').addEventListener('copy', e => { if (!G || !G.demo) e.preventDefault(); });
  document.querySelectorAll('[data-spd]').forEach(b => b.onclick = () => { W.setSpeed(+b.dataset.spd); document.querySelectorAll('[data-spd]').forEach(x => x.classList.toggle('on', x === b)); });
  $('sndBtn').onclick = () => { muted = !muted; $('sndBtn').classList.toggle('off', muted); };
  $('homeBtn').onclick = () => W.home();
  $('menuBtn').onclick = () => { if (running) return; if (G && G.sess) push(G.P, true); session.set(null); startScreen(); };
  window.addEventListener('beforeunload', () => { if (G && !G.demo) push(G.P, true); });
  W.hooks.pick = async p => {
    if (running || !p) { if (!running) W.hideCard(); return; }
    if (p.t === 'queue') {
      const Q = W.queue.get(p.k); if (!Q) return;
      const d = Q.doc;
      W.showCard('queue', p.k, `<div class="talon"><div class="tl-h">ПОСАДОЧНЫЙ № ${d.id}</div><div class="tl-n">${esc(d.full_name)}</div>
        <div class="tl-g"><span>рейс</span><b>${esc(d.flight_no)}</b><span>место</span><b>${esc(d.seat_no)}</b><span>г. р.</span><b>${d.birth_year}</b><span>город</span><b>${esc(d.city)}</b>${d.meal ? `<span>питание</span><b>${esc(d.meal)}</b>` : ''}</div></div>`, 'info');
      return;
    }
    if (p.t === 'cart') {
      const C = W.cartBags.get(p.k); if (!C) return;
      W.showCard('cart', p.k, `<div class="btag"><b>${esc(C.doc.tag)}</b><div>${C.doc.weight_kg} кг</div><div class="mu">рейс ${esc(C.doc.flight_no)} · место ${esc(C.doc.seat_no)}</div></div>`, 'info');
      return;
    }
    if (p.t === 'flight') {
      const rs = (await db.query(`${SEL('flight')} ORDER BY dep_time`)).rows;
      W.showCard('flight', '*', `<div class="rc-h">flight · ${rs.length} ${plural(rs.length, 'строка', 'строки', 'строк')}</div>${rs.map(r => `<div><b>${esc(r.flight_no)}</b> ${esc(r.dest)} ${esc(r.dep_time)} <span>${r.gate == null ? 'NULL' : esc(r.gate)}</span></div>`).join('') || '<div><span>таблица пуста</span></div>'}`, 'info');
      return;
    }
    const pk = TABLES[p.t];
    const r = (await db.query(`${SEL(p.t)} WHERE ${pk} = $1`, [p.k])).rows[0];
    if (!r) return;
    W.showCard(p.t, String(p.k), rowCard(p.t + ' · строка', r), 'info');
  };
  startScreen();
}
window.LAB = {holdAt: null, get W() { return W; }, run, startLevel, get G() { return G; }, get L() { return L; }, get running() { return running; }, set speed(v) { W.setSpeed(v); }, begin, get D() { return D; }};
boot();
