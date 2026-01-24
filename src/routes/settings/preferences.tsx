import { createFileRoute } from '@tanstack/react-router'
import RequireAuth from '../../utils/RequireAuth';
import PreferencesSetting from '../../components/settings/preferences/PreferencesSetting';

const ProtectedPreferenceSettings = () => (
  <RequireAuth redirectParam="/settings/preferences">
    <PreferencesSetting />
  </RequireAuth>
);

export const Route = createFileRoute("/settings/preferences")({
  component: ProtectedPreferenceSettings,
});