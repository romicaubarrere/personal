import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url);

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  }));
  return nested.flat();
}

test('todos los enlaces que abren otra pestaña anuncian el cambio de contexto', async () => {
  for (const path of await htmlFiles(dist.pathname)) {
    const source = await readFile(path, 'utf8');
    const externalLinks = source.match(/<a\b[^>]*target="_blank"[^>]*>[\s\S]*?<\/a>/gi) ?? [];
    for (const link of externalLinks) {
      assert.match(link, /nueva pesta(?:ña|&ntilde;a)|new tab|nova aba/i, `${path} no anuncia la nueva pestaña`);
      assert.match(link, /rel="[^"]*noopener[^"]*noreferrer[^"]*"/i, `${path} no protege la pestaña de origen`);
    }
  }
});
