import { createFileRoute } from "@tanstack/react-router";
import PostDetail from "../../components/posts/PostDetail";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetail 
});