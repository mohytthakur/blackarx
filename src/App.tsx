import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, History, LoaderCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import './index.css';
import HomePage from '@/components/HomePage';
import ConfigPanel from '@/components/ConfigPanel';
import UploadPanel from '@/components/UploadPanel';
import ResultsPanel from '@/components/ResultsPanel';
import ServiceContextPanel from '@/components/ServiceContextPanel';
import ModelPerformance from '@/components/ModelPerformance';
import {
  buildInspectionPayload,
  formatDate,
  formatScore,
  processes,
  type Calibration,
  type ImageItem,
  type Inspection,
  type InspectionConfig,
  type ProcessVerification,
  type ServiceContextAssessment,
  type Signature,
} from '@/lib/inspection';

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? '',
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
);

const defaultConfig: InspectionConfig = {
  processCode: '',
  processName: '',
  standard: 'AWS D1.1 (Structural Steel)',
  joint: { type: 'Butt', preparation: 'Single-V', thickness: 12, rootGap: 2, rootFace: 1 },
  baseMetal: 'Carbon Steel',
  fillerMetal: 'E7018',
  position: '1G/1F (Flat)',
  service: { loading: 'Static', environment: 'Ambient', criticality: 'Non-critical' },
  multiPass: false,
  repairWeld: false,
  welderId: '',
  heatNumber: '',
  batchNumber: '',
};

type Step = 'home' | 'config' | 'upload' | 'analyzing' | 'results' | 'model-performance';

function App() {
  const [step, setStep] = useState<Step>('home');
  const [config, setConfig] = useState<InspectionConfig>(defaultConfig);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [calibration, setCalibration] = useState<Calibration | null>(null);
  const [history, setHistory] = useState<Inspection[]>([]);
  const [activeInspection, setActiveInspection] = useState<Inspection | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [historyCleared, setHistoryCleared] = useState(false);
  const [processVerification, setProcessVerification] = useState<ProcessVerification | null>(null);
  const fadeKey = useRef(step);
  if (fadeKey.current !== step) fadeKey.current = step;

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      const { data, error } = await supabase.from('weld_inspections').select('*').order('created_at', { ascending: false });
      if (!isMounted) return;
      if (error) setErrorMessage('History is unavailable.');
      else setHistory((data as Inspection[]) ?? []);
      setIsLoadingHistory(false);
    };
    void loadHistory();
    return () => { isMounted = false; };
  }, []);

  const welderHistory = useMemo(() => history, [history]);

  const runAnalysis = async (overrideConfig?: InspectionConfig, overrideVerification?: ProcessVerification | null) => {
    const cfg = overrideConfig ?? config;
    const pv = overrideVerification !== undefined ? overrideVerification : processVerification;
    if (images.length === 0) { setErrorMessage('Upload at least one image.'); return; }
    setStep('analyzing');
    setErrorMessage('');
    const fileName = images[0]?.name ?? 'weld-image.jpg';
    const payload = buildInspectionPayload(cfg, images, calibration, fileName, pv);
    window.setTimeout(async () => {
      const { data, error } = await supabase.from('weld_inspections').insert(payload).select('*').maybeSingle();
      if (error || !data) {
        setErrorMessage('Inspection complete. History could not be updated.');
        setActiveInspection({ ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Inspection);
      } else {
        const saved = data as Inspection;
        setHistory((cur) => [saved, ...cur]);
        setActiveInspection(saved);
      }
      setStep('results');
    }, 1400);
  };

  const handleSign = async (signature: Signature) => {
    if (!activeInspection) return;
    const updated = { ...activeInspection, signature, locked: true };
    setActiveInspection(updated);
    await supabase.from('weld_inspections').update({ signature, locked: true }).eq('id', activeInspection.id);
    setHistory((cur) => cur.map((i) => (i.id === activeInspection.id ? updated : i)));
  };

  const handleServiceAssessment = async (assessment: ServiceContextAssessment) => {
    if (!activeInspection) return;
    const updated = { ...activeInspection, service_context: assessment };
    setActiveInspection(updated);
    await supabase.from('weld_inspections').update({ service_context: assessment }).eq('id', activeInspection.id);
    setHistory((cur) => cur.map((i) => (i.id === activeInspection.id ? updated : i)));
  };

  const resetInspection = () => {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setCalibration(null);
    setActiveInspection(null);
    setConfig(defaultConfig);
    setErrorMessage('');
    setProcessVerification(null);
    setStep('home');
  };

  const selectHistory = (inspection: Inspection) => {
    setActiveInspection(inspection);
    setStep('results');
    setHistoryOpen(false);
  };

  const clearHistory = async () => {
    const { error } = await supabase.from('weld_inspections').delete().neq('id', 'placeholder');
    if (error) {
      setErrorMessage('Could not clear history.');
    } else {
      setHistory([]);
      setHistoryCleared(true);
      setErrorMessage('');
    }
    setConfirmClear(false);
  };

  const showHeader = step !== 'home';

  return (
    <div className="app-shell min-h-screen overflow-hidden bg-[#0A0A0A] text-[#F5F5F5]">
      {showHeader && (
        <header className="border-b border-[#333333] bg-[#0A0A0A]">
          <div className="site-width mx-auto flex min-h-[72px] max-w-[1440px] flex-wrap items-center justify-between gap-4 overflow-hidden px-5 py-4 sm:px-8 lg:px-12">
            <button className="flex max-w-full items-center gap-3 text-left" onClick={resetInspection} type="button">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#CC0000] text-white"><ShieldCheck size={20} /></span>
              <span className="max-w-full text-lg font-semibold tracking-[0.18em]">BLACKARC</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#2A2A2A] px-3 py-2 text-sm text-[#F5F5F5] transition hover:border-[#666666]" type="button" onClick={() => setHistoryOpen((o) => !o)}>
                <History size={16} /> History <ChevronDown size={15} className={historyOpen ? 'rotate-180 transition' : 'transition'} />
              </button>
            </div>
          </div>
        </header>
      )}

      {step === 'home' && (
        <div key="home" className="fade-page">
          <HomePage
            onStart={() => setStep('config')}
            onShowModelPerformance={() => setStep('model-performance')}
          />
        </div>
      )}

      {showHeader && (
        <main className="site-width mx-auto min-h-[calc(100vh-140px)] max-w-[1440px] overflow-hidden px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          {historyOpen && (
            <section className="mx-auto mb-8 max-w-[720px] overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414] p-5 sm:p-6">
              <div className="mb-4 flex max-w-full items-center justify-between gap-3">
                <div className="flex max-w-full items-center gap-3"><History size={18} className="shrink-0 text-[#FFC107]" /><h2 className="max-w-full text-lg font-semibold">Inspection history</h2></div>
                {history.length > 0 && !confirmClear && (
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#660000] px-3 py-1.5 text-xs text-[#FF1A1A] transition hover:bg-[#2D0000]" type="button" onClick={() => setConfirmClear(true)}>
                    <Trash2 size={14} /> Clear history
                  </button>
                )}
                {confirmClear && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#FF1A1A]">Are you sure you want to clear all history? This action cannot be undone.</span>
                    <button className="rounded-lg bg-[#CC0000] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#FF1A1A]" type="button" onClick={clearHistory}>Yes, delete</button>
                    <button className="rounded-lg border border-[#2A2A2A] px-3 py-1.5 text-xs text-[#F5F5F5] transition hover:border-[#666666]" type="button" onClick={() => setConfirmClear(false)}>Cancel</button>
                  </div>
                )}
              </div>
              {isLoadingHistory ? <p className="max-w-full text-sm text-[#888888]">Loading history</p>
                : history.length === 0 ? (
                  <div className="flex max-w-full items-center gap-3 py-2">
                    {historyCleared ? <><CheckCircle2 size={18} className="shrink-0 text-emerald-400" /><span className="max-w-full text-sm text-emerald-400">History cleared</span></> : <span className="max-w-full text-sm text-[#888888]">No inspections yet</span>}
                  </div>
                ) : <div className="grid max-w-full grid-cols-1 gap-2 overflow-hidden">{history.map((insp) => (
                    <button className="flex max-w-full items-center justify-between gap-4 rounded-lg border border-transparent px-3 py-3 text-left transition hover:border-[#333333] hover:bg-[#1c1c1c]" type="button" key={insp.id} onClick={() => selectHistory(insp)}>
                      <span className="min-w-0 max-w-[70%]">
                        <span className="block max-w-full truncate text-sm text-[#F5F5F5]" title={insp.file_name}>{insp.file_name}</span>
                        <span className="mt-1 block max-w-full text-xs text-[#888888]">{insp.process_code} · {insp.standard} · {formatDate(insp.created_at)}</span>
                      </span>
                      <span className="score-width max-w-full text-right text-sm font-semibold text-[#FFC107]">{formatScore(Number(insp.overall_score))}</span>
                    </button>
                  ))}</div>}
            </section>
          )}

          <div key={step} className="fade-page">
            {step === 'config' && <ConfigPanel config={config} onChange={setConfig} onSubmit={() => setStep('upload')} onShowModelPerformance={() => setStep('model-performance')} />}
            {step === 'model-performance' && <ModelPerformance onClose={() => setStep('config')} />}
            {step === 'upload' && (
              <UploadPanel
                images={images}
                onImagesChange={setImages}
                calibration={calibration}
                onCalibrationChange={setCalibration}
                onAnalyze={(overrideVerification) => runAnalysis(undefined, overrideVerification)}
                processName={config.processName}
                processCode={config.processCode}
                processVerification={processVerification}
                onVerificationChange={setProcessVerification}
                onUsePredictedProcess={(predictedCode) => {
                  const p = processes.find((x) => x.code === predictedCode);
                  if (!p) return;
                  const newConfig = { ...config, processCode: predictedCode, processName: p.name };
                  setConfig(newConfig);
                  setProcessVerification(null);
                  runAnalysis(newConfig, null);
                }}
              />
            )}
            {step === 'analyzing' && (
              <section className="mx-auto grid min-h-[calc(100vh-240px)] max-w-[1080px] grid-cols-1 items-center gap-8 overflow-hidden py-8 lg:grid-cols-2">
                <div className="max-w-full overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414] p-3">
                  {images[0] ? <img className="aspect-[4/3] max-w-full overflow-hidden rounded-xl object-cover" src={images[0].url} alt="Under analysis" /> : <div className="grid aspect-[4/3] max-w-full place-items-center rounded-xl bg-[#0A0A0A] text-[#888888]">No image</div>}
                </div>
                <div className="max-w-full">
                  <p className="mb-3 max-w-full text-xs uppercase tracking-[0.18em] text-[#888888]">Selected process</p>
                  <h1 className="max-w-[520px] text-2xl font-semibold leading-tight sm:text-3xl">{config.processName}</h1>
                  <div className="mt-6 flex max-w-full items-center gap-3 text-[#FFC107]"><LoaderCircle className="shrink-0 animate-spin" size={20} /><span className="max-w-full text-sm font-semibold uppercase tracking-[0.16em]">Analyzing image</span></div>
                  <p className="mt-4 max-w-[480px] break-words text-sm leading-6 text-[#888888]">Running process-specific checks, defect detection, and standards compliance against {config.standard}.</p>
                </div>
              </section>
            )}
            {step === 'results' && activeInspection && (
              <>
                <ResultsPanel inspection={activeInspection} onReset={resetInspection} onSign={handleSign} welderHistory={welderHistory} />
                <ServiceContextPanel inspection={activeInspection} onAssessment={handleServiceAssessment} />
              </>
            )}
          </div>

          {errorMessage && <p className="mx-auto mt-6 max-w-[720px] break-words rounded-lg border border-[#660000] bg-[#2D0000] p-4 text-sm text-[#FF1A1A]">{errorMessage}</p>}
        </main>
      )}

      {showHeader && (
        <footer className="site-width mx-auto max-w-[1440px] overflow-hidden border-t border-[#333333] px-5 py-5 text-center text-xs text-[#888888] sm:px-8 lg:px-12">
          <span className="mx-auto block max-w-full">Blackarc · Inspection record</span>
        </footer>
      )}
    </div>
  );
}

export default App;
