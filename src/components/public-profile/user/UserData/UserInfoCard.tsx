import type { UserType } from "../../../../types/userTypes";
import {
  Mail,
  User,
  Calendar,
  Shield,
  PhoneCall,
  VenusAndMars,
} from "lucide-react";
import { formatUserRegistrationDate } from "../../../../utils/dateUtils";
import { UserRoleTag } from "../../../UserRoleTag";
import { useAuth } from "../../../../context/AuthContext";
import { getGenderColor } from "../../../../utils/userUtils";

interface UserInfoCardProps {
  publicUser: UserType;
}

const UserInfoCard = ({ publicUser }: UserInfoCardProps) => {
  const { user } = useAuth();
  const isOwnProfile = publicUser.id == user?.id;
  const fullName = publicUser.first_name + publicUser.last_name;

  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-200">
          User Information
        </h3>
      </div>

      {/* Content */}
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

            <p className="text-xl  text-gray-200 transition-all duration-300 group-hover:">
              {publicUser.username}
            </p>
          </div>
        </div>

        {/* FullName */}
        <div className="flex items-center gap-4 group ">
          <div className="p-3 bg-gray-700/50 rounded-xl ">
            <User size={18} className="text-purple-400" />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Full Name
            </p>
            <p
              className={`text-xl  text-gray-200 transition-all duration-300 group-hover:mt-1`}
            >
              {fullName ? `${fullName}` : "Not Provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-gray-700/50 rounded-xl">
            <VenusAndMars size={18} className="text-gray-400" />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Gender
            </p>
            <p
              className={`text-xl  ${getGenderColor(publicUser)} break-all transition-all duration-300 group-hover:mt-1`}
            >
              {publicUser.gender}
            </p>
          </div>
        </div>

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
        {isOwnProfile && (
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-700/50 rounded-xl">
              <Mail size={18} className="text-green-400" />
            </div>

            <div className="flex flex-col">
              <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                Email
              </p>
              <p className="text-xl  text-gray-200 break-all transition-all duration-300 group-hover:mt-1">
                {publicUser.email}
              </p>
            </div>
          </div>
        )}

        {/* Phone Number */}
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-gray-700/50 rounded-xl">
            <PhoneCall size={18} className="text-green-400" />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Phome Number
            </p>
            <p className="text-xl  text-gray-200 transition-all duration-300 group-hover:mt-1">
              {publicUser.phone ? `${publicUser.phone}` : "Not Provided"}
            </p>
          </div>
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-gray-700/50 rounded-xl">
            <Calendar size={18} className="text-pink-400" />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Member Since
            </p>
            <time className="text-xl text-gray-200 transition-all duration-300 group-hover:mt-1">
              {formatUserRegistrationDate(publicUser.registration_date)}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
