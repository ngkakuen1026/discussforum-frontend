import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import authAxios from "../../services/authAxios";
import { bookmarksAPI, commentsAPI } from "../../services/http-api";
import type { BookmarkType } from "../../types/bookmarkTypes";
import {
  PinOff,
  ListMinus,
  Trash2,
  Pin,
  RefreshCcw,
  X,
  MousePointer,
} from "lucide-react";
import PostCard from "../posts/PostListCard";
import type { PostType } from "../../types/postTypes";
import { toast } from "sonner";
import { useState } from "react";
import type { CommentType } from "../../types/commentTypes";

// Convert BookmarkType to PostType (for display only)
function bookmarkToPostType(bookmark: BookmarkType): PostType {
  return {
    id: bookmark.post_id,
    user_id: 0,
    title: bookmark.post_title,
    content: "",
    created_at: bookmark.post_created_at,
    category_id: bookmark.category_id,
    pending_tag_name: null,
    views: bookmark.post_view,
    author_id: 0,
    author_username: bookmark.author_username,
    author_profile_image: bookmark.author_profile_image,
    author_is_admin: bookmark.author_is_admin,
    author_registration_date: bookmark.author_registration_date,
    author_gender: bookmark.author_gender,
  };
}

const PinnedPost = () => {
  const queryClient = useQueryClient();
  const {
    data: bookmarks = [],
    isLoading,
    isFetching,
  } = useQuery<BookmarkType[]>({
    queryKey: ["my-bookmarks"],
    queryFn: async () => {
      const res = await authAxios.get(`${bookmarksAPI.url}/bookmark/me`);
      return res.data.bookmarks;
    },
    staleTime: 5 * 60 * 1000,
  });

  const commentResults = useQueries({
    queries: bookmarks.map((bookmark: BookmarkType) => ({
      queryKey: ["comment-length", bookmark.post_id],
      queryFn: async (): Promise<CommentType[]> => {
        const res = await authAxios.get(
          `${commentsAPI.url}/${bookmark.post_id}/all-comments`
        );
        return res.data.comments;
      },
      enabled: bookmarks.length > 0,
      staleTime: 1 * 60 * 1000,
    })),
  });
  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);

  const unpinMutation = useMutation({
    mutationFn: (postId: number) =>
      authAxios.delete(`${bookmarksAPI.url}/bookmark/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      toast.success("Post unpinned");
    },
    onError: () => toast.error("Failed to unpin"),
  });

  const unpinMultiplePinsMutation = useMutation({
    mutationFn: (postIds: number[]) =>
      authAxios.delete(`${bookmarksAPI.url}/bookmark/multiple`, {
        data: { postIds },
      }),
    onSuccess: (_, postIds) => {
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      setSelectedPostIds([]);
      setSelectMode(false);
      toast.success(
        `${postIds.length} ${postIds.length > 1 ? "posts" : "post"} unpinned`
      );
    },
    onError: () => toast.error("Failed to delete selected posts"),
  });

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedPostIds([]);
  };

  const toggleSelection = (postId: number) => {
    setSelectedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const selectAll = () => {
    if (selectedPostIds.length === bookmarks.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(bookmarks.map((b) => b.post_id));
    }
  };

  const refreshBookmarks = () => {
    queryClient.refetchQueries({ queryKey: ["my-bookmarks"] });
    toast.success(`Pinned Post Refreshed!`);
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate({
      to: "/",
      search: { categoryId },
      replace: false,
    });
  };

  const deleteSelected = () => {
    if (selectedPostIds.length === 0) return;

    const confirmed = window.confirm(
      `Remove ${selectedPostIds.length} pinned ${selectedPostIds.length > 1 ? "posts" : "post"}?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      unpinMultiplePinsMutation.mutate(selectedPostIds);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto pt-6">
        <div className="animate-pulse text-white text-2xl">
          Loading pinned posts...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-6">
      <div className="">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-white text-2xl font-bold">My Pinned Posts</h1>
          {selectMode ? (
            <div className="flex gap-2 ">
              <button
                onClick={selectAll}
                disabled={unpinMultiplePinsMutation.isPending}
                className="relative group transition-all"
              >
                <MousePointer
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  {selectedPostIds.length === bookmarks.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </button>

              <button
                onClick={deleteSelected}
                disabled={
                  unpinMultiplePinsMutation.isPending ||
                  selectedPostIds.length === 0
                }
                className="relative group transition-all"
              >
                <Trash2
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Delete ({selectedPostIds.length})
                </span>
              </button>
              <button
                onClick={toggleSelectMode}
                className="relative group transition-all"
              >
                <X
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Cancel
                </span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2 ">
              <button
                onClick={toggleSelectMode}
                className="relative group transition-all"
              >
                <ListMinus
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Select multiple to delete
                </span>
              </button>
              <button
                onClick={refreshBookmarks}
                className="relative group transition-all"
              >
                <RefreshCcw
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Refresh
                </span>
              </button>
            </div>
          )}
        </div>
        <div>
          <h2 className={`text-gray-400 mt-2`}>
            {selectMode
              ? `${selectedPostIds.length} pinned ${selectedPostIds.length > 1 ? "posts" : "post"} selected`
              : "The post pinned"}
          </h2>
        </div>
      </div>

      {bookmarks.length ? (
        <div className="space-y-4 mt-4">
          {bookmarks.map((bookmark, index) => {
            const upvotes = Number(bookmark.upvotes) || 0;
            const downvotes = Number(bookmark.downvotes) || 0;
            const isSelected = selectedPostIds.includes(bookmark.post_id);
            const post: PostType = bookmarkToPostType(bookmark);

            const commentLength =
              (commentResults[index]?.data?.length || 0) + 1;
            return (
              <div
                key={bookmark.post_id}
                className={`relative ${isSelected ? "ring-2 ring-gray-500 ring-opacity-50 bg-gray-850" : ""}`}
              >
                {selectMode && (
                  <div className="absolute left-2 top-2 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(bookmark.post_id)}
                      className="w-5 h-5 text-gray-500 rounded border-gray-600 focus:ring-gray-400 focus:ring-2"
                    />
                  </div>
                )}
                <PostCard
                  post={post}
                  upvotes={upvotes}
                  downvotes={downvotes}
                  commentLength={commentLength}
                  categoryName={bookmark.category_name}
                  handleCategoryClick={handleCategoryClick}
                  rightAction={
                    !selectMode && (
                      <button
                        onClick={() => unpinMutation.mutate(bookmark.post_id)}
                        disabled={unpinMutation.isPending}
                        className="flex items-end gap-2 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-900/20 px-3 py-2 cursor-pointer rounded-lg transition text-sm font-medium"
                        title="Unpin this post"
                      >
                        <PinOff size={18} />
                        Unpin
                      </button>
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No pinned posts yet.</p>
          <p className="text-gray-500 mt-4">
            Go{" "}
            <Link
              to="/"
              search={{ categoryId: 0 }}
              replace={true}
              className="hover:underline text-white"
              target="_blank"
            >
              explore
            </Link>{" "}
            and click the <Pin size={18} className="inline text-yellow-500" />{" "}
            pin icon to save posts!
          </p>
        </div>
      )}
    </div>
  );
};

export default PinnedPost;
