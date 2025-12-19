import { createFileRoute } from '@tanstack/react-router'
import blockedUserList from '../components/posts/blockedUserList/blockedUserList'

export const Route = createFileRoute('/blocked-user-list')({
  component: blockedUserList
})

