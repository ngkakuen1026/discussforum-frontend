import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/post-drafts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/post-drafts"!</div>
}
