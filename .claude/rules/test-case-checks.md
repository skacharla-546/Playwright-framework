# Rule: Type-check & lint on every new test case

Whenever a new test case is added (any new or edited `*.spec.ts` / `*.test.ts`
file, or any test file under `src/tests/`), the following checks **must** be run
before the change is considered done:

1. `npm run type-check`  — runs `tsc --noEmit`
2. `npm run lint`        — runs `eslint . --ext .ts,.tsx`

Both must pass. If either fails, fix the reported issues and re-run until clean.
