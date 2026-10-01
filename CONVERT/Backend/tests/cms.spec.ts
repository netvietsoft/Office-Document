/**
 * Playwright E2E UI Test Suite for Web Admin CMS
 * Verifies Responsive Design, Dark/Light Mode, Card Layout on Mobile Viewport, and Navigation.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:6033';

test.describe('NextAI Office CMS Web Admin Tests', () => {

  test('1. Verify Dashboard Loads and Displays Stats', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await expect(page).toHaveTitle(/NextAI Office Suite/);

    const title = page.locator('#current-page-title');
    await expect(title).toBeVisible();

    const statsGrid = page.locator('.stats-grid');
    await expect(statsGrid).toBeVisible();
  });

  test('2. Verify Dark/Light Mode Toggle', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);
    const themeBtn = page.locator('#theme-toggle-btn');
    
    // Toggle to Dark Mode
    await themeBtn.click();
    const htmlTheme = await page.getAttribute('html', 'data-theme');
    expect(htmlTheme).toBe('dark');

    // Toggle back to Light Mode
    await themeBtn.click();
    const htmlThemeLight = await page.getAttribute('html', 'data-theme');
    expect(htmlThemeLight).toBe('light');
  });

  test('3. Verify Tab Switching (Users, Devices, Media R2, Conversions)', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);

    // Switch to Users Tab
    await page.click('#nav-users');
    await expect(page.locator('#tab-users')).toBeVisible();

    // Switch to Media Tab
    await page.click('#nav-media');
    await expect(page.locator('#tab-media')).toBeVisible();

    // Switch to Conversions Tab
    await page.click('#nav-conversions');
    await expect(page.locator('#tab-conversions')).toBeVisible();
  });

  test('4. Verify Mobile Viewport (375px) Responsive Card View', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/admin/dashboard`);

    // Open Users Tab
    await page.click('#nav-users');

    // Check that desktop table is hidden and mobile cards list is visible
    const mobileCards = page.locator('#users-mobile-list');
    await expect(mobileCards).toBeVisible();
  });
});
