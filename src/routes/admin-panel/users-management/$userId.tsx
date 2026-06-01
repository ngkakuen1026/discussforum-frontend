import { createFileRoute, Outlet } from "@tanstack/react-router";
import RequireAdmin from "../../../utils/adminCheckUtils";

const AdminProtectedUserDetail = () => (
  <RequireAdmin>
    <Outlet />
  </RequireAdmin>
);

export const Route = createFileRoute("/admin-panel/users-management/$userId")({
  component: AdminProtectedUserDetail,
});
