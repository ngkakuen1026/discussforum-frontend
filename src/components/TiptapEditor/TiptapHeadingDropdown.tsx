import { Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Type,
} from "lucide-react";
import ClickOutside from "../../hooks/useClickOutside";

interface TiptapHeadingDropdownProps {
  editor: Editor;
  show: boolean;
  onClose: () => void;
}

const TiptapHeadingDropdown: React.FC<TiptapHeadingDropdownProps> = ({
  editor,
  show,
  onClose,
}) => {
  if (!show) return null;

  const items = [
    { level: 1, label: "Heading 1", icon: Heading1, size: "text-3xl" },
    { level: 2, label: "Heading 2", icon: Heading2, size: "text-2xl" },
    { level: 3, label: "Heading 3", icon: Heading3, size: "text-xl" },
    { level: 4, label: "Heading 4", icon: Heading4, size: "text-lg" },
    { level: 5, label: "Heading 5", icon: Heading5, size: "text-base" },
    { level: null, label: "Normal Text", icon: Type, size: "text-base" },
  ];

  const currentLevel = editor.isActive("heading")
    ? editor.getAttributes("heading").level
    : null;

  return (
    <div className="absolute top-full mt-2 z-50 w-96 ">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 overflow-hidden">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentLevel === item.level ||
              (item.level === null && !currentLevel);

            return (
              <button
                key={item.level ?? "normal"}
                onClick={() => {
                  if (item.level === null) {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: item.level as 1 | 2 | 3 | 4 | 5 })
                      .run();
                  }
                  onClose();
                }}
                className={`
                w-full px-4 py-3 flex items-center gap-3 transition-all
                hover:bg-gray-700/80 group
                ${isActive ? "bg-gray-700/60" : ""}
              `}
              >
                <Icon
                  size={16}
                  className="text-gray-400 group-hover:text-white"
                />
                <span className={`font-medium ${item.size} text-white`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-4 h-4 rounded-full border-2 border-cyan-500" />
                )}
              </button>
            );
          })}
        </div>
      </ClickOutside>
    </div>
  );
};

export default TiptapHeadingDropdown;
