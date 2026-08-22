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

  assert.equal((source.match(/class="spine [^"]+"[^>]*data-book="/g) ?? []).length, 4);
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
