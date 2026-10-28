import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Check, 
  Clock, 
  Truck, 
  ArrowRight,
  RefreshCw,
  Lock,
  Unlock,
  QrCode,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { WeighingRecord, SectorType, LiveScaleIndicator } from '../types';
import { api } from '../services/api';

interface WeighbridgeLiveProps {
  records: WeighingRecord[];
  activeSector: SectorType;
  onSelectRecord: (record: WeighingRecord) => void;
  onApproveUetds: (recordId: string) => void;
  onOpenSiteDelivery: (record: WeighingRecord) => void;
}

export const WeighbridgeLive: React.FC<WeighbridgeLiveProps> = ({
  records,
  activeSector,
  onSelectRecord,
  onApproveUetds,
  onOpenSiteDelivery
}) => {
  const [liveGross, setLiveGross] = useState<number>(41850);
  const [liveTare, setLiveTare] = useState<number>(14200);
  const [scaleMeta, setScaleMeta] = useState<LiveScaleIndicator | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_TRANSIT' | 'DELIVERED' | 'DISPUTED'>('ALL');

  useEffect(() => {
    api.getLiveScaleIndicator().then(data => {
      setScaleMeta(data);
      setLiveGross(data.grossWeightKg);
      setLiveTare(data.tareWeightKg);
    }).catch(console.error);
  }, []);

  const filteredRecords = records.filter(r => {
    const sectorMatch = activeSector === 'nakliye_lojistik' ? true : r.sector === activeSector;
    const statusMatch = statusFilter === 'ALL' ? true : r.status === statusFilter;
    return sectorMatch && statusMatch;
  });

  const liveNet = Math.max(0, liveGross - liveTare);
  const legalLimit = 42000;
  const isOverweight = liveGross > legalLimit;

  const simulateNewWeighing = async () => {
    setIsMeasuring(true);
    try {
      const data = await api.getLiveScaleIndicator();
      setScaleMeta(data);
      setLiveGross(data.grossWeightKg);
      setLiveTare(data.tareWeightKg);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMeasuring(false);
    }
  };

  const totalNetKg = filteredRecords.reduce((acc, curr) => acc + curr.netWeightKg, 0);

  return (
    <div className="space-y-6">
      {/* KPI Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bugünkü Sevk Seferi</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {filteredRecords.length} <span className="text-xs font-normal text-slate-500">Araç</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>U-ETDS Bakanlık Bildirimi Aktif</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Sevk Edilen Tonaj</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {(totalNetKg / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-500">TON</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Fire düşümü yapılmış net tartım
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Karayolları Ceza Kalkanı</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
            Sıfır Ceza <span className="text-xs font-normal text-slate-500">(Bariyer Korumalı)</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Aşırı tonajlı araç çıkışına izin verilmez
          </div>
        </div>
      </div>

      {/* Main Weighbridge Terminal & Hardware Interlock Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          {/* Left: Terminal Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-20 h-18 sm:w-24 sm:h-20 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white relative shrink-0">
              <Camera className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[11px] font-mono font-bold text-amber-400">
                {activeSector === 'demir' && '41 KRM 920'}
                {activeSector === 'kereste' && '16 İNE 332'}
                {activeSector === 'antrepo_gumruk' && '34 GMR 419'}
                {activeSector === 'beton' && '34 BTR 810'}
                {activeSector === 'tas_ocagi' && '34 ENR 819'}
                {activeSector === 'hurda' && '34 HRD 552'}
                {activeSector === 'nakliye_lojistik' && '34 LOJ 881'}
              </span>
              <span className="text-[9px] text-slate-400 font-sans mt-0.5">LPR Kamera</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 font-mono">
                  <Cpu className="w-3 h-3 text-slate-500" />
                  {scaleMeta?.indicatorModel || 'Tunaylar LPR-IoT v4.2'} • {scaleMeta?.serialNo || 'Kantar 1'}
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Donanım İmzalı
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Canlı Araç Tartımı & Otomatik Çıkış Bariyeri
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kantar indikatöründen gelen veri değiştirilemez SHA-256 ile kilitlenir ve bariyer durumunu yönetir.
              </p>
            </div>
          </div>

          {/* Right: Digital Weight Readout & Barrier Status */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {/* Barrier Physical Interlock Indicator */}
            <div className="text-left sm:text-right pr-2 sm:border-r sm:border-slate-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Çıkış Bariyeri</div>
              <div className="mt-1">
                {isOverweight ? (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 font-bold font-mono text-xs flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    KİLİTLİ
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold font-mono text-xs flex items-center gap-1">
                    <Unlock className="w-3.5 h-3.5" />
                    AÇIK
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {isOverweight ? 'Aks Aşımı Nedeniyle' : 'Yol İzni Verildi'}
              </div>
            </div>

            {/* Gross */}
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Brüt Ağırlık</div>
              <div className={`text-xl sm:text-2xl font-bold font-mono ${isOverweight ? 'text-rose-600' : 'text-slate-900'}`}>
                {liveGross.toLocaleString('tr-TR')} <span className="text-xs font-normal text-slate-500">KG</span>
              </div>
              <div className="text-[10px] text-slate-500">Limit: 42.000 KG</div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            {/* Tare */}
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dara (Boş)</div>
              <div className="text-lg sm:text-xl font-semibold font-mono text-slate-700">
                {liveTare.toLocaleString('tr-TR')} <span className="text-xs font-normal text-slate-400">KG</span>
              </div>
              <div className="text-[10px] text-slate-500">Sabit Dara</div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            {/* Net */}
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Net Sevk</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600">
                {liveNet.toLocaleString('tr-TR')} <span className="text-xs font-normal text-emerald-700">KG</span>
              </div>
              <div className="text-[10px] text-slate-500">{(liveNet / 1000).toFixed(2)} Ton</div>
            </div>

            {/* Button */}
            <button 
              onClick={simulateNewWeighing}
              disabled={isMeasuring}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isMeasuring ? 'animate-spin' : ''}`} />
              <span>{isMeasuring ? 'Okunuyor...' : 'Tartımı Oku'}</span>
            </button>
          </div>
        </div>

        {/* Warning if overweight */}
        {isOverweight && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-rose-800 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Bariyer Kilitlendi (Aşırı Tonaj):</strong> Araç Karayolları 42.000 KG sınırını <strong>{(liveGross - legalLimit).toLocaleString()} KG</strong> aşıyor. Karayolları kantarında 58.400 TL ceza yememek için yük dengelenmeden çıkış bariyeri açılamaz.
              </span>
            </div>
            <button className="px-2.5 py-1 bg-rose-600 text-white rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer hover:bg-rose-700">
              Yük Dengeleme Yap
            </button>
          </div>
        )}
      </div>

      {/* Clean Modern Data Table with Site Delivery Action */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        {/* Table Header Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sevk & Tartım Fişleri Kayıt Defteri</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Araç şantiyeye ulaştığında "Şantiye Teslim Onayı" vererek faturayı mühürleyebilir ve erken ödemeyi serbest bırakabilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs bg-slate-50 p-1 rounded-lg border border-slate-200/80">
            {(['ALL', 'IN_TRANSIT', 'DELIVERED', 'DISPUTED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' && 'Tümü'}
                {st === 'IN_TRANSIT' && 'Yoldaki Sevkiyat'}
                {st === 'DELIVERED' && 'Teslim Edilen'}
                {st === 'DISPUTED' && 'Uyuşmazlık'}
              </button>
            ))}
          </div>
        </div>

        {/* The Clean Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Fiş No</th>
                <th className="py-3 px-4">Araç & Şoför</th>
                <th className="py-3 px-4">Güzergah (Gönderici ➔ Alıcı)</th>
                <th className="py-3 px-4">Malzeme Cinsi</th>
                <th className="py-3 px-4 text-right">Net Tonaj</th>
                <th className="py-3 px-4 text-center">U-ETDS Kodu</th>
                <th className="py-3 px-4 text-center">Şantiye Teslimi</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => {
                return (
                  <tr 
                    key={r.id} 
                    onClick={() => onSelectRecord(r)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Ticket No */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      <div>{r.ticketNo}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{r.timestamp}</div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-xs">
                          {r.plate}
                        </span>
                        {r.trailerPlate && (
                          <span className="text-[10px] text-slate-400 font-normal">/ {r.trailerPlate}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {r.driverName}
                      </div>
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 truncate">{r.companySender}</div>
                      <div className="text-slate-500 flex items-center gap-1 text-[11px] truncate mt-0.5">
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{r.companyReceiver}</span>
                      </div>
                    </td>

                    {/* Material */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{r.material}</div>
                      {r.concreteSlumpMinutesRemaining !== undefined && (
                        <div className="text-[10px] text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>Priz Kalan: {r.concreteSlumpMinutesRemaining} dk</span>
                        </div>
                      )}
                      {r.moistureWastePercent > 0 && (
                        <div className="text-[10px] text-slate-500">
                          Fire: %{r.moistureWastePercent}
                        </div>
                      )}
                    </td>

                    {/* Weight */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="text-sm font-bold text-slate-900">
                        {(r.netWeightKg / 1000).toFixed(2)} TON
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {r.netWeightKg.toLocaleString()} KG
                      </div>
                    </td>

                    {/* U-ETDS */}
                    <td className="py-3.5 px-4 text-center">
                      {r.uetdsCode ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{r.uetdsCode.replace('UETDS-TR-', '')}</span>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onApproveUetds(r.id);
                          }}
                          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] transition-all cursor-pointer"
                        >
                          U-ETDS Bildir
                        </button>
                      )}
                    </td>

                    {/* Site Delivery Status */}
                    <td className="py-3.5 px-4 text-center">
                      {r.siteApproved ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center justify-center gap-1 mx-auto w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>QR Mühürlü</span>
                        </span>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenSiteDelivery(r);
                          }}
                          className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>Şantiye Onayı Ver</span>
                        </button>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(r);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Detay</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
