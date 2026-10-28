import React, { useState, useEffect } from 'react';
import { 
  Warehouse, 
  Scale, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck2, 
  ArrowRight,
  Truck,
  RotateCw,
  DollarSign,
  QrCode,
  Tag,
  Key,
  Calendar,
  Lock,
  Unlock
} from 'lucide-react';
import { api } from '../../services/api';

interface AntrepoOperationsProps {
  onOpenWeighing: () => void;
}

export const AntrepoOperations: React.FC<AntrepoOperationsProps> = ({ onOpenWeighing }) => {
  // 1. VBS (Vehicle Booking System - Tır Parkı Sıramatik) State
  const [vbsSlots, setVbsSlots] = useState<any[]>([
    {
      bookingCode: 'VBS-2026-R4182',
      plate: '34 GMR 901',
      driver: 'Serkan Yılmaz',
      ramp: 'Rampa 4A (Kuru Yük)',
      status: 'CALLED', // WAITING, CALLED, DOCKED
      scheduledTime: '14:30',
      etaMinutes: 5
    },
    {
      bookingCode: 'VBS-2026-R4183',
      plate: '06 TR 334',
      driver: 'Mehmet Ali Kaya',
      ramp: 'Rampa 1B (Soğuk Hava)',
      status: 'WAITING',
      scheduledTime: '15:00',
      etaMinutes: 25
    },
    {
      bookingCode: 'VBS-2026-R4184',
      plate: '35 ANT 552',
      driver: 'Orhan Demir',
      ramp: 'Açık Saha 2 (Dökme)',
      status: 'DOCKED',
      scheduledTime: '13:45',
      etaMinutes: 0
    }
  ]);

  // 2. Demurrage (Bekleme) & Ardiye Günlük Taksimetresi State
  const [containerNo, setContainerNo] = useState<string>('MSCU-884910-2');
  const [freeTimeDays, setFreeTimeDays] = useState<number>(7); // Armatör 7 gün free-time
  const [elapsedDays, setElapsedDays] = useState<number>(11); // Geçen gün sayısı (aşım)
  const [dailyDemurrageUSD, setDailyDemurrageUSD] = useState<number>(120); // $120 / Gün demurrage
  const [dailyStorageTL, setDailyStorageTL] = useState<number>(450); // 450 TL / Gün ardiye
  const usdExchangeRate = 34.50; // USD/TL
  const [isDemurragePaid, setIsDemurragePaid] = useState<boolean>(false);

  // 3. Gümrük BİLGE Özet Beyan & Kantar Tartım Doğrulama State
  const [ozetBeyanNo, setOzetBeyanNo] = useState<string>('26340000OB014298');
  const [declaredGrossKg, setDeclaredGrossKg] = useState<number>(26400); // Beyan edilen brüt
  const [actualScaleKg, setActualScaleKg] = useState<number>(26580); // Kantar tartımı

  // 4. Kısmi Millileştirme & Serbest Bölge Çıkış State
  const [totalBondedStockTons, setTotalBondedStockTons] = useState<number>(850);
  const [clearedTons, setClearedTons] = useState<number>(125);

  // 5. Çelik Halat Mühür OCR
  const [sealNo, setSealNo] = useState<string>('TR-GUMRUK-884129');
  const [isSealIntact, setIsSealIntact] = useState<boolean>(true);

  // Computed Values
  const overdueDays = Math.max(0, elapsedDays - freeTimeDays);
  const totalDemurrageUSD = overdueDays * dailyDemurrageUSD;
  const totalDemurrageTL = totalDemurrageUSD * usdExchangeRate;
  const totalStorageTL = elapsedDays * dailyStorageTL;
  const grandTotalDueTL = totalDemurrageTL + totalStorageTL;

  const scaleDiffKg = actualScaleKg - declaredGrossKg;
  const deviationPercent = declaredGrossKg > 0 ? ((scaleDiffKg / declaredGrossKg) * 100).toFixed(2) : '0';
  const isCustomsApproved = Math.abs(Number(deviationPercent)) <= 3.0;

  const remainingBondedTons = totalBondedStockTons - clearedTons;

  // Load live telemetry from Go API
  useEffect(() => {
    api.getSectorTelemetry('antrepo_gumruk').then((res) => {
      if (res && res.data) {
        if (res.data.vbsSlots && res.data.vbsSlots.length > 0) setVbsSlots(res.data.vbsSlots);
        if (res.data.containerNo) setContainerNo(res.data.containerNo);
        if (res.data.freeTimeDays !== undefined) setFreeTimeDays(res.data.freeTimeDays);
        if (res.data.elapsedDays !== undefined) setElapsedDays(res.data.elapsedDays);
        if (res.data.dailyDemurrageUSD !== undefined) setDailyDemurrageUSD(res.data.dailyDemurrageUSD);
        if (res.data.dailyStorageTL !== undefined) setDailyStorageTL(res.data.dailyStorageTL);
        if (res.data.ozetBeyanNo) setOzetBeyanNo(res.data.ozetBeyanNo);
        if (res.data.declaredGrossKg) setDeclaredGrossKg(res.data.declaredGrossKg);
        if (res.data.actualScaleKg) setActualScaleKg(res.data.actualScaleKg);
        if (res.data.totalBondedTons) setTotalBondedStockTons(res.data.totalBondedTons);
        if (res.data.sealNo) setSealNo(res.data.sealNo);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Gümrüklü Antrepo & Serbest Bölge İşletim Sistemi
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200">
              Ticaret Bakanlığı BİLGE & Demurrage Entegre
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Warehouse className="w-6 h-6 text-blue-600" />
            Gümrüklü Antrepo & Lojistik Masası
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            VBS dijital kapı randevusu ve rampa sıramatiğinden konteyner demurrage/ardiye taksimetresine, Gümrük BİLGE özet beyan tartım denetiminden kısmi millileştirme izinlerine tam antrepo otomasyonu.
          </p>
        </div>

        <button 
          onClick={onOpenWeighing}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Antrepo Giriş/Çıkış Tartımı Aç</span>
        </button>
      </div>

      {/* Grid: Modül 1 (VBS Rampa Sıramatik) & Modül 2 (Demurrage Taksimetresi) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 1: VBS (Dijital Kapı Randevusu & Tır Parkı Sıramatik) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">VBS Akıllı Kapı Randevusu & Tır Parkı Sıramatik</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                  Sıfır Kapı Yığılması
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tırların kapıda ve otobanda beklemesini engelleyen saatlik slot ve rampa tahsis sistemi.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {vbsSlots.map((slot) => (
              <div key={slot.bookingCode} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                      {slot.plate}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">{slot.bookingCode}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      slot.status === 'CALLED' ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                      slot.status === 'DOCKED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {slot.status === 'CALLED' ? 'KAPIYA ÇAĞRILDI' : slot.status === 'DOCKED' ? 'RAMPADA YÜKLENİYOR' : 'PARKTA SIRADA'}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    Sürücü: <span className="font-semibold text-slate-800">{slot.driver}</span> • Atanan Rampa: <span className="font-bold text-blue-700">{slot.ramp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 text-sm">{slot.scheduledTime}</div>
                    <div className="text-[10px] text-slate-400">
                      {slot.etaMinutes === 0 ? 'İşlem Sürüyor' : `${slot.etaMinutes} dk kaldı`}
                    </div>
                  </div>

                  {slot.status === 'WAITING' && (
                    <button 
                      onClick={() => {
                        setVbsSlots(prev => prev.map(s => s.bookingCode === slot.bookingCode ? { ...s, status: 'CALLED' } : s));
                        alert(`${slot.plate} plakalı araca SMS ve WhatsApp ile "Rampa 1B Kapısına Yanaşın" çağrısı iletildi!`);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Kapıya Çağır
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modül 2: Demurrage (Bekleme) & Ardiye Günlük Taksimetresi */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-50 text-rose-800 rounded font-bold border border-rose-200">
                Konteyner: {containerNo}
              </span>
              <span className={`text-xs font-bold ${overdueDays > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {overdueDays > 0 ? `${overdueDays} Gün Aşım!` : 'Free-Time Dahilinde'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Demurrage & Ardiye Taksimetresi</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-3">
              Armatör bekleme (demurrage) ve antrepo ardiye maliyetini anlık hesaplar, bakiye kapanmadan kantar bariyerini açmaz.
            </p>

            {/* Süre Slider'ı */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-3 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600">Antrepoda Kalış Süresi:</span>
                <span className="font-mono font-bold text-slate-900">{elapsedDays} Gün</span>
              </div>
              <input 
                type="range"
                min="1"
                max="25"
                value={elapsedDays}
                onChange={(e) => setElapsedDays(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>Free-Time: {freeTimeDays} Gün</span>
                <span className={overdueDays > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                  {overdueDays > 0 ? `${overdueDays} Gün Ceza` : 'Ücretsiz'}
                </span>
              </div>
            </div>

            {/* Ceza & Ardiye Dökümü */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white mb-3 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Demurrage ({overdueDays} gün x ${dailyDemurrageUSD}):</span>
                <span className="text-rose-400 font-bold">${totalDemurrageUSD} ({Math.round(totalDemurrageTL).toLocaleString()} ₺)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Antrepo Ardiye ({elapsedDays} gün x {dailyStorageTL} ₺):</span>
                <span>{totalStorageTL.toLocaleString()} ₺</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-1.5 text-sm font-bold">
                <span className="text-emerald-400">Tahsil Edilecek Bakiye:</span>
                <span className="text-white">{Math.round(grandTotalDueTL).toLocaleString()} ₺</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <div className={`p-1.5 rounded-lg ${isDemurragePaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {isDemurragePaid ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <span className={`font-semibold ${isDemurragePaid ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isDemurragePaid ? 'Bariyer Kilidi Açık (Ödeme Alındı)' : 'Bariyer Kilitli (Ödeme Bekleniyor)'}
              </span>
            </div>

            <button 
              onClick={() => {
                setIsDemurragePaid(true);
                alert(`${Math.round(grandTotalDueTL).toLocaleString()} ₺ Demurrage ve Ardiye tahsilatı yapıldı. Çıkış kantar bariyeri açıldı!`);
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Demurrage/Ardiye Tahsil Et & Bariyeri Aç</span>
            </button>
          </div>
        </div>

      </div>

      {/* Grid: Modül 3 (Gümrük BİLGE Özet Beyan) & Modül 4 (Kısmi Millileştirme) & Modül 5 (Mühür OCR) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 3: Gümrük BİLGE Özet Beyan & Kantar Tartım Doğrulama */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold border border-slate-200">
                BİLGE Özet Beyan: {ozetBeyanNo}
              </span>
              <span className={`text-xs font-bold ${isCustomsApproved ? 'text-emerald-700' : 'text-rose-600'}`}>
                {isCustomsApproved ? 'GÜMRÜK ONAYLI' : 'KIRMIZI HAT!'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Gümrük Özet Beyan Tartım Eşleme</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Konşimento ve gümrük beyannamesindeki brüt ağırlık ile kantar fiili tartımını karşılaştırır (Limit: $\pm \%3$).
            </p>

            <div className="space-y-3 mb-4 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Beyan Edilen Brüt Ağırlık:</span>
                  <span className="font-bold text-slate-900">{declaredGrossKg.toLocaleString()} KG</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Kantar Fiili Tartımı:</span>
                  <span className="font-bold text-slate-900">{actualScaleKg.toLocaleString()} KG</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500 font-sans">Tartım Sapması:</span>
                  <span className={`font-bold ${isCustomsApproved ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {scaleDiffKg > 0 ? `+${scaleDiffKg}` : scaleDiffKg} KG (%{deviationPercent})
                  </span>
                </div>
              </div>

              {isCustomsApproved ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Sapma yasal %3 sınırında. Yeşil hat: İthalat/ihracat muayenesiz geçiş izni verildi.</span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-sans flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Yasal tolerans aşıldı! Gümrük muayene memuru ve fiziki sayım zorunludur.</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => alert(`BİLGE Tartım Doğrulama Kodu Gümrük Sunucusuna İletildi: BİLGE-TR-${Date.now().toString().slice(-6)}`)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>BİLGE Kantar Uygunluk Belgesi İndir</span>
          </button>
        </div>

        {/* Modül 4: Kısmi Millileştirme & Serbest Bölge Çıkış İzin Masası */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold border border-blue-200">
                Serbest Dolaşım
              </span>
              <span className="text-xs font-bold text-slate-700">Kısmi Çekim</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Kısmi Millileştirme Masası</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Antrepodaki ana partiden parti parti vergi ödeyerek iç piyasaya sevkıyat izni verir.
            </p>

            <div className="space-y-3 mb-4 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-600 font-sans">
                <span>Antrepodaki Toplam Stok:</span>
                <span className="font-bold text-slate-900 font-mono">{totalBondedStockTons} Ton</span>
              </div>

              <div>
                <label className="text-slate-600 font-sans block mb-1">Bu Sefer Çekilen Miktar (Ton):</label>
                <input 
                  type="number"
                  value={clearedTons}
                  onChange={(e) => setClearedTons(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 text-xs"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 font-sans">
                <div className="flex justify-between text-slate-600">
                  <span>Millileşen Tonaj:</span>
                  <span className="font-mono font-bold text-emerald-700">{clearedTons} Ton</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Kalan Gümrüklü Bakiye:</span>
                  <span className="font-mono font-bold text-blue-700">{remainingBondedTons} Ton</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert(`${clearedTons} Ton için Kısmi Millileştirme Beyannamesi onaylandı. Kantar sevk irsaliyesi hazır.`)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-slate-700" />
            <span>Kısmi Çıkış İzin Belgesi Düzenle</span>
          </button>
        </div>

        {/* Modül 5: Gümrük Çelik Halat Mühür OCR & Doğrulama */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200">
                Gümrük Mührü OCR
              </span>
              <span className="text-xs font-bold text-emerald-600">AI Kamera</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Çelik Halat Mühür Kontrolü</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Kantar girişindeki yüksek çözünürlüklü kamera ile konteyner kilidindeki çelik mühür numarasını okur ve teyit eder.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-900 text-white mb-4 text-xs font-mono space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Okunan Mühür No:</span>
                <span className="font-bold text-emerald-400">{sealNo}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Mühür Bütünlüğü:</span>
                <span className="text-emerald-400 font-bold">Sağlam (Hasarsız)</span>
              </div>
              <div className="text-[10px] text-slate-400 font-sans border-t border-slate-800 pt-1.5">
                Gümrük tescil veri tabanı ile birebir eşleşti. Kaçak müdahale şüphesi bulunmamaktadır.
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            Mühür koparma işlemi yalnızca gümrük muhafaza memuru eşliğinde tutanakla yapılır.
          </div>
        </div>

      </div>
    </div>
  );
};
