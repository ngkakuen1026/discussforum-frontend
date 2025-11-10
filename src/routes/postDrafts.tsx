import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/postDrafts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/postDrafts"!</div>
}
