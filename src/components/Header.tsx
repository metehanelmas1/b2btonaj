import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Menu, 
  Home, 
  ChevronRight,
  Building2,
  Mountain,
  Recycle,
  Warehouse,
  Layers,
  Truck,
  ChevronDown,
  Sparkles,
  LogOut
} from 'lucide-react';
import { SectorType, SectorMeta } from '../types';
import { UserSession, api } from '../services/api';

interface HeaderProps {
  activeSector: SectorType;
  onSelectSector: (sector: SectorType) => void;
  onOpenNewWeighing: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleMobileSidebar: () => void;
  activeTabLabel: string;
  onGoHome: () => void;
  onOpenOnboarding?: () => void;
  onLogout?: () => void;
  currentUser: UserSession | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeSector,
  onSelectSector,
  onOpenNewWeighing,
  searchTerm,
  onSearchChange,
  onToggleMobileSidebar,
  activeTabLabel,
  onGoHome,
  onOpenOnboarding,
  onLogout,
  currentUser
}) => {
  const [sectors, setSectors] = useState<SectorMeta[]>([]);

  useEffect(() => {
    api.getSectors().then((data) => {
      if (data && data.length > 0) setSectors(data);
    });
  }, []);

  const currentSector = sectors.find(s => s.id === activeSector);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumb Navigation */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onGoHome}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Anasayfa</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Sector Fixed Corporate Badge (No other sector leakage) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-800 font-mono">
              {currentSector?.name || 'Operasyon'} Masası
            </span>
          </div>

          <div className="hidden xl:block">
            <span className="text-xs text-slate-400 font-medium font-mono">
              • {currentSector?.complianceKey || 'Mevzuat Uyumlu'}
            </span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-sm hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Plaka, Fiş No veya Firma ara..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Right: User & CTA */}
        <div className="flex items-center gap-2.5">
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              title="Kantar Donanım & Bakanlık Kurulum Sihirbazı"
              className="hidden lg:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Kantar Kurulumu</span>
            </button>
          )}

          <button 
            onClick={onOpenNewWeighing}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-2 rounded-lg text-xs transition-all shadow-xs cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Yeni Sevk / Tartım</span>
          </button>

          {currentUser && (
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                {currentUser.name ? currentUser.name[0] : 'U'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-slate-800 leading-tight truncate max-w-[140px]">{currentUser.companyName}</div>
                <div className="text-[10px] text-slate-500 leading-tight truncate max-w-[140px]">{currentUser.role}</div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Güvenli Çıkış Yap"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
