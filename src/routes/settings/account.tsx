import { createFileRoute } from "@tanstack/react-router";
import RequireAuth from "../../utils/RequireAuth";
import AccountSetting from "../../components/settings/account/AccountSetting";

const ProtectedAccountSettings = () => (
  <RequireAuth redirectParam="/settings/account">
    <AccountSetting />
  </RequireAuth>
);

export const Route = createFileRoute("/settings/account")({
  component: ProtectedAccountSettings,
});

