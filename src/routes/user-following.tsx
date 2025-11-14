import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user-following')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user-following"!</div>
}
