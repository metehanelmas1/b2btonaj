import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  Mountain, 
  Recycle, 
  Warehouse, 
  Layers, 
  Truck, 
  Coins, 
  FileCheck2,
  ChevronRight,
  TreePine,
  Play,
  Check,
  Menu,
  X,
  Lock,
  Zap,
  TrendingUp,
  Cpu,
  BarChart3,
  Layers3,
  Flame,
  Clock,
  Sparkles,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Radio,
  FileText,
  BadgeCheck,
  CircleDot
} from 'lucide-react';
import { SectorType, SectorMeta } from '../types';
import { api } from '../services/api';

interface LandingPageProps {
  onGoToAuth: () => void;
}

// Enterprise Natural Cubic Bezier (Studio Duo / Slater / Linear tier)
const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE_PREMIUM,
    },
  },
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Luxury Spotlight Card with Cursor-Tracking Radial Glow (Awwwards / Linear Style)
const SpotlightCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1015]/90 p-6 sm:p-8 transition-all duration-300 ${className}`}
      style={{
        boxShadow: isHovered
          ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.16), 0 20px 40px rgba(0,0,0,0.6)'
          : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.08), transparent 45%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  const [sectors, setSectors] = useState<SectorMeta[]>([]);
  const [activePreviewSector, setActivePreviewSector] = useState<SectorType>('beton');
  const [telemetryData, setTelemetryData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Interactive Axle Scale Simulator State
  const [isOverloadedSimulation, setIsOverloadedSimulation] = useState(false);

  // Interactive Ministerial Tolerance Slider State
  const [disputeDifferenceKg, setDisputeDifferenceKg] = useState<number>(80);

  useEffect(() => {
    api.getSectors().then((data) => {
      if (data && data.length > 0) setSectors(data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    api.getSectorTelemetry(activePreviewSector).then(res => {
      if (res && res.data) setTelemetryData(res.data);
    }).catch(console.error);
  }, [activePreviewSector]);

  const navLinks = [
    { name: 'Özellikler', href: '#features' },
    { name: 'Sektör Masaları', href: '#sectors' },
    { name: 'Aks & Ceza Kalkanı', href: '#axle-radar' },
    { name: 'Mevzuat & U-ETDS', href: '#compliance' },
    { name: 'Finans & Mutabakat', href: '#settlement' },
    { name: 'Karşılaştırma', href: '#comparison' },
  ];

  // Tolerance computation: 28,800 KG * 0.005 = 144 KG
  const SENDER_WEIGHT = 28800;
  const LEGAL_TOLERANCE_LIMIT = 144;
  const isWithinLegalTolerance = disputeDifferenceKg <= LEGAL_TOLERANCE_LIMIT;
  const receiverCalculatedWeight = SENDER_WEIGHT - disputeDifferenceKg;

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] font-geist selection:bg-amber-400 selection:text-[#08090C] relative overflow-x-hidden">
      
      {/* Real-Time Commodity & Operational Marquee Ticker (Top Spec Bar) */}
      <div className="relative z-50 border-b border-white/[0.06] bg-[#0A0C10] py-1.5 px-4 overflow-hidden text-[11px] font-mono select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="tracking-wider uppercase text-[10px] font-semibold text-zinc-300">
              T.C. Ağır Sanayi Veri Omurgası
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">Aktif Tesisler: 314 Kantar Noktası</span>
          </div>

          <div className="flex-1 overflow-hidden ml-0 sm:ml-6">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-sans">Hazır Beton C30:</span>
                <span className="text-white font-bold">2.450 ₺/m³</span>
                <span className="text-emerald-400">▲ +%1.2</span>
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-sans">DKP Hurda Demir:</span>
                <span className="text-white font-bold">14.85 ₺/kg</span>
                <span className="text-emerald-400">▲</span>
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-sans">Agrega Mıcır (MAPEG):</span>
                <span className="text-white font-bold">195 ₺/ton</span>
                <span className="text-zinc-400">━</span>
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-sans">Kütük Çelik 130x130:</span>
                <span className="text-white font-bold">$585/ton</span>
                <span className="text-emerald-400">▲</span>
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-sans">U-ETDS Mühürleme Süresi:</span>
                <span className="text-amber-400 font-bold">4.2 Saniye</span>
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-sans">Backhaul Filo Tasarrufu:</span>
                <span className="text-emerald-400 font-bold">318.000 ₺/Ay</span>
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-sans">Sanayi Bakanlığı Yasal Tolerans:</span>
                <span className="text-white font-bold">±%0.5 Kesin</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4K Cinematic Industrial Background Layer — Distinctly Visible Yet Balanced */}
      <div className="absolute top-0 left-0 right-0 h-[880px] pointer-events-none overflow-hidden z-0 select-none">
        <motion.div 
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.78 }}
          transition={{ duration: 1.8, ease: EASE_PREMIUM }}
          className="w-full h-full relative"
        >
          <img 
            src="/hero-industrial-bg.jpg" 
            alt="Ağır Sanayi Terminali ve Kantar Sahası" 
            className="w-full h-full object-cover object-center filter contrast-[1.14] brightness-[0.90] saturate-[1.28]"
          />
          {/* Subtle Top & Bottom Gradient Bleeds for Pristine Blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#08090C]/85 via-transparent to-[#08090C]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,_rgba(8,9,12,0.65)_0%,_#08090C_92%)]" />
        </motion.div>
      </div>

      {/* Ambient Lighting & Grid Cones */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[680px] slater-glow-cone pointer-events-none z-0 opacity-45"></div>
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute inset-0 slater-grid-pattern pointer-events-none z-0 opacity-45"></div>

      {/* Floating Pill Navigation Bar (Precision Responsive Slater-Style) */}
      <motion.div 
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: EASE_PREMIUM }}
        className="sticky top-3 sm:top-5 z-40 w-full max-w-6xl mx-auto px-3 sm:px-6"
      >
        <header className="rounded-full bg-[#101217]/90 backdrop-blur-2xl border border-white/10 px-3.5 sm:px-5 py-2.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
          
          {/* Logo & Platform Tag */}
          <a href="#" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#08090C] font-bold shadow-md transition-transform group-hover:scale-105">
              <Scale className="w-4 h-4 text-[#08090C] stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white font-geist">
                TONAJ<span className="text-amber-400">.B2B</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                INDUSTRIAL OS
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[13px] text-zinc-300 font-medium">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1.5px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onGoToAuth}
              className="hidden sm:block text-xs font-semibold text-zinc-300 hover:text-white transition-colors px-2.5 py-1.5 cursor-pointer"
            >
              Şirket Girişi
            </button>
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGoToAuth}
              className="px-4 sm:px-5 py-2 bg-white hover:bg-zinc-100 text-[#08090C] font-bold rounded-full text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center gap-1.5 cursor-pointer group"
            >
              <span>Sisteme Başla</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Menüyü Aç"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown with Framer Motion */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE_PREMIUM }}
              className="lg:hidden mt-2 p-5 rounded-3xl bg-[#111317]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4"
            >
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-zinc-300 hover:text-white py-2 border-b border-white/5 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGoToAuth();
                  }}
                  className="w-full py-2.5 rounded-full text-center text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  Şirket Girişi Yap
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGoToAuth();
                  }}
                  className="w-full py-2.5 rounded-full text-center text-xs font-bold text-[#08090C] bg-white hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Sistemi Ücretsiz Başlat
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hero Section with Framer Motion Stagger */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 pt-14 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center"
      >
        
        {/* Slater Spec-Sheet Badge */}
        <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/90 text-xs font-medium backdrop-blur-md mb-8 hover:border-amber-400/40 transition-all cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-zinc-200 font-medium">Ağır Sanayi & Dökme Yükte Türkiye'de Tek</span>
          <span className="text-zinc-600">•</span>
          <span className="text-amber-400 flex items-center gap-1 font-semibold font-mono">
            <span>GO CORE v2.4</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUpVariants} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] max-w-4xl mx-auto drop-shadow-md">
          Kantar, irsaliye, şantiye ve tüm saha operasyonunuz.
          <span className="block mt-2.5 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
            Tek bir işletim sistemi, altı ayrı program değil.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={fadeUpVariants} className="mt-6 text-sm sm:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
          Hazır betondan taş ocağına, demir çelikten antrepoya dökme yükün bütün taraflarını kantar fişinden e-faturaya, 42T Karayolları kalkanından 24 saatte nakit tahsilatına tek ekranda bağlayın.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div variants={fadeUpVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoToAuth}
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-zinc-100 text-[#08090C] font-bold rounded-full text-sm shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Ücretsiz Şirket Hesabı Aç</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#axle-radar"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>42T Aks Kalkanını Test Et</span>
          </motion.a>
        </motion.div>

        {/* Ministerial Badges Row */}
        <motion.div 
          variants={fadeUpVariants}
          className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-zinc-400 font-medium"
        >
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>T.C. Ulaştırma Bakanlığı U-ETDS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>GİB e-İrsaliye Entegrasyonu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>MAPEG e-Maden & MoTAT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>Sanayi Bakanlığı ±%0.5 Metroloji</span>
          </div>
        </motion.div>

      </motion.section>

      {/* Central Interactive Showcase Terminal (Slater-Style Product Frame) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24" id="sectors">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: EASE_PREMIUM }}
          className="rounded-3xl border border-white/10 bg-[#101217] shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          
          {/* Terminal Window Header Bar */}
          <div className="px-5 py-4 border-b border-white/10 bg-[#14161C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 font-mono text-[11px] text-zinc-400">
                tonaj.b2b/engine/{activePreviewSector}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Go REST API Canlı
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">Gerçek Zamanlı Saha Verisi</span>
            </div>
          </div>

          {/* Sektörel Pill Switcher Bar */}
          <div className="p-4 bg-[#0B0D11] border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'beton', label: 'Hazır Beton', icon: Building2 },
              { id: 'tas_ocagi', label: 'Taş Ocağı & Maden', icon: Mountain },
              { id: 'demir', label: 'Demir Çelik', icon: Layers },
              { id: 'hurda', label: 'Hurda Metal', icon: Recycle },
              { id: 'antrepo_gumruk', label: 'Gümrüklü Antrepo', icon: Warehouse },
              { id: 'kereste', label: 'Kereste & Orman', icon: TreePine },
              { id: 'nakliye_lojistik', label: 'Ağır Nakliye Filosu', icon: Truck },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activePreviewSector === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewSector(tab.id as SectorType)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#08090C] shadow-md font-bold'
                      : 'text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Terminal Screen Body with AnimatePresence */}
          <div className="p-6 sm:p-8 bg-[#08090C]/95 min-h-[380px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePreviewSector}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: EASE_PREMIUM }}
              >
                {activePreviewSector === 'beton' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                          Hazır Beton İhtisas Masası
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">Mikser Priz Süresi (Slump) & Çimento Siloları</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        EBİS Çip & ÇŞB Uyumlu
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Çimento Silo 1 Seviyesi</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          {telemetryData?.cementSilo1 ?? 74} Ton
                        </div>
                        <div className="text-[11px] text-emerald-400 mt-1">Basınç ve doluluk normal</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Santralde Hazır Mikser</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          {telemetryData?.mixers?.length ?? 4} Araç Sahada
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1">Priz süresi kritik alarmı yok</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Geri Dönen / İade Beton</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          {telemetryData?.returnedM3 ?? 0} $m^3$
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-1">Kalıp veya gecikme firesi 0</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewSector === 'tas_ocagi' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                          Taş Ocağı & Maden Masası
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">5-Aks Bağımsız Tartım & MAPEG Sevk Fişi</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        MAPEG e-Maden Entegre
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Kırıcı Besleme Hızı</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          {telemetryData?.crusherTPH ?? 420} Ton/Saat
                        </div>
                        <div className="text-[11px] text-emerald-400 mt-1">0-38mm Agrega Üretimi</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">42T Ceza Bariyeri Durumu</div>
                        <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                          %100 Korumalı
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1">Aşırı tonajlı kamyon çıkışı kilitli</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Belediye Rüsum Tahakkuku</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          Otomatik Hesaplanıyor
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-1">Ay sonu beyannamesi hazır</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewSector === 'demir' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                          Demir Çelik Masası
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">Teorik vs Gerçek Ağırlık Sapması (Haddehane Çap Toleransı)</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        CE / TSE Belgesi Uyumlu
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Günlük Kütük Girişi</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          {telemetryData?.billetStock ?? 840} Ton
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1">130x130mm 3SP / 5SP Standart</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Fırın Çıkış Sıcaklığı</div>
                        <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                          {telemetryData?.furnaceTemp ?? 1150} °C
                        </div>
                        <div className="text-[11px] text-emerald-400 mt-1">Haddeleme aralığı optimal</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Barkodlu Paket Sevkiyatı</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          {telemetryData?.bundleStock ?? 320} Bağ Hazır
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-1">Döküm numarası etiketli</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewSector === 'hurda' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                          Hurda Metal & Geri Dönüşüm Masası
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">Radyasyon Kapısı & ÇŞB MoTAT Atık Formu</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        9/10 KDV Tevkifatı Entegre
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Radyasyon Kapı Tarayıcısı</div>
                        <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">0.08 µSv/h</div>
                        <div className="text-[11px] text-emerald-400 mt-1">Doğal Fon Aralığında (Güvenli)</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Ortalama Çamur / Su Firesi</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">%3.4 Fire</div>
                        <div className="text-[11px] text-zinc-400 mt-1">Kamera ile mühürlendi</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">MoTAT Atık İrsaliyesi</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">Otomatik Üretildi</div>
                        <div className="text-[11px] text-zinc-500 mt-1">Çevre Bakanlığı onay kodu alındı</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewSector === 'antrepo_gumruk' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                          Gümrüklü Antrepo Masası
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">BİLGE Sistemi & Ardiye / Demurraj Sayacı</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        A-Tipi Genel Antrepo Uyumlu
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Gümrük BİLGE Beyanname Eşleşmesi</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">Tam Senkronize</div>
                        <div className="text-[11px] text-emerald-400 mt-1">Özet beyan açma kapama anlık</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Depo Doluluk Oranı</div>
                        <div className="text-2xl font-bold font-mono text-amber-400 mt-1">%78 Kapasite</div>
                        <div className="text-[11px] text-zinc-400 mt-1">14.200 $m^2$ Açık / Kapalı Saha</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Kamera Mühürlü Plaka Tanıma</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">24/7 Kayıt</div>
                        <div className="text-[11px] text-emerald-400 mt-1">Yeşil Hat Muayenesiz Sevk</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewSector === 'kereste' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                          Kereste & Orman Masası
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">3D Hacim ($m^3$) ➔ Tonaj Çevirici & Kurutma Fırını</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        OGM Nakliye Tezkeresi Uyumlu
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Kurutma Fırını Nem Radarı</div>
                        <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">%13.4 Nem</div>
                        <div className="text-[11px] text-zinc-400 mt-1">İhracat Standardı (%12-14)</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Katrak Biçki Net Verimi</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">%71.5 Net Kereste</div>
                        <div className="text-[11px] text-emerald-400 mt-1">Talaş yan ürün sevkıyatı aktif</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">ISPM-15 Isıl İşlem Palet</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">56°C / 30 Dk</div>
                        <div className="text-[11px] text-zinc-500 mt-1">Dijital mühürlü sertifika hazır</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewSector === 'nakliye_lojistik' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                          Dökme Nakliye Filo Masası
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">Boş Dönüş (Backhaul) Borsası & CAN-Bus Mazot Takibi</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        U-ETDS Otomatik Sefer
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Boş Dönüş (Backhaul) Tasarrufu</div>
                        <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">318.000 ₺ / Ay</div>
                        <div className="text-[11px] text-emerald-400 mt-1">42 Sefer boş dönüşten kurtarıldı</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">CAN-Bus Mazot Sarfiyatı</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">38.2 L / 100 KM</div>
                        <div className="text-[11px] text-zinc-500 mt-1">Şüpheli gece yakıt düşüşü yok</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-zinc-400">Şantiye Onaylı Erken Navlun</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">24 Saatte Nakit</div>
                        <div className="text-[11px] text-emerald-400 mt-1">Ciro ve nakit akışı garantili</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Bar within Terminal */}
            <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-zinc-400">
                Seçili sektör masasını kendi firmanızın ERP ve kantar sistemine 5 dakikada bağlayın.
              </div>
              <motion.button
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGoToAuth}
                className="px-5 py-2.5 rounded-full bg-white text-[#08090C] font-bold text-xs hover:bg-zinc-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Bu Masayı Şirketinizde Başlatın</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NEW ELITE SECTION: 42 TON AKS TARTIM & CEZA KALKANI (INTERACTIVE SCHEMATIC) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-white/[0.08]" id="axle-radar">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            KARAYOLLARI VE METROLOJİ KALKANI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5">
            42 Ton Ceza Kalkanı & 5-Aks Bağımsız Tartım
          </h2>
          <p className="text-sm text-zinc-400 mt-3.5">
            Karayolları denetim istasyonunda 58.400 ₺ ceza yemeyin. Araç kantar üzerindeyken aks başı yükleri ölçülür, aşım varsa çıkış bariyeri kilitlenir.
          </p>
        </div>

        {/* Interactive Truck Weighbridge Canvas */}
        <div className="rounded-3xl border border-white/10 bg-[#0E1015] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Top Control Bar with Simulation Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isOverloadedSimulation ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span className="text-xs font-mono font-bold uppercase text-white">
                  Kantar Sensör Radarı: {isOverloadedSimulation ? 'AŞIRI YÜK TESPİT EDİLDİ' : 'YASAL LİMİTLER DAHİLİNDE'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Kantar Tipi: Çift Şaseli 18m Ağır Sanayi Taşıt Kantarı (OIML R60 C3)
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#14161C] p-1.5 rounded-full border border-white/10 text-xs font-mono">
              <button
                onClick={() => setIsOverloadedSimulation(false)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  !isOverloadedSimulation ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Normal (41.450 KG)
              </button>
              <button
                onClick={() => setIsOverloadedSimulation(true)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  isOverloadedSimulation ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Aşırı Yük Simülasyonu (44.800 KG)
              </button>
            </div>
          </div>

          {/* Truck & Axle Scale Graphic Schematics */}
          <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Schematic Diagram */}
            <div className="lg:col-span-8 bg-[#090A0D] p-6 rounded-2xl border border-white/10 relative">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 flex justify-between">
                <span>Şasi & Aks Yük Sensörleri Dağılımı</span>
                <span className="text-zinc-400">Kantar Platformu: 60 Ton / 20kg Hassasiyet</span>
              </div>

              {/* Truck Silhouette Representation with 5 Axles */}
              <div className="relative py-6 px-4">
                {/* Platform Scale Bar */}
                <div className="h-2.5 w-full bg-zinc-700 rounded-full mb-8 relative">
                  <div className={`absolute -top-1 left-0 right-0 h-1 rounded-full ${isOverloadedSimulation ? 'bg-rose-500' : 'bg-emerald-400'}`}></div>
                </div>

                {/* 5 Axle Load Sensor Cards */}
                <div className="grid grid-cols-5 gap-2 text-center font-mono">
                  
                  {/* Axle 1: Ön Aks */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] text-zinc-400">Aks 1 (Ön)</div>
                    <div className="text-sm sm:text-base font-bold text-white mt-1">
                      {isOverloadedSimulation ? '7.400' : '6.850'} KG
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-1">Limit: 7.500</div>
                    <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: isOverloadedSimulation ? '98%' : '91%' }}></div>
                    </div>
                  </div>

                  {/* Axle 2: Çeker Aks */}
                  <div className={`p-3 rounded-xl border ${isOverloadedSimulation ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' : 'bg-white/[0.03] border-white/10 text-white'}`}>
                    <div className="text-[10px] text-zinc-400">Aks 2 (Çeker)</div>
                    <div className="text-sm sm:text-base font-bold mt-1">
                      {isOverloadedSimulation ? '12.100' : '11.150'} KG
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-1">Limit: 11.500</div>
                    <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${isOverloadedSimulation ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ width: isOverloadedSimulation ? '100%' : '96%' }}></div>
                    </div>
                  </div>

                  {/* Axle 3: Treyler 1 */}
                  <div className={`p-3 rounded-xl border ${isOverloadedSimulation ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' : 'bg-white/[0.03] border-white/10 text-white'}`}>
                    <div className="text-[10px] text-zinc-400">Aks 3 (Treyler)</div>
                    <div className="text-sm sm:text-base font-bold mt-1">
                      {isOverloadedSimulation ? '8.450' : '7.800'} KG
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-1">Tridem Eşit</div>
                    <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${isOverloadedSimulation ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ width: isOverloadedSimulation ? '100%' : '97%' }}></div>
                    </div>
                  </div>

                  {/* Axle 4: Treyler 2 */}
                  <div className={`p-3 rounded-xl border ${isOverloadedSimulation ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' : 'bg-white/[0.03] border-white/10 text-white'}`}>
                    <div className="text-[10px] text-zinc-400">Aks 4 (Treyler)</div>
                    <div className="text-sm sm:text-base font-bold mt-1">
                      {isOverloadedSimulation ? '8.450' : '7.820'} KG
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-1">Tridem Eşit</div>
                    <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${isOverloadedSimulation ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ width: isOverloadedSimulation ? '100%' : '97%' }}></div>
                    </div>
                  </div>

                  {/* Axle 5: Treyler 3 */}
                  <div className={`p-3 rounded-xl border ${isOverloadedSimulation ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' : 'bg-white/[0.03] border-white/10 text-white'}`}>
                    <div className="text-[10px] text-zinc-400">Aks 5 (Treyler)</div>
                    <div className="text-sm sm:text-base font-bold mt-1">
                      {isOverloadedSimulation ? '8.400' : '7.830'} KG
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-1">Tridem Eşit</div>
                    <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${isOverloadedSimulation ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ width: isOverloadedSimulation ? '100%' : '97%' }}></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Status Panel: Total Weight & Barrier Gate Decision */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-[#090A0D] border border-white/10 font-mono">
                <div className="text-xs text-zinc-400">Toplam Brüt Tartım</div>
                <div className={`text-3xl font-extrabold mt-1 ${isOverloadedSimulation ? 'text-rose-400' : 'text-white'}`}>
                  {isOverloadedSimulation ? '44.800' : '41.450'} KG
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Yasal Azami Brüt Sınır: 42.000 KG
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Otomatik Bariyer Durumu</div>
                  <div className={`mt-2 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                    isOverloadedSimulation
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isOverloadedSimulation ? 'BARİYER KİLİTLENDİ' : 'BARİYER AÇIK (GEÇİŞ SERBEST)'}</span>
                    </span>
                    <span className="text-[10px]">{isOverloadedSimulation ? 'KORUMA AKTİF' : 'ONAYLANDI'}</span>
                  </div>
                </div>

                {isOverloadedSimulation && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                    <strong>58.400 ₺ Ceza Önlenmiştir:</strong> Araç sahadan çıkmadan dökme yük geri boşaltmaya yönlendirildi.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW ELITE SECTION: MINISTERIAL FLOW PIPELINE (DIGITAL CIRCUIT) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-white/[0.08]" id="compliance">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            OTOMATİK BAKANLIK DEVRESİ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5">
            4.2 Saniyede Uçtan Uca Dijital Mühür
          </h2>
          <p className="text-sm text-zinc-400 mt-3.5">
            Kamyon kantardan indiği milisaniyede donanım kriptosu üretilir, U-ETDS ve GİB mühürlenir, banka T+1 erken nakit avansı serbest bırakılır.
          </p>
        </div>

        {/* 4-Step Animated Circuit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1: Kantar IoT Dongle */}
          <SpotlightCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-4">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">FAZ 01</span>
                <span className="text-emerald-400">0.00s</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">Kantar IoT Dongle</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                İndikatörden okunan brüt/dara tartımı SHA-256 kriptografik damgasıyla imzalanır. Manuel müdahale imkansızdır.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 font-mono text-[10px] text-zinc-500">
              SHA-256 Mühürlü Donanım
            </div>
          </SpotlightCard>

          {/* Step 2: U-ETDS Sefer */}
          <SpotlightCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-4">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">FAZ 02</span>
                <span className="text-emerald-400">1.80s</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">U-ETDS Otomasyonu</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                T.C. Ulaştırma Bakanlığı API'sine şoför TC, plaka, yük türü ve net tonaj otomatik iletilir, resmi sefer kodu döner.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 font-mono text-[10px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Ceza Riski: %0</span>
            </div>
          </SpotlightCard>

          {/* Step 3: GİB e-İrsaliye */}
          <SpotlightCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-4">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">FAZ 03</span>
                <span className="text-emerald-400">3.10s</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">GİB e-İrsaliye</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Özel entegratör üzerinden karekodlu e-İrsaliye oluşturulur. Şoförün telefonuna SMS/WhatsApp ile anında düşer.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 font-mono text-[10px] text-blue-400">
              Karekodlu Dijital Sevk
            </div>
          </SpotlightCard>

          {/* Step 4: T+1 Nakit Avans */}
          <SpotlightCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-4">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">FAZ 04</span>
                <span className="text-emerald-400">4.20s</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">T+1 Erken Nakit</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Şantiye kantar kabulü yapıldığı an Garanti BBVA Faktoring entegrasyonuyla 24 saatte %80 nakit avans hesaba geçer.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 font-mono text-[10px] text-amber-400">
              24 Saatte Nakit Likidite
            </div>
          </SpotlightCard>

        </div>
      </section>

      {/* NEW ELITE SECTION: INTERACTIVE FINANCIAL TOLERANCE & HAKEMLİK RADAR */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-white/[0.08]" id="settlement">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            FİNANSAL HAKEMLİK VE KANTAR FARKI RADARI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5">
            Sanayi Bakanlığı ±%0.5 Yasal Tolerans Hakemliği
          </h2>
          <p className="text-sm text-zinc-400 mt-3.5">
            İki kantar arasında nem, rüzgar veya kalibrasyondan kaynaklanan küçük tartım farklarında faturalar aylarca bloke olmaz. Simülatörü kaydırarak test edin.
          </p>
        </div>

        {/* Interactive Hakemlik Simulator Widget */}
        <div className="rounded-3xl border border-white/10 bg-[#0E1015] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Slider Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-2">
                  <span>Gönderici Kantar Net Tonajı:</span>
                  <span className="text-white font-bold">28.800 KG (Sabit Sevk)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-4">
                  <span>Alıcı Şantiye Tartım Farkı:</span>
                  <span className="text-amber-400 font-bold text-base">{disputeDifferenceKg} KG Fark</span>
                </div>

                {/* Range Input Slider */}
                <input 
                  type="range"
                  min="0"
                  max="280"
                  step="5"
                  value={disputeDifferenceKg}
                  onChange={(e) => setDisputeDifferenceKg(Number(e.target.value))}
                  className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />

                <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-2">
                  <span>0 KG (Fark Yok)</span>
                  <span className="text-emerald-400 font-semibold">144 KG (Yasal Limit: ±%0.5)</span>
                  <span>280 KG (Aşırı Fark)</span>
                </div>
              </div>

              {/* Status Indicator Card based on Tolerance */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isWithinLegalTolerance
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  {isWithinLegalTolerance ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`text-sm font-bold ${isWithinLegalTolerance ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isWithinLegalTolerance
                        ? 'Sanayi Bakanlığı Yasal Toleransı Dahilinde'
                        : 'Yasal Tolerans Dışı Sapma Tespiti'}
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      {isWithinLegalTolerance
                        ? 'Tartım farkı ±%0.5 (144 KG) sınırının altındadır. Alıcının haksız itirazı sistem tarafından yasal metroloji kanunuyla otomatik düşürülmüş ve tam ödeme onaylanmıştır.'
                        : 'Fark yasal toleransı aşmaktadır. Sistem otomatik olarak her iki kantarın SHA-256 kamera fotoğraflarını ve şoför güzergah telemetrisini hakem heyetine iletmiştir.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Factoring Payout Ticket Panel */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090A0D] border border-white/10 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-zinc-400">
                <span className="font-bold text-white">Canlı Mutabakat Fişi</span>
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                  GARANTİ BBVA
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Gönderici Fabrika Net:</span>
                <span className="text-white font-bold">{SENDER_WEIGHT.toLocaleString('tr-TR')} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Alıcı Şantiye Net:</span>
                <span className="text-white font-bold">{receiverCalculatedWeight.toLocaleString('tr-TR')} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tartım Farkı:</span>
                <span className={isWithinLegalTolerance ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {disputeDifferenceKg} KG (%{((disputeDifferenceKg / SENDER_WEIGHT) * 100).toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Yasal Limit (±%0.5):</span>
                <span className="text-zinc-300 font-bold">±144 KG</span>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between text-zinc-400">
                  <span>İrsaliye Erken Nakit Avansı:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {isWithinLegalTolerance ? '598.800 ₺ (T+1 Hazır)' : 'İncelemede'}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {isWithinLegalTolerance ? 'Tahsilat vadesi: 24 Saatte Hesaba Aktarılır' : 'Hakem kararı bekleniyor'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW ELITE SECTION: ENTERPRISE COMPARISON TABLE (SLATER / APPLE SPEC SHEET) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-white/[0.08]" id="comparison">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            MİMARİ KARŞILAŞTIRMA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5">
            Eski Hantal Programlar vs TONAJ.B2B OS
          </h2>
          <p className="text-sm text-zinc-400 mt-3.5">
            6 ayrı kopuk masaüstü programı mı, yoksa tek bir entegre endüstriyel işletim sistemi mi?
          </p>
        </div>

        {/* Spec Comparison Table */}
        <div className="rounded-3xl border border-white/10 bg-[#0E1015] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#14161C] text-zinc-400">
                  <th className="p-4 sm:p-5 font-bold text-white text-sm">Operasyonel Kriter</th>
                  <th className="p-4 sm:p-5 text-rose-400/90 font-bold text-sm">Eski 6 Ayrı Program (Masaüstü)</th>
                  <th className="p-4 sm:p-5 text-emerald-400 font-bold text-sm bg-emerald-500/[0.04]">
                    TONAJ.B2B Endüstriyel OS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-zinc-300">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white font-sans text-sm">
                    42 Ton Karayolları Ceza Riski
                  </td>
                  <td className="p-4 sm:p-5 text-zinc-400">
                    Göz kararı / Manuel. 58.400 ₺ ceza ve araç bağlama riski yüksek.
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-300 font-semibold bg-emerald-500/[0.04]">
                    5-Aks bağımsız sensör + Aşımda otomatik kilitlenen çıkış bariyeri.
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white font-sans text-sm">
                    U-ETDS & e-İrsaliye Bildirimi
                  </td>
                  <td className="p-4 sm:p-5 text-zinc-400">
                    Akşam saatlerinde elle Excel'den tek tek giriş (Gecikme cezaları).
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-300 font-semibold bg-emerald-500/[0.04]">
                    Kamyon kantardan indiği an 4.2 saniyede bakanlığa yazılır ve mühürlenir.
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white font-sans text-sm">
                    Tartım Farkı & Uyuşmazlık Çözümü
                  </td>
                  <td className="p-4 sm:p-5 text-zinc-400">
                    Günlerce telefon trafiği, şantiye kavgaları ve faturanın bloke edilmesi.
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-300 font-semibold bg-emerald-500/[0.04]">
                    Sanayi Bakanlığı ±%0.5 toleransıyla otomatik hakemlik.
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white font-sans text-sm">
                    Nakit Akışı & Fatura Vadesi
                  </td>
                  <td className="p-4 sm:p-5 text-zinc-400">
                    60 - 90 gün vadeli çek ve nakit sıkışıklığı.
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-300 font-semibold bg-emerald-500/[0.04]">
                    Onaylanan kantar fişinden 24 saatte T+1 banka nakit faktoring avansı.
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white font-sans text-sm">
                    Filo Boş Dönüş (Backhaul)
                  </td>
                  <td className="p-4 sm:p-5 text-zinc-400">
                    Ocaklara veya fabrikaya boş dönen araçlar (Ayda binlerce KM mazot kaybı).
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-300 font-semibold bg-emerald-500/[0.04]">
                    Anlık dökme yük borsasıyla %91 doluluk oranı (Ayda 318.000 ₺ ek navlun).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Switch to Slater-Style Section ("Switch without rebuilding") */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20" id="switch">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            KOLAY VE HIZLI GEÇİŞ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5">
            Eski hantal programları bırakın. 5 dakikada TONAJ.B2B'ye geçin.
          </h2>
          <p className="text-sm text-zinc-400 mt-3.5">
            Mevcut kantar donanımınızı değiştirmeden, hiçbir veri kaybetmeden modern bir işletim sistemine geçiş yapın.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard>
            <div className="w-9 h-9 rounded-full bg-white/10 text-white font-mono font-bold flex items-center justify-center text-xs mb-5">
              01
            </div>
            <h4 className="text-base font-bold text-white mb-2">Müşteri ve İrsaliye Geçmişinizi Aktarın</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Excel, SAP, Logo veya eski kantar programınızdaki müşteri ve ürün listesini tek tıkla sisteme yükleyin.
            </p>
            <div className="mt-6 text-[11px] font-mono text-zinc-500">Süre: ~2 Dakika</div>
          </SpotlightCard>

          <SpotlightCard>
            <div className="w-9 h-9 rounded-full bg-white/10 text-white font-mono font-bold flex items-center justify-center text-xs mb-5">
              02
            </div>
            <h4 className="text-base font-bold text-white mb-2">Kantarınızı IoT Dongle ile Bağlayın</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tunaylar, Baykon, Esit veya herhangi bir indikatöre takılan IoT dongle ile tartımlar SHA-256 ile şifrelenir.
            </p>
            <div className="mt-6 text-[11px] font-mono text-zinc-500">Süre: ~1 Dakika</div>
          </SpotlightCard>

          <SpotlightCard>
            <div className="w-9 h-9 rounded-full bg-amber-400 text-[#08090C] font-mono font-bold flex items-center justify-center text-xs mb-5">
              03
            </div>
            <h4 className="text-base font-bold text-white mb-2">İlk Sevkiyatınızı Mühürleyin</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Şirket onboarding'inden kendi sektörünüzü seçin ve cezasız, U-ETDS entegre ilk sevkiyatınızı başlatın.
            </p>
            <div className="mt-6 text-[11px] font-mono text-amber-400 font-semibold">Anında Devrede</div>
          </SpotlightCard>
        </div>
      </section>

      {/* Social Proof & Quotes Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-white/[0.08]">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            TÜRKİYE'NİN ÖNCÜ TESİSLERİ GÜVENİYOR
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard className="flex flex-col justify-between text-xs">
            <p className="text-zinc-300 leading-relaxed italic">
              "Kantar fişleri bir tarafta, mikser priz süreleri diğer tarafta kayboluyordu. TONAJ.B2B ile hem şantiyedeki su katma hilelerini kestik hem de U-ETDS cezalarını sıfırladık."
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                O
              </div>
              <div>
                <div className="font-bold text-white">Orhan Karadağ</div>
                <div className="text-[10px] text-zinc-500">Santral Operasyon Şefi • Oyak Beton</div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="flex flex-col justify-between text-xs">
            <p className="text-zinc-300 leading-relaxed italic">
              "Günde 400 kamyon maden çıkışında en büyük korkumuz Karayolları 42 ton cezasıydı. 5 aks bağımsız tartım bariyeri sayesinde tek kuruş ceza ödemedik."
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                S
              </div>
              <div>
                <div className="font-bold text-white">Selim Taşkın</div>
                <div className="text-[10px] text-zinc-500">Ocak ve Lojistik Müdürü • Gebze Agrega</div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="flex flex-col justify-between text-xs">
            <p className="text-zinc-300 leading-relaxed italic">
              "Gelen hurdada çamur ve su firesini kamera ile mühürlemek tartışmaları bitirdi. 9/10 KDV tevkifatı ve MoTAT atık formunu kantar fişiyle tek seferde çözüyoruz."
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center">
                M
              </div>
              <div>
                <div className="font-bold text-white">Mustafa Yıldırım</div>
                <div className="text-[10px] text-zinc-500">Hurda Mal Kabul Şefi • Kroman Çelik</div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* Sticky Bottom Call-to-Action Footer (Slater Signature) */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0B0D11] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Sahanızı tekel standartlarında yönetmeye hazır mısınız?
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Kredi kartı gerekmez. Tesis kantarınızı ve sektör masanızı bugün ücretsiz devreye alın.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoToAuth}
            className="px-6 py-3 bg-white hover:bg-zinc-200 text-[#08090C] font-bold rounded-full text-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Şirket Hesabınızı Başlatın</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">TONAJ.B2B Industrial Operating System</span>
            <span>•</span>
            <span>T.C. Resmi Mevzuat Tam Uyumu</span>
          </div>
          <div>
            © 2026 TONAJ Teknoloji A.Ş. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

    </div>
  );
};