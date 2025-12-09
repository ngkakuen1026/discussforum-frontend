import ClickOutside from "../../hooks/useClickOutside";

interface TiptapColorDropdownProps {
  show: boolean;
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

const colors = [
  { name: "Default", color: "#ffffff" },
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Yellow", color: "#eab308" },
  { name: "Green", color: "#22c55e" },
  { name: "Teal", color: "#14b8a6" },
  { name: "Cyan", color: "#06b6d4" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Purple", color: "#8b5cf6" },
  { name: "Pink", color: "#ec4899" },
];

const TiptapColorDropdown = ({
  show,
  currentColor,
  onSelect,
  onClose,
}: TiptapColorDropdownProps) => {
  if (!show) return null;
  return (
    <div className="absolute top-full mt-2 z-50 w-48 ">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
          <div className="py-2">
            {colors.map((item) => (
              <button
                key={item.name}
                onClick={() => onSelect(item.color)}
                className={`
                w-full px-4 py-2.5 text-left text-sm font-medium transition-all
                hover:bg-gray-700/80 flex items-center justify-between group
                ${
                  currentColor === item.color ||
                  (item.color === "#ffffff" && !currentColor)
                    ? "bg-gray-700/60"
                    : ""
                }
              `}
              >
                <span
                  style={{
                    color: item.color === "#ffffff" ? "#e4e4e7" : item.color,
                  }}
                  className="font-medium"
                >
                  {item.name}
                </span>
                {(currentColor === item.color ||
                  (item.color === "#ffffff" && !currentColor)) && (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-500" />
                )}
                {item.color === "#ffffff" && !currentColor && (
                  <div className="w-4 h-px bg-red-500 rotate-45 absolute right-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};

export default TiptapColorDropdown;
