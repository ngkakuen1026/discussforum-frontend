import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/noti')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/noti"!</div>
}
