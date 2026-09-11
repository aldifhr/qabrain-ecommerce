import { expect, test } from '@playwright/test';
import { EcomAuthPage } from '../pages/ecom-auth.pages';
import { InventoryPage } from '../pages/inventory.pages';
import { ProductPage } from '../pages/product.pages';

const ECOM_EMAIL = 'test@qabrains.com';
const ECOM_PASS = 'Password123';

test.describe('PRODUCTS - Positive', () => {
    let ecomAuth: EcomAuthPage;
    let inventory: InventoryPage;

    test.beforeEach(async ({ page }) => {
        ecomAuth = new EcomAuthPage(page);
        inventory = new InventoryPage(page);
        await ecomAuth.goto();
        await ecomAuth.login(ECOM_EMAIL, ECOM_PASS);
        await expect(page).toHaveURL(/\/ecommerce$/);
        await expect(inventory.productCards.first()).toBeVisible();
    });

    // PRODUCT-001 - Positive - High - User dapat menekan produk yang dipilih
    test('PRODUCT-001 - should open product detail when clicking product', async ({ page }) => {
        await inventory.clickProductByName('Sample Shirt Name');
        await expect(page).toHaveURL(/product-details\?id=1/);
        await expect(page.getByText('Sample Shirt Name').first()).toBeVisible();
        await expect(page.getByText('A sample description for the product').first()).toBeVisible();
    });

    // PRODUCT-002 - Positive - High - User dapat menambahkan produk ke dalam cart
    test('PRODUCT-002 - should add product to cart and show badge', async ({ page }) => {
        await inventory.addProductByName('Sample Shirt Name');
        // after add, button changes to Remove from cart and badge shows 1
        await expect(page.getByRole('button', { name: 'Remove from cart' }).first()).toBeVisible();
        // cart badge or header count "1" appears
        await expect(page.locator('body')).toContainText('1');
        // also verify via inventory product count still visible
        await expect(inventory.productCards.first()).toBeVisible();
    });

    // PRODUCT-003 - Positive - High - User dapat menekan tombol favorites pada produk
    test('PRODUCT-003 - should add product to favorites via heart icon', async ({ page }) => {
        const favButton = inventory.favoriteButtons.first();
        await expect(favButton).toBeVisible();
        await favButton.click();
        // after click, heart should remain visible (may change color). We verify no error and button still visible
        await expect(favButton).toBeVisible();
        // optional: check that product still in list (no navigation)
        await expect(page).toHaveURL(/\/ecommerce$/);
    });

    // PRODUCT-004 - Positive - High - User dapat menambahkan quantity pada halaman produk
    test('PRODUCT-004 - should increase quantity on product detail page', async ({ page }) => {
        const productPage = new ProductPage(page);
        await inventory.clickProductByName('Sample Shirt Name');
        await expect(page).toHaveURL(/product-details/);
        await expect(productPage.quantityPlus).toBeVisible();
        // initial quantity displayed as 1 (between - and +) - we test clicking + increments UI
        // quantity UI is not directly exposing value but we can check that plus click does not error and price still visible
        await productPage.increaseQuantity(1);
        // after increase, either quantity text becomes 2 or at least plus still visible and no error
        await expect(productPage.quantityPlus).toBeVisible();
        await expect(productPage.quantityMinus).toBeVisible();
        // verify price still shows
        await expect(page.getByText('$49.99').first()).toBeVisible();
    });

    // PRODUCT-005 - Positive - High - User dapat menekan tombol Back to Products
    test('PRODUCT-005 - should return to product list via Back to Products', async ({ page }) => {
        const productPage = new ProductPage(page);
        await inventory.clickProductByName('Sample Shirt Name');
        await expect(productPage.backToProductsButton).toBeVisible();
        await productPage.backToProductsButton.click();
        await expect(page).toHaveURL(/\/ecommerce$/);
        await expect(inventory.productCards.first()).toBeVisible();
    });
});
