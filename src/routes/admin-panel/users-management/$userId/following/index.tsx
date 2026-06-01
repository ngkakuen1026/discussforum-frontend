import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../../../../utils/adminCheckUtils";
import UserFollowing from "../../../../../components/admin-panel/users-management/$userId/Following/UserFollowing";

const adminProtectedUserFollowing = () => (
  <RequireAdmin>
    <UserFollowing />
  </RequireAdmin>
);

export const Route = createFileRoute(
  "/admin-panel/users-management/$userId/following/",
)({
  component: adminProtectedUserFollowing,
});
