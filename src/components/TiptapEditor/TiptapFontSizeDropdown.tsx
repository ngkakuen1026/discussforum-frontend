import { Editor } from "@tiptap/react";
import ClickOutside from "../../hooks/useClickOutside";

interface TiptapFontSizeDropdownProps {
  editor: Editor;
  show: boolean;
  onClose: () => void;
}

const sizes = [
  { label: "Very Small", value: "8px" },
  { label: "Small (Default Size)", value: "12px" },
  { label: "Normal", value: "16px" },
  { label: "Huge", value: "20px" },
  { label: "Massive", value: "28px" },
];

const TiptapFontSizeDropdown = ({
  editor,
  show,
  onClose,
}: TiptapFontSizeDropdownProps) => {
  if (!show) return null;

  const currentSize = editor.getAttributes("textStyle").fontSize || "12px";

  return (
    <div className="absolute top-full mt-2 z-50 w-96 ">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2">
          {sizes.map((size) => (
            <button
              key={size.value}
              onClick={() => {
                editor.chain().focus().setFontSize(size.value).run();
                onClose();
              }}
              className={`
              w-full px-4 py-3 text-left flex items-center justify-between
              hover:bg-gray-700/80 transition-all group
              ${currentSize === size.value ? "bg-gray-700/60" : ""}
            `}
            >
              <span
                className="font-medium text-white"
                style={{ fontSize: size.value }}
              >
                {size.label}
              </span>
              {currentSize === size.value && (
                <div className="w-4 h-4 rounded-full border-2 border-cyan-500" />
              )}
            </button>
          ))}
        </div>
      </ClickOutside>
    </div>
  );
};

export default TiptapFontSizeDropdown;
