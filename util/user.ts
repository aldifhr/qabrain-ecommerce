import { Page } from "@playwright/test";
import { AuthPage } from "../pages/auth";
import { user } from "./config";

export async function loginAsPractice({ page }: { page: Page }) {
    const authPage = new AuthPage(page);
    await authPage.login(user.email, user.password);
}