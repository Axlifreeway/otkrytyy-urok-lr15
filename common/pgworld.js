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
    : /Index Only Scan|Index Scan|Bitmap/.test(t)
      ? 'idx'
      : /Join|Nested Loop|Hash$/.test(t)
        ? 'join'
        : /Sort|Aggregate|Limit|Unique|Group/.test(t)
          ? 'op'
          : 'other';
export function planHtml(text) {
  const {nodes, total} = parsePlan(text);
  const card = x => {
    const [, op, rest] = /^(.*?)(?:\s+((?:using|on)\s.*))?$/.exec(x.title) || [0, x.title, ''];
    const nums = [
      x.rows != null ? `rows ${x.rows}${x.est != null ? ` <s>(план ${x.est})</s>` : ''}` : x.est != null ? `rows ≈ ${x.est}` : '',
      x.time != null ? `${x.time} ms` : '',
      x.cost != null ? `cost ${x.cost}` : '',
      x.loops > 1 ? `loops ${x.loops}` : '',
    ].filter(Boolean);
    const info = x.info.map(s => `<div class="${/Rows Removed/.test(s) ? 'rm' : ''}">${esc(s)}</div>`).join('');
    return `<li><div class="pn ${kindOf(op)}"><b>${esc(op)}</b>${rest ? ` <span>${esc(rest)}</span>` : ''}<div class="pm">${nums.join(' · ')}</div>${info ? `<div class="pi">${info}</div>` : ''}</div>${
      x.kids.length ? `<ul>${x.kids.map(card).join('')}</ul>` : ''
    }</li>`;
  };
  return `<ul class="ptree">${nodes.map(card).join('')}</ul>${total.length ? `<div class="ptot">${total.map(esc).join(' · ')}</div>` : ''}`;
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
  let t0 = 0;
  $('runBtn').addEventListener('click', () => (t0 = performance.now()), true);
  const sync = () => {
    const head = res.querySelector(':scope > .ok, :scope > .bad');
    const qp = head && head.classList.contains('ok') && head.textContent === 'QUERY PLAN' && res.querySelector(':scope > pre.plan');
    if (qp) qp.classList.add('qp');
    const grid = res.querySelector(':scope > .rtab');
    out.classList.toggle('has-data', !!(grid || qp));
    tabs.find(b => b.dataset.tab === 'plan').disabled = !qp;
    if (qp) plan.innerHTML = planHtml(qp.textContent);
    else plan.innerHTML = '';
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
      ? 'Ошибка — подробности во вкладке Messages'
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
