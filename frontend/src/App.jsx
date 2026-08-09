import React, { useEffect, useRef, useState, useMemo, useCallback, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Shield, ScanLine, Zap, ArrowRight, ChevronRight, ChevronLeft,
  Activity, Eye, Layers, CheckCircle, Menu, X,
  UploadCloud, FileText, Image as ImageIcon, Video, Terminal,
  AlertTriangle, Lock, User, Mic, Waves, BarChart2, Home,
  Radio, Play, Pause, LogOut, CreditCard, FolderOpen,
  Star, Download, Key, ArrowUpRight, ChevronDown, Info
} from 'lucide-react'

const Spline = React.lazy(() => import('@splinetool/react-spline'))
if (typeof window !== 'undefined') { gsap.registerPlugin(ScrollTrigger) }

// ─────────────────────────────────────────────────────────────
// API URL configuration
// VITE_API_URL must be set in frontend/.env for local or cloud deployment.
// No automatic fallback to cloud — local mode requires the backend running locally.
// ─────────────────────────────────────────────────────────────
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') || 'http://127.0.0.1:8000'

// Whether we are in a "self-hosted" context (pointing to localhost)
const IS_LOCAL = API_URL.includes('localhost') || API_URL.includes('127.0.0.1')

function Navbar({ onNavigate }) {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links = ['Technology', 'Protocol', 'Pricing', 'Contact']
  return (
    <nav ref={navRef} className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 flex items-center justify-between gap-8 px-6 py-3 rounded-full transition-all duration-500 ${scrolled ? 'bg-[#F5F3EE]/70 backdrop-blur-xl border border-ink/10 shadow-lg w-[min(700px,90vw)]' : 'bg-transparent w-[min(800px,90vw)]'}`}>
      <span className={`font-sans font-bold text-sm tracking-widest uppercase transition-colors duration-500 ${scrolled ? 'text-ink' : 'text-offwhite'}`}>VN<span className="text-signal">.</span></span>
      <div className="hidden md:flex items-center gap-6">
        {links.map(l => (<a key={l} href={`#${l.toLowerCase()}`} className={`link-hover font-sans text-xs font-medium tracking-widest uppercase transition-colors duration-500 ${scrolled ? 'text-ink/70' : 'text-offwhite/70'}`}>{l}</a>))}
      </div>
      <button onClick={() => onNavigate('login')} className={`btn-magnetic hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-500 ${scrolled ? 'bg-ink text-offwhite' : 'bg-signal text-offwhite'}`}>
        <span className="btn-slide bg-signal rounded-full" />
        <span className="relative z-10 flex items-center gap-2">Verify <ChevronRight size={12} /></span>
      </button>
      <button className={`md:hidden transition-colors ${scrolled ? 'text-ink' : 'text-offwhite'}`} onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-offwhite/95 backdrop-blur-xl border border-ink/10 rounded-3xl p-6 flex flex-col gap-4 md:hidden shadow-xl">
          {links.map(l => (<a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="font-sans text-sm font-medium tracking-widest uppercase text-ink/70 hover:text-signal transition-colors">{l}</a>))}
          <button className="btn-magnetic flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-signal text-offwhite text-xs font-mono font-bold tracking-wider uppercase mt-2" onClick={() => { setOpen(false); onNavigate('login') }}>
            <span className="btn-slide bg-ink rounded-full" /><span className="relative z-10">Verify Content</span>
          </button>
        </div>
      )}
    </nav>
  )
}

function Hero({ onNavigate }) {
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = contentRef.current.querySelectorAll('[data-hero]')
      gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.3 })
    }, heroRef)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={heroRef} className="relative h-[100dvh] overflow-hidden flex items-end bg-ink" id="hero">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-ink" />}>
          <Spline scene="https://prod.spline.design/Sr2GDgUMbvUcPZWH/scene.splinecode" />
        </Suspense>
      </div>
      <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-tr from-ink via-ink/80 to-transparent" />
      <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
      <div className="absolute inset-0 z-[2] pointer-events-none grid-overlay opacity-30" />
      <div ref={contentRef} className="relative z-10 w-full px-8 pb-16 md:px-16 md:pb-20 max-w-5xl pointer-events-none">
        <div data-hero className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-signal" />
          <span className="font-mono text-xs text-signal tracking-[0.25em] uppercase">Inference Engine v11.0</span>
        </div>
        <h1 className="mb-2 leading-none select-none">
          <span data-hero className="block font-sans font-bold text-offwhite text-[clamp(2.2rem,7vw,6rem)] tracking-tight">Real or Synthetic.</span>
          <span data-hero className="block font-drama text-signal text-[clamp(3.5rem,12vw,10rem)] leading-none">We Know.</span>
        </h1>
        {/* Accurate privacy claim — reflects actual deployment mode */}
        <p data-hero className="mt-4 font-sans text-offwhite/60 text-base md:text-lg max-w-xl leading-relaxed font-light select-none">
          {IS_LOCAL
            ? 'Privacy-focused inference with self-hosted local deployment. Supports text, image, audio, and video analysis — models run on your own hardware.'
            : 'Multimodal AI detection engine for synthetic and manipulated media — text, image, audio, and video. Privacy-focused with self-hosted local deployment support.'}
        </p>
        <div data-hero className="flex flex-wrap gap-4 mt-8 pointer-events-auto">
          <button onClick={() => onNavigate('login')} className="btn-magnetic flex items-center gap-3 px-7 py-4 bg-signal text-offwhite rounded-full font-mono text-sm font-bold uppercase tracking-wider group">
            <span className="btn-slide bg-ink rounded-full" />
            <span className="relative z-10 flex items-center gap-2">Verify Content Authenticity</span>
          </button>
          <a href="#technology" className="btn-magnetic flex items-center gap-3 px-7 py-4 bg-transparent border border-offwhite/30 text-offwhite rounded-full font-sans text-sm font-medium uppercase tracking-wider hover:border-signal/60 transition-colors">
            <span className="relative z-10">See How It Works</span>
          </a>
        </div>
        <div data-hero className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-offwhite/10 select-none">
          {[
            { label: 'Modalities Covered', val: '4' },
            { label: 'Avg. Analysis Time', val: '<2s' },
            { label: 'Models', val: '3' },
          ].map(m => (
            <div key={m.label}>
              <div className="font-mono text-2xl font-bold text-signal">{m.val}</div>
              <div className="font-sans text-xs text-offwhite/40 uppercase tracking-wider mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ShufflerCard() {
  const labels = [
    { title: 'SigLIP Image Detection', sub: 'AI-vs-human SigLIP classifier — trained on real photos vs AI-generated images', icon: <Eye size={16} /> },
    { title: 'ViT Face Deepfake', sub: 'Face-aware ViT deepfake classifier — runs on face crops when faces are detected', icon: <Eye size={16} /> },
    { title: 'RoBERTa Text Detector', sub: 'Transformer model trained to detect LLM-generated text (GPT-4, Claude, ChatGPT)', icon: <FileText size={16} /> },
    { title: 'Frame-Level Video Analysis', sub: 'Sparse frame sampling with blur detection — SigLIP applied to individual frames', icon: <Layers size={16} /> },
  ]
  const [stack, setStack] = useState([...labels])
  useEffect(() => {
    const id = setInterval(() => {
      setStack(prev => { const next = [...prev]; const last = next.pop(); next.unshift(last); return next })
    }, 2800)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="artifact-card card-noise p-7 flex flex-col h-full" id="technology">
      <div className="flex items-center gap-2 mb-6">
        <ScanLine size={14} className="text-signal" />
        <span className="font-mono text-xs text-muted tracking-wider uppercase">Detection Models</span>
      </div>
      <div className="relative flex-1 min-h-[180px]">
        {stack.map((item, i) => (
          <div key={item.title} className="absolute w-full transition-all duration-700" style={{ top: `${i * 14}px`, zIndex: stack.length - i, opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.25, transform: `scale(${1 - i * 0.04}) translateY(${i * 2}px)` }}>
            <div className={`bg-offwhite border rounded-2xl p-5 ${i === 0 ? 'border-signal/30 shadow-md' : 'border-ink/8'}`}>
              <div className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider mb-2 ${i === 0 ? 'text-signal' : 'text-muted'}`}>{item.icon}{item.title}</div>
              <p className="font-sans text-ink/60 text-sm leading-snug">{item.sub}</p>
              {i === 0 && (<div className="flex items-center gap-2 mt-3 pt-3 border-t border-ink/8"><CheckCircle size={12} className="text-signal" /><span className="font-mono text-[10px] text-signal uppercase tracking-wider">Active</span></div>)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6">
        <h3 className="font-sans font-bold text-lg text-ink leading-tight">4-Modality Detection</h3>
        <p className="font-sans text-ink/50 text-sm mt-1">Text, image, audio, and video — analyzed in one pipeline.</p>
      </div>
    </div>
  )
}

function TypewriterCard() {
  const messages = [
    '> INIT: veritas_neural_engine v11.0',
    '> LOADING: PyTorch models from cache...',
    '> PRIMARY: SigLIP ai-vs-human model ready',
    '> SECONDARY: ViT face deepfake detector ready',
    '> FACE DETECT: OpenCV Haar cascade active',
    '> EXIF CHECK: Metadata presence verified',
    '> AUDIO: MFCC signal analysis (librosa)',
    '> TEXT: RoBERTa classifier ready',
    '> CALIBRATION: Sigmoid score calibration applied',
    '> VERDICT: Evidence-based classification complete',
  ]
  const [lines, setLines] = useState([''])
  const [msgIdx, setMsgIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const containerRef = useRef(null)
  useEffect(() => {
    const currentMsg = messages[msgIdx]
    if (charIdx < currentMsg.length) {
      const t = setTimeout(() => { setLines(prev => { const next = [...prev]; next[next.length - 1] = currentMsg.slice(0, charIdx + 1); return next }); setCharIdx(c => c + 1) }, 28)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => { const nextIdx = (msgIdx + 1) % messages.length; setMsgIdx(nextIdx); setCharIdx(0); setLines(prev => { const next = [...prev, '']; return next.length > 8 ? next.slice(next.length - 8) : next }) }, 600)
      return () => clearTimeout(t)
    }
  }, [charIdx, msgIdx])
  useEffect(() => { if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight }, [lines])
  return (
    <div className="artifact-card card-noise p-7 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><div className="pulse-dot" /><span className="font-mono text-xs text-muted tracking-wider uppercase">Live Terminal</span></div>
        <span className="font-mono text-[10px] text-muted/60 uppercase tracking-widest">Inference Logs</span>
      </div>
      <div ref={containerRef} className="flex-1 bg-ink rounded-2xl p-5 overflow-hidden font-mono text-xs leading-relaxed" style={{ minHeight: '190px', maxHeight: '220px', overflowY: 'auto' }}>
        {lines.map((line, i) => (<div key={i} className={`${i === lines.length - 1 ? 'text-signal' : 'text-offwhite/40'} mb-0.5`}>{line}{i === lines.length - 1 && <span className="cursor-blink" />}</div>))}
      </div>
      <div className="mt-auto pt-6">
        <h3 className="font-sans font-bold text-lg text-ink leading-tight">Local PyTorch Inference</h3>
        <p className="font-sans text-ink/50 text-sm mt-1">Models download once. Run locally for full privacy — or connect to a self-hosted deployment.</p>
      </div>
    </div>
  )
}

function PrivacyCard() {
  const [activeIdx, setActiveIdx] = useState(0)
  useEffect(() => { const id = setInterval(() => setActiveIdx(prev => (prev + 1) % 4), 1400); return () => clearInterval(id) }, [])
  const items = [
    { label: 'Self-hosted local deployment supported', status: 'SUPPORTED' },
    { label: 'No third-party AI API calls', status: 'CONFIRMED' },
    { label: 'Models cached locally after first run', status: 'ACTIVE' },
    { label: 'Local mode: fully offline after setup', status: 'VERIFIED' },
  ]
  return (
    <div className="artifact-card card-noise p-7 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6"><Lock size={14} className="text-signal" /><span className="font-mono text-xs text-muted tracking-wider uppercase">Privacy Features</span></div>
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-400 ${activeIdx === i ? 'bg-signal/10 border-signal/30' : 'bg-ink/5 border-ink/5'}`}>
            <span className={`font-mono text-[10px] uppercase tracking-widest ${activeIdx === i ? 'text-signal' : 'text-ink/50'}`}>{item.label}</span>
            <span className={`font-mono text-[10px] font-bold ${activeIdx === i ? 'text-signal' : 'text-ink/30'}`}>{item.status}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6">
        <h3 className="font-sans font-bold text-lg text-ink leading-tight">Privacy-Focused Inference</h3>
        <p className="font-sans text-ink/50 text-sm mt-1">Self-host the backend locally for full data sovereignty. No files sent to third-party APIs.</p>
      </div>
    </div>
  )
}

function Features() {
  const sectionRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={sectionRef} className="section-pad bg-offwhite" id="technology">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3"><div className="w-6 h-px bg-signal" /><span className="font-mono text-xs text-signal tracking-[0.2em] uppercase">How It Works</span></div>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-ink leading-tight tracking-tight">Core<br /><span className="font-drama text-signal">Capabilities</span></h2>
          </div>
          <p className="font-sans text-ink/50 text-sm max-w-xs leading-relaxed">Four detection modalities powered by PyTorch models — deployable locally for full privacy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="feature-card"><ShufflerCard /></div>
          <div className="feature-card"><TypewriterCard /></div>
          <div className="feature-card"><PrivacyCard /></div>
        </div>
      </div>
    </section>
  )
}

function Philosophy() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = textRef.current.querySelectorAll('[data-word]')
      gsap.fromTo(words, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={sectionRef} className="relative overflow-hidden section-pad bg-ink">
      <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=1600&q=60" alt="" className="w-full h-full object-cover opacity-10" /></div>
      <div className="absolute inset-0 z-[1]" style={{ backgroundImage: 'linear-gradient(rgba(245,243,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,243,238,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div ref={textRef} className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10"><div className="w-6 h-px bg-signal" /><span className="font-mono text-xs text-signal/80 tracking-[0.2em] uppercase">Manifesto</span></div>
        <p className="font-sans text-offwhite/40 text-lg md:text-xl mb-6 leading-relaxed">
          {['Most', 'deepfake', 'detectors', 'send', 'your', 'files', 'to:'].map((w, i) => <span key={i} data-word className="inline-block mr-[0.3em]">{w}</span>)}
          <span data-word className="inline-block mr-[0.3em] text-offwhite/40 italic">third-party cloud servers.</span>
        </p>
        <div className="mt-4">
          <p className="font-sans text-offwhite text-xl md:text-2xl leading-relaxed">{['We', 'support:'].map((w, i) => <span key={i} data-word className="inline-block mr-[0.3em]">{w}</span>)}</p>
          <p className="font-drama text-signal text-[clamp(2.5rem,7vw,6rem)] leading-none mt-2">
            {['self-hosted,', 'local,'].map((w, i) => <span key={i} data-word className="inline-block mr-[0.25em]">{w}</span>)}<br />
            {['private', 'inference.'].map((w, i) => <span key={i} data-word className="inline-block mr-[0.25em]">{w}</span>)}
          </p>
        </div>
        <div className="mt-16 pt-10 border-t border-offwhite/10 flex flex-col md:flex-row gap-12">
          {[
            { n: '4', label: 'Detection modalities: text, image, audio, and video' },
            { n: '3', label: 'Pretrained transformer models (SigLIP, ViT, RoBERTa)' },
            { n: '~800MB', label: 'Total model size, downloaded once on first run' },
          ].map(s => (
            <div key={s.n} data-word className="inline-block">
              <div className="font-mono text-4xl font-bold text-signal">{s.n}</div>
              <div className="font-sans text-offwhite/40 text-xs mt-2 max-w-[180px] leading-relaxed">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Protocol() {
  const sectionRef = useRef(null)
  const card1 = useRef(null), card2 = useRef(null), card3 = useRef(null)
  const ring1 = useRef(null), ring2 = useRef(null), scanLine = useRef(null)
  const nodes = useRef([])
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = [card1.current, card2.current, card3.current]
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          ScrollTrigger.create({ trigger: card, start: 'top top', endTrigger: cards[i + 1], end: 'top top', pin: true, pinSpacing: false })
          gsap.to(card, { scale: 0.9, filter: 'blur(15px)', opacity: 0, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true } })
        }
      })
      gsap.to(ring1.current, { rotation: 360, duration: 20, repeat: -1, ease: 'linear' })
      gsap.to(ring2.current, { rotation: -360, duration: 25, repeat: -1, ease: 'linear' })
      gsap.to(scanLine.current, { y: '100%', duration: 2, repeat: -1, yoyo: true, ease: 'power1.inOut' })
      nodes.current.forEach(node => { if (node) gsap.to(node, { opacity: 1, duration: "random(0.1, 0.5)", repeat: -1, yoyo: true, delay: "random(0, 2)" }) })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={sectionRef} className="relative w-full" id="protocol">
      <div ref={card1} className="w-full h-[100dvh] bg-paper flex items-center justify-center p-8 relative z-10 will-change-transform border-b border-ink/10">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <span className="font-mono text-sm tracking-widest text-signal">STEP 01</span>
            <h2 className="font-drama text-[clamp(4rem,10vw,8rem)] leading-none text-signal mt-2 mb-6">Upload.</h2>
            <p className="font-sans text-xl max-w-md leading-relaxed text-ink/70">Drop any file into the dashboard — a photo, video, audio clip, or text document. Veritas Neural accepts the most common media formats used on phones and social platforms.</p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <div ref={ring1} className="absolute inset-0 border-[1px] border-dashed border-signal rounded-full opacity-40"></div>
              <div ref={ring2} className="absolute inset-8 border-[2px] border-dotted border-ink rounded-full opacity-20"></div>
              <div className="absolute inset-16 border border-signal/30 rounded-full flex items-center justify-center bg-signal/5 backdrop-blur-sm"><Shield size={48} className="text-signal" /></div>
            </div>
          </div>
        </div>
      </div>
      <div ref={card2} className="w-full h-[100dvh] bg-ink flex items-center justify-center p-8 relative z-20 will-change-transform shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <span className="font-mono text-sm tracking-widest text-signal">STEP 02</span>
            <h2 className="font-drama text-[clamp(4rem,10vw,8rem)] leading-none text-offwhite mt-2 mb-6">Analyze.</h2>
            <p className="font-sans text-xl max-w-md leading-relaxed text-offwhite/60">Local PyTorch models run on your hardware — a SigLIP image classifier, a ViT face deepfake detector, and a RoBERTa text classifier all working together.</p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="relative w-80 h-80 border border-offwhite/10 rounded-3xl overflow-hidden bg-[#0a0a0a]">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-4">
                {[...Array(64)].map((_, i) => <div key={i} ref={el => nodes.current[i] = el} className="w-full h-full bg-signal/20 rounded-sm opacity-20"></div>)}
              </div>
              <div ref={scanLine} className="absolute top-0 left-0 w-full h-1 bg-signal shadow-[0_0_20px_#E63B2E] z-10"></div>
            </div>
          </div>
        </div>
      </div>
      <div ref={card3} className="w-full h-[100dvh] bg-signal flex items-center justify-center p-8 relative z-30 will-change-transform shadow-[0_-20px_50px_rgba(230,59,46,0.3)]">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <span className="font-mono text-sm tracking-widest text-ink/60 uppercase">Step 03</span>
            <h2 className="font-drama text-[clamp(4rem,10vw,8rem)] leading-none text-offwhite mt-2 mb-6">Verify.</h2>
            <p className="font-sans text-xl max-w-md leading-relaxed text-offwhite/90">Get a 0–100 AI generation probability, a classification verdict, a transparent score breakdown, and a list of evidence items produced by actual models — all in under two seconds.</p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 bg-offwhite/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-8 bg-offwhite/20 rounded-full animate-pulse"></div>
              <div className="relative z-10 w-32 h-32 bg-offwhite rounded-full flex items-center justify-center text-signal shadow-2xl"><CheckCircle size={64} strokeWidth={1.5} /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const sectionRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pricing-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  const tiers = [
    {
      name: 'Open Source',
      price: 'Free',
      period: '',
      badge: null,
      desc: 'Run it yourself — self-hosted, fully local deployment.',
      features: ['Self-hosted on your machine', 'All 4 modalities included', 'Text, image, audio & video', 'Community support', 'Full source code access'],
      highlight: false,
      cta: 'Get Started',
    },
    {
      name: 'Professional',
      price: 'Coming Soon',
      period: '',
      badge: 'Coming Soon',
      desc: 'For journalists, researchers, and trust & safety teams.',
      features: ['All 4 modalities', 'Priority model updates', 'API access', 'Forensic PDF reports', 'Email support'],
      highlight: true,
      cta: 'Notify Me',
    },
    {
      name: 'Enterprise',
      price: 'Coming Soon',
      period: '',
      badge: 'Coming Soon',
      desc: 'Air-gapped deployments for sensitive organisations.',
      features: ['On-premise installation', 'Custom model fine-tuning', 'SLA guarantee', 'Dedicated engineer', 'SIEM integration'],
      highlight: false,
      cta: 'Contact Us',
    },
  ]
  return (
    <section ref={sectionRef} className="section-pad bg-offwhite" id="pricing">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3"><div className="w-6 h-px bg-signal" /><span className="font-mono text-xs text-signal tracking-[0.2em] uppercase">Pricing</span><div className="w-6 h-px bg-signal" /></div>
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-ink leading-tight tracking-tight">Choose Your<br /><span className="font-drama text-signal">Defense Layer.</span></h2>
          <p className="font-sans text-ink/40 text-sm mt-4">Professional and Enterprise tiers are in development.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {tiers.map(tier => (
            <div key={tier.name} className={`pricing-card flex flex-col rounded-4xl p-8 border transition-all duration-300 relative overflow-hidden ${tier.highlight ? 'bg-ink border-ink shadow-2xl scale-[1.02] md:scale-105' : 'bg-offwhite border-ink/10 hover:border-signal/30'}`}>
              {tier.badge && (
                <div className="absolute top-5 right-5">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-signal/20 text-signal border border-signal/30 px-2 py-0.5 rounded-full">{tier.badge}</span>
                </div>
              )}
              <div className={`font-mono text-xs tracking-widest uppercase mb-4 ${tier.highlight ? 'text-signal' : 'text-muted'}`}>{tier.name}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`font-sans font-bold text-3xl ${tier.highlight ? 'text-offwhite' : 'text-ink'}`}>{tier.price}</span>
                <span className={`font-mono text-sm ${tier.highlight ? 'text-offwhite/40' : 'text-muted'}`}>{tier.period}</span>
              </div>
              <p className={`font-sans text-sm mb-6 leading-relaxed ${tier.highlight ? 'text-offwhite/50' : 'text-ink/50'}`}>{tier.desc}</p>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {tier.features.map(f => (<li key={f} className="flex items-center gap-3"><CheckCircle size={14} className={tier.highlight ? 'text-signal flex-shrink-0' : 'text-ink/30 flex-shrink-0'} /><span className={`font-sans text-sm ${tier.highlight ? 'text-offwhite/70' : 'text-ink/60'}`}>{f}</span></li>))}
              </ul>
              <button
                onClick={() => {
                  if (tier.badge) {
                    // Coming soon — link to contact section
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className={`btn-magnetic flex items-center justify-center gap-2 py-4 rounded-full font-mono text-xs font-bold uppercase tracking-wider mt-auto ${tier.highlight ? 'bg-signal text-offwhite' : 'bg-ink/5 text-ink border border-ink/10 hover:border-signal/40'}`}>
                <span className={`btn-slide rounded-full ${tier.highlight ? 'bg-ink' : 'bg-signal'}`} />
                <span className="relative z-10">{tier.cta}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  // Contact form is a demo — no backend email delivery is configured.
  return (
    <section id="contact" className="section-pad bg-paper">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6"><div className="w-6 h-px bg-signal" /><span className="font-mono text-xs text-signal tracking-[0.2em] uppercase">Get In Touch</span></div>
            <h2 className="font-sans font-bold text-5xl md:text-6xl text-ink leading-tight tracking-tight mb-6">Let's<br /><span className="font-drama text-signal">Talk.</span></h2>
            <p className="font-sans text-ink/50 text-base leading-relaxed max-w-sm mb-10">Reach out for enterprise deployments, research collaborations, or questions about the detection engine.</p>
            <div className="space-y-5">
              {[{ label: 'Project', val: 'Veritas Neural v11.0' }, { label: 'Contact', val: 'hello@veritasneural.ai' }].map(r => (
                <div key={r.label} className="flex items-center justify-between border-b border-ink/8 pb-4">
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{r.label}</span>
                  <span className="font-mono text-xs text-ink">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-ink rounded-[2rem] p-10">
            {/* Demo form notice */}
            <div className="flex items-start gap-3 bg-signal/10 border border-signal/20 rounded-xl p-3 mb-6">
              <Info size={13} className="text-signal flex-shrink-0 mt-0.5" />
              <p className="font-mono text-[10px] text-offwhite/60 leading-relaxed uppercase tracking-widest">
                Demo form — messages are not delivered. To contact us, email <span className="text-signal">hello@veritasneural.ai</span> directly.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div className="space-y-1.5"><label className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest">Name</label><input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="w-full bg-transparent border-b border-offwhite/20 pb-2 font-sans text-sm text-offwhite placeholder:text-offwhite/20 outline-none focus:border-signal transition-colors" /></div>
              <div className="space-y-1.5"><label className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest">Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className="w-full bg-transparent border-b border-offwhite/20 pb-2 font-sans text-sm text-offwhite placeholder:text-offwhite/20 outline-none focus:border-signal transition-colors" /></div>
              <div className="space-y-1.5"><label className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest">Message</label><textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your use case or question..." className="w-full bg-transparent border-b border-offwhite/20 pb-2 font-sans text-sm text-offwhite placeholder:text-offwhite/20 outline-none focus:border-signal resize-none transition-colors leading-relaxed" /></div>
              <button type="button" onClick={() => { window.location.href = `mailto:hello@veritasneural.ai?subject=Veritas Neural Inquiry&body=${encodeURIComponent(form.message)}` }} className="btn-magnetic w-full flex items-center justify-center gap-3 py-4 rounded-full bg-signal text-offwhite font-mono text-sm font-bold uppercase tracking-widest">
                <span className="btn-slide bg-ink rounded-full" />
                <span className="relative z-10 flex items-center gap-2"><Zap size={14} /> Open Email Client</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  // GitHub URL — replace with actual repository URL when published
  const GITHUB_URL = 'https://github.com/1SoulHunter1/veritas-neural-core'
  return (
    <footer className="bg-ink rounded-t-5xl px-8 md:px-16 pt-16 pb-8 mt-0">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-offwhite/10">
          <div className="md:col-span-2">
            <div className="font-sans font-bold text-2xl text-offwhite tracking-tighter mb-3">Veritas Neural<span className="text-signal">.</span></div>
            <p className="font-sans text-offwhite/40 text-sm leading-relaxed max-w-xs">A privacy-focused multimodal detection engine for AI-generated text, images, audio, and video. Self-host for full data sovereignty.</p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest mb-4">Technology</div>
            {['Local Inference', 'Image Detection', 'Audio Analysis', 'Text Detection', 'Video Forensics'].map(l => <a key={l} href="#technology" className="link-hover block font-sans text-sm text-offwhite/50 hover:text-signal mb-2 transition-colors">{l}</a>)}
          </div>
          <div>
            <div className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest mb-4">Project</div>
            {[
              { label: 'About', href: '#technology' },
              { label: 'How It Works', href: '#protocol' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Contact', href: '#contact' },
              { label: 'GitHub', href: GITHUB_URL },
            ].map(l => <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="link-hover block font-sans text-sm text-offwhite/50 hover:text-signal mb-2 transition-colors">{l.label}</a>)}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <div className="flex items-center gap-3"><div className="pulse-dot" /><span className="font-mono text-xs text-offwhite/40 uppercase tracking-widest">System Operational</span></div>
          <div className="font-mono text-xs text-offwhite/20 uppercase tracking-wider">© 2026 Veritas Neural — All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

function LoginView({ onNavigate }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const handleAuth = () => {
    if (loading) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onNavigate('dashboard') }, 1500)
  }
  const handleKey = (e) => { if (e.key === 'Enter') handleAuth() }
  return (
    <div className="h-[100dvh] bg-ink flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
      <button onClick={() => onNavigate('landing')} className="absolute top-6 left-6 flex items-center gap-2 font-mono text-xs text-offwhite/30 hover:text-signal uppercase tracking-wider transition-colors"><Home size={13} /> Home</button>
      <div className="bg-paper rounded-[2rem] p-10 md:p-14 max-w-md w-full mx-4 shadow-2xl relative">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3"><Lock size={11} className="text-signal" /><span className="font-mono text-xs text-signal uppercase tracking-[0.25em]">Access Portal</span></div>
          <h1 className="font-sans text-3xl font-bold text-ink leading-tight">Sign In.</h1>
          <p className="font-mono text-[11px] text-muted mt-2 uppercase tracking-wider">Enter credentials to access the scanner</p>
        </div>
        <div className="space-y-6 mb-8">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted uppercase tracking-widest">Username</label>
            <div className="flex items-center gap-3 border-b border-ink/20 pb-2 focus-within:border-signal transition-colors"><User size={14} className="text-ink/30 flex-shrink-0" /><input type="text" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={handleKey} placeholder="your.username" className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-ink/25 outline-none" /></div>
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted uppercase tracking-widest">Password</label>
            <div className="flex items-center gap-3 border-b border-ink/20 pb-2 focus-within:border-signal transition-colors"><Lock size={14} className="text-ink/30 flex-shrink-0" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} placeholder="••••••••••••" className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-ink/25 outline-none" /></div>
          </div>
        </div>
        <button onClick={handleAuth} disabled={loading} className="btn-magnetic w-full flex items-center justify-center gap-3 py-4 rounded-full bg-ink text-offwhite font-mono text-sm font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-60">
          {!loading && <span className="btn-slide bg-signal rounded-full" />}
          <span className="relative z-10 flex items-center gap-2">{loading ? <><ScanLine size={14} className="animate-pulse" /> Signing in...</> : <><Shield size={14} /> Sign In</>}</span>
        </button>
      </div>
    </div>
  )
}

// Sample archive data — clearly labeled as demo data
const ARCHIVE_ROWS = [
  { id: '0x99a2...', modality: 'Image', verdict: 'SYNTHETIC', conf: '87', anomaly: 'SigLIP classifier — high AI probability', date: '2026-03-16' },
  { id: '0x11b8...', modality: 'Text', verdict: 'AUTHENTIC', conf: '91', anomaly: 'RoBERTa — human-written', date: '2026-03-16' },
  { id: '0xCC41...', modality: 'Audio', verdict: 'UNCERTAIN', conf: '50', anomaly: 'Audio signal analysis only — no deepfake model', date: '2026-03-15' },
  { id: '0x7E2D...', modality: 'Image', verdict: 'SYNTHETIC', conf: '79', anomaly: 'SigLIP high confidence — no EXIF metadata', date: '2026-03-15' },
  { id: '0x5F32...', modality: 'Image', verdict: 'AUTHENTIC', conf: '88', anomaly: 'None significant', date: '2026-03-14' },
]

// ─────────────────────────────────────────────────────────────
// Limitations expandable section
// ─────────────────────────────────────────────────────────────
function LimitationsSection({ limitations }) {
  const [open, setOpen] = useState(false)
  if (!limitations || limitations.length === 0) return null
  return (
    <div className="bg-white/[0.02] border border-signal/20 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info size={13} className="text-signal flex-shrink-0" />
          <span className="font-mono text-[10px] text-signal uppercase tracking-widest">Important Limitations</span>
        </div>
        <ChevronDown size={14} className={`text-signal transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-white/10 p-4 flex flex-col gap-2">
          {limitations.map((l, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-signal/60 flex-shrink-0 mt-1.5" />
              <p className="font-sans text-xs text-offwhite/50 leading-relaxed">{l}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Evidence item renderer
// ─────────────────────────────────────────────────────────────
function EvidenceItem({ item }) {
  const statusColors = {
    analyzed:       'text-green-400 border-green-500/20 bg-green-500/5',
    unavailable:    'text-offwhite/30 border-white/10 bg-white/[0.02]',
    not_applicable: 'text-offwhite/30 border-white/10 bg-white/[0.02]',
    not_available:  'text-offwhite/30 border-white/10 bg-white/[0.02]',
    error:          'text-signal/70 border-signal/20 bg-signal/5',
  }
  const statusLabel = {
    analyzed:       'Analyzed',
    unavailable:    'Unavailable',
    not_applicable: 'N/A',
    not_available:  'Not Available',
    error:          'Error',
  }
  const statusClass = statusColors[item.status] || statusColors.unavailable
  const label = statusLabel[item.status] || item.status

  return (
    <div className={`border rounded-xl p-3 flex flex-col gap-1.5 ${statusClass}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-offwhite/80">{item.name}</span>
        <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusClass}`}>{label}</span>
      </div>
      {item.score !== undefined && (
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.score >= 65 ? 'bg-signal' : 'bg-white/30'}`} style={{ width: `${item.score}%` }} />
          </div>
          <span className={`font-mono text-xs font-bold ${item.score >= 65 ? 'text-signal' : 'text-offwhite/60'}`}>{item.score}%</span>
        </div>
      )}
      {item.ai_probability !== undefined && item.ai_probability !== null && (
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-[9px] text-offwhite/40 uppercase">AI Prob:</span>
          <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.ai_probability >= 65 ? 'bg-signal' : 'bg-white/30'}`} style={{ width: `${item.ai_probability}%` }} />
          </div>
          <span className={`font-mono text-[10px] font-bold ${item.ai_probability >= 65 ? 'text-signal' : 'text-offwhite/60'}`}>{item.ai_probability}%</span>
        </div>
      )}
      {item.classification && (
        <span className="font-sans text-[11px] text-offwhite/60">{item.classification}</span>
      )}
      {item.mfcc_variance !== undefined && item.mfcc_variance !== null && (
        <span className="font-mono text-[10px] text-offwhite/40">MFCC variance: {item.mfcc_variance} | Duration: {item.duration_sec}s</span>
      )}
      {item.frames_analyzed !== undefined && (
        <span className="font-mono text-[10px] text-offwhite/40">
          Frames analyzed: {item.frames_analyzed} / {item.frames_total}
          {item.median_score_pct !== null && ` | Median score: ${item.median_score_pct}%`}
        </span>
      )}
      {item.fields && Object.keys(item.fields).length > 0 && (
        <div className="flex flex-col gap-0.5 mt-1">
          {Object.entries(item.fields).slice(0, 4).map(([k, v]) => (
            <span key={k} className="font-mono text-[9px] text-offwhite/30">{k.replace(/_/g, ' ')}: {v}</span>
          ))}
        </div>
      )}
      {item.note && (
        <p className="font-sans text-[10px] text-offwhite/30 leading-relaxed italic">{item.note}</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Scanner Panel
// ─────────────────────────────────────────────────────────────
function ScannerPanel() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(false)
  const [scanData, setScanData] = useState(null)
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState(null)
  const [textInput, setTextInput] = useState('')
  const [inputMode, setInputMode] = useState('file') // 'file' | 'text'
  const fileRef = useRef(null)
  const intervalRef = useRef(null)

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setErrorMsg(null) } }

  const handleAnalyze = async () => {
    if (analyzing) return
    if (inputMode === 'file' && !file) return
    if (inputMode === 'text' && !textInput.trim()) return

    setAnalyzing(true); setResults(false); setScanData(null); setProgress(0); setErrorMsg(null)
    try {
      const apiUrl = API_URL
      const candidates = [
        apiUrl,
        apiUrl.includes('127.0.0.1') ? apiUrl.replace('127.0.0.1', 'localhost') : apiUrl.replace('localhost', '127.0.0.1'),
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'http://127.0.0.1:7860',
        'http://localhost:7860',
      ].filter((u, i, a) => u && a.indexOf(u) === i)

      let data = null
      let lastErr = null

      for (const url of candidates) {
        try {
          const bodyForm = new FormData()
          if (inputMode === 'text') {
            bodyForm.append('text_payload', textInput.trim())
          } else {
            bodyForm.append('file', file)
          }

          const controller = new AbortController()
          const timeoutId  = setTimeout(() => controller.abort(), 60000)

          const res = await fetch(`${url}/api/analyze`, {
            method: 'POST',
            body: bodyForm,
            signal: controller.signal,
          })
          clearTimeout(timeoutId)

          if (res.ok) {
            data = await res.json()
            break
          } else {
            let detail = `Server error ${res.status}`
            try { const j = await res.json(); detail = j.detail || detail } catch {}
            lastErr = new Error(detail)
            if (res.status < 500) break // Client error (e.g. 413, 415, 422) — do not fallback
          }
        } catch (err) {
          lastErr = err
        }
      }

      if (!data) {
        clearInterval(intervalRef.current); setAnalyzing(false); setProgress(0)
        const detailMsg = lastErr ? (lastErr.message || String(lastErr)) : 'Connection failed'
        setErrorMsg(`Analysis failed: ${detailMsg}`)
        return
      }

      clearInterval(intervalRef.current); setProgress(100)
      setTimeout(() => { setAnalyzing(false); setScanData(data); setResults(true) }, 300)
    } catch (err) {
      clearInterval(intervalRef.current); setAnalyzing(false); setProgress(0)
      setErrorMsg(`Analysis failed: ${err.message}`)
    }
  }

  const handleReset = () => {
    clearInterval(intervalRef.current)
    setFile(null); setResults(false); setScanData(null)
    setAnalyzing(false); setProgress(0); setErrorMsg(null); setTextInput('')
  }

  const fileUrl = useMemo(() => file ? URL.createObjectURL(file) : null, [file])
  const isText  = inputMode === 'text' || file?.type?.includes('text') || file?.name?.endsWith('.txt')
  const isImage = file?.type?.includes('image')
  const isAudio = file?.type?.includes('audio')
  const isVideo = file?.type?.includes('video')

  // ── Results view ──
  if (results && scanData) {
    const score        = scanData.score ?? 0
    const verdict      = scanData.verdict
    const classification = scanData.classification || (verdict === 'SYNTHETIC' ? 'Likely synthetic' : 'Likely authentic')
    const confidence   = scanData.confidence || 'Low'
    const evidence     = scanData.evidence || []

    // Find frame details for video timeline
    const frameEvidence = evidence.find(e => e.name === 'Frame-level image analysis')
    const frameDetails  = frameEvidence?.frame_details || []

    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        {/* Header bar */}
        <div className="flex items-center justify-between bg-[#111113] border border-white/[0.08] p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <CheckCircle size={18} className="text-green-400" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-offwhite uppercase tracking-wider">Analysis Complete</p>
              <p className="font-sans text-sm text-offwhite/50">{scanData?.filename}</p>
            </div>
          </div>
          <div className="flex items-center gap-8 px-6 border-l border-white/10">
            <div className="flex flex-col"><span className="font-mono text-[9px] text-offwhite/40 uppercase tracking-widest">Latency</span><span className="font-mono text-xs text-offwhite">{scanData?.latency ?? '—'}</span></div>
            <div className="flex flex-col"><span className="font-mono text-[9px] text-offwhite/40 uppercase tracking-widest">Scan ID</span><span className="font-mono text-xs text-offwhite">{scanData?.scan_id ?? '—'}</span></div>
          </div>
          <button onClick={handleReset} className="ml-4 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-mono text-xs text-offwhite uppercase tracking-wider transition-all">New Scan</button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File preview */}
              <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-white/[0.15]">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest flex items-center gap-2">
                    {isText ? <FileText size={12} /> : isImage ? <ImageIcon size={12} /> : isAudio ? <Radio size={12} /> : isVideo ? <Video size={12} /> : <Eye size={12} />}
                    {isText ? 'Text Analysis' : isImage ? 'Image Analysis' : isAudio ? 'Audio Analysis' : isVideo ? 'Video Analysis' : 'Asset Analysis'}
                  </span>
                </div>
                {isText ? (
                  <div className="relative w-full aspect-video bg-black/60 rounded-2xl overflow-hidden border border-white/10 flex flex-col p-4 gap-3">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3"><FileText size={14} className="text-offwhite/40" /><span className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest">{scanData?.filename}</span><span className="ml-auto font-mono text-[9px] text-signal uppercase tracking-widest border border-signal/30 px-2 py-0.5 rounded bg-signal/10">Analyzed</span></div>
                    <div className="flex flex-col gap-2 flex-1 overflow-hidden">{[90, 75, 60, 85, 50, 70, 40, 65].map((w, i) => (<div key={i} className={`h-1.5 rounded-full ${i % 3 === 0 ? 'bg-signal/40' : 'bg-white/10'}`} style={{ width: `${w}%` }} />))}</div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 bg-signal/10 border border-signal/20 px-3 py-1.5 rounded-lg"><div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_6px_#e63b2e]" /><span className="font-mono text-[9px] text-signal uppercase tracking-widest">RoBERTa Classifier Active</span></div>
                  </div>
                ) : isImage ? (
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={fileUrl} alt="Analyzed subject" className="w-full h-full object-cover opacity-70" />
                    {/* No bounding box — localization not implemented */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-mono text-signal flex items-center gap-1.5 z-10 uppercase tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_10px_#e63b2e]" /> SigLIP Analysis Active</div>
                  </div>
                ) : isAudio ? (
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center gap-4 bg-black/60">
                    <Radio size={40} className="text-signal animate-pulse" />
                    <p className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest">{scanData?.filename}</p>
                    <audio src={fileUrl} controls className="w-3/4 opacity-80" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-mono text-signal flex items-center gap-1.5 z-10 uppercase tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_10px_#e63b2e]" /> MFCC Signal Analysis</div>
                  </div>
                ) : isVideo ? (
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                    <video src={fileUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-mono text-signal flex items-center gap-1.5 z-10 uppercase tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_10px_#e63b2e]" /> Frame Sampling Active</div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-video bg-black/60 rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center gap-3"><Eye size={40} className="text-offwhite/20" /><p className="font-mono text-xs text-offwhite/40">Analysis Complete</p></div>
                )}
              </div>

              {/* Score card */}
              <div className="relative bg-gradient-to-b from-[#18181A] to-[#0A0A0C] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-center items-center overflow-hidden shadow-2xl group hover:border-signal/30 transition-all duration-500">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-signal/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-signal/30 transition-all duration-500" />
                <span className="font-mono text-[10px] text-offwhite/40 uppercase tracking-widest mb-2 relative z-10">AI Generation Probability</span>
                <div className="flex items-baseline gap-1 relative z-10">
                  <h2 className="text-7xl font-sans font-black text-signal tracking-tighter drop-shadow-[0_0_15px_rgba(230,59,46,0.3)]">{score}</h2>
                  <span className="text-3xl font-black text-signal/50">%</span>
                </div>
                {/* Use accurate terminology */}
                <span className={`text-xs font-bold uppercase tracking-[0.3em] mt-1 relative z-10 ${score > 65 ? 'text-signal' : 'text-green-400'}`}>
                  {classification}
                </span>
                <div className="mt-8 flex flex-col gap-3 w-full relative z-10">
                  <div className="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <span className="font-mono text-[9px] text-offwhite/40 uppercase">Model Confidence</span>
                    <span className="font-mono text-[10px] text-offwhite font-bold">{confidence}</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <span className="font-mono text-[9px] text-offwhite/40 uppercase">Scan ID</span>
                    <span className="font-mono text-[10px] text-offwhite">{scanData?.scan_id ?? '—'}</span>
                  </div>
                  <div className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(230,59,46,0.15)] ${verdict === 'SYNTHETIC' ? 'bg-signal/15 text-signal border-signal/30' : 'bg-green-500/15 text-green-400 border-green-500/30'}`}>
                    {verdict === 'SYNTHETIC' ? <><AlertTriangle size={14} /> {classification}</> : <><CheckCircle size={14} /> {classification}</>}
                  </div>
                </div>
              </div>
            </div>

            {/* Video frame timeline — actual timestamps */}
            {(isVideo || scanData?.modality === 'media') && (
              <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest flex items-center gap-2"><Waves size={12} /> Frame-Level Analysis</span>
                </div>
                {frameDetails.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <p className="font-mono text-[9px] text-offwhite/30 uppercase tracking-widest mb-1">Analyzed frames (actual timestamps from video)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {frameDetails.map((f, i) => (
                        <div key={i} className={`flex flex-col items-center p-3 rounded-xl border ${f.score_pct > 65 ? 'bg-signal/10 border-signal/30' : 'bg-white/[0.02] border-white/10'}`}>
                          <span className="font-mono text-[10px] text-offwhite/50 uppercase">Frame {i + 1}</span>
                          <span className="font-mono text-xs text-offwhite font-bold mt-1">{f.timestamp}</span>
                          <span className={`font-mono text-sm font-bold mt-1 ${f.score_pct > 65 ? 'text-signal' : 'text-green-400'}`}>{f.score_pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-24 bg-black/20 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                    <Waves size={14} className="text-offwhite/20" />
                    <span className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest">No frames analyzed</span>
                  </div>
                )}
              </div>
            )}

            {/* Image localization notice */}
            {isImage && (
              <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-4 flex items-center gap-3">
                <Info size={14} className="text-offwhite/30 flex-shrink-0" />
                <div>
                  <span className="font-mono text-[10px] text-offwhite/40 uppercase tracking-widest block">Manipulation Localization</span>
                  <span className="font-sans text-xs text-offwhite/30 mt-0.5 block">Not available — pixel-level manipulation localization is not implemented in this version.</span>
                </div>
              </div>
            )}

            {/* Audio notice */}
            {isAudio && (
              <div className="bg-signal/5 border border-signal/20 rounded-3xl p-4 flex items-start gap-3">
                <AlertTriangle size={14} className="text-signal flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-signal uppercase tracking-widest block">Audio Detection Limitation</span>
                  <span className="font-sans text-xs text-offwhite/50 mt-1 block">
                    Audio analysis uses MFCC signal features only. No trained audio deepfake model is integrated.
                    The score shown (50%) reflects uncertainty — not a reliable AI/real determination.
                    Audio deepfake detection is marked as unavailable.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Evidence + Terminal panel */}
          <div className="flex flex-col gap-6 h-full">
            {/* Evidence list */}
            <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest flex items-center gap-2"><Layers size={12} /> Evidence</span>
                <span className="font-mono text-[9px] text-offwhite/30 uppercase tracking-widest">From actual computations</span>
              </div>
              <div className="flex flex-col gap-2">
                {evidence.map((item, i) => <EvidenceItem key={i} item={item} />)}
              </div>
            </div>

            {/* Limitations section */}
            <LimitationsSection limitations={scanData?.limitations} />

            {/* Terminal */}
            <div className="flex flex-col bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex-1 min-h-[250px]">
              <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3"><Terminal size={14} className="text-offwhite/50" /><p className="font-mono text-xs text-offwhite uppercase tracking-widest">Analysis Log</p></div>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /><span className="font-mono text-[9px] text-green-500 uppercase tracking-widest">Engine_v11</span></div>
              </div>
              <div className="p-5 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-2">
                <div className="text-offwhite/40">&gt; INITIATING MULTIMODAL SCAN...</div>
                <div className="text-offwhite/40">&gt; Payload: {scanData?.filename}</div>
                <div className="text-offwhite/40">&gt; Modality: {scanData?.modality}</div>
                <div className="text-offwhite/40">&gt; Model: {scanData?.model}</div>
                {evidence.filter(e => e.status === 'analyzed').map((e, i) => (
                  <div key={i} className="text-green-400">&gt; {e.name}: {e.score !== undefined ? `${e.score}%` : e.classification || 'analyzed'}</div>
                ))}
                {evidence.filter(e => e.status === 'unavailable' || e.status === 'not_available').map((e, i) => (
                  <div key={i} className="text-offwhite/30">&gt; {e.name}: {e.status.replace(/_/g, ' ')}</div>
                ))}
                <div className="text-offwhite/40 mt-1">&gt; Processing time: {scanData?.latency}</div>
                <div className={`font-bold mt-1 ${verdict === 'SYNTHETIC' ? 'text-signal' : 'text-green-400'}`}>
                  &gt; RESULT: {classification} ({score}%) — Confidence: {confidence}
                </div>
                <div className="text-offwhite animate-pulse mt-2">_</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Upload view ──
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto w-full gap-8 animate-in fade-in duration-500">
      {!analyzing ? (
        <>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-sans font-black uppercase tracking-tight text-offwhite">Analyze Content</h2>
            <p className="font-mono text-xs text-offwhite/40">
              {IS_LOCAL ? 'Local backend detected — files processed on your machine.' : `API endpoint: ${API_URL}`}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-full max-w-xs">
            <button onClick={() => { setInputMode('file'); setErrorMsg(null) }} className={`flex-1 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all ${inputMode === 'file' ? 'bg-signal text-offwhite' : 'text-offwhite/40 hover:text-offwhite'}`}>File Upload</button>
            <button onClick={() => { setInputMode('text'); setErrorMsg(null) }} className={`flex-1 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all ${inputMode === 'text' ? 'bg-signal text-offwhite' : 'text-offwhite/40 hover:text-offwhite'}`}>Paste Text</button>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="w-full flex items-start gap-3 bg-signal/10 border border-signal/30 rounded-2xl p-4">
              <AlertTriangle size={16} className="text-signal flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs font-bold text-signal uppercase tracking-wider mb-1">Analysis Failed</p>
                <p className="font-sans text-sm text-offwhite/60 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {inputMode === 'file' ? (
            <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => !file && fileRef.current?.click()} className={`relative overflow-hidden w-full border-2 border-dashed rounded-[2rem] min-h-[360px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 ${isDragging ? 'border-signal bg-signal/5 scale-[1.02]' : file ? 'border-white/20 bg-white/5 cursor-default' : 'border-white/10 bg-[#09090B] hover:border-white/20 hover:bg-white/[0.02]'}`}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
              <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,audio/*,.txt" onChange={e => { setFile(e.target.files[0]); setErrorMsg(null) }} />
              {file ? (
                <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6 shadow-xl"><CheckCircle size={32} className="text-green-400" /></div>
                  <p className="font-sans font-bold text-offwhite text-xl">{file.name}</p>
                  <p className="font-mono text-xs text-offwhite/40 mt-2 bg-black/50 px-3 py-1 rounded-full border border-white/10">{(file.size / 1024).toFixed(1)} KB</p>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); setErrorMsg(null) }} className="mt-6 font-mono text-[10px] text-signal/60 hover:text-signal uppercase tracking-widest transition-colors border border-transparent hover:border-signal/30 px-4 py-2 rounded-full">Remove File</button>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex gap-6 text-offwhite/20 mb-8"><ImageIcon size={32} /><Video size={32} /><Mic size={32} /><FileText size={32} /></div>
                  <p className="font-sans font-bold text-offwhite/80 text-lg tracking-wide">Drag & Drop your file here</p>
                  <p className="font-mono text-[10px] text-offwhite/30 mt-3 uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-full bg-black/50">Image · Video · Audio · Text</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              <textarea
                value={textInput}
                onChange={e => { setTextInput(e.target.value); setErrorMsg(null) }}
                placeholder="Paste text here to analyze for AI generation (minimum 10 characters)..."
                rows={10}
                className="w-full bg-[#09090B] border border-white/10 rounded-2xl p-5 font-mono text-sm text-offwhite placeholder:text-offwhite/20 outline-none focus:border-signal/50 resize-none transition-colors leading-relaxed"
              />
              <p className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest mt-2 text-right">{textInput.length} characters</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={inputMode === 'file' ? !file : !textInput.trim()}
            className={`w-full max-w-md flex items-center justify-center gap-3 py-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest transition-all duration-500 shadow-xl ${(inputMode === 'file' ? file : textInput.trim()) ? 'bg-signal text-ink hover:bg-signal/90 hover:-translate-y-1 cursor-pointer' : 'bg-white/5 border border-white/10 text-offwhite/20 cursor-not-allowed'}`}
          >
            <ScanLine size={16} /> {(inputMode === 'file' ? file : textInput.trim()) ? 'Run Detection' : 'Awaiting Input'}
          </button>
        </>
      ) : (
        <div className="w-full max-w-md bg-[#111113] border border-white/10 rounded-[2rem] p-12 flex flex-col items-center gap-8 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="relative flex items-center justify-center"><div className="absolute inset-0 bg-signal/20 blur-[40px] rounded-full animate-pulse" /><ScanLine size={48} className="text-signal relative z-10 animate-bounce" /></div>
          <div className="text-center space-y-2 w-full">
            <p className="font-mono text-sm text-offwhite font-bold uppercase tracking-widest">Running Analysis</p>
            <p className="font-mono text-[10px] text-offwhite/40 uppercase tracking-widest">PyTorch models processing...</p>
            <div className="w-full h-2 bg-black border border-white/10 rounded-full overflow-hidden mt-6"><div className="h-full bg-signal rounded-full shadow-[0_0_10px_#e63b2e] transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} /></div>
            <p className="font-mono text-[10px] text-signal uppercase tracking-widest mt-3">{Math.round(progress)}%</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ArchivePanel() {
  const [search, setSearch] = useState('')
  const filtered = ARCHIVE_ROWS.filter(r => r.id.toLowerCase().includes(search.toLowerCase()) || r.modality.toLowerCase().includes(search.toLowerCase()) || r.verdict.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center gap-2 bg-signal/10 border border-signal/20 rounded-xl p-3">
        <Info size={13} className="text-signal flex-shrink-0" />
        <p className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest">Demo data — sample scan results for illustration only. Run actual scans in the Scanner Engine.</p>
      </div>
      <div className="flex flex-col gap-6 bg-[#09090B] border border-white/[0.08] p-6 rounded-3xl shadow-xl">
        <div className="w-full border-b border-white/10 pb-4 relative flex items-center gap-4"><Eye size={20} className="text-offwhite/40" /><input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent border-none text-offwhite focus:outline-none font-mono text-sm placeholder:text-offwhite/30 tracking-wide" placeholder="Search by ID, modality, or verdict..." /></div>
        <div className="flex gap-3 flex-wrap">{['Modality: All', 'Verdict: Synthetic', 'Date: Last 7 Days'].map(f => (<button key={f} className="flex items-center gap-2 border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-offwhite/70 hover:text-offwhite px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all">{f} <ChevronRight size={12} /></button>))}</div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col rounded-3xl border border-white/[0.08] bg-[#09090B] shadow-xl">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-white/[0.02] border-b border-white/10">{['Scan ID', 'Modality', 'Verdict', 'Score', 'Primary Evidence', 'Action'].map(h => <th key={h} className="px-6 py-5 font-mono text-[10px] font-bold text-offwhite/40 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-white/[0.03] transition-colors group cursor-pointer">
                  <td className="px-6 py-5 text-offwhite/80 font-medium group-hover:text-offwhite transition-colors">{row.id}</td>
                  <td className="px-6 py-5 text-offwhite/50">{row.modality}</td>
                  <td className="px-6 py-5"><span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase border ${row.verdict === 'SYNTHETIC' ? 'bg-signal/10 text-signal border-signal/20' : row.verdict === 'UNCERTAIN' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-white/5 text-offwhite/60 border-white/10'}`}>{row.verdict === 'SYNTHETIC' ? 'Likely Synthetic' : row.verdict === 'UNCERTAIN' ? 'Uncertain' : 'Likely Authentic'}</span></td>
                  <td className={`px-6 py-5 font-bold ${row.verdict === 'SYNTHETIC' ? 'text-signal' : 'text-offwhite/60'}`}>{row.conf}%</td>
                  <td className="px-6 py-5 text-offwhite/60 max-w-sm truncate group-hover:text-offwhite/90 transition-colors">{row.anomaly}</td>
                  <td className="px-6 py-5"><button className="font-mono text-[10px] uppercase tracking-widest text-offwhite/30 group-hover:text-signal transition-colors flex items-center gap-1">View <ArrowRight size={10} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-white/[0.02] font-mono text-[10px] uppercase tracking-widest">
          <span className="text-offwhite/40">Showing <span className="text-offwhite font-bold">1-{filtered.length}</span> of {filtered.length}</span>
          <div className="flex items-center gap-1"><button className="p-1.5 hover:bg-white/10 rounded text-offwhite/40 hover:text-offwhite transition-colors"><ChevronLeft size={14} /></button><span className="px-3 text-offwhite font-bold">1</span><button className="p-1.5 hover:bg-white/10 rounded text-offwhite/40 hover:text-offwhite transition-colors"><ChevronRight size={14} /></button></div>
        </div>
      </div>
    </div>
  )
}

function SubscriptionPanel() {
  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-start gap-3 bg-signal/10 border border-signal/20 rounded-2xl p-4">
        <Info size={14} className="text-signal flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-mono text-[10px] font-bold text-signal uppercase tracking-widest mb-1">Open Source Project</p>
          <p className="font-sans text-sm text-offwhite/60 leading-relaxed">
            Veritas Neural is currently an open-source research project. Professional and Enterprise tiers are planned but not yet available.
            The API runs on your local machine — start with <code className="text-signal bg-signal/10 px-1 rounded">uvicorn main:app --reload --port 8000</code>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative flex flex-col bg-gradient-to-br from-[#1A1A1D] to-[#0A0A0C] border border-white/[0.08] p-8 rounded-3xl overflow-hidden shadow-2xl group hover:border-signal/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-48 h-48 bg-signal/10 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-signal/20 transition-all duration-500" />
          <div className="flex items-center gap-2 mb-6"><Star size={14} className="text-signal" /><p className="text-signal text-[10px] font-mono uppercase font-bold tracking-widest">Current Plan</p></div>
          <p className="text-offwhite text-2xl font-sans font-black uppercase tracking-tight mb-2 relative z-10">Open Source</p>
          <p className="text-offwhite text-5xl font-sans font-black mb-8 tracking-tighter relative z-10">Free<span className="text-lg text-offwhite/40 font-mono tracking-widest ml-1">/ forever</span></p>
          <div className="mt-auto relative z-10">
            <a href="https://github.com/1SoulHunter1/veritas-neural-core" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-signal/10 border border-white/10 hover:border-signal/30 rounded-2xl text-offwhite hover:text-signal text-xs font-bold uppercase font-mono tracking-widest transition-all duration-300">
              <span>View on GitHub</span><ArrowRight size={14} />
            </a>
          </div>
        </div>
        <div className="flex flex-col bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3"><div className="p-2 bg-white/5 rounded-lg border border-white/10"><Key size={16} className="text-offwhite" /></div><p className="text-offwhite text-sm font-bold uppercase tracking-widest font-mono">API Configuration</p></div>
          </div>
          <div className="bg-[#050505] border border-white/10 p-4 rounded-xl flex items-center justify-between mb-4">
            <p className="text-signal font-mono text-sm tracking-widest">VITE_API_URL</p>
          </div>
          <div className="bg-[#050505] border border-white/10 p-4 rounded-xl font-mono text-xs text-offwhite/60 mb-4">{API_URL}</div>
          <div className="mt-auto flex items-start gap-3 bg-signal/5 border border-signal/10 p-4 rounded-xl">
            <AlertTriangle size={14} className="text-signal flex-shrink-0" />
            <p className="text-offwhite/60 font-mono text-[10px] leading-relaxed uppercase tracking-widest">
              Set <span className="text-offwhite font-bold">VITE_API_URL</span> in <span className="text-offwhite font-bold">frontend/.env</span> to configure the backend endpoint.
              {IS_LOCAL ? ' Local mode active.' : ' Cloud/remote mode active.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardView({ onNavigate }) {
  const [activePanel, setActivePanel] = useState('scanner')
  const navItems = [
    { id: 'scanner', label: 'Scanner Engine', icon: <ScanLine size={16} /> },
    { id: 'archive', label: 'Scan History', icon: <FolderOpen size={16} /> },
    { id: 'subscription', label: 'Settings & API', icon: <CreditCard size={16} /> },
  ]
  const panelTitles = { scanner: 'Scanner Engine', archive: 'Scan History', subscription: 'Settings & API' }
  return (
    <div className="h-[100dvh] bg-[#050505] text-offwhite flex overflow-hidden selection:bg-signal/30">
      <aside className="w-64 flex-shrink-0 border-r border-white/[0.08] bg-[#0A0A0A] flex flex-col p-5 relative z-20">
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-8 h-8 bg-white text-ink flex items-center justify-center font-bold text-sm font-mono rounded">VN.</div>
          <div className="flex flex-col"><h1 className="text-white text-xs font-bold uppercase tracking-widest font-sans">Veritas Neural</h1><div className="flex items-center gap-1.5 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" /><span className="font-mono text-[8px] text-green-500 uppercase tracking-widest">Operational</span></div></div>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <p className="font-mono text-[9px] text-offwhite/30 uppercase tracking-widest px-2 mb-2">Platform</p>
          {navItems.map(it => (<button key={it.id} onClick={() => setActivePanel(it.id)} className={`group flex items-center gap-3 px-3 py-3 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 text-left w-full ${activePanel === it.id ? 'bg-white/10 text-white shadow-inner' : 'text-offwhite/40 hover:text-offwhite hover:bg-white/[0.03]'}`}><div className={`${activePanel === it.id ? 'text-signal' : 'text-offwhite/30 group-hover:text-offwhite/70 transition-colors'}`}>{it.icon}</div>{it.label}</button>))}
        </nav>
        <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl mb-4"><p className="font-mono text-[9px] text-offwhite/30 uppercase tracking-widest mb-1">Mode</p><div className="flex items-center gap-2"><Shield size={12} className="text-signal" /><span className="font-mono text-xs text-offwhite font-bold">{IS_LOCAL ? 'Local' : 'Remote'}</span></div></div>
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 px-3 py-3 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest text-offwhite/30 hover:text-signal hover:bg-signal/10 transition-colors w-full"><LogOut size={14} /> Sign Out</button>
      </aside>
      <main className="flex-1 overflow-y-auto relative bg-[#050505]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="p-8 lg:p-12 relative z-10 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.05]">
            <div><h1 className="font-sans font-black text-2xl text-offwhite tracking-tight uppercase">Control Room</h1><p className="font-mono text-[10px] text-signal uppercase tracking-widest mt-1">/ {panelTitles[activePanel]}</p></div>
          </div>
          {activePanel === 'scanner' && <ScannerPanel />}
          {activePanel === 'archive' && <ArchivePanel />}
          {activePanel === 'subscription' && <SubscriptionPanel />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [currentView, setCurrentView] = useState('landing')
  const navigate = useCallback((view) => setCurrentView(view), [])
  if (currentView === 'login') return <LoginView onNavigate={navigate} />
  if (currentView === 'dashboard') return <DashboardView onNavigate={navigate} />
  return (
    <div className="bg-offwhite">
      <Navbar onNavigate={navigate} />
      <Hero onNavigate={navigate} />
      <Features />
      <Philosophy />
      <Protocol />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  )
}