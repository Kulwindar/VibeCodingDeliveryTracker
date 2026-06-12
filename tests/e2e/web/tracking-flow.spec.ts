import { test, expect, describe } from '@playwright/test';

describe('Tracking Flow', () => {
  test('renders 3-step timeline with correct states', async ({ page }) => {
    await page.goto('/track/demo-tracking-123');

    const timelineSteps = page.getByTestId(/timeline-step-/);
    await expect(timelineSteps).toHaveCount(3);
  });

  test('shows Order not found for invalid tracking URL', async ({ page }) => {
    await page.goto('/track/00000000-0000-0000-0000-000000000000');

    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Order not found/i);
  });
});