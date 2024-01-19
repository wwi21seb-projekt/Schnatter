import { expect, test } from '@playwright/test';

test('Login is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTitle('Log In Heading')).toBeVisible();
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
    await expect(page.getByTitle('Search')).toBeVisible();
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