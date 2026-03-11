import { Switch } from "@headlessui/react";
import { Check } from "lucide-react";
import { useState } from "react";

const MessgaeNotiSetting = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">Messages</h1>

      <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
        <div className="flex flex-col items-start">
          <p>Receive Messages</p>
        </div>

        <div className="flex items-center">
          <Switch
            className={`${
              isChecked ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                isChecked
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {isChecked && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      <div className="flex items-center justify-between text-lg cursor-pointer py-3 transition ">
        <div className="flex flex-col items-start">
          <p>Mark all as read</p>
          <p className="text-sm text-gray-400 transition duration-200">
            Mark all messages as read
          </p>
        </div>

        <div className="flex items-center rounded-full bg-gray-800 px-2 hover:bg-gray-600 tracking-tight transition duration-200">
          <p className="p-2">Mark as read</p>
        </div>
      </div>
    </div>
  );
};

export default MessgaeNotiSetting;
