import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(repositoryRoot, 'dist');
const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
const deployWorkflow = await readFile(
  join(repositoryRoot, '.github', 'workflows', 'deploy-pages.yml'),
  'utf8'
);

const routes = [
  'index.html',
  'formacion.html',
  'como-trabajo.html',
  'comunidad-charlas.html',
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
  assert.match(readme, /GitHub Actions/);
  assert.match(deployWorkflow, /uses: withastro\/action@v6/);
  assert.match(deployWorkflow, /uses: actions\/deploy-pages@v5/);
  assert.match(deployWorkflow, /branches: \[main\]/);
});

test('la portada compilada conserva estructura, contenido e interacciones', async () => {
  const source = await readFile(join(dist, 'index.html'), 'utf8');
  const assetNames = await readdir(join(dist, '_astro'));
  const scripts = await Promise.all(
    assetNames
      .filter((name) => name.endsWith('.js'))
      .map((name) => readFile(join(dist, '_astro', name), 'utf8'))
  );
  const clientJavaScript = scripts.join('\n');

  for (const id of [
    'sobre',
    'proyectos',
    'forma-de-trabajo',
    'charlas',
    'lecturas',
    'contacto'
  ]) {
    assert.match(source, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(source, /id="experiencia"|id="formacion"/);

  assert.equal((source.match(/class="spine [^"]+"[^>]*data-book="/g) ?? []).length, 3);
  assert.match(clientJavaScript, /#project=/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /Romina Caubarrere \| Project Manager de software/);
  assert.match(source, /href="\/personal\/favicon\.svg"/);
  assert.match(source, /href="\/personal\/microinteractions\.css"/);
  assert.match(source, /href="como-trabajo\.html"/);
  assert.doesNotMatch(source, /id="fortalezas"/);
  assert.doesNotMatch(source, /id="lo-que-hago"/);
  assert.doesNotMatch(source, /\/personalfavicon\.svg/);
  assert.doesNotMatch(source, /\/personalmicrointeractions\.css/);
});

test('Cómo trabajo reúne las tres partes y la portada conserva solo el anticipo', async () => {
  const home = await readFile(join(dist, 'index.html'), 'utf8');
  const work = await readFile(join(dist, 'como-trabajo.html'), 'utf8');

  assert.match(home, /id="forma-de-trabajo"/);
  assert.match(home, /href="como-trabajo\.html"/);
  assert.doesNotMatch(home, /id="fortalezas"|id="lo-que-hago"/);
  for (const id of ['fortalezas', 'forma-de-trabajo', 'lo-que-hago']) {
    assert.match(work, new RegExp(`id="${id}"`));
  }
  assert.equal((work.match(/class="workflow-step reveal"/g) ?? []).length, 4);
  assert.equal((work.match(/class="offer-card reveal"/g) ?? []).length, 5);
});

test('la portada se compone desde módulos Astro con una única isla React', async () => {
  const page = await readFile(join(repositoryRoot, 'src', 'pages', 'index.astro'), 'utf8');
  const scripts = await readFile(join(repositoryRoot, 'src', 'components', 'home', 'HomeScripts.astro'), 'utf8');

  assert.match(page, /components\/home\/Hero\.astro/);
  assert.match(page, /components\/islands\/ProjectBookcase/);
  assert.match(page, /<ProjectBookcase client:idle \/>/);
  assert.doesNotMatch(page, /<ProjectBookcase client:load \/>/);
  assert.match(page, /layouts\/BaseLayout\.astro/);
  assert.equal((page.match(/client:/g) ?? []).length, 1);
  assert.doesNotMatch(page, /LegacyDocument/);
  assert.doesNotMatch(scripts, /CASE_PAGE_ORDER|BOOKS|openBook/);
});

test('la salida conserva assets públicos y cantidades académicas', async () => {
  await Promise.all([
    access(join(dist, 'favicon.svg')),
    access(join(dist, 'social-preview.png')),
    access(join(dist, 'social-preview.svg')),
    access(join(dist, 'microinteractions.css'))
  ]);

  const formation = await readFile(join(dist, 'formacion.html'), 'utf8');
  assert.equal((formation.match(/<details\b/g) ?? []).length, 8);
  assert.equal((formation.match(/<li>/g) ?? []).length, 45);
  assert.equal((formation.match(/class="project-sheet"/g) ?? []).length, 4);
  assert.equal((formation.match(/class="extra-note"/g) ?? []).length, 3);
});

test('todas las rutas son Astro nativo y el adaptador legado ya no participa', async () => {
  const sourcePages = [
    join(repositoryRoot, 'src', 'pages', 'index.astro'),
    join(repositoryRoot, 'src', 'pages', 'formacion.astro'),
    join(repositoryRoot, 'src', 'pages', 'como-trabajo.astro'),
    join(repositoryRoot, 'src', 'pages', 'comunidad-charlas.astro'),
    join(repositoryRoot, 'src', 'pages', 'posts', 'por-que-hago-tantas-preguntas.astro'),
    join(repositoryRoot, 'src', 'pages', 'posts', 'cuando-puedas.astro')
  ];

  for (const page of sourcePages) {
    const source = await readFile(page, 'utf8');
    assert.doesNotMatch(source, /LegacyDocument|\?raw/);
  }
});
