import { useQuery, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../services/authAxios";
import type { UserBlockedType } from "../../types/userBlcokedTypes";
import { userBlockedAPI } from "../../services/http-api";
import { toast } from "sonner";
import BlockedUserToolbar from "./BlockedUserToolbar";
import { Ban } from "lucide-react";
import BlockedUserListCard from "./BlockedUserListCard";
import { Link } from "@tanstack/react-router";
import { useBlockedUsers } from "../../context/BlockedUserContext";
import { useState } from "react";
import BlockedReasonPopup from "./BlockedReasonPopup";

const BlockedUserList = () => {
  const queryClient = useQueryClient();
  const { toggleBlockedUsers, isPending: isBlockedUserPending } =
    useBlockedUsers();

  const { data: blockedUsers = [], isLoading } = useQuery<UserBlockedType[]>({
    queryKey: ["my-blockeds"],
    queryFn: async () => {
      const res = await authAxios.get(`${userBlockedAPI.url}/blocked/me`);
      return res.data.blockedUserList;
    },
    staleTime: 5 * 60 * 1000,
  });

  const refreshBlockedUserList = () => {
    queryClient.refetchQueries({ queryKey: ["my-blockeds"] });
    toast.success(`User blocked refreshed!`);
  };

  const [selectedUserForReason, setSelectedUserForReason] =
    useState<UserBlockedType | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-6">
      <BlockedUserToolbar
        blockedUsers={blockedUsers}
        refreshBlockedUserList={refreshBlockedUserList}
      />

      {blockedUsers.length ? (
        <div className="space-y-4 mt-4">
          {blockedUsers.map((blockedUser: UserBlockedType) => (
            <BlockedUserListCard
              key={blockedUser.blocked_user_id}
              blockedUser={blockedUser}
              onUnblock={() => toggleBlockedUsers(blockedUser.blocked_user_id)}
              isPending={isBlockedUserPending}
              onOpenReasonPopup={() => setSelectedUserForReason(blockedUser)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No blocked user.</p>
          <p className="text-gray-500 mt-4 ">
            Go to post and click{" "}
            <Link
              to="/"
              search={{ categoryId: 0 }}
              replace={true}
              className="hover:underline text-white"
              target="_blank"
            >
              <Ban className="inline" />
              Block User
            </Link>{" "}
            to block the user.
          </p>
          <p className="text-gray-500 mt-2">
            {" "}
            After blocking a user, you will no longer be able to see that user's
            posts and comments.
          </p>
        </div>
      )}
      {selectedUserForReason && (
        <BlockedReasonPopup
          userId={selectedUserForReason.blocked_user_id}
          userName={selectedUserForReason.blocked_user_username}
          userProfileImage={selectedUserForReason.blocked_user_profile_image}
          userGender={selectedUserForReason.blocked_user_gender}
          userIsAdmin={selectedUserForReason.blocked_user_is_admin}
          userBlockedReason={selectedUserForReason.blocked_reason}
          onClose={() => setSelectedUserForReason(null)}
        />
      )}
    </div>
  );
};

export default BlockedUserList;
