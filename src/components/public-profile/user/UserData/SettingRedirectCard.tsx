import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const SettingRedirectCard = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
      <div
        className="px-8 py-4 text-gray-200 hover:text-gray-400 flex justify-between cursor-pointer items-center"
        onClick={() => navigate({ to: "/settings/account" })}
      >
        <h3 className="text-xl font-semibold">Account Settings</h3>
        <ChevronRight size={18} />
      </div>
    </div>
  );
};

export default SettingRedirectCard;
