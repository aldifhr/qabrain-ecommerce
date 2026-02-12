import { Locator, Page } from "@playwright/test";
import { user, BASE_URL } from "../util/config";

export class AuthPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly backToHomeLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.submitButton = page.locator("button[type='submit']");
        this.errorMessage = page.locator('li[data-type="error"]', { hasText: /Username matched but password is incorrect\.|Username is incorrect\.|Password is incorrect\.|Neither email nor password matched/i });
        this.backToHomeLink = page.getByRole('link', { name: /back to home/i });
    }

    async goto() {
        await this.page.goto(`${BASE_URL}/login`);
    }

    async login(username = user.email, password = user.password) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    getErrorMessage() {
        return this.errorMessage;
    }

    getBackToHomeLink() {
        return this.backToHomeLink;
    }
}