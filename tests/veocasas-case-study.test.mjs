import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/data/veocasas-project.ts', import.meta.url), 'utf8');
const home = await readFile(new URL('../src/components/home/Home.astro', import.meta.url), 'utf8');
const scope = await readFile(new URL('../docs/current-work-public-scope.md', import.meta.url), 'utf8');
const evidence = await readFile(new URL('../docs/veocasas-case-evidence.md', import.meta.url), 'utf8');

const publicUrls = [
  'https://veocasas.com/',
  'https://www.linkedin.com/posts/feli-gc_we-designed-veocasas-a-real-estate-platform-activity-7486096399613480960-R-xs',
  'https://dribbble.com/shots/27659059-Veo-Casas-Real-Estate-Platform'
];

test('WEB-012 y WEB-016 publican VeoCasas con el rol confirmado de Romina', () => {
  assert.match(source, /Soy la Project Manager de VeoCasas en eagerworks/);
  assert.match(source, /Preparo y facilito plannings/);
  assert.match(source, /ordeno y priorizo el backlog/);
  assert.match(source, /bloqueos, dependencias, riesgos y entregas/);
  assert.match(source, /feedback y dudas del cliente en definiciones accionables/);
});

test('el caso limita el producto a funcionalidades y fuentes ya públicas', () => {
  for (const url of publicUrls) assert.match(source, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(source, /búsqueda avanzada/);
  assert.match(source, /vistas de mapa y lista/);
  assert.match(source, /favoritos, búsquedas guardadas/);
  assert.match(source, /publicación paso a paso/);
  assert.match(source, /Las funcionalidades públicas son resultado del trabajo conjunto/);
});

test('VeoCasas mantiene paridad editorial en español, inglés y portugués', () => {
  assert.equal((source.match(/id: 'veocasas'/g) ?? []).length, 3);
  assert.match(source, /I am the Project Manager for VeoCasas at eagerworks/);
  assert.match(source, /Sou a Project Manager da VeoCasas na eagerworks/);
  assert.match(source, /Open project: VeoCasas/);
  assert.match(source, /Abrir projeto: VeoCasas/);
});

test('el caso público no filtra detalles de las actas privadas', () => {
  for (const forbidden of [
    /Sintel/i,
    /Mica/i,
    /Pilar/i,
    /Agust[ií]n/i,
    /Rovo/i,
    /isReserved/i,
    /story points/i,
    /\$110/,
    /ticket 785/i,
    /30-32 puntos/i
  ]) assert.doesNotMatch(source, forbidden);
  assert.match(source, /no incluye transcripciones, tickets, estimaciones ni conversaciones internas/);
});

test('la home incorpora el caso sin reemplazar el catálogo existente', () => {
  assert.match(home, /import \{ veocasasProjectFor \} from '\.\.\/\.\.\/data\/veocasas-project'/);
  assert.match(home, /normalizePublishedProjectCopy\(completeProjectsFor\(projectsFor\(lang\), lang\), lang\)/);
  assert.match(home, /normalizePublishedProjectCopy\(\[veocasasProjectFor\(lang\)\], lang\)/);
});

test('la política registra autorización, evidencia y límites explícitos', () => {
  assert.match(scope, /## Excepción aprobada: VeoCasas/);
  assert.match(scope, /Romina confirmó directamente que es la Project Manager de VeoCasas/);
  assert.match(scope, /Esos registros no se publican, no se enlazan/);
  assert.match(evidence, /confirmó de forma directa que es la Project Manager de VeoCasas/);
  assert.match(evidence, /Los registros privados no se enlazan, adjuntan, copian ni citan/);
  assert.match(evidence, /una atribución individual de funcionalidades construidas por el equipo/);
});
