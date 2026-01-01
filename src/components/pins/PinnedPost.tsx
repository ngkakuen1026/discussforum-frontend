import {
  useQuery,
  useQueryClient,
  useQueries,
  useMutation,
} from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import authAxios from "../../services/authAxios";
import { bookmarksAPI, commentsAPI } from "../../services/http-api";
import type { BookmarkType } from "../../types/bookmarkTypes";
import { Pin } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { CommentType } from "../../types/commentTypes";
import PinnedPostCard from "./PinnedPostCard";
import PinnedPostToolbar from "./PinnedPostToolbar";
import { useBookmark } from "../../context/BookmarkContext";

const PinnedPost = () => {
  const queryClient = useQueryClient();
  const { toggleBookmark, isPending: isBookmarkPending } = useBookmark();
  const navigate = useNavigate();

  const {
    data: bookmarks = [],
    isLoading,
    isFetching,
  } = useQuery<BookmarkType[]>({
    queryKey: ["my-bookmarks-full"],
    queryFn: async () => {
      const res = await authAxios.get(`${bookmarksAPI.url}/bookmark/me`);
      return res.data.bookmarks;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const validBookmarks = bookmarks.filter(
    (bookmark) =>
      typeof bookmark.post_id === "number" && !isNaN(bookmark.post_id)
  );
  const commentResults = useQueries({
    queries: validBookmarks.map((bookmark: BookmarkType) => ({
      queryKey: ["comment-length", bookmark.post_id],
      queryFn: async (): Promise<CommentType[]> => {
        const res = await authAxios.get(
          `${commentsAPI.url}/${bookmark.post_id}/all-comments`
        );
        return res.data.comments;
      },
      enabled: validBookmarks.length > 0,
      staleTime: 1 * 60 * 1000,
    })),
  });

  const [selectMode, setSelectMode] = useState(false);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);

  const unpinMultiplePinsMutation = useMutation({
    mutationFn: (postIds: number[]) =>
      authAxios.delete(`${bookmarksAPI.url}/bookmark/multiple`, {
        data: { postIds },
      }),
    onSuccess: (_data: unknown, postIds: number[]) => {
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks-full"] });
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
    queryClient.refetchQueries({ queryKey: ["my-bookmarks-full"] });
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
      <PinnedPostToolbar
        selectMode={selectMode}
        selectedPostIds={selectedPostIds}
        bookmarks={bookmarks}
        unpinMultiplePinsMutation={unpinMultiplePinsMutation}
        toggleSelectMode={toggleSelectMode}
        selectAll={selectAll}
        deleteSelected={deleteSelected}
        refreshBookmarks={refreshBookmarks}
      />

      {validBookmarks.length ? (
        <div className="space-y-4 mt-4">
          {validBookmarks.map((bookmark, index) => {
            const upvotes = Number(bookmark.upvotes) || 0;
            const downvotes = Number(bookmark.downvotes) || 0;
            const isSelected = selectedPostIds.includes(bookmark.post_id);
            const commentLength =
              (commentResults[index]?.data?.length || 0) + 1;
            return (
              <div
                key={bookmark.post_id}
                className={`relative ${isSelected ? "ring-2 ring-gray-500 ring-opacity-50 bg-gray-850" : ""}`}
              >
                <PinnedPostCard
                  bookmark={bookmark}
                  upvotes={upvotes}
                  downvotes={downvotes}
                  commentLength={commentLength}
                  categoryName={bookmark.category_name}
                  handleCategoryClick={handleCategoryClick}
                  onUnpin={() => toggleBookmark(bookmark.post_id)}
                  isPending={isBookmarkPending}
                  selectMode={selectMode}
                  isSelected={isSelected}
                  toggleSelection={toggleSelection}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No pinned posts yet. </p>
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
