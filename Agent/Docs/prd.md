# DeliveryTracker — Product Requirements Document
**Version:** 1.0 | **Status:** Draft | **Date:** June 2026 | **Platform:** React Native CLI + Next.js + Supabase

---

## 1. Problem Statement

A small courier service currently notifies customers about parcel status exclusively via phone calls. This creates three compounding problems:

| Problem Area | Current State | Desired State |
|---|---|---|
| Customer Experience | Customer must call support to learn parcel status | Self-serve tracking via a unique URL |
| Operational Cost | Support staff manually relay every status update | Admin panel handles status management directly |
| Scalability | Phone-based flow breaks as order volume grows | Link-based tracker scales without additional headcount |
| Response Time | Status availability depends on agent availability | Instant reflection of admin status updates |

**Who is affected:**
- **Courier Admin** — staff manually fielding repeat calls, error-prone and time-consuming
- **End Customer** — no visibility into their delivery; must initiate contact for any information

---

## 2. Solution Overview

DeliveryTracker is a lightweight, link-based parcel tracking system. Each order gets a unique public URL. The customer opens the link and sees a live 3-step status timeline. No login required. The admin updates status from a simple web panel.

**MVP scope:**

| Module | What It Does |
|---|---|
| Admin Panel | Create orders, assign tracking IDs, update status (Picked Up / In Transit / Delivered) |
| Tracking Link | Unique public URL per order — no auth, real-time status |
| Status Timeline UI | 3-step visual timeline with active/inactive step indicators |
| Data Layer | Supabase free tier: `orders` table, status enum, Realtime subscription |

**Out of scope:** customer auth, push notifications, order history dashboard, payments, multi-courier management, analytics.

---

## 3. User Flow

### Admin Flow

```
Admin logs in
    │
    ▼
Creates new order (customer name, parcel details)
    │
    ▼
System generates unique tracking_id (UUID v4)
    │
    ▼
Admin copies tracking link → shares with customer (WhatsApp / SMS)
    │
    ▼
Admin opens order list → selects order → updates status
    │
    ├── Picked Up
    ├── In Transit
    └── Delivered
```

### Customer Flow

```
Customer receives tracking link
    │
    ▼
Opens URL in browser (no login required)
    │
    ▼
Tracking page loads → fetches order by tracking_id
    │
    ├── Valid ID → displays 3-step timeline with current status highlighted
    └── Invalid ID → shows "Order not found" error state
    │
    ▼
Supabase Realtime subscription active
    │
    ▼
Admin updates status → page updates instantly (no refresh needed)
```

### Status Progression (linear, forward-only)

```
Picked Up  ──►  In Transit  ──►  Delivered
  Step 1           Step 2           Step 3
```

---

## 4. API Design

### Data Model

**Table: `orders`**

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated |
| `tracking_id` | `text` UNIQUE | UUID v4 — used in public URL |
| `customer_name` | `text` | Parcel recipient |
| `status` | `enum` | `picked_up` \| `in_transit` \| `delivered` |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto-updated via DB trigger |

**Status enum values:**

| Value | Display Label | Timeline Step |
|---|---|---|
| `picked_up` | Picked Up | 1 of 3 |
| `in_transit` | In Transit | 2 of 3 |
| `delivered` | Delivered | 3 of 3 |

---

### Endpoints

#### `POST /api/orders`
Create a new order. Generates `tracking_id`.

**Request body:**
```json
{
  "customer_name": "Rahul Mehta"
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "tracking_id": "uuid-v4",
  "tracking_url": "https://deliverytracker.app/track/uuid-v4",
  "customer_name": "Rahul Mehta",
  "status": "picked_up",
  "created_at": "2026-06-10T08:00:00Z"
}
```

---

#### `PATCH /api/orders/:id/status`
Update parcel status. Enforces forward-only progression.

**Request body:**
```json
{
  "status": "in_transit"
}
```

**Response `200`:**
```json
{
  "id": "uuid",
  "status": "in_transit",
  "updated_at": "2026-06-10T09:30:00Z"
}
```

**Error `400` — invalid transition:**
```json
{
  "error": "Invalid status transition. Cannot move from 'delivered' to 'in_transit'."
}
```

---

#### `GET /api/track/:tracking_id`
Public endpoint. No auth. Returns order status for customer tracking page.

**Response `200`:**
```json
{
  "tracking_id": "uuid-v4",
  "customer_name": "Rahul Mehta",
  "status": "in_transit",
  "updated_at": "2026-06-10T09:30:00Z"
}
```

**Response `404`:**
```json
{
  "error": "Order not found."
}
```

---

#### `GET /api/orders`
Admin only. Returns paginated list of all orders.

**Response `200`:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "tracking_id": "uuid-v4",
      "customer_name": "Rahul Mehta",
      "status": "in_transit",
      "updated_at": "2026-06-10T09:30:00Z"
    }
  ],
  "total": 1
}
```

---

### Realtime (Supabase)
Customer tracking page subscribes to the `orders` table row matching `tracking_id`. On status change, UI updates without a page reload.

```js
supabase
  .channel('order-status')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `tracking_id=eq.${trackingId}`
  }, (payload) => {
    setStatus(payload.new.status);
  })
  .subscribe();
```

---

## 5. Edge Cases

| # | Scenario | Handling |
|---|---|---|
| EC-01 | Customer opens an invalid or non-existent tracking URL | Show "Order not found" message; no stack trace or DB error exposed |
| EC-02 | Admin attempts to set status backwards (e.g. `delivered` → `in_transit`) | API returns `400`; UI disables already-passed status options |
| EC-03 | Supabase Realtime WebSocket drops (poor mobile network) | Client falls back to polling every 5 seconds until reconnected |
| EC-04 | Admin submits status update twice in quick succession | DB `updated_at` trigger ensures idempotent writes; no duplicate records |
| EC-05 | Tracking link shared before order is picked up | Page loads with Step 1 (`picked_up`) as the current active state |
| EC-06 | Supabase free tier bandwidth/DB limit approached | No automatic handling at MVP; monitored manually via Supabase dashboard |
| EC-07 | Tracking ID brute-forced / enumerated | UUID v4 used (122-bit entropy); sequential IDs explicitly avoided |

---

## 6. KPIs (Success Metrics / Acceptance Criteria)

### POC Acceptance Criteria

| # | Criterion | Pass Condition |
|---|---|---|
| AC-01 | Admin marks order as "In Transit" | Status saved to DB; no errors |
| AC-02 | Customer tracking link reflects update | New status visible on tracking page within 3 seconds, without refresh |
| AC-03 | 3-step timeline renders correctly | All three steps visible; active step highlighted; inactive steps muted |
| AC-04 | Invalid URL handled gracefully | "Order not found" state shown; no blank page or unhandled error |
| AC-05 | App deployable to a public URL | Tracking link accessible from an external device |

### MVP Success Metrics

| Metric | Baseline | Target |
|---|---|---|
| Inbound status-enquiry calls per day | All calls (unmeasured) | Reduce by 70% within 30 days of launch |
| Tracking page load time | N/A | < 2 seconds on 4G mobile |
| Status propagation delay (admin save → customer view) | N/A | < 3 seconds |
| Invalid state transitions by admin | N/A | 0 in first week |

---

## 7. Limitations

| # | Limitation | Impact |
|---|---|---|
| L-01 | No customer authentication | Tracking link is public; anyone with the URL can view order status |
| L-02 | Status flow is linear and unidirectional | Cannot correct a status once advanced (e.g. mark "Delivered" as "In Transit" again) |
| L-03 | Single admin, no role management | All admin users share the same access level; no audit trail per user |
| L-04 | Supabase free tier constraints | 500 MB DB, 2 GB bandwidth/month; no SLA; unsuitable for production scale |
| L-05 | No push notifications | Customer must keep the tracking page open to receive live updates |
| L-06 | No order history for customers | Customers can only view current status, not a full event log |
| L-07 | Realtime reliability on mobile networks | WebSocket connections may drop; polling fallback adds 5-second lag |
| L-08 | React Native CLI only | No Expo support; OTA updates and build pipeline require native toolchain setup |
