// routes/index.tsx
import { createFileRoute, useSearch } from "@tanstack/react-router";
import PostList from "../components/posts/PostList";
import CategoryList from "../components/posts/CategoryList";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    const id = search.categoryId;
    return {
      categoryId: id !== undefined ? Number(id) : 0,
    };
  },
  component: Index,
});

function Index() {
  const { categoryId } = useSearch({ from: Route.id });

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div className="md:col-span-1 border-r border-gray-700 min-h-[500px]">
        <CategoryList selectedCategoryId={categoryId} />
      </div>

      <div className="md:col-span-5 min-h-[500px]">
        <PostList categoryId={categoryId} />
      </div>
    </div>
  );
}