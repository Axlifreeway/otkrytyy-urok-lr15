// ЛР-14 · проба: «Бортпитание». Один запрос — UPDATE … WHERE — и робот-СУБД,
// который обходит строки таблицы и решает по каждой.
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {CHAR_GLB, COLORMAP} from './assets.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════════ данные ══
const ROWS = 8, LET = ['A', 'B', 'C', 'D', 'E', 'F'];
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const SURN = ['Иванов', 'Петров', 'Смирнов', 'Кузнецов', 'Попов', 'Соколов', 'Лебедев', 'Козлов', 'Новиков', 'Морозов', 'Волков', 'Егоров', 'Павлов', 'Орлов', 'Макаров', 'Титов', 'Зуев', 'Фомин', 'Котов', 'Быков', 'Панов', 'Савин', 'Лукин', 'Рябов', 'Громов', 'Жуков'];
function makeData(seed) {
  const r = rng(seed * 7919 + 41);
  const pick = a => a[Math.floor(r() * a.length)];
  const seats = [];
  for (let row = 1; row <= ROWS; row++) for (const L of LET) seats.push(row + L);
  const P = [];
  let id = 1;
  const kidsAt = new Set(), nullAt = new Set();
  // 7 детей (один — ровно 2012), 1 ребёнок и 1 взрослый без года рождения
  while (kidsAt.size < 8) kidsAt.add(Math.floor(r() * seats.length));
  const kidList = [...kidsAt];
  nullAt.add(kidList[7]);
  let adultNull; do adultNull = Math.floor(r() * seats.length); while (kidsAt.has(adultNull)); nullAt.add(adultNull);
  seats.forEach((s, i) => {
    if (!kidsAt.has(i) && i !== adultNull && r() < .2) return;          // свободное место
    const kid = kidsAt.has(i);
    const by = nullAt.has(i) ? null : kid ? (i === kidList[0] ? 2012 : 2013 + Math.floor(r() * 8)) : (r() < .15 ? 1944 + Math.floor(r() * 15) : 1965 + Math.floor(r() * 40));
    const f = r() < .5;
    P.push({id: id++, seat: s, full_name: `${pick(SURN)}${f ? 'а' : ''} ${'АБВГДЕИКЛМНОПРСТ'[Math.floor(r() * 16)]}.`, birth_year: by,
      fare_class: 'эконом', meal: null, kid, female: f, old: by != null && by < 1960});
  });
  return P;
}
const SCHEMA = `CREATE TABLE passenger (
  id         integer     PRIMARY KEY,
  seat       varchar(3)  NOT NULL,
  full_name  varchar(60) NOT NULL,
  birth_year integer,
  fare_class varchar(10) NOT NULL,
  meal       varchar(20) CONSTRAINT ck_passenger_meal
             CHECK (meal IN ('стандарт', 'детское', 'вегетарианское', 'ресторан'))
);`;
const lit = v => v === null ? 'NULL' : typeof v === 'number' ? String(v) : "'" + String(v).replace(/'/g, "''") + "'";
const COLS = ['id', 'seat', 'full_name', 'birth_year', 'fare_class', 'meal'];

// ═════════════════════════════════════════════════════════════ сцена ══
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
$('stage').appendChild(renderer.domElement);
const labels = new CSS2DRenderer();
labels.domElement.className = 'labels';
$('stage').appendChild(labels.domElement);

const scene = new THREE.Scene();
const cam = new THREE.OrthographicCamera(-10, 10, 6, -6, .1, 200);
const camState = {tx: 2.6, ty: 0, tz: 0, zoom: 1, ax: 9, ay: 0, cx: 3.2, cy: 0, cz: 0, curZoom: 1};
const CAMDIR = new THREE.Vector3(1.05, 1.25, 1.35).normalize();

scene.add(new THREE.HemisphereLight(0xfff4e2, 0x9fb2c2, 1.25));
const sun = new THREE.DirectionalLight(0xfff0d8, 2.2);
sun.position.set(-6, 14, 9);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, {left: -12, right: 12, top: 10, bottom: -10, near: 1, far: 40});
sun.shadow.radius = 4; sun.shadow.bias = -.0006;
scene.add(sun); scene.add(sun.target); sun.target.position.set(3.5, 0, 0);
const fill = new THREE.DirectionalLight(0xd8e6ff, .5); fill.position.set(10, 6, -8); scene.add(fill);

const mat = (c, o = {}) => new THREE.MeshStandardMaterial({color: c, roughness: o.r ?? .78, metalness: 0, ...o});
const rbox = (w, h, d, r, c, o) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001)), typeof c === 'object' ? c : mat(c, o)); m.castShadow = true; m.receiveShadow = true; return m; };
const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };

// геометрия салона: нос — в сторону −X
const PITCH = 1.12, X0 = 0;
const ZS = {A: -2.0, B: -1.42, C: -.84, D: .84, E: 1.42, F: 2.0};
const seatX = row => X0 + (row - 1) * PITCH;
const LEN0 = -2.9, LEN1 = seatX(ROWS) + 1.3;
const MID = (LEN0 + LEN1) / 2, LEN = LEN1 - LEN0;

// земля, корпус, крылья
const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), mat(0xdcd6c9, {r: 1}));
ground.rotation.x = -Math.PI / 2; ground.position.y = -1.35; ground.receiveShadow = true; scene.add(ground);
const hull = rbox(LEN + .5, 1.3, 6.1, .45, 0xfbf8f2); at(hull, MID, -.66, 0); scene.add(hull);
[-1, 1].forEach(s => {
  const st = rbox(LEN + .52, .16, .06, .03, 0xffc21a); at(st, MID, -.45, s * 3.04); scene.add(st);
  const sh = new THREE.Shape();
  sh.moveTo(0, 0); sh.lineTo(3.2, 0); sh.lineTo(4.6, 5.6); sh.lineTo(3.7, 5.6); sh.lineTo(0, 0);
  const wg = new THREE.ExtrudeGeometry(sh, {depth: .12, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 2});
  const wing = new THREE.Mesh(wg, mat(0xeef0f2)); wing.castShadow = true; wing.receiveShadow = true;
  wing.rotation.x = s * Math.PI / 2; wing.position.set(seatX(2.2), -.9, s * 2.95); scene.add(wing);
  const eng = rbox(1.5, .6, .6, .28, 0xd8dde1); at(eng, seatX(3.3), -1.1, s * 4.7); scene.add(eng);
  const tail = new THREE.Shape(); tail.moveTo(0, 0); tail.lineTo(1.4, 0); tail.lineTo(2.1, 2.0); tail.lineTo(1.5, 2.0); tail.lineTo(0, 0);
  const tg = new THREE.Mesh(new THREE.ExtrudeGeometry(tail, {depth: .1, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 2}), mat(0xeef0f2));
  tg.castShadow = true; tg.rotation.x = s * Math.PI / 2; tg.position.set(LEN1 - 1.5, -.7, s * 2.95); scene.add(tg);
});
const nose = new THREE.Mesh(new THREE.SphereGeometry(3.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xfbf8f2)); nose.scale.set(.213, .55, 1); nose.rotation.z = Math.PI / 2; at(nose, LEN0 - .1, -.66, 0); nose.castShadow = true; scene.add(nose);
// пол и проход
const floor = rbox(LEN, .12, 5.9, .05, 0xeee8da); at(floor, MID, -.06, 0); scene.add(floor);
const carpet = rbox(LEN - .2, .02, 1.05, .01, 0x4a5684); at(carpet, MID, .01, 0); scene.add(carpet);
for (let i = 0; i < 12; i++) { const d = rbox(.16, .021, .04, .01, 0xffc21a, {emissive: 0x332200}); at(d, LEN0 + .6 + i * (LEN - 1.2) / 11, .02, .44); scene.add(d); const d2 = d.clone(); d2.position.z = -.44; scene.add(d2); }
// стены с иллюминаторами (дальняя стена — выше, ближняя — низкий срез)
const wallFar = rbox(LEN, 1.55, .16, .06, 0xf7f4ee); at(wallFar, MID, .72, -2.95); scene.add(wallFar);
const wallNear = rbox(LEN, .42, .16, .06, 0xf7f4ee); at(wallNear, MID, .17, 2.95); scene.add(wallNear);
for (let r = 1; r <= ROWS; r++) {
  const w = rbox(.42, .5, .04, .14, 0x9fc3d8, {r: .25, emissive: 0x24384a, emissiveIntensity: .25}); at(w, seatX(r) - .1, .85, -2.86); scene.add(w);
}
const trim = rbox(LEN, .08, .2, .03, 0xffc21a); at(trim, MID, 1.5, -2.95); scene.add(trim);
const endWall = rbox(.16, 1.55, 5.9, .06, 0xf7f4ee); at(endWall, LEN1, .72, 0); scene.add(endWall);
// кухня у носа
const galley = rbox(.9, 1.0, 1.7, .08, 0xdcd6c8); at(galley, LEN0 + .55, .5, -1.9); scene.add(galley);
const cart = rbox(.5, .7, .4, .06, 0xb9c0c8); at(cart, LEN0 + .5, .35, 1.6); scene.add(cart);
const sign = rbox(.06, .34, 1.1, .03, 0x27292c); at(sign, LEN0 + .02, 1.25, 0); scene.add(sign);

// кресла
const SEAT_C = 0x2f6f73, SEAT_D = 0x265a5e, HEAD_C = 0xece6d6;
const seats = {};
for (let row = 1; row <= ROWS; row++) for (const L of LET) {
  const g = new THREE.Group();
  const base = rbox(.5, .16, .5, .06, SEAT_C); at(base, 0, .32, 0); g.add(base);
  const back = rbox(.12, .66, .5, .05, SEAT_D); at(back, .25, .66, 0); g.add(back);
  const head = rbox(.13, .16, .36, .04, HEAD_C); at(head, .26, .93, 0); g.add(head);
  const leg = rbox(.32, .24, .08, .03, 0x6d747a); at(leg, .02, .12, 0); g.add(leg);
  [-1, 1].forEach(s => { const arm = rbox(.4, .06, .06, .02, 0x3f474d); at(arm, .06, .48, s * .27); g.add(arm); });
  at(g, seatX(row), 0, ZS[L]);
  scene.add(g); seats[row + L] = g;
}

// пассажиры — собраны из простых форм
const SHIRT = [0xb5523b, 0x2f6f73, 0xc9952b, 0x3b4d7a, 0x6d7a3a, 0x7a4b6b, 0x4f6d8a, 0xd07a4a, 0x5a8a6f, 0x8a4a4a, 0x5c5470];
const SKIN = [0xf1c9a5, 0xe0ac84, 0xc68a62, 0xf5d6bc, 0xa8714f];
const HAIR = [0x2b2420, 0x4a3426, 0x7a5a3a, 0x1d1c1a, 0xb98c5a, 0x8f4a2a];
function person(p, r) {
  const g = new THREE.Group();
  const shirt = SHIRT[Math.floor(r() * SHIRT.length)], skin = SKIN[Math.floor(r() * SKIN.length)];
  const hair = p.old ? 0xd9d6d0 : HAIR[Math.floor(r() * HAIR.length)];
  const body = rbox(.34, .44, .38, .1, shirt); at(body, .05, .62, 0); g.add(body);
  const legs = rbox(.38, .14, .3, .06, 0x3d4250); at(legs, -.14, .45, 0); g.add(legs);
  [-1, 1].forEach(s => { const a = rbox(.28, .1, .1, .045, shirt); at(a, -.06, .58, s * .23); g.add(a); const h = rbox(.08, .08, .08, .03, skin); at(h, -.22, .58, s * .23); g.add(h); });
  const head = rbox(.3, .3, .3, .1, skin); at(head, .02, 1.0, 0); g.add(head);
  const hairM = rbox(.32, p.female ? .2 : .12, .33, .06, hair); at(hairM, .06, p.female ? 1.1 : 1.13, 0); g.add(hairM);
  if (p.female && !p.kid) { const tail = rbox(.1, .26, .26, .05, hair); at(tail, .17, .92, 0); g.add(tail); }
  [-1, 1].forEach(s => { const e = rbox(.035, .055, .05, .015, 0x1d1c1a); at(e, -.13, 1.01, s * .07); g.add(e); });
  const s = p.kid ? .66 : 1;
  g.scale.setScalar(s);
  g.position.set(seatX(parseInt(p.seat, 10)) - .02, p.kid ? .08 : 0, ZS[p.seat.slice(-1)]);
  g.userData.p = p; g.userData.base = g.position.clone(); g.userData.s = s;
  g.traverse(o => { if (o.isMesh) o.userData.pid = p.id; });
  return g;
}
// поднос
const MEALC = {'детское': 0xffc21a, 'стандарт': 0x8a9096, 'вегетарианское': 0x5aa86e, 'ресторан': 0xb5523b};
function tray(meal) {
  const g = new THREE.Group();
  const t = rbox(.3, .035, .36, .015, 0xfbf8f2); g.add(t);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .02, 20), mat(0xffffff)); at(plate, 0, .03, -.05); g.add(plate);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(.085, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(MEALC[meal] || 0x6b4f9a, {r: .45})); at(dome, 0, .04, -.05); dome.castShadow = true; g.add(dome);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(.04, .035, .08, 12), mat(0xffffff)); at(cup, .02, .06, .11); cup.castShadow = true; g.add(cup);
  return g;
}

// ════════════════════════════════════════════════════════ робот-СУБД ══
let robot = null, mixer = null, acts = {}, curAct = null;
const robotG = new THREE.Group(); scene.add(robotG);
robotG.position.set(LEN0 + 1.2, 0, 0);
const beam = new THREE.Mesh(new THREE.CylinderGeometry(.02, .32, 1, 16, 1, true), new THREE.MeshBasicMaterial({color: 0xffd34d, transparent: true, opacity: .0, depthWrite: false, side: THREE.DoubleSide}));
scene.add(beam);
async function loadRobot() {
  const bin = Uint8Array.from(atob(CHAR_GLB), c => c.charCodeAt(0));
  const mgr = new THREE.LoadingManager();
  mgr.setURLModifier(u => /colormap\.png$/.test(u) ? COLORMAP : u);
  const gltf = await new Promise((res, rej) => new GLTFLoader(mgr).parse(bin.buffer, '', res, rej));
  robot = gltf.scene;
  robot.scale.setScalar(1.25);
  robot.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  robotG.add(robot);
  mixer = new THREE.AnimationMixer(robot);
  gltf.animations.forEach(a => { acts[a.name] = mixer.clipAction(a); });
  play('idle');
}
function play(name, once) {
  const a = acts[name];
  if (!a || curAct === a) return;
  a.reset(); a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat); a.clampWhenFinished = !!once; a.play();
  if (curAct) curAct.crossFadeTo(a, .18, false);
  curAct = a;
}
// экран над роботом
const rScreenEl = document.createElement('div'); rScreenEl.className = 'rscreen'; rScreenEl.innerHTML = '<b>СУБД</b><span>жду команду</span>';
const rScreen = new CSS2DObject(rScreenEl); rScreen.position.set(0, 1.75, 0); robotG.add(rScreen);
function screen(t, s) { rScreenEl.innerHTML = `<b>${t}</b>${s ? `<span>${s}</span>` : ''}`; }
function cmdBar(html) { $('cmd').innerHTML = html || ''; $('cmd').hidden = !html; rScreenEl.style.visibility = html ? 'hidden' : ''; }

// ═══════════════════════════════════════════════════════════ твины ══
const tw = [];
function tween(o, to, ms, ease = 'io') {
  return new Promise(res => { const from = {}; for (const k in to) from[k] = o[k]; tw.push({o, to, from, t0: performance.now(), ms: Math.max(1, ms), ease, res}); });
}
const EASE = {io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out: t => 1 - Math.pow(1 - t, 3), back: t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }, lin: t => t};
async function walkTo(x, ms) {
  const dx = x - robotG.position.x;
  if (Math.abs(dx) < .01) return;
  play('walk');
  robotG.userData.face = dx > 0 ? -Math.PI / 2 + Math.PI : -Math.PI / 2;
  await tween(robotG.position, {x}, ms || Math.abs(dx) / 2.6 * 1000 / SPEED(), 'lin');
  play('idle');
}

// ═════════════════════════════════════════════════════════════ звук ══
let ac = null, muted = false;
function tone(f, d, o = {}) {
  if (muted) return;
  try { ac = ac || new AudioContext(); } catch (e) { return; }
  const t = ac.currentTime + (o.at || 0), osc = ac.createOscillator(), g = ac.createGain();
  osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t); if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + d);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(o.vol || .12, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + d);
  osc.connect(g); g.connect(ac.destination); osc.start(t); osc.stop(t + d + .02);
}
const SFX = {
  yes: () => { tone(660, .08, {type: 'triangle'}); tone(990, .1, {type: 'triangle', at: .07}); },
  no: () => tone(220, .09, {type: 'triangle', vol: .08}),
  unk: () => { tone(440, .07, {vol: .08}); tone(415, .1, {vol: .08, at: .08}); },
  pop: () => tone(520, .09, {to: 1000, vol: .1}),
  ok: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .2, {type: 'triangle', at: i * .08})),
  err: () => { tone(160, .3, {type: 'square', vol: .1}); tone(120, .35, {type: 'square', vol: .09, at: .15}); },
  rew: () => { for (let i = 0; i < 8; i++) tone(900 - i * 80, .05, {type: 'square', vol: .05, at: i * .05}); },
};

// ═══════════════════════════════════════════════════════════ состояние ══
let db = null, DATA = [], people = {}, trays = {}, chips = {}, card = null, running = false, SPD = 1;
const SPEED = () => SPD;
const seed = parseInt(new URLSearchParams(location.search).get('n') || '7', 10);

function chip(id, kind, text) {
  removeChip(id);
  const wrap = document.createElement('div');
  const el = document.createElement('div'); wrap.appendChild(el);
  el.className = 'chip ' + kind;
  el.textContent = kind === 'no' ? '' : text;
  const o = new CSS2DObject(wrap); o.inner = el;
  const g = people[id];
  o.position.set(0, 1.45 / g.userData.s, 0);
  g.add(o); chips[id] = o;
  el.animate([{transform: 'scale(.5)'}, {transform: 'none'}], {duration: 260, easing: 'cubic-bezier(.3,1.6,.6,1)'});
}
function removeChip(id) { const c = chips[id]; if (c) { c.parent.remove(c); c.element.remove(); delete chips[id]; } }
function clearChips() { Object.keys(chips).forEach(removeChip); }
function showCard(id, html, cls = '') {
  hideCard();
  const wrap = document.createElement('div'), el = document.createElement('div'); wrap.appendChild(el); el.className = 'rcard ' + cls; el.innerHTML = html;
  wrap.style.zIndex = 20; card = new CSS2DObject(wrap); card.position.set(0, 1.95 / people[id].userData.s, 0); people[id].add(card);
}
function hideCard() { if (card) { card.parent.remove(card); card.element.remove(); card = null; } }
function setTray(id, meal, anim) {
  if (trays[id]) { scene.remove(trays[id]); delete trays[id]; }
  if (!meal) return;
  const p = DATA.find(q => q.id === id), t = tray(meal);
  const kid = p.kid;
  t.position.set(seatX(parseInt(p.seat, 10)) - .32, kid ? .5 : .56, ZS[p.seat.slice(-1)]);
  scene.add(t); trays[id] = t;
  if (anim) { t.scale.setScalar(.01); tween(t.scale, {x: 1, y: 1, z: 1}, 380, 'back'); t.position.y += .5; tween(t.position, {y: t.position.y - .5}, 380, 'out'); }
}
async function bounce(id, h = .25) {
  const g = people[id], y0 = g.userData.base.y;
  await tween(g.position, {y: y0 + h}, 140, 'out'); await tween(g.position, {y: y0}, 200, 'io');
}

async function resetWorld() {
  DATA = makeData(seed);
  await db.exec('DROP TABLE IF EXISTS passenger;' + SCHEMA +
    'INSERT INTO passenger (id, seat, full_name, birth_year, fare_class, meal) VALUES ' +
    DATA.map(p => `(${p.id}, ${lit(p.seat)}, ${lit(p.full_name)}, ${lit(p.birth_year)}, ${lit(p.fare_class)}, NULL)`).join(',') + ';');
  Object.values(people).forEach(g => scene.remove(g)); people = {};
  Object.keys(trays).forEach(id => setTray(+id, null));
  clearChips(); hideCard();
  const r = rng(seed * 31 + 5);
  DATA.forEach(p => { const g = person(p, r); scene.add(g); people[p.id] = g; });
  robotG.position.set(LEN0 + 1.2, 0, 0); robotG.userData.face = -Math.PI / 2;
  screen('СУБД', 'жду команду');
  $('result').innerHTML = ''; $('verdict').innerHTML = '';
  hud(0, 0, DATA.length);
}
function hud(done, yes, total) { $('cnt').innerHTML = `<b>${done}</b>/${total} проверено · <b>${yes}</b> подошло`; }

// ════════════════════════════════════════════════════ разбор команды ══
function parse(sql) {
  const s = sql.replace(/--[^\n]*/g, ' ').replace(/\s+/g, ' ').trim().replace(/;\s*$/, '');
  if (s.includes(';')) return {err: 'В этой пробе — одна команда за раз.'};
  let m;
  if ((m = /^update\s+passenger\s+set\s+([\s\S]+?)(?:\s+where\s+([\s\S]+))?$/i.exec(s))) {
    const sets = m[1].split(/,(?![^(]*\))/).map(x => { const k = /^\s*(\w+)\s*=\s*([\s\S]+)$/.exec(x); return k ? {col: k[1].toLowerCase(), expr: k[2].trim()} : null; });
    if (sets.some(x => !x)) return {err: 'Не разобрал SET: нужно «столбец = значение».'};
    return {kind: 'UPDATE', sql: s, sets, where: m[2] || null};
  }
  if ((m = /^select\s+([\s\S]+?)\s+from\s+passenger(?:\s+where\s+([\s\S]+?))?(?:\s+order\s+by\s+[\s\S]+)?$/i.exec(s))) return {kind: 'SELECT', sql: s, where: m[2] || null};
  if (/^(delete|insert|drop|alter|create|truncate)/i.test(s)) return {err: 'В этой пробе работают SELECT и UPDATE таблицы passenger.'};
  return {kind: 'OTHER', sql: s};
}
const colsIn = w => w ? COLS.filter(c => new RegExp('\\b' + c + '\\b', 'i').test(w)) : [];
const fmt = v => v === null || v === undefined ? 'NULL' : String(v);
// условие с подставленными значениями строки: birth_year >= 2012 → 1983 >= 2012
const subst = (w, row) => w.replace(/'(?:[^']|'')*'|\b[a-z_]+\b/gi, t => t.startsWith("'") ? t : COLS.includes(t.toLowerCase()) ? (row[t.toLowerCase()] === null ? 'NULL' : typeof row[t.toLowerCase()] === 'number' ? String(row[t.toLowerCase()]) : "'" + row[t.toLowerCase()] + "'") : t);

// ════════════════════════════════════════════════ выполнение запроса ══
async function run() {
  if (running || !db) return;
  const sql = $('sql').value.trim();
  if (!sql) return;
  const q = parse(sql);
  $('verdict').innerHTML = '';
  if (q.err) { $('result').innerHTML = `<span class="bad">${esc(q.err)}</span>`; SFX.err(); return; }
  running = true; $('runBtn').disabled = true;
  clearChips(); hideCard();
  try {
    if (q.kind === 'OTHER') {
      const r = await db.query(q.sql);
      $('result').innerHTML = `<span class="ok">${r.rows.length} строк</span>`;
      return;
    }
    // оценка WHERE по каждой строке — в порядке хранения
    const wcols = colsIn(q.where);
    let rows;
    try {
      const extra = q.kind === 'UPDATE' ? q.sets.map((s, i) => `, (${s.expr}) AS v${i}`).join('') : '';
      rows = (await db.query(`SELECT id, ${COLS.join(', ')}, ${q.where ? `(${q.where})` : 'true'} AS w${extra} FROM passenger ORDER BY ctid`)).rows;
    } catch (e) {
      play('idle'); screen('ОШИБКА', 'не понял команду');
      $('result').innerHTML = `<span class="bad">ERROR: ${esc(e.message)}</span><div class="ru">${esc(explain(e))}</div>`;
      SFX.err(); bump();
      return;
    }
    // пробный прогон: упадёт ли команда на какой-то строке
    let failId = null, failErr = null;
    if (q.kind === 'UPDATE') {
      await db.exec('BEGIN');
      try { await db.query(q.sql); } catch (e) { failErr = e; const m = /Failing row contains \((\d+),/.exec(e.detail || ''); failId = m ? +m[1] : (rows.find(r => r.w) || {}).id; }
      await db.exec('ROLLBACK');
    }
    const head = q.kind === 'UPDATE' ? `UPDATE · SET ${q.sets.map(s => `${s.col} = ${s.expr}`).join(', ')}` : 'SELECT';
    cmdBar(`<span class="k">${esc(head)}</span><span class="w">${q.where ? 'WHERE ' + esc(q.where) : 'без WHERE — подходит каждая строка'}</span>`);
    const total = rows.length;
    let done = 0, yes = 0;
    const changed = [];
    hud(0, 0, total);
    // обход
    for (const row of rows) {
      const g = people[row.id];
      const p = DATA.find(x => x.id === row.id);
      const fast = SPD >= 50;
      if (!fast) {
        await walkTo(seatX(parseInt(p.seat, 10)) - .05);
        robotG.userData.face = ZS[p.seat.slice(-1)] < 0 ? Math.PI : 0;
        aimBeam(g);
      } else robotG.position.x = seatX(parseInt(p.seat, 10)) - .05;
      const v = row.w;
      const kind = v === true ? 'yes' : v === false ? 'no' : 'unk';
      const vals = (wcols.length ? wcols : ['id']).map(c => `<div><span>${c}</span><b>${esc(fmt(row[c]))}</b></div>`).join('')
        + (q.where ? `<div class="rc-x">${esc(subst(q.where, row))}</div>` : '');
      if (!fast) {
        showCard(row.id, `<div class="rc-h">строка ${row.id} · ${row.seat}</div>${vals}<div class="rc-v ${kind}">${kind === 'yes' ? 'ДА' : kind === 'no' ? 'НЕТ' : 'NULL — не знаю'}</div>`, kind);
        SFX[kind]();
        await sleep(Math.max(80, 520 / SPD));
        while (window.PROTO.holdAt != null && done + 1 >= window.PROTO.holdAt) await sleep(100);
      }
      chip(row.id, kind, kind === 'yes' ? '✓' : kind === 'no' ? '✕' : '?');
      done++;
      if (v === true) {
        yes++;
        if (q.kind === 'UPDATE') {
          if (row.id === failId) {
            // отказ на этой строке → откат всего
            hideCard(); beamOff();
            showCard(row.id, `<div class="rc-h">строка ${row.id}</div><div class="rc-v err">${esc(failErr.constraint || 'отказ')}</div><div class="rc-t">${esc(explain(failErr))}</div>`, 'err');
            SFX.err(); play('jump', true); shake();
            hud(done, yes, total);
            $('result').innerHTML = `<span class="bad">ERROR: ${esc(failErr.message)}</span><div class="ru">Команда не выполнена. Всё, что было изменено до этой строки, отменяется.</div>`;
            await sleep(1600);
            $('rewind').hidden = false; SFX.rew(); screen('ОТКАТ', 'команда целиком отменена');
            for (const id of changed.reverse()) {
              const t = trays[id];
              if (t) { await tween(t.scale, {x: .01, y: .01, z: .01}, 120, 'io'); setTray(id, null); }
              removeChip(id);
            }
            await sleep(400); $('rewind').hidden = true; clearChips();
            hideCard(); play('idle');
            verdictBox(false, 'Отказ СУБД: ни одна строка не изменена — даже те, что шли до ошибки.');
            return;
          }
          const s = q.sets.find(x => x.col === 'meal');
          if (s) { setTray(row.id, row.v0 === undefined ? null : row['v' + q.sets.indexOf(s)], true); SFX.pop(); }
          changed.push(row.id);
          if (!fast) { play('jump', true); bounce(row.id); await sleep(Math.max(60, 300 / SPD)); play('idle'); }
        }
      }
      hud(done, yes, total);
      if (!fast) hideCard();
    }
    beamOff();
    Object.entries(chips).forEach(([id, c]) => { if (c.inner.classList.contains('no')) c.inner.animate([{opacity: 1}, {opacity: 0}], {duration: 600, fill: 'forwards'}); });
    await walkTo(LEN0 + 1.2, 500);
    robotG.userData.face = -Math.PI / 2;
    // настоящая команда
    const r = await db.query(q.sql);
    const tag = q.kind === 'UPDATE' ? `UPDATE ${r.affectedRows}` : `(${r.rows.length} строк)`;
    $('result').innerHTML = `<span class="ok">${tag}</span>${q.kind === 'SELECT' ? '<div class="ru">Это только просмотр: ничего не изменилось. Метки показывают, кого задела бы команда с тем же WHERE.</div>' : ''}`;
    screen(tag, q.kind === 'UPDATE' ? 'изменено и сохранено' : 'прицел — без изменений');
    if (q.kind === 'UPDATE') await judge();
  } finally {
    cmdBar(null);
    running = false; $('runBtn').disabled = false;
  }
}
function explain(e) {
  const c = e.code;
  if (c === '23514') return `Значение не проходит правило ${e.constraint || ''}: meal может быть только 'стандарт', 'детское', 'вегетарианское' или 'ресторан'.`;
  if (c === '42703') return 'Такого столбца нет. Столбцы: ' + COLS.join(', ') + '.';
  if (c === '42601') return 'Синтаксическая ошибка — проверьте слово, названное в сообщении, и что перед ним.';
  if (c === '22P02' || c === '42883') return 'Типы не сходятся: текст пишется в одинарных кавычках, числа — без.';
  return '';
}

// ══════════════════════════════════════════════════ проверка задания ══
async function judge() {
  const rows = (await db.query('SELECT id, birth_year, meal FROM passenger ORDER BY id')).rows;
  let extra = 0, miss = 0, wrong = 0;
  rows.forEach(r => {
    const want = r.birth_year !== null && r.birth_year >= 2012 ? 'детское' : null;
    if (want === r.meal) return;
    if (want && !r.meal) { miss++; chip(r.id, 'miss', 'А мне?'); }
    else if (!want && r.meal) { extra++; chip(r.id, 'extra', 'Мне?!'); }
    else { wrong++; chip(r.id, 'extra', 'не то'); }
  });
  if (!extra && !miss && !wrong) {
    SFX.ok(); play('jump', true);
    const kids = rows.filter(r => r.meal).map(r => r.id);
    for (const id of kids) { bounce(id, .45); await sleep(90); }
    confetti();
    verdictBox(true, `Все ${kids.length} детей с подносами, взрослых не задели. А у ребёнка без года рождения — NULL: сравнение с ним даёт «не знаю», и строка не подходит.`);
  } else {
    SFX.err();
    verdictBox(false, [extra ? `Задели лишних: ${extra}` : '', miss ? `Не досталось: ${miss}` : '', wrong ? `Не то значение: ${wrong}` : ''].filter(Boolean).join(' · ') + '. Нажмите «Сброс» и попробуйте снова.');
  }
}
function verdictBox(ok, text) {
  document.querySelectorAll('#mission li').forEach(li => li.classList.toggle('done', ok)); $('verdict').innerHTML = `<div class="${ok ? 'v-ok' : 'v-bad'}"><b>${ok ? 'Выполнено' : 'Не совпало'}</b>${esc(text)}</div>`; }

// ═════════════════════════════════════════════════════════ эффекты ══
function aimBeam(g) {
  const a = new THREE.Vector3(robotG.position.x, 1.25, 0), b = g.position.clone(); b.y = 1.0 * g.userData.s + g.position.y;
  const d = b.clone().sub(a), L = d.length();
  beam.scale.set(1, L, 1); beam.position.copy(a).add(d.multiplyScalar(.5));
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), b.clone().sub(a).normalize());
  beam.material.opacity = .28;
}
function beamOff() { beam.material.opacity = 0; }
let shakeT = 0; function shake() { shakeT = performance.now(); }
function bump() { play('jump', true); setTimeout(() => play('idle'), 700); }
const conf = [];
function confetti() {
  const cols = [0xffc21a, 0x2f6f73, 0xb5523b, 0x3b4d7a, 0xffffff];
  for (let i = 0; i < 160; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(.12, .07), new THREE.MeshBasicMaterial({color: cols[i % cols.length], side: THREE.DoubleSide}));
    m.position.set(MID + (Math.random() - .5) * LEN, 4 + Math.random() * 2, (Math.random() - .5) * 5);
    m.userData.v = new THREE.Vector3((Math.random() - .5) * .8, -1.2 - Math.random(), (Math.random() - .5) * .8);
    m.userData.r = new THREE.Vector3(Math.random() * 6, Math.random() * 6, 0);
    scene.add(m); conf.push(m);
  }
  setTimeout(() => conf.splice(0).forEach(m => scene.remove(m)), 4500);
}

// ═════════════════════════════════════════════════════ камера и цикл ══
function fit() {
  const W = $('stage').clientWidth, H = $('stage').clientHeight;
  renderer.setSize(W, H); labels.setSize(W, H);
  const aspect = W / H, h = 6.8 / camState.curZoom;
  cam.left = -h * aspect; cam.right = h * aspect; cam.top = h; cam.bottom = -h; cam.updateProjectionMatrix();
}
window.addEventListener('resize', fit);
let drag = null;
renderer.domElement.addEventListener('pointerdown', e => { drag = {x: e.clientX, y: e.clientY, tx: camState.tx, tz: camState.tz, m: false}; });
window.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) drag.m = true; const k = .018 / camState.curZoom; camState.tx = drag.tx - (dx * .7 + dy * .9) * k; camState.tz = drag.tz + (dx * .7 - dy * .9) * k; camState.follow = false; });
window.addEventListener('pointerup', e => { if (drag && !drag.m) pick(e); drag = null; });
renderer.domElement.addEventListener('wheel', e => { e.preventDefault(); camState.zoom = Math.max(.6, Math.min(2.6, camState.zoom * Math.pow(1.0015, -e.deltaY))); }, {passive: false});
const ray = new THREE.Raycaster();
function pick(e) {
  const r = renderer.domElement.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), cam);
  const hit = ray.intersectObjects(Object.values(people), true).find(h => h.object.userData.pid);
  if (!hit || running) { if (!running) hideCard(); return; }
  const id = hit.object.userData.pid;
  db.query('SELECT * FROM passenger WHERE id = $1', [id]).then(res => {
    const row = res.rows[0];
    showCard(id, `<div class="rc-h">passenger · строка ${id}</div>${COLS.map(c => `<div><span>${c}</span><b>${esc(fmt(row[c]))}</b></div>`).join('')}`, 'info');
  });
}
const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(.05, clock.getDelta());
  const now = performance.now();
  for (let i = tw.length - 1; i >= 0; i--) {
    const t = tw[i], k = Math.min(1, (now - t.t0) / t.ms), v = EASE[t.ease](k);
    for (const p in t.to) t.o[p] = t.from[p] + (t.to[p] - t.from[p]) * v;
    if (k >= 1) { tw.splice(i, 1); t.res(); }
  }
  if (mixer) mixer.update(dt);
  // поворот робота
  const f = robotG.userData.face ?? -Math.PI / 2;
  let d = f - robotG.rotation.y; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  robotG.rotation.y += d * Math.min(1, dt * 10);
  // камера: во время обхода следует за роботом
  if (running && camState.follow !== false) { camState.tx += (robotG.position.x + 1.2 - camState.tx) * Math.min(1, dt * 2.5); camState.tz += (0 - camState.tz) * dt * 2; }
  camState.cx += (camState.tx - camState.cx) * Math.min(1, dt * 4); camState.cz += (camState.tz - camState.cz) * Math.min(1, dt * 4);
  const zt = running && camState.follow !== false ? Math.max(camState.zoom, 1.45) : camState.zoom;
  camState.curZoom += (zt - camState.curZoom) * Math.min(1, dt * 3);
  const sh = shakeT && now - shakeT < 500 ? (1 - (now - shakeT) / 500) * .12 : 0;
  const tgt = new THREE.Vector3(camState.cx + (Math.random() - .5) * sh, 0, camState.cz + (Math.random() - .5) * sh);
  cam.position.copy(tgt).add(CAMDIR.clone().multiplyScalar(40)); cam.lookAt(tgt);
  fit();
  conf.forEach(m => { m.position.addScaledVector(m.userData.v, dt * 2); m.rotation.x += m.userData.r.x * dt; m.rotation.y += m.userData.r.y * dt; });
  renderer.render(scene, cam); labels.render(scene, cam);
  requestAnimationFrame(frame);
}

// ═══════════════════════════════════════════════════════════ запуск ══
async function boot() {
  fit(); frame();
  await loadRobot();
  while (!window.__pg) await sleep(30);
  db = await window.__pg;
  await resetWorld();
  $('loading').hidden = true;
  $('runBtn').onclick = () => { camState.follow = true; run(); };
  $('sql').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); camState.follow = true; run(); } });
  $('resetBtn').onclick = () => { if (!running) resetWorld(); };
  document.querySelectorAll('[data-spd]').forEach(b => b.onclick = () => { SPD = +b.dataset.spd; document.querySelectorAll('[data-spd]').forEach(x => x.classList.toggle('on', x === b)); });
  $('sndBtn').onclick = () => { muted = !muted; $('sndBtn').classList.toggle('off', muted); };
  $('homeBtn').onclick = () => { camState.tx = 2.6; camState.tz = 0; camState.zoom = 1; camState.follow = true; };
  $('sql').focus();
}
window.PROTO = {holdAt: null, run, get running() { return running; }, set speed(v) { SPD = v; }, reset: () => resetWorld(), get db() { return db; }};
boot();
