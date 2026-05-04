import { useEffect, useState } from "react";
import { EllipsisVertical, Ban, Trash2, Clock, Unlock } from "lucide-react";
import ClickOutside from "../../../hooks/useClickOutside";
import { useUserBan } from "../../../context/BanUserContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { adminAPI } from "../../../services/http-api";
import { formatDate } from "../../../utils/dateUtils";
import DeleteUserPopup from "./DeleteUserPopup";
import type { UserType } from "../../../types/userTypes";
import UnbanUserPopup from "./UnbanUserPopup";

interface UsersActionDropdownProps {
  user: UserType;
}
const UsersActionDropdown = ({ user }: UsersActionDropdownProps) => {
  const queryClient = useQueryClient();
  const [showDeleteUserPopup, setShowDeleteUserPopup] = useState(false);
  const [showUnbanUserPopup, setShowUnbanUserPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { banUser, isBanning } = useUserBan();
  const userId = user.id;
  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({ queryKey: ["ban-status", userId] });
    }
  }, [isOpen, userId, queryClient]);

  const handleBan = (hours: number) => {
    banUser(userId, hours);
    setIsOpen(false);
  };

  const { data: banInfo } = useQuery({
    queryKey: ["ban-status", userId],
    queryFn: async () => {
      const res = await authAxios.get(
        `${adminAPI.url}/users/user/${userId}/ban-status`,
      );
      console.log("Ban status response:", res.data);
      return res.data;
    },
    staleTime: 30 * 1000,
    enabled: !!userId,
  });

  const banOptions = [
    { label: "1 Hour", hours: 1 },
    { label: "6 Hours", hours: 6 },
    { label: "1 Day", hours: 24 },
    { label: "7 Days", hours: 168 },
    { label: "30 Days", hours: 720 },
  ];

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
          <div className="absolute right-0 top-10 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 py-1 text-sm">
            {banInfo?.isBanned ? (
              <>
                <div className="px-4 py-2 text-left flex items-center gap-3 transition-colors text-amber-400">
                  <Ban size={16} />
                  <div className="flex flex-col">
                    <span className="text-white">Banned until:</span>{" "}
                    <span className="font-medium">
                      {banInfo?.ban?.banned_until
                        ? formatDate(banInfo.ban.banned_until)
                        : "Unknown date"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowUnbanUserPopup(true)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center  gap-3  transition-colors cursor-pointer"
                >
                  <Unlock size={16} className="text-red-400" />
                  Unban User
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-gray-400 font-medium text-left">
                  Ban User for:
                </div>
                {banOptions.map((option) => (
                  <button
                    key={option.hours}
                    onClick={() => handleBan(option.hours)}
                    disabled={isBanning}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-800 flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <Clock size={16} className="text-amber-400" />
                    {option.label}
                  </button>
                ))}
              </>
            )}

            <div className="border-t border-gray-700 my-1" />

            <button
              onClick={() => setShowDeleteUserPopup(true)}
              className="w-full px-4 py-2.5 text-left hover:bg-red-950/50 flex items-center gap-3 text-sm text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
              Delete User
            </button>
          </div>
        </ClickOutside>
      )}

      {showDeleteUserPopup && (
        <DeleteUserPopup
          user={user}
          onClose={() => setShowDeleteUserPopup(false)}
        />
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

export default UsersActionDropdown;
