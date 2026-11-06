// Коэффициент доверия: похоже ли, что команду набирали, думая, а не переписывали с телефона или из другой вкладки.
// Несколько признаков сразу весят больше суммы; по лабе учитывается и худший уровень.
// Каждая ошибка набора не важна — по уровню считается одно число 0–100, по лабе — среднее, взвешенное длиной набора.
// Это подсказка преподавателю, к кому подойти, а не доказательство: студент своё число не видит.
//
// Признаки переписывания (по опыту пар):
//   line   — текст набран подряд слева направо, ни одного возврата внутрь уже написанного;
//   rework — ни одной переделки: стирались только опечатки (1–3 знака сразу после набора),
//            ни разу не стёрт кусок/слово и не правилась середина. Опечатки при переписывании
//            с телефона как раз частые — поэтому считаем не удаления вообще, а переделки;
//   rhythm — ровный «кусочный» ритм: короткие паузы 0,6–2,5 с (взгляд на телефон) и между ними
//            рывки примерно одной длины — так читают и переносят текст по кускам;
//   glance — длинные паузы посреди слова: человек поднял глаза на другой экран и ищет, где остановился;
//   wait   — долго ничего, затем сразу верный запрос с первого запуска;
//   dead   — остановка больше 30 с посреди набора, хотя вкладка не покидалась;
//   away   — уходы со вкладки на уровне; ins — текст появился без клавиатуры; paste — попытки вставки.
const WORD = /[\wА-яЁё]/;
export const WHY = {
  line: 'набор подряд, без возвратов внутрь текста',
  rework: 'правились только опечатки, ни одной переделки',
  rhythm: 'ровный ритм кусками, как при переписывании',
  glance: 'паузы посреди слов, как при переписывании',
  wait: 'долго ничего, затем сразу верный запрос',
  dead: 'долгие остановки посреди набора',
  away: 'уходы со вкладки',
  ins: 'текст появлялся без клавиатуры',
  paste: 'попытки вставки',
};
const fresh = key => ({
  key,
  t0: Date.now(),
  first: 0,
  last: 0,
  n: 0,
  del: 0,
  rework: 0,
  dRun: 0,
  mid: 0,
  chunks: [],
  burst: 0,
  pauses: 0,
  midWord: 0,
  runs: 0,
  dead: 0,
  awayMs: 0,
  ins: 0,
  paste: 0,
  skip: false,
  tk: '',
  td: [],
  tl: 0,
});

// Трасса набора для разбора алгоритма (уходит на сервер, выгружается обезличенно).
// Самих символов в ней нет — только вид нажатия и пауза перед ним (в 50 мс, не больше 60 с):
//   a — буква/цифра, s — пробел/знак, n — перенос строки, m — вставка внутрь написанного,
//   b — удаление знака, x — удаление куска/слова, w — вернулся на вкладку, r — «Пуск»
const TMAX = 3000;
function mark(cur, k, now) {
  if (cur.tk.length >= TMAX) return;
  cur.tk += k;
  cur.td.push(Math.min(1200, Math.round((now - (cur.tl || cur.t0)) / 50)));
  cur.tl = now;
}
export const kindOf = ch => (ch === '\n' ? 'n' : WORD.test(ch) ? 'a' : 's');

// чистая функция — её проверяет tests/trust.test.mjs
export function scoreLevel(m, runs = 1, touch = false) {
  const pen = {};
  if (m.ins) pen.ins = 45;
  if (m.paste) pen.paste = 15;
  if (m.awayMs > 8000) pen.away = Math.min(35, Math.round(10 + m.awayMs / 3000));
  if (m.n >= 25) {
    const typing = {};
    if (m.n >= 40 && m.mid / m.n < 0.05 && !touch) typing.line = 15;
    if (m.n >= 60 && !m.rework) typing.rework = 15;
    if (!touch && rhythmic(m.chunks || [])) typing.rhythm = 20;
    if (m.pauses >= 4 && m.midWord / m.pauses >= 0.35 && !touch) typing.glance = 20;
    if (m.n >= 40 && m.first && m.first - m.t0 > 90000 && runs <= 1) typing.wait = 15;
    if (m.dead && runs <= 1) typing.dead = 10;
    // много запусков с переделками — пробовал и смотрел ответы: набор весит меньше.
    // Без переделок лишние запуски — это обычно опечатки при переписывании, скидки нет.
    const k = runs >= 3 && m.rework ? 0.7 : 1;
    const cs = Object.keys(typing);
    for (const c of cs) pen[c] = Math.round(typing[c] * k);
    // независимые признаки сошлись — это сильнее, чем каждый по отдельности
    if (cs.length >= 2) pen[cs[0]] += Math.round(10 * (cs.length - 1) * k);
  } else if (!Object.keys(pen).length) return null; // набрано слишком мало, чтобы судить
  const s = Math.max(0, 100 - Object.values(pen).reduce((a, b) => a + b, 0));
  return {s, why: Object.keys(pen), n: m.n};
}
// ровный кусочный ритм: ≥5 рывков между короткими паузами, рывки 4–20 знаков,
// разброс их длины мал (коэффициент вариации < 0,5)
export function rhythmic(ch) {
  if (ch.length < 5) return false;
  const avg = ch.reduce((a, b) => a + b, 0) / ch.length;
  if (avg < 4 || avg > 20) return false;
  const sd = Math.sqrt(ch.reduce((a, b) => a + (b - avg) ** 2, 0) / ch.length);
  return sd / avg < 0.5;
}
// по всей лабе: среднее (вес — длина набора, не меньше 25 знаков) пополам с худшим уровнем,
// иначе честно сделанные простые уровни «разбавляют» переписанные трудные
export function scoreLab(recs) {
  const xs = recs.filter(r => r && r.tr != null);
  if (!xs.length) return null;
  const w = r => Math.max(25, r.tn || 0);
  const W = xs.reduce((a, r) => a + w(r), 0);
  const mean = xs.reduce((a, r) => a + r.tr * w(r), 0) / W;
  const long = xs.filter(r => (r.tn || 0) >= 40);
  const worst = Math.min(...(long.length ? long : xs).map(r => r.tr));
  const s = Math.round((mean + worst) / 2);
  const cnt = {};
  xs.forEach(r =>
    String(r.tw || '')
      .split(',')
      .filter(Boolean)
      .forEach(c => (cnt[c] = (cnt[c] || 0) + 1)),
  );
  const why = Object.keys(cnt)
    .filter(c => c === 'ins' || cnt[c] >= Math.max(1, xs.length / 4))
    .sort((a, b) => cnt[b] - cnt[a]);
  return {s, why, n: xs.length};
}

export function watchTyping(ta) {
  let cur = fresh(null);
  const touch = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
  ta.addEventListener('beforeinput', e => {
    const t = e.inputType || '',
      now = Date.now();
    if (/^delete/.test(t)) {
      cur.del++;
      const sel = ta.selectionEnd - ta.selectionStart;
      // стёрт кусок/слово или правится середина — это переделка, а не опечатка
      if (sel >= 4 || /Word|Line|Soft|Hard/.test(t) || (t === 'deleteContentBackward' && ta.value.slice(ta.selectionEnd).trim()))
        cur.rework++, mark(cur, 'x', now);
      else (cur.dRun += Math.max(1, sel)), mark(cur, 'b', now);
      cur.last = now;
      return;
    }
    if (!/^insert(Text|CompositionText|LineBreak|ReplacementText)$/.test(t)) return;
    const data = t === 'insertLineBreak' ? '\n' : e.data || '';
    if (!data || data.length > 15) return; // длинный кусок без клавиш — его учитывает защита от вставки
    const at = ta.selectionStart,
      before = ta.value.slice(0, at);
    if (cur.dRun >= 4) cur.rework++; // стёр подряд 4+ знака Backspace'ом
    cur.dRun = 0;
    if (ta.value.slice(ta.selectionEnd).trim()) {
      if (!cur.midNow) cur.rework++; // вернулся внутрь написанного и дописал
      cur.midNow = true;
      cur.mid += data.length;
      mark(cur, 'm', now);
    } else (cur.midNow = false), mark(cur, kindOf(data[0]), now);
    if (!cur.first) cur.first = now;
    else if (!cur.skip) {
      const gap = now - cur.last;
      if (gap > 600 && gap <= 2500) {
        if (cur.burst) cur.chunks.push(cur.burst);
        cur.burst = 0;
      } else if (gap > 2500) cur.burst = 0; // долгая пауза — думал, рывок не считаем
      if (gap > 30000 && before.trim()) cur.dead++;
      else if (gap > 1500) {
        cur.pauses++;
        if (WORD.test(before.slice(-1)) && WORD.test(data[0])) cur.midWord++;
      }
    } else cur.burst = 0;
    cur.skip = false;
    cur.burst += data.length;
    cur.n += data.length;
    cur.last = now;
  });
  return {
    get cur() {
      return cur; // для автотестов (window.LAB.trust)
    },
    level(key) {
      if (cur.key !== key) cur = fresh(key); // «начать уровень заново» признаки не сбрасывает
    },
    away(ms) {
      cur.awayMs += ms;
      cur.skip = true; // пауза, пока студент был в другом окне, — не пауза набора
      mark(cur, 'w', Date.now());
    },
    flag(k) {
      cur[k]++;
    },
    ran() {
      cur.runs++; // нажатия «Пуск» на уровне (команд в одном запуске может быть несколько)
      mark(cur, 'r', Date.now());
    },
    finish() {
      return scoreLevel(cur, cur.runs, touch);
    },
    // сырые данные уровня: счётчики и трасса — для обезличенной выгрузки (server/labsrv.py, /api/admin/traces)
    trace() {
      const c = {};
      for (const k of ['n', 'del', 'rework', 'mid', 'pauses', 'midWord', 'runs', 'dead', 'awayMs', 'ins', 'paste']) c[k] = cur[k];
      c.firstMs = cur.first ? cur.first - cur.t0 : null;
      c.totalMs = Date.now() - cur.t0;
      return {c, chunks: cur.chunks.slice(0, 300), k: cur.tk, d: cur.td, touch};
    },
  };
}
