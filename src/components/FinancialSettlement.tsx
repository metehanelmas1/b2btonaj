import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  FileCheck2, 
  Building2,
  DollarSign,
  Clock,
  RotateCw
} from 'lucide-react';
import { FinancialSummary, DisputeSettlement, EarlyPaymentSubmission } from '../types';
import { api } from '../services/api';

export const FinancialSettlement: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dispute form state
  const [senderWeight, setSenderWeight] = useState<number>(28500);
  const [receiverWeight, setReceiverWeight] = useState<number>(27950);
  const [unitPriceTl, setUnitPriceTl] = useState<number>(450);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-2026-9042');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState<boolean>(false);
  const [disputeFeedback, setDisputeFeedback] = useState<string | null>(null);

  // Early payment form state
  const [selectedInvoiceAmount, setSelectedInvoiceAmount] = useState<number>(420000);
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState<string>('FTR-2026-88194');
  const [selectedBank, setSelectedBank] = useState<string>('GARANTI_BBVA_FACTORING');
  const [isRequestingPayment, setIsRequestingPayment] = useState<boolean>(false);
  const [earlyPayFeedback, setEarlyPayFeedback] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      const data = await api.getFinancialSummary();
      setSummary(data);
      if (data.disputedWeighings && data.disputedWeighings.length > 0) {
        const first = data.disputedWeighings[0];
        setSelectedTicketId(first.id);
        setSenderWeight(first.netWeightKg);
        setReceiverWeight(first.finalPayableKg || first.netWeightKg - 120);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const diffKg = senderWeight - receiverWeight;
  const toleranceLimitKg = senderWeight * 0.005; // ±%0.5
  const isWithinTolerance = Math.abs(diffKg) <= toleranceLimitKg;

  const handleResolveDispute = async () => {
    setIsSubmittingDispute(true);
    setDisputeFeedback(null);
    try {
      const res = await api.resolveDispute({
        ticketId: selectedTicketId,
        senderWeightKg: senderWeight,
        receiverWeightKg: receiverWeight,
        unitPriceTl: unitPriceTl,
      });
      setDisputeFeedback(`Mutabakat Go API ile onaylandı: ${res.settlement.id} (${res.settlement.status})`);
      await fetchSummary();
      setTimeout(() => setDisputeFeedback(null), 4000);
    } catch (e) {
      setDisputeFeedback('Uyuşmazlık kaydedilirken hata oluştu.');
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const handleRequestEarlyPayment = async () => {
    setIsRequestingPayment(true);
    setEarlyPayFeedback(null);
    try {
      const res = await api.requestEarlyPayment({
        ticketId: selectedTicketId,
        invoiceNo: selectedInvoiceNo,
        invoiceAmount: selectedInvoiceAmount,
        bankCode: selectedBank,
      });
      setEarlyPayFeedback(res.message);
      await fetchSummary();
      setTimeout(() => setEarlyPayFeedback(null), 5000);
    } catch (e) {
      setEarlyPayFeedback('Erken ödeme talebi iletilemedi.');
    } finally {
      setIsRequestingPayment(false);
    }
  };

  const advanceRate = summary?.activeFactoringRate || 80;
  const factoringFeeRate = summary?.factoringFeeRate || 2.4;
  const advanceAmount = selectedInvoiceAmount * (advanceRate / 100);
  const factoringFee = advanceAmount * (factoringFeeRate / 100);
  const netCashToday = advanceAmount - factoringFee;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              B2B Finans & Mutabakat • Go API Entegre
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
              Yasal Tolerans: ±%0.5
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Kantar Uyuşmazlık Çözücü & Erken Fatura İskontosu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            İki kantar arasındaki tartım farkı anlaşmazlıklarını yasal metroloji toleransıyla çözün, 90 günlük vadeli faturaları Go API ve banka garantisiyle 24 saatte nakde çevirin.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
          <div className="text-[10px] text-slate-500 uppercase font-mono">Çözülen Mutabakat Hacmi</div>
          <div className="text-lg font-bold text-emerald-600 font-mono">
            {summary ? `${(summary.totalResolvedVolumeTL / 1000000).toFixed(1)} Milyon ₺` : '14.8 Milyon ₺'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Tartım Mutabakatı */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">İki Kantar Arası Tonaj Hakemliği</h3>
                <p className="text-xs text-slate-500">Çıkış ve varış kantarındaki tartım farkını yasal kurallara göre değerlendirir.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded border border-slate-200">
                Go API Hakem Modülü
              </span>
            </div>

            {summary?.disputedWeighings && summary.disputedWeighings.length > 0 && (
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Uyuşmazlık / Fazla Tonajlı Fiş Seçin:
                </label>
                <select 
                  value={selectedTicketId}
                  onChange={(e) => {
                    const tid = e.target.value;
                    setSelectedTicketId(tid);
                    const found = summary.disputedWeighings.find(w => w.id === tid);
                    if (found) {
                      setSenderWeight(found.netWeightKg);
                      setReceiverWeight(found.finalPayableKg || found.netWeightKg - 120);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  {summary.disputedWeighings.map(dw => (
                    <option key={dw.id} value={dw.id}>
                      {dw.ticketNo} • {dw.plate} ({dw.companySender} ➔ {dw.companyReceiver}) • {dw.netWeightKg} KG
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">1. Çıkış Kantarı (Ocak / Antrepo)</label>
                  <input 
                    type="number"
                    value={senderWeight}
                    onChange={(e) => setSenderWeight(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-900 text-sm"
                  />
                  <span className="text-[10px] text-slate-400">KG Cinsinden</span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">2. Giriş Kantarı (Santral / Şantiye)</label>
                  <input 
                    type="number"
                    value={receiverWeight}
                    onChange={(e) => setReceiverWeight(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-900 text-sm"
                  />
                  <span className="text-[10px] text-slate-400">KG Cinsinden</span>
                </div>
              </div>

              {/* Status Box */}
              <div className={`p-3.5 rounded-xl border ${
                isWithinTolerance 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <div className="flex items-center justify-between mb-1 text-xs font-bold">
                  <span>
                    Fark: {Math.abs(diffKg)} KG ({senderWeight > 0 ? ((Math.abs(diffKg) / senderWeight) * 100).toFixed(2) : 0}%)
                  </span>
                  <span>
                    Yasal Tolerans Sınırı: ±{Math.round(toleranceLimitKg)} KG
                  </span>
                </div>

                {isWithinTolerance ? (
                  <p className="text-[11px] text-emerald-700">
                    ✓ <strong>Tolerans Dahilinde:</strong> Tartım farkı Sanayi ve Teknoloji Bakanlığı tartı aletleri yönetmeliğine uygundur. Çıkış kantarı fişi geçerli kabul edilerek mutabakat sağlandı.
                  </p>
                ) : (
                  <p className="text-[11px] text-rose-700">
                    ⚠ <strong>Tolerans Aşıldı:</strong> Fark yasal sınırın üstünde ({Math.abs(diffKg) - Math.round(toleranceLimitKg)} KG fazla kayıp). Şoför mazot satışı veya malzeme dökülmesi ihtimaline karşı otomatik denetim başlatıldı.
                  </p>
                )}
              </div>

              {disputeFeedback && (
                <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{disputeFeedback}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleResolveDispute}
            disabled={isSubmittingDispute}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>{isSubmittingDispute ? 'İşleniyor...' : 'Resmi Dijital Mutabakat Metnini Go API ile İki Tarafa İlet'}</span>
          </button>
        </div>

        {/* Module 2: Erken Fatura Ödeme */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Kantar Onaylı Erken Fatura İskontosu</h3>
                <p className="text-xs text-slate-500">Şantiyede teslim edilmiş onaylı irsaliyeleri 90 gün beklemeden nakde çevirin.</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Faktoring Entegre
              </span>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">e-Fatura No</label>
                  <input 
                    type="text"
                    value={selectedInvoiceNo}
                    onChange={(e) => setSelectedInvoiceNo(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Onaylı İrsaliye Tutarı (TL)</label>
                  <input 
                    type="number"
                    value={selectedInvoiceAmount}
                    onChange={(e) => setSelectedInvoiceAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Anlaşmalı Faktoring / Banka</label>
                <select 
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                >
                  <option value="GARANTI_BBVA_FACTORING">Garanti BBVA Faktoring (T+1 Garantili)</option>
                  <option value="IS_BANKASI_FAKTORING">İş Faktoring A.Ş. (T+1 Garantili)</option>
                  <option value="YAPI_KREDI_FAKTORING">Yapı Kredi Faktoring</option>
                  <option value="QNB_FINANS_FAKTORING">QNB Finansfaktoring</option>
                </select>
              </div>

              <div className="border-t border-slate-200 pt-3 grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-sans">Anında Avans (%{advanceRate})</div>
                  <div className="font-bold text-slate-900 mt-0.5">{advanceAmount.toLocaleString()} ₺</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-sans">İskonto (%{factoringFeeRate})</div>
                  <div className="font-bold text-rose-600 mt-0.5">-{Math.round(factoringFee).toLocaleString()} ₺</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-sans">24 Saatte Hesaba</div>
                  <div className="font-bold text-emerald-600 mt-0.5">{Math.round(netCashToday).toLocaleString()} ₺</div>
                </div>
              </div>

              {earlyPayFeedback && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{earlyPayFeedback}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleRequestEarlyPayment}
            disabled={isRequestingPayment}
            className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>{isRequestingPayment ? 'Talebiniz Banka API ile İletiliyor...' : 'Erken Ödemeyi Hesabıma Aktar (24 Saatte Nakit)'}</span>
          </button>
        </div>
      </div>

      {/* Live Settlements History from Go */}
      {summary?.settlements && summary.settlements.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Geçmiş Kantar Hakemlik & Mutabakat Kayıtları (Go REST API)</h3>
            <span className="text-xs text-slate-500">{summary.settlements.length} Kayıt</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono">
                <tr>
                  <th className="py-2 px-3">Mutabakat No</th>
                  <th className="py-2 px-3">Fiş Kodu</th>
                  <th className="py-2 px-3">Çıkış Kantarı</th>
                  <th className="py-2 px-3">Varış Kantarı</th>
                  <th className="py-2 px-3">Fark</th>
                  <th className="py-2 px-3">Tolerans</th>
                  <th className="py-2 px-3">Durum</th>
                  <th className="py-2 px-3">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {summary.settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-bold text-slate-900">{s.id}</td>
                    <td className="py-2 px-3 text-slate-600">{s.ticketId}</td>
                    <td className="py-2 px-3">{s.senderWeightKg.toLocaleString()} KG</td>
                    <td className="py-2 px-3">{s.receiverWeightKg.toLocaleString()} KG</td>
                    <td className="py-2 px-3 font-bold text-slate-800">{s.differenceKg} KG</td>
                    <td className="py-2 px-3 text-slate-500">±{s.toleranceLimitKg.toFixed(1)} KG</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.isWithinTolerance ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {s.isWithinTolerance ? 'ONAYLANDI' : 'UYUŞMAZLIK'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400 font-sans">{s.resolvedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
