// Коэффициент доверия: похоже ли, что команду набирали, думая, а не переписывали с телефона или из другой вкладки.
// Каждая ошибка набора не важна — по уровню считается одно число 0–100, по лабе — среднее, взвешенное длиной набора.
// Это подсказка преподавателю, к кому подойти, а не доказательство: студент своё число не видит.
//
// Признаки переписывания (по опыту пар):
//   line   — текст набран подряд слева направо, ни одного возврата внутрь уже написанного;
//   clean  — почти без исправлений (Backspace/Delete);
//   glance — длинные паузы посреди слова: человек поднял глаза на другой экран и ищет, где остановился;
//   wait   — долго ничего, затем сразу верный запрос с первого запуска;
//   dead   — остановка больше 30 с посреди набора, хотя вкладка не покидалась;
//   away   — уходы со вкладки на уровне; ins — текст появился без клавиатуры; paste — попытки вставки.
const WORD = /[\wА-яЁё]/;
export const WHY = {
  line: 'набор подряд, без возвратов внутрь текста',
  clean: 'почти без исправлений',
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
  mid: 0,
  pauses: 0,
  midWord: 0,
  runs: 0,
  dead: 0,
  awayMs: 0,
  ins: 0,
  paste: 0,
  skip: false,
});

// чистая функция — её проверяет tests/trust.test.mjs
export function scoreLevel(m, runs = 1, touch = false) {
  const pen = {};
  if (m.ins) pen.ins = 45;
  if (m.paste) pen.paste = 15;
  if (m.awayMs > 8000) pen.away = Math.min(35, Math.round(10 + m.awayMs / 3000));
  if (m.n >= 25) {
    const typing = {};
    if (m.n >= 40 && m.mid / m.n < 0.02 && !touch) typing.line = 15;
    if (m.n >= 40 && m.del / m.n < 0.02) typing.clean = 10;
    if (m.pauses >= 4 && m.midWord / m.pauses >= 0.35 && !touch) typing.glance = 20;
    if (m.n >= 40 && m.first && m.first - m.t0 > 90000 && runs <= 1) typing.wait = 15;
    if (m.dead && runs <= 1) typing.dead = 10;
    // много запусков — значит, пробовал и смотрел ответы: набор весит меньше
    const k = runs >= 3 ? 0.7 : 1;
    for (const [c, v] of Object.entries(typing)) pen[c] = Math.round(v * k);
  } else if (!Object.keys(pen).length) return null; // набрано слишком мало, чтобы судить
  const s = Math.max(0, 100 - Object.values(pen).reduce((a, b) => a + b, 0));
  return {s, why: Object.keys(pen), n: m.n};
}
// по всей лабе: уровни с оценкой, вес — длина набора (не меньше 25 знаков)
export function scoreLab(recs) {
  const xs = recs.filter(r => r && r.tr != null);
  if (!xs.length) return null;
  const w = r => Math.max(25, r.tn || 0);
  const W = xs.reduce((a, r) => a + w(r), 0);
  const s = Math.round(xs.reduce((a, r) => a + r.tr * w(r), 0) / W);
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
      cur.last = now;
      return;
    }
    if (!/^insert(Text|CompositionText|LineBreak|ReplacementText)$/.test(t)) return;
    const data = t === 'insertLineBreak' ? '\n' : e.data || '';
    if (!data || data.length > 15) return; // длинный кусок без клавиш — его учитывает защита от вставки
    const at = ta.selectionStart,
      before = ta.value.slice(0, at);
    if (ta.value.slice(ta.selectionEnd).trim()) cur.mid += data.length;
    if (!cur.first) cur.first = now;
    else if (!cur.skip) {
      const gap = now - cur.last;
      if (gap > 30000 && before.trim()) cur.dead++;
      else if (gap > 1500) {
        cur.pauses++;
        if (WORD.test(before.slice(-1)) && WORD.test(data[0])) cur.midWord++;
      }
    }
    cur.skip = false;
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
    },
    flag(k) {
      cur[k]++;
    },
    ran() {
      cur.runs++; // нажатия «Пуск» на уровне (команд в одном запуске может быть несколько)
    },
    finish() {
      return scoreLevel(cur, cur.runs, touch);
    },
  };
}
