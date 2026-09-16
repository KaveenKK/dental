import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  Lock,
  CheckCircle2,
  Download,
  Scissors,
  Droplet,
  ScanFace,
  Play,
  Menu,
  X,
} from 'lucide-react';

type Track = 'men' | 'women';
type Step = 'landing' | 'upload' | 'scanning' | 'teaser' | 'results';

type Fix = {
  title: string;
  category: string;
  icon: ReactNode;
  description: string;
};

type TrackData = {
  shape: string;
  highlight: string;
  score: string;
  fixes: Fix[];
};

const MOCK_DATA: Record<Track, TrackData> = {
  men: {
    shape: 'Diamond',
    highlight: 'Strong angular jawline, prominent cheekbones.',
    score: '92/100',
    fixes: [
      {
        title: 'Textured Fringe Haircut',
        category: 'Hair',
        icon: <Scissors className="w-5 h-5 text-emerald-400" />,
        description:
          'Add volume on top with a textured fringe to balance the narrow forehead and complement the angular jaw.',
      },
      {
        title: 'Defined Stubble Line',
        category: 'Grooming',
        icon: <ScanFace className="w-5 h-5 text-emerald-400" />,
        description:
          'Keep a 3mm stubble but lower the cheek line slightly to emphasize the natural cheekbone structure.',
      },
      {
        title: 'Hydrating Routine + Exfoliation',
        category: 'Skincare',
        icon: <Droplet className="w-5 h-5 text-emerald-400" />,
        description:
          'Use a gentle BHA exfoliant 2x a week to clear pores, followed by a hyaluronic acid moisturizer to keep the skin tight and glowing.',
      },
    ],
  },
  women: {
    shape: 'Oval',
    highlight: 'Symmetrical proportions, smooth contour.',
    score: '95/100',
    fixes: [
      {
        title: 'Curtain Bangs with Layers',
        category: 'Hair',
        icon: <Scissors className="w-5 h-5 text-emerald-400" />,
        description:
          'Face-framing layers and curtain bangs will highlight your cheekbones and add dynamic volume to your profile.',
      },
      {
        title: 'Soft Arched Brows',
        category: 'Framing',
        icon: <ScanFace className="w-5 h-5 text-emerald-400" />,
        description:
          'Maintain a softer arch rather than a sharp angle to complement the natural curves of an oval face shape.',
      },
      {
        title: 'Vitamin C + Dewy SPF',
        category: 'Skincare',
        icon: <Droplet className="w-5 h-5 text-emerald-400" />,
        description:
          'Incorporate a Vitamin C serum in the morning followed by a dewy-finish sunscreen to maximize your natural glow.',
      },
    ],
  },
};

const SCAN_MESSAGES = [
  'Detecting facial proportions...',
  'Evaluating face shape & symmetry...',
  'Analyzing grooming & framing potential...',
  'Generating personalized action plan...',
];

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
];

export default function RefineAI() {
  const [step, setStep] = useState<Step>('landing');
  const [track, setTrack] = useState<Track | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [scanMessageIdx, setScanMessageIdx] = useState(0);
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 'landing') return;
    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== 'scanning') return;
    const interval = setInterval(() => {
      setScanMessageIdx((prev) => {
        if (prev >= SCAN_MESSAGES.length - 1) {
          clearInterval(interval);
          setTimeout(() => setStep('teaser'), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [step]);

  const handleSelectTrack = (selectedTrack: Track) => {
    setTrack(selectedTrack);
    setStep('upload');
    window.scrollTo(0, 0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(typeof event.target?.result === 'string' ? event.target.result : null);
      setStep('scanning');
      setScanMessageIdx(0);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulatePayment = () => {
    setStep('results');
    window.scrollTo(0, 0);
  };

  const renderLanding = () => (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      {BG_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === bgImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={src}
            alt="Background Model"
            className="object-cover w-full h-full object-center md:object-right bg-zoom-anim"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent md:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col justify-center min-h-[85vh] px-6 max-w-7xl mx-auto pt-20 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-6 text-sm font-medium tracking-wide text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Join 50,000+ people
          </div>

          <h1 className="mb-6 text-5xl font-light tracking-tight text-white md:text-7xl leading-tight">
            Improve your looks <br className="hidden md:block" />
            without surgery
          </h1>

          <p className="max-w-md mb-10 text-lg font-light leading-relaxed text-slate-300">
            Get your personalized facial analysis and transformation plan based on your unique features.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => handleSelectTrack('men')}
              className="px-8 py-4 font-medium text-slate-900 transition-all bg-white rounded-full hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start my plan (Men)
            </button>
            <button
              onClick={() => handleSelectTrack('women')}
              className="px-8 py-4 font-medium text-white transition-all border rounded-full border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Start my plan (Women)
            </button>
          </div>

          <div className="flex items-center gap-2 mt-12 text-sm text-slate-400/80">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Data Retention: Photos analyzed securely and deleted.</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 max-w-sm p-6 border bg-slate-900/60 backdrop-blur-xl border-white/10 rounded-3xl animate-in slide-in-from-bottom-8 duration-1000 delay-500 hidden md:block">
        <p className="text-sm font-light text-slate-300 mb-4">
          We use cookies to keep things working, improve your report experience and remember your preferences. You control
          everything but the essentials. Read our <span className="underline cursor-pointer hover:text-white">Privacy Policy</span>.
        </p>
        <div className="flex items-center justify-between">
          <button className="text-sm text-slate-400 hover:text-white transition-colors">Settings →</button>
          <button className="px-6 py-2 text-sm font-medium text-slate-900 bg-white rounded-full hover:bg-slate-100">Okay</button>
        </div>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-12 bg-slate-950 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="w-full max-w-md">
        <button
          onClick={() => setStep('landing')}
          className="flex items-center gap-2 mb-8 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back
        </button>

        <h2 className="mb-3 text-3xl font-light text-white">Upload your photo</h2>
        <p className="mb-8 font-light text-slate-400">
          For best results, look straight into the camera with a neutral expression.
        </p>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center w-full p-12 transition-all border border-dashed cursor-pointer bg-slate-900/50 border-slate-700 rounded-3xl hover:border-emerald-500/50 hover:bg-slate-800/50 group"
        >
          <div className="p-4 mb-4 transition-colors rounded-full bg-slate-800 group-hover:bg-slate-700">
            <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="font-medium text-white">Tap to upload a selfie</p>
          <p className="mt-2 text-sm text-slate-500">or drag and drop</p>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>

        <div className="p-6 mt-8 border rounded-2xl bg-slate-900/30 border-slate-800/50">
          <h3 className="mb-4 text-sm font-medium text-white uppercase tracking-wider">Guidelines</h3>
          <ul className="space-y-3 text-sm font-light text-slate-400">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Good, even lighting (facing a window is best).
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hair pulled back from your face.
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No heavy makeup or filters.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderScanning = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-12 bg-slate-950 animate-in zoom-in-95 duration-500">
      <div className="w-full max-w-sm">
        <div className="relative overflow-hidden border border-slate-800 rounded-3xl aspect-[3/4] bg-slate-900 shadow-2xl">
          {imageSrc ? (
            <img src={imageSrc} alt="Analyzing" className="object-cover w-full h-full opacity-60 mix-blend-luminosity" />
          ) : (
            <div className="w-full h-full bg-slate-800 animate-pulse" />
          )}

          <div className="absolute inset-x-0 top-0 h-1 shadow-[0_0_15px_rgba(16,185,129,0.8)] bg-emerald-400 scan-line" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="mt-10 text-center h-16">
          <p className="text-lg font-light text-emerald-400 animate-pulse">{SCAN_MESSAGES[scanMessageIdx]}</p>
          <div className="w-full max-w-[200px] h-1 mx-auto mt-6 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full transition-all duration-300 bg-emerald-500"
              style={{ width: `${((scanMessageIdx + 1) / SCAN_MESSAGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeaser = () => {
    const data = MOCK_DATA[track || 'men'];

    return (
      <div className="w-full max-w-md px-6 py-12 mx-auto pt-24 min-h-screen bg-slate-950 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="mb-8 text-3xl font-light text-center text-white">Your Analysis is Ready</h2>

        <div className="p-6 mb-8 border bg-slate-900/50 border-slate-800/50 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <span className="font-light text-slate-400">Detected Face Shape</span>
            <span className="font-medium text-emerald-400">{data.shape}</span>
          </div>
          <div className="flex items-center justify-between mb-5">
            <span className="font-light text-slate-400">Key Highlight</span>
            <span className="text-right text-white max-w-[60%] text-sm font-light">{data.highlight}</span>
          </div>
          <div className="flex items-center justify-between pt-5 border-t border-slate-800">
            <span className="font-light text-slate-400">Glow-Up Potential</span>
            <span className="font-medium text-white">{data.score}</span>
          </div>
        </div>

        <div className="relative p-6 overflow-hidden border border-slate-800 rounded-3xl bg-slate-900/30">
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl bg-slate-950/70">
            <Lock className="w-8 h-8 mb-4 text-emerald-500/80" />
            <h3 className="mb-3 text-xl font-medium text-white">Unlock Full Action Report</h3>
            <p className="mb-8 text-sm font-light leading-relaxed text-slate-300">
              Get your top 3 high-impact fixes, exact barber/stylist guide, and custom skincare routine.
            </p>
            <button
              onClick={handleSimulatePayment}
              className="w-full py-4 font-medium text-slate-900 transition-all rounded-full bg-white hover:bg-slate-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              Unlock Now — £4.99
            </button>
            <div className="flex items-center gap-2 mt-5 text-xs text-slate-500 font-light">
              <ShieldCheck className="w-4 h-4" /> Secure 1-click checkout
            </div>
          </div>

          <div className="opacity-30 blur-[6px] pointer-events-none select-none">
            <h4 className="mb-5 font-medium text-white">Top 3 High-Impact Fixes</h4>
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-2xl bg-slate-800/50 border-slate-700/50">
                  <div className="w-12 h-12 rounded-xl bg-slate-700" />
                  <div className="flex-1 py-1 space-y-3">
                    <div className="w-3/4 h-3 rounded bg-slate-700" />
                    <div className="w-full h-2 rounded bg-slate-700/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const data = MOCK_DATA[track || 'men'];

    return (
      <div className="w-full max-w-2xl px-6 py-12 mx-auto pt-24 pb-32 min-h-screen bg-slate-950 animate-in fade-in duration-700">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-light text-white">Your Blueprint</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-full text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white">
            <Download className="w-4 h-4" /> Save
          </button>
        </div>

        <div className="flex items-center gap-6 mb-12 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/50">
          <div className="w-24 h-24 overflow-hidden rounded-full bg-slate-800 shrink-0 ring-4 ring-slate-950">
            {imageSrc ? (
              <img src={imageSrc} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-slate-500">
                <ScanFace className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center space-y-1">
            <p className="text-sm font-light text-slate-400">
              Face Shape: <span className="font-medium text-white ml-2">{data.shape}</span>
            </p>
            <p className="text-sm font-light text-slate-400">
              Potential: <span className="font-medium text-emerald-400 ml-2">{data.score}</span>
            </p>
          </div>
        </div>

        <h3 className="mb-6 text-xl font-light text-white">Top 3 High-Impact Fixes</h3>
        <div className="space-y-6">
          {data.fixes.map((fix, idx) => (
            <div key={idx} className="p-6 transition-colors border rounded-3xl bg-slate-900/30 border-slate-800/50 hover:bg-slate-900/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-slate-800/80 ring-1 ring-white/5">{fix.icon}</div>
                <div className="pt-1">
                  <span className="block mb-1 text-xs font-medium tracking-wider uppercase text-slate-500">{fix.category}</span>
                  <h4 className="text-lg font-medium text-white">{fix.title}</h4>
                </div>
              </div>
              <p className="pl-16 text-sm font-light leading-relaxed text-slate-400">{fix.description}</p>
            </div>
          ))}
        </div>

        <div className="p-8 mt-12 border text-center rounded-3xl bg-emerald-950/20 border-emerald-900/30">
          <h3 className="mb-3 text-lg font-medium text-emerald-400">Ready to start?</h3>
          <p className="mb-8 text-sm font-light text-slate-300">
            Take these recommendations to your stylist or barber to begin your transformation.
          </p>
          <button className="w-full max-w-sm py-4 text-sm font-medium text-slate-900 transition-transform bg-emerald-400 rounded-full hover:bg-emerald-300 hover:scale-[1.02] active:scale-[0.98]">
            Share with Stylist
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes scan {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
        .scan-line {
          animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .bg-zoom-anim {
          animation: subtle-zoom 20s infinite alternate ease-in-out;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>

      <div className="min-h-screen font-sans bg-slate-950 text-slate-200 selection:bg-emerald-500/30 selection:text-white">
        <nav
          className={`absolute top-0 z-50 w-full px-6 py-6 ${
            step !== 'landing' ? 'sticky bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50' : ''
          }`}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                setStep('landing');
                window.scrollTo(0, 0);
              }}
            >
              <div className="flex items-center justify-center w-10 h-10 transition-transform rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:scale-105 group-hover:bg-white/20">
                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <span className="text-xl font-medium tracking-tight text-white">Refine</span>
            </div>

            {step === 'landing' && (
              <div className="hidden md:flex items-center gap-8 text-sm font-light text-slate-300">
                <a href="#" className="hover:text-white transition-colors">
                  Why Refine
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  How it works
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </div>
            )}

            <div className="flex items-center gap-4">
              {step === 'landing' && (
                <button className="hidden md:block text-sm font-light text-slate-300 hover:text-white transition-colors">Login</button>
              )}
              <button className="md:hidden p-2 text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden animate-in fade-in duration-300">
            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-2xl font-light text-white">
              Why Refine
            </a>
            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-2xl font-light text-white">
              How it works
            </a>
            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-2xl font-light text-white">
              FAQ
            </a>
            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-2xl font-light text-slate-400 mt-4">
              Login
            </a>
          </div>
        )}

        <main className="w-full">
          {step === 'landing' && renderLanding()}
          {step === 'upload' && renderUpload()}
          {step === 'scanning' && renderScanning()}
          {step === 'teaser' && renderTeaser()}
          {step === 'results' && renderResults()}
        </main>
      </div>
    </>
  );
}
