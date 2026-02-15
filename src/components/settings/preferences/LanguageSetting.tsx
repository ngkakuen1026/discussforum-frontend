import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import LanguagePopup from "./LanguagePopup";
import { useTranslation } from "react-i18next";

const LanguageSetting = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  useEffect(() => {
    const handleChange = (lng: string) => setCurrentLang(lng);
    i18n.on("languageChanged", handleChange);
    return () => i18n.off("languageChanged", handleChange);
  }, [i18n]);

  const getLanguageName = (code: string) => {
    const map: Record<string, string> = {
      en: t("languages.english"),
      hk: t("languages.cantonese"),
      tw: t("languages.traditionalChinese"),
      cn: t("languages.simplifiedChinese"),
      jp: t("languages.japanese"),
      kr: t("languages.korean"),
    };
    return map[code] || code.toUpperCase();
  };

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">
        {t("settings.preferences.languageSetting.language")}
      </h1>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/language"
        onClick={() => setShowLanguagePopup(true)}
      >
        <div className="flex flex-col items-start ">
          <p>{t("settings.preferences.languageSetting.displayLanguage")}</p>
        </div>

        <div className="flex items-center justify-around ">
          <p className="mr-2">{getLanguageName(currentLang)}</p>
          <button className="group-hover/language:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {showLanguagePopup && (
        <LanguagePopup onClose={() => setShowLanguagePopup(false)} />
      )}
    </div>
  );
};

export default LanguageSetting;
