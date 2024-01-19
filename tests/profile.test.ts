import { expect, test, type Page } from '@playwright/test';

//username testschnatter
//password Testtest123!
//needs more testing

async function login(page: Page){
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('testschnatter');
    await page.getByPlaceholder('Password').fill('Testtest123!');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForNavigation();
}

test('username is visible', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await expect(page.getByText('testschnatter')).toBeVisible();
});

test('nickname is visible', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await expect(page.getByText('testnickname')).toBeVisible();
});

test('number of posts is visible', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await expect(page.getByText('Posts', {exact: true})).toBeVisible();
});

test('number of followers is visible', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await expect(page.getByText('Followers')).toBeVisible();
});

test('number of following is visible', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await expect(page.getByText('Following')).toBeVisible();
});

test('no posts is visible', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('passwordtest');
    await page.getByPlaceholder('Password').fill('Abcdefghi1!');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForNavigation();
    await page.goto('/profile');
    await expect(page.getByText('User has no posts yet')).toBeVisible();
});