import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../../utils/adminCheckUtils";
import UserDetail from "../../../components/admin-panel/users-management/UserDetail";

const AdminProtectedUserDetail = () => (
  <RequireAdmin>
    <UserDetail />
  </RequireAdmin>
);

export const Route = createFileRoute("/admin-panel/users-management/$userId")({
  component: AdminProtectedUserDetail,
});
