import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const catalog = await readFile(new URL('../src/data/portfolio-projects.ts', import.meta.url), 'utf8');
const home = await readFile(new URL('../src/components/home/Home.astro', import.meta.url), 'utf8');

const expectedIds = [
  'javamoment',
  'infraestructura-5bit',
  'monopoly-mobile',
  'portfolio',
  'neruda-digital'
];

test('WEB-135 suma solo casos nuevos con identidad explícita', () => {
  for (const id of expectedIds) assert.match(catalog, new RegExp(`id: '${id}'`));
  assert.equal((catalog.match(/id: 'javamoment'/g) ?? []).length, 1);
  assert.doesNotMatch(catalog, /id: 's1-placeholder'|Lorem ipsum|por completar|TODO/i);
});

test('WEB-135 conserva la evidencia académica sin inventar un proyecto S1 separado', () => {
  assert.match(catalog, /JavaMoment aparece en mis entregas académicas desde 2022/);
  assert.match(catalog, /Proyecto Final de Tecnólogo/);
  assert.match(catalog, /VLAN, bonding, VRRP, DHCP, NAT, firewall, VPN/);
  assert.doesNotMatch(catalog, /Proyecto S1|Proyecto de semestre 1/i);
});

test('WEB-135 distingue productos terminados de trabajo en desarrollo', () => {
  assert.match(catalog, /El proyecto está en desarrollo activo/);
  assert.match(catalog, /no lo presento como un producto terminado/);
  assert.match(catalog, /github\.com\/romicaubarrere\/monopoly-mobile/);
});

test('WEB-135 integra el catálogo completo sin reemplazar los casos canónicos', () => {
  assert.match(home, /completeProjectsFor\(projectsFor\(lang\), lang\)/);
  assert.match(catalog, /if \(project\.id !== 'fisica'\) return project/);
  assert.match(catalog, /return \[\.\.\.enrichedBase, \.\.\.additions\]/);
});

test('WEB-135 mantiene paridad de contenido en inglés y portugués', () => {
  for (const id of expectedIds) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.ok((catalog.match(new RegExp(`(?:'${escaped}'|${escaped}):`, 'g')) ?? []).length >= 2, `${id} debe tener traducciones`);
  }
  assert.match(catalog, /FISICA_ENRICHMENT: Record<Language/);
});
