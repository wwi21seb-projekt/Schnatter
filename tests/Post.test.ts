import { expect, test, type Page } from '@playwright/test';

//hashtag tests are missing
//user und nickname sind vertauscht in postauthor
//kein @ for username in comments
//comment feld dauerhaft disabled
//comments testen wenn nicht mehr hardcoded
//warum testen wir loginToken == undefined

async function login(page: Page){
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('testschnatter');
    await page.getByPlaceholder('Password').fill('Testtest123!');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForNavigation();
}

test('postdate is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTitle('Postdate', {exact: true}).first()).toBeVisible();
});

test("Post Author Nickname is visible", async ({ page }) => {
    page.goto('/');
    await expect(page.getByTitle('Post Author Nickname', {exact: true}).first()).toBeVisible();
});

test("Post Author Username is visible", async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTitle('Post Author Username', {exact: true}).first()).toBeVisible();
});

test("Postcontent is visible", async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTitle('Postcontent', {exact: true}).first()).toBeVisible();
});

test("Likecount is visible", async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTitle('Likecount', {exact: true}).first()).toBeVisible();
});

test("Can not like when not logged in", async ({ page }) => {
    await page.goto('/');
    const likeCountBefore = await page.getByTitle('Likecount').first().textContent();
    await page.getByTitle('Like', {exact: true}).first().click();
    const likeCountAfter = await page.getByTitle('Likecount').first().textContent();
    await expect(likeCountAfter).toBe(likeCountBefore);
});

test("Can like when logged in", async ({ page }) => {
    await login(page);
    await page.goto('/');
    const likeCountBefore = await page.getByTitle('Likecount').first().textContent();
    await page.getByTitle('Like', {exact: true}).first().click();
    const likeCountAfter = await page.getByTitle('Likecount').first().textContent();
    await expect(likeCountAfter).not.toBe(likeCountBefore);
});

test("Comments not visible when not logged in", async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTitle('Commentsheader', {exact: true}).first()).not.toBeVisible();
});

test("Comments visible when logged in", async ({ page }) => {
    await login(page);
    await page.goto('/');
    await expect(page.getByTitle('Commentsheader', {exact: true}).first()).toBeVisible();
});

test("Can not comment when not logged in", async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTitle('Commentinput', {exact: true}).first()).not.toBeVisible();
});

test("Can comment when logged in", async ({ page }) => {
    await login(page);
    await page.goto('/');
    await expect(page.getByTitle('Commentinput', {exact: true}).first()).toBeVisible();
});