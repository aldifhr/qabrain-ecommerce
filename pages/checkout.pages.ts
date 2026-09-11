import { Page, Locator } from "@playwright/test";

/**
 * QABrain Checkout - https://practice.qabrains.com/ecommerce/checkout-info -> /checkout-overview -> complete
 * Mirror saucedemo/pages/checkout.pages.ts:1
 */
export class CheckoutPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly zipCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly finishButton: Locator;
    readonly paymentInfo: Locator;
    readonly shippingInfo: Locator;
    readonly totalPrice: Locator;
    readonly overviewTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[value*="@"]');
        this.firstNameInput = page.locator('input[placeholder="Ex. John"]');
        this.lastNameInput = page.locator('input[placeholder="Ex. Doe"]');
        this.zipCodeInput = page.locator('input').nth(3);
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.paymentInfo = page.getByText('Payment Information');
        this.shippingInfo = page.getByText('Shipping Information');
        this.totalPrice = page.getByText(/^Total :/);
        this.overviewTitle = page.getByText('Checkout: Overview');
    }

    async fillInfo(firstName: string, lastName: string, zip: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zip);
    }

    async continueCheckout() {
        await this.continueButton.click();
    }

    async cancelCheckout() {
        await this.cancelButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async gotoInfo() {
        await this.page.goto('https://practice.qabrains.com/ecommerce/checkout-info');
    }

    async gotoOverview() {
        await this.page.goto('https://practice.qabrains.com/ecommerce/checkout-overview');
    }
}
