import { expect, test } from '@playwright/test';

test('demo renders and shows validation errors', async ({ page }) => {
  await page.goto('/demo/basic.html');
  await expect(page.locator('form[data-validate="true"]')).toBeVisible();

  const email = page.locator('#email');
  await email.fill('bad@@mail');
  await email.blur();

  await expect(page.locator('#warning-email')).toBeVisible();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
});
