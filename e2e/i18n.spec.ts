import { expect, test } from '@playwright/test';

const families = [
  {
    es: '/personal/',
    en: '/personal/en.html',
    pt: '/personal/pt.html'
  },
  {
    es: '/personal/como-trabajo.html',
    en: '/personal/en/como-trabajo.html',
    pt: '/personal/pt/como-trabajo.html'
  },
  {
    es: '/personal/comunidad-charlas.html',
    en: '/personal/en/comunidad-charlas.html',
    pt: '/personal/pt/comunidad-charlas.html'
  },
  {
    es: '/personal/formacion.html',
    en: '/personal/en/formacion.html',
    pt: '/personal/pt/formacion.html'
  },
  {
    es: '/personal/posts/por-que-hago-tantas-preguntas.html',
    en: '/personal/en/posts/why-do-i-ask-so-many-questions.html',
    pt: '/personal/pt/posts/por-que-faco-tantas-perguntas.html'
  },
  {
    es: '/personal/posts/cuando-puedas.html',
    en: '/personal/en/posts/when-you-can.html',
    pt: '/personal/pt/posts/quando-puder.html'
  }
] as const;

const languages = ['es', 'en', 'pt'] as const;

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test('TC-I18N-001 · cada familia publica html lang y selector coherentes', async ({ page }) => {
  for (const family of families) {
    for (const lang of languages) {
      await page.goto(family[lang]);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      const switcher = page.locator('.language-switcher');
      await expect(switcher).toHaveCount(1);
      await expect(switcher.locator(`a[lang="${lang}"]`)).toHaveAttribute('aria-current', 'page');
      await expect(switcher.locator('a')).toHaveCount(3);
    }
  }
});

test('TC-I18N-002 · el selector conserva la página equivalente entre los tres idiomas', async ({ page }) => {
  for (const family of families) {
    await page.goto(family.es);
    await page.locator('.language-switcher a[lang="en"]').click();
    await expect(page).toHaveURL(new RegExp(`${family.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));

    await page.locator('.language-switcher a[lang="pt"]').click();
    await expect(page).toHaveURL(new RegExp(`${family.pt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));

    await page.locator('.language-switcher a[lang="es"]').click();
    await expect(page).toHaveURL(new RegExp(`${family.es.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  }
});

test('TC-I18N-003 · hreflang declara es, en, pt y x-default con destinos publicados', async ({ page, request }) => {
  for (const family of families) {
    for (const lang of languages) {
      await page.goto(family[lang]);
      const alternates = page.locator('head link[rel="alternate"][hreflang]');
      const values = await alternates.evaluateAll((links) => links.map((link) => ({
        lang: link.getAttribute('hreflang'),
        href: (link as HTMLLinkElement).href
      })));

      expect(new Set(values.map((item) => item.lang))).toEqual(new Set(['es', 'en', 'pt', 'x-default']));
      for (const alternate of values) {
        expect(alternate.href).toBeTruthy();
        const response = await request.get(alternate.href!, { failOnStatusCode: false });
        expect(response.status(), alternate.href!).toBeLessThan(400);
      }
    }
  }
});

test('TC-I18N-004 · canonical y metadatos sociales pertenecen a la ruta actual', async ({ page }) => {
  for (const family of families) {
    for (const lang of languages) {
      await page.goto(family[lang]);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(new URL(canonical!).pathname).toBe(family[lang]);

      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      expect(ogUrl).toBe(canonical);
      expect((await page.title()).trim()).not.toBe('');
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
    }
  }
});

test('TC-I18N-005 · enlaces internos mantienen el locale salvo cambios explícitos de idioma', async ({ page }) => {
  for (const lang of ['en', 'pt'] as const) {
    for (const family of families) {
      await page.goto(family[lang]);
      const offenders = await page.locator('a[href]').evaluateAll((anchors, currentLang) => {
        return anchors.flatMap((anchor) => {
          if (anchor.closest('.language-switcher')) return [];
          const raw = anchor.getAttribute('href');
          if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return [];
          const url = new URL(raw, window.location.href);
          if (url.origin !== window.location.origin || !url.pathname.startsWith('/personal/')) return [];
          const localePrefix = `/personal/${currentLang}/`;
          const localeHome = `/personal/${currentLang}.html`;
          return url.pathname === localeHome || url.pathname.startsWith(localePrefix) ? [] : [url.pathname];
        });
      }, lang);
      expect(offenders, `${lang} ${family[lang]}`).toEqual([]);
    }
  }
});

test('TC-I18N-006 · los destinos equivalentes responden y conservan una única H1', async ({ page, request }) => {
  for (const family of families) {
    for (const lang of languages) {
      const response = await request.get(family[lang], { failOnStatusCode: false });
      expect(response.status(), family[lang]).toBeLessThan(400);
      await page.goto(family[lang]);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).not.toHaveText('');
    }
  }
});
