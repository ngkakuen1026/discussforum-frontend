import { LanguagesIcon } from "lucide-react";
import { type RefObject } from "react";
import { US, JP, CN, HK, KR } from "country-flag-icons/react/3x2";
import { motion } from "framer-motion"; // Import Framer Motion

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
  const languageOptions = [
    { code: "US", name: "English", flag: US },
    { code: "ZH-HK", name: "Traditional Chinese", flag: HK },
    { code: "ZH-CN", name: "Simplified Chinese", flag: CN },
    { code: "JP", name: "Japanese", flag: JP },
    { code: "KR", name: "Korean", flag: KR },
  ];

  return (
    <div className="relative" ref={translationMenuRef}>
      <button
        onClick={toggleTranslationMenu}
        className="flex items-center justify-center focus:outline-none relative cursor-pointer hover:opacity-75"
        title="Language Translation"
      >
        <LanguagesIcon
          size={24}
          className="text-white cursor-pointer hover:opacity-75"
        />
      </button>
      {showTranslationMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute right-0 mt-8 w-96 bg-[#181C1F] rounded-md shadow-lg z-50 divide-y divide-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-semibold text-white">Languages</h1>
            </div>
            <h2 className="text-gray-500">
              {languageOptions.length}{" "}
              {languageOptions.length > 1 ? "languages" : "language"} available
            </h2>
          </div>
          <div className="py-2">
            {languageOptions.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  console.log(`Selected Language: ${language.name}`);
                  setShowTranslationMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-white hover:bg-[#333] rounded-md cursor-pointer transition"
              >
                <span className="mr-4">{language.code}</span>
                <language.flag className="w-7 h-7 mr-4" />
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TranslationMenu;
