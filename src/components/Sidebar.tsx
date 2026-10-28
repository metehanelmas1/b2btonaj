import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Layers, 
  Truck, 
  ShieldCheck, 
  Coins, 
  ChevronDown, 
  ShieldAlert, 
  Home, 
  LogOut, 
  X, 
  Building2, 
  Mountain, 
  Recycle, 
  Warehouse,
  Sparkles,
  Sliders
} from 'lucide-react';
import { SectorType, SectorMeta } from '../types';
import { UserSession, api } from '../services/api';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  activeSector: SectorType;
  onSelectSector: (sector: SectorType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onGoHome: () => void;
  onOpenAuth: () => void;
  onOpenOnboarding?: () => void;
  onLogout?: () => void;
  currentUser: UserSession | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeSector,
  onSelectSector,
  isOpenMobile,
  onCloseMobile,
  onGoHome,
  onOpenAuth,
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

  const currentSectorMeta = sectors.find(s => s.id === activeSector);

  // Specific clean items tailored to the sector
  const getNavItemsForSector = () => {
    switch (activeSector) {
      case 'beton':
        return [
          { id: 'sectors', label: 'Mikser Priz & Silo Masası', desc: 'Slump geri sayacı & agrega siloları', icon: Building2 },
          { id: 'weighbridge', label: 'Santral Kantarı & Tartım', desc: 'Mikser çıkış ve hammadde tartımları', icon: Scale },
          { id: 'risk', label: 'Tonaj Skor™ İstihbarat', desc: 'Müteahhit ve şantiye risk sicili', icon: ShieldAlert },
          { id: 'financial', label: 'Finans & Erken Nakit', desc: 'Şantiye onaylı fatura tahsilatı', icon: Coins }
        ];
      case 'tas_ocagi':
        return [
          { id: 'sectors', label: 'Ocak & Maden Masası', desc: '5 aks dağılımı & MAPEG sevk izinleri', icon: Mountain },
          { id: 'weighbridge', label: 'Kantar & Bariyer Kilidi', desc: 'Karayolları 42 ton ceza kalkanı', icon: Scale },
          { id: 'backhaul', label: 'Boş Damper Yük Havuzu', desc: 'Dönen kamyonlara dönüş navlunu', icon: Truck },
          { id: 'risk', label: 'Tonaj Skor™ İstihbarat', desc: 'Bölgesel alıcı risk sorgulama', icon: ShieldAlert },
          { id: 'financial', label: 'Kantar Tolerans Mutabakatı', desc: '±%0.5 yasal tartım hakemliği', icon: Coins }
        ];
      case 'hurda':
        return [
          { id: 'sectors', label: 'Hurda Mal Kabul Masası', desc: 'Fire/su tespiti & 9/10 tevkifat', icon: Recycle },
          { id: 'weighbridge', label: 'Hurda Saha Kantarı', desc: 'Giriş/çıkış araç tartımları', icon: Scale },
          { id: 'compliance', label: 'MoTAT Atık Formları', desc: 'Çevre Bakanlığı tehlikesiz atık mühürleri', icon: ShieldCheck },
          { id: 'risk', label: 'Tonaj Skor™ İstihbarat', desc: 'Hurda tedarikçi güven endeksi', icon: ShieldAlert },
          { id: 'financial', label: 'Finans & Tevkifat Hesabı', desc: 'Net ödeme ve erken tahsilat', icon: Coins }
        ];
      case 'antrepo_gumruk':
        return [
          { id: 'sectors', label: 'Antrepo & Kapı Randevusu', desc: 'VBS araç sırası & demurrage sayacı', icon: Warehouse },
          { id: 'weighbridge', label: 'Gümrüklü Kapı Kantarı', desc: 'Özet beyan mühürlü tartım', icon: Scale },
          { id: 'compliance', label: 'Mevzuat & U-ETDS Defteri', desc: 'Bakanlık sınır ve süre uyumu', icon: ShieldCheck },
          { id: 'risk', label: 'Tonaj Skor™ İstihbarat', desc: 'İthalatçı ve lojistikçi sicili', icon: ShieldAlert }
        ];
      case 'demir':
        return [
          { id: 'sectors', label: 'Demir & Metraj Masası', desc: 'Ø8-Ø32 donatı metraj/tonaj & bağ sevki', icon: Layers },
          { id: 'weighbridge', label: 'Demir Fabrika Kantarı', desc: 'Sal kasa tır çıkış ve donatı tartımları', icon: Scale },
          { id: 'risk', label: 'Tonaj Skor™ Şantiye İstihbaratı', desc: 'Müteahhit ve alıcı vadeli limit sicili', icon: ShieldAlert },
          { id: 'financial', label: 'Demir İrsaliye Finansı', desc: 'Şantiye onaylı erken nakit tahsilatı', icon: Coins }
        ];
      case 'kereste':
        return [
          { id: 'sectors', label: 'Kereste & Hacim Masası', desc: 'm³ hacim hesabı & 5x10 kalıp kereste', icon: Layers },
          { id: 'weighbridge', label: 'Kereste & Tomruk Kantarı', desc: 'Araç başı tomruk/kereste tartımları', icon: Scale },
          { id: 'compliance', label: 'OGM Nakliye Tezkeresi', desc: 'Orman Bakanlığı izin ve sevk defteri', icon: ShieldCheck },
          { id: 'risk', label: 'Tonaj Skor™ İstihbarat', desc: 'Alıcı şantiye ve tüccar güven skoru', icon: ShieldAlert }
        ];
      case 'nakliye_lojistik':
      default:
        return [
          { id: 'sectors', label: 'Filo Operasyon Masası', desc: 'U-ETDS toplu sevk & filo durumu', icon: Truck },
          { id: 'backhaul', label: 'Boş Dönüş (Backhaul) Pazarı', desc: 'Anlık bölgesel dökme yük ilanları', icon: Truck },
          { id: 'weighbridge', label: 'Sefer Fişleri Kayıtları', desc: 'Kantardan inen araç seferleri', icon: Scale },
          { id: 'compliance', label: 'U-ETDS Ceza Kalkanı', desc: 'Otomatik sefer bildirim kaydı', icon: ShieldCheck },
          { id: 'financial', label: 'Erken Navlun Ödemesi', desc: '24 saatte erken nakit akışı', icon: Coins }
        ];
    }
  };

  const navItems = getNavItemsForSector();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div 
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-xs">
              <Scale className="w-4 h-4 text-amber-400 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 font-mono group-hover:text-amber-600 transition-colors">
                  TONAJ<span className="text-amber-500">.B2B</span>
                </span>
                <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Ağır Sanayi İşletim Sistemi</p>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dedicated Sector Banner in Sidebar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
            Aktif Çalışma Alanı
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 truncate">
              {currentSectorMeta?.name || 'Sektör Portalı'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              Ayrılmış Portal
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">
            {currentSectorMeta?.complianceKey || 'Mevzuat Uyumlu'}
          </div>
        </div>

        {/* Navigation Items (Tailored solely to this sector) */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Sektörel Operasyonlar
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs leading-none truncate">{item.label}</div>
                  <div className={`text-[10px] mt-1 truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Onboarding / Tesis Donanım Kurulumu CTA */}
        {onOpenOnboarding && (
          <div className="px-3 pt-2">
            <button
              onClick={onOpenOnboarding}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
                <span className="text-[11px] font-bold">Kantar Kurulum Sihirbazı</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-amber-200/70 text-amber-950 px-1.5 py-0.5 rounded">
                Go API
              </span>
            </button>
          </div>
        )}

        {/* Tesis İhtisas Bilgi Kartı (Sadece Kendi İhtisası) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-1.5">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold px-1 flex items-center justify-between">
            <span>Saha İhtisas Masası</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="font-bold text-slate-800 text-xs">
              {currentSectorMeta?.name || 'Tesis Operasyonu'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              {currentSectorMeta?.complianceKey || 'Mevzuat Uyumlu'}
            </div>
          </div>
        </div>

        {/* User Pill & Logout */}
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              {currentUser ? currentUser.name[0] : 'K'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentUser ? currentUser.companyName : 'Misafir Kullanıcı'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {currentUser ? currentUser.name : 'Demo Erişimi'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout ? onLogout : onOpenAuth}
            title={onLogout ? "Güvenli Çıkış Yap" : "Giriş Yap"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
