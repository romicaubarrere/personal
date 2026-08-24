import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('AUDIT-UI-001 · selector de idiomas es compacto, transparente y no tapa el menú', async ({ page }) => {
  await page.goto('/personal/');
  const switcher = page.locator('.language-switcher');
  await expect(switcher).toBeVisible();
  await expect(switcher.locator('a')).toHaveCount(3);

  const styles = await switcher.evaluate((node) => {
    const cs = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return {
      backgroundColor: cs.backgroundColor,
      boxShadow: cs.boxShadow,
      width: box.width,
      height: box.height
    };
  });

  expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(styles.boxShadow).toBe('none');
  expect(styles.width).toBeLessThan(110);
  expect(styles.height).toBeLessThanOrEqual(36);

  const nav = page.locator('#primary-nav');
  const switcherBox = await switcher.boundingBox();
  const navBox = await nav.boundingBox();
  if (switcherBox && navBox) {
    const overlaps = !(
      switcherBox.x + switcherBox.width <= navBox.x ||
      navBox.x + navBox.width <= switcherBox.x ||
      switcherBox.y + switcherBox.height <= navBox.y ||
      navBox.y + navBox.height <= switcherBox.y
    );
    expect(overlaps).toBe(false);
  }
});

test('AUDIT-UI-002 · experiencia se ve sin depender de IntersectionObserver', async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error simulated legacy/no-observer environment
    window.IntersectionObserver = undefined;
  });
  await page.goto('/personal/formacion.html#experiencia');

  await expect(page.locator('#experiencia')).toBeVisible();
  await expect(page.locator('#experiencia .job-card')).toHaveCount(4);
  for (const card of await page.locator('#experiencia .job-card').all()) {
    await expect(card).toBeVisible();
  }
  await expect(page.locator('.contact-tab')).toBeHidden();
});

test('AUDIT-UI-003 · la transición entre secciones ya no crea un bloque crema', async ({ page }) => {
  await page.goto('/personal/');
  const seams = page.locator('.studio-seam');
  await expect(seams).toHaveCount(3);

  const backgrounds = await seams.evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).backgroundColor)
  );
  expect(backgrounds.every((value) => value === 'rgba(0, 0, 0, 0)')).toBe(true);
});

test('AUDIT-UI-004 · mobile conserva selector e interacción de menú sin solapamiento', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Cobertura exclusiva de mobile');
  await page.goto('/personal/');

  const switcher = page.locator('.language-switcher');
  const toggle = page.locator('#navToggle');
  await expect(switcher).toBeVisible();
  await expect(toggle).toBeVisible();

  const a = await switcher.boundingBox();
  const b = await toggle.boundingBox();
  if (a && b) {
    const overlaps = !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
    expect(overlaps).toBe(false);
  }

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#primary-nav')).toBeVisible();
});
