// Разбор текста команд: разделение по ; и запятым вне кавычек и скобок, поиск ключевых слов верхнего уровня.

// делит s по символу sep, не заглядывая внутрь '…' и (…)
export function splitTop(s, sep) {
  const out = [];
  let depth = 0,
    q = false,
    cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      cur += c;
      if (c === "'") {
        if (s[i + 1] === "'") cur += s[++i];
        else q = false;
      }
      continue;
    }
    if (c === "'") {
      q = true;
      cur += c;
      continue;
    }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === sep && depth === 0) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}
// команды из текста пульта (комментарии -- убираются)
export const statements = sql =>
  splitTop(sql.replace(/--[^\n]*/g, ' '), ';')
    .map(x => x.trim())
    .filter(Boolean);

// позиция первого слова word вне кавычек и скобок (или -1): «WHERE» внутри подзапроса не считается
export function findTop(s, word) {
  const re = new RegExp(`^\\s${word}\\s`, 'i');
  let depth = 0,
    q = false;
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
    else if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (depth === 0 && re.test(s.slice(i, i + word.length + 2))) return i;
  }
  return -1;
}
