import { expect, test } from '@playwright/test';

test('Logo is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('img', { name: 'Schnatter Logo Footer', exact: true })).toBeVisible();
});

test('Imprint button is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Imprint')).toBeVisible();
});

test('Imprint button works', async ({ page }) => {
	await page.goto('/');
	await page.getByText('Imprint').click();
	await page.waitForTimeout(1000);
	await expect(page.url()).toContain('/imprint');
});
