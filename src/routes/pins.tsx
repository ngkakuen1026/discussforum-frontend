import { createFileRoute } from '@tanstack/react-router'
import PinnedPost from '../components/pins/PinnedPost'

export const Route = createFileRoute('/pins')({
  component: PinnedPost
})

