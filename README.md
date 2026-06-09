# Advanced Playwright Framework

A production-ready end-to-end test automation framework built with **Playwright** + **TypeScript** for the **TTACart** web application.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | ^1.60 | Browser automation & test runner |
| TypeScript | via tsconfig | Static typing |
| Faker.js | ^10.4 | Fake test data generation |
| Winston | ^3 | Structured logging |
| Allure | ^3 | Advanced test reporting |
| dotenv | ^17 | Environment config |

---

## Project Structure

```
src/
├── api/          # API clients (REST helpers)
├── config/       # Environment & config loaders
├── fixtures/     # Reusable Playwright fixtures
├── pages/        # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckOutStepOnePage.ts
│   ├── CheckOutStepTwoPage.ts
│   ├── CheckOutCompletePage.ts
│   └── ItemDetailPage.ts
├── testdata/     # JSON / CSV / XLSX test data files
├── tests/        # Test specs
│   └── login.spec.ts
└── utils/        # Shared helpers
    ├── DataGenerator.ts   # Faker-backed fake data
    ├── logger.ts          # Winston logger (scoped)
    └── UtilElementLocator.ts  # Playwright action wrappers
rules/
├── README.md
└── test-quality-checks.md   # Quality gates for every test change
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
npx playwright install
```

### Environment

Copy `.env.example` to `.env` and set your values:

```bash
BASE_URL=https://app.thetestingacademy.com
LOG_LEVEL=info
```

---

## Running Tests

```bash
# All tests
npm test

# Single spec
npx playwright test src/tests/login.spec.ts

# Headed (visible browser)
npx playwright test --headed

# Specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# By tag
npm run test:p0      # smoke / critical
npm run test:p1      # regression
npm run test:smoke
```

---

## Reporting

| Reporter | Output |
|----------|--------|
| TTA Custom HTML | `tta-report/report_<timestamp>.html` |
| Playwright HTML | `playwright-report/index.html` |
| Allure | `allure-results/` → run `allure serve` |
| JUnit XML | `test-results.xml` |
| JSON | `test-results/results.json` |

```bash
# Open Playwright HTML report
npm run test:report

# Open TTA report (latest run)
open tta-report/index.html
```

---

## Page Object Pattern

Every page class extends `BasePage`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page, 'LoginPage');   // scoped logger: [LoginPage]
    }

    async loginAs(username: string, password: string) {
        await this.el.fill('[data-test="username"]', username);
        await this.el.fill('[data-test="password"]', password);
        await this.el.click('[data-test="login-button"]');
    }
}
```

`BasePage` provides:
- `this.el` — `UtilElementLocator` (click, fill, getText, isVisible, waits, …)
- `this.log` — scoped Winston logger
- `this.goto(path)` — navigation with page-load wait

---

## Fake Data

```typescript
import { DataGenerator } from '@utils/DataGenerator';

const creds    = DataGenerator.credentials();    // { username, password }
const checkout = DataGenerator.checkoutInfo();   // { firstName, lastName, postalCode }
const profile  = DataGenerator.customerProfile(); // full profile
```

---

## Quality Gates

Every test file change **must** pass before merging:

```bash
npm run typecheck   # zero TypeScript errors
npm run lint        # zero ESLint errors
```

See [rules/test-quality-checks.md](./rules/test-quality-checks.md) for full policy.

---

## Path Aliases

Configured in `tsconfig.json`:

| Alias | Resolves to |
|-------|------------|
| `@pages/*` | `src/pages/*` |
| `@utils/*` | `src/utils/*` |
| `@tests/*` | `src/tests/*` |
| `@api/*` | `src/api/*` |
| `@config/*` | `src/config/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@testdata/*` | `src/testdata/*` |

---

## CI/CD

GitHub Actions workflow at `.github/workflows/playwright.yml` runs on every push and pull request.
