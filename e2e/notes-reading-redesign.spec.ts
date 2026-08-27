import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
  await page.route(/https:\/\/covers\.openlibrary\.org\/.*/, (route) => route.abort());
});

test('WEB-138 · home muestra notas antes que lectura actual', async ({ page }) => {
  await page.goto('/personal/');
  const section = page.locator('#lecturas');
  await expect(section.getByRole('heading', { name: /Lo que escribo y lo que leo/i })).toBeVisible();
  await expect(section.getByText('Reina de sombras', { exact: true })).toBeVisible();
  const notesBox = await section.locator('.notes-panel').boundingBox();
  const readingBox = await section.locator('.nowbook').boundingBox();
  expect(notesBox).not.toBeNull();
  expect(readingBox).not.toBeNull();
  if (notesBox && readingBox) {
    const viewport = page.viewportSize();
    if (viewport && viewport.width > 760) expect(notesBox.x).toBeLessThan(readingBox.x);
    else expect(notesBox.y).toBeLessThan(readingBox.y);
  }
});

test('WEB-138 · página completa muestra dos notas y solo cinco lecturas recientes', async ({ page }) => {
  await page.goto('/personal/lecturas.html');
  await expect(page.getByRole('heading', { name: /Primero escribo\. Después, leo/i })).toBeVisible();
  await expect(page.locator('.writing-note')).toHaveCount(2);
  await expect(page.getByText('Reina de sombras', { exact: true })).toBeVisible();
  await expect(page.locator('.reading-card')).toHaveCount(5);
  await expect(page.locator('body')).not.toContainText(/export personal|StoryGraph|Por año/i);
});

test('WEB-138 · lecturas no desborda en móvil y mantiene el orden editorial', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/personal/lecturas.html');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const firstNote = page.locator('.writing-note').first();
  const current = page.locator('.reading-now');
  await expect(firstNote).toBeVisible();
  await expect(current).toBeVisible();
  const noteTop = await firstNote.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const currentTop = await current.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  expect(noteTop).toBeLessThan(currentTop);
});
