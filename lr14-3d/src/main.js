// ЛР-14 · «Бортпитание и другие» — уровни, робот-СУБД, проверка, протокол.
import {createWorld, sleep, tween} from './scene.js';
import {makeData, baseSql, levels as mkLevels, TABLES, COLS, FLIGHT, lit} from './data.js';
import {report, setCtx, clientId, watchAway, guardPaste} from '../../common/net.js';
import {loginScreen, session, mergeP, syncInit, pull, push} from '../../common/login.js';
import {judge, describe, keyHint} from '../../common/judge.js';
const TEACHER_CODE = 'boeing747';           // код преподавателя: открывает все уровни и кнопку «Решение»
const LAB_KEY = 'air3d-lr14-';
const PTS = {kids: .5, rest: .5, window: .5, scale: .5, atomic: .5, noshow: .5, cascade: .5, setnull: .5, restrict: .5, soft: 1.5, hunt: 1.5, final: 1.5};

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const W = createWorld($('stage'));
let db = null, D = null, L = [], G = null, running = false;

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
async function state() {
  const o = {};
  for (const t of Object.keys(TABLES)) o[t] = (await db.query(`SELECT ${COLS[t].join(', ')} FROM ${t} ORDER BY ctid`)).rows;
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
function parse(sql) {
  const s = sql.replace(/--[^\n]*/g, ' ').replace(/\s+/g, ' ').trim().replace(/;\s*$/, '');
  if (!s) return null;
  let m;
  if ((m = /^update\s+(\w+)\s+set\s+([\s\S]+?)(?:\s+where\s+([\s\S]+))?$/i.exec(s))) {
    const t = m[1].toLowerCase();
    if (!TABLES[t]) return {err: `Таблицы ${m[1]} нет. Есть: ${Object.keys(TABLES).join(', ')}.`};
    const sets = m[2].split(/,(?![^(]*\))(?=(?:[^']*'[^']*')*[^']*$)/).map(x => { const k = /^\s*(\w+)\s*=\s*([\s\S]+)$/.exec(x); return k ? {col: k[1].toLowerCase(), expr: k[2].trim()} : null; });
    if (sets.some(x => !x)) return {err: 'Не разобрал SET: нужно «столбец = значение».'};
    return {kind: 'UPDATE', t, sql: s, sets, where: m[3] || null};
  }
  if ((m = /^delete\s+from\s+(\w+)(?:\s+where\s+([\s\S]+))?$/i.exec(s))) {
    const t = m[1].toLowerCase();
    if (!TABLES[t]) return {err: `Таблицы ${m[1]} нет.`};
    return {kind: 'DELETE', t, sql: s, where: m[2] || null};
  }
  if ((m = /^select\s+[\s\S]+?\s+from\s+(\w+)(?:\s+where\s+([\s\S]+?))?(?:\s+order\s+by\s+[\s\S]+)?$/i.exec(s))) {
    const t = m[1].toLowerCase();
    if (!TABLES[t]) return {err: `Таблицы ${m[1]} нет.`};
    return {kind: 'SELECT', t, sql: s, where: m[2] || null};
  }
  if (/^(insert|drop|alter|create|truncate|begin|commit|rollback)/i.test(s)) return {err: 'На этой смене пульт выполняет SELECT, UPDATE и DELETE.'};
  return {err: 'Не понял команду. Начните с SELECT, UPDATE или DELETE.'};
}
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
const colsIn = (t, w) => w ? COLS[t].filter(c => new RegExp('\\b' + c + '\\b', 'i').test(w)) : [];
const fmt = v => v === null || v === undefined ? 'NULL' : String(v);
const subst = (t, w, row) => w.replace(/'(?:[^']|'')*'|\b[a-z_]+\b/gi, x => x.startsWith("'") ? x : COLS[t].includes(x.toLowerCase())
  ? (row[x.toLowerCase()] === null ? 'NULL' : typeof row[x.toLowerCase()] === 'string' ? "'" + row[x.toLowerCase()] + "'" : String(row[x.toLowerCase()])) : x);
const normW = w => (w || '').toLowerCase().replace(/\s+/g, ' ').replace(/\s*([=<>(),])\s*/g, '$1').trim();
function explain(e) {
  switch (e.code) {
    case '23514': return `Значение не проходит правило ${e.constraint}. ${e.constraint === 'ck_passenger_meal' ? "meal может быть только 'стандарт', 'детское', 'вегетарианское' или 'ресторан'." : 'Вес чемодана — от 1 до 32 кг.'}`;
    case '23505': return 'Такое значение уже есть, а оно должно быть уникальным: двое на одном месте одного рейса.';
    case '23503': return /referenced|still/.test(e.detail || e.message) ? 'На эту строку ссылаются другие строки — правило внешнего ключа не даёт её удалить.' : 'Ссылка указывает на строку, которой нет в справочнике.';
    case '23001': return 'На эту строку ссылаются — правило RESTRICT запрещает удаление.';
    case '42703': return 'Такого столбца нет — проверьте имя.';
    case '42601': return 'Синтаксическая ошибка — проверьте слово, названное в сообщении, и что перед ним.';
    case '22P02': case '42883': case '42804': return 'Типы не сходятся: текст — в одинарных кавычках, числа и true/false — без.';
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
const ERRT = {'23505': 'unique', '23514': 'check', '23503': 'fk', '23001': 'fk'};

// ═══════════════════════════════════════════════════ выполнение ══
function cmdBar(html) { $('cmd').innerHTML = html || ''; $('cmd').hidden = !html; W.rScreen.element.style.visibility = html ? 'hidden' : ''; }
function hud(done, yes, total) { $('cnt').innerHTML = total == null ? '' : `<b>${done}</b>/${total} проверено · <b>${yes}</b> подошло`; $('cnt').hidden = total == null; }

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
    $('result').innerHTML = `<span class="bad">${esc(msg)}</span>`; SFX.err(); errBox('Ошибка в записи команды', msg);
    report('lint', {lv: G.lv + 1, key: lv.key, sql: st[bad].slice(0, 600), msg});
    G.P.lints = (G.P.lints || 0) + 1; save();
    return;
  }
  if (lv.pred && !G.P.pred[lv.key]) { await predict(lv); }
  running = true; $('runBtn').disabled = true;
  W.clearChips(); W.hideCard(); W.clearSay();
  try {
    for (let i = 0; i < qs.length; i++) {
      G.stmtTag = qs.length > 1 ? `команда ${i + 1} из ${qs.length} · ` : '';
      G.lastInfo = null;
      await runOne(qs[i], st[i]);
      const left = qs.length - 1 - i;
      if (G.lastInfo && G.lastInfo.err && left) { $('result').insertAdjacentHTML('beforeend', `<div class="ru">Команды после ошибки (${left}) не выполнялись.</div>`); break; }
      if ((G.P.lv[lv.key] || {}).done && left && !lv.final) break;
    }
  } finally {
    G.stmtTag = '';
    cmdBar(null); hud(); W.camS.follow = false; W.focus(null);
    running = false; $('runBtn').disabled = false;
  }
}
async function runOne(q, sql) {
  const lv = L[G.lv];
  W.clearChips(); W.hideCard();
  const pk = TABLES[q.t];
  const rec = G.P.lv[lv.key] = G.P.lv[lv.key] || {runs: 0, fails: 0};
  rec.runs++;
  let resInfo = {err: null}; G.lastInfo = resInfo;
  {
    // 1. оценка WHERE по каждой строке в порядке хранения
    let rows;
    try {
      const extra = q.kind === 'UPDATE' ? q.sets.map((s, i) => `, (${s.expr}) AS __v${i}`).join('') : '';
      rows = (await db.query(`SELECT ${COLS[q.t].join(', ')}, ${q.where ? `(${q.where})` : 'true'} AS __w${extra} FROM ${q.t} ORDER BY ctid`)).rows;
      if (q.kind === 'UPDATE') { const bad = q.sets.find(s => !COLS[q.t].includes(s.col)); if (bad) throw Object.assign(new Error(`column "${bad.col}" of relation "${q.t}" does not exist`), {code: '42703'}); }
    } catch (e) {
      W.play('jump', true); setTimeout(() => W.play('idle'), 700);
      $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span><div class="ru">${esc(explain(e))}</div>`;
      SFX.err(); journal(sql, 'ошибка'); resInfo.err = e;
      return;
    }
    // 2. пробный прогон — упадёт ли команда и на какой строке
    let failKey = null, failErr = null;
    if (q.kind !== 'SELECT') {
      await db.exec('BEGIN');
      try { await db.query(q.sql); } catch (e) {
        failErr = e;
        const m = /Failing row contains \(([^,)]+)/.exec(e.detail || '');
        failKey = m ? m[1].trim() : String((rows.find(r => r.__w) || {})[pk]);
      }
      await db.exec('ROLLBACK');
    }
    // 3. обход
    const pkFast = q.where && new RegExp(`^\\s*${pk}\\s*=\\s*('(?:[^']|'')*'|-?\\d+)\\s*$`, 'i').test(q.where);
    const head = q.kind === 'UPDATE' ? `UPDATE ${q.t} · SET ${q.sets.map(s => `${s.col} = ${s.expr}`).join(', ')}` : q.kind === 'DELETE' ? `DELETE FROM ${q.t}` : `SELECT … FROM ${q.t}`;
    cmdBar(`<span class="k">${G.stmtTag || ''}${esc(head)}</span><span class="w">${q.where ? 'WHERE ' + esc(q.where) : 'без WHERE — подходит каждая строка'}</span>${pkFast ? '<span class="n">по первичному ключу — сразу к нужной строке</span>' : ''}`);
    W.camS.follow = true;
    const scan = pkFast ? rows.filter(r => r.__w) : rows;
    const total = rows.length, wcols = colsIn(q.t, q.where);
    let done = 0, yes = 0;
    const jobs = [];
    hud(0, 0, pkFast ? scan.length : total);
    for (const row of scan) {
      const k = String(row[pk]);
      const loc = W.locate(q.t, row);
      const fast = W.speed >= 50;
      W.focus(loc.aim);
      if (!fast) { await W.robotGo(loc.x, loc.z); W.face(loc.face); W.aimBeam(loc.aim); }
      const v = row.__w, kind = v === true ? 'yes' : v === false ? 'no' : 'unk';
      if (!fast) {
        const vals = (wcols.length ? wcols : [pk]).map(c => `<div><span>${c}</span><b>${esc(fmt(row[c]))}</b></div>`).join('');
        W.showCard(q.t, k, `<div class="rc-h">${q.t} · ${esc(k)}</div>${vals}${q.where ? `<div class="rc-x">${esc(subst(q.t, q.where, row))}</div>` : ''}<div class="rc-v ${kind}">${kind === 'yes' ? 'ДА' : kind === 'no' ? 'НЕТ' : 'NULL — не знаю'}</div>`, kind);
        SFX[kind]();
        await sleep(Math.max(80, 520 / W.speed));
        while (window.LAB && window.LAB.holdAt != null && done + 1 >= window.LAB.holdAt) await sleep(100);
      }
      W.chip(q.t, k, q.kind === 'DELETE' && v === true ? 'del' : kind, q.kind === 'DELETE' && v === true ? '✕' : kind === 'yes' ? '✓' : kind === 'no' ? '' : '?');
      done++;
      if (v === true) {
        yes++;
        if (failKey !== null && k === String(failKey)) {
          W.hideCard(); W.beamOff();
          W.showCard(q.t, k, `<div class="rc-h">${q.t} · ${esc(k)}</div><div class="rc-v err">${esc(failErr.constraint || 'отказ')}</div><div class="rc-t">${esc(explain(failErr))}</div>`, 'err');
          SFX.err(); W.play('jump', true); W.shake();
          hud(done, yes, pkFast ? scan.length : total);
          $('result').innerHTML = `<span class="bad">ERROR: ${esc(failErr.message)}</span><div class="ru">Команда не выполнена. Всё, что было изменено до этой строки, отменяется.</div>`;
          resInfo.err = failErr;
          await Promise.all(jobs);
          await sleep(1500);
          $('rewind').hidden = false; SFX.rew();
          await W.sync(await state(), true);
          await sleep(500); $('rewind').hidden = true;
          W.clearChips(); W.hideCard(); W.play('idle');
          journal(sql, 'ERROR ' + (failErr.constraint || failErr.code));
          await afterRun(q, resInfo, false);
          return;
        }
        if (q.kind === 'UPDATE') {
          const nv = {...Object.fromEntries(COLS[q.t].map(c => [c, row[c]]))};
          q.sets.forEach((s, i) => { nv[s.col] = row['__v' + i]; });
          if (q.t === 'passenger') jobs.push(W.applyPassenger(row.id, nv, true));
          if (q.t === 'baggage') jobs.push(W.applyBag(row.tag, nv, true));
          SFX.pop();
          if (!fast) { W.play('jump', true); if (q.t === 'passenger') W.bounce(row.id); await sleep(Math.max(60, 300 / W.speed)); W.play('idle'); }
        }
      }
      hud(done, yes, pkFast ? scan.length : total);
      if (!fast) W.hideCard();
    }
    W.beamOff(); W.fadeNo();
    // 4. настоящая команда
    let r;
    try { r = await db.query(q.sql); } catch (e) { $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span>`; resInfo.err = e; await afterRun(q, resInfo, false); return; }
    const n = q.kind === 'SELECT' ? r.rows.length : r.affectedRows;
    const tag = q.kind === 'SELECT' ? `(${n} ${n % 10 === 1 && n % 100 !== 11 ? 'строка' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'строки' : 'строк'})` : `${q.kind} ${n}`;
    let note = '';
    if (q.kind === 'SELECT') { G.lastSel = {t: q.t, w: normW(q.where), n}; note = 'Это только просмотр — ничего не изменилось. Метки показывают, кого заденет UPDATE или DELETE с тем же WHERE.'; }
    else if (q.where) {
      const ok = G.lastSel && G.lastSel.t === q.t && G.lastSel.w === normW(q.where);
      note = ok ? `Сверка: SELECT вернул ${G.lastSel.n}, ${q.kind} затронул ${n} ${G.lastSel.n === n ? '— совпало ✓' : '— не совпало ✗'}` : 'Без прицела: перед командой не было SELECT с тем же условием.';
      rec.aimed = (rec.aimed || 0) + (ok ? 1 : 0); rec.blind = (rec.blind || 0) + (ok ? 0 : 1);
    }
    $('result').innerHTML = `<span class="ok">${esc(tag)}</span>${note ? `<div class="ru">${esc(note)}</div>` : ''}`;
    journal(sql, tag);
    await Promise.all(jobs);
    await W.robotGo(W.HOME.x, 0); W.face(-Math.PI / 2);
    W.camS.follow = false;
    // 5. каскады и прочие последствия — по фактическому состоянию базы
    await W.sync(await state(), true);
    await afterRun(q, resInfo, true, tag);
  }
}
function journal(sql, out) {
  G.P.journal.push({t: new Date().toISOString().slice(11, 19), lv: L[G.lv].key, q: sql.slice(0, 400), o: out}); save();
  report('run', {lv: G.lv + 1, key: L[G.lv].key, sql: sql.slice(0, 600), out, ok: !/^ERROR|ошибка/.test(out), txt: ($('result').innerText || '').slice(0, 300)});
}

// ═════════════════════════════════════════════════ проверка уровня ══
async function afterRun(q, info, okRun, tag) {
  const lv = L[G.lv], rec = G.P.lv[lv.key];
  if (rec.done && !lv.final) return;
  if (q.kind === 'SELECT' && lv.check !== 'custom') return;
  let ok = false, msg = '';
  if (lv.check === 'custom') {
    if (lv.key === 'restrict') {
      ok = !!(info.err && ['23001', '23503'].includes(info.err.code) && q.kind === 'DELETE' && q.t === 'flight');
      if (ok) { const ids = [...W.people.keys()]; [0, 1, 2].forEach(i => { const id = ids[Math.floor(Math.random() * ids.length)]; W.say(id, ['Эй, мы ещё здесь!', 'Нас не удалить!', 'Мы же летим!'][i], 2500); }); }
      else msg = 'Нужен отказ СУБД при DELETE FROM flight … — на рейс ссылаются пассажиры.';
    } else if (lv.slotBy === 'constraint') {
      G.slots = G.slots || {};
      if (info.err && q.kind === 'UPDATE') {
        const key = info.err.constraint;
        if (lv.slots.includes(key)) G.slots[key] = 'отказ получен';
        else msg = `Отказ по правилу ${key || info.err.code} — его нет в списке. Осталось: ${lv.slots.filter(x => !G.slots[x]).join(', ')}.`;
      } else if (q.kind === 'UPDATE') msg = 'Это изменение СУБД приняла. Нужно такое, которое она отклонит именно по правилу из списка.';
      renderSlots();
      ok = lv.slots.every(s => G.slots[s]);
      if (!ok) { if (msg) { verdict(false, msg); if (!info.err && q.kind === 'UPDATE') await softRollback(); } return; }
      rec.note = lv.slots.join(', ');
    }
  } else {
    if (info.err) { errBox('Ошибка — команда не выполнена', `${explain(info.err) || info.err.message} База не изменилась.`); rec.fails++; save(); renderMission(); return; }
    const cur = await state();
    const j = judge(cur, G.target, G.start, lv.tables, TABLES);
    if (j.wrong.length) {
      j.wrong.forEach(x => W.chip(x.t, x.k, 'extra', x.c && !x.g ? 'лишний' : 'не то'));
      return rollback(rec, 'Не совпадает с заданием. ' + (keyHint(j.wrong, j.pending) || describe(j.wrong).join(' ')));
    }
    if (j.pending.length) { verdict(null, `Принято. Осталось изменить: ${j.pending.length} стр.`); renderMission(); return; }
    if (lv.noManual && G.P.journal.some(j2 => j2.lv === lv.key && j2.t >= G.t0 && new RegExp(`delete\\s+from\\s+${lv.noManual}`, 'i').test(j2.q)))
      return rollback(rec, 'Чемоданы вы удалили сами. А СУБД сделала бы это за вас — удалите только пассажира.');
    return success(lv, rec);
  }
  if (ok) return success(lv, rec);
  if (!okRun && !info.err) return;
  rec.fails++; save();
  if (msg) verdict(false, msg);
  renderMission();
}
async function softRollback() {           // принятое «пробное» изменение откатываем без штрафа
  await loadSql(G.startSql); await W.sync(await state(), true);
}
async function rollback(rec, msg) {
  rec.fails++; save();
  errBox('Не совпало — откат', msg + ' База возвращена к началу уровня, команда осталась в пульте: исправьте её и запустите снова.');
  report('rollback', {lv: G.lv + 1, key: L[G.lv].key, msg: msg.slice(0, 300)});
  await sleep(1400);
  $('rewind').hidden = false; SFX.rew();
  await loadSql(G.startSql);
  await W.sync(await state(), true);
  await sleep(300); $('rewind').hidden = true;
  W.clearChips(); G.lastSel = null;
  renderMission();
}
function errBox(title, text) {
  $('verdict').innerHTML = `<div class="v-bad"><b>${esc(title)}</b>${esc(text)}<button class="vx" id="vx" title="Скрыть">✕</button></div>`;
  $('vx').onclick = () => { $('verdict').innerHTML = ''; };
}
const starsOf = r => !r || !r.done ? 0 : (r.fails || 0) === 0 ? 3 : r.fails <= 2 ? 2 : 1;
async function success(lv, rec) {
  report('done', {lv: G.lv + 1, key: lv.key, fails: rec.fails || 0, stars: (rec.fails || 0) === 0 ? 3 : rec.fails <= 2 ? 2 : 1, pts: Math.round((score().sum + (PTS[lv.key] || 0)) * 10) / 10});
  rec.done = true; rec.at = new Date().toISOString(); setTimeout(() => push(G.P, true), 0); rec.sql = G.P.journal.filter(j => j.lv === lv.key).slice(-4).map(j => j.q).join('\n');
  rec.tag = (G.P.journal.filter(j => j.lv === lv.key).slice(-1)[0] || {}).o;
  save();
  SFX.ok(); W.play('jump', true); W.confetti();
  const pred = lv.pred && G.P.pred[lv.key];
  const pr = pred ? `<div class="pr ${pred.right ? 'ok' : 'no'}">Ваш прогноз: «${esc(pred.label)}» — ${pred.right ? 'верно' : 'на деле «' + esc(pred.alabel) + '»'}</div>` : '';
  const st = `<div class="stars">${'★'.repeat(starsOf(rec))}${'☆'.repeat(3 - starsOf(rec))}<span>${(rec.fails || 0) === 0 ? 'без промахов' : 'промахов: ' + rec.fails}</span></div>`;
  if (lv.final) {
    verdict(true, lv.ok, st + pr, false);
    await sleep(1600);
    await W.takeoff();
    endScreen();
    return;
  }
  verdict(true, lv.ok, st + pr, true);
  renderLevels(); renderMission();
}
function verdict(ok, text, extra = '', next = false) {
  $('verdict').innerHTML = `<div class="${ok ? 'v-ok' : 'v-bad'}"><b>${ok ? 'Уровень пройден' : 'Не совпало'}</b>${esc(text)}${extra}
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
  if (!lv.slots) return;
  const names = lv.slotNames || {};
  $('slots').innerHTML = lv.slots.map(s => `<div class="slot${G.slots && G.slots[s] ? ' on' : ''}"><b>${names[s] || s}</b><span>${G.slots && G.slots[s] ? esc(G.slots[s]) : 'нет отказа'}</span></div>`).join('');
}
function renderMission() {
  const lv = L[G.lv], rec = G.P.lv[lv.key] || {};
  $('mission').innerHTML = `<span class="tag">${lv.final ? 'КОНТРОЛЬНЫЙ' : 'УРОВЕНЬ ' + (G.lv + 1) + ' / ' + L.length}</span>${lv.hard ? '<span class="tag hardt">СЛОЖНЫЙ · ' + String(PTS[lv.key]).replace('.', ',') + ' балла</span>' : ''}
    <h1>${esc(lv.title)}</h1><div class="lab">${esc(lv.lab)}</div>
    <p>${esc(lv.text)}</p>
    <ul>${lv.goals.map(g => `<li class="${rec.done ? 'done' : ''}">${esc(g)}</li>`).join('')}</ul>
    <div id="slots" class="slots"></div>
    <div class="ncmd">${esc(lv.final ? 'Три команды — по одной или вместе через ;' : lv.slotBy ? 'Пять команд — по одной: после отказа робот дальше не идёт' : (lv.ref || []).length > 1 ? `Решение — ${lv.ref.length} команды` : 'Решение — одна команда (перед ней можно прицелиться SELECT … через ;)')}</div>
    <div class="mbtn">${!lv.final && lv.hint && (rec.fails || 0) >= 2 ? '<button class="btn sm" id="hintBtn">Подсказка</button>' : ''}${G.demo && lv.ref ? '<button class="btn sm" id="solBtn">Решение</button>' : ''}</div>
    <div id="hintBox"></div>
    <div class="hint">Таблицы: <code>passenger</code>, <code>baggage</code>, <code>loyalty</code>, <code>flight</code>. Щёлкните пассажира, чемодан или табличку — увидите строку.</div>`;
  if ($('hintBtn')) $('hintBtn').onclick = () => { $('hintBox').innerHTML = `<div class="hintx">${esc(lv.hint)}</div>`; rec.hint = true; save(); };
  if ($('solBtn')) $('solBtn').onclick = () => { $('sql').value = lv.ref.map(q => q + ';').join('\n'); };
  renderSlots();
}
async function startLevel(i) {
  if (!unlocked(i)) return;
  running = true;
  G.lv = i; G.lastSel = null; G.slots = {};
  const lv = L[i];
  $('verdict').innerHTML = ''; $('result').innerHTML = '';
  renderLevels(); renderMission();
  const sql = canon(i);
  G.target = null;
  if (lv.ref) { await loadSql(sql); for (const q of lv.ref) await db.query(q); G.target = await state(); }
  await loadSql(sql);
  G.startSql = sql; G.start = await state(); G.t0 = new Date().toISOString().slice(11, 19);
  W.resetRoot(); W.clearConfetti();
  W.build(await state(), G.seed, D.meta);
  W.home();
  // постановка: реплики, подсветка места, отсутствующий пассажир
  W.ghostSeat.visible = !!lv.ghost && !(G.P.lv[lv.key] || {}).done;
  if (lv.ghost) W.ghostSeat.position.copy(W.seatPos(lv.ghost, false)).setY(.45);
  (lv.say || []).forEach(s => W.say(s.id, s.t));
  if (lv.absent) { const P = W.people.get(lv.absent); if (P) { P.g.traverse(o => { if (o.isMesh) { o.material.transparent = true; o.material.opacity = .25; } }); W.say(lv.absent, 'не явился'); } }
  G.P.cur = i; save();
  report('level', {lv: i + 1, key: lv.key});
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
  'Уровень «Остальным — стандарт»: почему условие meal = NULL не нашло ни одной строки, а meal IS NULL нашло?',
  'Уровень «Не пролезло»: почему не изменился ни один чемодан, хотя ошибка была только на последнем?',
  'Уровни «Снят с рейса», «Программа закрыта», «Неудаляемый рейс»: что сделала СУБД в каждом случае и какое правило внешнего ключа это определило?',
  'Уровень «Возврат билетов»: зачем помечать строку, а не удалять? Что теперь придётся учитывать в запросах к пассажирам?',
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
  const blind = Object.values(G.P.lv).reduce((s, r) => s + (r.blind || 0), 0);
  m.innerHTML = `<div class="dlg panel end"><span class="tag">Смена окончена</span><h2>Рейс ${FLIGHT} в воздухе</h2>
    <div class="end-row"><div><b>${L.filter(l => (G.P.lv[l.key] || {}).done).length}/${L.length}</b><span>уровней</span></div><div><b>${pr}/${preds.length}</b><span>прогнозов верно</span></div>
      <div><b>${blind}</b><span>команд без прицела</span></div><div><b>${sum}/9</b><span>баллов автоматически</span></div></div>
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
  <h2>Протокол · ЛР-14 «Изменение и удаление данных: UPDATE и DELETE»</h2>
  <div class="pr-meta"><span>Студент</span><span><input id="fio" value="${esc(P.fio || [G.fio, G.grp].filter(Boolean).join(', '))}" placeholder="Фамилия И. О., группа"></span>
    <span>Вариант</span><span>№ ${G.seed} · рейс ${FLIGHT}</span>
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
const HEAD = `<span class="tag">ОПЦ.07 · ЛР-14</span><h2>UPDATE и DELETE</h2>
    <p>На борту — база данных, а по проходу ходит <b>робот-СУБД</b>. Он выполняет вашу команду строка за строкой: проверяет условие <code>WHERE</code> у каждой и меняет только те, где ответ «да».</p>
    <p class="mu">12 уровней, каждый открывается после предыдущего. За каждый уровень — баллы; сдать можно в любой момент (кнопка «Сдать»). Вариант задаётся вашим местом в списке группы — у соседа данные другие.</p>`;
function startScreen() {
  loginScreen($('modal'), {head: HEAD, teacherCode: TEACHER_CODE, legacy: legacyScreen, onGo: s => begin(s.seed, !!s.demo, s.fio, s.grp, s)});
}
function legacyScreen() {
  let seed = null; try { seed = JSON.parse(localStorage.getItem('air-seed')); } catch (e) { /* нет */ }
  const qs = new URLSearchParams(location.search).get('n'); if (qs != null) seed = +qs;
  const m = $('modal'); m.hidden = false;
  const has = seed != null && load(seed);
  m.innerHTML = `<div class="dlg panel start"><span class="tag">ОПЦ.07 · ЛР-14</span><h2>UPDATE и DELETE</h2>
    <p>На борту — база данных, а по проходу ходит <b>робот-СУБД</b>. Он выполняет вашу команду строка за строкой: проверяет условие <code>WHERE</code> у каждой и меняет только те, где ответ «да».</p>
    <p class="mu">12 уровней, каждый открывается после предыдущего. За каждый уровень — баллы; сдать можно в любой момент (кнопка «Сдать»). Номер в журнале задаёт рассадку и задания — у соседа они другие.</p>
    <div class="dlg-id"><input id="fioIn" value="${esc(ls('air-fio'))}" placeholder="Фамилия Имя"><input id="grpIn" value="${esc(ls('air-grp'))}" placeholder="Группа"></div>
    <div class="dlg-num"><input id="seedIn" value="${seed != null ? seed : ''}" placeholder="№" autocomplete="off"><span>номер в журнале</span></div>
    <div id="startErr" class="bad"></div>
    <div class="btns"><button class="nextBtn" id="goBtn">${has ? 'Продолжить' : 'На борт'}</button>${has ? '<button class="btn" id="newBtn">Начать заново</button>' : ''}</div></div>`;
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
  D.meta = new Map(D.P.map(p => [p.id, {kid: p.kid, female: p.female, old: p.old}]));
  L = mkLevels(D);
  const lkey = demo ? LAB_KEY + 'demo' : sess && sess.sid ? LAB_KEY + 's' + sess.sid : LAB_KEY + seed;
  syncInit(demo ? null : sess, 'lr14', st => { const el = $('sync'); if (el) { el.className = 'sync ' + st; el.textContent = {ok: '☁ сохранено', wait: '☁ …', off: '⚠ нет связи — сохраню позже', auth: '⚠ войдите заново'}[st] || ''; } });
  const server = demo ? null : await pull();
  const P = demo ? null : mergeP(server, loadKey(lkey));
  G = {seed, demo, fio, grp, lkey, sess, P: P || {lv: {}, pred: {}, journal: [], answers: {}, fio: '', cur: 0}, lv: null, slots: {}, hist: []};
  setCtx({lab: 'lr14', fio, grp, seed, client: sess && sess.sid ? 's' + sess.sid : clientId(), demo});
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
    const pk = TABLES[p.t];
    const r = (await db.query(`SELECT ${COLS[p.t].join(', ')} FROM ${p.t} WHERE ${pk} = $1`, [p.k])).rows[0];
    if (!r) return;
    W.showCard(p.t, String(p.k), `<div class="rc-h">${p.t} · строка</div>${COLS[p.t].map(c => `<div><span>${c}</span><b>${esc(fmt(r[c]))}</b></div>`).join('')}`, 'info');
  };
  startScreen();
}
window.LAB = {holdAt: null, get W() { return W; }, run, startLevel, get G() { return G; }, get L() { return L; }, get running() { return running; }, set speed(v) { W.setSpeed(v); }, begin, get D() { return D; }};
boot();
