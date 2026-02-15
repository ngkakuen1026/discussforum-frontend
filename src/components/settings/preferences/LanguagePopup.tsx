import ClickOutside from "../../../hooks/useClickOutside";
import { Check, Languages, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { US, JP, CN, HK, KR, TW } from "country-flag-icons/react/3x2";

interface LanguagePopupProps {
  onClose: () => void;
}

const LanguagePopup = ({ onClose }: LanguagePopupProps) => {
  const { t, i18n } = useTranslation();
  const originalLang = i18n.language || "en";
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

  const languageOptions = [
    { code: "US", name: t("languages.english"), flag: US, value: "en" },
    { code: "HK", name: t("languages.cantonese"), flag: HK, value: "hk" },
    {
      code: "TW",
      name: t("languages.traditionalChinese"),
      flag: TW,
      value: "tw",
    },
    {
      code: "CN",
      name: t("languages.simplifiedChinese"),
      flag: CN,
      value: "cn",
    },
    { code: "JP", name: t("languages.japanese"), flag: JP, value: "jp" },
    { code: "KR", name: t("languages.korean"), flag: KR, value: "kr" },
  ];

  const handleLanguageSelect = (value: string) => {
    setSelectedLang(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedLang !== originalLang) {
      i18n.changeLanguage(selectedLang);
      localStorage.setItem("preferredLanguage", selectedLang);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Languages size={18} />
              <h2 className="text-lg font-bold">
                {t("settings.preferences.languageSetting.languagePopup.title")}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <p className="text-white leading-relaxed">
              {t(
                "settings.preferences.languageSetting.languagePopup.description",
              )}
            </p>

            <div className="space-y-3">
              {languageOptions.map((option) => {
                const isSelected = selectedLang === option.value;

                return (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-950/40"
                        : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                    }`}
                    onClick={() => handleLanguageSelect(option.value)}
                  >
                    <div className="flex items-center">
                      <option.flag className="w-8 h-8 mr-2" />
                      <span className="text-gray-200 font-medium flex-1 ml-2">
                        {option.name}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 flex items-center justify-center transition-all`}
                    >
                      {isSelected && <Check size={16} className="text-white" />}
                    </div>

                    <input
                      type="radio"
                      name="language"
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

export default LanguagePopup;
