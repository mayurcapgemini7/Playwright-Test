// spec: specs/dropdown-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Category Dropdown Tests', () => {
  test('Responsive / Mobile Behavior', async ({ page }) => {
    // 1. Set viewport to mobile dimensions (e.g., 375x812) and load the page
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('https://www.amazon.in/b?node=976392031');

    // 2. Open mobile nav (if applicable) and locate category selection control
    const menuButton = page.locator('#nav-hamburger-menu');
    if (await menuButton.count()) {
      await menuButton.first().click();
    }

    const category = page.locator('select#searchDropdownBox');
    await expect(category).toBeVisible({ timeout: 10000 });

    // 3. Select category on mobile and perform a search
    await category.selectOption({ label: 'Shoes & Handbags' });
    const searchInput = page.locator('#twotabsearchtextbox');
    const searchBtn = page.locator('#nav-search-submit-button');
    await searchInput.fill('boots');
    await searchBtn.click();

    const resultItem = page.locator('div[data-component-type="s-search-result"]');
    await expect(resultItem.first()).toBeVisible({ timeout: 10000 });
  });
});
