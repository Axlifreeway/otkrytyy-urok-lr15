// Каркас 3D-лабы: вход, прогресс, панель уровней, вердикты, прогноз, откат, итоги, протокол, сдача, кнопки.
// main.js лабы вызывает initShell(cfg) и пишет только своё: разбор и выполнение команд, проверку уровня, постановку уровня.
// Состояние (db, D, L, G, running) экспортируется «живыми» привязками: main.js читает их напрямую.
import {$, esc, sleep, comma, ls, lsJSON} from './util.js';
import {SFX, sound} from './sfx.js';
import {openDb, loadSql as load} from './db.js';
import {report, setCtx, clientId, watchAway, guardPaste} from './net.js';
import {loginScreen, session, mergeP, syncInit, pull, push} from './login.js';
import {isTeacherCode} from './teacher.js';
import {attachHighlight, highlight} from './sqlhl.js';
import {snapshotHtml, sendReport} from './report.js';
import {listenRobot, robotSay} from './robotsay.js';
import {sqlRef} from './sqlref.js';

export let db = null,
  D = null,
  L = [],
  G = null,
  running = false;
export const setRunning = v => {
  running = v;
};
let cfg = null,
  W = null;
const isErr = j => /^ERROR|ошибка/.test(j.o);

/* cfg:
   lab, storeKey          'lr13', 'air3d-lr13-'
   world                  мир из createWorld
   makeData, levels, baseSql, PTS, TABLES, COLS
   sel(t)                 SELECT для снимка таблицы (по умолчанию все столбцы COLS)
   prepare(D)             доп. подготовка данных варианта (необязательно)
   head, legacyHead       html шапки окна входа (с сервером / без)
   startLabel             надпись на кнопке входа без сервера
   flight()               номер рейса для итогов и протокола
   end: {tag, stat()}     экран итогов: заголовок и третья цифра [значение, подпись]
   protoTitle, questions  протокол
   onRollback(prefill)    сброс своего состояния уровня после отката
   run, startLevel, pick  функции лабы                                                    */
export function initShell(c) {
  cfg = c;
  W = c.world;
  // на телефоне новое задание показывается развёрнутым
  const start = c.startLevel;
  c.startLevel = async i => {
    $('side').classList.remove('min');
    const r = await start(i);
    fitScene();
    return r;
  };
}
// телефон: задание сворачивается до заголовка, чтобы было видно сцену
const narrow = () => matchMedia('(max-width: 760px) and (orientation: portrait), (max-height: 520px) and (orientation: landscape)').matches;
// свободная от панелей часть экрана — туда камера и ставит самолёт
function fitScene() {
  if (!narrow()) {
    W.setInsets(null);
    return;
  }
  const side = $('side').getBoundingClientRect(),
    deck = $('deck').getBoundingClientRect(),
    wide = side.height > innerHeight * 0.6;
  W.setInsets(
    wide
      ? {top: 0, bottom: innerHeight - deck.top, left: side.right, right: 0}
      : {top: side.bottom, bottom: innerHeight - deck.top, left: 0, right: 0},
  );
}
const runFromUI = () => {
  if (narrow()) {
    $('side').classList.add('min');
    fitScene();
  }
  cfg.run();
};

// ═══════════════════════════════════════════════════════════ база ══
export const loadSql = sql => load(db, sql);
const sel = t => (cfg.sel ? cfg.sel(t) : `SELECT ${cfg.COLS[t].join(', ')} FROM ${t}`);
export async function state() {
  const o = {};
  for (const t of Object.keys(cfg.TABLES)) o[t] = (await db.query(`${sel(t)} ORDER BY ctid`)).rows;
  return o;
}
// база в начале уровня i: исходные данные + эталонные решения всех предыдущих уровней
export function canon(i) {
  let sql = cfg.baseSql(D);
  for (let k = 0; k < i; k++) if (L[k].ref) sql += '\n' + L[k].ref.map(q => q + ';').join('\n');
  return sql;
}
// цель уровня (база после эталона) и стартовое состояние
export async function prepareLevel(i) {
  const lv = L[i],
    sql = canon(i);
  G.target = null;
  if (lv.ref) {
    await loadSql(sql);
    for (const q of lv.ref) await db.query(q);
    G.target = await state();
  }
  await loadSql(sql);
  G.startSql = sql;
  G.start = await state();
}

// ════════════════════════════════════════════════ строка состояния ══
export function cmdBar(html) {
  $('cmd').innerHTML = html || '';
  $('cmd').hidden = !html;
  W.rScreen.element.style.visibility = html ? 'hidden' : '';
}
export function hud(done, yes, total, word = 'проверено', word2 = 'подошло') {
  $('cnt').innerHTML = total == null ? '' : `<b>${done}</b>/${total} ${word} · <b>${yes}</b> ${word2}`;
  $('cnt').hidden = total == null;
}
let toastT = null;
export function toast(t) {
  const el = $('toast');
  el.textContent = t;
  el.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => {
    el.hidden = true;
  }, 4200);
}
export function errBox(title, text) {
  $('verdict').innerHTML = `<div class="v-bad"><b>${esc(title)}</b>${esc(text)}<button class="vx" id="vx" title="Скрыть">✕</button></div>`;
  $('vx').onclick = () => {
    $('verdict').innerHTML = '';
  };
}
// ok: true — пройден, false — не совпало, null — промежуточное сообщение
export function verdict(ok, text, extra = '', next = false, quiet = false) {
  const cls = ok === null ? 'v-mid' : ok ? 'v-ok' : 'v-bad';
  const head = ok === null ? '' : `<b>${ok ? (quiet ? 'Готово' : 'Уровень пройден') : 'Не совпало'}</b>`;
  $('verdict').innerHTML = `<div class="${cls}">${head}${esc(text)}${extra}
    ${next && G.lv + 1 < L.length ? '<button class="nextBtn" id="nextBtn">Следующий уровень →</button>' : ''}
</div>`;
  if ($('nextBtn'))
    $('nextBtn').onclick = () => {
      if (running) return;
      SFX.unlock();
      cfg.startLevel(G.lv + 1);
    };
}

// ═══════════════════════════════════════════════════ прогресс, баллы ══
export const save = () => {
  if (G.demo) return;
  try {
    localStorage.setItem(G.lkey, JSON.stringify(G.P));
  } catch (e) {
    /* без хранилища */
  }
  push(G.P);
};
export const recOf = lv => (G.P.lv[lv.key] = G.P.lv[lv.key] || {runs: 0, fails: 0});
const doneN = () => L.filter(l => !l.practice && (G.P.lv[l.key] || {}).done).length;
export const starsOf = r => (!r || !r.done ? 0 : (r.fails || 0) === 0 ? 3 : r.fails <= 2 ? 2 : 1);
export function score() {
  const rows = L.filter(l => !l.practice).map(l => ({l, pts: cfg.PTS[l.key] || 0, ok: !!(G.P.lv[l.key] || {}).done}));
  return {rows, sum: Math.round(rows.reduce((t, r) => t + (r.ok ? r.pts : 0), 0) * 10) / 10};
}
const MARK = s => (s >= 8.5 ? '5' : s >= 6.5 ? '4' : s >= 4.5 ? '3' : '2');
export function journal(sql, out) {
  G.P.journal.push({t: new Date().toISOString().slice(11, 19), lv: L[G.lv].key, q: sql.slice(0, 600), o: out});
  save();
  report('run', {
    lv: G.lv + 1,
    key: L[G.lv].key,
    sql: sql.slice(0, 600),
    out,
    ok: !isErr({o: out}),
    txt: ($('result').innerText || '').slice(0, 300),
  });
}

// ═════════════════════════════════════════════════════════ уровни ══
export function unlocked(i) {
  if (L[i] && L[i].practice) return true;
  return G.demo || i === 0 || !!(G.P.lv[L[i - 1].key] || {}).done;
}
export function renderLevels() {
  $('levels').innerHTML =
    L.map((lv, i) => {
      const rec = G.P.lv[lv.key] || {};
      if (lv.practice)
        return `<button class="lvb px${i === G.lv ? ' on' : ''}" data-i="${i}" title="Тренировка: решено ${G.P.practice || 0}">∞</button>`;
      return `<button class="lvb${i === G.lv ? ' on' : ''}${rec.done ? ' done' : ''}${lv.final ? ' fin' : ''}${lv.hard ? ' hard' : ''}" data-i="${i}" ${unlocked(i) ? '' : 'disabled'} title="${esc(lv.title)}">${unlocked(i) ? (lv.final ? '✈' : i + 1) : '🔒'}${rec.done ? `<i class="st">${'★'.repeat(starsOf(rec))}</i>` : ''}</button>`;
    }).join('') +
    (G.demo
      ? '<span class="demo">ДЕМО</span>'
      : `<span class="pts">${score().sum.toFixed(1).replace('.0', '')}<small>/9</small></span>${G.sess ? '<span id="sync" class="sync ok">☁ сохранено</span>' : ''}`);
  $('levels')
    .querySelectorAll('[data-i]')
    .forEach(
      b =>
        (b.onclick = () => {
          if (!running) cfg.startLevel(+b.dataset.i);
        }),
    );
}
// подсказка после промахов и кнопка «Решение» в демо-режиме
export function missionButtons(lv, rec, minFails = 2) {
  const sol = lv.ref && (G.demo || (lv.practice && (rec.fails || 0) >= 2)); // в тренировке после двух промахов можно подсмотреть
  return `<div class="mbtn">${!lv.final && lv.hint && (rec.fails || 0) >= minFails ? '<button class="btn sm" id="hintBtn">Подсказка</button>' : ''}${sol ? '<button class="btn sm" id="solBtn">Решение</button>' : ''}</div><div id="hintBox"></div>${cfg.REF ? sqlRef(cfg.REF, lv.sel || (cfg.REF_NEED || []).includes(lv.key)) : ''}`;
}
export function bindMissionButtons(lv, rec) {
  if ($('hintBtn'))
    $('hintBtn').onclick = () => {
      $('hintBox').innerHTML = `<div class="hintx">${esc(lv.hint)}</div>`;
      rec.hint = true;
      save();
    };
  if ($('solBtn'))
    $('solBtn').onclick = () => {
      $('sql').value = lv.ref.map(q => q + ';').join('\n');
    };
}
export const levelTag = lv =>
  lv.practice
    ? `<span class="tag">ТРЕНИРОВКА · без баллов</span><span class="tag hardt">решено: ${G.P.practice || 0}</span>`
    : `<span class="tag">${lv.final ? 'КОНТРОЛЬНЫЙ' : 'УРОВЕНЬ ' + (G.lv + 1) + ' / ' + L.length}</span>${lv.hard ? '<span class="tag hardt">СЛОЖНЫЙ · ' + comma(cfg.PTS[lv.key]) + ' балла</span>' : ''}`;

// прогноз до запуска: ответ пишется в протокол
export function predict(lv) {
  return new Promise(res => {
    const p = lv.pred,
      m = $('modal');
    m.hidden = false;
    m.innerHTML = `<div class="dlg panel"><span class="tag">Сначала прогноз</span><div class="dlg-q">${esc(p.q)}</div>
      <div class="dlg-ch">${p.choices.map(c => `<button data-k="${c.k}">${esc(c.t)}</button>`).join('')}</div>
      <div class="mu">Ответ запишется в протокол, потом робот выполнит вашу команду.</div></div>`;
    m.querySelectorAll('[data-k]').forEach(
      b =>
        (b.onclick = () => {
          const k = b.dataset.k,
            c = p.choices.find(x => x.k === k),
            a = p.choices.find(x => x.k === p.answer);
          G.P.pred[lv.key] = {q: p.q, label: c.t, alabel: a.t, right: k === p.answer};
          save();
          m.hidden = true;
          m.innerHTML = '';
          res();
        }),
    );
  });
}

// неверный результат: сообщение остаётся на экране, база сама возвращается к началу уровня
export async function rollback(rec, msg, prefill) {
  rec.fails++;
  save();
  errBox('Не совпало — откат', msg + ' База возвращена к началу уровня, команда осталась в пульте: исправьте её и запустите снова.');
  report('rollback', {lv: G.lv + 1, key: L[G.lv].key, msg: msg.slice(0, 300)});
  await sleep(1400);
  $('rewind').hidden = false;
  SFX.rew();
  await loadSql(G.startSql);
  await W.sync(await state(), true);
  await sleep(300);
  $('rewind').hidden = true;
  W.clearChips();
  if (cfg.onRollback) cfg.onRollback(prefill);
  cfg.renderMission();
}

export async function success(lv, rec) {
  if (lv.practice) return practiceDone(lv, rec);
  rec.done = true;
  rec.at = new Date().toISOString();
  setTimeout(() => push(G.P, true), 0);
  report('done', {lv: G.lv + 1, key: lv.key, fails: rec.fails || 0, stars: starsOf(rec), pts: score().sum});
  // в протокол — последние команды уровня; ошибки — только там, где отказ СУБД и был целью
  const js = G.P.journal.filter(j => j.lv === lv.key && (lv.check === 'custom' || !isErr(j))).slice(-4);
  rec.sql = js.map(j => j.q).join('\n');
  rec.tag = js.map(j => j.o).join('\n');
  save();
  SFX.ok();
  W.play('jump', true);
  W.confetti();
  const pred = lv.pred && G.P.pred[lv.key];
  const pr = pred
    ? `<div class="pr ${pred.right ? 'ok' : 'no'}">Ваш прогноз: «${esc(pred.label)}» — ${pred.right ? 'верно' : 'на деле «' + esc(pred.alabel) + '»'}</div>`
    : '';
  const st = `<div class="stars">${'★'.repeat(starsOf(rec))}${'☆'.repeat(3 - starsOf(rec))}<span>${(rec.fails || 0) === 0 ? 'без промахов' : 'промахов: ' + rec.fails}</span></div>`;
  if (lv.final) {
    verdict(true, lv.ok, st + pr, false);
    await sleep(1600);
    await W.takeoff();
    endScreen();
    return;
  }
  verdict(true, lv.ok, st + pr, true);
  renderLevels();
  cfg.renderMission();
}

// ═══════════════════════════════ тренировка: бесконечные задания без баллов ══
// После уровней (или после отправки отчёта) студент может решать новые задания, собранные из его же базы
// (состояние после всех уровней). cfg.practice(D, state, rnd) возвращает уровень {title, text, goals, tables, ref, ok}.
// Задание — 13-й элемент L с key 'practice'; его запись в G.P.lv неперечисляемая — не сохраняется и не уходит на сервер.
export async function startPractice() {
  if (running || !cfg.practice) return;
  setRunning(true);
  $('proto').hidden = true;
  $('modal').hidden = true;
  W.resetRoot();
  if (L[L.length - 1].practice) L.pop();
  const base = canon(L.length);
  let lv = null;
  for (let k = 0; k < 10 && !lv; k++) {
    await loadSql(base);
    const before = await state(),
      cand = cfg.practice(D, before, Math.random);
    try {
      for (const q of cand.ref) await db.query(q);
      if (JSON.stringify(await state()) !== JSON.stringify(before)) lv = cand; // команда что-то меняет и база её принимает
    } catch (e) {
      /* такое задание в этой базе не выполнить — берём другое */
    }
  }
  setRunning(false);
  if (!lv) return toast('Не получилось придумать задание — попробуйте ещё раз');
  Object.assign(lv, {key: 'practice', practice: true, lab: lv.lab || 'тренировка · без баллов'});
  Object.defineProperty(G.P.lv, 'practice', {value: {runs: 0, fails: 0}, enumerable: false, configurable: true, writable: true});
  L.push(lv);
  await cfg.startLevel(L.length - 1);
}
function practiceDone(lv, rec) {
  rec.done = true;
  G.P.practice = (G.P.practice || 0) + 1;
  save();
  report('practice', {n: G.P.practice, fails: rec.fails || 0, sql: (G.P.journal.at(-1) || {}).q});
  SFX.ok();
  W.play('jump', true);
  W.confetti();
  verdict(
    true,
    lv.ok || 'Верно!',
    `<div class="stars"><span>Тренировка: решено ${G.P.practice} · ${(rec.fails || 0) === 0 ? 'с первой попытки' : 'промахов: ' + rec.fails}</span></div><button class="nextBtn" id="pxNext">Ещё задание →</button>`,
    false,
    true,
  );
  $('pxNext').onclick = startPractice;
  renderLevels();
  cfg.renderMission();
}

// ═════════════════════════════════════════════════ итоги, протокол ══
function endScreen() {
  const m = $('modal');
  m.hidden = false;
  const preds = Object.values(G.P.pred),
    pr = preds.filter(p => p.right).length;
  const [v3, l3] = cfg.end.stat();
  m.innerHTML = `<div class="dlg panel end"><span class="tag">${esc(cfg.end.tag)}</span><h2>Рейс ${esc(cfg.flight())} в воздухе</h2>
    <div class="end-row"><div><b>${doneN()}/${L.length}</b><span>уровней</span></div><div><b>${pr}/${preds.length}</b><span>прогнозов верно</span></div>
      <div><b>${v3}</b><span>${esc(l3)}</span></div><div><b>${score().sum}/9</b><span>баллов автоматически</span></div></div>
    <div class="btns"><button class="nextBtn" id="protoBtn">Протокол для отчёта</button>${cfg.practice ? '<button class="btn" id="pxBtn">🔁 Тренировка без баллов</button>' : ''}<button class="btn" id="backBtn">Вернуться</button></div></div>`;
  $('protoBtn').onclick = protocol;
  if ($('pxBtn')) $('pxBtn').onclick = startPractice;
  $('backBtn').onclick = () => {
    m.hidden = true;
    W.resetRoot();
    cfg.startLevel(G.lv);
  };
}
function protocol() {
  const P = G.P,
    pr = $('proto');
  const sc = score(),
    done = sc.rows.filter(r => r.ok).length;
  const awayMin = Math.round((P.awayMs || 0) / 60000);
  pr.hidden = false;
  const canSend = !G.demo && /^https?:$/.test(location.protocol);
  pr.innerHTML = `<div class="pr-bar">${canSend ? '<button class="nextBtn" id="sendRep">📤 Отправить преподавателю</button>' : ''}<button class="${canSend ? 'btn' : 'nextBtn'}" onclick="window.print()">Печать / PDF</button>${cfg.practice ? '<button class="btn" id="pxGo" title="Новые задания из вашей базы, без баллов — отчёт не меняется">🔁 Продолжить тренировку</button>' : ''}<button class="btn" onclick="document.getElementById('proto').hidden=true">Закрыть</button>
    <span id="sendMsg" class="pr-send">${canSend ? (P.sentAt ? 'Последняя отправка: ' + new Date(P.sentAt).toLocaleString('ru-RU') + '. Исправили ответы — отправьте ещё раз.' : 'Заполните ответы на вопросы и отправьте — печатать не нужно.') : ''}</span></div>
  <div class="pr-doc"><div class="pr-eye">ФГАОУ ВО «Тюменский государственный университет» · Колледж ИИ · ОПЦ.07</div>
  <h2>Протокол · ${esc(cfg.protoTitle)}</h2>
  <div class="pr-meta"><span>Студент</span><span><input id="fio" value="${esc(P.fio || [G.fio, G.grp].filter(Boolean).join(', '))}" placeholder="Фамилия И. О., группа"></span>
    <span>Вариант</span><span>№ ${G.seed} · рейс ${esc(cfg.flight())}</span>
    <span>Сдано</span><span>${new Date().toLocaleString('ru-RU')} · пройдено ${done} из ${L.length}${done < L.length ? ' (досрочно)' : ''}</span>
    <span>Запусков</span><span>${P.journal.length} · ошибок записи команд: ${P.lints || 0} · уходов со вкладки: ${P.away || 0}${awayMin ? ` (≈${awayMin} мин)` : ''} · заблокировано вставок: ${P.pastes || 0}${P.shots ? ` · снимков экрана: ${P.shots}` : ''}</span></div>
  <h3>Уровни</h3><table><tr><th>Уровень</th><th>Команды</th><th>Ответ СУБД</th><th>Промахов</th><th>Баллы</th></tr>
  ${sc.rows
    .map(({l, pts, ok}) => {
      const r = P.lv[l.key] || {};
      return `<tr><td>${esc(l.title)}<div class="pr-mu">${esc(l.lab)}</div></td><td><pre class="sql">${ok ? highlight(r.sql || '', Object.keys(cfg.TABLES)) : 'не пройден'}</pre></td><td><pre>${esc(r.note || r.tag || '')}</pre></td><td>${ok ? r.fails || 0 : ''}</td><td>${ok ? comma(pts) : '0'} / ${comma(pts)}</td></tr>`;
    })
    .join('')}</table>
  ${P.practice ? `<p style="margin-top:8px">Тренировка после уровней (без баллов): решено заданий — <b>${P.practice}</b></p>` : ''}
  <h3>Прогнозы</h3><table><tr><th>Вопрос</th><th>Ответ</th><th>На деле</th></tr>${Object.values(P.pred)
    .map(p => `<tr><td>${esc(p.q)}</td><td>${esc(p.label)}</td><td>${p.right ? '✓' : esc(p.alabel)}</td></tr>`)
    .join('')}</table>
  <h3>Ответы на вопросы</h3>${cfg.questions.map((q, i) => `<div class="pr-q"><b>${i + 1}. ${esc(q)}</b><textarea data-a="${i}">${esc((P.answers || {})[i] || '')}</textarea></div>`).join('')}
  <h3>Оценка</h3><table><tr><td>Уровни (автоматически)</td><td><b>${comma(sc.sum)}</b> из 9</td></tr><tr><td>Ответы на вопросы</td><td>до 1 — проверяет преподаватель</td></tr><tr><td>Защита</td><td>обязательна</td></tr>
  <tr><td>Шкала (уровни + ответы)</td><td>8,5–10 → «5» · 6,5–8,4 → «4» · 4,5–6,4 → «3»</td></tr></table>
  <p style="margin-top:22px">Проверил: Алёшкин А. А. ______________</p></div>`;
  $('fio').oninput = e => {
    P.fio = e.target.value;
    save();
  };
  if ($('pxGo')) $('pxGo').onclick = startPractice;
  if ($('sendRep'))
    $('sendRep').onclick = async () => {
      const b = $('sendRep');
      b.disabled = true;
      $('sendMsg').textContent = 'Отправляю…';
      const html = snapshotHtml(pr.querySelector('.pr-doc'), `${cfg.protoTitle} — ${P.fio || G.fio || ''}`);
      const r = await sendReport({
        lab: cfg.lab,
        html,
        pts: sc.sum,
        done,
        token: (G.sess && G.sess.token) || '',
        client: clientId(),
        fio: P.fio || G.fio,
        grp: G.grp,
        seed: G.seed,
      });
      b.disabled = false;
      $('sendMsg').textContent = r.msg;
      $('sendMsg').className = 'pr-send ' + (r.ok ? 'ok' : 'bad');
      if (r.ok) {
        P.sentAt = Date.now();
        save();
        SFX.ok();
      }
    };
  const fitT = t => {
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 4 + 'px';
  };
  pr.querySelectorAll('[data-a]').forEach(t => {
    fitT(t);
    t.oninput = () => {
      fitT(t);
      P.answers = P.answers || {};
      P.answers[t.dataset.a] = t.value;
      save();
    };
  });
}
// досрочная сдача: протокол с тем, что пройдено сейчас
function submitDialog() {
  if (running || !G || G.lv == null) return;
  const sc = score(),
    done = sc.rows.filter(r => r.ok).length,
    m = $('modal');
  m.hidden = false;
  m.innerHTML = `<div class="dlg panel"><span class="tag">Сдать работу</span><h2>${done} из ${L.length} уровней</h2>
    <p>Сейчас набрано <b>${comma(sc.sum)} из 9</b> баллов за уровни. Без ответов на вопросы это ${MARK(sc.sum) === '2' ? 'пока ниже «3»' : 'не меньше чем на «' + MARK(sc.sum) + '»'}; ответы добавят до 1 балла. Шкала: 8,5+ → «5», 6,5+ → «4», 4,5+ → «3».</p>
    <p class="mu">Протокол уходит преподавателю кнопкой «Отправить преподавателю» — печатать не нужно. После сдачи можно продолжить и отправить заново.</p>
    <div class="btns"><button class="nextBtn" id="subGo">Сформировать протокол</button><button class="btn" id="subBack">Продолжить работу</button></div></div>`;
  $('subGo').onclick = () => {
    m.hidden = true;
    report('submit', {done, pts: sc.sum});
    protocol();
  };
  $('subBack').onclick = () => {
    m.hidden = true;
  };
}

// ═══════════════════════════════════════════════════════════ вход ══
async function startScreen() {
  if (cfg.gated && (await labClosed())) return closedScreen();
  loginScreen($('modal'), {head: cfg.head, legacy: legacyScreen, onGo: s => begin(s.seed, !!s.demo, s.fio, s.grp, s)});
}
// лабу открывает преподаватель (панель → «Группы и списки»); без сервера (файлом) — открыта
async function labClosed() {
  if (!/^https?:$/.test(location.protocol)) return false;
  try {
    const r = await fetch('/api/labs');
    if (!r.ok) return false;
    return (await r.json()).open[cfg.lab] === false;
  } catch (e) {
    return false;
  }
}
function closedScreen() {
  const m = $('modal');
  m.hidden = false;
  m.innerHTML = `<div class="dlg panel start">${cfg.head}
    <div class="closed"><b>Рейс задержан</b>Эта лабораторная ещё не открыта. Преподаватель откроет её на занятии — тогда обновите страницу.</div>
    <div class="btns"><a class="btn" href="../">На главную</a><button class="btn sm" id="clT">Преподаватель</button></div>
    <div id="clTeach" hidden class="lg"><label>Код<input id="clCode" autocomplete="off"></label><label>Вариант<input id="clSeed" value="0"></label><button class="btn" id="clGo">Демо</button></div>
    <div id="clErr" class="bad"></div></div>`;
  $('clT').onclick = () => {
    $('clTeach').hidden = !$('clTeach').hidden;
  };
  $('clGo').onclick = () => {
    if (!isTeacherCode($('clCode').value)) {
      $('clErr').textContent = 'Код не подошёл.';
      return;
    }
    m.hidden = true;
    begin(parseInt($('clSeed').value, 10) || 0, true);
  };
}
// без сервера: ФИО, группа и номер в журнале (код преподавателя вместо номера — демо-режим, «код N» — вариант N)
function legacyScreen() {
  let seed = lsJSON('air-seed');
  const qs = new URLSearchParams(location.search).get('n');
  if (qs != null) seed = +qs;
  const m = $('modal');
  m.hidden = false;
  const has = seed != null && lsJSON(cfg.storeKey + seed);
  m.innerHTML = `<div class="dlg panel start">${cfg.legacyHead}
    <div class="dlg-id"><input id="fioIn" value="${esc(ls('air-fio'))}" placeholder="Фамилия Имя"><input id="grpIn" value="${esc(ls('air-grp'))}" placeholder="Группа"></div>
    <div class="dlg-num"><input id="seedIn" value="${seed != null ? seed : ''}" placeholder="№" autocomplete="off"><span>номер в журнале</span></div>
    <div id="startErr" class="bad"></div>
    <div class="btns"><button class="nextBtn" id="goBtn">${has ? 'Продолжить' : esc(cfg.startLabel)}</button>${has ? '<button class="btn" id="newBtn">Начать заново</button>' : ''}</div></div>`;
  const go = fresh => {
    const raw = $('seedIn').value.trim();
    const dm = raw.split(/\s+/);
    if (isTeacherCode(dm[0])) {
      m.hidden = true;
      begin(+(dm[1] || 0) || 0, true);
      return;
    }
    const v = parseInt(raw, 10),
      fio = $('fioIn').value.trim(),
      grp = $('grpIn').value.trim();
    if (fio.length < 3) {
      $('startErr').textContent = 'Впишите фамилию и имя — так преподаватель увидит вашу работу.';
      $('fioIn').focus();
      return;
    }
    if (isNaN(v) || v < 0 || v > 60 || String(v) !== raw) {
      $('startErr').textContent = 'Номер в журнале — число от 0 до 60.';
      $('seedIn').focus();
      return;
    }
    ls('air-fio', fio);
    ls('air-grp', grp);
    ls('air-seed', JSON.stringify(v));
    if (fresh) ls(cfg.storeKey + v, null);
    m.hidden = true;
    begin(v, false, fio, grp);
  };
  $('goBtn').onclick = () => go(false);
  if ($('newBtn')) $('newBtn').onclick = () => go(true);
  ['seedIn', 'fioIn', 'grpIn'].forEach(id => {
    $(id).onkeydown = e => {
      if (e.key === 'Enter') go(false);
    };
  });
}
const SYNC = {ok: '☁ сохранено', wait: '☁ …', off: '⚠ нет связи — сохраню позже', auth: '⚠ войдите заново'};
async function begin(seed, demo = false, fio = '', grp = '', sess = null) {
  D = cfg.makeData(seed);
  if (cfg.prepare) cfg.prepare(D);
  L = cfg.levels(D);
  const lkey = demo ? cfg.storeKey + 'demo' : sess && sess.sid ? cfg.storeKey + 's' + sess.sid : cfg.storeKey + seed;
  syncInit(demo ? null : sess, cfg.lab, st => {
    const el = $('sync');
    if (el) {
      el.className = 'sync ' + st;
      el.textContent = SYNC[st] || '';
    }
  });
  const server = demo ? null : await pull();
  const P = demo ? null : mergeP(server, lsJSON(lkey));
  G = {
    seed,
    demo,
    fio,
    grp,
    lkey,
    sess,
    P: P || {lv: {}, pred: {}, journal: [], answers: {}, fio: '', cur: 0},
    lv: null,
    slots: {},
    hist: [],
  };
  setCtx({lab: cfg.lab, fio, grp, seed, client: sess && sess.sid ? 's' + sess.sid : clientId(), demo, token: (sess && sess.token) || ''});
  report('hello', {done: doneN(), pts: score().sum});
  if (server || P) save();
  // продолжить с первого непройденного открытого уровня
  let i = Math.min(demo ? 0 : G.P.cur || 0, L.length - 1);
  if (L[i] && (G.P.lv[L[i].key] || {}).done) {
    const nd = L.findIndex(l => !(G.P.lv[l.key] || {}).done);
    if (nd >= 0) i = nd;
  }
  while (i > 0 && !unlocked(i)) i--;
  await cfg.startLevel(i);
}

// ═════════════════════════════ пульт: подсветка, место ошибки, сообщения над ним ══
let hl = {mark: () => {}, clear: () => {}};
// подчеркнуть в коде место ошибки: объект ошибки СУБД или текст сообщения
export const markError = err => hl.mark(err);
// вердикт, строка команды робота и всплывашка — всегда прямо над пультом, по его ширине, при любой его высоте
function placeMessages() {
  const d = $('deck').getBoundingClientRect(),
    free = narrow();
  document.documentElement.style.setProperty('--msg-max', Math.max(120, d.top - 70) + 'px');
  ['verdict', 'cmd', 'toast'].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.style.bottom = innerHeight - d.top + 12 + 'px';
    Object.assign(
      el.style,
      free
        ? {left: '', width: '', right: '', transform: '', maxWidth: ''}
        : {left: d.left + 'px', width: id === 'cmd' ? '' : d.width + 'px', maxWidth: d.width + 'px', right: 'auto', transform: 'none'},
    );
  });
}

// ═══════════════════════════════════════════ история команд, вставка ══
let paste = {add: () => {}};
export const allowPaste = t => paste.add(t);
// Ctrl+↑ / Ctrl+↓ — прошлые команды
export function pushHist(t) {
  if (!G.hist.length || G.hist[G.hist.length - 1] !== t) G.hist.push(t);
  G.hi = G.hist.length;
  paste.add(t);
}
function histKey(e) {
  if (!(e.ctrlKey || e.altKey) || !G || !G.hist || !G.hist.length) return;
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    G.hi = Math.max(0, (G.hi ?? G.hist.length) - 1);
    $('sql').value = G.hist[G.hi];
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    G.hi = Math.min(G.hist.length, (G.hi ?? G.hist.length) + 1);
    $('sql').value = G.hist[G.hi] || '';
  }
}
export function lintFail(msg, sql) {
  hl.mark(msg);
  report('lint', {lv: G.lv + 1, key: L[G.lv].key, sql: sql.slice(0, 600), msg});
  G.P.lints = (G.P.lints || 0) + 1;
  save();
}

// ═══════════════════════════════════════════════════════════ запуск ══
export async function boot() {
  W.frame();
  await W.loadRobot();
  db = await openDb();
  $('loading').hidden = true;
  $('runBtn').onclick = runFromUI;
  $('mission').addEventListener('click', e => {
    if (narrow() && e.target.closest('h1')) {
      $('side').classList.toggle('min');
      fitScene();
    }
  });
  addEventListener('resize', fitScene);
  $('sql').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runFromUI();
    } else histKey(e);
  });
  hl = attachHighlight($('sql'), Object.keys(cfg.TABLES));
  listenRobot(() => G && G.sess && G.sess.token); // объявления преподавателя
  new ResizeObserver(placeMessages).observe($('deck'));
  addEventListener('resize', placeMessages);
  placeMessages();
  paste = guardPaste($('sql'), () => {
    if (G && G.demo) return;
    toast('Вставка из других мест отключена — наберите команду сами. Свои прошлые команды: Ctrl+↑');
    if (G) {
      G.P.pastes = (G.P.pastes || 0) + 1;
      save();
    }
  });
  watchAway(
    ms => {
      if (G && !G.demo) {
        G.P.away = (G.P.away || 0) + 1;
        G.P.awayMs = (G.P.awayMs || 0) + ms;
        save();
      }
    },
    () =>
      G
        ? {
            lv: G.lv + 1,
            key: L[G.lv] && L[G.lv].key,
            done: doneN(),
            pts: score().sum,
            fails: (G.P.lv[(L[G.lv] || {}).key] || {}).fails || 0,
          }
        : {},
  );
  $('subBtn').onclick = submitDialog;
  $('rsDeck').onclick = () => {
    if (!running && G) cfg.startLevel(G.lv);
  };
  const gfx = () => {
    $('gfxBtn').textContent = W.quality === 'high' ? 'Графика: выс.' : 'Графика: низ.';
  };
  W.hooks.quality = gfx;
  gfx();
  $('gfxBtn').onclick = () => W.setQuality(W.quality === 'high' ? 'low' : 'high', true);
  $('mission').addEventListener('copy', e => {
    if (!G || !G.demo) e.preventDefault();
  });
  document.querySelectorAll('[data-spd]').forEach(
    b =>
      (b.onclick = () => {
        W.setSpeed(+b.dataset.spd);
        document.querySelectorAll('[data-spd]').forEach(x => x.classList.toggle('on', x === b));
      }),
  );
  $('sndBtn').onclick = () => {
    sound.muted = !sound.muted;
    $('sndBtn').classList.toggle('off', sound.muted);
  };
  $('homeBtn').onclick = () => W.home();
  $('menuBtn').onclick = () => {
    if (running) return;
    if (G && G.sess) push(G.P, true);
    session.set(null);
    startScreen();
  };
  window.addEventListener('beforeunload', () => {
    if (G && !G.demo) push(G.P, true);
  });
  W.hooks.pick = async p => {
    if (running || !p) {
      if (!running) W.hideCard();
      return;
    }
    cfg.pick(p);
  };
  // для отладки и автотестов (tests/e2e.mjs)
  window.LAB = {
    robotSay,
    holdAt: null,
    get W() {
      return W;
    },
    run: cfg.run,
    startLevel: cfg.startLevel,
    startPractice,
    get G() {
      return G;
    },
    get L() {
      return L;
    },
    get running() {
      return running;
    },
    set speed(v) {
      W.setSpeed(v);
    },
    begin,
    get D() {
      return D;
    },
  };
  startScreen();
}
// робот ждёт, пока преподаватель не отпустит показ (window.LAB.holdAt — номер строки)
export const hold = async n => {
  while (window.LAB && window.LAB.holdAt != null && n >= window.LAB.holdAt) await sleep(100);
};
