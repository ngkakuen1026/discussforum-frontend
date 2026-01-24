import { createFileRoute } from '@tanstack/react-router'
import RequireAuth from '../../utils/RequireAuth';
import ProfileSetting from '../../components/settings/profile/ProfileSetting';

const ProtectedProfileSettings = () => (
  <RequireAuth redirectParam="/settings/profile">
    <ProfileSetting />
  </RequireAuth>
);

export const Route = createFileRoute("/settings/profile")({
  component: ProtectedProfileSettings,
});