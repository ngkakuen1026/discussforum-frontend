import { CardSim, Check, ChevronDown, Rows3 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePostViewPreference } from "../../../context/PostViewPreferenceContext";
import ClickOutside from "../../../hooks/useClickOutside";

interface PostViewDropdownProps {
  showPostViewDropDown: boolean;
  setShowPostViewDropDown: (value: boolean) => void;
  togglePostViewDropdown: () => void;
}

const PostViewDropdown = ({
  showPostViewDropDown,
  setShowPostViewDropDown,
  togglePostViewDropdown,
}: PostViewDropdownProps) => {
  const { t } = useTranslation();
  const { postViewMode, setPostViewMode } = usePostViewPreference();
  const [selectedMode, setSelectedMode] = useState(postViewMode);

  const postViewOptions = [
    {
      value: "compact",
      label: t("postView.compact"),
      icon: <Rows3 size={18} />,
    },
    {
      value: "card",
      label: t("postView.card"),
      icon: <CardSim size={18} />,
    },
  ];

  const handleSelect = (value: string) => {
    setSelectedMode(value as typeof postViewMode);
    setPostViewMode(value as typeof postViewMode);
    setShowPostViewDropDown(false);
  };

  return (
    <div className="relative">
      <ClickOutside onClickOutside={() => setShowPostViewDropDown(false)}>
        <button
          onClick={togglePostViewDropdown}
          className="relative py-2 rounded-full hover:bg-white/10 transition-colors duration-200 flex items-center p-2 cursor-pointer"
          title={t("topNavbar.translationMenu.s-title")}
        >
          <CardSim size={18} className="mr-2" />
          <ChevronDown size={18} />
        </button>

        {showPostViewDropDown && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-full mt-2 w-64 dark:bg-icon-menu-dark bg-icon-menu border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between gap-2">
                <h1 className="font-semibold text-lg">Post View</h1>
              </div>
            </div>

            <div className="py-2">
              {postViewOptions.map((option) => {
                const isSelected = selectedMode === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`justify-between hover:bg-background-dark/50 flex items-center w-full px-4 py-2.5 rounded-md cursor-pointer transition duration-150 ${isSelected ? "bg-cyan-500/20" : "bg-transparent"}`}
                  >
                    <div className="flex items-center">
                      {option.icon}
                      <span className="text-gray-200 font-medium flex-1 ml-2 text-lg">
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
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </ClickOutside>
    </div>
  );
};

export default PostViewDropdown;
