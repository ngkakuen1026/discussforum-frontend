import { createFileRoute } from "@tanstack/react-router";
import RequireAuth from "../../utils/RequireAuth";
import PrivacySetting from "../../components/settings/privacy/PrivacySetting";

const ProtectedPrivacySettings = () => (
  <RequireAuth redirectParam="/settings/privacy">
    <PrivacySetting />
  </RequireAuth>
);

export const Route = createFileRoute("/settings/privacy")({
  component: ProtectedPrivacySettings,
});
