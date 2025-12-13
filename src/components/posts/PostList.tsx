import { useQuery, useQueries } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { PostType } from "../../types/postTypes";
import authAxios from "../../services/authAxios";
import { categoriesAPI, commentsAPI, postsAPI } from "../../services/http-api";
import PostCard from "./PostCard";
import type { categoryType } from "../../types/categoryTypes";
import type { VoteType } from "../../types/voteType";

interface PostListProps {
  categoryId: number | null;
}

const PostList = ({ categoryId }: PostListProps) => {
  const navigate = useNavigate();

  const queryKey = categoryId
    ? ["posts-by-category", categoryId]
    : ["all-posts"];
  const url = categoryId
    ? `${postsAPI.url}/all-posts/category/${categoryId}`
    : `${postsAPI.url}/all-posts`;

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<PostType[]>({
    queryKey,
    queryFn: async () => {
      const res = await authAxios.get(url);
      return res.data.posts;
    },
    staleTime: 2 * 60 * 1000,
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

  const voteQueries =
    posts?.map((post) => ({
      queryKey: ["post-votes", post.id],
      queryFn: async (): Promise<VoteType[]> => {
        const res = await authAxios.get(`${postsAPI.url}/votes/${post.id}`);
        return res.data.votes;
      },
      enabled: !!posts,
      staleTime: 1 * 60 * 1000,
    })) || [];

  const voteResults = useQueries({ queries: voteQueries });

  const commentQueries =
    posts?.map((post) => ({
      queryKey: ["comment-length", post.id],
      queryFn: async () => {
        const res = await authAxios.get(
          `${commentsAPI.url}/${post.id}/all-comments`
        );
        return res.data.comments;
      },
      enabled: !!posts,
      staleTime: 1 * 60 * 1000,
    })) || [];

  const commentResults = useQueries({ queries: commentQueries });

  const handleCategoryClick = (categoryId: number) => {
    navigate({
      to: "/",
      search: { categoryId },
      replace: false,
    });
  };

  if (isLoading)
    return <div className="animate-pulse text-white">Loading posts...</div>;
  if (error) return <div className="text-red-500">Failed to load posts</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col justify-between p-7 border-b border-gray-700">
        <h2 className="text-white text-2xl font-bold mb-2">
          {categoryId ? `Posts in ${categoryMap[categoryId]} ` : `All Post`}
        </h2>
      </div>

      {posts?.map((post, index) => {
        const votes = voteResults[index]?.data || [];
        const upvotes = votes.find((v) => v.vote_type === 1)?.count || "0";
        const downvotes = votes.find((v) => v.vote_type === -1)?.count || "0";
        const categoryName = categoryMap[post.category_id] || "Uncategorized";
        const commentLength = (commentResults[index]?.data?.length || 0) + 1;

        return (
          <PostCard
            key={post.id}
            post={post}
            upvotes={upvotes}
            downvotes={downvotes}
            commentLength={commentLength}
            categoryName={categoryName}
            handleCategoryClick={handleCategoryClick}
          />
        );
      })}

      {posts?.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-400 text-lg">
            No posts in this category yet.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Be the{" "}
            <Link to="/add-post" className="text-white hover:underline">
              first
            </Link>{" "}
            to post in this category!
          </p>
        </div>
      )}
    </div>
  );
};

export default PostList;
