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
  ExternalLink,
  Lock,
  Zap,
  TrendingUp,
  Cpu,
  BarChart3,
  Layers3,
  Flame,
  Clock,
  Sparkles
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

const bentoCardVariants: Variants = {
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

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  const [sectors, setSectors] = useState<SectorMeta[]>([]);
  const [activePreviewSector, setActivePreviewSector] = useState<SectorType>('beton');
  const [telemetryData, setTelemetryData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { name: 'Mevzuat & U-ETDS', href: '#compliance' },
    { name: 'Finansal Mutabakat', href: '#settlement' },
    { name: 'Hızlı Geçiş', href: '#switch' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F8FAFC] font-geist selection:bg-amber-400 selection:text-[#0B0D10] relative overflow-x-hidden">
      
      {/* 4K Cinematic Industrial Background Layer — Distinctly Visible Yet Balanced */}
      <div className="absolute top-0 left-0 right-0 h-[860px] pointer-events-none overflow-hidden z-0 select-none">
        <motion.div 
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.75 }}
          transition={{ duration: 1.6, ease: EASE_PREMIUM }}
          className="w-full h-full relative"
        >
          <img 
            src="/hero-industrial-bg.jpg" 
            alt="Ağır Sanayi Terminali ve Kantar Sahası" 
            className="w-full h-full object-cover object-center filter contrast-[1.12] brightness-[0.88] saturate-[1.25]"
          />
          {/* Subtle Top & Bottom Gradient Bleeds for Pristine Blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10]/80 via-transparent to-[#0B0D10]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,_rgba(11,13,16,0.65)_0%,_#0B0D10_90%)]" />
        </motion.div>
      </div>

      {/* Slater Ambient Lighting & Grid Cones */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] slater-glow-cone pointer-events-none z-0 opacity-40"></div>
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute inset-0 slater-grid-pattern pointer-events-none z-0 opacity-40"></div>

      {/* Floating Pill Navigation Bar (Precision Responsive Slater-Style) */}
      <motion.div 
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: EASE_PREMIUM }}
        className="sticky top-3 sm:top-5 z-50 w-full max-w-6xl mx-auto px-3 sm:px-6"
      >
        <header className="rounded-full bg-[#111317]/90 backdrop-blur-2xl border border-white/10 px-3.5 sm:px-5 py-2.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
          
          {/* Logo & Platform Tag */}
          <a href="#" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0B0D10] font-bold shadow-md transition-transform group-hover:scale-105">
              <Scale className="w-4 h-4 text-[#0B0D10] stroke-[2.5]" />
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
          <nav className="hidden lg:flex items-center gap-6 text-[13px] text-zinc-300 font-medium">
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
              className="px-4 sm:px-5 py-2 bg-white hover:bg-zinc-100 text-[#0B0D10] font-bold rounded-full text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center gap-1.5 cursor-pointer group"
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
              className="lg:hidden mt-2 p-5 rounded-3xl bg-[#121418]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4"
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
                  className="w-full py-2.5 rounded-full text-center text-xs font-bold text-[#0B0D10] bg-white hover:bg-zinc-200 transition-colors shadow-lg"
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
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-zinc-100 text-[#0B0D10] font-bold rounded-full text-sm shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Ücretsiz Şirket Hesabı Aç</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#sectors"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Canlı Sektör Demosunu Gör</span>
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
          className="rounded-3xl border border-white/10 bg-[#121418] shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          
          {/* Terminal Window Header Bar */}
          <div className="px-5 py-4 border-b border-white/10 bg-[#16181D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
          <div className="p-4 bg-[#0E1014] border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none">
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
                      ? 'bg-white text-[#0B0D10] shadow-md font-bold'
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
          <div className="p-6 sm:p-8 bg-[#0B0D10]/95 min-h-[380px] flex flex-col justify-between">
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
                className="px-5 py-2.5 rounded-full bg-white text-[#0B0D10] font-bold text-xs hover:bg-zinc-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Bu Masayı Şirketinizde Başlatın</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Slater-Style Bento Grid (Features Section) with Full Framer Motion */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20" id="features">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            TEKEL STANDARTLARINDA ÇÖZÜMLER
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5">
            Sıradan programlar değil, ağır sanayinin dijital zırhı.
          </h2>
          <p className="text-sm text-zinc-400 mt-3.5">
            Sahadaki her ceza riskini, tartım kaçağını ve nakit tıkanıklığını kantar üstünde çözen kurumsal mimari.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          
          {/* Card 1: 42 Ton Karayolları Bariyer Zırhı */}
          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.22)', transition: { duration: 0.25, ease: EASE_PREMIUM } }}
            className="md:col-span-2 rounded-3xl p-8 slater-card slater-card-interactive flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Karayolları Ceza Kalkanı
              </span>
              <h3 className="text-2xl font-bold text-white mt-1.5 mb-3">
                42 Ton Otomatik Çıkış Bariyeri & 5-Aks Yük Dengelemesi
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                Kantar tartımında Karayolları 42.000 KG sınırını veya aks başı limitleri aşan araçların çıkış bariyeri otomatik kilitlenir. Şirketinize gelecek 58.400 ₺ ceza ve devrilme riski kantardan çıkmadan önlenir.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-[#0B0D10] border border-white/10 grid grid-cols-3 gap-3 text-center font-mono text-xs">
              <div>
                <div className="text-zinc-500 text-[10px]">Ön Aks</div>
                <div className="text-white font-bold text-sm mt-0.5">6.850 KG</div>
                <div className="text-emerald-400 text-[10px]">Limit: 7.500 KG</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Çeker Aks</div>
                <div className="text-white font-bold text-sm mt-0.5">11.200 KG</div>
                <div className="text-emerald-400 text-[10px]">Limit: 11.500 KG</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Römork 3 Aks</div>
                <div className="text-white font-bold text-sm mt-0.5">23.200 KG</div>
                <div className="text-emerald-400 text-[10px]">Limit: 24.000 KG</div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: U-ETDS ve GİB Otomasyonu */}
          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.22)', transition: { duration: 0.25, ease: EASE_PREMIUM } }}
            className="rounded-3xl p-8 slater-card slater-card-interactive flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Resmi Mevzuat Motoru
              </span>
              <h3 className="text-xl font-bold text-white mt-1.5 mb-3">
                U-ETDS & e-İrsaliye 4.2 Saniyede Mühürleme
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Kamyon kantardan indiği an şoförün TC'si, plaka, yük cinsi ve net tonaj Ulaştırma Bakanlığı'na yazılır ve karekodlu e-irsaliye üretilir.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs space-y-2">
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>İşlem Süresi:</span>
                <span className="text-emerald-400 font-bold">4.2 Saniye</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Bakanlık Kodu:</span>
                <span className="text-white font-bold">UETDS-TR-2026</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Metroloji Hakemliği & 24 Saatte Erken Nakit */}
          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.22)', transition: { duration: 0.25, ease: EASE_PREMIUM } }}
            className="rounded-3xl p-8 slater-card slater-card-interactive flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                Finansal Hakemlik
              </span>
              <h3 className="text-xl font-bold text-white mt-1.5 mb-3">
                ±%0.5 Kantar Hakemliği & 24 Saatte Erken Tahsilat
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                İki kantar arasındaki tartım farkı uyuşmazlığını Sanayi Bakanlığı yasal toleransıyla anında çözün. Onaylı irsaliyelerinizi 90 gün beklemeden 24 saatte bankadan nakde çevirin.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs space-y-2">
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Yasal Tolerans:</span>
                <span className="text-white font-bold">±%0.5 Sanayi Bakanlığı</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Erken İskonto:</span>
                <span className="text-emerald-400 font-bold">T+1 (24 Saatte Nakit)</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Boş Dönüş Backhaul Pazaryeri */}
          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.22)', transition: { duration: 0.25, ease: EASE_PREMIUM } }}
            className="md:col-span-2 rounded-3xl p-8 slater-card slater-card-interactive flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-6">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Filo Karlılığı
              </span>
              <h3 className="text-2xl font-bold text-white mt-1.5 mb-3">
                Boş Dönüş (Backhaul) Pazaryeri: Boş Kamyon Dönüşünü Sıfırlayın
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                Ocaklara, antrepolara veya fabrikalara boş dönen damper ve silobaslar için anlık dökme yük eşleşmesi. Sefer başına 8.500 ₺ - 16.200 ₺ ek navlun kazanın, boş kilometre israfını sıfıra indirin.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs">
                <div className="text-zinc-500 text-[10px]">Boş Sefer Oranı</div>
                <div className="text-emerald-400 font-bold text-base mt-0.5">%9'a İndi</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs">
                <div className="text-zinc-500 text-[10px]">Aylık Filo Tasarrufu</div>
                <div className="text-white font-bold text-base mt-0.5">318.000 ₺</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs">
                <div className="text-zinc-500 text-[10px]">Kazanılan Mesafe</div>
                <div className="text-white font-bold text-base mt-0.5">14.280 KM</div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* Compliance & Ministerial Automation Section (#compliance) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-white/[0.08]" id="compliance">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            MEVZUAT & BAKANLIK CEZA KALKANI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5">
            Cezalardan korkmayın. Sistem her evrakı yasal süresinde mühürler.
          </h2>
          <p className="text-sm text-zinc-400 mt-3.5">
            Ulaştırma, Hazine & Maliye, Maden ve Çevre Bakanlığı mevzuatlarına %100 tam uyumlu altyapı.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-5"
        >
          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.25)' }}
            className="p-6 rounded-3xl slater-card border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-emerald-400 font-mono text-xs font-bold mb-2">U-ETDS</div>
              <h4 className="text-base font-bold text-white mb-2">Ulaştırma Bakanlığı</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Her sefer 6 saatlik yasal süreye gerek kalmadan kantar fişinden saniyesinde bildirilir.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>0 Ceza Riski</span>
            </div>
          </motion.div>

          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.25)' }}
            className="p-6 rounded-3xl slater-card border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-amber-400 font-mono text-xs font-bold mb-2">GİB E-İRSALİYE</div>
              <h4 className="text-base font-bold text-white mb-2">Karekodlu E-İrsaliye</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                GİB standartlarında matbu kağıt irsaliye devrini bitiren dijital karekodlu sevkiyat.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-amber-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>GİB Entegratör Hazır</span>
            </div>
          </motion.div>

          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.25)' }}
            className="p-6 rounded-3xl slater-card border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-blue-400 font-mono text-xs font-bold mb-2">MAPEG & RÜSUM</div>
              <h4 className="text-base font-bold text-white mb-2">Maden & Belediye Payı</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Maden sevk fişleri, e-Maden sicil kodları ve belediye rüsum payı otomatik hesaplanır.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-blue-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Otomatik Beyanname</span>
            </div>
          </motion.div>

          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.25)' }}
            className="p-6 rounded-3xl slater-card border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-rose-400 font-mono text-xs font-bold mb-2">MOTAT & TEVKİFAT</div>
              <h4 className="text-base font-bold text-white mb-2">Çevre & Hurda Kontrolü</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Atık taşıma formları ve 9/10 KDV tevkifatlı fatura eşleşmesi kantar başında mühürlenir.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-rose-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>MoTAT Uyumlu</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Financial Settlement & Factoring Section (#settlement) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-white/[0.08]" id="settlement">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#13151A] to-[#0E1014] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-amber-500/10 blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                FİNANSAL GÜVENCE & NAKİT AKIŞI
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5">
                Kantar farkı uyuşmazlığına son.<br />
                90 günlük vadeyi 24 saate indirin.
              </h2>
              <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                Gönderici ve alıcı kantar tartımları Sanayi Bakanlığı yasal ±%0.5 tolerans limitleri dahilindeyse sistem finansal mutabakatı anında onaylar. Onaylanan irsaliye için banka entegrasyonuyla 24 saatte T+1 erken nakit avansı çekebilirsiniz.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">14.8M ₺</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Çözülen Tartım Hacmi</div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white">%80 Avans</div>
                  <div className="text-xs text-zinc-400 mt-0.5">T+1 Banka Faktoring Oranı</div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                <div>
                  <div className="text-2xl font-bold font-mono text-amber-400">24 Saat</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Hesaba Geçiş Süresi</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-zinc-400">
                <span className="font-bold text-white">Canlı Hakemlik Simülasyonu</span>
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                  OTOMATİK ÇÖZÜM
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Gönderici Kantar Net:</span>
                  <span className="text-white font-bold">28.800 KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Alıcı Şantiye Kantar Net:</span>
                  <span className="text-white font-bold">28.720 KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tartım Farkı:</span>
                  <span className="text-amber-400 font-bold">80 KG (%0.27)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sanayi Bakanlığı Toleransı:</span>
                  <span className="text-emerald-400 font-bold">±144 KG (Yasal Sınır İçinde)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-emerald-400 font-bold">
                <span>Sonuç: Uyuşmazlık Reddedildi</span>
                <span>Fatura Onaylandı</span>
              </div>
            </div>
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

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.25)' }}
            className="p-7 rounded-3xl slater-card border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-full bg-white/10 text-white font-mono font-bold flex items-center justify-center text-xs mb-5">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2">Müşteri ve İrsaliye Geçmişinizi Aktarın</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Excel, SAP, Logo veya eski kantar programınızdaki müşteri ve ürün listesini tek tıkla sisteme yükleyin.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-zinc-500">Süre: ~2 Dakika</div>
          </motion.div>

          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.25)' }}
            className="p-7 rounded-3xl slater-card border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-full bg-white/10 text-white font-mono font-bold flex items-center justify-center text-xs mb-5">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2">Kantarınızı IoT Dongle ile Bağlayın</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tunaylar, Baykon, Esit veya herhangi bir indikatöre takılan IoT dongle ile tartımlar SHA-256 ile şifrelenir.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-zinc-500">Süre: ~1 Dakika</div>
          </motion.div>

          <motion.div 
            variants={bentoCardVariants}
            whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.25)' }}
            className="p-7 rounded-3xl slater-card border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-full bg-amber-400 text-[#0B0D10] font-mono font-bold flex items-center justify-center text-xs mb-5">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2">İlk Sevkiyatınızı Mühürleyin</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Şirket onboarding'inden kendi sektörünüzü seçin ve cezasız, U-ETDS entegre ilk sevkiyatınızı başlatın.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-amber-400 font-semibold">Anında Devrede</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof & Quotes Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-white/[0.08]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            TÜRKİYE'NİN ÖNCÜ TESİSLERİ GÜVENİYOR
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl slater-card border border-white/10 flex flex-col justify-between text-xs"
          >
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
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl slater-card border border-white/10 flex flex-col justify-between text-xs"
          >
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
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl slater-card border border-white/10 flex flex-col justify-between text-xs"
          >
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
          </motion.div>
        </div>
      </section>

      {/* Sticky Bottom Call-to-Action Footer (Slater Signature) */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0E1014] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
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
            className="px-6 py-3 bg-white hover:bg-zinc-200 text-[#0B0D10] font-bold rounded-full text-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
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