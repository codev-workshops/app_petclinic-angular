import { expect, test } from '@playwright/test';

test.describe('spring-petclinic-angular App', () => {
  test('should display the welcome page and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-root')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Welcome to Petclinic');
    await expect(page.getByTitle('home page')).toBeVisible();
    await expect(page.getByTitle('pettypes')).toBeVisible();
    await expect(page.getByTitle('specialties')).toBeVisible();
  });
});
