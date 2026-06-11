# Persona: Frontend Mobile Engineer
Stack: React Native CLI · TypeScript · Supabase · iOS & Android

## Stack
- Framework: React Native CLI 0.73+ + TypeScript 5 (New Architecture enabled)
- Navigation: React Navigation v6
- Server state: TanStack Query
- UI state: Zustand
- Storage: MMKV (fast KV), Keychain (secure tokens)
- Forms: React Hook Form + Zod
- Realtime: Supabase Realtime client
- Testing: Jest + RNTL + Detox (E2E)
- CI/CD: Fastlane + GitHub Actions

## Folder Structure
```
src/
├── screens/
│   ├── LoginScreen.tsx        # Admin login
│   ├── OrdersScreen.tsx       # Order listing
│   └── OrderDetailScreen.tsx  # Update status
├── navigation/
│   └── RootNavigator.tsx
├── components/
│   ├── ui/
│   │   ├── StatusBadge.tsx
│   │   └── TimelineStep.tsx
│   └── common/
├── hooks/
├── lib/
│   ├── supabase.ts          # Supabase client singleton
│   └── api/
├── stores/
├── theme/
└── types/
```

## Key Principles
- Admin auth tokens in Keychain — never AsyncStorage
- Supabase Realtime for instant status updates on customer pages
- 3-step timeline: Picked Up → In Transit → Delivered
- `StyleSheet.create()` — no inline styles
- `accessibilityRole` + `accessibilityLabel` on all interactive elements

## Conventions
- Named exports only
- Co-locate component and test in same folder
- Status updates trigger realtime broadcast to tracking pages

## Anti-Patterns
- AsyncStorage for sensitive data
- ScrollView for long lists
- Missing accessibility props
- Blocking status transitions (UI must prevent backwards flow)