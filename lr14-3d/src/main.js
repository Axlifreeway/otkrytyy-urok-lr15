// ЛР-14 · «Бортпитание и другие» — разбор UPDATE/DELETE/SELECT, обход строк роботом-СУБД, проверка уровней.
// Вход, прогресс, вердикты, итоги и протокол — в common/shell.js.
import {createWorld, sleep} from './scene.js';
import {makeData, baseSql, levels, TABLES, COLS, FLIGHT} from './data.js';
import {$, esc, plural} from '../../common/util.js';
import {statements} from '../../common/sql.js';
import {parse, colsIn, fmt, subst, normW, explain} from './parse.js';
import {SFX} from '../../common/sfx.js';
import {judge, describe, keyHint} from '../../common/judge.js';
import {
  initShell,
  boot,
  db,
  D,
  L,
  G,
  running,
  unlocked,
  setRunning,
  loadSql,
  state,
  prepareLevel,
  cmdBar,
  hud,
  errBox,
  verdict,
  save,
  recOf,
  journal,
  renderLevels,
  predict,
  rollback,
  success,
  pushHist,
  markError,
  lintFail,
  levelTag,
  missionButtons,
  bindMissionButtons,
  hold,
} from '../../common/shell.js';
import {report} from '../../common/net.js';
import {SELECT_REF, WHERE_REF, UPDATE_REF} from '../../common/sqlref.js';

const PTS = {
  kids: 0.5,
  rest: 0.5,
  window: 0.5,
  scale: 0.5,
  atomic: 0.5,
  noshow: 0.5,
  cascade: 0.5,
  setnull: 0.5,
  restrict: 0.5,
  soft: 1.5,
  hunt: 1.5,
  final: 1.5,
};
const W = createWorld($('stage'));
W.setSpeed(3); // в ЛР-14 обход долгий — по умолчанию ×3

// ═══════════════════════════════════════════════════ выполнение ══
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
    SFX.err();
    errBox('Ошибка в записи команды', msg);
    lintFail(msg, st[bad]);
    return;
  }
  if (lv.pred && !G.P.pred[lv.key]) await predict(lv);
  setRunning(true);
  $('runBtn').disabled = true;
  W.clearChips();
  W.hideCard();
  W.clearSay();
  try {
    for (let i = 0; i < qs.length; i++) {
      G.stmtTag = qs.length > 1 ? `команда ${i + 1} из ${qs.length} · ` : '';
      const info = await runOne(qs[i], st[i]);
      const left = qs.length - 1 - i;
      if (info.err && left) {
        $('result').insertAdjacentHTML('beforeend', `<div class="ru">Команды после ошибки (${left}) не выполнялись.</div>`);
        break;
      }
      if ((G.P.lv[lv.key] || {}).done && left && !lv.final) break;
    }
  } finally {
    G.stmtTag = '';
    cmdBar(null);
    hud();
    W.camS.follow = false;
    W.focus(null);
    setRunning(false);
    $('runBtn').disabled = false;
  }
}
const robotErr = () => {
  W.play('jump', true);
  setTimeout(() => W.play('idle'), 700);
};
// одна команда: робот обходит строки в порядке хранения, у каждой проверяет WHERE; потом настоящий запуск
async function runOne(q, sql) {
  const lv = L[G.lv];
  W.clearChips();
  W.hideCard();
  const pk = TABLES[q.t];
  const rec = recOf(lv);
  rec.runs++;
  const info = {err: null};
  // 1. оценка WHERE (и новых значений SET) по каждой строке
  let rows;
  try {
    const extra = q.kind === 'UPDATE' ? q.sets.map((s, i) => `, (${s.expr}) AS __v${i}`).join('') : '';
    rows = (await db.query(`SELECT ${COLS[q.t].join(', ')}, ${q.where ? `(${q.where})` : 'true'} AS __w${extra} FROM ${q.t} ORDER BY ctid`))
      .rows;
    if (q.kind === 'UPDATE') {
      const b = q.sets.find(s => !COLS[q.t].includes(s.col));
      if (b) throw Object.assign(new Error(`column "${b.col}" of relation "${q.t}" does not exist`), {code: '42703'});
    }
  } catch (e) {
    robotErr();
    markError(e);
    $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span><div class="ru">${esc(explain(e))}</div>`;
    SFX.err();
    journal(sql, 'ошибка');
    info.err = e;
    return info;
  }
  // 2. пробный прогон — упадёт ли команда и на какой строке
  let failKey = null,
    failErr = null;
  if (q.kind !== 'SELECT') {
    await db.exec('BEGIN');
    try {
      await db.query(q.sql);
    } catch (e) {
      failErr = e;
      const m = /Failing row contains \(([^,)]+)/.exec(e.detail || '');
      failKey = m ? m[1].trim() : String((rows.find(r => r.__w) || {})[pk]);
    }
    await db.exec('ROLLBACK');
  }
  // 3. обход
  const pkFast = q.where && new RegExp(`^\\s*${pk}\\s*=\\s*('(?:[^']|'')*'|-?\\d+)\\s*$`, 'i').test(q.where);
  const head =
    q.kind === 'UPDATE'
      ? `UPDATE ${q.t} · SET ${q.sets.map(s => `${s.col} = ${s.expr}`).join(', ')}`
      : q.kind === 'DELETE'
        ? `DELETE FROM ${q.t}`
        : `SELECT … FROM ${q.t}`;
  cmdBar(
    `<span class="k">${G.stmtTag || ''}${esc(head)}</span><span class="w">${q.where ? 'WHERE ' + esc(q.where) : 'без WHERE — подходит каждая строка'}</span>${pkFast ? '<span class="n">по первичному ключу — сразу к нужной строке</span>' : ''}`,
  );
  W.camS.follow = true;
  const scan = pkFast ? rows.filter(r => r.__w) : rows;
  const total = pkFast ? scan.length : rows.length,
    wcols = colsIn(q.t, q.where);
  let done = 0,
    yes = 0;
  const jobs = [];
  hud(0, 0, total);
  for (const row of scan) {
    const k = String(row[pk]);
    const loc = W.locate(q.t, row);
    const fast = W.speed >= 50;
    W.focus(loc.aim);
    if (!fast) {
      await W.robotGo(loc.x, loc.z);
      W.face(loc.face);
      W.aimBeam(loc.aim);
    }
    const v = row.__w,
      kind = v === true ? 'yes' : v === false ? 'no' : 'unk';
    if (!fast) {
      const vals = (wcols.length ? wcols : [pk]).map(c => `<div><span>${c}</span><b>${esc(fmt(row[c]))}</b></div>`).join('');
      W.showCard(
        q.t,
        k,
        `<div class="rc-h">${q.t} · ${esc(k)}</div>${vals}${q.where ? `<div class="rc-x">${esc(subst(q.t, q.where, row))}</div>` : ''}<div class="rc-v ${kind}">${kind === 'yes' ? 'ДА' : kind === 'no' ? 'НЕТ' : 'NULL — не знаю'}</div>`,
        kind,
      );
      SFX[kind]();
      await sleep(Math.max(80, 520 / W.speed));
      await hold(done + 1);
    }
    const del = q.kind === 'DELETE' && v === true;
    W.chip(q.t, k, del ? 'del' : kind, del ? '✕' : kind === 'yes' ? '✓' : kind === 'no' ? '' : '?');
    done++;
    if (v === true) {
      yes++;
      if (failKey !== null && k === String(failKey)) {
        // здесь СУБД откажет — и откатит всё сделанное
        W.hideCard();
        W.beamOff();
        W.showCard(
          q.t,
          k,
          `<div class="rc-h">${q.t} · ${esc(k)}</div><div class="rc-v err">${esc(failErr.constraint || 'отказ')}</div><div class="rc-t">${esc(explain(failErr))}</div>`,
          'err',
        );
        SFX.err();
        W.play('jump', true);
        W.shake();
        hud(done, yes, total);
        markError(failErr);
        $('result').innerHTML =
          `<span class="bad">ERROR: ${esc(failErr.message)}</span><div class="ru">Команда не выполнена. Всё, что было изменено до этой строки, отменяется.</div>`;
        info.err = failErr;
        await Promise.all(jobs);
        await sleep(1500);
        $('rewind').hidden = false;
        SFX.rew();
        await W.sync(await state(), true);
        await sleep(500);
        $('rewind').hidden = true;
        W.clearChips();
        W.hideCard();
        W.play('idle');
        journal(sql, 'ERROR ' + (failErr.constraint || failErr.code));
        await afterRun(q, info, false);
        return info;
      }
      if (q.kind === 'UPDATE') {
        const nv = Object.fromEntries(COLS[q.t].map(c => [c, row[c]]));
        q.sets.forEach((s, i) => {
          nv[s.col] = row['__v' + i];
        });
        if (q.t === 'passenger') jobs.push(W.applyPassenger(row.id, nv, true));
        if (q.t === 'baggage') jobs.push(W.applyBag(row.tag, nv, true));
        SFX.pop();
        if (!fast) {
          W.play('jump', true);
          if (q.t === 'passenger') W.bounce(row.id);
          await sleep(Math.max(60, 300 / W.speed));
          W.play('idle');
        }
      }
    }
    hud(done, yes, total);
    if (!fast) W.hideCard();
  }
  W.beamOff();
  W.fadeNo();
  // 4. настоящая команда
  let r;
  try {
    r = await db.query(q.sql);
  } catch (e) {
    markError(e);
    $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span>`;
    info.err = e;
    await afterRun(q, info, false);
    return info;
  }
  const n = q.kind === 'SELECT' ? r.rows.length : r.affectedRows;
  const tag = q.kind === 'SELECT' ? `(${n} ${plural(n, 'строка', 'строки', 'строк')})` : `${q.kind} ${n}`;
  let note = '';
  if (q.kind === 'SELECT') {
    G.lastSel = {t: q.t, w: normW(q.where), n};
    note = 'Это только просмотр — ничего не изменилось. Метки показывают, кого заденет UPDATE или DELETE с тем же WHERE.';
  } else if (q.where) {
    // «прицел»: перед изменением — SELECT с тем же условием
    const ok = G.lastSel && G.lastSel.t === q.t && G.lastSel.w === normW(q.where);
    note = ok
      ? `Сверка: SELECT вернул ${G.lastSel.n}, ${q.kind} затронул ${n} ${G.lastSel.n === n ? '— совпало ✓' : '— не совпало ✗'}`
      : 'Без прицела: перед командой не было SELECT с тем же условием.';
    rec.aimed = (rec.aimed || 0) + (ok ? 1 : 0);
    rec.blind = (rec.blind || 0) + (ok ? 0 : 1);
  }
  $('result').innerHTML = `<span class="ok">${esc(tag)}</span>${note ? `<div class="ru">${esc(note)}</div>` : ''}`;
  journal(sql, tag);
  await Promise.all(jobs);
  await W.robotGo(W.HOME.x, 0);
  W.face(-Math.PI / 2);
  W.camS.follow = false;
  // 5. каскады и прочие последствия — по фактическому состоянию базы
  await W.sync(await state(), true);
  await afterRun(q, info, true);
  return info;
}

// ═════════════════════════════════════════════════ проверка уровня ══
async function afterRun(q, info, okRun) {
  const lv = L[G.lv],
    rec = G.P.lv[lv.key];
  if (rec.done && !lv.final) return;
  if (q.kind === 'SELECT' && lv.check !== 'custom') return;
  if (lv.check !== 'custom') {
    if (info.err) {
      errBox('Ошибка — команда не выполнена', `${explain(info.err) || info.err.message} База не изменилась.`);
      rec.fails++;
      save();
      renderMission();
      return;
    }
    const j = judge(await state(), G.target, G.start, lv.tables, TABLES);
    if (j.wrong.length) {
      j.wrong.forEach(x => W.chip(x.t, x.k, 'extra', x.c && !x.g ? 'лишний' : 'не то'));
      return rollback(rec, 'Не совпадает с заданием. ' + (keyHint(j.wrong, j.pending) || describe(j.wrong).join(' ')));
    }
    if (j.pending.length) {
      verdict(null, `Принято. Осталось изменить: ${j.pending.length} стр.`);
      renderMission();
      return;
    }
    if (
      lv.noManual &&
      G.P.journal.some(e => e.lv === lv.key && e.t >= G.t0 && new RegExp(`delete\\s+from\\s+${lv.noManual}`, 'i').test(e.q))
    )
      return rollback(rec, 'Чемоданы вы удалили сами. А СУБД сделала бы это за вас — удалите только пассажира.');
    return success(lv, rec);
  }
  let msg = '';
  if (lv.key === 'restrict') {
    // нужен отказ СУБД при удалении рейса
    if (info.err && ['23001', '23503'].includes(info.err.code) && q.kind === 'DELETE' && q.t === 'flight') {
      const ids = [...W.people.keys()];
      ['Эй, мы ещё здесь!', 'Нас не удалить!', 'Мы же летим!'].forEach(t => W.say(ids[Math.floor(Math.random() * ids.length)], t, 2500));
      return success(lv, rec);
    }
    msg = 'Нужен отказ СУБД при DELETE FROM flight … — на рейс ссылаются пассажиры.';
  } else if (lv.slotBy === 'constraint') {
    // «охота»: отказ по каждому правилу из списка
    if (info.err && q.kind === 'UPDATE') {
      const key = info.err.constraint;
      if (lv.slots.includes(key)) G.slots[key] = 'отказ получен';
      else msg = `Отказ по правилу ${key || info.err.code} — его нет в списке. Осталось: ${lv.slots.filter(x => !G.slots[x]).join(', ')}.`;
    } else if (q.kind === 'UPDATE') msg = 'Это изменение СУБД приняла. Нужно такое, которое она отклонит именно по правилу из списка.';
    renderSlots();
    if (lv.slots.every(s => G.slots[s])) {
      rec.note = lv.slots.join(', ');
      return success(lv, rec);
    }
    if (msg) {
      verdict(false, msg);
      if (!info.err && q.kind === 'UPDATE') await softRollback();
    }
    return;
  }
  if (!okRun && !info.err) return;
  rec.fails++;
  save();
  if (msg) verdict(false, msg);
  renderMission();
}
async function softRollback() {
  // принятое «пробное» изменение откатываем без штрафа
  await loadSql(G.startSql);
  await W.sync(await state(), true);
}

// ═════════════════════════════════════════════════════ уровни ══
function renderSlots() {
  const lv = L[G.lv];
  if (!lv.slots || !$('slots')) return;
  const names = lv.slotNames || {};
  $('slots').innerHTML = lv.slots
    .map(
      s =>
        `<div class="slot${G.slots[s] ? ' on' : ''}"><b>${names[s] || s}</b><span>${G.slots[s] ? esc(G.slots[s]) : 'нет отказа'}</span></div>`,
    )
    .join('');
}
function renderMission() {
  const lv = L[G.lv],
    rec = G.P.lv[lv.key] || {};
  const ncmd = lv.final
    ? 'Три команды — по одной или вместе через ;'
    : lv.slotBy
      ? 'Пять команд — по одной: после отказа робот дальше не идёт'
      : (lv.ref || []).length > 1
        ? `Решение — ${lv.ref.length} команды`
        : 'Решение — одна команда (перед ней можно прицелиться SELECT … через ;)';
  $('mission').innerHTML = `${levelTag(lv)}
    <h1>${esc(lv.title)}</h1><div class="lab">${esc(lv.lab)}</div>
    <p>${esc(lv.text)}</p>
    <ul>${lv.goals.map(g => `<li class="${rec.done ? 'done' : ''}">${esc(g)}</li>`).join('')}</ul>
    <div id="slots" class="slots"></div>
    <div class="ncmd">${esc(ncmd)}</div>
    ${missionButtons(lv, rec, 3)}
    <div class="hint">Таблицы: <code>passenger</code>, <code>baggage</code>, <code>loyalty</code>, <code>flight</code>. Щёлкните пассажира, чемодан или табличку — увидите строку.</div>`;
  bindMissionButtons(lv, rec);
  renderSlots();
}
async function startLevel(i) {
  if (!unlocked(i)) return;
  setRunning(true);
  G.lv = i;
  G.lastSel = null;
  G.slots = {};
  const lv = L[i];
  $('verdict').innerHTML = '';
  $('result').innerHTML = '';
  renderLevels();
  renderMission();
  await prepareLevel(i);
  G.t0 = new Date().toISOString().slice(11, 19);
  W.resetRoot();
  W.clearConfetti();
  W.build(await state(), G.seed, D.meta);
  W.home();
  // постановка: реплики, подсветка места, отсутствующий пассажир
  W.ghostSeat.visible = !!lv.ghost && !(G.P.lv[lv.key] || {}).done;
  if (lv.ghost) W.ghostSeat.position.copy(W.seatPos(lv.ghost, false)).setY(0.45);
  (lv.say || []).forEach(s => W.say(s.id, s.t));
  if (lv.absent) {
    const P = W.people.get(lv.absent);
    if (P) {
      P.g.traverse(o => {
        if (o.isMesh) {
          o.material.transparent = true;
          o.material.opacity = 0.25;
        }
      });
      W.say(lv.absent, 'не явился');
    }
  }
  G.P.cur = i;
  save();
  report('level', {lv: i + 1, key: lv.key});
  setRunning(false);
  $('sql').focus();
}

// щелчок по объекту сцены — строка таблицы
async function pick(p) {
  if (p.t === 'flight') {
    // табло — вся таблица flight
    const rs = (await db.query('SELECT flight_no, dest FROM flight ORDER BY flight_no')).rows;
    W.showCard(
      'flight',
      '*',
      `<div class="rc-h">flight · ${rs.length} ${plural(rs.length, 'строка', 'строки', 'строк')}</div>${rs.map(r => `<div><b>${esc(r.flight_no)}</b> <span>${esc(r.dest)}</span></div>`).join('') || '<div><span>таблица пуста</span></div>'}`,
      'info',
    );
    return;
  }
  const r = (await db.query(`SELECT ${COLS[p.t].join(', ')} FROM ${p.t} WHERE ${TABLES[p.t]} = $1`, [p.k])).rows[0];
  if (!r) return;
  W.showCard(
    p.t,
    String(p.k),
    `<div class="rc-h">${p.t} · строка</div>${COLS[p.t].map(c => `<div><span>${c}</span><b>${esc(fmt(r[c]))}</b></div>`).join('')}`,
    'info',
  );
}

const INTRO = `<p>На борту — база данных, а по проходу ходит <b>робот-СУБД</b>. Он выполняет вашу команду строка за строкой: проверяет условие <code>WHERE</code> у каждой и меняет только те, где ответ «да».</p>`;
const head = more => `<span class="tag">ОПЦ.07 · ЛР-14</span><h2>UPDATE и DELETE</h2>${INTRO}
    <p class="mu">12 уровней, каждый открывается после предыдущего. За каждый уровень — баллы; сдать можно в любой момент (кнопка «Сдать»). ${more}</p>`;
initShell({
  lab: 'lr14',
  storeKey: 'air3d-lr14-',
  world: W,
  makeData,
  levels,
  baseSql,
  REF: [SELECT_REF, WHERE_REF, UPDATE_REF],
  REF_NEED: ['soft', 'final'],
  PTS,
  TABLES,
  COLS,
  prepare: D => {
    D.meta = new Map(D.P.map(p => [p.id, {kid: p.kid, female: p.female, old: p.old}]));
  },
  head: head('Вариант задаётся вашим местом в списке группы — у соседа данные другие.'),
  legacyHead: head('Номер в журнале задаёт рассадку и задания — у соседа они другие.'),
  startLabel: 'На борт',
  flight: () => FLIGHT,
  end: {tag: 'Смена окончена', stat: () => [Object.values(G.P.lv).reduce((s, r) => s + (r.blind || 0), 0), 'команд без прицела']},
  protoTitle: 'ЛР-14 «Изменение и удаление данных: UPDATE и DELETE»',
  questions: [
    'Уровень «Остальным — стандарт»: почему условие meal = NULL не нашло ни одной строки, а meal IS NULL нашло?',
    'Уровень «Не пролезло»: почему не изменился ни один чемодан, хотя ошибка была только на последнем?',
    'Уровни «Снят с рейса», «Программа закрыта», «Неудаляемый рейс»: что сделала СУБД в каждом случае и какое правило внешнего ключа это определило?',
    'Уровень «Возврат билетов»: зачем помечать строку, а не удалять? Что теперь придётся учитывать в запросах к пассажирам?',
  ],
  onRollback: () => {
    G.lastSel = null;
  },
  run,
  startLevel,
  renderMission,
  pick,
});
boot();
