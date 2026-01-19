import { createFileRoute } from "@tanstack/react-router";
import RequireAuth from "../../../../utils/RequireAuth";
import UserFollower from "../../../../components/public-profile/user/user-follower/UserFollower";

const ProtectedUserFollower = () => (
  <RequireAuth redirectParam="/public-profile/user/$userId/user-follower">
    <UserFollower />
  </RequireAuth>
);

export const Route = createFileRoute(
  "/public-profile/user/$userId/user-follower"
)({
  component: ProtectedUserFollower,
});
