import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { motion } from "framer-motion";
import ClickOutside from "../../hooks/useClickOutside";

export type SortOption = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

interface SortingDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  width?: string;
}

const SortingDropdown = ({
  options,
  value,
  onChange,
  className = "",
  width = "w-84",
}: SortingDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((opt) => opt.value === value) || options[0];

  return (
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div className={`relative ${width} ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-sm">{selected.icon}</span>
            <span className="text-sm">{selected.label}</span>
          </div>

          <ChevronsUpDown size={20} className="text-gray-400" />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute mt-1.5 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 py-1 overflow-auto"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-800 transition ${
                  value === option.value
                    ? "bg-cyan-600/20 text-cyan-400"
                    : "text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {option.icon}
                  {option.label}
                </div>

                {value === option.value && (
                  <Check size={18} className="text-cyan-400" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </ClickOutside>
  );
};

export default SortingDropdown;
