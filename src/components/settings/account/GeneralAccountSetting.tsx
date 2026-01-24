import { useAuth } from "../../../context/AuthContext";
import { ChevronRight } from "lucide-react";
import { formatUserRegistrationDate } from "../../../utils/dateUtils";
import { useState } from "react";
import EmailPopUp from "./EmailPopUp";
import GenderPopUp from "./GenderPopUp";
import { getUsernameColor } from "../../../utils/userUtils";

const GeneralAccountSetting = () => {
  const { user } = useAuth();
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showGenderPopup, setShowGenderPopup] = useState(false);

  return (
    <div>
      <h1 className="text-white text-2xl pb-4 font-semibold">
        Gerenal Settings
      </h1>
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/email"
        onClick={() => setShowEmailPopup(true)}
      >
        <p>Email</p>
        <div className="flex items-center justify-around ">
          <p className="mr-2">{user?.email}</p>
          <button className="group-hover/email:bg-gray-700 rounded-full p-4 cursor-pointer">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/gender"
        onClick={() => setShowGenderPopup(true)}
      >
        <p>Gender</p>
        <div className="flex items-center justify-around ">
          <p
            className={`mr-2 ${getUsernameColor({ is_admin: user?.is_admin, gender: user?.gender })}`}
          >
            {user?.gender}
          </p>
          <button className="group-hover/gender:bg-gray-700 rounded-full p-4 cursor-pointer">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-lg py-3 rounded-md group/registration-date">
        <p>Registration Date</p>
        <div className="flex items-center justify-around ">
          <p className="mr-2">
            {formatUserRegistrationDate(user!.registration_date)}
          </p>
          <button className="group-hover/registration-date:bg-gray-700 rounded-full p-4">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-lg py-3 rounded-md group/role">
        <p>Role</p>
        <div className="flex items-center justify-around ">
          <p className="mr-2">{user?.is_admin ? "Admin" : "Member"}</p>
          <button className="group-hover/role:bg-gray-700 rounded-full p-4">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {showEmailPopup && (
        <EmailPopUp
          currentUser={user}
          onClose={() => setShowEmailPopup(false)}
        />
      )}

      {showGenderPopup && (
        <GenderPopUp
          currentUser={user}
          onClose={() => setShowGenderPopup(false)}
        />
      )}
    </div>
  );
};

export default GeneralAccountSetting;
