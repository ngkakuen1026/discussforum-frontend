import { createFileRoute } from "@tanstack/react-router";
import RequireAuth from "../../utils/RequireAuth";
import PasswordUpdate from "../../components/settings/account/PasswordUpdate";

const ProtectedUpdatePassword = () => (
  <RequireAuth redirectParam="/settings/update-password">
    <PasswordUpdate />
  </RequireAuth>
)

export const Route = createFileRoute("/settings/update-password")({
  component: ProtectedUpdatePassword,
});
