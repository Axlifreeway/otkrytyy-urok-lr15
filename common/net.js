// Общий модуль лабораторных: события в панель преподавателя, учёт уходов со вкладки, защита пульта от вставки.
const API = '/api/ev';
const ctx = {lab: '', fio: '', grp: '', seed: null, client: '', demo: false};
let enabled = /^https?:$/.test(location.protocol), miss404 = 0;

export function clientId() {
  try {
    let c = localStorage.getItem('air-client');
    if (!c) { c = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); localStorage.setItem('air-client', c); }
    return c;
  } catch (e) { return 'nc' + Math.random().toString(36).slice(2, 10); }
}
export function setCtx(o) { Object.assign(ctx, o); }

// событие уходит «выстрелил и забыл»: если сервера нет, лаба работает как раньше
export function report(type, data = {}) {
  if (!enabled || ctx.demo) return;
  const body = JSON.stringify({...ctx, type, data, ts: Date.now()});
  try {
    fetch(API, {method: 'POST', headers: {'Content-Type': 'application/json'}, body, keepalive: body.length < 60000})
      .then(r => { if (r.status === 404 || r.status === 405) { if (++miss404 >= 3) enabled = false; } })
      .catch(() => { /* сеть — пропускаем */ });
  } catch (e) { /* нет fetch */ }
}

// уходы со вкладки/окна дольше 3 секунд
export function watchAway(onAway, getState) {
  let since = 0;
  const start = () => { if (!since) since = Date.now(); };
  const stop = () => {
    if (!since) return;
    const ms = Date.now() - since; since = 0;
    if (ms > 3000) { onAway(ms); report('away', {ms, ...getState()}); }
  };
  document.addEventListener('visibilitychange', () => (document.hidden ? start() : stop()));
  window.addEventListener('blur', start);
  window.addEventListener('focus', stop);
  setInterval(() => report('hb', {...getState(), hidden: document.hidden || !!since}), 20000);
}

// в пульт можно вставлять только то, что скопировано из него же (свои прошлые команды)
export function guardPaste(ta, onBlock) {
  const own = new Set();
  const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
  const remember = () => { const s = ta.value.substring(ta.selectionStart, ta.selectionEnd); if (s) own.add(norm(s)); };
  ta.addEventListener('copy', remember);
  ta.addEventListener('cut', remember);
  ta.addEventListener('paste', e => {
    const t = (e.clipboardData || window.clipboardData).getData('text') || '';
    const n = norm(t);
    if (n.length <= 3 || own.has(n) || [...own].some(o => o.includes(n))) return;
    e.preventDefault();
    onBlock(t.length);
    report('paste', {len: t.length, text: t.slice(0, 200)});
  });
  ta.addEventListener('drop', e => { e.preventDefault(); onBlock(0); });
  return {add: s => own.add(norm(s))};
}
