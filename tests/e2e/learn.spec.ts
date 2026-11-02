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

test('the Learn hub renders every step without truncation', async ({ page }) => {
  await page.goto('/learn');
  await expect(page.getByRole('heading', { name: 'Learn Mahjong' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Strategize your hand' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Game setup' })).toBeVisible();

  const clipped = await page.getByRole('heading', { name: 'Strategize your hand' }).evaluate((el) => {
    return el.scrollWidth > el.clientWidth + 1;
  });
  expect(clipped).toBe(false);
});

test('the Learn overview is reachable from the nav', async ({ page, isMobile }) => {
  await page.goto('/');

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('#mobile-navigation').getByRole('link', { name: 'Learn' }).click();
  } else {
    await page.locator('.nav-links').getByRole('link', { name: 'Learn' }).click();
  }

  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole('heading', { name: 'Learn Mahjong' })).toBeVisible();
});
