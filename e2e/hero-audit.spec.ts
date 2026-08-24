import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

const messages = [
  ['/personal/', 'Hago muchas preguntas, ordeno lo complejo y convierto decisiones en un plan que el equipo puede ejecutar.'],
  ['/personal/en.html', 'I ask a lot of questions, bring order to complexity and turn decisions into a plan the team can execute.'],
  ['/personal/pt.html', 'Faço muitas perguntas, organizo a complexidade e transformo decisões em um plano que a equipe consegue executar.']
] as const;

for (const [path, message] of messages) {
  test(`HERO-AUDIT · propuesta específica en ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('.hero-copy')).toHaveText(message);
    await expect(page.locator('.hero-copy')).not.toContainText(/personas, producto y tecnología|people, product and technology|pessoas, produto e tecnologia/i);
  });
}

test('HERO-AUDIT · CTA tienen costura visible y siguen siendo enlaces accesibles', async ({ page }) => {
  await page.goto('/personal/');
  const actions = page.locator('.hero-actions .stitched-cta');
  await expect(actions).toHaveCount(2);
  await expect(actions.nth(0)).toHaveAttribute('href', '#proyectos');
  await expect(actions.nth(1)).toHaveAttribute('href', '#contacto');

  const stitch = await actions.nth(0).evaluate((node) => {
    const before = getComputedStyle(node, '::before');
    const after = getComputedStyle(node, '::after');
    return {
      beforeBorder: before.borderStyle,
      afterContent: after.content,
      minHeight: node.getBoundingClientRect().height
    };
  });
  expect(stitch.beforeBorder).toBe('dashed');
  expect(stitch.afterContent).not.toBe('none');
  expect(stitch.minHeight).toBeGreaterThanOrEqual(44);
});

test('HERO-AUDIT · reduced motion elimina el desplazamiento del CTA', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/personal/');
  const cta = page.locator('.stitched-cta').first();
  await cta.focus();
  const transform = await cta.evaluate((node) => getComputedStyle(node).transform);
  expect(transform).toBe('none');
});
