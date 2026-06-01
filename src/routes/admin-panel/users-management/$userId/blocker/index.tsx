import { createFileRoute } from '@tanstack/react-router'
import RequireAdmin from '../../../../../utils/adminCheckUtils';
import UserBlocker from '../../../../../components/admin-panel/users-management/$userId/Blocker/UserBlocker';

const adminProtectedUserBlocker = () => (
  <RequireAdmin>
    <UserBlocker />
  </RequireAdmin>
);

export const Route = createFileRoute(
  '/admin-panel/users-management/$userId/blocker/',
)({
  component: adminProtectedUserBlocker,
})
