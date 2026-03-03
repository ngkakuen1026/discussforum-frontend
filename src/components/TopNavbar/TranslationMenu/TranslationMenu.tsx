import { Check, LanguagesIcon } from "lucide-react";
import { type RefObject } from "react";
import { US, JP, CN, HK, KR, TW } from "country-flag-icons/react/3x2";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface TranslationMenuProps {
  showTranslationMenu: boolean;
  setShowTranslationMenu: (value: boolean) => void;
  translationMenuRef: RefObject<HTMLDivElement | null>;
  toggleTranslationMenu: () => void;
}

const TranslationMenu = ({
  translationMenuRef,
  showTranslationMenu,
  setShowTranslationMenu,
  toggleTranslationMenu,
}: TranslationMenuProps) => {
  const { t, i18n } = useTranslation();

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

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("preferredLanguage", value);
    setShowTranslationMenu(false);
  };

  return (
    <div className="relative" ref={translationMenuRef}>
      <button
        onClick={toggleTranslationMenu}
        className="relative py-2 rounded-full hover:bg-white/10 transition-colors duration-200"
        title={t("topNavbar.translationMenu.s-title")}
      >
        <LanguagesIcon size={24} className="cursor-pointer hover:opacity-75" />
      </button>

      {showTranslationMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute right-0 top-full mt-6 w-96 dark:bg-icon-menu-dark bg-icon-menu border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-semibold ">
                {t("topNavbar.translationMenu.title")}
              </h1>
            </div>
            <h2 className="text-gray-400 text-sm mt-1">
              {t("topNavbar.translationMenu.available", {
                count: languageOptions.length,
              })}
            </h2>
          </div>

          <div className="py-2">
            {languageOptions.map((language) => (
              <button
                key={language.value}
                onClick={() => handleLanguageChange(language.value)}
                className=" hover:bg-background-dark/50 flex items-center w-full px-4 py-2.5 rounded-md cursor-pointer transition duration-150"
              >
                <span className="mr-4 font-medium">{language.code}</span>
                <language.flag className="w-7 h-7 mr-4 rounded-sm shadow-sm" />
                <span className="flex-1 text-left">{language.name}</span>

                {/* Show checkmark if currently selected */}
                {i18n.language === language.value && (
                  <Check size={16} className="text-cyan-400 ml-2" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TranslationMenu;
