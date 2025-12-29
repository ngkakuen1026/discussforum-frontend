import { useNavigate } from "@tanstack/react-router";
import { CirclePlus } from "lucide-react";
import type { UserType } from "../../../../types/userTypes";
import { useAuth } from "../../../../context/AuthContext";

interface PostListTitleCardProps {
  publicUser: UserType;
}

const PostListTitleCard = ({ publicUser }: PostListTitleCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwnProfile = user?.id === publicUser.id;

  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
      <div className="px-8 py-4 text-gray-200 flex justify-between items-center cursor-pointer ">
        <h3 className="text-xl font-semibold">Post Information</h3>
        {isOwnProfile && (
          <button className="relative group cursor-pointer">
            <CirclePlus
              size={16}
              className="text-gray-200 hover:text-gray-400 transition"
              onClick={() => navigate({ to: "/add-post" })}
            />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50 ">
              Add Post
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PostListTitleCard;
