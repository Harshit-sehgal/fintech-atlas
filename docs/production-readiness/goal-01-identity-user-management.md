# Goal 01 — Identity & User Management

**Status:** 🔴 Backend required · **Blocker:** static export has no server/database/persistence

**Objective:** Users can securely create, access, and manage their accounts.

## Requirements
- [ ] Email/password authentication
- [ ] Google OAuth
- [ ] Email verification
- [ ] Password reset
- [ ] Session management
- [ ] Profile editing
- [ ] Account deletion
- [ ] Optional 2FA

## Definition of Done
- [ ] New user registration succeeds.
- [ ] Verification emails are delivered.
- [ ] Password reset works end-to-end.
- [ ] Sessions expire correctly.
- [ ] Unauthorized users cannot access protected routes.
- [ ] Account deletion removes or anonymizes user data per the app's policy.
- [ ] Automated authentication tests pass.

## Status vs. this codebase
- Static export: **no accounts today**. The only per-user data is the
  localStorage bookmark set (`src/lib/bookmarks-context.tsx`).
- Requirement: an ADR + identity provider (e.g. Auth.js/Supabase/Auth0) and a
  hosting platform with server functions. Decide before any implementation.
