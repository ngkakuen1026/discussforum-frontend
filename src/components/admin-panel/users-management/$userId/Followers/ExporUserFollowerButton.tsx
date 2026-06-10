import { useState } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { toast } from "sonner";
import authAxios from "../../../../../services/authAxios";
import { adminAPI } from "../../../../../services/http-api";
import type { UserFollowerType } from "../../../../../types/userFollowTypes";
import { formatDate, formatUserRegistrationDate } from "../../../../../utils/dateUtils";

interface ExportUserFollowersButtonProps {
  followers: UserFollowerType[];
  username?: string;
  userId: string;
  search: string;
  startDate: string;
  endDate: string;
  sort: string;
}

const ExporUserFollowerButton = ({
  followers,
  username = "UnknownUser",
  userId,
  search,
  startDate,
  endDate,
  sort,
}: ExportUserFollowersButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (search) params.append("query", search);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (sort) params.append("sort", sort);
    if (userId) params.append("author_id", userId);
    return params;
  };

  const fetchPage = async (page: number, limit = 100) => {
    const isAdvanced = !!search || !!startDate || !!endDate || !!sort;
    const params = buildSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    const url = isAdvanced
      ? `${adminAPI.url}/user-following/followers/${userId}/search?${params.toString()}`
      : `${adminAPI.url}/user-following/followers/${userId}?${params.toString()}`;

    const response = await authAxios.get(url);
    const data = response.data;
    const pageFollowers = data?.userFollowerList ?? [];
    const pagination = data?.pagination ?? null;

    return { followers: pageFollowers as UserFollowerType[], pagination };
  };

  const exportToExcel = async () => {
    if (followers.length === 0) {
      toast.error("No followers to export");
      return;
    }

    setIsExporting(true);
    try {
      const firstPage = await fetchPage(1, 100);
      let allFollowers = [...firstPage.followers];
      const totalPages = firstPage.pagination?.totalPages ?? 1;

      if (totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            fetchPage(index + 2, 100),
          ),
        );
        remainingPages.forEach((pageData) => {
          allFollowers = [...allFollowers, ...pageData.followers];
        });
      }

      if (allFollowers.length === 0) {
        toast.error("No followers to export");
        return;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const exportData = allFollowers.map((follower) => ({
        "User ID": userId || "N/A",
        "Follower ID": follower.follower_user_id,
        Username: follower.follower_user_username,
        Email: follower.follower_user_email || "N/A",
        "Joined At": follower.follower_user_registration_date
          ? formatUserRegistrationDate(follower.follower_user_registration_date)
          : "N/A",
        "Followed At": follower.followed_at
          ? formatDate(follower.followed_at)
          : "N/A",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "User Followers");

      const fileName = `User_${username}_Followers_${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(
        `Successfully exported ${allFollowers.length} followers for User #${username}`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to export user followers. Please try again.");
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

export default ExporUserFollowerButton;
