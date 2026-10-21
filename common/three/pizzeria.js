// Сцена пиццерии «SQL Pizza» (ЛР-17–20) — тот же движок, что у аэропорта, другой зал:
//   pizza   — пиццы на витрине у задней стены (справочник);
//   orders  — коробки заказов стопками на столе выдачи, крышка — цвета пиццы, на крышке — номер заказа;
//   courier — курьеры с термосумками у двери;
//   client  — гости за столиками зала.
// Между столом выдачи и проходом робота — полоса итогов: GROUP BY раскладывает туда коробки по группам.
// Интерфейс тот же, что у сцен аэропорта (build, sync, locate, answer, calm…) — им пользуется common/qlab.js.
import {createEngine, THREE, V, tween, sleep} from './engine.js';
import {rng} from '../rng.js';

export {sleep, tween};
const STACK = 4, // коробок в стопке
  BOXH = 0.075;

export function createPizzeria(stage, {pizzaColor = () => 0xd2483c} = {}) {
  const E = createEngine(stage, {home: {tx: 2.6, tz: -0.4}, sunTarget: [3, 0, -1], viewH: 7.6, followZoom: 1.4, apronZ: -60});
  const {root, rbox, at, mat} = E;
  const LEN0 = -3.4,
    LEN1 = 9.2,
    MID = (LEN0 + LEN1) / 2,
    LEN = LEN1 - LEN0;
  const WALLZ = -4.3,
    FRONT = 4.4,
    SHOWZ = -3.45, // витрина
    TABLEZ = -2.0, // стол выдачи
    PILEZ = -1.0, // полоса итогов — между столом выдачи и проходом
    DOORZ = 2.6;
  Object.assign(E.geo, {LEN0, LEN1, MID, LEN, DOOR: {x: LEN0 - 0.6, z: DOORZ}});
  E.robot.position.set(LEN0 + 1.6, 0, 0);

  // ═══════════════════════════════════════════════════════ здание ══
  const slab = rbox(LEN + 1.4, 0.3, FRONT - WALLZ + 0.2, 0.06, 0xe7dccb);
  at(slab, MID, -0.15, (FRONT + WALLZ) / 2);
  root.add(slab);
  // пол — «шахматка» у кухни, доски в зале
  for (let x = LEN0 - 0.6; x < LEN1 + 0.6; x += 0.6)
    for (let z = WALLZ + 0.1; z < -0.6; z += 0.6) {
      if ((Math.round(x / 0.6) + Math.round(z / 0.6)) % 2) continue;
      const t = rbox(0.6, 0.01, 0.6, 0.004, 0xd3c6b1);
      at(t, x + 0.3, 0.004, z + 0.3);
      t.castShadow = false;
      root.add(t);
    }
  for (let z = 0.65; z < FRONT; z += 0.32) {
    const b = rbox(LEN + 1.3, 0.008, 0.02, 0.002, 0xcdbb9f);
    at(b, MID, 0.004, z);
    b.castShadow = false;
    root.add(b);
  }
  // проход робота
  const walk = rbox(LEN + 0.6, 0.012, 0.95, 0.01, 0xcfc3ae);
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
  // задняя стена: плитка, вывеска, печи
  const wall = rbox(LEN + 1.4, 2.9, 0.18, 0.05, 0xf4ede0);
  at(wall, MID, 1.45, WALLZ);
  root.add(wall);
  const tile = rbox(LEN + 1.4, 1.1, 0.04, 0.02, 0xd2483c);
  at(tile, MID, 0.55, WALLZ + 0.11);
  root.add(tile);
  for (let x = LEN0 - 0.6; x < LEN1 + 0.7; x += 0.3) {
    const s = rbox(0.02, 1.1, 0.05, 0.004, 0xf4ede0);
    at(s, x, 0.55, WALLZ + 0.12);
    s.castShadow = false;
    root.add(s);
  }
  E.flatLabel('SQL PIZZA · кухня', root, {x: MID - 1.4, y: 2.35, z: WALLZ + 0.11, h: 0.42, color: '#22252b', bg: '#ffc21a'});
  // две печи справа
  [LEN1 - 1.6, LEN1 - 0.2].forEach((x, i) => {
    const body = rbox(1.15, 1.5, 0.9, 0.3, 0xb5523b);
    at(body, x, 0.75, WALLZ + 0.6);
    root.add(body);
    const mouth = rbox(0.6, 0.36, 0.06, 0.16, 0x2a1c16);
    at(mouth, x, 0.72, WALLZ + 1.06);
    root.add(mouth);
    const glow = rbox(0.5, 0.06, 0.04, 0.02, 0xffa53a, {emissive: 0xff7a1a});
    at(glow, x, 0.58, WALLZ + 1.08);
    root.add(glow);
    const pipe = rbox(0.22, 1.0, 0.22, 0.06, 0x8b857a);
    at(pipe, x, 1.95, WALLZ + 0.45);
    root.add(pipe);
    E.flatLabel(`ПЕЧЬ ${i + 1}`, root, {x, y: 1.25, z: WALLZ + 1.06, h: 0.15, color: '#fff', bg: null});
  });
  // витрина с пиццами: длинный прилавок у задней стены
  const showW = LEN1 - 3.0 - (LEN0 + 0.4);
  const show = rbox(showW, 0.8, 0.75, 0.06, 0xece2cf);
  at(show, LEN0 + 0.4 + showW / 2, 0.4, SHOWZ);
  root.add(show);
  const showTop = rbox(showW + 0.1, 0.05, 0.85, 0.02, 0x6a4a35);
  at(showTop, LEN0 + 0.4 + showW / 2, 0.82, SHOWZ);
  root.add(showTop);
  E.flatLabel('меню · таблица pizza', root, {x: LEN0 + 1.5, y: 0.4, z: SHOWZ + 0.38, h: 0.15});
  // стол выдачи заказов
  const tableW = LEN1 - LEN0 - 1.2;
  const tbl = rbox(tableW, 0.06, 0.75, 0.03, 0x8a6446);
  at(tbl, LEN0 + 0.6 + tableW / 2, 0.62, TABLEZ);
  root.add(tbl);
  for (let x = LEN0 + 0.8; x <= LEN1 - 0.5; x += 2.0)
    [-0.3, 0.3].forEach(dz => {
      const leg = rbox(0.06, 0.6, 0.06, 0.02, 0x5b4231);
      at(leg, x, 0.3, TABLEZ + dz);
      root.add(leg);
    });
  E.flatLabel('выдача заказов · таблица orders', root, {x: LEN0 + 1.9, y: 0.66, z: TABLEZ + 0.39, h: 0.13});
  // полоса итогов перед проходом
  const strip = rbox(LEN - 0.8, 0.01, 0.62, 0.01, 0xf3e4c4);
  at(strip, MID + 0.2, 0.008, PILEZ);
  strip.castShadow = false;
  root.add(strip);
  E.flatLabel('итоги · GROUP BY', root, {x: LEN0 + 0.9, y: 0.016, z: PILEZ, rx: -Math.PI / 2, h: 0.18});
  // левая стена с выходом на улицу
  const side = rbox(0.18, 2.9, FRONT - WALLZ, 0.05, 0xf4ede0);
  at(side, LEN0 - 0.7, 1.45, (FRONT + WALLZ) / 2);
  root.add(side);
  const door = rbox(0.06, 2.0, 1.2, 0.03, 0x2f6f73);
  at(door, LEN0 - 0.6, 1.0, DOORZ);
  root.add(door);
  E.flatLabel('ДОСТАВКА', root, {x: LEN0 - 0.58, y: 2.2, z: DOORZ, ry: Math.PI / 2, h: 0.3, color: '#22252b', bg: '#ffc21a'});
  E.flatLabel('курьеры · courier', root, {x: LEN0 + 0.3, y: 0.016, z: 3.9, rx: -Math.PI / 2, h: 0.18});
  // зал: столики на четверых
  const TABLES = [1.4, 3.6, 5.8, 8.0];
  TABLES.forEach(x => {
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 24), mat(0xfbf8f2));
    top.position.set(x, 0.7, 3.0);
    top.castShadow = top.receiveShadow = true;
    root.add(top);
    const leg = rbox(0.08, 0.68, 0.08, 0.02, 0x3f474d);
    at(leg, x, 0.34, 3.0);
    root.add(leg);
    [-0.36, 0.36].forEach(dx =>
      [2.35, 3.65].forEach(z => {
        const s = rbox(0.4, 0.06, 0.4, 0.05, 0x2f6f73);
        at(s, x + dx, 0.4, z);
        root.add(s);
      }),
    );
  });
  E.flatLabel('зал · гости · client', root, {x: TABLES[0] - 0.4, y: 0.016, z: 4.15, rx: -Math.PI / 2, h: 0.18});

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
  const objs = {pizza: new Map(), orders: new Map(), courier: new Map(), client: new Map()};
  const PK = {pizza: 'id', orders: 'id', courier: 'id', client: 'id'};
  let seedR = rng(1);
  // точка для меток и стержней соединения у человечка — на уровне груди
  const anchorOf = (g, y) => {
    const a = new THREE.Object3D();
    a.position.y = y;
    g.add(a);
    g.userData.anchor = a;
    return a;
  };
  function makePizza(row) {
    const g = new THREE.Group();
    const board = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 28), mat(0x9a6a43));
    board.position.y = 0.015;
    g.add(board);
    const dough = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.29, 0.05, 28), mat(0xe8c07a));
    dough.position.y = 0.055;
    g.add(dough);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.255, 0.255, 0.02, 28), mat(pizzaColor(row)));
    top.position.y = 0.085;
    g.add(top);
    const r = rng(row.id * 13 + 7);
    for (let i = 0; i < 7; i++) {
      const a = r() * Math.PI * 2,
        d = 0.06 + r() * 0.15;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 10), mat(row.veg ? 0x5c8a3a : 0x9b2f22));
      t.position.set(Math.cos(a) * d, 0.1, Math.sin(a) * d);
      g.add(t);
    }
    g.traverse(m => {
      if (m.isMesh) m.castShadow = true;
    });
    E.flatLabel(`${row.name} · ${row.price} ₽`, g, {x: 0, y: -0.22, z: 0.43, h: 0.14, color: '#22252b'});
    E.setPick(g, {t: 'pizza', k: row.id});
    return g;
  }
  const PIZZAC = new Map();
  function makeBox(row) {
    const g = new THREE.Group();
    const box = rbox(0.42, BOXH, 0.42, 0.02, 0xd9b98a);
    g.add(box);
    const lid = rbox(0.3, 0.012, 0.3, 0.01, PIZZAC.get(row.pizza_id) ?? 0x888888);
    at(lid, 0, BOXH / 2 + 0.004, 0);
    g.add(lid);
    if (row.courier_id == null) {
      // самовывоз — без наклейки доставки; с курьером — жёлтая наклейка
    } else {
      const st = rbox(0.08, 0.014, 0.16, 0.005, 0xffc21a);
      at(st, 0.17, BOXH / 2 + 0.006, 0);
      g.add(st);
    }
    E.bakeGroup(g);
    E.flatLabel(String(row.id), g, {
      x: 0,
      y: BOXH / 2 + 0.02,
      z: 0,
      rx: -Math.PI / 2,
      h: 0.16,
      color: '#22252b',
      bg: 'rgba(255,255,255,.85)',
    });
    E.setPick(g, {t: 'orders', k: row.id});
    return g;
  }
  const CAP = [0xffc21a, 0xd2483c, 0x2f6f73, 0x3b4d7a, 0x6b4f9a, 0x5c8a3a];
  function makeCourier(row) {
    const female = /а\s/.test(row.name);
    const g = E.makePerson({kid: false, female, old: false}, seedR);
    const helmet = rbox(0.36, 0.14, 0.36, 0.08, CAP[row.id % CAP.length]);
    at(helmet, 0.04, 1.2, 0);
    g.add(helmet);
    const bag = rbox(0.18, 0.42, 0.4, 0.05, 0xffc21a);
    at(bag, 0.28, 0.72, 0);
    g.add(bag);
    E.flatLabel(row.name, g, {x: 0, y: 0.02, z: 0.42, rx: -Math.PI / 2, h: 0.12, color: '#22252b'});
    E.setPose(g, 'stand');
    anchorOf(g, 0.95);
    E.setPick(g, {t: 'courier', k: row.id});
    return g;
  }
  function makeClient(row) {
    const female = /а\s/.test(row.full_name);
    const g = E.makePerson({kid: false, female, old: false}, seedR);
    E.setPose(g, 'sit');
    anchorOf(g, 0.95);
    E.setPick(g, {t: 'client', k: row.id});
    return g;
  }
  const MAKE = {pizza: makePizza, orders: makeBox, courier: makeCourier, client: makeClient};

  // ═══════════════════════════════════════════════ где чьё место ══
  const SEATS = [];
  TABLES.forEach(x =>
    [-0.36, 0.36].forEach(dx =>
      [
        [2.35, Math.PI / 2],
        [3.65, -Math.PI / 2],
      ].forEach(([z, rot]) => SEATS.push({p: V(x + dx, 0, z), rot})),
    ),
  );
  SEATS.sort((a, b) => a.p.x - b.p.x || a.p.z - b.p.z);
  // i — порядковый номер строки в таблице, n — сколько строк
  function slot(t, i, n) {
    if (t === 'pizza') {
      const step = Math.min(0.9, (showW - 0.6) / Math.max(n, 1));
      return {p: V(LEN0 + 0.8 + i * step, 0.85, SHOWZ), rot: 0};
    }
    if (t === 'orders') {
      const per = Math.max(STACK, Math.ceil(n / 14)),
        col = Math.floor(i / per),
        lay = i % per;
      return {p: V(LEN0 + 0.95 + col * 0.6, 0.65 + BOXH / 2 + lay * BOXH, TABLEZ), rot: 0};
    }
    if (t === 'courier')
      return {p: V(LEN0 + 0.15 + (i % 3) * 0.55, 0, 1.55 + Math.floor(i / 3) * 0.75 + (i % 3) * 0.12), rot: 0, pose: 'stand'};
    // гости: за столиками, лишние — стоят у стойки
    const s = SEATS[i];
    return s
      ? {p: s.p.clone(), rot: s.rot, pose: 'sit'}
      : {p: V(LEN1 - 0.6 - (i - SEATS.length) * 0.5, 0, 4.0), rot: Math.PI / 2, pose: 'stand'};
  }
  const order = new Map(); // t → [ключи по порядку]
  function placeAll(t, anim) {
    const ks = order.get(t) || [];
    const jobs = [];
    ks.forEach((k, i) => {
      const O = objs[t].get(k);
      if (!O) return;
      const s = slot(t, i, ks.length);
      O.home = s;
      if (s.pose) E.setPose(O.g, s.pose);
      O.g.rotation.y = s.rot;
      if (anim && O.g.position.distanceTo(s.p) > 0.01) jobs.push(tween(O.g.position, {x: s.p.x, y: s.p.y, z: s.p.z}, 420));
      else O.g.position.copy(s.p);
    });
    return Promise.all(jobs);
  }

  // ═════════════════════════════════════════════ состояние сцены ══
  const model = {pizza: new Map(), orders: new Map(), courier: new Map(), client: new Map()};
  let piles = [];
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
    seedR = rng(seed * 31 + 17);
    clearPiles();
    E.clearChips();
    E.hideCard();
    E.clearSay();
    PIZZAC.clear();
    state.pizza.forEach(p => PIZZAC.set(p.id, pizzaColor(p)));
    Object.keys(objs).forEach(t => [...objs[t].keys()].forEach(k => drop(t, k)));
    Object.keys(objs).forEach(t => {
      (state[t] || []).forEach(r => add(t, r));
      order.set(
        t,
        (state[t] || []).map(r => r[PK[t]]),
      );
      placeAll(t, false);
    });
    E.robotHome();
    E.sweepLabels();
  }
  // изменения данных (ЛР-20): новые строки появляются, удалённые уходят, изменённые перерисовываются
  async function sync(state, anim = true) {
    await calm(false);
    const jobs = [];
    try {
      state.pizza.forEach(p => PIZZAC.set(p.id, pizzaColor(p)));
      for (const t of Object.keys(objs)) {
        const rows = state[t] || [],
          want = new Map(rows.map(r => [r[PK[t]], r]));
        [...objs[t].keys()].forEach(k => {
          if (want.has(k)) return;
          const O = objs[t].get(k);
          objs[t].delete(k);
          model[t].delete(k);
          const go = async () => {
            if (anim) {
              if (t === 'client' || t === 'courier') {
                E.sayAt(O.g, 'До свидания…', 1200);
                await E.walk(O.g, [V(O.g.position.x, 0, 1.0), V(LEN0 - 0.3, 0, 1.0)], 3);
              } else {
                await tween(O.g.position, {y: O.g.position.y + 0.5}, 220, 'out');
                await tween(O.g.scale, {x: 0.01, y: 0.01, z: 0.01}, 260, 'in');
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
            // перерисовать на том же месте
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
      // новые — из двери (люди) или из печи (коробки, пиццы); остальные подвигаются на свои места
      for (const t of Object.keys(objs)) {
        const ks = order.get(t);
        ks.forEach((k, i) => {
          const O = objs[t].get(k),
            s = slot(t, i, ks.length);
          if (O.fresh) {
            O.fresh = false;
            if (anim) {
              O.g.position.set(
                t === 'client' || t === 'courier' ? LEN0 - 0.3 : LEN1 - 1.6,
                s.p.y,
                t === 'client' || t === 'courier' ? DOORZ : WALLZ + 1.2,
              );
              O.g.scale.setScalar(0.01);
              tween(O.g.scale, {x: 1, y: 1, z: 1}, 300, 'back');
            } else O.g.position.copy(s.p);
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
      const O = objs[t] && objs[t].get(+k);
      if (!O) return null;
      return O.g.userData.anchor || O.g;
    },
    t => (t === 'client' || t === 'courier' ? 0.45 : t === 'orders' ? 0.16 : 0.32),
  );
  function say(t, id, text, ms = 0) {
    const O = objs[t] && objs[t].get(+id);
    if (O && O.g.userData.legs) E.sayAt(O.g, text, ms);
  }

  // ═══════════════════════════════════════ где стоять роботу у строки ══
  function locate(t, row) {
    const O = objs[t] && objs[t].get(+row[PK[t] || 'id']);
    const p = O ? (O.g.userData.anchor || O.g).getWorldPosition(V(0, 0, 0)) : V(0, 0, 0);
    if (!O) return {x: E.HOME.x, z: 0, face: -Math.PI / 2, aim: p};
    return {x: Math.min(LEN1 - 0.3, Math.max(LEN0 + 0.4, p.x)), z: 0, face: p.z < 0 ? Math.PI : 0, aim: p};
  }

  // ═════════════════════════════════════ ответ SELECT: строки ответа «выходят вперёд» ══
  async function answer(t, keys, ordered) {
    const jobs = [];
    keys.forEach((k, i) => {
      const O = objs[t] && objs[t].get(+k);
      if (!O) return;
      O.away = true;
      if (t === 'client') {
        E.setPose(O.g, 'stand');
        jobs.push(sleep(i * 25).then(() => E.bounce(O.g, 0.18)));
      } else if (t === 'orders')
        jobs.push(sleep(i * (ordered ? 50 : 20)).then(() => tween(O.g.position, {z: TABLEZ + 0.12, y: O.g.position.y + 0.04}, 220, 'out')));
      else jobs.push(sleep(i * 30).then(() => E.bounce(O.g, 0.16)));
    });
    await Promise.all(jobs);
  }

  // ═════════════════════════ GROUP BY: коробки — в стопки по группам, у каждой — итог ══
  // groups: [{label, keys: [номера строк], agg: 'текст итога' | null}]; t — таблица, чьи строки раскладываются
  const pileG = new THREE.Group();
  root.add(pileG);
  function clearPiles() {
    piles.forEach(P => {
      E.dispose(P.a);
      pileG.remove(P.a);
    });
    piles = [];
  }
  const pileX = (i, n) => {
    const w = LEN - 2.6,
      step = Math.min(1.1, w / Math.max(n, 1));
    return LEN0 + 2.0 + step / 2 + i * step;
  };
  async function group(t, groups) {
    clearPiles();
    const n = groups.length,
      jobs = [];
    groups.forEach((G, i) => {
      const x = pileX(i, n),
        a = new THREE.Object3D();
      a.position.set(x, 0, PILEZ);
      pileG.add(a);
      const P = {a, G, keys: G.keys};
      piles.push(P);
      const h = t === 'orders' ? Math.min(G.keys.length, 14) * BOXH : 0;
      // подписи соседних стопок — через одну выше, чтобы не наползали
      P.lab = E.label(
        `<b>${esc(G.label)}</b>${G.agg != null ? `<span>${esc(G.agg)}</span>` : ''}`,
        'glabel',
        a,
        0,
        h + 0.5 + (i % 2) * 0.55,
        0,
      );
      if (t !== 'orders') return;
      G.keys.forEach((k, j) => {
        const O = objs.orders.get(+k);
        if (!O) return;
        O.away = true;
        const lay = Math.min(j, 13),
          dx = j > 13 ? 0.08 : 0;
        jobs.push(
          sleep(Math.min(1200, (i * 4 + j) * (90 / Math.min(E.speed, 4)))).then(async () => {
            const p = O.g.position;
            await tween(p, {y: p.y + 0.3}, 120 / Math.min(E.speed, 4) + 60, 'out');
            await tween(p, {x: x + dx, y: BOXH / 2 + 0.01 + lay * BOXH + 0.3, z: PILEZ}, 300 / Math.min(E.speed, 4) + 120, 'io');
            await tween(p, {y: BOXH / 2 + 0.01 + lay * BOXH}, 120, 'in');
          }),
        );
      });
    });
    await Promise.all(jobs);
  }
  // HAVING: группы, не прошедшие условие, гаснут
  async function groupCut(keep) {
    piles.forEach((P, i) => {
      const ok = keep[i];
      P.lab.element.classList.toggle('out', !ok);
      P.lab.element.classList.toggle('in', !!ok);
      if (!ok)
        P.keys.forEach(k => {
          const O = objs.orders.get(+k);
          if (O) tween(O.g.position, {y: O.g.position.y * 0.3}, 300, 'in');
        });
    });
    await sleep(400 / Math.min(E.speed, 4) + 100);
  }

  // все — на свои места, стопки итогов разобрать
  async function calm(anim = true) {
    clearPiles();
    const jobs = [];
    Object.keys(objs).forEach(t =>
      objs[t].forEach(O => {
        if (!O.away || !O.home) return;
        O.away = false;
        const s = O.home;
        if (s.pose) E.setPose(O.g, s.pose);
        O.g.rotation.y = s.rot;
        if (anim) jobs.push(tween(O.g.position, {x: s.p.x, y: s.p.y, z: s.p.z}, 360, 'io'));
        else O.g.position.copy(s.p);
      }),
    );
    await Promise.all(jobs);
  }

  // ═════════════════════════════════════ финал: курьер уезжает с заказом ══
  async function takeoff() {
    E.camS.follow = false;
    E.beamOff();
    await calm(true);
    const C = [...objs.courier.values()][0],
      B = [...objs.orders.values()].slice(-1)[0];
    if (!C) return;
    E.focus(C.g.position);
    if (B) {
      const p = C.g.position;
      await tween(B.g.position, {x: p.x + 0.1, y: 1.05, z: p.z}, 700, 'io');
      C.g.attach(B.g);
    }
    E.sayAt(C.g, 'Заказ поехал!', 1500);
    await E.walk(C.g, [V(C.g.position.x, 0, DOORZ), V(LEN0 - 1.4, 0, DOORZ)], 3);
    E.focus(null);
  }
  const resetRoot0 = E.resetRoot;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);

  return Object.assign(E, {
    build,
    sync,
    locate,
    say,
    answer,
    group,
    groupCut,
    calm,
    takeoff,
    resetRoot: () => {
      resetRoot0();
    },
    objs,
    model,
    LEN0,
  });
}
