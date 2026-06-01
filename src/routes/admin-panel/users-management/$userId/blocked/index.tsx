import { createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "../../../../../utils/adminCheckUtils";
import UserBlocked from "../../../../../components/admin-panel/users-management/$userId/Blocked/UserBlocked";

const adminProtectedBlockedUsers = () => (
  <RequireAdmin>
    <UserBlocked />
  </RequireAdmin>
);

export const Route = createFileRoute(
  "/admin-panel/users-management/$userId/blocked/",
)({
  component: adminProtectedBlockedUsers,
});
