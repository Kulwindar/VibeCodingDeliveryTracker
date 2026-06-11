# DeliveryTracker — Knowledge Transfer

**Last Updated:** 2026-06-11

---

## 1. Project Overview

| Attribute | Value |
|---|---|
| **Name** | DeliveryTracker |
| **Purpose** | Link-based parcel tracking system replacing phone notifications |
| **Platform** | React Native CLI (admin) + Next.js (tracking) + Supabase |
| **Status** | MVP Development |

---

## 2. Core Documents

| Document | Location | Description |
|---|---|---|
| PRD | `Agent/Docs/prd.md` | Full product requirements, user flows, API design |
| KPI | `Agent/Docs/kpi.md` | Success metrics and acceptance criteria |
| Project Scope | `Agent/Context/projectScope.md` | In-scope/out-of-scope features |
| Project Boundary | `Agent/Context/project_boundary.md` | Directory structure, tech stack, limitations |
| KT | `Agent/Memory/KT.md` | This knowledge transfer document |
| Prompt History | `Agent/Memory/prompt_history.md` | Chronological prompt log |

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Mobile Admin | React Native CLI 0.73+, TypeScript, React Navigation v6 |
| Web Tracking | Next.js, React 18, TypeScript |
| Database | Supabase (PostgreSQL + Realtime) |
| API | Next.js API Routes |
| State Management | TanStack Query, Zustand |
| Forms | React Hook Form + Zod |
| Testing | Vitest, Supertest, Playwright, Detox |

---

## 4. API Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/orders` | Required | Create order, generate tracking_id |
| `GET` | `/api/orders` | Required | List all orders (admin) |
| `PATCH` | `/api/orders/:id/status` | Required | Update status (forward-only) |
| `GET` | `/api/track/:tracking_id` | None | Public tracking endpoint |

---

## 5. Data Model

```sql
orders table:
- id (uuid PK)
- tracking_id (text UNIQUE) - UUID v4 for security
- customer_name (text)
- status (enum: picked_up | in_transit | delivered)
- created_at (timestamptz)
- updated_at (timestamptz)
```

---

## 6. Status Flow (Linear, Forward-Only)

```
Picked Up → In Transit → Delivered
   Step 1    Step 2     Step 3
```

Backwards transitions blocked (returns 400).

---

## 7. POC Acceptance Criteria

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-01 | Admin creates order | Order saved; tracking_id generated |
| AC-02 | Admin updates status | Status persisted; timestamp refreshed |
| AC-03 | Tracking link resolves | Correct details displayed |
| AC-04 | Timeline renders | 3 steps visible, active highlighted |
| AC-05 | Real-time updates | Status updates < 3 seconds |
| AC-06 | Invalid URL handled | "Order not found" message shown |
| AC-07 | Public URL accessible | Loads on mobile browsers |

---

## 8. Edge Cases

| ID | Scenario | Handling |
|---|---|---|
| EC-01 | Invalid tracking URL | Show "Order not found" |
| EC-02 | Backwards status transition | API returns 400; UI disables options |
| EC-03 | WebSocket drops | Poll every 5 seconds as fallback |
| EC-07 | Tracking ID enumeration | UUID v4 with 122-bit entropy |

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| Realtime update success rate | ≥ 95% |
| Inbound calls reduction | ↓ 70% in 30 days |

---

## 10. Limitations

- No customer authentication (public tracking links)
- Linear, non-reversible status flow
- Single admin, no role management
- Supabase free tier constraints (500 MB DB, 2 GB bandwidth)
- No push notifications (page must be open for updates)
- React Native CLI only (no Expo)