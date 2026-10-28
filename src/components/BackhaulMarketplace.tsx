import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2
} from 'lucide-react';
import { BackhaulLoad } from '../types';
import { api } from '../services/api';

export const BackhaulMarketplace: React.FC = () => {
  const [loads, setLoads] = useState<BackhaulLoad[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [bookedLoadId, setBookedLoadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getBackhaulLoads().then((data) => {
      setLoads(data);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const handleBook = async (id: string) => {
    try {
      await api.bookBackhaulLoad(id);
      setBookedLoadId(id);
      setLoads(prev => prev.map(l => l.id === id ? { ...l, isBooked: true } : l));
      setTimeout(() => {
        setBookedLoadId(null);
      }, 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = filterType === 'ALL' 
    ? loads 
    : loads.filter(l => l.vehicleType.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Backhaul Takas Ağı • Go API Canlı Veri
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
              {loads.length} Canlı Sefer İlanı
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Boş Dönüş (Backhaul) Dökme Yük Pazaryeri
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Taş ocağına, antrepoya veya hurdalığa boş dönen araçlar için anlık dökme yük eşleşmesi.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-50 p-1 rounded-lg border border-slate-200/80">
          {['ALL', 'Damper', 'Sal Kasa', 'Silobas'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t === 'ALL' ? 'Tüm Araçlar' : t}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200/80">
          Go API üzerinden canlı dönüş yükleri getiriliyor...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((load) => {
            const isBooked = bookedLoadId === load.id || load.isBooked;

            return (
              <div 
                key={load.id}
                className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {load.vehicleType}
                    </span>
                    {load.urgency === 'HIGH' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Acil Yük
                      </span>
                    )}
                    {load.urgency === 'NORMAL' && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                        Planlı Sefer
                      </span>
                    )}
                  </div>

                  {/* Route */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 mb-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Çıkış Noktası</div>
                        <div className="text-xs font-bold text-slate-800">{load.origin}</div>
                      </div>
                    </div>

                    <div className="ml-2 pl-3 border-l border-dashed border-slate-300 py-0.5">
                      <span className="text-[10px] text-slate-500">
                        {load.distanceKm} KM • Alış Aralığı: {load.pickupWindow}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Boşaltma Noktası</div>
                        <div className="text-xs font-bold text-slate-800">{load.destination}</div>
                      </div>
                    </div>
                  </div>

                  {/* Material & Tonnage */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500">Malzeme</div>
                      <div className="font-semibold text-slate-800 mt-0.5 truncate">{load.material}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500">Yük Tonajı</div>
                      <div className="font-bold text-slate-900 font-mono mt-0.5">{load.tonnage} TON</div>
                    </div>
                  </div>
                </div>

                {/* Rate & CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono">Ton Başı: {load.ratePerTon} ₺</div>
                    <div className="text-base font-bold text-slate-900 font-mono">
                      {load.totalFreight.toLocaleString('tr-TR')} ₺
                      <span className="text-xs font-normal text-slate-500 ml-1">+ KDV</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBook(load.id)}
                    disabled={isBooked}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isBooked
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Araca Atandı (API)</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4" />
                        <span>Dönüşü Bağla</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
