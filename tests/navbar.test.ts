import { expect, test, type Page } from '@playwright/test';

//username testschnatter
//password Testtest123!

async function login(page: Page){
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('testschnatter');
    await page.getByPlaceholder('Password').fill('Testtest123!');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForNavigation();
}

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
    await expect(page.getByTitle('Home')).toBeVisible();
});

test('other buttons not visible when not logged in', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTitle('Search')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Post' })).not.toBeVisible();
    await expect(page.getByTitle('Messages')).not.toBeVisible();
    await expect(page.getByTitle('Profile')).not.toBeVisible();
    await expect(page.getByTitle('Logout')).not.toBeVisible();
});

test('other buttons visible when logged in', async ({ page }) => {
    await login(page);
    await expect(page.getByTitle('Search')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Post' })).toBeVisible();
    await expect(page.getByTitle('Messages')).toBeVisible();
    await expect(page.getByTitle('Profile')).toBeVisible();
    await expect(page.getByTitle('Log Out')).toBeVisible();
});

test('Search button works', async ({ page }) => {
    await login(page);
    await page.goto('/');
    await page.getByTitle('Search').click();
    await page.waitForTimeout(1000);
    await expect(page.url()).toContain('/search/users');
});

test('Post button works', async ({ page }) => {
    await login(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Post' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByPlaceholder('Write your post here')).toBeVisible();
});

test('Messages button works', async ({ page }) => {
    await login(page);
    await page.goto('/');
    await page.getByTitle('Messages').click();
    await page.waitForTimeout(1000);
    await expect(page.url()).toContain('/messages');
});

test('Profile button works', async ({ page }) => {
    await login(page);
    await page.goto('/');
    await page.getByTitle('Profile').click();
    await page.waitForTimeout(1000);
    await expect(page.url()).toContain('/profile');
});

test('Logout button works', async ({ page }) => {
    await login(page);
    await page.goto('/');
    await page.getByTitle('Log Out').click();
    await page.waitForTimeout(1000);
    await expect(page.getByTitle("Search")).not.toBeVisible();
});