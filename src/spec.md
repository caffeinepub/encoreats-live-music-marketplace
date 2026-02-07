# Specification

## Summary
**Goal:** Add built-in, on-canister usage analytics and a minimal admin dashboard in Encoreats to view usage KPIs, daily trends, and recent activity—without third-party analytics.

**Planned changes:**
- Add on-canister analytics storage and update/query APIs in `backend/main.mo` to track unique users (principals), total sessions, per-day active user counts for the last N days, and per-user last-active timestamps.
- Add an append-only usage log in `backend/main.mo` plus an admin-only, paginated query endpoint returning recent events (reverse-chronological) with timestamp, caller principal, and event type.
- Enforce admin-only access for analytics summary/trends and log endpoints using the existing `AccessControl.isAdmin(accessControlState, caller)` authorization pattern.
- Add frontend automatic tracking to record `session_start` on authenticated app entry and `page_view` (or equivalent) for rendered screens; ensure calls are non-blocking and no-op safely if actor/identity is unavailable.
- Create a simplified `/admin` page under `frontend/src/pages/` using existing shadcn UI + Tailwind to show KPI cards (unique users, sessions), a daily active users trend visualization, and a scrollable recent activity log table with loading/empty/error states.
- Implement minimal path-based rendering so `/admin` shows the admin dashboard (or an "Access denied" screen for non-admins) without introducing a full routing framework.
- Add React Query hooks (in `frontend/src/hooks/useQueries.ts` or a new hooks file if needed) for: fetching admin analytics summary, fetching daily active trend, fetching paginated logs, and recording tracking events.

**User-visible outcome:** Admin users can visit `/admin` to see total users, total sessions, daily active user trends, and a paginated recent activity log; non-admin users visiting `/admin` see an access denied message, and normal app usage is tracked automatically in the background.
