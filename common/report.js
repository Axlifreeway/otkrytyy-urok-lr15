// Отчёт преподавателю: снимок протокола (HTML со стилями, поля ввода заменены текстом) уходит на сервер,
// преподаватель открывает его в панели. Печатать и пересылать файлы больше не нужно.
// Модуль без зависимостей от лабы: им пользуются и 3D-лабы (shell.js), и тетради (labs/core.js через import()).

// стили страницы, нужные протоколу: все правила своих таблиц стилей (чужие, например шрифты Google, недоступны — пропускаем)
function pageCss() {
  let css = '';
  for (const sh of document.styleSheets) {
    try {
      for (const r of sh.cssRules) {
        if (r.media && /print/.test(r.media.mediaText)) continue; // печать страницы лабы прячет всё, кроме окна протокола
        css += r.cssText + '\n';
      }
    } catch (e) {
      /* таблица с другого сайта */
    }
  }
  return css;
}

// doc — элемент протокола; textarea и input превращаются в текст (в снимке ничего не редактируется)
export function snapshotHtml(doc, title) {
  const copy = doc.cloneNode(true);
  const src = doc.querySelectorAll('textarea, input'),
    dst = copy.querySelectorAll('textarea, input');
  dst.forEach((el, i) => {
    const v = src[i].value,
      t = document.createElement(el.tagName === 'TEXTAREA' ? 'div' : 'span');
    t.className = el.tagName === 'TEXTAREA' ? 'rep-answer' : 'rep-field';
    t.textContent = v || (el.tagName === 'TEXTAREA' ? '— нет ответа —' : '');
    if (!v) t.classList.add('rep-empty');
    el.replaceWith(t);
  });
  copy.querySelectorAll('.noprint, .pr-bar, script, button').forEach(el => el.remove());
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>${esc(title)}</title>
<style>${pageCss()}
html, body { overflow: auto !important; height: auto !important; background: #fff !important; position: static !important; }
body { padding: 20px 28px !important; margin: 0; }
.rep-answer { white-space: pre-wrap; border: 1px solid #b9b2a0; padding: 4px 6px; min-height: 30px; background: #fffdf6; }
.rep-field { font-weight: 600; }
.rep-empty { color: #a33; font-style: italic; }
@media print { body { padding: 0 !important; } }
</style></head><body>${copy.outerHTML}</body></html>`;
}

// отправка: token — вход по PIN (без него сервер примет отчёт, только если групп нет)
export async function sendReport({lab, html, pts, done, token, client, fio, grp, seed}) {
  if (!/^https?:$/.test(location.protocol))
    return {ok: false, msg: 'Лаба открыта файлом, а не с сервера — отправить нельзя, распечатайте протокол.'};
  try {
    const r = await fetch('/api/report', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', ...(token ? {'X-Labs-Token': token} : {})},
      body: JSON.stringify({lab, html, pts, done, client, fio, grp, seed}),
    });
    if (r.ok)
      return {ok: true, msg: 'Отчёт у преподавателя · ' + new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})};
    if (r.status === 403) return {ok: false, msg: 'Сервер не узнал вас: войдите по группе и PIN и отправьте ещё раз.'};
    if ([404, 405, 501].includes(r.status)) return {ok: false, msg: 'На этом сервере приём отчётов не настроен — распечатайте протокол.'};
    const j = await r.json().catch(() => ({}));
    return {ok: false, msg: 'Не отправлено: ' + (j.err || r.status)};
  } catch (e) {
    return {ok: false, msg: 'Нет связи с сервером — попробуйте ещё раз.'};
  }
}
