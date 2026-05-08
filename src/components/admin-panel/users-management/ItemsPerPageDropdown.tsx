import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import ClickOutside from "../../../hooks/useClickOutside";
import { motion } from "framer-motion";

const pageOptions = [1, 5, 10, 25, 50];

interface ItemsPerPageDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ItemsPerPageDropdown({
  value,
  onChange,
}: ItemsPerPageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div className="relative w-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
        >
          <span className="text-sm">{value} per page</span>
          <ChevronsUpDown size={18} className="text-gray-400" />
        </button>

        {isOpen && (
          <div onClick={() => setIsOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 py-1 overflow-auto"
            >
              {pageOptions.map((num) => (
                <div
                  key={num}
                  onClick={() => onChange(num)}
                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-between ${
                    value === num
                      ? "bg-cyan-600/20 text-cyan-400"
                      : "text-gray-300"
                  }`}
                >
                  {num} per page
                  {value === num && (
                    <Check size={18} className="text-cyan-400" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </ClickOutside>
  );
}
