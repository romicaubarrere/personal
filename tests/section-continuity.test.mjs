import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const page = await readFile(join(root, 'src/components/home/Home.astro'), 'utf8');
const transition = await readFile(join(root, 'src/components/home/StudioTransition.astro'), 'utf8');

test('la continuidad del estudio aparece solo en transiciones seleccionadas', () => {
  assert.equal([...page.matchAll(/<StudioTransition \/>/g)].length, 3);
  assert.match(transition, /linear-gradient/);
});

test('los objetos de transición no tapan ni capturan interacciones', () => {
  assert.match(transition, /pointer-events:none/);
  assert.match(transition, /aria-hidden="true"/);
  assert.match(transition, /width:70px/);
  assert.doesNotMatch(transition, /animation:/);
});
