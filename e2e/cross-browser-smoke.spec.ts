import { expect, test } from '@playwright/test';

const routes = [
  ['/personal/', 'es'],
  ['/personal/en.html', 'en'],
  ['/personal/pt.html', 'pt'],
  ['/personal/formacion.html', 'es'],
  ['/personal/como-trabajo.html', 'es'],
  ['/personal/comunidad-charlas.html', 'es'],
  ['/personal/lecturas.html', 'es']
] as const;

test('CROSS-BROWSER · las rutas principales cargan con estructura utilizable', async ({ page }) => {
  for (const [route, lang] of routes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
  }
});

test('CROSS-BROWSER · idioma y navegación siguen accesibles', async ({ page }) => {
  await page.goto('/personal/', { waitUntil: 'domcontentloaded' });
  const language = page.locator('[aria-label="Elegir idioma"]').first();
  await expect(language).toBeVisible();
  await expect(language.getByRole('link', { name: /EN/i })).toBeVisible();

  const menu = page.locator('.nav-toggle');
  if (await menu.isVisible()) {
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
  } else {
    await expect(page.locator('nav').first()).toBeVisible();
  }
});

test('CROSS-BROWSER · un proyecto abre y cierra como diálogo', async ({ page }) => {
  await page.goto('/personal/', { waitUntil: 'domcontentloaded' });
  const trigger = page.locator('.spine[data-book="habitar"]');
  await expect(trigger).toBeVisible();
  const island = trigger.locator('xpath=ancestor::astro-island');
  await expect(island).toHaveCount(1);
  await expect.poll(() => island.getAttribute('ssr')).toBeNull();
  await trigger.click({ force: true });
  const modal = page.locator('#bookmodal');
  await expect(modal).toHaveAttribute('aria-hidden', 'false');
  await expect(modal).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(modal).toHaveAttribute('aria-hidden', 'true');
});

test('CROSS-BROWSER · reduced motion mantiene contenido visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/personal/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero')).toBeVisible();
  await expect(page.locator('[data-age]').first()).toBeVisible();

  await page.goto('/personal/formacion.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#experiencia')).toBeVisible();
});
