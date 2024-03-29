import { expect, test } from '@playwright/test';
import { login } from './testMethods';

test('searchPostsIcon is visible', async ({ page }) => {
	await login(page);
	await page.goto('/search/users');
	await expect(page.getByTitle('searchPostsIcon', { exact: true }).first()).toBeVisible();
});

test('searchPostsIcon works', async ({ page }) => {
	await login(page);
	await page.goto('/search/users');
	await page.getByTitle('searchPostsIcon', { exact: true }).click();
	await page.waitForTimeout(1000);
	await expect(page.url()).toContain('/search/posts');
});

test('searchUsersIcon is visible', async ({ page }) => {
	await login(page);
	await page.goto('/search/users');
	await expect(page.getByTitle('searchUsersIcon', { exact: true }).first()).toBeVisible();
});

test('searchUsersIcon has border', async ({ page }) => {
	await login(page);
	await page.goto('/search/users');
	await expect(page.getByTitle('searchUsersIcon', { exact: true }).first()).toHaveAttribute(
		'style',
		expect.stringContaining('border')
	);
});

test('searchUsersInput is visible', async ({ page }) => {
	await login(page);
	await page.goto('/search/users');
	await expect(page.getByTitle('searchUsersInput', { exact: true }).first()).toBeVisible();
});

test('search users works', async ({ page }) => {
	await login(page);
	await page.goto('/search/users');
	await page.getByTitle('searchUsersInput', { exact: true }).fill('a');
	await expect(page.getByTitle('userResult', { exact: true }).first()).toBeVisible();
});

test('No Result works', async ({ page }) => {
	await login(page);
	await page.goto('/search/users');
	await expect(page.getByTitle('noResultText', { exact: true }).first()).toBeVisible();
});
