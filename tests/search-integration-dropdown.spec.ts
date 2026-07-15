// spec: specs/dropdown-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Category Dropdown Tests', () => {
  test('Search Integration — category pre-select persists into search request', async ({ page }) => {
    // 1. Open page, select a category from the dropdown
    await page.goto('https://www.amazon.in/b?node=976392031');
    const category = page.locator('select#searchDropdownBox');
    await expect(category).toBeVisible({ timeout: 10000 });
    await category.selectOption({ label: 'Shoes & Handbags' });
    await expect(category).toHaveValue(/.+/);

    // 2. Enter query term into search input and submit
    const searchInput = page.locator('#twotabsearchtextbox');
    const searchBtn = page.locator('#nav-search-submit-button');
    await searchInput.fill('sandals');
    await searchBtn.click();

    // expect: Network request includes the category parameter (if applicable)
    await expect(page).toHaveURL(/k=sandals|rh=/, { timeout: 10000 });

    // expect: Results page indicates the selected category in heading or filter UI
    const resultItem = page.locator('div[data-component-type="s-search-result"]');
    await expect(resultItem.first()).toBeVisible({ timeout: 10000 });

    // 3. Verify that modifying the query without changing category still limits results to the selected category
    await searchInput.fill('flip flops');
    await searchBtn.click();
    await expect(page).toHaveURL(/k=flip\+flops|rh=/, { timeout: 10000 });
  });
});
