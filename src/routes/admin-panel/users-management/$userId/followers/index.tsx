import { createFileRoute } from '@tanstack/react-router'
import RequireAdmin from '../../../../../utils/adminCheckUtils'
import UserFollower from '../../../../../components/admin-panel/users-management/$userId/Followers/UserFollower'

const adminProtectedUserFollowers = () => (
  <RequireAdmin>
    <UserFollower />
  </RequireAdmin>
)

export const Route = createFileRoute(
  '/admin-panel/users-management/$userId/followers/',
)({
  component: adminProtectedUserFollowers,
})

