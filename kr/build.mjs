// Контрольные работы ОПЦ.07 в Word: node kr/build.mjs → kr/out/КР-N.docx (50 вариантов) и КР-N-ключ.docx (для преподавателя).
// Вариант — сочетание трёх вопросов из банков A, B, C (kr/kr1.mjs … kr4.mjs). Соседние варианты не делят ни одного вопроса.
import {createRequire} from 'node:module';
import fs from 'node:fs';
import {SHOP} from './schema.mjs';

const require = createRequire(import.meta.url);
let docx;
try {
  docx = require('docx');
} catch (e) {
  docx = require('/opt/node-tools/node_modules/docx');
}
const {Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType, PageBreak, Footer, PageNumber} = docx;

const N = 50;
const FONT = 'Times New Roman',
  MONO = 'Courier New';
const PAGE_W = 11906 - 2 * 1134; // A4, поля 2 см → ширина текста в DXA

// ── сочетания вопросов: 50 разных троек, у соседних вариантов (v, v+1, v+2) нет общих вопросов ──
function plan(nA, nB, nC) {
  for (let mb = 1; mb < nB; mb++)
    for (let mc = 1; mc < nC; mc++)
      for (let sb = 0; sb < nB; sb++) {
        const rows = [];
        for (let v = 0; v < N; v++) rows.push([v % nA, (v * mb + sb + Math.floor(v / nB)) % nB, (v * mc + 2 * Math.floor(v / nC)) % nC]);
        const keys = new Set(rows.map(r => r.join('.')));
        if (keys.size !== N) continue;
        let ok = true;
        for (let v = 0; v < N && ok; v++)
          for (const d of [1, 2]) {
            const w = rows[v + d];
            if (w && (w[0] === rows[v][0] || w[1] === rows[v][1] || w[2] === rows[v][2])) ok = false;
          }
        if (ok) return rows;
      }
  throw new Error('нет подходящего распределения вопросов');
}

// ── строительные блоки ──
const run = (text, o = {}) => new TextRun({text, font: o.mono ? MONO : FONT, size: o.size || 24, bold: o.bold, italics: o.italics, color: o.color});
const para = (children, o = {}) =>
  new Paragraph({
    children: Array.isArray(children) ? children : [run(children, o)],
    alignment: o.align || AlignmentType.JUSTIFIED,
    spacing: {before: o.before ?? 0, after: o.after ?? 80, line: o.line || 264},
    indent: o.indent,
    keepNext: o.keepNext,
    border: o.border,
  });
const codeBox = (text, size = 17) => {
  const lines = text.split('\n');
  return new Table({
    width: {size: PAGE_W, type: WidthType.DXA},
    columnWidths: [PAGE_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {size: PAGE_W, type: WidthType.DXA},
            shading: {type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto'},
            margins: {top: 60, bottom: 60, left: 100, right: 100},
            children: lines.map(l => new Paragraph({children: [run(l || ' ', {mono: true, size})], spacing: {after: 0, line: 240}})),
          }),
        ],
      }),
    ],
  });
};
const dataTable = ({head, rows}) => {
  const w = Math.floor(PAGE_W / head.length),
    widths = head.map(() => w);
  const border = {style: BorderStyle.SINGLE, size: 4, color: '808080'};
  const cell = (t, bold) =>
    new TableCell({
      width: {size: w, type: WidthType.DXA},
      borders: {top: border, bottom: border, left: border, right: border},
      shading: bold ? {type: ShadingType.CLEAR, fill: 'E8E8E8', color: 'auto'} : undefined,
      margins: {top: 30, bottom: 30, left: 60, right: 60},
      children: [new Paragraph({children: [run(t, {size: 19, bold})], spacing: {after: 0}})],
    });
  return new Table({
    width: {size: w * head.length, type: WidthType.DXA},
    columnWidths: widths,
    rows: [new TableRow({tableHeader: true, children: head.map(h => cell(h, true))}), ...rows.map(r => new TableRow({children: r.map(x => cell(x))}))],
  });
};
const gap = (after = 120) => new Paragraph({children: [], spacing: {after}});
const textsOf = q => (Array.isArray(q.q) ? q.q : [q.q]);

// ── вопрос в варианте: номер, текст, данные ──
function questionBlocks(no, q) {
  const out = [],
    t = textsOf(q);
  out.push(para([run(`${no}. `, {bold: true}), run(t[0])], {after: 60, keepNext: !!(q.tab || q.code)}));
  if (q.tab) out.push(dataTable(q.tab), gap(60));
  if (q.code) out.push(codeBox(q.code, 15), gap(60));
  t.slice(1).forEach(x => out.push(para(x, {after: 60})));
  return [...out, gap(100)];
}

const CRITERIA =
  'Каждый вопрос — до 3 баллов: 3 — команда написана полностью и верно, объяснение точное, с примером; 2 — мелкие ошибки в команде или неполное объяснение; 1 — верная идея без рабочей команды или без объяснения; 0 — нет ответа или он неверен по сути. Итог: 8–9 → «5», 6–7 → «4», 4–5 → «3», меньше 4 → «2».';

function variantDoc(K, P, rows) {
  const ch = [];
  rows.forEach((r, v) => {
    const qs = [P.A[r[0]], P.B[r[1]], P.C[r[2]]];
    ch.push(
      para([run(`ОПЦ.07 Базы данных · Контрольная работа № ${K.no}`, {size: 20, color: '555555'})], {align: AlignmentType.LEFT, after: 0}),
      para([run(`«${K.title}»`, {bold: true, size: 26}), run(`        Вариант ${v + 1}`, {bold: true, size: 28})], {
        align: AlignmentType.LEFT,
        after: 80,
      }),
      para([run('ФИО ________________________________   Группа ___________   Дата ___________', {size: 22})], {
        align: AlignmentType.LEFT,
        after: 100,
      }),
      para([run(K.intro, {italics: true, size: 21})], {after: 100}),
    );
    if (K.schema) ch.push(para([run('Учебная база «Интернет-магазин»', {bold: true, size: 21})], {after: 40, keepNext: true}), codeBox(SHOP, 15), gap(120));
    qs.forEach((q, i) => ch.push(...questionBlocks(i + 1, q)));
    ch.push(para([run(CRITERIA, {size: 18, color: '555555'})], {before: 60, after: 0}));
    if (v < rows.length - 1) ch.push(new Paragraph({children: [new PageBreak()]}));
  });
  return ch;
}

function keyDoc(K, P, rows) {
  const ch = [
    para([run(`Ключ к контрольной работе № ${K.no} «${K.title}»`, {bold: true, size: 30})], {align: AlignmentType.LEFT, after: 60}),
    para([run('Только для преподавателя. Ответы — опорные: студент может прийти к верному результату другим запросом; засчитывайте по смыслу.', {italics: true, size: 22})], {after: 120}),
    para([run('Критерии. ', {bold: true, size: 22}), run(CRITERIA, {size: 22})], {after: 160}),
    para([run('Варианты: какие вопросы в каждом', {bold: true, size: 26})], {align: AlignmentType.LEFT, after: 80}),
  ];
  // таблица вариантов: 5 колонок пар «вариант — вопросы»
  const cols = 4,
    per = Math.ceil(N / cols),
    wn = 560,
    w = Math.floor(PAGE_W / cols) - wn;
  const border = {style: BorderStyle.SINGLE, size: 4, color: '999999'};
  const c = (t, bold) =>
    new TableCell({
      width: {size: bold ? wn : w, type: WidthType.DXA},
      borders: {top: border, bottom: border, left: border, right: border},
      children: [new Paragraph({children: [run(t, {size: 19, bold})], spacing: {after: 0}})],
    });
  const trs = [];
  for (let i = 0; i < per; i++) {
    const cells = [];
    for (let k = 0; k < cols; k++) {
      const v = k * per + i;
      cells.push(c(v < N ? `В-${v + 1}` : '', true), c(v < N ? `А${rows[v][0] + 1} · Б${rows[v][1] + 1} · В${rows[v][2] + 1}` : ''));
    }
    trs.push(new TableRow({children: cells}));
  }
  ch.push(
    new Table({width: {size: (w + wn) * cols, type: WidthType.DXA}, columnWidths: Array.from({length: cols * 2}, (_, i) => (i % 2 ? w : wn)), rows: trs}),
    gap(200),
  );
  const bank = (letter, name, list) => {
    ch.push(new Paragraph({children: [new PageBreak()]}), para([run(`Банк ${letter} — ${name}`, {bold: true, size: 28})], {align: AlignmentType.LEFT, after: 120}));
    list.forEach((q, i) => {
      ch.push(para([run(`${letter}${i + 1}. ${q.t}`, {bold: true, size: 24})], {align: AlignmentType.LEFT, after: 40, keepNext: true}));
      textsOf(q).forEach(x => ch.push(para([run(x, {size: 20, color: '444444'})], {after: 40})));
      if (q.tab) ch.push(dataTable(q.tab), gap(40));
      if (q.code) ch.push(codeBox(q.code, 16), gap(40));
      ch.push(para([run('Ответ. ', {bold: true, size: 22}), run(q.key, {size: 22})], {after: 200}));
    });
  };
  bank('А', P.names[0], P.A);
  bank('Б', P.names[1], P.B);
  bank('В', P.names[2], P.C);
  return ch;
}

const doc = children =>
  new Document({
    creator: 'ОПЦ.07',
    styles: {default: {document: {run: {font: FONT, size: 24}}}},
    sections: [
      {
        properties: {page: {size: {width: 11906, height: 16838}, margin: {top: 1020, bottom: 1020, left: 1134, right: 1134}}},
        footers: {
          default: new Footer({children: [new Paragraph({alignment: AlignmentType.CENTER, children: [new TextRun({children: [PageNumber.CURRENT], font: FONT, size: 18, color: '888888'})]})]}),
        },
        children,
      },
    ],
  });

const NAMES = {
  1: ['база данных и концептуальная модель', 'логическая модель и нормализация', 'от модели к таблицам'],
  2: ['структура базы', 'изменение данных', 'запросы'],
  3: ['соединения', 'группировка', 'подзапросы'],
  4: ['транзакции и целостность', 'индексы и планы', 'права, представления, резервные копии'],
};
fs.mkdirSync(new URL('./out/', import.meta.url), {recursive: true});
for (const n of [1, 2, 3, 4]) {
  const M = await import(`./kr${n}.mjs`);
  const P = {A: M.A, B: M.B, C: M.C, names: NAMES[n]};
  const rows = plan(P.A.length, P.B.length, P.C.length);
  for (const [name, children] of [
    [`КР-${n}.docx`, variantDoc(M.KR, P, rows)],
    [`КР-${n}-ключ.docx`, keyDoc(M.KR, P, rows)],
  ]) {
    fs.writeFileSync(new URL(`./out/${name}`, import.meta.url), await Packer.toBuffer(doc(children)));
    console.log(`kr/out/${name}`);
  }
}
