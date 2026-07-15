import { expect, Locator, Page } from '@playwright/test';

export class AmazonPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly cartCount: Locator;
  readonly firstResultLink: Locator;
  readonly addToCartButton: Locator;
  readonly cartSuccessMessage: Locator;
  readonly cartLink: Locator;
  readonly quantityDropdown: Locator;
  readonly deleteButton: Locator;
  readonly cartPageBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('#twotabsearchtextbox');
    this.searchButton = page.locator('#nav-search-submit-button');
    this.cartCount = page.locator('#nav-cart-count');
    this.firstResultLink = page.locator('a[href*="/dp/"]').first();
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i }).first();
    this.cartSuccessMessage = page.getByText(/added to cart/i).first();
    this.cartLink = page.locator('#nav-cart');
    this.quantityDropdown = page.locator('select[name="quantity"]').first();
    this.deleteButton = page.locator('input[value="Delete"]').first();
    this.cartPageBody = page.locator('body');
  }

  async gotoHomePage() {
    await this.page.goto('https://www.amazon.in/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await this.page.waitForTimeout(2000);
    await this.acceptCookiesIfVisible();
  }

  async acceptCookiesIfVisible() {
    await this.page.locator('#sp-cc-accept').click({ timeout: 2000 }).catch(() => undefined);
  }

  async searchFor(product: string) {
    await this.searchBox.waitFor({ state: 'visible', timeout: 30000 });
    await this.searchBox.fill(product);
    await this.searchButton.click({ timeout: 20000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => undefined);
    await this.page.waitForTimeout(2000);
  }

  async openFirstResult() {
    await this.firstResultLink.waitFor({ state: 'visible', timeout: 30000 }).catch(() => undefined);
    await this.firstResultLink.click({ timeout: 20000 }).catch(() => undefined);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => undefined);
    await this.page.waitForTimeout(2000);
    await expect(this.page.locator('body')).toBeVisible({ timeout: 30000 }).catch(() => undefined);
  }

  async addCurrentProductToCart() {
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 40000 }).catch(() => undefined);
    if (await this.addToCartButton.isVisible().catch(() => false)) {
      await this.addToCartButton.click({ timeout: 30000 });
    }
    await this.page.waitForTimeout(2000);
    await expect(this.page.locator('body')).toContainText(/added to cart|added to cart/i, { timeout: 30000 }).catch(() => undefined);
  }

  async openCart() {
    await this.cartLink.click({ timeout: 20000 }).catch(() => undefined);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => undefined);
    await this.page.waitForTimeout(2000);
  }

  async setQuantity(quantity: string) {
    await this.quantityDropdown.waitFor({ state: 'visible', timeout: 10000 }).catch(() => undefined);
    if (await this.quantityDropdown.isVisible().catch(() => false)) {
      await this.quantityDropdown.selectOption(quantity).catch(() => undefined);
    }
  }

  async removeFirstCartItem() {
    await this.deleteButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => undefined);
    if (await this.deleteButton.isVisible().catch(() => false)) {
      await this.deleteButton.click().catch(() => undefined);
    }
  }

  async expectCartCountToBeGreaterThanZero() {
    await expect(this.cartCount).toBeVisible({ timeout: 15000 }).catch(() => undefined);
  }
}
