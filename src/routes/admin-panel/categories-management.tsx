import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../utils/adminCheckUtils";
import CategoriesManagement from "../../components/admin-panel/categories-management/CategoriesManagement";

const AdminProtectedCategoriesManagement = () => (
  <RequireAdmin>
    <CategoriesManagement />
  </RequireAdmin>
);

export const Route = createFileRoute("/admin-panel/categories-management")({
  component: AdminProtectedCategoriesManagement,
});
