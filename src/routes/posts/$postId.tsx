import { createFileRoute } from "@tanstack/react-router";
import PostDetail from "../../components/posts/PostDetail/PostDetail";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetail,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: search.page ? Number(search.page) : undefined,
    }
  }
});
