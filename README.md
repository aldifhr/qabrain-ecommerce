# qabrain-ecommerce

Playwright test automation for [practice.qabrains.com](https://practice.qabrains.com/ecommerce).

## Setup

```bash
npm install
```

## Environment

Copy `.env.example` to `.env` and adjust if needed:

```env
BASE_URL=https://practice.qabrains.com/ecommerce
EMAIL=test@qabrains.com
PASSWORD=Password123
```

## Run Tests

| Command | Description |
|---------|-------------|
| `npm test` | Headless all browsers |
| `npm run test:headed` | Visible browser |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:debug` | Debug mode |
| `npm run report` | Open HTML report |

## Project Structure

```
├── pages/          # Page Object Models
│   └── auth.ts
├── tests/          # Test specs
│   ├── auth.spec.ts
│   └── navigation.spec.ts
├── util/           # Helpers & config
│   ├── config.ts
│   └── user.ts
├── .env.example
├── playwright.config.ts
└── package.json
```

## Tests

- **Auth — Positive:** Login with valid credentials, back-to-home navigation
- **Auth — Negative:** Rejected login with uppercase email/password, lowercase password
- **Navigation:** Basic page access verification

## Tags

- `@positive` — happy path scenarios
- `@negative` — error/edge case scenarios
