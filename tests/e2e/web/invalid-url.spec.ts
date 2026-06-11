import { test, expect, describe } from '@playwright/test';

describe('Invalid URL Handling', () => {
  test('shows error message for non-existent tracking ID', async ({ page }) => {
    await page.goto('/track/invalid-url-123');

    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Order not found');
  });

  test('does not expose stack trace or DB errors', async ({ page }) => {
    await page.goto('/track/invalid-url-123');

    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Error:');
    expect(bodyText).not.toContain('stack');
    expect(bodyText).not.toContain('postgres');
  });
});