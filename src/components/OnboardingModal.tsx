import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scale, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Cpu,
  Radio,
  Sparkles,
  Building2,
  Mountain,
  Recycle,
  Warehouse,
  Layers,
  Truck
} from 'lucide-react';
import { SectorType } from '../types';
import { api, UserSession } from '../services/api';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | null;
  onCompleted: (updatedUser: UserSession) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  user,
  onCompleted
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSector, setSelectedSector] = useState<SectorType>('antrepo_gumruk');
  const [weighbridgeModel, setWeighbridgeModel] = useState<string>('Baykon BX-23 Endüstriyel');
  const [serialPort, setSerialPort] = useState<string>('COM3 (RS232 / 9600 Baud)');
  const [uetdsCompanyCode, setUetdsCompanyCode] = useState<string>('TR-UETDS-2026-88194');
  const [gibIntegrator, setGibIntegrator] = useState<string>('Logo Özel Entegratör');
  const [enableBarrierLock, setEnableBarrierLock] = useState<boolean>(true);
  const [sitePin, setSitePin] = useState<string>('4819');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync initial sector from user if already defined
  useEffect(() => {
    if (user && user.sector) {
      setSelectedSector(user.sector);
    }
  }, [user]);

  if (!isOpen) return null;

  const sectorOptions: {
    id: SectorType;
    title: string;
    tagline: string;
    icon: React.ComponentType<{ className?: string }>;
    features: string[];
    badge: string;
  }[] = [
    {
      id: 'antrepo_gumruk',
      title: 'Gümrüklü Antrepo & Lojistik',
      tagline: 'Gümrük kapı kantarı, VBS araç sırası ve ardiye/demurrage takibi.',
      icon: Warehouse,
      badge: 'Gümrük ve Dış Ticaret',
      features: ['Özet beyan mühürlü kantar fişi', 'VBS kapı randevusu & tır parkı sırası', 'Serbest bölge & ardiye gün hesabı']
    },
    {
      id: 'beton',
      title: 'Hazır Beton Santrali',
      tagline: 'Mikser priz süresi sayacı, agrega siloları ve şantiye teslimatı.',
      icon: Building2,
      badge: 'Çevre & Şehircilik Uyumu',
      features: ['Mikser 120 dk priz geri sayımı', 'Agrega/çimento silo seviye radarı', 'Şantiye mobil slump ve sıcaklık QR kabulü']
    },
    {
      id: 'tas_ocagi',
      title: 'Taş Ocağı & Agrega Madeni',
      tagline: '5 aks yük dağılımı, MAPEG sevk irsaliyeleri ve kantar toleransı.',
      icon: Mountain,
      badge: 'MAPEG & Karayolları',
      features: ['Karayolları 42 Ton otomatik bariyer kilidi', 'MAPEG Maden sevk irsaliyesi', '±%0.5 kantar tolerans hakemliği']
    },
    {
      id: 'hurda',
      title: 'Hurda Sahası & Geri Dönüşüm',
      tagline: 'Fire ve nem tespiti, 9/10 tevkifat hesabı ve MoTAT formları.',
      icon: Recycle,
      badge: 'GİB Tevkifat & MoTAT',
      features: ['Otomatik fire ve nem oranı kesintisi', '9/10 KDV tevkifatlı net ödeme hesabı', 'Çevre Bakanlığı MoTAT atık beyanı']
    },
    {
      id: 'demir',
      title: 'Demir Çelik Sanayi',
      tagline: 'Nervürlü donatı demiri, profil, metraj/tonaj hesabı ve fabrika sevk kantar fişi.',
      icon: Layers,
      badge: 'Demir Çelik & TS 708',
      features: ['Donatı çapı (Ø8 - Ø32 mm) metraj ➔ tonaj', 'Bağ ve etiket barkodlu fabrika tartımı', 'Şantiye onaylı erken tahsilat & temlik']
    },
    {
      id: 'kereste',
      title: 'Kereste & Orman Ürünleri',
      tagline: 'm³ Hacim ➔ Tonaj çevirici, 5x10 kalıp kereste ve OGM nakliye tezkeresi.',
      icon: Layers,
      badge: 'Orman Bakanlığı & OGM',
      features: ['Kalıp kereste m³ hacim ➔ tonaj hesabı', 'Orman Genel Müdürlüğü nakliye tezkeresi', 'Fırın kurutma nem analizi & fire']
    },
    {
      id: 'nakliye_lojistik',
      title: 'Nakliye & Damper Filo Masası',
      tagline: 'U-ETDS toplu sefer bildirimi ve Boş Dönüş (Backhaul) yük pazarı.',
      icon: Truck,
      badge: 'Ulaştırma Bakanlığı U-ETDS',
      features: ['Tek tıkla toplu U-ETDS sefer bildirimi', 'Boş dönen damperlere anlık yük bulma', 'Damper kantar fişi dijital arşivi']
    }
  ];

  const activeSectorData = sectorOptions.find(s => s.id === selectedSector) || sectorOptions[0];

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Step 5: Complete onboarding
      setIsLoading(true);
      try {
        const token = user?.token || 'tok_demo_active';
        const res = await api.completeOnboarding({
          token,
          sector: selectedSector,
          weighbridgeModel,
          uetdsCompanyCode,
          enableBarrier: enableBarrierLock,
        });

        const updated: UserSession = {
          ...(user || {
            id: 'USR-AUTO',
            email: 'operasyon@sirketiniz.com.tr',
            name: 'Yetkili',
            companyName: 'Aktif Tesis Sanayi A.Ş.',
            taxNo: '1029384756',
            role: 'Tesis Yöneticisi',
            token,
          }),
          sector: selectedSector,
          hasCompletedOnboarding: true,
          weighbridgeModel,
          uetdsCompanyCode,
        };

        localStorage.setItem('tonaj_user_session', JSON.stringify(updated));
        onCompleted(updated);
        onClose();
      } catch (e) {
        console.error(e);
        if (user) {
          const fallback = {
            ...user,
            sector: selectedSector,
            hasCompletedOnboarding: true,
            weighbridgeModel,
            uetdsCompanyCode,
          };
          localStorage.setItem('tonaj_user_session', JSON.stringify(fallback));
          onCompleted(fallback);
        }
        onClose();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[94vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold font-mono tracking-tight text-amber-400">
                CANLI GO API • KURUMSAL KURULUM SİHİRBAZI
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {user ? user.companyName : 'Tesis'} Onboarding
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Step Indicator */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Adım {currentStep} / 5</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => (
              <div 
                key={step}
                className={`w-7 sm:w-10 h-1.5 rounded-full transition-all ${
                  step <= currentStep ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Body Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* STEP 1: FAALİYET ALANI & İLGİ ALANI SEÇİMİ */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Tesisinizin Faaliyet Alanını & İhtisas Masasını Seçin
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Şirketinizin ana çalışma sahasını belirleyin. Seçiminize göre admin paneliniz o sektöre özel operasyon araçlarıyla (kantar, U-ETDS, mevzuat ve mutabakat) başlatılacaktır.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {sectorOptions.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = selectedSector === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedSector(opt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-amber-50/60 border-amber-500 ring-2 ring-amber-500/20 shadow-sm' 
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            isSelected ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                            {opt.badge}
                          </span>
                        </div>

                        <div className="font-bold text-slate-900 text-sm">
                          {opt.title}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {opt.tagline}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1">
                        {opt.features.slice(0, 2).map((feat, idx) => (
                          <div key={idx} className="text-[10px] text-slate-600 flex items-center gap-1.5">
                            <CheckCircle2 className={`w-3 h-3 shrink-0 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: KANTAR İNDİKATÖRÜ & DONANIM EŞLEME */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-600" />
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      Kantar İndikatörü & IoT Donanım Eşleme
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Seçtiğiniz <strong>{activeSectorData.title}</strong> operasyonu için kantar indikatör modelini belirleyin.
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Tesis Kantar İndikatör Markası</label>
                  <select 
                    value={weighbridgeModel}
                    onChange={(e) => setWeighbridgeModel(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer text-xs"
                  >
                    <option value="Baykon BX-23 Endüstriyel">Baykon BX-23 Endüstriyel (Önerilen - Karayolları Uyumlu)</option>
                    <option value="Tunaylar TR-500 Ağır Sanayi">Tunaylar TR-500 Ağır Sanayi Terminali</option>
                    <option value="Esit E-100 Digital Terminal">Esit E-100 Digital Ağır Tonaj İndikatörü</option>
                    <option value="Avery Weigh-Tronix ZM305">Avery Weigh-Tronix ZM305 Otomasyon</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">RS232 IoT Dongle Seri Port Bağlantısı</label>
                  <input 
                    type="text" 
                    value={serialPort}
                    onChange={(e) => setSerialPort(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Dongle verileri doğrudan indikatör anakartından okur; elle tartım değiştirme hilelerini engeller.
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-semibold">İndikatör Bağlantı Durumu:</span>
                  </div>
                  <span className="font-mono font-bold">AKTİF (0.00 KG MÜHÜRLÜ)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: U-ETDS BAKANLIK & GİB e-İRSALİYE */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Bakanlık U-ETDS & GİB e-İrsaliye Entegrasyonu
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Araç tartımdan çıktığı an Ulaştırma Bakanlığı'na sefer bildirimi yapmak ve GİB portalında e-İrsaliye mühürlemek için firma yetkilendirmesi.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">
                    T.C. Ulaştırma Bakanlığı U-ETDS Firma Kodu
                  </label>
                  <input 
                    type="text" 
                    value={uetdsCompanyCode}
                    onChange={(e) => setUetdsCompanyCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">
                    GİB Özel Entegratör Hizmet Sağlayıcısı
                  </label>
                  <select 
                    value={gibIntegrator}
                    onChange={(e) => setGibIntegrator(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer text-xs"
                  >
                    <option value="Logo Özel Entegratör">Logo Özel Entegratör (e-Fatura / e-İrsaliye)</option>
                    <option value="Sovos / Foriba Portal">Sovos / Foriba Portal</option>
                    <option value="Uyumsoft Entegre">Uyumsoft Entegre</option>
                    <option value="Dijital Planet">Dijital Planet</option>
                  </select>
                </div>

                <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kantar tartımı tamamlandığında e-İrsaliye ortalama 4.2 saniyede GİB portalına iletilir.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: 42 TON BARİYER & ŞANTİYE GÜVENLİK */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-rose-600" />
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    42 Ton Karayolları Bariyer Kalkanı & Güvenlik
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Tesis çıkış kapısındaki bariyeri kantar otomasyonuna bağlayarak 60.000 TL aşırı tonaj cezalarını ocak veya fabrika kapısından çıkmadan önleyin.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Aşırı Yükte Otomatik Çıkış Bariyerini Kilitle</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Araç 42.000 KG'ı aştığında bariyer açılmaz, yük dengeleme talep edilir.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enableBarrierLock}
                    onChange={(e) => setEnableBarrierLock(e.target.checked)}
                    className="w-4 h-4 accent-slate-900 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">
                    Şantiye Yetkilisi Hızlı Doğrulama PIN Kodu
                  </label>
                  <input 
                    type="text" 
                    value={sitePin}
                    onChange={(e) => setSitePin(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono font-bold text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Şantiye şefi cep telefonundan teslim alırken bu PIN kodunu kullanarak teslimatı doğrular.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ONAY & ADMIN PANELİNE GEÇİŞ */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center py-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Tesis Kurulumu Go API Tarafından Doğrulandı!
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Faaliyet alanınız <strong>{activeSectorData.title}</strong> olarak kaydedildi. Şimdi doğrudan ihtisas operasyon masanıza aktarılacaksınız.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500">Şirket / Tesis:</span>
                  <span className="font-bold text-slate-800">{user?.companyName || 'Aktif Tesis'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500">Seçilen Admin Masası:</span>
                  <span className="font-bold text-amber-600">{activeSectorData.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500">Kantar İndikatörü:</span>
                  <span className="font-bold text-slate-800">{weighbridgeModel}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500">U-ETDS Firma Kodu:</span>
                  <span className="font-bold text-slate-800">{uetdsCompanyCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">42T Bariyer Kalkanı:</span>
                  <span className="font-bold text-emerald-600">AKTİF & ENTEGRE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-white">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStep === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Geri</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            {isLoading ? (
              <span>Kaydediliyor...</span>
            ) : currentStep < 5 ? (
              <>
                <span>Devam Et</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>{activeSectorData.title} Admin Masasını Başlat</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};