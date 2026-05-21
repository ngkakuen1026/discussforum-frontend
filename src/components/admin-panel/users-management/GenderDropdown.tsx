import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Prefer Not to Say", label: "Prefer Not to Say" },
];

interface GenderDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function GenderDropdown({
  value,
  onChange,
  disabled = false,
}: GenderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = genderOptions.find((opt) => opt.value === value) || {
    value: "",
    label: "Select Gender",
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className="text-lg">{selected.label}</span>
        <ChevronsUpDown size={20} className="text-gray-400" />
      </button>

      {isOpen && !disabled && (
        <div
          className="absolute mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 py-1 overflow-auto"
          onClick={() => setIsOpen(false)}
        >
          {genderOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-4 py-3 text-lg cursor-pointer flex items-center justify-between hover:bg-gray-800 transition-colors ${
                value === option.value
                  ? "bg-cyan-600/20 text-cyan-400"
                  : "text-gray-200"
              }`}
            >
              {option.label}
              {value === option.value && (
                <Check size={18} className="text-cyan-400" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
