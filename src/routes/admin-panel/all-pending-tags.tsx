import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-panel/all-pending-tags')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin-panel/all-pending-tags"!</div>
}
