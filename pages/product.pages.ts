import { Page, Locator } from "@playwright/test";

/**
 * QABrain Product Detail - /ecommerce/product-details?id=1
 * Mirror saucedemo/pages/product.pages.ts
 */
export class ProductPage {
    readonly page: Page;
    readonly backToProductsButton: Locator;
    readonly productName: Locator;
    readonly quantityMinus: Locator;
    readonly quantityPlus: Locator;
    readonly quantityValue: Locator;
    readonly price: Locator;
    readonly addToCartButton: Locator;
    readonly removeFromCartButton: Locator;
    readonly favoriteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backToProductsButton = page.getByRole('button', { name: 'Back to Products' });
        this.productName = page.locator('h1, h2').filter({ hasText: 'Sample' }).first();
        this.quantityMinus = page.getByRole('button', { name: '−' });
        this.quantityPlus = page.getByRole('button', { name: '+' });
        // quantity value is between minus and plus: the span/div with number
        this.quantityValue = page.locator('div').filter({ hasText: /^\d+$/ }).first();
        this.price = page.locator('span, div').filter({ hasText: /^\$/ }).first();
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.removeFromCartButton = page.getByRole('button', { name: 'Remove from cart' });
        this.favoriteButton = page.locator('span.absolute button, button:has(svg)').first();
    }

    async goto(id: number = 1) {
        await this.page.goto(`https://practice.qabrains.com/ecommerce/product-details?id=${id}`);
    }

    async increaseQuantity(times: number = 1) {
        for (let i = 0; i < times; i++) {
            await this.quantityPlus.click();
        }
    }

    async decreaseQuantity(times: number = 1) {
        for (let i = 0; i < times; i++) {
            await this.quantityMinus.click();
        }
    }
}
