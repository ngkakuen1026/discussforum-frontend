import { createFileRoute } from "@tanstack/react-router";
import RequireAuth from "../utils/RequireAuth";
import BlockedUserList from "../components/blockedUserList/BlockedUserList";

const ProtectedBlockedUserList = () => (
  <RequireAuth redirectParam="/blocked-user-list">
    <BlockedUserList />
  </RequireAuth>
);

export const Route = createFileRoute("/blocked-user-list")({
  component: ProtectedBlockedUserList,
});
