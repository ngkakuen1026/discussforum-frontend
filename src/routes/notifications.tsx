import { createFileRoute } from "@tanstack/react-router";
import RequireAuth from "../utils/RequireAuth";
import Notification from "../components/notifications/Notification";

const ProtectedNotification = () => (
  <RequireAuth redirectParam="/notifications">
    <Notification />
  </RequireAuth>
);

export const Route = createFileRoute("/notifications")({
  component: ProtectedNotification,
});
