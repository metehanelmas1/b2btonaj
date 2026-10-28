import React from 'react';
import { 
  X, 
  Printer, 
  QrCode, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Scale
} from 'lucide-react';
import { WeighingRecord } from '../types';

interface TicketDetailModalProps {
  record: WeighingRecord | null;
  onClose: () => void;
  onApproveUetds: (recordId: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  record,
  onClose,
  onApproveUetds
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold">
              <Scale className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-mono">{record.ticketNo}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Resmi Kantar Fişi
                </span>
              </div>
              <p className="text-xs text-slate-500">{record.timestamp} • {record.siteName}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Printable Ticket Simulation */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 font-mono text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-4 font-sans">
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase">T.C. ULAŞTIRMA VE ALTYAPI BAKANLIĞI</div>
                <div className="text-[11px] text-slate-500">U-ETDS Elektronik Taşıma Takip Sistemi Mührü</div>
              </div>
              <div className="text-right">
                <span className="text-emerald-700 font-bold text-xs">ONAYLI BİLDİRİM</span>
                <div className="text-[10px] text-slate-500 font-mono">{record.uetdsCode || 'Bakanlık Kodu Üretiliyor'}</div>
              </div>
            </div>

            {/* Vehicle & Plates */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 font-sans">
              <div>
                <div className="text-slate-500 text-[10px] uppercase font-mono">Çekici Plakası:</div>
                <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">{record.plate}</div>
                {record.trailerPlate && (
                  <div className="text-slate-500 text-[11px]">Römork: {record.trailerPlate}</div>
                )}
              </div>
              <div>
                <div className="text-slate-500 text-[10px] uppercase font-mono">Şoför Bilgisi:</div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">{record.driverName}</div>
                <div className="text-slate-500 text-[11px] font-mono">{record.driverPhone}</div>
              </div>
            </div>

            {/* Route */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 font-sans">
              <div>
                <div className="text-slate-500 text-[10px] uppercase font-mono">Gönderici Tesis:</div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">{record.companySender}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px] uppercase font-mono">Alıcı Tesis / Şantiye:</div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">{record.companyReceiver}</div>
              </div>
            </div>

            {/* Weights */}
            <div className="grid grid-cols-3 gap-2 py-4 bg-white p-3 rounded-lg border border-slate-200 my-2">
              <div className="text-center">
                <div className="text-[10px] text-slate-500 uppercase">Brüt Tartım</div>
                <div className="text-base font-bold text-slate-800 mt-0.5 font-mono">
                  {record.grossWeightKg.toLocaleString()} KG
                </div>
              </div>
              <div className="text-center border-x border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Dara</div>
                <div className="text-base font-semibold text-slate-600 mt-0.5 font-mono">
                  {record.tareWeightKg.toLocaleString()} KG
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-emerald-700 uppercase font-bold">Net Sevkiyat</div>
                <div className="text-base font-bold text-emerald-600 mt-0.5 font-mono">
                  {record.netWeightKg.toLocaleString()} KG
                </div>
              </div>
            </div>

            {/* Fire */}
            {record.moistureWastePercent > 0 && (
              <div className="flex items-center justify-between py-2 text-[11px] text-slate-600 font-sans">
                <span>Ekspertiz Fire Kesintisi (%{record.moistureWastePercent}):</span>
                <span className="font-semibold text-rose-600 font-mono">
                  -{(record.netWeightKg - record.finalPayableKg).toLocaleString()} KG
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-bold font-sans">
              <span className="text-slate-600">Cari Hesaba Esas Net:</span>
              <span className="text-sm text-slate-900 font-mono">
                {record.finalPayableKg.toLocaleString()} KG ({(record.finalPayableKg / 1000).toFixed(2)} TON)
              </span>
            </div>
          </div>

          {/* Verification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">U-ETDS Takip Kodu</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {record.uetdsCode || 'Bakanlık Kodu Bekleniyor'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">e-Devlet portalında doğrulanabilir</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">GİB e-İrsaliye Belge No</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {record.eWaybillNo || 'Taslak'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Mali mühürlü elektronik belge</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kantar verisi SHA-256 ile mühürlendi.</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Fiş Yazdır</span>
            </button>

            {!record.uetdsCode && (
              <button 
                onClick={() => onApproveUetds(record.id)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>U-ETDS Onayla</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
