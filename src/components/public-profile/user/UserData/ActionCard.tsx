import {
  Ban,
  CircleOff,
  MessageSquare,
  UserMinus,
  UserPlus,
} from "lucide-react";

interface ActionCardProps {
  withAuth: (action: () => void) => () => void;
  isFollowed: boolean;
  onToggleFollow: () => void;
  isBlocked: boolean;
  onToggleBlock: () => void;
  isBlockPending?: boolean;
}

const ActionCard = ({
  withAuth,
  isFollowed,
  onToggleFollow,
  isBlocked,
  onToggleBlock,
  isBlockPending,
}: ActionCardProps) => {
  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
      <div className="px-8 py-4 border-b border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-200">Actions</h3>
      </div>

      <div className="p-4">
        <div className="flex justify-center space-x-2">
          <button className="group flex flex-col items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer">
            <MessageSquare
              size={18}
              className="text-gray-400 group-hover:text-gray-100 transition"
            />
            <span className="text-gray-300 group-hover:text-gray-100 font-medium transition">
              Message User
            </span>
          </button>

          <button
            onClick={withAuth(onToggleFollow)}
            className="group flex flex-col items-center gap-3 px-6 py-4 rounded-xl  transition-all duration-300 cursor-pointer"
          >
            {isFollowed ? (
              <UserMinus
                size={18}
                className="text-cyan-400 group-hover:text-cyan-600 font-medium transition"
              />
            ) : (
              <UserPlus
                size={18}
                className="text-gray-400 group-hover:text-cyan-400 font-medium transition"
              />
            )}

            <span
              className={
                isBlocked
                  ? "text-cyan-400 group-hover:text-cyan-600 font-medium transition"
                  : "text-gray-300 group-hover:text-cyan-400 font-medium transition"
              }
            >
              {isFollowed ? "Unfollow User" : "Follow User"}
            </span>
          </button>

          <button
            onClick={withAuth(onToggleBlock)}
            className={`group flex flex-col items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer ${isBlockPending ? "opacity-60 pointer-events-none" : ""}`}
            disabled={isBlockPending}
          >
            {isBlocked ? (
              <Ban
                size={18}
                className="text-red-400 group-hover:text-red-600 font-medium transition"
              />
            ) : (
              <CircleOff
                size={18}
                className="text-gray-400 group-hover:text-red-400 font-medium transition"
              />
            )}
            <span
              className={
                isBlocked
                  ? "text-red-400 group-hover:text-red-600 font-medium transition"
                  : "text-gray-300 group-hover:text-red-400 font-medium transition"
              }
            >
              {isBlocked ? "Unblock User" : "Block User"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
