import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/tag/$tagName')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/posts/tag/$tagName"!</div>
}
