import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Scale, 
  Layers, 
  Truck, 
  ShieldCheck, 
  Coins, 
  ShieldAlert, 
  Radio, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { OnboardingModal } from './components/OnboardingModal';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WeighbridgeLive } from './components/WeighbridgeLive';
import { SectorOperations } from './components/SectorOperations';
import { BackhaulMarketplace } from './components/BackhaulMarketplace';
import { ComplianceHub } from './components/ComplianceHub';
import { FinancialSettlement } from './components/FinancialSettlement';
import { RiskIntelligenceRadar } from './components/RiskIntelligenceRadar';
import { TicketDetailModal } from './components/TicketDetailModal';
import { NewWeighingModal } from './components/NewWeighingModal';
import { SiteDeliveryModal } from './components/SiteDeliveryModal';
import { SectorType, SectorMeta, WeighingRecord } from './types';
import { api, UserSession } from './services/api';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'portal'>('landing');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const [sectors, setSectors] = useState<SectorMeta[]>([]);
  const [activeSector, setActiveSector] = useState<SectorType>('antrepo_gumruk');
  const [activeTab, setActiveTab] = useState<string>('sectors');
  const [records, setRecords] = useState<WeighingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<WeighingRecord | null>(null);
  const [siteDeliveryRecord, setSiteDeliveryRecord] = useState<WeighingRecord | null>(null);
  const [isNewWeighingOpen, setIsNewWeighingOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('Go API Bağlanıyor...');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Restore user session and load master data on mount
  useEffect(() => {
    const saved = localStorage.getItem('tonaj_user_session');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setCurrentUser(u);
        if (u.sector) {
          setActiveSector(u.sector);
        }
      } catch (e) {
        // ignore
      }
    }

    // Health check Go API
    api.health().then((h) => {
      setApiStatus(`${h.engine} Aktif`);
    }).catch(() => {
      setApiStatus('Go API Çevrimdışı (Yedek Mod)');
    });

    // Load sectors from Go API
    api.getSectors().then((secList) => {
      if (secList && secList.length > 0) {
        setSectors(secList);
      }
    });
  }, []);

  // Fetch weighings from Go API when sector or search changes
  useEffect(() => {
    api.getWeighings(activeSector, searchTerm).then((data) => {
      setRecords(data || []);
    });
  }, [activeSector, searchTerm]);

  const handleApproveUetds = async (recordId: string) => {
    try {
      const res = await api.approveUetds(recordId);
      setRecords(prev => prev.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            uetdsStatus: 'APPROVED',
            uetdsCode: res.uetdsCode
          };
        }
        return r;
      }));
      showNotification(`U-ETDS Kodu (${res.uetdsCode}) Go API ile Bakanlık veri tabanına yazıldı!`);
    } catch {
      showNotification('U-ETDS onayı işlenemedi.');
    }
  };

  const handleAddRecord = async (newRecord: WeighingRecord) => {
    try {
      const created = await api.createWeighing(newRecord);
      setRecords(prev => [created, ...prev]);
      showNotification(`${created.plate} için kantar tartımı Go API veri tabanına mühürlendi!`);
    } catch {
      showNotification('Tartım kaydedilemedi.');
    }
  };

  const handleConfirmSiteDelivery = async (recordId: string, approverName: string) => {
    try {
      const res = await api.confirmSiteDelivery(recordId, approverName);
      setRecords(prev => prev.map(r => {
        if (r.id === recordId) {
          return res.record;
        }
        return r;
      }));
      showNotification(`Şantiye Teslimatı Onaylandı (${approverName})! e-İrsaliye Go API ile mühürlendi.`);
    } catch {
      showNotification(`Teslimat onaylanırken hata oluştu.`);
    }
  };

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    if (user.sector) {
      setActiveSector(user.sector);
    }
    setActiveTab('sectors');
    setCurrentView('portal');
    showNotification(`Giriş başarılı! Hoş geldiniz ${user.companyName}.`);

    // Trigger onboarding modal if user hasn't completed it yet
    if (!user.hasCompletedOnboarding) {
      setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 300);
    }
  };

  const handleOnboardingCompleted = (updatedUser: UserSession) => {
    setCurrentUser(updatedUser);
    setActiveSector(updatedUser.sector);
    setActiveTab('sectors');
    setIsOnboardingOpen(false);
    showNotification(`${updatedUser.companyName} için ${updatedUser.sector.toUpperCase()} admin masası başlatıldı!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('tonaj_user_session');
    localStorage.removeItem('tonaj_auth_token');
    setCurrentUser(null);
    setCurrentView('landing');
    setIsOnboardingOpen(false);
    showNotification('Güvenli çıkış yapıldı. Kantar oturumu kilitlendi.');
  };

  const currentSectorMeta = sectors.find(s => s.id === activeSector);

  const getTabTitle = () => {
    const sectorName = currentSectorMeta?.name || 'Sektör';
    switch (activeTab) {
      case 'sectors': return `${sectorName} • Özel Operasyon Masası`;
      case 'weighbridge': return `${sectorName} • Kantar & Tartım İşlemleri`;
      case 'risk': return 'Tonaj Skor™: B2B İstihbarat & Kara Liste';
      case 'backhaul': return 'Boş Dönüş (Backhaul) Dökme Yük Pazarı';
      case 'compliance': return 'Mevzuat Denetimi & Ceza Kalkanı';
      case 'financial': return 'B2B Finans, Mutabakat & Erken Nakit';
      default: return sectorName;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. PUBLIC LANDING PAGE (Pure Information, Zero Gate Leakage) */}
      {currentView === 'landing' && (
        <LandingPage 
          onGoToAuth={() => setCurrentView('auth')}
        />
      )}

      {/* 2. DEDICATED FULL-PAGE CORPORATE AUTH (Modern, Elegant, Simple) */}
      {currentView === 'auth' && (
        <AuthPage 
          onLoginSuccess={handleLoginSuccess}
          onGoHome={() => setCurrentView('landing')}
        />
      )}

      {/* 3. DEDICATED SECTOR PORTAL WORKSPACE (Admin Paneli) */}
      {currentView === 'portal' && (
        <div className="flex flex-1 min-h-screen">
          {/* Left Clean Sidebar tailored to the specific sector */}
          <Sidebar 
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            activeSector={activeSector}
            onSelectSector={(sec) => {
              setActiveSector(sec);
              setActiveTab('sectors');
              showNotification(`Portal değiştirildi.`);
            }}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onGoHome={() => setCurrentView('landing')}
            onOpenAuth={() => setCurrentView('auth')}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onLogout={handleLogout}
            currentUser={currentUser}
          />

          {/* Main Content Area */}
          <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
            {/* Clean Corporate Header */}
            <Header 
              activeSector={activeSector}
              onSelectSector={(sec) => {
                setActiveSector(sec);
                setActiveTab('sectors');
              }}
              onOpenNewWeighing={() => setIsNewWeighingOpen(true)}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
              activeTabLabel={getTabTitle()}
              onGoHome={() => setCurrentView('landing')}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              onLogout={handleLogout}
              currentUser={currentUser}
            />

            {/* Page Content Body */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {activeTab === 'sectors' && (
                <SectorOperations 
                  activeSector={activeSector}
                  onSelectSector={setActiveSector}
                  onOpenWeighing={() => setIsNewWeighingOpen(true)}
                />
              )}

              {activeTab === 'weighbridge' && (
                <WeighbridgeLive 
                  records={records}
                  activeSector={activeSector}
                  onSelectRecord={(r) => setSelectedRecord(r)}
                  onApproveUetds={handleApproveUetds}
                  onOpenSiteDelivery={(r) => setSiteDeliveryRecord(r)}
                />
              )}

              {activeTab === 'risk' && (
                <RiskIntelligenceRadar />
              )}

              {activeTab === 'backhaul' && (
                <BackhaulMarketplace />
              )}

              {activeTab === 'compliance' && (
                <ComplianceHub />
              )}

              {activeTab === 'financial' && (
                <FinancialSettlement />
              )}
            </main>

            {/* Corporate Footer with Live Go Engine Status */}
            <footer className="mt-auto bg-white border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-500">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">TONAJ B2B • {currentSectorMeta?.name || 'Sektör'} Portalı</span>
                  <span>•</span>
                  <span>U-ETDS ve GİB e-İrsaliye Entegre</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {apiStatus}
                  </span>
                  <span>•</span>
                  <button 
                    onClick={() => setCurrentView('landing')}
                    className="hover:text-slate-800 transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Anasayfaya Dön
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedRecord && (
        <TicketDetailModal 
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onApproveUetds={handleApproveUetds}
        />
      )}

      {/* New Weighing Modal */}
      <NewWeighingModal 
        isOpen={isNewWeighingOpen}
        onClose={() => setIsNewWeighingOpen(false)}
        onAddRecord={handleAddRecord}
        defaultSector={activeSector}
      />

      {/* Site Delivery Sign-off Modal */}
      {siteDeliveryRecord && (
        <SiteDeliveryModal 
          record={siteDeliveryRecord}
          isOpen={!!siteDeliveryRecord}
          onClose={() => setSiteDeliveryRecord(null)}
          onConfirmDelivery={handleConfirmSiteDelivery}
        />
      )}

      {/* Onboarding Wizard Modal */}
      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        user={currentUser}
        onCompleted={handleOnboardingCompleted}
      />
    </div>
  );
}