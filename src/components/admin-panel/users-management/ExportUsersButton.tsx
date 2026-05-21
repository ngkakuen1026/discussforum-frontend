import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { UserType } from "../../../types/userTypes";

type FilterType = "all" | "normal" | "suspended" | "new" | "admin" | "member";

interface ExportUsersButtonProps {
  users: UserType[];
  activeFilter: FilterType;
}

export default function ExportUsersButton({
  users,
  activeFilter,
}: ExportUsersButtonProps) {
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

  const exportToExcel = () => {
    if (users.length === 0) {
      toast.error("No users to export");
      return;
    }

    const filterLabel = getFilterLabel(activeFilter);
    const dateStr = new Date().toISOString().slice(0, 10);

    const exportData = users.map((user) => ({
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
    toast.success(`Exported ${users.length} users as ${fileName}`);
  };

  return (
    <button
      onClick={exportToExcel}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors text-white font-medium px-4 py-2 rounded-lg text-sm cursor-pointer border-2 border-gray-700"
    >
      <Download size={18} />
      Export
    </button>
  );
}
