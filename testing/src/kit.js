// Пробная сборка пиццерии из готовых моделей (см. testing/README.md):
//   зал, кухня и мебель — KayKit Restaurant Bits (CC0, Kay Lousberg);
//   гости и курьеры с анимациями — KayKit Character Pack: Adventurers (CC0, оружие убрано);
//   мотоцикл курьеров и дома за окном — Kenney Starter Kits (MIT, kenney.nl); робот-СУБД — Kenney, как в остальных лабах.
// Модели собраны скриптом testing/prep-assets.mjs и лежат в testing/assets/.
// loadKit() грузит их заранее и возвращает kit для createPizzeria (common/three/pizzeria.js).
import {THREE, V} from '../../common/three/engine.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {clone as cloneSkinned} from 'three/examples/jsm/utils/SkeletonUtils.js';

const K = 0.52; // масштаб KayKit: у них человек ~2,5 м, у нас ~1,3
const PEOPLE = ['knight', 'barbarian', 'mage', 'rogue', 'rogue_hooded'];
const ANIM = {sit: 'Sit_Chair_Idle', stand: 'Idle', walk: 'Walking_A', up: 'Cheer'};

export async function loadKit(base = 'assets/') {
  const L = new GLTFLoader();
  const [rest, street, ...people] = await Promise.all(
    ['restaurant.glb', 'street.glb', ...PEOPLE.map(p => p + '.glb')].map(f => L.loadAsync(base + f)),
  );
  const parts = new Map();
  [rest, street].forEach(g =>
    g.scene.children.forEach(c => {
      c.traverse(m => {
        if (m.isMesh) m.castShadow = m.receiveShadow = true;
      });
      parts.set(c.name.replace(/_\d+$/, ''), c);
    }),
  );
  const who = new Map(PEOPLE.map((p, i) => [p, people[i]]));

  // анимации всех человечков — одними часами
  const live = new Set();
  const clock = new THREE.Clock();
  (function tick() {
    const dt = Math.min(clock.getDelta(), 0.1);
    live.forEach(h => {
      if (!h.g.parent) return live.delete(h); // человечек убран со сцены
      h.mixer.update(dt);
    });
    requestAnimationFrame(tick);
  })();

  // поставить копию модели: x, y, z, поворот, масштаб (число или [sx, sy, sz])
  const put = (parent, name, x, y, z, ry = 0, s = K) => {
    const src = parts.get(name);
    if (!src) return null;
    const o = src.clone();
    o.position.set(x, y, z);
    o.rotation.y = ry;
    if (Array.isArray(s)) o.scale.set(...s);
    else o.scale.setScalar(s);
    parent.add(o);
    return o;
  };

  function room(E, G) {
    const {root, rbox, at} = E;
    const {LEN0, LEN1, MID, LEN, WALLZ, FRONT, SHOWZ, TABLEZ, PILEZ, DOORZ, showW, TABLES} = G;
    // пол: кухонная плитка KayKit у кухни, светлые доски в зале
    const slab = rbox(LEN + 1.4, 0.3, FRONT - WALLZ + 0.2, 0.06, 0xd9c7a8);
    at(slab, MID, -0.15, (FRONT + WALLZ) / 2);
    root.add(slab);
    for (let x = LEN0 - 0.7 + 1.04; x < LEN1 + 0.7; x += 2.08)
      for (let z = WALLZ + 1.04; z < -0.4; z += 2.08) put(root, 'floor_kitchen', x, -0.25, z, 0, [K, K, K]);
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
    // стены KayKit: задняя с окнами, левая с дверным проёмом
    let i = 0;
    for (let x = LEN0 - 0.7 + 1.04; x < LEN1 + 0.7; x += 2.08, i++)
      put(root, i % 3 === 1 ? 'wall_window_open' : 'wall', x, 0, WALLZ - 0.1, 0);
    for (let z = WALLZ + 1.04; z < FRONT; z += 2.08)
      put(root, Math.abs(z - DOORZ) < 1.04 ? 'wall_doorway' : 'wall', LEN0 - 0.8, 0, z, Math.PI / 2);
    put(root, 'pillar_A', LEN0 - 0.8, 0, WALLZ - 0.1);
    E.flatLabel('SQL PIZZA · кухня', root, {x: MID - 1.4, y: 1.85, z: WALLZ + 0.05, h: 0.36, color: '#22252b', bg: '#ffc21a'});
    E.flatLabel('ДОСТАВКА', root, {x: LEN0 - 0.6, y: 1.85, z: DOORZ, ry: Math.PI / 2, h: 0.26, color: '#22252b', bg: '#ffc21a'});
    // за окном — городок Kenney
    const HOUSES = ['building-small-a', 'building-small-b', 'building-small-a', 'building-small-c'];
    for (let x = LEN0 - 1.5, k = 0; x < LEN1 + 3; x += 1.9, k++) put(root, HOUSES[k % 4], x, -0.3, WALLZ - 2.6, 0, 1.5);
    // витрина: кухонные стойки, на них — пиццы (таблица pizza)
    const n = Math.round(showW / 1.04);
    for (let k = 0; k < n; k++)
      put(root, k % 2 ? 'kitchencounter_straight_B' : 'kitchencounter_straight_A', LEN0 + 0.4 + 0.52 + k * 1.04, 0, SHOWZ, 0, [
        K,
        0.82,
        0.42,
      ]);
    E.flatLabel('меню · таблица pizza', root, {x: LEN0 + 1.5, y: 0.42, z: SHOWZ + 0.44, h: 0.15});
    // две печи и плита справа
    [LEN1 - 1.6, LEN1 - 0.4].forEach((x, k) => {
      put(root, 'oven', x, 0, WALLZ + 0.65, 0, 0.6);
      E.flatLabel(`ПЕЧЬ ${k + 1}`, root, {x, y: 1.32, z: WALLZ + 1.45, h: 0.14, color: '#22252b', bg: 'rgba(255,250,240,.88)'});
    });
    // ящики с продуктами у левой стены
    put(root, 'crate_cheese', LEN0 - 0.1, 0, SHOWZ + 0.2, 0.2, 0.3);
    put(root, 'crate_tomatoes', LEN0 - 0.1, 0, SHOWZ + 0.9, -0.1, 0.3);
    put(root, 'crate_ham', LEN0 - 0.1, 0.28, SHOWZ + 0.55, 0.4, 0.3);
    // стол выдачи заказов: длинные кухонные столы
    const tw = 3 * 0.85;
    for (let x = LEN0 + 0.6 + tw / 2; x < LEN1 - 0.4; x += tw) put(root, 'kitchentable_A_large', x, 0, TABLEZ, 0, [0.85, 0.62, 0.38]);
    E.flatLabel('выдача заказов · таблица orders', root, {x: LEN0 + 1.9, y: 0.66, z: TABLEZ + 0.4, h: 0.13});
    // полоса итогов
    const strip = rbox(LEN - 0.8, 0.01, 0.62, 0.01, 0xf3e4c4);
    at(strip, MID + 0.2, 0.008, PILEZ);
    strip.castShadow = false;
    root.add(strip);
    E.flatLabel('итоги · GROUP BY', root, {x: LEN0 + 0.9, y: 0.016, z: PILEZ, rx: -Math.PI / 2, h: 0.18});
    // курьеры и их мотоцикл (Kenney)
    put(root, 'vehicle-motorcycle', LEN0 + 0.9, 0, 4.0, Math.PI / 2, 0.5);
    E.flatLabel('курьеры · courier', root, {x: LEN0 + 0.3, y: 0.016, z: 3.35, rx: -Math.PI / 2, h: 0.18});
    // зал: круглые столики KayKit, стулья по двум сторонам
    const seats = [];
    TABLES.forEach(x => {
      put(root, 'table_round_A', x, 0, 3.0, 0, [0.36, 0.68, 0.36]);
      put(root, 'plate', x - 0.2, 0.68, 2.85, 0, 0.3);
      put(root, 'plate', x + 0.2, 0.68, 3.15, 0, 0.3);
      [-0.36, 0.36].forEach(dx =>
        [
          [2.25, 0, Math.PI / 2],
          [3.75, Math.PI, -Math.PI / 2],
        ].forEach(([z, cr, rot]) => {
          put(root, dx < 0 ? 'chair_A' : 'chair_B', x + dx, 0, z, cr, K);
          seats.push({p: V(x + dx, 0, z), rot});
        }),
      );
    });
    seats.sort((a, b) => a.p.x - b.p.x || a.p.z - b.p.z);
    E.flatLabel('зал · гости · client', root, {x: TABLES[0] - 0.4, y: 0.016, z: 4.25, rx: -Math.PI / 2, h: 0.18});
    return {seats};
  }

  // человечек KayKit: снаружи — группа в соглашениях движка (поворот 0 — лицом к -x), внутри — модель (лицом к +z)
  function person(row, role, rnd) {
    const kind = role === 'courier' ? (row.id % 2 ? 'rogue_hooded' : 'rogue') : PEOPLE[Math.floor(rnd() * 4)];
    const src = who.get(kind);
    const g = new THREE.Group(),
      m = cloneSkinned(src.scene);
    m.scale.setScalar(K);
    m.rotation.y = -Math.PI / 2;
    m.traverse(x => {
      if (x.isMesh) {
        x.castShadow = true;
        x.frustumCulled = false; // у анимированных моделей рамка не успевает за позой
      }
    });
    g.add(m);
    const mixer = new THREE.AnimationMixer(m);
    const acts = new Map(src.animations.map(a => [a.name, mixer.clipAction(a)]));
    g.userData = {s: 1, kit: {mixer, acts, cur: null}};
    live.add({g, mixer});
    return g;
  }
  function pose(g, p) {
    const k = g.userData.kit;
    if (!k) return;
    const a = k.acts.get(ANIM[p] || 'Idle');
    if (!a || a === k.cur) return;
    a.reset().play();
    if (k.cur) k.cur.crossFadeTo(a, 0.25, false);
    k.cur = a;
  }
  return {room, person, pose};
}
