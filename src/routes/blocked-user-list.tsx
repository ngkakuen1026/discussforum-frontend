import { createFileRoute } from "@tanstack/react-router";
import BlockedUserList from "../components/posts/blockedUserList/blockedUserList";
import RequireAuth from "../utils/RequireAuth";

const ProtectedBlockedUserList = () => (
  <RequireAuth redirectParam="/blocked-user-list">
    <BlockedUserList />
  </RequireAuth>
);

export const Route = createFileRoute("/blocked-user-list")({
  component: ProtectedBlockedUserList,
});
