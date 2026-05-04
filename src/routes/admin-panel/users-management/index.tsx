import { createFileRoute } from "@tanstack/react-router";
import UsersManagement from "../../../components/admin-panel/users-management/UsersManagement";
import RequireAdmin from "../../../utils/adminCheckUtils";

const AdminProtectedUserManagement = () => (
  <RequireAdmin>
    <UsersManagement />
  </RequireAdmin>
);

export const Route = createFileRoute("/admin-panel/users-management/")({
  component: AdminProtectedUserManagement,
});
