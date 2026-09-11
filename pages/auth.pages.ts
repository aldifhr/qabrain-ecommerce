import { Page, Locator } from "@playwright/test";

export class AuthPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly logoutButton: Locator;
    // Error / info locators - practice.qabrains.com renders errors as plain text
    readonly invalidEmailError: Locator;
    readonly invalidPasswordError: Locator;
    readonly invalidBothError: Locator;
    readonly emailRequiredError: Locator;
    readonly passwordRequiredError: Locator;
    readonly passwordTooLongError: Locator;
    readonly successHeader: Locator;
    readonly successMessage: Locator;
    readonly loginPageHeading: Locator;
    readonly homeLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
        this.logoutButton = page.getByRole('button', { name: 'LOGOUT' });
        // Specific error texts observed on practice.qabrains.com
        this.invalidEmailError = page.getByText('Your email is invalid!');
        this.invalidPasswordError = page.getByText('Your password is invalid!');
        this.invalidBothError = page.getByText('Your email and password both are invalid!');
        this.emailRequiredError = page.getByText('Email is a required field');
        this.passwordRequiredError = page.getByText('Password is a required field');
        this.passwordTooLongError = page.getByText('Password must be at most 25 characters');
        this.successHeader = page.getByRole('heading', { name: 'LOGIN SUCCESSFUL' });
        this.successMessage = page.getByText('You have successfully logged in');
        this.loginPageHeading = page.locator('[data-slot="alert-title"]');
        // Header navigation - used for AUTH002 Back to Home equivalent
        this.homeLink = page.getByRole('link', { name: 'Home' }).first();
    }

    async goto() {
        await this.page.goto('https://practice.qabrains.com/');
    }

    async login(email?: string, password?: string) {
        if (email !== undefined) await this.emailInput.fill(email);
        else await this.emailInput.fill('');
        if (password !== undefined) await this.passwordInput.fill(password);
        else await this.passwordInput.fill('');
        await this.loginButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }
}
