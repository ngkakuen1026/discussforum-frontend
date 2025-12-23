import { createFileRoute } from "@tanstack/react-router";
import PostDrafts from "../components/post-drafts/PostDrafts";
import RequireAuth from "../utils/RequireAuth";

const ProtectedPostDrafts = () => (
  <RequireAuth redirectParam="/post-drafts">
    <PostDrafts />
  </RequireAuth>
);

export const Route = createFileRoute("/post-drafts")({
  component: ProtectedPostDrafts,
});
