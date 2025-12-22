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
import BrowseHistoryToolbar from "./BrowseHistoryToolbar";
import BrowseHistoryCard from "./BrowseHIstoryCard";

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
      setSelectedPostIds(browsingHistories.map((bookmark) => bookmark.post_id));
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
      <BrowseHistoryToolbar
        selectMode={selectMode}
        selectedPostIds={selectedPostIds}
        browsingHistories={browsingHistories}
        deleteMultipleBrowsingHistoriesMutation={
          deleteMultipleBrowsingHistoriesMutation
        }
        toggleSelectMode={toggleSelectMode}
        selectAll={selectAll}
        deleteSelected={deleteSelected}
        refreshBrowsingHistories={refreshbrowsingHistories}
      />

      {browsingHistories.length ? (
        <div className="space-y-4 mt-4">
          {browsingHistories.map((browsingHistory, index) => {
            const upvotes = Number(browsingHistory.upvotes) || 0;
            const downvotes = Number(browsingHistory.downvotes) || 0;
            const isSelected = selectedPostIds.includes(
              browsingHistory.post_id
            );
            const commentLength =
              (commentResults[index]?.data?.length || 0) + 1;

            return (
              <BrowseHistoryCard
                browseHistory={browsingHistory}
                upvotes={upvotes}
                downvotes={downvotes}
                commentLength={commentLength}
                categoryName={browsingHistory.category_name}
                handleCategoryClick={handleCategoryClick}
                selectMode={selectMode}
                isSelected={isSelected}
                toggleSelection={toggleSelection}
              />
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
