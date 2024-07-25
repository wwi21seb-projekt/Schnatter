import { expect, test } from '@playwright/test';
import { login } from './testMethods';

test('Reset Password is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Click here', exact: true }).first()).toBeVisible();
});

test('Reset Password is not visible when logged in', async ({ page }) => {
	await login(page);
	await expect(
		page.getByRole('button', { name: 'Click here', exact: true }).first()
	).not.toBeVisible();
});

test('Reset Password Button works', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Click here', exact: true }).click();
	await page.waitForTimeout(1000);
	await expect(page.getByText('Reset Password', { exact: true }).first()).toBeVisible();
});

test('Reset Password Model works', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Click here', exact: true }).click();
	await page.waitForTimeout(1000);
	await page.getByRole('textbox', { name: 'username*', exact: true }).fill('emailtest');
	await page.getByRole('button', { name: 'Send Code', exact: true }).click();
	await expect(page.getByRole('textbox', { name: 'code*', exact: true })).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'New Password*', exact: true })).toBeVisible();
	await expect(
		page.getByRole('textbox', { name: 'Repeat New Password*', exact: true })
	).toBeVisible();
});
