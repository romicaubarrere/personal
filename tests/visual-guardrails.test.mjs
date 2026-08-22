import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(repositoryRoot, 'dist');
const srcRoot = join(repositoryRoot, 'src');

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }))).flat();
}

async function sourcesUnder(directory, extensions) {
  const paths = (await filesUnder(directory)).filter((path) => extensions.includes(extname(path)));
  return Promise.all(paths.map(async (path) => ({ path, source: await readFile(path, 'utf8') })));
}

test('WEB-095 evita guiones largos y adornos editoriales genéricos en HTML publicado', async () => {
  const documents = await sourcesUnder(distRoot, ['.html']);

  for (const { path, source } of documents) {
    assert.doesNotMatch(source, /—/, `${path} contiene un guion largo`);
    assert.doesNotMatch(source, /[✨✅✔✓]/u, `${path} contiene un adorno editorial no aprobado`);
  }
});

test('WEB-095 limita las familias tipográficas principales al sistema aprobado', async () => {
  const sources = await sourcesUnder(srcRoot, ['.astro', '.css', '.ts', '.tsx', '.js']);
  const allowedFamilies = new Set([
    'Fraunces',
    'DM Sans',
    'Caveat',
    'Georgia',
    'system-ui',
    'serif',
    'sans-serif',
    'cursive',
    'inherit'
  ]);

  for (const { path, source } of sources) {
    for (const match of source.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
      const declaration = match[1].trim();
      if (/^var\(--(?:serif|sans|hand)\)/.test(declaration)) continue;

      const primary = declaration
        .split(',')[0]
        .trim()
        .replace(/^['"]|['"]$/g, '');

      assert.ok(
        allowedFamilies.has(primary),
        `${path} introduce una familia tipográfica principal no aprobada: ${primary}`
      );
    }
  }
});

test('WEB-095 conserva tipografías y paleta base como tokens de marca', async () => {
  const tokens = await readFile(join(srcRoot, 'styles', 'brand-tokens.css'), 'utf8');

  for (const declaration of [
    "--serif: 'Fraunces'",
    "--sans: 'DM Sans'",
    "--hand: 'Caveat'",
    '--green-dark: #22432c',
    '--brick: #8f4230',
    '--cream: #faf3e4',
    '--gold: #cf9a3f',
    '--cork: #c8a678',
    '--wood: #5d3b22'
  ]) {
    assert.match(tokens, new RegExp(declaration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('WEB-095 no reintroduce la barra lateral verde genérica auditada', async () => {
  const sources = await sourcesUnder(srcRoot, ['.astro', '.css']);
  const combined = sources.map(({ source }) => source).join('\n');

  assert.doesNotMatch(
    combined,
    /border-left\s*:\s*7px\s+solid\s+var\(--green\)/i,
    'La barra lateral verde genérica debe resolverse con recursos del sistema visual'
  );
});
