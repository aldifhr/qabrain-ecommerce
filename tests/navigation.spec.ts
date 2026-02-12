import test from "@playwright/test";

test.describe("Navigation Tests", () => {
    test("User accessing to website", async ({ page }) => {
        await page.goto("https://practice.qabrains.com/ecommerce/login");
        await test.step("Verify Login Page URL", async () => {
            await test.expect(page).toHaveURL("https://practice.qabrains.com/ecommerce/login");
        });
    });
});