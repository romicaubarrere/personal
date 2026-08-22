import { expect, test, type Page } from '@playwright/test';

async function openHabitar(page: Page) {
  await page.goto('/personal/');
  const trigger = page.locator('.spine[data-book="habitar"]');
  await trigger.focus();
  await trigger.click();
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'false');
  return trigger;
}

async function dispatchSwipe(page: Page, startX: number, endX: number) {
  await page.locator('#bookmodal .bk').evaluate((element, points) => {
    const eventWithTouch = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'changedTouches', {
        value: [{ clientX }],
        configurable: true
      });
      element.dispatchEvent(event);
    };
    eventWithTouch('touchstart', points.startX);
    eventWithTouch('touchend', points.endX);
  }, { startX, endX });
}

async function waitClosed(page: Page) {
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body')).not.toHaveClass(/modal-open/);
}

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('TC-MOD-005 · swipe 47/48/49px respeta exactamente el umbral móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openHabitar(page);
  await expect(page).toHaveURL(/page=0$/);

  await dispatchSwipe(page, 200, 153);
  await expect(page).toHaveURL(/page=0$/);

  await dispatchSwipe(page, 200, 152);
  await expect(page).toHaveURL(/page=1$/);

  await dispatchSwipe(page, 200, 151);
  await expect(page).toHaveURL(/page=2$/);
});

test('TC-MOD-006 · primera/intermedia/última página actualizan controles y límites', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openHabitar(page);
  const prev = page.getByRole('button', { name: 'anterior' });
  const next = page.getByRole('button', { name: 'siguiente' });

  await expect(prev).toBeDisabled();
  await expect(next).toBeEnabled();

  await next.click();
  await expect(page).toHaveURL(/page=1$/);
  await expect(prev).toBeEnabled();
  await expect(next).toBeEnabled();

  for (let pageIndex = 2; pageIndex <= 7; pageIndex += 1) {
    await next.click();
    await expect(page).toHaveURL(new RegExp(`page=${pageIndex}$`));
  }
  await expect(next).toBeDisabled();
  await expect(prev).toBeEnabled();
});

test('TC-MOD-007 · X, backdrop, Escape y botón móvil cierran el modal', async ({ page }) => {
  const methods = ['x', 'backdrop', 'escape', 'mobile'] as const;

  for (const method of methods) {
    await page.setViewportSize({ width: method === 'mobile' ? 390 : 1024, height: 844 });
    await openHabitar(page);

    if (method === 'x') await page.locator('.bm-close').click();
    if (method === 'backdrop') await page.locator('.bm-backdrop').click({ position: { x: 5, y: 5 } });
    if (method === 'escape') await page.keyboard.press('Escape');
    if (method === 'mobile') await page.locator('.bm-close-mobile').click();

    await waitClosed(page);
    await expect(page).not.toHaveURL(/#project=/);
  }
});

test('TC-MOD-008 · cerrar restaura body, inert y foco al disparador', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 844 });
  const trigger = await openHabitar(page);
  const projectShelf = page.locator('#proyectos');

  await expect(page.locator('body')).toHaveClass(/modal-open/);
  await expect(page.locator('#bookmodal')).not.toHaveAttribute('inert', '');
  await expect(projectShelf).toHaveAttribute('inert', '');

  await page.keyboard.press('Escape');
  await waitClosed(page);
  await expect(trigger).toBeFocused();
  await expect(projectShelf).not.toHaveAttribute('inert', '');
  await expect(page.locator('#bookmodal')).toHaveAttribute('inert', '');
});

test('TC-MOD-010 · URL directa normaliza page válida, inválida y fuera de rango sin sumar historial', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('/personal/#project=habitar&page=0');
  await expect(page).toHaveURL(/#project=habitar&page=0$/);
  await expect(page.locator('.bm-foot')).toContainText('1 / 8');

  await page.goto('/personal/#project=habitar&page=7');
  await expect(page).toHaveURL(/#project=habitar&page=7$/);
  await expect(page.locator('.bm-foot')).toContainText('8 / 8');

  await page.goto('/personal/#project=habitar&page=8');
  await expect(page).toHaveURL(/#project=habitar&page=7$/);
  await expect(page.locator('.bm-foot')).toContainText('8 / 8');

  await page.goto('/personal/#project=habitar&page=999');
  await expect(page).toHaveURL(/#project=habitar&page=7$/);
  await expect(page.locator('.bm-foot')).toContainText('8 / 8');
  await expect(page.getByRole('button', { name: 'siguiente' })).toBeDisabled();

  await page.goto('/personal/#project=habitar&page=-10');
  await expect(page).toHaveURL(/#project=habitar&page=0$/);
  await expect(page.locator('.bm-foot')).toContainText('1 / 8');
  await expect(page.getByRole('button', { name: 'anterior' })).toBeDisabled();

  await page.goto('/personal/#project=habitar&page=abc');
  await expect(page).toHaveURL(/#project=habitar&page=0$/);
  await expect(page.locator('.bm-foot')).toContainText('1 / 8');

  await page.goto('/personal/#project=no-existe&page=2');
  await expect(page.locator('#bookmodal')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body')).not.toHaveClass(/modal-open/);
});
