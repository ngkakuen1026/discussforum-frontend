import { createFileRoute } from "@tanstack/react-router";
import UserFollowing from "../../../../components/public-profile/user/user-following/UserFollowing";
import RequireAuth from "../../../../utils/RequireAuth";

const ProtectedUserFollowing = () => (
  <RequireAuth redirectParam="/public-profile/user/$userId/user-following">
    <UserFollowing />
  </RequireAuth>
);

export const Route = createFileRoute("/public-profile/user/$userId/user-following")({
  component: ProtectedUserFollowing,
});
