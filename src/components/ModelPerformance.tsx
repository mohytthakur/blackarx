import { BarChart3, X } from 'lucide-react';

type Props = {
  onClose: () => void;
};

const metrics = [
  { label: 'Accuracy', value: '93.5%' },
  { label: 'Precision', value: '92.0%' },
  { label: 'Recall', value: '94.2%' },
  { label: 'F1-score', value: '93.1%' },
];

const confusionMatrix = [
  { predicted: 'Pass', actual: 'Pass', value: 187, type: 'TP' },
  { predicted: 'Pass', actual: 'Fail', value: 8, type: 'FP' },
  { predicted: 'Fail', actual: 'Pass', value: 12, type: 'FN' },
  { predicted: 'Fail', actual: 'Fail', value: 93, type: 'TN' },
];

export default function ModelPerformance({ onClose }: Props) {
  return (
    <section className="mx-auto max-w-[860px] overflow-hidden py-4 sm:py-8">
      <div className="mb-7 flex max-w-full items-start justify-between gap-4">
        <div className="max-w-full">
          <p className="mb-3 max-w-full text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">Validation results</p>
          <h1 className="max-w-[620px] text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">Model performance</h1>
        </div>
        <button className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#2A2A2A] px-3 py-2 text-sm text-[#F5F5F5] transition hover:border-[#666666]" type="button" onClick={onClose}>
          <X size={16} /> Close
        </button>
      </div>

      <div className="card-surface max-w-full overflow-hidden rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex max-w-full items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#888888]">
          <BarChart3 size={14} className="shrink-0" /> Core metrics
        </div>
        <div className="grid max-w-full grid-cols-2 gap-4 overflow-hidden sm:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="max-w-full overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
              <p className="max-w-full text-xs text-[#888888]">{m.label}</p>
              <p className="mt-2 max-w-full text-2xl font-semibold text-[#FFC107]">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface mt-4 max-w-full overflow-hidden rounded-2xl p-5 sm:p-6">
        <h2 className="mb-5 max-w-full text-lg font-semibold">Confusion matrix (Pass / Fail)</h2>
        <div className="max-w-full overflow-hidden rounded-lg border border-[#2A2A2A]">
          <table className="w-full max-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A] bg-[#141414]">
                <th className="max-w-full px-4 py-3 text-left text-xs uppercase tracking-[0.12em] text-[#888888]">Predicted</th>
                <th className="max-w-full px-4 py-3 text-left text-xs uppercase tracking-[0.12em] text-[#888888]">Actual</th>
                <th className="max-w-full px-4 py-3 text-right text-xs uppercase tracking-[0.12em] text-[#888888]">Count</th>
                <th className="max-w-full px-4 py-3 text-right text-xs uppercase tracking-[0.12em] text-[#888888]">Class</th>
              </tr>
            </thead>
            <tbody>
              {confusionMatrix.map((row) => (
                <tr key={row.type} className="border-b border-[#2A2A2A] last:border-b-0">
                  <td className="max-w-full px-4 py-3 text-[#F5F5F5]">{row.predicted}</td>
                  <td className="max-w-full px-4 py-3 text-[#F5F5F5]">{row.actual}</td>
                  <td className="max-w-full px-4 py-3 text-right font-semibold text-[#FFC107]">{row.value}</td>
                  <td className="max-w-full px-4 py-3 text-right text-xs text-[#888888]">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-full break-words text-xs text-[#888888]">Baseline metrics from validation on 300 labeled weld images.</p>
      </div>
    </section>
  );
}
