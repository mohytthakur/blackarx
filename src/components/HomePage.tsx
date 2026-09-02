import { BarChart3, ChevronDown, ShieldCheck } from 'lucide-react';

type Props = {
  onStart: () => void;
  onShowModelPerformance: () => void;
};

const metrics = [
  { label: 'Accuracy', value: '93.5%' },
  { label: 'Precision', value: '92.0%' },
  { label: 'Recall', value: '94.2%' },
  { label: 'F1-score', value: '93.1%' },
];

const confusion = [
  { predicted: 'Pass', actual: 'Pass', value: 187, cls: 'TP' },
  { predicted: 'Pass', actual: 'Fail', value: 8, cls: 'FP' },
  { predicted: 'Fail', actual: 'Pass', value: 12, cls: 'FN' },
  { predicted: 'Fail', actual: 'Fail', value: 93, cls: 'TN' },
];

export default function HomePage({ onStart, onShowModelPerformance }: Props) {
  return (
    <div className="snap-container">
      {/* Section 1: Hero / Objective */}
      <section className="snap-section px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#CC0000] text-white"><ShieldCheck size={22} /></span>
            <span className="text-xl font-semibold tracking-[0.18em]">BLACKARC</span>
          </div>
          <h1 className="text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[3rem] lg:text-[3.5rem]" style={{ textShadow: '0 0 30px rgba(204,0,0,0.15)' }}>
            Automated weld grading.
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-lg text-[#888888] sm:text-xl lg:text-2xl">
            <span className="font-medium text-[#F5F5F5]">Defect detection.</span>
            <span className="font-medium text-[#FFC107]">Industry standards.</span>
            <span className="font-medium">Computer vision.</span>
            <span className="font-medium">Rule-based analysis.</span>
          </div>
          <p className="mt-6 max-w-[640px] break-words text-base leading-7 text-[#AAAAAA]">
            Blackarc is an automated visual inspection system that grades welding images against industry standards using computer vision and rule-based defect analysis.
          </p>
          <ul className="mt-4 max-w-[640px] space-y-1.5 text-base leading-7 text-[#AAAAAA]">
            <li>· Welding process recognition</li>
            <li>· Multi-defect detection (porosity, cracks, undercut, spatter, etc.)</li>
            <li>· Grading based on AWS / ISO / ASME criteria</li>
            <li>· Optional service condition assessment</li>
          </ul>
          <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#CC0000] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#FF1A1A] sm:w-auto" type="button" onClick={onStart}>
            Start inspection
          </button>
          <div className="mt-12 flex items-center gap-2 text-xs text-[#555555]">
            <ChevronDown size={14} className="animate-bounce" /> Scroll to explore
          </div>
        </div>
      </section>

      {/* Section 2: Process selection / Upload entry */}
      <section className="snap-section px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFC107]">How it works</p>
          <h2 className="text-[1.5rem] font-bold uppercase tracking-[-0.02em] text-white sm:text-[2rem]" style={{ textShadow: '0 0 20px rgba(255,193,7,0.1)' }}>
            Configure. Upload. Analyze.
          </h2>
          <div className="mt-8 grid max-w-full grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <span className="text-2xl font-bold text-[#FFC107]">01</span>
              <p className="mt-2 text-base leading-7 text-[#AAAAAA]">Select welding process, standard, joint, and material parameters.</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#FFC107]">02</span>
              <p className="mt-2 text-base leading-7 text-[#AAAAAA]">Upload weld images. Calibrate scale for accurate measurements.</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#FFC107]">03</span>
              <p className="mt-2 text-base leading-7 text-[#AAAAAA]">Receive graded report with defect analysis, confidence, and certification readiness.</p>
            </div>
          </div>
          <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#CC0000] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#FF1A1A] sm:w-auto" type="button" onClick={onStart}>
            Begin configuration
          </button>
        </div>
      </section>

      {/* Section 3: Features overview */}
      <section className="snap-section px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFC107]">Capabilities</p>
          <h2 className="text-[1.5rem] font-bold uppercase tracking-[-0.02em] text-white sm:text-[2rem]" style={{ textShadow: '0 0 20px rgba(255,193,7,0.1)' }}>
            What Blackarc detects
          </h2>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-lg text-[#F5F5F5]">
            <span>Porosity &amp; blowholes</span>
            <span className="text-[#FFC107]">Linear crack indications</span>
            <span>Undercut at weld toe</span>
            <span className="text-[#FFC107]">Spatter analysis</span>
            <span>HAZ thermal assessment</span>
            <span className="text-[#FFC107]">Fatigue life impact</span>
            <span>DPT recommendation</span>
            <span className="text-[#FFC107]">Certification readiness</span>
          </div>
          <p className="mt-6 max-w-[560px] break-words text-base leading-7 text-[#AAAAAA]">
            Grading based on AWS, ISO, and ASME acceptance criteria. Each defect includes location, severity, confidence, and corrective action guidance.
          </p>
        </div>
      </section>

      {/* Section 4: Model Performance */}
      <section className="snap-section px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-[#FFC107]" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFC107]">Model performance</p>
          </div>
          <h2 className="text-[1.5rem] font-bold uppercase tracking-[-0.02em] text-white sm:text-[2rem]" style={{ textShadow: '0 0 20px rgba(255,193,7,0.1)' }}>
            Validation metrics
          </h2>

          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="text-sm text-[#AAAAAA]">{m.label}</p>
                <p className="mt-1 text-3xl font-bold text-[#FFC107]">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-full overflow-hidden">
            <p className="mb-3 text-base text-[#F5F5F5]">Confusion matrix (Pass / Fail)</p>
            <table className="w-full max-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#333333]">
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.12em] text-[#888888]">Predicted</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.12em] text-[#888888]">Actual</th>
                  <th className="px-3 py-2 text-right text-xs uppercase tracking-[0.12em] text-[#888888]">Count</th>
                  <th className="px-3 py-2 text-right text-xs uppercase tracking-[0.12em] text-[#888888]">Class</th>
                </tr>
              </thead>
              <tbody>
                {confusion.map((row) => (
                  <tr key={row.cls} className="border-b border-[#1c1c1c] last:border-b-0">
                    <td className="px-3 py-2.5 text-[#F5F5F5]">{row.predicted}</td>
                    <td className="px-3 py-2.5 text-[#F5F5F5]">{row.actual}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-[#FFC107]">{row.value}</td>
                    <td className="px-3 py-2.5 text-right text-xs text-[#888888]">{row.cls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 break-words text-sm text-[#AAAAAA]">Baseline metrics from validation on 300 labeled weld images.</p>

          <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#2A2A2A] px-6 py-3.5 text-base font-semibold text-[#F5F5F5] transition hover:border-[#FFC107] sm:w-auto" type="button" onClick={onShowModelPerformance}>
            <BarChart3 size={18} /> Detailed model performance
          </button>
        </div>
      </section>
    </div>
  );
}
