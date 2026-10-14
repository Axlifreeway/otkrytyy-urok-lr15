// ЛР-13 · разбор команды пульта, проверка значений VALUES и пояснения к ошибкам СУБД (без DOM — проверяется тестами).
import {splitTop} from '../../common/sql.js';
import {TABLES} from './data.js';

// ════════════════════════════════════════════════════ разбор команды ══
// (…), (…) после VALUES → [{raw, vals}]
export function tuplesOf(s) {
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
export function parse(sql) {
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
export function lintVal(v) {
  if (!v) return 'Пустое значение между запятыми — пропущено значение или лишняя запятая.';
  if (/^'(?:[^']|'')*'$/.test(v) || /^-?\d+(\.\d+)?$/.test(v) || /^(null|default|true|false)$/i.test(v) || /^\(/.test(v) || /^\w+\s*\(/.test(v)) return null;
  if (/^".*"$/.test(v)) return `Значение ${v} в двойных кавычках. В SQL двойные кавычки — для имён столбцов, а текст пишется в одинарных: '${v.slice(1, -1)}'.`;
  if (/[‘’«»“”`]/.test(v)) return `В ${v} не те кавычки. Нужна прямая одинарная кавычка ' (в английской раскладке — клавиша Э).`;
  if (/^'/.test(v) || /'$/.test(v)) return `В ${v} кавычка только с одной стороны — нужна и в начале, и в конце.`;
  return `Значение ${v} без кавычек. Текст, время и номера вроде 3A или ИИ-750 пишутся в одинарных кавычках: '${v}'. Без кавычек пишутся только числа, NULL и DEFAULT.`;
}
export function litVal(raw) {
  const v = raw.trim(); let m;
  if ((m = /^'((?:[^']|'')*)'$/.exec(v))) return m[1].replace(/''/g, "'");
  if (/^null$/i.test(v)) return null;
  if (/^default$/i.test(v)) return undefined;
  if (/^-?\d+$/.test(v)) return +v;
  return v;
}
const COLOF = {ck_baggage_weight: 'weight_kg', ck_seat_no: 'seat_no', ck_seat_cls: 'cls', ck_passenger_birth: 'birth_year', ck_passenger_meal: 'meal',
  fk_passenger_flight: 'flight_no', fk_passenger_seat: 'seat_no', fk_baggage_passenger: 'passenger_id', uq_passenger_seat: 'seat_no'};
export const badCol = (e, t) => e.column || COLOF[e.constraint] || (/_pkey$/.test(e.constraint || '') ? TABLES[t] : null);
export function explain(e) {
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
