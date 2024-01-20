import { expect, test, type Page } from '@playwright/test';
import { login } from './testMethods';

test('logo is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('img', { name: 'Schnatter Logo Header', exact: true })).toBeVisible();
});

test('Schnatter is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Schnatter')).toBeVisible();
});

test('Home is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('home')).toBeVisible();
});

test('other buttons not visible when not logged in', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('search')).not.toBeVisible();
	await expect(page.getByRole('button', { name: 'post' })).not.toBeVisible();
	await expect(page.getByTitle('messages')).not.toBeVisible();
	await expect(page.getByTitle('profile')).not.toBeVisible();
	await expect(page.getByTitle('logOut')).not.toBeVisible();
});

test('other buttons visible when logged in', async ({ page }) => {
	await login(page);
	await expect(page.getByTitle('search')).toBeVisible();
	await expect(page.getByRole('button', { name: 'post' })).toBeVisible();
	await expect(page.getByTitle('messages')).toBeVisible();
	await expect(page.getByTitle('profile')).toBeVisible();
	await expect(page.getByTitle('logOut')).toBeVisible();
});

test('Search button works', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await page.getByTitle('search').click();
	await page.waitForTimeout(1000);
	await expect(page.url()).toContain('/search/users');
});

test('Post button works', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await page.getByRole('button', { name: 'post' }).click();
	await page.waitForTimeout(1000);
	await expect(page.getByPlaceholder('Write your post here')).toBeVisible();
});

test('Messages button works', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await page.getByTitle('messages').click();
	await page.waitForTimeout(1000);
	await expect(page.url()).toContain('/messages');
});

test('Profile button works', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await page.getByTitle('profile').click();
	await page.waitForTimeout(1000);
	await expect(page.url()).toContain('/profile');
});

test('Logout button works', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await page.getByTitle('logOut').click();
	await page.waitForTimeout(1000);
	await expect(page.getByTitle('search')).not.toBeVisible();
});
