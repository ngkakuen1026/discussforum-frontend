import { useState } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { toast } from "sonner";
import authAxios from "../../../../../services/authAxios";
import { adminAPI } from "../../../../../services/http-api";
import type { UserFollowType } from "../../../../../types/userFollowTypes";
import {
  formatDate,
  formatUserRegistrationDate,
} from "../../../../../utils/dateUtils";

interface ExportUserFollowingsButtonProps {
  followings: UserFollowType[];
  username?: string;
  userId: string;
  search: string;
  registrationStartDate: string;
  registrationEndDate: string;
  sort: string;
}

const ExportUserFollowingButton = ({
  followings,
  username = "UnknownUser",
  userId,
  search,
  registrationStartDate,
  registrationEndDate,
  sort,
}: ExportUserFollowingsButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (search) params.append("query", search);
    if (registrationStartDate)
      params.append("start_date", registrationStartDate);
    if (registrationEndDate) params.append("end_date", registrationEndDate);
    if (sort) params.append("sort", sort);
    if (userId) params.append("author_id", userId);
    return params;
  };

  const fetchPage = async (page: number, limit = 100) => {
    const params = buildSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    const url = `${adminAPI.url}/user-following/followings/${userId}/search?${params.toString()}`;

    const response = await authAxios.get(url);
    const data = response.data;
    const pageFollowings = data?.userFollowingList ?? [];
    const pagination = data?.pagination ?? null;

    return { followings: pageFollowings as UserFollowType[], pagination };
  };

  const exportToExcel = async () => {
    if (followings.length === 0) {
      toast.error("No followings to export");
      return;
    }

    setIsExporting(true);
    try {
      const firstPage = await fetchPage(1, 100);
      let allFollowings = [...firstPage.followings];
      const totalPages = firstPage.pagination?.totalPages ?? 1;

      if (totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            fetchPage(index + 2, 100),
          ),
        );
        remainingPages.forEach((pageData) => {
          allFollowings = [...allFollowings, ...pageData.followings];
        });
      }

      if (allFollowings.length === 0) {
        toast.error("No following to export");
        return;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const exportData = allFollowings.map((following) => ({
        "Following User ID": following.following_user_id,
        Username: following.following_user_username,
        "Full Name":
          `${following.following_user_first_name || ""} ${following.following_user_last_name || ""}`.trim() ||
          "N/A",
        Email: following.following_user_email || "N/A",
        Registered: following.following_user_registration_date
          ? formatUserRegistrationDate(
              following.following_user_registration_date,
            )
          : "N/A",
        "Last Login": following.following_user_last_login_at
          ? formatDate(following.following_user_last_login_at)
          : "Never",
        "Followed At": following.followed_at
          ? formatDate(following.followed_at)
          : "N/A",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "User Followings");

      const fileName = `User_${username}_Followings_${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(
        `Successfully exported ${allFollowings.length} followings for User #${username}`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to export user following list. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={isExporting}
      className={`flex items-center gap-2 ${
        isExporting
          ? "bg-gray-700 cursor-not-allowed"
          : "bg-gray-800 hover:bg-gray-700"
      } transition-colors text-white font-medium px-4 py-2 rounded-lg text-sm border-2 border-gray-700 cursor-pointer`}
    >
      <Download size={18} />
      {isExporting ? "Exporting..." : "Export"}
    </button>
  );
};

export default ExportUserFollowingButton;
