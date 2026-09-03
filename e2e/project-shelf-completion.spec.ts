import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('WEB-135 · el estante publica nueve proyectos verificables', async ({ page }) => {
  await page.goto('/personal/');
  const books = page.locator('#proyectos .spine');
  const summaries = page.locator('#proyectos .project-summary');
  await expect(books).toHaveCount(9);
  await expect(summaries).toHaveCount(9);
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
  await page.goto('/personal/#project=monopoly-mobile&page=5');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Juego mobile de tablero uruguayo');
  await expect(dialog).toContainText(/desarrollo activo|en desarrollo|active development/i);
  await expect(dialog).toContainText(/no lo presento como un producto terminado|not present it as a finished product/i);
});

test('WEB-012 y WEB-016 · VeoCasas abre como caso de Project Management', async ({ page }) => {
  await page.goto('/personal/#project=veocasas&page=3');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('VeoCasas');
  await expect(dialog).toContainText('Project Manager');
  await expect(dialog).toContainText(/plannings|backlog|bloqueos|dependencias/i);
});

test('WEB-135 · móvil conserva scroll horizontal y acceso a los casos nuevos', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/personal/');
  const shelf = page.locator('#proyectos .shelf-scroll');
  const overflow = await shelf.evaluate((node) => getComputedStyle(node).overflowX);
  expect(['auto', 'scroll']).toContain(overflow);
  await page.getByRole('button', { name: 'Abrir proyecto: presencia digital del Colegio y Liceo Pablo Neruda' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Abrir proyecto: presencia digital del Colegio y Liceo Pablo Neruda' })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir proyecto: VeoCasas' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Abrir proyecto: VeoCasas' })).toBeVisible();
});
