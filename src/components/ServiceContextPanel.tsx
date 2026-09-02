import { useState } from 'react';
import { AlertTriangle, ChevronDown, LoaderCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { Inspection, ServiceContextAssessment, ServiceContextInput } from '@/lib/inspection';
import { buildServiceContextAssessment } from '@/lib/inspection';

type Props = {
  inspection: Inspection;
  onAssessment: (assessment: ServiceContextAssessment) => void;
};

const loadingTypes = ['Static', 'Dynamic/Cyclic', 'Impact', 'Fatigue', 'Seismic', 'Wind', 'Pressure cycling', 'Thermal cycling'];
const environments = ['Ambient', 'High temperature (>400°C)', 'Cryogenic (<-40°C)', 'Corrosive (acid/alkali/salt)', 'Marine/Subsea', 'Sour service (H2S)', 'UV exposure', 'Chemical exposure', 'Radiation'];
const criticalityLevels = ['Non-critical', 'Safety-critical', 'Pressure-containing', 'Load-bearing structural', 'Secondary/Non-structural'];
const vibrationLevels = ['None', 'Low', 'Moderate', 'High'];
const consequences = ['Minor downtime', 'Major repair', 'Catastrophic/Safety incident'];

const emptyInput: ServiceContextInput = {
  loading: 'Static',
  environment: 'Ambient',
  criticality: 'Non-critical',
  designLifeYears: '',
  designLifeCycles: '',
  operatingTempMin: '',
  operatingTempMax: '',
  operatingPressureMin: '',
  operatingPressureMax: '',
  vibration: 'None',
  consequenceOfFailure: 'Minor downtime',
};

export default function ServiceContextPanel({ inspection, onAssessment }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<ServiceContextInput>(emptyInput);
  const [assessing, setAssessing] = useState(false);
  const [result, setResult] = useState<ServiceContextAssessment | null>(inspection.service_context);

  const handleSubmit = () => {
    setAssessing(true);
    window.setTimeout(() => {
      const assessment = buildServiceContextAssessment(input, inspection);
      setResult(assessment);
      onAssessment(assessment);
      setAssessing(false);
    }, 1200);
  };

  const riskTone = (level: string) => {
    if (level === 'LOW') return 'border-emerald-800 bg-emerald-950 text-emerald-400';
    if (level === 'MEDIUM') return 'border-[#664D00] bg-[#2D2600] text-[#FFC107]';
    if (level === 'HIGH') return 'border-[#660000] bg-[#2D0000] text-[#FF1A1A]';
    return 'border-[#660000] bg-[#2D0000] text-[#FF1A1A]';
  };

  const reworkTone = (decision: string) => {
    if (decision === 'Acceptable as-is') return 'text-emerald-400';
    if (decision === 'Acceptable with monitoring') return 'text-[#FFC107]';
    return 'text-[#FF1A1A]';
  };

  return (
    <section className="mt-4 max-w-full overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414]">
      <button className="flex w-full max-w-full items-center justify-between gap-3 p-5 text-left transition hover:bg-[#1c1c1c] sm:p-6" type="button" onClick={() => setOpen((o) => !o)}>
        <div className="flex max-w-full items-center gap-3">
          <ShieldAlert size={20} className="shrink-0 text-[#FFC107]" />
          <div className="max-w-full">
            <h2 className="max-w-full text-lg font-semibold">Service Context Assessment (Optional)</h2>
            <p className="mt-1 max-w-full text-sm text-[#888888]">Evaluate the weld against specific service conditions for risk and remaining life.</p>
          </div>
        </div>
        <ChevronDown size={20} className={`shrink-0 text-[#888888] transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="max-w-full overflow-hidden border-t border-[#2A2A2A] p-5 sm:p-6">
          {result ? (
            <div className="max-w-full space-y-5">
              <div className={`flex max-w-full items-center gap-3 rounded-lg border px-4 py-3 ${riskTone(result.riskLevel)}`}>
                <AlertTriangle size={20} className="shrink-0" />
                <div className="max-w-full">
                  <p className="max-w-full text-sm font-semibold uppercase tracking-[0.16em]">Risk Level: {result.riskLevel}</p>
                  <p className="mt-1 max-w-full break-words text-sm">{result.riskReasoning}</p>
                </div>
              </div>

              <div className="grid max-w-full grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2">
                <div className="max-w-full">
                  <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Suitability</p>
                  <p className="max-w-full break-words text-sm text-[#F5F5F5]">{result.suitability}</p>
                </div>
                <div className="max-w-full">
                  <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Rework Decision</p>
                  <p className={`max-w-full break-words text-sm font-semibold ${reworkTone(result.reworkDecision)}`}>{result.reworkDecision}</p>
                </div>
              </div>

              <div className="max-w-full">
                <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Predicted Failure Modes</p>
                <ul className="max-w-full space-y-1">{result.failureModes.map((m) => <li key={m} className="max-w-full break-words text-sm text-[#F5F5F5]">· {m}</li>)}</ul>
              </div>

              <div className="grid max-w-full grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2">
                <div className="max-w-full">
                  <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Remaining Safety Margin</p>
                  <p className="max-w-full break-words text-sm text-[#F5F5F5]">{result.remainingSafetyMargin}</p>
                </div>
                <div className="max-w-full">
                  <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Inspection Intervals</p>
                  <p className="max-w-full break-words text-sm text-[#F5F5F5]">{result.inspectionIntervals}</p>
                </div>
              </div>

              <div className="max-w-full">
                <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Additional NDT / Testing Recommended</p>
                <ul className="max-w-full space-y-1">{result.additionalNdt.map((n) => <li key={n} className="max-w-full break-words text-sm text-[#FFC107]">· {n}</li>)}</ul>
              </div>

              <button className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2.5 text-sm text-[#F5F5F5] transition hover:border-[#666666]" type="button" onClick={() => { setResult(null); setInput(emptyInput); }}>
                Re-run assessment
              </button>
            </div>
          ) : (
            <div className="max-w-full space-y-5">
              <div className="grid max-w-full grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2">
                <Field label="Loading type">
                  <Select value={input.loading} onChange={(v) => setInput({ ...input, loading: v })} options={loadingTypes} />
                </Field>
                <Field label="Service environment">
                  <Select value={input.environment} onChange={(v) => setInput({ ...input, environment: v })} options={environments} />
                </Field>
                <Field label="Criticality">
                  <Select value={input.criticality} onChange={(v) => setInput({ ...input, criticality: v })} options={criticalityLevels} />
                </Field>
                <Field label="Vibration">
                  <Select value={input.vibration} onChange={(v) => setInput({ ...input, vibration: v })} options={vibrationLevels} />
                </Field>
                <Field label="Consequence of failure">
                  <Select value={input.consequenceOfFailure} onChange={(v) => setInput({ ...input, consequenceOfFailure: v })} options={consequences} />
                </Field>
                <Field label="Design life (years)">
                  <Input value={input.designLifeYears} onChange={(v) => setInput({ ...input, designLifeYears: v })} placeholder="e.g. 25" />
                </Field>
                <Field label="Design life (cycles)">
                  <Input value={input.designLifeCycles} onChange={(v) => setInput({ ...input, designLifeCycles: v })} placeholder="e.g. 100000" />
                </Field>
                <Field label="Operating temp min (°C)">
                  <Input value={input.operatingTempMin} onChange={(v) => setInput({ ...input, operatingTempMin: v })} placeholder="e.g. -20" />
                </Field>
                <Field label="Operating temp max (°C)">
                  <Input value={input.operatingTempMax} onChange={(v) => setInput({ ...input, operatingTempMax: v })} placeholder="e.g. 450" />
                </Field>
                <Field label="Operating pressure min (bar)">
                  <Input value={input.operatingPressureMin} onChange={(v) => setInput({ ...input, operatingPressureMin: v })} placeholder="e.g. 0" />
                </Field>
                <Field label="Operating pressure max (bar)">
                  <Input value={input.operatingPressureMax} onChange={(v) => setInput({ ...input, operatingPressureMax: v })} placeholder="e.g. 150" />
                </Field>
              </div>

              <button className="inline-flex max-w-full items-center gap-2 rounded-lg bg-[#CC0000] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#FF1A1A] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={handleSubmit} disabled={assessing}>
                {assessing ? <LoaderCircle size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                {assessing ? 'Assessing...' : 'Run service assessment'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block max-w-full">
      <span className="mb-2 block max-w-full text-sm font-medium text-[#F5F5F5]">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className="block h-11 w-full max-w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition focus:border-[#FFC107]" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="text" className="block h-11 w-full max-w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition focus:border-[#FFC107]" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  );
}
