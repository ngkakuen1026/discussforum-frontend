import { useParams } from '@tanstack/react-router';

const UserDetail = () => {
  const { userId } = useParams({ from: "/admin-panel/users-management/$userId" });

  return (
    <div>
      User detail for user id: {userId}
      Username: {}
    </div>
  )
}

export default UserDetail
