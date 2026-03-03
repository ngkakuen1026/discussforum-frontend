import { useNavigate } from "@tanstack/react-router";
import { Check, MonitorCog, Moon, Settings, Sun } from "lucide-react";
import { useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";

interface ThemeMenuProps {
  showThemeMenu: boolean;
  setShowThemeMenu: (value: boolean) => void;
  themeMenuRef: RefObject<HTMLDivElement | null>;
  toggleThemeMenu: () => void;
}

const ThemeMenu = ({
  showThemeMenu,
  setShowThemeMenu,
  themeMenuRef,
  toggleThemeMenu,
}: ThemeMenuProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const themeOptions = [
    {
      value: "system",
      label: t("theme.system"),
      icon: <MonitorCog size={18} />,
    },
    { value: "light", label: t("theme.light"), icon: <Sun size={18} /> },
    { value: "dark", label: t("theme.dark"), icon: <Moon size={18} /> },
  ];

  const handleSelect = (value: string) => {
    setSelectedTheme(value as typeof theme);
    setTheme(selectedTheme as typeof theme);
  };

  return (
    <div className="relative" ref={themeMenuRef}>
      <button
        onClick={toggleThemeMenu}
        className="relative py-2 rounded-full hover:bg-white/10 transition-colors duration-200"
        title="Theme"
      >
        {theme === "system" && (
          <MonitorCog size={24} className=" cursor-pointer hover:opacity-75" />
        )}
        {theme === "light" && (
          <Sun size={24} className=" cursor-pointer hover:opacity-75" />
        )}
        {theme === "dark" && (
          <Moon size={24} className=" cursor-pointer hover:opacity-75" />
        )}
      </button>

      {showThemeMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute right-0 top-full mt-6 w-96 dark:bg-icon-menu-dark bg-icon-menu border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Display Theme
              </h3>
              <button
                onClick={() => {
                  setShowThemeMenu(false);
                  navigate({ to: "/settings/preferences" });
                }}
                className="p-1 hover:bg-gray-800 rounded transition"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Switch theme between light, dark and system default
            </p>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
            {" "}
            {themeOptions.map((option) => {
              const isSelected = selectedTheme === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex items-center justify-between gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 `}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="flex items-center">
                    {option.icon}
                    <span className="text-gray-200 font-medium flex-1 ml-2">
                      {option.label}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 flex items-center justify-center transition-all `}
                  >
                    {isSelected && (
                      <Check size={16} className="text-cyan-400" />
                    )}
                  </div>

                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={isSelected}
                    readOnly
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ThemeMenu;
