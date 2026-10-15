// Лабы на запросы (ЛР-15 SELECT, ЛР-16 JOIN): выполнение команд пульта, показ отбора и соединения в сцене, проверка уровня.
// Сцена — салон ЛР-14 (пассажиры, багаж на полках, таблички программ, табло рейсов).
// Виды уровней: lv.ask — эталонный запрос (ответ сверяется с результатом студента);
// lv.check 'schema' — доводка схемы (ограничения lv.need, автогенерация lv.identity, данные — по эталону lv.ref);
// lv.check 'cross' — соединение без условия: строк должно быть произведение.
import {$, esc, plural} from './util.js';
import {statements} from './sql.js';
import {SFX} from './sfx.js';
import {judge, describe, keyHint} from './judge.js';
import {parseSelect, compareResult, kindOf, shown} from './select.js';
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
      return 'Такого ограничения нет — проверьте имя в «Структуре базы».';
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
      return 'Столбец нужно либо перечислить в GROUP BY, либо обернуть в агрегатную функцию.';
    default:
      return '';
  }
}

// каталог: ограничения таблицы и автогенерация ключа
const CONS_SQL = `SELECT c.conname AS name, c.contype AS type, t.relname AS tbl, r.relname AS ref,
  (SELECT string_agg(a.attname, ',' ORDER BY a.attnum) FROM pg_attribute a WHERE a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)) AS cols,
  pg_get_constraintdef(c.oid) AS def
FROM pg_constraint c JOIN pg_class t ON t.oid = c.conrelid JOIN pg_namespace n ON n.oid = t.relnamespace
LEFT JOIN pg_class r ON r.oid = c.confrelid WHERE n.nspname = 'public' AND c.contype <> 'n' ORDER BY t.relname, c.contype, c.conname`;
const TYPE = {p: 'PRIMARY KEY', f: 'FOREIGN KEY', u: 'UNIQUE', c: 'CHECK'};
const PREFIX = {p: 'pk_', f: 'fk_', u: 'uq_', c: 'ck_'};

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
    const st = statements(all);
    if (!st.length) return;
    pushHist(all);
    const lv = L[G.lv];
    $('verdict').innerHTML = '';
    const allow = lv.allow || ['SELECT'];
    for (let i = 0; i < st.length; i++) {
      const k = kindOf(st[i]);
      let msg = '';
      if (!allow.includes(k))
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
    const kind = kindOf(sql);
    return kind === 'SELECT' ? runSelect(sql) : runChange(sql, kind);
  }

  // ═════════════════════════════════════════════ SELECT: показ и ответ ══
  const known = p => p.tables.length && p.tables.every(x => TABLES[x.t]);
  async function runSelect(sql) {
    const p = parseSelect(sql);
    const info = {kind: 'SELECT', p};
    try {
      if (known(p) && p.tables.length === 1) await showScan(p);
      else if (known(p)) await showJoin(p);
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
    if (known(p) && p.tables.length === 1 && (p.order || p.limit != null)) await numberRows(p).catch(() => {});
    $('result').innerHTML = `<span class="ok">${esc(tag)}</span>${table(res)}`;
    journal(sql, tag);
    await W.robotGo(W.HOME.x, 0);
    W.face(-Math.PI / 2);
    W.camS.follow = false;
    return info;
  }
  const colsIn = (t, w) => (w ? COLS[t].filter(c => new RegExp('\\b' + c + '\\b', 'i').test(w)) : []);
  // условие с подставленными значениями строки: «birth_year >= 2012» → «2015 >= 2012»
  const subst = (t, w, row) =>
    w.replace(/'(?:[^']|'')*'|\b(?:\w+\.)?[a-z_]+\b/gi, x => {
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
      `<span class="k">${G.stmtTag || ''}${esc(`SELECT … FROM ${t}`)}</span><span class="w">${p.where ? 'WHERE ' + esc(p.where) : 'без WHERE — подходит каждая строка'}</span>`,
    );
    W.camS.follow = true;
    const wcols = colsIn(t, p.where);
    let done = 0,
      yes = 0;
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
      if (v === true) yes++;
      hud(done, yes, rows.length, 'проверено', 'в ответ');
    }
    W.beamOff();
    W.fadeNo();
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
  }

  // ═══════════════════════════════════ ALTER, INSERT, UPDATE, DELETE ══
  const tableOf = sql =>
    ((/^\s*(?:alter\s+table|insert\s+into|update|delete\s+from)\s+(?:only\s+)?(\w+)/i.exec(sql) || [])[1] || '').toLowerCase();
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
    const tag = kind === 'ALTER' ? 'ALTER TABLE' : kind === 'INSERT' ? `INSERT 0 ${info.n}` : `${kind} ${info.n}`;
    $('result').innerHTML = `<span class="ok">${esc(tag)}</span>${kind === 'ALTER' && TABLES[t] ? await consHtml(t) : ''}`;
    journal(sql, tag);
    SFX.pop();
    await W.sync(await state(), true);
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
        FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position`)
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
      const c = compareResult(info.res, G.expect, {order: lv.order});
      if (c.ok) {
        rec.note = `получено строк: ${info.res.rows.length}`;
        return success(lv, rec);
      }
      rec.fails++;
      save();
      verdict(false, c.msg);
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
      if ($('dbd').open) $('dbdIn').innerHTML = await describeDb();
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
    await prepareLevel(i);
    G.expect = lv.ask ? await result(lv.ask) : null;
    G.t0 = new Date().toISOString().slice(11, 19);
    W.resetRoot();
    W.clearConfetti();
    W.clearLinks();
    W.build(await state(), G.seed, D.meta);
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
