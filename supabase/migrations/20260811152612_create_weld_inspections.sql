/*
# Create welding inspection history (single-tenant, no sign-in)

1. New Tables
- `weld_inspections` stores each uploaded inspection's display name, overall score, critical and warning counts, criterion scores, and creation time.
- `id` is the generated inspection identifier.
- `file_name` stores the uploaded image name for history labels.
- `overall_score` stores the simulated overall score from 0 to 10.
- `critical_count` and `warning_count` store recommendation totals for quick history summaries.
- `criteria` stores the scored welding criteria as JSON.

2. Security
- Row level security is enabled.
- This app has no sign-in screen, so anon and authenticated roles can use the intentionally shared inspection history.
- Separate select, insert, update, and delete policies are included.

3. Important Notes
- The table is intentionally single-tenant for this no-auth inspection workstation.
- Uploaded image files are not stored; only inspection metadata and scores persist.
*/

CREATE TABLE IF NOT EXISTS public.weld_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  overall_score numeric(4,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 10),
  critical_count integer NOT NULL DEFAULT 0 CHECK (critical_count >= 0),
  warning_count integer NOT NULL DEFAULT 0 CHECK (warning_count >= 0),
  criteria jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.weld_inspections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shared inspections can be read" ON public.weld_inspections;
CREATE POLICY "Shared inspections can be read"
  ON public.weld_inspections FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Shared inspections can be created" ON public.weld_inspections;
CREATE POLICY "Shared inspections can be created"
  ON public.weld_inspections FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Shared inspections can be updated" ON public.weld_inspections;
CREATE POLICY "Shared inspections can be updated"
  ON public.weld_inspections FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Shared inspections can be deleted" ON public.weld_inspections;
CREATE POLICY "Shared inspections can be deleted"
  ON public.weld_inspections FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS weld_inspections_created_at_idx
  ON public.weld_inspections (created_at DESC);