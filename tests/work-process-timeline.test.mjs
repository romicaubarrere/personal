import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflow = await readFile(new URL('../src/components/home/Workflow.astro', import.meta.url), 'utf8');
const strengths = await readFile(new URL('../src/components/home/Strengths.astro', import.meta.url), 'utf8');
const workPage = await readFile(new URL('../src/pages/como-trabajo.astro', import.meta.url), 'utf8');
const talks = await readFile(new URL('../src/components/home/Talks.astro', import.meta.url), 'utf8');

test('WEB-136 retira visualmente mise en place y explica el pasaje de idea a plan', () => {
  assert.match(workPage, /\.kitchen-recipe-label\{display:none\}/);
  assert.match(workPage, /primero entiendo el problema real/i);
  assert.match(workPage, /construible/i);
  assert.match(workPage, /plan/i);
});

test('WEB-136 convierte el proceso en un recorrido continuo sin numeración visible', () => {
  assert.match(workflow, /process-timeline/);
  assert.match(workflow, /process-thread/);
  assert.equal((workflow.match(/class="process-marker"/g) ?? []).length, 4);
  assert.equal((workflow.match(/--thread-level:/g) ?? []).length, 4);
  assert.doesNotMatch(workflow, /workflow-number|>0[1-4]<|>0?[1-4]</);
  assert.match(workflow, /repeating-linear-gradient/);
});

test('WEB-136 refuerza organización como una capacidad central', () => {
  assert.match(strengths, /Organizaci[oó]n que sostiene el trabajo/i);
  assert.match(strengths, /prioridades/i);
  assert.match(strengths, /dependencias/i);
  assert.match(strengths, /riesgos/i);
});

test('WEB-136 conserva responsive y movimiento reducido', () => {
  assert.match(workflow, /@media\(max-width:760px\)/);
  assert.match(workflow, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(workflow, /translate:0 0!important/);
});

test('el CTA de comunidad queda centrado debajo de las tres tarjetas', () => {
  assert.match(talks, /class="talks-cta-wrap reveal"/);
  assert.match(talks, /margin:38px auto 0/);
  assert.match(talks, /text-align:center/);
  assert.match(talks, /class="open-folder talks-cta" style="display:inline-flex"/);
});
