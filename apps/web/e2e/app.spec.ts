import { test, expect } from '@playwright/test';

test.describe('Branda User Journey', () => {
  
  test('Full flow: Landing -> Generate -> Auth -> Dashboard', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page.getByText('Launch your dream business')).toBeVisible();

    // 2. Fill out generation form
    await page.getByPlaceholder('e.g. Coffee Shop, SaaS...').fill('Sustainable Coffee Shop');
    await page.getByPlaceholder('e.g. USA, UK...').fill('USA');
    await page.getByPlaceholder('Have a name in mind?').fill('GreenBrew');
    await page.getByPlaceholder('Describe your unique value proposition...').fill('Eco-friendly coffee shop with zero waste policy.');

    // 3. Click Generate
    await page.getByRole('button', { name: 'Generate My Business' }).click();

    // 4. Expect Loader
    await expect(page.getByText('Building your Empire...')).toBeVisible();

    // 5. Expect Auth Modal (assuming generation takes < 30s)
    // We expect the workspace name "GreenBrew" to be in the modal text
    await expect(page.getByText('Save your Workspace', { exact: false })).toBeVisible({ timeout: 60000 });
    await expect(page.getByText('GreenBrew')).toBeVisible();

    // 6. Sign Up
    await page.getByPlaceholder('Elon Musk').fill('Jane Doe');
    await page.getByPlaceholder('elon@example.com').fill('jane@greenbrew.com');
    await page.getByRole('button', { name: 'Claim Workspace' }).click();

    // 7. Verify Dashboard Landing
    await expect(page.getByText('Core Identity')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GreenBrew' })).toBeVisible();

    // 8. Test Navigation
    await page.getByRole('button', { name: 'marketing' }).click();
    await expect(page.getByText('Core Strategy')).toBeVisible();

    // 9. Test Edit functionality (Brand)
    await page.getByRole('button', { name: 'brand' }).click();
    await page.getByRole('button', { name: 'Edit Assets' }).click();
    
    // Check if inputs are editable
    const nameInput = page.locator('input[value="GreenBrew"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('GreenBrew Revised');
    
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Verify Update
    await expect(page.getByRole('heading', { name: 'GreenBrew Revised' })).toBeVisible();
  });

  test('New Workspace Creation from Dashboard', async ({ page }) => {
    // Setup local storage state for logged in user (usually done via global setup or fixture)
    await page.addInitScript(() => {
        window.localStorage.setItem('branda_user', JSON.stringify({ name: 'User', email: 'user@test.com' }));
        window.localStorage.setItem('branda_workspaces', JSON.stringify([{
            id: '1',
            name: 'Initial WS',
            plan: { brandIdentity: { name: 'Initial WS', slogan: '', mission: '', vision: '', colors: [], fonts: [], logoConcept: '', logoSvg: '', toneOfVoice: '' }, marketing: { targetAudience: '', keyChannels: [], strategy: '', contentIdeas: [] }, systems: { sops: [], techStackRecommendation: [] }, crm: { onboardingProcess: [], mockCustomers: [] } },
            integrations: [],
            collaborators: [{ id: '1', email: 'user@test.com', role: 'owner', status: 'active', invitedAt: '' }],
            createdAt: new Date().toISOString()
        }]));
    });

    await page.goto('/');
    
    // Navigate to Create New
    await page.getByRole('button', { name: 'Create Workspace' }).click();
    await expect(page.getByRole('heading', { name: 'Create New Workspace' })).toBeVisible();

    // Fill form
    await page.getByPlaceholder('e.g. Digital Marketing Agency').fill('Yoga Studio');
    await page.getByPlaceholder('e.g. Canada').fill('Canada');
    await page.getByPlaceholder('What kind of business is this?').fill('Community yoga');
    
    // Submit
    await page.getByRole('button', { name: 'Generate & Create' }).click();
    
    // Expect loader and then new workspace
    await expect(page.getByText('Generating New Workspace...')).toBeVisible();
  });
});