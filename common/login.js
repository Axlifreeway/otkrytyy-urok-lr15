// Вход студента: группа → фамилия (вписывает сам: списков группы сервер наружу не отдаёт) → PIN. Прогресс хранится на сервере, поэтому можно начать на паре и закончить дома.
// Если сервера нет (файл открыт с диска) — старый вход: ФИО, группа, номер в журнале.
import {esc, ls} from './util.js';
import {isTeacherCode} from './teacher.js';
import {clientId, fetchT} from './net.js';
async function api(path, body, headers = {}) {
  const r = await fetch(
    path,
    body ? {method: 'POST', headers: {'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)} : {headers},
  );
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.err || 'Ошибка ' + r.status), {status: r.status});
  return j;
}
export async function groupsAvailable() {
  if (!/^https?:$/.test(location.protocol)) return null;
  try {
    const r = await api('/api/groups');
    return r.groups && r.groups.length ? r.groups : null;
  } catch (e) {
    return null;
  }
}
export const session = {
  get: () => {
    try {
      return JSON.parse(ls('air-session') || 'null');
    } catch (e) {
      return null;
    }
  },
  set: s => ls('air-session', s ? JSON.stringify(s) : null),
};

// m — контейнер модального окна; head — заголовок и описание лабы (html); onGo({seed, fio, grp, sid, token, demo})
export async function loginScreen(m, {head, onGo, legacy}) {
  const groups = await groupsAvailable();
  if (!groups) return legacy();
  m.hidden = false;
  const saved = session.get();
  if (saved && saved.token) {
    m.innerHTML = `<div class="dlg panel start">${head}
      <div class="who"><span>Вы вошли как</span><b>${esc(saved.fio)}</b><span>${esc(saved.grp)}</span></div>
      <div class="btns"><button class="nextBtn" id="lgCont">Продолжить</button><button class="btn" id="lgOther">Это не я / сменить</button></div></div>`;
    m.querySelector('#lgCont').onclick = () => {
      m.hidden = true;
      onGo(saved);
    };
    m.querySelector('#lgOther').onclick = () => {
      session.set(null);
      loginScreen(m, {head, onGo, legacy});
    };
    return;
  }
  const lastG = ls('air-grp');
  m.innerHTML = `<div class="dlg panel start">${head}
    <div class="lg">
      <label>Группа<select id="lgG">${groups.map(g => `<option ${g === lastG ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></label>
      <label>Фамилия<input id="lgS" autocomplete="family-name" placeholder="например: Иванов" value="${esc(ls('air-name') || '')}"></label>
      <label>PIN<input id="lgP" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="4 цифры"></label>
    </div>
    <div id="lgNote" class="mu">Входите впервые — придумайте PIN из 4 цифр и запомните его: с ним вы продолжите дома или на другом компьютере.</div><div id="lgErr" class="bad"></div>
    <div class="btns"><button class="nextBtn" id="lgGo">Войти</button><button class="btn sm" id="lgT">Преподаватель</button></div>
    <div id="lgTeach" hidden class="lg"><label>Код<input id="lgCode" autocomplete="off"></label><label>Вариант<input id="lgSeed" value="0"></label><button class="btn" id="lgDemo">Демо</button></div></div>`;
  const $ = id => m.querySelector('#' + id);
  $('lgG').onchange = () => ls('air-grp', $('lgG').value);
  const go = async () => {
    $('lgErr').textContent = '';
    if (!$('lgS').value.trim()) {
      $('lgErr').textContent = 'Впишите свою фамилию.';
      $('lgS').focus();
      return;
    }
    if (!/^\d{4}$/.test($('lgP').value)) {
      $('lgErr').textContent = 'PIN — ровно 4 цифры.';
      $('lgP').focus();
      return;
    }
    try {
      const r = await api('/api/login', {grp: $('lgG').value, name: $('lgS').value, pin: $('lgP').value, dev: clientId()});
      const s = {token: r.token, sid: r.sid, fio: r.fio, grp: r.grp, seed: r.seed};
      session.set(s);
      ls('air-grp', r.grp);
      ls('air-name', $('lgS').value.trim());
      m.hidden = true;
      onGo(s);
    } catch (e) {
      $('lgErr').textContent = e.message;
    }
  };
  $('lgGo').onclick = go;
  $('lgP').onkeydown = e => {
    if (e.key === 'Enter') go();
  };
  $('lgT').onclick = () => {
    $('lgTeach').hidden = !$('lgTeach').hidden;
  };
  $('lgDemo').onclick = () => {
    if (!isTeacherCode($('lgCode').value)) {
      $('lgErr').textContent = 'Код не подошёл.';
      return;
    }
    m.hidden = true;
    onGo({seed: parseInt($('lgSeed').value, 10) || 0, fio: 'Преподаватель', grp: '', demo: true});
  };
}

// объединение прогресса с двух устройств (как на сервере): пройденное не теряется
export function mergeP(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  const out = {...a},
    lv = {...(a.lv || {})};
  Object.entries(b.lv || {}).forEach(([k, r]) => {
    const x = lv[k];
    if (!x || (r.done && !x.done) || (!!r.done === !!x.done && (r.runs || 0) > (x.runs || 0))) lv[k] = r;
  });
  out.lv = lv;
  out.pred = {...(b.pred || {}), ...(a.pred || {})};
  // одна и та же команда: время + первые 200 символов (на сервер команды уходят укороченными)
  const key = e => e.t + '|' + String(e.q || '').slice(0, 200);
  const ja = a.journal || [],
    seen = new Set(ja.map(key));
  out.journal = ja.concat((b.journal || []).filter(e => !seen.has(key(e)))).slice(-800);
  const ans = {...(a.answers || {})};
  Object.entries(b.answers || {}).forEach(([k, v]) => {
    if (v && String(v).length >= String(ans[k] || '').length) ans[k] = v;
  });
  out.answers = ans;
  ['lints', 'away', 'awayMs', 'pastes', 'cur', 'practice', 'sentAt'].forEach(k => {
    out[k] = Math.max(a[k] || 0, b[k] || 0);
  });
  out.fio = b.fio || a.fio || '';
  return out;
}

// синхронизация прогресса с сервером.
// На сервер уходит выжимка: последние 80 записей журнала и команды до 200 символов — чтобы запрос не упирался в лимит
// размера (nginx/сервер). Запросы идут по одному; изменилось, пока запрос был в пути, — следом уходит ещё один.
// Пока не дошло — повторяем. keepalive (до 64 КБ на все такие запросы страницы) — только при закрытии вкладки.
let sess = null,
  lab = '',
  timer = null,
  retry = null,
  tries = 0,
  last = null,
  ver = 0, // номер последнего изменения; сохранённое на сервере — sent
  sent = 0,
  busy = false,
  status = 'ok',
  onStatus = () => {};
const setStatus = st => onStatus((status = st));
export const syncStatus = () => status;
export const SYNC_JOURNAL = 80;
export function compact(P) {
  const j = (P.journal || []).slice(-SYNC_JOURNAL).map(e => ({...e, q: String(e.q || '').slice(0, 200)}));
  return {...P, journal: j};
}
export function syncInit(s, labName, statusCb) {
  sess = s && s.token ? s : null;
  lab = labName;
  onStatus = statusCb || (() => {});
  tries = 0;
  last = null;
  ver = sent = 0;
  busy = false;
  clearTimeout(timer);
  clearTimeout(retry);
  if (sess) setStatus('ok');
}
export async function pull() {
  if (!sess) return null;
  try {
    const r = await api(`/api/progress?lab=${lab}`, null, {'X-Labs-Token': sess.token});
    setStatus('ok');
    return r.data;
  } catch (e) {
    setStatus(e.status === 403 ? 'auth' : 'off');
    return null;
  }
}
function send(final) {
  if (!sess || !last || sent === ver) return;
  clearTimeout(retry);
  // закрытие вкладки не ждёт: уходит и параллельно идущему запросу (сервер объединяет, пройденное не теряется)
  if (busy && !final) return;
  const v = ver,
    s = sess,
    body = JSON.stringify({token: s.token, lab, data: compact(last)});
  busy = true;
  setStatus('wait');
  fetchT('/api/progress', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    keepalive: final && new Blob([body]).size < 60000, // предел keepalive — в байтах, а кириллица — по 2 байта
    body,
  })
    .then(r => {
      if (r.ok) {
        tries = 0;
        if (s === sess) sent = Math.max(sent, v);
        return;
      }
      if (r.status === 403) return 403; // вход устарел — повтор не поможет
      throw new Error(r.status);
    })
    .then(
      res => {
        busy = false;
        if (s !== sess) return;
        if (res === 403) return setStatus('auth');
        if (sent === ver) setStatus('ok');
        else send(false); // пока запрос был в пути, прогресс изменился
      },
      () => {
        busy = false;
        if (s !== sess) return;
        setStatus('off');
        tries++; // 3 с, 6 с, 12 с … не реже раза в минуту
        retry = setTimeout(() => send(false), Math.min(60000, 3000 * 2 ** Math.min(tries - 1, 5)));
      },
    );
}
export function push(P, now = false) {
  if (!sess) return;
  last = P;
  ver++;
  clearTimeout(timer);
  if (now) send(true);
  else timer = setTimeout(() => send(false), 1200);
}
// связь вернулась или студент вернулся на вкладку — дослать несохранённое
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => send(false));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && last) send(false);
  });
}
