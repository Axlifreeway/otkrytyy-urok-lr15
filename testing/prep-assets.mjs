// Сборка моделей для /testing/ из исходных наборов (CC0 / MIT) — запускается вручную, результат лежит в testing/assets.
//   node testing/prep-assets.mjs <папка с клонами наборов> <папка, где установлен @gltf-transform>
// Наборы (git clone --depth 1):
//   https://github.com/KayKit-Game-Assets/KayKit-Restaurant-Bits-1.0        — зал, кухня, мебель (CC0, Kay Lousberg)
//   https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0 — гости и курьеры с анимациями (CC0)
//   https://github.com/KenneyNL/Starter-Kit-Racing, Starter-Kit-City-Builder — мотоцикл, грузовик, домики (Kenney, MIT)
import {join} from 'node:path';
import {createRequire} from 'node:module';
const [SRC, GT] = process.argv.slice(2);
const req = createRequire(join(GT, 'package.json'));
const {NodeIO} = req('@gltf-transform/core');
const {ALL_EXTENSIONS} = req('@gltf-transform/extensions');
const {prune, dedup, resample, mergeDocuments, unpartition} = req('@gltf-transform/functions');
const OUT = new URL('./assets/', import.meta.url).pathname;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

// ── персонажи: только тело (без оружия) и нужные анимации ──
const ANIM = ['Idle', 'Walking_A', 'Sit_Chair_Idle', 'Cheer', 'Interact', 'PickUp', 'Sit_Chair_Down', 'Sit_Chair_StandUp'];
const BODY = /(Arm|Body|Head|Leg|Hat|Helmet|Cape)/;
for (const ch of ['Knight', 'Barbarian', 'Mage', 'Rogue', 'Rogue_Hooded']) {
  const doc = await io.read(join(SRC, `KayKit-Character-Pack-Adventures-1.0/addons/kaykit_character_pack_adventures/Characters/gltf/${ch}.glb`));
  const root = doc.getRoot();
  root.listNodes().forEach(n => {
    if (n.getMesh() && !BODY.test(n.getName())) n.dispose();
  });
  root.listAnimations().forEach(a => {
    if (ANIM.includes(a.getName())) return;
    a.listChannels().forEach(c => c.dispose());
    a.listSamplers().forEach(s => s.dispose());
    a.dispose();
  });
  await doc.transform(prune(), dedup(), resample());
  await io.write(join(OUT, `${ch.toLowerCase()}.glb`), doc);
}

// ── набор моделей в один файл: у каждой модели корневой узел с её именем ──
async function pack(files, out) {
  const doc = await io.read(files[0][1]);
  for (const [, f] of files.slice(1)) mergeDocuments(doc, await io.read(f));
  const root = doc.getRoot(),
    scene = root.listScenes()[0];
  root.listScenes().forEach((s, i) => {
    const name = files[i][0];
    const g = doc.createNode(name);
    s.listChildren().forEach(c => g.addChild(c));
    if (s !== scene) s.dispose();
    scene.addChild(g);
  });
  root.setDefaultScene(scene);
  await doc.transform(dedup(), prune(), unpartition());
  await io.write(join(OUT, out), doc);
}
const R = n => [n, join(SRC, `KayKit-Restaurant-Bits-1.0/addons/kaykit_restaurant_bits/Assets/gltf/${n}.gltf`)];
await pack(
  [
    'oven',
    'stove_multi',
    'kitchencounter_straight_A',
    'kitchencounter_straight_B',
    'kitchentable_A_large',
    'table_round_A',
    'chair_A',
    'chair_B',
    'crate_cheese',
    'crate_tomatoes',
    'crate_ham',
    'fridge_A_decorated',
    'shelf_papertowel_decorated',
    'extractorhood',
    'plate',
    'menu',
    'wall',
    'wall_orderwindow',
    'wall_window_open',
    'wall_doorway',
    'floor_kitchen',
    'pillar_A',
    'cuttingboard',
    'pot_A_stew',
    'jar_A_medium',
    'ketchup',
  ].map(R),
  'restaurant.glb',
);
const K = (kit, n) => [n, join(SRC, `${kit}/models/${n}.glb`)];
await pack(
  [
    K('Starter-Kit-Racing', 'vehicle-motorcycle'),
    K('Starter-Kit-Racing', 'vehicle-truck-red'),
    K('Starter-Kit-City-Builder', 'building-small-a'),
    K('Starter-Kit-City-Builder', 'building-small-b'),
    K('Starter-Kit-City-Builder', 'building-small-c'),
    K('Starter-Kit-City-Builder', 'road-straight'),
    K('Starter-Kit-City-Builder', 'pavement'),
    K('Starter-Kit-City-Builder', 'grass-trees'),
  ],
  'street.glb',
);
console.log('готово');
