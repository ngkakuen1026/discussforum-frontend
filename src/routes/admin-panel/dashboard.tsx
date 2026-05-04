import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../utils/adminCheckUtils";
import AdminDashboard from "../../components/admin-panel/dashboard/AdminDashboard";

const AdminProtectedDashBoard = () => (
  <RequireAdmin>
    <AdminDashboard />
  </RequireAdmin>
);

export const Route = createFileRoute("/admin-panel/dashboard")({
  component: AdminProtectedDashBoard,
});
