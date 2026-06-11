# DeliveryTracker — Project Scope Document
**Version:** 1.0 | **Status:** Draft | **Date:** June 2026

---

## 1. Executive Summary

DeliveryTracker is a lightweight, link-based parcel tracking system for a small courier service migrating from phone-based status notifications to self-serve customer tracking via unique public URLs.

---

## 2. Objectives & Success Metrics

### Primary Objectives
- Eliminate manual phone-based status updates through self-serve customer portal
- Reduce inbound status-enquiry calls by 70% within 30 days of launch
- Achieve < 30 seconds admin time-on-task for status updates (vs. current 3-5 min phone calls)

### Success Metrics
| Metric | Target | Measurement |
|---|---|---|
| Tracking page load time (4G mobile) | < 2 seconds | Chrome DevTools / Lighthouse mobile simulation |
| Status propagation delay | < 3 seconds | Manual two-device test with stopwatch |
| Realtime update success rate | ≥ 95% | Manual test across 20 simulated updates |
| Invalid state transitions in production | 0 | API error log monitoring |
| Supabase DB storage | < 500 MB | Dashboard monitoring |
| Supabase bandwidth | < 2 GB/month | Dashboard monitoring |

---

## 3. In Scope (MVP)

### Core Features
- **Admin Panel**: Create orders, generate tracking IDs, update parcel status
- **Tracking Link**: Unique public URL per order with no authentication required
- **Status Timeline UI**: 3-step visual timeline (Picked Up → In Transit → Delivered)
- **Realtime Updates**: Supabase Realtime subscription for instant status reflection

### Technical Stack
- React Native CLI (mobile admin app)
- Next.js (web tracking pages)
- Supabase (PostgreSQL database, Realtime WebSocket)

### Status Flow
Linear, forward-only progression: `picked_up` → `in_transit` → `delivered`

---

## 4. Out of Scope

- Customer authentication
- Push notifications
- Order history dashboard
- Payments integration
- Multi-courier management
- Analytics
- Expo support (React Native CLI only)

---

## 5. Technical Requirements

### Data Model
Single `orders` table with UUID v4 tracking IDs for security (122-bit entropy).

### API Endpoints
- `POST /api/orders` — Create order, generate tracking_id
- `PATCH /api/orders/:id/status` — Update status with forward-only validation
- `GET /api/track/:tracking_id` — Public tracking endpoint (no auth)
- `GET /api/orders` — Admin order listing (authenticated)

### Edge Case Handling
- Invalid tracking URLs: Show "Order not found" message
- Backwards status transitions: API returns 400, UI disables options
- WebSocket drops: Poll every 5 seconds as fallback
- Duplicate status updates: Idempotent via DB trigger

---

## 6. POC Acceptance Criteria

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-01 | Admin creates an order | Order saved to DB; `tracking_id` generated; no errors |
| AC-02 | Admin updates parcel status | Status persisted to DB; `updated_at` timestamp refreshed |
| AC-03 | Customer tracking link resolves | Correct order details displayed; no auth wall |
| AC-04 | 3-step timeline renders correctly | All 3 steps visible; active step highlighted; past/future states styled |
| AC-05 | Status updates in real time | Customer page reflects changes < 3 seconds without refresh |
| AC-06 | Invalid tracking URL handled | "Order not found" message shown; no blank page or unhandled error |
| AC-07 | App accessible via public URL | Page loads on mobile browser (iOS Safari, Android Chrome) |

---

## 7. Constraints & Limitations

- Supabase free tier: 500 MB DB, 2 GB bandwidth/month
- Single admin user with no role management
- Linear status flow cannot be reversed
- Manual limit monitoring during POC phase