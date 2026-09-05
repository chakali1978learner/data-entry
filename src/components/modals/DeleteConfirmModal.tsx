import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adNumber: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  adNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/40 backdrop-blur-sm">
      <div className="bg-[#ffffff] rounded-xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 border border-[#ffdad6]">
        <div className="flex items-center gap-3 text-[#ba1a1a]">
          <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-[20px] font-semibold text-[#0b1c30]">Dangerous Action</h3>
        </div>

        <p className="text-[14px] text-[#434654] leading-relaxed">
          Are you sure you want to remove this record? This action will permanently prune this row from the Google Sheet Master Ad Registry and cannot be undone.
        </p>

        <div className="p-3 rounded-lg bg-[#ffdad6]/40 font-mono text-[12px] flex justify-between items-center text-[#93000a] border border-[#ffdad6]">
          <span>Removing Ad:</span>
          <strong className="font-bold">{adNumber}</strong>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eff4ff]">
          <button
            onClick={onClose}
            type="button"
            className="px-4 h-10 rounded-lg bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff] text-[13px] font-semibold transition-all"
          >
            Abort
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="px-5 h-10 rounded-lg bg-[#ba1a1a] text-white hover:bg-[#93000a] text-[13px] font-semibold transition-all shadow-sm active:scale-95"
          >
            Yes, Delete Record
          </button>
        </div>
      </div>
    </div>
  );
};
