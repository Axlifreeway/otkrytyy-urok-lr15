// Проверка состояния базы после команды: что уже сделано, что ещё нет, что сделано неверно.
// Строка считается «ещё не сделанной», если она такая же, как в начале уровня;
// «неверной» — если изменилась, но не так, как в цели (или появилась/пропала зря).
const HOMO = {'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H', 'К': 'K', 'М': 'M', 'О': 'O', 'Р': 'P', 'Т': 'T', 'Х': 'X', 'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x', 'у': 'y'};
const lat = v => String(v ?? '').replace(/[АВСЕНКМОРТХасеорху]/g, c => HOMO[c]);
const keyed = (rows, pk) => new Map(rows.map(r => [String(r[pk]), JSON.stringify(r)]));
export const fmtv = v => v === null || v === undefined ? 'NULL' : typeof v === 'string' ? `'${v}'` : String(v);

export function judge(cur, tgt, start, tables, TABLES) {
  const wrong = [], pending = [];
  tables.forEach(t => {
    const pk = TABLES[t], C = keyed(cur[t], pk), T = keyed(tgt[t], pk), S = keyed(start[t], pk);
    new Set([...C.keys(), ...T.keys(), ...S.keys()]).forEach(k => {
      const c = C.get(k), g = T.get(k), s = S.get(k);
      if (c === g) return;
      if (c === s) { pending.push({t, k}); return; }
      if (c && !g && s) { pending.push({t, k}); return; }   // строку ещё предстоит удалить — изменения в ней не важны
      wrong.push({t, k, c: c ? JSON.parse(c) : null, g: g ? JSON.parse(g) : null});
    });
  });
  return {ok: !wrong.length && !pending.length, wrong, pending};
}

function homo(a, b) {
  a = String(a); b = String(b);
  const i = [...a].findIndex((c, k) => c !== [...b][k]);
  const ch = [...a][i] || '', ru = /[А-яЁё]/.test(ch);
  return ` Буква «${ch}» набрана в ${ru ? 'русской' : 'английской'} раскладке — на экране она такая же, но для базы это другой символ.`;
}

// понятное описание расхождений (не больше max пунктов)
export function describe(wrong, max = 4) {
  const out = [];
  for (const w of wrong) {
    if (out.length >= max) { out.push(`…и ещё ${wrong.length - max}`); break; }
    const where = `${w.t} ${w.k}`;
    if (w.c && !w.g) { out.push(`${where}: такой строки нет в задании — проверьте ключ и значения`); continue; }
    if (!w.c && w.g) { out.push(`${where}: строка пропала, а должна остаться`); continue; }
    const cols = Object.keys(w.g).filter(c => JSON.stringify(w.c[c]) !== JSON.stringify(w.g[c]));
    out.push(cols.map(c => {
      const a = w.c[c], b = w.g[c];
      const h = a != null && b != null && lat(a) === lat(b) ? homo(a, b) : '';
      return `${where}: ${c} = ${fmtv(a)}, а нужно ${fmtv(b)}.${h}`;
    }).join(' '));
  }
  return out;
}
// строка из цели, похожая на лишнюю по ключу (опечатка в ключе, раскладка)
export function keyHint(wrong, pending = []) {
  const extra = wrong.filter(w => w.c && !w.g), miss = wrong.filter(w => !w.c && w.g).concat(pending);
  for (const x of extra) { const m = miss.find(y => y.t === x.t && lat(y.k) === lat(x.k)); if (m) return `Ключ ${fmtv(x.k)} в ${x.t} набран не так, как в документе (${fmtv(m.k)}).${homo(x.k, m.k)}`; }
  return '';
}
