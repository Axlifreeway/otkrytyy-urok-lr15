// Сцена городской библиотеки (ЛР-21–24) — тот же движок, что у аэропорта и пиццерии, другой зал:
//   book    — книги на стеллажах у задней стены, корешок — цвета автора (на полках — первые 240 строк);
//   author  — портреты авторов над стеллажами;
//   reader  — читатели за столами читального зала;
//   loan    — формуляры выдачи на кафедре у входа (красный — книга ещё на руках);
//   индексы — каталожные шкафы между стеллажами и проходом робота: по одному на индекс (pk_…, ix_…).
// EXPLAIN показывается движением робота: Seq Scan — обход всех стеллажей подряд, Index Scan — к шкафу каталога и сразу к полке.
// Интерфейс тот же, что у сцен аэропорта и пиццерии (build, sync, locate, answer, calm…) — им пользуется common/qlab.js.
import {createEngine, THREE, V, tween, sleep} from './engine.js';
import {rng} from '../rng.js';

export {sleep, tween};
const BOOKC = [0xb5523b, 0x2f6f73, 0x3b4d7a, 0x6b4f9a, 0xc77d2e, 0x5c8a3a, 0x8a3b6b, 0x9b5a33, 0x2a6f9e, 0xd2483c, 0x4d7a3b, 0x7a5c2e];
const PER = 10, // книг на полке
  LEVELS = 3; // полок в стеллаже

export function createLibrary(stage) {
  const E = createEngine(stage, {home: {tx: 2.6, tz: -0.4}, sunTarget: [3, 0, -1], viewH: 7.6, followZoom: 1.4, apronZ: -60});
  const {root, rbox, at, mat} = E;
  const LEN0 = -3.4,
    LEN1 = 9.2,
    MID = (LEN0 + LEN1) / 2,
    LEN = LEN1 - LEN0;
  const WALLZ = -4.3,
    FRONT = 4.4,
    SHELFZ = -3.55, // стеллажи
    CATZ = -1.55, // каталожные шкафы
    DOORZ = 2.6;
  Object.assign(E.geo, {LEN0, LEN1, MID, LEN, DOOR: {x: LEN0 - 0.6, z: DOORZ}});
  E.robot.position.set(LEN0 + 1.6, 0, 0);

  // ═══════════════════════════════════════════════════════ здание ══
  const slab = rbox(LEN + 1.4, 0.3, FRONT - WALLZ + 0.2, 0.06, 0xd8c7a6);
  at(slab, MID, -0.15, (FRONT + WALLZ) / 2);
  root.add(slab);
  for (let z = WALLZ + 0.3; z < FRONT; z += 0.34) {
    const b = rbox(LEN + 1.3, 0.008, 0.02, 0.002, 0xc4b08c);
    at(b, MID, 0.004, z);
    b.castShadow = false;
    root.add(b);
  }
  // ковровая дорожка читального зала и проход робота
  const carpet = rbox(LEN - 1.0, 0.012, 2.3, 0.02, 0x7a2e2e);
  at(carpet, MID + 0.6, 0.006, 3.05);
  carpet.castShadow = false;
  root.add(carpet);
  const walk = rbox(LEN + 0.6, 0.012, 0.95, 0.01, 0xcbbb98);
  at(walk, MID, 0.006, 0);
  walk.castShadow = false;
  root.add(walk);
  for (let x = LEN0 + 0.4; x < LEN1; x += 0.9)
    [-0.42, 0.42].forEach(z => {
      const d = rbox(0.18, 0.016, 0.04, 0.01, 0xffc21a, {emissive: 0x332200});
      at(d, x, 0.01, z);
      d.castShadow = false;
      root.add(d);
    });
  // стены: тёмные деревянные панели понизу
  const wall = rbox(LEN + 1.4, 2.9, 0.18, 0.05, 0xefe6d2);
  at(wall, MID, 1.45, WALLZ);
  root.add(wall);
  const panel = rbox(LEN + 1.4, 0.7, 0.05, 0.02, 0x5b3d2b);
  at(panel, MID, 0.35, WALLZ + 0.11);
  root.add(panel);
  const side = rbox(0.18, 2.9, FRONT - WALLZ, 0.05, 0xefe6d2);
  at(side, LEN0 - 0.7, 1.45, (FRONT + WALLZ) / 2);
  root.add(side);
  const door = rbox(0.06, 2.0, 1.2, 0.03, 0x5b3d2b);
  at(door, LEN0 - 0.6, 1.0, DOORZ);
  root.add(door);
  E.flatLabel('БИБЛИОТЕКА · хранение и выдача', root, {x: MID - 1.2, y: 2.55, z: WALLZ + 0.11, h: 0.34, color: '#22252b', bg: '#ffc21a'});
  E.flatLabel('ВХОД', root, {x: LEN0 - 0.58, y: 2.2, z: DOORZ, ry: Math.PI / 2, h: 0.3, color: '#22252b', bg: '#ffc21a'});
  // стеллажи: 8 штук по 3 полки
  const RACKS = 8,
    rackW = 1.35,
    rx = k => LEN0 + 0.2 + rackW / 2 + k * (rackW + 0.12);
  for (let k = 0; k < RACKS; k++) {
    const x = rx(k);
    [-1, 1].forEach(s => {
      const post = rbox(0.06, 1.85, 0.42, 0.02, 0x5b3d2b);
      at(post, x + (s * rackW) / 2, 0.92, SHELFZ);
      root.add(post);
    });
    for (let l = 0; l <= LEVELS; l++) {
      const p = rbox(rackW, 0.04, 0.42, 0.01, 0x7a5236);
      at(p, x, 0.08 + l * 0.58, SHELFZ);
      root.add(p);
    }
    const back = rbox(rackW, 1.8, 0.03, 0.01, 0x4a3122);
    at(back, x, 0.92, SHELFZ - 0.2);
    root.add(back);
  }
  E.flatLabel('стеллажи · таблица book', root, {x: LEN0 + 1.3, y: 0.016, z: SHELFZ + 0.42, rx: -Math.PI / 2, h: 0.16});
  E.flatLabel('каталог · индексы', root, {x: LEN0 + 1.0, y: 0.016, z: CATZ + 0.42, rx: -Math.PI / 2, h: 0.16});
  // кафедра выдачи у входа
  const desk = rbox(0.7, 0.85, 2.2, 0.06, 0x6a4a35);
  at(desk, LEN0 + 0.5, 0.42, 1.95);
  root.add(desk);
  const deskTop = rbox(0.8, 0.05, 2.3, 0.02, 0x8a6446);
  at(deskTop, LEN0 + 0.5, 0.87, 1.95);
  root.add(deskTop);
  E.flatLabel('выдача · loan', root, {x: LEN0 + 0.86, y: 0.5, z: 1.95, ry: Math.PI / 2, h: 0.14});
  // читальный зал: длинные столы с лампами
  const TABLES = [1.6, 4.2, 6.8];
  TABLES.forEach(x => {
    const top = rbox(1.9, 0.06, 0.9, 0.03, 0x8a6446);
    at(top, x, 0.7, 3.0);
    root.add(top);
    [-0.8, 0.8].forEach(dx => {
      const leg = rbox(0.08, 0.68, 0.7, 0.02, 0x5b3d2b);
      at(leg, x + dx, 0.34, 3.0);
      root.add(leg);
    });
    [-0.5, 0.5].forEach(dx => {
      const lamp = rbox(0.06, 0.32, 0.06, 0.02, 0x2f6f73);
      at(lamp, x + dx, 0.88, 3.0);
      root.add(lamp);
      const shade = rbox(0.24, 0.1, 0.18, 0.04, 0x3a8a5a, {emissive: 0x0b2a16});
      at(shade, x + dx - 0.05, 1.05, 3.0);
      root.add(shade);
    });
  });
  E.flatLabel('читальный зал · reader', root, {x: TABLES[0] - 0.5, y: 0.016, z: 4.2, rx: -Math.PI / 2, h: 0.16});
  // архив копий (pg_dump) — в правом дальнем углу
  const arch = rbox(1.1, 1.2, 0.6, 0.05, 0x8b857a);
  at(arch, LEN1 - 0.4, 0.6, CATZ - 0.2);
  root.add(arch);
  E.flatLabel('архив копий', root, {x: LEN1 - 0.4, y: 1.33, z: CATZ + 0.12, h: 0.13});

  // статичное — одним мешем
  {
    root.updateMatrixWorld(true);
    const list = [];
    root.children.forEach(o => {
      if (o.isMesh && !o.userData.keep && !o.material.transparent) list.push(o);
    });
    const merged = E.bakeMeshes(list, o => o.matrix.clone());
    list.forEach(o => root.remove(o));
    root.add(merged);
  }

  // ═════════════════════════════════════════════════ объекты строк ══
  const objs = {book: new Map(), author: new Map(), reader: new Map(), loan: new Map()};
  const PK = {book: 'id', author: 'id', reader: 'id', loan: 'id'};
  let seedR = rng(1);
  const anchorOf = (g, y) => {
    const a = new THREE.Object3D();
    a.position.y = y;
    g.add(a);
    g.userData.anchor = a;
    return a;
  };
  function makeBook(row) {
    const h = 0.34 + ((row.pages || 200) % 9) * 0.015;
    const g = new THREE.Group();
    g.add(rbox(0.095, h, 0.28, 0.012, BOOKC[(row.author_id || 0) % BOOKC.length]));
    const band = rbox(0.1, 0.03, 0.29, 0.005, 0xf2d27a);
    at(band, 0, h * 0.25, 0);
    g.add(band);
    E.bakeGroup(g);
    g.userData.h = h;
    E.setPick(g, {t: 'book', k: row.id});
    return g;
  }
  function makeAuthor(row) {
    const g = new THREE.Group();
    g.add(rbox(0.26, 0.32, 0.03, 0.01, 0x8a6446));
    const pic = rbox(0.2, 0.25, 0.02, 0.005, BOOKC[row.id % BOOKC.length]);
    at(pic, 0, 0, 0.012);
    g.add(pic);
    E.bakeGroup(g);
    E.setPick(g, {t: 'author', k: row.id});
    return g;
  }
  function makeReader(row) {
    const female = /а\s/.test(row.full_name);
    const g = E.makePerson({kid: false, female, old: false}, seedR);
    E.setPose(g, 'sit');
    anchorOf(g, 0.95);
    E.setPick(g, {t: 'reader', k: row.id});
    return g;
  }
  function makeLoan(row) {
    const g = new THREE.Group();
    g.add(rbox(0.16, 0.012, 0.22, 0.004, row.returned ? 0xfbf8f2 : 0xd2483c));
    E.bakeGroup(g);
    E.setPick(g, {t: 'loan', k: row.id});
    return g;
  }
  const MAKE = {book: makeBook, author: makeAuthor, reader: makeReader, loan: makeLoan};

  // ═══════════════════════════════════════════════ где чьё место ══
  const SEATS = [];
  TABLES.forEach(x =>
    [-0.6, 0, 0.6].forEach(dx =>
      [
        [2.35, Math.PI / 2],
        [3.65, -Math.PI / 2],
      ].forEach(([z, rot]) => SEATS.push({p: V(x + dx, 0, z), rot})),
    ),
  );
  SEATS.sort((a, b) => a.p.x - b.p.x || a.p.z - b.p.z);
  const shelfPos = i => {
    const k = Math.floor(i / (PER * LEVELS)) % RACKS,
      l = Math.floor(i / PER) % LEVELS,
      j = i % PER;
    return V(rx(k) - rackW / 2 + 0.1 + j * 0.128, 0.1 + l * 0.58, SHELFZ + 0.02);
  };
  function slot(t, i) {
    if (t === 'book') {
      const p = shelfPos(i);
      return {p, rot: 0, hidden: i >= PER * LEVELS * RACKS};
    }
    if (t === 'author') return {p: V(LEN0 + 0.4 + (i % 20) * 0.5, 2.05 - Math.floor(i / 20) * 0.38, WALLZ + 0.13), rot: 0};
    if (t === 'loan')
      return {p: V(LEN0 + 0.35 + (i % 3) * 0.18, 0.9 + Math.floor(i / 36) * 0.012, 1.0 + (Math.floor(i / 3) % 12) * 0.17), rot: 0};
    const s = SEATS[i];
    return s
      ? {p: s.p.clone(), rot: s.rot, pose: 'sit'}
      : {p: V(LEN1 - 0.6 - (i - SEATS.length) * 0.5, 0, 4.0), rot: Math.PI / 2, pose: 'stand'};
  }
  const order = new Map();
  function placeAll(t, anim) {
    const ks = order.get(t) || [];
    const jobs = [];
    ks.forEach((k, i) => {
      const O = objs[t].get(k);
      if (!O) return;
      const s = slot(t, i);
      O.home = s;
      O.g.visible = !s.hidden;
      if (s.pose) E.setPose(O.g, s.pose);
      O.g.rotation.y = s.rot;
      const y = t === 'book' ? s.p.y + O.g.userData.h / 2 : s.p.y;
      if (anim && O.g.position.distanceTo(V(s.p.x, y, s.p.z)) > 0.01) jobs.push(tween(O.g.position, {x: s.p.x, y, z: s.p.z}, 420));
      else O.g.position.set(s.p.x, y, s.p.z);
    });
    return Promise.all(jobs);
  }

  // ═════════════════════════════════════════ каталог: шкаф на каждый индекс ══
  const cats = new Map(); // имя индекса → {g, table}
  let counts = {},
    whoLab = null,
    archive = [];
  function makeCabinet(name, fresh) {
    const g = new THREE.Group();
    g.add(rbox(0.5, 1.0, 0.42, 0.04, 0x8a6446));
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 2; c++) {
        const d = rbox(0.2, 0.18, 0.02, 0.01, 0xd9b98a);
        at(d, -0.11 + c * 0.22, -0.32 + r * 0.22, 0.21);
        g.add(d);
      }
    E.bakeGroup(g);
    g.userData.lab = E.label(esc(name), 'ixlab' + (fresh ? ' new' : ''), g, 0, 0.72, 0);
    return g;
  }
  function placeCats() {
    const list = [...cats.values()].sort((a, b) => a.order - b.order);
    list.forEach((C, i) => C.g.position.set(LEN0 + 0.6 + i * 0.68, 0.5, CATZ));
  }
  // catalog({indexes: [{name, table}], counts: {таблица: строк}, role})
  function catalog(info) {
    if (!info) return;
    counts = info.counts || {};
    const want = new Map((info.indexes || []).map(x => [x.name, x]));
    [...cats.keys()].forEach(n => {
      if (want.has(n)) return;
      const C = cats.get(n);
      E.dispose(C.g);
      root.remove(C.g);
      cats.delete(n);
    });
    let o = cats.size;
    want.forEach((x, n) => {
      if (cats.has(n)) return;
      const g = makeCabinet(n, !/^pk_|^uq_/.test(n));
      E.setPick(g, {t: 'index', k: n});
      root.add(g);
      cats.set(n, {g, table: x.table, order: /^pk_|^uq_/.test(n) ? -100 + o : o++});
    });
    placeCats();
    // книги сверх полок — подпись «и ещё N строк в хранилище»
    if (bookLab) {
      E.dispose(bookLab);
      root.remove(bookLab);
      bookLab = null;
    }
    const nb = counts.book || 0;
    if (nb > PER * LEVELS * RACKS) {
      bookLab = new THREE.Object3D();
      bookLab.position.set(MID, 2.0, SHELFZ + 0.3);
      root.add(bookLab);
      E.label(`book: ${nb.toLocaleString('ru-RU')} строк — на полках первые ${PER * LEVELS * RACKS}`, 'ixlab new', bookLab, 0, 0, 0);
    }
    // от чьего имени работает робот (ЛР-24)
    if (whoLab) {
      whoLab.element.remove();
      whoLab.parent && whoLab.parent.remove(whoLab);
      whoLab = null;
    }
    if (info.role) whoLab = E.label(`роль: ${esc(info.role)}`, 'rolelab', E.robot, 0, 2.05, 0);
    E.sweepLabels();
  }
  let bookLab = null;

  // ═════════════════════════════════════════════ состояние сцены ══
  const model = {book: new Map(), author: new Map(), reader: new Map(), loan: new Map()};
  function drop(t, k) {
    const O = objs[t].get(k);
    if (!O) return;
    E.dispose(O.g);
    O.g.parent && O.g.parent.remove(O.g);
    objs[t].delete(k);
    model[t].delete(k);
  }
  function add(t, row) {
    const g = MAKE[t](row);
    root.add(g);
    const O = {g, row: {...row}};
    objs[t].set(row[PK[t]], O);
    model[t].set(row[PK[t]], row);
    return O;
  }
  function build(state, seed) {
    seedR = rng(seed * 31 + 23);
    E.clearChips();
    E.hideCard();
    E.clearSay();
    Object.keys(objs).forEach(t => [...objs[t].keys()].forEach(k => drop(t, k)));
    Object.keys(objs).forEach(t => {
      (state[t] || []).forEach(r => add(t, r));
      order.set(
        t,
        (state[t] || []).map(r => r[PK[t]]),
      );
      placeAll(t, false);
    });
    archive.forEach(a => {
      E.dispose(a);
      root.remove(a);
    });
    archive = [];
    E.robotHome();
    E.sweepLabels();
  }
  async function sync(state, anim = true) {
    await calm(false);
    const jobs = [];
    try {
      for (const t of Object.keys(objs)) {
        const rows = state[t] || [],
          want = new Map(rows.map(r => [r[PK[t]], r]));
        [...objs[t].keys()].forEach(k => {
          if (want.has(k)) return;
          const O = objs[t].get(k);
          objs[t].delete(k);
          model[t].delete(k);
          const go = async () => {
            if (anim && O.g.visible) {
              if (t === 'reader') {
                E.sayAt(O.g, 'До свидания…', 1200);
                await E.walk(O.g, [V(O.g.position.x, 0, 1.0), V(LEN0 - 0.3, 0, 1.0)], 3);
              } else {
                await tween(O.g.position, {y: O.g.position.y + 0.4}, 200, 'out');
                await tween(O.g.scale, {x: 0.01, y: 0.01, z: 0.01}, 240, 'in');
              }
            }
            E.dispose(O.g);
            O.g.parent && O.g.parent.remove(O.g);
          };
          jobs.push(go());
        });
        want.forEach((r, k) => {
          const O = objs[t].get(k);
          if (O && JSON.stringify(O.row) === JSON.stringify(r)) return;
          if (O) {
            const pos = O.g.position.clone(),
              rot = O.g.rotation.y;
            E.dispose(O.g);
            root.remove(O.g);
            objs[t].delete(k);
            const N = add(t, r);
            N.g.position.copy(pos);
            N.g.rotation.y = rot;
            if (anim) {
              N.g.scale.setScalar(1.3);
              tween(N.g.scale, {x: 1, y: 1, z: 1}, 380, 'back');
            }
            return;
          }
          const N = add(t, r);
          N.fresh = true;
        });
        order.set(
          t,
          rows.map(r => r[PK[t]]),
        );
      }
      await Promise.all(jobs);
      for (const t of Object.keys(objs)) {
        const ks = order.get(t);
        ks.forEach((k, i) => {
          const O = objs[t].get(k),
            s = slot(t, i);
          if (O.fresh) {
            O.fresh = false;
            if (anim && !s.hidden) {
              O.g.position.set(t === 'reader' ? LEN0 - 0.3 : LEN0 + 0.5, t === 'reader' ? 0 : 1.0, t === 'reader' ? DOORZ : 1.95);
              O.g.scale.setScalar(0.01);
              tween(O.g.scale, {x: 1, y: 1, z: 1}, 300, 'back');
            }
          }
        });
        await placeAll(t, anim);
      }
    } finally {
      E.sweepLabels();
    }
  }

  E.resolve(
    (t, k) => {
      if (t === 'index') return (cats.get(k) || {}).g || null;
      const O = objs[t] && objs[t].get(+k);
      if (!O || !O.g.visible) return null;
      return O.g.userData.anchor || O.g;
    },
    t => (t === 'reader' ? 0.45 : t === 'book' ? 0.28 : t === 'index' ? 0.6 : 0.22),
  );
  function say(t, id, text, ms = 0) {
    const O = objs[t] && objs[t].get(+id);
    if (O && t === 'reader') E.sayAt(O.g, text, ms);
  }

  // ═══════════════════════════════════════ где стоять роботу у строки ══
  function locate(t, row) {
    const O = objs[t] && objs[t].get(+row[PK[t] || 'id']);
    if (!O || !O.g.visible) {
      // строки нет на полках (книга из 20 000) — к середине стеллажей
      const p = V(MID, 1, SHELFZ);
      return {x: MID, z: 0, face: Math.PI, aim: p};
    }
    const p = (O.g.userData.anchor || O.g).getWorldPosition(V(0, 0, 0));
    return {x: Math.min(LEN1 - 0.3, Math.max(LEN0 + 0.4, p.x)), z: 0, face: p.z < 0 ? Math.PI : 0, aim: p};
  }

  // ═════════════════════════════════════ ответ SELECT: строки ответа «выходят вперёд» ══
  async function answer(t, keys) {
    const jobs = [];
    keys.forEach((k, i) => {
      const O = objs[t] && objs[t].get(+k);
      if (!O || !O.g.visible) return;
      O.away = true;
      if (t === 'reader') {
        E.setPose(O.g, 'stand');
        jobs.push(sleep(i * 25).then(() => E.bounce(O.g, 0.18)));
      } else if (t === 'book') jobs.push(sleep(i * 20).then(() => tween(O.g.position, {z: SHELFZ + 0.16}, 200, 'out')));
      else jobs.push(sleep(i * 30).then(() => E.bounce(O.g, 0.12)));
    });
    await Promise.all(jobs);
  }
  async function calm(anim = true) {
    const jobs = [];
    Object.keys(objs).forEach(t =>
      objs[t].forEach(O => {
        if (!O.away || !O.home) return;
        O.away = false;
        const s = O.home;
        if (s.pose) E.setPose(O.g, s.pose);
        O.g.rotation.y = s.rot;
        const y = t === 'book' ? s.p.y + O.g.userData.h / 2 : s.p.y;
        if (anim) jobs.push(tween(O.g.position, {x: s.p.x, y, z: s.p.z}, 300, 'io'));
        else O.g.position.set(s.p.x, y, s.p.z);
      }),
    );
    await Promise.all(jobs);
  }

  // ═════════════════════════ план запроса: как СУБД читает таблицу ══
  // n: {kind: 'Seq Scan' | 'Index Scan' | 'Index Only Scan' | 'Bitmap Heap Scan', index, table, rows}
  const zoneOf = t =>
    t === 'book'
      ? {x0: rx(0), x1: rx(RACKS - 1), z: 0, aim: SHELFZ}
      : t === 'author'
        ? {x0: LEN0 + 0.4, x1: LEN0 + 9.9, z: 0, aim: WALLZ}
        : t === 'loan'
          ? {x0: LEN0 + 0.9, x1: LEN0 + 0.9, z: 1.4, aim: 1.9}
          : {x0: TABLES[0], x1: TABLES[2], z: 0.9, aim: 3.0};
  const flash = async (x, z, y = 1) => {
    E.aimBeam(V(x, y, z));
    await sleep(Math.max(60, 260 / E.speed));
  };
  async function scan(n, plan) {
    const Z = zoneOf(n.table),
      total = counts[n.table] || n.rows,
      spd = Math.max(E.speed, 1);
    E.camS.follow = true;
    const hudEl = document.getElementById('cnt');
    const show = (a, b) => {
      if (!hudEl) return;
      hudEl.hidden = false;
      hudEl.innerHTML = `<b>${a.toLocaleString('ru-RU')}</b>/${total.toLocaleString('ru-RU')} строк прочитано · <b>${b.toLocaleString('ru-RU')}</b> в ответе`;
    };
    if (n.kind === 'Seq Scan') {
      // подряд: от первого стеллажа до последнего, счётчик прочитанных строк растёт до всех
      await E.robotGo(Z.x0, Z.z);
      E.face(Math.PI);
      const steps = 8;
      for (let i = 1; i <= steps; i++) {
        const x = Z.x0 + ((Z.x1 - Z.x0) * i) / steps;
        await E.robotGo(x, Z.z);
        E.face(Math.PI);
        await flash(x, Z.aim);
        show(Math.round((total * i) / steps), Math.round((n.rows * i) / steps));
      }
    } else {
      // по индексу: сначала к шкафу каталога, карточка — и сразу к нужной полке
      const ix = n.index && cats.get(n.index);
      if (ix) {
        const p = ix.g.position;
        await E.robotGo(p.x, 0);
        E.face(Math.PI);
        E.aimBeam(V(p.x, 0.9, p.z));
        tween(ix.g.position, {y: 0.62}, 160, 'out').then(() => tween(ix.g.position, {y: 0.5}, 200, 'io'));
        await sleep(Math.max(120, 600 / spd));
      }
      const hits = Math.min(n.kind === 'Bitmap Heap Scan' ? 4 : 1, 4);
      const rr = rng((n.rows || 1) * 7 + 3);
      for (let h = 0; h < hits; h++) {
        const x = Z.x0 + (Z.x1 - Z.x0) * rr();
        await E.robotGo(x, Z.z);
        E.face(Math.PI);
        await flash(x, Z.aim);
      }
      show(n.rows, n.rows);
    }
    E.beamOff();
    E.camS.follow = false;
  }
  // pg_dump: коробка с копией — в архив
  async function backup(name) {
    const g = new THREE.Group();
    g.add(rbox(0.34, 0.24, 0.3, 0.03, 0xd9b98a));
    E.bakeGroup(g);
    E.label(esc(name), 'ixlab new', g, 0, 0.3, 0);
    g.position.set(E.robot.position.x, 1.2, 0);
    root.add(g);
    archive.push(g);
    const i = archive.length - 1;
    await tween(g.position, {x: LEN1 - 0.7 + (i % 3) * 0.3, y: 1.32, z: CATZ - 0.2}, 700, 'io');
  }

  // финал: в читальном зале зажигаются лампы — читатели встают
  async function takeoff() {
    E.camS.follow = false;
    E.beamOff();
    await calm(true);
    const jobs = [];
    [...objs.reader.values()].forEach((O, i) => {
      O.away = true;
      E.setPose(O.g, 'stand');
      jobs.push(sleep(i * 60).then(() => E.bounce(O.g, 0.22)));
    });
    await Promise.all(jobs);
    await sleep(600);
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);

  return Object.assign(E, {build, sync, locate, say, answer, calm, takeoff, scan, catalog, backup, objs, model, LEN0});
}
