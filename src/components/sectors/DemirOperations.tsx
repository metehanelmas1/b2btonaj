import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck2, 
  ArrowRight,
  TrendingUp,
  Flame,
  QrCode,
  Tag,
  Clock,
  Printer,
  Sparkles,
  Zap,
  Building
} from 'lucide-react';
import { api } from '../../services/api';

interface DemirOperationsProps {
  onOpenWeighing: () => void;
}

export const DemirOperations: React.FC<DemirOperationsProps> = ({ onOpenWeighing }) => {
  // 1. TS 708 Kalite & Akma / Çekme Laboratuvarı State
  const [heatNo, setHeatNo] = useState<string>('ST-2026-H881');
  const [steelGrade, setSteelGrade] = useState<'B420C' | 'B500C'>('B500C');
  const [yieldStrengthRe, setYieldStrengthRe] = useState<number>(534); // MPa (min 500)
  const [tensileStrengthRm, setTensileStrengthRm] = useState<number>(648); // MPa (min 600)
  const [elongationAgt, setElongationAgt] = useState<number>(8.4); // % (min 7.5)
  const [carbonEqCev, setCarbonEqCev] = useState<number>(0.39); // max 0.45

  // 2. Ø8 - Ø32 mm Donatı Metraj & Kantar Çevirici State
  const [selectedDiameter, setSelectedDiameter] = useState<number>(16);
  const [barLengthMeters] = useState<number>(12); // Standart 12 metre boy
  const [bundleCount, setBundleCount] = useState<number>(12); // Bağ sayısı
  const [barsPerBundle, setBarsPerBundle] = useState<number>(100); // Bağ başı çubuk
  const [actualWeighbridgeKg, setActualWeighbridgeKg] = useState<number>(23100); // Kantarda tartılan net kilo

  // 3. Haddehane Kütük Verimi (Tufal/Fire)
  const [billetInputTons, setBilletInputTons] = useState<number>(500);
  const [scaleWastePercent, setScaleWastePercent] = useState<number>(1.8); // Tufal firesi %
  const [cropEndPercent, setCropEndPercent] = useState<number>(1.6); // Uç-kuyruk kesim firesi %

  // Load live telemetry from Go API
  useEffect(() => {
    api.getSectorTelemetry('demir').then((res) => {
      if (res && res.data) {
        if (res.data.heatNo) setHeatNo(res.data.heatNo);
        if (res.data.steelGrade) setSteelGrade(res.data.steelGrade);
        if (res.data.yieldStrengthRe) setYieldStrengthRe(res.data.yieldStrengthRe);
        if (res.data.tensileStrengthRm) setTensileStrengthRm(res.data.tensileStrengthRm);
        if (res.data.elongationAgt) setElongationAgt(res.data.elongationAgt);
        if (res.data.selectedDiameter) setSelectedDiameter(res.data.selectedDiameter);
        if (res.data.bundleCount) setBundleCount(res.data.bundleCount);
        if (res.data.barsPerBundle) setBarsPerBundle(res.data.barsPerBundle);
        if (res.data.actualWeighbridgeKg) setActualWeighbridgeKg(res.data.actualWeighbridgeKg);
        if (res.data.billetInputTons) setBilletInputTons(res.data.billetInputTons);
      }
    }).catch(console.error);
  }, []);

  // Calculations for TS 708
  const ductilityRatio = (tensileStrengthRm / yieldStrengthRe).toFixed(2); // min 1.15
  const isYieldPassed = yieldStrengthRe >= (steelGrade === 'B500C' ? 500 : 420);
  const isTensilePassed = tensileStrengthRm >= (steelGrade === 'B500C' ? 600 : 500);
  const isDuctilityPassed = Number(ductilityRatio) >= 1.15;
  const isElongationPassed = elongationAgt >= 7.5;
  const isCevPassed = carbonEqCev <= 0.45;
  const isQualityCertified = isYieldPassed && isTensilePassed && isDuctilityPassed && isElongationPassed && isCevPassed;

  // TS 708 Nominal Weights per Meter (kg/m)
  const nominalWeights: Record<number, number> = {
    8: 0.395,
    10: 0.617,
    12: 0.888,
    14: 1.208,
    16: 1.578,
    18: 2.000,
    20: 2.466,
    22: 2.984,
    25: 3.853,
    32: 6.313
  };

  const totalBars = bundleCount * barsPerBundle;
  const unitWeight = nominalWeights[selectedDiameter] || 1.578;
  const singleBarTheoreticalKg = unitWeight * barLengthMeters;
  const theoreticalTotalKg = Math.round(totalBars * singleBarTheoreticalKg);
  const weightDiffKg = actualWeighbridgeKg - theoreticalTotalKg;
  const tolerancePercent = theoreticalTotalKg > 0 ? ((weightDiffKg / theoreticalTotalKg) * 100).toFixed(2) : '0';
  const isToleranceOk = Math.abs(Number(tolerancePercent)) <= 4.0; // TS 708: +/- %4 tolerans

  const netFinishedSteelTons = (billetInputTons * (1 - (scaleWastePercent + cropEndPercent) / 100)).toFixed(1);

  // 4. Şantiye Teslim & Erken Tahsilat
  const [isDeliveredAtSite, setIsDeliveredAtSite] = useState<boolean>(true);
  const [earlyCashPayoutEnabled, setEarlyCashPayoutEnabled] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Demir Çelik Sanayi & Haddehane İşletim Sistemi
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-semibold">
              TS 708 & CE Kalite Sertifikalı
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-slate-800" />
            Demir Çelik Sanayi & Nervürlü Donatı Masası
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            TS 708 mekanik akma/çekme test raporlarından 12m bağ/metraj ➔ kantar tonaj doğrulama matrisine, kütük hadde veriminden şantiye karekodlu erken tahsilata uçtan uca çelik operasyonu.
          </p>
        </div>

        <button 
          onClick={onOpenWeighing}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Demir Sevk Tartımı Aç</span>
        </button>
      </div>

      {/* Grid: Modül 1 (TS 708 Akma/Çekme Testi) & Modül 2 (Metraj ➔ Kantar Doğrulama) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 1: TS 708 Kalite & Laboratuvar Sertifikası */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold border border-slate-200">
                Şarj No: {heatNo}
              </span>
              <span className={`text-[11px] font-bold ${isQualityCertified ? 'text-emerald-700' : 'text-rose-600'}`}>
                {isQualityCertified ? 'TS 708 ONAYLI' : 'STANDART DIŞI'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">TS 708 Laboratuvar Test Sonuçları</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Nervürlü çelik donatının akma, çekme ve süneklik limitleri denetlenir.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Çelik Kalite Standardı</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { setSteelGrade('B500C'); setYieldStrengthRe(534); setTensileStrengthRm(648); }}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${steelGrade === 'B500C' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    B500C (Deprem Standardı)
                  </button>
                  <button 
                    onClick={() => { setSteelGrade('B420C'); setYieldStrengthRe(445); setTensileStrengthRm(560); }}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${steelGrade === 'B420C' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    B420C Standart
                  </button>
                </div>
              </div>

              {/* Akma & Çekme Slider */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Akma Dayanımı (Re):</span>
                  <span className="font-mono font-bold text-slate-900">{yieldStrengthRe} MPa</span>
                </div>
                <input 
                  type="range"
                  min="400"
                  max="650"
                  value={yieldStrengthRe}
                  onChange={(e) => setYieldStrengthRe(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />

                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-600">Çekme Dayanımı (Rm):</span>
                  <span className="font-mono font-bold text-slate-900">{tensileStrengthRm} MPa</span>
                </div>
                <input 
                  type="range"
                  min="480"
                  max="750"
                  value={tensileStrengthRm}
                  onChange={(e) => setTensileStrengthRm(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-500">Süneklik (Rm/Re):</span>
                  <span className={`font-bold ${isDuctilityPassed ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {ductilityRatio} (Min 1.15)
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-500">Kopma Uzaması (Agt):</span>
                  <span className="font-bold text-emerald-700">%{elongationAgt} (Min %7.5)</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert(`TS 708 e-Kalite Sertifikası indirildi! Şarj: ${heatNo}, Kalite: ${steelGrade}`)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>e-Kalite Sertifikası (PDF) Üret</span>
          </button>
        </div>

        {/* Modül 2: Ø8 - Ø32 mm Donatı Metraj & Kantar Doğrulama */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">12m Donatı Metrajı ➔ Kantar Doğrulama Matrisi</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${isToleranceOk ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                  Tolerans: %{tolerancePercent} ({isToleranceOk ? 'TS 708 UYGUN' : 'SAPMA VAR'})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Şantiyeye sevk edilen çubuk adedi ve boyu üzerinden teorik metraj ağırlığı ile kantar net tartımını karşılaştırır.
              </p>
            </div>
          </div>

          {/* Çap Seçim Butonları */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-700 block mb-2">Donatı Çapı Seçimi (mm):</label>
            <div className="flex flex-wrap gap-2">
              {[8, 10, 12, 14, 16, 18, 20, 22, 25, 32].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDiameter(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedDiameter === d 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Ø{d}
                </button>
              ))}
            </div>
          </div>

          {/* Hesaplama Parametreleri */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs text-slate-600 block mb-1 font-semibold">Bağ Sayısı</label>
              <input 
                type="number"
                value={bundleCount}
                onChange={(e) => setBundleCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 text-sm"
              />
              <div className="text-[10px] text-slate-400 mt-1">Araçtaki bağ adedi</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs text-slate-600 block mb-1 font-semibold">Bağ Başına Çubuk (Adet)</label>
              <input 
                type="number"
                value={barsPerBundle}
                onChange={(e) => setBarsPerBundle(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 text-sm"
              />
              <div className="text-[10px] text-slate-400 mt-1">Standart 12 metre çubuk</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs text-slate-600 block mb-1 font-semibold">Kantar Net Tartımı (KG)</label>
              <input 
                type="number"
                value={actualWeighbridgeKg}
                onChange={(e) => setActualWeighbridgeKg(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 text-sm"
              />
              <div className="text-[10px] text-slate-400 mt-1">Fiili kantar tartımı</div>
            </div>
          </div>

          {/* Sonuç Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-sans text-[11px]">Toplam Çubuk & Metraj</div>
              <div className="text-base font-bold text-slate-900 mt-1">{totalBars} Adet / {(totalBars * barLengthMeters).toLocaleString()} m</div>
              <div className="text-[10px] text-slate-500 font-sans mt-0.5">Birim: {unitWeight.toFixed(3)} kg/m</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="text-blue-700 font-sans text-[11px] font-bold">Teorik Nominal Ağırlık</div>
              <div className="text-base font-bold text-blue-900 mt-1">{theoreticalTotalKg.toLocaleString()} KG</div>
              <div className="text-[10px] text-blue-600 font-sans mt-0.5">{(theoreticalTotalKg / 1000).toFixed(2)} Ton (Hesaplanan)</div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isToleranceOk ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className={`font-sans text-[11px] font-bold ${isToleranceOk ? 'text-emerald-700' : 'text-rose-700'}`}>
                Fark & Haddeleme Sapması
              </div>
              <div className={`text-base font-bold mt-1 ${isToleranceOk ? 'text-emerald-800' : 'text-rose-800'}`}>
                {weightDiffKg > 0 ? `+${weightDiffKg.toLocaleString()}` : weightDiffKg.toLocaleString()} KG (%{tolerancePercent})
              </div>
              <div className="text-[10px] font-sans mt-0.5 text-slate-600">
                {Number(tolerancePercent) > 0 ? 'Ağır Haddeleme (Müteahhit karlı)' : 'Hafif Haddeleme (Üretici karlı)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Modül 3 (Vinç & Karekodlu Çelik Etiket) & Modül 4 (Haddehane Kütük Verimi) & Modül 5 (Şantiye Erken Tahsilat) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 3: Vinç Yükleme & Karekodlu Çelik Tel Bağ Etiketleme */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold border border-slate-200">
                Tavan Vinci Tartımı
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Kalibre
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Vinç Tartımı & Metal Bağ Etiketi</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Her demir bağına UV ve paslanmaya dayanıklı karekodlu metal etiket basılır.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 text-white mb-4 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-bold text-white text-[11px]">TR-STEEL-TAG-0488</div>
                    <div className="text-[9px] text-slate-400">Şarj: {heatNo}</div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-bold">
                  B500C Ø{selectedDiameter}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Bağ Çubuk: {barsPerBundle} Adet</span>
                <span>Boy: 12.00 Metre</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Bağ Net Ağırlığı:</span>
                <span className="text-emerald-400 font-bold">{Math.round(barsPerBundle * singleBarTheoreticalKg).toLocaleString()} KG</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert(`${bundleCount} Adet Metal Çelik Tel Etiketi Yazıcıya Gönderildi!`)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Karekodlu Metal Tel Etiketleri Bas ({bundleCount} Adet)</span>
          </button>
        </div>

        {/* Modül 4: Haddehane Kütük Üretim Verimi (Tufal / Fire) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-bold border border-amber-200">
                130x130 Kütük Fırını
              </span>
              <span className="text-xs font-semibold text-slate-600">Net Verim: %{(100 - scaleWastePercent - cropEndPercent).toFixed(1)}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Haddehane Kütük & Tufal Firesi</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Tav fırınına giren kütük demir ile haddelenmiş inşaat demiri arasındaki oksidasyon (tufal) ve uç-kuyruk kesim firesi.
            </p>

            <div className="space-y-3 mb-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Fırına Giren Kütük Tonajı:</span>
                <span className="font-mono font-bold text-slate-900">{billetInputTons} Ton</span>
              </div>
              <div className="flex justify-between items-center text-rose-600">
                <span>Tufal (Oksidasyon) Firesi:</span>
                <span className="font-mono font-bold">%{scaleWastePercent} ({((billetInputTons * scaleWastePercent) / 100).toFixed(1)} Ton)</span>
              </div>
              <div className="flex justify-between items-center text-amber-600">
                <span>Uç-Kuyruk Kesim Firesi:</span>
                <span className="font-mono font-bold">%{cropEndPercent} ({((billetInputTons * cropEndPercent) / 100).toFixed(1)} Ton)</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                <span className="text-emerald-800 font-bold">Net Çıkan Mamul Donatı:</span>
                <span className="font-mono text-base font-bold text-emerald-800">{netFinishedSteelTons} Ton</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            Tufal atıkları manyetik ayırıcıyla toplanıp çimento fabrikalarına hammadde olarak sevk edilir.
          </div>
        </div>

        {/* Modül 5: Şantiye Demir Bağ Teslim QR & Erken Tahsilat */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200">
                Finansal Hızlandırıcı
              </span>
              <span className="text-xs font-bold text-emerald-600">24 Saatte Nakit</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Şantiye QR Onayı & Erken Tahsilat</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Şantiye şefi demir bağlarını telefon kamerasıyla okutup teslim aldığında faturanın %95'i banka garantisiyle anında hesaba geçer.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Şantiye Teslim Durumu:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Müteahhit Onayladı
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Fatura Tutarı:</span>
                <span className="font-mono font-bold text-slate-900">748.500 ₺</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 font-bold">
                <span className="text-emerald-700">Erken Finansman (T+1):</span>
                <span className="font-mono text-emerald-700">711.075 ₺ (%95)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert('Finansman talebi banka API ile iletildi. Tutar 24 saat içinde şirket hesabına aktarılacak.')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>24 Saat Erken Tahsilatı Başlat</span>
          </button>
        </div>

      </div>
    </div>
  );
};
