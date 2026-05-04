import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-panel/')({
  loader: () => {
    throw redirect({
      to: '/admin-panel/dashboard',
      replace: true,
    });
  },
})

