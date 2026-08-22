import { expect, test } from '@playwright/test';

// Suite temporal: usa únicamente la simulación pública de fechas del portfolio.
const patrioticDates = [
  ['04-19', '19/04'],
  ['05-18', '18/05'],
  ['06-19', '19/06'],
  ['07-18', '18/07'],
  ['08-25', '25/08']
] as const;

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('TC-DATES-001 · edad cambia exactamente el 13 de mayo', async ({ page }) => {
  await page.goto('/personal/?date=2026-05-12');
  await expect(page.locator('[data-age]').first()).toHaveText('22');
  await page.goto('/personal/?date=2026-05-13');
  await expect(page.locator('[data-age]').first()).toHaveText('23');
  await page.goto('/personal/?date=2027-05-12');
  await expect(page.locator('[data-age]').first()).toHaveText('23');
  await page.goto('/personal/?date=2027-05-13');
  await expect(page.locator('[data-age]').first()).toHaveText('24');
});

test('TC-DATES-002 · cumpleaños se activa solo el 13 de mayo simulado', async ({ page }) => {
  await page.goto('/personal/?date=2026-05-12');
  await expect(page.locator('body')).not.toHaveClass(/celebration--birthday/);
  await expect(page.locator('#specialDateBadge')).toBeHidden();
  await page.goto('/personal/?date=2026-05-13');
  await expect(page.locator('body')).toHaveClass(/celebration--birthday/);
  await expect(page.locator('#specialDateLayer')).toBeVisible();
  await expect(page.locator('#specialDateBadge')).toContainText('Vista previa · Cumpleaños');
  await expect(page.locator('#birthdayConfetti .birthday-confetti')).toHaveCount(34);
  await page.goto('/personal/?date=2026-05-14');
  await expect(page.locator('body')).not.toHaveClass(/celebration--birthday/);
});

test('TC-DATES-003 · Halloween se activa solo el 31 de octubre simulado', async ({ page }) => {
  await page.goto('/personal/?date=2026-10-30');
  await expect(page.locator('body')).not.toHaveClass(/celebration--halloween/);
  await page.goto('/personal/?date=2026-10-31');
  await expect(page.locator('body')).toHaveClass(/celebration--halloween/);
  await expect(page.locator('#specialDateBadge')).toContainText('Vista previa · Halloween en el estudio');
  await page.goto('/personal/?date=2026-11-01');
  await expect(page.locator('body')).not.toHaveClass(/celebration--halloween/);
});

test('TC-DATES-004 · las cinco fechas patrias definidas activan su celebración', async ({ page }) => {
  for (const [date, label] of patrioticDates) {
    await page.goto(`/personal/?date=2026-${date}`);
    await expect(page.locator('body')).toHaveClass(/celebration--patriotic/);
    await expect(page.locator('#specialDateBadge')).toContainText(`Vista previa · Fecha patria · ${label}`);
  }
});

test('TC-DATES-005 · fechas simuladas inválidas caen al comportamiento real sin preview', async ({ page }) => {
  const invalidDates = ['2026-02-29', '2026-04-31', '2026-13-01', '2026-00-10', '26-05-13', 'abc'];
  await page.goto('/personal/');
  const baselineAge = await page.locator('[data-age]').first().textContent();
  for (const date of invalidDates) {
    await page.goto(`/personal/?date=${encodeURIComponent(date)}`);
    await expect(page.locator('[data-age]').first()).toHaveText(baselineAge ?? '');
    await expect(page.locator('#specialDateBadge')).not.toContainText('Vista previa');
  }
});

test('TC-DATES-006 · preview por id funciona sin cambiar la fecha del dispositivo', async ({ page }) => {
  await page.goto('/personal/?celebration=birthday');
  await expect(page.locator('body')).toHaveClass(/celebration--birthday/);
  await expect(page.locator('#specialDateBadge')).toContainText('Vista previa · Cumpleaños');
  await page.goto('/personal/?celebration=halloween');
  await expect(page.locator('body')).toHaveClass(/celebration--halloween/);
  await expect(page.locator('#specialDateBadge')).toContainText('Vista previa · Halloween en el estudio');
  await page.goto('/personal/?celebration=patriotic-08-25');
  await expect(page.locator('body')).toHaveClass(/celebration--patriotic/);
  await expect(page.locator('#specialDateBadge')).toContainText('Vista previa · Fecha patria · 25/08');
});
