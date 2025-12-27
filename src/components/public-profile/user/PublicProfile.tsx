import { useQuery } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { useNavigate, useParams } from "@tanstack/react-router";
import PublicProfileHeader from "./PublicProfileHeader/PublicProfileHeader";
import { useState } from "react";
import AvatarPopup from "./PublicProfileHeader/AvatarPopup";
import BannerPopup from "./PublicProfileHeader/ProfileBannerPopup";

const PublicProfile = () => {
  const { userId } = useParams({ from: "/public-profile/user/$userId" });
  const navigate = useNavigate();
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [showBannerPopup, setShowBannerPopup] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await authAxios.get(`${usersAPI.url}/user-profile/${userId}`);
      return res.data.user;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl mb-4">
          User not found or failed to load
        </p>
        <button
          onClick={() =>
            navigate({ to: "/", search: { categoryId: 0 }, replace: true })
          }
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-1 pb-8">
      <PublicProfileHeader
        publicUser={user}
        onShowAvatarPopup={() => setShowAvatarPopup(true)}
        onShowBannerPopup={() => setShowBannerPopup(true)}
      />

      {showAvatarPopup && (
        <AvatarPopup
          publicUser={user}
          onClose={() => setShowAvatarPopup(false)}
        />
      )}

      {showBannerPopup && (
        <BannerPopup
          publicUser={user}
          onClose={() => setShowBannerPopup(false)}
        />
      )}
    </div>
  );
};

export default PublicProfile;
