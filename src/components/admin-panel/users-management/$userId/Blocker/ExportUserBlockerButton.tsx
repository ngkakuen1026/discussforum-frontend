import { useState } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { toast } from "sonner";
import authAxios from "../../../../../services/authAxios";
import { adminAPI } from "../../../../../services/http-api";
import type { UserBlockerType } from "../../../../../types/userBlcokedTypes";
import { formatDate, formatUserRegistrationDate } from "../../../../../utils/dateUtils";

interface ExportUserBlockerButtonProps {
  blockers: UserBlockerType[];
  username?: string;
  userId: string;
  search: string;
  registrationStartDate: string;
  registrationEndDate: string;
  lastLoginStartDate: string;
  lastLoginEndDate: string;
  blockedStartDate: string;
  blockedEndDate: string;
  sort: string;
}

const ExportUserBlockerButton = ({
  blockers,
  username = "UnknownUser",
  userId,
  search,
  registrationStartDate,
  registrationEndDate,
  lastLoginStartDate,
  lastLoginEndDate,
  blockedStartDate,
  blockedEndDate,
  sort,
}: ExportUserBlockerButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (search) params.append("query", search);
    if (registrationStartDate)
      params.append("registration_start_date", registrationStartDate);
    if (registrationEndDate)
      params.append("registration_end_date", registrationEndDate);
    if (lastLoginStartDate)
      params.append("last_login_start_date", lastLoginStartDate);
    if (lastLoginEndDate)
      params.append("last_login_end_date", lastLoginEndDate);
    if (blockedStartDate) params.append("blocked_start_date", blockedStartDate);
    if (blockedEndDate) params.append("blocked_end_date", blockedEndDate);
    if (userId) params.append("author_id", userId.toString());
    if (sort) params.append("sort", sort);
    return params;
  };

  const fetchPage = async (page: number, limit = 100) => {
    const params = buildSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    const url = `${adminAPI.url}/user-blocked/user-blocked-list/${userId}/search?${params.toString()}`;

    const response = await authAxios.get(url);
    const data = response.data;
    const pageBlockers = data?.userBlockerList ?? [];
    const pagination = data?.pagination ?? null;

    return { blockers: pageBlockers as UserBlockerType[], pagination };
  };

  const exportToExcel = async () => {
    if (blockers.length === 0) {
      toast.error("No blockers to export");
      return;
    }

    setIsExporting(true);
    try {
      const firstPage = await fetchPage(1, 100);
      let allBlockers = [...firstPage.blockers];
      const totalPages = firstPage.pagination?.totalPages ?? 1;

      if (totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            fetchPage(index + 2, 100),
          ),
        );
        remainingPages.forEach((pageData) => {
          allBlockers = [...allBlockers, ...pageData.blockers];
        });
      }

      if (allBlockers.length === 0) {
        toast.error("No blockers to export");
        return;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const exportData = allBlockers.map((blocker) => ({
        "User ID": userId || "N/A",
        "Blocker ID": blocker.blocker_user_id,
        Username: blocker.blocker_user_username,
        Email: blocker.blocker_user_email || "N/A",
        "Joined At": blocker.blocker_user_registration_date
          ? formatUserRegistrationDate(blocker.blocker_user_registration_date)
          : "N/A",
        "Blocked At": blocker.blocked_at
          ? formatDate(blocker.blocked_at)
          : "N/A",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "User Blockers");

      const fileName = `User_${username}_Blockers_${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(
        `Successfully exported ${allBlockers.length} blockers for User #${username}`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to export user blockers. Please try again.");
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

export default ExportUserBlockerButton;
