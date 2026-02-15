import { Check, MonitorCog, Moon, Palette, Sun, X } from "lucide-react";
import ClickOutside from "../../../hooks/useClickOutside";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";

interface ThemePopupProps {
  onClose: () => void;
}

const ThemePopup = ({ onClose }: ThemePopupProps) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
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
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTheme(selectedTheme as typeof theme);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="  border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Palette size={18} />
              <h2 className="text-lg font-bold">
                {t("settings.preferences.experienceSetting.displayPopup.title")}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <p className="text-white leading-relaxed">
              {t(
                "settings.preferences.experienceSetting.displayPopup.description",
              )}
            </p>

            <div className="space-y-3">
              {themeOptions.map((option) => {
                const isSelected = selectedTheme === option.value;

                return (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-950/40"
                        : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                    }`}
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
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border-2 border-white/30 hover:border-white/50 text-white font-medium rounded-xl transition-all hover:bg-white/10 backdrop-blur-xl disabled:opacity-50 cursor-pointer"
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-linear-to-br from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {t("common.save")}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default ThemePopup;
