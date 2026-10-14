// ЛР-14 · разбор команды пульта и пояснения к ошибкам СУБД (без DOM — проверяется тестами).
import {splitTop, findTop} from '../../common/sql.js';
import {TABLES, COLS} from './data.js';

// ════════════════════════════════════════════════════ разбор команды ══
export function parse(sql) {
  const s = sql.replace(/--[^\n]*/g, ' ').replace(/\s+/g, ' ').trim().replace(/;\s*$/, '');
  if (!s) return null;
  let m;
  if ((m = /^update\s+(\w+)\s+set\s+([\s\S]+)$/i.exec(s))) {
    const t = m[1].toLowerCase();
    if (!TABLES[t]) return {err: `Таблицы ${m[1]} нет. Есть: ${Object.keys(TABLES).join(', ')}.`};
    // WHERE — первое вне скобок: в SET может быть подзапрос со своим WHERE
    const w = findTop(m[2], 'where');
    const setPart = w < 0 ? m[2] : m[2].slice(0, w), where = w < 0 ? null : m[2].slice(w + 7).trim() || null;
    const sets = splitTop(setPart, ',').map(x => { const k = /^\s*(\w+)\s*=\s*([\s\S]+)$/.exec(x); return k ? {col: k[1].toLowerCase(), expr: k[2].trim()} : null; });
    if (sets.some(x => !x)) return {err: 'Не разобрал SET: нужно «столбец = значение».'};
    return {kind: 'UPDATE', t, sql: s, sets, where};
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
export const colsIn = (t, w) => w ? COLS[t].filter(c => new RegExp('\\b' + c + '\\b', 'i').test(w)) : [];
export const fmt = v => v === null || v === undefined ? 'NULL' : String(v);
// условие с подставленными значениями строки: «birth_year >= 2012» → «2015 >= 2012»
export const subst = (t, w, row) => w.replace(/'(?:[^']|'')*'|\b[a-z_]+\b/gi, x => {
  const c = x.toLowerCase();
  if (x.startsWith("'") || !COLS[t].includes(c)) return x;
  return row[c] === null ? 'NULL' : typeof row[c] === 'string' ? "'" + row[c] + "'" : String(row[c]);
});
export const normW = w => (w || '').toLowerCase().replace(/\s+/g, ' ').replace(/\s*([=<>(),])\s*/g, '$1').trim();
export function explain(e) {
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
