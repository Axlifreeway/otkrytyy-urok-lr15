# /testing/ — проба: ЛР-17 в пиццерии из готовых моделей

Та же ЛР-17 «Итоги смены» (уровни, проверка, тренировка — из `lr17-3d/src`), но зал собран не из процедурных
коробок, а из готовых бесплатных моделей. Страница — чтобы посмотреть, как это выглядит; настоящая ЛР-17 не меняется.

- Открыть: `/testing/`. Лаба закрыта, как ЛР-17: на экране «Пиццерия ещё закрыта» → «Преподаватель» → код → демо.
  Или откройте ЛР-17 в панели. Прогресс хранится отдельно от настоящей ЛР-17 (`pizza-kit-lr17-…`).
- Сцена — общая `common/three/pizzeria.js` с параметром `kit`; обстановка и люди — `src/kit.js`.
- Модели — `assets/*.glb` (≈3,4 МБ, грузятся при открытии), собраны `prep-assets.mjs` из исходных наборов.

## Модели и лицензии

| Что | Набор | Автор | Лицензия |
|---|---|---|---|
| стены, плитка, кухонные стойки, печи, столы, стулья, ящики, тарелки | [KayKit Restaurant Bits 1.0](https://github.com/KayKit-Game-Assets/KayKit-Restaurant-Bits-1.0) | Kay Lousberg | CC0 |
| гости и курьеры с анимациями (оружие убрано, оставлено 8 анимаций) | [KayKit Character Pack: Adventurers 1.0](https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0) | Kay Lousberg | CC0 |
| мотоцикл курьеров, дома за окном | [Starter Kit Racing](https://github.com/KenneyNL/Starter-Kit-Racing), [Starter Kit City Builder](https://github.com/KenneyNL/Starter-Kit-City-Builder) | Kenney | модели — CC0 (код наборов — MIT) |
| робот-СУБД | [Starter Kit 3D Platformer](https://github.com/KenneyNL/Starter-Kit-3D-Platformer) | Kenney | CC0 / MIT, как во всех лабах |

Quaternius (CC0) в пробу не вошёл: его модели раздаются с quaternius.com и Google Drive, а из среды сборки они недоступны.
Если скачать нужный набор вручную и положить рядом — его можно подключить так же, через `prep-assets.mjs` и `src/kit.js`.

## Пересобрать модели

    git clone --depth 1 https://github.com/KayKit-Game-Assets/KayKit-Restaurant-Bits-1.0 SRC/…   # и остальные наборы из таблицы
    npm install --prefix GT @gltf-transform/core@4 @gltf-transform/functions@4 @gltf-transform/extensions@4
    node testing/prep-assets.mjs SRC GT
    npm run build
