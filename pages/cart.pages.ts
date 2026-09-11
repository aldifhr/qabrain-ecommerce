import { Page, Locator } from "@playwright/test";

/**
 * QABrain Cart - https://practice.qabrains.com/ecommerce/cart
 * Mirror saucedemo/pages/cart.pages.ts
 */
export class CartPage {
    readonly page: Page;
    readonly cartTitle: Locator;
    readonly emptyMessage: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    readonly productNames: Locator;
    readonly removeButtons: Locator;
    readonly quantityMinus: Locator;
    readonly quantityPlus: Locator;
    readonly quantityValue: Locator;
    readonly price: Locator;
    readonly total: Locator;
    readonly confirmDialog: Locator;
    readonly confirmRemoveButton: Locator;
    readonly confirmCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartTitle = page.getByText('Your Cart').first();
        this.emptyMessage = page.getByText(/Your cart is empty/i);
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.productNames = page.locator('text=Sample').first(); // generic
        this.removeButtons = page.getByText('Remove').first();
        this.quantityMinus = page.getByRole('button', { name: '−' });
        this.quantityPlus = page.getByRole('button', { name: '+' });
        this.quantityValue = page.locator('div').filter({ hasText: /^\d+$/ }).first();
        this.price = page.getByText('$').first();
        this.total = page.getByText('Total').first();
        this.confirmDialog = page.getByText('Are you absolutely sure?');
        this.confirmRemoveButton = page.locator('button:has-text("Remove")').last();
        this.confirmCloseButton = page.getByRole('button', { name: 'Close' }).first();
    }

    async goto() {
        await this.page.goto('https://practice.qabrains.com/ecommerce/cart');
    }

    async openViaHeader() {
        // header cart icon is svg; we navigate directly to /ecommerce/cart as fallback
        await this.goto();
    }

    async removeFirstItemWithConfirm() {
        await this.removeButtons.click();
        await this.page.waitForTimeout(500);
        await this.confirmRemoveButton.click();
    }

    async getItemCount(): Promise<number> {
        // count product rows: each has "Remove" text
        return await this.page.getByText('Remove').count();
    }
}
