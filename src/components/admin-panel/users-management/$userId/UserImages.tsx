import { useState } from "react";
import type { UserType } from "../../../../types/userTypes";
import { getUserAvatar } from "../../../../utils/userUtils";
import AdminAvatarPopup from "./AdminAvatarPopup";
import AdminBannerPopup from "./AdminBannerPopup";

interface UserImagesProps {
  user: UserType;
  isEditing: boolean;
}

const UserImages = ({ user, isEditing }: UserImagesProps) => {
  const [showAdminAvatarPopup, setShowAdminAvatarPopup] = useState(false);
  const [showAdminBannerPopup, setShowAdminBannerPopup] = useState(false);

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-4 text-lg text-gray-400">Avatar</div>
        <div className="col-span-8">
          <img
            src={getUserAvatar(user)}
            alt={`${user.username}'s avatar`}
            className={`w-48 h-48 rounded-full object-cover border-2 border-gray-700 transition-all ${
              isEditing && "cursor-pointer hover:opacity-75"
            }`}
            onClick={
              isEditing ? () => setShowAdminAvatarPopup(true) : undefined
            }
          />
        </div>
      </div>

      {/* Profile Banner */}
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-4 text-lg text-gray-400">Profile Banner</div>
        <div className="col-span-8">
          <div
            className="relative w-full h-52 rounded-xl overflow-hidden border border-gray-700 group"
            onClick={
              isEditing ? () => setShowAdminBannerPopup(true) : undefined
            }
          >
            {user.profile_banner ? (
              <img
                src={user.profile_banner}
                alt="Profile banner"
                className="w-full h-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-purple-600/60 via-blue-600/60 to-cyan-600/60  cursor-pointer" />
            )}

            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40" />

            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all  cursor-pointer">
                <span className="text-white font-medium bg-black/70 px-4 py-2 rounded-lg">
                  Click to change banner
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdminAvatarPopup && (
        <AdminAvatarPopup
          user={user}
          onClose={() => setShowAdminAvatarPopup(false)}
        />
      )}

      {showAdminBannerPopup && (
        <AdminBannerPopup
          user={user}
          onClose={() => setShowAdminBannerPopup(false)}
        />
      )}
    </div>
  );
};

export default UserImages;
