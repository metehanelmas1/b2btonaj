import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  AlertTriangle, 
  Thermometer, 
  CheckCircle2, 
  Scale, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Radio,
  FileCheck2,
  RefreshCw,
  Truck,
  RotateCw
} from 'lucide-react';
import { api } from '../../services/api';

interface BetonOperationsProps {
  onOpenWeighing: () => void;
}

export const BetonOperations: React.FC<BetonOperationsProps> = ({ onOpenWeighing }) => {
  // Mixer slump timers state
  const [mixers, setMixers] = useState<any[]>([
    {
      plate: '34 BTR 819',
      driver: 'Cemil Karadağ',
      concreteClass: 'C35/45 Hazır Beton',
      volumeM3: 8.5,
      site: 'Göztepe Metro İstasyon Şantiyesi',
      minutesRemaining: 28,
      temperatureC: 21.4,
      status: 'CRITICAL',
    },
    {
      plate: '34 BTR 402',
      driver: 'Hasan Çelik',
      concreteClass: 'C30/37 Katlı Otopark',
      volumeM3: 9.0,
      site: 'Kartal Kentsel Dönüşüm 2. Etap',
      minutesRemaining: 62,
      temperatureC: 20.8,
      status: 'NORMAL',
    },
    {
      plate: '34 BTR 110',
      driver: 'Murat Şahin',
      concreteClass: 'C25/30 Zemin Betonu',
      volumeM3: 9.5,
      site: 'Maltepe Konut Projesi Sahası',
      minutesRemaining: 84,
      temperatureC: 19.9,
      status: 'SAFE',
    }
  ]);

  // Silo levels
  const [cementSilo1, setCementSilo1] = useState<number>(28); // %
  const [cementSilo2, setCementSilo2] = useState<number>(82); // %
  const [admixtureTank, setAdmixtureTank] = useState<number>(64); // %

  // Slump QA Tester state
  const [testSlumpCm, setTestSlumpCm] = useState<number>(14);
  const [testTemp, setTestTemp] = useState<number>(21.5);
  const [waterAddedByDriver, setWaterAddedByDriver] = useState<boolean>(false);

  // Recycled concrete
  const [returnedM3, setReturnedM3] = useState<number>(4.0);

  // Load live telemetry from Go API
  useEffect(() => {
    api.getSectorTelemetry('beton').then((res) => {
      if (res && res.data) {
        if (res.data.cementSilo1 !== undefined) setCementSilo1(res.data.cementSilo1);
        if (res.data.cementSilo2 !== undefined) setCementSilo2(res.data.cementSilo2);
        if (res.data.admixtureTank !== undefined) setAdmixtureTank(res.data.admixtureTank);
        if (res.data.mixers && res.data.mixers.length > 0) setMixers(res.data.mixers);
        if (res.data.testSlumpCm !== undefined) setTestSlumpCm(res.data.testSlumpCm);
        if (res.data.testTemp !== undefined) setTestTemp(res.data.testTemp);
        if (res.data.returnedM3 !== undefined) setReturnedM3(res.data.returnedM3);
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
              Hazır Beton Santral İşletim Sistemi
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
              EBİS Çip & Çevre Bakanlığı Uyumlu
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-amber-500" />
            Hazır Beton Santrali Operasyon Masası
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Çimento ve katkı silolarının canlı seviyesinden mikser priz (slump) geri sayımına, şantiye su katma engellemesinden 28 günlük EBİS numune kırım raporlarına kadar tam santral kontrolü.
          </p>
        </div>

        <button 
          onClick={onOpenWeighing}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Mikser Çıkış Tartımı Aç</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Bugünkü Sevk Betonu</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">2.840 m³</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            42 Mikser Seferi • Sıfır Priz Gecikmesi
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Çimento Silo 1 (CEM I)</div>
          <div className="text-2xl font-extrabold text-rose-600 font-mono mt-1">%{cementSilo1} Doluluk</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Kritik! 2 Mikserlik Kaldı</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Aktif Pompa Sayısı</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">6 Pompa Sahada</div>
          <div className="text-[11px] text-slate-500 mt-1">
            47m ve 56m Bomlu Putzmeister
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">28 Günlük Kırım Ort.</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">38.4 MPa</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Hedef C35/45 Aşıldı (%100 Başarı)
          </div>
        </div>
      </div>

      {/* Row 1: Mikser Priz Geri Sayımı + Silo Seviye Radarı */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Modül 2.2: Mikser Priz (Slump) Canlı Geri Sayımı */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Mikser Priz Süresi (Slump) Canlı Geri Sayımı</h3>
                  <p className="text-xs text-slate-500">Maks. 90-120 dk içinde şantiyeye dökülmeyen beton kazan içinde donar.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                LİMİT: 90 DK
              </span>
            </div>

            <div className="space-y-3">
              {mixers.map((m, idx) => {
                const isCritical = m.minutesRemaining <= 30;
                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCritical ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                            {m.plate}
                          </span>
                          <span className={`text-xs font-bold ${isCritical ? 'text-rose-700' : 'text-slate-700'}`}>
                            {m.concreteClass} ({m.volumeM3} m³)
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {m.site} • Şoför: {m.driver}
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className={`text-lg font-mono font-extrabold ${isCritical ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {m.minutesRemaining} DAKİKA KALDI
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Kazan Sıcaklığı: {m.temperatureC}°C
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isCritical ? 'bg-rose-500 w-[78%]' : 'bg-emerald-500 w-[35%]'
                        }`}
                      />
                    </div>

                    {isCritical && (
                      <div className="mt-3 pt-2 border-t border-rose-200 flex items-center justify-between text-xs">
                        <span className="text-rose-700 font-bold text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Acil Döküm Uyarısı! Şantiyede pompa önceliği talep edin.
                        </span>
                        <button className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-800 text-[11px] font-bold rounded-lg border border-rose-300 cursor-pointer shadow-2xs">
                          Şantiyeye Alarm Gönder
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-right">
            <span className="text-xs text-slate-400 font-mono">GPS Telemetri & Mikser Kazan Devri Canlı Aktif</span>
          </div>
        </div>

        {/* Modül 2.1: Çimento & Katkı Silosu Seviye Radarı */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  <Radio className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Çimento & Katkı Siloları Radarı</h3>
                  <p className="text-xs text-slate-500">Döküm ortasında hammadde bitmesini önleyen ikmal alarmı.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                SCADA ENTEGRE
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {/* Silo 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-bold">Silo 1: Çimento CEM I 42.5 R</span>
                  <span className="font-mono font-bold text-rose-600">85 Ton (%{cementSilo1} - Kritik)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[28%] rounded-full"></div>
                </div>
              </div>

              {/* Silo 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-bold">Silo 2: Çimento CEM II / B-LL</span>
                  <span className="font-mono font-bold text-emerald-600">240 Ton (%{cementSilo2} - Yeterli)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[82%] rounded-full"></div>
                </div>
              </div>

              {/* Kimyasal Katkı Tankı */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-bold">Tank 3: Süperakışkanlaştırıcı Katkı</span>
                  <span className="font-mono font-bold text-blue-600">12.800 Lt (%{admixtureTank})</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[64%] rounded-full"></div>
                </div>
              </div>

              {/* Agrega Bunkeri */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 font-mono">
                <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Agrega Bunker Seviyeleri</div>
                <div className="flex justify-between">
                  <span>0-4 mm Yıkanmış Kum:</span>
                  <span className="font-bold text-slate-900">420 Ton</span>
                </div>
                <div className="flex justify-between">
                  <span>7-15 mm Kırma Taş:</span>
                  <span className="font-bold text-slate-900">1.280 Ton</span>
                </div>
                <div className="flex justify-between">
                  <span>15-25 mm İri Agrega:</span>
                  <span className="font-bold text-slate-900">950 Ton</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <button className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <Truck className="w-4 h-4" />
              <span>Çimsa Fabrikasına Acil Silobas Siparişi Geç</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Şantiye Su Katma Engelleme + EBİS Numune & Geri Dönen Beton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modül 2.4: Şantiye Slump & Su Katma Kalkanı */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Şantiye Slump & Su Katma Mührü</h3>
                <p className="text-xs text-slate-500">Şantiye şefinin betona ekstra su basıp mukavemeti düşürmesini önler.</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Slump Konisi Ölçümü (cm)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={testSlumpCm} 
                    onChange={(e) => setTestSlumpCm(Number(e.target.value))}
                    className="w-24 bg-white border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-slate-500">S3 Kıvam Sınıfı (10-15 cm)</span>
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Kazan İçi Beton Sıcaklığı</label>
                <div className="font-mono font-bold text-slate-900 text-base">{testTemp}°C (Normal)</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-xs">Şantiyede Ek Su Katılmadı</div>
                  <div className="text-[10px] text-slate-500">Şantiye şefi cep telefonuyla mühürler.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={!waterAddedByDriver}
                  onChange={() => setWaterAddedByDriver(!waterAddedByDriver)}
                  className="w-4 h-4 accent-slate-900 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Hukuki Dayanım Sorumluluğu Mühürlendi
            </span>
          </div>
        </div>

        {/* Modül 2.5: Çevre Bakanlığı EBİS Çipli Numune Kırım Masası */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">EBİS Çipli Numune & 28 Gün Kırım</h3>
                <p className="text-xs text-slate-500">Bakanlık elektronik beton izleme kırım sonuçları.</p>
              </div>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-sans text-slate-500">EBİS Çip No:</span>
                <span className="font-bold text-slate-900">TR-EBIS-99214-A</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-sans text-slate-500">Numune Sayısı:</span>
                <span className="font-bold text-slate-900">6 Adet (15x15 Küp)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-sans text-slate-500">7 Günlük Dayanım:</span>
                <span className="font-bold text-slate-900">26.8 MPa (%76)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">28 Günlük Basınç:</span>
                <span className="font-bold text-emerald-700">38.4 MPa (GEÇTİ)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Çevre, Şehircilik ve İklim Bakanlığı Portalı Eşleşti</span>
          </div>
        </div>

        {/* Modül 2.6: Dönen Beton / Geri Dönüşüm Lego Blok Masası */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <RotateCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dönen Beton & Geri Dönüşüm Blok</h3>
                <p className="text-xs text-slate-500">Şantiyeden artan taze betonun çöpe gitmesini önler.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Mikserde Kalan Beton:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{returnedM3} m³</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                <div className="font-bold">Önerilen Geri Kazanım Rotası:</div>
                <div>• 2 Adet Prekast T-Blok (Lego Beton) Kalıbına Dök</div>
                <div>• Değer Kurtarımı: +3.600 ₺ (Sıfır Çevre Cezası)</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
              Geri Dönüşüm Blok Kalıbına Yönlendir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};