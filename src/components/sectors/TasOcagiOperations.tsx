import React, { useState, useEffect } from 'react';
import { 
  Mountain, 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck2, 
  ArrowRight,
  TrendingUp,
  Flame,
  Truck,
  RotateCw,
  Sliders,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { api } from '../../services/api';

interface TasOcagiOperationsProps {
  onOpenWeighing: () => void;
}

export const TasOcagiOperations: React.FC<TasOcagiOperationsProps> = ({ onOpenWeighing }) => {
  // 1. Konkasör Elek & Fraksiyon Dağılımı State
  const [crusherFeedTpH, setCrusherFeedTpH] = useState<number>(420); // Ton/saat
  const [bunker0_4, setBunker0_4] = useState<number>(78); // % Doluluk
  const [bunker7_15, setBunker7_15] = useState<number>(64);
  const [bunker15_25, setBunker15_25] = useState<number>(45);
  const [bunkerBalast, setBunkerBalast] = useState<number>(30);
  const [screenWearHours, setScreenWearHours] = useState<number>(680); // Elek teli çalışma saati (maks 800)

  // 2. MAPEG e-Maden & Rüsum State
  const [mapegRuhsatNo, setMapegRuhsatNo] = useState<string>('IR-2026/894-K');
  const [annualQuotaTons, setAnnualQuotaTons] = useState<number>(1200000);
  const [shippedTons, setShippedTons] = useState<number>(845200);
  const [currentShipmentTon, setCurrentShipmentTon] = useState<number>(31.4);
  const [mineralUnitPriceTL, setMineralUnitPriceTL] = useState<number>(185); // TL/Ton ocak başı satış bedeli
  const mapegRusumRate = 0.045; // %4.5 yasal devlet hakkı oranı

  // 3. Aks Yükü & Yük Dengeleme Simülatörü State (5 Aks Yarı Römorklu Damper)
  const [frontAxleKg, setFrontAxleKg] = useState<number>(6850); // Maks 7.500
  const [driveAxleKg, setDriveAxleKg] = useState<number>(11200); // Maks 11.500
  const [trailerAxleKg, setTrailerAxleKg] = useState<number>(23200); // Maks 24.000

  // 4. Asfalt & Beton Agrega Reçetesi Rezervasyon State
  const [recipeType, setRecipeType] = useState<'beton_c30' | 'asfalt_asinma' | 'demiryolu_balast'>('beton_c30');
  const [orderedTons, setOrderedTons] = useState<number>(150);

  // 5. Basamak Patlatma & Pasa/Tüvenan Verim
  const [blastBatch, setBlastBatch] = useState<string>('PATLATMA-2026-B12');
  const [blastYieldTons, setBlastYieldTons] = useState<number>(38500);
  const [pasaWastePercent, setPasaWastePercent] = useState<number>(6.5); // % toprak pasa firesi

  // Load live telemetry from Go API
  useEffect(() => {
    api.getSectorTelemetry('tas_ocagi').then((res) => {
      if (res && res.data) {
        if (res.data.crusherFeedTpH !== undefined) setCrusherFeedTpH(res.data.crusherFeedTpH);
        if (res.data.bunker0_4 !== undefined) setBunker0_4(res.data.bunker0_4);
        if (res.data.bunker7_15 !== undefined) setBunker7_15(res.data.bunker7_15);
        if (res.data.bunker15_25 !== undefined) setBunker15_25(res.data.bunker15_25);
        if (res.data.bunkerBalast !== undefined) setBunkerBalast(res.data.bunkerBalast);
        if (res.data.screenWearHours !== undefined) setScreenWearHours(res.data.screenWearHours);
        if (res.data.mapegRuhsatNo) setMapegRuhsatNo(res.data.mapegRuhsatNo);
        if (res.data.annualQuotaTons) setAnnualQuotaTons(res.data.annualQuotaTons);
        if (res.data.shippedTons) setShippedTons(res.data.shippedTons);
        if (res.data.frontAxleKg) setFrontAxleKg(res.data.frontAxleKg);
        if (res.data.driveAxleKg) setDriveAxleKg(res.data.driveAxleKg);
        if (res.data.trailerAxleKg) setTrailerAxleKg(res.data.trailerAxleKg);
      }
    }).catch(console.error);
  }, []);

  // Calculated MAPEG Royalties
  const shipmentRusumTL = (currentShipmentTon * mineralUnitPriceTL * mapegRusumRate).toFixed(2);
  const remainingQuotaTons = annualQuotaTons - shippedTons;
  const quotaUsagePercent = annualQuotaTons > 0 ? ((shippedTons / annualQuotaTons) * 100).toFixed(1) : '0';

  const totalAxleWeight = frontAxleKg + driveAxleKg + trailerAxleKg;
  const maxLegalTotal = 42000;
  const isFrontAxleOverloaded = frontAxleKg > 7500;
  const isDriveAxleOverloaded = driveAxleKg > 11500;
  const isTrailerAxleOverloaded = trailerAxleKg > 24000;
  const isTotalOverloaded = totalAxleWeight > maxLegalTotal;
  const isAxleImbalanced = isFrontAxleOverloaded || isDriveAxleOverloaded || isTrailerAxleOverloaded;
  const canPassBarrier = !isAxleImbalanced && !isTotalOverloaded;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Taş Ocağı & Madencilik İşletim Sistemi
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              MAPEG e-Maden & 42T Karayolları Uyumlu
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mountain className="w-6 h-6 text-slate-700" />
            Taş Ocağı, Kırma-Eleme & Agrega Masası
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Konkasör fraksiyon bunker doluluklarından MAPEG e-Maden devlet hakkı (rüsum) defterine, 5 aks bağımsız dingil dengelemesinden reçeteli şantiye agrega sevkine tam tesis otomasyonu.
          </p>
        </div>

        <button 
          onClick={onOpenWeighing}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Agrega Damper Tartımı Aç</span>
        </button>
      </div>

      {/* Grid: Modül 1 (Konkasör & Fraksiyonlar) & Modül 2 (MAPEG e-Maden) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Modül 1: Konkasör (Kırıcı) Elek & Fraksiyon Dağılımı */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Primer & Sekonder Konkasör Bunker Seviyeleri</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                  Akış Hızı: {crusherFeedTpH} Ton/Saat
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                0-4 mm kırma kum, 7-15 mıcır ve balast fraksiyonlarının canlı stok ve elek tel aşınma radarı.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
            {/* 0-4 Kum */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">0-4 mm Kum</span>
                <span className="font-mono font-bold text-amber-600">%{bunker0_4}</span>
              </div>
              <div className="text-[10px] text-slate-500 mb-2">Taş Unu / Yıkanmış Kum</div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full transition-all ${bunker0_4 > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${bunker0_4}%` }}></div>
              </div>
              <div className="text-[11px] font-mono text-slate-700 font-semibold">1.850 Ton Stok</div>
            </div>

            {/* 7-15 Mıcır 1 No */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">7-15 mm (1 No)</span>
                <span className="font-mono font-bold text-emerald-600">%{bunker7_15}</span>
              </div>
              <div className="text-[10px] text-slate-500 mb-2">Hazır Beton Agregası</div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${bunker7_15}%` }}></div>
              </div>
              <div className="text-[11px] font-mono text-slate-700 font-semibold">2.420 Ton Stok</div>
            </div>

            {/* 15-25 Mıcır 2 No */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">15-25 mm (2 No)</span>
                <span className="font-mono font-bold text-emerald-600">%{bunker15_25}</span>
              </div>
              <div className="text-[10px] text-slate-500 mb-2">Asfalt & Yol Dolgusu</div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${bunker15_25}%` }}></div>
              </div>
              <div className="text-[11px] font-mono text-slate-700 font-semibold">1.190 Ton Stok</div>
            </div>

            {/* 25-38 Balast */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">25-38 Balast</span>
                <span className="font-mono font-bold text-slate-600">%{bunkerBalast}</span>
              </div>
              <div className="text-[10px] text-slate-500 mb-2">TCDD Ray & Tahkimat</div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: `${bunkerBalast}%` }}></div>
              </div>
              <div className="text-[11px] font-mono text-slate-700 font-semibold">880 Ton Stok</div>
            </div>
          </div>

          {/* Elek Aşınma & Konveyör Durumu */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-amber-900">Titreşimli Elek Teli Aşınma Sayacı: </span>
                <span className="font-mono font-bold text-amber-800">{screenWearHours} / 800 Saat</span>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  120 saat sonra tel değişimi önerilir. Aşınma toleransı aşılırsa agrega elek dışı boyuta kaçar.
                </div>
              </div>
            </div>
            <button 
              onClick={() => setScreenWearHours(0)}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-300 text-[11px] cursor-pointer whitespace-nowrap"
            >
              Elek Telini Sıfırla (Yeni Tel)
            </button>
          </div>
        </div>

        {/* Modül 2: MAPEG e-Maden Sevk İrsaliyesi & Yıllık Devlet Hakkı Defteri */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold border border-slate-200">
                Ruhsat: {mapegRuhsatNo}
              </span>
              <span className="text-[11px] font-bold text-emerald-700">MAPEG Entegre</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">MAPEG e-Maden & Yıllık Rüsum</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Maden ve Petrol İşleri Genel Müdürlüğü yıllık ocak kotası ve sevk başı devlet hakkı hesaplayıcısı.
            </p>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Yıllık İşletme Kotası:</span>
                <span className="font-bold text-slate-900">{annualQuotaTons.toLocaleString()} Ton</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Kullanılan Sevk Tonajı:</span>
                <span className="font-bold text-slate-900">{shippedTons.toLocaleString()} Ton (%{quotaUsagePercent})</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${quotaUsagePercent}%` }}></div>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">Kalan Ocak Rezervi:</span>
                <span className="font-bold text-emerald-700">{remainingQuotaTons.toLocaleString()} Ton</span>
              </div>
            </div>

            {/* Bu Tartım İçin Rüsum */}
            <div className="p-3 rounded-xl bg-slate-900 text-white text-xs">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Tartım Tonajı: {currentShipmentTon} Ton</span>
                <span>Birim: {mineralUnitPriceTL} ₺/Ton</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-emerald-400">Tahakkuk Eden Devlet Hakkı:</span>
                <span className="font-mono text-base text-white">{shipmentRusumTL} ₺</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Yasal Oran: %4.5 (Ocak Başı Satış Bedeli Üzerinden)</div>
            </div>
          </div>

          <button 
            onClick={() => alert(`MAPEG e-Maden Sevk Bildirimi yapıldı! Sevk Kodu: MP-${Date.now().toString().slice(-6)}`)}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>MAPEG e-Maden Sevk Belgesi İndir</span>
          </button>
        </div>
      </div>

      {/* Grid: Modül 3 (5 Aks Yük Dengeleme) & Modül 4 (Reçeteli Sevk) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 3: 5 Aks Bağımsız Aks Yükü & Yük Dengeleme Simülatörü */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">5 Aks Bağımsız Dingil Yükü & Bariyer Kilidi</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${canPassBarrier ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                  {canPassBarrier ? 'Bariyer: İZİN VERİLDİ' : 'Bariyer: KİLİTLİ (AŞIM VAR)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Karayolları 42 Ton azami brüt sınırına ek olarak dingil bazlı aşırı yükü engeller. Dengesiz yükte devrilme ve yol cezası önlenir.
              </p>
            </div>
          </div>

          {/* Aks Dağılım Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            
            {/* Ön Aks */}
            <div className={`p-4 rounded-2xl border ${isFrontAxleOverloaded ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-800">Ön Aks (Direksiyon)</span>
                <span className="text-[10px] font-mono text-slate-500">Maks: 7.500 KG</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 my-1">
                {frontAxleKg.toLocaleString()} KG
              </div>
              <input 
                type="range"
                min="5000"
                max="8500"
                step="50"
                value={frontAxleKg}
                onChange={(e) => setFrontAxleKg(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono mt-1">
                <span className={isFrontAxleOverloaded ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {isFrontAxleOverloaded ? `+${frontAxleKg - 7500} KG Aşım!` : `${7500 - frontAxleKg} KG Boşluk`}
                </span>
                <span className="text-slate-400">1 Aks</span>
              </div>
            </div>

            {/* Çeker Aks Tandem */}
            <div className={`p-4 rounded-2xl border ${isDriveAxleOverloaded ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-800">Çeker Aks (Tandem)</span>
                <span className="text-[10px] font-mono text-slate-500">Maks: 11.500 KG</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 my-1">
                {driveAxleKg.toLocaleString()} KG
              </div>
              <input 
                type="range"
                min="9000"
                max="13000"
                step="50"
                value={driveAxleKg}
                onChange={(e) => setDriveAxleKg(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono mt-1">
                <span className={isDriveAxleOverloaded ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {isDriveAxleOverloaded ? `+${driveAxleKg - 11500} KG Aşım!` : `${11500 - driveAxleKg} KG Boşluk`}
                </span>
                <span className="text-slate-400">1 Aks</span>
              </div>
            </div>

            {/* Römork Tridem */}
            <div className={`p-4 rounded-2xl border ${isTrailerAxleOverloaded ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-800">Dorsem Tridem (3 Aks)</span>
                <span className="text-[10px] font-mono text-slate-500">Maks: 24.000 KG</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 my-1">
                {trailerAxleKg.toLocaleString()} KG
              </div>
              <input 
                type="range"
                min="18000"
                max="27000"
                step="50"
                value={trailerAxleKg}
                onChange={(e) => setTrailerAxleKg(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono mt-1">
                <span className={isTrailerAxleOverloaded ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {isTrailerAxleOverloaded ? `+${trailerAxleKg - 24000} KG Aşım!` : `${24000 - trailerAxleKg} KG Boşluk`}
                </span>
                <span className="text-slate-400">3 Aks Grubu</span>
              </div>
            </div>

          </div>

          {/* Genel Toplam & Bariyer Protokolü */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="text-slate-400 text-[11px]">Toplam Brüt Araç Ağırlığı:</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {totalAxleWeight.toLocaleString()} KG / 42.000 KG Maks
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                {isTotalOverloaded ? 'Azami Karayolları 42 Ton Sınırı Aşıldı!' : 'Toplam brüt yasal sınırlar dahilinde.'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  // Otomatik Dengele
                  setFrontAxleKg(6800);
                  setDriveAxleKg(11100);
                  setTrailerAxleKg(23100);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl cursor-pointer text-xs transition-colors flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Yükü Damperde Dengele</span>
              </button>
              <button 
                disabled={!canPassBarrier}
                onClick={onOpenWeighing}
                className={`px-4 py-2 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 ${canPassBarrier ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 cursor-pointer shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{canPassBarrier ? 'Bariyeri Aç & Fiş Kes' : 'Bariyer Kilitli'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modül 4: Asfalt & Beton Agrega Reçetesi Rezervasyon */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold border border-blue-200">
                Santral Rezervasyon
              </span>
              <span className="text-xs text-slate-500 font-medium">Reçeteli Sevk</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Asfalt & Beton Reçeteli Sevk</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Müşteri santralinin reçetesine göre kırıcı fraksiyon oranlarını rezerve eder.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Reçete Tipi</label>
                <select 
                  value={recipeType}
                  onChange={(e) => setRecipeType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="beton_c30">C30/37 Beton Agregası (%40 Kum, %35 Mıcır 1, %25 Mıcır 2)</option>
                  <option value="asfalt_asinma">Karayolu Asfalt Aşınma Tabakası (%50 Mıcır 1, %30 Kum, %20 Mıcır 2)</option>
                  <option value="demiryolu_balast">TCDD Yüksek Hızlı Tren Balast (%100 25-38 mm)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Sipariş Tonajı</label>
                <input 
                  type="number"
                  value={orderedTons}
                  onChange={(e) => setOrderedTons(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 text-sm"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Gereken 0-4 Kum:</span>
                  <span className="font-mono font-bold text-slate-900">{Math.round(orderedTons * 0.4)} Ton</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Gereken 7-15 Mıcır:</span>
                  <span className="font-mono font-bold text-slate-900">{Math.round(orderedTons * 0.35)} Ton</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Gereken 15-25 Mıcır:</span>
                  <span className="font-mono font-bold text-slate-900">{Math.round(orderedTons * 0.25)} Ton</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert(`${orderedTons} Ton agrega için 5 adet 40T damper filoya tahsis edildi!`)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Filoya Reçeteli Sevk Emri Dağıt
          </button>
        </div>
      </div>

      {/* Modül 5: Basamak Patlatma, Tüvenan & Pasa Verim Masası */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Basamak Patlatma & Tüvenan/Pasa Randıman Takibi</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold">
                Parti No: {blastBatch}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ANFO/Dinamit patlatma sonrası sahaya inen tüvenan kaya kütlesi ile konkasöre giren sağlam taş ve pasa oranı.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Pasa Firesi (%):</span>
            <input 
              type="number"
              value={pasaWastePercent}
              onChange={(e) => setPasaWastePercent(Number(e.target.value))}
              className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center font-mono font-bold text-xs"
              step="0.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-slate-500 font-sans text-[11px]">Patlatılan Tüvenan Kaya</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{blastYieldTons.toLocaleString()} Ton</div>
            <div className="text-[10px] text-slate-400 font-sans mt-0.5">32 kuyu ANFO dolumu</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="text-emerald-700 font-sans text-[11px] font-bold">Net Üretim (Sağlam Taş)</div>
            <div className="text-lg font-bold text-emerald-700 mt-1">
              {Math.round(blastYieldTons * (1 - pasaWastePercent / 100)).toLocaleString()} Ton
            </div>
            <div className="text-[10px] text-emerald-600 font-sans mt-0.5">Konkasöre sevk edildi</div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="text-rose-700 font-sans text-[11px] font-bold">Pasa & Örtü Tabakası (Fire)</div>
            <div className="text-lg font-bold text-rose-700 mt-1">
              {Math.round(blastYieldTons * (pasaWastePercent / 100)).toLocaleString()} Ton
            </div>
            <div className="text-[10px] text-rose-600 font-sans mt-0.5">Dolgu/atık sahasına döküldü</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-between font-sans">
            <div>
              <div className="text-[11px] text-slate-400">Üretim Verimliliği:</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                %{(100 - pasaWastePercent).toFixed(1)}
              </div>
            </div>
            <div className="text-[10px] text-slate-400">Yüksek Tenörlü Kireçtaşı</div>
          </div>
        </div>
      </div>
    </div>
  );
};
