import { useQuery, useQueries } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { PostType } from "../../types/postTypes";
import authAxios from "../../services/authAxios";
import { categoriesAPI, commentsAPI, postsAPI } from "../../services/http-api";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, MessageCircle, Eye } from "lucide-react";
import type { categoryType } from "../../types/categoryTypes";
import { formatDate } from "../../utils/dateUtils";
import type { VoteType } from "../../types/voteType";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";
import PostTags from "./PostTags";

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
          <div
            key={post.id}
            className="group relative border-b border-gray-800/80 last:border-b-0
                 hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            {/* hover effect on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-cyan-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-left" />

            <div className="px-4 py-6 mx-auto flex gap-6">
              <div className="flex flex-col items-center gap-3 shrink-0">
                <img
                  src={getUserAvatar(post)}
                  alt={post.author_username}
                  className="w-20 h-20 rounded-full ring-2 ring-gray-800 group-hover:ring-cyan-500/50 transition-all"
                />
                <div className="flex flex-col items-center gap-4 text-xs text-gray-500">
                  <div className="flex flex-row gap-4">
                    <div className="flex items-center gap-1 text-green-400">
                      <ThumbsUp size={16} />
                      <span className="font-medium ">{upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400">
                      <ThumbsDown size={16} />
                      <span className="font-medium">{downvotes}</span>
                    </div>
                  </div>

                  <div className="flex flex-row gap-4">
                    <div className="flex items-center gap-1 text-gray-300">
                      <Eye size={16} />
                      <span className="font-medium ">{post.views}</span>
                    </div>

                    <div className="flex items-center gap-1 text-blue-400">
                      <MessageCircle size={16} />
                      <span className="font-medium ">{commentLength}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="flex-1 min-w-0"
                onClick={() =>
                  navigate({
                    to: "/posts/$postId",
                    params: { postId: post.id.toString() },
                    search: { page: undefined },
                  })
                }
              >
                <div className="flex items-center gap-3 text-sm">
                  <span className={`font-semibold ${getUsernameColor(post)}`}>
                    {post.author_username}
                  </span>
                  {post.author_is_admin && (
                    <span
                      className={`text-xs bg-yellow-600/80 px-2 py-0.5 rounded-lg ${getUsernameColor(post)}`}
                    >
                      Admin
                    </span>
                  )}
                  <span className="text-gray-400">•</span>
                  <time className="text-gray-400 hover:text-gray-300 transition">
                    {formatDate(post.created_at)}
                  </time>
                  <span className="text-gray-400">•</span>
                  <time className="text-gray-400 hover:text-gray-300 transition">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </time>
                </div>

                {/* Tags */}
                <div className="">
                  <PostTags
                    postId={post.id}
                    pendingTagName={post.pending_tag_name}
                  />
                </div>

                {/* Title */}
                <h3 className="mt-4 text-xl font-semibold text-white ">
                  {post.title}
                </h3>
              </div>

              {/* Right: Category Pill */}
              <div className="hidden md:flex items-start">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(post.category_id);
                  }}
                  className="relative group/pill"
                >
                  <span
                    className="px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 
                           border border-cyan-500/30 rounded-full hover:bg-cyan-500/20 
                           transition-all hover:scale-105  cursor-pointer"
                  >
                    {categoryName}
                  </span>
                  <span
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-cyan-300 
                           text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/pill:opacity-100 
                           transition-opacity pointer-events-none whitespace-nowrap border border-gray-800"
                  >
                    Go to {categoryName}
                  </span>
                </button>
              </div>
            </div>
          </div>
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
