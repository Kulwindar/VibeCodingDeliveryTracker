# DeliveryTracker — KPI Framework
**Version:** 1.0 | **Status:** Draft | **Date:** June 2026 | **Scope:** MVP / POC

---

## 1. POC Acceptance Criteria

Pass/fail gates. All AC-0x items must pass before MVP is considered shippable.

| ID | Criterion | How to Test | Pass Condition |
|---|---|---|---|
| AC-01 | Admin can create an order | Submit new order via admin panel | Order saved to DB; `tracking_id` generated; no errors |
| AC-02 | Admin can update parcel status | Change status from `Picked Up` → `In Transit` | Status persisted to DB; `updated_at` timestamp refreshed |
| AC-03 | Customer tracking link resolves | Open tracking URL in browser (no login) | Correct order details displayed; no auth wall |
| AC-04 | 3-step timeline renders correctly | View tracking page at each status value | All 3 steps visible; active step highlighted; past steps marked; future steps muted |
| AC-05 | Status updates in real time | Admin changes status; observe customer tab | Customer page reflects new status in < 3 seconds without refresh |
| AC-06 | Invalid tracking URL handled | Open URL with unknown `tracking_id` | "Order not found" message shown; no blank page or unhandled error |
| AC-07 | App accessible via public URL | Open tracking link from external device | Page loads on mobile browser (iOS Safari, Android Chrome) |

---

## 2. MVP Success Metrics

Measured post-launch. Reviewed at 7-day and 30-day marks.

### 2.1 Operational Impact

| Metric | Baseline | 7-Day Target | 30-Day Target | Measurement Method |
|---|---|---|---|---|
| Inbound status-enquiry calls per day | Unmeasured (100% of updates via call) | Reduction observed | ↓ 70% vs. pre-launch baseline | Admin self-report; call log count |
| Avg. time admin spends per status update | ~3–5 min (phone call) | < 30 seconds | < 30 seconds | Manual time-on-task observation |

### 2.2 Performance

| Metric | Target | Measurement Method |
|---|---|---|
| Tracking page load time (4G mobile) | < 2 seconds | Chrome DevTools / Lighthouse mobile simulation |
| Status propagation delay (admin save → customer view) | < 3 seconds | Manual two-device test; stopwatch |
| API response time (`GET /api/track/:id`) | < 500 ms (p95) | Supabase query logs |

### 2.3 Reliability

| Metric | Target | Measurement Method |
|---|---|---|
| Realtime update success rate | ≥ 95% of status changes reflected without page refresh | Manual test across 20 simulated updates |
| Invalid state transition errors in production | 0 | API error log; admin feedback |
| Unhandled errors on tracking page | 0 | Browser console; error monitoring (if configured) |

### 2.4 Infrastructure

| Metric | Limit | Action if Breached |
|---|---|---|
| Supabase DB storage used | < 500 MB (free tier) | Audit old orders; consider paid plan |
| Supabase bandwidth consumed | < 2 GB / month | Throttle test traffic; evaluate upgrade |

---

## 3. User Satisfaction Signals

Qualitative — collected via direct observation or admin feedback during POC phase.

| Signal | Collection Method | Success Indicator |
|---|---|---|
| Admin finds status update flow intuitive | 5-minute walkthrough with admin user | Completes create + update without guidance |
| Customer can read timeline without explanation | Show tracking page to non-technical user | Correctly identifies current delivery step |
| No confusion on invalid link page | Open broken URL with test user | User understands the error without asking for help |
