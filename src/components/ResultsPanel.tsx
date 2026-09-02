import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CircleHelp,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Gauge,
  Lock,
  PenLine,
  ShieldCheck,
} from 'lucide-react';
import {
  complianceLabel,
  complianceTone,
  exportCsv,
  exportJson,
  exportPdf,
  downloadFile,
  formatDate,
  formatScore,
  getScoreTone,
  shortName,
  type Inspection,
  type Signature,
} from '@/lib/inspection';

type Props = {
  inspection: Inspection;
  onReset: () => void;
  onSign: (signature: Signature) => void;
  welderHistory: Inspection[];
};

export default function ResultsPanel({ inspection, onReset, onSign, welderHistory }: Props) {
  const [signingOpen, setSigningOpen] = useState(false);
  const [inspectorName, setInspectorName] = useState('');
  const [certNumber, setCertNumber] = useState('');
  const recommendation = inspection.critical_count > 0
    ? { label: 'Critical action needed', tone: 'critical' }
    : inspection.warning_count > 0
      ? { label: 'Review needed', tone: 'warning' }
      : { label: 'Accepted for visual review', tone: 'pass' };

  const handleSign = () => {
    if (!inspectorName || !certNumber) return;
    onSign({ inspectorName, certificationNumber: certNumber, signedAt: new Date().toISOString(), verification: 'Typed verification' });
    setSigningOpen(false);
  };

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    if (format === 'pdf') {
      void exportPdf(inspection);
    } else if (format === 'csv') {
      downloadFile(`blackarc-inspection-${inspection.id}.csv`, exportCsv(inspection), 'text/csv');
    } else {
      downloadFile(`blackarc-inspection-${inspection.id}.json`, exportJson(inspection), 'application/json');
    }
  };

  return (
    <section className="mx-auto max-w-[1200px] overflow-hidden py-4 sm:py-8">
      {/* Header */}
      <div className="mb-8 flex max-w-full flex-wrap items-end justify-between gap-5">
        <div className="max-w-full">
          <button className="mb-5 inline-flex max-w-full items-center gap-2 text-sm text-[#888888] transition hover:text-[#F5F5F5]" type="button" onClick={onReset} disabled={inspection.locked}>
            <ArrowLeft size={16} /> New inspection
          </button>
          <p className="mb-3 max-w-full text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">Inspection record · {formatDate(inspection.created_at)}{inspection.locked && ' · LOCKED'}</p>
          <h1 className="max-w-[760px] break-words text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{inspection.process_name}</h1>
          <p className="mt-3 max-w-[640px] break-words text-sm text-[#888888]">{inspection.file_name} · {inspection.standard}</p>
        </div>
        <div className="flex max-w-full items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 border-[#FFC107] bg-[#0A0A0A]">
            <span className="font-mono-data text-3xl font-bold text-[#FFC107]">{inspection.overall_grade ?? 'D'}</span>
          </div>
          <span className={`max-w-full rounded-full px-3 py-2 text-xs font-semibold ${recommendation.tone === 'critical' ? 'border border-[#660000] bg-[#2D0000] text-[#FF1A1A]' : recommendation.tone === 'warning' ? 'border border-[#664D00] bg-[#2D2600] text-[#FFC107]' : 'border border-emerald-900 bg-emerald-950 text-emerald-400'}`}>{recommendation.label}</span>
        </div>
      </div>

      {/* Process verification override warning */}
      {inspection.process_verification?.overridden && (
        <div className="mb-4 flex max-w-full items-center gap-3 overflow-hidden rounded-lg border border-[#664D00] bg-[#2D2600] px-4 py-3">
          <AlertTriangle className="shrink-0 text-[#FFC107]" size={18} />
          <p className="max-w-full break-words text-sm font-semibold text-[#FFC107]">PROCESS VERIFICATION OVERRIDDEN — Image may not match selected process. Predicted: {inspection.process_verification.prediction.predictedName}.</p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid max-w-full grid-cols-1 items-stretch gap-4 overflow-hidden md:grid-cols-2">
        <MetricCard label="Overall score" value={formatScore(Number(inspection.overall_score))} detail="/ 10" tone="yellow" icon={<Gauge size={18} />} />
        <MetricCard label="Critical findings" value={String(inspection.critical_count)} detail="Requires action" tone="red" icon={<AlertTriangle size={18} />} />
        <MetricCard label="Warnings" value={String(inspection.warning_count)} detail="Requires review" tone="yellow" icon={<CircleHelp size={18} />} />
        <MetricCard label="DPT status" value={inspection.dpt_required ? 'Req' : 'Not Req'} detail="Surface-breaking verification" tone={inspection.dpt_required ? 'red' : 'yellow'} icon={<ShieldCheck size={18} />} />
      </div>

      {/* Calibration warning */}
      {!inspection.calibration && (
        <div className="mt-4 flex max-w-full items-start gap-3 overflow-hidden rounded-lg border border-[#664D00] bg-[#2D2600] p-4 text-sm text-[#FFC107]">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} />
          <span className="max-w-full">Scale uncalibrated — measurements are estimated.</span>
        </div>
      )}

      {/* Image + Criteria */}
      <div className="mt-4 grid max-w-full grid-cols-1 items-stretch gap-4 overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-surface max-w-full overflow-hidden rounded-2xl p-3">
          {inspection.images[0] ? (
            <img className="aspect-[4/3] max-w-full overflow-hidden rounded-xl object-cover" src={inspection.images[0].url} alt={inspection.images[0].name} />
          ) : (
            <div className="grid aspect-[4/3] max-w-full place-items-center rounded-xl bg-[#0A0A0A] text-[#888888]">No image</div>
          )}
          <div className="mt-3 max-w-full text-xs text-[#888888]">{inspection.images[0]?.name ?? 'No image'} · {inspection.images.length} image(s)</div>
        </div>
        <div className="card-surface max-w-full overflow-hidden rounded-2xl p-5 sm:p-6">
          <h2 className="mb-5 max-w-full text-xl font-semibold">Criterion results</h2>
          <div className="max-w-full overflow-hidden rounded-lg border border-[#2A2A2A]">
            {inspection.criteria.map((c) => <CriterionRow key={c.name} criterion={c} />)}
          </div>
        </div>
      </div>

      {/* Inspection Summary */}
      <div className="card-surface mt-4 max-w-full overflow-hidden rounded-2xl p-5 sm:p-6">
        <h2 className="mb-5 max-w-full text-lg font-semibold">Inspection summary</h2>
        <div className="grid max-w-full grid-cols-1 gap-3 overflow-hidden sm:grid-cols-2">
          {[
            ['Inspection ID', inspection.id],
            ['Inspection Status', inspection.inspection_status ?? 'REVIEW NEEDED'],
            ['Overall Score', `${formatScore(Number(inspection.overall_score))} / 10`],
            ['Overall Grade', inspection.overall_grade ?? 'D'],
            ['Defect Types', inspection.report.findings.length > 0 ? inspection.report.findings.map((f) => f.type).join(', ') : 'None detected'],
            ['Overall Confidence', `${inspection.process_verification?.prediction.confidence ?? 85}%`],
          ].map(([label, value]) => (
            <div key={label} className="flex max-w-full items-center justify-between gap-3 border-b border-[#2A2A2A] py-2 text-sm">
              <span className="max-w-[50%] shrink-0 text-[#888888]">{label}</span>
              <span className="max-w-full break-words text-right text-[#F5F5F5]">{value}</span>
            </div>
          ))}
        </div>
        {inspection.report.findings.length > 0 && (
          <div className="mt-4 max-w-full overflow-hidden rounded-lg border border-[#2A2A2A]">
            <div className="border-b border-[#2A2A2A] bg-[#141414] px-4 py-2 text-xs uppercase tracking-[0.12em] text-[#888888]">Per-defect breakdown</div>
            {inspection.report.findings.map((f) => (
              <div key={f.type} className="grid max-w-full grid-cols-1 gap-1 border-b border-[#2A2A2A] px-4 py-3 last:border-b-0 sm:grid-cols-4">
                <span className="max-w-full break-words text-sm text-[#F5F5F5]">{f.type}</span>
                <span className="max-w-full break-words text-sm text-[#888888]">{f.location}</span>
                <span className={`max-w-full text-sm font-semibold ${f.severity === 'Critical' ? 'text-[#FF1A1A]' : f.severity === 'Major' ? 'text-[#FFC107]' : 'text-emerald-400'}`}>{f.severity}</span>
                <span className="max-w-full text-right text-sm text-[#FFC107]">{f.confidence}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuration summary */}
      <Section title="Configuration summary">
        <div className="grid max-w-full grid-cols-1 gap-3 overflow-hidden sm:grid-cols-2">
          {[
            ['Base metal', inspection.base_metal],
            ['Filler metal', inspection.filler_metal],
            ['Position', inspection.position],
            ['Joint', `${inspection.joint_config.type} · ${inspection.joint_config.preparation}`],
            ['Thickness', `${inspection.joint_config.thickness} mm`],
            ['Service', `${inspection.service_condition.loading} · ${inspection.service_condition.environment}`],
            ['Criticality', inspection.service_condition.criticality],
            ['Multi-pass', inspection.multi_pass ? 'Yes' : 'No'],
            ['Repair weld', inspection.repair_weld ? 'Yes' : 'No'],
            ['Welder ID', inspection.welder_id ?? 'Not recorded'],
            ['Heat number', inspection.heat_number ?? 'Not recorded'],
            ['Batch number', inspection.batch_number ?? 'Not recorded'],
          ].map(([label, value]) => (
            <div key={label} className="flex max-w-full items-center justify-between gap-3 border-b border-[#2A2A2A] py-2 text-sm">
              <span className="max-w-[50%] shrink-0 text-[#888888]">{label}</span>
              <span className="max-w-full break-words text-right text-[#F5F5F5]">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Process checks + Blowholes */}
      <div className="mt-4 grid max-w-full grid-cols-1 items-stretch gap-4 overflow-hidden md:grid-cols-2">
        <Section title="Process parameter checks">
          <ul className="max-w-full space-y-2">{inspection.report.processChecks.map((c) => <li key={c} className="max-w-full break-words text-sm leading-6 text-[#F5F5F5]">· {c}</li>)}</ul>
        </Section>
        <Section title="Blowholes / gas pores">
          <ul className="max-w-full space-y-2">{inspection.report.blowholes.map((b) => <li key={b} className="max-w-full break-words text-sm leading-6 text-[#F5F5F5]">· {b}</li>)}</ul>
        </Section>
      </div>

      {/* Measurements */}
      <Section title="Inspection parameter checklist">
        <ul className="max-w-full space-y-2">{inspection.report.measurements.map((m) => <li key={m} className="max-w-full break-words text-sm leading-6 text-[#F5F5F5]">· {m}</li>)}</ul>
      </Section>

      {/* Findings with compliance */}
      <Section title="Defect location and corrective action" accent="red">
        <div className="grid max-w-full grid-cols-1 gap-4 overflow-hidden">
          {inspection.report.findings.map((f) => {
            const tone = complianceTone(f.compliance);
            return (
              <div key={f.type} className="max-w-full overflow-hidden rounded-lg border border-[#660000] bg-[#2D0000] p-4">
                <div className="flex max-w-full flex-wrap items-start justify-between gap-3">
                  <p className="max-w-[70%] break-words text-sm font-semibold text-[#F5F5F5]">Defect: {f.type} | Location: {f.location} | Position: {f.position} | Zone: {f.zone}</p>
                  <span className={`max-w-full rounded-full px-3 py-1 text-xs font-semibold ${tone === 'pass' ? 'border border-emerald-900 bg-emerald-950 text-emerald-400' : tone === 'warning' ? 'border border-[#664D00] bg-[#2D2600] text-[#FFC107]' : 'border border-[#660000] bg-[#2D0000] text-[#FF1A1A]'}`}>
                    {complianceLabel(f.compliance)}
                  </span>
                </div>
                <p className="mt-3 max-w-full break-words text-sm leading-6 text-[#F5F5F5]">DEFECT: {f.type} | SEVERITY: {f.severity} | ROOT CAUSE: {f.rootCause} | CORRECTIVE ACTION: {f.correctiveAction} | PREVENTION: {f.prevention}</p>
                <div className="mt-3 grid max-w-full grid-cols-1 gap-2 overflow-hidden sm:grid-cols-2">
                  <p className="max-w-full break-words text-xs text-[#888888]">Clause: {f.clause}</p>
                  <p className="max-w-full break-words text-xs text-[#888888]">Corrosion: {f.corrosionRisk}</p>
                  <p className="max-w-full break-words text-xs text-[#888888]">Fatigue: {f.fatigueClass} · Kt = {f.stressConcentrationFactor}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* DPT */}
      <Section title="DPT testing parameters" accent="red">
        <div className="max-w-full space-y-2 text-sm leading-6">
          <p className="max-w-full whitespace-nowrap font-semibold text-[#FF1A1A]">DPT Req: {inspection.report.dpt.required ? 'Yes' : 'No'}</p>
          <p className="max-w-full break-words text-[#F5F5F5]">Locations: {inspection.report.dpt.locations.join(' · ')}</p>
          <p className="max-w-full break-words text-[#F5F5F5]">Method: {inspection.report.dpt.method} · Penetrant: {inspection.report.dpt.penetrant}</p>
          <p className="max-w-full break-words text-[#F5F5F5]">Developer: {inspection.report.dpt.developer}</p>
          <p className="max-w-full break-words text-[#F5F5F5]">Penetrant dwell: {inspection.report.dpt.dwellTime} · Developer time: {inspection.report.dpt.developerTime}</p>
          <p className="max-w-full break-words text-[#F5F5F5]">Lighting: {inspection.report.dpt.lighting}</p>
          <p className="max-w-full break-words text-[#888888]">{inspection.report.dpt.standard}</p>
        </div>
      </Section>

      {/* Advanced analysis grid */}
      <div className="mt-4 grid max-w-full grid-cols-1 items-stretch gap-4 overflow-hidden md:grid-cols-2">
        <Section title="HAZ thermal analysis">
          <KVList items={[
            ['Discoloration', inspection.analysis.hazThermal.discoloration],
            ['Peak temp', inspection.analysis.hazThermal.peakTempEstimate],
            ['Heat input', inspection.analysis.hazThermal.heatInputFlag],
            ['Sensitization', inspection.analysis.hazThermal.sensitizationRisk],
          ]} />
        </Section>
        <Section title="Multi-pass analysis">
          <KVList items={[
            ['Mode', inspection.analysis.multiPass.mode],
            ['Interpass cleaning', inspection.analysis.multiPass.interpassCleaning],
            ['Layer uniformity', inspection.analysis.multiPass.layerUniformity],
            ['Inter-pass fusion', inspection.analysis.multiPass.lackOfInterpassFusion],
          ]} />
        </Section>
        <Section title="PWHT verification">
          <KVList items={[
            ['PWHT visible', inspection.analysis.pwht.visible ? 'Yes' : 'No'],
            ['PWHT Req', inspection.analysis.pwht.required ? 'Yes' : 'No'],
            ['Note', inspection.analysis.pwht.note],
          ]} />
        </Section>
        <Section title="Heat input">
          <p className="max-w-full break-words text-sm leading-6 text-[#F5F5F5]">{inspection.analysis.heatInput}</p>
        </Section>
        <Section title="Mechanical testing predictions">
          <KVList items={[
            ['Tensile', inspection.analysis.mechanical.tensile],
            ['Bend', inspection.analysis.mechanical.bend],
            ['Impact', inspection.analysis.mechanical.impact],
            ['Hardness', inspection.analysis.mechanical.hardness],
            ['Macro etch', inspection.analysis.mechanical.macroEtch],
          ]} />
        </Section>
        <Section title="Fatigue life impact">
          <KVList items={[
            ['Life reduction', inspection.analysis.fatigue.estimatedLifeReduction],
            ['Kt values', inspection.analysis.fatigue.kt],
          ]} />
        </Section>
        <Section title="Repair weld tracking">
          <KVList items={[
            ['Is repair', inspection.analysis.repair.isRepair ? 'Yes' : 'No'],
            ['Location', inspection.analysis.repair.location],
            ['Reason', inspection.analysis.repair.reason],
            ['Multiple repair flag', inspection.analysis.repair.multipleRepairFlag],
          ]} />
        </Section>
        <Section title="Comparative analysis">
          <KVList items={[
            ['Image count', String(inspection.analysis.comparative.imageCount)],
            ['Worst case', inspection.analysis.comparative.worstCase],
            ['Affected length', inspection.analysis.comparative.affectedLengthPercent],
            ['Weld map', inspection.analysis.comparative.weldMap],
          ]} />
        </Section>
      </div>

      {/* Certification readiness */}
      <Section title="Certification readiness">
        <div className="mb-4 flex max-w-full items-center gap-3">
          {inspection.certification.likelyPass ? (
            <><CheckCircle2 className="shrink-0 text-emerald-400" size={20} /><span className="max-w-full text-sm font-semibold text-emerald-400">Likely to pass {inspection.standard} visual inspection</span></>
          ) : (
            <><AlertTriangle className="shrink-0 text-[#FF1A1A]" size={20} /><span className="max-w-full text-sm font-semibold text-[#FF1A1A]">Not likely to pass {inspection.standard} visual inspection</span></>
          )}
        </div>
        <div className="grid max-w-full grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2">
          <div className="max-w-full">
            <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Additional NDT</p>
            <ul className="max-w-full space-y-1">{inspection.certification.additionalNdt.map((n) => <li key={n} className="max-w-full break-words text-sm text-[#F5F5F5]">· {n}</li>)}</ul>
          </div>
          <div className="max-w-full">
            <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Documentation gaps</p>
            {inspection.certification.documentationGaps.length === 0 ? (
              <p className="max-w-full text-sm text-emerald-400">None — all documentation recorded.</p>
            ) : (
              <ul className="max-w-full space-y-1">{inspection.certification.documentationGaps.map((g) => <li key={g} className="max-w-full break-words text-sm text-[#FFC107]">· {g}</li>)}</ul>
            )}
            <p className="mt-3 max-w-full text-sm text-[#F5F5F5]">Estimated rework time: {inspection.certification.estimatedReworkHours} hours</p>
          </div>
        </div>
      </Section>

      {/* Welder performance trending */}
      {inspection.welder_id && (
        <Section title={`Welder performance: ${inspection.welder_id}`}>
          <WelderTrend inspections={welderHistory.filter((i) => i.welder_id === inspection.welder_id)} />
        </Section>
      )}

      {/* Signature & locking */}
      <Section title="Digital signature and report locking">
        {inspection.signature ? (
          <div className="max-w-full space-y-2 text-sm">
            <p className="max-w-full break-words text-[#F5F5F5]">Inspector: {inspection.signature.inspectorName}</p>
            <p className="max-w-full break-words text-[#F5F5F5]">Certification: {inspection.signature.certificationNumber}</p>
            <p className="max-w-full break-words text-[#F5F5F5]">Signed: {formatDate(inspection.signature.signedAt)}</p>
            <p className="max-w-full break-words text-[#888888]">Verification: {inspection.signature.verification}</p>
            <div className="mt-3 flex max-w-full items-center gap-2 text-emerald-400"><Lock size={16} /> <span className="max-w-full">Report locked — read-only.</span></div>
          </div>
        ) : signingOpen ? (
          <div className="max-w-full space-y-3">
            <input className="block h-11 w-full max-w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none focus:border-[#FFC107]" placeholder="Inspector name" value={inspectorName} onChange={(e) => setInspectorName(e.target.value)} />
            <input className="block h-11 w-full max-w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none focus:border-[#FFC107]" placeholder="Certification number" value={certNumber} onChange={(e) => setCertNumber(e.target.value)} />
            <div className="flex max-w-full gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#FFC107] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#FFD54F] disabled:opacity-50" type="button" onClick={handleSign} disabled={!inspectorName || !certNumber}><PenLine size={16} /> Sign and lock</button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2.5 text-sm text-[#F5F5F5] transition hover:border-[#666666]" type="button" onClick={() => setSigningOpen(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2.5 text-sm text-[#F5F5F5] transition hover:border-[#FFC107]" type="button" onClick={() => setSigningOpen(true)}>
            <PenLine size={16} /> Sign report
          </button>
        )}
      </Section>

      {/* Export */}
      <Section title="Export">
        <div className="flex max-w-full flex-wrap gap-3">
          <ExportButton onClick={() => handleExport('pdf')} icon={<FileText size={16} />} label="PDF report" />
          <ExportButton onClick={() => handleExport('csv')} icon={<FileSpreadsheet size={16} />} label="CSV data" />
          <ExportButton onClick={() => handleExport('json')} icon={<FileJson size={16} />} label="JSON" />
        </div>
      </Section>
    </section>
  );
}

function MetricCard({ label, value, detail, tone, icon }: { label: string; value: string; detail: string; tone: 'red' | 'yellow'; icon: React.ReactNode }) {
  return (
    <div className="card-surface max-w-full overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="mb-5 flex max-w-full items-center justify-between gap-3">
        <span className="max-w-full text-xs uppercase tracking-[0.18em] text-[#888888]">{label}</span>
        <span className={tone === 'red' ? 'shrink-0 text-[#FF1A1A]' : 'shrink-0 text-[#FFC107]'}>{icon}</span>
      </div>
      <div className="flex max-w-full items-end gap-2">
        <span className={`score-width max-w-full text-4xl font-semibold leading-none ${tone === 'red' ? 'text-[#FF1A1A]' : 'text-[#FFC107]'}`}>{value}</span>
        <span className="mb-1 max-w-full text-sm text-[#888888]">{detail}</span>
      </div>
    </div>
  );
}

function CriterionRow({ criterion }: { criterion: Inspection['criteria'][number] }) {
  const tone = getScoreTone(criterion.score);
  return (
    <div className="grid max-w-full grid-cols-[minmax(0,1fr)_80px] items-center gap-3 border-b border-[#2A2A2A] px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_140px_80px]">
      <div className="min-w-0 max-w-full">
        <span className="block max-w-full truncate text-sm text-[#F5F5F5]" title={criterion.name}>{shortName(criterion.name)}</span>
        <span className="mt-1 block max-w-full truncate text-xs text-[#888888]">{criterion.note}</span>
      </div>
      <div className="hidden h-1.5 max-w-full overflow-hidden rounded-full bg-[#2A2A2A] sm:block">
        <div className={`h-full rounded-full ${tone === 'critical' ? 'bg-[#CC0000]' : tone === 'warning' ? 'bg-[#FFC107]' : 'bg-emerald-500'}`} style={{ width: `${criterion.score * 10}%` }} />
      </div>
      <span className={`score-width max-w-full text-right text-sm font-semibold ${tone === 'critical' ? 'text-[#FF1A1A]' : tone === 'warning' ? 'text-[#FFC107]' : 'text-emerald-400'}`}>{formatScore(criterion.score)} / 10</span>
    </div>
  );
}

function Section({ title, children, accent = 'neutral' }: { title: string; children: React.ReactNode; accent?: 'neutral' | 'red' }) {
  return (
    <section className={`card-surface mt-4 max-w-full overflow-hidden rounded-2xl p-5 sm:p-6 first:mt-0 ${accent === 'red' ? 'border-[#660000]' : ''}`}>
      <h2 className="mb-5 max-w-full text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function KVList({ items }: { items: [string, string][] }) {
  return (
    <div className="max-w-full space-y-2">
      {items.map(([k, v]) => (
        <div key={k} className="flex max-w-full items-start gap-3 text-sm">
          <span className="max-w-[40%] shrink-0 text-[#888888]">{k}:</span>
          <span className="max-w-full break-words text-[#F5F5F5]">{v}</span>
        </div>
      ))}
    </div>
  );
}

function WelderTrend({ inspections }: { inspections: Inspection[] }) {
  if (inspections.length === 0) return <p className="max-w-full text-sm text-[#888888]">No performance history.</p>;
  const avg = inspections.reduce((s, i) => s + Number(i.overall_score), 0) / inspections.length;
  const totalCritical = inspections.reduce((s, i) => s + i.critical_count, 0);
  const defectTypes = new Set<string>();
  inspections.forEach((i) => i.report.findings.forEach((f) => defectTypes.add(f.type)));
  return (
    <div className="max-w-full space-y-3">
      <div className="grid max-w-full grid-cols-1 gap-3 overflow-hidden sm:grid-cols-3">
        <Stat label="Inspections" value={String(inspections.length)} />
        <Stat label="Avg score" value={formatScore(avg)} />
        <Stat label="Total critical" value={String(totalCritical)} />
      </div>
      <div className="max-w-full">
        <p className="mb-2 max-w-full text-xs uppercase tracking-[0.16em] text-[#888888]">Recurring defect patterns</p>
        <ul className="max-w-full space-y-1">{Array.from(defectTypes).map((d) => <li key={d} className="max-w-full break-words text-sm text-[#F5F5F5]">· {d}</li>)}</ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="max-w-full overflow-hidden rounded-lg border border-[#2A2A2A] p-3">
      <p className="max-w-full text-xs text-[#888888]">{label}</p>
      <p className="mt-1 max-w-full text-xl font-semibold text-[#FFC107]">{value}</p>
    </div>
  );
}

function ExportButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex max-w-full items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500" type="button" onClick={onClick}>
      <Download size={16} /> {icon} {label}
    </button>
  );
}
