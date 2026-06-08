# Project Rules for Claude

**ALWAYS read [rules/](./rules/) before changing code.**

## Hard rules

### Adding/modifying tests under `src/tests/**`

After ANY test file change, you MUST run:

```bash
npm run typecheck
npm run lint
```

Both must pass (exit 0) before reporting task complete. See [rules/test-quality-checks.md](./rules/test-quality-checks.md).

## Project structure

- `src/api/` — API clients
- `src/config/` — env/config loaders
- `src/fixtures/` — reusable Playwright fixtures
- `src/pages/` — page object models
- `src/testdata/` — test data files (JSON, CSV, XLSX)
- `src/tests/` — all test specs
- `src/utils/` — shared utility helpers
