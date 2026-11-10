// Рабочее место «как в pgAdmin» для лаб по структуре базы (ЛР-21–24): вместо 3D-сцены — дерево объектов
// (Object Explorer), окно запросов с вкладками Data Output / Messages / Explain и графический план EXPLAIN.
// Ход лабы (common/qlab.js) и каркас (common/shell.js) те же, что у 3D-лаб: им отдаётся «мир» с тем же набором
// методов, только без анимаций. Дерево перечитывается из каталога после каждой команды — новый индекс,
// ограничение, столбец или роль появляются в нём сразу и на пару секунд подсвечиваются.
import {$, esc, sleep} from './util.js';
import {db, G} from './shell.js';

const SYS = `nspname !~ '^pg_' AND nspname <> 'information_schema'`;
const IC = {
  server: 'srv',
  dbs: 'grp',
  db: 'db',
  schemas: 'grp',
  schema: 'sch',
  tables: 'grp',
  table: 'tbl',
  cols: 'grp',
  col: 'col',
  cons: 'grp',
  pk: 'key',
  fk: 'fk',
  uq: 'uq',
  ck: 'ck',
  ixs: 'grp',
  ix: 'ix',
  roles: 'grp',
  role: 'role',
};
const CON = {p: 'pk', f: 'fk', u: 'uq', c: 'ck'};

// ════════════════════════════════════════════ дерево объектов ══
// Только системный каталог: его читает любая роль, поэтому роль студента (SET ROLE, \c в ЛР-24) не сбрасывается —
// иначе дерево, перечитанное между двумя командами, выполнило бы следующую команду не под той ролью.
async function readCatalog() {
  const q = async s => (await db.query(s)).rows;
  return {
    ver: (await q('SHOW server_version'))[0].server_version.split(' ')[0],
    schemas: (await q(`SELECT nspname AS s FROM pg_namespace WHERE ${SYS} ORDER BY 1`)).map(r => r.s),
    cols: await q(`SELECT n.nspname AS s, c.relname AS t, a.attname AS c, format_type(a.atttypid, a.atttypmod) AS ty, a.attnotnull AS nn
      FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'r' AND a.attnum > 0 AND NOT a.attisdropped AND ${SYS} ORDER BY 1, 2, a.attnum`),
    tabs: await q(`SELECT n.nspname AS s, c.relname AS t FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'r' AND ${SYS} ORDER BY 1, 2`),
    cons: await q(`SELECT n.nspname AS s, t.relname AS t, c.conname AS n, c.contype AS k FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE c.contype IN ('p', 'f', 'u', 'c') AND ${SYS} ORDER BY 1, 2, c.contype, 3`),
    ixs: await q(`SELECT schemaname AS s, tablename AS t, indexname AS i FROM pg_indexes
      WHERE schemaname !~ '^pg_' AND schemaname <> 'information_schema' ORDER BY 1, 2, 3`),
    roles: await q(`SELECT rolname AS r, rolcanlogin AS l FROM pg_roles WHERE rolname !~ '^pg_' ORDER BY 1`),
  };
}
// узел: {id, label, kind, note, kids}
function model(C, dbName) {
  const n = (id, label, kind, kids = null, note = '') => ({id, label, kind, kids, note});
  const grp = (id, label, kids) => n(id, `${label} (${kids.length})`, 'grp', kids);
  const schemas = C.schemas.map(s => {
    const tabs = C.tabs
      .filter(x => x.s === s)
      .map(({t}) => {
        const id = `t:${s}.${t}`;
        return n(id, t, 'table', [
          grp(
            id + '/cols',
            'Columns',
            C.cols
              .filter(c => c.s === s && c.t === t)
              .map(c => n(`${id}/cols/c:${c.c}`, c.c, 'col', null, c.ty + (c.nn ? ' not null' : ''))),
          ),
          grp(
            id + '/cons',
            'Constraints',
            C.cons.filter(c => c.s === s && c.t === t).map(c => n(`${id}/cons/k:${c.n}`, c.n, CON[c.k])),
          ),
          grp(
            id + '/ixs',
            'Indexes',
            C.ixs.filter(i => i.s === s && i.t === t).map(i => n(`${id}/ixs/i:${i.i}`, i.i, 'ix')),
          ),
        ]);
      });
    return n(`s:${s}`, s, 'schema', [grp(`s:${s}/tables`, 'Tables', tabs)]);
  });
  return [
    n('srv', `PostgreSQL ${C.ver}`, 'server', [
      grp('dbs', 'Databases', [n('db', dbName, 'db', [grp('schemas', 'Schemas', schemas)])]),
      grp(
        'roles',
        'Login/Group Roles',
        C.roles.map(r => n(`r:${r.r}`, r.r, 'role', null, r.l ? '' : 'no login')),
      ),
    ]),
  ];
}
const OPEN0 = ['srv', 'dbs', 'db', 'schemas', 's:library', 's:library/tables', 'roles'];

function tree(el, dbName) {
  const open = new Set(OPEN0);
  let known = null,
    fresh = new Set(),
    last = null;
  el.innerHTML = `<div class="pg-ph">Object Explorer<button class="pg-ib" id="pgTreeR" title="Обновить дерево">⟳</button></div><div class="pg-tree" id="pgTree"></div>`;
  const box = el.querySelector('#pgTree');
  const ids = (list, out = []) => {
    list.forEach(x => {
      out.push(x.id);
      if (x.kids) ids(x.kids, out);
    });
    return out;
  };
  const draw = () => {
    if (!last) return;
    const row = (x, d) => {
      const has = x.kids && x.kids.length,
        op = has && open.has(x.id);
      return `<div class="pg-n${fresh.has(x.id) ? ' new' : ''}" data-id="${esc(x.id)}" style="padding-left:${6 + d * 14}px"><i class="tw${has ? (op ? ' op' : ' cl') : ''}"></i><i class="ic ${IC[x.kind] || x.kind}"></i><span>${esc(x.label)}</span>${x.note ? `<em>${esc(x.note)}</em>` : ''}</div>${op ? x.kids.map(k => row(k, d + 1)).join('') : ''}`;
    };
    box.innerHTML = last.map(x => row(x, 0)).join('');
  };
  box.addEventListener('click', e => {
    const r = e.target.closest('.pg-n');
    if (!r) return;
    const id = r.dataset.id;
    open.has(id) ? open.delete(id) : open.add(id);
    draw();
  });
  let busy = null,
    again = false;
  async function refresh() {
    if (busy) {
      again = true;
      return busy;
    }
    busy = (async () => {
      do {
        again = false;
        if (!db || (G && G.tx === '!')) break; // прерванная транзакция: каталог не прочитать до ROLLBACK
        let C;
        try {
          C = await readCatalog();
        } catch (e) {
          break;
        }
        last = model(C, dbName);
        const now = ids(last);
        // новое с прошлого раза — подсветить и раскрыть путь к нему
        fresh = known ? new Set(now.filter(x => !known.has(x))) : new Set();
        fresh.forEach(id => {
          const parts = id.split('/');
          for (let i = 1; i < parts.length; i++) open.add(parts.slice(0, i).join('/'));
          const m = /^t:(\w+)\./.exec(id);
          if (m) ['srv', 'dbs', 'db', 'schemas', `s:${m[1]}`, `s:${m[1]}/tables`].forEach(x => open.add(x));
          if (id.startsWith('r:')) ['srv', 'roles'].forEach(x => open.add(x));
        });
        known = new Set(now);
        draw();
        if (fresh.size) {
          const f = fresh;
          setTimeout(() => {
            if (fresh === f) {
              fresh = new Set();
              draw();
            }
          }, 2600);
        }
      } while (again);
      busy = null;
    })();
    return busy;
  }
  el.querySelector('#pgTreeR').onclick = () => refresh();
  // новый уровень — база заново: подсвечивать «новое» нечего
  const reset = () => {
    known = null;
  };
  return {refresh, reset};
}

// ═════════════════════════════════════════ графический план ══
// строки EXPLAIN → дерево узлов: «->» и отступ задают вложенность, строки без «->» — подробности узла выше
export function parsePlan(text) {
  const root = {kids: [], info: [], depth: -1};
  const stack = [root],
    total = [];
  let planning = false; // «Planning:» и его Buffers — про планирование, а не про узел выше
  text.split('\n').forEach((l, i) => {
    if (!l.trim()) return;
    const arrow = l.indexOf('->');
    if (/^\s*(Planning|Execution) Time:/.test(l)) {
      planning = false;
      total.push(l.trim());
      return;
    }
    if (/^\s*Planning:/.test(l)) planning = true;
    if (planning) return;
    if (i === 0 || arrow >= 0) {
      const depth = i === 0 ? 0 : arrow + 1;
      const body = (arrow >= 0 ? l.slice(arrow + 2) : l).trim();
      const m =
        /^(.*?)\s+\(cost=([\d.]+)\.\.([\d.]+) rows=([\d.]+) width=\d+\)(?:\s+\(actual time=([\d.]+)\.\.([\d.]+) rows=([\d.]+) loops=(\d+)\))?/.exec(
          body,
        );
      const node = {
        title: m ? m[1] : body,
        cost: m ? +m[3] : null,
        est: m ? +m[4] : null,
        time: m && m[6] ? +m[6] : null,
        rows: m && m[7] ? +m[7] : null,
        loops: m && m[8] ? +m[8] : null,
        info: [],
        kids: [],
        depth,
      };
      while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
      stack[stack.length - 1].kids.push(node);
      stack.push(node);
    } else stack[stack.length - 1].info.push(l.trim());
  });
  return {nodes: root.kids, total};
}
const kindOf = t =>
  /Seq Scan/.test(t)
    ? 'seq'
    : /Bitmap/.test(t)
      ? 'bmp'
      : /Index Only Scan|Index Scan/.test(t)
        ? 'idx'
        : /Join|Nested Loop/.test(t)
          ? 'join'
          : /^Hash$/.test(t)
            ? 'hash'
            : /Sort/.test(t)
              ? 'sort'
              : /Aggregate|Group/.test(t)
                ? 'agg'
                : /Limit/.test(t)
                  ? 'lim'
                  : 'other';
// «Index Scan using pk_book on book b» → вид, индекс, таблица
const split = t => {
  const m = /^(.*?)(?:\s+using\s+(\w+))?(?:\s+on\s+(\w+)(?:\s+\w+)?)?$/.exec(t) || [];
  return {op: m[1] || t, index: m[2] || '', table: m[3] || ''};
};
const fmt = n => (n == null ? '—' : Math.round(n).toLocaleString('ru-RU'));
const ms = n => (n == null ? '—' : n < 0.01 ? '<0.01' : n < 10 ? n.toFixed(2).replace(/0$/, '') : n.toFixed(1));
// значок узла 52×52 (центр — 0,0): таблица, которую читают подряд; дерево индекса; соединение; сортировка…
function icon(k, d) {
  const b = `begin="${d}s"`;
  switch (k) {
    case 'seq':
      // строки таблицы и полоса, которая проходит их все по очереди
      return `<rect x="-15" y="-14" width="30" height="28" rx="2" class="ix-t"/>${[-7, 0, 7].map(y => `<line x1="-15" x2="15" y1="${y}" y2="${y}" class="ix-l"/>`).join('')}<rect x="-15" y="-14" width="30" height="7" class="ix-sw" opacity="0"><set attributeName="opacity" to=".55" ${b}/><animate attributeName="y" values="-14;-7;0;7;-14" keyTimes="0;.25;.5;.75;1" calcMode="discrete" dur="1.2s" ${b} repeatCount="indefinite"/></rect>`;
    case 'idx':
    case 'bmp':
      // дерево индекса: путь от корня к одному листу подсвечивается
      return `<line x1="0" y1="-11" x2="-10" y2="2" class="ix-l"/><line x1="0" y1="-11" x2="10" y2="2" class="ix-l"/><line x1="10" y1="2" x2="4" y2="13" class="ix-l"/><line x1="10" y1="2" x2="15" y2="13" class="ix-l"/><circle cx="0" cy="-12" r="4" class="ix-t"/><circle cx="-10" cy="2" r="3.5" class="ix-t"/><circle cx="10" cy="2" r="3.5" class="ix-t"/><circle cx="4" cy="13" r="3" class="ix-t"/><circle cx="15" cy="13" r="3" class="ix-t"/><path d="M0 -12 L10 2 L4 13" class="ix-hot" opacity="0"><animate attributeName="opacity" values="0;1;1;0" dur="1.6s" ${b} repeatCount="indefinite"/></path>${k === 'bmp' ? '<rect x="-17" y="8" width="12" height="8" class="ix-t"/>' : ''}`;
    case 'join':
      return `<text class="ix-g" y="9">⋈</text>`;
    case 'hash':
      return `<text class="ix-g" y="8">#</text>`;
    case 'sort':
      return [8, 16, 24].map((w, i) => `<rect x="-12" y="${-10 + i * 8}" width="${w}" height="5" rx="1" class="ix-f"/>`).join('');
    case 'agg':
      return `<text class="ix-g" y="9">Σ</text>`;
    case 'lim':
      return `<line x1="-12" x2="8" y1="0" y2="0" class="ix-l w"/><line x1="12" x2="12" y1="-10" y2="10" class="ix-l w"/>`;
    default:
      return `<circle r="9" class="ix-t"/>`;
  }
}
// План EXPLAIN схемой, как в pgAdmin: корень слева, источники строк справа. Узлы появляются от источников к корню,
// по стрелкам «текут» строки: толщина стрелки и число точек — сколько строк передано наверх.
export function planHtml(text) {
  const {nodes, total} = parsePlan(text);
  if (!nodes.length) return '';
  const all = [];
  let leaf = 0;
  const walk = (x, d) => {
    x.d = d;
    all.push(x);
    if (!x.kids.length) x.y = leaf++;
    else {
      x.kids.forEach(k => walk(k, d + 1));
      x.y = (x.kids[0].y + x.kids[x.kids.length - 1].y) / 2;
    }
    Object.assign(x, split(x.title));
    x.k = kindOf(x.op);
    x.out = x.rows != null ? x.rows * (x.loops || 1) : x.est;
    x.tot = x.time != null ? x.time * (x.loops || 1) : null;
    x.removed = +((x.info.map(s => /Rows Removed by (?:Filter|Index Recheck): (\d+)/.exec(s)).find(Boolean) || [])[1] || 0);
  };
  nodes.forEach(n => walk(n, 0));
  all.forEach(x => (x.self = x.tot == null ? null : Math.max(0, x.tot - x.kids.reduce((s, k) => s + (k.tot || 0), 0))));
  const sumSelf = all.reduce((s, x) => s + (x.self || 0), 0) || 1;
  const maxOut = Math.max(1, ...all.map(x => x.out || 0));
  const depth = Math.max(...all.map(x => x.d));
  const CW = 190,
    RH = 132,
    PX = 120,
    PY = 46;
  all.forEach(x => {
    x.cx = PX + x.d * CW;
    x.cy = PY + x.y * RH;
  });
  // порядок появления: сначала самые глубокие узлы (источники строк), последним — корень
  [...all].sort((a, b) => b.d - a.d || a.y - b.y).forEach((x, i) => (x.at = 0.15 + i * 0.4));
  const W = PX + depth * CW + 150,
    H = PY + Math.max(0, leaf - 1) * RH + 104;
  // стрелка: строки идут от узла-источника (x1) к узлу, который их принимает (x2)
  const edge = (x1, y1, x2, y2, r, at, end = '') => {
    const xm = (x1 + x2) / 2;
    const path = `M${x1} ${y1} C${xm} ${y1} ${xm} ${y2} ${x2} ${y2}`;
    const w = 1.5 + (6 * Math.log10(r + 1)) / Math.log10(maxOut + 1);
    const n = r ? Math.min(6, 1 + Math.round(Math.log10(r + 1) * 1.4)) : 0;
    const dur = 1.8;
    const dots = Array.from({length: n}, (_, i) => {
      const t = (at + (i * dur) / n).toFixed(2);
      return `<circle r="${Math.min(4.5, 2 + w / 3).toFixed(1)}" class="pgx-dot" visibility="hidden"><set attributeName="visibility" to="visible" begin="${t}s"/><animateMotion dur="${dur}s" begin="${t}s" repeatCount="indefinite" path="${path}"/></circle>`;
    }).join('');
    return `<g class="pgx-e${r ? '' : ' zero'}" style="--at:${at}s"><path d="${path}" pathLength="1" class="pgx-ln" style="stroke-width:${w.toFixed(1)}px"/><path d="M${x2 - 10} ${y2} l10 -5.5 v11z" class="pgx-ah"/><text x="${xm}" y="${(y1 + y2) / 2 - 7}" class="pgx-rn">${fmt(r)}</text>${end}${dots}</g>`;
  };
  const edges =
    all
      .filter(x => x.d > 0)
      .map(c => {
        const p = all.find(x => x.kids.includes(c));
        return edge(c.cx - 30, c.cy, p.cx + 38, p.cy, c.out || 0, c.at + 0.3);
      })
      .join('') +
    // корень отдаёт ответ клиенту
    nodes
      .map(x => edge(x.cx - 30, x.cy, 36, x.cy, x.out || 0, x.at + 0.3, `<text x="8" y="${x.cy + 4}" class="pgx-res">ответ</text>`))
      .join('');
  const tip = x => esc([x.title, ...x.info].join('\n'));
  const nodesSvg = all
    .map(x => {
      const share = x.self != null ? x.self / sumSelf : null;
      return `<g class="pgx-n ${x.k}" transform="translate(${x.cx} ${x.cy})" style="--at:${x.at}s"><title>${tip(x)}</title>
<g class="pgx-pop"><rect x="-26" y="-26" width="52" height="52" rx="8" class="pgx-box"/>${icon(x.k, x.at)}
${x.removed ? `<g class="pgx-rm" transform="translate(20 -24)"><rect x="-2" y="-9" width="${12 + String(fmt(x.removed)).length * 6.2}" height="15" rx="7"/><text x="4" y="2">−${fmt(x.removed)}</text></g>` : ''}</g>
<text y="44" class="pgx-op">${esc(x.op)}</text>${x.table || x.index ? `<text y="58" class="pgx-tb">${esc([x.table, x.index && 'по ' + x.index].filter(Boolean).join(' · '))}</text>` : ''}
${share != null ? `<rect x="-45" y="66" width="90" height="4" rx="2" class="pgx-tr"/><rect x="-45" y="66" width="${Math.max(2, 90 * share).toFixed(1)}" height="4" rx="2" class="pgx-tm${share > 0.5 ? ' hot' : ''}"/><text y="82" class="pgx-ms">${ms(x.self)} ms</text>` : ''}</g>`;
    })
    .join('');
  // таблица — в порядке плана: корень сверху, вложенные узлы с отступом
  const rows = all
    .map(x => {
      const share = x.self != null ? x.self / sumSelf : 0;
      return `<tr><td style="padding-left:${8 + x.d * 14}px"><i class="pgx-k ${x.k}"></i>${esc(x.op)}${x.table ? ` <span>${esc(x.table)}</span>` : ''}${x.index ? ` <span>по ${esc(x.index)}</span>` : ''}</td><td>${fmt(x.out)}</td><td>${fmt(x.est != null ? x.est * (x.loops || 1) : null)}</td><td class="pgx-bar" style="--w:${(share * 100).toFixed(1)}%">${ms(x.self)}</td><td class="${x.removed ? 'rm' : ''}">${x.removed ? fmt(x.removed) : ''}</td></tr>`;
    })
    .join('');
  const an = all.some(x => x.tot != null);
  return `<div class="pgx-bar0"><button class="btn sm" data-replay>↻ Повторить анимацию</button><button class="btn sm" data-big title="Развернуть план почти на весь экран (Esc — свернуть)">⤢ Крупно</button>${total.map(t => `<span>${esc(t)}</span>`).join('')}${an ? '' : '<span class="mu">без ANALYZE — числа строк по оценке планировщика, времени нет</span>'}</div>
<div class="pgx-wrap"><svg class="pgx" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="--w:${W}px;--h:${H}px">${edges}${nodesSvg}</svg></div>
<table class="pgx-t"><tr><th>Узел</th><th>Строк${an ? '' : ' (оценка)'}</th><th>План, строк</th><th>Своё время, ms</th><th>Отброшено фильтром</th></tr>${rows}</table>`;
}

// ═══════════════════════════ окно результата: Data Output / Messages / Explain ══
// common/qlab.js пишет ответ в #result (таблица .rtab, сообщения, план pre.plan) — раскладываем по вкладкам
function outputTabs() {
  const out = $('pgOut'),
    res = $('result'),
    plan = $('pgPlan'),
    st = $('pgStatus');
  const tabs = [...out.querySelectorAll('[data-tab]')];
  const show = t => {
    out.dataset.tab = t;
    tabs.forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  };
  tabs.forEach(b => (b.onclick = () => !b.disabled && show(b.dataset.tab)));
  let t0 = 0,
    lastPlan = '';
  // крупно: план поверх окна почти на весь экран; Esc, повторный щелчок или щелчок по фону — свернуть
  const big = on => {
    plan.classList.toggle('big', on);
    document.body.classList.toggle('pgx-big', on);
    const b = plan.querySelector('[data-big]');
    if (b) b.textContent = on ? '✕ Свернуть' : '⤢ Крупно';
  };
  plan.addEventListener('click', e => {
    if (e.target.closest('[data-replay]')) {
      plan.innerHTML = planHtml(lastPlan);
      big(plan.classList.contains('big'));
    } else if (e.target.closest('[data-big]')) big(!plan.classList.contains('big'));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && plan.classList.contains('big')) big(false);
  });
  document.addEventListener('mousedown', e => {
    if (plan.classList.contains('big') && !plan.contains(e.target)) big(false);
  });
  $('runBtn').addEventListener('click', () => (t0 = performance.now()), true);
  const sync = () => {
    const head = res.querySelector(':scope > .ok, :scope > .bad');
    const qp = head && head.classList.contains('ok') && head.textContent === 'QUERY PLAN' && res.querySelector(':scope > pre.plan');
    if (qp) qp.classList.add('qp');
    const grid = res.querySelector(':scope > .rtab');
    out.classList.toggle('has-data', !!(grid || qp));
    tabs.find(b => b.dataset.tab === 'plan').disabled = !qp;
    // наблюдатель срабатывает на каждую правку #result — схему рисуем заново, только если план другой
    const pt = qp ? qp.textContent : '';
    if (pt !== lastPlan) {
      lastPlan = pt;
      plan.innerHTML = pt ? planHtml(pt) : '';
      if (!pt) big(false);
      else big(plan.classList.contains('big'));
    }
    if (!res.childNodes.length) {
      st.textContent = '';
      st.className = '';
      return;
    }
    const bad = head && head.classList.contains('bad');
    const rows = grid ? grid.querySelectorAll('tr').length - 1 : 0;
    const ms = t0 ? Math.max(1, Math.round(performance.now() - t0)) : 0;
    st.className = bad ? 'bad' : 'ok';
    st.textContent = bad
      ? res.querySelector('.txstop')
        ? 'Транзакция прервана — выполните ROLLBACK (подробности во вкладке Messages)'
        : 'Ошибка — подробности во вкладке Messages'
      : (grid ? `Total rows: ${rows}` : head ? head.textContent.slice(0, 120) : 'Query returned successfully') +
        (ms ? ` · Query complete ${(ms / 1000).toFixed(3)} s` : '');
    show(bad ? 'msg' : qp ? 'plan' : grid ? 'data' : 'msg');
  };
  new MutationObserver(sync).observe(res, {childList: true, subtree: true});
  show('data');
  sync();
}

// номера строк редактора — как в pgAdmin; текст не переносится
function gutter() {
  const ta = $('sql'),
    g = $('pgGut');
  let n = 0;
  const draw = () => {
    const k = ta.value.split('\n').length;
    if (k !== n) {
      n = k;
      g.textContent = Array.from({length: k}, (_, i) => i + 1).join('\n');
    }
    g.scrollTop = ta.scrollTop;
  };
  ta.addEventListener('input', draw);
  ta.addEventListener('scroll', () => (g.scrollTop = ta.scrollTop));
  // значение меняют и из кода (история Ctrl+↑, «Решение», сброс): подсветка перерисовывается — по ней и следим
  const hl = ta.parentNode.querySelector('.sqlhl');
  if (hl) new MutationObserver(draw).observe(hl, {childList: true});
  draw();
}
// F5 — выполнить, как в pgAdmin (только когда курсор в редакторе: иначе F5 — обычное обновление страницы)
function keys() {
  $('sql').addEventListener('keydown', e => {
    if (e.key === 'F5') {
      e.preventDefault();
      $('runBtn').click();
    }
  });
}

// «мир» для common/shell.js и common/qlab.js: всё, что в 3D-лабах анимирует сцену, здесь ничего не делает
export function createPgWorld(el, {db: dbName = 'library'} = {}) {
  const T = tree(el, dbName);
  const later = () => setTimeout(() => T.refresh(), 0);
  let ready = false;
  const base = {
    speed: 99,
    quality: 'low',
    hooks: {},
    camS: {},
    HOME: {x: 0, z: 0},
    rScreen: {element: {style: {}}},
    locate: () => ({}),
    setSpeed() {},
    setQuality() {},
    build() {
      // первая постановка уровня — пульт уже собран (подсветка SQL подключается в boot после loadRobot)
      if (!ready) {
        ready = true;
        outputTabs();
        gutter();
        keys();
      }
      T.reset();
      later();
    },
    catalog() {
      later();
    },
    async sync() {},
    refresh: () => T.refresh(),
  };
  const nop = () => Promise.resolve();
  return new Proxy(base, {
    get: (o, k) => (k in o ? o[k] : k === 'then' ? undefined : nop),
    set: (o, k, v) => ((o[k] = v), true),
  });
}
export {sleep};
