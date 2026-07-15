// spec: specs/dropdown-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const START_URL = 'https://www.amazon.in/b?node=976392031';

test.describe('Category Dropdown Tests', () => {
  test('Happy Path — Select every category option and perform a search', async ({ page }) => {
    await page.goto(START_URL);

    const category = page.locator('select#searchDropdownBox');
    await expect(category).toBeVisible({ timeout: 10000 });

    const options = category.locator('option');
    const count = await options.count();

    for (let i = 0; i < count; i++) {
      const label = (await options.nth(i).textContent())?.trim() ?? '';
      const value = (await options.nth(i).getAttribute('value')) ?? '';

      await test.step(`Option ${i + 1}/${count}: ${label}`, async () => {
        if (!label) throw new Error(`Option ${i} has empty label`);

        // Select by index to avoid mismatch by label/value differences
        await category.selectOption({ index: i });
        if (value) {
          await expect(category).toHaveValue(value);
        } else {
          await expect(category).not.toHaveValue('');
        }

        // Perform a quick search in a new tab using the option's alias to avoid navigating the original page
        const alias = value && value.includes('=') ? value.split('=')[1] : '';
        const q = 'test';
        const searchUrl = alias
          ? `https://www.amazon.in/s?k=${encodeURIComponent(q)}&i=${encodeURIComponent(alias)}`
          : `https://www.amazon.in/s?k=${encodeURIComponent(q)}`;

        const newPage = await page.context().newPage();
        await newPage.goto(searchUrl, { waitUntil: 'domcontentloaded' });

        // Check for either results or a no-results indicator on the search results page
        const resultItem = newPage.locator('div[data-component-type="s-search-result"]');
        const resultsCount = await resultItem.count();
        if (resultsCount > 0) {
          await expect(resultItem.first()).toBeVisible({ timeout: 10000 });
        } else {
          const noResults = newPage.locator('text=No results for your search query').first();
          const searchInstead = newPage.locator('text=Search instead in All Departments').first();
          if (await noResults.count() > 0) {
            await expect(noResults).toBeVisible();
          } else if (await searchInstead.count() > 0) {
            await expect(searchInstead).toBeVisible();
          }
        }

        await newPage.close();
      });
    }
  });
});
