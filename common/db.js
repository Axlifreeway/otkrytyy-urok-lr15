// PostgreSQL в браузере (PGlite): сначала из vendor/pglite рядом с лабами, при неудаче — с CDN.
const LOCAL = '../vendor/pglite/index.js';
const CDN = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.8/dist/index.js';
const load = url => import(/* @vite-ignore */ url);

export function openDb() {
  if (!window.__pg) {
    // window.__pg — тот же промис видят тесты
    window.__pg = (async () => {
      let mod;
      try {
        mod = await load(new URL(LOCAL, document.baseURI).href);
      } catch (e) {
        mod = await load(CDN);
      }
      const db = new mod.PGlite();
      await db.query('select 1');
      return db;
    })();
  }
  return window.__pg;
}

// база заново: пустая схема public + текст sql
export async function loadSql(db, sql) {
  try {
    await db.query('ROLLBACK');
  } catch (e) {
    /* нет транзакции */
  }
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
  await db.exec(sql);
}
