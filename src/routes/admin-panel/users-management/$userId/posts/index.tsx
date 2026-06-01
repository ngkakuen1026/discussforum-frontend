import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../../../../utils/adminCheckUtils";
import UserPost from "../../../../../components/admin-panel/users-management/$userId/Posts/UserPost";

const AdminProtectedUserPosts = () => (
  <RequireAdmin>
    <UserPost />
  </RequireAdmin>
);

export const Route = createFileRoute(
  "/admin-panel/users-management/$userId/posts/",
)({
  component: AdminProtectedUserPosts,
});
