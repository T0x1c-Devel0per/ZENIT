# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contact.spec.ts >> contact form submission
- Location: e2e\contact.spec.ts:20:1

# Error details

```
Error: locator.fill: Test ended.
Call log:
  - waiting for locator('input[name="name"]')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('has title', async ({ page }) => {
  4  |   await page.goto('/');
  5  | 
  6  |   // Expect a title "to contain" a substring.
  7  |   await expect(page).toHaveTitle(/Zenit/);
  8  | });
  9  | 
  10 | test('get started link', async ({ page }) => {
  11 |   await page.goto('/');
  12 | 
  13 |   // Click the contact link
  14 |   await page.getByRole('link', { name: 'Solicitar Cotización' }).click();
  15 | 
  16 |   // Expects page to have a heading with the name of Installation.
  17 |   await expect(page.locator('h3')).toContainText('Solicitar Cotización');
  18 | });
  19 | 
  20 | test('contact form submission', async ({ page }) => {
  21 |   await page.goto('/');
  22 |   
  23 |   // Fill out the contact form
> 24 |   await page.locator('input[name="name"]').fill('Test User');
     |                                            ^ Error: locator.fill: Test ended.
  25 |   await page.locator('input[name="email"]').fill('test@example.com');
  26 |   await page.locator('input[name="phone"]').fill('5512345678');
  27 |   await page.locator('select[name="service"]').click();
  28 |   await page.locator('text=Hogares').click(); // Assuming "Hogares" is one of the options
  29 |   await page.locator('textarea[name="message"]').fill('Testing contact form');
  30 |   
  31 |   // Submit the form
  32 |   await page.locator('button[type="submit"]').click();
  33 |   
  34 |   // Check for success message
  35 |   await expect(page.locator('.contact-success')).toBeVisible();
  36 | });
```