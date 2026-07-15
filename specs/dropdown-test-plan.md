# Dropdown Test Plan

## Application Overview

Test plan for the category (dropdown) component on the Amazon Electronics deals page (https://www.amazon.in/b?node=976392031). Covers interaction, accessibility, search integration, edge cases, responsive behavior, and persistence across navigation. Assumes a fresh session (not logged in) and desktop/mobile viewports as noted per scenario.

## Test Scenarios

### 1. Category Dropdown Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. Happy Path — Select category and perform search

**File:** `specs/dropdown-test-plan.md`

**Steps:**
  1. Start from a fresh browser session and open https://www.amazon.in/b?node=976392031
    - expect: Page loads and main header is visible
    - expect: Assumption: fresh state (not logged in), default search category visible
  2. Click the category dropdown (select#searchDropdownBox) to open it
    - expect: Dropdown opens and options are visible
  3. Choose a specific category (e.g., Shoes & Handbags) from the list
    - expect: Category value is selected in the dropdown
    - expect: Selection text matches chosen option
  4. Type a simple query (e.g., 'running shoes') into the search input and submit (click search or press Enter)
    - expect: Search results load
    - expect: Results correspond to the chosen category (no unrelated categories)
    - expect: Breadcrumb or page heading shows selected category or filtered results
  5. Success criteria: results show items from the selected category within 10s
    - expect: Failure conditions: results are from another category, or no results and no error message

#### 1.2. Keyboard Accessibility — open, navigate, select

**File:** `specs/dropdown-test-plan.md`

**Steps:**
  1. From page load, use Tab to focus the category dropdown control
    - expect: Dropdown receives focus with visible focus indicator
  2. Open the dropdown using Space or Enter
    - expect: Dropdown options expand and the first option is focused or highlighted
  3. Navigate options using ArrowDown/ArrowUp keys and select with Enter
    - expect: Arrow keys move focus between options
    - expect: Enter selects the focused option and the dropdown collapses
  4. Verify ARIA attributes (role, aria-expanded, aria-controls, aria-activedescendant where applicable) and screen-reader support
    - expect: Controls expose expected ARIA attributes
    - expect: aria-expanded toggles on open/close
    - expect: Failure: missing ARIA attributes or keyboard-only users cannot select

#### 1.3. Search Integration — category pre-select persists into search request

**File:** `specs/dropdown-test-plan.md`

**Steps:**
  1. Open page, select a category from the dropdown
    - expect: Dropdown shows selected category
  2. Enter query term into search input and submit
    - expect: Network request includes the category parameter (if applicable)
    - expect: Results page indicates the selected category in heading or filter UI
  3. Verify that modifying the query without changing category still limits results to the selected category
    - expect: Subsequent searches on the results page keep the category filter applied

#### 1.4. Edge Cases & Error Handling

**File:** `specs/dropdown-test-plan.md`

**Steps:**
  1. Rapidly click the category dropdown open/close repeatedly (5-10 times)
    - expect: UI remains responsive, no JS errors, dropdown state toggles predictably
  2. Attempt to open the dropdown while the network is artificially slowed or intermittent (throttle network)
    - expect: UI shows a graceful loading state if applicable
    - expect: Dropdown does not freeze or become unusable
    - expect: Failure: dropdown stuck or unresponsive
  3. Interact when JavaScript is partially blocked (simulate blocking some scripts)
    - expect: Dropdown falls back to native select (if Amazon uses select) or shows a meaningful error
    - expect: Failure: UI broken with no way to select category
  4. Verify default state if no category is selected
    - expect: Default category is 'All' or specified label
    - expect: Search without category behaves as expected and returns global results

#### 1.5. Responsive / Mobile Behavior

**File:** `specs/dropdown-test-plan.md`

**Steps:**
  1. Set viewport to mobile dimensions (e.g., 375x812) and load the page
    - expect: Mobile header and navigation visible
  2. Open mobile nav (if applicable) and locate category selection control
    - expect: Category selector accessible via mobile nav
    - expect: Control is usable with touch/tap
  3. Select category on mobile and perform a search
    - expect: Search results show category-scoped content
    - expect: Mobile layout retains selection and provides visible confirmation

#### 1.6. Persistence Across Navigation & Pagination

**File:** `specs/dropdown-test-plan.md`

**Steps:**
  1. Select a category and perform a search, then navigate to page 2 of results
    - expect: Selected category remains applied across pagination
    - expect: UI shows the chosen category on page 2
  2. Use browser back/forward to navigate between results and previous pages
    - expect: Category selection persists or is restored appropriately by the app
    - expect: Failure: selection resets unexpectedly when navigating back/forward
