// Сцены в здании аэропорта (ЛР-15, ЛР-16) — тот же движок, что у салона, но другой зал:
//   kind 'gate'  — зал ожидания у выхода C15: кресла рядами смотрят на стойку посадки, за стеклом самолёт;
//                  ответ SELECT по пассажирам — кто подошёл, встаёт, а с ORDER BY / LIMIT — очередь к выходу в порядке ответа;
//   kind 'claim' — зал выдачи багажа: овальная лента с чемоданами, пассажиры ждут вокруг неё.
// Интерфейс тот же, что у сцены ЛР-14 (build, sync, locate, applyPassenger…) — им пользуется common/qlab.js.
import {createEngine, THREE, V, ZS, seatX, bagSize, tween, sleep} from './engine.js';
import {rng} from '../rng.js';

export {sleep, tween};
const seatRow = s => parseInt(s, 10),
  seatL = s => String(s).slice(-1);
const TIERC = {платина: 0x8fa7c4, золото: 0xe0b03a, серебро: 0xc7ced6, базовая: 0x7fa486, бронза: 0xb0713a};

export function createTerminal(stage, {kind = 'gate', tiers = ['золото', 'серебро', 'базовая'], flight = 'ИИ-714', rows = 8} = {}) {
  const GATE = kind === 'gate';
  const E = createEngine(stage, {
    home: GATE ? {tx: 2.4, tz: 0.4} : {tx: 2.6, tz: -0.6},
    sunTarget: [3, 0, -1],
    viewH: 7.2,
    followZoom: 1.4,
    apronZ: -8.5,
  });
  const {root, rbox, at, mat} = E;
  // размеры зала (как у салона: LEN0 — левый край, где «дом» робота)
  const LEN0 = -3.4,
    LEN1 = seatX(rows) + 1.6,
    MID = (LEN0 + LEN1) / 2,
    LEN = LEN1 - LEN0;
  const WALLZ = -4.3,
    FRONT = 4.0;
  Object.assign(E.geo, {LEN0, LEN1, MID, LEN, DOOR: {x: LEN0 + 0.6, z: WALLZ}});
  E.robot.position.set(LEN0 + 1.6, 0, 0);

  // ═══════════════════════════════════════════════════════ здание ══
  const slab = rbox(LEN + 1.4, 0.3, FRONT - WALLZ + 0.2, 0.06, 0xe9e4d8);
  at(slab, MID, -0.15, (FRONT + WALLZ) / 2);
  root.add(slab);
  // плитка: светлые полосы поперёк зала
  for (let x = LEN0; x < LEN1 + 0.6; x += 1.2) {
    const s = rbox(0.04, 0.012, FRONT - WALLZ - 0.4, 0.005, 0xdcd5c6);
    at(s, x, 0.004, (FRONT + WALLZ) / 2);
    s.castShadow = false;
    root.add(s);
  }
  // проход робота — дорожка с жёлтым пунктиром
  const walk = rbox(LEN + 0.6, 0.012, 0.95, 0.01, 0xd6cfbf);
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
  // задняя стена: в зале ожидания — витраж с видом на перрон, в зале выдачи — глухая
  if (GATE) {
    const low = rbox(LEN + 1.4, 0.5, 0.18, 0.05, 0xf3efe6);
    at(low, MID, 0.25, WALLZ);
    root.add(low);
    const beam = rbox(LEN + 1.4, 0.22, 0.2, 0.05, 0xf3efe6);
    at(beam, MID, 2.75, WALLZ);
    root.add(beam);
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(LEN + 1.4, 2.15, 0.04),
      new THREE.MeshStandardMaterial({color: 0xbfd9e6, transparent: true, opacity: 0.28, roughness: 0.1, depthWrite: false}),
    );
    glass.position.set(MID, 1.57, WALLZ);
    root.add(glass);
    for (let x = LEN0 - 0.7; x <= LEN1 + 0.7; x += 1.6) {
      const m = rbox(0.07, 2.2, 0.1, 0.02, 0x3f474d);
      at(m, x, 1.6, WALLZ);
      root.add(m);
    }
  } else {
    const wall = rbox(LEN + 1.4, 2.9, 0.18, 0.05, 0xf3efe6);
    at(wall, MID, 1.45, WALLZ);
    root.add(wall);
    const stripe = rbox(LEN + 1.4, 0.16, 0.2, 0.03, 0xffc21a);
    at(stripe, MID, 2.55, WALLZ + 0.01);
    root.add(stripe);
    E.flatLabel('ВЫДАЧА БАГАЖА · BAGGAGE CLAIM', root, {x: MID + 1.4, y: 2.15, z: WALLZ + 0.1, h: 0.42, color: '#22252b', bg: null});
  }
  // левая стена с выходом
  const side = rbox(0.18, 2.9, FRONT - WALLZ, 0.05, 0xf3efe6);
  at(side, LEN0 - 0.7, 1.45, (FRONT + WALLZ) / 2);
  root.add(side);
  const door = rbox(0.06, 2.0, 1.3, 0.03, GATE ? 0x3f474d : 0x6d747a);
  at(door, LEN0 - 0.6, 1.0, WALLZ + 1.0);
  root.add(door);
  E.flatLabel(GATE ? 'ВЫХОД C15' : 'ВЫХОД В ГОРОД', root, {
    x: LEN0 - 0.58,
    y: 2.3,
    z: WALLZ + 1.0,
    ry: Math.PI / 2,
    h: 0.32,
    color: '#22252b',
    bg: '#ffc21a',
  });

  // табло рейсов на задней стене
  const {board, show: showBoard} = E.flightBoard();
  board.position.set(GATE ? LEN0 + 1.7 : LEN0 + 1.6, GATE ? 2.05 : 1.55, WALLZ + 0.14);
  board.scale.setScalar(GATE ? 0.78 : 0.9);

  // ═══════════════════════════════════════════ зал ожидания у выхода ══
  const outside = new THREE.Group(); // самолёт за стеклом и телетрап — уезжает на контрольном
  let queueSpot = () => V(0, 0, 0);
  if (GATE) {
    // кресла: ряды по номеру места (ряд → вдоль зала, буква → поперёк), смотрят на стойку посадки
    for (let row = 1; row <= rows; row++)
      [
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
      ].forEach(grp => {
        const z0 = ZS[grp[0]],
          z1 = ZS[grp[2]];
        const bar = rbox(0.12, 0.08, Math.abs(z1 - z0) + 0.6, 0.03, 0x3f474d);
        at(bar, seatX(row) + 0.05, 0.3, (z0 + z1) / 2);
        root.add(bar);
        [z0, z1].forEach(z => {
          const leg = rbox(0.08, 0.3, 0.08, 0.02, 0x3f474d);
          at(leg, seatX(row) + 0.05, 0.15, z);
          root.add(leg);
        });
        grp.forEach(L => {
          const z = ZS[L];
          const s = rbox(0.46, 0.08, 0.46, 0.06, 0x4a5684);
          at(s, seatX(row), 0.38, z);
          root.add(s);
          const b = rbox(0.08, 0.5, 0.46, 0.05, 0x3b4673);
          at(b, seatX(row) + 0.24, 0.62, z);
          root.add(b);
        });
      });
    // стойка посадки
    const desk = rbox(0.7, 1.0, 1.7, 0.08, 0x2f6f73);
    at(desk, LEN0 + 0.15, 0.5, WALLZ + 2.6);
    root.add(desk);
    const top = rbox(0.8, 0.06, 1.8, 0.03, 0xece6d8);
    at(top, LEN0 + 0.15, 1.03, WALLZ + 2.6);
    root.add(top);
    E.flatLabel('C15 · ИИ-714 · СОЧИ', root, {
      x: LEN0 + 0.52,
      y: 0.62,
      z: WALLZ + 2.6,
      ry: Math.PI / 2,
      h: 0.17,
      color: '#ffffff',
      bg: null,
    });
    // очередь к выходу: вдоль стекла, от двери вправо (во второй ряд — если длинная)
    queueSpot = i => V(LEN0 + 0.9 + (i % 17) * 0.56, 0, WALLZ + 1.05 + Math.floor(i / 17) * 0.55);
    E.flatLabel('очередь на посадку →', root, {x: LEN0 + 1.6, y: 0.012, z: WALLZ + 0.55, rx: -Math.PI / 2, h: 0.2});
    // за стеклом: перрон, самолёт и телетрап
    const apron = rbox(60, 0.1, 18, 0.02, 0xcfc8b8);
    at(apron, MID, -1.4, WALLZ - 9.5);
    outside.add(apron);
    const plane = new THREE.Group();
    const fus = rbox(10.5, 1.5, 1.5, 0.7, 0xfbf8f2);
    at(fus, 0, 0, 0);
    plane.add(fus);
    const stripeP = rbox(10.4, 0.12, 1.52, 0.05, 0xffc21a);
    at(stripeP, 0, -0.15, 0);
    plane.add(stripeP);
    const wing = rbox(2.2, 0.14, 9.0, 0.06, 0xeef0f2);
    at(wing, 0.6, -0.4, 0);
    plane.add(wing);
    const tail = rbox(1.4, 1.6, 0.14, 0.06, 0xeef0f2);
    at(tail, 4.6, 1.0, 0);
    plane.add(tail);
    for (let i = 0; i < 9; i++) {
      const w = rbox(0.22, 0.24, 0.02, 0.08, 0x9fc3d8);
      at(w, -3.6 + i * 0.9, 0.25, 0.76);
      plane.add(w);
    }
    plane.position.set(LEN0 + 4.2, -0.3, WALLZ - 6.6);
    outside.add(plane);
    const bridge = rbox(1.0, 1.1, 4.4, 0.12, 0xd8dde1);
    at(bridge, LEN0 + 0.3, 0.15, WALLZ - 2.4);
    outside.add(bridge);
    const leg2 = rbox(0.18, 1.5, 0.18, 0.04, 0x6d747a);
    at(leg2, LEN0 + 0.3, -0.8, WALLZ - 3.8);
    outside.add(leg2);
    outside.userData.plane = plane;
    root.add(outside);
  }

  // ═════════════════════════════════════════════ зал выдачи багажа ══
  const C = {x: seatX(rows) / 2 + 0.2, z: -1.95, half: seatX(rows) / 2 - 0.4, R: 1.0};
  // точка на «стадионе» (две прямые и две полуокружности) радиуса r; t — доля периметра
  const track = (t, r) => {
    const L = 2 * C.half,
      arc = Math.PI * r,
      P = 2 * L + 2 * arc;
    let d = (((t % 1) + 1) % 1) * P;
    if (d < L) return {x: C.x - C.half + d, z: C.z + r, a: 0};
    d -= L;
    if (d < arc) {
      const f = d / r - Math.PI / 2;
      return {x: C.x + C.half + Math.cos(f) * r, z: C.z - Math.sin(f) * r, a: f + Math.PI / 2};
    }
    d -= arc;
    if (d < L) return {x: C.x + C.half - d, z: C.z - r, a: Math.PI};
    d -= L;
    const f = d / r + Math.PI / 2;
    return {x: C.x - C.half + Math.cos(f) * r, z: C.z - Math.sin(f) * r, a: f + Math.PI / 2};
  };
  if (!GATE) {
    const stadium = (r, hole) => {
      const s = new THREE.Shape();
      s.absarc(C.half, 0, r, -Math.PI / 2, Math.PI / 2, false);
      s.absarc(-C.half, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false);
      if (hole) {
        const h = new THREE.Path();
        h.absarc(C.half, 0, hole, -Math.PI / 2, Math.PI / 2, false);
        h.absarc(-C.half, 0, hole, Math.PI / 2, (3 * Math.PI) / 2, false);
        s.holes.push(h);
      }
      return s;
    };
    const ext = (shape, h, color) => {
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {depth: h, bevelEnabled: false, curveSegments: 18}), mat(color));
      m.rotation.x = -Math.PI / 2;
      m.position.set(C.x, 0, C.z);
      m.castShadow = true;
      m.receiveShadow = true;
      root.add(m);
      return m;
    };
    ext(stadium(C.R + 0.2), 0.36, 0xb9b3a6);
    const belt = ext(stadium(C.R + 0.12, C.R - 0.38), 0.03, 0x3d4250);
    belt.position.y = 0.36;
    const island = ext(stadium(C.R - 0.4), 0.2, 0xdcd6c8);
    island.position.y = 0.36;
    const chute = rbox(1.0, 1.2, 0.9, 0.08, 0x8b857a);
    at(chute, C.x + C.half * 0.2, 0.6, C.z - 0.1);
    root.add(chute);
    const cover = rbox(0.9, 0.5, 0.06, 0.02, 0x3d4250);
    at(cover, C.x + C.half * 0.2, 0.42, C.z + 0.36);
    root.add(cover);
    E.flatLabel('ЛЕНТА 2 · ИИ-714', root, {x: C.x + C.half * 0.2, y: 1.0, z: C.z + 0.36, h: 0.16, color: '#ffc21a', bg: '#22252b'});
  }

  // стойка программ лояльности — у левой стены, ближе к зрителю
  const TIERS = tiers;
  const standW = Math.max(1.6, TIERS.length * 0.5 + 0.1);
  const stand = rbox(standW, 0.5, 0.5, 0.06, 0xdcd6c8);
  at(stand, LEN0 + 0.3 + standW / 2, 0.25, 2.6);
  root.add(stand);
  E.flatLabel('программы лояльности', root, {x: LEN0 + 0.3 + standW / 2, y: 0.25, z: 2.86, h: 0.13});
  const plateX = i => LEN0 + 0.6 + i * 0.5;

  // багаж в зале ожидания — стеллажи камеры хранения у передней стены (полки 1–4)
  const shelfX0 = k => seatX(2 * k - 1) - 0.5,
    shelfX1 = k => seatX(2 * k) + 0.5;
  const RACKZ = 3.25;
  if (GATE) {
    for (let k = 1; k <= 4; k++) {
      const x0 = shelfX0(k),
        x1 = shelfX1(k);
      [0.05, 0.62].forEach(y => {
        const p = rbox(x1 - x0, 0.05, 0.55, 0.02, 0xd9d3c4);
        at(p, (x0 + x1) / 2, y, RACKZ);
        root.add(p);
      });
      [x0, x1].forEach(x => {
        const post = rbox(0.06, 1.0, 0.55, 0.02, 0x8b857a);
        at(post, x, 0.5, RACKZ);
        root.add(post);
      });
      E.flatLabel(`полка ${k}`, root, {x: (x0 + x1) / 2, y: 1.02, z: RACKZ, rx: -Math.PI / 2, h: 0.3});
    }
  }

  // статичное — одним мешем
  {
    root.updateMatrixWorld(true);
    const list = [];
    root.children.forEach(o => {
      if (o.isMesh && !o.userData.keep && !o.material.transparent && o.geometry.type !== 'ExtrudeGeometry') list.push(o);
    });
    const merged = E.bakeMeshes(list, o => o.matrix.clone());
    list.forEach(o => root.remove(o));
    root.add(merged);
  }

  // ═══════════════════════════════════════════════════════ пассажиры ══
  const people = new Map(),
    bags = new Map(),
    plates = new Map();
  const validSeat = s => seatRow(s) >= 1 && seatRow(s) <= rows && ZS[seatL(s)] !== undefined && /^\d+[A-F]$/.test(s);
  const seatPos = (seat, kid) => V(seatX(seatRow(seat)) - 0.02, kid ? 0.06 : 0, ZS[seatL(seat)] ?? 0);
  // зал выдачи: пассажиры ждут за лентой и у её концов, в два ряда — ближняя сторона ленты открыта взгляду
  let ring = new Map();
  const RING = C.R + 0.62;
  const backPath = r => {
    const pts = [];
    for (let i = 0; i <= 600; i++) {
      const q = track(i / 600, r);
      if (q.z <= C.z + 0.35) pts.push(q);
    }
    // путь начинается с правого конца ленты: точки после «шва» на t = 0 переносим вперёд
    const cut = pts.findIndex((q, i) => i && Math.hypot(q.x - pts[i - 1].x, q.z - pts[i - 1].z) > 0.5);
    const path = cut > 0 ? pts.slice(cut).concat(pts.slice(0, cut)) : pts;
    let L = 0;
    path.forEach((q, i) => (q.s = L += i ? Math.hypot(q.x - path[i - 1].x, q.z - path[i - 1].z) : 0));
    return {path, L};
  };
  const at01 = (bp, f) => bp.path.find(q => q.s >= f * bp.L) || bp.path[bp.path.length - 1];
  const layoutRing = list => {
    ring = new Map();
    const ids = list.map(p => p.id).sort((a, b) => a - b);
    const r1 = backPath(RING),
      r2 = backPath(RING + 0.55);
    const n1 = Math.min(ids.length, Math.floor(r1.L / 0.5));
    ids.forEach((id, i) => {
      const inner = i < n1,
        k = inner ? i : i - n1,
        n = inner ? n1 : ids.length - n1;
      ring.set(id, at01(inner ? r1 : r2, (k + 0.5) / Math.max(n, 1)));
    });
  };
  // где пассажир находится в покое и как повёрнут
  function restOf(P) {
    if (GATE) {
      const ok = validSeat(P.row.seat);
      return ok
        ? {pos: seatPos(P.row.seat, P.g.userData.kid), rot: 0, pose: 'sit'}
        : {pos: V(LEN0 + 1.2 + (P.row.id % 4) * 0.5, 0, 1.7 + (P.row.id % 3) * 0.4), rot: Math.PI / 2, pose: 'stand'};
    }
    const s = ring.get(P.row.id) || track(0.5, RING);
    // лицом к ленте: к ближайшей точке её оси
    const cx = Math.max(C.x - C.half, Math.min(C.x + C.half, s.x));
    return {pos: V(s.x, 0, s.z), rot: Math.atan2(C.z - s.z, -(cx - s.x)), pose: 'stand'};
  }
  function placePerson(P) {
    const r = restOf(P);
    P.g.position.copy(r.pos);
    P.g.rotation.y = r.rot;
    E.setPose(P.g, r.pose);
    P.away = false;
  }
  function makePerson(p, r) {
    const g = E.makePerson(p, r);
    g.traverse(o => {
      if (o.isMesh) o.material = o.material.clone();
    });
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
  function attachBadge(P, tier, anim) {
    if (P.badge) {
      const b = P.badge;
      P.badge = null;
      if (anim) tween(b.scale, {x: 0.01, y: 0.01, z: 0.01}, 400, 'in').then(() => P.g.remove(b));
      else P.g.remove(b);
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
  const attachTray = (P, meal, anim) => (GATE ? E.attachTray(P, meal, anim, P.g.userData.kid ? 0.42 : 0.56) : null);

  // ═════════════════════════════════════════════════════════ багаж ══
  function makeBag(b) {
    const g = E.makeBag(b.weight_kg, b.tag, false);
    g.userData = {tag: b.tag};
    E.setPick(g, {t: 'baggage', k: b.tag});
    return g;
  }
  // позиции чемоданов: стеллажи по полкам (зал ожидания) или по ленте в порядке хранения (зал выдачи)
  function bagSlots(list) {
    const pos = new Map();
    if (GATE) {
      const by = {};
      list.forEach(b => (by[b.shelf] = by[b.shelf] || []).push(b));
      for (const k in by)
        by[k].forEach((b, i) => {
          const s = bagSize(b.weight_kg),
            sh = Math.min(4, Math.max(1, +k)),
            per = 5,
            lay = Math.floor(i / per) % 2;
          pos.set(b.tag, {
            p: V(shelfX0(sh) + 0.3 + (i % per) * 0.38, (lay ? 0.65 : 0.08) + s.h / 2, RACKZ - 0.02 + (Math.floor(i / 10) ? 0.12 : 0)),
            a: 0,
          });
        });
      return pos;
    }
    list.forEach((b, i) => {
      const s = bagSize(b.weight_kg),
        t = track(i / Math.max(list.length, 14) + beltShift, C.R - 0.13);
      pos.set(b.tag, {p: V(t.x, 0.4 + s.h / 2, t.z), a: t.a});
    });
    return pos;
  }
  let beltShift = 0;
  const putBag = (g, s) => {
    g.position.copy(s.p);
    g.rotation.y = -s.a;
  };

  // ═════════════════════════════════════════════ состояние сцены ══
  let model = {passenger: new Map(), baggage: new Map(), loyalty: new Map(), flight: new Map()};
  let seedR = rng(1),
    metaMap = null;
  const boardRows = () =>
    [...model.flight.values()].map(f => ({on: f.flight_no === flight, cells: [f.flight_no, String(f.dest || '').slice(0, 14)]}));
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
    beltShift = 0;
    if (!GATE) layoutRing(state.passenger);
    state.passenger.forEach(row => addPerson(row));
    const slots = bagSlots(state.baggage);
    state.baggage.forEach(row => {
      const g = makeBag(row);
      putBag(g, slots.get(row.tag));
      root.add(g);
      bags.set(row.tag, {g, row});
      model.baggage.set(row.tag, row);
    });
    TIERS.forEach((t, i) => {
      const g = new THREE.Group();
      g.add(rbox(0.06, 0.46, 0.34, 0.04, TIERC[t] || 0x888888, {r: 0.4, metalness: t === 'базовая' ? 0 : 0.3}));
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.5), new THREE.MeshBasicMaterial({colorWrite: false, depthWrite: false}));
      hit.position.y = 0.1;
      g.add(hit);
      g.position.set(plateX(i), 0.76, 2.6);
      E.setPick(g, {t: 'loyalty', k: t});
      E.flatLabel(t, g, {x: 0.04, y: 0.02, ry: Math.PI / 2, h: 0.085, color: '#22252b', bg: 'rgba(255,255,255,.7)'});
      plates.set(t, {g, alive: false});
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
    if (GATE) outside.userData.plane.position.x = LEN0 + 4.2;
    E.sweepLabels();
  }
  function addPerson(row) {
    const look = (metaMap && metaMap.get(row.id)) || {
      kid: row.birth_year !== null && row.birth_year >= 2009,
      female: /а\s/.test(row.full_name),
      old: row.birth_year !== null && row.birth_year < 1960,
    };
    const P = {g: makePerson({...row, ...look}, seedR), row: {...row}, tray: null, badge: null};
    root.add(P.g);
    people.set(row.id, P);
    model.passenger.set(row.id, row);
    placePerson(P);
    attachTray(P, row.meal, false);
    attachBadge(P, row.loyalty, false);
    return P;
  }

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
  // робот ходит только по дорожке (z = 0) и смотрит на объект оттуда
  function locate(t, row) {
    const wp = o => (o ? o.getWorldPosition(V(0, 0, 0)) : V(0, 0, 0));
    const near = (o, dy = 0) => {
      const p = wp(o);
      p.y += dy;
      return {x: Math.min(LEN1 - 0.3, Math.max(LEN0 + 0.4, p.x)), z: 0, face: p.z < 0 ? Math.PI : 0, aim: p};
    };
    if (t === 'passenger') {
      const P = people.get(+row.id);
      return near(P && P.g, P ? 0.9 * P.g.userData.s : 0);
    }
    if (t === 'baggage') return near((bags.get(row.tag) || {}).g);
    if (t === 'loyalty') return near((plates.get(row.tier) || {}).g);
    if (t === 'flight') return {x: board.position.x, z: 0, face: Math.PI, aim: wp(board)};
    return {x: E.HOME.x, z: 0, face: -Math.PI / 2, aim: V(0, 0, 0)};
  }

  // ═════════════════════════ ответ SELECT в зале ожидания: встать / в очередь ══
  // keys — номера пассажиров из ответа; ordered — в порядке ответа (ORDER BY / LIMIT): идут в очередь к выходу
  async function answer(t, keys, ordered) {
    if (!GATE || t !== 'passenger') return;
    const jobs = [];
    keys.forEach((k, i) => {
      const P = people.get(+k);
      if (!P) return;
      P.away = true;
      if (!ordered) {
        E.setPose(P.g, 'stand');
        jobs.push(sleep(i * 25).then(() => E.bounce(P.g, 0.18)));
        return;
      }
      const q = queueSpot(i),
        p = P.g.position;
      // из ряда — в промежуток между рядами, по нему к стеклу, потом вдоль очереди
      const gapX = p.x - 0.56;
      jobs.push(
        sleep(i * 60).then(() =>
          E.walk(P.g, [V(gapX, 0, p.z), V(gapX, 0, WALLZ + 2.0), V(q.x, 0, WALLZ + 2.0), q]).then(() => E.turn(P.g, 0)),
        ),
      );
    });
    await Promise.all(jobs);
  }
  // все — обратно на места
  async function calm(anim = true) {
    const back = [...people.values()].filter(P => P.away);
    await Promise.all(
      back.map(async P => {
        const r = restOf(P);
        if (anim && P.g.position.distanceTo(r.pos) > 0.3) {
          const p = P.g.position,
            gapX = r.pos.x - 0.56;
          await E.walk(P.g, [V(p.x, 0, WALLZ + 2.0), V(gapX, 0, WALLZ + 2.0), V(gapX, 0, r.pos.z), r.pos], 3.2);
        }
        placePerson(P);
      }),
    );
  }

  // ═══════════════════════════════════ применить изменение строки ══
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
      people.delete(id);
      model.passenger.delete(id);
      if (anim) {
        say(id, 'До свидания…', 1500);
        await E.walk(P.g, [V(P.g.position.x, 0, 0), V(LEN0 - 0.2, 0, 0)]);
        await tween(P.g.scale, {x: 0.01, y: 0.01, z: 0.01}, 260, 'in');
      }
      E.dispose(P.g);
      P.g.parent && P.g.parent.remove(P.g);
      return;
    }
    const old = P.row;
    P.row = {...nv};
    model.passenger.set(id, nv);
    if (old.seat !== nv.seat) placePerson(P);
    if (old.meal !== nv.meal) attachTray(P, nv.meal, anim);
    if (old.loyalty !== nv.loyalty) attachBadge(P, nv.loyalty, anim);
    if (anim && (old.birth_year !== nv.birth_year || old.full_name !== nv.full_name || old.city !== nv.city))
      say(id, 'Мои данные поменялись', 1500);
  }
  async function applyBag(tag, nv, anim, all) {
    const B = bags.get(tag);
    if (!B && nv) {
      const g = makeBag(nv);
      root.add(g);
      bags.set(tag, {g, row: nv});
      model.baggage.set(tag, nv);
      putBag(g, bagSlots(all).get(tag));
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
        await tween(p, {y: p.y + 0.7}, 260, 'out');
        await tween(p, {x: LEN0 - 0.4, y: 0.2, z: GATE ? 2.8 : 1.6}, 700, 'in');
      }
      E.dispose(B.g);
      B.g.parent && B.g.parent.remove(B.g);
      return;
    }
    const old = B.row;
    B.row = {...nv};
    model.baggage.set(tag, nv);
    if (old.weight_kg !== nv.weight_kg) {
      const s0 = bagSize(old.weight_kg),
        s1 = bagSize(nv.weight_kg);
      const g = makeBag(nv);
      g.position.copy(B.g.position);
      g.rotation.y = B.g.rotation.y;
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
      if (anim) await tween(L.g.position, {y: -1.3}, 500, 'in');
      E.dispose(L.g);
      root.remove(L.g);
      L.g.position.y = 0.76;
    } else if (nv && !L.alive) {
      L.alive = true;
      model.loyalty.set(tier, nv);
      root.add(L.g);
    }
  }
  async function sync(state, anim = true) {
    try {
      const jobs = [];
      const want = new Map(state.passenger.map(r => [r.id, r]));
      if (!GATE && (want.size !== people.size || [...want.keys()].some(id => !people.has(id)))) {
        layoutRing(state.passenger);
      }
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
      // перерасстановка: чемоданы по местам, пассажиры по местам у ленты
      const slots = bagSlots(state.baggage);
      bags.forEach((B, t) => {
        const s = slots.get(t);
        if (s && B.g.position.distanceTo(s.p) > 0.01) {
          if (anim) tween(B.g.position, {x: s.p.x, y: s.p.y, z: s.p.z}, 400);
          else putBag(B.g, s);
        }
      });
      if (!GATE)
        people.forEach(P => {
          const r = restOf(P);
          if (P.g.position.distanceTo(r.pos) > 0.01) {
            if (anim) tween(P.g.position, {x: r.pos.x, z: r.pos.z}, 400).then(() => (P.g.rotation.y = r.rot));
            else placePerson(P);
          }
        });
    } finally {
      E.sweepLabels();
    }
  }
  const bounce = (id, h) => {
    const P = people.get(id);
    return P ? E.bounce(P.g, h) : Promise.resolve();
  };

  // ═════════════════════════════════════ финал: вылет / круг ленты ══
  async function takeoff() {
    E.camS.follow = false;
    E.beamOff();
    if (GATE) {
      E.camS.zoom = 0.8;
      const pl = outside.userData.plane;
      await tween(pl.position, {x: pl.position.x + 3}, 1400, 'io');
      await tween(pl.position, {x: pl.position.x + 40}, 2800, 'in');
      return;
    }
    // лента делает круг — чемоданы едут
    const list = [...bags.values()].map(B => B.row);
    const t0 = performance.now();
    await new Promise(res => {
      const step = () => {
        const f = Math.min(1, (performance.now() - t0) / 3200);
        beltShift = f * f * (3 - 2 * f);
        const slots = bagSlots(list);
        bags.forEach((B, t) => slots.get(t) && putBag(B.g, slots.get(t)));
        if (f < 1) requestAnimationFrame(step);
        else res();
      };
      step();
    });
    beltShift = 0;
  }
  const resetRoot0 = E.resetRoot;

  return Object.assign(E, {
    build,
    sync,
    locate,
    say,
    bounce,
    applyPassenger,
    applyBag,
    applyLoyalty,
    answer,
    calm,
    takeoff,
    resetRoot: () => {
      resetRoot0();
      if (GATE) outside.userData.plane.position.x = LEN0 + 4.2;
    },
    seatPos,
    people,
    bags,
    plates,
    model,
    LEN0,
    validSeat,
  });
}
