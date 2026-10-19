// Корпус авиалайнера в разрезе (ЛР-13, ЛР-14): фюзеляж со скруглённым сечением, верх срезан, как на учебном
// разрезе, — дальний борт с началом потолка, ближний — по подоконник; нос с остеклением кабины, хвостовой конус,
// киль с логотипом, стабилизаторы, стреловидные крылья с законцовками, двигатели и шасси.
// Ось самолёта — x (нос в сторону −x), поперёк — z, вверх — y; пол салона — y = 0.
import * as THREE from 'three';

// сечение фюзеляжа (по средней линии обшивки): полуширина W, низ YB, борт прямой до YS; скругления RB (низ) и RT (верх)
const W = 3.03,
  YB = -1.15,
  RB = 1.5,
  YS = 1.6,
  RT = 1.6,
  T = 0.14, // толщина обшивки
  CUT_NEAR = 0.42, // ближний борт срезан по подоконник
  CUT_FAR = (140 / 180) * Math.PI; // дальний — до начала потолка
const Y0 = (YB + YS + RT) / 2; // середина сечения по высоте

const arc = (cx, cy, r, a0, a1, n) =>
  Array.from({length: n + 1}, (_, i) => [cx + r * Math.cos(a0 + ((a1 - a0) * i) / n), cy + r * Math.sin(a0 + ((a1 - a0) * i) / n)]);
// равномерно по длине: n точек вдоль замкнутого контура
function resample(pts, n) {
  const P = [...pts, pts[0]],
    acc = [0];
  for (let i = 1; i < P.length; i++) acc.push(acc[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const L = acc[acc.length - 1],
    out = [];
  for (let j = 0, i = 1; j < n; j++) {
    const d = (L * j) / n;
    while (acc[i] < d) i++;
    const f = (d - acc[i - 1]) / (acc[i] - acc[i - 1] || 1);
    out.push([P[i - 1][0] + (P[i][0] - P[i - 1][0]) * f, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * f]);
  }
  return out;
}
const dedupe = pts => pts.filter((p, i) => !i || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-4);
// средняя линия: открытая (салон) — от ближнего среза вниз, по днищу и вверх по дальнему борту; закрытая — всё сечение
function centerline(closed) {
  const c = W - RB,
    t = W - RT;
  const p = [
    [W, CUT_NEAR],
    [W, YB + RB],
  ];
  p.push(...arc(c, YB + RB, RB, 0, -Math.PI / 2, 14), ...arc(-c, YB + RB, RB, -Math.PI / 2, -Math.PI, 14), [-W, YS]);
  if (!closed) p.push(...arc(-t, YS, RT, Math.PI, CUT_FAR, 6));
  else p.push(...arc(-t, YS, RT, Math.PI, Math.PI / 2, 12), ...arc(t, YS, RT, Math.PI / 2, 0, 12), [W, YB + RB + 0.6]);
  return dedupe(p);
}
// сдвиг линии по нормали наружу (+d) или внутрь (−d); «наружу» — от середины сечения
function offset(pts, d) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)],
      b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = b[1] - a[1],
      ny = -(b[0] - a[0]);
    const L = Math.hypot(nx, ny) || 1;
    nx /= L;
    ny /= L;
    if (nx * p[0] + ny * (p[1] - Y0) < 0) {
      nx = -nx;
      ny = -ny;
    }
    return [p[0] + nx * d, p[1] + ny * d];
  });
}
// контур (z, y) → THREE.Shape в координатах (u = −z, v = y): после поворота на +90° вокруг y выдавливание идёт вдоль +x
const shapeOf = (outer, inner) => {
  const s = new THREE.Shape();
  outer.forEach(([z, y], i) => (i ? s.lineTo(-z, y) : s.moveTo(-z, y)));
  inner
    .slice()
    .reverse()
    .forEach(([z, y]) => s.lineTo(-z, y));
  s.closePath();
  return s;
};
const along = (shape, len) => {
  const g = new THREE.ExtrudeGeometry(shape, {depth: len, bevelEnabled: false, curveSegments: 2});
  g.rotateY(Math.PI / 2);
  return g;
};

// «лофт» по сечениям: ring(t) → массив точек [x, y, z]; colorOf(t, i, p0) → [r, g, b] или null
function loft(rings, colorOf, closedRing) {
  const n = rings[0].length,
    pos = [],
    col = [],
    idx = [];
  rings.forEach((ring, k) =>
    ring.forEach((p, i) => {
      pos.push(p[0], p[1], p[2]);
      col.push(...(colorOf(k, i) || [1, 1, 1]));
    }),
  );
  const m = closedRing ? n : n - 1;
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < m; i++) {
      const a = k * n + i,
        b = k * n + ((i + 1) % n),
        c = (k + 1) * n + i,
        d = (k + 1) * n + ((i + 1) % n);
      idx.push(a, c, b, b, c, d);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
const rgb = hex => {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
};

// плоская деталь по контуру в плоскости (a, b) толщиной h с фаской
const slab = (pts, h, bevel = 0.04) => {
  const s = new THREE.Shape();
  pts.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b)));
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: h,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 2,
  });
  g.translate(0, 0, -h / 2);
  return g;
};

// E — движок (root, mat, rbox, at, flatLabel); p — параметры: rows, wingRow, engRow, engZ; geo — LEN0, LEN1, MID, LEN
export function buildExterior(E, p, geo, seatX) {
  const {root, mat, rbox, at} = E;
  const {LEN0, LEN1, LEN} = geo;
  const WHITE = 0xfbf8f2,
    GREY = 0xe6e8ea,
    DARK = 0x2a2f38,
    SUN = 0xffc21a,
    NAVY = 0x3b4d7a;
  const add = (g, color, o = {}) => {
    const m = new THREE.Mesh(g, o.material || mat(color, o.mat || {}));
    m.castShadow = true;
    m.receiveShadow = true;
    if (o.keep) m.userData.keep = true;
    root.add(m);
    return m;
  };

  // ═══════════════════════════════════════════ фюзеляж (открытый сверху)
  const mid = centerline(false);
  add(along(shapeOf(offset(mid, T / 2), offset(mid, -T / 2)), LEN), WHITE).position.x = LEN0;
  // ливрея: жёлтая полоса и тёмно-синяя под ней — по обшивке ближнего борта
  const band = (y0, y1, c) => {
    const part = offset(mid, T / 2 + 0.006).filter(([z, y]) => z > 0 && y >= y0 && y <= y1);
    if (part.length < 2) return;
    add(along(shapeOf(offset(part, 0.012), part), LEN + 0.02), c).position.x = LEN0 - 0.01;
  };
  band(-0.2, 0.14, SUN);
  band(-0.42, -0.26, NAVY);
  // переборки: перед салоном (до потолка, с дверью в кабину) и за ним (по пояс)
  const ring = centerline(true),
    innerRing = offset(ring, -T / 2);
  const wall = maxY => {
    const pts = innerRing.filter(([, y]) => y <= maxY);
    const s = new THREE.Shape();
    pts.forEach(([z, y], i) => (i ? s.lineTo(-z, y) : s.moveTo(-z, y)));
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {depth: 0.14, bevelEnabled: false});
  };
  const front = add(wall(3.0).rotateY(Math.PI / 2), 0xf7f4ee);
  front.position.x = LEN0 - 0.14;
  const cdoor = rbox(0.05, 1.75, 0.8, 0.03, 0x8b857a);
  at(cdoor, LEN0 + 0.02, 0.9, 0.9);
  root.add(cdoor);
  add(wall(1.55).rotateY(Math.PI / 2), 0xf7f4ee).position.x = LEN1;

  // ═══════════════════════════════════════════ нос с остеклением кабины
  // сечение передискретизировано равномерно (много точек — чтобы окна кабины вышли чёткими, а не размытыми)
  const outerRing = resample(offset(ring, T / 2), 180);
  const NOSE = 5.2,
    NR = 44,
    TOP = YS + RT + T / 2,
    BOT = YB - T / 2,
    TIP_Y = 0.35; // кончик носа — ниже середины: верх скатывается к стеклу, низ почти плоский
  const noseRings = [];
  for (let k = 0; k <= NR; k++) {
    const t = k / NR,
      x = LEN0 - NOSE * t,
      up = Math.pow(Math.max(0, 1 - Math.pow(t, 1.5)), 0.62), // верх (с остеклением) спадает раньше
      dn = Math.pow(Math.max(0, 1 - Math.pow(t, 2.3)), 0.5), // низ — полный эллипс
      yc = Y0 + (TIP_Y - Y0) * Math.pow(t, 0.9);
    noseRings.push(
      outerRing.map(([z, y]) => {
        const w = Math.min(1, Math.max(0, (y - BOT) / (TOP - BOT))), // 0 — днище, 1 — крыша
          sc = Math.max(0.02, dn + (up - dn) * w * w * (3 - 2 * w));
        return [x, yc + (y - Y0) * sc, z * sc];
      }),
    );
  }
  // окна кабины: в координатах (t вдоль носа, угол сечения: 90° — верх, 0° — ближний борт)
  const PANES = [
    [0.6, 0.75, 60, 87], // лобовые
    [0.6, 0.75, 93, 120],
    [0.55, 0.69, 33, 54], // боковые
    [0.55, 0.69, 126, 147],
    [0.49, 0.6, 14, 29], // форточки
    [0.49, 0.6, 151, 166],
  ];
  const glass = rgb(DARK),
    sun = rgb(SUN),
    navy = rgb(NAVY),
    grey = rgb(0xd5d9dd);
  const nose = add(
    loft(
      noseRings,
      (k, i) => {
        const t = k / NR,
          [z, y] = outerRing[i],
          ang = (Math.atan2(y - Y0, z) * 180) / Math.PI;
        if (PANES.some(([t0, t1, a0, a1]) => t >= t0 && t <= t1 && ang >= a0 && ang <= a1)) return glass;
        if (t > 0.9) return grey; // обтекатель локатора
        if (t < 0.62 && z > 0 && y > -0.2 && y < 0.14) return sun;
        if (t < 0.62 && z > 0 && y > -0.42 && y < -0.26) return navy;
        return null;
      },
      true,
    ),
    0,
    {material: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.45}), keep: true},
  );
  nose.userData.keep = true;

  // ═══════════════════════════════════════════ хвостовой конус (открытый, брюхо уходит вверх)
  const TAIL = 6.2,
    TR = 18,
    tailRings = [];
  const outerMid = offset(mid, T / 2);
  for (let k = 0; k <= TR; k++) {
    const t = k / TR,
      sc = 1 - 0.8 * Math.pow(t, 1.3),
      yc = Y0 + 1.3 * Math.pow(t, 1.25),
      x = LEN1 + TAIL * t;
    tailRings.push(outerMid.map(([z, y]) => [x, yc + (y - Y0) * sc, z * sc]));
  }
  add(
    loft(tailRings, (k, i) => {
      const [z, y] = outerMid[i];
      if (z > 0 && y > -0.2 && y < 0.14) return sun;
      if (z > 0 && y > -0.42 && y < -0.26) return navy;
      return null;
    }),
    0,
    {material: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.6, side: THREE.DoubleSide}), keep: true},
  );
  const apu = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.35, 16).rotateZ(Math.PI / 2), mat(0x6d747a));
  apu.position.set(LEN1 + TAIL + 0.12, Y0 + 1.3, 0);
  root.add(apu);

  // ═══════════════════════════════════════════ киль с логотипом и стабилизаторы
  const xf = LEN1 + 1.6, // передняя кромка у корня
    FY0 = 2.5,
    FY1 = 5.4;
  add(
    slab(
      [
        [xf, FY0],
        [xf + 3.6, FY0],
        [xf + 4.25, FY1],
        [xf + 2.95, FY1],
      ],
      0.16,
    ),
    SUN,
  );
  add(
    slab(
      [
        [xf + 2.85, FY1 - 0.3],
        [xf + 4.2, FY1 - 0.3],
        [xf + 4.26, FY1 + 0.04],
        [xf + 2.93, FY1 + 0.04],
      ],
      0.18,
      0.02,
    ),
    DARK,
  );
  E.flatLabel('SQL', root, {x: xf + 2.55, y: 3.75, z: 0.13, h: 0.66, color: '#22252b', bg: null});
  [-1, 1].forEach(s => {
    const st = add(
      slab(
        [
          [0, 0],
          [1.8, 0],
          [2.3, 2.2],
          [1.5, 2.2],
        ],
        0.1,
        0.03,
      ),
      GREY,
    );
    st.rotation.x = (s * Math.PI) / 2;
    st.position.set(LEN1 + 3.7, 2.25, s * 1.3);
  });

  // ═══════════════════════════════════════════ крылья, двигатели, шасси
  const wx = seatX(p.wingRow) - 1.4, // передняя кромка у корня
    ROOT = 3.4,
    TIP = 1.05,
    SWEEP = 2.9,
    SPAN = 6.6,
    WY = -0.82;
  [-1, 1].forEach(s => {
    const g = new THREE.Group();
    g.position.set(0, WY, s * 2.55);
    g.rotation.x = s * 0.07; // поперечное V: законцовки чуть выше корня
    root.add(g);
    const wing = new THREE.Mesh(
      slab(
        [
          [wx, 0],
          [wx + ROOT, 0],
          [wx + SWEEP + TIP, SPAN],
          [wx + SWEEP, SPAN],
        ],
        0.14,
        0.05,
      ),
      mat(GREY),
    );
    wing.rotation.x = s * (Math.PI / 2);
    wing.castShadow = wing.receiveShadow = true;
    g.add(wing);
    // закрылки — тёмная полоса у задней кромки
    const flap = new THREE.Mesh(
      slab(
        [
          [wx + ROOT - 0.45, 0.4],
          [wx + ROOT - 0.05, 0.4],
          [wx + SWEEP + TIP - 0.32, SPAN * 0.68],
          [wx + SWEEP + TIP - 0.62, SPAN * 0.68],
        ],
        0.16,
        0.01,
      ),
      mat(0xc9ccd0),
    );
    flap.rotation.x = s * (Math.PI / 2);
    g.add(flap);
    // законцовка — вверх
    const wl = new THREE.Mesh(
      slab(
        [
          [0, 0],
          [TIP, 0],
          [TIP + 0.35, 0.95],
          [0.55, 0.95],
        ],
        0.08,
        0.02,
      ),
      mat(SUN),
    );
    wl.position.set(wx + SWEEP, 0, s * SPAN);
    wl.castShadow = true;
    g.add(wl);
    // двигатель под крылом: гондола, воздухозаборник, вентилятор с коком, сопло, пилон
    const ez = p.engZ - 2.55,
      le = wx + (SWEEP * ez) / SPAN;
    const eng = new THREE.Group();
    eng.position.set(le - 0.5, -0.55, s * ez);
    g.add(eng);
    const nac = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.42, 2.1, 28, 1, true).rotateZ(Math.PI / 2),
      mat(GREY, {side: THREE.DoubleSide}),
    );
    nac.castShadow = true;
    eng.add(nac);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.07, 10, 28).rotateY(Math.PI / 2), mat(0xc9ccd0, {metalness: 0.4, r: 0.4}));
    lip.position.x = -1.05;
    eng.add(lip);
    const fan = new THREE.Mesh(new THREE.CircleGeometry(0.44, 28).rotateY(-Math.PI / 2), mat(0x3d4250));
    fan.position.x = -0.85;
    eng.add(fan);
    const spin = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.32, 16).rotateZ(Math.PI / 2), mat(0xd8dde1, {metalness: 0.3}));
    spin.position.x = -0.98;
    eng.add(spin);
    const noz = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 20).rotateZ(-Math.PI / 2), mat(0x6d747a, {metalness: 0.3}));
    noz.position.x = 1.3;
    eng.add(noz);
    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.505, 0.49, 0.22, 28, 1, true).rotateZ(Math.PI / 2),
      mat(SUN, {side: THREE.DoubleSide}),
    );
    stripe.position.x = -0.45;
    eng.add(stripe);
    const pyl = rbox(1.6, 0.42, 0.12, 0.04, GREY);
    pyl.position.set(0.55, 0.42, 0);
    eng.add(pyl);
    // основная стойка шасси — у корня крыла
    const gx = wx + ROOT * 0.62;
    const strut = rbox(0.12, 0.85, 0.12, 0.03, 0x8b857a);
    at(strut, gx, -0.55, s * 0.45);
    g.add(strut);
    [-0.2, 0.2].forEach(dx => {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.22, 20).rotateX(Math.PI / 2), mat(0x22252b));
      wh.position.set(gx + dx, -1.02, s * 0.45);
      wh.castShadow = true;
      g.add(wh);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.24, 14).rotateX(Math.PI / 2), mat(0xc9ccd0));
      hub.position.copy(wh.position);
      g.add(hub);
    });
  });
  // передняя стойка — под носом
  const nx = LEN0 - 1.9;
  const ns = rbox(0.1, 0.62, 0.1, 0.03, 0x8b857a);
  at(ns, nx, -1.62, 0);
  root.add(ns);
  [-0.13, 0.13].forEach(dz => {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 18).rotateX(Math.PI / 2), mat(0x22252b));
    wh.position.set(nx, -1.9, dz);
    wh.castShadow = true;
    root.add(wh);
  });
}
// внутренняя граница салона: для окон и полок по дальнему борту
export const CABIN = {W, T, inner: W - T / 2, YS, CUT_NEAR};
