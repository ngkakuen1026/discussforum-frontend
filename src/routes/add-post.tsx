import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-post')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/add-post"!</div>
}
