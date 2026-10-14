// ЛР-14 · 3D-сцена: салон в разрезе, пассажиры, багаж на полках, стойка программ, табло, робот-СУБД.
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {CHAR_GLB, COLORMAP} from './assets.js';
import {ROWS, LET, FLIGHT, rng, seatRow, seatL} from './data.js';

export const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// ════════════════════════════════════════════════════════════ твины ══
const tw = [];
const EASE = {io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out: t => 1 - Math.pow(1 - t, 3), in: t => t * t * t,
  back: t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }, lin: t => t};
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
  const camS = {tx: 2.3, tz: 0, ty: 0, zoom: 1, cx: 2.3, cy: 0, cz: 0, cur: 1, follow: false, shakeT: 0, offX: 0};

  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x9fb2c2, 1.25));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.2);
  sun.position.set(-6, 14, 9); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {left: -13, right: 13, top: 11, bottom: -11, near: 1, far: 50});
  sun.shadow.bias = -.0008;
  scene.add(sun); scene.add(sun.target); sun.target.position.set(3.5, 0, 0);
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
  // разметка перрона
  for (let i = -6; i < 14; i++) { const d = rbox(1.4, .02, .14, .02, 0xf2c230); at(d, i * 2.4, -1.33, 0); d.castShadow = false; scene.add(d); }

  const root = new THREE.Group(); scene.add(root);          // всё, что улетает вместе с самолётом
  const PITCH = 1.12;
  const ZS = {A: -2.0, B: -1.42, C: -.84, D: .84, E: 1.42, F: 2.0};
  const seatX = row => (row - 1) * PITCH;
  const LEN0 = -3.1, LEN1 = seatX(ROWS) + 1.3, MID = (LEN0 + LEN1) / 2, LEN = LEN1 - LEN0;
  const DOOR = {x: LEN0 + 2.3, z: 2.75};

  const hull = rbox(LEN + .5, 1.3, 6.1, .45, 0xfbf8f2); at(hull, MID, -.66, 0); root.add(hull);
  [-1, 1].forEach(s => {
    const st = rbox(LEN + .52, .16, .06, .03, 0xffc21a); at(st, MID, -.45, s * 3.04); root.add(st);
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(3.2, 0); sh.lineTo(4.6, 5.6); sh.lineTo(3.7, 5.6); sh.lineTo(0, 0);
    const wing = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, {depth: .12, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 2}), mat(0xeef0f2));
    wing.castShadow = true; wing.receiveShadow = true; wing.rotation.x = s * Math.PI / 2; wing.position.set(seatX(2.2), -.9, s * 2.95); root.add(wing);
    const eng = rbox(1.5, .6, .6, .28, 0xd8dde1); at(eng, seatX(3.3), -1.1, s * 4.7); root.add(eng);
    const tail = new THREE.Shape(); tail.moveTo(0, 0); tail.lineTo(1.4, 0); tail.lineTo(2.1, 2.0); tail.lineTo(1.5, 2.0); tail.lineTo(0, 0);
    const tg = new THREE.Mesh(new THREE.ExtrudeGeometry(tail, {depth: .1, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 2}), mat(0xeef0f2));
    tg.castShadow = true; tg.rotation.x = s * Math.PI / 2; tg.position.set(LEN1 - 1.5, -.7, s * 2.95); root.add(tg);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(3.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xfbf8f2));
  nose.scale.set(.213, .55, 1); nose.rotation.z = Math.PI / 2; at(nose, LEN0 - .1, -.66, 0); nose.castShadow = true; root.add(nose);
  const floor = rbox(LEN, .12, 5.9, .05, 0xeee8da); at(floor, MID, -.06, 0); root.add(floor);
  const carpet = rbox(LEN - .2, .02, 1.05, .01, 0x4a5684); at(carpet, MID, .01, 0); root.add(carpet);
  for (let i = 0; i < 14; i++) [-.44, .44].forEach(z => { const d = rbox(.16, .021, .04, .01, 0xffc21a, {emissive: 0x332200}); at(d, LEN0 + .6 + i * (LEN - 1.2) / 13, .02, z); root.add(d); });
  const wallFar = rbox(LEN, 2.25, .16, .06, 0xf7f4ee); at(wallFar, MID, 1.07, -2.95); root.add(wallFar);
  const wallNear = rbox(LEN, .42, .16, .06, 0xf7f4ee); at(wallNear, MID, .17, 2.95); root.add(wallNear);
  for (let r = 1; r <= ROWS; r++) { const w = rbox(.42, .46, .04, .14, 0x9fc3d8, {r: .25, emissive: 0x24384a, emissiveIntensity: .25}); at(w, seatX(r) - .1, .8, -2.86); root.add(w); }
  const trim = rbox(LEN, .08, .2, .03, 0xffc21a); at(trim, MID, 2.2, -2.95); root.add(trim);
  const endWall = rbox(.16, 1.55, 5.9, .06, 0xf7f4ee); at(endWall, LEN1, .72, 0); root.add(endWall);
  const galley = rbox(.9, 1.0, 1.5, .08, 0xdcd6c8); at(galley, LEN0 + .55, .5, -2.05); root.add(galley);
  // дверь
  const doorF = rbox(.9, .03, .5, .02, 0xffc21a); at(doorF, DOOR.x, .03, 2.7); root.add(doorF);
  label('выход', 'tag3', root, DOOR.x, .25, 3.05);
  // полки для багажа над рядами (по две строки на полку)
  const BIN_Y = 1.55, BIN_Z = -2.55;
  const binB = rbox(LEN - 1.6, .06, .62, .02, 0xd9d3c4); at(binB, (seatX(1) - .6 + seatX(ROWS) + .6) / 2, BIN_Y, BIN_Z); root.add(binB);
  const binT = rbox(LEN - 1.6, .05, .62, .02, 0xece6d8); at(binT, binB.position.x, BIN_Y + .62, BIN_Z); root.add(binT);
  for (let k = 0; k <= 4; k++) { const x = seatX(2 * k + 1) - .6 + (k === 4 ? 0 : 0); const dv = rbox(.05, .62, .62, .02, 0xcbc4b3); at(dv, k === 4 ? seatX(ROWS) + .6 : x, BIN_Y + .31, BIN_Z); root.add(dv); }
  const shelfX0 = k => seatX(2 * k - 1) - .6, shelfX1 = k => seatX(2 * k) + .6;
  for (let k = 1; k <= 4; k++) label(`полка ${k}`, 'tag3', root, (shelfX0(k) + shelfX1(k)) / 2, BIN_Y + .78, BIN_Z + .2);
  // табло рейсов на перегородке у носа
  const board = rbox(.06, .62, 1.3, .03, 0x27292c); at(board, LEN0 + .06, 1.35, .2); root.add(board);
  const boardLbl = label('', 'board', root, LEN0 + .1, 1.75, .2);
  // стойка программ лояльности
  const stand = rbox(1.6, .5, .5, .06, 0xdcd6c8); at(stand, LEN0 + 1.1, .25, 2.2); root.add(stand);
  const TIERC = {'золото': 0xe0b03a, 'серебро': 0xc7ced6, 'базовая': 0x7fa486};

  // кресла
  for (let row = 1; row <= ROWS; row++) for (const L of LET) {
    const g = new THREE.Group();
    const base = rbox(.5, .16, .5, .06, 0x2f6f73); at(base, 0, .32, 0); g.add(base);
    const back = rbox(.12, .66, .5, .05, 0x265a5e); at(back, .25, .66, 0); g.add(back);
    const head = rbox(.13, .16, .36, .04, 0xece6d6); at(head, .26, .93, 0); g.add(head);
    const leg = rbox(.32, .24, .08, .03, 0x6d747a); at(leg, .02, .12, 0); g.add(leg);
    [-1, 1].forEach(s => { const arm = rbox(.4, .06, .06, .02, 0x3f474d); at(arm, .06, .48, s * .27); g.add(arm); });
    at(g, seatX(row), 0, ZS[L]); root.add(g);
  }
  // статичный салон вместе с креслами — один меш
  {
    root.updateMatrixWorld(true);
    const list = [];
    root.traverse(o => { if (o.isMesh && o !== board && !o.material.transparent) list.push(o); });
    const merged = bakeMeshes(list, o => o.matrixWorld.clone());
    list.forEach(o => o.parent.remove(o));
    root.children.filter(o => o.isGroup && !o.children.length).forEach(o => root.remove(o));
    root.add(merged);
  }
  // подсветка цели — место, куда надо пересадить
  const ghostSeat = rbox(.62, .9, .62, .1, 0xffc21a, {transparent: true, opacity: .35, emissive: 0x6b5000});
  ghostSeat.castShadow = false; ghostSeat.visible = false; root.add(ghostSeat);

  // ═══════════════════════════════════════════════════════ пассажиры ══
  const SHIRT = [0xb5523b, 0x2f6f73, 0xc9952b, 0x3b4d7a, 0x6d7a3a, 0x7a4b6b, 0x4f6d8a, 0xd07a4a, 0x5a8a6f, 0x8a4a4a, 0x5c5470];
  const SKIN = [0xf1c9a5, 0xe0ac84, 0xc68a62, 0xf5d6bc, 0xa8714f];
  const HAIR = [0x2b2420, 0x4a3426, 0x7a5a3a, 0x1d1c1a, 0xb98c5a, 0x8f4a2a];
  const people = new Map(), bags = new Map(), plates = new Map();
  const seatPos = (seat, kid) => new THREE.Vector3(seatX(seatRow(seat)) - .02, kid ? .08 : 0, ZS[seatL(seat)] ?? 0);
  const validSeat = s => seatRow(s) >= 1 && seatRow(s) <= ROWS && ZS[seatL(s)] !== undefined && /^\d+[A-F]$/.test(s);
  function makePerson(p, r) {
    const g = new THREE.Group();
    const shirt = SHIRT[Math.floor(r() * SHIRT.length)], skin = SKIN[Math.floor(r() * SKIN.length)];
    const hair = p.old ? 0xd9d6d0 : HAIR[Math.floor(r() * HAIR.length)];
    const pants = [0x3d4250, 0x2b2f3a, 0x5a4a3a, 0x3b4d5a][Math.floor(r() * 4)];
    const add = (m, x, y, z) => { at(m, x, y, z); g.add(m); return m; };
    add(rbox(.34, .44, .38, .1, shirt), .05, .62, 0);
    add(rbox(.3, .1, .34, .04, pants), .05, .42, 0);
    [-1, 1].forEach(s => { add(rbox(.28, .1, .1, .045, shirt), -.06, .58, s * .23); add(rbox(.08, .08, .08, .03, skin), -.22, .58, s * .23); });
    add(rbox(.3, .3, .3, .1, skin), .02, 1.0, 0);
    add(rbox(.32, p.female ? .2 : .12, .33, .06, hair), .06, p.female ? 1.1 : 1.13, 0);
    if (p.female && !p.kid) add(rbox(.1, .26, .26, .05, hair), .17, .92, 0);
    [-1, 1].forEach(s => add(rbox(.035, .055, .05, .015, 0x1d1c1a), -.13, 1.01, s * .07));
    bakeGroup(g);
    const legs = [-1, 1].map(s => {
      const hip = new THREE.Group(); hip.position.set(.04, .42, s * .09); g.add(hip);
      const th = rbox(.14, .22, .14, .04, pants); th.position.y = -.11; hip.add(th);
      const knee = new THREE.Group(); knee.position.y = -.21; hip.add(knee);
      const sh = rbox(.12, .2, .12, .04, pants); sh.position.y = -.1; knee.add(sh);
      const shoe = rbox(.18, .06, .13, .025, 0x22252b); shoe.position.set(-.03, -.2, 0); knee.add(shoe); bakeGroup(knee);
      return {hip, knee};
    });
    legs.forEach(l => { l.hip.rotation.z = -Math.PI / 2; l.knee.rotation.z = Math.PI / 2; });
    g.updateMatrixWorld(true);
    { const inv = g.matrixWorld.clone().invert(), lm = [];
      legs.forEach(l => l.hip.traverse(o => { if (o.isMesh) lm.push(o); }));
      const sitMesh = bakeMeshes(lm, m => inv.clone().multiply(m.matrixWorld)); g.add(sitMesh); legs.sitMesh = sitMesh; }
    g.traverse(o => { if (o.isMesh) o.material = o.material.clone(); });
    const sc = p.kid ? .66 : 1;
    g.scale.setScalar(sc);
    g.userData = {id: p.id, s: sc, kid: p.kid, legs};
    g.traverse(o => { if (o.isMesh) o.userData.pick = {t: 'passenger', k: p.id}; });
    setPose(g, 'sit');
    return g;
  }
  function setPose(g, pose) {
    const L = g.userData.legs; if (!L) return;
    L.forEach(l => { l.hip.rotation.z = 0; l.knee.rotation.z = 0; l.hip.visible = pose !== 'sit'; });
    if (L.sitMesh) L.sitMesh.visible = pose === 'sit';
  }
  const walkers = new Set();

  function badgeMesh(tier) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .035, 20), mat(TIERC[tier] || 0x888888, {r: .35, metalness: tier === 'базовая' ? 0 : .35}));
    m.rotation.z = Math.PI / 2; m.position.set(-.13, .7, .09); m.castShadow = true; return m;
  }
  const MEALC = {'детское': 0xffc21a, 'стандарт': 0x8a9096, 'вегетарианское': 0x5aa86e, 'ресторан': 0xb5523b};
  function trayMesh(meal) {
    const g = new THREE.Group();
    g.add(rbox(.3, .035, .36, .015, 0xfbf8f2));
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .02, 20), mat(0xffffff)); at(plate, 0, .03, -.05); g.add(plate);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.085, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(MEALC[meal] || 0x6b4f9a, {r: .45})); at(dome, 0, .04, -.05); dome.castShadow = true; g.add(dome);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(.04, .035, .08, 12), mat(0xffffff)); at(cup, .02, .06, .11); g.add(cup);
    return bakeGroup(g);
  }
  function setGhost(P, on) {
    P.g.traverse(o => { if (o.isMesh && o.material) { o.material.transparent = on; o.material.opacity = on ? .3 : 1; o.material.depthWrite = !on; } });
    P.ghost = on;
  }
  function placePerson(P, anim) {
    const row = P.row;
    const target = validSeat(row.seat) ? seatPos(row.seat, P.g.userData.kid) : wingSpot(row.id);
    if (!anim) { P.g.position.copy(target); P.g.rotation.y = validSeat(row.seat) ? 0 : Math.PI / 2; setPose(P.g, validSeat(row.seat) ? 'sit' : 'stand'); }
    return target;
  }
  const wingSpot = id => new THREE.Vector3(seatX(3) + (id % 4) * .5, -.75, 3.6 + (id % 3) * .45);
  function attachTray(P, meal, anim) {
    if (P.tray) { P.g.parent.remove(P.tray); P.tray = null; }
    if (!meal) return;
    const t = trayMesh(meal);
    P.tray = t;
    const k = P.g.userData.kid;
    t.position.set(-.32 / P.g.userData.s, (k ? .5 : .56) / P.g.userData.s - (k ? .08 / P.g.userData.s : 0), 0);
    t.scale.setScalar(1 / P.g.userData.s);
    P.g.add(t);
    if (anim) { const s0 = t.scale.x; t.scale.setScalar(.01); tween(t.scale, {x: s0, y: s0, z: s0}, 380, 'back'); }
  }
  function attachBadge(P, tier, anim) {
    if (P.badge) {
      const b = P.badge; P.badge = null;
      if (anim) { tween(b.position, {y: b.position.y + .8}, 500, 'out'); tween(b.scale, {x: .01, y: .01, z: .01}, 500, 'in').then(() => P.g.remove(b)); }
      else P.g.remove(b);
    }
    if (!tier) return;
    const b = badgeMesh(tier); P.badge = b; P.g.add(b);
    if (anim) { b.scale.setScalar(.01); tween(b.scale, {x: 1, y: 1, z: 1}, 360, 'back'); }
  }

  // ═════════════════════════════════════════════════════════ багаж ══
  const bagSize = w => ({w: .24 + w * .006, h: .2 + w * .007, d: .34});
  const BAGC = [0x8a6f4c, 0x6d4f3a, 0x4f6d8a, 0x9a3b2a, 0x5a6a3a, 0x3d4250];
  function makeBag(b) {
    const s = bagSize(b.weight_kg);
    const g = new THREE.Group();
    const body = rbox(s.w, s.h, s.d, .05, BAGC[parseInt(b.tag.slice(1), 10) % BAGC.length]); g.add(body);
    const handle = rbox(.12, .04, .04, .015, 0x22252b); at(handle, 0, s.h / 2 + .02, 0); g.add(handle);
    bakeGroup(g);
    g.userData = {tag: b.tag};
    g.traverse(o => { if (o.isMesh) o.userData.pick = {t: 'baggage', k: b.tag}; });
    return g;
  }
  function bagSlots(rows) {                      // позиции на полках в порядке хранения
    const pos = new Map(), by = {};
    rows.forEach(b => { (by[b.shelf] = by[b.shelf] || []).push(b); });
    for (const k in by) by[k].forEach((b, i) => {
      const s = bagSize(b.weight_kg), sh = Math.min(4, Math.max(1, +k));
      const per = 6, col = i % per, lay = Math.floor(i / per);
      pos.set(b.tag, new THREE.Vector3(shelfX0(sh) + .3 + col * .38, BIN_Y + .03 + s.h / 2 + lay * .3, BIN_Z + .02));
    });
    return pos;
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
    // по проходу: сначала к оси прохода, потом вдоль, потом в сторону
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
  function aimBeam(worldPoint) {
    const a = new THREE.Vector3(robotG.position.x, 1.25, robotG.position.z), b = worldPoint.clone();
    const d = b.clone().sub(a), L = d.length();
    beam.scale.set(1, L, 1); beam.position.copy(a).add(d.clone().multiplyScalar(.5));
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.normalize());
    beam.material.opacity = .28;
  }
  const beamOff = () => { beam.material.opacity = 0; };

  // ═════════════════════════════════════════════ состояние сцены ══
  let model = {passenger: new Map(), baggage: new Map(), loyalty: new Map(), flight: new Map()};
  let seedR = rng(1);
  function boardHtml() {
    return [...model.flight.values()].map(f => `<div class="${f.flight_no === FLIGHT ? 'on' : ''}"><b>${esc(f.flight_no)}</b> ${esc(f.dest)}</div>`).join('') || '<div>— пусто —</div>';
  }
  let metaMap = null;
  function build(state, seed, meta) {
    metaMap = meta || null;
    seedR = rng(seed * 31 + 5);
    people.forEach(P => { dispose(P.g); P.g.parent && P.g.parent.remove(P.g); }); people.clear();
    bags.forEach(B => { dispose(B.g); B.g.parent && B.g.parent.remove(B.g); }); bags.clear();
    plates.forEach(L => { dispose(L.g); L.g.parent && L.g.parent.remove(L.g); }); plates.clear();
    clearChips(); hideCard(); clearSay();
    model = {passenger: new Map(), baggage: new Map(), loyalty: new Map(), flight: new Map()};
    state.passenger.forEach(row => addPerson(row));
    const slots = bagSlots(state.baggage);
    state.baggage.forEach(row => { const g = makeBag(row); g.position.copy(slots.get(row.tag)); root.add(g); bags.set(row.tag, {g, row}); model.baggage.set(row.tag, row); });
    ['золото', 'серебро', 'базовая'].forEach((t, i) => {
      const g = new THREE.Group();
      const plate = rbox(.06, .46, .34, .04, TIERC[t], {r: .4, metalness: t === 'базовая' ? 0 : .3}); g.add(plate);
      g.position.set(LEN0 + .55 + i * .55, .76, 2.2);
      g.traverse(o => { if (o.isMesh) o.userData.pick = {t: 'loyalty', k: t}; });
      const lb = label(t, 'tag3', g, 0, .36, 0);
      plates.set(t, {g, lb, alive: false});
    });
    state.loyalty.forEach(row => { const L = plates.get(row.tier); if (L) { root.add(L.g); L.alive = true; } model.loyalty.set(row.tier, row); });
    state.flight.forEach(row => model.flight.set(row.flight_no, row));
    boardLbl.element.innerHTML = boardHtml();
    robotG.position.set(HOME.x, 0, HOME.z); robotG.userData.face = -Math.PI / 2; beamOff(); play('idle');
    ghostSeat.visible = false;
    sweepLabels();
  }
  function addPerson(row) {
    const mt = (metaMap && metaMap.get(row.id)) || {kid: row.birth_year !== null && row.birth_year >= 2009, female: /а\s/.test(row.full_name), old: row.birth_year !== null && row.birth_year < 1960};
    const P = {g: makePerson({...row, ...mt}, seedR), row: {...row}, tray: null, badge: null, ghost: false};
    root.add(P.g); people.set(row.id, P); model.passenger.set(row.id, row);
    placePerson(P, false);
    attachTray(P, row.meal, false); attachBadge(P, row.loyalty, false);
    if (row.active === false) setGhost(P, true);
    return P;
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
    if (t === 'loyalty') { const L = plates.get(k); return L && L.g; }
    if (t === 'flight') return board;
    return null;
  }
  const chipH = (t, o) => t === 'passenger' ? 1.45 / o.userData.s : t === 'baggage' ? .42 : t === 'loyalty' ? .55 : .5;
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
    obj.traverse(o => { if (o.isCSS2DObject) o.element.remove(); });
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
    const P = people.get(id); if (!P) return;
    const s = label(`<span>${esc(text)}</span>`, 'say', P.g, 0, 1.75 / P.g.userData.s, 0);
    says.push(s);
    if (ms) setTimeout(() => { s.parent && s.parent.remove(s); s.element.remove(); }, ms);
  }
  function clearSay() { says.splice(0).forEach(s => { s.parent && s.parent.remove(s); s.element.remove(); }); }

  // ═══════════════════════════════════════ где стоять роботу у строки ══
  function locate(t, row) {
    if (t === 'passenger') {
      const P = people.get(row.id);
      const s = P ? P.row.seat : row.seat;
      const x = validSeat(s) ? seatX(seatRow(s)) - .05 : seatX(3);
      const zf = validSeat(s) ? ZS[seatL(s)] : 3;
      const wp = P ? P.g.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3();
      if (P) wp.y += .9 * P.g.userData.s;
      return {x, z: 0, face: zf < 0 ? Math.PI : 0, aim: wp};
    }
    if (t === 'baggage') { const B = bags.get(row.tag); const wp = B ? B.g.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(); return {x: B ? B.g.position.x : 0, z: -.2, face: Math.PI, aim: wp}; }
    if (t === 'loyalty') { const L = plates.get(row.tier); const wp = L ? L.g.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(); return {x: L ? L.g.position.x : LEN0 + 1.1, z: 1.2, face: 0, aim: wp}; }
    if (t === 'flight') return {x: LEN0 + 1.0, z: 0, face: -Math.PI / 2, aim: board.getWorldPosition(new THREE.Vector3())};
    return {x: HOME.x, z: 0, face: -Math.PI / 2, aim: new THREE.Vector3()};
  }

  // ═══════════════════════════════════ применить изменение строки ══
  async function walkPerson(P, to, leave) {
    const g = P.g, p = g.position;
    const path = [];
    path.push(new THREE.Vector3(p.x, p.y, Math.sign(p.z || 1) * .3));
    if (leave) { path.push(new THREE.Vector3(DOOR.x, p.y, .3)); path.push(new THREE.Vector3(DOOR.x, p.y, 2.75)); }
    else if (to.y < -.5) { path.push(new THREE.Vector3(to.x, p.y, .3)); path.push(to.clone()); }
    else { path.push(new THREE.Vector3(to.x, p.y, Math.sign(to.z) * .3)); path.push(to.clone()); }
    setPose(g, 'stand'); walkers.add(g);
    for (const q of path) {
      const dx = q.x - p.x, dz = q.z - p.z, d = Math.hypot(dx, dz) + Math.abs(q.y - p.y);
      if (d < .01) continue;
      g.rotation.y = Math.atan2(dz, -dx);
      await tween(p, {x: q.x, y: q.y, z: q.z}, d / 2.4 * 1000 / Math.min(SPD, 4), 'lin');
    }
    walkers.delete(g);
    g.rotation.y = leave ? 0 : to.y < -.5 ? Math.PI / 2 : 0;
    setPose(g, leave || to.y < -.5 ? 'stand' : 'sit');
  }
  async function applyPassenger(id, nv, anim) {
    let P = people.get(id);
    if (!P && nv) { P = addPerson(nv); if (anim) { P.g.scale.setScalar(.01); await tween(P.g.scale, {x: P.g.userData.s, y: P.g.userData.s, z: P.g.userData.s}, 300, 'back'); } return; }
    if (!P) return;
    if (!nv) {                                              // удалён
      people.delete(id); model.passenger.delete(id);
      if (anim) { say(id, 'До свидания…', 1500); await walkPerson(P, null, true); await tween(P.g.scale, {x: .01, y: .01, z: .01}, 260, 'in'); }
      dispose(P.g); P.g.parent && P.g.parent.remove(P.g);
      return;
    }
    const old = P.row; P.row = {...nv}; model.passenger.set(id, nv);
    const jobs = [];
    if (old.seat !== nv.seat) { const to = placePerson(P, true); jobs.push(anim ? walkPerson(P, to) : Promise.resolve(P.g.position.copy(to))); if (!validSeat(nv.seat) && anim) setTimeout(() => say(id, 'А где моё кресло?!', 2600), 1200); }
    if (old.meal !== nv.meal) attachTray(P, nv.meal, anim);
    if (old.loyalty !== nv.loyalty) attachBadge(P, nv.loyalty, anim);
    if (old.active !== nv.active) setGhost(P, nv.active === false);
    if (anim && (old.birth_year !== nv.birth_year || old.full_name !== nv.full_name || old.city !== nv.city)) say(id, 'Мои данные поменялись', 1500);
    await Promise.all(jobs);
  }
  async function applyBag(tag, nv, anim, all) {
    const B = bags.get(tag);
    if (!B && nv) { const g = makeBag(nv); root.add(g); bags.set(tag, {g, row: nv}); model.baggage.set(tag, nv); const pos = bagSlots(all).get(tag); g.position.copy(pos); if (anim) { g.scale.setScalar(.01); await tween(g.scale, {x: 1, y: 1, z: 1}, 300, 'back'); } return; }
    if (!B) return;
    if (!nv) {
      bags.delete(tag); model.baggage.delete(tag);
      if (anim) { const p = B.g.position; await tween(p, {y: p.y + .6, z: p.z + 1.2}, 260, 'out'); await tween(p, {x: p.x - 2.5, y: -1.3, z: 4.5}, 700, 'in'); }
      dispose(B.g); B.g.parent && B.g.parent.remove(B.g);
      return;
    }
    const old = B.row; B.row = {...nv}; model.baggage.set(tag, nv);
    if (old.weight_kg !== nv.weight_kg) {
      const s0 = bagSize(old.weight_kg), s1 = bagSize(nv.weight_kg);
      const g = makeBag(nv); g.position.copy(B.g.position); g.position.y += (s1.h - s0.h) / 2;
      root.remove(B.g); root.add(g); B.g = g;
      if (anim) { g.scale.setScalar(1.35); tween(g.scale, {x: 1, y: 1, z: 1}, 420, 'back'); }
    }
  }
  async function applyLoyalty(tier, nv, anim) {
    const L = plates.get(tier); if (!L) return;
    if (!nv && L.alive) { L.alive = false; model.loyalty.delete(tier); if (anim) { await tween(L.g.rotation, {z: -1.4}, 380, 'in'); await tween(L.g.position, {y: -1.3}, 400, 'in'); } dispose(L.g); root.remove(L.g); L.g.rotation.z = 0; L.g.position.y = .76; }
    else if (nv && !L.alive) { L.alive = true; model.loyalty.set(tier, nv); if (!L.g.children.some(o => o.isCSS2DObject)) L.lb = label(tier, 'tag3', L.g, 0, .36, 0); root.add(L.g); }
  }
  // привести сцену к состоянию базы (с анимацией)
  async function sync(state, anim = true) {
    try { return await sync0(state, anim); } finally { sweepLabels(); }
  }
  async function sync0(state, anim = true) {
    const jobs = [];
    const want = new Map(state.passenger.map(r => [r.id, r]));
    [...people.keys()].forEach(id => { if (!want.has(id)) jobs.push(applyPassenger(id, null, anim)); });
    want.forEach((r, id) => { const P = people.get(id); if (!P || JSON.stringify(P.row) !== JSON.stringify(r)) jobs.push(applyPassenger(id, r, anim)); });
    const wb = new Map(state.baggage.map(r => [r.tag, r]));
    [...bags.keys()].forEach(t => { if (!wb.has(t)) jobs.push(sleep(Math.random() * 200).then(() => applyBag(t, null, anim))); });
    wb.forEach((r, t) => { const B = bags.get(t); if (!B || JSON.stringify(B.row) !== JSON.stringify(r)) jobs.push(applyBag(t, r, anim, state.baggage)); });
    const wl = new Set(state.loyalty.map(r => r.tier));
    plates.forEach((L, t) => { if (L.alive !== wl.has(t)) jobs.push(applyLoyalty(t, wl.has(t) ? {tier: t} : null, anim)); });
    model.flight = new Map(state.flight.map(r => [r.flight_no, r])); boardLbl.element.innerHTML = boardHtml();
    await Promise.all(jobs);
    // перерасстановка чемоданов на полках
    const slots = bagSlots(state.baggage);
    bags.forEach((B, t) => { const s = slots.get(t); if (s && B.g.position.distanceTo(s) > .01) { if (anim) tween(B.g.position, {x: s.x, y: s.y, z: s.z}, 400); else B.g.position.copy(s); } });
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
  async function bounce(id, h = .25) {
    const P = people.get(id); if (!P) return;
    const y0 = P.g.position.y;
    await tween(P.g.position, {y: y0 + h}, 140, 'out'); await tween(P.g.position, {y: y0}, 200, 'io');
  }
  async function takeoff() {
    camS.follow = false;
    camS.zoom = .55;
    beamOff();
    await tween(root.position, {x: 18}, 3200, 'in');
    await Promise.all([tween(root.position, {x: 60, y: 10}, 2600, 'in'), tween(root.rotation, {z: .18}, 1800, 'io')]);
  }

  // ═════════════════════════════════════════════════ камера и цикл ══
  let lastW = 0, lastH = 0, lastZ = 0;
  function fit(force) {
    const Wd = stage.clientWidth, H = stage.clientHeight;
    if (force || Wd !== lastW || H !== lastH) { renderer.setSize(Wd, H); labels.setSize(Wd, H); lastW = Wd; lastH = H; lastZ = 0; }
    if (Math.abs(camS.cur - lastZ) > 1e-4) {
      const aspect = Wd / H, h = 6.8 / camS.cur;
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
    const hit = ray.intersectObjects(root.children, true).find(h => h.object.userData.pick);
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
    const zt = camS.follow ? Math.max(camS.zoom, 1.45) : camS.zoom;
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
    loadRobot, frame, build, sync, locate, robotGo, play, aimBeam, beamOff, chip, removeChip, clearChips, fadeNo, showCard, hideCard, say, clearSay,
    applyPassenger, applyBag, applyLoyalty, bounce, confetti, takeoff, hooks, camS, root, ghostSeat, seatPos, people, bags, plates, model,
    robot: robotG, rScreen, HOME, LEN0, validSeat,
    setSpeed: v => { SPD = v; }, get speed() { return SPD; },
    face: a => { robotG.userData.face = a; },
    focus: v => { if (!v) { camS.fx = camS.fz = camS.fy = null; return; } camS.fx = v.x + .6; camS.fz = v.z * .4; camS.fy = Math.max(0, v.y - .6) * .8; },
    shake: () => { camS.shakeT = performance.now(); },
    clearConfetti: () => { conf.splice(0).forEach(m => scene.remove(m)); },
    home: () => { camS.tx = 2.3; camS.tz = 0; camS.zoom = 1; camS.follow = false; },
    resetRoot: () => { root.position.set(0, 0, 0); root.rotation.set(0, 0, 0); },
    setQuality, get quality() { return Q.level; }, get fps() { return Q.fps; }, info: () => renderer.info.render,
  };
}
