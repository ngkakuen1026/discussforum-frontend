import {
  Ban,
  EllipsisVertical,
  Trash2,
  Unlock,
} from "lucide-react";
import type { UserType } from "../../../../types/userTypes";
import { useState } from "react";
import ClickOutside from "../../../../hooks/useClickOutside";
import { motion } from "framer-motion";
import UnbanUserPopup from "../UnbanUserPopup";
import DeleteUserPopup from "../DeleteUserPopup";
import BanUserPopup from "../BanUserPopup";
import { useUserBanStatus } from "../../../../hooks/useUserBanStatus";

interface UserHeaderDropdownProps {
  user: UserType;
}

const UserHeaderDropdown = ({ user }: UserHeaderDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteUserPopup, setShowDeleteUserPopup] = useState(false);
  const [showBanUserPopup, setShowBanUserPopup] = useState(false);
  const [showUnbanUserPopup, setShowUnbanUserPopup] = useState(false);

  const userId = user.id;

  const { data: banInfo } = useUserBanStatus(userId);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="relative group cursor-pointer"
      >
        <EllipsisVertical
          size={18}
          className="text-gray-400 hover:text-white"
        />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-99">
          More Actions 
        </span>
      </button>

      {isOpen && (
        <ClickOutside onClickOutside={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute right-0 top-10 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 py-1 text-sm"
          >
            {banInfo.isBanned ? (
              <>
                <button
                  onClick={() => setShowUnbanUserPopup(true)}
                  className="w-full px-4 py-3 text-left hover:bg-green-900/50 flex items-center text-green-400 gap-3  transition-colors cursor-pointer"
                >
                  <Unlock size={16} />
                  Unban User
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowBanUserPopup(true)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center text-amber-400 gap-3  transition-colors cursor-pointer"
                >
                  <Ban size={16} />
                  Ban User
                </button>
              </>
            )}

            <button
              onClick={() => setShowDeleteUserPopup(true)}
              className="w-full px-4 py-2.5 text-left hover:bg-red-950/50 flex items-center gap-3 text-sm text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
              Delete User
            </button>
          </motion.div>
        </ClickOutside>
      )}

      {showDeleteUserPopup && (
        <DeleteUserPopup
          user={user}
          onClose={() => setShowDeleteUserPopup(false)}
        />
      )}

      {showBanUserPopup && (
        <BanUserPopup user={user} onClose={() => setShowBanUserPopup(false)} />
      )}

      {showUnbanUserPopup && (
        <UnbanUserPopup
          user={user}
          onClose={() => setShowUnbanUserPopup(false)}
        />
      )}
    </div>
  );
};

export default UserHeaderDropdown;
