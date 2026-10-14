// ЛР-13 · 3D-сцена: пустой салон, кресла из таблицы seat, очередь у трапа, тележка с багажом, табло, робот-СУБД.
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {CHAR_GLB, COLORMAP} from './assets.js';
import {ROWS, rng, seatRow, seatL, shelfOf} from './data.js';

export const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// ════════════════════════════════════════════════════════════ твины ══
const tw = [];
const EASE = {io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out: t => 1 - Math.pow(1 - t, 3), in: t => t * t * t,
  back: t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  drop: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; },
  lin: t => t};
export function tween(o, to, ms, ease = 'io') {
  return new Promise(res => { const from = {}; for (const k in to) from[k] = o[k]; tw.push({o, to, from, t0: performance.now(), ms: Math.max(1, ms), ease, res}); });
}

// ═════════════════════════════════════════════════════════════ мир ══
export function createWorld(stage) {
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);
  const labels = new CSS2DRenderer();
  labels.domElement.className = 'labels';
  stage.appendChild(labels.domElement);

  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-10, 10, 6, -6, .1, 300);
  const CAMDIR = new THREE.Vector3(1.05, 1.25, 1.35).normalize();
  const HOMEC = {tx: 1.2, tz: 1.7};
  const camS = {tx: HOMEC.tx, tz: HOMEC.tz, ty: 0, zoom: 1, cx: HOMEC.tx, cy: 0, cz: HOMEC.tz, cur: 1, follow: false, shakeT: 0};

  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x9fb2c2, 1.25));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.2);
  sun.position.set(-6, 14, 9); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {left: -13, right: 13, top: 11, bottom: -11, near: 1, far: 50});
  sun.shadow.bias = -.0008;
  scene.add(sun); scene.add(sun.target); sun.target.position.set(2, 0, 1);
  const fill = new THREE.DirectionalLight(0xd8e6ff, .5); fill.position.set(10, 6, -8); scene.add(fill);

  // кэш материалов и геометрий: одинаковые детали не создаются заново
  const mcache = new Map(), gcache = new Map();
  const mat = (c, o = {}) => {
    if (o.transparent) return new THREE.MeshStandardMaterial({color: c, roughness: o.r ?? .78, metalness: 0, ...o});
    const k = c + JSON.stringify(o); let m = mcache.get(k);
    if (!m) { m = new THREE.MeshStandardMaterial({color: c, roughness: o.r ?? .78, metalness: 0, ...o}); mcache.set(k, m); }
    return m;
  };
  const rgeo = (w, h, d, r) => {
    const k = [w, h, d, r].map(v => v.toFixed(3)).join(); let g = gcache.get(k);
    if (!g) { g = new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001)); gcache.set(k, g); }
    return g;
  };
  const rbox = (w, h, d, r, c, o) => { const m = new THREE.Mesh(rgeo(w, h, d, r), typeof c === 'object' ? c : mat(c, o)); m.castShadow = true; m.receiveShadow = true; return m; };
  // склейка: много мелких деталей → один меш с цветами в вершинах (в разы меньше вызовов отрисовки)
  const VCM = new THREE.MeshStandardMaterial({vertexColors: true, roughness: .78, metalness: 0});
  function bakeMeshes(list, rel) {
    const geos = [];
    list.forEach(m => {
      let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      Object.keys(g.attributes).forEach(a => { if (a !== 'position' && a !== 'normal') g.deleteAttribute(a); });
      g.applyMatrix4(rel(m));
      const c = m.material.color || new THREE.Color(0xffffff), e = m.material.emissive, ei = m.material.emissiveIntensity ?? 1;
      const r = Math.min(1, c.r + (e ? e.r * ei : 0)), gg = Math.min(1, c.g + (e ? e.g * ei : 0)), b = Math.min(1, c.b + (e ? e.b * ei : 0));
      const n = g.attributes.position.count, col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { col[i * 3] = r; col[i * 3 + 1] = gg; col[i * 3 + 2] = b; }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geos.push(g);
    });
    const merged = new THREE.Mesh(mergeGeometries(geos), VCM.clone());
    geos.forEach(g => g.dispose());
    merged.castShadow = true; merged.receiveShadow = true;
    return merged;
  }
  // склеить все непрозрачные меши внутри группы (координаты — относительно группы)
  function bakeGroup(group, keep = () => false) {
    group.updateMatrixWorld(true);
    const inv = group.matrixWorld.clone().invert();
    const list = [];
    group.traverse(o => { if (o.isMesh && !o.material.transparent && !keep(o)) list.push(o); });
    if (list.length < 2) return group;
    const merged = bakeMeshes(list, m => inv.clone().multiply(m.matrixWorld));
    list.forEach(m => m.parent.remove(m));
    group.add(merged);
    return group;
  }
  const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };
  const label = (html, cls, obj, x, y, z) => { const el = document.createElement('div'); el.className = cls; el.innerHTML = html; const o = new CSS2DObject(el); o.position.set(x, y, z); obj.add(o); return o; };

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), mat(0xdcd6c9, {r: 1}));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1.35; ground.receiveShadow = true; scene.add(ground);
  for (let i = -6; i < 14; i++) { const d = rbox(1.4, .02, .14, .02, 0xf2c230); at(d, i * 2.4, -1.33, -1.2); d.castShadow = false; scene.add(d); }

  const root = new THREE.Group(); scene.add(root);
  const PITCH = 1.12;
  const ZS = {A: -2.0, B: -1.42, C: -.84, D: .84, E: 1.42, F: 2.0};
  const ZB = {A: -1.85, B: -1.42, C: -1.0, D: 1.0, E: 1.42, F: 1.85};
  const seatX = row => (row - 1) * PITCH;
  const seatZ = s => (seatRow(s) <= 2 ? ZB : ZS)[seatL(s)];
  const LEN0 = -3.1, LEN1 = seatX(ROWS) + 1.3, MID = (LEN0 + LEN1) / 2, LEN = LEN1 - LEN0;
  const DOOR = {x: LEN0 + 2.3, z: 2.75};
  const validSeat = s => /^[1-6][A-F]$/.test(String(s || ''));

  const hull = rbox(LEN + .5, 1.3, 6.1, .45, 0xfbf8f2); at(hull, MID, -.66, 0); root.add(hull);
  [-1, 1].forEach(s => {
    const st = rbox(LEN + .52, .16, .06, .03, 0xffc21a); at(st, MID, -.45, s * 3.04); root.add(st);
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(3.0, 0); sh.lineTo(4.3, 5.4); sh.lineTo(3.4, 5.4); sh.lineTo(0, 0);
    const wing = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, {depth: .12, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 2}), mat(0xeef0f2));
    wing.castShadow = true; wing.receiveShadow = true; wing.rotation.x = s * Math.PI / 2; wing.position.set(seatX(2.6), -.9, s * 2.95); root.add(wing);
    const eng = rbox(1.5, .6, .6, .28, 0xd8dde1); at(eng, seatX(3.6), -1.1, s * 4.6); root.add(eng);
    const tail = new THREE.Shape(); tail.moveTo(0, 0); tail.lineTo(1.4, 0); tail.lineTo(2.1, 2.0); tail.lineTo(1.5, 2.0); tail.lineTo(0, 0);
    const tg = new THREE.Mesh(new THREE.ExtrudeGeometry(tail, {depth: .1, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 2}), mat(0xeef0f2));
    tg.castShadow = true; tg.rotation.x = s * Math.PI / 2; tg.position.set(LEN1 - 1.5, -.7, s * 2.95); root.add(tg);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(3.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xfbf8f2));
  nose.scale.set(.213, .55, 1); nose.rotation.z = Math.PI / 2; at(nose, LEN0 - .1, -.66, 0); nose.castShadow = true; root.add(nose);
  const floor = rbox(LEN, .12, 5.9, .05, 0xeee8da); at(floor, MID, -.06, 0); root.add(floor);
  const carpet = rbox(LEN - .2, .02, 1.05, .01, 0x4a5684); at(carpet, MID, .01, 0); root.add(carpet);
  for (let i = 0; i < 12; i++) [-.44, .44].forEach(z => { const d = rbox(.16, .021, .04, .01, 0xffc21a, {emissive: 0x332200}); at(d, LEN0 + .6 + i * (LEN - 1.2) / 11, .02, z); root.add(d); });
  // крепёжные рейки на полу — сюда встают кресла
  [ZS.A, ZS.C, ZS.D, ZS.F].forEach(z => { const r = rbox(seatX(ROWS) + .9, .025, .06, .01, 0xc9c2b2); at(r, seatX(ROWS) / 2, .01, z); r.castShadow = false; root.add(r); });
  const wallFar = rbox(LEN, 2.25, .16, .06, 0xf7f4ee); at(wallFar, MID, 1.07, -2.95); root.add(wallFar);
  const wallNear = rbox(LEN, .42, .16, .06, 0xf7f4ee); at(wallNear, MID, .17, 2.95); root.add(wallNear);
  for (let r = 1; r <= ROWS; r++) { const w = rbox(.42, .46, .04, .14, 0x9fc3d8, {r: .25, emissive: 0x24384a, emissiveIntensity: .25}); at(w, seatX(r) - .1, .8, -2.86); root.add(w); }
  const trim = rbox(LEN, .08, .2, .03, 0xffc21a); at(trim, MID, 2.2, -2.95); root.add(trim);
  const endWall = rbox(.16, 1.55, 5.9, .06, 0xf7f4ee); at(endWall, LEN1, .72, 0); root.add(endWall);
  const galley = rbox(.9, 1.0, 1.5, .08, 0xdcd6c8); at(galley, LEN0 + .55, .5, -2.05); root.add(galley);
  const doorF = rbox(.9, .03, .5, .02, 0xffc21a); at(doorF, DOOR.x, .03, 2.7); root.add(doorF);
  // ряды — номера на полу у прохода
  for (let r = 1; r <= ROWS; r++) label(String(r), 'rown', root, seatX(r), .05, -.62);
  // полки над рядами (по два ряда на полку)
  const BIN_Y = 1.55, BIN_Z = -2.55, SHELVES = Math.ceil(ROWS / 2);
  const shelfX0 = k => seatX(2 * k - 1) - .6, shelfX1 = k => seatX(2 * k) + .6;
  const binB = rbox(shelfX1(SHELVES) - shelfX0(1), .06, .62, .02, 0xd9d3c4); at(binB, (shelfX0(1) + shelfX1(SHELVES)) / 2, BIN_Y, BIN_Z); root.add(binB);
  const binT = rbox(shelfX1(SHELVES) - shelfX0(1), .05, .62, .02, 0xece6d8); at(binT, binB.position.x, BIN_Y + .62, BIN_Z); root.add(binT);
  for (let k = 0; k <= SHELVES; k++) { const dv = rbox(.05, .62, .62, .02, 0xcbc4b3); at(dv, k === SHELVES ? shelfX1(k) : shelfX0(k + 1), BIN_Y + .31, BIN_Z); root.add(dv); }
  for (let k = 1; k <= SHELVES; k++) label(`полка ${k}`, 'tag3', root, (shelfX0(k) + shelfX1(k)) / 2, BIN_Y + .78, BIN_Z + .2);
  // табло
  const board = rbox(.06, .62, 1.3, .03, 0x27292c); at(board, LEN0 + .06, 1.35, .2); root.add(board);
  board.userData.pick = {t: 'flight', k: '*'};
  const boardLbl = label('', 'board', root, LEN0 + .1, 1.8, .2);

  // ════════════════════════════════════════════════ трап и тележка ══
  const BR = {x0: DOOR.x - .7, x1: DOOR.x + 2.3, z0: 3.05, z1: 6.6};
  const bridge = rbox(BR.x1 - BR.x0, .14, BR.z1 - BR.z0, .04, 0xb9b3a6); at(bridge, (BR.x0 + BR.x1) / 2, -.07, (BR.z0 + BR.z1) / 2); scene.add(bridge);
  const lane = rbox(.9, .02, BR.z1 - BR.z0 - .2, .01, 0x4a5684); at(lane, DOOR.x, .005, (BR.z0 + BR.z1) / 2); lane.castShadow = false; scene.add(lane);
  [BR.x0 + .05, BR.x1 - .05].forEach(x => { const r = rbox(.05, .05, BR.z1 - BR.z0, .02, 0x3f474d); at(r, x, .55, (BR.z0 + BR.z1) / 2); scene.add(r);
    for (let z = BR.z0 + .3; z < BR.z1; z += .8) { const p = rbox(.04, .55, .04, .01, 0x3f474d); at(p, x, .27, z); scene.add(p); } });
  [[BR.x0 + .3, BR.z1 - .3], [BR.x1 - .3, BR.z1 - .3]].forEach(([x, z]) => { const l = rbox(.24, 1.3, .24, .05, 0x8b857a); at(l, x, -.75, z); scene.add(l); });
  label('трап · очередь на посадку', 'tag3', scene, DOOR.x, .1, BR.z1 + .1);
  const cartPos = new THREE.Vector3(DOOR.x + 1.35, 0, 4.4);
  const cart = new THREE.Group(); scene.add(cart); cart.position.copy(cartPos);
  { const bed = rbox(1.1, .08, 1.5, .03, 0x6d747a); at(bed, 0, .3, 0); cart.add(bed);
    const h = rbox(.05, .5, 1.3, .02, 0x3f474d); at(h, .55, .55, 0); cart.add(h);
    [[-.4, -.6], [.4, -.6], [-.4, .6], [.4, .6]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .07, 14), mat(0x22252b)); w.rotation.x = Math.PI / 2; at(w, x, .12, z); w.castShadow = true; cart.add(w); });
    label('багаж к рейсу', 'tag3', cart, 0, .05, .95); }
  cart.visible = false;
  // статичный корпус и трап — по одному мешу на всё
  {
    root.updateMatrixWorld(true); scene.updateMatrixWorld(true);
    const st = root.children.filter(o => o.isMesh && o !== board && !o.material.transparent);
    root.add(bakeMeshes(st, o => o.matrix.clone())); st.forEach(o => root.remove(o));
    const s2 = scene.children.filter(o => o.isMesh && o !== ground && !o.material.transparent);
    scene.add(bakeMeshes(s2, o => o.matrix.clone())); s2.forEach(o => scene.remove(o));
    bakeGroup(cart);
  }
  const qPos = i => new THREE.Vector3(DOOR.x, 0, 3.55 + i * .62);
  const cartSlot = i => new THREE.Vector3(cartPos.x + (i % 2 ? .25 : -.25), .5 + Math.floor(i / 2) * .32, cartPos.z - .45 + Math.floor(i / 2) % 3 * .45);

  // ══════════════════════════════════════════════════════════ кресла ══
  const seats = new Map(), ghosts = new Map();
  function makeSeat(row) {
    const biz = row.cls === 'бизнес';
    const g = new THREE.Group();
    const c1 = biz ? 0x7a4b3a : 0x2f6f73, c2 = biz ? 0x643c2e : 0x265a5e, w = biz ? .62 : .5;
    const base = rbox(.52, .16, w, .06, c1); at(base, 0, .32, 0); g.add(base);
    const back = rbox(.13, biz ? .76 : .66, w, .05, c2); at(back, .26, biz ? .7 : .66, 0); g.add(back);
    const head = rbox(.14, .16, w * .72, .04, 0xece6d6); at(head, .27, biz ? 1.02 : .93, 0); g.add(head);
    const leg = rbox(.32, .24, .08, .03, 0x6d747a); at(leg, .02, .12, 0); g.add(leg);
    [-1, 1].forEach(s => { const arm = rbox(.42, biz ? .1 : .06, .07, .02, biz ? 0x4a2e24 : 0x3f474d); at(arm, .06, .48, s * (w / 2 + .03)); g.add(arm); });
    bakeGroup(g);
    g.traverse(o => { if (o.isMesh) o.userData.pick = {t: 'seat', k: row.seat_no}; });
    return g;
  }
  const seatSpot = s => new THREE.Vector3(validSeat(s) ? seatX(seatRow(s)) : DOOR.x, 0, validSeat(s) ? seatZ(s) : 2.2);
  function makeGhost(s) {
    const g = new THREE.Group();
    const m = rbox(.56, .9, .56, .1, 0xffc21a, {transparent: true, opacity: .3, emissive: 0x6b5000, depthWrite: false});
    m.castShadow = false; at(m, 0, .45, 0); g.add(m);
    label(esc(s), 'gseat', g, 0, .95, 0);
    g.position.copy(seatSpot(s)); return g;
  }
  async function addSeat(row, anim) {
    const old = seats.get(row.seat_no);
    if (old) { dispose(old.g); root.remove(old.g); }
    const g = makeSeat(row); g.position.copy(seatSpot(row.seat_no));
    if (!validSeat(row.seat_no)) g.position.set(DOOR.x + (seats.size % 3) * .6, 0, 1.6);
    root.add(g); seats.set(row.seat_no, {g, row: {...row}});
    refreshGhosts();
    if (anim) { const y = g.position.y; g.position.y = 2.6; await tween(g.position, {y}, 650 / Math.min(SPD, 3), 'drop'); }
  }
  async function removeSeat(s, anim) {
    const S = seats.get(s); if (!S) return;
    seats.delete(s);
    if (anim) { await tween(S.g.position, {y: 2.6}, 380, 'in'); }
    dispose(S.g); root.remove(S.g); refreshGhosts();
  }
  function refreshGhosts() { ghosts.forEach((G, s) => { G.visible = !seats.has(s); G.traverse(o => { if (o.isCSS2DObject) o.element.style.display = G.visible ? '' : 'none'; }); }); }

  // ═══════════════════════════════════════════════════════ пассажиры ══
  const SHIRT = [0xb5523b, 0x2f6f73, 0xc9952b, 0x3b4d7a, 0x6d7a3a, 0x7a4b6b, 0x4f6d8a, 0xd07a4a, 0x5a8a6f, 0x8a4a4a, 0x5c5470];
  const SKIN = [0xf1c9a5, 0xe0ac84, 0xc68a62, 0xf5d6bc, 0xa8714f];
  const HAIR = [0x2b2420, 0x4a3426, 0x7a5a3a, 0x1d1c1a, 0xb98c5a, 0x8f4a2a];
  const people = new Map(), bags = new Map(), queue = new Map(), cartBags = new Map();
  let queueDocs = [], cartDocs = [], FLIGHT = '';
  const isKid = row => row.kid ?? (row.birth_year != null && row.birth_year >= 2012);
  const isFem = row => row.female ?? /а\s/.test(String(row.full_name || ''));
  function makePerson(p) {
    const r = rng((p.id || 1) * 131 + 7);
    const g = new THREE.Group();
    const shirt = SHIRT[Math.floor(r() * SHIRT.length)], skin = SKIN[Math.floor(r() * SKIN.length)];
    const old = p.birth_year != null && p.birth_year < 1962, kid = isKid(p), female = isFem(p);
    const hair = old ? 0xd9d6d0 : HAIR[Math.floor(r() * HAIR.length)];
    const pants = [0x3d4250, 0x2b2f3a, 0x5a4a3a, 0x3b4d5a][Math.floor(r() * 4)];
    const add = (m, x, y, z) => { at(m, x, y, z); g.add(m); return m; };
    add(rbox(.34, .44, .38, .1, shirt), .05, .62, 0);
    add(rbox(.3, .1, .34, .04, pants), .05, .42, 0);
    [-1, 1].forEach(s => { add(rbox(.28, .1, .1, .045, shirt), -.06, .58, s * .23); add(rbox(.08, .08, .08, .03, skin), -.22, .58, s * .23); });
    add(rbox(.3, .3, .3, .1, skin), .02, 1.0, 0);
    add(rbox(.32, female ? .2 : .12, .33, .06, hair), .06, female ? 1.1 : 1.13, 0);
    if (female && !kid) add(rbox(.1, .26, .26, .05, hair), .17, .92, 0);
    [-1, 1].forEach(s => add(rbox(.035, .055, .05, .015, 0x1d1c1a), -.13, 1.01, s * .07));
    bakeGroup(g);
    // ноги: бедро от таза, голень от колена — для позы «сидит/стоит» и шага
    const legs = [-1, 1].map(s => {
      const hip = new THREE.Group(); hip.position.set(.04, .42, s * .09); g.add(hip);
      const th = rbox(.14, .22, .14, .04, pants); th.position.y = -.11; hip.add(th);
      const knee = new THREE.Group(); knee.position.y = -.21; hip.add(knee);
      const sh = rbox(.12, .2, .12, .04, pants); sh.position.y = -.1; knee.add(sh);
      const shoe = rbox(.18, .06, .13, .025, 0x22252b); shoe.position.set(-.03, -.2, 0); knee.add(shoe); bakeGroup(knee);
      return {hip, knee, s};
    });
    legs.forEach(l => { l.hip.rotation.z = -Math.PI / 2; l.knee.rotation.z = Math.PI / 2; });
    g.updateMatrixWorld(true);
    { const inv = g.matrixWorld.clone().invert(), lm = [];
      legs.forEach(l => l.hip.traverse(o => { if (o.isMesh) lm.push(o); }));
      const sitMesh = bakeMeshes(lm, m => inv.clone().multiply(m.matrixWorld)); g.add(sitMesh); legs.sitMesh = sitMesh; }
    const sc = kid ? .66 : 1;
    g.scale.setScalar(sc);
    g.userData = {id: p.id, s: sc, kid, legs};
    setPose(g, 'stand');
    return g;
  }
  function setPose(g, pose) {
    const L = g.userData.legs; if (!L) return;
    g.userData.pose = pose;
    L.forEach(l => { l.hip.rotation.z = 0; l.knee.rotation.z = 0; l.hip.visible = pose !== 'sit'; });
    if (L.sitMesh) L.sitMesh.visible = pose === 'sit';
  }
  const walkers = new Set();

  const setPick = (g, pick) => g.traverse(o => { if (o.isMesh) o.userData.pick = pick; });
  const MEALC = {'детское': 0xffc21a, 'стандарт': 0x8a9096, 'вегетарианское': 0x5aa86e, 'ресторан': 0xb5523b};
  function trayMesh(meal) {
    const g = new THREE.Group();
    g.add(rbox(.3, .035, .36, .015, 0xfbf8f2));
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .02, 20), mat(0xffffff)); at(plate, 0, .03, -.05); g.add(plate);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.085, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(MEALC[meal] || 0x6b4f9a, {r: .45})); at(dome, 0, .04, -.05); dome.castShadow = true; g.add(dome);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(.04, .035, .08, 12), mat(0xffffff)); at(cup, .02, .06, .11); g.add(cup);
    return bakeGroup(g);
  }
  function attachTray(P, meal, anim) {
    if (P.tray) { P.g.remove(P.tray); P.tray = null; }
    if (!meal) return;
    const t = trayMesh(meal), s = P.g.userData.s, k = P.g.userData.kid;
    P.tray = t; t.position.set(-.32 / s, (k ? .42 : .56) / s, 0); t.scale.setScalar(1 / s); P.g.add(t);
    if (anim) { const s0 = t.scale.x; t.scale.setScalar(.01); tween(t.scale, {x: s0, y: s0, z: s0}, 380, 'back'); }
  }
  const onBoard = row => row.flight_no === FLIGHT && seats.has(row.seat_no);
  const seatPos = (s, kid) => { const v = seatSpot(s); v.x -= .02; v.y = kid ? .08 : 0; return v; };
  const wingSpot = id => new THREE.Vector3(seatX(3) + (id % 4) * .5, -.75, -3.6 - (id % 3) * .45);
  const targetOf = (row, kid) => onBoard(row) ? seatPos(row.seat_no, kid) : wingSpot(row.id);
  async function walk(g, path, spd = 2.4) {
    const p = g.position;
    setPose(g, 'stand'); walkers.add(g);
    for (const q of path) {
      const dx = q.x - p.x, dz = q.z - p.z, d = Math.hypot(dx, dz) + Math.abs(q.y - p.y);
      if (d < .01) continue;
      if (Math.hypot(dx, dz) > .01) g.rotation.y = Math.atan2(dz, -dx);
      await tween(p, {x: q.x, y: q.y, z: q.z}, d / spd * 1000 / Math.min(SPD, 4), 'lin');
    }
    walkers.delete(g); setPose(g, 'stand');
  }
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  async function boardWalk(P, to) {                                  // от трапа через дверь к креслу
    const g = P.g, p = g.position;
    const path = [];
    if (p.z > 2.5) path.push(V(DOOR.x, 0, p.z), V(DOOR.x, 0, .3));
    if (to.y < -.5) path.push(V(to.x, 0, -.3), V(to.x, -.75, -3.0), to.clone());
    else path.push(V(to.x, 0, Math.sign(to.z) * .3), to.clone());
    await walk(g, path);
    g.rotation.y = 0;
    if (to.y > -.5) setPose(g, 'sit');
  }
  async function backToQueue(g, i) {
    const p = g.position, q = qPos(i);
    await walk(g, [V(p.x, p.y, Math.sign(p.z || 1) * .3), V(DOOR.x, 0, .3), V(DOOR.x, 0, q.z)]);
    g.rotation.y = -Math.PI / 2;
  }
  function addQueuePerson(doc, i) {
    const g = makePerson(doc);
    g.position.copy(qPos(i)); g.rotation.y = -Math.PI / 2;
    setPick(g, {t: 'queue', k: doc.id});
    const lb = label(`№ ${doc.id}`, 'qtag', g, 0, 1.45 / g.userData.s, 0);
    scene.add(g); queue.set(doc.id, {g, i, doc, lb});
    return g;
  }
  async function addPerson(row, anim) {
    let g, from = null;
    const Q = queue.get(row.id);
    if (Q) { g = Q.g; queue.delete(row.id); Q.lb.parent && Q.lb.parent.remove(Q.lb); Q.lb.element.remove(); scene.remove(g); from = g.position.clone(); }
    else { g = makePerson(row); from = anim ? V(DOOR.x, 0, BR.z1 - .2) : null; }
    setPick(g, {t: 'passenger', k: row.id});
    root.add(g);
    const P = {g, row: {...row}, tray: null};
    people.set(row.id, P);
    const to = targetOf(row, g.userData.kid);
    if (!anim) { g.position.copy(to); g.rotation.y = to.y < -.5 ? Math.PI / 2 : 0; setPose(g, to.y < -.5 ? 'stand' : 'sit'); attachTray(P, row.meal, false); return P; }
    g.position.copy(from);
    await boardWalk(P, to);
    if (to.y < -.5) { g.rotation.y = Math.PI / 2; say(row.id, 'Это не мой самолёт…', 2200); }
    attachTray(P, row.meal, true);
    return P;
  }
  async function removePerson(id, anim) {
    const P = people.get(id); if (!P) return;
    people.delete(id);
    const qi = queueDocs.findIndex(d => d.id === id);
    if (qi >= 0) {                                                   // откат: обратно в очередь
      if (P.tray) { P.g.remove(P.tray); P.tray = null; }
      dispose(P.g); root.remove(P.g); scene.add(P.g);
      setPick(P.g, {t: 'queue', k: id});
      const lb = label(`№ ${id}`, 'qtag', P.g, 0, 1.45 / P.g.userData.s, 0);
      queue.set(id, {g: P.g, i: qi, doc: queueDocs[qi], lb});
      if (anim) await backToQueue(P.g, qi); else { P.g.position.copy(qPos(qi)); P.g.rotation.y = -Math.PI / 2; }
      return;
    }
    if (anim) await tween(P.g.scale, {x: .01, y: .01, z: .01}, 300, 'in');
    dispose(P.g); root.remove(P.g);
  }

  // ═════════════════════════════════════════════════════════ багаж ══
  const bagSize = w => ({w: .24 + w * .006, h: .2 + w * .007, d: .34});
  const BAGC = [0x8a6f4c, 0x6d4f3a, 0x4f6d8a, 0x9a3b2a, 0x5a6a3a, 0x3d4250];
  function makeBag(b) {
    const s = bagSize(Math.max(1, Math.min(40, b.weight_kg || 10)));
    const g = new THREE.Group();
    const body = rbox(s.w, s.h, s.d, .05, BAGC[(parseInt(String(b.tag).slice(1), 10) || 0) % BAGC.length]); g.add(body);
    const handle = rbox(.12, .04, .04, .015, 0x22252b); at(handle, 0, s.h / 2 + .02, 0); g.add(handle);
    const tg = rbox(.08, .1, .01, .005, 0xffc21a); at(tg, s.w / 2 - .05, .02, s.d / 2 + .01); g.add(tg);
    return bakeGroup(g);
  }
  const ownerRow = pid => { const P = people.get(pid); return P && onBoard(P.row) ? seatRow(P.row.seat_no) : null; };
  function bagSlots(rows) {
    const pos = new Map(), by = {};
    rows.forEach(b => { const r = ownerRow(b.passenger_id); const k = r ? shelfOf(r) : 0; (by[k] = by[k] || []).push(b); });
    for (const k in by) by[k].forEach((b, i) => {
      const s = bagSize(b.weight_kg);
      if (+k === 0) { pos.set(b.tag, V(seatX(3) + i * .4, -.75 + s.h / 2, -3.3)); return; }
      const per = 6, col = i % per, lay = Math.floor(i / per);
      pos.set(b.tag, V(shelfX0(+k) + .3 + col * .38, BIN_Y + .03 + s.h / 2 + lay * .3, BIN_Z + .02));
    });
    return pos;
  }
  const bagRows = () => [...bags.values()].map(B => B.row);
  function addCartBag(doc, i) {
    const g = makeBag(doc); g.position.copy(cartSlot(i)); g.rotation.y = .3 * (i % 2 ? 1 : -1);
    setPick(g, {t: 'cart', k: doc.tag}); scene.add(g); cartBags.set(doc.tag, {g, i, doc});
  }
  async function addBag(row, anim) {
    let g; const C = cartBags.get(row.tag);
    if (C) { cartBags.delete(row.tag); g = C.g; const wp = g.getWorldPosition(V(0, 0, 0)); scene.remove(g); g.position.copy(wp).sub(root.position); g.rotation.y = 0; }
    else { g = makeBag(row); }
    root.add(g); setPick(g, {t: 'baggage', k: row.tag});
    bags.set(row.tag, {g, row: {...row}});
    const to = bagSlots(bagRows()).get(row.tag);
    if (!anim || !C) { if (anim && !C) { g.position.copy(to).setY(to.y + 1.5); await tween(g.position, {y: to.y}, 500, 'drop'); } else g.position.copy(to); return; }
    const mid = g.position.clone().lerp(to, .5); mid.y = Math.max(g.position.y, to.y) + 1.2;
    await tween(g.position, {x: mid.x, y: mid.y, z: mid.z}, 380 / Math.min(SPD, 3), 'out');
    await tween(g.position, {x: to.x, y: to.y, z: to.z}, 380 / Math.min(SPD, 3), 'in');
  }
  async function removeBag(tag, anim) {
    const B = bags.get(tag); if (!B) return;
    bags.delete(tag);
    const ci = cartDocs.findIndex(d => d.tag === tag);
    if (ci >= 0) {
      dispose(B.g); root.remove(B.g); scene.add(B.g); setPick(B.g, {t: 'cart', k: tag}); cartBags.set(tag, {g: B.g, i: ci, doc: cartDocs[ci]});
      const to = cartSlot(ci);
      if (anim) { const mid = B.g.position.clone().lerp(to, .5); mid.y += 1.2; await tween(B.g.position, {x: mid.x, y: mid.y, z: mid.z}, 300, 'out'); await tween(B.g.position, {x: to.x, y: to.y, z: to.z}, 300, 'in'); }
      else B.g.position.copy(to);
      return;
    }
    if (anim) await tween(B.g.scale, {x: .01, y: .01, z: .01}, 300, 'in');
    dispose(B.g); root.remove(B.g);
  }

  // ═════════════════════════════════════════════════════════ робот ══
  const robotG = new THREE.Group(); root.add(robotG);
  let mixer = null, acts = {}, curAct = null;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(.02, .3, 1, 16, 1, true), new THREE.MeshBasicMaterial({color: 0xffd34d, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide}));
  root.add(beam);
  async function loadRobot() {
    const bin = Uint8Array.from(atob(CHAR_GLB), c => c.charCodeAt(0));
    const mgr = new THREE.LoadingManager(); mgr.setURLModifier(u => /colormap\.png$/.test(u) ? COLORMAP : u);
    const gltf = await new Promise((res, rej) => new GLTFLoader(mgr).parse(bin.buffer, '', res, rej));
    const m = gltf.scene; m.scale.setScalar(1.25);
    m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    robotG.add(m);
    mixer = new THREE.AnimationMixer(m);
    gltf.animations.forEach(a => { acts[a.name] = mixer.clipAction(a); });
    play('idle');
  }
  function play(name, once) {
    const a = acts[name]; if (!a) return;
    if (curAct === a && !once) return;
    a.reset(); a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat); a.clampWhenFinished = !!once; a.play();
    if (curAct && curAct !== a) curAct.crossFadeTo(a, .18, false);
    curAct = a;
  }
  const rScreen = label('', 'rscreen', robotG, 0, 1.75, 0); rScreen.visible = false;
  const HOME = {x: LEN0 + 1.6, z: 0};
  robotG.position.set(HOME.x, 0, HOME.z); robotG.userData.face = -Math.PI / 2;
  let SPD = 1;
  async function robotGo(x, z = 0) {
    const p = robotG.position;
    if (Math.hypot(x - p.x, z - p.z) < .02) return;
    play('walk');
    const legs = [];
    if (Math.abs(p.z) > .05 && Math.abs(x - p.x) > .05) legs.push({x: p.x, z: 0});
    legs.push({x, z: Math.abs(x - p.x) > .05 ? 0 : z});
    if (Math.abs(z) > .05) legs.push({x, z});
    for (const L of legs) {
      const dx = L.x - p.x, dz = L.z - p.z, d = Math.hypot(dx, dz);
      if (d < .01) continue;
      robotG.userData.face = Math.atan2(dx, dz);
      await tween(p, {x: L.x, z: L.z}, d / 2.8 * 1000 / SPD, 'lin');
    }
    play('idle');
  }
  function aimBeam(wp) {
    const a = new THREE.Vector3(robotG.position.x, 1.25, robotG.position.z).add(root.position), b = wp.clone();
    const d = b.clone().sub(a), L = d.length();
    beam.scale.set(1, L, 1); beam.position.copy(a).add(d.clone().multiplyScalar(.5)).sub(root.position);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.normalize());
    beam.material.opacity = .28;
  }
  const beamOff = () => { beam.material.opacity = 0; };

  // ═════════════════════════════════════════════ состояние сцены ══
  let flights = new Map();
  function boardHtml() {
    const fs = [...flights.values()].sort((a, b) => String(a.dep_time).localeCompare(String(b.dep_time)));
    return '<div class="bh">ВЫЛЕТ</div>' + (fs.map(f => `<div class="${f.flight_no === FLIGHT ? 'on' : ''}"><b>${esc(f.flight_no)}</b> ${esc(String(f.dep_time || '').slice(0, 5))} ${esc(f.dest)} <i>${f.gate == null ? '—' : esc(f.gate)}</i></div>`).join('') || '<div class="e">— пусто —</div>');
  }
  function setBoard(rows, flashKey) {
    flights = new Map(rows.map(r => [r.flight_no, r]));
    boardLbl.element.innerHTML = boardHtml();
    if (flashKey) boardLbl.element.animate([{transform: 'scale(1.15)'}, {transform: 'none'}], {duration: 380, easing: 'cubic-bezier(.3,1.6,.6,1)'});
  }
  function build(state, opt) {
    FLIGHT = opt.flight;
    seats.forEach(S => { dispose(S.g); root.remove(S.g); }); seats.clear();
    people.forEach(P => { dispose(P.g); root.remove(P.g); }); people.clear();
    bags.forEach(B => { dispose(B.g); root.remove(B.g); }); bags.clear();
    queue.forEach(Q => { dispose(Q.g); scene.remove(Q.g); }); queue.clear();
    cartBags.forEach(C => { dispose(C.g); scene.remove(C.g); }); cartBags.clear();
    ghosts.forEach(G => { dispose(G); root.remove(G); }); ghosts.clear();
    clearChips(); hideCard(); clearSay();
    (opt.ghosts || []).forEach(s => { const g = makeGhost(s); root.add(g); ghosts.set(s, g); });
    state.seat.forEach(r => addSeat(r, false));
    queueDocs = opt.queue || []; cartDocs = opt.cart || [];
    state.passenger.forEach(r => addPerson(r, false));
    queueDocs.forEach((d, i) => { if (!people.has(d.id)) addQueuePerson(d, i); });
    const slots = bagSlots(state.baggage);
    state.baggage.forEach(r => { const g = makeBag(r); g.position.copy(slots.get(r.tag)); setPick(g, {t: 'baggage', k: r.tag}); root.add(g); bags.set(r.tag, {g, row: {...r}}); });
    cart.visible = cartDocs.length > 0;
    cartDocs.forEach((d, i) => { if (!bags.has(d.tag)) addCartBag(d, i); });
    setBoard(state.flight);
    refreshGhosts();
    robotG.position.set(HOME.x, 0, HOME.z); robotG.userData.face = -Math.PI / 2; beamOff(); play('idle');
    sweepLabels();
  }

  // ════════════════════════════════════════════ подписи в сцене ══
  function sweepLabels() {
    const live = new Set();
    scene.traverse(o => { if (o.isCSS2DObject) live.add(o.element); });
    [...labels.domElement.children].forEach(el => { if (!live.has(el)) el.remove(); });
  }
  const chips = new Map();
  let card = null;
  const keyOf = (t, k) => t + ':' + k;
  function objOf(t, k) {
    if (t === 'passenger') { const P = people.get(+k); return P && P.g; }
    if (t === 'baggage') { const B = bags.get(k); return B && B.g; }
    if (t === 'seat') { const S = seats.get(k); return S ? S.g : ghosts.get(k) || null; }
    if (t === 'queue') { const Q = queue.get(+k); return Q && Q.g; }
    if (t === 'cart') { const C = cartBags.get(k); return C && C.g; }
    if (t === 'flight') return board;
    if (t === 'spot') return spotObj;
    return null;
  }
  const spotObj = new THREE.Object3D(); root.add(spotObj);
  const chipH = (t, o) => t === 'passenger' || t === 'queue' ? 1.45 / o.userData.s : t === 'baggage' || t === 'cart' ? .42 : t === 'seat' ? 1.15 : .5;
  function chip(t, k, kind, text) {
    removeChip(t, k);
    const o = objOf(t, k); if (!o) return;
    const wrap = document.createElement('div'), el = document.createElement('div'); wrap.appendChild(el);
    el.className = 'chip ' + kind; el.textContent = kind === 'no' ? '' : text;
    const c = new CSS2DObject(wrap); c.position.set(0, chipH(t, o), 0); o.add(c); c.inner = el;
    el.animate([{transform: 'scale(.5)'}, {transform: 'none'}], {duration: 260, easing: 'cubic-bezier(.3,1.6,.6,1)'});
    chips.set(keyOf(t, k), c);
  }
  function dispose(obj) {
    chips.forEach((c, key) => { let p = c.parent; while (p && p !== obj) p = p.parent; if (p === obj) { c.parent && c.parent.remove(c); c.element.remove(); chips.delete(key); } });
    if (card) { let p = card.parent; while (p && p !== obj) p = p.parent; if (p === obj) hideCard(); }
    obj.traverse(o => { if (o.isCSS2DObject) { o.element.remove(); } });
    obj.children.filter(o => o.isCSS2DObject).forEach(o => obj.remove(o));
  }
  function removeChip(t, k) { const c = chips.get(keyOf(t, k)); if (c) { c.parent && c.parent.remove(c); c.element.remove(); chips.delete(keyOf(t, k)); } }
  function clearChips() { chips.forEach(c => { c.parent && c.parent.remove(c); c.element.remove(); }); chips.clear(); }
  function fadeNo() { chips.forEach(c => { if (c.inner.classList.contains('no')) c.inner.animate([{opacity: 1}, {opacity: 0}], {duration: 600, fill: 'forwards'}); }); }
  function showCard(t, k, html, cls = '') {
    hideCard();
    const o = objOf(t, k); if (!o) return;
    const wrap = document.createElement('div'), el = document.createElement('div'); wrap.appendChild(el);
    el.className = 'rcard ' + cls; el.innerHTML = html; wrap.style.zIndex = 20;
    card = new CSS2DObject(wrap); card.position.set(0, chipH(t, o) + .5, 0); o.add(card);
  }
  function hideCard() { if (card) { card.parent && card.parent.remove(card); card.element.remove(); card = null; } }
  const says = [];
  function say(id, text, ms = 0) {
    const g = (people.get(id) || queue.get(id) || {}).g; if (!g) return;
    const s = label(`<span>${esc(text)}</span>`, 'say', g, 0, 1.75 / g.userData.s, 0);
    says.push(s);
    if (ms) setTimeout(() => { s.parent && s.parent.remove(s); s.element.remove(); }, ms);
  }
  function clearSay() { says.splice(0).forEach(s => { s.parent && s.parent.remove(s); s.element.remove(); }); }

  // ═══════════════════════════ где стоять роботу у строки (и новой) ══
  function locate(t, row) {
    if (t === 'seat') {
      const s = row.seat_no, v = seatSpot(s);
      if (!validSeat(s)) { spotObj.position.set(DOOR.x, .6, 1.6); return {x: DOOR.x, z: .6, face: 0, aim: spotObj.getWorldPosition(V(0, 0, 0)), obj: ['spot', '*']}; }
      spotObj.position.copy(v).setY(.5);
      return {x: v.x, z: 0, face: v.z < 0 ? Math.PI : 0, aim: spotObj.getWorldPosition(V(0, 0, 0)), obj: seats.has(s) ? ['seat', s] : ['spot', '*']};
    }
    if (t === 'passenger') {
      const P = people.get(row.id);
      const s = P ? P.row.seat_no : row.seat_no;
      const on = row.flight_no === FLIGHT && validSeat(s);
      const v = on ? seatSpot(s) : V(DOOR.x, 0, 2.2);
      spotObj.position.copy(v).setY(.9);
      return {x: on ? v.x - .05 : DOOR.x, z: on ? 0 : .6, face: on ? (v.z < 0 ? Math.PI : 0) : 0, aim: spotObj.getWorldPosition(V(0, 0, 0)), obj: P ? ['passenger', row.id] : ['spot', '*']};
    }
    if (t === 'baggage') {
      const B = bags.get(row.tag);
      let wp, x;
      if (B) { wp = B.g.getWorldPosition(V(0, 0, 0)); x = B.g.position.x; }
      else { const r = ownerRow(row.passenger_id); const k = r ? shelfOf(r) : 0; x = k ? (shelfX0(k) + shelfX1(k)) / 2 : DOOR.x; spotObj.position.set(x, k ? BIN_Y + .3 : .6, k ? BIN_Z : 1.6); wp = spotObj.getWorldPosition(V(0, 0, 0)); }
      return {x, z: B || ownerRow(row.passenger_id) ? -.2 : .6, face: B || ownerRow(row.passenger_id) ? Math.PI : 0, aim: wp, obj: B ? ['baggage', row.tag] : ['spot', '*']};
    }
    if (t === 'flight') return {x: LEN0 + 1.0, z: 0, face: -Math.PI / 2, aim: board.getWorldPosition(V(0, 0, 0)), obj: ['flight', '*']};
    return {x: HOME.x, z: 0, face: -Math.PI / 2, aim: V(0, 0, 0), obj: ['spot', '*']};
  }

  // ═══════════════════════════════ вставка одной строки и сверка ══
  async function insertRow(t, row, anim = true) {
    if (t === 'seat') return addSeat(row, anim);
    if (t === 'passenger') return addPerson(row, anim);
    if (t === 'baggage') return addBag(row, anim);
    if (t === 'flight') { flights.set(row.flight_no, row); setBoard([...flights.values()], anim); }
  }
  async function sync(state, anim = true) {
    try { return await sync0(state, anim); } finally { sweepLabels(); }
  }
  async function sync0(state, anim = true) {
    const J = [];
    // снимаем лишнее: багаж → пассажиры → кресла
    const wb = new Set(state.baggage.map(r => r.tag));
    [...bags.keys()].forEach(t => { if (!wb.has(t)) J.push(removeBag(t, anim)); });
    const wp = new Map(state.passenger.map(r => [r.id, r]));
    [...people.keys()].forEach(id => { if (!wp.has(id) || JSON.stringify(people.get(id).row) !== JSON.stringify(wp.get(id))) J.push(removePerson(id, anim)); });
    const ws = new Map(state.seat.map(r => [r.seat_no, r]));
    await Promise.all(J);
    const J2 = [];
    [...seats.keys()].forEach(s => { if (!ws.has(s)) J2.push(removeSeat(s, anim)); });
    ws.forEach((r, s) => { const S = seats.get(s); if (!S || JSON.stringify(S.row) !== JSON.stringify(r)) J2.push(addSeat(r, anim)); });
    setBoard(state.flight);
    await Promise.all(J2);
    const J3 = [];
    wp.forEach((r, id) => { if (!people.has(id)) J3.push(addPerson(r, anim)); });
    await Promise.all(J3);
    state.baggage.forEach(r => { if (!bags.has(r.tag)) J3.push(addBag(r, anim)); });
    await Promise.all(J3);
    const slots = bagSlots(bagRows());
    bags.forEach((B, t) => { const s = slots.get(t); if (s && B.g.position.distanceTo(s) > .01) { if (anim) tween(B.g.position, {x: s.x, y: s.y, z: s.z}, 400); else B.g.position.copy(s); } });
    refreshGhosts();
  }

  // ════════════════════════════════════════════════════════ эффекты ══
  const conf = [];
  function confetti() {
    const cols = [0xffc21a, 0x2f6f73, 0xb5523b, 0x3b4d7a, 0xffffff];
    for (let i = 0; i < 160; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(.12, .07), new THREE.MeshBasicMaterial({color: cols[i % cols.length], side: THREE.DoubleSide}));
      m.position.set(MID + (Math.random() - .5) * LEN + root.position.x, 4 + Math.random() * 2 + root.position.y, (Math.random() - .5) * 5);
      m.userData.v = new THREE.Vector3((Math.random() - .5) * .8, -1.2 - Math.random(), (Math.random() - .5) * .8);
      m.userData.r = new THREE.Vector3(Math.random() * 6, Math.random() * 6, 0);
      scene.add(m); conf.push(m);
    }
    setTimeout(() => conf.splice(0).forEach(m => scene.remove(m)), 4500);
  }
  async function bounce(g, h = .25) { const y0 = g.position.y; await tween(g.position, {y: y0 + h}, 140, 'out'); await tween(g.position, {y: y0}, 200, 'io'); }
  async function takeoff() {
    camS.follow = false; camS.zoom = .55; beamOff();
    await tween(root.position, {x: 18}, 3200, 'in');
    await Promise.all([tween(root.position, {x: 60, y: 10}, 2600, 'in'), tween(root.rotation, {z: .18}, 1800, 'io')]);
  }

  // ═════════════════════════════════════════════════ камера и цикл ══
  let lastW = 0, lastH = 0, lastZ = 0;
  function fit(force) {
    const Wd = stage.clientWidth, H = stage.clientHeight;
    if (force || Wd !== lastW || H !== lastH) { renderer.setSize(Wd, H); labels.setSize(Wd, H); lastW = Wd; lastH = H; lastZ = 0; }
    if (Math.abs(camS.cur - lastZ) > 1e-4) {
      const aspect = Wd / H, h = 7.4 / camS.cur;
      cam.left = -h * aspect; cam.right = h * aspect; cam.top = h; cam.bottom = -h; cam.updateProjectionMatrix(); lastZ = camS.cur;
    }
  }
  window.addEventListener('resize', () => fit(true));
  // качество графики: «высокое» — тени и чёткость, «низкое» — для слабых ПК; автоматически понижается при низком FPS
  const Q = {level: 'high', auto: true, fps: 0};
  try { const v = localStorage.getItem('air-gfx'); if (v === 'high' || v === 'low') { Q.level = v; Q.auto = false; } } catch (e) { /* нет хранилища */ }
  function setQuality(l, user) {
    Q.level = l;
    if (user) { Q.auto = false; try { localStorage.setItem('air-gfx', l); } catch (e) { /* нет */ } }
    const hi = l === 'high';
    renderer.setPixelRatio(hi ? Math.min(1.5, window.devicePixelRatio) : 1);
    renderer.shadowMap.enabled = hi; sun.castShadow = hi; renderer.shadowMap.needsUpdate = true;
    scene.traverse(o => { if (o.material) [].concat(o.material).forEach(m => { m.needsUpdate = true; }); });
    fit(true);
    if (hooks.quality) hooks.quality(l);
  }
  let drag = null;
  const hooks = {pick: null, quality: null};
  renderer.domElement.addEventListener('pointerdown', e => { drag = {x: e.clientX, y: e.clientY, tx: camS.tx, tz: camS.tz, m: false}; });
  window.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) drag.m = true; const k = .018 / camS.cur; camS.tx = drag.tx - (dx * .7 + dy * .9) * k; camS.tz = drag.tz + (dx * .7 - dy * .9) * k; camS.follow = false; });
  window.addEventListener('pointerup', e => { if (drag && !drag.m && hooks.pick) pickAt(e); drag = null; });
  renderer.domElement.addEventListener('wheel', e => { e.preventDefault(); camS.zoom = Math.max(.5, Math.min(2.6, camS.zoom * Math.pow(1.0015, -e.deltaY))); }, {passive: false});
  const ray = new THREE.Raycaster();
  function pickAt(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), cam);
    const hit = ray.intersectObjects(scene.children, true).find(h => h.object.userData.pick);
    hooks.pick(hit ? hit.object.userData.pick : null);
  }
  const clock = new THREE.Clock();
  let nFrame = 0, fpsN = 0, fpsT0 = performance.now(), lowStreak = 0;
  function frame() {
    const dt = Math.min(.05, clock.getDelta()), now = performance.now();
    for (let i = tw.length - 1; i >= 0; i--) {
      const t = tw[i], k = Math.min(1, (now - t.t0) / t.ms), v = EASE[t.ease](k);
      for (const p in t.to) t.o[p] = t.from[p] + (t.to[p] - t.from[p]) * v;
      if (k >= 1) { tw.splice(i, 1); t.res(); }
    }
    if (mixer) mixer.update(dt);
    const f = robotG.userData.face ?? -Math.PI / 2;
    let d = f - robotG.rotation.y; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    robotG.rotation.y += d * Math.min(1, dt * 10);
    if (camS.follow) { const fx = camS.fx ?? robotG.position.x + 1.2, fz = camS.fz ?? robotG.position.z * .5; camS.tx += (fx - camS.tx) * Math.min(1, dt * 2.5); camS.tz += (fz - camS.tz) * dt * 2; }
    const fy = camS.follow && camS.fy != null ? camS.fy : 0;
    camS.cx += (camS.tx + root.position.x * .6 - camS.cx) * Math.min(1, dt * 4); camS.cz += (camS.tz - camS.cz) * Math.min(1, dt * 4);
    camS.cy += (fy + root.position.y * .6 - camS.cy) * Math.min(1, dt * 4);
    const zt = camS.follow ? Math.max(camS.zoom, 1.4) : camS.zoom;
    camS.cur += (zt - camS.cur) * Math.min(1, dt * 3);
    const sh = camS.shakeT && now - camS.shakeT < 500 ? (1 - (now - camS.shakeT) / 500) * .12 : 0;
    const tgt = new THREE.Vector3(camS.cx + (Math.random() - .5) * sh, camS.cy, camS.cz + (Math.random() - .5) * sh);
    cam.position.copy(tgt).add(CAMDIR.clone().multiplyScalar(60)); cam.lookAt(tgt);
    fit();
    conf.forEach(m => { m.position.addScaledVector(m.userData.v, dt * 2); m.rotation.x += m.userData.r.x * dt; m.rotation.y += m.userData.r.y * dt; });
    walkers.forEach(g => { const t = now / 1000 * 9; g.userData.legs.forEach((l, i) => { const ph = Math.sin(t + i * Math.PI); l.hip.rotation.z = ph * .45; l.knee.rotation.z = Math.max(0, -ph) * .6; }); });
    // в покое — реже перерисовываем; тени пересчитываем только когда что-то движется
    nFrame++;
    const moving = tw.length || conf.length || walkers.size || camS.follow || drag || sh || Math.abs(camS.tx + root.position.x * .6 - camS.cx) > .002 || Math.abs(camS.tz - camS.cz) > .002 || Math.abs(zt - camS.cur) > .001;
    if (moving || nFrame % 2 === 0) {
      if (renderer.shadowMap.enabled && (moving || nFrame % 20 === 0)) renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, cam); labels.render(scene, cam);
      if (card) card.element.style.zIndex = '100000';
    }
    // замер FPS и автоматическое понижение качества
    fpsN++; if (now - fpsT0 > 1000) { Q.fps = fpsN * 1000 / (now - fpsT0); fpsN = 0; fpsT0 = now;
      if (Q.auto && Q.level === 'high' && now > 4000) { lowStreak = Q.fps < 30 ? lowStreak + 1 : 0; if (lowStreak >= 3) setQuality('low'); } }
    requestAnimationFrame(frame);
  }

  if (Q.level !== 'high') setTimeout(() => setQuality(Q.level), 0);
  return {
    loadRobot, frame, build, sync, insertRow, locate, robotGo, play, aimBeam, beamOff, chip, removeChip, clearChips, fadeNo, showCard, hideCard, say, clearSay,
    bounce, confetti, takeoff, hooks, camS, root, people, bags, seats, queue, cartBags, robot: robotG, rScreen, HOME, validSeat,
    setSpeed: v => { SPD = v; }, get speed() { return SPD; },
    face: a => { robotG.userData.face = a; },
    focus: v => { if (!v) { camS.fx = camS.fz = camS.fy = null; return; } camS.fx = v.x + .6; camS.fz = v.z * .4; camS.fy = Math.max(0, v.y - .6) * .8; },
    shake: () => { camS.shakeT = performance.now(); },
    clearConfetti: () => { conf.splice(0).forEach(m => scene.remove(m)); },
    home: () => { camS.tx = HOMEC.tx; camS.tz = HOMEC.tz; camS.zoom = 1; camS.follow = false; },
    resetRoot: () => { root.position.set(0, 0, 0); root.rotation.set(0, 0, 0); },
    setQuality, get quality() { return Q.level; }, get fps() { return Q.fps; }, info: () => renderer.info.render,
  };
}
