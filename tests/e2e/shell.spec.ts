import { test, expect } from '@playwright/test';

const CONSENT = {
  functional: true,
  analytics: false,
  consentGiven: true,
  consentTimestamp: Date.now(),
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript((prefs) => {
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    localStorage.setItem('theme', 'dark');
  }, CONSENT);
});

test('dark is the default theme and the theme sheet is keyboard-dismissable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: 'Theme' }).click();
  const dialog = page.getByRole('dialog', { name: 'Theme' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('the footer links and copyright meet the contrast bar', async ({ page }) => {
  await page.goto('/');
  const contrastOk = await page.evaluate(() => {
    const parse = (color: string) => color.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
    const lum = (rgb: number[]) => {
      const v = rgb.slice(0, 3).map((c) => {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    };
    const ratio = (a: number[], b: number[]) => {
      const A = lum(a);
      const B = lum(b);
      return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
    };
    const footer = document.querySelector('footer');
    const link = document.querySelector('.footer-col a');
    if (!footer || !link) return false;
    const bg = parse(getComputedStyle(footer).backgroundColor);
    const fg = parse(getComputedStyle(link).color);
    return ratio(bg, fg) >= 4.5;
  });
  expect(contrastOk).toBe(true);
});
