// Вход студента: группа → фамилия → PIN. Прогресс хранится на сервере, поэтому можно начать на паре и закончить дома.
// Если сервера нет (файл открыт с диска) — старый вход: ФИО, группа, номер в журнале.
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k) || ''; if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return ''; } };
async function api(path, body, headers = {}) {
  const r = await fetch(path, body ? {method: 'POST', headers: {'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)} : {headers});
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.err || ('Ошибка ' + r.status)), {status: r.status});
  return j;
}
export async function groupsAvailable() {
  if (!/^https?:$/.test(location.protocol)) return null;
  try { const r = await api('/api/groups'); return r.groups && r.groups.length ? r.groups : null; } catch (e) { return null; }
}
export const session = {
  get: () => { try { return JSON.parse(ls('air-session') || 'null'); } catch (e) { return null; } },
  set: s => ls('air-session', s ? JSON.stringify(s) : null),
};

// m — контейнер модального окна; head — заголовок и описание лабы (html); onGo({seed, fio, grp, sid, token, demo})
export async function loginScreen(m, {head, teacherCode, onGo, legacy}) {
  const groups = await groupsAvailable();
  if (!groups) return legacy();
  m.hidden = false;
  const saved = session.get();
  if (saved && saved.token) {
    m.innerHTML = `<div class="dlg panel start">${head}
      <div class="who"><span>Вы вошли как</span><b>${esc(saved.fio)}</b><span>${esc(saved.grp)}</span></div>
      <div class="btns"><button class="nextBtn" id="lgCont">Продолжить</button><button class="btn" id="lgOther">Это не я / сменить</button></div></div>`;
    m.querySelector('#lgCont').onclick = () => { m.hidden = true; onGo(saved); };
    m.querySelector('#lgOther').onclick = () => { session.set(null); loginScreen(m, {head, teacherCode, onGo, legacy}); };
    return;
  }
  const lastG = ls('air-grp');
  m.innerHTML = `<div class="dlg panel start">${head}
    <div class="lg">
      <label>Группа<select id="lgG">${groups.map(g => `<option ${g === lastG ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></label>
      <label>Студент<select id="lgS"><option>…</option></select></label>
      <label>PIN<input id="lgP" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="4 цифры"></label>
    </div>
    <div id="lgNote" class="mu"></div><div id="lgErr" class="bad"></div>
    <div class="btns"><button class="nextBtn" id="lgGo">Войти</button><button class="btn sm" id="lgT">Преподаватель</button></div>
    <div id="lgTeach" hidden class="lg"><label>Код<input id="lgCode" autocomplete="off"></label><label>Вариант<input id="lgSeed" value="0"></label><button class="btn" id="lgDemo">Демо</button></div></div>`;
  const $ = id => m.querySelector('#' + id);
  let roster = [];
  const note = () => {
    const s = roster.find(x => String(x.id) === $('lgS').value);
    $('lgNote').textContent = !s ? '' : s.pin ? 'Введите свой PIN.' : 'Вы входите впервые: придумайте PIN из 4 цифр и запомните его — с ним вы продолжите дома или на другом компьютере.';
  };
  const loadRoster = async () => {
    $('lgS').innerHTML = '<option>загрузка…</option>';
    try { roster = (await api('/api/roster?grp=' + encodeURIComponent($('lgG').value))).students; } catch (e) { roster = []; }
    $('lgS').innerHTML = '<option value="">— выберите себя —</option>' + roster.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    note();
  };
  $('lgG').onchange = () => { ls('air-grp', $('lgG').value); loadRoster(); };
  $('lgS').onchange = note;
  const go = async () => {
    $('lgErr').textContent = '';
    if (!$('lgS').value) { $('lgErr').textContent = 'Выберите себя в списке.'; return; }
    if (!/^\d{4}$/.test($('lgP').value)) { $('lgErr').textContent = 'PIN — ровно 4 цифры.'; $('lgP').focus(); return; }
    try {
      const r = await api('/api/login', {id: +$('lgS').value, pin: $('lgP').value});
      const s = {token: r.token, sid: r.sid, fio: r.fio, grp: r.grp, seed: r.seed};
      session.set(s); ls('air-grp', r.grp);
      m.hidden = true; onGo(s);
    } catch (e) { $('lgErr').textContent = e.message; }
  };
  $('lgGo').onclick = go;
  $('lgP').onkeydown = e => { if (e.key === 'Enter') go(); };
  $('lgT').onclick = () => { $('lgTeach').hidden = !$('lgTeach').hidden; };
  $('lgDemo').onclick = () => {
    if ($('lgCode').value.trim() !== teacherCode) { $('lgErr').textContent = 'Код не подошёл.'; return; }
    m.hidden = true; onGo({seed: parseInt($('lgSeed').value, 10) || 0, fio: 'Преподаватель', grp: '', demo: true});
  };
  loadRoster();
}

// объединение прогресса с двух устройств (как на сервере): пройденное не теряется
export function mergeP(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  const out = {...a}, lv = {...(a.lv || {})};
  Object.entries(b.lv || {}).forEach(([k, r]) => {
    const x = lv[k];
    if (!x || (r.done && !x.done) || (!!r.done === !!x.done && (r.runs || 0) > (x.runs || 0))) lv[k] = r;
  });
  out.lv = lv;
  out.pred = {...(b.pred || {}), ...(a.pred || {})};
  const ja = a.journal || [], seen = new Set(ja.map(e => e.t + '|' + e.q));
  out.journal = ja.concat((b.journal || []).filter(e => !seen.has(e.t + '|' + e.q))).slice(-800);
  const ans = {...(a.answers || {})};
  Object.entries(b.answers || {}).forEach(([k, v]) => { if (v && String(v).length >= String(ans[k] || '').length) ans[k] = v; });
  out.answers = ans;
  ['lints', 'away', 'awayMs', 'pastes', 'cur'].forEach(k => { out[k] = Math.max(a[k] || 0, b[k] || 0); });
  out.fio = b.fio || a.fio || '';
  return out;
}

// синхронизация прогресса с сервером
let sess = null, lab = '', timer = null, onStatus = () => {};
export function syncInit(s, labName, statusCb) { sess = s && s.token ? s : null; lab = labName; onStatus = statusCb || (() => {}); if (sess) onStatus('ok'); }
export async function pull() {
  if (!sess) return null;
  try { const r = await api(`/api/progress?lab=${lab}`, null, {'X-Labs-Token': sess.token}); onStatus('ok'); return r.data; }
  catch (e) { onStatus(e.status === 403 ? 'auth' : 'off'); return null; }
}
export function push(P, now = false) {
  if (!sess) return;
  clearTimeout(timer);
  const go = () => {
    onStatus('wait');
    const body = JSON.stringify({token: sess.token, lab, data: P});
    fetch('/api/progress', {method: 'POST', headers: {'Content-Type': 'application/json'}, keepalive: body.length < 60000, body})
      .then(r => onStatus(r.ok ? 'ok' : r.status === 403 ? 'auth' : 'off')).catch(() => onStatus('off'));
  };
  if (now) go(); else timer = setTimeout(go, 1200);
}
