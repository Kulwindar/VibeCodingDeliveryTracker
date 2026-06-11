# DeliveryTracker — Project Boundary Document

**Version:** 1.0 | **Date:** June 2026

---

## 1. Project Summary

DeliveryTracker is a link-based parcel tracking system for a small courier service. It replaces phone-based status notifications with a self-serve customer portal. The system consists of:

- **Admin Panel (React Native CLI)**: Mobile app for staff to create orders and update parcel status
- **Tracking Pages (Next.js)**: Public web pages showing real-time status via unique URLs
- **Backend (Supabase)**: PostgreSQL database with Realtime subscriptions for instant status updates

**Core Value**: Eliminate manual phone calls, reduce inbound status-enquiry calls by 70%, and achieve <30 seconds admin time-on-task for updates.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Mobile Admin | React Native CLI | Cross-platform mobile app for courier admin staff |
| Web Frontend | Next.js (React) | Public tracking pages, no authentication required |
| Database/Auth | Supabase | PostgreSQL + Realtime WebSocket + optional auth |
| API | Next.js API Routes | REST endpoints for order management |
| State Management | React Context / Zustand | Client-side state for both apps |
| Styling | Native CSS / Tailwind | Consistent UI components |

---

## 3. Directory Structure

```
DeliveryTracker/
├── apps/
│   ├── admin/                    # React Native CLI mobile app
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── OrderListScreen.tsx
│   │   │   │   └── OrderDetailScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   └── StatusUpdater.tsx
│   │   │   ├── services/
│   │   │   │   └── api.ts
│   │   │   └── navigation/
│   │   ├── App.tsx
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── web/                      # Next.js tracking pages
│       ├── pages/
│       │   ├── track/
│       │   │   └── [tracking_id].tsx
│       │   ├── api/
│       │   │   ├── orders/
│       │   │   │   ├── index.ts
│       │   │   │   └── [id]/status.ts
│       │   │   └── track/
│       │   │       └── [tracking_id].ts
│       │   └── index.tsx
│       ├── components/
│       │   ├── StatusTimeline.tsx
│       │   └── ErrorMessage.tsx
│       ├── styles/
│       │   └── globals.css
│       ├── lib/
│       │   └── supabase.ts
│       ├── next.config.js
│       └── package.json
│
├── packages/
│   └── shared/                   # Shared types and utilities
│       ├── src/
│       │   ├── types/
│       │   │   └── order.ts
│       │   └── utils/
│       │       └── status.ts
│       └── package.json
│
├── supabase/
│   ├── migrations/
│   │   └── 20260610_create_orders_table.sql
│   └── seed.sql
│
├── AGENT.md                      # Agent-specific configuration
├── README.md
└── package.json                  # Root monorepo config
```

---

## 4. Core Features (MVP)

### Admin Panel (Mobile)
- **Order Creation**: Input customer name, auto-generate UUID v4 tracking ID
- **Order Listing**: Paginated list of all orders with search/filter
- **Status Updates**: Forward-only progression buttons (Picked Up → In Transit → Delivered)
- **Copy Link**: Share tracking URL via WhatsApp/SMS

### Tracking Page (Web)
- **Public Access**: No authentication required
- **3-Step Timeline**: Visual progress indicator with active/inactive states
- **Realtime Updates**: Instant status reflection via Supabase WebSocket
- **Error Handling**: "Order not found" for invalid tracking IDs

---

## 5. API Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/orders` | Required | Create new order, generate tracking_id |
| `GET` | `/api/orders` | Required | List all orders (admin) |
| `PATCH` | `/api/orders/:id/status` | Required | Update status (forward-only validation) |
| `GET` | `/api/track/:tracking_id` | None | Public tracking endpoint |

---

## 6. Data Model

**Table: `orders`**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | Auto-generated |
| `tracking_id` | text UNIQUE | UUID v4 (122-bit entropy) |
| `customer_name` | text | Parcel recipient |
| `status` | enum | `picked_up` \| `in_transit` \| `delivered` |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto-updated via DB trigger |

---

## 7. Status Flow (Linear, Forward-Only)

```
Picked Up (step 1)
    ↓
In Transit (step 2)
    ↓
Delivered (step 3)
```

- Backwards transitions blocked at API level (returns 400)
- UI disables already-passed status options

---

## 8. Edge Cases

| ID | Scenario | Handling |
|---|---|---|
| EC-01 | Invalid tracking URL | "Order not found" message |
| EC-02 | Backwards status transition | API returns 400; UI disables options |
| EC-03 | WebSocket drops | Poll every 5 seconds as fallback |
| EC-04 | Duplicate status updates | Idempotent via DB trigger |
| EC-05 | Tracking before pickup | Step 1 (`picked_up`) as active state |
| EC-07 | Tracking ID enumeration | UUID v4 with 122-bit entropy |

---

## 9. POC Acceptance Criteria

All criteria must pass for MVP to be shippable:

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-01 | Admin creates order | Order saved; tracking_id generated |
| AC-02 | Admin updates status | Status persisted; timestamp refreshed |
| AC-03 | Customer tracking resolves | Correct details; no auth wall |
| AC-04 | Timeline renders | 3 steps visible; active highlighted |
| AC-05 | Real-time updates | Status reflects < 3 seconds without refresh |
| AC-06 | Invalid URL handled | "Order not found" shown gracefully |
| AC-07 | Public URL accessible | Loads on iOS Safari / Android Chrome |

---

## 10. Limitations

- No customer authentication (public tracking links)
- Linear, non-reversible status flow
- Single admin, no role management
- Supabase free tier constraints (500 MB DB, 2 GB bandwidth)
- No push notifications (page must be open for updates)
- React Native CLI only (no Expo)