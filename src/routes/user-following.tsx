import { createFileRoute } from "@tanstack/react-router";
import UserFollowing from "../components/user-following/UserFollowing";
import RequireAuth from "../utils/RequireAuth";

const ProtectedUserFollowing = () => (
  <RequireAuth redirectParam="/user-following">
    <UserFollowing />
  </RequireAuth>
);

export const Route = createFileRoute("/user-following")({
  component: ProtectedUserFollowing,
});
