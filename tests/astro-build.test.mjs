import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(repositoryRoot, 'dist');
const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');

const routes = [
  'index.html',
  'formacion.html',
  'posts/por-que-hago-tantas-preguntas.html',
  'posts/cuando-puedas.html'
];

test('Astro genera todas las rutas públicas con su extensión histórica', async () => {
  for (const route of routes) {
    const source = await readFile(join(dist, route), 'utf8');
    assert.match(source, /<!doctype html>/i, route);
    assert.match(source, /<html\s+lang="es">/i, route);
    assert.match(source, /<title>[^<]+<\/title>/i, route);
  }
});

test('la documentación explica el flujo Astro vigente', () => {
  assert.match(readme, /Node\.js 22\.12 o posterior/);
  assert.match(readme, /npm ci/);
  assert.match(readme, /npm run dev/);
  assert.match(readme, /npm run build/);
  assert.match(readme, /base pública `\/personal`/);
  assert.match(readme, /tests\/astro-build\.test\.mjs/);
});

test('la portada compilada conserva estructura, contenido e interacciones', async () => {
  const source = await readFile(join(dist, 'index.html'), 'utf8');

  for (const id of [
    'fortalezas',
    'sobre',
    'experiencia',
    'formacion',
    'proyectos',
    'forma-de-trabajo',
    'lo-que-hago',
    'charlas',
    'comunidades',
    'lecturas',
    'contacto'
  ]) {
    assert.match(source, new RegExp(`id="${id}"`));
  }

  assert.equal((source.match(/data-book="/g) ?? []).length, 5);
  assert.match(source, /#project=/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /Romina Caubarrere \| Project Manager de software/);
});

test('la salida conserva assets públicos y cantidades académicas', async () => {
  await Promise.all([
    access(join(dist, 'favicon.svg')),
    access(join(dist, 'social-preview.png')),
    access(join(dist, 'social-preview.svg')),
    access(join(dist, 'microinteractions.css')),
    access(join(dist, 'posts', 'post.css'))
  ]);

  const formation = await readFile(join(dist, 'formacion.html'), 'utf8');
  assert.equal((formation.match(/<details\b/g) ?? []).length, 8);
  assert.equal((formation.match(/<li>/g) ?? []).length, 45);
  assert.equal((formation.match(/class="project-sheet"/g) ?? []).length, 4);
  assert.equal((formation.match(/class="extra-note"/g) ?? []).length, 3);
});
