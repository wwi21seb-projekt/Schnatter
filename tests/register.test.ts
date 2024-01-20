import { expect, test } from '@playwright/test';

// email tests
test('email is visible', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByPlaceholder('Email*')).toBeVisible();
});

test("email must contain '@'", async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('notatanemail.de');
	await expect(page.getByText('*This is no valid email')).toBeVisible();
});

test("email must contain '.'", async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('notat@anemaildotde');
	await expect(page.getByText('*This is no valid email')).toBeVisible();
});

test('email must not contain spaces', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('not@ anemail.de');
	await expect(page.getByText('*This is no valid email')).toBeVisible();
});

test('email must not contain special characters', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('not@anemail!.de');
	await expect(page.getByText('*This is no valid email')).toBeVisible();
	await page.getByPlaceholder('Email').fill('not@anemäil.de');
	await expect(page.getByText('*This is no valid email')).toBeVisible();
});

test("email must contain something before '@'", async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('@anemail.de');
	await expect(page.getByText('*This is no valid email')).toBeVisible();
});

test("email must contain something after '@'", async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('not@.de');
	await expect(page.getByText('*This is no valid email')).toBeVisible();
});

test("email must contain two chars after '.'", async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('not@anemail.d');
	await expect(page.getByText('*This is no valid email')).toBeVisible();
});

test('email accepted when valid', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('an@email.de');
	await expect(page.getByText('*This is no valid email')).toBeHidden();
});

// username tests
test('username is visible', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByPlaceholder('Username*')).toBeVisible();
});

test('username must not be empty', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Username').fill('');
	await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
});

test('username must not contain spaces', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Username').fill('user name');
	await expect(page.getByText('*no spaces allowed')).toBeVisible();
});

test('username can not be too long', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Username').fill('usernameusernameusernameusername');
	await expect(page.getByText('*Username too long')).toBeVisible();
});

test('username must not contain illegal characters', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Username').fill('世');
	await expect(page.getByText('*contains illegal characters')).toBeVisible();
});

test('username accepted when valid', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Username').fill('username');
	await expect(page.getByText('*no spaces allowed')).toBeHidden();
	await expect(page.getByText('*Username too long')).toBeHidden();
	await expect(page.getByText('*contains illegal characters')).toBeHidden();
});

//nickname tests
test('nickname is visible', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByPlaceholder('Nickname')).toBeVisible();
});

test('nickname must not be too long', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Nickname').fill('nicknamenicknamenicknamenickname');
	await expect(page.getByText('*Nickname too long')).toBeVisible();
});

test('nickname accepted when valid', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Nickname').fill('nickname');
	await expect(page.getByText('*Nickname too long')).toBeHidden();
});

//password tests
test('password is visible', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByPlaceholder('Password').first()).toBeVisible();
});

test('repeat password is visible', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByPlaceholder('Repeat Password')).toBeVisible();
});

test('password must be at least 8 chars', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Password').first().fill('1234567');
	await expect(page.getByText('*Password too short (min 8 character)')).toBeVisible();
	await page.getByPlaceholder('Password').first().fill('12345678');
	await expect(page.getByText('*Password too short (min 8 character)')).toBeHidden();
});

test('password must contain at least one capital letter', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Password').first().fill('password');
	await expect(page.getByText('*Password must contain a captial letter')).toBeVisible();
	await page.getByPlaceholder('Password').first().fill('Password');
	await expect(page.getByText('*Password must contain a captial letter')).toBeHidden();
});

test('password must contain at least one special character', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Password').first().fill('Password');
	await expect(page.getByText('*Password must contain a special character')).toBeVisible();
	await page.getByPlaceholder('Password').first().fill('Password!');
	await expect(page.getByText('*Password must contain a special character')).toBeHidden();
});

test('password must contain at least one number', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Password').first().fill('Password!');
	await expect(page.getByText('*Password must contain a number')).toBeVisible();
	await page.getByPlaceholder('Password').first().fill('Password1!');
	await expect(page.getByText('*Password must contain a number')).toBeHidden();
});

test('passwords must match', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Password').first().fill('Password1!');
	await page.getByPlaceholder('Password').last().fill('Password2!');
	await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
});

// full test
test('register button is enabled when all inputs are valid', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('an@email.de');
	await page.getByPlaceholder('Username').fill('username');
	await page.getByPlaceholder('Password').first().fill('Password1!');
	await page.getByPlaceholder('Password').last().fill('Password1!');
	await expect(page.getByRole('button', { name: 'Register' })).toBeEnabled();
});

// cancel button
test('cancel button is visible', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
});

test('cancel button works', async ({ page }) => {
	await page.goto('/register');
	await page.getByRole('button', { name: 'Cancel' }).click();
	await page.waitForTimeout(1000);
	await expect(page.url()).not.toContain('/register');
});
