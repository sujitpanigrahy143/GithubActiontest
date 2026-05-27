import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test('Complete checkout flow with Cauliflower and Carrot', async ({ page }) => {
  // Step 1: Navigate to the website
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/', { waitUntil: 'domcontentloaded' });
  
  // Step 2: Add Cauliflower to cart
  // Cauliflower is the second product (index 1)
  //await page.locator('button:has-text("ADD TO CART")').nth(1).click();
  await page.getByRole('button', { name: 'ADD TO CART' }).nth(1).click();
  await page.waitForTimeout(300);
  
  // Step 3: Add Carrot to cart
  // Carrot is the fifth product (index 4)
  await page.locator('button:has-text("ADD TO CART")').nth(4).click();
  await page.waitForTimeout(300);
  
  // Step 4: Click on Cart
  await page.locator('a:has(img[alt="Cart"])').first().click();
  await page.waitForLoadState('domcontentloaded');
  
  // Step 6: Click Proceed to Checkout button
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (let btn of buttons) {
      if (btn.textContent && btn.textContent.includes('PROCEED TO CHECKOUT')) {
        (btn as HTMLButtonElement).click();
        break;
      }
    }
  });
  
  // Step 7: Verify cart page loaded
  await page.waitForURL(/.*\/cart/, { timeout: 10000 });
  
  // Step 8: Click Place Order
  await page.locator('button:has-text("Place Order")').click();
  
  // Step 9: Verify country selection page loaded
  await page.waitForURL(/.*\/country/, { timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');
  
  // Step 10: Select country India
  await page.locator('select').first().selectOption('India');
  await page.waitForTimeout(300);
  
  // Step 11: Check Agree to Terms & Conditions
  await page.locator('input[type="checkbox"]').first().check();
  await page.waitForTimeout(300);
  
  // Step 12: Click Proceed
  await page.locator('button:has-text("Proceed")').click();
  
  // Step 13: Wait for success message and validate
  await page.waitForTimeout(3000);
  
  const successMessage = await page.evaluate(() => {
    const allText = document.body.innerText;
    return allText;
  });
  
  // Verify the success message contains expected text
  expect(successMessage).toContain('Thank you');
  expect(successMessage).toContain('successfully');
});
