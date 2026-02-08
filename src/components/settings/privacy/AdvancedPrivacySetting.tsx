import { ChevronRight } from "lucide-react";
import { useState } from "react";
import DeleteAllBrowsingHistoryPopup from "./DeleteAllBrowsingHistoryPopup";

const AdvancedPrivacySetting = () => {
  const [showDeleteAllBrowsingHistoryPopup, setShowDeleteAllBrowsingHistoryPopup] =
    useState(false);

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">Advanced</h1>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/clearHistory"
        onClick={() => setShowDeleteAllBrowsingHistoryPopup(true)}
      >
        <p>Clear Post History</p>
        <div className="flex items-center justify-around ">
          <button className="group-hover/clearHistory:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {showDeleteAllBrowsingHistoryPopup && (
        <DeleteAllBrowsingHistoryPopup
          onClose={() => setShowDeleteAllBrowsingHistoryPopup(false)}
        />
      )}
    </div>
  );
};

export default AdvancedPrivacySetting;
