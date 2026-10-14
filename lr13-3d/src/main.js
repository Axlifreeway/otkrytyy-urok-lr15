// ЛР-13 · «Открытие рейса» — разбор INSERT и SELECT, робот-СУБД несёт строки, проверка уровней.
// Вход, прогресс, вердикты, итоги и протокол — в common/shell.js.
import {createWorld, sleep} from './scene.js';
import {makeData, baseSql, levels, TABLES, COLS, talon, tagOf, PTS} from './data.js';
import {$, esc, plural} from '../../common/util.js';
import {splitTop, statements} from '../../common/sql.js';
import {SFX} from '../../common/sfx.js';
import {judge, describe, keyHint, fmtv as fmt} from '../../common/judge.js';
import {
  initShell, boot, db, D, L, G, running, setRunning, unlocked, state, prepareLevel, cmdBar, hud, errBox, verdict, save, recOf,
  journal, renderLevels, predict, rollback, success, pushHist, allowPaste, lintFail, levelTag, missionButtons, bindMissionButtons, hold,
} from '../../common/shell.js';
import {report} from '../../common/net.js';

const W = createWorld($('stage'));
// время вылета — как ЧЧ:ММ, без секунд
const SEL = t => `SELECT ${COLS[t].map(c => c === 'dep_time' ? "to_char(dep_time, 'HH24:MI') AS dep_time" : c).join(', ')} FROM ${t}`;

// ════════════════════════════════════════════════════ разбор команды ══
// (…), (…) после VALUES → [{raw, vals}]
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

// ═══════════════════════════════════════════════════ выполнение ══
const robotErr = () => { W.play('jump', true); setTimeout(() => W.play('idle'), 700); };
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
    SFX.err(); robotErr();
    errBox('Ошибка в записи команды', msg);
    lintFail(msg, st[bad]);
    return;
  }
  if (lv.pred && !G.P.pred[lv.key] && qs.some(q => q.kind === 'INSERT')) await predict(lv);
  setRunning(true); $('runBtn').disabled = true;
  W.clearChips(); W.hideCard(); W.clearSay();
  const rec = recOf(lv);
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
    setRunning(false); $('runBtn').disabled = false;
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
    robotErr();
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
      // карточка строки: что указано, что подставлено по умолчанию, какой столбец нарушил правило
      const bc = ok ? null : badCol(failErr, q.t);
      const lines = COLS[q.t].map(c => {
        const has = c in given;
        const v = has ? given[c] : null, dv = /^default$/i.test(v || '');
        const val = has && !dv ? `<b>${esc(v)}</b>` : ok ? `<b>${esc(fmt(row[c]))}</b><em>${row[c] === null ? 'пусто' : 'по умолчанию'}</em>` : '<b>—</b><em>не указан</em>';
        return `<div class="${c === bc ? 'bad' : has && !dv ? '' : 'def'}"><span>${c}</span>${val}</div>`;
      }).join('');
      const v = ok ? '<div class="rc-v yes">ПРИНЯТО</div>' : `<div class="rc-v err">ОТКАЗ · ${esc(failErr.constraint || failErr.column || failErr.code)}</div><div class="rc-t">${esc(explain(failErr))}</div>`;
      W.showCard(loc.obj[0], loc.obj[1], `<div class="rc-h">${esc(q.t)} · строка ${i + 1} из ${n}</div>${lines}${v}`, ok ? 'ins' : 'err');
      ok ? SFX.yes() : SFX.err();
      await sleep(Math.max(120, 700 / W.speed));
      await hold(i + 1);
    }
    if (!ok) {                                       // отказ: вся команда отменяется
      W.beamOff(); W.play('jump', true); W.shake();
      hud(i, i, n, 'строк', 'принято');
      const cyr = Object.values(given).find(x => /^'.*[АВСЕНКМОРТХ].*'$/.test(x || '') && /^'[1-9][АВСЕНКМОРТХA-Z0-9]*'$/.test(x));
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
    W.chip(q.t, String(row[TABLES[q.t]]), 'yes', '+');
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
  let rows, r;
  try {
    rows = (await db.query(`SELECT *, ${q.where ? `(${q.where})` : 'true'} AS __w FROM (${SEL(q.t)}) x ORDER BY 1`)).rows;
    r = await db.query(q.sql);
  } catch (e) {
    robotErr();
    $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span><div class="ru">${esc(explain(e))}</div>`;
    SFX.err(); journal(sql, 'ошибка');
    return fin(q, {err: e});
  }
  cmdBar(`<span class="k">${G.stmtTag || ''}SELECT … FROM ${esc(q.t)}</span><span class="w">${q.where ? 'WHERE ' + esc(q.where) : q.count ? 'count(*) — робот считает строки' : 'все строки'}</span>`);
  W.camS.follow = true;
  let done = 0, yes = 0;
  const one = q.t === 'flight';                      // все рейсы — на одном табло
  hud(0, 0, rows.length);
  for (const row of rows) {
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
  const grid = !q.count && n ? `<table class="res"><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${r.rows.slice(0, 12).map(x => `<tr>${cols.map(c => `<td>${esc(x[c] == null ? 'NULL' : x[c])}</td>`).join('')}</tr>`).join('')}</table>${n > 12 ? `<div class="ru">…и ещё ${n - 12}</div>` : ''}` : '';
  $('result').innerHTML = `<span class="ok">${esc(tag)}</span>${grid}<div class="ru">Это только просмотр — база не изменилась.</div>`;
  journal(sql, tag);
  await W.robotGo(W.HOME.x, 0); W.face(-Math.PI / 2);
  return fin(q, {err: null, value: val != null ? Number(val) : null});
}

// ═════════════════════════════════════════════════ проверка уровня ══
async function afterRun(q, info) {
  const lv = L[G.lv], rec = G.P.lv[lv.key];
  if (rec.done && !lv.final) { if (!info.err) verdict(true, 'Уровень уже пройден — можно идти дальше.', '', true, true); return; }
  if (lv.check === 'custom') {                     // «охота»: отказ по каждому правилу из списка
    let msg = '';
    if (lv.slotBy === 'constraint' && q.kind === 'INSERT') {
      if (info.err) {
        const key = info.err.code === '23502' ? 'notnull' : info.err.constraint;
        if (lv.slots.includes(key)) G.slots[key] = info.err.code === '23502' ? 'столбец ' + (info.err.column || '') : 'отказ получен';
        else msg = `Отказ по правилу ${key || info.err.code} — его нет в списке. Нужны: ${lv.slots.filter(x => G.slots[x] == null).map(x => lv.slotNames[x]).join(', ')}.`;
      } else msg = 'Эту строку СУБД приняла. Нужна такая, которую она отклонит именно по одному из правил списка.';
    }
    renderSlots();
    if (!lv.slots.every(s => G.slots[s] != null)) { if (msg) verdict(false, msg); return; }
    rec.note = lv.slots.map(s => `${lv.slotNames[s]}: ${G.slots[s]}`).join('; ');
    return success(lv, rec);
  }
  if (q.kind === 'SELECT') {                       // доклад count(*) после загрузки
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
  const j = judge(await state(), G.target, G.start, lv.tables, TABLES);
  if (j.wrong.length) {
    j.wrong.forEach(x => W.chip(x.t, x.k, 'extra', x.c && !x.g ? 'лишняя' : 'не то'));
    return rollback(rec, 'Не совпадает с документом. ' + (keyHint(j.wrong, j.pending) || describe(j.wrong).join(' ')));
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

// ═════════════════════════════════════════════════════ уровни ══
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
  $('mission').innerHTML = `${levelTag(lv)}
    <h1>${esc(lv.title)}</h1><div class="lab">${esc(lv.lab)}</div>
    <p>${esc(lv.text)}</p>
    <ul>${lv.goals.map(g => `<li class="${rec.done ? 'done' : ''}">${esc(g)}</li>`).join('')}</ul>
    <div class="ncmd">${esc(cmdsLine(lv))}</div>
    ${lv.doc ? `<div class="docw">${lv.doc}</div>` : ''}
    <div id="slots" class="slots"></div>
    ${missionButtons(lv, rec, lv.hint1 ? 1 : 2)}
    ${SCHEMA_HTML}
    <div class="hint">Щёлкните кресло, пассажира, чемодан или табло — увидите строку. У трапа щелчок по пассажиру покажет посадочный.</div>`;
  bindMissionButtons(lv, rec);
  renderSlots();
}
async function startLevel(i) {
  if (!unlocked(i)) return;
  setRunning(true);
  const same = G.lv === i;
  G.lv = i; G.slots = {}; G.maxN = 0; G.usedCol = false; G.sawFail = false;
  const lv = L[i];
  $('verdict').innerHTML = ''; $('result').innerHTML = '';
  renderLevels(); renderMission();
  await prepareLevel(i);
  W.resetRoot(); W.clearConfetti();
  W.build(await state(), {flight: D.FLIGHT, queue: (lv.queue || []).map(talon), cart: (lv.cart || []).map(tagOf), ghosts: lv.ghosts});
  W.home();
  if (!same || !$('sql').value.trim()) $('sql').value = lv.prefill || '';
  if (lv.prefill) allowPaste(lv.prefill);
  G.P.cur = i; save();
  report('level', {lv: i + 1, key: lv.key, reset: same});
  setRunning(false);
  $('sql').focus();
}

// ═════════════════════════════════════ щелчок по объекту сцены ══
const rowCard = (title, obj) => `<div class="rc-h">${esc(title)}</div>${Object.entries(obj).map(([c, v]) => `<div><span>${esc(c)}</span><b>${esc(v == null ? 'NULL' : v)}</b></div>`).join('')}`;
async function pick(p) {
  if (p.t === 'queue') {                           // у трапа — посадочный талон
    const Q = W.queue.get(p.k); if (!Q) return;
    const d = Q.doc;
    W.showCard('queue', p.k, `<div class="talon"><div class="tl-h">ПОСАДОЧНЫЙ № ${d.id}</div><div class="tl-n">${esc(d.full_name)}</div>
      <div class="tl-g"><span>рейс</span><b>${esc(d.flight_no)}</b><span>место</span><b>${esc(d.seat_no)}</b><span>г. р.</span><b>${d.birth_year}</b><span>город</span><b>${esc(d.city)}</b>${d.meal ? `<span>питание</span><b>${esc(d.meal)}</b>` : ''}</div></div>`, 'info');
    return;
  }
  if (p.t === 'cart') {                            // на тележке — бирка
    const C = W.cartBags.get(p.k); if (!C) return;
    W.showCard('cart', p.k, `<div class="btag"><b>${esc(C.doc.tag)}</b><div>${C.doc.weight_kg} кг</div><div class="mu">рейс ${esc(C.doc.flight_no)} · место ${esc(C.doc.seat_no)}</div></div>`, 'info');
    return;
  }
  if (p.t === 'flight') {                          // табло — вся таблица flight
    const rs = (await db.query(`${SEL('flight')} ORDER BY dep_time`)).rows;
    W.showCard('flight', '*', `<div class="rc-h">flight · ${rs.length} ${plural(rs.length, 'строка', 'строки', 'строк')}</div>${rs.map(r => `<div><b>${esc(r.flight_no)}</b> ${esc(r.dep_time)} ${esc(r.dest)} <span>${r.gate == null ? 'NULL' : esc(r.gate)}</span></div>`).join('') || '<div><span>таблица пуста</span></div>'}`, 'info');
    return;
  }
  const r = (await db.query(`${SEL(p.t)} WHERE ${TABLES[p.t]} = $1`, [p.k])).rows[0];
  if (r) W.showCard(p.t, String(p.k), rowCard(p.t + ' · строка', r), 'info');
}

const INTRO = '<p>Самолёт пуст: ни рейса на табло, ни кресел, ни пассажиров. Всё, что появится на борту, появится из ваших команд <code>INSERT</code>. <b>Робот-СУБД</b> несёт каждую строку на её место и проверяет: есть ли всё обязательное, не нарушено ли правило, существует ли то, на что строка ссылается.</p>';
const head = more => `<span class="tag">ОПЦ.07 · ЛР-13</span><h2>INSERT: открытие рейса</h2>${INTRO}
    <p class="mu">12 уровней, каждый открывается после предыдущего. За каждый уровень — баллы; сдать можно в любой момент (кнопка «Сдать»). ${more}</p>`;
initShell({
  lab: 'lr13', storeKey: 'air3d-lr13-', world: W,
  makeData, levels, baseSql, PTS, TABLES, COLS, sel: SEL,
  head: head('Вариант задаётся вашим местом в списке группы — у соседа данные другие.'),
  legacyHead: head('Номер в журнале задаёт рейс, пассажиров и багаж — у соседа они другие.'),
  startLabel: 'Открыть рейс',
  flight: () => D.FLIGHT,
  end: {tag: 'Рейс открыт', stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.fails || 0), 0), 'промахов']},
  protoTitle: 'ЛР-13 «Наполнение базы данными: оператор INSERT»',
  questions: [
    'Уровни «Эконом по умолчанию» и «Первый пассажир»: что записала СУБД в cls и meal, хотя вы их не указывали? Откуда она взяла эти значения?',
    'Уровень «Ещё два рейса»: чем NULL в столбце gate отличается от текста \'NULL\' и от пустой строки \'\'?',
    'Уровень «Сначала кресло»: почему пассажира нельзя было вставить раньше кресла? В каком порядке заполнять flight, seat, passenger, baggage?',
    'Уровень «Ошибка в списке»: сколько строк добавила команда, в которой ошибка была только во второй строке, и почему?',
  ],
  onRollback: prefill => {
    G.maxN = 0; G.usedCol = false;
    if (prefill && L[G.lv].prefill) $('sql').value = L[G.lv].prefill;
  },
  run, startLevel, renderMission, pick,
});
boot();
