import { expect, test } from '@playwright/test';

// email tests (Special characters missing)
test('email must contain \'@\'', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('notatanemail.de');
	await expect(page.getByText('*This is no vaild email')).toBeVisible();
});

test('email must contain \'.\'', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('notat@anemaildotde');
	await expect(page.getByText('*This is no vaild email')).toBeVisible();
});

test('email must not contain spaces', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('not@ anemail.de');
	await expect(page.getByText('*This is no vaild email')).toBeVisible();
});

test('email must contain something before \'@\'', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('@anemail.de');
	await expect(page.getByText('*This is no vaild email')).toBeVisible();
});

test('email must contain something after \'@\'', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('not@.de');
	await expect(page.getByText('*This is no vaild email')).toBeVisible();
});

test('email must contain something after \'.\'', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('not@anemail.');
	await expect(page.getByText('*This is no vaild email')).toBeVisible();
});

test('valid email is accepted', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('an@email.de');
	await expect(page.getByText('*This is no vaild email')).toBeHidden();
});

// username tests
test('username must not be empty', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Username').fill('');
	await expect(page.getByRole("button", {name: "Register"})).toBeDisabled();
});

test('valid username is accepted', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Username').fill('username');
	await expect(page.getByText('*This is no valid username')).toBeHidden();
});

//password tests
test('password must be at least 8 chars', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Password').first().fill('1234567');
	await expect(page.getByText('*Password to short (min 8 character)')).toBeVisible();
	await page.getByPlaceholder('Password').first().fill('12345678');
	await expect(page.getByText('*Password to short (min 8 character)')).toBeHidden();
});

test('password must contain at least one Uppercase', async ({ page }) => {
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
	await expect(page.getByRole("button", {name: "Register"})).toBeDisabled();
});

// full test
test('register button is enabled when all inputs are valid', async ({ page }) => {
	await page.goto('/register');
	await page.getByPlaceholder('Email').fill('an@email.de');
	await page.getByPlaceholder('Username').fill('username');
	await page.getByPlaceholder('Password').first().fill('Password1!');
	await page.getByPlaceholder('Password').last().fill('Password1!');
	await expect(page.getByRole("button", {name: "Register"})).toBeEnabled();
});