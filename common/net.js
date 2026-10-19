// Общий модуль лабораторных: события в панель преподавателя, учёт уходов со вкладки, защита пульта от вставки.
const API = '/api/ev';
const ctx = {lab: '', fio: '', grp: '', seed: null, client: '', demo: false, token: ''}; // token — кто это, сервер узнаёт по нему
let enabled = typeof location !== 'undefined' && /^https?:$/.test(location.protocol),
  miss404 = 0,
  okOnce = false; // сервер хоть раз принял событие — значит, он есть, и 404 дальше — временный сбой

// запрос с пределом времени: зависший (сеть колледжа, прокси) иначе молча держит отправку навсегда
export async function fetchT(url, opt = {}, ms = 12000) {
  const ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const t = ac && setTimeout(() => ac.abort(), ms);
  try {
    return await fetch(url, ac ? {...opt, signal: ac.signal} : opt);
  } finally {
    clearTimeout(t);
  }
}

export function clientId() {
  try {
    let c = localStorage.getItem('air-client');
    if (!c) {
      c = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem('air-client', c);
    }
    return c;
  } catch (e) {
    return 'nc' + Math.random().toString(36).slice(2, 10);
  }
}
export function setCtx(o) {
  Object.assign(ctx, o);
}

// события копятся в очереди (и в localStorage — переживут перезагрузку) и уходят по одному, по порядку.
// Пропала связь — очередь ждёт и повторяет; вернулась — досылает, с настоящим временем каждого события.
// Если сервера нет совсем (лабы без панели), лаба работает как раньше.
const QKEY = 'air-evq',
  QMAX = 500;
let queue = [],
  sending = false,
  fails = 0,
  timer = 0;
try {
  queue = JSON.parse(localStorage.getItem(QKEY) || '[]');
  if (!Array.isArray(queue)) queue = [];
} catch (e) {
  queue = [];
}
const saveQ = () => {
  try {
    localStorage.setItem(QKEY, JSON.stringify(queue));
  } catch (e) {
    /* нет места — очередь останется в памяти */
  }
};
async function flush() {
  if (sending || !enabled || !queue.length) return;
  sending = true;
  clearTimeout(timer);
  while (queue.length) {
    const e = queue[0];
    let r = null;
    try {
      // age, а не время компьютера: часы на рабочих местах бывают сбиты
      r = await fetchT(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...e.b, age: Date.now() - e.ts}),
      });
    } catch (x) {
      /* сеть или предел времени */
    }
    const st = r ? r.status : 0;
    if (st === 200 || st === 400 || st === 403 || st === 413) {
      // принято — или повтор не поможет (неверное событие, вход устарел, лаба закрыта)
      if (st === 200) okOnce = true;
      const i = queue.indexOf(e);
      if (i >= 0) queue.splice(i, 1);
      fails = 0;
      saveQ();
      continue;
    }
    if ((st === 404 || st === 405) && !okOnce && ++miss404 >= 3) {
      enabled = false; // сервера событий здесь нет
      queue = [];
      saveQ();
      break;
    }
    fails++; // 2 с, 4 с … не реже раза в 30 с
    timer = setTimeout(flush, Math.min(30000, 2000 * 2 ** Math.min(fails - 1, 4)));
    break;
  }
  sending = false;
}
export function report(type, data = {}) {
  if (!enabled || ctx.demo) return;
  if (type === 'hb') queue = queue.filter((e, i) => e.b.type !== 'hb' || (sending && i === 0)); // пульс — нужен только последний
  queue.push({b: {...ctx, type, data}, ts: Date.now()});
  if (queue.length > QMAX) queue.splice(0, queue.length - QMAX);
  saveQ();
  flush();
}
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    fails = 0;
    flush();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) flush();
  });
}

// уходы со вкладки/окна дольше 3 секунд
export function watchAway(onAway, getState) {
  let since = 0;
  const start = () => {
    if (!since) since = Date.now();
  };
  const stop = () => {
    if (!since) return;
    const ms = Date.now() - since;
    since = 0;
    if (ms > 3000) {
      onAway(ms);
      report('away', {ms, ...getState()});
    }
  };
  document.addEventListener('visibilitychange', () => (document.hidden ? start() : stop()));
  window.addEventListener('blur', start);
  window.addEventListener('focus', stop);
  setInterval(() => report('hb', {...getState(), hidden: document.hidden || !!since}), 20000);
}

// в пульт можно вставлять только то, что скопировано из него же (свои прошлые команды)
export function guardPaste(ta, onBlock) {
  const own = new Set();
  const norm = s =>
    String(s || '')
      .replace(/\s+/g, ' ')
      .trim();
  const remember = () => {
    const s = ta.value.substring(ta.selectionStart, ta.selectionEnd);
    if (s) own.add(norm(s));
  };
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
  ta.addEventListener('drop', e => {
    e.preventDefault();
    onBlock(0);
  });
  return {add: s => own.add(norm(s))};
}
