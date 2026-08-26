import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('WEB-136 · Cómo trabajo usa un timeline continuo y sin mise en place', async ({ page }) => {
  await page.goto('/personal/como-trabajo.html');
  await expect(page.locator('body')).not.toContainText(/mise en place/i);
  await expect(page.locator('.process-thread .workflow-step')).toHaveCount(4);
  await expect(page.locator('.process-marker')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: /Organizar un plan que se sostenga/i })).toBeVisible();
});

test('WEB-136 · el recorrido mantiene una secuencia legible en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/personal/como-trabajo.html');
  const steps = page.locator('.process-thread .workflow-step');
  await expect(steps).toHaveCount(4);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  for (const step of await steps.all()) await expect(step).toBeVisible();
});

test('UI · CTA de comunidad queda dentro del ancho compositivo', async ({ page }) => {
  await page.goto('/personal/');
  const cta = page.locator('.talks-cta-wrap');
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    if (viewport) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    }
  }
});
