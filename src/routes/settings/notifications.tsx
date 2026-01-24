import { createFileRoute } from '@tanstack/react-router'
import RequireAuth from '../../utils/RequireAuth';
import NotiSetting from '../../components/settings/notifications/NotiSetting';

const ProtectedNotificationSettings = () => (
  <RequireAuth redirectParam="/settings/notifications">
    <NotiSetting />
  </RequireAuth>
);

export const Route = createFileRoute("/settings/notifications")({
  component: ProtectedNotificationSettings,
});
