// Общий 3D-движок лабораторных «Аэропорт»: сцена и свет, материалы и склейка мешей, корпус самолёта,
// пассажир, поднос, чемодан, робот-СУБД, подписи над объектами, камера, цикл кадров, качество графики, эффекты.
// Сцена конкретной лабы (lrNN-3d/src/scene.js) строит на нём салон и связывает его со строками базы.
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {CHAR_GLB, COLORMAP} from './robot-asset.js';
import {esc} from '../util.js';

export {THREE, CSS2DObject};
export {sleep} from '../util.js';
export const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ════════════════════════════════════════════════════════════ твины ══
const tw = [];
const EASE = {
  io: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  back: t => {
    const c = 1.7;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  },
  drop: t => {
    const n = 7.5625,
      d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  },
  lin: t => t,
};
export function tween(o, to, ms, ease = 'io') {
  return new Promise(res => {
    const from = {};
    for (const k in to) from[k] = o[k];
    tw.push({o, to, from, t0: performance.now(), ms: Math.max(1, ms), ease, res});
  });
}
function stepTweens(now) {
  for (let i = tw.length - 1; i >= 0; i--) {
    const t = tw[i],
      k = Math.min(1, (now - t.t0) / t.ms),
      v = EASE[t.ease](k);
    for (const p in t.to) t.o[p] = t.from[p] + (t.to[p] - t.from[p]) * v;
    if (k >= 1) {
      tw.splice(i, 1);
      t.res();
    }
  }
}

const SHIRT = [0xb5523b, 0x2f6f73, 0xc9952b, 0x3b4d7a, 0x6d7a3a, 0x7a4b6b, 0x4f6d8a, 0xd07a4a, 0x5a8a6f, 0x8a4a4a, 0x5c5470];
const SKIN = [0xf1c9a5, 0xe0ac84, 0xc68a62, 0xf5d6bc, 0xa8714f];
const HAIR = [0x2b2420, 0x4a3426, 0x7a5a3a, 0x1d1c1a, 0xb98c5a, 0x8f4a2a];
const PANTS = [0x3d4250, 0x2b2f3a, 0x5a4a3a, 0x3b4d5a];
const MEALC = {детское: 0xffc21a, стандарт: 0x8a9096, вегетарианское: 0x5aa86e, ресторан: 0xb5523b};
const BAGC = [0x8a6f4c, 0x6d4f3a, 0x4f6d8a, 0x9a3b2a, 0x5a6a3a, 0x3d4250];
export const PITCH = 1.12; // шаг рядов
export const ZS = {A: -2.0, B: -1.42, C: -0.84, D: 0.84, E: 1.42, F: 2.0}; // поперечное положение мест
export const seatX = row => (row - 1) * PITCH;
export const bagSize = w => ({w: 0.24 + w * 0.006, h: 0.2 + w * 0.007, d: 0.34});

// o: home {tx, tz} — куда смотрит камера в обзоре; sunTarget [x, y, z]; viewH — высота кадра; followZoom — приближение при слежении
export function createEngine(stage, o) {
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
  const cam = new THREE.OrthographicCamera(-10, 10, 6, -6, 0.1, 300);
  const CAMDIR = new THREE.Vector3(1.05, 1.25, 1.35).normalize();
  const camS = {tx: o.home.tx, tz: o.home.tz, ty: 0, zoom: 1, cx: o.home.tx, cy: 0, cz: o.home.tz, cur: 1, follow: false, shakeT: 0};

  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x9fb2c2, 1.25));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.2);
  sun.position.set(-6, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {left: -13, right: 13, top: 11, bottom: -11, near: 1, far: 50});
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  scene.add(sun.target);
  sun.target.position.set(...o.sunTarget);
  const fill = new THREE.DirectionalLight(0xd8e6ff, 0.5);
  fill.position.set(10, 6, -8);
  scene.add(fill);

  // ═════════════════════════════════════════════ материалы и детали ══
  // кэш: одинаковые материалы и геометрии не создаются заново
  const mcache = new Map(),
    gcache = new Map();
  const mat = (c, opt = {}) => {
    if (opt.transparent) return new THREE.MeshStandardMaterial({color: c, roughness: opt.r ?? 0.78, metalness: 0, ...opt});
    const k = c + JSON.stringify(opt);
    let m = mcache.get(k);
    if (!m) {
      m = new THREE.MeshStandardMaterial({color: c, roughness: opt.r ?? 0.78, metalness: 0, ...opt});
      mcache.set(k, m);
    }
    return m;
  };
  const rgeo = (w, h, d, r) => {
    const k = [w, h, d, r].map(v => v.toFixed(3)).join();
    let g = gcache.get(k);
    // скругление одним сегментом (фаска): на вид почти то же, а треугольников втрое меньше
    if (!g) {
      g = new RoundedBoxGeometry(w, h, d, 1, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
      gcache.set(k, g);
    }
    return g;
  };
  const rbox = (w, h, d, r, c, opt) => {
    const m = new THREE.Mesh(rgeo(w, h, d, r), typeof c === 'object' ? c : mat(c, opt));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const at = (m, x, y, z) => {
    m.position.set(x, y, z);
    return m;
  };
  // склейка: много мелких деталей → один меш с цветами в вершинах (в разы меньше вызовов отрисовки)
  const VCM = new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.78, metalness: 0});
  function bakeMeshes(list, rel) {
    const geos = [];
    list.forEach(m => {
      const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      // уже склеенный меш несёт цвета в вершинах — их и сохраняем
      const keepCol = m.material.vertexColors && g.attributes.color;
      Object.keys(g.attributes).forEach(a => {
        if (a !== 'position' && a !== 'normal' && !(keepCol && a === 'color')) g.deleteAttribute(a);
      });
      g.applyMatrix4(rel(m));
      if (keepCol) {
        geos.push(g);
        return;
      }
      const c = m.material.color || new THREE.Color(0xffffff),
        e = m.material.emissive,
        ei = m.material.emissiveIntensity ?? 1;
      const r = Math.min(1, c.r + (e ? e.r * ei : 0)),
        gg = Math.min(1, c.g + (e ? e.g * ei : 0)),
        b = Math.min(1, c.b + (e ? e.b * ei : 0));
      const n = g.attributes.position.count,
        col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        col[i * 3] = r;
        col[i * 3 + 1] = gg;
        col[i * 3 + 2] = b;
      }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geos.push(g);
    });
    const merged = new THREE.Mesh(mergeGeometries(geos), VCM.clone());
    geos.forEach(g => g.dispose());
    merged.castShadow = true;
    merged.receiveShadow = true;
    return merged;
  }
  // склеить все непрозрачные меши внутри группы (координаты — относительно группы)
  function bakeGroup(group, keep = () => false) {
    group.updateMatrixWorld(true);
    const inv = group.matrixWorld.clone().invert();
    const list = [];
    group.traverse(m => {
      if (m.isMesh && !m.material.transparent && !keep(m)) list.push(m);
    });
    if (list.length < 2) return group;
    const merged = bakeMeshes(list, m => inv.clone().multiply(m.matrixWorld));
    list.forEach(m => m.parent.remove(m));
    group.add(merged);
    return group;
  }
  const label = (html, cls, obj, x, y, z) => {
    const el = document.createElement('div');
    el.className = cls;
    el.innerHTML = html;
    const l = new CSS2DObject(el);
    l.position.set(x, y, z);
    obj.add(l);
    return l;
  };
  const setPick = (g, pick) =>
    g.traverse(m => {
      if (m.isMesh) m.userData.pick = pick;
    });

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), mat(0xdcd6c9, {r: 1}));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.35;
  ground.receiveShadow = true;
  scene.add(ground);
  // разметка перрона
  for (let i = -6; i < 14; i++) {
    const d = rbox(1.4, 0.02, 0.14, 0.02, 0xf2c230);
    at(d, i * 2.4, -1.33, o.apronZ);
    d.castShadow = false;
    scene.add(d);
  }

  const root = new THREE.Group();
  scene.add(root); // всё, что улетает вместе с самолётом
  const geo = {}; // размеры корпуса — заполняет airframe()

  // ═══════════════════════════════════════════════════ корпус самолёта ══
  // p: rows, wing [w0, w1, h, w2] — форма крыла, wingRow, engRow, engZ, dashes — пунктир на ковре, rails — рейки для кресел
  function airframe(p) {
    const LEN0 = -3.1,
      LEN1 = seatX(p.rows) + 1.3,
      MID = (LEN0 + LEN1) / 2,
      LEN = LEN1 - LEN0;
    Object.assign(geo, {LEN0, LEN1, MID, LEN, DOOR: {x: LEN0 + 2.3, z: 2.75}});
    const hull = rbox(LEN + 0.5, 1.3, 6.1, 0.45, 0xfbf8f2);
    at(hull, MID, -0.66, 0);
    root.add(hull);
    [-1, 1].forEach(s => {
      const st = rbox(LEN + 0.52, 0.16, 0.06, 0.03, 0xffc21a);
      at(st, MID, -0.45, s * 3.04);
      root.add(st);
      const [w0, w1, h, w2] = p.wing;
      const sh = new THREE.Shape();
      sh.moveTo(0, 0);
      sh.lineTo(w0, 0);
      sh.lineTo(w1, h);
      sh.lineTo(w2, h);
      sh.lineTo(0, 0);
      const wing = new THREE.Mesh(
        new THREE.ExtrudeGeometry(sh, {depth: 0.12, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2}),
        mat(0xeef0f2),
      );
      wing.castShadow = true;
      wing.receiveShadow = true;
      wing.rotation.x = (s * Math.PI) / 2;
      wing.position.set(seatX(p.wingRow), -0.9, s * 2.95);
      root.add(wing);
      const eng = rbox(1.5, 0.6, 0.6, 0.28, 0xd8dde1);
      at(eng, seatX(p.engRow), -1.1, s * p.engZ);
      root.add(eng);
      const tail = new THREE.Shape();
      tail.moveTo(0, 0);
      tail.lineTo(1.4, 0);
      tail.lineTo(2.1, 2.0);
      tail.lineTo(1.5, 2.0);
      tail.lineTo(0, 0);
      const tg = new THREE.Mesh(
        new THREE.ExtrudeGeometry(tail, {depth: 0.1, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2}),
        mat(0xeef0f2),
      );
      tg.castShadow = true;
      tg.rotation.x = (s * Math.PI) / 2;
      tg.position.set(LEN1 - 1.5, -0.7, s * 2.95);
      root.add(tg);
    });
    const nose = new THREE.Mesh(new THREE.SphereGeometry(3.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xfbf8f2));
    nose.scale.set(0.213, 0.55, 1);
    nose.rotation.z = Math.PI / 2;
    at(nose, LEN0 - 0.1, -0.66, 0);
    nose.castShadow = true;
    root.add(nose);
    const floor = rbox(LEN, 0.12, 5.9, 0.05, 0xeee8da);
    at(floor, MID, -0.06, 0);
    root.add(floor);
    const carpet = rbox(LEN - 0.2, 0.02, 1.05, 0.01, 0x4a5684);
    at(carpet, MID, 0.01, 0);
    root.add(carpet);
    for (let i = 0; i < p.dashes; i++)
      [-0.44, 0.44].forEach(z => {
        const d = rbox(0.16, 0.021, 0.04, 0.01, 0xffc21a, {emissive: 0x332200});
        at(d, LEN0 + 0.6 + (i * (LEN - 1.2)) / (p.dashes - 1), 0.02, z);
        root.add(d);
      });
    // крепёжные рейки на полу — сюда встают кресла
    if (p.rails)
      [ZS.A, ZS.C, ZS.D, ZS.F].forEach(z => {
        const r = rbox(seatX(p.rows) + 0.9, 0.025, 0.06, 0.01, 0xc9c2b2);
        at(r, seatX(p.rows) / 2, 0.01, z);
        r.castShadow = false;
        root.add(r);
      });
    const wallFar = rbox(LEN, 2.25, 0.16, 0.06, 0xf7f4ee);
    at(wallFar, MID, 1.07, -2.95);
    root.add(wallFar);
    const wallNear = rbox(LEN, 0.42, 0.16, 0.06, 0xf7f4ee);
    at(wallNear, MID, 0.17, 2.95);
    root.add(wallNear);
    for (let r = 1; r <= p.rows; r++) {
      const w = rbox(0.42, 0.46, 0.04, 0.14, 0x9fc3d8, {r: 0.25, emissive: 0x24384a, emissiveIntensity: 0.25});
      at(w, seatX(r) - 0.1, 0.8, -2.86);
      root.add(w);
    }
    const trim = rbox(LEN, 0.08, 0.2, 0.03, 0xffc21a);
    at(trim, MID, 2.2, -2.95);
    root.add(trim);
    const endWall = rbox(0.16, 1.55, 5.9, 0.06, 0xf7f4ee);
    at(endWall, LEN1, 0.72, 0);
    root.add(endWall);
    const galley = rbox(0.9, 1.0, 1.5, 0.08, 0xdcd6c8);
    at(galley, LEN0 + 0.55, 0.5, -2.05);
    root.add(galley);
    const doorF = rbox(0.9, 0.03, 0.5, 0.02, 0xffc21a);
    at(doorF, geo.DOOR.x, 0.03, 2.7);
    root.add(doorF);
    robotG.position.set(LEN0 + 1.6, 0, 0);
    robotG.userData.face = -Math.PI / 2;
    return geo;
  }
  // табло рейсов на перегородке у носа
  // табло вылетов — экран на самой модели: строки рисуются на холсте и натягиваются на плоскость.
  // show(rows, flash): rows — [{cells: ['ИИ-750', '12:00', 'Сочи', 'A9'], on: наш рейс}]
  function flightBoard() {
    // висит у носовой перегородки, развёрнуто к салону — чтобы надписи читались из обычного ракурса
    const board = new THREE.Group();
    board.position.set(geo.LEN0 + 0.45, 1.42, 0.1);
    board.rotation.y = -0.75;
    root.add(board);
    const frame = rbox(0.07, 1.12, 2.4, 0.04, 0x27292c);
    frame.userData.keep = true;
    board.add(frame);
    const cv = document.createElement('canvas');
    cv.width = 960;
    cv.height = 432;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.28, 1.02), new THREE.MeshBasicMaterial({map: tex, toneMapped: false}));
    screen.rotation.y = Math.PI / 2;
    screen.position.x = 0.04;
    screen.userData.keep = true;
    board.add(screen);
    setPick(board, {t: 'flight', k: '*'});
    let last = [];
    function draw(rows) {
      const c = cv.getContext('2d'),
        W = cv.width,
        H = cv.height;
      c.fillStyle = '#16181c';
      c.fillRect(0, 0, W, H);
      c.fillStyle = '#9a9488';
      c.font = '700 34px "JetBrains Mono", Consolas, monospace';
      c.fillText('ВЫЛЕТ · DEPARTURES', 26, 50);
      c.fillStyle = '#ffc21a';
      c.fillRect(26, 66, W - 52, 5);
      if (!rows.length) {
        c.fillStyle = '#5c5f66';
        c.font = '700 48px "JetBrains Mono", Consolas, monospace';
        c.fillText('— пусто —', 26, 150);
      }
      rows.slice(0, 5).forEach((r, i) => {
        const y = 128 + i * 68;
        if (r.on) {
          c.fillStyle = 'rgba(255, 194, 26, .18)';
          c.fillRect(14, y - 50, W - 28, 64);
        }
        c.font = '800 48px "JetBrains Mono", Consolas, monospace';
        let x = 26;
        const step = r.cells.length > 2 ? [250, 170, 380] : [260];
        r.cells.forEach((t, k) => {
          c.fillStyle = k === 0 ? (r.on ? '#ffffff' : '#ffc21a') : '#e9e6dd';
          c.fillText(String(t), x, y);
          x += step[k] || 200;
        });
      });
      tex.needsUpdate = true;
    }
    draw([]);
    if (document.fonts) document.fonts.ready.then(() => draw(last)); // шрифт мог догрузиться позже
    const show = (rows, flash) => {
      last = rows;
      draw(rows);
      if (flash)
        tween(board.scale, {x: 1.12, y: 1.12, z: 1.12}, 140, 'out').then(() => tween(board.scale, {x: 1, y: 1, z: 1}, 260, 'back'));
    };
    return {board, show};
  }

  // ═══════════════════════════════════════════════════════ пассажир ══
  // look: {kid, female, old}; r — генератор случайных чисел (одежда и причёска)
  function makePerson(look, r) {
    const g = new THREE.Group();
    const shirt = SHIRT[Math.floor(r() * SHIRT.length)],
      skin = SKIN[Math.floor(r() * SKIN.length)];
    const hair = look.old ? 0xd9d6d0 : HAIR[Math.floor(r() * HAIR.length)];
    const pants = PANTS[Math.floor(r() * 4)];
    const add = (m, x, y, z) => {
      at(m, x, y, z);
      g.add(m);
      return m;
    };
    add(rbox(0.34, 0.44, 0.38, 0.1, shirt), 0.05, 0.62, 0);
    add(rbox(0.3, 0.1, 0.34, 0.04, pants), 0.05, 0.42, 0);
    [-1, 1].forEach(s => {
      add(rbox(0.28, 0.1, 0.1, 0.045, shirt), -0.06, 0.58, s * 0.23);
      add(rbox(0.08, 0.08, 0.08, 0.03, skin), -0.22, 0.58, s * 0.23);
    });
    add(rbox(0.3, 0.3, 0.3, 0.1, skin), 0.02, 1.0, 0);
    add(rbox(0.32, look.female ? 0.2 : 0.12, 0.33, 0.06, hair), 0.06, look.female ? 1.1 : 1.13, 0);
    if (look.female && !look.kid) add(rbox(0.1, 0.26, 0.26, 0.05, hair), 0.17, 0.92, 0);
    [-1, 1].forEach(s => add(rbox(0.035, 0.055, 0.05, 0.015, 0x1d1c1a), -0.13, 1.01, s * 0.07));
    bakeGroup(g);
    // ноги: бедро от таза, голень от колена — для позы «сидит/стоит» и шага
    const legs = [-1, 1].map(s => {
      const hip = new THREE.Group();
      hip.position.set(0.04, 0.42, s * 0.09);
      g.add(hip);
      const th = rbox(0.14, 0.22, 0.14, 0.04, pants);
      th.position.y = -0.11;
      hip.add(th);
      const knee = new THREE.Group();
      knee.position.y = -0.21;
      hip.add(knee);
      const sh = rbox(0.12, 0.2, 0.12, 0.04, pants);
      sh.position.y = -0.1;
      knee.add(sh);
      const shoe = rbox(0.18, 0.06, 0.13, 0.025, 0x22252b);
      shoe.position.set(-0.03, -0.2, 0);
      knee.add(shoe);
      bakeGroup(knee);
      return {hip, knee, s};
    });
    // поза «сидит» — заранее склеенные согнутые ноги
    legs.forEach(l => {
      l.hip.rotation.z = -Math.PI / 2;
      l.knee.rotation.z = Math.PI / 2;
    });
    g.updateMatrixWorld(true);
    // сидящий человечек — один меш (тело + согнутые ноги): вдвое меньше вызовов отрисовки на салон
    {
      const inv = g.matrixWorld.clone().invert(),
        torso = g.children.find(m => m.isMesh),
        lm = [torso];
      legs.forEach(l =>
        l.hip.traverse(m => {
          if (m.isMesh) lm.push(m);
        }),
      );
      const sitMesh = bakeMeshes(lm, m => inv.clone().multiply(m.matrixWorld));
      g.add(sitMesh);
      legs.sitMesh = sitMesh;
      legs.torso = torso;
    }
    const sc = look.kid ? 0.66 : 1;
    g.scale.setScalar(sc);
    g.userData = {s: sc, kid: !!look.kid, legs};
    return g;
  }
  function setPose(g, pose) {
    const L = g.userData.legs;
    if (!L) return;
    g.userData.pose = pose;
    L.forEach(l => {
      l.hip.rotation.z = 0;
      l.knee.rotation.z = 0;
      l.hip.visible = pose !== 'sit';
      l.hip.position.y = 0.42;
    });
    if (L.sitMesh) L.sitMesh.visible = pose === 'sit';
    if (L.torso) {
      L.torso.visible = pose !== 'sit';
      L.torso.position.y = 0;
    }
  }
  const walkers = new Set();
  // плавный поворот по кратчайшему пути — а не рывком
  function turn(g, to, ms = 160) {
    let d = to - g.rotation.y;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return tween(g.rotation, {y: g.rotation.y + d}, ms / Math.min(SPD, 4), 'out');
  }
  // пройти по точкам пути; скорость шага — с учётом общей скорости показа
  async function walk(g, path, spd = 2.4) {
    const p = g.position;
    setPose(g, 'stand');
    walkers.add(g);
    for (const q of path) {
      const dx = q.x - p.x,
        dz = q.z - p.z,
        d = Math.hypot(dx, dz) + Math.abs(q.y - p.y);
      if (d < 0.01) continue;
      if (Math.hypot(dx, dz) > 0.01) turn(g, Math.atan2(dz, -dx));
      await tween(p, {x: q.x, y: q.y, z: q.z}, ((d / spd) * 1000) / Math.min(SPD, 4), 'lin');
    }
    walkers.delete(g);
    setPose(g, 'stand');
  }
  function trayMesh(meal) {
    const g = new THREE.Group();
    g.add(rbox(0.3, 0.035, 0.36, 0.015, 0xfbf8f2));
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20), mat(0xffffff));
    at(plate, 0, 0.03, -0.05);
    g.add(plate);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(MEALC[meal] || 0x6b4f9a, {r: 0.45}),
    );
    at(dome, 0, 0.04, -0.05);
    dome.castShadow = true;
    g.add(dome);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.08, 12), mat(0xffffff));
    at(cup, 0.02, 0.06, 0.11);
    g.add(cup);
    return bakeGroup(g);
  }
  // поднос на коленях; y — высота над сиденьем (у ребёнка ниже)
  function attachTray(P, meal, anim, y) {
    if (P.tray) {
      P.g.remove(P.tray);
      P.tray = null;
    }
    if (!meal) return;
    const t = trayMesh(meal),
      s = P.g.userData.s;
    P.tray = t;
    t.position.set(-0.32 / s, y / s, 0);
    t.scale.setScalar(1 / s);
    P.g.add(t);
    if (anim) {
      const s0 = t.scale.x;
      t.scale.setScalar(0.01);
      tween(t.scale, {x: s0, y: s0, z: s0}, 380, 'back');
    }
  }
  // чемодан: цвет — по номеру бирки; withTag — жёлтая бирка сбоку
  function makeBag(weight, tag, withTag) {
    const s = bagSize(weight);
    const g = new THREE.Group();
    g.add(rbox(s.w, s.h, s.d, 0.05, BAGC[(parseInt(String(tag).slice(1), 10) || 0) % BAGC.length]));
    const handle = rbox(0.12, 0.04, 0.04, 0.015, 0x22252b);
    at(handle, 0, s.h / 2 + 0.02, 0);
    g.add(handle);
    if (withTag) {
      const tg = rbox(0.08, 0.1, 0.01, 0.005, 0xffc21a);
      at(tg, s.w / 2 - 0.05, 0.02, s.d / 2 + 0.01);
      g.add(tg);
    }
    return bakeGroup(g);
  }

  // ═════════════════════════════════════════════════════════ робот ══
  const robotG = new THREE.Group();
  let mixer = null,
    curAct = null,
    SPD = 1;
  const acts = {};
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.3, 1, 16, 1, true),
    new THREE.MeshBasicMaterial({color: 0xffd34d, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide}),
  );
  root.add(beam);
  async function loadRobot() {
    root.add(robotG);
    const bin = Uint8Array.from(atob(CHAR_GLB), c => c.charCodeAt(0));
    const mgr = new THREE.LoadingManager();
    mgr.setURLModifier(u => (/colormap\.png$/.test(u) ? COLORMAP : u));
    const gltf = await new Promise((res, rej) => new GLTFLoader(mgr).parse(bin.buffer, '', res, rej));
    const m = gltf.scene;
    m.scale.setScalar(1.25);
    m.traverse(x => {
      if (x.isMesh) {
        x.castShadow = true;
        x.receiveShadow = true;
      }
    });
    robotG.add(m);
    mixer = new THREE.AnimationMixer(m);
    gltf.animations.forEach(a => {
      acts[a.name] = mixer.clipAction(a);
    });
    play('idle');
  }
  function play(name, once) {
    const a = acts[name];
    if (!a) return;
    if (curAct === a && !once) return;
    a.reset();
    a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat);
    a.clampWhenFinished = !!once;
    a.play();
    if (curAct && curAct !== a) curAct.crossFadeTo(a, 0.18, false);
    curAct = a;
  }
  const rScreen = label('', 'rscreen', robotG, 0, 1.75, 0);
  rScreen.visible = false;
  // по проходу: сначала к оси прохода, потом вдоль, потом в сторону
  async function robotGo(x, z = 0) {
    const p = robotG.position;
    if (Math.hypot(x - p.x, z - p.z) < 0.02) return;
    play('walk');
    const legs = [];
    if (Math.abs(p.z) > 0.05 && Math.abs(x - p.x) > 0.05) legs.push({x: p.x, z: 0});
    legs.push({x, z: Math.abs(x - p.x) > 0.05 ? 0 : z});
    if (Math.abs(z) > 0.05) legs.push({x, z});
    for (const L of legs) {
      const dx = L.x - p.x,
        dz = L.z - p.z,
        d = Math.hypot(dx, dz);
      if (d < 0.01) continue;
      robotG.userData.face = Math.atan2(dx, dz);
      await tween(p, {x: L.x, z: L.z}, ((d / 2.8) * 1000) / SPD, 'lin');
    }
    play('idle');
  }
  function aimBeam(wp) {
    const a = new THREE.Vector3(robotG.position.x, 1.25, robotG.position.z).add(root.position),
      b = wp.clone();
    const d = b.clone().sub(a),
      L = d.length();
    beam.scale.set(1, L, 1);
    beam.position.copy(a).add(d.clone().multiplyScalar(0.5)).sub(root.position);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.normalize());
    beam.material.opacity = 0.28;
  }
  const beamOff = () => {
    beam.material.opacity = 0;
  };
  const HOME = {
    get x() {
      return geo.LEN0 + 1.6;
    },
    z: 0,
  };
  function robotHome() {
    robotG.position.set(HOME.x, 0, HOME.z);
    robotG.userData.face = -Math.PI / 2;
    beamOff();
    play('idle');
  }

  // ═══════════════════════════════════════ метки, карточки, реплики ══
  // какой объект сцены отвечает строке (t, k) и на какой высоте над ним подпись — задаёт сцена лабы
  let objOf = () => null,
    chipH = () => 0.5;
  const resolve = (fn, h) => {
    objOf = fn;
    chipH = h;
  };
  function sweepLabels() {
    const live = new Set();
    scene.traverse(x => {
      if (x.isCSS2DObject) live.add(x.element);
    });
    [...labels.domElement.children].forEach(el => {
      if (!live.has(el)) el.remove();
    });
  }
  const chips = new Map();
  let card = null;
  const keyOf = (t, k) => t + ':' + k;
  const drop = c => {
    c.parent && c.parent.remove(c);
    c.element.remove();
  };
  function chip(t, k, kind, text) {
    removeChip(t, k);
    const obj = objOf(t, k);
    if (!obj) return;
    const wrap = document.createElement('div'),
      el = document.createElement('div');
    wrap.appendChild(el);
    el.className = 'chip ' + kind;
    el.textContent = kind === 'no' ? '' : text;
    const c = new CSS2DObject(wrap);
    c.position.set(0, chipH(t, obj), 0);
    obj.add(c);
    c.inner = el;
    el.animate([{transform: 'scale(.5)'}, {transform: 'none'}], {duration: 260, easing: 'cubic-bezier(.3,1.6,.6,1)'});
    chips.set(keyOf(t, k), c);
  }
  const inside = (c, obj) => {
    let p = c.parent;
    while (p && p !== obj) p = p.parent;
    return p === obj;
  };
  // убрать подписи объекта перед тем, как убрать его самого
  function dispose(obj) {
    chips.forEach((c, key) => {
      if (inside(c, obj)) {
        drop(c);
        chips.delete(key);
      }
    });
    if (card && inside(card, obj)) hideCard();
    obj.traverse(x => {
      if (x.isCSS2DObject) x.element.remove();
    });
    obj.children.filter(x => x.isCSS2DObject).forEach(x => obj.remove(x));
  }
  function removeChip(t, k) {
    const c = chips.get(keyOf(t, k));
    if (c) {
      drop(c);
      chips.delete(keyOf(t, k));
    }
  }
  function clearChips() {
    chips.forEach(drop);
    chips.clear();
  }
  function fadeNo() {
    chips.forEach(c => {
      if (c.inner.classList.contains('no')) c.inner.animate([{opacity: 1}, {opacity: 0}], {duration: 600, fill: 'forwards'});
    });
  }
  function showCard(t, k, html, cls = '') {
    hideCard();
    const obj = objOf(t, k);
    if (!obj) return;
    const wrap = document.createElement('div'),
      el = document.createElement('div');
    wrap.appendChild(el);
    el.className = 'rcard ' + cls;
    el.innerHTML = html;
    wrap.style.zIndex = 20;
    card = new CSS2DObject(wrap);
    card.position.set(0, chipH(t, obj) + 0.5, 0);
    obj.add(card);
  }
  function hideCard() {
    if (card) {
      drop(card);
      card = null;
    }
  }
  const says = [];
  // реплика над человечком g
  function sayAt(g, text, ms = 0) {
    const s = label(`<span>${esc(text)}</span>`, 'say', g, 0, 1.75 / g.userData.s, 0);
    says.push(s);
    if (ms) setTimeout(() => drop(s), ms);
  }
  function clearSay() {
    says.splice(0).forEach(drop);
  }

  // ════════════════════════════════════════════════════════ эффекты ══
  const conf = [];
  function confetti() {
    const cols = [0xffc21a, 0x2f6f73, 0xb5523b, 0x3b4d7a, 0xffffff];
    for (let i = 0; i < 160; i++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(0.12, 0.07),
        new THREE.MeshBasicMaterial({color: cols[i % cols.length], side: THREE.DoubleSide}),
      );
      m.position.set(
        geo.MID + (Math.random() - 0.5) * geo.LEN + root.position.x,
        4 + Math.random() * 2 + root.position.y,
        (Math.random() - 0.5) * 5,
      );
      m.userData.v = new THREE.Vector3((Math.random() - 0.5) * 0.8, -1.2 - Math.random(), (Math.random() - 0.5) * 0.8);
      m.userData.r = new THREE.Vector3(Math.random() * 6, Math.random() * 6, 0);
      scene.add(m);
      conf.push(m);
    }
    setTimeout(() => conf.splice(0).forEach(m => scene.remove(m)), 4500);
  }
  async function bounce(g, h = 0.25) {
    const y0 = g.position.y;
    await tween(g.position, {y: y0 + h}, 140, 'out');
    await tween(g.position, {y: y0}, 200, 'io');
  }
  async function takeoff() {
    camS.follow = false;
    camS.zoom = 0.55;
    beamOff();
    await tween(root.position, {x: 18}, 3200, 'in');
    await Promise.all([tween(root.position, {x: 60, y: 10}, 2600, 'in'), tween(root.rotation, {z: 0.18}, 1800, 'io')]);
  }

  // ═════════════════════════════════════════════════ камера и цикл ══
  let lastW = 0,
    lastH = 0,
    lastZ = 0,
    ins = null;
  function fit(force) {
    const Wd = stage.clientWidth,
      H = stage.clientHeight;
    if (force || Wd !== lastW || H !== lastH) {
      renderer.setSize(Wd, H);
      labels.setSize(Wd, H);
      lastW = Wd;
      lastH = H;
      lastZ = 0;
    }
    if (Math.abs(camS.cur - lastZ) > 1e-4) {
      // на телефоне сцену закрывают панели: кадр строится по свободной части экрана (ins — отступы в пикселях),
      // а если она узкая — камера отодвигается, чтобы салон помещался по ширине
      const vw = Math.max(80, Wd - (ins ? ins.left + ins.right : 0)),
        vh = Math.max(80, H - (ins ? ins.top + ins.bottom : 0));
      const hv = (o.viewH / camS.cur) * Math.min(2.2, Math.max(1, 1.25 / (vw / vh))),
        h = (hv * H) / vh,
        aspect = Wd / H;
      cam.left = -h * aspect;
      cam.right = h * aspect;
      cam.top = h;
      cam.bottom = -h;
      if (ins) cam.setViewOffset(Wd, H, (ins.right - ins.left) / 2, (ins.bottom - ins.top) / 2, Wd, H);
      else cam.clearViewOffset();
      cam.updateProjectionMatrix();
      lastZ = camS.cur;
    }
  }
  function setInsets(v) {
    ins = v;
    lastZ = 0;
  }
  window.addEventListener('resize', () => fit(true));
  // качество графики: «высокое» — тени и чёткость, «низкое» — для слабых ПК; автоматически понижается при низком FPS
  const Q = {level: 'high', auto: true, fps: 0};
  try {
    const v = localStorage.getItem('air-gfx');
    if (v === 'high' || v === 'low') {
      Q.level = v;
      Q.auto = false;
    }
  } catch (e) {
    /* нет хранилища */
  }
  const hooks = {pick: null, quality: null};
  function setQuality(l, user) {
    Q.level = l;
    if (user) {
      Q.auto = false;
      try {
        localStorage.setItem('air-gfx', l);
      } catch (e) {
        /* нет */
      }
    }
    const hi = l === 'high';
    renderer.setPixelRatio(hi ? Math.min(1.5, window.devicePixelRatio) : 1);
    renderer.shadowMap.enabled = hi;
    sun.castShadow = hi;
    renderer.shadowMap.needsUpdate = true;
    scene.traverse(x => {
      if (x.material)
        [].concat(x.material).forEach(m => {
          m.needsUpdate = true;
        });
    });
    fit(true);
    if (hooks.quality) hooks.quality(l);
  }
  // перетаскивание — сдвиг камеры, колесо — масштаб, щелчок — выбор объекта
  let drag = null;
  // два пальца — масштаб (щипок)
  const touches = new Map();
  let pinch = null;
  const spread = () => {
    const [a, b] = [...touches.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
  };
  renderer.domElement.addEventListener('pointerdown', e => {
    touches.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (touches.size === 2) {
      pinch = {d: spread(), zoom: camS.zoom};
      drag = null;
      return;
    }
    drag = {x: e.clientX, y: e.clientY, tx: camS.tx, tz: camS.tz, m: false};
  });
  window.addEventListener('pointermove', e => {
    if (touches.has(e.pointerId)) touches.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (pinch && touches.size === 2) {
      camS.zoom = Math.max(0.5, Math.min(2.6, (pinch.zoom * spread()) / pinch.d));
      camS.follow = false;
      return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.x,
      dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.m = true;
    const k = 0.018 / camS.cur;
    camS.tx = drag.tx - (dx * 0.7 + dy * 0.9) * k;
    camS.tz = drag.tz + (dx * 0.7 - dy * 0.9) * k;
    camS.follow = false;
  });
  const lift = e => {
    touches.delete(e.pointerId);
    if (touches.size < 2) pinch = null;
  };
  window.addEventListener('pointerup', e => {
    lift(e);
    if (drag && !drag.m && hooks.pick) pickAt(e);
    drag = null;
  });
  window.addEventListener('pointercancel', e => {
    lift(e);
    drag = null;
  });
  renderer.domElement.addEventListener(
    'wheel',
    e => {
      e.preventDefault();
      camS.zoom = Math.max(0.5, Math.min(2.6, camS.zoom * Math.pow(1.0015, -e.deltaY)));
    },
    {passive: false},
  );
  const ray = new THREE.Raycaster();
  function pickAt(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, (-(e.clientY - r.top) / r.height) * 2 + 1), cam);
    const hit = ray.intersectObjects(scene.children, true).find(h => h.object.userData.pick);
    hooks.pick(hit ? hit.object.userData.pick : null);
  }
  const clock = new THREE.Clock();
  let nFrame = 0,
    fpsN = 0,
    fpsT0 = performance.now(),
    lowStreak = 0;
  function frame() {
    const dt = Math.min(0.05, clock.getDelta()),
      now = performance.now();
    stepTweens(now);
    if (mixer) mixer.update(dt);
    const f = robotG.userData.face ?? -Math.PI / 2;
    let d = f - robotG.rotation.y;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    robotG.rotation.y += d * Math.min(1, dt * 10);
    if (camS.follow) {
      const fx = camS.fx ?? robotG.position.x + 1.2,
        fz = camS.fz ?? robotG.position.z * 0.5;
      camS.tx += (fx - camS.tx) * Math.min(1, dt * 2.5);
      camS.tz += (fz - camS.tz) * dt * 2;
    }
    const fy = camS.follow && camS.fy != null ? camS.fy : 0;
    camS.cx += (camS.tx + root.position.x * 0.6 - camS.cx) * Math.min(1, dt * 4);
    camS.cz += (camS.tz - camS.cz) * Math.min(1, dt * 4);
    camS.cy += (fy + root.position.y * 0.6 - camS.cy) * Math.min(1, dt * 4);
    const zt = camS.follow ? Math.max(camS.zoom, o.followZoom) : camS.zoom;
    camS.cur += (zt - camS.cur) * Math.min(1, dt * 3);
    const sh = camS.shakeT && now - camS.shakeT < 500 ? (1 - (now - camS.shakeT) / 500) * 0.12 : 0;
    const tgt = new THREE.Vector3(camS.cx + (Math.random() - 0.5) * sh, camS.cy, camS.cz + (Math.random() - 0.5) * sh);
    cam.position.copy(tgt).add(CAMDIR.clone().multiplyScalar(60));
    cam.lookAt(tgt);
    fit();
    conf.forEach(m => {
      m.position.addScaledVector(m.userData.v, dt * 2);
      m.rotation.x += m.userData.r.x * dt;
      m.rotation.y += m.userData.r.y * dt;
    });
    // шаг: ноги в противофазе, колено сгибается на возврате, тело слегка покачивается вверх-вниз
    walkers.forEach(g => {
      const L = g.userData.legs,
        t = (now / 1000) * 8.5 * Math.min(Math.max(SPD, 1), 2),
        bob = Math.abs(Math.sin(t)) * 0.035;
      L.forEach((l, i) => {
        const ph = Math.sin(t + i * Math.PI);
        l.hip.rotation.z = ph * 0.5;
        l.knee.rotation.z = Math.max(0, -ph) * 0.75;
        l.hip.position.y = 0.42 + bob;
      });
      if (L.torso) L.torso.position.y = bob;
    });
    // в покое — реже перерисовываем; тени пересчитываем только когда что-то движется
    nFrame++;
    const moving =
      tw.length ||
      conf.length ||
      walkers.size ||
      camS.follow ||
      drag ||
      sh ||
      Math.abs(camS.tx + root.position.x * 0.6 - camS.cx) > 0.002 ||
      Math.abs(camS.tz - camS.cz) > 0.002 ||
      Math.abs(zt - camS.cur) > 0.001;
    if (moving || nFrame % 2 === 0) {
      if (renderer.shadowMap.enabled && (moving || nFrame % 20 === 0)) renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, cam);
      labels.render(scene, cam);
      if (card) card.element.style.zIndex = '100000';
    }
    // замер FPS и автоматическое понижение качества
    fpsN++;
    if (now - fpsT0 > 1000) {
      Q.fps = (fpsN * 1000) / (now - fpsT0);
      fpsN = 0;
      fpsT0 = now;
      if (Q.auto && Q.level === 'high' && now > 4000) {
        lowStreak = Q.fps < 30 ? lowStreak + 1 : 0;
        if (lowStreak >= 3) setQuality('low');
      }
    }
    requestAnimationFrame(frame);
  }
  if (Q.level !== 'high') setTimeout(() => setQuality(Q.level), 0);

  return {
    // для сцены лабы
    scene,
    ground,
    root,
    mat,
    rbox,
    at,
    label,
    setPick,
    bakeMeshes,
    bakeGroup,
    airframe,
    flightBoard,
    geo,
    makePerson,
    setPose,
    walk,
    turn,
    walkers,
    attachTray,
    makeBag,
    dispose,
    sweepLabels,
    resolve,
    sayAt,
    robotHome,
    // общий интерфейс мира для main.js
    loadRobot,
    frame,
    robotGo,
    play,
    aimBeam,
    beamOff,
    chip,
    removeChip,
    clearChips,
    fadeNo,
    showCard,
    hideCard,
    clearSay,
    bounce,
    confetti,
    takeoff,
    hooks,
    camS,
    robot: robotG,
    rScreen,
    HOME,
    setSpeed: v => {
      SPD = v;
    },
    get speed() {
      return SPD;
    },
    face: a => {
      robotG.userData.face = a;
    },
    focus: v => {
      if (!v) {
        camS.fx = camS.fz = camS.fy = null;
        return;
      }
      camS.fx = v.x + 0.6;
      camS.fz = v.z * 0.4;
      camS.fy = Math.max(0, v.y - 0.6) * 0.8;
    },
    shake: () => {
      camS.shakeT = performance.now();
    },
    clearConfetti: () => {
      conf.splice(0).forEach(m => scene.remove(m));
    },
    home: () => {
      camS.tx = o.home.tx;
      camS.tz = o.home.tz;
      camS.zoom = 1;
      camS.follow = false;
    },
    resetRoot: () => {
      root.position.set(0, 0, 0);
      root.rotation.set(0, 0, 0);
    },
    setQuality,
    setInsets,
    get quality() {
      return Q.level;
    },
    get fps() {
      return Q.fps;
    },
    info: () => renderer.info.render,
  };
}
