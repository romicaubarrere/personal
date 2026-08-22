import { expect, test, type Page } from '@playwright/test';

const representativeRoutes = [
  '/personal/',
  '/personal/como-trabajo.html',
  '/personal/comunidad-charlas.html',
  '/personal/formacion.html',
  '/personal/posts/por-que-hago-tantas-preguntas.html',
  '/personal/en.html',
  '/personal/pt.html'
];

async function internalHttpLinks(page: Page) {
  return page.locator('a[href]').evaluateAll((anchors) => {
    const origin = window.location.origin;
    const seen = new Set<string>();
    return anchors.flatMap((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return [];
      const url = new URL(href, window.location.href);
      if (url.origin !== origin) return [];
      url.hash = '';
      if (seen.has(url.href)) return [];
      seen.add(url.href);
      return [url.href];
    });
  });
}

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('TC-NAV-001 · menú desktop y móvil exponen el contrato correcto', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto('/personal/');
  await expect(page.locator('#primary-nav')).toBeVisible();
  await expect(page.locator('#navToggle')).toBeHidden();
  await expect(page.locator('#primary-nav')).not.toHaveAttribute('inert', '');

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#navToggle')).toBeVisible();
  await expect(page.locator('#navToggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#primary-nav')).toHaveAttribute('inert', '');

  await page.locator('#navToggle').click();
  await expect(page.locator('#navToggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#primary-nav')).not.toHaveAttribute('inert', '');
  await expect(page.getByRole('link', { name: 'Proyectos', exact: true })).toBeVisible();
});

test('TC-NAV-002 · todos los enlaces internos publicados responden sin error', async ({ page, request }) => {
  const checked = new Set<string>();
  for (const route of representativeRoutes) {
    await page.goto(route);
    for (const href of await internalHttpLinks(page)) {
      if (checked.has(href)) continue;
      checked.add(href);
      const response = await request.get(href, { failOnStatusCode: false });
      expect(response.status(), href).toBeLessThan(400);
    }
  }
  expect(checked.size).toBeGreaterThan(10);
});

test('TC-NAV-003 · el estado activo sigue la sección indicada por la URL', async ({ page }) => {
  await page.goto('/personal/#proyectos');
  const projects = page.locator('#primary-nav a[href="#proyectos"]');
  await expect(projects).toHaveAttribute('aria-current', 'location');
  await expect(projects).toHaveClass(/is-active/);

  await page.goto('/personal/#charlas');
  const talks = page.locator('#primary-nav a[href="#charlas"]');
  await expect(talks).toHaveAttribute('aria-current', 'location');
  await expect(talks).toHaveClass(/is-active/);
  await expect(projects).not.toHaveAttribute('aria-current', 'location');
});

test('TC-NAV-004 · Back y Forward restauran hash y estado activo', async ({ page }) => {
  await page.goto('/personal/');
  await page.locator('#primary-nav a[href="#proyectos"]').click();
  await expect(page).toHaveURL(/#proyectos$/);
  await page.locator('#primary-nav a[href="#contacto"]').click();
  await expect(page).toHaveURL(/#contacto$/);

  await page.goBack();
  await expect(page).toHaveURL(/#proyectos$/);
  await expect(page.locator('#primary-nav a[href="#proyectos"]')).toHaveAttribute('aria-current', 'location');

  await page.goForward();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(page.locator('#primary-nav a[href="#contacto"]')).toHaveAttribute('aria-current', 'location');
});

test('TC-NAV-005 · una ruta inexistente muestra 404 y permite volver', async ({ page }) => {
  await page.goto('/personal/como-trabajo.html');
  const response = await page.goto('/personal/esta-ruta-no-existe.html', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Página no encontrada');
  await expect(page.getByRole('link', { name: 'Ir al portfolio de Romina Caubarrere' })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/personal\/como-trabajo\.html$/);
  await expect(page.locator('main')).toBeVisible();
});

test('TC-NAV-006 · anchors y skip-link llevan a destinos existentes', async ({ page }) => {
  await page.goto('/personal/');
  const skip = page.locator('.skip-link');
  await skip.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeFocused();

  await page.goto('/personal/#proyectos');
  await expect(page.locator('#proyectos')).toBeVisible();
  await expect(page.locator('#primary-nav a[href="#proyectos"]')).toHaveAttribute('aria-current', 'location');

  for (const href of await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')).filter(Boolean))) {
    const id = href!.slice(1);
    if (!id) continue;
    await expect(page.locator(`#${id}`), `anchor ${href}`).toHaveCount(1);
  }
});
