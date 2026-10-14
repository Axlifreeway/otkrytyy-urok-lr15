// Подсветка SQL в пульте (как в pgAdmin): ключевые слова — жёлтым, только если набраны верно;
// строки, числа, комментарии, имена таблиц — своими цветами; место ошибки — красной волной.
// Под прозрачным textarea лежит <pre> с тем же текстом и шрифтом; прокрутка синхронизируется.
import {esc} from './util.js';

const KEYWORDS = new Set(('select from where insert into values update set delete and or not null is in like ilike between order by asc desc ' +
  'limit offset default true false count distinct as join inner left right full outer on group having union all exists any case when then ' +
  'else end returning sum avg min max coalesce cascade begin commit rollback create table drop alter primary key references check unique').split(' '));
const TOKEN = /(--[^\n]*)|('(?:[^']|'')*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-zА-Яа-яЁё_][\wА-Яа-яЁё]*)|([\s\S])/g;

export function highlight(text, tables = [], mark = null) {
  let html = '', m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text))) {
    const [tok, com, str, num, word] = m, at = m.index;
    let cls = com ? 'c' : str ? 's' : num ? 'n' : word && KEYWORDS.has(word.toLowerCase()) ? 'k' : word && tables.includes(word.toLowerCase()) ? 't' : '';
    if (mark && at < mark.to && at + tok.length > mark.from) cls += ' err';
    html += cls ? `<span class="${cls.trim()}">${esc(tok)}</span>` : esc(tok);
  }
  return html + '\n';                                     // последняя пустая строка тоже должна иметь высоту
}

// где в тексте пульта ошибка: слово из сообщения СУБД («at or near "X"», «column "X"», «"X"» в пояснении)
export function errorSpan(text, err) {
  const msg = typeof err === 'string' ? err : `${err.message || ''}`;
  const m = /at or near "([^"]+)"/.exec(msg) || /(?:column|relation|table) "([^"]+)"/.exec(msg) || /: "([^"]+)"/.exec(msg) || /^Значение (\S+)/.exec(msg) || /^В (\S+) /.exec(msg) || /Таблицы (\S+) нет/.exec(msg) || /^(?:Строка \d+: )?Значение (\S+)/.exec(msg);
  let word = m ? m[1].replace(/[.,;:]+$/, '') : null;
  if (!word && typeof err === 'string') word = err;
  if (!word) return null;
  const re = new RegExp(`(^|[^\\wА-Яа-яЁё])(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![\\wА-Яа-яЁё])`, 'i');
  const f = re.exec(text);
  if (!f) return null;
  const from = f.index + f[1].length;
  return {from, to: from + f[2].length};
}

// подключить подсветку к textarea; возвращает {mark(err), clear(), refresh()}
export function attachHighlight(ta, tables) {
  const wrap = document.createElement('div');
  wrap.className = 'sqlwrap';
  ta.parentNode.insertBefore(wrap, ta);
  const pre = document.createElement('pre');
  pre.className = 'sqlhl'; pre.setAttribute('aria-hidden', 'true');
  wrap.append(pre, ta);
  let mark = null;
  const draw = () => { pre.innerHTML = highlight(ta.value, tables, mark); pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; };
  ta.addEventListener('input', () => { mark = null; draw(); });
  ta.addEventListener('scroll', () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; });
  // значение могут поменять из кода (история, «Решение», сброс уровня) — следим за ним
  const desc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
  Object.defineProperty(ta, 'value', {get() { return desc.get.call(this); }, set(v) { desc.set.call(this, v); mark = null; draw(); }, configurable: true});
  draw();
  return {
    mark: err => { mark = err ? errorSpan(ta.value, err) : null; draw(); },
    clear: () => { mark = null; draw(); },
    refresh: draw,
  };
}
