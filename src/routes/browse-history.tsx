import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/browse-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/browse-history"!</div>
}
