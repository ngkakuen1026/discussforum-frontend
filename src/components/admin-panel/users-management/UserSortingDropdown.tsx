import { useState } from "react";
import {
  ArrowDown01,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpDown,
  CalendarArrowDown,
  CalendarArrowUp,
  Check,
  ChevronsUpDown,
  ClockArrowDown,
  ClockArrowUp,
} from "lucide-react";
import ClickOutside from "../../../hooks/useClickOutside";
import { motion } from "framer-motion";

const sortOptions = [
  { icon: <ArrowUpDown size={14} />, value: "", label: "Sort by…" },
  { icon: <ArrowUp01 size={14} />, value: "id_asc", label: "ID (ascending)" },
  {
    icon: <ArrowDown01 size={14} />,
    value: "id_des",
    label: "ID (descending)",
  },
  {
    icon: <ArrowUpAZ size={14} />,
    value: "username_asc",
    label: "Username (A → Z)",
  },
  {
    icon: <ArrowDown01 size={14} />,
    value: "username_des",
    label: "Username (Z → A)",
  },
  { icon: <ArrowUpAZ size={14} />, value: "name_asc", label: "Name (A → Z)" },
  { icon: <ArrowDown01 size={14} />, value: "name_des", label: "Name (Z → A)" },
  { icon: <ArrowUpAZ size={14} />, value: "email_asc", label: "Email (A → Z)" },
  {
    icon: <ArrowDown01 size={14} />,
    value: "email_des",
    label: "Email (Z → A)",
  },
  {
    icon: <CalendarArrowUp size={14} />,
    value: "registered_newest",
    label: "Registered (Newest first)",
  },
  {
    icon: <CalendarArrowDown size={14} />,
    value: "registered_oldest",
    label: "Registered (Oldest first)",
  },
  {
    icon: <ClockArrowUp size={14} />,
    value: "last_login_newest",
    label: "Last Login (Newest first)",
  },
  {
    icon: <ClockArrowDown size={14} />,
    value: "last_login_oldest",
    label: "Last Login (Oldest first)",
  },
];

interface UserSortingDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const UserSortingDropdown = ({ value, onChange }: UserSortingDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected =
    sortOptions.find((opt) => opt.value === value) || sortOptions[0];

  return (
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div className="relative w-72">
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
          <div onClick={() => setIsOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute mt-1.5 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 py-1 "
            >
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => onChange(option.value)}
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
          </div>
        )}
      </div>
    </ClickOutside>
  );
};

export default UserSortingDropdown;
