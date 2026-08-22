import { expect, test } from '@playwright/test';

const localizedPages = [
  { path: '/personal/', lang: 'es' },
  { path: '/personal/en.html', lang: 'en' },
  { path: '/personal/pt.html', lang: 'pt' },
  { path: '/personal/como-trabajo.html', lang: 'es' },
  { path: '/personal/en/comunidad-charlas.html', lang: 'en' },
  { path: '/personal/pt/formacion.html', lang: 'pt' }
];

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('las rutas principales cargan en el idioma esperado', async ({ page }) => {
  for (const route of localizedPages) {
    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    expect(response?.ok(), route.path).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  }
});

test('la 404 conserva el idioma y vuelve a la portada equivalente', async ({ page }) => {
  const cases = [
    { path: '/personal/no-existe', lang: 'es', heading: 'Página no encontrada', home: '/personal/' },
    { path: '/personal/en/no-existe', lang: 'en', heading: 'Page not found', home: '/personal/en.html' },
    { path: '/personal/pt/no-existe', lang: 'pt', heading: 'Página não encontrada', home: '/personal/pt.html' }
  ];

  for (const current of cases) {
    const response = await page.goto(current.path, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), current.path).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', current.lang);
    await expect(page.locator('h1')).toHaveText(current.heading);
    await expect(page.locator('[data-i18n="cta"]')).toHaveAttribute('href', current.home);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
  }
});

test('el selector conserva la página al cambiar de idioma', async ({ page }) => {
  await page.goto('/personal/como-trabajo.html');
  const languages = page.locator('.language-switcher');

  await languages.locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/personal\/en\/como-trabajo\.html$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.locator('.language-switcher a[hreflang="pt"]').click();
  await expect(page).toHaveURL(/\/personal\/pt\/como-trabajo\.html$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
});

test('cerrar un proyecto consume su entrada de historial sin duplicar la home', async ({ page }) => {
  await page.goto('/personal/como-trabajo.html');
  await page.goto('/personal/');

  await page.locator('.spine[data-book="fisica"]').click();
  await expect(page).toHaveURL(/#project=fisica&page=0$/);
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'false');

  await page.getByRole('button', { name: 'Cerrar proyecto', exact: true }).first().click();
  await expect(page).toHaveURL(/\/personal\/$/);
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'true');

  await page.goForward();
  await expect(page).toHaveURL(/#project=fisica&page=0$/);
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.getByRole('button', { name: 'Cerrar proyecto', exact: true }).first()).toBeFocused();

  await page.goBack();
  await expect(page).toHaveURL(/\/personal\/$/);
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'true');

  await page.goBack();
  await expect(page).toHaveURL(/\/personal\/como-trabajo\.html$/);
});

test('la navegación móvil abre, navega y vuelve a cerrarse', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Cobertura exclusiva del viewport móvil');
  await page.goto('/personal/');

  const toggle = page.locator('#navToggle');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('link', { name: 'Proyectos', exact: true }).click();
  await expect(page).toHaveURL(/#proyectos$/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#proyectos')).toBeVisible();
});

test('las notas se despegan antes de navegar con mouse o teclado', async ({ page }) => {
  await page.goto('/personal/');
  const note = page.locator('.sticky-link').first();
  await note.click({ noWaitAfter: true });
  await expect(note).toHaveClass(/is-lifting/);
  await page.waitForURL(/\/personal\/posts\/por-que-hago-tantas-preguntas\.html$/);

  await page.goto('/personal/');
  const keyboardNote = page.locator('.sticky-link').nth(1);
  await keyboardNote.focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(/\/personal\/posts\/cuando-puedas\.html$/);
});
