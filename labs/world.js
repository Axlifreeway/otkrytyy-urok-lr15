/* Тетради «Аэропорт» — общий мир: авиакомпании, направления, схема салона. */
'use strict';
const WORLD = (() => {
  // вымышленные авиакомпании (коды — две кириллические буквы)
  const AIRLINES = [['ТА', 'Тура-Авиа'], ['ИР', 'Иртыш Эйр'], ['СК', 'Северный курс'], ['ТБ', 'Тобол Авиа'],
    ['ЯЛ', 'Ялуторовские линии'], ['ПШ', 'Пышма Эйр'], ['ИС', 'Исеть Авиа'], ['ТВ', 'Тавда Авиа']];
  const DESTS = ['Москва', 'Сочи', 'Казань', 'Новосибирск', 'Сургут', 'Санкт-Петербург', 'Калининград',
    'Минеральные Воды', 'Красноярск', 'Ханты-Мансийск', 'Анапа', 'Самара', 'Уфа', 'Иркутск'];
  const GATES = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B5', 'B6', 'C2'];

  const L4 = ['A', 'C', 'D', 'F'], L6 = ['A', 'B', 'C', 'D', 'E', 'F'];
  // Схема салона: нос слева. biz — число рядов бизнеса (4 кресла), rows — всего рядов.
  function plane(o) {
    const {x0, y0, rows, biz, pitchB = 30, pitchE = 26, sw = 20, sh = 17, wing = 40} = o;
    const H = o.h || 150;
    const aisle = y0 + H / 2;
    const GEO = {};
    let x = x0 + 70;
    const firstX = x;
    for (let r = 1; r <= rows; r++) {
      const isB = r <= biz;
      const letters = isB ? L4 : L6;
      const w = isB ? sw + 4 : sw, hh = isB ? sh + 4 : sh;
      const gap = isB ? 4 : 2;
      letters.forEach(L => {
        const side = 'ABC'.includes(L) ? -1 : 1;           // A–C сверху, D–F снизу
        const k = isB ? (L === 'A' || L === 'F' ? 1 : 0) : (L === 'A' || L === 'F' ? 2 : L === 'B' || L === 'E' ? 1 : 0);
        const y = side < 0 ? aisle - 14 - hh - k * (hh + gap) : aisle + 14 + k * (hh + gap);
        GEO[r + L] = {x, y, w, h: hh, row: r, L, cx: x + w / 2, cy: y + hh / 2};
      });
      x += isB ? pitchB : pitchE;
    }
    const lastX = x;
    const top = y0, bot = y0 + H, nose = x0, tail = lastX + 46;
    let svg = `<g class="plane">
      <path d="M${x0 + 300} ${top} L${x0 + 400} ${top - wing} L${x0 + 440} ${top - wing} L${x0 + 400} ${top} Z M${x0 + 300} ${bot} L${x0 + 400} ${bot + wing} L${x0 + 440} ${bot + wing} L${x0 + 400} ${bot} Z" class="wing"/>
      <path d="M${tail - 30} ${top + 2} L${tail + 4} ${top - wing * .55} L${tail + 18} ${top - wing * .55} L${tail + 4} ${top + 24} Z M${tail - 30} ${bot - 2} L${tail + 4} ${bot + wing * .55} L${tail + 18} ${bot + wing * .55} L${tail + 4} ${bot - 24} Z" class="wing"/>
      <path d="M${nose + 64} ${top} L${tail - 20} ${top} Q${tail + 26} ${aisle} ${tail - 20} ${bot} L${nose + 64} ${bot} Q${nose - 6} ${bot} ${nose} ${aisle} Q${nose - 6} ${top} ${nose + 64} ${top} Z" class="fuse"/>
      <path d="M${nose + 22} ${aisle - 22} Q${nose + 30} ${aisle} ${nose + 22} ${aisle + 22}" class="cockpit"/>
      <rect x="${firstX - 26}" y="${top - 3}" width="14" height="6" class="door"/>
      <text x="${firstX - 19}" y="${top - 7}" class="tiny" text-anchor="middle">ВХОД</text>`;
    for (let r = 1; r <= rows; r++) {
      const g = GEO[r + 'A'];
      svg += `<text x="${g.cx}" y="${aisle + 3.5}" class="rowno" text-anchor="middle">${r}</text>`;
    }
    svg += '</g>';
    return {GEO, svg, aisle, door: {x: firstX - 19, y: top}, left: nose, right: tail + 20, top, bot, seats: Object.keys(GEO)};
  }
  const seatsOf = (rows, biz) => { const a = []; for (let r = 1; r <= rows; r++) (r <= biz ? L4 : L6).forEach(L => a.push(r + L)); return a; };
  const fare = (row, biz) => row <= biz ? 'бизнес' : 'эконом';

  // путь пассажира: от двери по проходу до своего ряда, затем к креслу
  function walkPath(P, seat, fromDoor = true) {
    const g = P.GEO[seat];
    if (!g) return null;
    return {x0: P.door.x, y0: P.door.y, ax: P.door.x, ay: P.aisle, bx: g.cx, by: P.aisle, cx: g.cx, cy: g.cy};
  }

  // анимация точки по ломаной (SVG), возвращает Promise
  function moveDot(layer, pts, opt = {}) {
    const ns = 'http://www.w3.org/2000/svg';
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', opt.r || 5);
    c.setAttribute('class', opt.cls || 'walker');
    layer.appendChild(c);
    const dur = opt.dur || 700;
    const segs = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); total += d; }
    return new Promise(res => {
      const t0 = performance.now();
      const step = now => {
        let t = Math.min(1, (now - t0) / dur);
        t = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        let dist = t * total, i = 0;
        while (i < segs.length - 1 && dist > segs[i]) { dist -= segs[i]; i++; }
        const k = segs[i] ? dist / segs[i] : 1;
        const x = pts[i][0] + (pts[i + 1] ? (pts[i + 1][0] - pts[i][0]) * k : 0);
        const y = pts[i][1] + (pts[i + 1] ? (pts[i + 1][1] - pts[i][1]) * k : 0);
        c.setAttribute('cx', x); c.setAttribute('cy', y);
        if (opt.fade) c.setAttribute('opacity', 1 - t);
        if (t < 1) requestAnimationFrame(step); else { if (!opt.keep) c.remove(); res(c); }
      };
      requestAnimationFrame(step);
    });
  }

  // общий стиль SVG-сцен
  const SVGCSS = `
  .zone-t { font-family: var(--cond); font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; fill: var(--ink) }
  .zone-s { font-family: var(--mono); font-size: 10.5px; fill: var(--mute) }
  .tiny { font-family: var(--mono); font-size: 8.5px; fill: var(--mute) }
  .rowno { font-family: var(--mono); font-size: 8.5px; fill: var(--rule2) }
  .fuse { fill: var(--white); stroke: var(--ink); stroke-width: 1.5 }
  .wing { fill: var(--paper2); stroke: var(--rule2); stroke-width: 1 }
  .cockpit { fill: none; stroke: var(--ink); stroke-width: 2 }
  .door { fill: var(--sign); stroke: var(--ink); stroke-width: 1 }
  .seat { fill: var(--white); stroke: var(--rule2); stroke-width: 1 }
  .seat.occ { fill: var(--ink2); stroke: var(--ink); cursor: pointer }
  .seat.biz.occ { fill: var(--ink) }
  .seat.hit { fill: var(--sign); stroke: var(--ink); stroke-width: 1.5 }
  .seat.ghost { fill: none; stroke: var(--blue); stroke-width: 2; stroke-dasharray: 3 2 }
  .seat.extra { fill: var(--bad); stroke: var(--bad) }
  .seat.wrong { stroke: #c27a00; stroke-width: 3 }
  .seat.new { animation: seatpop .6s ease-out }
  .seat.inactive { fill: var(--white); stroke: var(--ink2); stroke-dasharray: 2 2 }
  .walker { fill: var(--sign); stroke: var(--ink); stroke-width: 1.2 }
  .walker.out { fill: var(--bad); stroke: var(--ink) }
  .lock { fill: url(#hatch); stroke: var(--rule2) }
  .lock-t { font-family: var(--cond); font-size: 12px; font-weight: 600; fill: var(--ink2); letter-spacing: .08em; text-transform: uppercase }
  .fkline { stroke: var(--ink); stroke-width: 1.5; fill: none; marker-end: url(#arr) }
  .fklbl { font-family: var(--mono); font-size: 9.5px; fill: var(--ink2) }
  .flash { animation: flash 1s ease-out }
  .rejectz { animation: rejz 1.2s ease-out }
  @keyframes seatpop { 0% { transform-box: fill-box; transform-origin: center; transform: scale(1.8) } 100% { transform: scale(1) } }
  @keyframes flash { 0% { fill: var(--sign) } 100% { } }
  @keyframes rejz { 0%, 60% { stroke: var(--bad); stroke-width: 4 } 100% { } }
  [data-card] { cursor: pointer }`;
  const DEFS = `<defs>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="var(--paper2)"/><line x1="0" y1="0" x2="0" y2="8" stroke="var(--rule)" stroke-width="3"/></pattern>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink)"/></marker>
  </defs>`;

  return {AIRLINES, DESTS, GATES, plane, seatsOf, fare, walkPath, moveDot, SVGCSS, DEFS, L4, L6};
})();
