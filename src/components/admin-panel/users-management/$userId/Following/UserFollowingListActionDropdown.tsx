import { EllipsisVertical, Navigation, Trash2 } from "lucide-react";
import { useState } from "react";
import ClickOutside from "../../../../../hooks/useClickOutside";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import type { UserFollowType } from "../../../../../types/userFollowTypes";
import DeleteUserFollowingPopup from "./DeleteUserFollowingPopup";

interface UserFollowingListActionDropdownProps {
  following: UserFollowType;
  userId: string;
  username: string;
}

const UserFollowingListActionDropdown = ({
  following,
  userId,
  username,
}: UserFollowingListActionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteFollowingPopup, setShowDeleteFollowingPopup] =
    useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
      >
        <EllipsisVertical
          size={18}
          className="text-gray-400 hover:text-white"
        />
      </button>

      {isOpen && (
        <ClickOutside onClickOutside={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute right-10 top-10 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 py-1 text-sm"
          >
            <Link
              to="/admin-panel/users-management/$userId"
              params={{ userId: following.following_user_id.toString() }}
              search={{ page: 1 }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-800 flex items-center gap-3 text-sm transition-colors cursor-pointer"
            >
              <Navigation size={16} />
              Go to User (admin page)
            </Link>

            <Link
              to="/public-profile/user/$userId"
              params={{ userId: following.following_user_id.toString() }}
              search={{ page: 1 }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-800 flex items-center gap-3 text-sm transition-colors cursor-pointer"
            >
              <Navigation size={16} />
              Go to User (public profile)
            </Link>

            <button
              onClick={() => setShowDeleteFollowingPopup(true)}
              className="w-full px-4 py-2.5 text-left hover:bg-red-950/50 flex items-center gap-3 text-sm text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
              Remove Following
            </button>
          </motion.div>
        </ClickOutside>
      )}

      {showDeleteFollowingPopup && (
        <DeleteUserFollowingPopup
          following={following}
          userId={userId}
          username={username}
          onClose={() => setShowDeleteFollowingPopup(false)}
        />
      )}
    </div>
  );
};

export default UserFollowingListActionDropdown;
