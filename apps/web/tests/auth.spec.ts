import { test, expect } from '@playwright/test';

test.describe('Workspace Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the landing page
    await page.goto('/');
  });
  const userEmail = `new-${Date.now()}@example.co`

  test('user can sign up and reach the dashboard', async ({ page }) => {
    // Navigate to Sign Up
    await page.goto('/auth/sign-up');

    // Fill in sign up details
    await page.fill('input[name="name"]', 'Deepmind Tester');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('user can create a new workspace through onboarding', async ({ page }) => {
    // 1. Sign In with the user created above (or just go to dashboard if already authed)
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
    await expect(page).toHaveURL(/\/dashboard\/e2e-testing-corp/, { timeout: 30000 });

    // 6. Verify brand data is rendered
    await expect(page.locator('text=E2E Testing Corp')).toBeVisible();
    await expect(page.locator('text=Brand Identity')).toBeVisible();
  });
});
