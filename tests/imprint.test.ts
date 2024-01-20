import { expect, test } from '@playwright/test';

test('frontend imprint is shown', async ({ page }) => {
	await page.goto('/imprint');
	await expect(page.getByText('Imprint Frontend')).toBeVisible();
});

test('backend imprint is shown', async ({ page }) => {
	await page.goto('/imprint');
	await expect(page.getByText('Imprint Backend')).toBeVisible();
});
