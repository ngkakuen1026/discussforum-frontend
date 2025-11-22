import { useQuery, useQueries } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { PostType } from "../../types/postTypes";
import authAxios from "../../services/authAxios";
import { categoriesAPI, postsAPI } from "../../services/http-api";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { categoryType } from "../../types/categoryTypes";
import { formatDate } from "../../utils/dateUtils";
import type { VoteType } from "../../types/voteType";
import { useState } from "react";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";

interface PostListProps {
  categoryId: number | null;
}

const PostList = ({ categoryId }: PostListProps) => {
  const [showDate, setShowDate] = useState(true);
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
        return (
          <div
            key={post.id}
            className="p-6 border rounded-lg hover:bg-gray-800 transition bg-gray-900 m-2 flex flex-col md:flex-row gap-6"
          >
            <div className="flex-1 flex flex-col justify-between min-h-32">
              <div className="flex items-center gap-3">
                <img
                  src={getUserAvatar(post)}
                  alt="author"
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />

                <div>
                  <p
                    className={`font-bold ${getUsernameColor(post)} flex items-center gap-2`}
                  >
                    {post.author_username}
                    {post.author_is_admin && (
                      <span className="text-xs bg-yellow-600/80 px-2 py-0.5 rounded-lg">
                        Admin
                      </span>
                    )}
                  </p>
                  <p
                    onClick={() => setShowDate((prev) => !prev)}
                    className="text-sm text-gray-400 cursor-pointer hover:opacity-75"
                    title={showDate ? "Show relative time" : "Show exact date"}
                  >
                    {showDate
                      ? formatDate(post.created_at)
                      : formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                        })}
                  </p>
                </div>
              </div>

              <h3
                className="font-bold text-white text-xl cursor-pointer hover:text-gray-200 transition my-4 py-4"
                onClick={() =>
                  navigate({
                    to: "/posts/$postId",
                    params: { postId: post.id.toString() },
                  })
                }
              >
                {post.title}
              </h3>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-green-400">
                  <ThumbsUp size={16} />
                  <span className="font-medium">{upvotes}</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                  <ThumbsDown size={16} />
                  <span className="font-medium">{downvotes}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-start md:justify-end items-start">
              <button
                onClick={() => handleCategoryClick(post.category_id)}
                className="relative group"
              >
                <span className="text-sm bg-gray-700 text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-full hover:bg-gray-500 transition whitespace-nowrap cursor-pointer">
                  {categoryName}
                </span>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Visit {categoryName}
                </span>
              </button>
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
