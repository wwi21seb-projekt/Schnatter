import { expect, test } from '@playwright/test';

test('Login is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('logInHeading')).toBeVisible();
});

test('username input is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByPlaceholder('Username')).toBeVisible();
});

test('password input is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByPlaceholder('Password')).toBeVisible();
});

test('Log In button is disabled when no username', async ({ page }) => {
	await page.goto('/');
	await page.getByPlaceholder('Password').fill('password');
	await expect(page.getByRole('button', { name: 'Log In' })).toBeDisabled();
});

test('Log In button is disabled when no password', async ({ page }) => {
	await page.goto('/');
	await page.getByPlaceholder('Username').fill('username');
	await expect(page.getByRole('button', { name: 'Log In' })).toBeDisabled();
});

test('Log In button is enabled when username and password', async ({ page }) => {
	await page.goto('/');
	await page.getByPlaceholder('Username').fill('username');
	await page.getByPlaceholder('Password').fill('password');
	await expect(page.getByRole('button', { name: 'Log In' })).toBeEnabled();
});

test('Log In button works', async ({ page }) => {
	await page.goto('/');
	await page.getByPlaceholder('Username').fill('testschnatter');
	await page.getByPlaceholder('Password').fill('Testtest123!');
	await page.getByRole('button', { name: 'Log In' }).click();
	await page.waitForNavigation();
	await expect(page.getByTitle('search')).toBeVisible();
});

test('register option is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Sign up')).toBeVisible();
});

test('register option works', async ({ page }) => {
	await page.goto('/');
	await page.getByText('Sign up').click();
	await page.waitForTimeout(1000);
	await expect(page.url()).toContain('/register');
});

test('Wrong Credentials works', async ({ page }) => {
	await page.goto('/');
	await page.getByPlaceholder('Username').fill('testschnatter');
	await page.getByPlaceholder('Password').fill('wrong');
	await page.getByRole('button', { name: 'Log In' }).click();
	await page.waitForTimeout(1000);
	await expect(page.getByText('The credentials are invalid. Please check the credentials and try again.').first()).toBeVisible();
});
