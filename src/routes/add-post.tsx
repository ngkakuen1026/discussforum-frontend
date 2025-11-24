import { createFileRoute } from '@tanstack/react-router'
import AddPost from '../components/add-post/AddPost'

export const Route = createFileRoute('/add-post')({
  component: AddPost
})
