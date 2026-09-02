import { useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, ImagePlus, Ruler, X } from 'lucide-react';
import type { Calibration, ImageItem, ProcessVerification } from '@/lib/inspection';
import { predictWeldProcess } from '@/lib/inspection';

type Props = {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  calibration: Calibration | null;
  onCalibrationChange: (calibration: Calibration | null) => void;
  onAnalyze: (overrideVerification?: ProcessVerification | null) => void;
  processName: string;
  processCode: string;
  processVerification: ProcessVerification | null;
  onVerificationChange: (v: ProcessVerification | null) => void;
  onUsePredictedProcess: (predictedCode: string) => void;
};

export default function UploadPanel({
  images,
  onImagesChange,
  calibration,
  onCalibrationChange,
  onAnalyze,
  processName,
  processCode,
  processVerification,
  onVerificationChange,
  onUsePredictedProcess,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [mmInput, setMmInput] = useState('');

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const newImages = [...images, { id: crypto.randomUUID(), name: file.name, url, width: img.naturalWidth, height: img.naturalHeight }];
      onImagesChange(newImages);
      const prediction = predictWeldProcess(newImages[0], processCode);
      onVerificationChange({ prediction, overridden: false, overriddenAt: null });
    };
    img.src = url;
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter((i) => i.id !== id));
    setPoints([]);
    onCalibrationChange(null);
    setCalibrating(false);
    onVerificationChange(null);
  };

  const onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!calibrating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPoints = [...points, { x, y }];
    if (newPoints.length === 2) {
      const dist = Math.hypot(newPoints[0].x - newPoints[1].x, newPoints[1].y - newPoints[1].y);
      setPoints(newPoints);
      setCalibrating(false);
      if (mmInput && Number(mmInput) > 0) {
        applyCalibration(dist, Number(mmInput));
      }
    } else {
      setPoints(newPoints);
    }
  };

  const applyCalibration = (pixelDist: number, mm: number) => {
    onCalibrationChange({
      pixelDistance: Number(pixelDist.toFixed(2)),
      mmDistance: mm,
      pixelsPerMm: Number((pixelDist / mm).toFixed(2)),
      warning: null,
    });
  };

  const startCalibration = () => {
    setPoints([]);
    setCalibrating(true);
    setMmInput('');
  };

  const cancelCalibration = () => {
    setCalibrating(false);
    setPoints([]);
    setMmInput('');
  };

  const confirmCalibration = () => {
    if (points.length === 2 && mmInput && Number(mmInput) > 0) {
      const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      applyCalibration(dist, Number(mmInput));
    }
  };

  const handleOverride = () => {
    if (!processVerification) return;
    const overridden = { ...processVerification, overridden: true, overriddenAt: new Date().toISOString() };
    onVerificationChange(overridden);
    onAnalyze(overridden);
  };

  const isMismatch = processVerification && !processVerification.prediction.matchesSelected && !processVerification.overridden;
  const canAnalyze = images.length > 0 && (!processVerification || processVerification.prediction.matchesSelected || processVerification.overridden);

  return (
    <section className="mx-auto max-w-[960px] overflow-hidden py-4 sm:py-8">
      <div className="mb-7 max-w-full">
        <p className="mb-3 max-w-full text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">Image acquisition</p>
        <h1 className="max-w-[620px] text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">Upload weld images</h1>
        <p className="mt-3 max-w-[620px] break-words text-sm leading-6 text-[#888888]">Process: {processName}. Upload one or more images of the same weld joint for comparative analysis. Calibrate scale for accurate measurements.</p>
      </div>

      {images.length === 0 ? (
        <div
          className={`grid w-full max-w-full overflow-hidden rounded-2xl border border-dashed p-2 transition ${isDragging ? 'border-[#FF1A1A] bg-[#2D0000]' : 'border-[#666666] bg-[#141414]'}`}
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files); }}
        >
          <button className="grid min-h-[200px] max-w-full place-items-center rounded-xl border border-[#2A2A2A] px-6 py-10 transition hover:bg-[#1c1c1c]" type="button" onClick={() => inputRef.current?.click()}>
            <span className="max-w-full text-center">
              <ImagePlus className="mx-auto mb-4 text-[#FFC107]" size={28} />
              <span className="block max-w-full text-lg font-medium">Drop image here or browse</span>
              <span className="mt-2 block max-w-full text-sm text-[#888888]">JPG, PNG, or WEBP</span>
            </span>
          </button>
        </div>
      ) : (
        <div className="max-w-full overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414] p-4">
          {images.map((img) => (
            <div key={img.id} className="max-w-full">
              <div className="relative max-w-full overflow-hidden rounded-xl bg-[#0A0A0A]">
                <img className="h-auto max-h-[420px] w-full max-w-full object-contain" src={img.url} alt={img.name} onClick={onImageClick} style={{ cursor: calibrating ? 'crosshair' : 'default' }} />
                {points.map((p, i) => (
                  <span key={i} className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#FF1A1A]" style={{ left: p.x, top: p.y }} />
                ))}
                <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-[#0A0A0A]/80 text-[#F5F5F5] transition hover:text-[#FF1A1A]" type="button" onClick={() => removeImage(img.id)} aria-label="Remove image">
                  <X size={16} />
                </button>
                {processVerification && (
                  <div className="absolute left-3 top-3 flex max-w-[calc(100%-64px)] flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${processVerification.prediction.matchesSelected ? 'border border-emerald-800 bg-emerald-950/90 text-emerald-400' : 'border border-[#660000] bg-[#2D0000]/90 text-[#FF1A1A]'}`}>
                      {processVerification.prediction.matchesSelected ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      Predicted: {processVerification.prediction.predictedName} ({processVerification.prediction.confidence}%)
                    </span>
                    {processVerification.overridden && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#664D00] bg-[#2D2600]/90 px-3 py-1.5 text-xs font-semibold text-[#FFC107] backdrop-blur">
                        Override active
                      </span>
                    )}
                  </div>
                )}
              </div>

              {processVerification && processVerification.prediction.matchesSelected && !processVerification.overridden && (
                <div className="mt-3 flex max-w-full items-center gap-2 rounded-lg border border-emerald-900 bg-emerald-950 p-3 text-sm text-emerald-400">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span className="max-w-full">Process verified: {processName}</span>
                </div>
              )}

              {isMismatch && (
                <div className="mt-3 overflow-hidden rounded-lg border border-[#660000] bg-[#2D0000]">
                  <div className="flex max-w-full items-start gap-3 p-4">
                    <AlertTriangle className="mt-0.5 shrink-0 text-[#FF1A1A]" size={18} />
                    <div className="max-w-full">
                      <p className="max-w-full break-words text-sm font-semibold text-[#FF1A1A]">IMAGE MISMATCH</p>
                      <p className="mt-1 max-w-full break-words text-sm text-[#F5F5F5]">The uploaded image appears to be {processVerification.prediction.predictedName}, but you selected {processName}. Please verify the process selection or upload the correct image.</p>
                      <div className="mt-3 flex max-w-full flex-wrap gap-3">
                        <button className="inline-flex items-center gap-2 rounded-lg bg-[#FFC107] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#FFD54F]" type="button" onClick={() => onUsePredictedProcess(processVerification.prediction.predictedCode)}>
          Use predicted process ({processVerification.prediction.predictedName}) and analyze
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#FF1A1A]" type="button" onClick={handleOverride}>
          Keep my selection and analyze
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2 text-xs text-[#F5F5F5] transition hover:border-[#666666]" type="button" onClick={() => inputRef.current?.click()}>
          Upload different image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3 flex max-w-full flex-wrap items-center justify-between gap-3">
                <span className="max-w-[60%] truncate text-sm text-[#F5F5F5]" title={img.name}>{img.name}</span>
                <div className="flex max-w-full items-center gap-2">
                  {calibrating ? (
                    <>
                      <input type="number" step="0.1" min={0} placeholder="mm" className="h-9 w-20 max-w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-[#F5F5F5] outline-none focus:border-[#FFC107]" value={mmInput} onChange={(e) => setMmInput(e.target.value)} />
                      <button className="inline-flex items-center gap-1 rounded-lg bg-[#FFC107] px-3 py-2 text-xs font-semibold text-black transition hover:bg-[#FFD54F]" type="button" onClick={confirmCalibration} disabled={points.length < 2 || !mmInput}>Confirm</button>
                      <button className="inline-flex items-center gap-1 rounded-lg border border-[#2A2A2A] px-3 py-2 text-xs text-[#F5F5F5] transition hover:border-[#666666]" type="button" onClick={cancelCalibration}>Cancel</button>
                    </>
                  ) : (
                    <button className="inline-flex items-center gap-1 rounded-lg border border-[#2A2A2A] px-3 py-2 text-xs text-[#F5F5F5] transition hover:border-[#FFC107]" type="button" onClick={startCalibration}>
                      <Ruler size={14} /> {calibration ? 'Re-calibrate' : 'Calibrate scale'}
                    </button>
                  )}
                </div>
              </div>
              {calibrating && (
                <p className="mt-2 max-w-full break-words text-xs text-[#FFC107]">{points.length < 2 ? `Click two points on the image. ${points.length}/2 selected.` : 'Enter the actual distance in mm and confirm.'}</p>
              )}
              {calibration && !calibrating && (
                <p className="mt-2 max-w-full break-words text-xs text-emerald-400">Scale calibrated: {calibration.pixelsPerMm} px/mm ({calibration.mmDistance} mm reference).</p>
              )}
              {!calibration && !calibrating && (
                <p className="mt-2 max-w-full break-words text-xs text-[#FFC107]">Scale uncalibrated — measurements are estimated.</p>
              )}
            </div>
          ))}
          <div className="mt-4 flex max-w-full items-center justify-between gap-3">
            <button className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2.5 text-sm text-[#F5F5F5] transition hover:border-[#666666]" type="button" onClick={() => inputRef.current?.click()}>
              <ImagePlus size={16} /> Add image
            </button>
            <button className="inline-flex max-w-full items-center gap-2 rounded-lg bg-[#CC0000] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FF1A1A] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => onAnalyze()} disabled={!canAnalyze}>
              Run analysis
            </button>
          </div>
        </div>
      )}

      <input ref={inputRef} className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }} />
    </section>
  );
}
