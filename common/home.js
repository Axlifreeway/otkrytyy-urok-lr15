// Общее для главных страниц (город, аэропорт, пиццерия): вход по группе и PIN, сессия, прогресс лаб, открытые лабы.
// Обычный скрипт без сборки: <script src="…/common/home.js"></script> → window.Home.
// Сессия та же, что в лабах (localStorage 'air-session'): вошёл на любой главной — лабы открываются уже «вошедшими».
(function () {
  const $ = id => document.getElementById(id);
  const esc = s =>
    String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
  const json = k => {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch (e) {
      return null;
    }
  };
  const online = /^https?:$/.test(location.protocol);
  const H = {
    $,
    esc,
    json,
    online,
    sess: json('air-session'),
    seed: json('air-seed'),
  };
  // где лежат сохранения лабы: с сервером — по номеру студента, без сервера — по номеру в журнале
  H.keyOf = f => (H.sess && H.sess.sid ? f.store + 's' + H.sess.sid : H.seed != null ? f.store + H.seed : null);
  H.starsOf = r => (!r || !r.done ? 0 : (r.fails || 0) === 0 ? 3 : r.fails <= 2 ? 2 : 1);
  // f: {store, levels: [ключи уровней]}; P — прогресс с сервера (если есть)
  H.progress = (f, P) => {
    P = P || (H.keyOf(f) && json(H.keyOf(f)));
    const lv = (P && P.lv) || {};
    return {P, done: f.levels.filter(k => (lv[k] || {}).done).length, stars: f.levels.reduce((s, k) => s + H.starsOf(lv[k]), 0), lv};
  };
  // прогресс с сервера: работа могла быть начата на другом компьютере; берём, если там пройдено не меньше
  H.pull = labs => {
    if (!(H.sess && H.sess.token && online)) return Promise.resolve({});
    return Promise.all(
      labs.map(f =>
        fetch(`/api/progress?lab=${f.lab}`, {headers: {'X-Labs-Token': H.sess.token}})
          .then(r => (r.ok ? r.json() : null))
          .then(j => [f, j && j.data ? H.progress(f, j.data) : null])
          .catch(() => [f, null]),
      ),
    ).then(list => {
      const prog = {};
      list.forEach(([f, p]) => {
        if (p && p.done >= H.progress(f).done) prog[f.lab] = p;
      });
      return prog;
    });
  };
  // какие лабы открыты студентам (ЛР-15 и дальше открывает преподаватель); null — сервера нет
  H.labsOpen = () =>
    online
      ? fetch('/api/labs')
          .then(r => (r.ok ? r.json() : null))
          .then(j => (j && j.open) || null)
          .catch(() => null)
      : Promise.resolve(null);
  H.api = async (path, body) => {
    const r = await fetch(path, body ? {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)} : {});
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.err || 'Сервер не ответил');
    return j;
  };
  H.clientId = () => {
    let c = localStorage.getItem('air-client');
    if (!c) {
      c = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem('air-client', c);
    }
    return c;
  };
  // кто вошёл — в элемент el; «выйти» снимает сессию
  H.showWho = el => {
    if (H.sess && H.sess.fio)
      el.innerHTML = `<b>${esc(H.sess.fio)}</b><span class="mu">${esc(H.sess.grp)} · вариант ${esc(H.sess.seed)}</span> · <a id="logout">выйти</a>`;
    else if (H.seed != null) el.innerHTML = `<b>Вариант № ${esc(H.seed)}</b><span class="mu">номер в журнале на этом компьютере</span>`;
    else el.innerHTML = '';
    if ($('logout'))
      $('logout').onclick = () => {
        localStorage.removeItem('air-session');
        location.reload();
      };
  };
  // стойка регистрации: блок #checkin с полями #lgG, #lgS, #lgP, #lgGo, #lgNote; onLogin(сессия) — после входа
  H.checkin = async onLogin => {
    if ((H.sess && H.sess.token) || !online) return;
    let groups;
    try {
      groups = (await H.api('/api/groups')).groups;
    } catch (e) {
      return; // сервера нет — вход по номеру в журнале в самой лабе
    }
    if (!groups || !groups.length) return;
    $('checkin').hidden = false;
    const lastG = localStorage.getItem('air-grp');
    $('lgG').innerHTML = groups.map(g => `<option ${g === lastG ? 'selected' : ''}>${esc(g)}</option>`).join('');
    let roster = [];
    const note = (t, err) => {
      $('lgNote').textContent = t;
      $('lgNote').className = 'note' + (err ? ' err' : '');
    };
    const hint = () => {
      const s = roster.find(x => String(x.id) === $('lgS').value);
      note(!s ? '' : s.pin ? 'Введите свой PIN.' : 'Вы входите впервые: придумайте PIN из 4 цифр и запомните его.');
    };
    const load = async () => {
      $('lgS').innerHTML = '<option value="">загрузка…</option>';
      try {
        roster = (await H.api('/api/roster?grp=' + encodeURIComponent($('lgG').value))).students || [];
      } catch (e) {
        roster = [];
      }
      $('lgS').innerHTML =
        '<option value="">— выберите себя —</option>' + roster.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
      hint();
    };
    $('lgG').onchange = () => {
      localStorage.setItem('air-grp', $('lgG').value);
      load();
    };
    $('lgS').onchange = hint;
    const go = async () => {
      if (!$('lgS').value) return note('Выберите себя в списке.', true);
      if (!/^\d{4}$/.test($('lgP').value)) {
        $('lgP').focus();
        return note('PIN — ровно 4 цифры.', true);
      }
      try {
        const r = await H.api('/api/login', {id: +$('lgS').value, pin: $('lgP').value, dev: H.clientId()});
        H.sess = {token: r.token, sid: r.sid, fio: r.fio, grp: r.grp, seed: r.seed};
        localStorage.setItem('air-session', JSON.stringify(H.sess));
        localStorage.setItem('air-grp', r.grp);
        $('checkin').hidden = true;
        onLogin(H.sess);
      } catch (e) {
        note(e.message, true);
      }
    };
    $('lgGo').onclick = go;
    $('lgP').onkeydown = e => {
      if (e.key === 'Enter') go();
    };
    load();
  };
  H.clock = el => {
    const tick = () => {
      el.textContent = new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    };
    tick();
    setInterval(tick, 10000);
  };
  // лабы: где хранится прогресс и ключи уровней по порядку (для прогресса на главных)
  const lv = (p, n) => Array.from({length: n}, (_, i) => p + (i + 1)); // уровни ещё не готовых лаб — по номерам
  H.LABS = {
    lr13: {
      lab: 'lr13',
      store: 'air3d-lr13-',
      levels: ['board', 'board2', 'biz', 'eco', 'first', 'family', 'bags', 'row6', 'group', 'hunt', 'lookup', 'final'],
    },
    lr14: {
      lab: 'lr14',
      store: 'air3d-lr14-',
      levels: ['kids', 'rest', 'window', 'scale', 'atomic', 'noshow', 'cascade', 'setnull', 'restrict', 'soft', 'hunt', 'final'],
    },
    lr15: {
      lab: 'lr15',
      store: 'air3d-lr15-',
      gated: true,
      levels: ['pk', 'fk', 'ident', 'cols', 'eq', 'range', 'inlist', 'like', 'order2', 'paren', 'null', 'distinct', 'top', 'final'],
    },
    lr16: {
      lab: 'lr16',
      store: 'air3d-lr16-',
      gated: true,
      levels: ['links', 'owner', 'dest', 'city', 'disc', 'cross', 'three', 'empty', 'nobag', 'final'],
    },
    lr17: {lab: 'lr17', store: 'pizza-lr17-', gated: true, levels: lv('s', 13)},
    lr18: {lab: 'lr18', store: 'pizza-lr18-', gated: true, levels: lv('s', 10)},
  };
  // «миры» города: какие лабы где
  H.WORLDS = {airport: ['lr13', 'lr14', 'lr15', 'lr16'], pizza: ['lr17', 'lr18']};
  H.live = (lab, open) => !H.LABS[lab].gated || !!(open && open[lab]);
  // карта города показывается, когда открыт хоть один «мир» после аэропорта (или по ссылке /?map)
  H.CITY_LABS = ['lr17', 'lr18'];
  H.cityOpen = open => !!open && H.CITY_LABS.some(l => open[l]);
  window.Home = H;
})();
