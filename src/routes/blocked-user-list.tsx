import { createFileRoute } from "@tanstack/react-router";
import BlockedUserList from "../components/posts/blockedUserList/blockedUserList";

export const Route = createFileRoute("/blocked-user-list")({
  component: BlockedUserList,
});
