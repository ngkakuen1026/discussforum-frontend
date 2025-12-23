import { createFileRoute } from "@tanstack/react-router";
import RequireAuth from "../utils/RequireAuth";
import PinnedPost from "../components/pins/PinnedPost";

const ProtectedPinnedPost = () => (
  <RequireAuth redirectParam="/pins">
    <PinnedPost />
  </RequireAuth>
);

export const Route = createFileRoute("/pins")({
  component: ProtectedPinnedPost,
});
