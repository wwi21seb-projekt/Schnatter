import { expect, test, type Page } from '@playwright/test';
import { login } from './testMethods';
//hashtag tests are missing
//user und nickname sind vertauscht in postauthor
//kein @ for username in comments
//comment feld dauerhaft disabled
//comments testen wenn nicht mehr hardcoded
//warum testen wir loginToken == undefined
//wo unterschied zu PostUserProfil

test('postdate is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('postdate', { exact: true }).first()).toBeVisible();
});


test('Post Author Username is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('postAuthorUsername', { exact: true }).first()).toBeVisible();
});

test('Postcontent is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('postcontent', { exact: true }).first()).toBeVisible();
});

test('Likecount is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('likeCount', { exact: true }).first()).toBeVisible();
});

test('Can not like when not logged in', async ({ page }) => {
	await page.goto('/');
	const likeCountBefore = await page.getByTitle('likeCount').first().textContent();
	await page.getByTitle('like', { exact: true }).first().click();
	const likeCountAfter = await page.getByTitle('likeCount').first().textContent();
	await expect(likeCountAfter).toBe(likeCountBefore);
});

test('Can like when logged in', async ({ page }) => {
	await login(page);
	await page.goto('/');
	const likeCountBefore = await page.getByTitle('likeCount').first().textContent();
	await page.getByTitle('like', { exact: true }).first().click();
	const likeCountAfter = await page.getByTitle('likeCount').first().textContent();
	await expect(likeCountAfter).not.toBe(likeCountBefore);
});

test('Comments not visible when not logged in', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('commentsHeader', { exact: true }).first()).not.toBeVisible();
});

test('Comments visible when logged in', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await expect(page.getByTitle('commentsHeader', { exact: true }).first()).toBeVisible();
});

test('Can not comment when not logged in', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTitle('commentInput', { exact: true }).first()).not.toBeVisible();
});

test('Can comment when logged in', async ({ page }) => {
	await login(page);
	await page.goto('/');
	await expect(page.getByTitle('commentInput', { exact: true }).first()).toBeVisible();
});
