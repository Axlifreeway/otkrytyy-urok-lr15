// ЛР-21 · тренировка после уровней: бесконечные задания на UPDATE, DELETE и INSERT из текущей базы студента.
// Каждое задание — обычный уровень (проверка — сравнением с базой после эталона), только без баллов.
// Условие — словами, WHERE студент собирает сам (справочник SQL — в карточке задания).
import {lit, authorName} from '../../common/libdata.js';

const ALLOW = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'BEGIN', 'COMMIT', 'ROLLBACK'];
const pick = (a, r) => a[Math.floor(r() * a.length)];
const uniq = a => [...new Set(a.filter(x => x != null))];

export function practice(D, st, r) {
  const B = st.book,
    R = st.reader,
    LN = st.loan,
    T = [];
  const name = id => authorName(D, id) || (st.author.find(a => a.id === id) || {}).full_name || `№ ${id}`;
  const authors = uniq(B.map(b => b.author_id)).filter(a => B.filter(b => b.author_id === a).length >= 2);
  const base = {allow: ALLOW, star: true};

  // UPDATE с выражением
  if (authors.length) {
    const a = pick(authors, r),
      k = pick([8, 12, 16, 24, 32], r);
    T.push({
      title: 'Дополненное издание',
      text: `Книги автора ${name(a)} (author_id = ${a}) вышли дополненными: в каждой на ${k} страниц больше, чем сейчас. Одной командой.`,
      goals: [`Книги автора ${a}: pages + ${k}`, 'Остальные книги не трогать'],
      tables: ['book'],
      ref: [`UPDATE book SET pages = pages + ${k} WHERE author_id = ${a}`],
      hint: 'Новое значение считается из старого: SET pages = pages + …',
    });
  }
  // UPDATE с двумя условиями
  const years = uniq(B.map(b => b.year)).sort((x, y) => x - y);
  if (authors.length && years.length > 4) {
    const a = pick(authors, r),
      y = years[Math.floor(years.length * (0.3 + r() * 0.5))];
    T.push({
      title: 'Переиздать старые',
      text: `Книги автора ${name(a)} (author_id = ${a}), изданные раньше ${y} года, переизданы в 2026 году. Новые книги этого автора остаются как есть.`,
      goals: [`author_id = ${a} и year < ${y}: year = 2026`],
      tables: ['book'],
      ref: [`UPDATE book SET year = 2026 WHERE author_id = ${a} AND year < ${y}`],
      hint: 'Два условия — через AND. «Раньше» — строго меньше.',
    });
  }
  // пустые значения
  if (R.some(x => x.phone === null))
    T.push({
      title: 'Телефон неизвестен',
      text: "У читателей, у которых телефон не указан, впишите в phone слово 'нет'. Телефоны остальных не меняются.",
      goals: ["phone пуст → 'нет'"],
      tables: ['reader'],
      ref: ["UPDATE reader SET phone = 'нет' WHERE phone IS NULL"],
      hint: 'С пустым значением сравнивают только через IS NULL — «= NULL» не найдёт ни одной строки.',
    });
  // DELETE с двумя условиями
  const closedBy = uniq(LN.filter(l => l.returned !== null).map(l => l.reader_id));
  if (closedBy.length) {
    const id = pick(closedBy, r),
      rd = R.find(x => x.id === id);
    T.push({
      title: 'Закрытые формуляры',
      text: `Закрытые формуляры читателя ${rd ? rd.full_name : ''} (reader_id = ${id}) — где книга уже возвращена — уходят в архив. Удалите только их.`,
      goals: [`reader_id = ${id} и книга возвращена`, 'Открытые формуляры остаются'],
      tables: ['loan'],
      ref: [`DELETE FROM loan WHERE reader_id = ${id} AND returned IS NOT NULL`],
      hint: '«Возвращена» — returned IS NOT NULL.',
    });
  }
  // возврат всех открытых формуляров читателя
  const openBy = uniq(LN.filter(l => l.returned === null).map(l => l.reader_id));
  if (openBy.length) {
    const id = pick(openBy, r),
      d = `2026-10-${pick([23, 24, 25, 27, 28], r)}`;
    T.push({
      title: 'Вернул всё',
      text: `Читатель с reader_id = ${id} принёс все книги, которые были у него на руках. Отметьте возврат датой ${d} — только в его открытых формулярах.`,
      goals: [`Открытые формуляры читателя ${id}: returned = '${d}'`, 'Закрытые формуляры не трогать'],
      tables: ['loan'],
      ref: [`UPDATE loan SET returned = '${d}' WHERE reader_id = ${id} AND returned IS NULL`],
      hint: 'Открытые — те, где returned ещё пуст.',
    });
  }
  // INSERT: новый автор и его книга — ссылка на только что добавленную строку
  const aid = Math.max(...st.author.map(a => a.id)) + 1,
    bid = Math.max(...B.map(b => b.id)) + 1;
  const [nm, ttl] = pick(
    [
      ['Prishvin M. M.', 'Forest Drops'],
      ['Grin A. S.', 'Scarlet Sails'],
      ['Kaverin V. A.', 'Two Captains'],
      ['Belyaev A. R.', 'Amphibian Man'],
    ],
    r,
  );
  const pg = 120 + Math.floor(r() * 30) * 10;
  T.push({
    title: 'Новый автор с книгой',
    text: `Поступила книга «${ttl}» (${pg} страниц) автора ${nm}, Russia, — его ещё нет в справочнике. Добавьте автора (id ${aid}) и книгу (id ${bid}, год не указан).`,
    goals: [`author: ${aid}, ${nm}`, `book: ${bid}, «${ttl}», ${pg} страниц, ссылка на автора ${aid}`],
    tables: ['author', 'book'],
    ref: [
      `INSERT INTO author (id, full_name, country) VALUES (${aid}, ${lit(nm)}, 'Russia')`,
      `INSERT INTO book (id, title, author_id, pages) VALUES (${bid}, ${lit(ttl)}, ${aid}, ${pg})`,
    ],
    hint: 'Сначала автор, потом книга: внешний ключ не даст сослаться на автора, которого ещё нет.',
  });
  // DELETE с подзапросом: только книги без формуляров
  if (authors.length) {
    const a = pick(authors, r),
      mine = B.filter(b => b.author_id === a).map(b => b.pages),
      p = [...mine].sort((x, y) => x - y)[Math.floor(mine.length / 2)] + 1;
    T.push({
      hard: true,
      title: 'Списать тонкие',
      text: `Списываются книги автора ${name(a)} (author_id = ${a}) тоньше ${p} страниц — но только те, которых нет ни в одном формуляре (на остальные ссылается loan).`,
      goals: [`author_id = ${a} и pages < ${p}`, 'Книги из формуляров не трогать'],
      tables: ['book', 'loan'],
      ref: [`DELETE FROM book WHERE author_id = ${a} AND pages < ${p} AND id NOT IN (SELECT book_id FROM loan)`],
      hint: 'Книги из формуляров — SELECT book_id FROM loan. Исключить их — id NOT IN (…).',
    });
  }
  return {...base, ...pick(T, r)};
}
