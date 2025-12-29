import type { UserType } from "../../../../types/userTypes";
import { useAuth } from "../../../../context/AuthContext";
import { Edit2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface AboutUserCardProps {
  publicUser: UserType;
}

const AboutUserCard = ({ publicUser }: AboutUserCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwnProfile = publicUser.id == user?.id;

  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
      <div className="px-8 py-5 border-b border-gray-700/50 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-200">
          About {publicUser.username}
        </h3>

        {isOwnProfile && (
          <button className="relative group cursor-pointer">
            <Edit2
              size={18}
              className="text-gray-400 hover:text-cyan-400 transition"
              onClick={() => navigate({ to: "/settings/account" })}
            />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50 ">
              Edit Bio
            </span>
          </button>
        )}
      </div>

      <div className="p-8">
        {publicUser.bio ? (
          <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
            {publicUser.bio}
          </p>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg italic">
              {isOwnProfile
                ? "Tell the community a bit about yourself..."
                : "This user hasn't written a bio yet."}
            </p>
            {isOwnProfile && (
              <p className="text-cyan-400 mt-4 text-sm">
                Click "Edit Bio" to add one!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUserCard;
