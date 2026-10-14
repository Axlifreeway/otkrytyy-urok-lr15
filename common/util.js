// Мелочи, нужные всем страницам лабораторных.
export const $ = id => document.getElementById(id);
export const esc = s =>
  String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
export const sleep = ms => new Promise(r => setTimeout(r, ms));
// 1 строка, 2 строки, 5 строк
export const plural = (n, a, b, c) =>
  n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c;
export const comma = v => String(v).replace('.', ',');

// localStorage, который не падает в приватном окне: ls(k) — прочитать, ls(k, v) — записать, ls(k, null) — удалить
export const ls = (k, v) => {
  try {
    if (v === undefined) return localStorage.getItem(k) || '';
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch (e) {
    /* без хранилища */
  }
  return '';
};
export const lsJSON = k => {
  try {
    return JSON.parse(localStorage.getItem(k));
  } catch (e) {
    return null;
  }
};
