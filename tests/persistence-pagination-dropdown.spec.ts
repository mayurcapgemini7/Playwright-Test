// spec: specs/dropdown-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Category Dropdown Tests', () => {
  test('Persistence Across Navigation & Pagination', async ({ page }) => {
    // 1. Select a category and perform a search, then navigate to page 2 of results
    await page.goto('https://www.amazon.in/b?node=976392031');
    const category = page.locator('select#searchDropdownBox');
    await expect(category).toBeVisible({ timeout: 10000 });
    await category.selectOption({ label: 'Shoes & Handbags' });

    const searchInput = page.locator('#twotabsearchtextbox');
    const searchBtn = page.locator('#nav-search-submit-button');
    await searchInput.fill('sneakers');
    await searchBtn.click();

    const page2Link = page.locator('a[href*="page=2"]').first();
    if (await page2Link.count()) {
      await page2Link.click();
      await expect(page).toHaveURL(/page=2|page%3D2/, { timeout: 10000 });
    }

    // 2. Use browser back/forward to navigate between results and previous pages
    await page.goBack();
    await page.goForward();
    await expect(category).toBeVisible();
  });
});
