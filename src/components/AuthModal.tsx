import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scale, 
  Lock, 
  Mail, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Mountain,
  Recycle,
  Warehouse,
  Layers,
  Truck,
  UserCheck
} from 'lucide-react';
import { SectorType } from '../types';
import { api, UserSession } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserSession) => void;
  initialSector?: SectorType;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialSector
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [email, setEmail] = useState('orhan.karadag@oyakbeton.com.tr');
  const [password, setPassword] = useState('123456');
  const [selectedSector, setSelectedSector] = useState<SectorType>(initialSector || 'beton');

  // Register additional fields
  const [companyName, setCompanyName] = useState('Anadolu Hazır Beton A.Ş.');
  const [taxNo, setTaxNo] = useState('5840192841');
  const [role, setRole] = useState('Santral Operasyon Müdürü');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialSector) {
      setSelectedSector(initialSector);
      // Auto-populate matching demo email if available
      const match = demoProfiles.find(d => d.sector === initialSector);
      if (match) {
        setEmail(match.email);
        setCompanyName(match.company);
        setRole(match.role);
      }
    }
  }, [initialSector, isOpen]);

  if (!isOpen) return null;

  const demoProfiles = [
    {
      company: 'Oyak Beton Ataşehir',
      name: 'Orhan Karadağ',
      email: 'orhan.karadag@oyakbeton.com.tr',
      role: 'Santral Operasyon Şefi',
      sector: 'beton' as SectorType,
      desc: 'Mikser priz takibi & agrega silosu'
    },
    {
      company: 'Gebze Agrega & Maden',
      name: 'Selim Taşkın',
      email: 'selim.taskin@gebzemaden.com.tr',
      role: 'Ocak ve Kantar Müdürü',
      sector: 'tas_ocagi' as SectorType,
      desc: 'Kantar bariyer kilidi & MAPEG sevk'
    },
    {
      company: 'Kroman Çelik Hurda Sahası',
      name: 'Mustafa Yıldırım',
      email: 'mustafa.yildirim@kromancelik.com.tr',
      role: 'Hurda Mal Kabul Eksperi',
      sector: 'hurda' as SectorType,
      desc: 'Fire tespiti & 9/10 KDV tevkifat'
    },
    {
      company: 'Ambarlı A Tipi Genel Antrepo',
      name: 'Engin Yılmaz',
      email: 'engin.yilmaz@ambarliantrepo.com.tr',
      role: 'Gümrüklü Saha Sorumlusu',
      sector: 'antrepo_gumruk' as SectorType,
      desc: 'Kapı randevusu VBS & ardiye'
    },
    {
      company: 'Kroman Çelik Sanayi A.Ş.',
      name: 'Hasan Çetin',
      email: 'hasan.cetin@kromancelik.com.tr',
      role: 'Sevkiyat ve Kantar Şefi',
      sector: 'demir' as SectorType,
      desc: 'Nervürlü donatı metraj hesabı & sevk'
    },
    {
      company: 'İnegöl Kereste Fabrikası',
      name: 'Salih Orman',
      email: 'salih.orman@inegolkereste.com.tr',
      role: 'Kereste Depo Müdürü',
      sector: 'kereste' as SectorType,
      desc: 'Hacim/tonaj çevrimi & OGM tezkeresi'
    },
    {
      company: 'Dilovası Damper & Lojistik Filosu',
      name: 'Kadir Balcı',
      email: 'kadir.balci@dilovasilojistik.com.tr',
      role: 'Filo Sevk Müdürü',
      sector: 'nakliye_lojistik' as SectorType,
      desc: 'Boş dönüş eşleşmesi & U-ETDS'
    }
  ];

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (authMode === 'login') {
        const { user } = await api.login(email, password);
        localStorage.setItem('tonaj_auth_token', user.token);
        localStorage.setItem('tonaj_user_session', JSON.stringify(user));
        onLoginSuccess(user);
        onClose();
      } else {
        const { user } = await api.register({
          email,
          password,
          companyName,
          taxNo,
          role,
        });
        localStorage.setItem('tonaj_auth_token', user.token);
        localStorage.setItem('tonaj_user_session', JSON.stringify(user));
        onLoginSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Kimlik doğrulama işlemi tamamlanamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (p: typeof demoProfiles[0]) => {
    setIsLoading(true);
    try {
      const { user } = await api.login(p.email, '123456');
      user.companyName = p.company;
      user.role = p.role;
      localStorage.setItem('tonaj_auth_token', user.token);
      localStorage.setItem('tonaj_user_session', JSON.stringify(user));
      onLoginSuccess(user);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
              <Scale className="w-5 h-5 text-amber-400 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Kurumsal TONAJ B2B Girişi</h3>
              <p className="text-xs text-slate-500">Go API Motoru & Bakanlık Gateway Bağlantılı</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="px-6 pt-5">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Kurumsal Giriş Yap
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Yeni Şirket / Tesis Kaydı
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Quick Demo Login Grid (Only in Login mode) */}
          {authMode === 'login' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Hızlı Sektör Profili Seçin (Tek Tıkla Giriş)
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Canlı Go API</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {demoProfiles.map((p) => (
                  <button
                    key={p.sector}
                    type="button"
                    onClick={() => handleQuickDemoLogin(p)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 mt-0.5 group-hover:border-slate-300">
                      {p.sector === 'beton' && <Building2 className="w-4 h-4 text-amber-600" />}
                      {p.sector === 'tas_ocagi' && <Mountain className="w-4 h-4 text-amber-600" />}
                      {p.sector === 'hurda' && <Recycle className="w-4 h-4 text-amber-600" />}
                      {p.sector === 'antrepo_gumruk' && <Warehouse className="w-4 h-4 text-amber-600" />}
                      {p.sector === 'demir' && <Layers className="w-4 h-4 text-amber-600" />}
                      {p.sector === 'kereste' && <Layers className="w-4 h-4 text-amber-600" />}
                      {p.sector === 'nakliye_lojistik' && <Truck className="w-4 h-4 text-amber-600" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                        {p.company}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{p.name} • {p.role}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-mono uppercase">Veya Form İle Giriş</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
            {authMode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Şirket / Tesis Resmi Unvanı</label>
                  <input 
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Örn: Anadolu Agrega Sanayi A.Ş."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Vergi Kimlik No (VKN / TC)</label>
                  <input 
                    type="text"
                    value={taxNo}
                    onChange={(e) => setTaxNo(e.target.value)}
                    required
                    placeholder="10 Haneli Vergi No"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Kurumsal E-posta</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Şifre</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Faaliyet Sektör Portalı</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value as SectorType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  <option value="beton">🏗️ Hazır Beton Santrali</option>
                  <option value="tas_ocagi">⛏️ Taş Ocağı & Maden</option>
                  <option value="hurda">♻️ Hurda & Geri Dönüşüm</option>
                  <option value="antrepo_gumruk">🏢 Antrepo & Gümrük</option>
                  <option value="demir">🏗️ Demir Çelik Sanayi</option>
                  <option value="kereste">🪵 Kereste & Orman Ürünleri</option>
                  <option value="nakliye_lojistik">🚛 Nakliye & Damper Filosu</option>
                </select>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Yetkili Unvanı / Rol</label>
                  <input 
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>İşlem Yapılıyor...</span>
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Portala Giriş Yap' : 'Şirket Hesabını Oluştur ve Aç'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Golang REST API & T.C. U-ETDS Uyumlu
          </span>
          <span className="font-mono text-slate-400">v2.4-go-core</span>
        </div>
      </div>
    </div>
  );
};
