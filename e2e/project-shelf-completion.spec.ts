import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('WEB-135 · el estante publica ocho proyectos verificables', async ({ page }) => {
  await page.goto('/personal/');
  const books = page.locator('#proyectos .spine');
  const summaries = page.locator('#proyectos .project-summary');
  await expect(books).toHaveCount(8);
  await expect(summaries).toHaveCount(8);
  await expect(page.getByRole('button', { name: 'Abrir proyecto: JavaMoment' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir proyecto: juego mobile multijugador' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir proyecto: El estudio de Romi' })).toBeVisible();
});

test('WEB-135 · JavaMoment abre como caso navegable y conserva su evidencia', async ({ page }) => {
  await page.goto('/personal/#project=javamoment&page=0');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('JavaMoment');
  await page.getByRole('button', { name: 'siguiente' }).click();
  await expect(dialog).toContainText(/2022|datos de campo|Information Technology|Tecnologías de la Información/i);
});

test('WEB-135 · el juego mobile se presenta explícitamente como trabajo activo', async ({ page }) => {
  await page.goto('/personal/#project=monopoly-mobile&page=0');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Juego mobile de tablero uruguayo');
  let foundDevelopmentStatus = false;
  for (let index = 0; index < 6 && !foundDevelopmentStatus; index += 1) {
    const text = await dialog.innerText();
    foundDevelopmentStatus = /desarrollo activo|en desarrollo|active development/i.test(text);
    const next = page.getByRole('button', { name: 'siguiente' });
    if (!foundDevelopmentStatus && await next.isEnabled()) await next.click();
  }
  expect(foundDevelopmentStatus).toBe(true);
});

test('WEB-135 · móvil conserva scroll horizontal y acceso a los casos nuevos', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/personal/');
  const shelf = page.locator('#proyectos .shelf-scroll');
  const overflow = await shelf.evaluate((node) => getComputedStyle(node).overflowX);
  expect(['auto', 'scroll']).toContain(overflow);
  await page.getByRole('button', { name: 'Abrir proyecto: presencia digital del Colegio y Liceo Pablo Neruda' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Abrir proyecto: presencia digital del Colegio y Liceo Pablo Neruda' })).toBeVisible();
});
