import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Scale, 
  Fuel, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck2, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Radio,
  Sliders,
  Sparkles,
  Zap
} from 'lucide-react';
import { api } from '../../services/api';

interface NakliyeOperationsProps {
  onOpenWeighing: () => void;
}

export const NakliyeOperations: React.FC<NakliyeOperationsProps> = ({ onOpenWeighing }) => {
  // 1. Backhaul (Dönüş Yükü) Borsa State
  const [backhaulCorridor, setBackhaulCorridor] = useState<string>('dilovasi_aliaga');
  const [backhaulTripsThisMonth, setBackhaulTripsThisMonth] = useState<number>(42);
  const [emptyKmSaved, setEmptyKmSaved] = useState<number>(14280); // Boş km tasarrufu
  const [fuelSavingsTL, setFuelSavingsTL] = useState<number>(318000); // ₺ tasarruf

  // 2. U-ETDS Bakanlık Entegrasyonu State
  const [uetdsTripNo, setUetdsTripNo] = useState<string>('UETDS-2026-TR-49102');
  const [uetdsPlate, setUetdsPlate] = useState<string>('34 FLL 890');
  const [uetdsDriverTc, setUetdsDriverTc] = useState<string>('28491028472');

  // 3. CAN-Bus Mazot & Telemetri State
  const [loadedConsumptionL100Km, setLoadedConsumptionL100Km] = useState<number>(38.2); // Yüklü 100km tüketim
  const [emptyConsumptionL100Km, setEmptyConsumptionL100Km] = useState<number>(26.4); // Boş 100km tüketim
  const [fuelDropAlert, setFuelDropAlert] = useState<boolean>(false);
  const [fuelDropLiters, setFuelDropLiters] = useState<number>(18); // Gece ani düşüş

  // 4. Lastik Ömrü & Dingil Yükü
  const [tireTreadMm, setTireTreadMm] = useState<number>(6.5); // mm (yasal sınır 1.6mm, güvenli sınır 4mm)

  // 5. Erken Navlun Ödemesi
  const [freightInvoiceAmount, setFreightInvoiceAmount] = useState<number>(14500);

  // Backhaul koridor verileri
  const corridors: Record<string, { name: string; cargo: string; tons: number; rateTL: number; origin: string; destination: string }> = {
    dilovasi_aliaga: {
      name: 'Dilovası Liman ➔ Aliağa Organize Sanayi',
      cargo: 'Rulo Sac & Dökme Hurda',
      tons: 27.5,
      rateTL: 14500,
      origin: 'Kocaeli (Dilovası)',
      destination: 'İzmir (Aliağa)'
    },
    gebze_bozuyuk: {
      name: 'Gebze Taş Ocakları ➔ Bozüyük Seramik Tesisleri',
      cargo: 'Kuvars Kumu & Feldspat',
      tons: 29.0,
      rateTL: 9800,
      origin: 'Gebze',
      destination: 'Bilecik (Bozüyük)'
    },
    iskenderun_konya: {
      name: 'İskenderun Demir Çelik ➔ Konya Şantiyeleri',
      cargo: 'Nervürlü Donatı Demiri',
      tons: 26.0,
      rateTL: 16200,
      origin: 'Hatay (İskenderun)',
      destination: 'Konya'
    }
  };

  const selectedCorridorData = corridors[backhaulCorridor] || corridors['dilovasi_aliaga'];

  // Load live telemetry from Go API
  useEffect(() => {
    api.getSectorTelemetry('nakliye_lojistik').then((res) => {
      if (res && res.data) {
        if (res.data.backhaulCorridor) setBackhaulCorridor(res.data.backhaulCorridor);
        if (res.data.backhaulTripsThisMonth !== undefined) setBackhaulTripsThisMonth(res.data.backhaulTripsThisMonth);
        if (res.data.emptyKmSaved !== undefined) setEmptyKmSaved(res.data.emptyKmSaved);
        if (res.data.fuelSavingsTL !== undefined) setFuelSavingsTL(res.data.fuelSavingsTL);
        if (res.data.uetdsTripNo) setUetdsTripNo(res.data.uetdsTripNo);
        if (res.data.uetdsPlate) setUetdsPlate(res.data.uetdsPlate);
        if (res.data.uetdsDriverTc) setUetdsDriverTc(res.data.uetdsDriverTc);
        if (res.data.loadedConsumptionL100Km !== undefined) setLoadedConsumptionL100Km(res.data.loadedConsumptionL100Km);
        if (res.data.emptyConsumptionL100Km !== undefined) setEmptyConsumptionL100Km(res.data.emptyConsumptionL100Km);
        if (res.data.tireTreadMm !== undefined) setTireTreadMm(res.data.tireTreadMm);
        if (res.data.freightInvoiceAmount !== undefined) setFreightInvoiceAmount(res.data.freightInvoiceAmount);
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
              Ağır Vasıta & Dökme Nakliye Filosu İşletim Sistemi
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              U-ETDS Bakanlık & CAN-Bus Telemetri Entegre
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-slate-800" />
            Dökme Lojistik & Ağır Vasıta Filo Masası
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Boş dönüş (backhaul) yük pazarından tek tıkla U-ETDS bakanlık sefer bildirimine, CAN-Bus telemetri mazot hırsızlığı alarmından şantiye onaylı 24 saatte erken navlun tahsilatına filo kontrolü.
          </p>
        </div>

        <button 
          onClick={onOpenWeighing}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Filo Sefer Tartımı Aç</span>
        </button>
      </div>

      {/* Grid: Modül 1 (Backhaul Dönüş Yükü Pazarı) & Modül 2 (U-ETDS Sefer Bildirimi) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 1: Bölgesel Boş Dönüş (Backhaul) Dökme Yük Eşleşme Pazarı */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Bölgesel Boş Dönüş (Backhaul) Dökme Yük Pazarı</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                  Boş Sefer Oranı: %9'a İndi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Damper veya silobasınız boş dönmesin. Bölgedeki maden, çimento, haddehane ve antrepolardan anlık dönüş yükü yakalar.
              </p>
            </div>
          </div>

          {/* Aylık Tasarruf Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-sans text-[11px]">Dönüş Yükü Alınan Sefer</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{backhaulTripsThisMonth} Sefer</div>
              <div className="text-[10px] text-emerald-600 font-sans mt-0.5">Bu ay boş km sıfırlandı</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-sans text-[11px]">Kazanılan Boş Mesafe</div>
              <div className="text-xl font-bold text-blue-700 mt-1">{emptyKmSaved.toLocaleString()} KM</div>
              <div className="text-[10px] text-slate-500 font-sans mt-0.5">Boş yakıt yakılmadı</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-emerald-700 font-sans text-[11px] font-bold">Ek Navlun Geliri</div>
              <div className="text-xl font-bold text-emerald-700 mt-1">{fuelSavingsTL.toLocaleString()} ₺</div>
              <div className="text-[10px] text-emerald-600 font-sans mt-0.5">Net filo karlılığına eklendi</div>
            </div>
          </div>

          {/* Koridor Seçimi & Canlı İlan */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-semibold text-slate-700 block mb-2">Canlı Dökme Yük Hatları</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              {Object.entries(corridors).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setBackhaulCorridor(key)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer text-xs ${
                    backhaulCorridor === key 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-[11px] truncate">{item.origin} ➔ {item.destination}</div>
                  <div className={`text-[10px] mt-0.5 ${backhaulCorridor === key ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.cargo} • {item.tons}T
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-slate-900 text-sm">{selectedCorridorData.name}</div>
                <div className="text-slate-600 mt-0.5">
                  Taşınacak Yük: <span className="font-semibold text-slate-800">{selectedCorridorData.cargo}</span> • Tonaj: <span className="font-mono font-bold text-slate-900">{selectedCorridorData.tons} Ton</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-emerald-600">{selectedCorridorData.rateTL.toLocaleString()} ₺</div>
                  <div className="text-[10px] text-slate-400">Tek sefer net navlun</div>
                </div>

                <button 
                  onClick={() => alert(`${selectedCorridorData.name} için dönüş yükü sözleşmesi bağlandı! U-ETDS kaydı oluşturuldu.`)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  Dönüş Yükünü Bağla
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modül 2: Tek Tıkla Toplu U-ETDS Bakanlık Sefer Bildirimi */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200">
                UAB U-ETDS Entegre
              </span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                %100 Ceza Koruması
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">U-ETDS Bakanlık Sefer Bildirimi</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Ulaştırma ve Altyapı Bakanlığı zorunlu yük bildirimini kantar tartımı biter bitmez otomatik iletir.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 mb-4 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">U-ETDS Sefer Kodu:</span>
                <span className="font-bold text-slate-900">{uetdsTripNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Çekici / Dorse:</span>
                <span className="font-bold text-slate-900">{uetdsPlate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Kaptan TC No:</span>
                <span className="font-bold text-slate-900">{uetdsDriverTc}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Taşınan Net Yük:</span>
                <span className="font-bold text-emerald-700">{selectedCorridorData.tons} Ton</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
              Yol kenarı polis/jandarma denetiminde tablet ekranından QR kod gösterilerek anında geçiş sağlanır.
            </div>
          </div>

          <button 
            onClick={() => alert(`U-ETDS Sefer Bildirimi Ulaştırma Bakanlığı veri tabanına mühürlendi! Sefer No: ${uetdsTripNo}`)}
            className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>U-ETDS Karekodlu Sefer Belgesi İndir</span>
          </button>
        </div>

      </div>

      {/* Grid: Modül 3 (CAN-Bus Mazot & Depo Alarmı) & Modül 4 (Lastik Ömrü) & Modül 5 (Erken Navlun) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modül 3: CAN-Bus Mazot Sarfiyatı & Şüpheli Depo Alarmı */}
        <div className={`p-6 rounded-3xl border transition-all ${fuelDropAlert ? 'bg-rose-50/90 border-rose-300' : 'bg-white border-slate-200/80'} shadow-xs flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold border border-slate-200">
                CAN-Bus Telemetri
              </span>
              <span className={`text-xs font-bold ${fuelDropAlert ? 'text-rose-600 animate-pulse' : 'text-emerald-700'}`}>
                {fuelDropAlert ? 'ŞÜPHELİ YAKIT ALARMI!' : 'Depo Güvende'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Mazot Sarfiyatı & Hırsızlık Radarı</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Kantar tonajı ile motor telemetrisi eşleşir. Gece park halinde 15+ litre ani mazot düşüşünde filo müdürüne SMS gider.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-900 text-white mb-4 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Yüklü Sarfiyat (42T):</span>
                <span className="text-emerald-400 font-bold">{loadedConsumptionL100Km} Litre / 100 KM</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Boş Dönüş Sarfiyatı:</span>
                <span>{emptyConsumptionL100Km} Litre / 100 KM</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between text-[11px] text-slate-400">
                <span>CAN-Bus Depo Şamandırası:</span>
                <span className="text-white font-bold">480 Litre (%80 Dolu)</span>
              </div>
            </div>

            {/* Test Alarm Tetikleyici */}
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 font-semibold">Şüpheli Mazot Boşaltma Simülasyonu:</span>
              <button 
                onClick={() => setFuelDropAlert(!fuelDropAlert)}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${fuelDropAlert ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                {fuelDropAlert ? 'Alarmı Kapat' : 'Alarmı Tetikle'}
              </button>
            </div>
          </div>

          {fuelDropAlert && (
            <div className="mt-3 p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Gece Park Halinde 18 Litre Ani Düşüş!
              </div>
              <div>Araç lokasyonu: Gebze Tır Parkı. Şoföre ve Güvenliğe anlık bildirim iletildi.</div>
            </div>
          )}
        </div>

        {/* Modül 4: Aks Ağırlığı & Lastik Aşınma Takip Masası */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold border border-blue-200">
                12 Lastik Takip
              </span>
              <span className="text-xs font-bold text-slate-700">Filo Bakım</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dingil Ağırlığı & Lastik Ömrü</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Kantar dingil yüküne göre lastik diş aşınmasını ve hava basıncını simüle ederek %18 lastik tasarrufu sağlar.
            </p>

            <div className="space-y-3 mb-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Ortalama Diş Derinliği:</span>
                <span className="font-mono font-bold text-slate-900">{tireTreadMm} mm</span>
              </div>
              <input 
                type="range"
                min="1.6"
                max="12.0"
                step="0.1"
                value={tireTreadMm}
                onChange={(e) => setTireTreadMm(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-rose-600">Yasal Limit (1.6 mm)</span>
                <span className="text-amber-600">Uyarı (4.0 mm)</span>
                <span className="text-emerald-600">Yeni Lastik (12 mm)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600 font-sans">
                  <span>Tahmini Kalan Kilometre:</span>
                  <span className="font-bold text-slate-900">{Math.round((tireTreadMm - 1.6) * 12500).toLocaleString()} KM</span>
                </div>
                <div className="flex justify-between text-slate-600 font-sans">
                  <span>Lastik Grubu Sağlığı:</span>
                  <span className="font-bold text-emerald-700">İyi Durumda (%{((tireTreadMm / 12) * 100).toFixed(0)})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            Damperin aks ağırlığı dengeli yüklendiğinde lastik ömrü 40.000 KM uzar.
          </div>
        </div>

        {/* Modül 5: Şantiye Onaylı Sefer Başı 24 Saatte Erken Navlun Ödemesi */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200">
                Hızlı Likidite
              </span>
              <span className="text-xs font-bold text-emerald-600">24 Saatte Nakit</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Şantiye Onaylı Erken Navlun</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Şantiye şefi cep telefonundan teslim irsaliyesini onayladığı an navlun bedeli 24 saat içinde şirket hesabınıza yatar.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Sefer Teslimatı:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Şantiyede Teslim Edildi
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Navlun Bedeli:</span>
                <span className="font-mono font-bold text-slate-900">{freightInvoiceAmount.toLocaleString()} ₺</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 font-bold">
                <span className="text-emerald-700">Yatacak Tutar (T+1):</span>
                <span className="font-mono text-emerald-700">{(freightInvoiceAmount * 0.96).toLocaleString()} ₺</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert(`Erken navlun ödemesi talep edildi! ${((freightInvoiceAmount * 0.96)).toLocaleString()} ₺ tutarındaki navlun 24 saat içinde hesabınıza aktarılacak.`)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>24 Saatte Erken Navlun Tahsil Et</span>
          </button>
        </div>

      </div>
    </div>
  );
};
