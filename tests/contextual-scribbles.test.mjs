import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = await readFile(join(repositoryRoot, 'public', 'contextual-scribbles.js'), 'utf8');
const styles = await readFile(join(repositoryRoot, 'public', 'microinteractions.css'), 'utf8');
const page = await readFile(join(repositoryRoot, 'src', 'pages', 'index.astro'), 'utf8');

test('los garabatos aparecen solo en proyectos seleccionados y duran brevemente', () => {
  assert.match(script, /\['fisica', 'acá hubo caos'\]/);
  assert.match(script, /\['habitar', 'muchas horas acá'\]/);
  assert.equal((script.match(/\['(?:fisica|habitar)'/g) ?? []).length, 2);
  assert.match(script, /window\.setTimeout\(removeNote, 1100\)/);
  assert.match(styles, /animation:context-scribble-pop 1\.1s ease both/);
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
  assert.match(styles, /\.context-scribble\{[^}]*pointer-events:none/);
  assert.match(styles, /@media\(prefers-reduced-motion:reduce\)[\s\S]*\.context-scribble\{display:none!important\}/);
});

test('la portada carga el comportamiento sin incorporarlo a las demás rutas', () => {
  assert.match(page, /contextual-scribbles\.js/);
  assert.match(page, /microinteractions\.css/);
});
