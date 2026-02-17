import { Switch } from "@headlessui/react";
import { Check, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ThemePopup from "./ThemePopup";
import PostViewPopup from "./PostViewPopup";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";

const ExperienceSetting = () => {
  const { t } = useTranslation();
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [showPostViewPopup, setShowPostViewPopup] = useState(false);
  const { theme } = useTheme();

  const [openInNewTab, setOpenInNewTab] = useState(() => {
    return localStorage.getItem("openPostsInNewTab") === "true";
  });

  useEffect(() => {
    localStorage.setItem("openPostsInNewTab", openInNewTab.toString());
  }, [openInNewTab]);

  const toggleOpenInNewTab = () => {
    setOpenInNewTab((prev) => !prev);
  };

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">
        {t("settings.preferences.experienceSetting.experience")}
      </h1>

      {/* Theme row */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/language   transition"
        onClick={() => setShowThemePopup(true)}
      >
        <div className="flex flex-col items-start">
          <p>{t("settings.preferences.experienceSetting.displayTheme")}</p>
          <p className="text-sm text-gray-400">
            {t(
              "settings.preferences.experienceSetting.displayThemeDescription",
            )}
          </p>
        </div>

        <div className="flex items-center justify-around">
          <p className="mr-2 capitalize font-medium ">{theme}</p>
          <button className="group-hover/language:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Post view row */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/language   transition"
        onClick={() => setShowPostViewPopup(true)}
      >
        <div className="flex flex-col items-start">
          <p>{t("settings.preferences.experienceSetting.displayPostView")}</p>
        </div>

        <div className="flex items-center justify-around">
          <p className="mr-2">Post View</p>
          <button className="group-hover/language:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Open posts in new tab toggle */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition  "
        onClick={toggleOpenInNewTab}
      >
        <div className="flex flex-col items-start">
          <p>{t("settings.preferences.experienceSetting.openPostsInNewTab")}</p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={openInNewTab}
            className={`${
              openInNewTab ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                openInNewTab
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {openInNewTab && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      {showThemePopup && (
        <ThemePopup onClose={() => setShowThemePopup(false)} />
      )}

      {showPostViewPopup && (
        <PostViewPopup onClose={() => setShowPostViewPopup(false)} />
      )}
    </div>
  );
};

export default ExperienceSetting;
