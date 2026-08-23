import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(repositoryRoot, 'dist');

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }))).flat();
}

async function totalBytes(paths) {
  const sizes = await Promise.all(paths.map(async (path) => (await stat(path)).size));
  return sizes.reduce((total, size) => total + size, 0);
}

test('la tarjeta social conserva sus dimensiones con un peso optimizado', async () => {
  const imagePath = join(distRoot, 'social-preview.png');
  const image = await readFile(imagePath);

  assert.equal(image.subarray(1, 4).toString(), 'PNG');
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  assert.ok(image.length <= 50 * 1024, `La tarjeta social pesa ${image.length} bytes`);
});

test('los recursos compilados respetan presupuestos de transferencia', async () => {
  const files = await filesUnder(distRoot);
  const javascript = files.filter((path) => extname(path) === '.js');
  const styles = files.filter((path) => extname(path) === '.css');
  const downloadableDocuments = files.filter((path) => extname(path) === '.pdf');
  const sharedResources = files.filter((path) => !['.pdf', '.html'].includes(extname(path)));
  const htmlDocuments = files.filter((path) => extname(path) === '.html');

  assert.ok(await totalBytes(javascript) <= 220 * 1024, 'El JavaScript supera 220 KiB');
  assert.ok(await totalBytes(styles) <= 85 * 1024, 'El CSS supera 85 KiB');
  assert.ok(await totalBytes(sharedResources) <= 500 * 1024, 'Los recursos compartidos superan 500 KiB');
  for (const document of htmlDocuments) {
    assert.ok((await stat(document)).size <= 100 * 1024, `${document} supera 100 KiB`);
  }
  assert.equal(downloadableDocuments.length, 1, 'Debe publicarse solo el CV aprobado');
  assert.ok(downloadableDocuments[0].endsWith('cv/romina-caubarrere-cv.pdf'));
  assert.ok(
    await totalBytes(downloadableDocuments) <= 125 * 1024,
    'Los documentos descargables superan 125 KiB'
  );
  assert.equal(files.some((path) => path.endsWith('.map')), false, 'No se publican source maps');
});

test('las fuentes externas conservan conexiones anticipadas', async () => {
  const home = await readFile(join(distRoot, 'index.html'), 'utf8');

  assert.match(home, /rel="preconnect" href="https:\/\/fonts\.googleapis\.com"/);
  assert.match(home, /rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin/);
  assert.match(home, /family=Fraunces:[^"']+family=DM\+Sans:[^"']+family=Caveat:[^"']+display=swap/);
});

test('la isla React se hidrata cuando el navegador queda libre', async () => {
  const home = await readFile(join(distRoot, 'index.html'), 'utf8');
  const pageSource = await readFile(join(repositoryRoot, 'src', 'components', 'home', 'Home.astro'), 'utf8');

  assert.match(pageSource, /<ProjectBookcase \{lang\} \{projects\} client:idle \/>/);
  assert.doesNotMatch(pageSource, /client:load/);
  assert.match(home, /client="idle"/);
});
