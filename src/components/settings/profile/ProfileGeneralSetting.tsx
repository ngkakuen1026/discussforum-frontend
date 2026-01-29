import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import AvatarPopup from "../../public-profile/user/PublicProfileHeader/AvatarPopup";
import BannerPopup from "../../public-profile/user/PublicProfileHeader/BannerPopup";
import { ChevronRight, Copy, SquareArrowOutUpRight } from "lucide-react";
import UsernamePopup from "./UsernamePopup";
import FullNamePopup from "./FullNamePopup";
import PhonePopup from "./PhonePopup";
import BioPopup from "./BioPopup";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const ProfileGeneralSetting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [showFullNamePopup, setShowFullNamePopup] = useState(false);
  const [showPhonePopup, setShowPhponePopup] = useState(false);
  const [showBioPopup, setShowBioPopup] = useState(false);

  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [showBannerPopup, setShowBannerPopup] = useState(false);

  const fullNameCopy = () => {
    const fullName =
      user?.last_name || user?.first_name
        ? `${user?.first_name} ${user?.last_name}`.trim()
        : "";

    if (!fullName) {
      toast.warning("No full name to copy");
      return;
    }

    navigator.clipboard
      .writeText(fullName)
      .then(() => {
        toast.success("Full name copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">
        Gerenal Settings
      </h1>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/username"
        onClick={() => setShowUsernamePopup(true)}
      >
        <p>Display Username</p>
        <div className="flex items-center justify-around ">
          <p className="mr-2">{user?.username}</p>
          <button className="group-hover/username:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/bio"
        onClick={() => setShowBioPopup(true)}
      >
        <div className="flex flex-col items-start ">
          <p>Bio</p>
          <p className="text-sm text-gray-400 group-hover/bio:text-gray-200 transition duration-200">
            About yourself
          </p>
        </div>

        <div className="flex items-center justify-around ">
          <button className="group-hover/bio:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/bio"
        onClick={() => setShowAvatarPopup(true)}
      >
        <div className="flex flex-col items-start ">
          <p>Avatar</p>
          <p className="text-sm text-gray-400 group-hover/bio:text-gray-200 transition duration-200">
            Edit your avatar or upload an image
          </p>
        </div>

        <div className="flex items-center justify-around ">
          <button className="group-hover/bio:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/bio"
        onClick={() => setShowBannerPopup(true)}
      >
        <div className="flex flex-col items-start ">
          <p>Banner</p>
          <p className="text-sm text-gray-400 group-hover/bio:text-gray-200 transition duration-200">
            The banner will be displayed on your profile page
          </p>
        </div>

        <div className="flex items-center justify-around ">
          <button className="group-hover/bio:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/fullName"
        onClick={() => {
          if (!user?.first_name || !user?.last_name) {
            setShowFullNamePopup(true);
          }
        }}
      >
        <p>Full Name</p>
        <div className="flex items-center justify-around">
          <p className="mr-2">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : "Not Provided"}
          </p>

          {user?.first_name && user?.last_name ? (
            <button
              type="button"
              onClick={fullNameCopy}
              className="group-hover/fullName:bg-gray-700 rounded-full p-4 transition duration-200 hover:bg-gray-600 active:scale-95"
              title="Copy full name"
            >
              <Copy
                size={16}
                className="text-gray-400 group-hover/fullName:text-white transition-colors"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowFullNamePopup(true)}
              className="group-hover/fullName:bg-gray-700 rounded-full p-4 transition duration-200 hover:bg-gray-600 active:scale-95"
              title="Edit full name"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/firstName"
        onClick={() => setShowFullNamePopup(true)}
      >
        <p>First Name</p>
        <div className="flex items-center justify-around ">
          <p className="mr-2">
            {user?.first_name ? user?.first_name : "Not Provided"}
          </p>
          <button className="group-hover/firstName:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/lastName"
        onClick={() => setShowFullNamePopup(true)}
      >
        <p>Last Name</p>
        <div className="flex items-center justify-around ">
          <p className="mr-2">
            {user?.last_name ? user?.last_name : "Not Provided"}
          </p>
          <button className="group-hover/lastName:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/phone"
        onClick={() => setShowPhponePopup(true)}
      >
        <p>Phone</p>
        <div className="flex items-center justify-around ">
          <p className="mr-2">{user?.phone ? user?.phone : "Not Provided"}</p>
          <button className="group-hover/phone:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/phone"
        onClick={() =>
          navigate({
            to: "/public-profile/user/$userId",
            params: { userId: user!.id.toString() },
          })
        }
      >
        <p>Go to Profile</p>
        <div className="flex items-center justify-around ">
          <button className="group-hover/phone:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <SquareArrowOutUpRight size={16} />
          </button>
        </div>
      </div>

      {showUsernamePopup && (
        <UsernamePopup
          currentUser={user}
          onClose={() => setShowUsernamePopup(false)}
        />
      )}

      {showBioPopup && (
        <BioPopup currentUser={user} onClose={() => setShowBioPopup(false)} />
      )}

      {showAvatarPopup && (
        <AvatarPopup
          publicUser={user}
          onClose={() => setShowAvatarPopup(false)}
        />
      )}

      {showBannerPopup && (
        <BannerPopup
          publicUser={user}
          onClose={() => setShowBannerPopup(false)}
        />
      )}

      {showFullNamePopup && (
        <FullNamePopup
          currentUser={user}
          onClose={() => setShowFullNamePopup(false)}
        />
      )}

      {showPhonePopup && (
        <PhonePopup
          currentUser={user}
          onClose={() => setShowPhponePopup(false)}
        />
      )}
    </div>
  );
};

export default ProfileGeneralSetting;
