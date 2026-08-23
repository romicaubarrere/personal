import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = await readFile(join(repositoryRoot, 'public', 'contextual-scribbles.js'), 'utf8');
const page = await readFile(join(repositoryRoot, 'src', 'pages', 'index.astro'), 'utf8');
const home = await readFile(join(repositoryRoot, 'src', 'components', 'home', 'Home.astro'), 'utf8');

test('los garabatos aparecen solo en proyectos seleccionados y duran brevemente', () => {
  assert.match(script, /\['fisica', 'acá hubo caos'\]/);
  assert.match(script, /\['habitar', 'muchas horas acá'\]/);
  assert.equal((script.match(/\['(?:fisica|habitar)'/g) ?? []).length, 2);
  assert.match(script, /window\.setTimeout\(removeNote, 1100\)/);
  assert.match(script, /note\.animate\(/);
  assert.match(script, /duration: 1100/);
});

test('los garabatos funcionan con mouse, teclado y activación real del proyecto', () => {
  assert.match(script, /document\.addEventListener\('focusin'/);
  assert.match(script, /document\.addEventListener\('pointerover'/);
  assert.match(script, /document\.addEventListener\('click'/);
  assert.match(script, /\.spine\[data-book\], \.project-brief\[data-book\]/);
  assert.match(script, /\.bookmodal\.open \.bookframe/);
});

test('los garabatos son decorativos, no interceptan controles y respetan reduced motion', () => {
  assert.match(script, /setAttribute\('aria-hidden', 'true'\)/);
  assert.match(script, /prefers-reduced-motion: reduce/);
  assert.match(script, /if \(reduceMotion\.matches/);
  assert.match(script, /pointer-events:none/);
  assert.match(script, /if \(event\.matches\) removeNote\(\)/);
});

test('la portada carga el comportamiento sin incorporarlo a las demás rutas', () => {
  assert.match(home, /contextual-scribbles\.js/);
  assert.match(page, /microinteractions\.css/);
});
