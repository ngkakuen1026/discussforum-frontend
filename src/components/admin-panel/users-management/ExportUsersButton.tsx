import { useState } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { toast } from "sonner";
import authAxios from "../../../services/authAxios";
import { adminAPI } from "../../../services/http-api";
import type { UserType } from "../../../types/userTypes";

type FilterType = "all" | "normal" | "suspended" | "new" | "admin" | "member";

interface ExportUsersButtonProps {
  users: UserType[];
  activeFilter: FilterType;
  search: string;
  userId: string;
  registrationStartDate: string;
  registrationEndDate: string;
  lastLoginStartDate: string;
  lastLoginEndDate: string;
  sort: string;
}

export default function ExportUsersButton({
  users,
  activeFilter,
  search,
  userId,
  registrationStartDate,
  registrationEndDate,
  lastLoginStartDate,
  lastLoginEndDate,
  sort,
}: ExportUsersButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const getFilterLabel = (filter: FilterType): string => {
    switch (filter) {
      case "admin":
        return "Admin_Only";
      case "member":
        return "Member_Only";
      case "suspended":
        return "Suspended";
      case "new":
        return "New_Users";
      case "normal":
        return "Normal_Users";
      case "all":
      default:
        return "All_Users";
    }
  };

  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (search) params.append("query", search);
    if (userId) params.append("user_id", userId);
    if (registrationStartDate)
      params.append("registration_start_date", registrationStartDate);
    if (registrationEndDate)
      params.append("registration_end_date", registrationEndDate);
    if (lastLoginStartDate)
      params.append("last_login_start_date", lastLoginStartDate);
    if (lastLoginEndDate)
      params.append("last_login_end_date", lastLoginEndDate);
    if (activeFilter !== "all") params.append("filter", activeFilter);
    if (sort) params.append("sort", sort);
    return params;
  };

  const fetchPage = async (
    params: URLSearchParams,
    page: number,
    limit = 100,
  ) => {
    const pageParams = new URLSearchParams(params.toString());
    pageParams.set("page", page.toString());
    pageParams.set("limit", limit.toString());

    const response = await authAxios.get(
      `${adminAPI.url}/users/search-users/?${pageParams.toString()}`,
    );

    const data = response.data;
    const usersData = data?.users ?? data?.data?.users ?? [];
    const pagination = data?.pagination ?? data?.data?.pagination ?? null;

    return { users: usersData as UserType[], pagination };
  };

  const exportToExcel = async () => {
    if (users.length === 0) {
      toast.error("No users to export");
      return;
    }

    setIsExporting(true);
    try {
      const params = buildSearchParams();
      const firstPage = await fetchPage(params, 1, 100);
      let allUsers = [...firstPage.users];
      const totalPages = firstPage.pagination?.totalPages ?? 1;

      if (totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            fetchPage(params, index + 2, 100),
          ),
        );

        remainingPages.forEach((pageData) => {
          allUsers = [...allUsers, ...pageData.users];
        });
      }

      if (allUsers.length === 0) {
        toast.error("No users to export");
        return;
      }

      const filterLabel = getFilterLabel(activeFilter);
      const dateStr = new Date().toISOString().slice(0, 10);

      const exportData = allUsers.map((user) => ({
        ID: user.id,
        Username: user.username,
        "Full Name":
          `${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A",
        Email: user.email || "N/A",
        Phone: user.phone || "N/A",
        Gender: user.gender || "N/A",
        Role: user.is_admin ? "Admin" : "Member",
        Status: user.is_banned ? "Suspended" : "Normal",
        "Registered Date": user.registration_date
          ? new Date(user.registration_date).toLocaleDateString()
          : "N/A",
        "Last Login": user.last_login_at
          ? new Date(user.last_login_at).toLocaleDateString()
          : "Never",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      const fileName = `Users_Export_${filterLabel}_${dateStr}.xlsx`;

      XLSX.writeFile(wb, fileName);
      toast.success(`Exported ${allUsers.length} users as ${fileName}`);
    } catch (error) {
      toast.error("Failed to export users. Please try again.");
      console.error(error);
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
}
