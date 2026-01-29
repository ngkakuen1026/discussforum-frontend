import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const AdvancedAccountSetting = () => {
  const nagivate = useNavigate();

  return (
    <div>
      <h1 className="text-white text-2xl pb-4 font-semibold">
        Advanced Settings
      </h1>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/update-pw"
        onClick={() => nagivate({ to: "/settings/update-password" })}
      >
        <p>Update Password</p>
        <div className="flex items-center justify-around">
          <button className="group-hover/update-pw:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/delete-account">
        <p className="text-red-400">Delete Account</p>
        <div className="flex items-center justify-around">
          <button className="group-hover/delete-account:bg-red-800 text-red-400 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAccountSetting;
