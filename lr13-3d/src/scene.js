// ЛР-13 · 3D-сцена: пустой салон, кресла из таблицы seat, очередь у трапа, тележка с багажом, табло, робот-СУБД.
// Общее (свет, робот, подписи, камера, эффекты) — в common/three/engine.js; здесь — что есть только в этой лабе.
import {createEngine, THREE, V, ZS, seatX, bagSize, tween, sleep} from '../../common/three/engine.js';
import {esc} from '../../common/util.js';
import {ROWS, rng, seatRow, seatL, shelfOf} from './data.js';

export {sleep};

export function createWorld(stage) {
  const E = createEngine(stage, {home: {tx: 1.2, tz: 1.7}, sunTarget: [2, 0, 1], viewH: 7.4, followZoom: 1.4, apronZ: -1.2});
  const {scene, root, rbox, at, label, mat, setPick} = E;
  const {LEN0, DOOR} = E.airframe({rows: ROWS, wing: [3.0, 4.3, 5.4, 3.4], wingRow: 2.6, engRow: 3.6, engZ: 4.6, dashes: 12, rails: true});
  const ZB = {A: -1.85, B: -1.42, C: -1.0, D: 1.0, E: 1.42, F: 1.85}; // в бизнес-классе кресла шире
  const seatZ = s => (seatRow(s) <= 2 ? ZB : ZS)[seatL(s)];
  const validSeat = s => /^[1-6][A-F]$/.test(String(s || ''));
  // ряды — номера на полу у прохода
  for (let r = 1; r <= ROWS; r++)
    E.flatLabel(String(r), root, {
      x: seatX(r),
      y: 0.015,
      z: -0.62,
      rx: -Math.PI / 2,
      h: 0.36,
      color: 'rgba(255,255,255,.8)',
      bg: null,
      mono: true,
    });
  // полки над рядами (по два ряда на полку)
  const BIN_Y = 1.55,
    BIN_Z = -2.55,
    SHELVES = Math.ceil(ROWS / 2);
  const shelfX0 = k => seatX(2 * k - 1) - 0.6,
    shelfX1 = k => seatX(2 * k) + 0.6;
  const binB = rbox(shelfX1(SHELVES) - shelfX0(1), 0.06, 0.62, 0.02, 0xd9d3c4);
  at(binB, (shelfX0(1) + shelfX1(SHELVES)) / 2, BIN_Y, BIN_Z);
  root.add(binB);
  const binT = rbox(shelfX1(SHELVES) - shelfX0(1), 0.05, 0.62, 0.02, 0xece6d8);
  at(binT, binB.position.x, BIN_Y + 0.62, BIN_Z);
  root.add(binT);
  for (let k = 0; k <= SHELVES; k++) {
    const dv = rbox(0.05, 0.62, 0.62, 0.02, 0xcbc4b3);
    at(dv, k === SHELVES ? shelfX1(k) : shelfX0(k + 1), BIN_Y + 0.31, BIN_Z);
    root.add(dv);
  }
  // подписи лежат на крышке полок
  for (let k = 1; k <= SHELVES; k++)
    E.flatLabel(`полка ${k}`, root, {x: (shelfX0(k) + shelfX1(k)) / 2, y: BIN_Y + 0.66, z: BIN_Z + 0.05, rx: -Math.PI / 2, h: 0.42});
  const {board, show: showBoard} = E.flightBoard();

  // ════════════════════════════════════════════════ трап и тележка ══
  const BR = {x0: DOOR.x - 0.7, x1: DOOR.x + 2.3, z0: 3.05, z1: 6.6};
  const bridge = rbox(BR.x1 - BR.x0, 0.14, BR.z1 - BR.z0, 0.04, 0xb9b3a6);
  at(bridge, (BR.x0 + BR.x1) / 2, -0.07, (BR.z0 + BR.z1) / 2);
  scene.add(bridge);
  const lane = rbox(0.9, 0.02, BR.z1 - BR.z0 - 0.2, 0.01, 0x4a5684);
  at(lane, DOOR.x, 0.005, (BR.z0 + BR.z1) / 2);
  lane.castShadow = false;
  scene.add(lane);
  [BR.x0 + 0.05, BR.x1 - 0.05].forEach(x => {
    const r = rbox(0.05, 0.05, BR.z1 - BR.z0, 0.02, 0x3f474d);
    at(r, x, 0.55, (BR.z0 + BR.z1) / 2);
    scene.add(r);
    for (let z = BR.z0 + 0.3; z < BR.z1; z += 0.8) {
      const p = rbox(0.04, 0.55, 0.04, 0.01, 0x3f474d);
      at(p, x, 0.27, z);
      scene.add(p);
    }
  });
  [
    [BR.x0 + 0.3, BR.z1 - 0.3],
    [BR.x1 - 0.3, BR.z1 - 0.3],
  ].forEach(([x, z]) => {
    const l = rbox(0.24, 1.3, 0.24, 0.05, 0x8b857a);
    at(l, x, -0.75, z);
    scene.add(l);
  });
  E.flatLabel('ТРАП', scene, {x: (BR.x0 + BR.x1) / 2, y: 0.02, z: BR.z1 - 0.4, rx: -Math.PI / 2, h: 0.5});
  const cartPos = V(DOOR.x + 1.35, 0, 4.4);
  const cart = new THREE.Group();
  scene.add(cart);
  cart.position.copy(cartPos);
  {
    const bed = rbox(1.1, 0.08, 1.5, 0.03, 0x6d747a);
    at(bed, 0, 0.3, 0);
    cart.add(bed);
    const h = rbox(0.05, 0.5, 1.3, 0.02, 0x3f474d);
    at(h, 0.55, 0.55, 0);
    cart.add(h);
    [
      [-0.4, -0.6],
      [0.4, -0.6],
      [-0.4, 0.6],
      [0.4, 0.6],
    ].forEach(([x, z]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.07, 14), mat(0x22252b));
      w.rotation.x = Math.PI / 2;
      at(w, x, 0.12, z);
      w.castShadow = true;
      cart.add(w);
    });
    E.flatLabel('багаж к рейсу', cart, {x: 0, y: 0.02, z: 1.05, rx: -Math.PI / 2, h: 0.28});
  }
  cart.visible = false;
  // статичный корпус и трап — по одному мешу на всё
  {
    root.updateMatrixWorld(true);
    scene.updateMatrixWorld(true);
    const st = root.children.filter(o => o.isMesh && o !== board && !o.material.transparent);
    root.add(E.bakeMeshes(st, o => o.matrix.clone()));
    st.forEach(o => root.remove(o));
    const s2 = scene.children.filter(o => o.isMesh && o !== E.ground && !o.material.transparent);
    scene.add(E.bakeMeshes(s2, o => o.matrix.clone()));
    s2.forEach(o => scene.remove(o));
    E.bakeGroup(cart);
  }
  const qPos = i => V(DOOR.x, 0, 3.55 + i * 0.62);
  const cartSlot = i =>
    V(cartPos.x + (i % 2 ? 0.25 : -0.25), 0.5 + Math.floor(i / 2) * 0.32, cartPos.z - 0.45 + (Math.floor(i / 2) % 3) * 0.45);

  // ══════════════════════════════════════════════════════════ кресла ══
  const seats = new Map(),
    ghosts = new Map();
  function makeSeat(row) {
    const biz = row.cls === 'бизнес';
    const g = new THREE.Group();
    const c1 = biz ? 0x7a4b3a : 0x2f6f73,
      c2 = biz ? 0x643c2e : 0x265a5e,
      w = biz ? 0.62 : 0.5;
    const base = rbox(0.52, 0.16, w, 0.06, c1);
    at(base, 0, 0.32, 0);
    g.add(base);
    const back = rbox(0.13, biz ? 0.76 : 0.66, w, 0.05, c2);
    at(back, 0.26, biz ? 0.7 : 0.66, 0);
    g.add(back);
    const head = rbox(0.14, 0.16, w * 0.72, 0.04, 0xece6d6);
    at(head, 0.27, biz ? 1.02 : 0.93, 0);
    g.add(head);
    const leg = rbox(0.32, 0.24, 0.08, 0.03, 0x6d747a);
    at(leg, 0.02, 0.12, 0);
    g.add(leg);
    [-1, 1].forEach(s => {
      const arm = rbox(0.42, biz ? 0.1 : 0.06, 0.07, 0.02, biz ? 0x4a2e24 : 0x3f474d);
      at(arm, 0.06, 0.48, s * (w / 2 + 0.03));
      g.add(arm);
    });
    E.bakeGroup(g);
    setPick(g, {t: 'seat', k: row.seat_no});
    return g;
  }
  const seatSpot = s => V(validSeat(s) ? seatX(seatRow(s)) : DOOR.x, 0, validSeat(s) ? seatZ(s) : 2.2);
  // пунктирный контур кресла, которое нужно поставить
  function makeGhost(s) {
    const g = new THREE.Group();
    const m = rbox(0.56, 0.9, 0.56, 0.1, 0xffc21a, {transparent: true, opacity: 0.3, emissive: 0x6b5000, depthWrite: false});
    m.castShadow = false;
    at(m, 0, 0.45, 0);
    g.add(m);
    label(esc(s), 'gseat', g, 0, 0.95, 0);
    g.position.copy(seatSpot(s));
    return g;
  }
  async function addSeat(row, anim) {
    const old = seats.get(row.seat_no);
    if (old) {
      E.dispose(old.g);
      root.remove(old.g);
    }
    const g = makeSeat(row);
    g.position.copy(seatSpot(row.seat_no));
    if (!validSeat(row.seat_no)) g.position.set(DOOR.x + (seats.size % 3) * 0.6, 0, 1.6);
    root.add(g);
    seats.set(row.seat_no, {g, row: {...row}});
    refreshGhosts();
    if (anim) {
      const y = g.position.y;
      g.position.y = 2.6;
      await tween(g.position, {y}, 650 / Math.min(E.speed, 3), 'drop');
    }
  }
  async function removeSeat(s, anim) {
    const S = seats.get(s);
    if (!S) return;
    seats.delete(s);
    if (anim) await tween(S.g.position, {y: 2.6}, 380, 'in');
    E.dispose(S.g);
    root.remove(S.g);
    refreshGhosts();
  }
  function refreshGhosts() {
    ghosts.forEach((G, s) => {
      G.visible = !seats.has(s);
      G.traverse(o => {
        if (o.isCSS2DObject) o.element.style.display = G.visible ? '' : 'none';
      });
    });
  }

  // ═══════════════════════════════════════════════════════ пассажиры ══
  const people = new Map(),
    bags = new Map(),
    queue = new Map(),
    cartBags = new Map();
  let queueDocs = [],
    cartDocs = [],
    FLIGHT = '';
  // внешность — по номеру пассажира: в очереди и в салоне он один и тот же
  function makePerson(p) {
    const g = E.makePerson(
      {
        kid: p.kid ?? (p.birth_year != null && p.birth_year >= 2012),
        female: p.female ?? /а\s/.test(String(p.full_name || '')),
        old: p.birth_year != null && p.birth_year < 1962,
      },
      rng((p.id || 1) * 131 + 7),
    );
    g.userData.id = p.id;
    E.setPose(g, 'stand');
    return g;
  }
  const attachTray = (P, meal, anim) => E.attachTray(P, meal, anim, P.g.userData.kid ? 0.42 : 0.56);
  const onBoard = row => row.flight_no === FLIGHT && seats.has(row.seat_no);
  const seatPos = (s, kid) => {
    const v = seatSpot(s);
    v.x -= 0.02;
    v.y = kid ? 0.08 : 0;
    return v;
  };
  const wingSpot = id => V(seatX(3) + (id % 4) * 0.5, -0.75, -3.6 - (id % 3) * 0.45); // не на свой рейс — стоит на крыле
  const targetOf = (row, kid) => (onBoard(row) ? seatPos(row.seat_no, kid) : wingSpot(row.id));
  async function boardWalk(P, to) {
    // от трапа через дверь к креслу
    const g = P.g,
      p = g.position;
    const path = [];
    if (p.z > 2.5) path.push(V(DOOR.x, 0, p.z), V(DOOR.x, 0, 0.3));
    if (to.y < -0.5) path.push(V(to.x, 0, -0.3), V(to.x, -0.75, -3.0), to.clone());
    else path.push(V(to.x, 0, Math.sign(to.z) * 0.3), to.clone());
    await E.walk(g, path);
    await E.turn(g, 0); // лицом по ходу самолёта — и садится
    if (to.y > -0.5) E.setPose(g, 'sit');
  }
  async function backToQueue(g, i) {
    const p = g.position,
      q = qPos(i);
    await E.walk(g, [V(p.x, p.y, Math.sign(p.z || 1) * 0.3), V(DOOR.x, 0, 0.3), V(DOOR.x, 0, q.z)]);
    await E.turn(g, -Math.PI / 2);
  }
  function toQueue(g, doc, i) {
    setPick(g, {t: 'queue', k: doc.id});
    const lb = label(`№ ${doc.id}`, 'qtag', g, 0, 1.45 / g.userData.s, 0);
    queue.set(doc.id, {g, i, doc, lb});
  }
  function addQueuePerson(doc, i) {
    const g = makePerson(doc);
    g.position.copy(qPos(i));
    g.rotation.y = -Math.PI / 2;
    scene.add(g);
    toQueue(g, doc, i);
    return g;
  }
  async function addPerson(row, anim) {
    let g,
      from = null;
    const Q = queue.get(row.id);
    if (Q) {
      g = Q.g;
      queue.delete(row.id);
      Q.lb.parent && Q.lb.parent.remove(Q.lb);
      Q.lb.element.remove();
      scene.remove(g);
      from = g.position.clone();
    } else {
      g = makePerson(row);
      from = anim ? V(DOOR.x, 0, BR.z1 - 0.2) : null;
    }
    setPick(g, {t: 'passenger', k: row.id});
    root.add(g);
    const P = {g, row: {...row}, tray: null};
    people.set(row.id, P);
    const to = targetOf(row, g.userData.kid);
    if (!anim) {
      g.position.copy(to);
      g.rotation.y = to.y < -0.5 ? Math.PI / 2 : 0;
      E.setPose(g, to.y < -0.5 ? 'stand' : 'sit');
      attachTray(P, row.meal, false);
      return P;
    }
    g.position.copy(from);
    await boardWalk(P, to);
    if (to.y < -0.5) {
      await E.turn(g, Math.PI / 2);
      say(row.id, 'Это не мой самолёт…', 2200);
    }
    attachTray(P, row.meal, true);
    return P;
  }
  async function removePerson(id, anim) {
    const P = people.get(id);
    if (!P) return;
    people.delete(id);
    const qi = queueDocs.findIndex(d => d.id === id);
    if (qi >= 0) {
      // откат: обратно в очередь
      if (P.tray) {
        P.g.remove(P.tray);
        P.tray = null;
      }
      E.dispose(P.g);
      root.remove(P.g);
      scene.add(P.g);
      toQueue(P.g, queueDocs[qi], qi);
      if (anim) await backToQueue(P.g, qi);
      else {
        P.g.position.copy(qPos(qi));
        P.g.rotation.y = -Math.PI / 2;
      }
      return;
    }
    if (anim) await tween(P.g.scale, {x: 0.01, y: 0.01, z: 0.01}, 300, 'in');
    E.dispose(P.g);
    root.remove(P.g);
  }

  // ═════════════════════════════════════════════════════════ багаж ══
  const makeBag = b => E.makeBag(Math.max(1, Math.min(40, b.weight_kg || 10)), b.tag, true);
  const ownerRow = pid => {
    const P = people.get(pid);
    return P && onBoard(P.row) ? seatRow(P.row.seat_no) : null;
  };
  function bagSlots(rows) {
    // на полке над рядом владельца; у кого нет места — на крыле
    const pos = new Map(),
      by = {};
    rows.forEach(b => {
      const r = ownerRow(b.passenger_id);
      const k = r ? shelfOf(r) : 0;
      (by[k] = by[k] || []).push(b);
    });
    for (const k in by)
      by[k].forEach((b, i) => {
        const s = bagSize(b.weight_kg);
        if (+k === 0) {
          pos.set(b.tag, V(seatX(3) + i * 0.4, -0.75 + s.h / 2, -3.3));
          return;
        }
        const per = 6,
          col = i % per,
          lay = Math.floor(i / per);
        pos.set(b.tag, V(shelfX0(+k) + 0.3 + col * 0.38, BIN_Y + 0.03 + s.h / 2 + lay * 0.3, BIN_Z + 0.02));
      });
    return pos;
  }
  const bagRows = () => [...bags.values()].map(B => B.row);
  function addCartBag(doc, i) {
    const g = makeBag(doc);
    g.position.copy(cartSlot(i));
    g.rotation.y = 0.3 * (i % 2 ? 1 : -1);
    setPick(g, {t: 'cart', k: doc.tag});
    scene.add(g);
    cartBags.set(doc.tag, {g, i, doc});
  }
  // дуга с тележки на полку
  async function arc(g, to, ms) {
    const mid = g.position.clone().lerp(to, 0.5);
    mid.y = Math.max(g.position.y, to.y) + 1.2;
    await tween(g.position, {x: mid.x, y: mid.y, z: mid.z}, ms, 'out');
    await tween(g.position, {x: to.x, y: to.y, z: to.z}, ms, 'in');
  }
  async function addBag(row, anim) {
    let g;
    const C = cartBags.get(row.tag);
    if (C) {
      cartBags.delete(row.tag);
      g = C.g;
      const wp = g.getWorldPosition(V(0, 0, 0));
      scene.remove(g);
      g.position.copy(wp).sub(root.position);
      g.rotation.y = 0;
    } else g = makeBag(row);
    root.add(g);
    setPick(g, {t: 'baggage', k: row.tag});
    bags.set(row.tag, {g, row: {...row}});
    const to = bagSlots(bagRows()).get(row.tag);
    if (!anim) {
      g.position.copy(to);
      return;
    }
    if (!C) {
      g.position.copy(to).setY(to.y + 1.5);
      await tween(g.position, {y: to.y}, 500, 'drop');
      return;
    }
    await arc(g, to, 380 / Math.min(E.speed, 3));
  }
  async function removeBag(tag, anim) {
    const B = bags.get(tag);
    if (!B) return;
    bags.delete(tag);
    const ci = cartDocs.findIndex(d => d.tag === tag);
    if (ci >= 0) {
      // откат: обратно на тележку
      E.dispose(B.g);
      root.remove(B.g);
      scene.add(B.g);
      setPick(B.g, {t: 'cart', k: tag});
      cartBags.set(tag, {g: B.g, i: ci, doc: cartDocs[ci]});
      const to = cartSlot(ci);
      if (anim) {
        const mid = B.g.position.clone().lerp(to, 0.5);
        mid.y += 1.2;
        await tween(B.g.position, {x: mid.x, y: mid.y, z: mid.z}, 300, 'out');
        await tween(B.g.position, {x: to.x, y: to.y, z: to.z}, 300, 'in');
      } else B.g.position.copy(to);
      return;
    }
    if (anim) await tween(B.g.scale, {x: 0.01, y: 0.01, z: 0.01}, 300, 'in');
    E.dispose(B.g);
    root.remove(B.g);
  }

  // ═════════════════════════════════════════════ состояние сцены ══
  let flights = new Map();
  // строки табло: рейс, время, куда, выход — по времени вылета
  const boardRows = () =>
    [...flights.values()]
      .sort((a, b) => String(a.dep_time).localeCompare(String(b.dep_time)))
      .map(f => ({
        on: f.flight_no === FLIGHT,
        cells: [f.flight_no, String(f.dep_time || '').slice(0, 5), String(f.dest || '').slice(0, 11), f.gate == null ? '—' : f.gate],
      }));
  function setBoard(rows, flash) {
    flights = new Map(rows.map(r => [r.flight_no, r]));
    showBoard(boardRows(), flash);
  }
  const clearMap = (m, from) => {
    m.forEach(x => {
      const g = x.g || x;
      E.dispose(g);
      from.remove(g);
    });
    m.clear();
  };
  function build(state, opt) {
    FLIGHT = opt.flight;
    clearMap(seats, root);
    clearMap(people, root);
    clearMap(bags, root);
    clearMap(queue, scene);
    clearMap(cartBags, scene);
    clearMap(ghosts, root);
    E.clearChips();
    E.hideCard();
    E.clearSay();
    (opt.ghosts || []).forEach(s => {
      const g = makeGhost(s);
      root.add(g);
      ghosts.set(s, g);
    });
    state.seat.forEach(r => addSeat(r, false));
    queueDocs = opt.queue || [];
    cartDocs = opt.cart || [];
    state.passenger.forEach(r => addPerson(r, false));
    queueDocs.forEach((d, i) => {
      if (!people.has(d.id)) addQueuePerson(d, i);
    });
    const slots = bagSlots(state.baggage);
    state.baggage.forEach(r => {
      const g = makeBag(r);
      g.position.copy(slots.get(r.tag));
      setPick(g, {t: 'baggage', k: r.tag});
      root.add(g);
      bags.set(r.tag, {g, row: {...r}});
    });
    cart.visible = cartDocs.length > 0;
    cartDocs.forEach((d, i) => {
      if (!bags.has(d.tag)) addCartBag(d, i);
    });
    setBoard(state.flight);
    refreshGhosts();
    E.robotHome();
    E.sweepLabels();
  }

  // ════════════════════════════════════════════ подписи в сцене ══
  const spotObj = new THREE.Object3D();
  root.add(spotObj); // точка для метки у строки, которой ещё нет в сцене
  E.resolve(
    (t, k) => {
      if (t === 'passenger') {
        const P = people.get(+k);
        return P && P.g;
      }
      if (t === 'baggage') {
        const B = bags.get(k);
        return B && B.g;
      }
      if (t === 'seat') {
        const S = seats.get(k);
        return S ? S.g : ghosts.get(k) || null;
      }
      if (t === 'queue') {
        const Q = queue.get(+k);
        return Q && Q.g;
      }
      if (t === 'cart') {
        const C = cartBags.get(k);
        return C && C.g;
      }
      if (t === 'flight') return board;
      if (t === 'spot') return spotObj;
      return null;
    },
    (t, o) =>
      t === 'passenger' || t === 'queue' ? 1.45 / o.userData.s : t === 'baggage' || t === 'cart' ? 0.42 : t === 'seat' ? 1.15 : 0.5,
  );
  function say(id, text, ms = 0) {
    const g = (people.get(id) || queue.get(id) || {}).g;
    if (g) E.sayAt(g, text, ms);
  }

  // ═══════════════════════════ где стоять роботу у строки (и новой) ══
  const spotAt = v => {
    spotObj.position.copy(v);
    return spotObj.getWorldPosition(V(0, 0, 0));
  };
  function locate(t, row) {
    if (t === 'seat') {
      const s = row.seat_no,
        v = seatSpot(s);
      if (!validSeat(s)) return {x: DOOR.x, z: 0.6, face: 0, aim: spotAt(V(DOOR.x, 0.6, 1.6)), obj: ['spot', '*']};
      return {x: v.x, z: 0, face: v.z < 0 ? Math.PI : 0, aim: spotAt(v.clone().setY(0.5)), obj: seats.has(s) ? ['seat', s] : ['spot', '*']};
    }
    if (t === 'passenger') {
      const P = people.get(row.id);
      const s = P ? P.row.seat_no : row.seat_no;
      const on = row.flight_no === FLIGHT && validSeat(s);
      const v = on ? seatSpot(s) : V(DOOR.x, 0, 2.2);
      return {
        x: on ? v.x - 0.05 : DOOR.x,
        z: on ? 0 : 0.6,
        face: on ? (v.z < 0 ? Math.PI : 0) : 0,
        aim: spotAt(v.clone().setY(0.9)),
        obj: P ? ['passenger', row.id] : ['spot', '*'],
      };
    }
    if (t === 'baggage') {
      const B = bags.get(row.tag),
        r = ownerRow(row.passenger_id);
      let wp, x;
      if (B) {
        wp = B.g.getWorldPosition(V(0, 0, 0));
        x = B.g.position.x;
      } else {
        const k = r ? shelfOf(r) : 0;
        x = k ? (shelfX0(k) + shelfX1(k)) / 2 : DOOR.x;
        wp = spotAt(V(x, k ? BIN_Y + 0.3 : 0.6, k ? BIN_Z : 1.6));
      }
      return {x, z: B || r ? -0.2 : 0.6, face: B || r ? Math.PI : 0, aim: wp, obj: B ? ['baggage', row.tag] : ['spot', '*']};
    }
    if (t === 'flight') return {x: LEN0 + 1.0, z: 0, face: -Math.PI / 2, aim: board.getWorldPosition(V(0, 0, 0)), obj: ['flight', '*']};
    return {x: E.HOME.x, z: 0, face: -Math.PI / 2, aim: V(0, 0, 0), obj: ['spot', '*']};
  }

  // ═══════════════════════════════ вставка одной строки и сверка ══
  async function insertRow(t, row, anim = true) {
    if (t === 'seat') return addSeat(row, anim);
    if (t === 'passenger') return addPerson(row, anim);
    if (t === 'baggage') return addBag(row, anim);
    if (t === 'flight') {
      flights.set(row.flight_no, row);
      setBoard([...flights.values()], anim);
    }
  }
  async function sync(state, anim = true) {
    try {
      return await sync0(state, anim);
    } finally {
      E.sweepLabels();
    }
  }
  async function sync0(state, anim) {
    // снимаем лишнее: багаж → пассажиры → кресла, затем ставим недостающее в обратном порядке
    const J = [];
    const wb = new Set(state.baggage.map(r => r.tag));
    [...bags.keys()].forEach(t => {
      if (!wb.has(t)) J.push(removeBag(t, anim));
    });
    const wp = new Map(state.passenger.map(r => [r.id, r]));
    [...people.keys()].forEach(id => {
      if (!wp.has(id) || JSON.stringify(people.get(id).row) !== JSON.stringify(wp.get(id))) J.push(removePerson(id, anim));
    });
    const ws = new Map(state.seat.map(r => [r.seat_no, r]));
    await Promise.all(J);
    const J2 = [];
    [...seats.keys()].forEach(s => {
      if (!ws.has(s)) J2.push(removeSeat(s, anim));
    });
    ws.forEach((r, s) => {
      const S = seats.get(s);
      if (!S || JSON.stringify(S.row) !== JSON.stringify(r)) J2.push(addSeat(r, anim));
    });
    setBoard(state.flight);
    await Promise.all(J2);
    const J3 = [];
    wp.forEach((r, id) => {
      if (!people.has(id)) J3.push(addPerson(r, anim));
    });
    await Promise.all(J3);
    state.baggage.forEach(r => {
      if (!bags.has(r.tag)) J3.push(addBag(r, anim));
    });
    await Promise.all(J3);
    const slots = bagSlots(bagRows());
    bags.forEach((B, t) => {
      const s = slots.get(t);
      if (s && B.g.position.distanceTo(s) > 0.01) {
        if (anim) tween(B.g.position, {x: s.x, y: s.y, z: s.z}, 400);
        else B.g.position.copy(s);
      }
    });
    refreshGhosts();
  }

  return Object.assign(E, {build, sync, insertRow, locate, say, people, bags, seats, queue, cartBags, validSeat});
}
