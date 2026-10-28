import React, { useState } from 'react';
import { 
  Scale, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Building2, 
  FileText, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { api, UserSession } from '../services/api';

interface AuthPageProps {
  onLoginSuccess: (user: UserSession) => void;
  onGoHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onGoHome,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerCompanyName, setRegisterCompanyName] = useState('');
  const [registerTaxNo, setRegisterTaxNo] = useState('');
  const [registerContactName, setRegisterContactName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Lütfen şirket e-postanızı ve şifrenizi giriniz.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { user } = await api.login(loginEmail, loginPassword);
      localStorage.setItem('tonaj_auth_token', user.token);
      localStorage.setItem('tonaj_user_session', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerCompanyName || !registerEmail || !registerPassword) {
      setErrorMsg('Lütfen firma unvanı, e-posta ve şifre alanlarını doldurunuz.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { user } = await api.register({
        companyName: registerCompanyName,
        taxNo: registerTaxNo || '1029384756',
        email: registerEmail,
        password: registerPassword,
        role: registerContactName ? `${registerContactName} (Yetkili)` : 'Saha Yetkilisi',
      });
      localStorage.setItem('tonaj_auth_token', user.token);
      localStorage.setItem('tonaj_user_session', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Kayıt işlemi tamamlanamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick test fill helper (discreet, corporate convenience)
  const handleQuickFillSample = () => {
    if (authMode === 'login') {
      setLoginEmail('operasyon@ambarliantrepo.com.tr');
      setLoginPassword('123456');
    } else {
      setRegisterCompanyName('Marmara Dökme Lojistik & Antrepo A.Ş.');
      setRegisterTaxNo('4810293841');
      setRegisterContactName('Kemal Öztürk');
      setRegisterEmail('kemal.ozturk@marmaralojistik.com.tr');
      setRegisterPassword('123456');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] flex flex-col justify-between selection:bg-white selection:text-[#0B0D10] font-geist relative overflow-hidden">
      <div className="absolute inset-0 slater-grid-pattern pointer-events-none opacity-40"></div>
      {/* Top Bar Navigation */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl w-full mx-auto">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Anasayfaya Dön</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Bakanlık Gateway & Go API Aktif</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Brand Panel (Corporate Trust & Safeguards) */}
          <div className="lg:col-span-5 bg-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
                  <Scale className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xl font-bold font-mono tracking-tight text-white">
                    TONAJ<span className="text-amber-400">.B2B</span>
                  </span>
                  <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                    Endüstriyel Saha İşletim Sistemi
                  </div>
                </div>
              </div>

              {/* Pitch */}
              <div className="mt-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Tesis ve kantar operasyonunuza <span className="text-amber-400">güvenle</span> giriş yapın.
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Giriş yaptıktan sonra kurulum sihirbazında faaliyet alanınızı seçip kantar indikatörünüzü eşleyebilir, dakikalar içinde sahanızı canlı yönetmeye başlayabilirsiniz.
                </p>
              </div>

              {/* Trust Safeguards */}
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>T.C. U-ETDS ve GİB:</strong> Resmi sefer bildirimi ve e-İrsaliye entegrasyonu</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>42T Karayolları Bariyer Kilidi:</strong> Tesis kapısından çıkmadan ceza kalkanı</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Şantiye Mobil QR Kabulü:</strong> Tonaj inkarını ve mutabakat kavgalarını bitirir</span>
                </div>
              </div>
            </div>

            {/* Bottom Cert Badge */}
            <div className="relative z-10 pt-8 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>SHA-256 Kripto Tartım</span>
              <span>ISO 27001 Güvenlik</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto">
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer text-center ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Şirket Girişi Yap
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer text-center ${
                    authMode === 'register'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Yeni Şirket Hesabı Aç
                </button>
              </div>

              {/* Title & Hint */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {authMode === 'login' ? 'Şirket Hesabınıza Giriş Yapın' : 'Şirketinizi TONAJ Platformuna Kaydedin'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {authMode === 'login' 
                    ? 'Kantar ve tesis operasyon masanıza erişmek için kurumsal bilgilerinizi giriniz.' 
                    : 'Giriş yaptıktan sonra kantar modeli ve sektör seçimi kurulum sihirbazından yapılacaktır.'}
                </p>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form: LOGIN */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Şirket / Yetkili E-postası
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="email"
                        required
                        placeholder="operasyon@sirketiniz.com.tr"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Şifre
                      </label>
                      <span className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer">
                        Şifremi Unuttum
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Form: REGISTER */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Şirket / Tesis Resmi Unvanı
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        required
                        placeholder="Örn: Dilovası Lojistik ve Antrepo A.Ş."
                        value={registerCompanyName}
                        onChange={(e) => setRegisterCompanyName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Vergi No (VKN / TC)
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text"
                          placeholder="10 Haneli VKN"
                          value={registerTaxNo}
                          onChange={(e) => setRegisterTaxNo(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Yetkili Adı Soyadı
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text"
                          placeholder="Örn: Engin Yılmaz"
                          value={registerContactName}
                          onChange={(e) => setRegisterContactName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Şirket E-postası
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="email"
                        required
                        placeholder="yetkili@sirketiniz.com.tr"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Şifre Belirleyin
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="password"
                        required
                        placeholder="En az 6 karakter"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Hesap Oluşturuluyor...' : 'Şirket Hesabını Oluştur ve Başla'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Discreet One-Click Test Fill Link */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Hızlı test mi yapmak istiyorsunuz?</span>
                <button
                  type="button"
                  onClick={handleQuickFillSample}
                  className="font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Örnek Bilgileri Doldur</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TONAJ B2B ENDÜSTRİYEL İŞLETİM SİSTEMİ</span>
          <span>T.C. Ulaştırma ve Altyapı Bakanlığı Gateway Uyumlu</span>
        </div>
      </footer>
    </div>
  );
};