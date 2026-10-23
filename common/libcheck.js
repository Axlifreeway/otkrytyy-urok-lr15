// Проверки уровней на планы (ЛР-22, ЛР-23): какие EXPLAIN выполнены и что в их планах.
// trail — ход команд уровня (G.trail в common/qlab.js): у EXPLAIN есть plan {nodes, time, removed, analyze, text}.

// успешные EXPLAIN, запрос которых подходит под cond (регулярное выражение по тексту команды)
export const explains = (trail, cond) => trail.filter(x => x.kind === 'EXPLAIN' && !x.code && x.plan && cond.test(x.sql));
// способ чтения таблицы t в плане: 'Seq Scan', 'Index Scan using pk_book' …
export const readOf = (plan, t) => {
  const n = plan.nodes.find(x => x.table === t);
  return n ? n.kind + (n.index ? ' using ' + n.index : '') : '';
};
export const byIndex = (plan, t, ix) => plan.nodes.some(n => n.table === t && n.index && (!ix || n.index === ix));
// уровень «EXPLAIN и EXPLAIN ANALYZE одного запроса»: cond — какой запрос, t — таблица, о которой спрашивают
export const planPair = (cond, t, what) => c => {
  const ex = explains(c.trail, cond);
  if (!ex.length) return null;
  const plain = ex.find(x => !x.plan.analyze),
    an = ex.find(x => x.plan.analyze);
  if (!plain) return {wait: 'EXPLAIN ANALYZE есть — выполните и просто EXPLAIN того же запроса: он показывает план, ничего не выполняя.'};
  if (!an) return {wait: `План: ${readOf(plain.plan, t)}. Теперь EXPLAIN ANALYZE того же запроса — запишите время (Execution Time).`};
  return {
    ok: true,
    note: `${what}: ${readOf(an.plan, t)} · ${an.plan.time} ms${an.plan.removed ? ` · зря прочитано ${an.plan.removed}` : ''}`,
  };
};
