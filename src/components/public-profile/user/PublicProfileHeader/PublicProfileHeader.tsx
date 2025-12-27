import type { UserType } from "../../../../types/userTypes";
import { Camera, Upload } from "lucide-react";
import { getUserAvatar, getUsernameColor } from "../../../../utils/userUtils";
import { formatUserRegistrationDate } from "../../../../utils/dateUtils";
import { useAuth } from "../../../../context/AuthContext";
import { UserRoleTag } from "../../../UserRoleTag";

interface UserProfileHeaderProps {
  publicUser: UserType;
  onShowAvatarPopup: () => void;
  onShowBannerPopup: () => void;
}

const PublicProfileHeader = ({
  publicUser,
  onShowAvatarPopup,
  onShowBannerPopup,
}: UserProfileHeaderProps) => {
  const { user } = useAuth();
  const isOwnProfile = user?.id === publicUser.id;

  return (
    <div className="relative w-full h-128 overflow-hidden group/banner">
      <div className="absolute inset-0 ">
        {publicUser.profile_banner ? (
          <img
            src={publicUser.profile_banner}
            alt="Profile banner"
            className="w-full h-full object-cover "
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-purple-600/60 via-blue-600/60 to-cyan-600/60" />
        )}
        <div className="absolute inset-0 bg-linear-to-b via-transparent to-black/40" />
      </div>

      {isOwnProfile && (
        <div className="absolute bottom-8 right-8 z-20 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300">
          <label
            onClick={() => onShowBannerPopup()}
            className="group/button flex items-center gap-3 bg-black/60 hover:bg-black/90 backdrop-blur-md px-4 py-3 rounded-full border border-white/30 transition-all duration-300 shadow-2xl cursor-pointer"
          >
            <Upload
              size={18}
              className="text-white group-hover/button:scale-110 transition"
            />
            <span className="text-white font-semibold text-sm">
              Change Banner
            </span>
          </label>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-8 ">
        <div className="flex flex-col md:flex-row items-end gap-8 group/avatar">
          <div className="relative">
            <img
              src={getUserAvatar({
                profile_image: publicUser.profile_image,
                gender: publicUser.gender,
              })}
              alt={publicUser.username}
              className="w-48 h-48 rounded-full object-cover border-6 border-black/90 shadow-2xl"
            />

            {isOwnProfile && (
              <>
                <label
                  onClick={() => onShowAvatarPopup()}
                  className="absolute bottom-2 right-2 bg-black/60 p-2 hover:bg-black/80 rounded-full transition group cursor-pointer hover:scale-110 duration-150 opacity-0 group-hover/avatar:opacity-100"
                >
                  <Camera
                    size={18}
                    className="text-white hover:opacity-75 cursor-pointer"
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                    Change Profile Image
                  </span>
                </label>
              </>
            )}
          </div>

          <div>
            <h1
              className={`text-3xl md:text-4xl font-bold mb-2 ${getUsernameColor(publicUser)}`}
            >
              {publicUser.username}
            </h1>

            <div className="flex items-center gap-3 text-sm text-white ">
              <UserRoleTag user={publicUser} />
              <span className="text-gray-200 font-semibold">|</span>
              <time className="text-gray-200 font-semibold">
                Joined{" "}
                {formatUserRegistrationDate(publicUser.registration_date)}
              </time>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent" />
    </div>
  );
};

export default PublicProfileHeader;
