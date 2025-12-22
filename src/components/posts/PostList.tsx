import { useQuery, useQueries } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import authAxios from "../../services/authAxios";
import { categoriesAPI, commentsAPI, postsAPI } from "../../services/http-api";
import PostListCard from "./PostListCard";
import type { PostType } from "../../types/postTypes";
import type { categoryType } from "../../types/categoryTypes";
import type { VoteType } from "../../types/voteType";
import type { PostRouteSearch } from "../../types/routeTypes";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const PostList = ({ categoryId }: { categoryId: number | null }) => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" }) as PostRouteSearch;
  const currentPage = Number(search.page) || 1;
  const POSTS_PER_PAGE = 15;
  const [inputPage, setInputPage] = useState(currentPage.toString());
  const searchQuery = search.query || "";

  const queryKey = searchQuery
    ? ["search-post", searchQuery]
    : categoryId
      ? ["posts-by-category", categoryId]
      : ["all-posts"];
  const url = searchQuery
    ? `${postsAPI.url}/search?query=${searchQuery}`
    : categoryId
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

  const totalPosts = posts?.length || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const paginatedPosts =
    posts?.slice(
      (currentPage - 1) * POSTS_PER_PAGE,
      currentPage * POSTS_PER_PAGE
    ) || [];

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    navigate({
      to: "/",
      search: (prev) => ({
        ...prev,
        categoryId: categoryId || 0,
        page: page === 1 ? undefined : page,
      }),
      replace: false,
    });
    setInputPage(page.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  if (isLoading)
    return <div className="animate-pulse text-white">Loading posts...</div>;
  if (error) return <div className="text-red-500">Failed to load posts</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-7 border-b border-gray-700 gap-4">
        <h2 className="text-white text-2xl font-bold mb-2">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : categoryId
              ? `Posts in ${categoryMap[categoryId] || "Loading..."}`
              : "All Posts"}{" "}
        </h2>

        <div className="flex gap-2 items-center">
          {totalPages > 9 && (
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2.5 flex items-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
            >
              First Page
            </button>
          )}

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2.5 flex items-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
          >
            <ArrowLeft size={12} /> Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(9, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 9 && currentPage > 5) {
                pageNum = Math.max(currentPage - 4, 1) + i;
                if (pageNum > totalPages) return null;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-cyan-600 text-white shadow-lg"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }).filter(Boolean)}

            {totalPages > 9 && currentPage < totalPages - 4 && (
              <>
                <span className="text-gray-500 px-2">...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 text-sm font-medium"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2.5 flex items-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
          >
            Next <ArrowRight size={12} />
          </button>

          {totalPages > 9 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === 1}
              className="px-4 py-2.5 flex items-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
            >
              Last Page
            </button>
          )}

          <div className="">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputPage}
              onChange={(e) =>
                setInputPage(e.target.value.replace(/[^\d]/g, ""))
              }
              onBlur={() => {
                const pageNum = Number(inputPage);
                if (
                  inputPage &&
                  pageNum >= 1 &&
                  pageNum <= totalPages &&
                  pageNum !== currentPage
                ) {
                  handlePageChange(pageNum);
                } else {
                  setInputPage(currentPage.toString());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const pageNum = Number(inputPage);
                  if (
                    inputPage &&
                    pageNum >= 1 &&
                    pageNum <= totalPages &&
                    pageNum !== currentPage
                  ) {
                    handlePageChange(pageNum);
                  } else {
                    setInputPage(currentPage.toString());
                  }
                }
              }}
              className="w-16 px-2 py-1 rounded border border-gray-600 bg-gray-900 text-center text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Go to page"
            />
            <span className="ml-1 text-gray-400 text-sm"></span>
          </div>
        </div>
      </div>

      {paginatedPosts.map((post, index) => {
        const votes =
          voteResults[(currentPage - 1) * POSTS_PER_PAGE + index]?.data || [];
        const upvotes = votes.find((v) => v.vote_type === 1)?.count || 0;
        const downvotes = votes.find((v) => v.vote_type === -1)?.count || 0;
        const categoryName = categoryMap[post.category_id] || "Uncategorized";
        const commentLength =
          (commentResults[(currentPage - 1) * POSTS_PER_PAGE + index]?.data
            ?.length || 0) + 1;

        return (
          <PostListCard
            key={post.id}
            post={post}
            upvotes={upvotes}
            downvotes={downvotes}
            commentLength={commentLength}
            categoryName={categoryName}
            handleCategoryClick={handleCategoryClick}
            showTags={true}
          />
        );
      })}

      {posts?.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-400 text-lg">
            {searchQuery
              ? `No post found with search query "${searchQuery}"`
              : "No posts in this category yet."}
          </p>
          {!searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Be the{" "}
              <Link to="/add-post" className="text-white hover:underline">
                first
              </Link>{" "}
              to post in this category!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostList;
