import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scale, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { WeighingRecord, SectorType, SectorMeta } from '../types';
import { api } from '../services/api';

interface NewWeighingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: WeighingRecord) => void;
  defaultSector: SectorType;
}

export const NewWeighingModal: React.FC<NewWeighingModalProps> = ({
  isOpen,
  onClose,
  onAddRecord,
  defaultSector
}) => {
  const getDefaultMaterial = (s: SectorType) => {
    switch (s) {
      case 'demir': return 'Ø16 B420C Nervürlü İnşaat Demiri (12 Metre Bağ)';
      case 'kereste': return 'Kalıp Kereste 5x10 (1. Sınıf İnşaatlık)';
      case 'antrepo_gumruk': return 'Gümrüklü İthalat Yükü (Konteyner / Paletli)';
      case 'beton': return 'C35/45 Hazır Beton (Slump: 14 cm)';
      case 'tas_ocagi': return 'Agrega (Kırma Taş 0-32 mm)';
      case 'hurda': return 'DKP Ağır Hurda Demir (1. Sınıf)';
      case 'nakliye_lojistik': return 'Dökme Dolgu Malzemesi';
      default: return 'Endüstriyel Dökme Yük';
    }
  };

  const getMaterialOptions = (s: SectorType) => {
    switch (s) {
      case 'demir': return [
        'Ø16 B420C Nervürlü İnşaat Demiri (12 Metre Bağ)',
        'Ø12 B420C Nervürlü Donatı Demiri',
        'Ø20 B420C Nervürlü Donatı Demiri',
        'Q188 Çelik Hasır (5.00 x 2.15 m)',
        'IPE-200 Çelik Profil & Kiriş',
        'Kangal Çelik Q10 mm'
      ];
      case 'kereste': return [
        'Kalıp Kereste 5x10 (1. Sınıf İnşaatlık)',
        'İnşaatlık Çam Tomruk (Boy: 4m, Çap: 25-35 cm)',
        'Ahşap Euro Palet (80x120 cm)',
        'Kavak Kereste (Fırınlanmış)',
        'Lambri & Döşeme Tahtası'
      ];
      case 'antrepo_gumruk': return [
        'Gümrüklü İthalat Yükü (Konteyner / Paletli)',
        'Özet Beyanlı Transit Ticaret Malı',
        'Gümrüklü Dökme Kimyasal Hammadde',
        'Antrepo İhracat Yükü'
      ];
      case 'beton': return [
        'C35/45 Hazır Beton (Slump: 14 cm)',
        'C30/37 Hazır Beton (Slump: 16 cm)',
        'C25/30 Şantiye Betonu',
        'Agrega (Kum 0-4 mm)'
      ];
      case 'tas_ocagi': return [
        'Agrega (Kırma Taş 0-32 mm)',
        'Balast & Dolgu Taşı',
        'Maden Kırma Taş 7-15 mm',
        'Taş Tozu (0-2 mm)'
      ];
      case 'hurda': return [
        'DKP Ağır Hurda Demir (1. Sınıf)',
        'Ekstra Metal Hurda',
        'İmalat Artığı Sac Hurda',
        'Pik Döküm Hurda'
      ];
      default: return [
        'Dökme Dolgu Malzemesi',
        'Klinker & Çimento',
        'Hafriyat Toprağı'
      ];
    }
  };

  const [sectors, setSectors] = useState<SectorMeta[]>([]);
  const [plate, setPlate] = useState('34 KRM 774');
  const [trailerPlate, setTrailerPlate] = useState('34 TRL 901');
  const [driverName, setDriverName] = useState('Kenan Başaran');
  const [driverPhone, setDriverPhone] = useState('0532 881 29 40');
  const [companySender, setCompanySender] = useState('Tesis Çıkış Kantarı');
  const [companyReceiver, setCompanyReceiver] = useState('Kalyon Metro İstasyon Şantiyesi');
  const [material, setMaterial] = useState(getDefaultMaterial(defaultSector));
  const sector = defaultSector;
  const [grossWeightKg, setGrossWeightKg] = useState<number>(41200);
  const [tareWeightKg, setTareWeightKg] = useState<number>(14500);
  const [moistureWastePercent, setMoistureWastePercent] = useState<number>(1.0);
  const [siteName, setSiteName] = useState('Şantiye / Tesis Teslim Noktası');

  useEffect(() => {
    setMaterial(getDefaultMaterial(defaultSector));
  }, [defaultSector]);

  useEffect(() => {
    api.getSectors().then((data) => {
      if (data && data.length > 0) setSectors(data);
    });
  }, []);

  if (!isOpen) return null;

  const netWeightKg = Math.max(0, grossWeightKg - tareWeightKg);
  const wasteKg = Math.round(netWeightKg * (moistureWastePercent / 100));
  const finalPayableKg = netWeightKg - wasteKg;
  const isOverweight = grossWeightKg > 42000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomTicket = 'KNT-' + Math.floor(100000 + Math.random() * 900000);
    const randomUetds = 'UETDS-TR-2026-' + Math.floor(1000000 + Math.random() * 9000000);
    const randomGib = 'GIB2026' + Math.floor(10000000 + Math.random() * 90000000);

    const newRecord: WeighingRecord = {
      id: 'TKT-' + Date.now(),
      ticketNo: randomTicket,
      plate: plate.toUpperCase(),
      trailerPlate: trailerPlate ? trailerPlate.toUpperCase() : undefined,
      driverName,
      driverPhone,
      companySender,
      companyReceiver,
      material,
      sector,
      grossWeightKg,
      tareWeightKg,
      netWeightKg,
      axleCount: 5,
      maxLegalWeightKg: 42000,
      isOverweight,
      moistureWastePercent,
      finalPayableKg,
      uetdsStatus: 'APPROVED',
      uetdsCode: randomUetds,
      eWaybillStatus: 'SENT',
      eWaybillNo: randomGib,
      status: 'IN_TRANSIT',
      siteName,
      timestamp: 'Az önce'
    };

    onAddRecord(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold">
              <Scale className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Yeni Kantar Tartımı & Sevk Fişi</h3>
              <p className="text-xs text-slate-500">Kantar verisini girin, U-ETDS ve e-İrsaliye otomatik oluşturulsun.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Tesis İhtisas Bilgi Şeridi (Diğer sektörler karışamaz) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">İhtisas Masası</span>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {sectors.find(s => s.id === defaultSector)?.name || defaultSector.toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              Kantar & U-ETDS Entegre
            </span>
          </div>

          {/* Plates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Çekici Plakası</label>
              <input 
                type="text" 
                value={plate} 
                onChange={(e) => setPlate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono font-bold text-sm uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Dorse / Römork Plakası</label>
              <input 
                type="text" 
                value={trailerPlate} 
                onChange={(e) => setTrailerPlate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono text-sm uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Driver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Şoför Adı Soyadı</label>
              <input 
                type="text" 
                value={driverName} 
                onChange={(e) => setDriverName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Şoför Cep Telefonu</label>
              <input 
                type="text" 
                value={driverPhone} 
                onChange={(e) => setDriverPhone(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Companies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Gönderici Firma</label>
              <input 
                type="text" 
                value={companySender} 
                onChange={(e) => setCompanySender(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Alıcı Firma / Şantiye</label>
              <input 
                type="text" 
                value={companyReceiver} 
                onChange={(e) => setCompanyReceiver(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Weights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Malzeme Cinsi</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-semibold text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                {getMaterialOptions(defaultSector).map((mat, i) => (
                  <option key={i} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Brüt Ağırlık (KG)</label>
              <input 
                type="number" 
                value={grossWeightKg} 
                onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Dara (KG)</label>
              <input 
                type="number" 
                value={tareWeightKg} 
                onChange={(e) => setTareWeightKg(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Net summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-sans">Hesaplanan Net Tonaj</span>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {(netWeightKg / 1000).toFixed(2)} TON ({netWeightKg.toLocaleString()} KG)
              </div>
            </div>

            <div className="text-right font-sans">
              <span className="text-[10px] text-slate-500 uppercase">Karayolları Azami Yüklü Limit</span>
              <div className={`text-xs font-semibold ${isOverweight ? 'text-rose-600' : 'text-emerald-700'}`}>
                {grossWeightKg > 42000 ? '⚠ Aşırı Yük Saptandı' : '✓ Yasal Limit Dahilinde (Maks. 42 T)'}
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              İptal
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Fişi Kaydet & U-ETDS Bildir</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
