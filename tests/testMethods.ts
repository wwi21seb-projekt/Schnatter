import type { Page } from '@playwright/test';

export async function login(page: Page) {
	await page.goto('/');
	await page.getByPlaceholder('Username').fill('testschnatter');
	await page.getByPlaceholder('Password').fill('Testtest123!');
	await page.getByRole('button', { name: 'Log In' }).click();
	await page.waitForTimeout(1000);
}
