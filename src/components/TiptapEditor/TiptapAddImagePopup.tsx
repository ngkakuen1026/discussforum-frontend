import React, { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import ClickOutside from "../../hooks/useClickOutside";

interface TiptapAddImagePopupProps {
  show: boolean;
  onClose: () => void;
  onInsertImage: (url: string) => void;
}

const TiptapAddImagePopup = ({
  show,
  onClose,
  onInsertImage,
}: TiptapAddImagePopupProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onInsertImage(dataUrl);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleUrlInsert = (url: string) => {
    if (url.trim()) {
      onInsertImage(url.trim());
      onClose();
    }
  };

  const [imageUrlInput, setImageUrlInput] = useState("");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <ImageIcon size={16} />
              <h2 className="text-lg font-bold"> Insert Image</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} className="cursor-pointer" />
            </button>
          </div>

          {/* URL Input */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste Avatar URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={() => handleUrlInsert(imageUrlInput)}
                  disabled={!imageUrlInput.trim()}
                  className="px-8 py-3 cursor-pointer bg-linear-to-br from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Insert
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 font-medium">OR</div>

            {/* Local File Upload (Preview Only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choose from Device
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                  ${dragActive ? "border-cyan-500 bg-cyan-900/20" : "border-gray-600 hover:border-cyan-500"}
                `}
              >
                <Upload size={20} className="mx-auto text-cyan-400 mb-4" />
                <p className="text-white text-lg">
                  Drop image here or click to browse
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Will upload when you publish
                </p>
              </div>
            </div>

            <div>
              <p className="text-center text-gray-200 text-sm">
                Images upload service provided by{" "}
                <a
                  href="https://cloudinary.com/"
                  className="hover:underline text-orange-300"
                >
                  Cloudinary
                </a>
              </p>
            </div>
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};

export default TiptapAddImagePopup;
