import { Page, Locator } from "@playwright/test";

/**
 * QABrain E-commerce Inventory (Product List) - mirror saucedemo/pages/inventory.pages.ts:1
 * Dashboard: https://practice.qabrains.com/ecommerce
 */
export class InventoryPage {
    readonly page: Page;
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly addToCartButtons: Locator;
    readonly removeFromCartButtons: Locator;
    readonly favoriteButtons: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly userEmailHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productCards = page.locator('.products .group');
        this.productNames = page.locator('a.text-lg.font-semibold');
        this.productPrices = page.locator('span.text-lg.font-bold');
        this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
        this.removeFromCartButtons = page.getByRole('button', { name: 'Remove from cart' });
        // favorites = heart button top-right each card
        this.favoriteButtons = page.locator('.group span.absolute button');
        // cart badge is the small number near header (shows count after add)
        // header contains "1" + "test@qabrains.com" after add
        this.cartBadge = page.locator('header').locator('span, div').filter({ hasText: /^\d+$/ }).first();
        // cart icon link - the cart svg button in header
        this.cartLink = page.locator('a[href="/ecommerce/cart"]');
        this.userEmailHeader = page.getByText('test@qabrains.com').first();
    }

    async goto() {
        await this.page.goto('https://practice.qabrains.com/ecommerce');
    }

    async addProductByIndex(index: number) {
        await this.addToCartButtons.nth(index).click();
    }

    async addProductByName(name: string) {
        const card = this.page.locator('.group', { hasText: name });
        await card.getByRole('button', { name: 'Add to cart' }).click();
    }

    async getProductCount(): Promise<number> {
        return await this.productCards.count();
    }

    async clickProductByName(name: string) {
        await this.page.getByText(name).first().click();
    }

    async getCartCount(): Promise<string> {
        // fallback: body contains badge number
        if (await this.cartBadge.count() > 0) {
            return await this.cartBadge.innerText();
        }
        return '';
    }
}
