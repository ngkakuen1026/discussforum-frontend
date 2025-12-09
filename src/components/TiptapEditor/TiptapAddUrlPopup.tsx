import ClickOutside from "../../hooks/useClickOutside";
import { Link2, X } from "lucide-react";

interface TiptapAddUrlPopupProps {
  show: boolean;
  onClose: () => void;
  urlInput: string;
  setUrlInput: (url: string) => void;
  onInsertUrl: () => void;
}

const TiptapAddUrlPopup = ({
  show,
  onClose,
  urlInput,
  setUrlInput,
  onInsertUrl,
}: TiptapAddUrlPopupProps) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-screen">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Link2 size={16} />
              <h2 className="text-lg font-bold">Insert Link</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition"
            >
              <X size={16} className="cursor-pointer" />
            </button>
          </div>
          <div className="p-6 flex gap-2">
            <input
              type="text"
              className="w-10/12 px-4 py-2.5 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 "
              placeholder="https://yourlink.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button
              className="w-2/12 px-4 py-2.5 cursor-pointer bg-linear-to-br from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={!urlInput}
              onClick={onInsertUrl}
            >
              Insert
            </button>
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};

export default TiptapAddUrlPopup;
