import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STATUS_ALIASES = new Set([
  'currently-reading',
  'currently reading',
  'current',
  'leyendo',
  'leyendo ahora'
]);

const HEADER_ALIASES = {
  title: ['title', 'book title', 'título', 'titulo'],
  author: ['authors', 'author', 'autor', 'autores'],
  status: ['read status', 'reading status', 'status', 'estado'],
  lastRead: ['last date read', 'last read date', 'date last read', 'última fecha leída', 'ultima fecha leida'],
  added: ['date added', 'added date', 'fecha agregada']
};

function normalise(value = '') {
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ');
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows.filter((candidate) => candidate.some((value) => value.trim() !== ''));
}

function findHeaderIndex(headers, aliases) {
  const normalisedHeaders = headers.map(normalise);
  return aliases.map(normalise).map((alias) => normalisedHeaders.indexOf(alias)).find((index) => index >= 0) ?? -1;
}

function parseSortableDate(value) {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function selectCurrentReading(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length < 2) throw new Error('El export de StoryGraph no contiene filas de datos.');

  const [headers, ...data] = rows;
  const indexes = Object.fromEntries(
    Object.entries(HEADER_ALIASES).map(([key, aliases]) => [key, findHeaderIndex(headers, aliases)])
  );

  for (const required of ['title', 'author', 'status']) {
    if (indexes[required] < 0) {
      throw new Error(`No encontré la columna requerida “${required}” en el export de StoryGraph.`);
    }
  }

  const candidates = data
    .map((row) => ({
      title: row[indexes.title]?.trim() ?? '',
      author: row[indexes.author]?.trim() ?? '',
      status: normalise(row[indexes.status]),
      lastRead: indexes.lastRead >= 0 ? row[indexes.lastRead]?.trim() ?? '' : '',
      added: indexes.added >= 0 ? row[indexes.added]?.trim() ?? '' : ''
    }))
    .filter((book) => STATUS_ALIASES.has(book.status) && book.title && book.author)
    .sort((a, b) => {
      const bDate = parseSortableDate(b.lastRead) || parseSortableDate(b.added);
      const aDate = parseSortableDate(a.lastRead) || parseSortableDate(a.added);
      return bDate - aDate;
    });

  if (!candidates.length) {
    throw new Error('No encontré ningún libro con estado “currently-reading” en el export de StoryGraph.');
  }

  return candidates[0];
}

export function makeCoverLabel(title) {
  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return 'Libro';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 4).map((word) => word[0].toUpperCase()).join(' · ');
}

function formatSpanishDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const formatter = new Intl.DateTimeFormat('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Montevideo'
  });
  return formatter.format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function renderReadingModule(book, isoDate) {
  const safe = (value) => JSON.stringify(value);
  return `// Generado por scripts/import-storygraph.mjs a partir de un export personal de StoryGraph.\n// No editar a mano salvo como fallback; volver a ejecutar npm run reading:import -- <archivo.csv>.\nexport const currentReading = {\n  title: ${safe(book.title)},\n  author: ${safe(book.author)},\n  coverLabel: ${safe(makeCoverLabel(book.title))},\n  updatedAt: ${safe(isoDate)},\n  updatedLabel: ${safe(formatSpanishDate(isoDate))}\n} as const;\n`;
}

function todayInMontevideo() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Montevideo'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

async function main() {
  const [, , inputArg, ...rest] = process.argv;
  if (!inputArg || inputArg === '--help' || inputArg === '-h') {
    console.log('Uso: npm run reading:import -- <storygraph-export.csv> [--date YYYY-MM-DD]');
    process.exit(inputArg ? 0 : 1);
  }

  const dateFlag = rest.indexOf('--date');
  const isoDate = dateFlag >= 0 ? rest[dateFlag + 1] : todayInMontevideo();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate ?? '')) throw new Error('La fecha debe usar formato YYYY-MM-DD.');

  const inputPath = path.resolve(process.cwd(), inputArg);
  const outputPath = path.resolve(process.cwd(), 'src/data/reading.ts');
  const csv = await fs.readFile(inputPath, 'utf8');
  const book = selectCurrentReading(csv);
  await fs.writeFile(outputPath, renderReadingModule(book, isoDate), 'utf8');
  console.log(`Leyendo ahora actualizado: ${book.title} — ${book.author}`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
