# Specification

## Summary
**Goal:** Let users explicitly choose to continue as Venue, Musician, or Customer at login, and carry that selection into profile setup.

**Planned changes:**
- Update the public Landing page to show three role-specific “Continue as” / “Join as” login buttons: Venue, Musician, Customer.
- Persist the selected role for the current browser session (e.g., sessionStorage) so it survives the Internet Identity login redirect/roundtrip.
- On Profile Setup for users without an existing profile, pre-select the role field based on the Landing-page selection.
- Preserve existing behavior when no role was selected before login (default remains Musician).

**User-visible outcome:** On the Landing page, users can pick Venue, Musician, or Customer before logging in; after Internet Identity login, new users see that role pre-selected during profile creation (or default to Musician if they didn’t choose).
