/*
# Add Blackarc process and report fields

1. Modified Table
- `weld_inspections.process_code` stores the selected welding process code.
- `weld_inspections.process_name` stores the full selected process label.
- `weld_inspections.report` stores process-specific checks, defect locations, recommendations, and DPT testing parameters as JSON.
- `weld_inspections.dpt_required` stores whether the report requires dye penetrant testing.

2. Data Safety
- Existing inspection rows remain intact and receive safe defaults for the new fields.
- No existing columns are removed, renamed, or changed in type.

3. Security
- Existing row-level security and shared no-sign-in CRUD policies remain in place.
*/

ALTER TABLE public.weld_inspections
  ADD COLUMN IF NOT EXISTS process_code text NOT NULL DEFAULT 'GMAW',
  ADD COLUMN IF NOT EXISTS process_name text NOT NULL DEFAULT 'GMAW (Gas Metal Arc Welding / MIG)',
  ADD COLUMN IF NOT EXISTS report jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS dpt_required boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS weld_inspections_process_code_idx
  ON public.weld_inspections (process_code);