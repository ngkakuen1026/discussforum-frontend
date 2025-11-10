import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/userFollowing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/userFollowing"!</div>
}
