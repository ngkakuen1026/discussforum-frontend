import { createFileRoute } from "@tanstack/react-router";
import RequireAuth from "../utils/RequireAuth";
import FollowingFeed from "../components/following-feed/FollowingFeed";

const ProtectedFollowingFeed = () => (
  <RequireAuth redirectParam="/following-feed">
    <FollowingFeed />
  </RequireAuth>
);

export const Route = createFileRoute("/following-feed")({
  component: ProtectedFollowingFeed,
});
