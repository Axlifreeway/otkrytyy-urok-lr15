// Робот говорит: объявление преподавателя из панели появляется у студентов поверх лабы —
// большой робот выезжает снизу на полэкрана, печатает реплику и ждёт, пока студент её закроет или ответит эмодзи.
import {esc} from './util.js';
import {SFX} from './sfx.js';
import {fetchT, report} from './net.js';

const ROBOT = `<svg viewBox="0 0 220 260" aria-hidden="true"><g stroke="#22252b" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
  <line x1="110" y1="34" x2="110" y2="12"/><circle cx="110" cy="10" r="9" fill="#8b5cf6"/>
  <rect x="30" y="34" width="160" height="118" rx="34" fill="#fbf8f2"/>
  <rect x="50" y="58" width="120" height="66" rx="18" fill="#22252b"/>
  <rect class="eye" x="72" y="78" width="22" height="28" rx="6" fill="#ffc21a" stroke="none"/>
  <rect class="eye" x="126" y="78" width="22" height="28" rx="6" fill="#ffc21a" stroke="none"/>
  <rect x="58" y="160" width="104" height="80" rx="24" fill="#fbf8f2"/>
  <rect x="84" y="178" width="52" height="16" rx="5" fill="#8b5cf6"/>
  <path d="M58 182 Q26 190 22 224" fill="none"/><path d="M162 182 Q194 190 198 224" fill="none"/>
  <circle cx="22" cy="228" r="11" fill="#8b5cf6"/><circle cx="198" cy="228" r="11" fill="#8b5cf6"/></g></svg>`;

// реплика висит, пока студент её не закроет: так её не пропустят, отвернувшись от экрана.
// Под ней — короткий отклик эмодзи; он уходит преподавателю (пульт → «Робот скажет» → последние объявления)
const FB = [
  ['👍', 'понятно'],
  ['👌', 'сделаю'],
  ['🤔', 'не понял'],
  ['🙋', 'подойдите'],
];
let box = null,
  queue = [],
  busy = false;
function show({id, text}) {
  if (!box) {
    box = document.createElement('div');
    box.id = 'robotsay';
    box.innerHTML = `<div class="rs-bot">${ROBOT}</div><div class="rs-bubble"><span class="rs-tag">РОБОТ-СУБД · ОБЪЯВЛЕНИЕ</span><p></p>
      <div class="rs-fb">${FB.map(([e, t]) => `<button data-e="${e}" title="${t}">${e}<small>${t}</small></button>`).join('')}</div>
      <div class="rs-thx" hidden>Отклик отправлен преподавателю</div><button class="rs-x" title="Закрыть">✕</button></div>`;
    document.body.append(box);
  }
  busy = true;
  const p = box.querySelector('p');
  p.textContent = '';
  box.querySelector('.rs-fb').hidden = id == null;
  box.querySelector('.rs-thx').hidden = true;
  box.querySelectorAll('.rs-fb button').forEach(b => (b.disabled = false));
  box.hidden = false;
  requestAnimationFrame(() => box.classList.add('on'));
  SFX.unlock();
  // печатаем по буквам: так реплику замечают
  let i = 0;
  const step = setInterval(() => {
    p.innerHTML = esc(text.slice(0, ++i)) + (i < text.length ? '<i>▌</i>' : '');
    if (i >= text.length) clearInterval(step);
  }, 28);
  const hide = () => {
    clearInterval(step);
    box.classList.remove('on');
    setTimeout(() => {
      box.hidden = true;
      busy = false;
      if (queue.length) show(queue.shift());
    }, 450);
  };
  box.querySelector('.rs-x').onclick = hide;
  box.querySelectorAll('.rs-fb button').forEach(
    b =>
      (b.onclick = () => {
        report('sayfb', {id, e: b.dataset.e});
        box.querySelectorAll('.rs-fb button').forEach(x => {
          x.disabled = true;
          x.classList.toggle('on', x === b);
        });
        box.querySelector('.rs-thx').hidden = false;
        setTimeout(hide, 1200);
      }),
  );
}
export function robotSay(msg) {
  if (busy) queue.push(msg);
  else show(msg);
}

// опрос сервера: новые объявления для группы вошедшего студента
export function listenRobot(getToken) {
  if (!/^https?:$/.test(location.protocol)) return;
  let since = -1,
    fails = 0,
    seen = false;
  const poll = async () => {
    try {
      const t = getToken();
      const r = await fetchT(`/api/say?since=${since}`, {headers: t ? {'X-Labs-Token': t} : {}});
      if (r.status === 404 && !seen) return; // сервера нет — лаба работает и так
      if (!r.ok) throw new Error(r.status); // сбой связи — опрос продолжится
      const j = await r.json();
      seen = true;
      if (since >= 0) j.items.forEach(robotSay);
      since = j.last;
      fails = 0;
    } catch (e) {
      fails++;
    }
    setTimeout(poll, fails ? Math.min(30000, 4000 * fails) : 4000);
  };
  poll();
}
