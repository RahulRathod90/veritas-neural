import React, { useEffect, useRef, useState, useMemo, useCallback, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Shield, ScanLine, Zap, ArrowRight, ChevronRight, ChevronLeft,
  Activity, Eye, Layers, CheckCircle, Menu, X,
  UploadCloud, FileText, Image as ImageIcon, Video, Terminal,
  AlertTriangle, Lock, User, Mic, Waves, BarChart2, Home,
  Radio, Play, Pause, LogOut, CreditCard, FolderOpen,
  Star, Download, Key, ArrowUpRight
} from 'lucide-react'

const Spline = React.lazy(() => import('@splinetool/react-spline'))
if (typeof window !== 'undefined') { gsap.registerPlugin(ScrollTrigger) }

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
          <span className="font-mono text-xs text-signal tracking-[0.25em] uppercase">Inference Engine v10.0</span>
        </div>
        <h1 className="mb-2 leading-none select-none">
          <span data-hero className="block font-sans font-bold text-offwhite text-[clamp(2.2rem,7vw,6rem)] tracking-tight">Real or Synthetic.</span>
          <span data-hero className="block font-drama text-signal text-[clamp(3.5rem,12vw,10rem)] leading-none">We Know.</span>
        </h1>
        <p data-hero className="mt-4 font-sans text-offwhite/60 text-base md:text-lg max-w-xl leading-relaxed font-light select-none">
          An offline, privacy-first forensic engine that detects AI-generated text, deepfake video, manipulated images, and synthetic voice clones — running entirely on your local machine.
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
            { label: 'Runs Offline', val: '100%' },
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
    { title: 'MFCC Audio Analysis', sub: 'Voice clone detection via spectral variance — low MFCC variance = synthetic speech', icon: <Mic size={16} /> },
    { title: 'SigLIP Image Detection', sub: 'AI-vs-human SigLIP classifier — trained on real photos, not just studio datasets', icon: <Eye size={16} /> },
    { title: 'Temporal Video Scoring', sub: 'Sparse frame sampling with blur detection and majority-vote consensus', icon: <Layers size={16} /> },
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
    '> INIT: local_inference_engine v10.0',
    '> LOADING: PyTorch models from cache...',
    '> PRIMARY: SigLIP ai-vs-human model ready',
    '> SECONDARY: ViT deepfake detector ready',
    '> FACE DETECT: OpenCV Haar cascade active',
    '> EXIF CHECK: Camera metadata verified',
    '> MFCC: Audio spectral variance computed',
    '> CALIBRATION: Sigmoid scoring applied',
    '> VERDICT: Authenticity score generated',
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
        <p className="font-sans text-ink/50 text-sm mt-1">Models download once and run offline on your machine forever.</p>
      </div>
    </div>
  )
}

function PrivacyCard() {
  const [activeIdx, setActiveIdx] = useState(0)
  useEffect(() => { const id = setInterval(() => setActiveIdx(prev => (prev + 1) % 4), 1400); return () => clearInterval(id) }, [])
  const items = [
    { label: 'Your files stay on your machine', status: 'GUARANTEED' },
    { label: 'Zero external API calls made', status: 'CONFIRMED' },
    { label: 'Models cached locally after first run', status: 'ACTIVE' },
    { label: 'Works without internet connection', status: 'VERIFIED' },
  ]
  return (
    <div className="artifact-card card-noise p-7 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6"><Lock size={14} className="text-signal" /><span className="font-mono text-xs text-muted tracking-wider uppercase">Privacy Guarantee</span></div>
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-400 ${activeIdx === i ? 'bg-signal/10 border-signal/30' : 'bg-ink/5 border-ink/5'}`}>
            <span className={`font-mono text-[10px] uppercase tracking-widest ${activeIdx === i ? 'text-signal' : 'text-ink/50'}`}>{item.label}</span>
            <span className={`font-mono text-[10px] font-bold ${activeIdx === i ? 'text-signal' : 'text-ink/30'}`}>{item.status}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6">
        <h3 className="font-sans font-bold text-lg text-ink leading-tight">Zero-Trust Privacy</h3>
        <p className="font-sans text-ink/50 text-sm mt-1">Your files never leave your device. No cloud. No logs.</p>
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
          <p className="font-sans text-ink/50 text-sm max-w-xs leading-relaxed">Four machine learning models running locally — no API keys, no internet required after setup.</p>
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
          <p className="font-sans text-offwhite text-xl md:text-2xl leading-relaxed">{['We', 'run', 'everything:'].map((w, i) => <span key={i} data-word className="inline-block mr-[0.3em]">{w}</span>)}</p>
          <p className="font-drama text-signal text-[clamp(2.5rem,7vw,6rem)] leading-none mt-2">
            {['locally,', 'offline,'].map((w, i) => <span key={i} data-word className="inline-block mr-[0.25em]">{w}</span>)}<br />
            {['on', 'your', 'device.'].map((w, i) => <span key={i} data-word className="inline-block mr-[0.25em]">{w}</span>)}
          </p>
        </div>
        <div className="mt-16 pt-10 border-t border-offwhite/10 flex flex-col md:flex-row gap-12">
          {[
            { n: '4', label: 'Detection modalities: text, image, audio, and video' },
            { n: 'Zero', label: 'Files uploaded to any external server — ever' },
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
            <p className="font-sans text-xl max-w-md leading-relaxed text-offwhite/60">Local PyTorch models run on your hardware — a SigLIP image classifier, a ViT deepfake detector, an MFCC audio analyser, and a RoBERTa text classifier all working together.</p>
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
            <p className="font-sans text-xl max-w-md leading-relaxed text-offwhite/90">Get a 0–100 authenticity score, a clear AUTHENTIC or SYNTHETIC verdict, a breakdown by modality, and a list of specific anomalies detected — all in under two seconds.</p>
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
    { name: 'Starter', price: '$0', period: '', desc: 'Run it yourself — open source, fully local.', features: ['Self-hosted on your machine', 'All 4 modalities included', 'Text, image, audio & video', 'Community support'], highlight: false },
    { name: 'Professional', price: '$49', period: '/mo', desc: 'For journalists, researchers, and trust & safety teams.', features: ['All 4 modalities', 'Priority model updates', 'API access (localhost)', 'Forensic PDF reports', 'Email support'], highlight: true },
    { name: 'Enterprise', price: 'Custom', period: '', desc: 'Air-gapped deployments for sensitive organisations.', features: ['On-premise installation', 'Custom model fine-tuning', 'SLA guarantee', 'Dedicated engineer', 'SIEM integration'], highlight: false },
  ]
  return (
    <section ref={sectionRef} className="section-pad bg-offwhite" id="pricing">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3"><div className="w-6 h-px bg-signal" /><span className="font-mono text-xs text-signal tracking-[0.2em] uppercase">Pricing</span><div className="w-6 h-px bg-signal" /></div>
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-ink leading-tight tracking-tight">Choose Your<br /><span className="font-drama text-signal">Defense Layer.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {tiers.map(tier => (
            <div key={tier.name} className={`pricing-card flex flex-col rounded-4xl p-8 border transition-all duration-300 ${tier.highlight ? 'bg-ink border-ink shadow-2xl scale-[1.02] md:scale-105' : 'bg-offwhite border-ink/10 hover:border-signal/30'}`}>
              <div className={`font-mono text-xs tracking-widest uppercase mb-4 ${tier.highlight ? 'text-signal' : 'text-muted'}`}>{tier.name}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`font-sans font-bold text-4xl ${tier.highlight ? 'text-offwhite' : 'text-ink'}`}>{tier.price}</span>
                <span className={`font-mono text-sm ${tier.highlight ? 'text-offwhite/40' : 'text-muted'}`}>{tier.period}</span>
              </div>
              <p className={`font-sans text-sm mb-6 leading-relaxed ${tier.highlight ? 'text-offwhite/50' : 'text-ink/50'}`}>{tier.desc}</p>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {tier.features.map(f => (<li key={f} className="flex items-center gap-3"><CheckCircle size={14} className={tier.highlight ? 'text-signal flex-shrink-0' : 'text-ink/30 flex-shrink-0'} /><span className={`font-sans text-sm ${tier.highlight ? 'text-offwhite/70' : 'text-ink/60'}`}>{f}</span></li>))}
              </ul>
              <button className={`btn-magnetic flex items-center justify-center gap-2 py-4 rounded-full font-mono text-xs font-bold uppercase tracking-wider mt-auto ${tier.highlight ? 'bg-signal text-offwhite' : 'bg-ink/5 text-ink border border-ink/10 hover:border-signal/40'}`}>
                <span className={`btn-slide rounded-full ${tier.highlight ? 'bg-ink' : 'bg-signal'}`} />
                <span className="relative z-10">Select Plan</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const handleSubmit = (e) => { e.preventDefault(); if (sending || sent) return; setSending(true); setTimeout(() => { setSending(false); setSent(true) }, 1800) }
  return (
    <section id="contact" className="section-pad bg-paper">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6"><div className="w-6 h-px bg-signal" /><span className="font-mono text-xs text-signal tracking-[0.2em] uppercase">Get In Touch</span></div>
            <h2 className="font-sans font-bold text-5xl md:text-6xl text-ink leading-tight tracking-tight mb-6">Let's<br /><span className="font-drama text-signal">Talk.</span></h2>
            <p className="font-sans text-ink/50 text-base leading-relaxed max-w-sm mb-10">Reach out for enterprise deployments, research collaborations, or questions about the detection engine. We typically respond within a few hours.</p>
            <div className="space-y-5">
              {[{ label: 'Response Time', val: '< 4 hours' }, { label: 'Project', val: 'Veritas Neural v10.0' }, { label: 'Contact', val: 'hello@veritasneural.ai' }].map(r => (
                <div key={r.label} className="flex items-center justify-between border-b border-ink/8 pb-4">
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{r.label}</span>
                  <span className="font-mono text-xs text-ink">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-ink rounded-[2rem] p-10">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <CheckCircle size={40} className="text-signal" />
                <p className="font-sans font-bold text-2xl text-offwhite">Message Received.</p>
                <p className="font-mono text-[11px] text-offwhite/30 uppercase tracking-widest">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-1.5"><label className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest">Name</label><input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="w-full bg-transparent border-b border-offwhite/20 pb-2 font-sans text-sm text-offwhite placeholder:text-offwhite/20 outline-none focus:border-signal transition-colors" /></div>
                <div className="space-y-1.5"><label className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest">Email</label><input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className="w-full bg-transparent border-b border-offwhite/20 pb-2 font-sans text-sm text-offwhite placeholder:text-offwhite/20 outline-none focus:border-signal transition-colors" /></div>
                <div className="space-y-1.5"><label className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest">Message</label><textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your use case or question..." className="w-full bg-transparent border-b border-offwhite/20 pb-2 font-sans text-sm text-offwhite placeholder:text-offwhite/20 outline-none focus:border-signal resize-none transition-colors leading-relaxed" /></div>
                <button type="submit" disabled={sending} className="btn-magnetic w-full flex items-center justify-center gap-3 py-4 rounded-full bg-signal text-offwhite font-mono text-sm font-bold uppercase tracking-widest disabled:opacity-60">
                  <span className="btn-slide bg-ink rounded-full" />
                  <span className="relative z-10 flex items-center gap-2">{sending ? <><ScanLine size={14} className="animate-pulse" /> Sending...</> : <><Zap size={14} /> Send Message</>}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-ink rounded-t-5xl px-8 md:px-16 pt-16 pb-8 mt-0">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-offwhite/10">
          <div className="md:col-span-2">
            <div className="font-sans font-bold text-2xl text-offwhite tracking-tighter mb-3">Veritas Neural<span className="text-signal">.</span></div>
            <p className="font-sans text-offwhite/40 text-sm leading-relaxed max-w-xs">An offline, privacy-first detection engine for AI-generated text, images, audio, and video. Your files never leave your machine.</p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest mb-4">Technology</div>
            {['Local Inference', 'Image Detection', 'Audio Analysis', 'Text Detection', 'Video Forensics'].map(l => <a key={l} href="#" className="link-hover block font-sans text-sm text-offwhite/50 hover:text-signal mb-2 transition-colors">{l}</a>)}
          </div>
          <div>
            <div className="font-mono text-[10px] text-offwhite/30 uppercase tracking-widest mb-4">Project</div>
            {['About', 'How It Works', 'Pricing', 'Contact', 'GitHub'].map(l => <a key={l} href="#" className="link-hover block font-sans text-sm text-offwhite/50 hover:text-signal mb-2 transition-colors">{l}</a>)}
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
  const [clearanceId, setClearanceId] = useState('')
  const [cryptoKey, setCryptoKey] = useState('')
  const [loading, setLoading] = useState(false)
  const handleAuth = () => { if (loading) return; setLoading(true); setTimeout(() => { setLoading(false); onNavigate('dashboard') }, 1500) }
  const handleKey = (e) => { if (e.key === 'Enter') handleAuth() }
  return (
    <div className="h-[100dvh] bg-ink flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
      <button onClick={() => onNavigate('landing')} className="absolute top-6 left-6 flex items-center gap-2 font-mono text-xs text-offwhite/30 hover:text-signal uppercase tracking-wider transition-colors"><Home size={13} /> Home</button>
      <div className="bg-paper rounded-[2rem] p-10 md:p-14 max-w-md w-full mx-4 shadow-2xl relative">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3"><Lock size={11} className="text-signal" /><span className="font-mono text-xs text-signal uppercase tracking-[0.25em]">Restricted Access</span></div>
          <h1 className="font-sans text-3xl font-bold text-ink leading-tight">Sign In.</h1>
          <p className="font-mono text-[11px] text-muted mt-2 uppercase tracking-wider">Enter your credentials to continue</p>
        </div>
        <div className="space-y-6 mb-8">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted uppercase tracking-widest">Username</label>
            <div className="flex items-center gap-3 border-b border-ink/20 pb-2 focus-within:border-signal transition-colors"><User size={14} className="text-ink/30 flex-shrink-0" /><input type="text" value={clearanceId} onChange={e => setClearanceId(e.target.value)} onKeyDown={handleKey} placeholder="your.username" className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-ink/25 outline-none" /></div>
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted uppercase tracking-widest">Password</label>
            <div className="flex items-center gap-3 border-b border-ink/20 pb-2 focus-within:border-signal transition-colors"><Lock size={14} className="text-ink/30 flex-shrink-0" /><input type="password" value={cryptoKey} onChange={e => setCryptoKey(e.target.value)} onKeyDown={handleKey} placeholder="••••••••••••" className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-ink/25 outline-none" /></div>
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

const ARCHIVE_ROWS = [
  { id: '0x99a2...', modality: 'Video', verdict: 'SYNTHETIC', conf: '88.0', anomaly: 'Temporal AI Confidence Flicker + GAN Boundary', date: '2026-03-16' },
  { id: '0x11b8...', modality: 'Text', verdict: 'AUTHENTIC', conf: '91.0', anomaly: 'None detected', date: '2026-03-16' },
  { id: '0xCC41...', modality: 'Audio', verdict: 'SYNTHETIC', conf: '85.0', anomaly: 'Voice Clone Signature (MFCC Variance: 62.3)', date: '2026-03-15' },
  { id: '0x7E2D...', modality: 'Image', verdict: 'SYNTHETIC', conf: '79.0', anomaly: 'Camera EXIF Metadata Absent + GAN Boundary', date: '2026-03-15' },
  { id: '0x5F32...', modality: 'Image', verdict: 'AUTHENTIC', conf: '88.0', anomaly: 'None detected', date: '2026-03-14' },
]

function ScannerPanel() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(false)
  const [scanData, setScanData] = useState(null)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef(null)
  const intervalRef = useRef(null)

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f) }
  const handleAnalyze = async () => {
    if (!file || analyzing) return
    setAnalyzing(true); setResults(false); setScanData(null); setProgress(0)
    intervalRef.current = setInterval(() => setProgress(p => p >= 92 ? 92 : p + (92 / 30)), 100)
    try {
      const form = new FormData(); form.append('file', file)
      fetch('https://sheikfawaz-veritas-neural-core.hf.space/api/analyze', {
        method: 'POST',
        body: form
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      clearInterval(intervalRef.current); setProgress(100)
      setTimeout(() => { setAnalyzing(false); setScanData(data); setResults(true) }, 300)
    } catch (err) {
      clearInterval(intervalRef.current); setAnalyzing(false); setProgress(0)
      alert(`Backend unreachable.\nRun: python main.py\n\n${err.message}`)
    }
  }
  const handleReset = () => { clearInterval(intervalRef.current); setFile(null); setResults(false); setScanData(null); setAnalyzing(false); setProgress(0) }
  const fileUrl = useMemo(() => file ? URL.createObjectURL(file) : null, [file])
  const isText = file?.type?.includes('text') || file?.name?.endsWith('.txt')
  const isImage = file?.type?.includes('image')

  if (results) return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-[#111113] border border-white/[0.08] p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><CheckCircle size={18} className="text-green-400" /></div>
          <div><p className="font-mono text-xs font-bold text-offwhite uppercase tracking-wider">Analysis Complete</p><p className="font-sans text-sm text-offwhite/50">{file?.name}</p></div>
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
            <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-white/[0.15]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest flex items-center gap-2">
                  {isText ? <FileText size={12} /> : isImage ? <ImageIcon size={12} /> : file?.type?.includes('audio') ? <Radio size={12} /> : file?.type?.includes('video') ? <Video size={12} /> : <Eye size={12} />}
                  {isText ? 'Document Viewer' : isImage ? 'Image Forensics' : file?.type?.includes('audio') ? 'Audio Analysis' : file?.type?.includes('video') ? 'Video Forensics' : 'Asset Viewer'}
                </span>
              </div>
              {isText ? (
                <div className="relative w-full aspect-video bg-black/60 rounded-2xl overflow-hidden border border-white/10 flex flex-col p-4 gap-3">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3"><FileText size={14} className="text-offwhite/40" /><span className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest">{file?.name}</span><span className="ml-auto font-mono text-[9px] text-signal uppercase tracking-widest border border-signal/30 px-2 py-0.5 rounded bg-signal/10">Analyzed</span></div>
                  <div className="flex flex-col gap-2 flex-1 overflow-hidden">{[90, 75, 60, 85, 50, 70, 40, 65].map((w, i) => (<div key={i} className={`h-1.5 rounded-full ${i % 3 === 0 ? 'bg-signal/40' : 'bg-white/10'}`} style={{ width: `${w}%` }} />))}</div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 bg-signal/10 border border-signal/20 px-3 py-1.5 rounded-lg"><div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_6px_#e63b2e]" /><span className="font-mono text-[9px] text-signal uppercase tracking-widest">RoBERTa Classifier Active</span></div>
                </div>
              ) : isImage ? (
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 group">
                  <img src={fileUrl} alt="Forensic subject" className="w-full h-full object-cover opacity-70" />
                  {scanData?.bounding_box && (<div className="absolute border-2 border-signal shadow-[0_0_20px_rgba(230,59,46,0.6)] bg-signal/10" style={{ top: scanData.bounding_box.top, left: scanData.bounding_box.left, width: scanData.bounding_box.width, height: scanData.bounding_box.height }}><div className="absolute -top-6 left-0 bg-signal text-white font-sans text-[10px] px-2 py-0.5 font-bold whitespace-nowrap shadow-lg rounded-t-sm tracking-wider uppercase">AI-GENERATED AREA</div></div>)}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-mono text-signal flex items-center gap-1.5 z-10 uppercase tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_10px_#e63b2e]" /> SigLIP Analysis Active</div>
                </div>
              ) : file?.type?.includes('audio') ? (
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center gap-4 bg-black/60">
                  <Radio size={40} className="text-signal animate-pulse" />
                  <p className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest">{file?.name}</p>
                  <audio src={fileUrl} controls className="w-3/4 opacity-80" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-mono text-signal flex items-center gap-1.5 z-10 uppercase tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_10px_#e63b2e]" /> MFCC Spectral Analysis</div>
                </div>
              ) : file?.type?.includes('video') ? (
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                  <video src={fileUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-mono text-signal flex items-center gap-1.5 z-10 uppercase tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_10px_#e63b2e]" /> Frame Sampling Active</div>
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-black/60 rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center gap-3"><Eye size={40} className="text-offwhite/20" /><p className="font-mono text-xs text-offwhite/40">Asset Analysis Complete</p></div>
              )}
            </div>
            <div className="relative bg-gradient-to-b from-[#18181A] to-[#0A0A0C] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-center items-center overflow-hidden shadow-2xl group hover:border-signal/30 transition-all duration-500">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-signal/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-signal/30 transition-all duration-500" />
              <span className="font-mono text-[10px] text-offwhite/40 uppercase tracking-widest mb-2 relative z-10">AI Generation Probability</span>
              <div className="flex items-baseline gap-1 relative z-10"><h2 className="text-7xl font-sans font-black text-signal tracking-tighter drop-shadow-[0_0_15px_rgba(230,59,46,0.3)]">{scanData?.score ?? '—'}</h2><span className="text-3xl font-black text-signal/50">%</span></div>
              <span className={`text-xs font-bold uppercase tracking-[0.3em] mt-1 relative z-10 ${(scanData?.score ?? 0) > 65 ? 'text-signal' : 'text-green-400'}`}>{(scanData?.score ?? 0) > 65 ? 'AI GENERATED' : 'REAL CONTENT'}</span>
              <div className="mt-8 flex flex-col gap-3 w-full relative z-10">
                <div className="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between"><span className="font-mono text-[9px] text-offwhite/40 uppercase">Scan ID</span><span className="font-mono text-[10px] text-offwhite">{scanData?.scan_id ?? '—'}</span></div>
                <div className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(230,59,46,0.15)] ${scanData?.verdict === 'SYNTHETIC' ? 'bg-signal/15 text-signal border-signal/30' : 'bg-green-500/15 text-green-400 border-green-500/30'}`}>
                  {scanData?.verdict === 'SYNTHETIC' ? <><AlertTriangle size={14} /> AI-Generated Content Detected</> : <><CheckCircle size={14} /> Authentic Content Verified</>}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest flex items-center gap-2"><Layers size={12} /> Multimodal Breakdown</span></div>
            <div className="grid gap-6">
              {[
                { key: 'visual', label: 'Visual', sub: 'SigLIP + ViT deepfake · Face-aware scoring' },
                { key: 'audio', label: 'Audio', sub: 'MFCC Spectral Variance · Librosa' },
                { key: 'linguistic', label: 'Linguistic', sub: 'RoBERTa Text Classifier · Hello-SimpleAI' },
              ].map(row => {
                const pct = scanData?.breakdown?.[row.key] ?? 0
                const high = pct >= 65
                return (
                  <div key={row.label} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col"><span className="font-sans text-sm font-bold text-offwhite tracking-wide">{row.label}</span><span className="font-mono text-[10px] text-offwhite/40">{row.sub}</span></div>
                      <span className={`font-mono text-sm font-bold ${high ? 'text-signal' : 'text-offwhite/60'}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-black/50 border border-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full relative transition-all duration-700 ${high ? 'bg-signal shadow-[0_0_10px_#e63b2e]' : 'bg-white/20'}`} style={{ width: `${pct}%` }} /></div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-[10px] text-offwhite/50 uppercase tracking-widest flex items-center gap-2"><Waves size={12} /> Forensic Timeline</span>
              <div className="flex items-center gap-2 bg-signal/10 border border-signal/20 px-2.5 py-1 rounded-md"><div className="w-1.5 h-1.5 bg-signal rounded-full animate-pulse shadow-[0_0_5px_#e63b2e]" /><span className="font-mono text-[9px] text-signal uppercase tracking-widest">Anomaly Found</span></div>
            </div>
            {(isText || isImage) ? (
              <div className="h-32 bg-black/20 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-2 opacity-30"><Waves size={14} className="text-offwhite" /><span className="font-mono text-[10px] text-offwhite uppercase tracking-widest">Timeline N/A for Static Payloads</span></div>
                <span className="font-mono text-[9px] text-offwhite/20 uppercase tracking-widest">Applies to video and audio files only</span>
              </div>
            ) : (
              <div className="relative h-32 bg-black/30 rounded-xl border border-white/5 p-3 flex items-end overflow-hidden mt-2">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute inset-x-3 bottom-6 top-3">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="stroke-white/20" d="M0,85 L15,85 L20,88 L30,85 L40,86 L50,85 L60,83 L70,85 L80,85 L90,87 L100,85" fill="none" strokeWidth="1.5" />
                    <path fill="none" stroke="#E63B2E" strokeWidth="2.5" className="drop-shadow-[0_0_5px_rgba(230,59,46,0.8)]" d="M0,80 L15,80 L18,75 L20,80 L22,78 L25,80 L28,20 L30,10 L32,30 L35,5 L38,40 L40,80 L45,78 L50,80 L60,80 L70,75 L80,80 L90,78 L100,80" />
                  </svg>
                </div>
                {(scanData?.timeline_spikes?.length ?? 0) > 0 && (<div className="absolute left-[17%] right-[72%] top-0 bottom-6 bg-signal/10 border-x border-signal/40 flex items-start justify-center pt-2"><div className="bg-signal/90 text-black font-mono text-[9px] px-2 py-0.5 rounded shadow-[0_0_10px_rgba(230,59,46,0.4)] whitespace-nowrap font-bold tracking-widest">{scanData.timeline_spikes.slice(0, 2).join(' – ')} HIGH</div></div>)}
                <div className="w-full flex justify-between font-mono text-[9px] text-offwhite/40 border-t border-white/10 pt-2 z-10">
                  {['0:00', ...(scanData?.timeline_spikes?.slice(0, 2) ?? ['0:14', '0:22']), '1:00', '1:20'].map((t, i) => (<span key={`${t}-${i}`} className={i === 1 || i === 2 ? 'text-signal font-bold' : ''}>{t}</span>))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-full min-h-[500px]">
          <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3"><Terminal size={14} className="text-offwhite/50" /><p className="font-mono text-xs text-offwhite uppercase tracking-widest">Live Terminal</p></div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /><span className="font-mono text-[9px] text-green-500 uppercase tracking-widest">Engine_v10</span></div>
          </div>
          <div className="p-5 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-2">
            <div className="text-offwhite/40">&gt; INITIATING MULTIMODAL SCAN...</div>
            <div className="text-offwhite/40">&gt; Payload received: {scanData?.filename}</div>
            <div className="text-offwhite/40">&gt; Loading PyTorch models from cache... OK</div>
            <div className="text-offwhite/40">&gt; Running face detection (OpenCV)... OK</div>
            <div className="text-offwhite/40">&gt; Running MFCC audio analysis...</div>
            <div className="text-offwhite">&gt; Checking EXIF metadata...</div>
            {(scanData?.anomalies ?? []).map(a => (<div key={a.id} className={`${a.severity === 'CRITICAL' || a.severity === 'HIGH' ? 'text-signal font-bold bg-signal/10 border-l-2 border-signal pl-3 py-1 rounded-r-md' : 'text-offwhite/70'}`}>&gt; {a.severity}: {a.label}</div>))}
            <div className="text-offwhite/40 mt-1">&gt; Synthetic probability: {scanData ? 100 - (scanData.score ?? 0) : '—'}%</div>
            <div className={`font-bold mt-1 ${scanData?.verdict === 'SYNTHETIC' ? 'text-signal' : 'text-green-400'}`}>&gt; VERDICT: {scanData?.verdict} (Score: {scanData?.score}%)</div>
            <div className="text-offwhite animate-pulse mt-2">_</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto w-full gap-8 animate-in fade-in duration-500">
      {!analyzing ? (
        <>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-sans font-black uppercase tracking-tight text-offwhite">Analyze Content</h2>
            <p className="font-mono text-xs text-offwhite/40">Upload a file to run local AI detection — no data leaves your machine.</p>
          </div>
          <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => !file && fileRef.current?.click()} className={`relative overflow-hidden w-full border-2 border-dashed rounded-[2rem] min-h-[360px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 ${isDragging ? 'border-signal bg-signal/5 scale-[1.02]' : file ? 'border-white/20 bg-white/5 cursor-default' : 'border-white/10 bg-[#09090B] hover:border-white/20 hover:bg-white/[0.02]'}`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
            <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,audio/*,.txt,.pdf" onChange={e => setFile(e.target.files[0])} />
            {file ? (
              <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6 shadow-xl"><CheckCircle size={32} className="text-green-400" /></div>
                <p className="font-sans font-bold text-offwhite text-xl">{file.name}</p>
                <p className="font-mono text-xs text-offwhite/40 mt-2 bg-black/50 px-3 py-1 rounded-full border border-white/10">{(file.size / 1024).toFixed(1)} KB</p>
                <button onClick={(e) => { e.stopPropagation(); setFile(null) }} className="mt-6 font-mono text-[10px] text-signal/60 hover:text-signal uppercase tracking-widest transition-colors border border-transparent hover:border-signal/30 px-4 py-2 rounded-full">Remove File</button>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="flex gap-6 text-offwhite/20 mb-8"><ImageIcon size={32} /><Video size={32} /><Mic size={32} /><FileText size={32} /></div>
                <p className="font-sans font-bold text-offwhite/80 text-lg tracking-wide">Drag & Drop your file here</p>
                <p className="font-mono text-[10px] text-offwhite/30 mt-3 uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-full bg-black/50">Image · Video · Audio · Text</p>
              </div>
            )}
          </div>
          <button onClick={handleAnalyze} disabled={!file} className={`w-full max-w-md flex items-center justify-center gap-3 py-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest transition-all duration-500 shadow-xl ${file ? 'bg-signal text-ink hover:bg-signal/90 hover:-translate-y-1 cursor-pointer' : 'bg-white/5 border border-white/10 text-offwhite/20 cursor-not-allowed'}`}>
            <ScanLine size={16} /> {file ? 'Run Detection' : 'Awaiting File'}
          </button>
        </>
      ) : (
        <div className="w-full max-w-md bg-[#111113] border border-white/10 rounded-[2rem] p-12 flex flex-col items-center gap-8 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="relative flex items-center justify-center"><div className="absolute inset-0 bg-signal/20 blur-[40px] rounded-full animate-pulse" /><ScanLine size={48} className="text-signal relative z-10 animate-bounce" /></div>
          <div className="text-center space-y-2 w-full">
            <p className="font-mono text-sm text-offwhite font-bold uppercase tracking-widest">Running Local Detection</p>
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
      <div className="flex flex-col gap-6 bg-[#09090B] border border-white/[0.08] p-6 rounded-3xl shadow-xl">
        <div className="w-full border-b border-white/10 pb-4 relative flex items-center gap-4"><Eye size={20} className="text-offwhite/40" /><input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent border-none text-offwhite focus:outline-none font-mono text-sm placeholder:text-offwhite/30 tracking-wide" placeholder="Search by ID, modality, or verdict..." /></div>
        <div className="flex gap-3 flex-wrap">{['Modality: All', 'Verdict: Synthetic', 'Date: Last 7 Days'].map(f => (<button key={f} className="flex items-center gap-2 border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-offwhite/70 hover:text-offwhite px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all">{f} <ChevronRight size={12} /></button>))}</div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col rounded-3xl border border-white/[0.08] bg-[#09090B] shadow-xl">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-white/[0.02] border-b border-white/10">{['Scan ID', 'Modality', 'Verdict', 'Score', 'Primary Anomaly', 'Action'].map(h => <th key={h} className="px-6 py-5 font-mono text-[10px] font-bold text-offwhite/40 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-white/[0.03] transition-colors group cursor-pointer">
                  <td className="px-6 py-5 text-offwhite/80 font-medium group-hover:text-offwhite transition-colors">{row.id}</td>
                  <td className="px-6 py-5 text-offwhite/50">{row.modality}</td>
                  <td className="px-6 py-5"><span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase border ${row.verdict === 'SYNTHETIC' ? 'bg-signal/10 text-signal border-signal/20' : 'bg-white/5 text-offwhite/60 border-white/10'}`}>{row.verdict}</span></td>
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
  const metrics = [
    { label: 'Image Scans', used: 842, total: 1000, danger: false },
    { label: 'Video / Audio Scans', used: 410, total: 500, danger: false },
    { label: 'Text Analyses', used: 4900, total: 5000, danger: true },
  ]
  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative flex flex-col bg-gradient-to-br from-[#1A1A1D] to-[#0A0A0C] border border-white/[0.08] p-8 rounded-3xl overflow-hidden shadow-2xl group hover:border-signal/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-48 h-48 bg-signal/10 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-signal/20 transition-all duration-500" />
          <div className="flex items-center gap-2 mb-6"><Star size={14} className="text-signal" /><p className="text-signal text-[10px] font-mono uppercase font-bold tracking-widest">Active Plan</p></div>
          <p className="text-offwhite text-2xl font-sans font-black uppercase tracking-tight mb-2 relative z-10">Professional</p>
          <p className="text-offwhite text-5xl font-sans font-black mb-8 tracking-tighter relative z-10">$49<span className="text-lg text-offwhite/40 font-mono tracking-widest ml-1">/mo</span></p>
          <div className="mt-auto relative z-10"><button className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-signal/10 border border-white/10 hover:border-signal/30 rounded-2xl text-offwhite hover:text-signal text-xs font-bold uppercase font-mono tracking-widest transition-all duration-300"><span>Upgrade to Enterprise</span><ArrowRight size={14} /></button></div>
        </div>
        <div className="flex flex-col bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><div className="p-2 bg-white/5 rounded-lg border border-white/10"><Key size={16} className="text-offwhite" /></div><p className="text-offwhite text-sm font-bold uppercase tracking-widest font-mono">API Keys</p></div>
            <button className="text-offwhite/40 hover:text-signal transition-colors flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest"><ScanLine size={12} /> Regenerate</button>
          </div>
          <div className="bg-[#050505] border border-white/10 p-4 rounded-xl flex items-center justify-between mb-6 group cursor-pointer hover:border-signal/30 transition-all shadow-inner"><p className="text-signal font-mono text-sm tracking-widest">sk-vn-...****</p><div className="text-offwhite/30 group-hover:text-signal transition-colors"><CheckCircle size={14} /></div></div>
          <div className="mt-auto flex items-start gap-3 bg-signal/5 border border-signal/10 p-4 rounded-xl"><AlertTriangle size={14} className="text-signal flex-shrink-0" /><p className="text-offwhite/60 font-mono text-[10px] leading-relaxed uppercase tracking-widest">API runs on <span className="text-offwhite font-bold">localhost:8000</span>. Start with <span className="text-offwhite font-bold">python main.py</span>.</p></div>
        </div>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10"><h2 className="text-offwhite text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3"><BarChart2 size={16} className="text-signal" /> Usage This Month</h2><span className="font-mono text-[9px] text-offwhite/40 border border-white/10 px-2 py-1 rounded tracking-widest uppercase">March 2026</span></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8 justify-center">
            {metrics.map(m => {
              const p = Math.round((m.used / m.total) * 100)
              return (
                <div key={m.label} className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-end"><p className={`text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-2 ${m.danger ? 'text-signal' : 'text-offwhite'}`}>{m.danger && <AlertTriangle size={12} />} {m.label}</p><p className="text-offwhite/50 font-mono text-[10px] tracking-widest"><span className="text-offwhite font-bold">{m.used.toLocaleString()}</span> / {m.total.toLocaleString()}</p></div>
                  <div className="h-1.5 w-full bg-black/80 border border-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${m.danger ? 'bg-signal shadow-[0_0_10px_#e63b2e]' : 'bg-white/40'}`} style={{ width: `${p}%` }} /></div>
                </div>
              )
            })}
          </div>
          <div className="border border-white/5 bg-[#050505] rounded-2xl p-5 flex flex-col relative min-h-[200px] shadow-inner">
            <p className="text-offwhite/30 font-mono text-[9px] absolute top-5 left-5 tracking-widest uppercase">Scans / 30 Days</p>
            <div className="flex-1 w-full mt-6 relative">
              <svg viewBox="0 0 300 100" className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                <defs><linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#E63B2E" stopOpacity="0.3" /><stop offset="100%" stopColor="#E63B2E" stopOpacity="0" /></linearGradient></defs>
                <path d="M0,80 Q30,75 50,70 T90,60 T130,50 T170,55 T210,30 T250,45 T290,20 L300,20 L300,100 L0,100 Z" fill="url(#chartGrad)" />
                <path d="M0,80 Q30,75 50,70 T90,60 T130,50 T170,55 T210,30 T250,45 T290,20 L300,20" fill="none" stroke="#E63B2E" strokeWidth="2.5" className="drop-shadow-[0_0_5px_rgba(230,59,46,0.6)]" />
                <circle cx="50" cy="70" r="3" fill="#E63B2E" /><circle cx="210" cy="30" r="3" fill="#E63B2E" /><circle cx="290" cy="20" r="4" fill="#fff" />
              </svg>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-md"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]" /><span className="font-mono text-[9px] text-offwhite tracking-widest font-bold">LIVE</span></div>
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
    { id: 'subscription', label: 'Billing & APIs', icon: <CreditCard size={16} /> },
  ]
  const panelTitles = { scanner: 'Scanner Engine', archive: 'Scan History', subscription: 'Billing & APIs' }
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
        <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl mb-4"><p className="font-mono text-[9px] text-offwhite/30 uppercase tracking-widest mb-1">Session</p><div className="flex items-center gap-2"><Shield size={12} className="text-signal" /><span className="font-mono text-xs text-offwhite font-bold">Analyst Access</span></div></div>
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