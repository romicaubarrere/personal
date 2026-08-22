import { expect, test } from '@playwright/test';

const mobileWidths = [320, 375, 390, 430];
const bookBreakpointWidths = [719, 720, 721];
const shortHeights = [469, 470, 471];

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

async function openFirstProject(page: import('@playwright/test').Page) {
  await page.locator('.spine[data-book="fisica"]').click();
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'false');
}

async function expectCloseControlInsideViewport(page: import('@playwright/test').Page) {
  const close = page.getByRole('button', { name: 'Cerrar proyecto', exact: true }).first();
  await expect(close).toBeVisible();
  const box = await close.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  if (!box || !viewport) return;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
}

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop'), 'Matriz responsive ejecutada una vez sobre Chromium');
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('TC-RWD-001 · 320/375/390/430px no generan overflow y mantienen controles del modal', async ({ page }) => {
  for (const width of mobileWidths) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/personal/');
    await expectNoHorizontalOverflow(page);
    await openFirstProject(page);
    await expectCloseControlInsideViewport(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'true');
  }
});

test('TC-RWD-002 · 719/720/721px respetan el límite del libro móvil', async ({ page }) => {
  for (const width of bookBreakpointWidths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/personal/');
    await openFirstProject(page);

    const leftPage = page.locator('.pg-left');
    if (width <= 720) await expect(leftPage).toBeHidden();
    else await expect(leftPage).toBeVisible();

    await expectCloseControlInsideViewport(page);
    await page.keyboard.press('Escape');
  }
});

test('TC-RWD-003 · 469/470/471px de alto conservan cierre accesible', async ({ page }) => {
  for (const height of shortHeights) {
    await page.setViewportSize({ width: 390, height });
    await page.goto('/personal/');
    await openFirstProject(page);
    await expectCloseControlInsideViewport(page);
    await page.keyboard.press('Escape');
  }
});

test('TC-RWD-004 · cambiar portrait/landscape no pierde el estado del modal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/personal/');
  await openFirstProject(page);
  await expect(page).toHaveURL(/#project=fisica&page=0$/);

  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'false');
  await expect(page).toHaveURL(/#project=fisica&page=0$/);
  await expectCloseControlInsideViewport(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'false');
  await expectCloseControlInsideViewport(page);
});
