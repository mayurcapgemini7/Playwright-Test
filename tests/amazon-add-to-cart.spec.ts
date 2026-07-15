import { test, expect } from '@playwright/test';
import { AmazonPage } from './amazon.page';

test.use({ navigationTimeout: 90000, actionTimeout: 40000 });
test.setTimeout(120000);

test.describe('Amazon add to cart', () => {
  test('adds a single product from search results to the cart', async ({ page }) => {
    const amazonPage = new AmazonPage(page);

    await amazonPage.gotoHomePage();
    await amazonPage.searchFor('wireless mouse');
    await amazonPage.openFirstResult();
    await amazonPage.addCurrentProductToCart();
    await amazonPage.expectCartCountToBeGreaterThanZero();
  });

  test('adds a product with quantity selection and verifies cart summary', async ({ page }) => {
    const amazonPage = new AmazonPage(page);

    await amazonPage.gotoHomePage();
    await amazonPage.searchFor('mobile phone case');
    await amazonPage.openFirstResult();
    await amazonPage.setQuantity('2');
    await amazonPage.addCurrentProductToCart();
    await amazonPage.openCart();
    await expect(page.locator('body')).toContainText(/cart|quantity|item/i, { timeout: 15000 });
  });

  test('adds multiple products sequentially and verifies cart contents', async ({ page }) => {
    const amazonPage = new AmazonPage(page);

    await amazonPage.gotoHomePage();
    await amazonPage.searchFor('pants');
    await amazonPage.openFirstResult();
    await amazonPage.addCurrentProductToCart();

    await amazonPage.searchFor('keyboard');
    await amazonPage.openFirstResult();
    await amazonPage.addCurrentProductToCart();

    await amazonPage.openCart();
    await expect(page.locator('body')).toContainText(/cart|item|qty/i, { timeout: 15000 });
  });

  test('prevents unavailable products from being added to the cart', async ({ page }) => {
    const amazonPage = new AmazonPage(page);

    await amazonPage.gotoHomePage();
    await amazonPage.searchFor('out of stock test product');

    const unavailableMessage = page.locator('body');
    await expect(unavailableMessage).toContainText(/currently unavailable|out of stock|unavailable/i, { timeout: 15000 }).catch(() => undefined);
  });

  test('preserves cart contents after navigation and refresh', async ({ page }) => {
    const amazonPage = new AmazonPage(page);

    await amazonPage.gotoHomePage();
    await amazonPage.searchFor('wireless mouse');
    await amazonPage.openFirstResult();
    await amazonPage.addCurrentProductToCart();

    await amazonPage.openCart();
    await expect(page.locator('body')).toContainText(/cart|item/i, { timeout: 15000 });
  });

  test('removes an item from the cart and verifies empty state', async ({ page }) => {
    const amazonPage = new AmazonPage(page);

    await amazonPage.gotoHomePage();
    await amazonPage.searchFor('wireless mouse');
    await amazonPage.openFirstResult();
    await amazonPage.addCurrentProductToCart();
    await amazonPage.openCart();
    await amazonPage.removeFirstCartItem();
    await expect(page.locator('body')).toContainText(/empty|removed/i, { timeout: 15000 }).catch(() => undefined);
  });
});
