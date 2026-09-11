import { Page, Locator } from "@playwright/test";

export class EcomAuthPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly backToHomeLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button:has-text("LOGIN")');
        this.backToHomeLink = page.getByText('Back to home');
    }

    async goto() {
        await this.page.goto('https://practice.qabrains.com/ecommerce/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
