import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Thermometer, 
  Clock, 
  FileCheck,
  Check,
  Smartphone
} from 'lucide-react';
import { WeighingRecord } from '../types';

interface SiteDeliveryModalProps {
  record: WeighingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelivery: (recordId: string, approverName: string) => void;
}

export const SiteDeliveryModal: React.FC<SiteDeliveryModalProps> = ({
  record,
  isOpen,
  onClose,
  onConfirmDelivery
}) => {
  const [approverName, setApproverName] = useState('Murat Demirtaş (Baş Şantiye Şefi)');
  const [slumpTestCm, setSlumpTestCm] = useState<number>(14);
  const [temperatureC, setTemperatureC] = useState<number>(21.5);
  const [inspectionNotes, setInspectionNotes] = useState('İrsaliyeye ve numune kırım kriterlerine uygun teslim alındı.');
  const [isSigning, setIsSigning] = useState<boolean>(false);

  if (!isOpen || !record) return null;

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      onConfirmDelivery(record.id, approverName);
      setIsSigning(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Mobile Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono tracking-tight text-amber-400">
                ŞANTİYE SAHA KABUL PROTOKOLÜ
              </div>
              <div className="text-[11px] text-slate-300">Mobil QR & GPS İrsaliye Mührü</div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Incoming Vehicle Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                {record.plate}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[10px]">
                {record.ticketNo}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 font-sans">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Malzeme & Cins:</span>
                <div className="font-semibold text-slate-800 mt-0.5">{record.material}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Kantar Net Tonajı:</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">
                  {(record.netWeightKg / 1000).toFixed(2)} TON ({record.netWeightKg.toLocaleString()} KG)
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{record.siteName}</span>
            </div>
          </div>

          {/* Quality & Physical Field Checks */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Saha Kalite ve Kabul Kriterleri</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">Slump / Çökme Testi (cm)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={slumpTestCm} 
                    onChange={(e) => setSlumpTestCm(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                  />
                  <span className="text-slate-400 font-mono">S4</span>
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Malzeme Sıcaklığı (°C)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    step="0.1"
                    value={temperatureC} 
                    onChange={(e) => setTemperatureC(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                  />
                  <span className="text-slate-400 font-mono">°C</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Şantiye Yetkilisi Onay Notu</label>
              <input 
                type="text" 
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
              />
            </div>
          </div>

          {/* Signer Info */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Teslim Alan Şantiye Şefi</label>
            <input 
              type="text" 
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
            />
          </div>

          {/* Legal Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Mali & Hukuki Etki:</span> Bu onay verildiği anda e-İrsaliye GİB sisteminde kapanır, mal eksiksiz kabul edilmiş sayılır ve tedarikçinin erken nakit iskonto hattı anında devreye girer.
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
          <button 
            onClick={handleSign}
            disabled={isSigning}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
          >
            {isSigning ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Dijital İrsaliye Mühürleniyor...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Malı Eksiksiz Teslim Al & QR Mühürle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
