// Группы сквозных тестов: в CI каждая группа идёт отдельной параллельной задачей,
// а в pull request запускаются только группы, которых касаются изменённые файлы.
//   node tests/e2e.mjs --group pizza          — прогнать одну группу
//   git diff --name-only … | node tests/e2e-groups.mjs   — какие группы нужны (JSON-массив)
// Проверка, не вошедшая ни в одну группу, попадает в «other» — новая проверка не потеряется.
const range = (a, b) => Array.from({length: b - a + 1}, (_, i) => 'lr' + (a + i));

export const GROUPS = {
  airport: [...range(13, 16), ...range(13, 16).map(l => l + '-practice'), 'labs-lr13', 'labs-lr14', 'labs-lr16', 'mvp', 'hub'],
  pizza: [...range(17, 20), ...range(17, 19).map(l => l + '-practice')],
  library: [...range(21, 24), 'lr21-practice', 'lr22-practice'],
  other: null, // всё остальное: город, главная, телефон, доступ к лабам, сервер, пульт
};

// какие проверки входят в группу (jobs — все имена проверок из e2e.mjs)
export function jobsOf(group, jobs) {
  if (!(group in GROUPS)) throw new Error(`Нет группы «${group}». Есть: ${Object.keys(GROUPS).join(', ')}`);
  const taken = new Set(Object.values(GROUPS).flat().filter(Boolean));
  const own = name => !name.startsWith('old-');
  return GROUPS[group] ? GROUPS[group].filter(j => jobs.includes(j)) : jobs.filter(j => own(j) && !taken.has(j));
}

// изменённый файл → группы; лаба тянет и «other» (главная, карта города, телефон ссылаются на лабы). Общий код (common/, vendor/, сборка, сами тесты) задевает всё.
const RULES = [
  [/^lr1[3-6]-3d\/|^airport\/|^labs\/|^mvp\//, ['airport', 'other']],
  [/^lr(1[7-9]|20)-3d\/|^pizza\//, ['pizza', 'other']],
  [/^lr2[1-4]-3d\/|^library\//, ['library', 'other']],
  [/^teacher\/|^server\/|^index\.html$/, ['other']],
  [/\.md$|^_архив\/|^\.claude\/|^tests\/(?!e2e)/, []], // описания, архив и юнит-тесты браузером не проверяются
];
export function groupsFor(files) {
  const need = new Set();
  for (const f of files) {
    const rule = RULES.find(([re]) => re.test(f));
    if (!rule) return Object.keys(GROUPS); // общий код — прогнать всё
    rule[1].forEach(g => need.add(g));
  }
  return Object.keys(GROUPS).filter(g => need.has(g));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const files = Buffer.concat(chunks)
    .toString('utf8')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  console.log(JSON.stringify(groupsFor(files)));
}
