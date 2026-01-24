import { createFileRoute } from "@tanstack/react-router";
import PostSetting from "../../components/settings/posts/PostSetting";
import RequireAuth from "../../utils/RequireAuth";

const ProtectedPostsSettings = () => (
  <RequireAuth redirectParam="/settings/preferences">
    <PostSetting />
  </RequireAuth>
);

export const Route = createFileRoute("/settings/posts")({
  component: ProtectedPostsSettings,
});
