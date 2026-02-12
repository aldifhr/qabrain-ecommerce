import { test, expect } from "@playwright/test";
import { AuthPage } from "../pages/auth";
import { loginAsPractice } from "../util/user";
import { BASE_URL } from "../util/config";

test.describe("Auth Tests", () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        await authPage.goto();
    });
    
    test.describe("Login Page Test - @positive", () => {

        test("User can click button back to home", async ({ page }) => {
            await authPage.getBackToHomeLink().click();
            await expect(page).toHaveURL("https://practice.qabrains.com/");
        });

        test("Login with valid credentials", async ({ page }) => {
            await loginAsPractice({ page });
            await expect(page).toHaveURL(`${BASE_URL}`);
        });
    });

    test.describe("Login Page Test - @negative", () => {

        test("User melakukan login dengan uppercase pada email dan password", async ({ page }) => {
            await authPage.login("TEST@QABRAINS.COM", "PASSWORD123");
            await expect(authPage.getErrorMessage()).toBeVisible();
        });

        test("Memverifikasi bahwa sistem menolak login ketika password dimasukkan dalam huruf kecil (lowercase)", async ({ page }) => {
            await authPage.login("test@qabrains.com", "password123");
            await expect(authPage.getErrorMessage()).toBeVisible();
        });
    });
});