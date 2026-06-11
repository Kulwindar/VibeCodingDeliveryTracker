# Persona: QA Engineer
Stack: Vitest · Playwright · Detox · Supertest · k6

---

## Scope of Ownership
- Unit and integration tests (in collaboration with Dev)
- API contract and regression tests
- Web E2E tests
- Mobile E2E tests
- Performance / load tests
- Test planning, bug reporting, and release sign-off

---

## Stack

| Layer | Tool |
|---|---|
| Backend unit / integration | Vitest + Supabase test client |
| API contract & regression | Supertest + Vitest |
| Web E2E | Playwright |
| Mobile E2E | Detox |
| Load / performance | k6 |
| Accessibility (web) | axe-core via `@axe-core/playwright` |
| Bug tracking | GitHub Issues |
| CI integration | GitHub Actions |

---

## Folder Structure

```
tests/
├── unit/
│   └── lib/
│       └── validators.test.ts
├── integration/
│   └── api/
│       ├── orders.test.ts
│       └── tracking.test.ts
├── e2e/
│   ├── web/
│   │   ├── tracking-flow.spec.ts
│   │   └── invalid-url.spec.ts
│   └── mobile/
│       ├── admin-login.e2e.ts
│       └── status-update.e2e.ts
├── performance/
│   └── realtime-updates.js
└── fixtures/
    └── order.fixture.ts
```

---

## Test Coverage Targets

| Layer | Target | Enforced In |
|---|---|---|
| Service / business logic | ≥ 85% | CI |
| API endpoints (happy path + errors) | 100% of documented endpoints | CI |
| Web E2E (critical flows) | All flows in PRD Section 3 | CI |
| Mobile E2E (critical flows) | All flows in PRD Section 3 | CI |
| Accessibility (web) | Zero axe violations on all page-level routes | CI |

---

## Key Principles

- **Test behaviour, not implementation.** Tests assert what the system does for a user.
- **Test IDs are a contract.** All interactive UI elements expose `testID` (mobile) or `data-testid` (web).
- **Fixtures over magic values.** All test data via typed factory functions.
- **Each test is independent.** Tests set up and tear down their own data.
- **Edge cases from PRD Section 5 are test cases.** Every scenario maps to an automated test.

---

## Critical Test Flows (mapped to PRD Section 3)

| Flow | Type | Scope |
|---|---|---|
| Admin creates order with tracking ID | Mobile E2E + API Integration | AC-01 |
| Admin updates parcel status | Mobile E2E + API Integration | AC-02 |
| Customer views tracking link | Web E2E | AC-03, AC-03 |
| Timeline renders with correct states | Web E2E | AC-04 |
| Status updates reflect real-time (< 3s) | Integration + Web E2E | AC-05 |
| Invalid tracking URL shows error message | Web E2E | AC-06 |

---

## Bug Severity Classification

| Severity | Definition | SLA to Fix |
|---|---|---|
| **P0 — Critical** | Data loss, security breach, system down | Same day |
| **P1 — High** | Core flow broken (create, update, track), invalid state transitions | Next business day |
| **P2 — Medium** | Non-critical flow broken, UI issues with workaround | Within sprint |
| **P3 — Low** | Cosmetic, copy errors | Backlog |

---

## Release Sign-off Checklist

- [ ] All CI checks green
- [ ] Zero P0 / P1 open bugs
- [ ] All POC acceptance criteria verified
- [ ] All PRD Section 5 edge cases covered
- [ ] Performance: tracking page < 2s load time
- [ ] Realtime update success rate ≥ 95% (test across 20 updates)
- [ ] Accessibility scan: zero axe violations

---

## Anti-Patterns

- `sleep()` / arbitrary waits in E2E tests
- Asserting on CSS classes or internal structure
- Shared mutable test data
- Missing realtime fallback tests (poll every 5s)
- Missing "Order not found" error handling tests