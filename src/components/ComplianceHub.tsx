import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingDown
} from 'lucide-react';
import { ComplianceAlert, ComplianceSummary } from '../types';
import { api } from '../services/api';

export const ComplianceHub: React.FC = () => {
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getComplianceSummary().then((data) => {
      setSummary(data);
      setAlerts(data.alerts || []);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const totalPrevented = summary?.totalPreventedTL || alerts.reduce((acc, curr) => acc + curr.penaltyPreventedAmountTl, 0);

  return (
    <div className="space-y-6">
      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Engellenen Resmi Ceza</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">
            {totalPrevented.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Karayolları & U-ETDS cezası sıfırlandı</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">U-ETDS Bakanlık Onayı</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {summary?.uetdsTotalApproved ? `${summary.uetdsTotalApproved.toLocaleString()} Sefer` : '4.896 Sefer'}
          </div>
          <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>%100 Başarılı Gönderim</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">MAPEG Maden Sevkleri</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {summary?.mapegTotalTickets ? `${summary.mapegTotalTickets.toLocaleString()} Fiş` : '1.141 Fiş'}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Maden Kanunu 12. Madde tam uyumu
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">MoTAT Atık Mühürleri</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {summary?.motatTotalTickets ? `${summary.motatTotalTickets.toLocaleString()} Mühür` : '881 Mühür'}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Çevre Bakanlığı arşivi mühürlü
          </div>
        </div>
      </div>

      {/* Main Alert Log */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mevzuat Denetim & İhlal Önleme Defteri</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Go API üzerinden canlı çekilen tonaj, sevk fişi ve bakanlık onaylarının denetim geçmişi.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            Canlı Koruma Devrede (24/7)
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Go API'den mevzuat kayıtları alınıyor...
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-50/50 border-rose-200'
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {alert.severity === 'CRITICAL' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                    {alert.severity === 'WARNING' && <Clock className="w-5 h-5 text-amber-600" />}
                    {alert.severity === 'INFO' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        Saat: {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right shrink-0">
                  <div className="text-[10px] text-slate-400 font-sans">Önlenen Ceza Tutarı</div>
                  <div className="text-sm font-bold font-mono text-emerald-600">
                    +{alert.penaltyPreventedAmountTl.toLocaleString('tr-TR')} ₺
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
