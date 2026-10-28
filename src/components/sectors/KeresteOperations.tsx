import React, { useState, useEffect } from 'react';
import { 
  TreePine, 
  Flame, 
  FileCheck2, 
  Package, 
  Scale, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Thermometer,
  ArrowRight,
  Clock,
  Printer
} from 'lucide-react';
import { api } from '../../services/api';

interface KeresteOperationsProps {
  onOpenWeighing: () => void;
}

export const KeresteOperations: React.FC<KeresteOperationsProps> = ({ onOpenWeighing }) => {
  // Calculator states
  const [logPieces, setLogPieces] = useState<number>(45);
  const [logAvgDiameter, setLogAvgDiameter] = useState<number>(32); // cm
  const [logLength, setLogLength] = useState<number>(4); // meters

  // Timber volume calc
  const [cutThickness, setCutThickness] = useState<number>(5); // cm
  const [cutWidth, setCutWidth] = useState<number>(10); // cm
  const [cutLength, setCutLength] = useState<number>(400); // cm
  const [cutPieces, setCutPieces] = useState<number>(180);
  const [woodSpecies, setWoodSpecies] = useState<string>('Sarıçam');
  const [woodDensity, setWoodDensity] = useState<number>(680); // kg/m3

  // Kiln Drying State
  const [kilnBatchNo, setKilnBatchNo] = useState<string>('KILN-2026-04');
  const [kilnMoisture, setKilnMoisture] = useState<number>(13.4);
  const [kilnTemp, setKilnTemp] = useState<number>(62.5);

  // Load live telemetry from Go API
  useEffect(() => {
    api.getSectorTelemetry('kereste').then((res) => {
      if (res && res.data) {
        if (res.data.logPieces) setLogPieces(res.data.logPieces);
        if (res.data.logAvgDiameter) setLogAvgDiameter(res.data.logAvgDiameter);
        if (res.data.logLength) setLogLength(res.data.logLength);
        if (res.data.cutThickness) setCutThickness(res.data.cutThickness);
        if (res.data.cutWidth) setCutWidth(res.data.cutWidth);
        if (res.data.cutLength) setCutLength(res.data.cutLength);
        if (res.data.cutPieces) setCutPieces(res.data.cutPieces);
        if (res.data.woodSpecies) setWoodSpecies(res.data.woodSpecies);
        if (res.data.woodDensity) setWoodDensity(res.data.woodDensity);
        if (res.data.kilnBatchNo) setKilnBatchNo(res.data.kilnBatchNo);
        if (res.data.kilnMoisture) setKilnMoisture(res.data.kilnMoisture);
        if (res.data.kilnTemp) setKilnTemp(res.data.kilnTemp);
      }
    }).catch(console.error);
  }, []);

  // Computed Values
  // Log volume formula: Huber formula = (pi * (d/2)^2 * L) / 10000
  const singleLogVolumeM3 = (Math.PI * Math.pow(logAvgDiameter / 2, 2) * logLength) / 10000;
  const totalLogVolumeM3 = (singleLogVolumeM3 * logPieces).toFixed(2);

  // Sawn timber volume: (T * W * L * Pieces) / 1,000,000
  const totalSawnM3 = ((cutThickness * cutWidth * cutLength * cutPieces) / 1000000).toFixed(2);
  const totalSawnKg = Math.round(Number(totalSawnM3) * woodDensity);
  const totalSawnTons = (totalSawnKg / 1000).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Sector Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Orman & Ahşap Sanayi İşletim Sistemi
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
              OGM & ISPM-15 Lisanslı
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TreePine className="w-6 h-6 text-emerald-600" />
            Kereste & Tomruk İhtisas Masası
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Tomruk kabulünden OGM nakliye tezkeresine, katrak biçki randımanından kurutma fırını nem takibine ve ISPM-15 ihracat palet damgalamasına kadar uçtan uca saha kontrolü.
          </p>
        </div>

        <button 
          onClick={onOpenWeighing}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Kereste Sevk / Fişi Aç</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Günlük Biçilen Tomruk</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">148.5 m³</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>%69.4 Net Biçki Randımanı</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Fırın Kurutma Durumu</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">%13.4 Nem</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Kalan Fırın Süresi: 14 Saat</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">ISPM-15 Palet Üretimi</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">840 Adet</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            İhracat Damgalı & Karekodlu
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Talaş & Pelet Satışı</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">38.2 Ton</div>
          <div className="text-[11px] text-slate-500 mt-1">
            MDF Fabrikasına Aktif Sevk
          </div>
        </div>
      </div>

      {/* Row 1: OGM Tomruk Kabul + Katrak Biçki Verimliliği */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modül 1: Tomruk Giriş & OGM Tezkeresi */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tomruk Giriş & OGM Orman Tezkeresi</h3>
                  <p className="text-xs text-slate-500">Orman İşletme Müdürlüğü resmi nakliye ve damga doğrulaması.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                OGM ENTEGRE
              </span>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Orman İşletmesi:</span>
                <span className="font-bold text-slate-900 font-sans">Bolu Aladağ Orman İşletme Müd.</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Nakliye Tezkere No:</span>
                <span className="font-bold text-slate-900">OGM-2026-TZ-884192</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Damga / Parti No:</span>
                <span className="font-bold text-slate-900">PRT-04/BOLU (1. Sınıf Tomruk)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Hesaplanan Giriş Hacmi:</span>
                <span className="font-bold text-emerald-700">{totalLogVolumeM3} m³</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Tomruk Adedi</label>
                <input 
                  type="number" 
                  value={logPieces} 
                  onChange={(e) => setLogPieces(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Ort. Çap (cm)</label>
                <input 
                  type="number" 
                  value={logAvgDiameter} 
                  onChange={(e) => setLogAvgDiameter(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Boy (Metre)</label>
                <input 
                  type="number" 
                  value={logLength} 
                  onChange={(e) => setLogLength(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Kaçak Kesim Kontrolü Yapıldı
            </span>
            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium cursor-pointer transition-all">
              Tezkereyi Doğrula
            </button>
          </div>
        </div>

        {/* Modül 2: Katrak & Biçki Verim / Fire Masası */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Katrak & Biçki Verim / Fire Analizi</h3>
                  <p className="text-xs text-slate-500">Tomruk girişine göre çıkan net kereste ve talaş randımanı.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                RAN Randall Modeli
              </span>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-semibold">1. Sınıf Kalıp Kerestesi (5x10 / 10x10)</span>
                  <span className="font-mono font-bold text-emerald-600">%69.4 (Net Çıkan: 103.1 m³)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[69.4%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-semibold">Kapak Tahtası & Çıta (İkincil Ürün)</span>
                  <span className="font-mono font-bold text-amber-600">%17.2 (Çıkan: 25.5 m³)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[17.2%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-semibold">Talaş & Kabuk Firesi (Pelet / MDF'ye Sevk)</span>
                  <span className="font-mono font-bold text-slate-500">%13.4 (19.9 m³ - 13.5 Ton)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full w-[13.4%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between">
              <div>
                <div className="font-bold">Fabrika Verimlilik Skoru: %94</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Sektör ortalaması %62; fire kaybı minimize edildi.</div>
              </div>
              <span className="font-mono font-bold text-emerald-800 text-sm">+7.4% Kar</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-right">
            <span className="text-xs text-slate-400 font-mono">Son Vardiya Kesim Raporu #V-882</span>
          </div>
        </div>
      </div>

      {/* Row 2: Kurutma Fırını + 3D Hacim/Tonaj Hesaplayıcı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modül 3: Fırın Kurutma & Nem Takip İstasyonu */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kurutma Fırını & Canlı Nem Radarı</h3>
                  <p className="text-xs text-slate-500">Çatlama ve dönmeyi önleyen parti bazlı nem ölçüm istasyonu.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                FIRIN AKTİF
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-sans flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                  <span>Fırın Sıcaklığı</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {kilnTemp}°C
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Optimum Kurutma Eğrisi</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-[11px] text-emerald-800 font-sans font-semibold">
                  Mevcut Nem Oranı
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
                  %{kilnMoisture}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Hedef: %12 - %14 (Hazır)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Parti Kodu:</span>
                <span className="font-mono font-bold text-slate-900">{kilnBatchNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fırındaki Ağaç Cinsi:</span>
                <span className="font-semibold text-slate-800">1. Sınıf Sarıçam Kalıp Kerestesi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kurutma Süresi:</span>
                <span className="font-semibold text-slate-800">58 Saat (14 Saat Kaldı)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Şantiyeye teslim için kalite onayı hazır</span>
            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Dijital Nem Sertifikası Bas</span>
            </button>
          </div>
        </div>

        {/* Modül 5: 3 Boyutlu Hacim m³ ➔ Tonaj Çevirici */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">3 Boyutlu Ebat / Hacim ➔ Tonaj Çevirici</h3>
                  <p className="text-xs text-slate-500">Adet x Ebat formülüyle anında m³ ve kantara esas ağırlık hesabı.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                HESAPLAMA MOTORU
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Kalınlık (cm)</label>
                <input 
                  type="number" 
                  value={cutThickness} 
                  onChange={(e) => setCutThickness(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Genişlik (cm)</label>
                <input 
                  type="number" 
                  value={cutWidth} 
                  onChange={(e) => setCutWidth(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Boy (cm)</label>
                <input 
                  type="number" 
                  value={cutLength} 
                  onChange={(e) => setCutLength(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Adet</label>
                <input 
                  type="number" 
                  value={cutPieces} 
                  onChange={(e) => setCutPieces(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[11px] text-slate-600 block mb-1">Ağaç Cinsi & Fırın Yoğunluğu</label>
              <select 
                value={woodDensity}
                onChange={(e) => {
                  setWoodDensity(Number(e.target.value));
                  if (e.target.value === '680') setWoodSpecies('Sarıçam');
                  if (e.target.value === '750') setWoodSpecies('Karaçam / Kızılçam');
                  if (e.target.value === '520') setWoodSpecies('Göknar / Ladin');
                  if (e.target.value === '820') setWoodSpecies('Meşe');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
              >
                <option value={680}>Sarıçam (%12-14 Nem) • 680 kg/m³</option>
                <option value={750}>Karaçam / Kızılçam • 750 kg/m³</option>
                <option value={520}>Göknar / Ladin (Hafif İnşaatlık) • 520 kg/m³</option>
                <option value={820}>Meşe (Sert Ağaç) • 820 kg/m³</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[10px] font-sans">Net Hacim</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">{totalSawnM3} m³</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-800 text-[10px] font-sans font-semibold">Kantara Esas Ağırlık</div>
                <div className="text-xl font-extrabold text-emerald-700 mt-0.5">{totalSawnTons} TON</div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">{(totalSawnKg).toLocaleString()} KG Net Sevk</span>
            <button 
              onClick={onOpenWeighing}
              className="font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Kantarda Tartımı Onayla</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};