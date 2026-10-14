# Проба: ЛР-14 «Бортпитание» — один запрос UPDATE

Открыть `index.html` (Chrome / Edge / Яндекс). Нужен интернет только для шрифтов и,
если страница открыта двойным щелчком, для PostgreSQL в браузере (PGlite с CDN).
Через локальный сервер или GitHub Pages PGlite берётся из `../mvp/vendor/pglite`.

`?n=12` в адресе — другая рассадка (номер в журнале).

## Что внутри
* `game.js` — собранная игра: Three.js + модель робота + логика (один файл, работает без сборки).
* `src/main.js` — исходник; пересборка: `npx esbuild src/main.js --bundle --format=iife --minify --outfile=game.js`
  (рядом нужен `npm i three@0.170.0`).

## Откуда взято (всё бесплатно, можно в учебных и коммерческих целях)
* Three.js 0.170 — npm `three`, лицензия MIT.
* Робот-СУБД — `character.glb` из Kenney Starter Kit 3D Platformer
  (github.com/KenneyNL/Starter-Kit-3D-Platformer), лицензия MIT; встроен в `game.js`.
* Шрифты Rubik и JetBrains Mono — Google Fonts, OFL.
* Пассажиры, кресла, самолёт — собраны кодом из простых форм.
