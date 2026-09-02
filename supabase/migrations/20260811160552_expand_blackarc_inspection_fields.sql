/*
# Expand Blackarc inspection record for industry-grade fields

1. Modified Table
- `weld_inspections` now stores the full configuration, multi-image set, calibration, analysis, signature, and export state for each inspection.
- New columns: standard, joint_config, base_metal, filler_metal, position, service_condition, multi_pass, repair_weld, welder_id, heat_number, batch_number, images, calibration, analysis, signature, locked, certification.
- Existing columns (file_name, process_code, process_name, overall_score, critical_count, warning_count, criteria, report, dpt_required) remain intact and keep their defaults.

2. Data Safety
- All new columns are nullable or have safe defaults so existing rows remain valid.
- No existing columns are removed, renamed, or changed in type.

3. Security
- Existing row-level security and shared no-sign-in CRUD policies remain in place.
*/

ALTER TABLE public.weld_inspections
  ADD COLUMN IF NOT EXISTS standard text NOT NULL DEFAULT 'AWS D1.1',
  ADD COLUMN IF NOT EXISTS joint_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS base_metal text NOT NULL DEFAULT 'Carbon Steel',
  ADD COLUMN IF NOT EXISTS filler_metal text NOT NULL DEFAULT 'E7018',
  ADD COLUMN IF NOT EXISTS position text NOT NULL DEFAULT '1G',
  ADD COLUMN IF NOT EXISTS service_condition jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS multi_pass boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS repair_weld boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS welder_id text,
  ADD COLUMN IF NOT EXISTS heat_number text,
  ADD COLUMN IF NOT EXISTS batch_number text,
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS calibration jsonb,
  ADD COLUMN IF NOT EXISTS analysis jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS signature jsonb,
  ADD COLUMN IF NOT EXISTS locked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS certification jsonb NOT NULL DEFAULT '{}'::jsonb;