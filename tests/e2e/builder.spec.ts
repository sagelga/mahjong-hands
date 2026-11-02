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

test('builder adds, removes, and clears tiles', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Build a winning hand.' })).toBeVisible();

  await page.getByRole('button', { name: /Add One Thousand/i }).click();
  await expect(page.getByText('1 / 14')).toBeVisible();

  await page.getByTitle('Clear hand').click();
  await expect(page.getByText('0 / 14')).toBeVisible();

  expect(errors).toEqual([]);
});

test('an example hand reaches the winning state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /All Chow/i }).click();
  await expect(page.getByText('14 / 14')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/is-winning/);
});

test('the tile tray exposes all 42 tiles without an inner scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Add Nine Thousand/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Add Winter/i })).toBeVisible();

  const hasInnerScroll = await page.evaluate(() => {
    return Array.from(document.querySelectorAll<HTMLElement>('.tray-panel, .tile-tray'))
      .some((el) => el.scrollHeight > el.clientHeight + 2);
  });
  expect(hasInnerScroll).toBe(false);
});

test('the page has no horizontal overflow on mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only');
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('the mobile drawer exposes primary navigation', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const drawer = page.locator('#mobile-navigation');
  await expect(drawer.getByRole('link', { name: 'Practice' })).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Glossary' })).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Feedback' })).toBeVisible();
});
