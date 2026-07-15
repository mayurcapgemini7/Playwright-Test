# Amazon.in Add to Cart Test Plan

## Application Overview

Plan to validate the Amazon.in add-to-cart experience from the home page through product selection, cart confirmation, quantity handling, and error states.

## Test Scenarios

### 1. Add to Cart Functionality

**Seed:** `tests/seed.spec.ts`

#### 1.1. Add a single product from search results to the cart

**File:** `tests/amazon-add-to-cart.spec.ts`

**Steps:**
  1. Open the Amazon.in home page in a fresh browser session.
    - expect: The home page loads successfully and the search box is visible.
  2. Search for a common product such as a mobile accessory or home item using the search box.
    - expect: The search results page loads with product listings.
  3. Open a product from the search results and locate the add-to-cart action.
    - expect: A product detail page is displayed with an Add to Cart button or equivalent cart action.
  4. Click Add to Cart.
    - expect: A confirmation message such as Added to Cart appears, the cart count increases, and the item is visible in the cart.

#### 1.2. Add a product with quantity selection and verify the cart summary

**File:** `tests/amazon-add-to-cart.spec.ts`

**Steps:**
  1. Open a product detail page from the search results.
    - expect: The product detail page is displayed.
  2. Change the quantity to 2 before adding the item to the cart.
    - expect: The selected quantity is updated in the quantity control.
  3. Click Add to Cart.
    - expect: The cart shows the selected quantity, the cart subtotal updates, and the item count reflects the quantity.

#### 1.3. Add multiple products sequentially and verify cart contents

**File:** `tests/amazon-add-to-cart.spec.ts`

**Steps:**
  1. Add one product to the cart from the search results.
    - expect: The cart count increases and the confirmation message appears.
  2. Search for and add a second different product.
    - expect: The cart count increases again and both items are shown in the cart summary.
  3. Open the cart page.
    - expect: Both products appear in the cart with correct product names and quantities.

#### 1.4. Verify that unavailable products cannot be added to the cart

**File:** `tests/amazon-add-to-cart.spec.ts`

**Steps:**
  1. Open a product page that is marked as unavailable or out of stock.
    - expect: The page shows an unavailable state such as Currently unavailable, Out of stock, or a disabled add-to-cart action.
  2. Attempt to add the product to the cart.
    - expect: No item is added to the cart, and the user sees the unavailable message or disabled state.

#### 1.5. Verify cart persistence after navigation and page refresh

**File:** `tests/amazon-add-to-cart.spec.ts`

**Steps:**
  1. Add a product to the cart and then navigate away from the product page.
    - expect: The cart count remains visible and the cart contains the added item.
  2. Refresh the page or reopen the cart.
    - expect: The previously added item is still present in the cart and the cart count remains correct.

#### 1.6. Remove an item from the cart and verify the empty state

**File:** `tests/amazon-add-to-cart.spec.ts`

**Steps:**
  1. Add a product to the cart and open the cart page.
    - expect: The cart contains the added item.
  2. Remove the item from the cart.
    - expect: The item is removed, the cart count decreases to zero, and the cart displays an empty-cart state.
