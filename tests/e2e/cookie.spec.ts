import { test, expect } from '@playwright/test';

test('first visit consent is a non-blocking bar that can be rejected', async ({ page }) => {
  await page.goto('/');
  const bar = page.getByRole('region', { name: 'Cookie preferences' });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole('button', { name: 'Accept all' })).toBeVisible();

  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  expect(bodyOverflow).not.toBe('hidden');

  await bar.getByRole('button', { name: 'Reject all' }).click();
  await expect(bar).toBeHidden();

  const stored = await page.evaluate(() => localStorage.getItem('cookie-preferences'));
  expect(stored).toContain('"consentGiven":true');
  expect(stored).toContain('"analytics":false');
});

test('manage opens the settings dialog and Escape closes it', async ({ page }) => {
  await page.goto('/');
  const bar = page.getByRole('region', { name: 'Cookie preferences' });
  await expect(bar).toBeVisible();
  await bar.getByRole('button', { name: 'Manage' }).click();
  const dialog = page.getByRole('dialog', { name: 'Cookie Settings' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
