import React, { useState, useEffect } from 'react';
import { 
  Recycle, 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck2, 
  ArrowRight,
  Radio,
  Sliders,
  DollarSign,
  Camera,
  Layers,
  Sparkles,
  Zap,
  Trash2
} from 'lucide-react';
import { api } from '../../services/api';

interface HurdaOperationsProps {
  onOpenWeighing: () => void;
}

export const HurdaOperations: React.FC<HurdaOperationsProps> = ({ onOpenWeighing }) => {
  // 1. NDK / TAEK Radyasyon Kapı Kontrolü State
  const [radiationCPS, setRadiationCPS] = useState<number>(18); // Normal 12-25 CPS
  const radiationThreshold = 60; // CPS alarm eşiği
  const isRadiationAlarm = radiationCPS > radiationThreshold;

  // 2. Eksper Fire & Çamur Kesinti Masası State
  const [grossWeightKg, setGrossWeightKg] = useState<number>(28450);
  const [tareWeightKg, setTareWeightKg] = useState<number>(13200);
  const [scrapType, setScrapType] = useState<string>('Ekstra Hurda (Ağır Sanayi)');
  const [wastePercent, setWastePercent] = useState<number>(4.5); // % Fire (çamur, su, pas, ametal)
  const [scrapUnitPriceTL, setScrapUnitPriceTL] = useState<number>(14.50); // TL / KG

  // 3. 9/10 KDV Tevkifatı & Stopaj Modu State
  const [supplierType, setSupplierType] = useState<'corporate' | 'individual'>('corporate');

  // 4. MoTAT Çevre Bakanlığı Sevk Formu State
  const [motatCode, setMotatCode] = useState<string>('MOTAT-2026-TR-88190');
  const [wasteCatalogCode, setWasteCatalogCode] = useState<string>('17 04 05'); // Demir ve Çelik

  // 5. Shredder Kırıcı & Manyetik Randıman State
  const [shredderInputTons, setShredderInputTons] = useState<number>(120);
  const [magneticIronPercent, setMagneticIronPercent] = useState<number>(72.5); // Saf Manyetik Demir
  const [eddyCurrentNonFerrous, setEddyCurrentNonFerrous] = useState<number>(7.5); // Alüminyum / Bakır
  const [shredderResidueFluff, setShredderResidueFluff] = useState<number>(20.0); // Plastik / Sünger Pasa

  // Load live telemetry from Go API
  useEffect(() => {
    api.getSectorTelemetry('hurda').then((res) => {
      if (res && res.data) {
        if (res.data.radiationCPS !== undefined) setRadiationCPS(res.data.radiationCPS);
        if (res.data.grossWeightKg) setGrossWeightKg(res.data.grossWeightKg);
        if (res.data.tareWeightKg) setTareWeightKg(res.data.tareWeightKg);
        if (res.data.scrapType) setScrapType(res.data.scrapType);
        if (res.data.wastePercent !== undefined) setWastePercent(res.data.wastePercent);
        if (res.data.scrapUnitPriceTL) setScrapUnitPriceTL(res.data.scrapUnitPriceTL);
        if (res.data.supplierType) setSupplierType(res.data.supplierType);
        if (res.data.motatCode) setMotatCode(res.data.motatCode);
        if (res.data.shredderInputTons) setShredderInputTons(res.data.shredderInputTons);
      }
    }).catch(console.error);
  }, []);

  const netGrossKg = grossWeightKg - tareWeightKg;
  const wasteDeductionKg = Math.round((netGrossKg * wastePercent) / 100);
  const finalAcceptedKg = netGrossKg - wasteDeductionKg;
  const totalAmountWithoutTax = finalAcceptedKg * scrapUnitPriceTL;

  // Tevkifat hesabı (KDV %20)
  const vatRate = 0.20;
  const fullVatTL = totalAmountWithoutTax * vatRate;
  const tevkifat9_10 = fullVatTL * 0.90; // Alıcının devlete ödeyeceği 2 No'lu KDV
  const sellerVat1_10 = fullVatTL * 0.10; // Satıcıya ödenecek 1/10 KDV
  const corporatePayableTL = totalAmountWithoutTax + sellerVat1_10;

  // Vatandaş alımı stopaj hesabı (%2 Gelir Vergisi stopajı)
  const individualStopajRate = 0.02;
  const stopajDeductionTL = totalAmountWithoutTax * individualStopajRate;
  const individualPayableTL = totalAmountWithoutTax - stopajDeductionTL;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Metal Geri Dönüşüm & Hurda Tesis Masası
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              NDK Radyasyon & 9/10 Tevkifat Uyumlu
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Recycle className="w-6 h-6 text-emerald-600" />
            Hurda Metal & Geri Dönüşüm İşletim Masası
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            NDK uyumlu kapı spektrometresi radyasyon taramasından eksper kameralı fire/çamur kesintisine, 9/10 KDV tevkifatı faturalandırmasından Shredder ayrışım randımanına tam saha kontrolü.
          </p>
        </div>

        <button 
          onClick={onOpenWeighing}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Hurda Giriş Tartımı Aç</span>
        </button>
      </div>

      {/* Grid: Modül 1 (NDK Radyasyon Kapı Spektrometresi) & Modül 2 (Eksper Fire Kesintisi) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 1: NDK/TAEK Radyasyon Kapı Kontrolü & Karantina Bariyeri */}
        <div className={`p-6 rounded-3xl border transition-all ${isRadiationAlarm ? 'bg-rose-50/90 border-rose-300' : 'bg-white border-slate-200/80'} shadow-xs flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold border border-slate-200">
                NDK Radyasyon Kapısı
              </span>
              <span className={`text-[11px] font-bold flex items-center gap-1 ${isRadiationAlarm ? 'text-rose-600 animate-pulse' : 'text-emerald-700'}`}>
                {isRadiationAlarm ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {isRadiationAlarm ? 'RADYASYON ALARMI!' : 'DOZ GÜVENLİ'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Radyasyon Kapı Dedektörü</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Nükleer Düzenleme Kurumu standartlarında tır geçişi esnasında anlık radyoaktif izotop ölçümü.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 text-white mb-4">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                <span>Anlık Spektrometre Dozu:</span>
                <span className="font-mono">Limit: &lt;60 CPS</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold font-mono ${isRadiationAlarm ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {radiationCPS}
                </span>
                <span className="text-xs font-mono text-slate-400">CPS (Count / Sec)</span>
              </div>

              {/* Doz Simülatörü */}
              <div className="mt-3 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Doz Test Simülasyonu:</span>
                  <span>{radiationCPS} CPS</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="120"
                  value={radiationCPS}
                  onChange={(e) => setRadiationCPS(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            {isRadiationAlarm ? (
              <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Kantar Bariyeri Acil Kilitlendi!
                </div>
                <div>Araç karantina cebine yönlendirildi. NDK acil bildirim logu oluşturuldu.</div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                Doğal arka plan radyasyonu dahilinde (18 CPS). Hurda tartımına ve tesis içine girişine izin verildi.
              </div>
            )}
          </div>

          <button 
            disabled={isRadiationAlarm}
            onClick={() => alert('Radyasyon temiz raporu oluşturuldu. Barkod kantar fişine işlendi.')}
            className={`mt-4 w-full py-2 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${isRadiationAlarm ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>NDK Temiz Raporu Mühürle</span>
          </button>
        </div>

        {/* Modül 2: Eksper Kameralı Fire, Çamur & Su Kesinti Masası */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Eksper Fire, Çamur & Su Kesinti Matrisi</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold">
                  4 Açılı HD Kamera Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kantar üstü kasada bulunan çamur, ıslaklık, pas ve ametal parçalar için eksper fire kesintisi uygular.
              </p>
            </div>
          </div>

          {/* Hurda Tipi Seçimi & Fiyat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Hurda Cinsi</label>
              <select 
                value={scrapType}
                onChange={(e) => setScrapType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value="DKP Sac Hurda">DKP Sac Hurda (İmalat Temiz - 15.80 ₺/kg)</option>
                <option value="Ekstra Hurda (Ağır Sanayi)">Ekstra Hurda (Ağır Sanayi - 14.50 ₺/kg)</option>
                <option value="1. Grup Demir Hurda">1. Grup Demir Hurda (13.90 ₺/kg)</option>
                <option value="Hurda Alüminyum Profil">Hurda Alüminyum Profil (82.00 ₺/kg)</option>
                <option value="Soyma Bakır Hurda">Soyma Bakır Hurda (320.00 ₺/kg)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Birim Alış Fiyatı (₺/KG)</label>
              <input 
                type="number"
                value={scrapUnitPriceTL}
                onChange={(e) => setScrapUnitPriceTL(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 text-xs"
                step="0.1"
              />
            </div>
          </div>

          {/* Eksper Fire Kesinti Slider'ı */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-slate-600" />
                Eksper Görsel Fire & Çamur Kesintisi:
              </span>
              <span className="font-mono text-base font-bold text-rose-600">%{wastePercent} Fire</span>
            </div>
            <input 
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={wastePercent}
              onChange={(e) => setWastePercent(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer mb-2"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>%0 (Temiz Sac)</span>
              <span>%5 (Normal Pas/Hafif Toz)</span>
              <span>%10+ (Ağır Çamur/Islaklık)</span>
            </div>
          </div>

          {/* Kantar Ağırlık Dağılımı */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-sans text-[11px]">Kantar Net Tartımı</div>
              <div className="text-base font-bold text-slate-900 mt-1">{netGrossKg.toLocaleString()} KG</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Brüt: {grossWeightKg} - Dara: {tareWeightKg}</div>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="text-rose-700 font-sans text-[11px] font-bold">Fire Kesintisi</div>
              <div className="text-base font-bold text-rose-700 mt-1">-{wasteDeductionKg.toLocaleString()} KG</div>
              <div className="text-[10px] text-rose-600 font-sans mt-0.5">%{wastePercent} çamur/su düşüldü</div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-emerald-700 font-sans text-[11px] font-bold">Kabul Edilen Net</div>
              <div className="text-base font-bold text-emerald-800 mt-1">{finalAcceptedKg.toLocaleString()} KG</div>
              <div className="text-[10px] text-emerald-600 font-sans mt-0.5">{(finalAcceptedKg / 1000).toFixed(2)} Ton ödemeye esas</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 text-white font-sans flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-slate-400">Tahakkuk Eden Matrah:</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  {Math.round(totalAmountWithoutTax).toLocaleString()} ₺
                </div>
              </div>
              <div className="text-[9px] text-slate-400 font-mono">KDV hariç net bedel</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Modül 3 (9/10 KDV Tevkifatı & Stopaj) & Modül 4 (MoTAT) & Modül 5 (Shredder Randımanı) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 3: 9/10 KDV Tevkifatı & e-Müstahsil Stopaj Hesaplayıcı */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold border border-slate-200">
                GİB Mevzuat
              </span>
              <span className="text-xs font-bold text-slate-700">Vergi Simülatörü</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">9/10 KDV Tevkifatı / Stopaj</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-3">
              Tedarikçi firma ise 9/10 KDV tevkifatı, vergi mükellefi olmayan vatandaştan alımda ise stopaj kesintisi uygulanır.
            </p>

            {/* Tedarikçi Tipi Seçimi */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setSupplierType('corporate')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  supplierType === 'corporate' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Firma (9/10 KDV)
              </button>
              <button
                onClick={() => setSupplierType('individual')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  supplierType === 'individual' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Bireysel (Stopaj)
              </button>
            </div>

            {supplierType === 'corporate' ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Hurda Matrahı:</span>
                  <span className="font-bold text-slate-900">{Math.round(totalAmountWithoutTax).toLocaleString()} ₺</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Hesaplanan KDV (%20):</span>
                  <span>{Math.round(fullVatTL).toLocaleString()} ₺</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold border-t border-slate-200 pt-1.5">
                  <span>9/10 Tevkifat (Devlete 2 No KDV):</span>
                  <span>-{Math.round(tevkifat9_10).toLocaleString()} ₺</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>1/10 KDV (Satıcıya Ödenecek):</span>
                  <span>+{Math.round(sellerVat1_10).toLocaleString()} ₺</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1.5 text-sm">
                  <span>Satıcıya Ödenecek Toplam:</span>
                  <span>{Math.round(corporatePayableTL).toLocaleString()} ₺</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Hurda Bedeli:</span>
                  <span className="font-bold text-slate-900">{Math.round(totalAmountWithoutTax).toLocaleString()} ₺</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>%2 Gelir Vergisi Stopajı:</span>
                  <span>-{Math.round(stopajDeductionTL).toLocaleString()} ₺</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1.5 text-sm">
                  <span>Net Ele Geçen (Nakit/Havale):</span>
                  <span>{Math.round(individualPayableTL).toLocaleString()} ₺</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-1">
                  e-Müstahsil Makbuzu GİB entegrasyonu ile otomatik kesilir.
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => alert(`GİB Uyumlu ${supplierType === 'corporate' ? '9/10 Tevkifatlı e-Fatura' : 'e-Müstahsil Makbuzu'} düzenlendi!`)}
            className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Maliye Onaylı Fatura / Makbuz Kes</span>
          </button>
        </div>

        {/* Modül 4: Çevre Bakanlığı MoTAT Atık Sevk Belgesi */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200">
                MoTAT Yeşil Taşıma
              </span>
              <span className="text-xs font-bold text-emerald-600">Lisanslı Geri Dönüşüm</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Çevre Bakanlığı MoTAT Sistemi</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Atık Yönetimi Yönetmeliği kapsamında hurda nakliye aracının dijital taşıma formu ve kantar entegrasyonu.
            </p>

            <div className="space-y-3 mb-4 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">MoTAT Form No:</span>
                  <span className="font-bold text-slate-900">{motatCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Atık Katalog Kodu:</span>
                  <span className="font-bold text-slate-900">{wasteCatalogCode} (Demir-Çelik)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Lisans Belge No:</span>
                  <span className="font-bold text-emerald-700">ÇŞB-GDK-2026-442-A</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-slate-700 font-sans space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Çevre Denetim Riski Sıfır
                </div>
                <div className="text-[11px] text-emerald-700 leading-tight">
                  Kantar net ağırlığı ({finalAcceptedKg.toLocaleString()} KG) anında MoTAT sistemine kaydedilir.
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert(`MoTAT Sevk Formu Bakanlık sistemine iletildi: ${motatCode}`)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-slate-700" />
            <span>MoTAT Sevk Belgesini İndir</span>
          </button>
        </div>

        {/* Modül 5: Shredder Kırıcı & Manyetik / Optik Randıman */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-bold border border-amber-200">
                Shredder Hattı (4.000 HP)
              </span>
              <span className="text-xs font-bold text-slate-700">65 Ton/Saat</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Shredder Kırma & Ayrışım</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Araç gövdesi ve beyaz eşyaların manyetik tambur ve Eddy Current ile ayrışım randımanı.
            </p>

            <div className="space-y-3 mb-4 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-600 font-sans">
                <span>Hatta Giren Hurda:</span>
                <span className="font-bold text-slate-900 font-mono">{shredderInputTons} Ton</span>
              </div>

              {/* Randıman Çubukları */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-emerald-700 font-bold font-sans">Manyetik Demir (%72.5)</span>
                  <span className="font-bold font-mono text-emerald-800">{Math.round(shredderInputTons * (magneticIronPercent / 100))} Ton</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${magneticIronPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-blue-700 font-bold font-sans">Eddy Current Alüminyum (%7.5)</span>
                  <span className="font-bold font-mono text-blue-800">{Math.round(shredderInputTons * (eddyCurrentNonFerrous / 100))} Ton</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${eddyCurrentNonFerrous}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 font-sans">ASR Plastik Pasa (%20.0)</span>
                  <span className="font-bold font-mono text-slate-600">{Math.round(shredderInputTons * (shredderResidueFluff / 100))} Ton</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: `${shredderResidueFluff}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            Ayrıştırılan temiz kırma sac demir çelik haddehanelerine premium fiyattan sevk edilir.
          </div>
        </div>

      </div>
    </div>
  );
};
