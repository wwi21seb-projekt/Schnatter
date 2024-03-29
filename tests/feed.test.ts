import { expect, test } from '@playwright/test';
import { login } from './testMethods';

test('for you is not visible when not logged in', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('For You')).not.toBeVisible();
});

test('following is not visible when not logged in', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Following')).not.toBeVisible();
});

test('for you is visible when logged in', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await expect(page.getByText('For You')).toBeVisible();
});

test('following is visible when logged in', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await expect(page.getByText('Following')).toBeVisible();
});

test('posts are visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('post', { exact: true }).first()).toBeVisible();
});

test('load more button is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Load more')).toBeVisible();
});

test('load more button works', async ({ page }) => {
	await page.goto('/');
	const postCountBefore = await page.getByTitle('post').count();
	await page.getByText('Load more').click();
	await page.waitForTimeout(1000);
	const postCountAfter = await page.getByTitle('post').count();
	await expect(postCountAfter).toBeGreaterThan(postCountBefore);
});
