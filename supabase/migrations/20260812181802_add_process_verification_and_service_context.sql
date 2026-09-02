/*
# Add process verification and service context assessment fields

1. Modified Table
- `weld_inspections.process_verification` stores the weld process prediction result, whether the user overrode it, and when.
- `weld_inspections.service_context` stores the optional second-stage service context assessment (risk level, failure modes, NDT recommendations, rework decision, inspection intervals).

2. Data Safety
- Both new columns are nullable with no default so existing rows remain valid.
- No existing columns are removed, renamed, or changed in type.

3. Security
- Existing row-level security and shared no-sign-in CRUD policies remain in place.
*/

ALTER TABLE public.weld_inspections
  ADD COLUMN IF NOT EXISTS process_verification jsonb,
  ADD COLUMN IF NOT EXISTS service_context jsonb;