// ЛР-14 · 3D-сцена: салон в разрезе, пассажиры, багаж на полках, стойка программ, табло, робот-СУБД.
// Общее (свет, робот, подписи, камера, эффекты) — в common/three/engine.js; здесь — что есть только в этой лабе.
import {createEngine, THREE, V, ZS, seatX, bagSize, tween, sleep} from '../../common/three/engine.js';
import {esc} from '../../common/util.js';
import {ROWS, LET, FLIGHT, rng, seatRow, seatL} from './data.js';

export {sleep, tween};

export function createWorld(stage) {
  const E = createEngine(stage, {home: {tx: 2.3, tz: 0}, sunTarget: [3.5, 0, 0], viewH: 6.8, followZoom: 1.45, apronZ: 0});
  const {root, rbox, at, label, mat} = E;
  const {LEN0, DOOR} = E.airframe({rows: ROWS, wing: [3.2, 4.6, 5.6, 3.7], wingRow: 2.2, engRow: 3.3, engZ: 4.7, dashes: 14});
  label('выход', 'tag3', root, DOOR.x, 0.25, 3.05);
  // полки для багажа над рядами (по два ряда на полку)
  const BIN_Y = 1.55,
    BIN_Z = -2.55;
  const binB = rbox(E.geo.LEN - 1.6, 0.06, 0.62, 0.02, 0xd9d3c4);
  at(binB, (seatX(1) - 0.6 + seatX(ROWS) + 0.6) / 2, BIN_Y, BIN_Z);
  root.add(binB);
  const binT = rbox(E.geo.LEN - 1.6, 0.05, 0.62, 0.02, 0xece6d8);
  at(binT, binB.position.x, BIN_Y + 0.62, BIN_Z);
  root.add(binT);
  for (let k = 0; k <= 4; k++) {
    const dv = rbox(0.05, 0.62, 0.62, 0.02, 0xcbc4b3);
    at(dv, k === 4 ? seatX(ROWS) + 0.6 : seatX(2 * k + 1) - 0.6, BIN_Y + 0.31, BIN_Z);
    root.add(dv);
  }
  const shelfX0 = k => seatX(2 * k - 1) - 0.6,
    shelfX1 = k => seatX(2 * k) + 0.6;
  for (let k = 1; k <= 4; k++) label(`полка ${k}`, 'tag3', root, (shelfX0(k) + shelfX1(k)) / 2, BIN_Y + 0.78, BIN_Z + 0.2);
  const {board, show: showBoard} = E.flightBoard();
  // стойка программ лояльности
  const stand = rbox(1.6, 0.5, 0.5, 0.06, 0xdcd6c8);
  at(stand, LEN0 + 1.1, 0.25, 2.2);
  root.add(stand);
  const TIERC = {золото: 0xe0b03a, серебро: 0xc7ced6, базовая: 0x7fa486};

  // кресла — стоят всегда, поэтому склеиваются вместе с салоном
  for (let row = 1; row <= ROWS; row++)
    for (const L of LET) {
      const g = new THREE.Group();
      const base = rbox(0.5, 0.16, 0.5, 0.06, 0x2f6f73);
      at(base, 0, 0.32, 0);
      g.add(base);
      const back = rbox(0.12, 0.66, 0.5, 0.05, 0x265a5e);
      at(back, 0.25, 0.66, 0);
      g.add(back);
      const head = rbox(0.13, 0.16, 0.36, 0.04, 0xece6d6);
      at(head, 0.26, 0.93, 0);
      g.add(head);
      const leg = rbox(0.32, 0.24, 0.08, 0.03, 0x6d747a);
      at(leg, 0.02, 0.12, 0);
      g.add(leg);
      [-1, 1].forEach(s => {
        const arm = rbox(0.4, 0.06, 0.06, 0.02, 0x3f474d);
        at(arm, 0.06, 0.48, s * 0.27);
        g.add(arm);
      });
      at(g, seatX(row), 0, ZS[L]);
      root.add(g);
    }
  // статичный салон вместе с креслами — один меш
  {
    root.updateMatrixWorld(true);
    const list = [];
    root.traverse(o => {
      if (o.isMesh && !o.userData.keep && !o.material.transparent) list.push(o);
    });
    const merged = E.bakeMeshes(list, o => o.matrixWorld.clone());
    list.forEach(o => o.parent.remove(o));
    root.children.filter(o => o.isGroup && !o.children.length).forEach(o => root.remove(o));
    root.add(merged);
  }
  // подсветка цели — место, куда надо пересадить
  const ghostSeat = rbox(0.62, 0.9, 0.62, 0.1, 0xffc21a, {transparent: true, opacity: 0.35, emissive: 0x6b5000});
  ghostSeat.castShadow = false;
  ghostSeat.visible = false;
  root.add(ghostSeat);

  // ═══════════════════════════════════════════════════════ пассажиры ══
  const people = new Map(),
    bags = new Map(),
    plates = new Map();
  const seatPos = (seat, kid) => V(seatX(seatRow(seat)) - 0.02, kid ? 0.08 : 0, ZS[seatL(seat)] ?? 0);
  const validSeat = s => seatRow(s) >= 1 && seatRow(s) <= ROWS && ZS[seatL(s)] !== undefined && /^\d+[A-F]$/.test(s);
  const wingSpot = id => V(seatX(3) + (id % 4) * 0.5, -0.75, 3.6 + (id % 3) * 0.45);
  function makePerson(p, r) {
    const g = E.makePerson(p, r);
    g.traverse(o => {
      if (o.isMesh) o.material = o.material.clone();
    }); // у каждого свой материал — для «призрака»
    g.userData.id = p.id;
    E.setPick(g, {t: 'passenger', k: p.id});
    E.setPose(g, 'sit');
    return g;
  }
  function badgeMesh(tier) {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.035, 20),
      mat(TIERC[tier] || 0x888888, {r: 0.35, metalness: tier === 'базовая' ? 0 : 0.35}),
    );
    m.rotation.z = Math.PI / 2;
    m.position.set(-0.13, 0.7, 0.09);
    m.castShadow = true;
    return m;
  }
  function setGhost(P, on) {
    P.g.traverse(o => {
      if (o.isMesh && o.material) {
        o.material.transparent = on;
        o.material.opacity = on ? 0.3 : 1;
        o.material.depthWrite = !on;
      }
    });
    P.ghost = on;
  }
  function placePerson(P, anim) {
    const row = P.row,
      ok = validSeat(row.seat);
    const target = ok ? seatPos(row.seat, P.g.userData.kid) : wingSpot(row.id);
    if (!anim) {
      P.g.position.copy(target);
      P.g.rotation.y = ok ? 0 : Math.PI / 2;
      E.setPose(P.g, ok ? 'sit' : 'stand');
    }
    return target;
  }
  const attachTray = (P, meal, anim) => E.attachTray(P, meal, anim, P.g.userData.kid ? 0.42 : 0.56);
  function attachBadge(P, tier, anim) {
    if (P.badge) {
      const b = P.badge;
      P.badge = null;
      if (anim) {
        tween(b.position, {y: b.position.y + 0.8}, 500, 'out');
        tween(b.scale, {x: 0.01, y: 0.01, z: 0.01}, 500, 'in').then(() => P.g.remove(b));
      } else P.g.remove(b);
    }
    if (!tier) return;
    const b = badgeMesh(tier);
    P.badge = b;
    P.g.add(b);
    if (anim) {
      b.scale.setScalar(0.01);
      tween(b.scale, {x: 1, y: 1, z: 1}, 360, 'back');
    }
  }

  // ═════════════════════════════════════════════════════════ багаж ══
  function makeBag(b) {
    const g = E.makeBag(b.weight_kg, b.tag, false);
    g.userData = {tag: b.tag};
    E.setPick(g, {t: 'baggage', k: b.tag});
    return g;
  }
  function bagSlots(rows) {
    // позиции на полках в порядке хранения
    const pos = new Map(),
      by = {};
    rows.forEach(b => {
      (by[b.shelf] = by[b.shelf] || []).push(b);
    });
    for (const k in by)
      by[k].forEach((b, i) => {
        const s = bagSize(b.weight_kg),
          sh = Math.min(4, Math.max(1, +k));
        const per = 6,
          col = i % per,
          lay = Math.floor(i / per);
        pos.set(b.tag, V(shelfX0(sh) + 0.3 + col * 0.38, BIN_Y + 0.03 + s.h / 2 + lay * 0.3, BIN_Z + 0.02));
      });
    return pos;
  }

  // ═════════════════════════════════════════════ состояние сцены ══
  let model = {passenger: new Map(), baggage: new Map(), loyalty: new Map(), flight: new Map()};
  let seedR = rng(1),
    metaMap = null;
  const boardRows = () =>
    [...model.flight.values()].map(f => ({on: f.flight_no === FLIGHT, cells: [f.flight_no, String(f.dest || '').slice(0, 14)]}));

  const removeAll = m => {
    m.forEach(x => {
      E.dispose(x.g);
      x.g.parent && x.g.parent.remove(x.g);
    });
    m.clear();
  };
  function build(state, seed, meta) {
    metaMap = meta || null;
    seedR = rng(seed * 31 + 5);
    removeAll(people);
    removeAll(bags);
    removeAll(plates);
    E.clearChips();
    E.hideCard();
    E.clearSay();
    model = {passenger: new Map(), baggage: new Map(), loyalty: new Map(), flight: new Map()};
    state.passenger.forEach(row => addPerson(row));
    const slots = bagSlots(state.baggage);
    state.baggage.forEach(row => {
      const g = makeBag(row);
      g.position.copy(slots.get(row.tag));
      root.add(g);
      bags.set(row.tag, {g, row});
      model.baggage.set(row.tag, row);
    });
    ['золото', 'серебро', 'базовая'].forEach((t, i) => {
      const g = new THREE.Group();
      g.add(rbox(0.06, 0.46, 0.34, 0.04, TIERC[t], {r: 0.4, metalness: t === 'базовая' ? 0 : 0.3}));
      // невидимая зона нажатия крупнее самой таблички — по ней легко попасть
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.5), new THREE.MeshBasicMaterial({colorWrite: false, depthWrite: false}));
      hit.position.y = 0.1;
      g.add(hit);
      g.position.set(LEN0 + 0.55 + i * 0.55, 0.76, 2.2);
      E.setPick(g, {t: 'loyalty', k: t});
      plates.set(t, {g, lb: label(t, 'tag3', g, 0, 0.36, 0), alive: false});
    });
    state.loyalty.forEach(row => {
      const L = plates.get(row.tier);
      if (L) {
        root.add(L.g);
        L.alive = true;
      }
      model.loyalty.set(row.tier, row);
    });
    state.flight.forEach(row => model.flight.set(row.flight_no, row));
    showBoard(boardRows());
    E.robotHome();
    ghostSeat.visible = false;
    E.sweepLabels();
  }
  function addPerson(row) {
    const look = (metaMap && metaMap.get(row.id)) || {
      kid: row.birth_year !== null && row.birth_year >= 2009,
      female: /а\s/.test(row.full_name),
      old: row.birth_year !== null && row.birth_year < 1960,
    };
    const P = {g: makePerson({...row, ...look}, seedR), row: {...row}, tray: null, badge: null, ghost: false};
    root.add(P.g);
    people.set(row.id, P);
    model.passenger.set(row.id, row);
    placePerson(P, false);
    attachTray(P, row.meal, false);
    attachBadge(P, row.loyalty, false);
    if (row.active === false) setGhost(P, true);
    return P;
  }

  // ════════════════════════════════════════════ подписи в сцене ══
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
      if (t === 'loyalty') {
        const L = plates.get(k);
        return L && L.g;
      }
      if (t === 'flight') return board;
      return null;
    },
    (t, o) => (t === 'passenger' ? 1.45 / o.userData.s : t === 'baggage' ? 0.42 : t === 'loyalty' ? 0.55 : 0.5),
  );
  function say(id, text, ms = 0) {
    const P = people.get(id);
    if (P) E.sayAt(P.g, text, ms);
  }

  // ═══════════════════════════════════════ где стоять роботу у строки ══
  function locate(t, row) {
    const wp = o => (o ? o.getWorldPosition(V(0, 0, 0)) : V(0, 0, 0));
    if (t === 'passenger') {
      const P = people.get(row.id);
      const s = P ? P.row.seat : row.seat,
        ok = validSeat(s);
      const aim = wp(P && P.g);
      if (P) aim.y += 0.9 * P.g.userData.s;
      return {x: ok ? seatX(seatRow(s)) - 0.05 : seatX(3), z: 0, face: (ok ? ZS[seatL(s)] : 3) < 0 ? Math.PI : 0, aim};
    }
    if (t === 'baggage') {
      const B = bags.get(row.tag);
      return {x: B ? B.g.position.x : 0, z: -0.2, face: Math.PI, aim: wp(B && B.g)};
    }
    if (t === 'loyalty') {
      const L = plates.get(row.tier);
      return {x: L ? L.g.position.x : LEN0 + 1.1, z: 1.2, face: 0, aim: wp(L && L.g)};
    }
    if (t === 'flight') return {x: LEN0 + 1.0, z: 0, face: -Math.PI / 2, aim: wp(board)};
    return {x: E.HOME.x, z: 0, face: -Math.PI / 2, aim: V(0, 0, 0)};
  }

  // ═══════════════════════════════════ применить изменение строки ══
  async function walkPerson(P, to, leave) {
    const g = P.g,
      p = g.position;
    const path = [V(p.x, p.y, Math.sign(p.z || 1) * 0.3)];
    if (leave) path.push(V(DOOR.x, p.y, 0.3), V(DOOR.x, p.y, 2.75));
    else if (to.y < -0.5) path.push(V(to.x, p.y, 0.3), to.clone());
    else path.push(V(to.x, p.y, Math.sign(to.z) * 0.3), to.clone());
    await E.walk(g, path);
    await E.turn(g, leave ? 0 : to.y < -0.5 ? Math.PI / 2 : 0);
    E.setPose(g, leave || to.y < -0.5 ? 'stand' : 'sit');
  }
  async function applyPassenger(id, nv, anim) {
    let P = people.get(id);
    if (!P && nv) {
      P = addPerson(nv);
      if (anim) {
        const s = P.g.userData.s;
        P.g.scale.setScalar(0.01);
        await tween(P.g.scale, {x: s, y: s, z: s}, 300, 'back');
      }
      return;
    }
    if (!P) return;
    if (!nv) {
      // удалён
      people.delete(id);
      model.passenger.delete(id);
      if (anim) {
        say(id, 'До свидания…', 1500);
        await walkPerson(P, null, true);
        await tween(P.g.scale, {x: 0.01, y: 0.01, z: 0.01}, 260, 'in');
      }
      E.dispose(P.g);
      P.g.parent && P.g.parent.remove(P.g);
      return;
    }
    const old = P.row;
    P.row = {...nv};
    model.passenger.set(id, nv);
    const jobs = [];
    if (old.seat !== nv.seat) {
      const to = placePerson(P, true);
      jobs.push(anim ? walkPerson(P, to) : Promise.resolve(P.g.position.copy(to)));
      if (!validSeat(nv.seat) && anim) setTimeout(() => say(id, 'А где моё кресло?!', 2600), 1200);
    }
    if (old.meal !== nv.meal) attachTray(P, nv.meal, anim);
    if (old.loyalty !== nv.loyalty) attachBadge(P, nv.loyalty, anim);
    if (old.active !== nv.active) setGhost(P, nv.active === false);
    if (anim && (old.birth_year !== nv.birth_year || old.full_name !== nv.full_name || old.city !== nv.city))
      say(id, 'Мои данные поменялись', 1500);
    await Promise.all(jobs);
  }
  async function applyBag(tag, nv, anim, all) {
    const B = bags.get(tag);
    if (!B && nv) {
      const g = makeBag(nv);
      root.add(g);
      bags.set(tag, {g, row: nv});
      model.baggage.set(tag, nv);
      g.position.copy(bagSlots(all).get(tag));
      if (anim) {
        g.scale.setScalar(0.01);
        await tween(g.scale, {x: 1, y: 1, z: 1}, 300, 'back');
      }
      return;
    }
    if (!B) return;
    if (!nv) {
      bags.delete(tag);
      model.baggage.delete(tag);
      if (anim) {
        const p = B.g.position;
        await tween(p, {y: p.y + 0.6, z: p.z + 1.2}, 260, 'out');
        await tween(p, {x: p.x - 2.5, y: -1.3, z: 4.5}, 700, 'in');
      }
      E.dispose(B.g);
      B.g.parent && B.g.parent.remove(B.g);
      return;
    }
    const old = B.row;
    B.row = {...nv};
    model.baggage.set(tag, nv);
    if (old.weight_kg !== nv.weight_kg) {
      // новый вес — новый размер чемодана
      const s0 = bagSize(old.weight_kg),
        s1 = bagSize(nv.weight_kg);
      const g = makeBag(nv);
      g.position.copy(B.g.position);
      g.position.y += (s1.h - s0.h) / 2;
      root.remove(B.g);
      root.add(g);
      B.g = g;
      if (anim) {
        g.scale.setScalar(1.35);
        tween(g.scale, {x: 1, y: 1, z: 1}, 420, 'back');
      }
    }
  }
  async function applyLoyalty(tier, nv, anim) {
    const L = plates.get(tier);
    if (!L) return;
    if (!nv && L.alive) {
      L.alive = false;
      model.loyalty.delete(tier);
      if (anim) {
        await tween(L.g.rotation, {z: -1.4}, 380, 'in');
        await tween(L.g.position, {y: -1.3}, 400, 'in');
      }
      E.dispose(L.g);
      root.remove(L.g);
      L.g.rotation.z = 0;
      L.g.position.y = 0.76;
    } else if (nv && !L.alive) {
      L.alive = true;
      model.loyalty.set(tier, nv);
      if (!L.g.children.some(o => o.isCSS2DObject)) L.lb = label(tier, 'tag3', L.g, 0, 0.36, 0);
      root.add(L.g);
    }
  }
  // привести сцену к состоянию базы (с анимацией)
  async function sync(state, anim = true) {
    try {
      return await sync0(state, anim);
    } finally {
      E.sweepLabels();
    }
  }
  async function sync0(state, anim) {
    const jobs = [];
    const want = new Map(state.passenger.map(r => [r.id, r]));
    [...people.keys()].forEach(id => {
      if (!want.has(id)) jobs.push(applyPassenger(id, null, anim));
    });
    want.forEach((r, id) => {
      const P = people.get(id);
      if (!P || JSON.stringify(P.row) !== JSON.stringify(r)) jobs.push(applyPassenger(id, r, anim));
    });
    const wb = new Map(state.baggage.map(r => [r.tag, r]));
    [...bags.keys()].forEach(t => {
      if (!wb.has(t)) jobs.push(sleep(Math.random() * 200).then(() => applyBag(t, null, anim)));
    });
    wb.forEach((r, t) => {
      const B = bags.get(t);
      if (!B || JSON.stringify(B.row) !== JSON.stringify(r)) jobs.push(applyBag(t, r, anim, state.baggage));
    });
    const wl = new Set(state.loyalty.map(r => r.tier));
    plates.forEach((L, t) => {
      if (L.alive !== wl.has(t)) jobs.push(applyLoyalty(t, wl.has(t) ? {tier: t} : null, anim));
    });
    const nf = new Map(state.flight.map(r => [r.flight_no, r]));
    const changed = JSON.stringify([...nf.values()]) !== JSON.stringify([...model.flight.values()]);
    model.flight = nf;
    showBoard(boardRows(), anim && changed);
    await Promise.all(jobs);
    // перерасстановка чемоданов на полках
    const slots = bagSlots(state.baggage);
    bags.forEach((B, t) => {
      const s = slots.get(t);
      if (s && B.g.position.distanceTo(s) > 0.01) {
        if (anim) tween(B.g.position, {x: s.x, y: s.y, z: s.z}, 400);
        else B.g.position.copy(s);
      }
    });
  }
  const bounce = (id, h) => {
    const P = people.get(id);
    return P ? E.bounce(P.g, h) : Promise.resolve();
  };

  return Object.assign(E, {
    build,
    sync,
    locate,
    say,
    bounce,
    applyPassenger,
    applyBag,
    applyLoyalty,
    ghostSeat,
    seatPos,
    people,
    bags,
    plates,
    model,
    LEN0,
    validSeat,
  });
}
