# QABrain - Test Cases Lengkap (Format Mirror SauceDemo)

> Format mengikuti `saucedemo` (`tests/*.spec.ts` + `pages/*.pages.ts`) - diadaptasi untuk `https://practice.qabrains.com` dan `https://practice.qabrains.com/ecommerce`
> - AUTH valid: `qa_testers@qabrains.com` / `Password123` (main site)
> - ECOM valid: `test@qabrains.com` / `Password123` (ecommerce, lihat `ecommerce/login` Accepted email)
> - Password default ecommerce `Password123` untuk semua akun accepted

## Link & Config
- **BaseURL main**: `https://practice.qabrains.com/` (`playwright.config.ts:27`)
- **BaseURL ecom**: `https://practice.qabrains.com/ecommerce` (`pages/ecom-auth.pages.ts:14`, `pages/inventory.pages.ts:20`, etc)
- **Pages POM** mirror `saucedemo/pages/*.pages.ts:1`:
  - `pages/auth.pages.ts:1` - AUTH main
  - `pages/ecom-auth.pages.ts:1` - ECOM login
  - `pages/inventory.pages.ts:1` - Product list (mirror `inventory.pages.ts`)
  - `pages/product.pages.ts:1` - Product detail (mirror `product.pages.ts`)
  - `pages/cart.pages.ts:1` - Cart (mirror `cart.pages.ts`)
  - `pages/checkout.pages.ts:1` - Checkout (mirror `checkout.pages.ts`)
- **Tests** mirror `saucedemo/tests/*.spec.ts`:
  - `tests/auth.spec.ts:1` (14 tests AUTH001-AUTH014)
  - `tests/product.spec.ts:1` (5 tests PRODUCT-001..005)
  - `tests/cart.spec.ts:1` (7 tests CART-001..007)
  - `tests/checkout.spec.ts:1` (8 tests CHKOUT-001..008)

### Mapping SauceDemo → QABrain

| Area | SauceDemo | QABrain | Keterangan |
|---|---|---|---|
| AUTH | LGN001 valid | AUTH003 | `standard_user/secret_sauce` → `qa_testers@qabrains.com/Password123`, `inventory.html` → `?logged=true` |
| AUTH | LGN002 upper both | AUTH005 | `Your email and password both are invalid!` |
| AUTH | LGN005 invalid | AUTH004 | `Your email is invalid!` |
| AUTH | LGN006 empty pass | AUTH009 | `Password is a required field` |
| CART | CRT001 add single | PRODUCT-002 | `Add to cart` → `Remove from cart` + badge `1` |
| CART | CRT003 display in cart | CART-003 | badge `3` & total (QABrain $49.99+$89.00) |
| CART | CRT004 remove | CART-004 | popup `Are you absolutely sure?` → `Remove` confirm |
| CART | CRT006 Continue Shopping | CART-002 | `Continue Shopping` → `/ecommerce` |
| CART | CRT007 Checkout | CART-006 | `Checkout` → `/ecommerce/checkout-info` |
| CHECKOUT | CHK001 fill info | CHKOUT-001 | `First Name/Last Name/ZIP` → `Continue` → `Finish` |
| CHECKOUT | CHK005 empty cart bug | CART-007 | `Your cart is empty` but checkout still accessible (BUG) |

---

## 1. AUTH (14 tests)

| ID | Area | Type | Title | Pre Conditions | Test Data | Test Step | Expected Result | Actual Result | Status | Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AUTH001 | AUTH | Positive | User mengakses website | User sudah membuka browser | - | 1. Buka browser<br>2. Akses `https://practice.qabrains.com/` | Terlihat `Login Page`, input `Email` & `Password` + tombol `LOGIN`, URL `/`, hint `qa_testers@qabrains.com` | Sesuai | Pass | High | Locator `pages/auth.pages.ts:35` `[data-slot="alert-title"]` `tests/auth.spec.ts:21` |
| AUTH002 | AUTH | Positive | User dapat mengakses tombol "Back to Home" / Home | User di halaman login | - | 1. Akses login<br>2. Tekan `Home` di header | Kembali ke `/` tetap `Login Page` | Sesuai | Pass | High | Dipetakan ke `Home` link `pages/auth.pages.ts:36` `tests/auth.spec.ts:32` |
| AUTH003 | AUTH | Positive | Verifikasi pengguna dapat login dengan kredensial yang valid | User terdaftar | Email `qa_testers@qabrains.com` Pass `Password123` | 1. Buka login<br>2. Isi Email<br>3. Isi Password<br>4. Tekan `LOGIN` | Redirect `?logged=true`, `LOGIN SUCCESSFUL` + `LOGOUT` | Sesuai | Pass | High | Mirror LGN001 `tests/auth.spec.ts:41` |
| AUTH004 | AUTH | Negative | Verifikasi pengguna tidak bisa login dengan kredensial tidak valid | - | Email `invalid@qabrains.com` Pass `Password123` | Login invalid | URL `?email=false`, `Your email is invalid!` | Sesuai | Pass | High | Security note generic |
| AUTH005 | AUTH | Negative | Login uppercase email & password | User terdaftar | `QA_TESTERS@QABRAINS.COM` / `PASSWORD123` | Login uppercase keduanya | `Your email and password both are invalid!` `?email=false&password=false` | Sesuai | Pass | High | Mirror LGN002 `tests/auth.spec.ts:80` |
| AUTH006 | AUTH | Negative | Menolak login password lowercase | User terdaftar | `qa_testers@qabrains.com` / `password123` | Login lowercase pass | `Your password is invalid!` `?password=false` | Sesuai | Pass | High | **BUG/SEC** seharusnya generic `Invalid email or password` `tests/auth.spec.ts:88` |
| AUTH007 | AUTH | Negative | Uppercase email only | User terdaftar | `QA_TESTERS@QABRAINS.COM` / `Password123` | Login | `Your email is invalid!` | Sesuai | Pass | Medium | Mirror LGN003 |
| AUTH008 | AUTH | Negative | Uppercase password only | User terdaftar | `qa_testers@qabrains.com` / `PASSWORD123` | Login | `Your password is invalid!` | Sesuai | Pass | Medium | Mirror LGN004 |
| AUTH009 | AUTH | Validation | Error ketika password kosong | Di halaman login | Email valid, Password empty | Isi email saja | `Password is a required field` | Sesuai | Pass | High | Mirror LGN006 |
| AUTH010 | AUTH | Validation | Error ketika email kosong | Di halaman login | Email empty, Pass valid | Isi password saja | `Email is a required field` | Sesuai | Pass | High | Mirror LGN007 |
| AUTH011 | AUTH | Validation | Error ketika keduanya kosong | Di halaman login | Keduanya empty | Kosongkan keduanya | Kedua `required field` muncul | Sesuai | Pass | High | Mirror LGN008 |
| AUTH012 | AUTH | Validation | Boundary email 256 char | Di halaman login | `a`*240+`@test.com` / `Password123` | Long email | Tidak login, tetap di login, no `?logged=true` | Sesuai | Pass | Low | Mirror LGN009, `type=email` blok HTML5 jika tanpa `@` |
| AUTH013 | AUTH | Validation | Boundary password 256 char | Di halaman login | `qa_testers@qabrains.com` / `a`*256 | Long pass | `Password must be at most 25 characters` | Sesuai | Pass | Low | Mirror LGN010 `pages/auth.pages.ts:32` |
| AUTH014 | AUTH | Positive | Logout setelah login | Sudah login valid | Valid creds | Login → `LOGOUT` | Kembali ke `/`, `LOGIN` terlihat | Sesuai | Pass | High | `tests/auth.spec.ts:50` |

---

## 2. PRODUCTS (5 tests) - Ecommerce `https://practice.qabrains.com/ecommerce`

| ID | Area | Type | Title | Pre Conditions | Test Data | Test Step | Expected Result | Actual Result | Status | Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PRODUCT-001 | PRODUCTS | Positive | User dapat menekan produk yang dipilih | Sudah login `test@qabrains.com/Password123` | - | 1. Buka dashboard `/ecommerce`<br>2. Pilih produk `Sample Shirt Name` | Dialihkan ke `/ecommerce/product-details?id=1`, tampil nama & deskripsi | Sesuai | Pass | High | `tests/product.spec.ts:23` `pages/inventory.pages.ts:35` clickProduct |
| PRODUCT-002 | PRODUCTS | Positive | User dapat menambahkan produk ke dalam cart | Sudah login | - | 1. Dashboard<br>2. Pilih produk<br>3. Tekan `Add to Cart` | Tombol jadi `Remove from cart`, badge cart `1` di header | Sesuai | Pass | High | `tests/product.spec.ts:31` `pages/inventory.pages.ts:15` addToCart, saucedemo `cart.spec.ts:22` CRT001 |
| PRODUCT-003 | PRODUCTS | Positive | User dapat menekan tombol favorites pada produk | Sudah login | - | 1. Dashboard<br>2. Tekan `Favorites` (heart icon kanan atas gambar) | Heart tetap visible, tidak error, tetap di `/ecommerce` | Sesuai | Pass | High | `tests/product.spec.ts:42` `pages/inventory.pages.ts:17` favoriteButtons `.group span.absolute button` |
| PRODUCT-004 | PRODUCTS | Positive | User dapat menambahkan quantity pada halaman produk | Sudah login | - | 1. Dashboard<br>2. Klik gambar produk → detail<br>3. Tekan `(+)` quantity | Quantity bertambah (plus/minus visible), price `$49.99` tetap | Sesuai | Pass | High | `tests/product.spec.ts:53` `pages/product.pages.ts:14` quantityPlus |
| PRODUCT-005 | PRODUCTS | Positive | User dapat menekan tombol "Back to Products" | Sudah login | - | 1. Dashboard<br>2. Klik produk → detail<br>3. Tekan `Back to Products` | Kembali ke `/ecommerce` list produk | Sesuai | Pass | High | `tests/product.spec.ts:69` `pages/product.pages.ts:10` backToProducts |

---

## 3. CART (7 tests)

| ID | Area | Type | Title | Pre Conditions | Test Data | Test Step | Expected Result | Actual Result | Status | Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CART-001 | CART | Positive | User dapat menekan tombol cart pada bagian header | Sudah login | - | 1. Dashboard<br>2. Tekan `Cart` di header (goto `/ecommerce/cart`) | Diarahkan ke `/ecommerce/cart`, tampil `Your Cart` | Sesuai | Pass | High | `tests/cart.spec.ts:24` `pages/cart.pages.ts:26` cartTitle |
| CART-002 | CART | Positive | User dapat menekan tombol "Continue Shopping" | Sudah login | - | 1. Dashboard<br>2. Cart<br>3. Tekan `Continue Shopping` | Kembali ke `/ecommerce` dashboard | Sesuai | Pass | High | `tests/cart.spec.ts:31` mirror saucedemo CRT006 `cart.spec.ts:68` |
| CART-003 | CART | Positive | Verifikasi total price & count di cart setelah add produk | Sudah login | - | 1. Dashboard<br>2. Tambahkan 2 produk `Add to cart` | Badge `2`, cart list `Remove` count 2, price `$49.99` & `$89.00`, `Total` visible | Sesuai | Pass | High | `tests/cart.spec.ts:41` badge check `body` contains `2` |
| CART-004 | CART | Positive | User dapat menghapus produk di cart | Sudah login | Produk ada di cart | 1. Cart<br>2. Tekan `Remove` bawah nama produk<br>3. Popup tekan `Remove` | Produk terhapus, tampil `Your cart is empty.` | Sesuai | Pass | High | `tests/cart.spec.ts:58` `pages/cart.pages.ts:51` removeFirstItemWithConfirm dialog `Are you absolutely sure?` |
| CART-005 | CART | Positive | User menambahkan quantity di bagian cart | Sudah login | Produk di cart | 1. Cart<br>2. Tekan `(+)` pada produk | Quantity bertambah, `Total` update | Sesuai | Pass | High | `tests/cart.spec.ts:69` `pages/cart.pages.ts:33` quantityPlus |
| CART-006 | CART | Positive | User dapat menekan tombol Checkout | Sudah login | Produk di cart | 1. Cart<br>2. Tekan `Checkout` | Dialihkan ke `/ecommerce/checkout-info`, tampil `Checkout: Your Information` | Sesuai | Pass | High | `tests/cart.spec.ts:84` mirror CRT007 saucedemo |
| CART-007 | CART | Negative | Verifikasi user tidak bisa checkout ketika cart kosong | Sudah login | Cart kosong | 1. Dashboard<br>2. Cart header<br>3. Tekan `Checkout` | Tidak dapat checkout, `Your cart is empty.` dan `Checkout` hidden, tidak redirect ke `checkout-info` | `Checkout` hidden (Pass) tapi direct goto `checkout-info` masih bisa (BUG) | Pass | High | **BUG** mirip `saucedemo/tests/checkout.spec.ts:100` CHK005 Critical - anotasi `tests/cart.spec.ts:107` `BUG-High` |

---

## 4. CHECKOUT (8 tests)

| ID | Area | Type | Title | Pre Conditions | Test Data | Test Step | Expected Result | Actual Result | Status | Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CHKOUT-001 | CHECKOUT | Positive | User dapat menginputkan informasi ketika checkout | Sudah login, produk di cart | - | 1. Ecommerce + add product<br>2. `Checkout`<br>3. Isi First/Last/ZIP<br>4. `Continue` → `Finish` | Menampilkan overview, Finish tetap di `/checkout-overview` (saat ini tidak ada `checkout-complete` seperti saucedemo `Thank you`) | Sesuai | Pass | High | `tests/checkout.spec.ts:33` |
| CHKOUT-002 | CHECKOUT | Positive | User dapat melakukan transaksi ketika checkout | Sudah login, produk di cart | `John/Doe/12345` | 1. Cart → Checkout<br>2. Isi `First Name`, `Last Name`, `ZIP`<br>3. `Continue`<br>4. `Finish` | Overview tampil `Payment Information: SampleCard #43287`, `Shipping: Free Express Delivery`, `Total : $52.49` | Sesuai | Pass | High | `tests/checkout.spec.ts:44` `pages/checkout.pages.ts:21` paymentInfo |
| CHKOUT-003 | CHECKOUT | Positive | Memastikan dapat menekan tombol cancel untuk kembali ke halaman cart | Sudah login, produk di cart | Produk di cart | 1. Cart → Checkout<br>2. Tekan `Cancel` | Redirect ke `/ecommerce` atau `/ecommerce/cart`, tampil `Products`/`Your Cart` | Sesuai | Pass | High | `tests/checkout.spec.ts:58` `pages/checkout.pages.ts:19` cancelButton |
| CHKOUT-004 | CHECKOUT | Positive | Menampilkan data informasi transaksi sebelum melakukan checkout | Sudah login, produk di cart | Produk di cart | 1. Cart → Checkout<br>2. Isi `John/Doe/12345`<br>3. `Continue` | Menampilkan `Sample Shirt Name`, `Payment Information`, `Shipping Information`, `Item Total`, `Tax`, `Total` | Sesuai | Pass | High | `tests/checkout.spec.ts:67` overview detail |
| CHKOUT-005 | CHECKOUT | Negative | Verifikasi melakukan transaksi tanpa data pribadi yang diinput | Sudah login, produk di cart | Kosongkan `First Name`, `Last Name`, `ZIP` (clear `1207`) | 1. Cart → Checkout<br>2. Kosongkan semua<br>3. `Continue` | Tidak berhasil Continue, tetap di `checkout-info` dengan validasi | **BUG**: tetap lanjut ke `checkout-overview` | Failed (BUG) | High | **BUG: CHECKOUT** anotasi `tests/checkout.spec.ts:102` `BUG-High`, mirip SAUCEDemo CHK005 |
| CHKOUT-006 | CHECKOUT | Negative | Melakukan input data hanya First name saja | Sudah login, produk di cart | `John` only, Last & ZIP kosong | 1-4 isi First saja → Continue | Tidak berhasil Continue | **BUG**: tetap lanjut overview | Failed (BUG) | High | `tests/checkout.spec.ts:121` |
| CHKOUT-007 | CHECKOUT | Negative | Melakukan input data hanya last name saja | Sudah login, produk di cart | `Doe` only | Kosongkan First & ZIP → Continue | Tidak berhasil Continue | **BUG**: tetap lanjut | Failed (BUG) | High | `tests/checkout.spec.ts:137` |
| CHKOUT-008 | CHECKOUT | Negative | Melakukan input hanya zip code saja | Sudah login, produk di cart | `12345` only | Kosongkan First/Last → Continue | Tidak berhasil Continue | **BUG**: tetap lanjut | Failed (BUG) | High | `tests/checkout.spec.ts:153` |

---

## Cara Jalankan (mirror saucedemo)

```bash
# di D:\CODE\qabrain
npm ci
npx playwright install --with-deps
npx playwright test --project=chromium --workers=2 --reporter=list
npx playwright show-report
# atau semua browser
npx playwright test --reporter=html
```

Hasil terakhir chromium `--workers=2`:
```
Running 34 tests using 2 workers
✓ AUTH001 (765ms) ... AUTH014
✓ PRODUCT-001 .. PRODUCT-005
✓ CART-001 .. CART-007
✓ CHKOUT-001 .. CHKOUT-008
34 passed (51.1s)
```

## File Penting

- `pages/auth.pages.ts:10` - AUTH main, `pages/ecom-auth.pages.ts:5` - ECOM login
- `pages/inventory.pages.ts:12` - product list, `pages/product.pages.ts:9` - detail, `pages/cart.pages.ts:7` - cart, `pages/checkout.pages.ts:7` - checkout
- `tests/auth.spec.ts:12`, `tests/product.spec.ts:9`, `tests/cart.spec.ts:9`, `tests/checkout.spec.ts:11` - describe `Positive/Negative/Validation` mirip `saucedemo`
- `playwright.config.ts:27` - `baseURL: 'https://practice.qabrains.com'` + ecom `https://practice.qabrains.com/ecommerce`

## Catatan

- **AUTH SEC**: `Your email/password is invalid!` harusnya generic `Invalid email or password` (`tests/auth.spec.ts:88`).
- **CART-007 & CHKOUT-005..008 BUG**: checkout tanpa data / cart kosong masih lanjut ke `checkout-overview` (anotasi `BUG-High`), sama seperti `saucedemo` `checkout.spec.ts:100` CHK005 Critical.
- **Password 256**: validasi QABrain `Password must be at most 25 characters` berbeda dengan saucedemo generic.

