import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/publicProfile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/publicProfile"!</div>
}
