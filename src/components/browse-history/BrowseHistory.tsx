import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { BrowseHistoryType } from "../../types/browseHistoryTypes";
import authAxios from "../../services/authAxios";
import { browsingHistoryAPI, commentsAPI } from "../../services/http-api";
import type { CommentType } from "../../types/commentTypes";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ListMinus, MousePointer, RefreshCcw, Trash2, X } from "lucide-react";
import type { PostType } from "../../types/postTypes";
import PostCard from "../posts/PostListCard";

function browsingHistoryToPostType(
  browsingHistory: BrowseHistoryType
): PostType {
  return {
    id: browsingHistory.post_id,
    user_id: 0,
    title: browsingHistory.post_title,
    content: "",
    created_at: browsingHistory.post_created_at,
    category_id: browsingHistory.category_id,
    pending_tag_name: null,
    views: browsingHistory.post_view,
    author_id: 0,
    author_username: browsingHistory.author_username,
    author_profile_image: browsingHistory.author_profile_image,
    author_is_admin: browsingHistory.author_is_admin,
    author_registration_date: browsingHistory.author_registration_date,
    author_gender: browsingHistory.author_gender,
  };
}

const BrowseHistory = () => {
  const queryClient = useQueryClient();
  const {
    data: browsingHistories = [],
    isLoading,
    isFetching,
  } = useQuery<BrowseHistoryType[]>({
    queryKey: ["my-browsingHistories"],
    queryFn: async () => {
      const res = await authAxios.get(
        `${browsingHistoryAPI.url}/browsing-history/me`
      );
      return res.data.browsingHistories;
    },
    staleTime: 5 * 60 * 1000,
  });

  const commentResults = useQueries({
    queries: browsingHistories.map((browsingHistory: BrowseHistoryType) => ({
      queryKey: ["comment-length", browsingHistory.post_id],
      queryFn: async (): Promise<CommentType[]> => {
        const res = await authAxios.get(
          `${commentsAPI.url}/${browsingHistory.post_id}/all-comments`
        );
        return res.data.comments;
      },
      enabled: browsingHistories.length > 0,
      staleTime: 1 * 60 * 1000,
    })),
  });
  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);

  const deleteMultipleBrowsingHistoriesMutation = useMutation({
    mutationFn: (postIds: number[]) =>
      authAxios.delete(`${browsingHistoryAPI.url}/browsing-history/me`, {
        data: { postIds },
      }),
    onSuccess: (_, postIds) => {
      queryClient.invalidateQueries({ queryKey: ["my-browsingHistories"] });
      setSelectedPostIds([]);
      setSelectMode(false);
      toast.success(
        `${postIds.length} ${postIds.length > 1 ? "browsing history records" : "browsing history record"} deleted`
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
    if (selectedPostIds.length === browsingHistories.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(browsingHistories.map((b) => b.post_id));
    }
  };

  const refreshbrowsingHistories = () => {
    queryClient.refetchQueries({ queryKey: ["my-browsingHistories"] });
    toast.success(`Browsing History Refreshed!`);
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
      `Remove ${selectedPostIds.length} ${selectedPostIds.length > 1 ? "browsing history records" : "browsing history record"}?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      deleteMultipleBrowsingHistoriesMutation.mutate(selectedPostIds);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto pt-6">
        <div className="animate-pulse text-white text-2xl">
          Loading browsing history...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-6">
      <div className="">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-white text-2xl font-bold">My Browsing History</h1>
          {selectMode ? (
            <div className="flex gap-2 ">
              <button
                onClick={selectAll}
                disabled={deleteMultipleBrowsingHistoriesMutation.isPending}
                className="relative group transition-all"
              >
                <MousePointer
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  {selectedPostIds.length === browsingHistories.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </button>

              <button
                onClick={deleteSelected}
                disabled={
                  deleteMultipleBrowsingHistoriesMutation.isPending ||
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
                onClick={refreshbrowsingHistories}
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
              ? `${selectedPostIds.length} ${selectedPostIds.length > 1 ? "browsing history records" : "browsing history record"} selected`
              : "The post visited"}
          </h2>
        </div>
      </div>

      {browsingHistories.length ? (
        <div className="space-y-4 mt-4">
          {browsingHistories.map((browsingHistory, index) => {
            const upvotes = Number(browsingHistory.upvotes) || 0;
            const downvotes = Number(browsingHistory.downvotes) || 0;
            const isSelected = selectedPostIds.includes(
              browsingHistory.post_id
            );
            const post: PostType = browsingHistoryToPostType(browsingHistory);

            const commentLength =
              (commentResults[index]?.data?.length || 0) + 1;
            return (
              <div
                key={browsingHistory.post_id}
                className={`relative ${isSelected ? "ring-2 ring-gray-500 ring-opacity-50 bg-gray-850" : ""}`}
              >
                {selectMode && (
                  <div className="absolute left-2 top-2 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(browsingHistory.post_id)}
                      className="w-5 h-5 text-gray-500 rounded border-gray-600 focus:ring-gray-400 focus:ring-2"
                    />
                  </div>
                )}
                <PostCard
                  post={post}
                  upvotes={upvotes}
                  downvotes={downvotes}
                  commentLength={commentLength}
                  categoryName={browsingHistory.category_name}
                  handleCategoryClick={handleCategoryClick}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">
            No browsing history record found.
          </p>
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
            the forum now!
          </p>
        </div>
      )}
    </div>
  );
};

export default BrowseHistory;
