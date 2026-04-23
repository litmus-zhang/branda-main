import { test, expect } from '@playwright/test';

test.describe('Workspace Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the landing page
    await page.goto('/');
  });
  const userEmail = `new-${Date.now()}@example.com`

  test('user can log in and see the dashboard', async ({ page }) => {
    // Navigate to Sign In
    await page.click('text=Log In');
    await expect(page).toHaveURL(/\/auth\/sign-in/);

    // Fill in test credentials (assume these exist in test DB)
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('user can create a new workspace through onboarding', async ({ page }) => {
    // 1. Login first
    await page.goto('/auth/sign-in');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // 2. Click Create New Workspace (if in dashboard)
    await page.click('text=Create Workspace');
    await expect(page).toHaveURL(/\/dashboard\/new/);

    // 3. Fill the generator form
    await page.fill('input[placeholder*="business name"]', 'E2E Testing Corp' + Date.now());
    await page.fill('input[placeholder*="niche"]', 'Software Testing Services');
    await page.fill('textarea[placeholder*="Describe your business"]', 'We provide automated E2E testing for modern web apps.');

    // 4. Submit and wait for generation (this might take a while, AI call)
    await page.click('button:has-text("Generate")');

    // 5. Verify transition to the specific workspace slug
    // We expect a slug like 'e2e-testing-corp'
    await expect(page).toHaveURL(/\/dashboard\/e2e-testing-corp/, { timeout: 30000 });

    // 6. Verify brand data is rendered
    await expect(page.locator('text=E2E Testing Corp')).toBeVisible();
    await expect(page.locator('text=Brand Identity')).toBeVisible();
  });
});
