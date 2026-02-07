import type { UserType } from "../../../../types/userTypes";
import {
  Mail,
  User,
  Calendar,
  Shield,
  PhoneCall,
  VenusAndMars,
  Lock,
} from "lucide-react";
import { formatUserRegistrationDate } from "../../../../utils/dateUtils";
import { UserRoleTag } from "../../../UserRoleTag";
import { getGenderColor } from "../../../../utils/userUtils";
import { useAuth } from "../../../../context/AuthContext";

interface UserInfoCardProps {
  publicUser: UserType;
}

const UserInfoCard = ({ publicUser }: UserInfoCardProps) => {
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === publicUser.id;

  if (publicUser.visibility_mode === "private" && !isOwnProfile) {
    return (
      <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-700/50">
          <h3 className="text-xl font-semibold text-gray-200">
            User Information
          </h3>
        </div>

        <div className="p-10 text-center space-y-4">
          <Lock size={28} className="mx-auto text-gray-500 opacity-70" />
          <p className="text-xl text-gray-300 font-medium">
            This profile is private
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            The user has chosen to make their profile visible only to
            themselves.
          </p>
        </div>
      </div>
    );
  }

  // Normal public/own profile view
  const fullName = [publicUser.first_name, publicUser.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-200">
          User Information
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Username */}
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-gray-700/50 rounded-xl">
            <User size={18} className="text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Username
            </p>
            <p className="text-xl text-gray-200">{publicUser.username}</p>
          </div>
        </div>

        {/* Full Name */}
        {fullName && (
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-700/50 rounded-xl">
              <User size={18} className="text-purple-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                Full Name
              </p>
              <p className="text-xl text-gray-200">{fullName}</p>
            </div>
          </div>
        )}

        {/* Gender */}
        {publicUser.gender && (
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-700/50 rounded-xl">
              <VenusAndMars size={18} className="text-gray-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                Gender
              </p>
              <p className={`text-xl ${getGenderColor(publicUser)}`}>
                {publicUser.gender}
              </p>
            </div>
          </div>
        )}

        {/* Role */}
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-gray-700/50 rounded-xl">
            <Shield size={18} className="text-yellow-400" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Role
            </p>
            <div className="transition-all duration-300 group-hover:mt-1">
              <UserRoleTag user={publicUser} />
            </div>
          </div>
        </div>

        {/* Email */}
        {publicUser.email && (
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-700/50 rounded-xl">
              <Mail size={18} className="text-green-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                Email
              </p>
              <p className="text-xl text-gray-200 break-all">
                {publicUser.email}
              </p>
            </div>
          </div>
        )}

        {/* Phone */}
        {publicUser.phone && (
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-700/50 rounded-xl">
              <PhoneCall size={18} className="text-green-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                Phone Number
              </p>
              <p className="text-xl text-gray-200">{publicUser.phone}</p>
            </div>
          </div>
        )}

        {/* Registration Date */}
        {publicUser.registration_date && (
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-700/50 rounded-xl">
              <Calendar size={18} className="text-pink-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                Member Since
              </p>
              <time className="text-xl text-gray-200">
                {formatUserRegistrationDate(publicUser.registration_date)}
              </time>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
