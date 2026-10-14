/* Тетради «Аэропорт» — общий движок.
   Подключается обычным <script> (работает и при открытии файла двойным щелчком).
   Страница лабораторной описывает объект LAB и вызывает W.start(LAB);
   PGlite передаётся в W.boot() из модульного скрипта страницы. */
'use strict';
const W = (() => {
  const $ = id => document.getElementById(id);
  const esc = s =>
    String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ─────────────────────────────────────────── случайность по номеру ──
  function rng(seed) {
    // mulberry32
    let a = seed >>> 0;
    const f = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));
    f.pick = a => a[Math.floor(f() * a.length)];
    f.shuffle = a => {
      a = a.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(f() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    f.take = (a, n) => f.shuffle(a).slice(0, n);
    return f;
  }

  const SURN = [
    'Иванов',
    'Петров',
    'Смирнов',
    'Кузнецов',
    'Попов',
    'Соколов',
    'Лебедев',
    'Козлов',
    'Новиков',
    'Морозов',
    'Волков',
    'Алексеев',
    'Егоров',
    'Павлов',
    'Семёнов',
    'Голубев',
    'Виноградов',
    'Богданов',
    'Фёдоров',
    'Михайлов',
    'Беляев',
    'Тарасов',
    'Комаров',
    'Орлов',
    'Киселёв',
    'Макаров',
    'Андреев',
    'Ковалёв',
    'Ильин',
    'Гусев',
    'Титов',
    'Баранов',
    'Куликов',
    'Степанов',
    'Яковлев',
    'Сорокин',
    'Романов',
    'Захаров',
    'Борисов',
    'Королёв',
    'Герасимов',
    'Пономарёв',
    'Григорьев',
    'Лазарев',
    'Медведев',
    'Ершов',
    'Никитин',
    'Соболев',
    'Рябов',
    'Поляков',
    'Цветков',
    'Данилов',
    'Жуков',
    'Фролов',
    'Николаев',
    'Крылов',
    'Максимов',
    'Сидоров',
    'Осипов',
    'Белоусов',
    'Калинин',
    'Антонов',
    'Тимофеев',
    'Филиппов',
    'Марков',
    'Миронов',
    'Казаков',
    'Ефимов',
    'Денисов',
    'Громов',
    'Фомин',
    'Давыдов',
    'Мельников',
    'Карпов',
    'Власов',
    'Тихонов',
    'Гаврилов',
    'Котов',
    'Быков',
    'Зуев',
    'Панов',
    'Абрамов',
    'Воронов',
    'Мухин',
    'Архипов',
    'Чернов',
    'Назаров',
    'Лукин',
    'Ермаков',
    'Дроздов',
    'Савин',
    'Логинов',
    'Кириллов',
    'Уваров',
    'Юдин',
    'Щукин',
    'Шубин',
    'Широков',
    'Ушаков',
  ];
  const INIT = 'АБВГДЕИКЛМНОПРСТЮЯ';
  const CITIES = [
    'Тюмень',
    'Тюмень',
    'Тюмень',
    'Москва',
    'Москва',
    'Сургут',
    'Тобольск',
    'Ишим',
    'Екатеринбург',
    'Омск',
    'Ханты-Мансийск',
    'Нижневартовск',
  ];
  function person(r) {
    const f = r() < 0.5;
    return `${r.pick(SURN)}${f ? 'а' : ''} ${r.pick(INIT)}. ${r.pick(INIT)}.`;
  }
  const lit = v =>
    v === null || v === undefined
      ? 'NULL'
      : typeof v === 'boolean'
        ? String(v)
        : typeof v === 'number'
          ? String(v)
          : "'" + String(v).replace(/'/g, "''") + "'";

  // ────────────────────────────────────────────── разбор текста SQL ──
  // Делит текст на команды по «;» вне строк и комментариев.
  // Строка, начинающаяся с «\», — метакоманда psql (до конца строки).
  function splitSQL(src) {
    const out = [];
    let cur = '',
      i = 0;
    const n = src.length;
    const push = () => {
      const s = cur.trim();
      if (
        s &&
        s
          .replace(/--[^\n]*/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .trim()
      )
        out.push(s);
      cur = '';
    };
    while (i < n) {
      const c = src[i],
        d = src[i + 1];
      if (c === '\\' && !cur.replace(/--[^\n]*/g, '').trim()) {
        let j = src.indexOf('\n', i);
        if (j < 0) j = n;
        cur = src.slice(i, j);
        push();
        i = j + 1;
        continue;
      }
      if (c === '-' && d === '-') {
        let j = src.indexOf('\n', i);
        if (j < 0) j = n;
        cur += src.slice(i, j);
        i = j;
        continue;
      }
      if (c === '/' && d === '*') {
        let j = src.indexOf('*/', i + 2);
        j = j < 0 ? n : j + 2;
        cur += src.slice(i, j);
        i = j;
        continue;
      }
      if (c === "'" || c === '"') {
        let j = i + 1;
        while (j < n) {
          if (src[j] === c) {
            if (src[j + 1] === c) {
              j += 2;
              continue;
            }
            break;
          }
          j++;
        }
        cur += src.slice(i, j + 1);
        i = j + 1;
        continue;
      }
      if (c === '$') {
        const m = /^\$[A-Za-z_]*\$/.exec(src.slice(i));
        if (m) {
          let j = src.indexOf(m[0], i + m[0].length);
          j = j < 0 ? n : j + m[0].length;
          cur += src.slice(i, j);
          i = j;
          continue;
        }
      }
      if (c === ';') {
        push();
        i++;
        continue;
      }
      cur += c;
      i++;
    }
    push();
    return out;
  }
  const stripComments = s => s.replace(/--[^\n]*/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ');
  function kindOf(sql) {
    const s = stripComments(sql).trim().replace(/^\(+/, '');
    if (s.startsWith('\\')) return 'META';
    const w = s
      .split(/\s+/)
      .slice(0, 2)
      .map(x => x.toUpperCase());
    if (w[0] === 'WITH' || w[0] === 'TABLE' || w[0] === 'VALUES') return 'SELECT';
    if (['CREATE', 'ALTER', 'DROP'].includes(w[0])) return w[0] + ' ' + (w[1] || '');
    if (w[0] === 'START' || w[0] === 'BEGIN') return 'BEGIN';
    if (w[0] === 'END') return 'COMMIT';
    return w[0] || '';
  }
  // «WHERE …» и таблица команды — для правила «сначала SELECT»
  function whereOf(sql) {
    const s = stripComments(sql).replace(/\s+/g, ' ').trim().replace(/;$/, '');
    let m;
    const norm = w =>
      w
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/\s*([=<>(),])\s*/g, '$1')
        .trim();
    if ((m = /^update\s+([\w.]+)(?:\s+(?:as\s+)?\w+)?\s+set\s+[\s\S]*?\swhere\s+([\s\S]+?)(?:\s+returning\s[\s\S]*)?$/i.exec(s)))
      return {table: m[1].toLowerCase(), where: norm(m[2])};
    if ((m = /^update\s+([\w.]+)/i.exec(s))) return {table: m[1].toLowerCase(), where: null};
    if ((m = /^delete\s+from\s+([\w.]+)(?:\s+(?:as\s+)?\w+)?\s+where\s+([\s\S]+?)(?:\s+returning\s[\s\S]*)?$/i.exec(s)))
      return {table: m[1].toLowerCase(), where: norm(m[2])};
    if ((m = /^delete\s+from\s+([\w.]+)/i.exec(s))) return {table: m[1].toLowerCase(), where: null};
    if (
      (m =
        /^select\s[\s\S]*?\sfrom\s+([\w.]+)(?:\s+(?:as\s+)?(?!where\b)\w+)?\s+where\s+([\s\S]+?)(?:\s+(?:order\s+by|limit|offset|group\s+by)\s[\s\S]*)?$/i.exec(
          s,
        ))
    )
      return {table: m[1].toLowerCase(), where: norm(m[2])};
    if ((m = /^select\s[\s\S]*?\sfrom\s+([\w.]+)/i.exec(s))) return {table: m[1].toLowerCase(), where: null};
    return null;
  }

  // ─────────────────────────────────────────────── ошибки по-русски ──
  const ERR_LABEL = {
    fk: 'Внешний ключ',
    notnull: 'NOT NULL',
    check: 'CHECK',
    unique: 'Уникальность',
    type: 'Тип данных',
    name: 'Имя',
    syntax: 'Синтаксис',
    tx: 'Транзакция',
    other: 'Отказ',
  };
  function explainErr(e) {
    const code = e.code || '';
    const det = e.detail || '';
    let m;
    if (code === '23001') {
      m = /referenced from table "(.+?)"/.exec(det);
      return {
        type: 'fk',
        ru: `На эту строку ссылаются строки таблицы ${m ? m[1] : ''}. Правило внешнего ключа RESTRICT запрещает удаление.`,
      };
    }
    if (code === '23503') {
      if ((m = /Key \((.+?)\)=\((.+?)\) is not present in table "(.+?)"/.exec(det)))
        return {type: 'fk', ru: `Ссылка ${m[1]} = ${m[2]}: в таблице ${m[3]} такой строки нет. Сначала родитель, потом ссылка на него.`};
      if ((m = /referenced from table "(.+?)"/.exec(det)))
        return {
          type: 'fk',
          ru: `На эту строку ссылаются строки таблицы ${m[1]}. Правило внешнего ключа запрещает удаление (RESTRICT / NO ACTION).`,
        };
      return {type: 'fk', ru: 'Нарушена ссылочная целостность: ссылка указывает на несуществующую строку.'};
    }
    if (code === '23502') return {type: 'notnull', ru: `Столбец ${e.column || ''} обязателен (NOT NULL), а значение не задано.`};
    if (code === '23514') return {type: 'check', ru: `Значение не проходит проверку ${e.constraint || ''}.`};
    if (code === '23505') {
      m = /Key \((.+?)\)=\((.+?)\) already exists/.exec(det);
      return {type: 'unique', ru: m ? `Повтор: ${m[1]} = ${m[2]} уже есть в таблице.` : 'Повтор значения, которое должно быть уникальным.'};
    }
    if (code === '22001') return {type: 'type', ru: 'Значение длиннее, чем позволяет тип столбца. Не перепутан ли порядок значений?'};
    if (['22P02', '42804', '22007', '22008', '22003'].includes(code))
      return {type: 'type', ru: 'Значение не подходит к типу столбца. Проверьте порядок значений и кавычки.'};
    if (code === '42P01') return {type: 'name', ru: 'Такой таблицы нет — проверьте имя.'};
    if (code === '42703') return {type: 'name', ru: 'Такого столбца нет — проверьте имя (и не забыты ли кавычки вокруг текста).'};
    if (code === '42702')
      return {type: 'name', ru: 'Столбец с таким именем есть в нескольких таблицах запроса — укажите, из какой: p.id, f.flight_no.'};
    if (code === '42P10' || code === '42P18' || code === '42601' || /syntax error/.test(e.message))
      return {type: 'syntax', ru: 'Синтаксическая ошибка — смотрите на слово, названное в сообщении, и на то, что перед ним.'};
    if (code === '25P02') return {type: 'tx', ru: 'Транзакция прервана ошибкой: до ROLLBACK команды не выполняются.'};
    if (code === '21000') return {type: 'other', ru: 'Подзапрос вернул больше одной строки там, где ждали одно значение.'};
    return {type: 'other', ru: ''};
  }

  // ─────────────────────────────────────────────────────── база ──
  let db = null;
  const pending = [];
  let PGliteCls = null;
  async function boot(PGlite) {
    PGliteCls = PGlite;
    db = new PGlite();
    await db.query('select 1');
    pending.splice(0).forEach(f => f());
  }
  const ready = () => (db ? Promise.resolve() : new Promise(r => pending.push(r)));
  // база одна на страницу: подготовка уровня и выполнение команд идут строго по очереди,
  // иначе быстрые щелчки по вкладкам запускают две загрузки сразу («relation … already exists»)
  let queue = Promise.resolve();
  const exclusive = fn => {
    const r = queue.then(fn);
    queue = r.catch(() => {});
    return r;
  };

  async function loadBaseline(sql) {
    try {
      await db.query('ROLLBACK');
    } catch (e) {
      /* нет транзакции */
    }
    await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
    await db.exec(sql);
  }

  // эмуляция \d — по каталогу
  async function meta(cmd) {
    const m = /^\\d\+?\s*([\w.]*)\s*$/.exec(cmd.trim());
    if (!m) throw Object.assign(new Error('Поддерживается только \\d и \\d имя_таблицы'), {code: 'META'});
    if (!m[1]) {
      const r = await db.query(`SELECT table_name AS "Таблица" FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY 1`);
      return {rows: r.rows, fields: ['Таблица'], title: 'Список таблиц'};
    }
    const t = m[1].toLowerCase();
    const cols = await db.query(
      `SELECT a.attname AS "Столбец", format_type(a.atttypid, a.atttypmod) AS "Тип",
        CASE WHEN a.attnotnull THEN 'not null' ELSE '' END AS "Пустые",
        coalesce(pg_get_expr(d.adbin, d.adrelid), '') AS "По умолчанию"
      FROM pg_attribute a LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
      WHERE a.attrelid = to_regclass($1) AND a.attnum > 0 AND NOT a.attisdropped ORDER BY a.attnum`,
      [t],
    );
    if (!cols.rows.length) throw Object.assign(new Error(`Did not find any relation named "${t}".`), {code: '42P01'});
    const cons = await db.query(
      `SELECT conname AS "Ограничение", pg_get_constraintdef(oid) AS "Определение"
      FROM pg_constraint WHERE conrelid = to_regclass($1) ORDER BY contype, conname`,
      [t],
    );
    const refs = await db.query(
      `SELECT conrelid::regclass::text AS "Таблица", conname AS "Ограничение", pg_get_constraintdef(oid) AS "Определение"
      FROM pg_constraint WHERE confrelid = to_regclass($1) AND contype = 'f' ORDER BY 1`,
      [t],
    );
    return {
      title: 'Таблица ' + t,
      rows: cols.rows,
      fields: ['Столбец', 'Тип', 'Пустые', 'По умолчанию'],
      extra: [
        {title: 'Ограничения', rows: cons.rows, fields: ['Ограничение', 'Определение']},
        {title: 'Ссылки на неё', rows: refs.rows, fields: ['Таблица', 'Ограничение', 'Определение']},
      ],
    };
  }

  // Выполнить текст: команда за командой, до первой ошибки (как psql -v ON_ERROR_STOP=1).
  async function run(text, opt = {}) {
    const out = [];
    for (const sql of splitSQL(text)) {
      const kind = kindOf(sql);
      const R = {sql, kind};
      if (opt.guard) {
        const g = opt.guard(sql, kind);
        if (g) {
          R.blocked = g;
          out.push(R);
          break;
        }
      }
      try {
        if (kind === 'META') {
          const r = await meta(sql);
          Object.assign(R, {ok: true, rows: r.rows, fields: r.fields, meta: r, tag: r.title});
        } else {
          const r = await db.query(sql);
          R.ok = true;
          R.rows = r.rows || [];
          R.fields = (r.fields || []).map(f => f.name);
          R.affected = r.affectedRows || 0;
          R.tag =
            kind === 'INSERT'
              ? `INSERT 0 ${R.affected}`
              : kind === 'UPDATE'
                ? `UPDATE ${R.affected}`
                : kind === 'DELETE'
                  ? `DELETE ${R.affected}`
                  : kind === 'SELECT'
                    ? `(${R.rows.length} ${plural(R.rows.length, 'строка', 'строки', 'строк')})`
                    : kind;
        }
      } catch (e) {
        R.ok = false;
        R.err = {message: e.message, code: e.code, constraint: e.constraint, table: e.table, column: e.column, detail: e.detail};
        Object.assign(R.err, explainErr(R.err));
        if (R.err.type === 'check' && R.err.constraint) {
          try {
            const c = await db.query(`SELECT pg_get_constraintdef(oid) d FROM pg_constraint WHERE conname = $1 LIMIT 1`, [
              R.err.constraint,
            ]);
            if (c.rows[0]) R.err.ru += ` Правило: ${c.rows[0].d}`;
          } catch (e2) {
            /* транзакция прервана — без правила */
          }
        }
        out.push(R);
        break;
      }
      out.push(R);
      if (opt.after) opt.after(R);
    }
    return out;
  }
  const plural = (n, a, b, c) => {
    n = Math.abs(n) % 100;
    const k = n % 10;
    return n > 10 && n < 20 ? c : k > 1 && k < 5 ? b : k === 1 ? a : c;
  };

  // ───────────────────────────────────────── снимки состояния и разница ──
  const norm = v =>
    v === null || v === undefined ? null : v instanceof Date ? v.toISOString() : typeof v === 'object' ? JSON.stringify(v) : String(v);
  async function snapshot(tables) {
    const snap = {};
    for (const t of tables) {
      const rows = new Map();
      try {
        const r = await db.query(`SELECT * FROM ${t.name}`);
        r.rows.forEach(row => rows.set(norm(row[t.pk]), row));
        snap[t.name] = {pk: t.pk, rows, ok: true};
      } catch (e) {
        snap[t.name] = {pk: t.pk, rows, ok: false};
      }
    }
    return snap;
  }
  function diff(a, b) {
    const d = {};
    for (const name in b) {
      const A = (a[name] || {rows: new Map()}).rows,
        B = b[name].rows;
      const ins = [],
        del = [],
        upd = [];
      B.forEach((row, k) => {
        if (!A.has(k)) ins.push(row);
        else {
          const old = A.get(k);
          const cols = Object.keys(row).filter(c => norm(row[c]) !== norm(old[c]));
          if (cols.length) upd.push({a: old, b: row, cols});
        }
      });
      A.forEach((row, k) => {
        if (!B.has(k)) del.push(row);
      });
      d[name] = {ins, del, upd};
    }
    return d;
  }
  const empty = d => Object.values(d).every(x => !x.ins.length && !x.del.length && !x.upd.length);
  // сравнить текущее состояние с целью: лишние / недостающие / неверные строки
  function compare(cur, tgt, ignore = {}) {
    const res = {missing: [], extra: [], wrong: []};
    for (const name in tgt) {
      const C = (cur[name] || {rows: new Map()}).rows,
        T = tgt[name].rows;
      const ig = ignore[name] || [];
      T.forEach((row, k) => {
        if (!C.has(k)) res.missing.push({t: name, row});
        else {
          const c = C.get(k);
          const cols = Object.keys(row).filter(col => !ig.includes(col) && norm(row[col]) !== norm(c[col]));
          if (cols.length) res.wrong.push({t: name, a: c, b: row, cols});
        }
      });
      C.forEach((row, k) => {
        if (!T.has(k)) res.extra.push({t: name, row});
      });
    }
    res.ok = !res.missing.length && !res.extra.length && !res.wrong.length;
    return res;
  }

  // ─────────────────────────────────────────────────── хранилище ──
  const load = (k, d) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v == null ? d : v;
    } catch (e) {
      return d;
    }
  };
  const save = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      /* без хранилища */
    }
  };

  // ════════════════════════════════════════════════════════ оболочка ══
  let LAB, S;
  const TABS = [
    ['brief', 'Брифинг', '1'],
    ['predict', 'Предскажи', '2'],
    ['shift', 'Смена', '3'],
    ['control', 'Контрольный рейс', '4'],
    ['proto', 'Протокол', '5'],
  ];

  function shell() {
    document.title = `ЛР-${LAB.no} · ${LAB.title}`;
    document.body.innerHTML = `
<header class="hdr"><div class="hdr-in">
  <div class="hdr-no"><div><small>ЛР</small>${LAB.no}</div></div>
  <div class="hdr-tt"><div class="hdr-eye">ОПЦ.07 · ${esc(LAB.topic)}</div><div class="hdr-ttl">${esc(LAB.title)}</div></div>
  <nav class="tabs">${TABS.map(([k, t, n]) => `<button class="tab" data-tab="${k}"><span class="pic">${n}</span>${t}</button>`).join('')}</nav>
  <div class="hdr-r"><span class="flightno" id="flightno">—</span>
    <button class="hbtn" id="bigBtn" title="Крупный шрифт для проектора">проектор</button>
    <button class="hbtn" id="seedBtn">сменить номер</button></div>
</div></header>
<main class="wrap">
  <section id="work">
    <div class="scene-box">
      <div class="scene-hd"><span class="msg info" id="msg">Загрузка базы…</span><span class="legend" id="legend">${LAB.legend || ''}</span></div>
      <div class="scene" id="scene"></div>
      <div class="card" id="card" hidden></div>
    </div>
    <div class="grid">
      <div>
        <div class="sqlbox">
          <div class="sqlbox-hd"><span id="edHd">пульт · <b>PostgreSQL</b></span><span>Ctrl+Enter — выполнить</span></div>
          <textarea class="sql" id="sql" spellcheck="false" placeholder="${esc(LAB.placeholder || '')}"></textarea>
          <div class="sqlbar">
            <button class="run" id="runBtn">▶ Выполнить</button>
            <button class="btn2" id="resetBtn">↺ вернуть базу</button>
            <button class="btn2" id="submitBtn" hidden>✈ Сдать рейс</button>
            <span class="sp"><label><input type="checkbox" id="anim" checked> анимация</label></span>
          </div>
        </div>
        <div class="console" id="console"></div>
      </div>
      <div class="panel" id="side"></div>
    </div>
  </section>
  <section id="protoSec" hidden></section>
</main>
<div class="start" id="start" hidden><div class="start-box">
  <div class="peye">ЛР-${LAB.no} · ${esc(LAB.topic)}</div>
  <h1>${esc(LAB.title)}</h1>
  <p class="muted" style="margin-top:8px">Введите свой номер в журнале. По нему составлены ваши рейсы, пассажиры и задания смены:
    у соседа они другие, и его запросы на вашей базе не сработают.</p>
  <input type="number" id="seedIn" min="0" max="60">
  <div><button class="pbtn y" id="seedGo">Заступить на смену</button></div>
  <p class="muted" style="margin-top:10px">0 — демонстрационная смена преподавателя.</p>
</div></div>`;
    document.querySelectorAll('.tab').forEach(b => (b.onclick = () => setTab(b.dataset.tab)));
    $('runBtn').onclick = () => runEditor();
    $('resetBtn').onclick = () => resetCurrent();
    $('submitBtn').onclick = () => submitControl();
    $('bigBtn').onclick = () => document.body.classList.toggle('big');
    $('seedBtn').onclick = () => askSeed();
    $('seedGo').onclick = () => setSeed();
    $('seedIn').onkeydown = e => {
      if (e.key === 'Enter') setSeed();
    };
    $('sql').addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        runEditor();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const t = e.target,
          p = t.selectionStart;
        t.setRangeText('  ', p, t.selectionEnd, 'end');
      }
    });
    $('sql').addEventListener('paste', e => {
      const t = (e.clipboardData || window.clipboardData).getData('text') || '';
      if (t.length > 25) S.pasted = (S.pasted || 0) + t.length;
    });
    $('scene').addEventListener('click', e => {
      const el = e.target.closest('[data-card]');
      if (el && LAB.scene.card) showCard(LAB.scene.card(el.dataset.card));
    });
  }

  function showCard(info) {
    if (!info) {
      $('card').hidden = true;
      return;
    }
    $('card').hidden = false;
    $('card').innerHTML = `<button class="x" onclick="this.parentNode.hidden=true">×</button>
      <b>${esc(info.title)}</b><table>${Object.entries(info.row)
        .map(
          ([k, v]) =>
            `<tr><td>${esc(k)}</td><td>${v === null ? '<i>NULL</i>' : esc(v instanceof Date ? v.toISOString().slice(0, 16) : v)}</td></tr>`,
        )
        .join('')}</table>
      ${info.more || ''}`;
  }

  const msg = (t, cls = 'info') => {
    const m = $('msg');
    m.className = 'msg ' + cls;
    m.innerHTML = t;
  };

  function askSeed() {
    $('start').hidden = false;
    $('seedIn').focus();
  }
  async function setSeed() {
    const v = parseInt($('seedIn').value, 10);
    if (isNaN(v) || v < 0 || v > 60) return;
    save('air-seed', v);
    $('start').hidden = true;
    await enter(v);
  }

  const PKEY = () => `air-lr${LAB.no}-${S.seed}`;
  const persist = () => save(PKEY(), S.P);

  async function enter(seed) {
    S = {seed, tab: null, lv: 0, pi: 0, P: null, lastSelect: null, busy: false};
    S.D = LAB.data(seed);
    S.levels = LAB.levels(S.D);
    S.predicts = LAB.predicts(S.D);
    S.controls = LAB.control(S.D);
    S.P = load(PKEY(), null) || {levels: {}, pred: {}, control: {}, answers: {}, fio: '', journal: [], started: new Date().toISOString()};
    $('flightno').textContent = LAB.badge(S.D, seed);
    LAB.scene.init($('scene'), api);
    await ready();
    const first = S.levels.findIndex((l, i) => !(S.P.levels[i] || {}).done);
    S.lv = first < 0 ? 0 : first;
    await setTab(load(`air-lr${LAB.no}-tab`, 'brief'));
  }

  // ───────────────────────────────────────────────────── вкладки ──
  async function setTab(tab) {
    S.tab = tab;
    save(`air-lr${LAB.no}-tab`, tab);
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    $('work').hidden = tab === 'proto';
    $('protoSec').hidden = tab !== 'proto';
    $('card').hidden = true;
    $('submitBtn').hidden = tab !== 'control';
    $('runBtn').hidden = tab === 'predict';
    $('resetBtn').hidden = tab === 'predict';
    $('sql').readOnly = tab === 'predict';
    if (tab === 'proto') return renderProto();
    if (tab === 'brief') return openBrief();
    if (tab === 'predict') return openPredict(S.pi);
    if (tab === 'shift') return openLevel(S.lv);
    if (tab === 'control') return openControl();
  }

  const base = sql => exclusive(() => base0(sql));
  async function base0(sql) {
    S.busy = true;
    msg('Готовлю базу…');
    try {
      await loadBaseline(sql);
      S.lastSelect = null;
      S.snap = await snapshot(LAB.tables);
      LAB.scene.render(S.snap, S.D);
    } finally {
      S.busy = false;
    }
  }

  // ── брифинг: свободная работа на полной базе
  async function openBrief() {
    await base(LAB.sandbox(S.D));
    $('console').innerHTML = '';
    $('edHd').innerHTML = 'пульт · <b>свободная работа</b> · база сбрасывается кнопкой «вернуть базу»';
    $('sql').value = '';
    $('side').innerHTML = LAB.brief(S.D);
    $('side')
      .querySelectorAll('[data-q]')
      .forEach(
        b =>
          (b.onclick = () => {
            $('sql').value = b.dataset.q;
            $('sql').focus();
          }),
      );
    msg(LAB.briefMsg || 'Свободная работа. Щёлкните объект на схеме — увидите строку таблицы.');
  }

  async function resetCurrent() {
    if (S.tab === 'brief') return openBrief();
    if (S.tab === 'shift') return openLevel(S.lv, true);
    if (S.tab === 'control') return openControl(true);
  }

  // ── предсказания
  async function openPredict(i) {
    S.pi = i;
    const p = S.predicts[i];
    await base(p.setup ? p.setup(S.D) : LAB.sandbox(S.D));
    $('console').innerHTML = '';
    $('edHd').innerHTML = `пульт · <b>только чтение</b> · сначала ответ, потом выполнение`;
    $('sql').value = p.sql;
    const rec = S.P.pred[i];
    const nav = S.predicts
      .map((q, k) => `<button class="lv${k === i ? ' on' : ''}${S.P.pred[k] ? ' done' : ''}" data-p="${k}">${k + 1}</button>`)
      .join('');
    let body;
    if (p.type === 'number') {
      body = `<div style="margin-top:8px;display:flex;gap:8px;align-items:center"><input class="numin" id="pnum" type="number" ${rec ? `value="${rec.choice}" disabled` : ''}>
        <span class="muted">${esc(p.unit || 'строк')}</span></div>`;
    } else {
      body = `<div class="choices">${p.choices.map((c, k) => `<button class="choice" data-c="${c.k}">${esc(c.t)}</button>`).join('')}</div>`;
    }
    $('side').innerHTML = `<div class="pnav">${nav}</div>
      <div class="peye">Предскажи · ${i + 1} из ${S.predicts.length}</div>
      <div class="ptitle">${esc(p.title)}</div>
      <div class="pcap">${p.q}</div>
      ${body}
      <div><button class="pbtn y" id="pRun" ${rec ? '' : 'disabled'}>▶ Выполнить и проверить</button></div>
      <div id="pOut"></div>`;
    $('side')
      .querySelectorAll('[data-p]')
      .forEach(b => (b.onclick = () => openPredict(+b.dataset.p)));
    let pick = rec ? rec.choice : null;
    $('side')
      .querySelectorAll('.choice')
      .forEach(b => {
        if (rec) {
          b.disabled = true;
          if (b.dataset.c === rec.choice) b.classList.add('pick');
          return;
        }
        b.onclick = () => {
          pick = b.dataset.c;
          $('side')
            .querySelectorAll('.choice')
            .forEach(x => x.classList.toggle('pick', x === b));
          $('pRun').disabled = false;
        };
      });
    if ($('pnum') && !rec)
      $('pnum').oninput = () => {
        pick = $('pnum').value;
        $('pRun').disabled = pick === '';
      };
    $('pRun').onclick = async () => {
      if (pick === null || pick === '') return;
      const res = await execute(p.sql, {});
      const actual = p.answer ? p.answer(res) : outcomeKey(res);
      const right = String(actual) === String(pick);
      if (!S.P.pred[i]) {
        S.P.pred[i] = {choice: String(pick), actual: String(actual), right, at: new Date().toISOString()};
        persist();
      }
      $('side')
        .querySelectorAll('.choice')
        .forEach(b => {
          b.disabled = true;
          if (b.dataset.c === String(actual)) b.classList.add('right');
          else if (b.dataset.c === String(pick)) b.classList.add('wrong');
        });
      if ($('pnum')) $('pnum').disabled = true;
      $('pOut').innerHTML =
        `<div class="${right ? 'good' : 'badbox'}">${right ? 'Угадали.' : `Нет. ${p.type === 'number' ? 'Правильно: ' + esc(actual) + '.' : ''}`}</div>
        <div class="hint">${typeof p.x === 'function' ? p.x(res, S.D) : p.x}</div>
        <button class="pbtn" id="pAgain">↺ вернуть базу и показать ещё раз</button>
        ${i + 1 < S.predicts.length ? '<button class="pbtn dark" id="pNext">Дальше →</button>' : '<button class="pbtn dark" id="pNext">К смене →</button>'}`;
      $('pAgain').onclick = () => openPredict(i);
      $('pNext').onclick = () => (i + 1 < S.predicts.length ? openPredict(i + 1) : setTab('shift'));
      $('pRun').disabled = false;
    };
    msg('Сначала ответьте, потом выполните. Ответ запишется в протокол — второй попытки нет.');
  }
  const outcomeKey = res => {
    const bad = res.find(r => !r.ok);
    return bad ? (bad.err ? bad.err.type : 'blocked') : 'ok';
  };

  // ── уровни смены
  function levelBaseline(i, list) {
    const L = list[i];
    if (L.setup) return L.setup(S.D);
    let sql = LAB.base(S.D);
    for (let k = 0; k < i; k++) if (list[k].carry) sql += ';\n' + list[k].ref.join(';\n');
    return sql;
  }
  async function prepareTarget(L, baseSql) {
    L._target = null;
    L._tres = null;
    if (L.check === 'state') {
      await loadBaseline(baseSql);
      for (const q of L.ref) await db.query(q);
      L._target = await snapshot(L.tables.map(n => LAB.tables.find(t => t.name === n)));
    } else if (L.check === 'result') {
      await loadBaseline(baseSql);
      for (const q of L.ref.slice(0, -1)) await db.query(q);
      const r = await db.query(L.ref[L.ref.length - 1]);
      L._tres = {rows: r.rows, fields: r.fields.map(f => f.name)};
    }
  }

  async function openLevel(i, keepEditor) {
    S.lv = i;
    S.list = S.levels;
    S.ctrl = false;
    const L = S.levels[i];
    const baseSql = levelBaseline(i, S.levels);
    await exclusive(async () => {
      S.busy = true;
      try {
        await prepareTarget(L, baseSql);
      } finally {
        S.busy = false;
      }
      await base0(baseSql);
    });
    S.L = L;
    S.fails = 0;
    S.stamps = new Set();
    S.levelStart = Date.now();
    S.pasted = 0;
    $('console').innerHTML = '';
    $('edHd').innerHTML = `пульт · <b>${esc(L.title)}</b>`;
    if (!keepEditor) $('sql').value = (S.P.levels[i] || {}).sql || '';
    renderSide();
    showTargetMarks();
    msg(L.msg || 'Цель показана на схеме. Выполните команды — проверка идёт после каждого запуска.');
    if ((S.P.levels[i] || {}).done) msg('Уровень уже пройден — можно повторить.', 'ok');
  }
  function showTargetMarks() {
    const L = S.L;
    if (LAB.scene.clearMarks) LAB.scene.clearMarks();
    if (LAB.scene.target) LAB.scene.target(L, S.D, S.snap);
  }

  function levelNav() {
    let h = '<div class="levels">';
    let part = null;
    S.levels.forEach((l, k) => {
      if (l.part !== part) {
        part = l.part;
        h += `<span class="lv-sep">${esc(part)}</span>`;
      }
      const st = S.P.levels[k] || {};
      h += `<button class="lv${l.bonus ? ' bonus' : ''}${k === S.lv ? ' on' : ''}${st.done ? ' done' : ''}" data-l="${k}" title="${esc(l.title)}">${l.bonus ? '★' : ''}${l.n}</button>`;
    });
    return h + '</div>';
  }
  function renderSide(extra = '') {
    const L = S.L;
    const st = S.P.levels[S.lv] || {};
    $('side').innerHTML = `${levelNav()}
      <div class="peye">${esc(L.part)} · ${L.bonus ? 'бонус' : 'уровень ' + L.n}${L.lab ? ' · ' + esc(L.lab) : ''}</div>
      <div class="ptitle">${esc(L.title)}</div>
      <div class="pcap">${L.story}</div>
      ${L.doc ? L.doc(S.D) : ''}
      <div id="lvOut">${extra}</div>
      <div id="lvHint"></div>
      <div class="noprint" style="margin-top:6px">
        ${S.fails >= 2 && L.hint ? '<button class="pbtn" id="hintBtn">Подсказка</button>' : ''}
        ${st.done && S.lv + 1 < S.levels.length ? '<button class="pbtn dark" id="nextBtn">Следующий →</button>' : ''}
      </div>`;
    $('side')
      .querySelectorAll('[data-l]')
      .forEach(b => (b.onclick = () => openLevel(+b.dataset.l)));
    if ($('hintBtn'))
      $('hintBtn').onclick = () => {
        $('lvHint').innerHTML = `<div class="hint">${L.hint}</div>`;
        S.hinted = true;
      };
    if ($('nextBtn')) $('nextBtn').onclick = () => openLevel(S.lv + 1);
  }

  // ── контрольный рейс
  async function openControl(keepEditor) {
    S.list = S.controls;
    S.ctrl = true;
    const C = S.controls[0];
    const baseSql = C.setup ? C.setup(S.D) : LAB.sandbox(S.D);
    await exclusive(async () => {
      S.busy = true;
      try {
        await prepareTarget(C, baseSql);
      } finally {
        S.busy = false;
      }
      await base0(baseSql);
    });
    S.L = C;
    S.levelStart = S.levelStart || Date.now();
    S.pasted = 0;
    $('console').innerHTML = '';
    $('edHd').innerHTML = 'пульт · <b>контрольный рейс</b> · без подсказок';
    const rec = S.P.control;
    if (!keepEditor) $('sql').value = rec.sql || '';
    const left = 2 - (rec.attempts || 0);
    $('side').innerHTML = `<div class="peye">Контрольный рейс · на отметку</div>
      <div class="ptitle">${esc(C.title)}</div>
      <div class="pcap">${C.story}</div>
      ${C.doc ? C.doc(S.D) : ''}
      <div class="muted" style="margin-top:8px">Подсказок и подсветки отличий нет. Выполняйте команды сколько угодно;
        когда уверены — «Сдать рейс». Попыток сдачи: ${Math.max(0, left)} из 2. База на момент сдачи — та, что сейчас.</div>
      <div id="ctrlOut">${rec.done ? '<div class="good">Рейс принят.</div>' : rec.attempts >= 2 ? '<div class="badbox">Попытки сдачи исчерпаны.</div>' : ''}</div>`;
    $('submitBtn').disabled = !!rec.done || rec.attempts >= 2;
    if (LAB.scene.clearMarks) LAB.scene.clearMarks();
    if (C.showTarget && LAB.scene.target) LAB.scene.target(C, S.D, S.snap);
    msg('Контрольный рейс: работайте самостоятельно.');
  }
  async function submitControl() {
    const rec = S.P.control;
    if (S.busy || rec.done || rec.attempts >= 2) return; // не сдавать, пока команда ещё выполняется
    const r = await checkLevel(S.L, S.lastRun || []);
    rec.attempts = (rec.attempts || 0) + 1;
    rec.sql = $('sql').value;
    rec.at = new Date().toISOString();
    if (r.ok) {
      rec.done = true;
      rec.mins = Math.round((Date.now() - S.levelStart) / 60000);
    }
    journal('control', 'СДАЧА', r.ok ? 'принят' : 'не принят');
    persist();
    await openControl(true);
    if (r.ok) bigstamp('Рейс принят', '', true);
    else bigstamp('Не принят', rec.attempts >= 2 ? 'попыток больше нет' : 'осталась одна попытка');
  }

  // ───────────────────────────────────────────────── выполнение ──
  function journal(where, sql, outcome) {
    S.P.journal.push({
      t: new Date().toISOString().slice(11, 19),
      w: where,
      l: S.tab === 'shift' ? S.L.n : '',
      q: sql.slice(0, 400),
      o: outcome,
      p: S.pasted ? 1 : 0,
    });
    if (S.P.journal.length > 600) S.P.journal.splice(0, S.P.journal.length - 600);
    S.pasted = 0;
  }

  // правило «сначала SELECT» (если лаборатория его включила)
  function guard(sql, kind) {
    if (!LAB.selectFirst || (kind !== 'UPDATE' && kind !== 'DELETE')) return null;
    const w = whereOf(sql);
    if (!w || w.where === null) return null; // без WHERE — проверять нечего
    const s = S.lastSelect;
    if (!s || s.table !== w.table || s.where !== w.where)
      return `Пульт заблокирован: сначала выполните SELECT … FROM ${w.table} WHERE ${w.where} — с тем же условием.`;
    return null;
  }

  const execute = (text, opt) => exclusive(() => execute0(text, opt));
  async function execute0(text, opt) {
    const prev = S.snap;
    // запомнить последний SELECT с условием — сразу после каждой команды
    const res = await run(text, {
      guard: opt.guard ? guard : null,
      after: r => {
        if (r.ok && r.kind === 'SELECT') {
          const w = whereOf(r.sql);
          S.lastSelect = w ? {table: w.table, where: w.where, n: r.rows.length} : null;
        }
        if (r.ok && (r.kind === 'UPDATE' || r.kind === 'DELETE') && S.lastSelect) {
          const w = whereOf(r.sql);
          if (w && w.where && w.where === S.lastSelect.where && w.table === S.lastSelect.table)
            r.cmp = {sel: S.lastSelect.n, got: r.affected};
        }
      },
    });
    S.snap = await snapshot(LAB.tables);
    const d = diff(prev, S.snap);
    printConsole(res);
    const bad = res.find(r => !r.ok);
    const anim = $('anim').checked;
    if (!empty(d)) await LAB.scene.animate(prev, S.snap, d, anim, S.D);
    const sel = [...res].reverse().find(r => r.ok && r.kind === 'SELECT');
    if (sel && LAB.scene.showResult) LAB.scene.showResult(sel, S.D, S.snap);
    if (bad && bad.err) {
      bigstamp(ERR_LABEL[bad.err.type] || 'Отказ', bad.err.constraint || bad.err.column || '');
      if (LAB.scene.reject) LAB.scene.reject(bad, S.D);
      msg(`Отказ СУБД: ${esc(bad.err.ru || bad.err.message)}`, 'bad');
    } else if (bad && bad.blocked) {
      msg(esc(bad.blocked), 'bad');
    } else {
      const last = res[res.length - 1];
      if (last) msg(LAB.okMsg ? LAB.okMsg(res, d, S.D) : esc(last.tag || 'Выполнено'), 'info');
    }
    S.lastRun = res;
    return res;
  }

  function printConsole(res) {
    const box = $('console');
    box.innerHTML =
      res
        .map(r => {
          let a;
          if (r.blocked) a = `<div class="a bad">${esc(r.blocked)}</div>`;
          else if (!r.ok)
            a = `<div class="a bad"><span class="stamp">${esc(ERR_LABEL[r.err.type] || 'Отказ')}</span>ERROR: ${esc(r.err.message)}</div>
        ${r.err.detail ? `<div class="q">DETAIL: ${esc(r.err.detail)}</div>` : ''}
        ${r.err.ru ? `<div class="ex">${esc(r.err.ru)}</div>` : ''}`;
          else {
            a = `<div class="a ok">${esc(r.tag)}</div>`;
            if (r.cmp)
              a += `<div class="ex">${r.cmp.sel === r.cmp.got ? '✓' : '✗'} SELECT с тем же условием вернул ${r.cmp.sel}, команда затронула ${r.cmp.got}${r.cmp.sel === r.cmp.got ? ' — совпало.' : ' — числа разошлись: данные менялись между SELECT и командой, или условие не то.'}</div>`;
            if (r.rows && r.fields && r.fields.length) a += table(r.rows, r.fields);
            if (r.meta && r.meta.extra)
              r.meta.extra.forEach(x => {
                if (x.rows.length) a += `<div class="q" style="margin-top:4px">${esc(x.title)}:</div>` + table(x.rows, x.fields);
              });
          }
          return `<div class="cl"><div class="q">${esc(r.sql.length > 300 ? r.sql.slice(0, 300) + '…' : r.sql)}</div>${a}</div>`;
        })
        .join('') || '<div class="cl"><div class="q">Пусто: нет ни одной команды.</div></div>';
  }
  function table(rows, fields) {
    const lim = 60;
    return `<table class="rt"><tr>${fields.map(f => `<th>${esc(f)}</th>`).join('')}</tr>${rows
      .slice(0, lim)
      .map(
        r =>
          `<tr>${fields.map(f => (r[f] === null ? '<td class="null">NULL</td>' : `<td>${esc(r[f] instanceof Date ? r[f].toISOString().slice(0, 16).replace('T', ' ') : r[f])}</td>`)).join('')}</tr>`,
      )
      .join('')}</table>
      ${rows.length > lim ? `<div class="q">… ещё ${rows.length - lim}</div>` : ''}`;
  }

  function bigstamp(t, small, ok) {
    if (!$('anim').checked && !ok) return;
    const el = document.createElement('div');
    el.className = 'bigstamp' + (ok ? ' ok' : '');
    el.innerHTML = esc(t) + (small ? `<small>${esc(small)}</small>` : '');
    document.querySelector('.scene-box').appendChild(el);
    setTimeout(() => el.remove(), 1900);
  }

  async function runEditor() {
    if (S.busy || !db) return;
    const text = $('sql').value;
    if (!text.trim()) return;
    S.busy = true;
    $('runBtn').disabled = true;
    try {
      if (LAB.scene.clearResult) LAB.scene.clearResult();
      const res = await execute(text, {guard: S.tab === 'shift' || S.tab === 'control' || S.tab === 'brief'});
      const out = res.length ? (res.find(r => !r.ok) ? 'отказ' : res[res.length - 1].tag) : '';
      journal(S.tab, text, out);
      if (S.tab === 'shift') await afterLevelRun(res);
      else persist();
    } catch (e) {
      console.error(e);
      msg('Внутренняя ошибка тетради: ' + esc(e.message), 'bad');
    } finally {
      S.busy = false;
      $('runBtn').disabled = false;
    }
  }

  // проверка уровня
  async function checkLevel(L, res) {
    if (L.check === 'state') {
      const cur = await snapshot(L.tables.map(n => LAB.tables.find(t => t.name === n)));
      const cmp = compare(cur, L._target, L.ignore || {});
      if (cmp.ok && L.also) {
        const a = L.also(res, S, cmp);
        if (a !== true) return {ok: false, msg: a, cmp};
      }
      return {ok: cmp.ok, cmp};
    }
    if (L.check === 'result') {
      const sel = [...res].reverse().find(r => r.ok && r.kind === 'SELECT');
      if (!sel) return {ok: false, msg: 'Нужен запрос SELECT: проверяется его ответ.'};
      return LAB.compareResult(L, sel, L._tres, S.D);
    }
    if (L.check === 'custom') return L.verify(res, S, db);
    return {ok: false};
  }

  async function afterLevelRun(res) {
    const L = S.L;
    const st = (S.P.levels[S.lv] = S.P.levels[S.lv] || {runs: 0, fails: 0});
    st.runs++;
    const r = await checkLevel(L, res);
    if (LAB.scene.clearMarks) LAB.scene.clearMarks();
    if (r.ok) {
      if (!st.done) {
        st.done = true;
        st.at = new Date().toISOString();
        st.sql = $('sql').value;
        st.tag = res.map(x => (x.ok ? x.tag : 'ERROR: ' + (x.err ? x.err.message : ''))).join(' · ');
        st.mins = Math.max(1, Math.round((Date.now() - S.levelStart) / 60000));
        st.hint = !!S.hinted;
        st.fails = S.fails;
        if (r.note) st.note = r.note;
      }
      persist();
      bigstamp(L.okStamp || 'Выполнено', '', true);
      renderSide(`<div class="good">${esc(L.okMsg || 'Уровень пройден.')}</div>${r.extra || ''}`);
      if (LAB.scene.celebrate) LAB.scene.celebrate(L, S.D);
      msg('Уровень пройден.', 'ok');
    } else {
      S.fails++;
      st.fails = (st.fails || 0) + 1;
      persist();
      let out = '';
      if (r.msg) out += `<div class="badbox">${r.msg}</div>`;
      if (r.cmp && !r.cmp.ok) {
        out += `<div class="badbox">Пока не совпадает с целью.${diffText(r.cmp)}</div>`;
        if (LAB.scene.showDiff) LAB.scene.showDiff(r.cmp, S.D);
      }
      if (r.html) out += r.html;
      if (!out && res.some(x => !x.ok)) out = '<div class="badbox">Команда не выполнена — см. ответ СУБД слева.</div>';
      renderSide(out);
      showTargetMarks();
      if (r.cmp && LAB.scene.showDiff) LAB.scene.showDiff(r.cmp, S.D);
      if (r.marks && LAB.scene.marks) LAB.scene.marks(r.marks, S.D);
    }
  }
  function diffText(cmp) {
    const f = row =>
      Object.entries(row)
        .slice(0, 4)
        .map(([k, v]) => `${k}=${v === null ? 'NULL' : v instanceof Date ? v.toISOString().slice(0, 16) : v}`)
        .join(', ');
    const lines = [];
    cmp.missing.slice(0, 8).forEach(x => lines.push(`<div class="m">не хватает · ${esc(x.t)}: ${esc(f(x.row))}</div>`));
    cmp.extra.slice(0, 8).forEach(x => lines.push(`<div class="x">лишнее · ${esc(x.t)}: ${esc(f(x.row))}</div>`));
    cmp.wrong
      .slice(0, 8)
      .forEach(x =>
        lines.push(
          `<div class="w">не то значение · ${esc(x.t)} ${esc(LAB.tables.find(t => t.name === x.t).pk)}=${esc(x.a[LAB.tables.find(t => t.name === x.t).pk])}: ${x.cols.map(c => `${esc(c)} = ${esc(x.a[c] === null ? 'NULL' : x.a[c])}, нужно ${esc(x.b[c] === null ? 'NULL' : x.b[c])}`).join('; ')}</div>`,
        ),
      );
    const more = cmp.missing.length + cmp.extra.length + cmp.wrong.length - lines.length;
    return `<div class="difflist">${lines.join('')}${more > 0 ? `<div>… и ещё ${more}</div>` : ''}</div>`;
  }

  // ─────────────────────────────────────────────────── протокол ──
  function renderProto() {
    const P = S.P;
    const sec = $('protoSec');
    const done = S.levels.filter((l, i) => !l.bonus && (P.levels[i] || {}).done).length;
    const main = S.levels.filter(l => !l.bonus).length;
    const grade = LAB.grading(S);
    const total = grade.reduce((s, g) => s + (g.ok ? g.pts : 0), 0);
    const max = grade.reduce((s, g) => s + g.pts, 0);
    const mark = total >= 9 ? '5' : total >= 7 ? '4' : total >= 6 ? '3' : 'на доработку';
    const pastes = P.journal.filter(j => j.p).length;
    const fmt = s => (s ? new Date(s).toLocaleString('ru-RU', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'}) : '');
    sec.innerHTML = `<div class="noprint" style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="pbtn y" onclick="window.print()">Печать / PDF</button>
        <button class="pbtn" id="copyBtn">Скопировать протокол текстом</button>
        <span class="muted" style="align-self:center">Протокол собирается сам из того, что вы сделали. Заполните ФИО и ответы на вопросы.</span></div>
      <div class="proto" id="protoDoc">
        <div class="peye">ФГАОУ ВО «Тюменский государственный университет» · Колледж ИИ · ОПЦ.07</div>
        <h2>Протокол смены · ЛР-${LAB.no} «${esc(LAB.lrTitle)}»</h2>
        <div class="meta">
          <span>Студент</span><span><input class="fio" id="fio" value="${esc(P.fio || '')}" placeholder="Фамилия И. О., группа"></span>
          <span>Вариант</span><span>${esc(LAB.badge(S.D, S.seed))}</span>
          <span>Смена начата</span><span>${fmt(P.started)}</span>
          <span>Уровни</span><span>${done} из ${main} обязательных${S.levels.some(l => l.bonus) ? ` · бонусных: ${S.levels.filter((l, i) => l.bonus && (P.levels[i] || {}).done).length}` : ''}</span>
          <span>Контрольный рейс</span><span>${P.control.done ? '<span class="yes">принят</span>' : P.control.attempts ? '<span class="no">не принят</span>' : 'не сдавался'}${P.control.attempts ? ` · попыток: ${P.control.attempts}` : ''}</span>
          <span>Журнал</span><span>запусков: ${P.journal.length}${pastes ? ` · со вставкой из буфера: ${pastes}` : ''}</span>
        </div>
        <h3>Предсказания</h3>
        <table><tr><th>№</th><th>Команда</th><th>Ответ студента</th><th>Что сделала СУБД</th><th></th></tr>
        ${S.predicts
          .map((p, i) => {
            const r = P.pred[i];
            const lab = k => (p.choices ? (p.choices.find(c => c.k === k) || {}).t || k : k);
            return `<tr><td>${i + 1}</td><td><pre>${esc(p.sql)}</pre></td><td>${r ? esc(lab(r.choice)) : '—'}</td><td>${r ? esc(lab(r.actual)) : '—'}</td><td>${r ? (r.right ? '<span class="yes">✓</span>' : '<span class="no">✗</span>') : ''}</td></tr>`;
          })
          .join('')}
        </table>
        <h3>Уровни смены</h3>
        <table><tr><th>№</th><th>Задача</th><th>Решение (последний верный запуск)</th><th>Ответ СУБД</th><th>Промахов</th></tr>
        ${S.levels
          .map((l, i) => {
            const r = P.levels[i] || {};
            return `<tr><td>${l.bonus ? '★' : ''}${l.n}</td><td>${esc(l.title)}${l.lab ? `<div class="muted">${esc(l.lab)}</div>` : ''}</td>
            <td>${r.done ? `<pre>${esc(r.sql)}</pre>` : '<span class="no">не пройден</span>'}</td><td><pre>${esc(r.note || r.tag || '')}</pre></td>
            <td>${r.done ? (r.fails || 0) + (r.hint ? ' · подсказка' : '') : ''}</td></tr>`;
          })
          .join('')}
        </table>
        <h3>Контрольный рейс</h3>
        <table><tr><th>Задача</th><th>Решение на момент сдачи</th><th>Итог</th></tr>
          <tr><td>${esc(S.controls[0].title)}</td><td><pre>${esc(P.control.sql || '')}</pre></td><td>${P.control.done ? '<span class="yes">принят</span>' : P.control.attempts ? '<span class="no">не принят</span>' : '—'}</td></tr></table>
        <h3>Ответы на вопросы</h3>
        ${LAB.questions.map((q, i) => `<div class="q"><b>${i + 1}. ${esc(q)}</b><textarea data-a="${i}">${esc(P.answers[i] || '')}</textarea></div>`).join('')}
        <h3>Оценка</h3>
        <table><tr><th>Позиция</th><th>Балл</th><th></th></tr>
        ${grade.map(g => `<tr><td>${esc(g.t)}</td><td>${g.pts}</td><td>${g.ok ? '<span class="yes">засчитано</span>' : g.manual ? 'проверяет преподаватель' : '<span class="no">нет</span>'}</td></tr>`).join('')}
        <tr><td>Защита: изменить своё решение по просьбе преподавателя</td><td>обяз.</td><td></td></tr></table>
        <div class="score"><div>Автоматически: ${total} из ${max}</div><div>Отметка по баллам: ${mark}</div></div>
        <p class="muted" style="margin-top:8px">Баллы за ответы на вопросы ставит преподаватель. Отметка выставляется после защиты.</p>
        <div class="meta" style="margin-top:22px"><span>Проверил</span><span>Алёшкин А. А. ______________</span></div>
      </div>`;
    $('fio').oninput = e => {
      P.fio = e.target.value;
      persist();
    };
    sec.querySelectorAll('[data-a]').forEach(
      t =>
        (t.oninput = () => {
          P.answers[t.dataset.a] = t.value;
          persist();
        }),
    );
    $('copyBtn').onclick = () => {
      const txt = $('protoDoc').innerText;
      navigator.clipboard &&
        navigator.clipboard.writeText(txt).then(() => {
          $('copyBtn').textContent = 'Скопировано';
        });
    };
  }

  // ──────────────────────────────────────────────────── API для сцен ──
  const api = {
    msg,
    showCard,
    esc,
    sleep,
    checkNow: () => afterLevelRun(S.lastRun || []),
    anim: () => $('anim').checked,
    get S() {
      return S;
    },
    bigstamp,
    get LAB() {
      return LAB;
    },
  };

  async function start(lab) {
    LAB = lab;
    shell();
    const seed = load('air-seed', null);
    if (seed === null) askSeed();
    else await enter(seed);
  }

  return {
    $,
    esc,
    sleep,
    rng,
    person,
    SURN,
    INIT,
    CITIES,
    lit,
    splitSQL,
    kindOf,
    whereOf,
    explainErr,
    boot,
    ready,
    run,
    snapshot,
    diff,
    compare,
    start,
    plural,
    norm,
    get db() {
      return db;
    },
    api,
  };
})();
