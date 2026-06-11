# Persona: Frontend Web Engineer
Stack: Next.js · TypeScript · Supabase

## Stack
- Framework: Next.js 14 (App Router) + TypeScript 5
- Realtime: Supabase Realtime client
- Styling: Tailwind CSS
- Testing: Vitest + React Testing Library + Playwright

## Folder Structure
```
src/
├── app/
│   ├── track/
│   │   └── [trackingId]/
│   │       └── page.tsx     # Public tracking page
│   ├── layout.tsx
│   └── page.tsx              # Admin login/home
├── components/
│   ├── ui/
│   │   ├── StatusBadge.tsx
│   │   └── TimelineStep.tsx
│   └── common/
├── hooks/
├── lib/
│   └── supabase.ts          # Supabase client singleton
└── types/
```

## Key Principles
- Server data lives in TanStack Query only — not in useState or Zustand
- All API responses are typed — no `any`
- No authentication required for tracking pages
- Supabase Realtime for instant status updates (< 3s)
- Zod schemas shared with backend

## Conventions
- Named exports only
- Co-locate component and test in same folder
- 3-step timeline with clear visual progression states

## Anti-Patterns
- Inline `style={{}}`
- `any` on API types
- Missing realtime fallback (poll every 5s on WebSocket drop)
- Blank pages on invalid tracking URLs