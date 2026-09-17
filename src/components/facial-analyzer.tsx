import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  ChevronRight,
  Crosshair,
  Download,
  Eye,
  Layers,
  Maximize2,
  RotateCcw,
  ScanFace,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react';

type Stage = 'idle' | 'scanning' | 'workspace';
type WorkspaceTab = 'overview' | 'skin' | 'structure' | 'grooming';

const SCAN_STEPS = [
  'Verifying photo quality and capture angle',
  'Creating facial landmark map',
  'Measuring facial thirds, fifths and symmetry',
  'Reviewing skin, structure and framing',
  'Preparing your improvement workspace',
];

const zones = [
  { name: 'Upper third', detail: 'Forehead · brow line', state: 'Measured' },
  { name: 'Midface', detail: 'Eyes · cheek support', state: 'Measured' },
  { name: 'Lower third', detail: 'Jaw · chin balance', state: 'Measured' },
  { name: 'Skin surface', detail: 'Tone · texture · clarity', state: 'Mapped' },
];

const plans: Record<WorkspaceTab, { label: string; title: string; description: string; score: string; items: string[] }> = {
  overview: {
    label: 'MASTER PLAN',
    title: 'Your refinement sequence',
    description: 'A prioritized workspace for the highest-visibility improvements first.',
    score: '03 focus areas',
    items: ['Build skin consistency', 'Refine facial framing', 'Review lower-face definition'],
  },
  skin: {
    label: 'SKIN LAYER',
    title: 'Clarity and texture',
    description: 'Build a simple routine around barrier support, daily protection and measured actives.',
    score: 'Routine draft',
    items: ['AM: antioxidant + SPF', 'PM: cleanse + hydrate', 'Weekly: gradual exfoliation'],
  },
  structure: {
    label: 'STRUCTURE LAYER',
    title: 'Balance and definition',
    description: 'Review proportions as a whole before considering any structural change.',
    score: '3 zones mapped',
    items: ['Assess vertical thirds', 'Compare jaw-to-cheek balance', 'Discuss options with a clinician'],
  },
  grooming: {
    label: 'FRAMING LAYER',
    title: 'Style that supports shape',
    description: 'Use hair, facial hair and brow framing to make the strongest features more intentional.',
    score: '2 visual studies',
    items: ['Frame the cheek line', 'Choose a shape-supporting cut', 'Create consistent detail work'],
  },
};

function ProgressRow({ label, active, complete }: { label: string; active: boolean; complete: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] transition-colors ${
          complete
            ? 'border-brand bg-brand text-primary-foreground'
            : active
              ? 'border-brand bg-brand/10 text-brand-strong'
              : 'border-border text-muted-foreground'
        }`}
      >
        {complete ? <Check className="h-3 w-3" /> : active ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" /> : ''}
      </span>
      <span className={active || complete ? 'text-sm text-foreground' : 'text-sm text-muted-foreground'}>{label}</span>
    </div>
  );
}

function CanvasPhoto({ image, scanning }: { image: string; scanning: boolean }) {
  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-white/10 bg-[#10272c] sm:min-h-[560px]">
      <img src={image} alt="Facial analysis workspace canvas" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,20,23,0.62)_100%)]" />

      {scanning ? (
        <>
          <div className="scan-line absolute inset-x-0 z-20 h-px bg-[#a7f3d0] shadow-[0_0_18px_4px_rgba(167,243,208,0.8)]" />
          <div className="absolute inset-0 bg-brand/10" />
        </>
      ) : (
        <>
          <div className="absolute left-[33%] top-[26%] h-[48%] w-[34%] rounded-[45%] border border-[#a7f3d0]/80 shadow-[0_0_0_1px_rgba(167,243,208,0.14),0_0_24px_rgba(57,138,128,0.3)]" />
          {[
            ['left-[41%] top-[42%]', 'Eye axis'],
            ['right-[41%] top-[42%]', 'Eye axis'],
            ['left-[46%] top-[54%]', 'Nasal center'],
            ['left-[44%] top-[66%]', 'Oral plane'],
            ['left-[37%] top-[76%]', 'Jaw contour'],
          ].map(([position, label]) => (
            <span key={label} className={`absolute ${position} flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#ddfff2]`}>
              <i className="h-1.5 w-1.5 rounded-full bg-[#a7f3d0] shadow-[0_0_10px_rgba(167,243,208,1)]" />
              <span className="rounded bg-[#0d262b]/75 px-1.5 py-1 backdrop-blur">{label}</span>
            </span>
          ))}
          <div className="absolute inset-x-[18%] top-1/2 border-t border-dashed border-[#a7f3d0]/70" />
          <div className="absolute bottom-[20%] left-1/2 h-[56%] border-l border-dashed border-[#a7f3d0]/70" />
        </>
      )}

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-[#0b2025]/75 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white backdrop-blur">
        <Crosshair className="h-3.5 w-3.5 text-[#a7f3d0]" />
        {scanning ? 'LANDMARK PASS RUNNING' : 'LANDMARK OVERLAY'}
      </div>
      <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#0b2025]/75 px-3 py-2 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-white/80 backdrop-blur">
        SUBJECT 01<br />FRONT / NEUTRAL
      </div>
      <button type="button" aria-label="Expand analysis canvas" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-[#0b2025]/75 text-white/80 backdrop-blur hover:text-white">
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function FacialAnalyzer() {
  const [stage, setStage] = useState<Stage>('idle');
  const [photo, setPhoto] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const inputRef = useRef<HTMLInputElement>(null);
  const currentPlan = plans[activeTab];
  const canvasImage = photo || '/portrait-3.png';

  useEffect(() => {
    if (stage !== 'scanning') return;
    const id = window.setInterval(() => {
      setScanStep((current) => {
        if (current >= SCAN_STEPS.length - 1) {
          window.clearInterval(id);
          window.setTimeout(() => setStage('workspace'), 450);
          return current;
        }
        return current + 1;
      });
    }, 900);
    return () => window.clearInterval(id);
  }, [stage]);

  useEffect(() => () => {
    if (photo?.startsWith('blob:')) URL.revokeObjectURL(photo);
  }, [photo]);

  const beginAnalysis = useCallback((file?: File) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setScanStep(0);
    setActiveTab('overview');
    setStage('scanning');
  }, []);

  const reset = () => {
    setPhoto(null);
    setScanStep(0);
    setStage('idle');
  };

  return (
    <section id="analyze" className="scroll-mt-20 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft/40 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-brand-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            NEVENGI ANALYSIS STUDIO
          </span>
          <h2 className="mt-6 text-balance text-4xl font-medium tracking-tight sm:text-5xl">A workspace, not a quick score.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Upload a front-facing image to open a structured assessment workspace. It separates landmark mapping, visual studies and a practical improvement plan — so every recommendation has context.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-[#17363a] bg-[#0d2025] shadow-[0_30px_80px_-35px_rgba(14,72,76,0.72)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#10282d] px-4 py-3 text-white sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand text-primary-foreground"><ScanFace className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Assessment workspace</p>
                <p className="font-mono text-[9px] tracking-[0.14em] text-white/45">NEVENGI STUDIO / SESSION 01</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-[#a7f3d0] sm:flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#a7f3d0]" />PRIVATE PROCESSING</div>
          </div>

          <div className="grid xl:grid-cols-[176px_minmax(0,1fr)_270px]">
            <aside className="border-b border-white/10 bg-[#0a1a1f] p-4 xl:border-b-0 xl:border-r">
              <p className="px-2 font-mono text-[9px] tracking-[0.18em] text-white/40">WORKSPACE</p>
              <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-1">
                {([
                  ['overview', Layers, 'Overview'],
                  ['skin', Sparkles, 'Skin layer'],
                  ['structure', ScanFace, 'Structure'],
                  ['grooming', Wand2, 'Framing'],
                ] as const).map(([tab, Icon, label]) => (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)} disabled={stage !== 'workspace'} className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${activeTab === tab && stage === 'workspace' ? 'bg-brand text-primary-foreground' : 'text-white/65 hover:bg-white/8 hover:text-white'}`}>
                    <Icon className="h-4 w-4" /><span>{label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 hidden border-t border-white/10 pt-4 xl:block">
                <p className="font-mono text-[9px] tracking-[0.18em] text-white/40">TOOLS</p>
                <div className="mt-3 space-y-2 text-xs text-white/60">
                  <span className="flex items-center gap-2"><Eye className="h-3.5 w-3.5" /> Landmark overlay</span>
                  <span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" /> Projection studies</span>
                </div>
              </div>
            </aside>

            <div className="min-w-0 p-4 sm:p-5">
              <CanvasPhoto image={canvasImage} scanning={stage === 'scanning'} />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-white/55"><Camera className="h-3.5 w-3.5" />{photo ? 'SOURCE PHOTO ATTACHED' : 'DEMO CANVAS — ADD A PHOTO TO BEGIN'}</div>
                {stage === 'workspace' && <button type="button" className="inline-flex items-center gap-2 self-start rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 transition-colors hover:bg-white/10"><Download className="h-3.5 w-3.5" />Export workspace</button>}
              </div>
            </div>

            <aside className="border-t border-white/10 bg-[#0a1a1f] p-5 text-white xl:border-l xl:border-t-0">
              {stage === 'idle' && (
                <div className="flex h-full flex-col">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-[#a7f3d0]">NEW ASSESSMENT</p>
                  <h3 className="mt-3 text-xl font-medium tracking-tight">Start with a source image.</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">No scores or recommendations appear until the capture has been processed. Use a neutral, front-facing photo in even light.</p>
                  <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => beginAnalysis(event.target.files?.[0])} />
                  <button type="button" onClick={() => inputRef.current?.click()} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#a7f3d0] px-4 py-3 text-sm font-medium text-[#092126] transition-transform hover:scale-[1.01]"><Upload className="h-4 w-4" />Add source photo</button>
                  <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-white/55"><ShieldCheck className="mb-2 h-4 w-4 text-[#a7f3d0]" />Your photo stays in this browser session. This prototype demonstrates the workspace experience; it does not provide medical advice.</div>
                </div>
              )}

              {stage === 'scanning' && (
                <div className="flex h-full flex-col">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-[#a7f3d0]">PROCESSING SESSION</p>
                  <h3 className="mt-3 text-xl font-medium tracking-tight">Building the workspace.</h3>
                  <div className="mt-7 space-y-4">{SCAN_STEPS.map((step, index) => <ProgressRow key={step} label={step} active={index === scanStep} complete={index < scanStep} />)}</div>
                  <div className="mt-auto pt-8"><div className="flex justify-between font-mono text-[10px] text-white/45"><span>ASSESSMENT PASS</span><span>{Math.round(((scanStep + 1) / SCAN_STEPS.length) * 100)}%</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#a7f3d0] transition-all duration-500" style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }} /></div></div>
                </div>
              )}

              {stage === 'workspace' && (
                <div className="flex h-full flex-col">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-[#a7f3d0]">{currentPlan.label}</p>
                  <h3 className="mt-3 text-xl font-medium tracking-tight">{currentPlan.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{currentPlan.description}</p>
                  <div className="mt-5 rounded-xl border border-[#a7f3d0]/20 bg-[#a7f3d0]/8 p-3"><p className="font-mono text-[10px] tracking-[0.13em] text-[#a7f3d0]">{currentPlan.score.toUpperCase()}</p><ul className="mt-3 space-y-2.5">{currentPlan.items.map((item) => <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-white/75"><ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a7f3d0]" />{item}</li>)}</ul></div>
                  <div className="mt-5"><p className="font-mono text-[9px] tracking-[0.18em] text-white/40">VISUAL STUDIES</p><div className="mt-3 grid grid-cols-2 gap-2"><Study image={canvasImage} label="Skin clarity" styleClass="brightness-110 saturate-[0.9]" /><Study image={canvasImage} label="Framing" styleClass="contrast-110 saturate-75" /></div><p className="mt-2 text-[10px] leading-relaxed text-white/40">Concept previews are visual directions only, not predicted treatment outcomes.</p></div>
                  {activeTab === 'skin' && <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3"><p className="font-mono text-[9px] tracking-[0.16em] text-[#a7f3d0]">ROUTINE BOARD</p><div className="mt-2 space-y-1.5 text-xs text-white/65"><p>AM · Antioxidant serum + broad-spectrum SPF</p><p>PM · Gentle cleanser + barrier moisturiser</p><p>Weekly · Introduce a compatible active gradually</p></div></div>}
                  <button type="button" onClick={reset} className="mt-auto inline-flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-white/55 transition-colors hover:text-white"><RotateCcw className="h-3.5 w-3.5" />Start a new workspace</button>
                </div>
              )}
            </aside>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-center sm:grid-cols-3">
          {['Landmark and proportion mapping', 'Layered visual-study board', 'Action plan with products and routines'].map((item) => <p key={item} className="rounded-full border border-border bg-card px-4 py-3 text-sm text-muted-foreground">{item}</p>)}
        </div>
      </div>
    </section>
  );
}

function Study({ image, label, styleClass }: { image: string; label: string; styleClass: string }) {
  return <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-[#10282d]"><img src={image} alt={`${label} concept preview`} className={`h-full w-full object-cover opacity-75 ${styleClass}`} /><span className="absolute inset-x-1.5 bottom-1.5 rounded bg-[#092126]/85 px-1.5 py-1 text-center font-mono text-[8px] uppercase tracking-[0.08em] text-white/80">{label}</span></div>;
}
