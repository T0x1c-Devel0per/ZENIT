import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/SteamClean/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Click the contact link
  await page.getByRole('link', { name: 'Solicitar Cotización' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.locator('h3')).toContainText('Solicitar Cotización');
});

test('contact form submission', async ({ page }) => {
  await page.goto('/');

  // Fill out the contact form
  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('input[name="phone"]').fill('3105809250');
  await page.locator('select[name="service"]').click();
  await page.locator('text=Hogares').click(); // Assuming "Hogares" is one of the options
  await page.locator('textarea[name="message"]').fill('Testing contact form');

  // Submit the form
  await page.locator('button[type="submit"]').click();

  // Check for success message
  await expect(page.locator('.contact-success')).toBeVisible();
});