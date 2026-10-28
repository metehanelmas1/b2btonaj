import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Lock
} from 'lucide-react';
import { CompanyRiskProfile } from '../types';
import { api } from '../services/api';

export const RiskIntelligenceRadar: React.FC = () => {
  const [profiles, setProfiles] = useState<CompanyRiskProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lockingCompanyId, setLockingCompanyId] = useState<string | null>(null);

  const fetchProfiles = () => {
    api.getRiskProfiles().then((data) => {
      setProfiles(data);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleToggleLock = async (companyId: string) => {
    setLockingCompanyId(companyId);
    try {
      const res = await api.toggleRiskLock(companyId);
      setProfiles(prev => prev.map(p => p.id === companyId ? res.company : p));
    } catch (e) {
      console.error(e);
    } finally {
      setLockingCompanyId(null);
    }
  };

  const filtered = profiles.filter(p => {
    const matchesSearch = p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || p.taxNo.includes(searchTerm);
    const matchesStatus = filterStatus === 'ALL' ? true : p.riskStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Explaining the Coercive Force */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Tonaj Skor™ • Go API Canlı İstihbarat
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
              Kolektif Risk & Kara Liste Ağı
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Şantiye & Firma Güvenilirlik Endeksi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Tüm bölgedeki beton santralleri, taş ocakları ve çelik fabrikalarının ortak istihbarat havuzu. İrsaliyesini inkar eden veya çekini ödemeyen şantiyelerin kredi limiti kilitlenir.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono">İzlenen Şantiye & Firma</div>
            <div className="text-lg font-bold text-slate-900 font-mono">{profiles.length > 0 ? `${profiles.length * 280} Tesis` : 'Yükleniyor...'}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Vergi No veya Firma Adı ile Risk Skoru Sorgula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-xs">
          {(['ALL', 'GREEN', 'YELLOW', 'RED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' && 'Tüm Firmalar'}
              {st === 'GREEN' && 'Yeşil Liste (Güvenli)'}
              {st === 'YELLOW' && 'İncelemede'}
              {st === 'RED' && 'Kırmızı Liste (Kilitli)'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200/80">
          Go API'den kurumsal risk profilleri çekiliyor...
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((profile) => {
            return (
              <div 
                key={profile.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                  profile.lockStatus 
                    ? 'border-rose-300 bg-rose-50/20' 
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Left Details */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-mono text-base shrink-0 ${
                    profile.tonajScore >= 90
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : profile.tonajScore >= 70
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {profile.tonajScore}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{profile.companyName}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        VN: {profile.taxNo}
                      </span>
                      {profile.lockStatus && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          VADELİ MAL SATIŞI KİLİTLİ
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {profile.sector} • Toplam Hacim: {profile.totalDeliveredVolumeTon.toLocaleString()} Ton
                    </div>
                    <div className="text-xs mt-1.5 flex items-center gap-1.5">
                      <span className="text-slate-500">Ödeme Sicili:</span>
                      <span className={`font-medium ${
                        profile.lockStatus ? 'text-rose-600' : 'text-slate-700'
                      }`}>
                        {profile.lastPaymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center / Right Metrics */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Önerilen Azami Vade</div>
                    <div className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                      {profile.creditTermDays === 0 ? 'YOK (Sadece Peşin)' : `${profile.creditTermDays} Gün`}
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Havza Kredi Limiti</div>
                    <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                      {profile.creditLimitTl > 0 
                        ? `${(profile.creditLimitTl / 1000000).toFixed(1)} Milyon ₺` 
                        : '0 ₺ (Kilitli)'}
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Açık Uyuşmazlık</div>
                    <div className={`text-sm font-bold font-mono mt-0.5 ${
                      profile.unpaidDisputeCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {profile.unpaidDisputeCount} Dosya
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleLock(profile.id)}
                      disabled={lockingCompanyId === profile.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        profile.lockStatus 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {lockingCompanyId === profile.id 
                        ? 'İşleniyor...' 
                        : profile.lockStatus 
                        ? 'Kilidi Aç (Ödeme Alındı)' 
                        : 'Kredi Limitini Kilitle'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
