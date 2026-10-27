// Лабы на запросы (ЛР-15 SELECT, ЛР-16 JOIN, ЛР-17 GROUP BY, ЛР-18 подзапросы, ЛР-19, ЛР-20 транзакции):
// выполнение команд пульта, показ отбора, соединения, группировки и подзапроса в сцене, проверка уровня.
// Сцена — зал аэропорта (common/three/terminal.js) или пиццерия (common/three/pizzeria.js).
// Виды уровней: lv.ask — эталонный запрос (ответ сверяется с результатом студента; lv.must — чем он должен быть записан);
// lv.check 'schema' — доводка схемы (ограничения lv.need, автогенерация lv.identity, данные — по эталону lv.ref);
// lv.check 'cross' — соединение без условия: строк должно быть произведение;
// lv.check 'error' — нужен отказ СУБД с кодом lv.code (и текстом lv.errMsg);
// lv.check 'tx' — команды в транзакции: lv.verify(ctx) смотрит на ход команд (G.trail) и состояние базы
//   (может быть async: ctx.q(sql) — запрос от имени владельца базы, ctx.files — файлы pg_dump).
// Кроме SQL пульт понимает EXPLAIN [ANALYZE], метакоманды psql (\d, \di, \dp, \dn, \c) и, если уровень разрешает,
// pg_dump -n схема -f файл и psql -f файл — копия схемы строится по каталогу самой базы (ЛР-24).
import {$, esc, plural} from './util.js';
import {statements} from './sql.js';
import {SFX} from './sfx.js';
import {judge, describe, keyHint} from './judge.js';
import {parseSelect, compareResult, kindOf, shown, layoutHint, subqueries} from './select.js';
import {splitTop} from './sql.js';
import {
  db,
  D,
  L,
  G,
  running,
  unlocked,
  setRunning,
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
  asAdmin,
} from './shell.js';
import {report} from './net.js';

// пояснения к ответам СУБД по-русски (общие для ЛР-15 и ЛР-16)
export function explain(e) {
  const m = e.message || '';
  switch (e.code) {
    case '23503':
      if (/is not present/.test(e.detail || ''))
        return 'Значения из DETAIL нет в родительской таблице. Если вы объявляли внешний ключ — в таблице уже есть строки, которые ссылаются в никуда: найдите их запросом, исправьте по смыслу и повторите команду.';
      return /still referenced/.test(e.detail || '')
        ? 'На эту строку ссылаются другие строки — внешний ключ не даёт её удалить.'
        : 'Ссылка указывает на строку, которой нет в родительской таблице.';
    case '23505':
      return /could not create unique index/.test(m)
        ? 'Значение ключа повторяется — первичный ключ на такой столбец не встанет. Найдите повторы запросом и исправьте.'
        : 'Такое значение ключа уже есть. Если ключ выдаёт СУБД — сдвиньте счётчик: ALTER COLUMN … RESTART WITH …';
    case '23502':
      return 'Обязательный столбец (NOT NULL) остался пустым.';
    case '23514':
      return 'Значение не проходит правило CHECK.';
    case '42830':
      return 'Внешний ключ ссылается только на первичный ключ или уникальный столбец родительской таблицы.';
    case '42804':
      return /incompatible types/.test(m)
        ? 'Типы столбцов связи не совпадают — внешний ключ на них не объявить.'
        : 'Типы не сходятся: текст — в кавычках, числа — без.';
    case '428C9':
      return 'Столбец ключа — GENERATED ALWAYS: значение выдаёт СУБД, в INSERT его не указывают.';
    case '42710':
      return 'Ограничение с таким именем уже есть. Посмотрите «Структуру базы» под заданием.';
    case '42704':
      return /role/.test(m)
        ? 'Такой роли нет — сначала CREATE ROLE.'
        : /index/.test(m)
          ? 'Такого индекса нет — список индексов: \\di.'
          : 'Такого ограничения нет — проверьте имя в «Структуре базы».';
    case '42P16':
      return 'У таблицы уже есть первичный ключ — второй объявить нельзя.';
    case '42703':
      return 'Такого столбца нет — проверьте имя (и псевдоним таблицы перед точкой).';
    case '42P01':
      return /missing FROM-clause entry/.test(m)
        ? 'Псевдоним не объявлен: после имени таблицы в FROM/JOIN напишите его, например passenger p.'
        : 'Такой таблицы нет.';
    case '42702':
      return 'Столбец с таким именем есть в нескольких таблицах — укажите, из какой: p.id, b.tag.';
    case '42601':
      return 'Синтаксическая ошибка — проверьте слово, названное в сообщении, и что перед ним.';
    case '42883':
    case '22P02':
      return 'Типы не сходятся: текст — в одинарных кавычках, числа — без.';
    case '42803':
      return /not allowed in WHERE/.test(m)
        ? 'В WHERE агрегатной функции быть не может: WHERE отбирает строки до группировки, групп ещё нет — считать нечего. Условие на итог группы пишется в HAVING.'
        : 'Столбец нужно либо перечислить в GROUP BY, либо обернуть в агрегатную функцию.';
    case '25P02':
      return 'Транзакция прервана ошибкой: СУБД не выполняет команды, пока транзакцию не закончат. Выход один — ROLLBACK (COMMIT здесь тоже сработает как ROLLBACK).';
    case '42501':
      return 'Нет прав: роли не выдано это право (GRANT) или его отобрали (REVOKE). Права выдаёт владелец таблицы.';
    case '3F000':
      return 'Такой схемы нет — проверьте имя (её могли переименовать).';
    case '42P07':
      return 'Объект с таким именем уже есть.';
    case '21000':
      return 'Подзапрос вернул несколько строк, а на этом месте нужно одно значение. Для списка — IN (SELECT …).';
    default:
      return '';
  }
}

// каталог: ограничения таблицы и автогенерация ключа
const CONS_SQL = `SELECT c.conname AS name, c.contype AS type, t.relname AS tbl, r.relname AS ref,
  (SELECT string_agg(a.attname, ',' ORDER BY a.attnum) FROM pg_attribute a WHERE a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)) AS cols,
  pg_get_constraintdef(c.oid) AS def
FROM pg_constraint c JOIN pg_class t ON t.oid = c.conrelid JOIN pg_namespace n ON n.oid = t.relnamespace
LEFT JOIN pg_class r ON r.oid = c.confrelid WHERE n.nspname = ANY (current_schemas(false)) AND c.contype <> 'n' ORDER BY t.relname, c.contype, c.conname`;
const TYPE = {p: 'PRIMARY KEY', f: 'FOREIGN KEY', u: 'UNIQUE', c: 'CHECK'};
const PREFIX = {p: 'pk_', f: 'fk_', u: 'uq_', c: 'ck_'};

// команды транзакции: START TRANSACTION = BEGIN, END = COMMIT, ABORT = ROLLBACK
const TXK = {BEGIN: 'BEGIN', START: 'BEGIN', COMMIT: 'COMMIT', END: 'COMMIT', ROLLBACK: 'ROLLBACK', ABORT: 'ROLLBACK'};
const AGG = /\b(count|sum|avg|min|max)\s*\(/i;
// выражение столбца без имени: «count(*) AS n» → «count(*)»
const noAlias = c => {
  const m = /^([\s\S]*\))\s+(?:as\s+)?[\wА-яЁё"]+$/i.exec(c) || /^([\s\S]*?)\s+as\s+[\wА-яЁё"]+$/i.exec(c);
  return (m ? m[1] : c).trim();
};
// условие команды без лишних пробелов и регистра — чтобы сравнить WHERE у SELECT и UPDATE
const normWhere = w =>
  (w || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([=<>(),])\s*/g, '$1')
    .trim()
    .toLowerCase();
const whereOf = sql => {
  const m = /\bwhere\b([\s\S]*)$/i.exec(sql.replace(/;\s*$/, ''));
  return m ? normWhere(m[1]) : '';
};

// команды пульта: SQL делится по «;», а строки метакоманд psql (\d, \c) и pg_dump / psql — каждая сама по себе
export function commands(text) {
  const out = [];
  let buf = '';
  const flush = () => {
    out.push(...statements(buf));
    buf = '';
  };
  text.split('\n').forEach(line => {
    if (/^\s*(\\|pg_dump\b|psql\b)/.test(line)) {
      flush();
      out.push(line.trim().replace(/;\s*$/, ''));
    } else buf += line + '\n';
  });
  flush();
  return out;
}
// вид команды: SELECT, INSERT…, BEGIN/COMMIT/ROLLBACK, META (\d), PG_DUMP, PSQL
const cmdKind = sql =>
  /^\s*\\/.test(sql) ? 'META' : /^\s*pg_dump\b/.test(sql) ? 'PG_DUMP' : /^\s*psql\b/.test(sql) ? 'PSQL' : TXK[kindOf(sql)] || kindOf(sql);
// узлы плана: способ чтения каждой таблицы и соединения
export function planNodes(lines) {
  const out = [];
  lines.forEach(l => {
    const rows = +((/actual time=[^)]*rows=(\d+)/.exec(l) || /rows=(\d+)/.exec(l) || [])[1] || 0);
    const bi = /Bitmap Index Scan on (\w+)/.exec(l);
    const m = !bi && /(Seq Scan|Index Only Scan|Index Scan|Bitmap Heap Scan)(?: using (\w+))? on (\w+)/.exec(l);
    const j = /(Hash Join|Merge Join|Nested Loop)/.exec(l);
    // Bitmap Index Scan — часть Bitmap Heap Scan строкой выше: индекс — ей
    if (bi) {
      const h = [...out].reverse().find(n => n.kind === 'Bitmap Heap Scan' && !n.index);
      if (h) h.index = bi[1];
    } else if (m) out.push({kind: m[1], index: m[2] || null, table: m[3], rows});
    else if (j) out.push({kind: j[1], rows});
  });
  const text = lines.join('\n');
  const time = (/Execution Time: ([\d.]+) ms/.exec(text) || [])[1];
  const removed = +((/Rows Removed by Filter: (\d+)/.exec(text) || [])[1] || 0);
  // сортировка и итог — узлы без таблицы: только флаги
  return {
    nodes: out,
    time: time ? +time : null,
    removed,
    sort: /(^|\s|>)\s*(Incremental )?Sort\b/m.test(text),
    agg: /\bAggregate\b/.test(text),
  };
}

export function queryLab({W, TABLES, COLS, sleep, tablesHint, practiceRef}) {
  const robotErr = () => {
    W.play('jump', true);
    setTimeout(() => W.play('idle'), 700);
  };
  const q = (sql, arr) => db.query(sql, [], arr ? {rowMode: 'array'} : undefined);
  async function result(sql) {
    const r = await q(sql, true);
    return {fields: r.fields.map(f => f.name), rows: r.rows};
  }
  const table = (res, max = 12) => {
    if (!res.fields.length) return '';
    const n = res.rows.length;
    return `<div class="rtab"><table><tr>${res.fields.map(f => `<th>${esc(f)}</th>`).join('')}</tr>${res.rows
      .slice(0, max)
      .map(r => `<tr>${r.map(v => `<td class="${v === null ? 'nul' : ''}">${esc(shown(v))}</td>`).join('')}</tr>`)
      .join('')}</table>${n > max ? `<div class="ru">…и ещё ${n - max} ${plural(n - max, 'строка', 'строки', 'строк')}</div>` : ''}</div>`;
  };

  // ═══════════════════════════════════════════════════ выполнение ══
  async function run() {
    if (running || !db || !G || G.lv == null) return;
    const all = $('sql').value.trim();
    const st = commands(all);
    if (!st.length) return;
    pushHist(all);
    const lv = L[G.lv];
    $('verdict').innerHTML = '';
    const allow = lv.allow || ['SELECT'];
    for (let i = 0; i < st.length; i++) {
      const k = cmdKind(st[i]);
      let msg = '';
      if (k !== 'META' && !allow.includes(k))
        msg =
          allow.length === 1
            ? 'На этом уровне база не меняется — только запрос SELECT.'
            : `На этом уровне пульт выполняет: ${allow.join(', ')}.`;
      else if (k === 'SELECT') {
        const p = parseSelect(st[i]);
        if (p.err) msg = p.err;
        else if (p.star && !lv.star)
          msg =
            'Звёздочка годится для беглого взгляда, но не для ответа: перечислите через запятую ровно те столбцы, о которых спрашивают.';
        else if (lv.alias && p.tables.length > 1 && p.tables.some(x => x.alias === x.t))
          msg = 'Дайте таблицам псевдонимы: FROM baggage b JOIN passenger p ON … — и пишите b.tag, p.full_name.';
      }
      if (msg) {
        msg = (st.length > 1 ? `Команда ${i + 1}: ` : '') + msg;
        $('result').innerHTML = `<span class="bad">${esc(msg)}</span>`;
        SFX.err();
        errBox('Так нельзя', msg);
        lintFail(msg, st[i]);
        return;
      }
    }
    if (lv.pred && !G.P.pred[lv.key]) await predict(lv);
    setRunning(true);
    $('runBtn').disabled = true;
    W.clearChips();
    W.clearLinks();
    W.hideCard();
    W.clearSay();
    if (W.calm) await W.calm(); // зал ожидания: все снова на местах (в пиццерии — стопки итогов разобраны)
    try {
      for (let i = 0; i < st.length; i++) {
        G.stmtTag = st.length > 1 ? `команда ${i + 1} из ${st.length} · ` : '';
        const info = await runOne(st[i]);
        await afterRun(info);
        const left = st.length - 1 - i;
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
  async function runOne(sql) {
    recOf(L[G.lv]).runs++;
    const kind = cmdKind(sql),
      tx0 = G.tx || '',
      role0 = G.role || null;
    const info = TXK[kind]
      ? await runTx(sql, TXK[kind])
      : kind === 'SELECT'
        ? await runSelect(sql)
        : kind === 'EXPLAIN'
          ? await runExplain(sql)
          : kind === 'META'
            ? await runMeta(sql)
            : kind === 'PG_DUMP'
              ? await runDump(sql)
              : kind === 'PSQL'
                ? await runRestore(sql)
                : await runChange(sql, kind);
    // ошибка внутри транзакции прерывает её: дальше — только ROLLBACK
    if (info.err && G.tx === '*') G.tx = '!';
    G.trail.push({
      kind: TXK[kind] || kind,
      sql,
      code: info.err ? info.err.code : null,
      msg: info.err ? info.err.message : '',
      n: info.res ? info.res.rows.length : info.n,
      tag: info.tag,
      tx: tx0,
      txAfter: G.tx || '',
      where: kind === 'SELECT' ? normWhere(info.p && info.p.where) : whereOf(sql),
      table: kind === 'SELECT' ? info.p && info.p.tables[0] && info.p.tables[0].t : tableOf(sql),
      role: role0,
      roleAfter: G.role || null,
      plan: info.plan || null,
      out: info.out || '',
    });
    psql();
    await refreshCatalog();
    return info;
  }
  // сцене — индексы (шкафы каталога), число строк и текущая роль; таблицы, которой нет, не трогаем —
  // ошибка внутри транзакции студента прервала бы её
  async function refreshCatalog() {
    if (!W.catalog || G.tx === '!') return;
    const info = await asAdmin(async () => {
      const have = (await q(`SELECT tablename FROM pg_tables WHERE schemaname = ANY (current_schemas(false))`)).rows.map(r => r.tablename);
      const counts = {};
      for (const t of Object.keys(TABLES)) if (have.includes(t)) counts[t] = (await q(`SELECT count(*)::int AS n FROM ${t}`)).rows[0].n;
      const indexes = (
        await q(
          `SELECT indexname AS name, tablename AS table FROM pg_indexes WHERE schemaname = ANY (current_schemas(false)) ORDER BY indexname`,
        )
      ).rows;
      return {counts, indexes};
    }).catch(() => null);
    if (info) W.catalog({...info, role: G.role || null});
  }
  // приглашение как в psql: pizza=> — без транзакции, pizza=*> — транзакция идёт, pizza=!> — прервана ошибкой
  function psql() {
    const el = $('psql');
    if (!el) return;
    // как в psql: у суперпользователя приглашение кончается на #, у обычной роли — на >
    el.textContent = `${G.role ? G.role + '@' : ''}${el.dataset.db || 'db'}=${G.tx || ''}${el.dataset.su && !G.role ? '#' : '>'}`;
    el.className = 'psql' + (G.tx === '*' ? ' tx' : G.tx === '!' ? ' bad' : '');
  }
  // BEGIN / COMMIT / ROLLBACK
  async function runTx(sql, k) {
    const info = {kind: k};
    try {
      await db.query(sql);
    } catch (e) {
      robotErr();
      markError(e);
      info.err = e;
      $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span>`;
      SFX.err();
      journal(sql, 'ERROR ' + e.code);
      return info;
    }
    let tag = k,
      note = '';
    if (k === 'BEGIN') {
      if (G.tx) {
        tag = 'WARNING: there is already a transaction in progress';
        note = 'Транзакция уже идёт — второй BEGIN ничего не меняет.';
      } else
        note =
          'Транзакция открыта: изменения пока видны только вам. COMMIT — подтвердить, ROLLBACK — отменить всё, что сделано после BEGIN.';
      G.tx = G.tx || '*';
    } else {
      if (!G.tx) {
        tag = 'WARNING: there is no transaction in progress';
        note = 'Транзакции нет: каждая команда уже подтверждена сама по себе. Начинайте с BEGIN.';
      } else if (k === 'COMMIT' && G.tx === '!') {
        tag = 'ROLLBACK';
        note = 'Транзакция была прервана ошибкой — COMMIT отменил её, как ROLLBACK.';
      } else note = k === 'COMMIT' ? 'Изменения подтверждены.' : 'Всё, что сделано после BEGIN, отменено.';
      G.tx = '';
    }
    info.tag = tag;
    $('result').innerHTML = `<span class="ok">${esc(tag)}</span><div class="ru">${esc(note)}</div>`;
    journal(sql, tag);
    SFX.pop();
    if (k !== 'BEGIN') await W.sync(await state(), true);
    return info;
  }

  // ═════════════════════════════════════════════ SELECT: показ и ответ ══
  const known = p => p.tables.length && p.tables.every(x => TABLES[x.t]);
  async function runSelect(sql) {
    const p = parseSelect(sql);
    const info = {kind: 'SELECT', p};
    let yes = null,
      claims = null;
    G.subs = [];
    try {
      if (G.tx === '!') throw new Error('транзакция прервана');
      G.subs = await showSubs(p);
      if (known(p) && (p.group || p.agg)) info.groups = await showGroup(p);
      else if (known(p) && p.tables.length === 1) yes = await showScan(p);
      else if (known(p)) claims = await showJoin(p);
    } catch (e) {
      /* показ не получился (сложное условие) — сам запрос всё равно выполним */
      W.beamOff();
      W.hideCard();
    }
    let res;
    try {
      res = await result(p.sql);
    } catch (e) {
      robotErr();
      markError(e);
      $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span><div class="ru">${esc(explain(e))}</div>`;
      SFX.err();
      journal(sql, 'ошибка');
      info.err = e;
      return info;
    }
    info.res = res;
    const n = res.rows.length;
    const tag = `(${n} ${plural(n, 'строка', 'строки', 'строк')})`;
    let ordered = null;
    if (known(p) && !p.group && !p.agg && p.tables.length === 1 && (p.order || p.limit != null))
      ordered = await numberRows(p).catch(() => null);
    $('result').innerHTML =
      `<span class="ok">${esc(tag)}</span>${table(res)}${info.groups ? `<div class="ru">${esc(info.groups)}</div>` : ''}`;
    journal(sql, tag);
    // зал ожидания: отобранные встают, а с ORDER BY / LIMIT — идут в очередь к выходу в порядке ответа
    if (W.answer && (ordered || yes)) await W.answer(p.tables[0].t, ordered || yes, !!ordered);
    // зал выдачи: каждый, кому соединение нашло чемодан, забирает его с ленты
    if (W.claim && claims && claims.length) await W.claim(claims);
    if (G.subs.length && G.subs.some(x => x.err === undefined))
      $('result').insertAdjacentHTML('beforeend', `<div class="ru">${G.subs.map(x => esc(x.line)).join('<br>')}</div>`);
    await W.robotGo(W.HOME.x, 0);
    W.face(-Math.PI / 2);
    W.camS.follow = false;
    return info;
  }
  const colsIn = (t, w) => (w ? COLS[t].filter(c => new RegExp('\\b' + c + '\\b', 'i').test(w)) : []);
  // условие с подставленными значениями строки: «birth_year >= 2012» → «2015 >= 2012»
  const subst = (t, w, row) =>
    G.subs
      .filter(x => x.v !== undefined)
      .reduce((s, x) => s.split(`(${x.sql})`).join(x.v), w)
      .replace(/'(?:[^']|'')*'|\b(?:\w+\.)?[a-z_]+\b/gi, x => {
        const c = x.toLowerCase().replace(/^\w+\./, '');
        if (x.startsWith("'") || !COLS[t].includes(c)) return x;
        return row[c] === null ? 'NULL' : typeof row[c] === 'string' ? "'" + row[c] + "'" : String(row[c]);
      });
  // робот обходит строки таблицы и у каждой проверяет WHERE
  async function showScan(p) {
    const {t, alias: a} = p.tables[0],
      pk = TABLES[t];
    const rows = (
      await q(
        `SELECT ${COLS[t].map(c => `${a}.${c}`).join(', ')}, ${p.where ? `(${p.where})` : 'true'} AS __w FROM ${t}${a === t ? '' : ' ' + a} ORDER BY ${a}.ctid`,
      )
    ).rows;
    cmdBar(
      `<span class="k">${G.stmtTag || ''}${esc(`SELECT … FROM ${t}`)}</span><span class="w">${p.where ? 'WHERE ' + esc(p.where) : 'без WHERE — подходит каждая строка'}</span>${subsBar()}`,
    );
    W.camS.follow = true;
    const wcols = colsIn(t, p.where);
    let done = 0,
      yes = 0;
    const keys = [];
    hud(0, 0, rows.length);
    for (const row of rows) {
      const k = String(row[pk]);
      const loc = W.locate(t, row);
      const fast = W.speed >= 50 || rows.length > 40;
      W.focus(loc.aim);
      const v = row.__w,
        kind = v === true ? 'yes' : v === false ? 'no' : 'unk';
      if (!fast) {
        await W.robotGo(loc.x, loc.z);
        W.face(loc.face);
        W.aimBeam(loc.aim);
        const vals = (wcols.length ? wcols : [pk]).map(c => `<div><span>${c}</span><b>${esc(shown(row[c]))}</b></div>`).join('');
        W.showCard(
          t,
          k,
          `<div class="rc-h">${t} · ${esc(k)}</div>${vals}${p.where ? `<div class="rc-x">${esc(subst(t, p.where, row))}</div>` : ''}<div class="rc-v ${kind}">${kind === 'yes' ? 'ДА — в ответ' : kind === 'no' ? 'НЕТ' : 'NULL — не знаю, значит нет'}</div>`,
          kind,
        );
        SFX[kind]();
        await sleep(Math.max(70, 420 / W.speed));
        await hold(done + 1);
        W.hideCard();
      }
      W.chip(t, k, kind, kind === 'yes' ? '✓' : kind === 'no' ? '' : '?');
      done++;
      if (v === true) {
        yes++;
        keys.push(k);
      }
      hud(done, yes, rows.length, 'проверено', 'в ответ');
    }
    W.beamOff();
    W.fadeNo();
    return keys;
  }
  // подзапросы в условии: сначала каждый выполняется сам — его результат и подставляется во внешний запрос
  async function showSubs(p) {
    const out = [];
    for (const sql of [...subqueries(p.where), ...subqueries(p.having)]) {
      const x = {sql};
      try {
        const r = await q(sql, true);
        if (r.rows.length === 1 && r.rows[0].length === 1) {
          x.v = shown(r.rows[0][0]);
          x.line = `Подзапрос (${sql}) = ${x.v}`;
        } else {
          const vals = r.rows.map(row => shown(row[0]));
          x.line = `Подзапрос (${sql}) → ${vals.length} ${plural(vals.length, 'значение', 'значения', 'значений')}: ${vals.slice(0, 8).join(', ')}${vals.length > 8 ? ', …' : ''}`;
          if (vals.includes('NULL')) x.line += ' — среди них NULL!';
        }
      } catch (e) {
        x.err = e.code;
        x.line = `Подзапрос (${sql}) ссылается на внешнюю строку — выполняется для каждой строки заново.`;
      }
      out.push(x);
    }
    if (out.length) {
      cmdBar(`<span class="k">${G.stmtTag || ''}сначала подзапрос</span>${out.map(x => `<span class="w">${esc(x.line)}</span>`).join('')}`);
      await sleep(Math.max(400, 1600 / W.speed));
      await hold(0);
    }
    return out;
  }
  const subsBar = () =>
    G.subs
      .filter(x => x.v !== undefined)
      .map(x => `<span class="n">(${esc(x.sql.slice(0, 60))}${x.sql.length > 60 ? '…' : ''}) = ${esc(x.v)}</span>`)
      .join('');
  // GROUP BY: строки (после WHERE) раскладываются по группам, у каждой группы — итог; HAVING гасит лишние группы.
  // Без GROUP BY, но с агрегатом — одна группа на все отобранные строки.
  async function showGroup(p) {
    const T = p.tables,
      mv = T.find(x => x.t === 'orders') || T[0],
      key = `${mv.alias}.${TABLES[mv.t]}`;
    const gex = p.group ? splitTop(p.group, ',').map(x => x.trim()) : [];
    const label = gex.length ? `concat_ws(' · ', ${gex.map(g => `coalesce((${g})::text, 'NULL')`).join(', ')})` : `'все строки'`;
    const rows = (await q(`SELECT ${key} AS __k, ${p.where ? `(${p.where})` : 'true'} AS __w, ${label} AS __g FROM ${p.from}`, true)).rows;
    cmdBar(
      `<span class="k">${G.stmtTag || ''}${esc(`FROM ${T.map(x => x.t).join(' ⟶ ')}`)}</span><span class="w">${p.where ? 'WHERE ' + esc(p.where) : 'без WHERE — все строки'}</span><span class="w">${p.group ? 'GROUP BY ' + esc(p.group) : 'без GROUP BY — одна группа'}</span>${p.having ? `<span class="w">HAVING ${esc(p.having)}</span>` : ''}${subsBar()}`,
    );
    W.camS.follow = true;
    // шаг 1 — WHERE: строки, которые не прошли, гаснут ещё до группировки
    const by = new Map();
    let done = 0,
      yes = 0;
    hud(0, 0, rows.length, 'проверено', 'в группы');
    const slow = W.speed < 50 ? 5 : 0;
    for (const [k, w, g] of rows) {
      if (k === null) continue;
      if (done < slow) {
        const loc = W.locate(mv.t, {id: k});
        W.focus(loc.aim);
        await W.robotGo(loc.x, loc.z);
        W.face(loc.face);
        W.aimBeam(loc.aim);
        SFX[w === true ? 'yes' : 'no']();
        await sleep(Math.max(60, 300 / W.speed));
        await hold(done + 1);
      }
      if (w === true) {
        yes++;
        if (!by.has(g)) by.set(g, []);
        if (!by.get(g).includes(String(k))) by.get(g).push(String(k));
      } else W.chip(mv.t, String(k), 'no', '');
      done++;
    }
    hud(done, yes, rows.length, 'проверено', 'в группы');
    if (!p.group && !by.size) by.set('все строки', []); // итог по пустому набору — тоже одна группа: count(*) = 0
    W.beamOff();
    W.fadeNo();
    // шаг 2 — итог каждой группы: первая агрегатная функция из списка столбцов
    const agg = p.cols.map(noAlias).find(c => AGG.test(c));
    let sums = new Map(),
      keep = new Map();
    if (agg || p.having) {
      const r = (
        await q(
          `SELECT ${label} AS __g, ${agg ? `(${agg})::text` : 'NULL'} AS __a, ${p.having ? `(${p.having})` : 'true'} AS __h FROM ${p.from}${p.where ? ' WHERE ' + p.where : ''}${p.group ? ' GROUP BY ' + p.group : ''}`,
          true,
        )
      ).rows;
      r.forEach(([g, a, h]) => {
        sums.set(g, a);
        keep.set(g, h === true);
      });
    }
    const aggName = agg ? agg.replace(/\s+/g, ' ').slice(0, 22) : '';
    const groups = [...by.keys()]
      .sort((a, b) => String(a).localeCompare(String(b), 'ru', {numeric: true}))
      .map(g => ({
        label: g || '—',
        keys: by.get(g),
        agg: agg ? `${aggName} = ${shown(sums.get(g) ?? null)}` : `${by.get(g).length} стр.`,
        g,
      }));
    if (mv.t !== 'orders') groups.forEach((G2, i) => G2.keys.forEach(k => W.chip(mv.t, k, 'yes', String.fromCharCode(65 + (i % 26)))));
    W.camS.follow = false;
    W.focus(null);
    if (W.group) await W.group(mv.t, groups);
    // шаг 3 — HAVING: группы, у которых итог не прошёл условие, отбрасываются
    let left = groups.length;
    if (p.having && W.groupCut) {
      const ks = groups.map(x => keep.get(x.g));
      left = ks.filter(Boolean).length;
      cmdBar(
        `<span class="k">${G.stmtTag || ''}HAVING ${esc(p.having)}</span><span class="w">групп: ${groups.length} → осталось ${left}</span>`,
      );
      await W.groupCut(ks);
    }
    const from = p.where ? ` (после WHERE из ${rows.length})` : '';
    if (!p.group) return `Итог по ${yes} ${plural(yes, 'строке', 'строкам', 'строкам')}${from}.`;
    return `Групп: ${groups.length}${p.having ? `, после HAVING — ${left}` : ''}. Строк в группах: ${yes}${from}.`;
  }
  // ORDER BY / LIMIT: на отобранных строках — их номер в ответе
  async function numberRows(p) {
    const {t, alias: a} = p.tables[0],
      pk = TABLES[t];
    const keys = (
      await q(
        `SELECT ${a}.${pk} FROM ${p.from}${p.where ? ' WHERE ' + p.where : ''}${p.order ? ' ORDER BY ' + p.order : ''}${p.limit != null ? ' LIMIT ' + p.limit : ''}`,
        true,
      )
    ).rows.map(r => String(r[0]));
    const inTop = new Set(keys);
    if (p.limit != null) {
      const all = (await q(`SELECT ${a}.${pk} FROM ${p.from}${p.where ? ' WHERE ' + p.where : ''}`, true)).rows.map(r => String(r[0]));
      all.filter(k => !inTop.has(k)).forEach(k => W.chip(t, k, 'no', ''));
    }
    keys.forEach((k, i) => W.chip(t, k, 'yes', String(i + 1)));
    W.fadeNo();
    return keys;
  }
  // JOIN: для каждой строки первой таблицы — стержни к её парам; без пары — «∅»
  async function showJoin(p) {
    const T = p.tables;
    const keys = T.map((x, i) => `${x.alias}.${TABLES[x.t]} AS __k${i}`).join(', ');
    const pairs = (await q(`SELECT ${keys} FROM ${p.from}${p.where ? ' WHERE ' + p.where : ''} LIMIT 3000`, true)).rows;
    const total = pairs.length;
    cmdBar(
      `<span class="k">${G.stmtTag || ''}${esc(T.map(x => x.t).join(' ⟶ '))}</span><span class="w">${p.cross ? 'без условия соединения — каждая строка с каждой' : esc(p.from.replace(/^\w+\s+(\w+\s+)?/, ''))}</span>`,
    );
    // строки первой таблицы, у которых пары не нашлось (внутреннее соединение их выбросит)
    const first = T[0];
    const allFirst = (await q(`SELECT ${TABLES[first.t]} FROM ${first.t} ORDER BY ctid`, true)).rows.map(r => String(r[0]));
    const seen = new Set(pairs.map(r => String(r[0])));
    W.camS.follow = true;
    hud(0, 0, total, 'пар', 'собрано');
    const slow = W.speed < 50 && !p.cross ? 10 : 0,
      MAXL = 350;
    let i = 0,
      links = 0;
    for (const row of pairs) {
      const show = i < slow;
      if (show) {
        const loc = W.locate(first.t, {[TABLES[first.t]]: row[0], id: row[0], tag: row[0], tier: row[0]});
        W.focus(loc.aim);
        await W.robotGo(loc.x, loc.z);
        W.face(loc.face);
      }
      W.chip(first.t, String(row[0]), 'yes', '✓');
      for (let j = 1; j < T.length; j++) {
        if (row[j] === null) {
          W.chip(T[j - 1].t, String(row[j - 1]), 'unk', '∅');
          break;
        }
        if (links < MAXL && row[j - 1] !== null) {
          W.link(T[j - 1].t, String(row[j - 1]), T[j].t, String(row[j]), p.cross ? 'many' : j > 1 ? 'path' : 'ok', show || links < 60);
          links++;
        }
      }
      if (show) {
        SFX.yes();
        await sleep(Math.max(60, 380 / W.speed));
        await hold(i + 1);
      }
      i++;
      hud(i, i, total, 'пар', 'собрано');
    }
    if (!p.left) allFirst.filter(k => !seen.has(k)).forEach(k => W.chip(first.t, k, 'no', ''));
    if (total > 0 && links >= MAXL)
      $('cmd').insertAdjacentHTML('beforeend', `<span class="n">показаны первые ${MAXL} связей из ${total}</span>`);
    W.fadeNo();
    // пары «чемодан — владелец»; без условия соединения пары случайные — никто ничего не забирает
    const ib = T.findIndex(x => x.t === 'baggage'),
      ip = T.findIndex(x => x.t === 'passenger');
    if (p.cross || ib < 0 || ip < 0) return null;
    return pairs.filter(r => r[ib] !== null && r[ip] !== null).map(r => [r[ib], r[ip]]);
  }

  // ═══════════════════════════════════ ALTER, INSERT, UPDATE, DELETE ══
  const tableOf = sql =>
    (
      (/^\s*(?:alter\s+table|insert\s+into|update|delete\s+from)\s+(?:only\s+)?(?:\w+\.)?(\w+)/i.exec(sql) ||
        /^\s*create\s+(?:unique\s+)?index\s+(?:\w+\s+)?on\s+(?:\w+\.)?(\w+)/i.exec(sql) ||
        [])[1] || ''
    ).toLowerCase();
  // ответ СУБД на команду: INSERT 0 3, UPDATE 2, CREATE INDEX, GRANT, SET…
  const tagOf = (sql, kind, n) => {
    if (kind === 'INSERT') return `INSERT 0 ${n}`;
    if (kind === 'UPDATE' || kind === 'DELETE') return `${kind} ${n}`;
    const w = sql
      .trim()
      .split(/\s+/)
      .map(x => x.toUpperCase());
    if (['CREATE', 'DROP', 'ALTER'].includes(kind)) return `${kind} ${w[1] === 'UNIQUE' ? 'INDEX' : w[1]}`;
    return kind;
  };
  async function runChange(sql, kind) {
    const info = {kind};
    const t = tableOf(sql);
    let r;
    try {
      r = await db.query(sql);
    } catch (e) {
      robotErr();
      markError(e);
      info.err = e;
      $('result').innerHTML =
        `<span class="bad">ERROR: ${esc(e.message)}</span>${e.detail ? `<div class="ru">DETAIL: ${esc(e.detail)}</div>` : ''}<div class="ru">${esc(explain(e))}</div>`;
      SFX.err();
      await showOffenders(t, e).catch(() => {});
      journal(sql, 'ERROR ' + (e.constraint || e.code));
      return info;
    }
    info.n = r.affectedRows || 0;
    const tag = tagOf(sql, kind, info.n);
    info.tag = tag;
    // SET ROLE / RESET ROLE: дальше команды идут от имени роли
    if (kind === 'SET' && /^\s*set\s+role\s+/i.test(sql)) G.role = /^\s*set\s+role\s+(\w+)/i.exec(sql)[1].toLowerCase();
    if (kind === 'RESET' && /role/i.test(sql)) G.role = null;
    if (kind === 'SET' && /^\s*set\s+role\s+(none|default)\b/i.test(sql)) G.role = null;
    let note = '';
    // много строк разом — СУБД пересчитывает статистику сама (автоочистка); здесь — сразу, чтобы планы были честными
    if (kind === 'INSERT' && info.n >= 1000) {
      await asAdmin(() => db.query('ANALYZE'));
      note = `<div class="ru">Добавлено ${info.n} строк — СУБД обновила статистику таблицы (ANALYZE), по ней планировщик выбирает способ чтения.</div>`;
    }
    $('result').innerHTML =
      `<span class="ok">${esc(tag)}</span>${note}${kind === 'ALTER' && TABLES[t] ? await consHtml(t).catch(() => '') : ''}`;
    journal(sql, tag);
    SFX.pop();
    await W.sync(await state(), true);
    return info;
  }
  // ═══════════════════════════════════════════════ EXPLAIN: план запроса ══
  async function runExplain(sql) {
    const info = {kind: 'EXPLAIN'};
    let lines;
    try {
      lines = (await db.query(sql)).rows.map(r => Object.values(r)[0]);
    } catch (e) {
      robotErr();
      markError(e);
      info.err = e;
      $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span><div class="ru">${esc(explain(e))}</div>`;
      SFX.err();
      journal(sql, 'ERROR ' + e.code);
      return info;
    }
    const plan = planNodes(lines);
    plan.text = lines.join('\n');
    plan.analyze = /^\s*explain\s+(\(\s*)?analyze/i.test(sql);
    info.plan = plan;
    const scans = plan.nodes.filter(n => n.table);
    const tag =
      scans.map(n => `${n.kind}${n.index ? ' using ' + n.index : ''} on ${n.table}`).join(' · ') +
      (plan.time != null ? ` · ${plan.time} ms` : '');
    info.tag = tag;
    const hl = l =>
      esc(l)
        .replace(
          /(Seq Scan|Index Only Scan|Index Scan|Bitmap Heap Scan|Bitmap Index Scan|Hash Join|Merge Join|Nested Loop)/,
          '<b class="pk">$1</b>',
        )
        .replace(/(Execution Time: [\d.]+ ms|Rows Removed by Filter: \d+)/, '<b class="pt">$1</b>');
    $('result').innerHTML = `<span class="ok">QUERY PLAN</span><pre class="plan">${lines.map(hl).join('\n')}</pre>${
      plan.analyze ? '' : '<div class="ru">EXPLAIN показывает план и ничего не выполняет; время — у EXPLAIN ANALYZE.</div>'
    }`;
    journal(sql, tag);
    // робот проходит план: подряд по всем полкам — или к каталогу индекса и сразу к нужной полке
    if (W.scan)
      for (const n of [...plan.nodes].reverse()) {
        if (!n.table) continue;
        cmdBar(
          `<span class="k">${G.stmtTag || ''}${esc(n.kind)}</span><span class="w">${esc((n.index ? 'по индексу ' + n.index + ' · ' : '') + 'таблица ' + n.table)}</span>`,
        );
        await W.scan(n, plan);
        await hold(0);
      }
    return info;
  }

  // ═════════════════════════════════════════════ метакоманды psql ══
  const pre = t => `<pre class="plan">${esc(t)}</pre>`;
  async function metaDescribe(t) {
    return asAdmin(async () => {
      const cols = (
        await q(`SELECT column_name AS c, format_type(a.atttypid, a.atttypmod) AS ty, NOT a.attnotnull AS nul, pg_get_expr(d.adbin, d.adrelid) AS def
          FROM information_schema.columns ic JOIN pg_attribute a ON a.attrelid = (quote_ident(ic.table_schema) || '.' || quote_ident(ic.table_name))::regclass AND a.attname = ic.column_name
          LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
          WHERE ic.table_name = '${t}' AND ic.table_schema = ANY (current_schemas(false)) ORDER BY ic.ordinal_position`)
      ).rows;
      if (!cols.length) return null;
      const ix = (
        await q(
          `SELECT indexname, indexdef FROM pg_indexes WHERE tablename = '${t}' AND schemaname = ANY (current_schemas(false)) ORDER BY indexname`,
        )
      ).rows;
      const cs = (await q(CONS_SQL)).rows.filter(c => c.tbl === t && c.type !== 'p' && c.type !== 'u');
      return (
        `Таблица "${t}"\n` +
        cols.map(c => `  ${c.c.padEnd(12)} ${c.ty.padEnd(24)} ${c.nul ? '' : 'not null'}${c.def ? ' default ' + c.def : ''}`).join('\n') +
        (ix.length
          ? '\nИндексы:\n' +
            ix.map(i => `    "${i.indexname}" ${i.indexdef.replace(/^.*USING /, '').replace(/^btree /, 'btree ')}`).join('\n')
          : '') +
        (cs.length ? '\nОграничения:\n' + cs.map(c => `    "${c.name}" ${c.def}`).join('\n') : '')
      );
    });
  }
  async function runMeta(sql) {
    const info = {kind: 'META'};
    const [cmd, ...args] = sql.trim().split(/\s+/);
    let out = '';
    try {
      if (cmd === '\\c' || cmd === '\\connect') {
        // \c [база] [роль]: в браузере база одна — меняется только роль
        const role = (args[1] || (args[0] && args[0] !== '-' && /_reader|_role|^s\d/.test(args[0]) ? args[0] : '') || '').toLowerCase();
        if (role && role !== 'postgres' && role !== '-') {
          await db.query('RESET ROLE');
          const ok = (await q(`SELECT rolcanlogin FROM pg_roles WHERE rolname = '${role.replace(/'/g, "''")}'`)).rows[0];
          if (G.role) await db.query(`SET ROLE ${G.role}`);
          if (!ok) throw Object.assign(new Error(`role "${role}" does not exist`), {code: '42704'});
          if (!ok.rolcanlogin) throw Object.assign(new Error(`role "${role}" is not permitted to log in`), {code: '28000'});
          await db.query(`SET ROLE ${role}`);
          G.role = role;
        } else {
          await db.query('RESET ROLE');
          G.role = null;
        }
        out = `Вы подключены к базе данных "library" как пользователь "${G.role || 'postgres'}".`;
        info.tag = `\\c ${G.role || 'postgres'}`;
      } else if (cmd === '\\d' && args[0]) {
        out = (await metaDescribe(args[0].replace(/^\w+\./, '').toLowerCase())) || `Не найдено отношение "${args[0]}".`;
      } else if (cmd === '\\d' || cmd === '\\dt') {
        const r = await asAdmin(() =>
          q(`SELECT schemaname, tablename FROM pg_tables WHERE schemaname = ANY (current_schemas(false)) ORDER BY 1, 2`),
        );
        out = 'Список отношений\n' + r.rows.map(x => `  ${x.schemaname} | ${x.tablename} | таблица`).join('\n');
      } else if (cmd === '\\di') {
        const r = await asAdmin(() =>
          q(
            `SELECT indexname, tablename FROM pg_indexes WHERE schemaname = ANY (current_schemas(false)) ${args[0] ? `AND tablename = '${args[0].toLowerCase()}'` : ''} ORDER BY 2, 1`,
          ),
        );
        out = 'Список индексов\n' + r.rows.map(x => `  ${x.indexname.padEnd(22)} | ${x.tablename}`).join('\n');
      } else if (cmd === '\\dp' || cmd === '\\z') {
        const r = await asAdmin(() =>
          q(`SELECT table_name AS t, grantee AS g, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS p FROM information_schema.role_table_grants
             WHERE table_schema = ANY (current_schemas(false)) AND grantee <> 'postgres' GROUP BY 1, 2 ORDER BY 1, 2`),
        );
        out = 'Права доступа\n' + (r.rows.map(x => `  ${x.t.padEnd(8)} | ${x.g} = ${x.p}`).join('\n') || '  (прав, выданных ролям, нет)');
      } else if (cmd === '\\dn') {
        const r = await asAdmin(() => q(`SELECT nspname FROM pg_namespace WHERE nspname !~ '^(pg_|information_schema)' ORDER BY 1`));
        out = 'Список схем\n' + r.rows.map(x => '  ' + x.nspname).join('\n');
      } else if (cmd === '\\du') {
        const r = await asAdmin(() => q(`SELECT rolname, rolcanlogin FROM pg_roles WHERE rolname !~ '^pg_' ORDER BY 1`));
        out = 'Список ролей\n' + r.rows.map(x => `  ${x.rolname}${x.rolcanlogin ? '' : ' (без входа)'}`).join('\n');
      } else
        throw Object.assign(new Error(`неизвестная команда ${cmd}: здесь работают \\d, \\d таблица, \\di, \\dp, \\dn, \\du, \\c`), {
          code: 'META',
        });
    } catch (e) {
      robotErr();
      info.err = e;
      $('result').innerHTML =
        `<span class="bad">${esc(e.code === 'META' ? e.message : 'ERROR: ' + e.message)}</span><div class="ru">${esc(explain(e))}</div>`;
      SFX.err();
      journal(sql, 'ERROR ' + e.code);
      return info;
    }
    info.out = out;
    info.tag = info.tag || cmd;
    $('result').innerHTML = pre(out);
    journal(sql, info.tag);
    if (W.sync) await W.sync(await state(), true);
    return info;
  }

  // ═══════════════════════════ pg_dump и psql -f: копия схемы и восстановление ══
  // копия строится по каталогу: таблицы, ключи и ограничения, индексы, строки, права — как у pg_dump
  async function dumpSchema(sch) {
    const L1 = [];
    const Q = async s => (await db.query(s)).rows;
    const tabs = (
      await Q(
        `SELECT c.relname AS t, c.oid FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = '${sch}' AND c.relkind = 'r' ORDER BY c.oid`,
      )
    ).map(x => x.t);
    if (!tabs.length) throw Object.assign(new Error(`no matching schemas were found for pattern "${sch}"`), {code: 'DUMP'});
    L1.push('--', '-- PostgreSQL database dump', '--', '', `CREATE SCHEMA ${sch};`, '');
    for (const t of tabs) {
      const cols =
        await Q(`SELECT a.attname AS c, format_type(a.atttypid, a.atttypmod) AS ty, a.attnotnull AS nn, pg_get_expr(d.adbin, d.adrelid) AS def
        FROM pg_attribute a LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
        WHERE a.attrelid = '${sch}.${t}'::regclass AND a.attnum > 0 AND NOT a.attisdropped ORDER BY a.attnum`);
      L1.push(
        `CREATE TABLE ${sch}.${t} (`,
        cols.map(c => `    ${c.c} ${c.ty}${c.def ? ' DEFAULT ' + c.def : ''}${c.nn ? ' NOT NULL' : ''}`).join(',\n'),
        ');',
        '',
      );
    }
    for (const t of tabs) {
      const rows = await Q(`SELECT * FROM ${sch}.${t} ORDER BY 1`);
      if (!rows.length) continue;
      const cols = Object.keys(rows[0]);
      const v = x =>
        x === null
          ? 'NULL'
          : typeof x === 'number' || typeof x === 'boolean'
            ? String(x)
            : x instanceof Date
              ? `'${x.toISOString().slice(0, 10)}'`
              : `'${String(x).replace(/'/g, "''")}'`;
      L1.push(
        `INSERT INTO ${sch}.${t} (${cols.join(', ')}) VALUES`,
        rows.map(r => `(${cols.map(c => v(r[c])).join(', ')})`).join(',\n') + ';',
        '',
      );
    }
    // сначала первичные ключи и уникальность, потом внешние ключи и проверки
    const cons =
      await Q(`SELECT t.relname AS t, c.conname AS n, pg_get_constraintdef(c.oid) AS d, c.contype AS ty FROM pg_constraint c JOIN pg_class t ON t.oid = c.conrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace WHERE n.nspname = '${sch}' AND c.contype IN ('p', 'u', 'f', 'c') ORDER BY CASE c.contype WHEN 'p' THEN 0 WHEN 'u' THEN 1 ELSE 2 END, t.oid`);
    cons.forEach(c =>
      L1.push(`ALTER TABLE ONLY ${sch}.${c.t} ADD CONSTRAINT ${c.n} ${c.d.replace(/REFERENCES (\w+)\(/, `REFERENCES ${sch}.$1(`)};`),
    );
    const ix = await Q(
      `SELECT indexdef FROM pg_indexes i WHERE schemaname = '${sch}' AND NOT EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conname = i.indexname) ORDER BY indexname`,
    );
    if (ix.length) L1.push('', ...ix.map(i => i.indexdef + ';'));
    const gr = await Q(
      `SELECT grantee, table_name, string_agg(privilege_type, ', ') AS p FROM information_schema.role_table_grants WHERE table_schema = '${sch}' AND grantee <> 'postgres' GROUP BY 1, 2 ORDER BY 2`,
    );
    // права на отдельные столбцы — те, что не покрыты правом на всю таблицу
    const cg = await Q(
      `SELECT grantee, table_name, privilege_type AS p, string_agg(column_name, ', ' ORDER BY column_name) AS cols FROM information_schema.column_privileges cp
      WHERE table_schema = '${sch}' AND grantee <> 'postgres' AND NOT EXISTS (SELECT 1 FROM information_schema.role_table_grants t
      WHERE t.table_schema = cp.table_schema AND t.table_name = cp.table_name AND t.grantee = cp.grantee AND t.privilege_type = cp.privilege_type)
      GROUP BY 1, 2, 3 ORDER BY 2`,
    );
    const us = await Q(
      `SELECT r.rolname FROM pg_namespace n, pg_roles r WHERE n.nspname = '${sch}' AND r.rolname <> 'postgres' AND has_schema_privilege(r.oid, n.oid, 'USAGE') AND r.rolname !~ '^pg_'`,
    );
    if (gr.length || us.length || cg.length)
      L1.push(
        '',
        ...us.map(u => `GRANT USAGE ON SCHEMA ${sch} TO ${u.rolname};`),
        ...gr.map(g => `GRANT ${g.p} ON TABLE ${sch}.${g.table_name} TO ${g.grantee};`),
        ...cg.map(g => `GRANT ${g.p} (${g.cols}) ON TABLE ${sch}.${g.table_name} TO ${g.grantee};`),
      );
    L1.push('', '--', '-- PostgreSQL database dump complete', '--');
    return L1.join('\n') + '\n';
  }
  const optOf = (sql, o) => (new RegExp(`(?:^|\\s)-${o}\\s*(\\S+)`).exec(sql) || [])[1];
  async function runDump(sql) {
    const info = {kind: 'PG_DUMP'};
    const sch = (optOf(sql, 'n') || '').replace(/^"|"$/g, ''),
      file = optOf(sql, 'f');
    try {
      if (!sch) throw Object.assign(new Error('укажите схему: pg_dump … -n library -f копия.sql'), {code: 'DUMP'});
      const text = await asAdmin(() => dumpSchema(sch));
      if (file) {
        G.P.files = {...(G.P.files || {}), [file]: text};
        save();
      }
      info.tag = file ? `pg_dump → ${file}` : 'pg_dump';
      info.file = file;
      const n = text.split('\n').length;
      $('result').innerHTML =
        `<span class="ok">${file ? `pg_dump: копия схемы ${esc(sch)} записана в файл ${esc(file)} — ${n} строк` : 'pg_dump: копия выведена на экран'}</span>
        <details class="dump"${file ? '' : ' open'}><summary>Открыть ${esc(file || 'копию')} «в блокноте»</summary>${pre(text)}</details>`;
      journal(sql, info.tag);
      SFX.pop();
      if (W.backup) await W.backup(file || sch);
    } catch (e) {
      robotErr();
      info.err = e;
      $('result').innerHTML = `<span class="bad">pg_dump: error: ${esc(e.message)}</span>`;
      SFX.err();
      journal(sql, 'ERROR pg_dump');
    }
    return info;
  }
  async function runRestore(sql) {
    const info = {kind: 'PSQL'};
    const file = optOf(sql, 'f');
    const text = file && (G.P.files || {})[file];
    try {
      if (!file) throw Object.assign(new Error('укажите файл: psql … -f копия.sql'), {code: 'PSQL'});
      if (!text) throw Object.assign(new Error(`${file}: No such file or directory`), {code: 'PSQL'});
      await db.exec(text);
      info.tag = `psql -f ${file}`;
      const n = (text.match(/^INSERT INTO/gm) || []).length,
        c = (text.match(/^CREATE TABLE/gm) || []).length;
      $('result').innerHTML =
        `<span class="ok">CREATE SCHEMA · CREATE TABLE ×${c} · INSERT ×${n} · ALTER TABLE …</span><div class="ru">Схема восстановлена из файла ${esc(file)}.</div>`;
      journal(sql, info.tag);
      SFX.pop();
      await W.sync(await state(), true);
    } catch (e) {
      robotErr();
      info.err = e;
      $('result').innerHTML = `<span class="bad">psql: ${esc(e.code === 'PSQL' ? e.message : 'ERROR: ' + e.message)}</span>`;
      SFX.err();
      journal(sql, 'ERROR psql');
    }
    return info;
  }

  // отказ: «Key (passenger_id)=(17) is not present» — метки на строках, которые мешают
  async function showOffenders(t, e) {
    const m = /Key \((\w+)\)=\(([^)]*)\)/.exec(e.detail || '');
    if (!m || !TABLES[t]) return;
    const col = m[1],
      val = m[2];
    const ks = (await q(`SELECT ${TABLES[t]} FROM ${t} WHERE ${col}::text = '${val.replace(/'/g, "''")}'`, true)).rows.map(r =>
      String(r[0]),
    );
    ks.forEach(k => W.chip(t, k, 'del', e.code === '23503' ? 'нет пары' : 'повтор'));
    if (ks.length) {
      const loc = W.locate(t, {[TABLES[t]]: ks[0], tag: ks[0], id: +ks[0], tier: ks[0]});
      W.focus(loc.aim);
      await W.robotGo(loc.x, loc.z);
      W.face(loc.face);
      W.shake();
    }
  }
  async function constraints(t) {
    return (await q(CONS_SQL)).rows.filter(c => !t || c.tbl === t);
  }
  async function consHtml(t) {
    const cs = await constraints(t);
    return `<div class="ru">Ограничения ${esc(t)}: ${cs.map(c => `<b>${esc(c.name)}</b> ${esc(c.def)}`).join(' · ') || 'нет'}</div>`;
  }
  // \d: столбцы и ограничения каждой таблицы — по самой базе
  async function describeDb() {
    const cols = (
      await q(`SELECT table_name, column_name, data_type, character_maximum_length AS len, is_nullable, column_default, is_identity, identity_generation
        FROM information_schema.columns WHERE table_schema = ANY (current_schemas(false)) ORDER BY table_name, ordinal_position`)
    ).rows;
    const cs = await constraints();
    return Object.keys(TABLES)
      .map(t => {
        const cc = cols.filter(c => c.table_name === t),
          k = cs.filter(c => c.tbl === t);
        return `<div class="dt"><b>${t}</b><table>${cc
          .map(
            c =>
              `<tr><td>${c.column_name}</td><td>${c.data_type === 'character varying' ? `varchar(${c.len})` : c.data_type}${c.is_nullable === 'NO' ? ' not null' : ''}${c.is_identity === 'YES' ? ` <i>generated ${c.identity_generation.toLowerCase()} as identity</i>` : c.column_default ? ` default ${esc(c.column_default)}` : ''}</td></tr>`,
          )
          .join(
            '',
          )}</table><div class="dc">${k.map(c => `<div><b>${esc(c.name)}</b> ${esc(c.def)}</div>`).join('') || '<div class="none">ограничений нет</div>'}</div></div>`;
      })
      .join('');
  }
  // чего не хватает схеме на уровне 'schema'
  async function schemaMissing(lv) {
    const out = [];
    const cs = await constraints();
    for (const n of lv.need || []) {
      const c = cs.find(x => x.tbl === n.t && x.type === n.type && x.cols === n.cols && (!n.ref || x.ref === n.ref));
      if (!c) out.push(n.label || `${TYPE[n.type]} ${n.t} (${n.cols})`);
      else if (!c.name.startsWith(PREFIX[n.type]))
        out.push(
          `имя «${c.name}» не по правилу ${PREFIX[n.type]}…: ALTER TABLE ${n.t} DROP CONSTRAINT ${c.name}; и объявите заново с именем`,
        );
    }
    if (lv.identity) {
      const {t, col} = lv.identity;
      const r = (await q(`SELECT attidentity FROM pg_attribute WHERE attrelid = 'public.${t}'::regclass AND attname = '${col}'`)).rows[0];
      const g = r && r.attidentity;
      if (!g) out.push(`значение ${t}.${col} выдаёт не СУБД: ADD GENERATED ALWAYS AS IDENTITY`);
      else if (g !== 'a') out.push(`${t}.${col} — BY DEFAULT, а нужно ALWAYS: ключ руками не вводится вовсе`);
    }
    return out;
  }

  // ═════════════════════════════════════════════════ проверка уровня ══
  async function afterRun(info) {
    const lv = L[G.lv],
      rec = G.P.lv[lv.key];
    if (rec.done && !lv.final) return;
    const check = lv.check || (lv.ask ? 'select' : 'schema');
    // нужен отказ СУБД: перенести агрегат в WHERE и т. п.
    if (check === 'error') {
      if (!info.err) {
        if (info.kind === 'SELECT') verdict(null, lv.wait || 'Запрос выполнился — а нужно увидеть отказ СУБД.');
        return;
      }
      if (info.err.code === lv.code && (!lv.errMsg || lv.errMsg.test(info.err.message))) {
        rec.note = 'ERROR: ' + info.err.message;
        return success(lv, rec);
      }
      rec.fails++;
      save();
      verdict(false, lv.other || 'Это другой отказ — прочитайте сообщение СУБД и исправьте запрос так, как требует задание.');
      renderMission();
      return;
    }
    // транзакция: что делали и чем кончилось
    if (check === 'tx') {
      const st = G.tx === '!' ? null : await state();
      const tabs = lv.tables || []; // уровни на планы (EXPLAIN) данных не меняют — сверять нечего
      const j = st && G.target ? judge(st, G.target, G.start, tabs, TABLES) : null;
      const j0 = st ? judge(st, G.start, G.start, tabs, TABLES) : null;
      const v =
        (await lv.verify({
          trail: G.trail,
          tx: G.tx || '',
          st,
          atTarget: !!(j && j.ok),
          atStart: !!(j0 && j0.ok),
          wrong: j ? j.wrong : [],
          start: G.start,
          role: G.role || null,
          files: G.P.files || {},
          q: async sql => (G.tx === '!' ? [] : asAdmin(async () => (await db.query(sql)).rows)),
        })) || {};
      if (v.ok) {
        rec.note = v.note || G.trail.map(x => x.tag || x.kind + (x.code ? ' → ERROR ' + x.code : '')).join(' · ');
        return success(lv, rec);
      }
      if (v.fail) {
        if (G.tx) {
          try {
            await db.query('ROLLBACK');
          } catch (e) {
            /* нет транзакции */
          }
          G.tx = '';
          psql();
        }
        G.trail = [];
        return rollback(rec, v.fail + (j && j.wrong.length ? ' ' + describe(j.wrong, 2).join(' ') : ''));
      }
      if (v.wait) verdict(null, v.wait);
      renderMission();
      return;
    }
    if (check === 'select' || check === 'cross') {
      if (info.kind !== 'SELECT') return;
      if (info.err) {
        rec.fails++;
        save();
        renderMission();
        return;
      }
      if (check === 'cross') {
        const p = info.p;
        const counts = await Promise.all(p.tables.map(x => q(`SELECT count(*)::int AS n FROM ${x.t}`).then(r => r.rows[0].n)));
        const prod = counts.reduce((a, b) => a * b, 1);
        if (p.tables.length >= 2 && info.res.rows.length === prod) {
          rec.note = `${counts.join(' × ')} = ${prod} строк`;
          return success(lv, rec);
        }
        rec.fails++;
        save();
        return verdict(
          false,
          p.tables.length < 2
            ? 'Нужны две таблицы в FROM.'
            : `Строк ${info.res.rows.length}, а не ${counts.join(' × ')} = ${prod}: условие соединения всё ещё есть.`,
        );
      }
      const c = compareResult(info.res, G.expect, {order: lv.order, names: lv.names});
      const miss = c.ok && (lv.must || []).find(m => !m.re.test(info.p.sql));
      if (miss) {
        // ответ совпал, но записан не тем способом, который тренирует уровень
        verdict(false, `Ответ совпал, но ${miss.msg}`);
        renderMission();
        return;
      }
      if (c.ok && lv.minTables && info.p.tables.length < lv.minTables) {
        // ответ совпал, но без соединения: промахом не считаем, просим запрос по заданию
        verdict(
          false,
          `Ответ совпал, но вопрос — про соединение: в запросе ${info.p.tables.length} ${plural(info.p.tables.length, 'таблица', 'таблицы', 'таблиц')}, а нужно ${lv.minTables}. Соберите ответ через JOIN, как в задании.`,
        );
        renderMission();
        return;
      }
      if (c.ok) {
        rec.note = `получено строк: ${info.res.rows.length}`;
        return success(lv, rec);
      }
      rec.fails++;
      save();
      const lh = lv.ask ? layoutHint(info.p.sql, lv.ask) : '';
      verdict(false, c.msg + (lh ? ' ' + lh : ''));
      renderMission();
      return;
    }
    // доводка схемы: отказ СУБД и запросы-«разведка» — обычные шаги, не промахи
    if (info.err || info.kind === 'SELECT') return;
    const miss = await schemaMissing(lv);
    const j = lv.tables ? judge(await state(), G.target, G.start, lv.tables, TABLES) : {wrong: [], pending: []};
    if (j.wrong.length)
      return rollback(rec, 'Данные изменились не так, как нужно. ' + (keyHint(j.wrong, j.pending) || describe(j.wrong).join(' ')));
    if (!miss.length && !j.pending.length) {
      const cs = await constraints();
      rec.note = (lv.need || []).map(n => (cs.find(x => x.tbl === n.t && x.type === n.type && x.cols === n.cols) || {}).name).join(', ');
      return success(lv, rec);
    }
    verdict(
      null,
      'Принято. Осталось: ' + [...miss, ...(j.pending.length ? [`исправить строк: ${j.pending.length}`] : [])].join('; ') + '.',
    );
    renderMission();
  }

  // ═════════════════════════════════════════════════════ уровни ══
  function renderMission() {
    const lv = L[G.lv],
      rec = G.P.lv[lv.key] || {};
    const ncmd =
      lv.cmds ||
      (lv.ask || lv.check === 'cross'
        ? 'Ответ — один запрос SELECT (заглянуть в таблицы можно и другими SELECT)'
        : 'Несколько команд — по одной или через ;');
    $('mission').innerHTML = `${levelTag(lv)}
      <h1>${esc(lv.title)}</h1><div class="lab">${esc(lv.lab)}</div>
      <p>${esc(lv.text)}</p>
      ${lv.q ? `<div class="askq"><span>Вопрос</span>${esc(lv.q)}</div>` : ''}
      <ul>${lv.goals.map(g => `<li class="${rec.done ? 'done' : ''}">${esc(g)}</li>`).join('')}</ul>
      ${lv.doc ? `<div class="docw">${lv.doc}</div>` : ''}
      <div class="ncmd">${esc(ncmd)}</div>
      ${missionButtons(lv, rec, 2)}
      <details class="dbd" id="dbd"><summary>🔎 Структура базы (\\d) — по самой базе</summary><div id="dbdIn">…</div></details>
      <div class="hint">${tablesHint}</div>`;
    bindMissionButtons(lv, rec);
    $('dbd').ontoggle = async () => {
      if ($('dbd').open)
        $('dbdIn').innerHTML =
          G.tx === '!' ? 'Транзакция прервана ошибкой — сначала ROLLBACK.' : await describeDb().catch(e => esc(e.message));
    };
  }
  async function startLevel(i) {
    if (!unlocked(i)) return;
    setRunning(true);
    G.lv = i;
    const lv = L[i];
    $('verdict').innerHTML = '';
    $('result').innerHTML = '';
    renderLevels();
    renderMission();
    G.role = null; // до перезагрузки базы: иначе снимок состояния снова включит роль прошлого уровня
    await prepareLevel(i); // база заново — открытая транзакция откатывается, роль сбрасывается
    G.tx = '';
    G.trail = [];
    G.subs = [];
    psql();
    G.expect = lv.ask ? await result(lv.ask) : null;
    G.t0 = new Date().toISOString().slice(11, 19);
    W.resetRoot();
    W.clearConfetti();
    W.clearLinks();
    W.build(await state(), G.seed, D.meta);
    await refreshCatalog();
    W.home();
    (lv.say || []).forEach(s => W.say(s.id, s.t));
    G.P.cur = i;
    save();
    report('level', {lv: i + 1, key: lv.key});
    setRunning(false);
    $('sql').focus();
  }
  // щелчок по объекту сцены — строка таблицы
  async function pick(p) {
    if (G && G.tx === '!') return; // прерванная транзакция: СУБД ничего не покажет до ROLLBACK
    if (p.t === 'flight') {
      const rs = (await q('SELECT flight_no, dest FROM flight ORDER BY flight_no')).rows;
      W.showCard(
        'flight',
        '*',
        `<div class="rc-h">flight · ${rs.length} ${plural(rs.length, 'строка', 'строки', 'строк')}</div>${rs.map(r => `<div><b>${esc(r.flight_no)}</b> <span>${esc(r.dest)}</span></div>`).join('') || '<div><span>таблица пуста</span></div>'}`,
        'info',
      );
      return;
    }
    const r = (await db.query(`SELECT ${COLS[p.t].join(', ')} FROM ${p.t} WHERE ${TABLES[p.t]}::text = $1`, [String(p.k)])).rows[0];
    if (!r) return;
    W.showCard(
      p.t,
      String(p.k),
      `<div class="rc-h">${p.t} · строка</div>${COLS[p.t].map(c => `<div><span>${c}</span><b>${esc(shown(r[c]))}</b></div>`).join('')}`,
      'info',
    );
  }
  return {run, startLevel, renderMission, pick, describeDb};
}
