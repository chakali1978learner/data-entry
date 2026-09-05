import React from 'react';
import { RefreshCw, Check } from 'lucide-react';

interface UpdateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adNumber: string;
  storedRevision: number;
  newRevision: number;
  rowIndex?: number;
}

export const UpdateConfirmModal: React.FC<UpdateConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  adNumber,
  storedRevision,
  newRevision,
  rowIndex,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/40 backdrop-blur-sm">
      <div className="bg-[#ffffff] rounded-xl shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 border border-[#eff4ff]">
        <div className="flex items-center gap-3 text-[#00687a]">
          <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#00687a]">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-[20px] font-semibold text-[#0b1c30]">Confirm Revision Update</h3>
        </div>

        <p className="text-[14px] text-[#434654] leading-relaxed">
          Are you sure you want to update this advertisement record? This will commit Revision {newRevision} directly to {rowIndex ? `Row #${rowIndex}` : 'the designated row'} in Google Sheets Master Ad Registry.
        </p>

        <div className="p-3.5 rounded-lg bg-[#eff4ff] font-mono text-[12px] flex flex-col gap-1.5 text-[#737686] border border-[#dce9ff]">
          <div className="flex justify-between items-center">
            <span>Target Ad Number:</span>
            <span className="text-[#0b1c30] font-semibold">{adNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Persisting Revision:</span>
            <span className="text-[#00687a] font-bold">
              Rev {storedRevision} → Rev {newRevision}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eff4ff]">
          <button
            onClick={onClose}
            type="button"
            className="px-4 h-10 rounded-lg bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff] text-[13px] font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="px-5 h-10 rounded-lg bg-[#00687a] text-white hover:bg-[#004e5c] text-[13px] font-semibold transition-all shadow-sm active:scale-95"
          >
            Confirm & Update Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
