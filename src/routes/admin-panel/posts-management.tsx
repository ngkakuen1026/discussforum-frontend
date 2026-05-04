import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../utils/adminCheckUtils";
import PostsManagement from "../../components/admin-panel/posts-management/PostsManagement";

const AdminProtectedPostsManagement = () => (
  <RequireAdmin>
    <PostsManagement />
  </RequireAdmin>
);

export const Route = createFileRoute("/admin-panel/posts-management")({
  component: AdminProtectedPostsManagement,
});
