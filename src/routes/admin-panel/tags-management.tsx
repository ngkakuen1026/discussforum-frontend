import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../utils/adminCheckUtils";
import TagsManagement from "../../components/admin-panel/tags-management/TagsManagement";

const AdminProtectedTagsManagement = () => (
  <RequireAdmin>
    <TagsManagement />
  </RequireAdmin>
);

export const Route = createFileRoute("/admin-panel/tags-management")({
  component: AdminProtectedTagsManagement,
});
