import { expect, test } from '@playwright/test';
import { login } from './testMethods';

//needs more testing
//why UserProfilePost

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
	await expect(page.getByText('Posts', { exact: true })).toBeVisible();
	await expect(page.getByTitle('postCount')).toBeVisible();
});

test('number of followers is visible', async ({ page }) => {
	await login(page);
	await page.goto('/profile');
	await expect(page.getByText('Followers')).toBeVisible();
	await expect(page.getByTitle('followerCount')).toBeVisible();
});

test('number of following is visible', async ({ page }) => {
	await login(page);
	await page.goto('/profile');
	await expect(page.getByText('Following')).toBeVisible();
	await expect(page.getByTitle('followingCount')).toBeVisible();
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
