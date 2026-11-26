// Вкладка «Приложение» (ЛР-25): представления схемы library — как окна программы, которой пользуется библиотекарь.
// Каждое окно берёт данные запросом SELECT * FROM представление — от имени того, кто сейчас подключён (\c роль):
// роль увидит только окна, на которые ей выдано право. Кнопки форм («Изменить», «Добавить на полку») не меняют
// таблицы сами — они пишут в окно запросов INSERT или UPDATE к представлению и выполняют его, как студент.
// Так видно главное: форма — это SQL к представлению, а проверяет его СУБД.
import {$, esc} from './util.js';
import {db, G, running} from './shell.js';

const DAY = '2026-10-21';
const lit = v =>
  v === '' || v == null ? 'NULL' : /^-?\d+$/.test(String(v).trim()) ? String(v).trim() : `'${String(v).replace(/'/g, "''")}'`;
const shown = v => (v === null || v === undefined ? '—' : v instanceof Date ? v.toISOString().slice(0, 10) : String(v));
const days = d => Math.round((Date.parse(DAY) - Date.parse(shown(d))) / 864e5);

// чем окно выглядит для пользователя: по имени представления, а незнакомое — просто таблицей
const SCREENS = {
  v_catalog: {icon: '🔎', title: 'Электронный каталог', who: 'читатель в зале'},
  v_reader_public: {icon: '🪪', title: 'Стойка регистрации', who: 'регистратор', edit: 'full_name'},
  v_readers: {icon: '🪪', title: 'Стойка регистрации', who: 'регистратор', edit: 'full_name'},
  v_reader_phone: {icon: '☎', title: 'Телефоны читателей', who: 'регистратор', edit: 'phone'},
  v_on_loan: {icon: '📕', title: 'Книги на руках', who: 'библиотекарь'},
  v_desk: {icon: '🧾', title: 'Окно выдачи', who: 'сотрудник выдачи'},
  v_thick: {icon: '📚', title: 'Полка «Толстые книги»', who: 'хранитель фонда', add: true},
  v_author_stats: {icon: '📊', title: 'Отчёт по авторам', who: 'заведующая'},
  mv_author_stats: {icon: '🗄', title: 'Отчёт по авторам (сохранённый)', who: 'заведующая'},
};
const NAMES = {
  title: 'Название',
  author: 'Автор',
  year: 'Год',
  pages: 'Страниц',
  country: 'Страна',
  full_name: 'Читатель',
  reader: 'Читатель',
  card: 'Билет',
  phone: 'Телефон',
  taken: 'Выдана',
  books: 'Книг',
  id: '№',
  author_id: '№ автора',
  loans: 'Выдач',
  on_hand: 'На руках',
};
const head = c => NAMES[c] || c;

export function appScreen(W) {
  const out = $('pgOut'),
    tabs = out.querySelector('.pg-tabs'),
    res = out.querySelector('.pg-res');
  const btn = document.createElement('button');
  btn.dataset.tab = 'app';
  btn.textContent = '🖥 Приложение';
  btn.title = 'Представления — окна программы библиотеки';
  tabs.appendChild(btn);
  const box = document.createElement('div');
  box.id = 'pgApp';
  res.appendChild(box);
  // onclick вкладке назначит и common/pgworld.js (переключение) — перечитать окна нужно в дополнение к нему
  btn.addEventListener('click', () => {
    W.tab('app');
    refresh();
  });

  let list = [],
    cur = null,
    known = null,
    filter = {},
    editing = null,
    pending = false;

  // форма отправляет SQL: он появляется в окне запросов и выполняется, как набранный руками
  const send = sql => {
    if (!G || G.lv == null) return;
    pending = true;
    $('sql').value = sql;
    $('sql').dispatchEvent(new Event('input'));
    $('runBtn').click();
  };

  // права проверяются по имени того, кто подключён (\c роль): сама роль сеанса между командами пульта может
  // ненадолго сбрасываться (снимки базы делаются от имени владельца)
  async function read() {
    const q = async s => (await db.query(s)).rows;
    const user = G.role || 'postgres',
      u = user.replace(/'/g, "''");
    const usage = (await q(`SELECT has_schema_privilege('${u}', 'library', 'USAGE') AS ok`).catch(() => [{ok: false}]))[0].ok;
    const vs = await q(`SELECT c.relname AS v, c.relkind AS k, has_table_privilege('${u}', c.oid, 'SELECT') AS can,
        (SELECT string_agg(a.attname, ',' ORDER BY a.attnum) FROM pg_attribute a WHERE a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped) AS cols
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'library' AND c.relkind IN ('v', 'm') ORDER BY c.relname`);
    return {usage, user, vs: vs.map(x => ({...x, can: x.can && usage, cols: (x.cols || '').split(',')}))};
  }

  async function refresh() {
    if (!db || !G || G.lv == null) return;
    // ошибка внутри открытой транзакции студента прервала бы её — пока она открыта, окна не перечитываем
    if (G.tx) {
      box.innerHTML = `<div class="app-note">Открыта транзакция — окна программы обновятся после COMMIT или ROLLBACK.</div>`;
      return;
    }
    let C;
    try {
      C = await read();
    } catch (e) {
      return;
    }
    const names = C.vs.map(x => x.v);
    const fresh = known ? names.filter(n => !known.includes(n)) : [];
    known = names;
    list = C.vs;
    if (fresh.length) cur = fresh[fresh.length - 1];
    if (!names.includes(cur)) cur = (C.vs.find(x => x.can) || C.vs[0] || {}).v || null;
    // только что создано или изменено через форму — показать окно
    const last = (G.trail || []).at(-1);
    const touched = last && !last.code && /\b(view|refresh)\b/i.test(last.sql) && /^(CREATE|ALTER|REFRESH)$/.test(last.kind);
    if (fresh.length || pending || touched) W.tab('app');
    pending = false;
    if (!btn.classList.contains('on') && out.dataset.tab !== 'app') return;
    await draw(C);
  }

  async function draw(C) {
    const v = list.find(x => x.v === cur);
    const menu = list
      .map(x => {
        const s = SCREENS[x.v] || {icon: '🗔', title: x.v};
        return `<button data-v="${esc(x.v)}" class="${x.v === cur ? 'on' : ''}${x.can ? '' : ' lock'}" title="${esc(x.v)}">${s.icon} ${esc(s.title)}${x.can ? '' : ' 🔒'}</button>`;
      })
      .join('');
    let body = '';
    if (!list.length)
      body = `<div class="app-empty"><b>В программе пока нет ни одного окна.</b>Окно появляется, когда в базе есть представление: <code>CREATE VIEW v_… AS SELECT …</code>. Таблицы пользователю не показывают — ему показывают представления.</div>`;
    else if (!v.can)
      body = `<div class="app-empty"><b>🔒 Нет доступа</b>Пользователь <code>${esc(C.user)}</code> не может открыть это окно: СУБД не даёт ему права SELECT на представление <code>${esc(v.v)}</code>${C.usage ? '' : ' (и даже USAGE на схему library)'}.</div>`;
    else {
      let rows = [];
      try {
        rows = (await db.query(`SELECT * FROM library.${v.v} LIMIT 300`)).rows;
      } catch (e) {
        body = `<div class="app-empty"><b>Окно не открылось</b>${esc(e.message)}</div>`;
      }
      if (!body) body = screen(v, rows);
    }
    const s = (v && SCREENS[v.v]) || {};
    box.innerHTML = `<div class="app">
      <div class="app-bar"><span class="app-logo">📚</span><b>Городская библиотека</b><span class="app-sub">рабочее место${s.who ? ' · ' + esc(s.who) : ''}</span><span class="app-user">вошли как <code>${esc(C.user)}</code></span></div>
      <div class="app-main"><nav class="app-menu">${menu || '<span class="mu">окон нет</span>'}</nav><section class="app-win">${body}</section></div>
      ${v ? `<div class="app-src">Окно «${esc(s.title || v.v)}» читает <code>SELECT * FROM ${esc(v.v)}</code>${v.k === 'm' ? ' — материализованное: строки хранятся, обновляются только REFRESH' : ' — запрос выполняется при каждом открытии окна'}. Столбцы окна — столбцы представления: ${v.cols.map(esc).join(', ')}.</div>` : ''}
    </div>`;
    bind(v);
  }

  // ═══════════════════════════ окна
  function table(v, rows, {cols = v.cols, edit = null, mark = null} = {}) {
    if (!rows.length) return '<div class="app-empty">Строк нет.</div>';
    const kid = v.cols.includes('id') ? 'id' : null;
    return `<table class="app-t"><tr>${cols.map(c => `<th>${esc(head(c))}</th>`).join('')}${edit && kid ? '<th></th>' : ''}</tr>${rows
      .map(r => {
        const ed = edit && kid && editing && editing.v === v.v && String(editing.id) === String(r[kid]);
        return `<tr class="${mark && mark(r) ? 'hot' : ''}">${cols
          .map(c =>
            ed && c === edit
              ? `<td><input class="app-in" id="appEd" value="${esc(r[c] == null ? '' : r[c])}"></td>`
              : `<td>${esc(c === 'days' && r[c] != null ? r[c] + ' дн.' : shown(r[c]))}</td>`,
          )
          .join('')}${
          edit && kid
            ? `<td class="app-act">${ed ? `<button data-save="${esc(r[kid])}">Сохранить</button><button data-cancel>✕</button>` : `<button data-edit="${esc(r[kid])}">✎ Изменить</button>`}</td>`
            : ''
        }</tr>`;
      })
      .join('')}</table>`;
  }
  function screen(v, rows) {
    const s = SCREENS[v.v] || {};
    const f = (filter[v.v] || '').toLowerCase();
    const search = ph =>
      `<input class="app-in app-search" data-filter="${esc(v.v)}" placeholder="${esc(ph)}" value="${esc(filter[v.v] || '')}">`;
    const match = r => !f || Object.values(r).some(x => shown(x).toLowerCase().includes(f));
    const title = `<h3>${s.icon || '🗔'} ${esc(s.title || 'Окно ' + v.v)}<small>${rows.length} ${rows.length === 300 ? '+ ' : ''}строк</small></h3>`;
    if (v.v === 'v_catalog') {
      const rs = rows.filter(match);
      return `${title}${search('Поиск по названию, автору, году…')}<div class="app-cards">${rs
        .slice(0, 120)
        .map(
          r =>
            `<div class="app-card"><b>${esc(shown(r.title))}</b><span>${esc(shown(r.author))}</span><em>${[r.year && r.year + ' г.', r.pages && r.pages + ' стр.', r.country].filter(Boolean).map(esc).join(' · ')}</em></div>`,
        )
        .join('')}</div>${rs.length ? '' : '<div class="app-empty">Ничего не найдено.</div>'}`;
    }
    if (s.edit) {
      const note = v.cols.includes('phone')
        ? 'Менять здесь можно только телефон.'
        : 'Телефонов в этом окне нет — их нет в представлении. Регистратор не увидит их, даже если захочет.';
      return `${title}<p class="app-hint">${note} Кнопка «Изменить» отправит в базу UPDATE к представлению — посмотрите его в окне запросов.</p>${search('Поиск…')}${table(v, rows.filter(match), {edit: s.edit})}`;
    }
    if (v.v === 'v_on_loan' || v.v === 'v_desk') {
      const rs = rows.filter(match).map(r => ({...r, days: r.taken ? days(r.taken) : null}));
      const cols = [...v.cols, ...(v.cols.includes('taken') ? ['days'] : [])];
      NAMES.days = `Дней на ${DAY.slice(8)}.${DAY.slice(5, 7)}`;
      return `${title}<p class="app-hint">Красным — книги на руках дольше 21 дня.</p>${search(v.v === 'v_desk' ? 'Номер билета или фамилия…' : 'Поиск…')}${table(v, rs, {cols, mark: r => r.days > 21})}`;
    }
    if (s.add) {
      return `${title}<p class="app-hint">На полке — только то, что подходит под условие представления. Форма ниже добавляет книгу <b>через представление</b>: INSERT INTO ${esc(v.v)} … — посмотрите, где окажется тонкая книга.</p>
        <form class="app-form" id="appAdd">${v.cols.map(c => `<label>${esc(head(c))}<input class="app-in" name="${esc(c)}"></label>`).join('')}<button>Добавить на полку</button></form>${table(v, rows.filter(match))}`;
    }
    if (/author_stats$/.test(v.v) && v.cols.includes('books')) {
      const max = Math.max(1, ...rows.map(r => +r.books || 0));
      return `${title}${v.k === 'm' ? '<p class="app-hint">Отчёт сохранён в базе: новые книги появятся в нём только после REFRESH MATERIALIZED VIEW.</p>' : ''}<div class="app-bars">${[
        ...rows,
      ]
        .sort((a, b) => b.books - a.books || String(a.author).localeCompare(String(b.author)))
        .map(
          r =>
            `<div><span>${esc(shown(r.author))}</span><i style="width:${((+r.books || 0) / max) * 100}%"></i><b>${esc(shown(r.books))}</b>${r.pages != null ? `<em>${esc(shown(r.pages))} стр.</em>` : ''}</div>`,
        )
        .join('')}</div>`;
    }
    return `${title}${search('Поиск…')}${table(v, rows.filter(match))}`;
  }

  function bind(v) {
    box.querySelectorAll('[data-v]').forEach(b => (b.onclick = () => ((cur = b.dataset.v), (editing = null), refresh())));
    const fi = box.querySelector('[data-filter]');
    if (fi)
      fi.oninput = () => {
        filter[fi.dataset.filter] = fi.value;
        const at = fi.selectionStart;
        refresh().then(() => {
          const n = box.querySelector('[data-filter]');
          if (n) n.focus(), n.setSelectionRange(at, at);
        });
      };
    if (!v) return;
    const s = SCREENS[v.v] || {};
    box.querySelectorAll('[data-edit]').forEach(b => (b.onclick = () => ((editing = {v: v.v, id: b.dataset.edit}), refresh())));
    box.querySelectorAll('[data-cancel]').forEach(b => (b.onclick = () => ((editing = null), refresh())));
    box.querySelectorAll('[data-save]').forEach(
      b =>
        (b.onclick = () => {
          const val = $('appEd').value;
          editing = null;
          send(`UPDATE ${v.v} SET ${s.edit} = ${lit(val)} WHERE id = ${lit(b.dataset.save)};`);
        }),
    );
    const f = box.querySelector('#appAdd');
    if (f)
      f.onsubmit = e => {
        e.preventDefault();
        const cols = v.cols.filter(c => f.elements[c].value.trim() !== '');
        if (!cols.length) return;
        send(`INSERT INTO ${v.v} (${cols.join(', ')}) VALUES (${cols.map(c => lit(f.elements[c].value)).join(', ')});`);
      };
  }

  // новый уровень — база заново: «новых» окон нет, выбранное окно и правка сбрасываются
  const reset = () => {
    known = null;
    editing = null;
    filter = {};
  };
  // после команды пульта: перечитать, когда пульт закончит всю пачку команд (иначе чтение вклинится между ними)
  let t = null;
  const later = () => {
    clearTimeout(t);
    t = setTimeout(() => (running ? later() : refresh()), 80);
  };
  return {refresh, reset, later};
}
