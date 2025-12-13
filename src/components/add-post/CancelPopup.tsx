import React from "react";

interface CancelPopupProps {
  onCancel: () => void;
  onClose: () => void;
  isLoading?: boolean;
  isUpdate?: boolean;
}

const CancelPopup: React.FC<CancelPopupProps> = ({
  onCancel,
  onClose,
  isLoading,
  isUpdate,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-xl p-8 shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">
          {isUpdate ? "Update Draft?" : "Save Draft?"}
        </h2>
        <p className="text-gray-300 mb-6">
          {isUpdate
            ? "Do you want to update your draft before leaving?"
            : "Do you want to save your draft before leaving?"}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition disabled:opacity-60"
          >
            {isLoading
              ? isUpdate
                ? "Updating..."
                : "Saving..."
              : isUpdate
                ? "Update & Leave"
                : "Save & Leave"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPopup;
