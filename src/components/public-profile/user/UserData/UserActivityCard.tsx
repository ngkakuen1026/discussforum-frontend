import { Calendar } from "lucide-react";
import type { PostType } from "../../../../types/postTypes";
import type { UserType } from "../../../../types/userTypes";
import { formatUserLastLoginDate } from "../../../../utils/dateUtils";

interface UserActivityCardProps {
  publicUser: UserType;
  publicUserPosts: PostType[];
  publicUserCommentCount: string;
}

const UserActivityCard = ({
  publicUser,
  publicUserPosts,
  publicUserCommentCount,
}: UserActivityCardProps) => {
  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
      <div className="px-8 py-4 border-b border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-200">User Activity</h3>
      </div>

      <div className="p-4">
        <div className="flex justify-center space-x-2">
          <div className="group flex flex-col items-center text-center gap-3 px-6 py-4 rounded-xl transition-all duration-300">
            <span className="text-3xl text-gray-300 group-hover:text-gray-100 font-medium transition ">
              {publicUserPosts.length}
            </span>
            <span className="text-gray-300 group-hover:text-gray-100 font-medium transition">
              Post Count
            </span>
          </div>

          <div className="group flex flex-col items-center text-center gap-3 px-6 py-4 rounded-xl transition-all duration-300">
            <span className="text-3xl text-gray-300 group-hover:text-gray-100 font-medium transition">
              {publicUserCommentCount}
            </span>
            <span className="text-gray-300 group-hover:text-gray-100 font-medium transition">
              Comments Count
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 group">
          <div className="p-3 bg-gray-700/50 rounded-xl">
            <Calendar size={18} className="text-green-400" />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-400 h-0 overflow-hidden group-hover:h-auto group-hover:mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Last Login
            </p>
            <time className="text-xl text-gray-200 transition-all duration-300 group-hover:mt-1">
              {formatUserLastLoginDate(publicUser.last_login_at)}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityCard;
