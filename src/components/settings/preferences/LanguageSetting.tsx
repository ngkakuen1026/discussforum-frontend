import { ChevronRight } from "lucide-react";
import { useState } from "react";
import LanguagePopup from "./LanguagePopup";

const LanguageSetting = () => {
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">Language</h1>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/language"
        onClick={() => setShowLanguagePopup(true)}
      >
        <div className="flex flex-col items-start ">
          <p>Display Language</p>
        </div>

        <div className="flex items-center justify-around ">
          <p className="mr-2">Language</p>
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
