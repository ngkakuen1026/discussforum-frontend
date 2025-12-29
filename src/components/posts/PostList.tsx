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
import PostListPagination from "./PostListPagination";

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

        <PostListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          inputPage={inputPage}
          setInputPage={setInputPage}
        />
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
