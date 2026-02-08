# Specification

## Summary
**Goal:** Add a complete repository-root `/tests` folder containing a working Jest + React Testing Library frontend test suite for the existing React app.

**Planned changes:**
- Create a root-level `/tests` directory containing all test files plus shared test utilities/mocks.
- Add deterministic test harness utilities (e.g., `renderWithProviders`) to wrap components with required providers and avoid runtime errors in tests.
- Mock authentication/admin/data hooks and usage tracking modules so tests can simulate states without network/canister dependencies and without editing immutable frontend hook/UI files.
- Implement tests covering: LandingPage role-based login buttons; App unauthenticated gating to LandingPage; ProfileSetup rendering when authenticated but `userProfile` is null; `/admin` route gating (AdminDashboard vs AccessDeniedScreen); role-based dashboard rendering (venue/musician/customer); usage tracking behavior (`page_view` on mount when authenticated; `session_start` once per session).
- Add `/tests/README.md` describing how to run tests locally, what is mocked, and which modules/behaviors are covered.

**User-visible outcome:** Developers can run a local, offline frontend test suite that validates authentication gating, routing/admin access, role-based dashboards, and usage tracking behavior.
