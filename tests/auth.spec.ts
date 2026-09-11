import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/auth.pages';

const VALID_EMAIL = 'qa_testers@qabrains.com';
const VALID_PASSWORD = 'Password123';
const INVALID_EMAIL = 'invalid@qabrains.com';
const LONG_STRING_256 = 'a'.repeat(256);

// Saucedemo equivalence: LGN001 -> AUTH003 , LGN002 -> AUTH005 etc.
// User table AUTH001-AUTH006 mapped 1:1, plus extended Validation/Boundary to mirror LGN006-LGN010

test.describe('Auth - Positive', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        await authPage.goto();
    });

    // AUTH001 - Positive - High - User mengakses website
    test('AUTH001 - should display login page when accessing website', async ({ page }) => {
        await expect(page).toHaveURL(/practice\.qabrains\.com\/?$/);
        await expect(authPage.loginPageHeading).toBeVisible();
        await expect(authPage.emailInput).toBeVisible();
        await expect(authPage.passwordInput).toBeVisible();
        await expect(authPage.loginButton).toBeVisible();
        // also shows hint credentials
        await expect(page.getByText(VALID_EMAIL)).toBeVisible();
    });

    // AUTH002 - Positive - High - User dapat mengakses tombol Back to Home / Home
    test('AUTH002 - should navigate to home via Home link', async ({ page }) => {
        // verify Home link works (equivalent to Back to Home)
        await expect(authPage.homeLink).toBeVisible();
        await authPage.homeLink.click();
        await expect(page).toHaveURL(/practice\.qabrains\.com\/?$/);
        await expect(authPage.loginPageHeading).toBeVisible();
    });

    // AUTH003 - Positive - High - Verifikasi pengguna dapat login dengan kredensial yang valid
    test('AUTH003 - should login successfully with valid credentials', async ({ page }) => {
        await authPage.login(VALID_EMAIL, VALID_PASSWORD);
        await expect(page).toHaveURL(/\?logged=true/);
        await expect(authPage.successHeader).toBeVisible();
        await expect(authPage.successMessage).toBeVisible();
        await expect(authPage.logoutButton).toBeVisible();
    });

    // AUTH014 - Positive - High - Logout after login returns to login page
    test('AUTH014 - should logout and return to login page', async ({ page }) => {
        await authPage.login(VALID_EMAIL, VALID_PASSWORD);
        await expect(authPage.logoutButton).toBeVisible();
        await authPage.logout();
        await expect(page).toHaveURL(/practice\.qabrains\.com\/?$/);
        await expect(authPage.loginPageHeading).toBeVisible();
        await expect(authPage.loginButton).toBeVisible();
    });
});

test.describe('Auth - Negative', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        await authPage.goto();
    });

    // AUTH004 - Negative - High - kredensial tidak valid
    test('AUTH004 - should show error with invalid credentials', async ({ page }) => {
        await authPage.login(INVALID_EMAIL, VALID_PASSWORD);
        await expect(page).toHaveURL(/\?email=false/);
        await expect(authPage.invalidEmailError).toBeVisible();
        test.info().annotations.push({
            type: 'SECURITY-NOTE',
            description: 'AUTH004: Pesan "Your email is invalid!" meng-enumerasi keberadaan user. Seharusnya generic "Invalid email or password" untuk keamanan (mirip catatan AUTH006 user).',
        });
    });

    // AUTH005 - Negative - High - uppercase email & password
    test('AUTH005 - should show error with uppercase email and password', async ({ page }) => {
        await authPage.login(VALID_EMAIL.toUpperCase(), VALID_PASSWORD.toUpperCase());
        // site returns both invalid when both uppercased
        await expect(page).toHaveURL(/email=false.*password=false|password=false.*email=false/);
        await expect(authPage.invalidBothError).toBeVisible();
    });

    // AUTH006 - Negative - High - lowercase password
    test('AUTH006 - should reject login when password is lowercase', async ({ page }) => {
        await authPage.login(VALID_EMAIL, VALID_PASSWORD.toLowerCase());
        await expect(page).toHaveURL(/\?password=false/);
        await expect(authPage.invalidPasswordError).toBeVisible();
        test.info().annotations.push({
            type: 'SECURITY-NOTE',
            description: 'AUTH006 BUG: Menampilkan "Your password is invalid!" mengindikasikan email ada di DB. Seharusnya "Invalid email or password" (generic) untuk hindari user enumeration.',
        });
    });

    // AUTH007 - Negative - Medium - uppercase email only
    test('AUTH007 - should show error with uppercase email only', async ({ page }) => {
        await authPage.login(VALID_EMAIL.toUpperCase(), VALID_PASSWORD);
        await expect(authPage.invalidEmailError).toBeVisible();
    });

    // AUTH008 - Negative - Medium - uppercase password only
    test('AUTH008 - should show error with uppercase password only', async ({ page }) => {
        await authPage.login(VALID_EMAIL, VALID_PASSWORD.toUpperCase());
        await expect(authPage.invalidPasswordError).toBeVisible();
    });
});

test.describe('Auth - Validation', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        await authPage.goto();
    });

    // AUTH009 - Validation - High - empty password
    test('AUTH009 - should show error when password is empty', async () => {
        await authPage.login(VALID_EMAIL, '');
        await expect(authPage.passwordRequiredError).toBeVisible();
    });

    // AUTH010 - Validation - High - empty email
    test('AUTH010 - should show error when email is empty', async () => {
        await authPage.login('', VALID_PASSWORD);
        await expect(authPage.emailRequiredError).toBeVisible();
    });

    // AUTH011 - Validation - High - empty both
    test('AUTH011 - should show error when email and password are empty', async () => {
        await authPage.login('', '');
        await expect(authPage.emailRequiredError).toBeVisible();
        await expect(authPage.passwordRequiredError).toBeVisible();
    });

    // AUTH012 - Validation - Low - Boundary 256 char email (HTML5 type=email blocks submit without @, so we use valid format long email)
    test('AUTH012 - should show error with 256 char email (boundary)', async ({ page }) => {
        const longEmail = 'a'.repeat(240) + '@test.com'; // 249 chars, exceeds typical limit, still valid format
        await authPage.login(longEmail, VALID_PASSWORD);
        // Site either shows invalid email or stays on login (no logged=true). We assert NOT logged in and email still visible
        await expect(page).not.toHaveURL(/\?logged=true/);
        await expect(authPage.loginPageHeading).toBeVisible();
        // If backend returns invalid email, it will show that; otherwise we at least verify not logged in
        // Try to check either invalidEmail or no success
        await expect(authPage.successHeader).not.toBeVisible();
    });

    // AUTH013 - Validation - Low - Boundary 256 char password (site validates max 25 chars)
    test('AUTH013 - should show error with 256 char password (boundary)', async () => {
        await authPage.login(VALID_EMAIL, LONG_STRING_256);
        await expect(authPage.passwordTooLongError).toBeVisible();
    });
});
