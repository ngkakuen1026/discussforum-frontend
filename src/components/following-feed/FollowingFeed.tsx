import {
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { categoriesAPI, commentsAPI } from "../../services/http-api";
import { useInView } from "react-intersection-observer";
import authAxios from "../../services/authAxios";
import { postsAPI } from "../../services/http-api";
import { useEffect } from "react";
import FollowingFeedToolbar from "./FollowingFeedToolbar";
import FollowingFeedPostCard from "./FollowingFeedPostCard";
import { toast } from "sonner";
import type { categoryType } from "../../types/categoryTypes";
import { useAuth } from "../../context/AuthContext";

const FollowingFeed = () => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView({ threshold: 0.1 });
  const { user } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["following-feed"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await authAxios.get(`${postsAPI.url}/following-feed`, {
        params: {
          page: pageParam,
          limit: 15,
        },
      });
      return {
        posts: res.data.posts,
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.posts.length < 15) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
  });

  const refreshFeeds = () => {
    queryClient.refetchQueries({ queryKey: ["my-following-feed"] });
    toast.success(`Following Feeds Refreshed!`);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  // Fetch comments for each post
  const commentResults = useQueries({
    queries: allPosts.map((post) => ({
      queryKey: ["comment-length", post.id],
      queryFn: async () => {
        const res = await authAxios.get(
          `${commentsAPI.url}/${post.id}/all-comments`
        );
        return res.data.comments;
      },
      enabled: allPosts.length > 0,
      staleTime: 1 * 60 * 1000,
    })),
  });

  const { data: categories = [] } = useQuery<categoryType[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await authAxios.get(`${categoriesAPI.url}/all-categories`);
      return res.data.categories;
    },
    staleTime: 10 * 60 * 1000,
  });

  const categoryMap = Object.fromEntries(
    categories.map((cat) => [cat.id, cat.name])
  );

  if (isLoading)
    return <div className="text-center py-20">Loading feed...</div>;
  if (isError)
    return (
      <div className="text-red-500 text-center py-20">Failed to load feed</div>
    );

  return (
    <div className="container mx-auto pt-6 px-4">
      <FollowingFeedToolbar
        refreshPosts={refreshFeeds}
        posts={allPosts}
        user={user}
      />

      <div className="space-y-4 mt-4">
        {allPosts.map((post, index) => {
          const commentLength = (commentResults[index]?.data?.length || 0) + 1;
          const categoryName = categoryMap[post.category_id] || "Uncategorized";

          return (
            <FollowingFeedPostCard
              key={post.id}
              post={post}
              categoryName={categoryName}
              commentLength={commentLength}
            />
          );
        })}
      </div>

      {hasNextPage && (
        <div
          ref={ref}
          className="h-20 flex items-center justify-center text-gray-500"
        >
          {isFetchingNextPage
            ? "Loading more posts..."
            : "Scroll down for more"}
        </div>
      )}

      {!hasNextPage && allPosts.length > 0 && (
        <p className="text-center text-gray-500 py-12">
          You've reached the end
        </p>
      )}

      {allPosts.length === 0 && (
        <p className="text-center text-gray-400 py-20">
          No posts from people you follow yet
        </p>
      )}
    </div>
  );
};

export default FollowingFeed;
