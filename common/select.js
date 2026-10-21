// Запросы на выборку (ЛР-15, ЛР-16): разбор SELECT на части и сверка результата с ответом задания.
// Без DOM и базы — проверяется тестами (tests/select.test.mjs).
import {findTop, splitTop} from './sql.js';
import {lat} from './judge.js';

const norm = sql =>
  sql
    .replace(/--[^\n]*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/;\s*$/, '');
// первое слово команды: SELECT, ALTER, INSERT…
export const kindOf = sql => (/^\s*(\w+)/.exec(norm(sql)) || [])[1]?.toUpperCase() || '';

const RESERVED = new Set([
  'on',
  'join',
  'left',
  'right',
  'full',
  'inner',
  'outer',
  'cross',
  'where',
  'order',
  'group',
  'limit',
  'using',
  'natural',
]);

const AGG = /\b(count|sum|avg|min|max)\s*\(/i;
// подзапросы (SELECT …) в тексте условия — каждый со своим текстом, без внешних скобок
export function subqueries(s) {
  const out = [];
  if (!s) return out;
  let depth = 0,
    q = false,
    st = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === "'") {
        if (s[i + 1] === "'") i++;
        else q = false;
      }
      continue;
    }
    if (c === "'") q = true;
    else if (c === '(') {
      if (st < 0 && /^\(\s*select\b/i.test(s.slice(i, i + 12))) {
        st = i;
        depth = 0;
      }
      if (st >= 0) depth++;
    } else if (c === ')' && st >= 0 && --depth === 0) {
      out.push(s.slice(st + 1, i).trim());
      st = -1;
    }
  }
  return out;
}
// SELECT [DISTINCT] список FROM таблицы [WHERE …] [GROUP BY …] [HAVING …] [ORDER BY …] [LIMIT n]
export function parseSelect(sql) {
  const s = ' ' + norm(sql) + ' ';
  if (!/^ select\s/i.test(s)) return {err: 'Это не SELECT.'};
  const at = w => findTop(s, w);
  const from = at('from');
  if (from < 0) return {err: 'Нет FROM: из какой таблицы выбирать?'};
  const marks = [
    ['where', at('where')],
    ['group', at('group')],
    ['having', at('having')],
    ['order', at('order')],
    ['limit', at('limit')],
  ].filter(([, i]) => i > from);
  const end = k => {
    const i = marks.find(m => m[0] === k);
    if (!i) return null;
    const next = marks.filter(m => m[1] > i[1]).map(m => m[1]);
    return s.slice(i[1], next.length ? Math.min(...next) : s.length).trim();
  };
  const firstAfter = marks.length ? Math.min(...marks.map(m => m[1])) : s.length;
  let list = s.slice(8, from).trim();
  const distinct = /^distinct\s/i.test(list);
  if (distinct) list = list.slice(9).trim();
  const fromPart = s.slice(from + 5, firstAfter).trim();
  const strip = (x, re) => (x ? x.replace(re, '').trim() : null);
  const where = strip(end('where'), /^where\s+/i);
  const group = strip(end('group'), /^group\s+by\s+/i);
  const having = strip(end('having'), /^having\s+/i);
  const order = strip(end('order'), /^order\s+by\s+/i);
  const limitTxt = strip(end('limit'), /^limit\s+/i);
  const cols = splitTop(list, ',').map(c => c.trim());
  const star = cols.some(c => c === '*' || /^\w+\.\*$/.test(c));
  // таблицы и псевдонимы: FROM a x JOIN b y ON … LEFT JOIN c z ON … / FROM a, b
  const tables = [];
  const re = /(^|,|\b(?:(left|right|full|inner|cross)\s+(?:outer\s+)?)?join\b)\s*(\w+)(?:\s+(?:as\s+)?(\w+))?/gi;
  let m;
  const depth0 = i => {
    let d = 0;
    for (let k = 0; k < i; k++) d += fromPart[k] === '(' ? 1 : fromPart[k] === ')' ? -1 : 0;
    return d === 0;
  };
  while ((m = re.exec(fromPart))) {
    if (!depth0(m.index)) continue;
    const t = m[3].toLowerCase();
    if (RESERVED.has(t)) continue;
    let alias = m[4] && !RESERVED.has(m[4].toLowerCase()) ? m[4].toLowerCase() : null;
    if (!alias) re.lastIndex = m.index + m[0].length - (m[4] ? m[4].length : 0);
    const kind = !tables.length ? 'from' : m[1] === ',' ? 'comma' : (m[2] || 'inner').toLowerCase();
    tables.push({t, alias: alias || t, kind});
  }
  const joins = tables.slice(1);
  return {
    sql: norm(sql),
    distinct,
    cols,
    star,
    from: fromPart,
    tables,
    where,
    group,
    having,
    // в списке столбцов есть агрегатная функция: count(*), sum(…), avg(…), min(…), max(…)
    agg: cols.some(c => AGG.test(c.replace(/\(\s*select\b[\s\S]*\)/gi, ''))),
    order,
    limit: limitTxt != null ? parseInt(limitTxt, 10) : null,
    // соединение без условия: через запятую или CROSS JOIN, а условия связи нет и в WHERE
    cross: joins.some(j => j.kind === 'comma' || j.kind === 'cross') && !(where && /\w+\.\w+\s*=\s*\w+\.\w+/.test(where)),
    left: joins.some(j => j.kind === 'left'),
  };
}

// значение ячейки для сравнения: числа и строки одинаково, NULL отдельно
const cell = v => (v === null || v === undefined ? '∅' : v instanceof Date ? v.toISOString().slice(0, 10) : String(v));
export const shown = v => (v === null || v === undefined ? 'NULL' : cell(v));
const rowKey = r => JSON.stringify(r.map(cell));

// got, exp: {fields: [имена], rows: [[значения]]}; order — важен ли порядок строк:
// true — порядок всех строк, ['shelf', 'weight_kg'] — порядок по этим столбцам (равные значения могут идти в любом порядке);
// names — имена столбцов должны совпасть (вычисляемому столбцу нужно имя через AS)
export function compareResult(got, exp, {order = false, names = false} = {}) {
  const gf = got.fields.map(f => f.toLowerCase()),
    ef = exp.fields.map(f => f.toLowerCase());
  const n = got.rows.length,
    want = exp.rows.length;
  if (gf.length !== ef.length) {
    const miss = ef.filter(f => !gf.includes(f)),
      extra = gf.filter(f => !ef.includes(f));
    const parts = [];
    if (miss.length) parts.push(`не хватает: ${miss.join(', ')}`);
    if (extra.length) parts.push(`лишние: ${extra.join(', ')}`);
    return {
      ok: false,
      cols: true,
      msg: `В ответе ${gf.length} ${plural(gf.length, 'столбец', 'столбца', 'столбцов')}, а нужно ${ef.length}: ${ef.join(', ')}${parts.length ? ' (' + parts.join('; ') + ')' : ''}.`,
    };
  }
  // столбцы сопоставляются по имени, если все имена совпали, иначе — по порядку
  const idx = ef.map(f => gf.indexOf(f));
  const byName = idx.every(i => i >= 0) && new Set(idx).size === idx.length;
  if (names && !byName) {
    const miss = ef.filter(f => !gf.includes(f));
    return {
      ok: false,
      cols: true,
      msg: `Столбцы ответа называются ${gf.join(', ')}, а нужно ${ef.join(', ')}. Нет имени: ${miss.join(', ')} — дайте его через AS.`,
    };
  }
  const pick = r => (byName ? idx.map(i => r[i]) : r);
  const G = got.rows.map(r => rowKey(pick(r))),
    E = exp.rows.map(rowKey);
  // последовательность значений столбцов сортировки
  const oi = Array.isArray(order) ? order.map(f => ef.indexOf(f.toLowerCase())).filter(i => i >= 0) : null;
  const seq = (rows, map) => rows.map(r => rowKey(oi ? oi.map(i => map(r)[i]) : map(r)));
  const sameOrder = () => {
    const a = seq(got.rows, pick),
      b = seq(exp.rows, r => r);
    return a.length === b.length && a.every((k, i) => k === b[i]);
  };
  if (order && G.length === E.length && sameOrder() && (!oi || G.slice().sort().join() === E.slice().sort().join())) return {ok: true};
  const count = a => a.reduce((m, k) => m.set(k, (m.get(k) || 0) + 1), new Map());
  const cg = count(G),
    ce = count(E);
  const extra = [],
    miss = [];
  cg.forEach((c, k) => {
    for (let i = c - (ce.get(k) || 0); i > 0; i--) extra.push(k);
  });
  ce.forEach((c, k) => {
    for (let i = c - (cg.get(k) || 0); i > 0; i--) miss.push(k);
  });
  const show = k =>
    JSON.parse(k)
      .map(v => (v === '∅' ? 'NULL' : v))
      .join(' · ');
  if (!extra.length && !miss.length) {
    if (!order || sameOrder()) return {ok: true};
    return {ok: false, msg: 'Строки те же, но порядок другой — проверьте ORDER BY (по какому столбцу, по возрастанию или убыванию).'};
  }
  const parts = [`Получено строк: ${n}, а в ответе на вопрос их ${want}.`];
  if (extra.length) parts.push(`Лишние (${extra.length}): ${extra.slice(0, 3).map(show).join('; ')}${extra.length > 3 ? '; …' : ''}.`);
  if (miss.length) parts.push(`Не хватает (${miss.length}): ${miss.slice(0, 3).map(show).join('; ')}${miss.length > 3 ? '; …' : ''}.`);
  if (!byName && gf.join() !== ef.join()) parts.push(`Столбцы ответа: ${ef.join(', ')}.`);
  return {ok: false, msg: parts.join(' ')};
}
// буква в строковом значении набрана в другой раскладке: 'Е%' русская против 'E%' английской, '%А' против '%A'
const literals = sql => (String(sql).match(/'(?:[^']|'')*'/g) || []).map(x => x.slice(1, -1));
export function layoutHint(sql, ask) {
  const want = literals(ask);
  for (const s of literals(sql)) {
    const w = want.find(x => x !== s && lat(x) === lat(s));
    if (!w) continue;
    const i = [...s].findIndex((c, k) => c !== [...w][k]),
      ch = [...s][i];
    return `В значении '${s}' буква «${ch}» набрана в ${/[А-яЁё]/.test(ch) ? 'русской' : 'английской'} раскладке — на экране она такая же, но для базы это другой символ.`;
  }
  return '';
}
function plural(n, a, b, c) {
  const m = n % 10,
    h = n % 100;
  return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c;
}
