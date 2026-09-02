import { useState } from 'react';
import {
  BarChart3,
  ChevronDown,
  CircleAlert,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import {
  baseMetals,
  fillerMetals,
  jointPreparations,
  jointTypes,
  loadingTypes,
  positions,
  processes,
  serviceEnvironments,
  criticalityLevels,
  standards,
  checkFillerCompatibility,
  type InspectionConfig,
} from '@/lib/inspection';

type Props = {
  config: InspectionConfig;
  onChange: (config: InspectionConfig) => void;
  onSubmit: () => void;
  onShowModelPerformance: () => void;
};

export default function ConfigPanel({ config, onChange, onSubmit, onShowModelPerformance }: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const compatibility = checkFillerCompatibility(config.baseMetal, config.fillerMetal);

  const update = <K extends keyof InspectionConfig>(key: K, value: InspectionConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <section className="mx-auto max-w-[860px] overflow-hidden py-4 sm:py-8">
      <div className="mb-7 max-w-full">
        <p className="mb-3 max-w-full text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">Inspection setup</p>
        <h1 className="max-w-[620px] text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">Configure inspection parameters</h1>
        <p className="mt-3 max-w-[620px] break-words text-sm leading-6 text-[#888888]">Process, standard, joint, material, and service inputs determine acceptance criteria and analysis output.</p>
      </div>

      <button className="mb-6 inline-flex max-w-full items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2.5 text-sm text-[#F5F5F5] transition hover:border-[#FFC107]" type="button" onClick={onShowModelPerformance}>
        <BarChart3 size={16} /> View model performance
      </button>

      <div className="card-surface max-w-full overflow-hidden rounded-2xl p-5 sm:p-6">
        <div className="grid max-w-full grid-cols-1 gap-5 overflow-hidden md:grid-cols-2">
          <Field label="Welding process" required>
            <Select value={config.processCode} onChange={(v) => { const p = processes.find((x) => x.code === v); onChange({ ...config, processCode: v, processName: p?.name ?? v }); }}>
              <option value="">Select process</option>
              {processes.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Acceptance standard" required>
            <Select value={config.standard} onChange={(v) => update('standard', v)}>
              {standards.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
        </div>

        <div className="mt-5 grid max-w-full grid-cols-1 gap-5 overflow-hidden md:grid-cols-2">
          <Field label="Base metal" required>
            <Select value={config.baseMetal} onChange={(v) => update('baseMetal', v)}>
              {baseMetals.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
          </Field>
          <Field label="Filler metal" required>
            <Select value={config.fillerMetal} onChange={(v) => update('fillerMetal', v)}>
              {fillerMetals.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
          </Field>
        </div>

        <div className={`mt-3 flex max-w-full items-start gap-2 overflow-hidden rounded-lg border p-3 text-sm ${compatibility.compatible ? 'border-emerald-900 bg-emerald-950 text-emerald-300' : 'border-[#664D00] bg-[#2D2600] text-[#FFC107]'}`}>
          <CircleAlert className="mt-0.5 shrink-0" size={16} />
          <span className="max-w-full break-words">{compatibility.note}</span>
        </div>

        <div className="mt-5 grid max-w-full grid-cols-1 gap-5 overflow-hidden md:grid-cols-2">
          <Field label="Welding position" required>
            <Select value={config.position} onChange={(v) => update('position', v)}>
              {positions.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </Field>
          <Field label="Joint type" required>
            <Select value={config.joint.type} onChange={(v) => update('joint', { ...config.joint, type: v })}>
              {jointTypes.map((j) => <option key={j} value={j}>{j}</option>)}
            </Select>
          </Field>
          <Field label="Joint preparation" required>
            <Select value={config.joint.preparation} onChange={(v) => update('joint', { ...config.joint, preparation: v })}>
              {jointPreparations.map((j) => <option key={j} value={j}>{j}</option>)}
            </Select>
          </Field>
          <Field label="Material thickness (mm)" required>
            <NumberInput value={config.joint.thickness} onChange={(v) => update('joint', { ...config.joint, thickness: v })} />
          </Field>
          <Field label="Root gap (mm)">
            <NumberInput value={config.joint.rootGap} onChange={(v) => update('joint', { ...config.joint, rootGap: v })} />
          </Field>
          <Field label="Root face (mm)">
            <NumberInput value={config.joint.rootFace} onChange={(v) => update('joint', { ...config.joint, rootFace: v })} />
          </Field>
        </div>

        <button className="mt-5 flex max-w-full items-center gap-2 text-sm text-[#FFC107] transition hover:text-[#FFD54F]" type="button" onClick={() => setAdvancedOpen((o) => !o)}>
          <ChevronDown size={16} className={advancedOpen ? 'rotate-180 transition' : 'transition'} />
          Advanced parameters
        </button>

        {advancedOpen && (
          <div className="mt-4 grid max-w-full grid-cols-1 gap-5 overflow-hidden md:grid-cols-2">
            <Field label="Service loading">
              <Select value={config.service.loading} onChange={(v) => update('service', { ...config.service, loading: v })}>
                {loadingTypes.map((l) => <option key={l} value={l}>{l}</option>)}
              </Select>
            </Field>
            <Field label="Service environment">
              <Select value={config.service.environment} onChange={(v) => update('service', { ...config.service, environment: v })}>
                {serviceEnvironments.map((e) => <option key={e} value={e}>{e}</option>)}
              </Select>
            </Field>
            <Field label="Criticality classification">
              <Select value={config.service.criticality} onChange={(v) => update('service', { ...config.service, criticality: v })}>
                {criticalityLevels.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <div className="flex max-w-full flex-col gap-3">
              <Toggle label="Multi-pass weld" checked={config.multiPass} onChange={(v) => update('multiPass', v)} />
              <Toggle label="Repair weld" checked={config.repairWeld} onChange={(v) => update('repairWeld', v)} />
            </div>
            <Field label="Welder ID">
              <TextInput value={config.welderId} onChange={(v) => update('welderId', v)} placeholder="e.g. W-104" />
            </Field>
            <Field label="Heat number">
              <TextInput value={config.heatNumber} onChange={(v) => update('heatNumber', v)} placeholder="Material heat number" />
            </Field>
            <Field label="Batch / lot number">
              <TextInput value={config.batchNumber} onChange={(v) => update('batchNumber', v)} placeholder="Filler batch number" />
            </Field>
          </div>
        )}

        <div className="mt-7 flex max-w-full items-center justify-end gap-3">
          <button
            className="inline-flex max-w-full items-center gap-2 rounded-lg bg-[#CC0000] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#FF1A1A] disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={!config.processCode}
            onClick={onSubmit}
          >
            <ShieldCheck size={16} /> Continue to upload
          </button>
        </div>
      </div>

      {config.processCode && (
        <div className="mt-5 max-w-full overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414] p-5">
          <div className="mb-3 flex max-w-full items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#888888]"><Layers size={14} className="shrink-0" /> Process parameter checks</div>
          <div className="grid max-w-full grid-cols-1 gap-2 overflow-hidden sm:grid-cols-2">
            {processes.find((p) => p.code === config.processCode)?.checks.map((c) => (
              <span className="max-w-full break-words text-sm text-[#F5F5F5]" key={c}>· {c}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block max-w-full">
      <span className="mb-2 block max-w-full text-sm font-medium text-[#F5F5F5]">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select className="block h-11 w-full max-w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition focus:border-[#FFC107]" value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      step="0.1"
      min={0}
      className="block h-11 w-full max-w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition focus:border-[#FFC107]"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      className="block h-11 w-full max-w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition focus:border-[#FFC107]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className="flex max-w-full items-center justify-between gap-3 rounded-lg border border-[#2A2A2A] px-3 py-2.5 text-sm text-[#F5F5F5] transition hover:border-[#666666]" onClick={() => onChange(!checked)}>
      <span className="max-w-full">{label}</span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? 'bg-[#FFC107]' : 'bg-[#2A2A2A]'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${checked ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
    </button>
  );
}
