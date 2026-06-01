import { ChevronDown, ChevronUp } from "lucide-react";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  className?: string;
  label?: string; // Optional label inside component
}

const NumberInput = ({
  value,
  onChange,
  placeholder = "0",
  min = 0,
  className = "",
}: NumberInputProps) => {
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className={`w-full px-6 py-3 border border-gray-700 bg-gray-900 rounded-lg 
                   focus:outline-none focus:border-cyan-500 appearance-none ${className}`}
      />

      {/* Custom Arrows */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
        <button
          type="button"
          onClick={() => {
            const num = value === "" ? min : Number(value) + 1;
            onChange(num.toString());
          }}
          className="text-gray-400 hover:text-white transition text-xs leading-none"
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          onClick={() => {
            const num = value === "" ? min : Math.max(min, Number(value) - 1);
            onChange(num.toString());
          }}
          className="text-gray-400 hover:text-white transition text-xs leading-none"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
