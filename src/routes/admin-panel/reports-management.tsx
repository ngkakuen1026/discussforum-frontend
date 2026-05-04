import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../utils/adminCheckUtils";
import ReportManagement from "../../components/admin-panel/reports-mamgement/ReportManagement";

const AdminProtectedReportManagement = () => (
  <RequireAdmin>
    <ReportManagement />
  </RequireAdmin>
);

export const Route = createFileRoute("/admin-panel/reports-management")({
  component: AdminProtectedReportManagement,
});
