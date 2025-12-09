import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-panel/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin-panel/dashboard"!</div>
}
