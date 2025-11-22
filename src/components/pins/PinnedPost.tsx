import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import authAxios from "../../services/authAxios";
import { bookmarksAPI } from "../../services/http-api";
import type { BookmarkType } from "../../types/bookmarkTypes";
import { formatDistanceToNow } from "date-fns";
import {
  ThumbsUp,
  ThumbsDown,
  PinOff,
  ListMinus,
  Trash2,
  Pin,
  RefreshCcw,
  X,
  MousePointer,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "../../utils/dateUtils";
import { useState } from "react";

const PinnedPost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showDate, setShowDate] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);

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
        `${postIds.length} post${postIds.length > 1 ? "s" : ""} unpinned`
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
      `Remove ${selectedPostIds.length} pinned post${selectedPostIds.length > 1 ? "s" : ""}?\n\nThis action cannot be undone.`
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
              ? `${selectedPostIds.length} pinned post selected`
              : "The post pinned"}
          </h2>
        </div>
      </div>

      {bookmarks.length ? (
        <div className="space-y-4 mt-4">
          {bookmarks.map((bookmark) => {
            const upvotes = Number(bookmark.upvotes) || 0;
            const downvotes = Number(bookmark.downvotes) || 0;
            const isSelected = selectedPostIds.includes(bookmark.post_id);

            const getUsernameColor = () => {
              if (bookmark.author_is_admin) {
                return "text-yellow-300";
              }
              switch (bookmark.author_gender) {
                case "Male":
                  return "text-blue-400";
                case "Female":
                  return "text-pink-400";
                case "Prefer Not to Say":
                default:
                  return "text-gray-300";
              }
            };

            return (
              <div
                key={bookmark.post_id}
                className={`p-6 border rounded-xl hover:bg-gray-800 transition-all bg-gray-900 flex flex-col md:flex-row gap-6 group ${
                  isSelected
                    ? "ring-2 ring-gray-500 ring-opacity-50 bg-gray-850"
                    : ""
                }`}
              >
                {/* Checkbox - Left Side */}
                {selectMode && (
                  <div className="shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(bookmark.post_id)}
                      className="w-5 h-5 text-gray-500 rounded border-gray-600 focus:ring-gray-400 focus:ring-2"
                    />
                  </div>
                )}

                {/* Left: Author + Info */}
                <div
                  className={`flex-1 flex flex-col justify-between ${selectMode ? "pl-2" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        bookmark.author_profile_image ||
                        "../src/assets/Images/default_user_icon.png"
                      }
                      alt="author"
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />

                    <div>
                      <p
                        className={`font-bold ${getUsernameColor()} flex items-center gap-2`}
                      >
                        {bookmark.author_username}
                        {bookmark.author_is_admin && (
                          <span className="text-xs bg-yellow-600/80 px-2 py-0.5 rounded-lg">
                            Admin
                          </span>
                        )}
                      </p>
                      <p
                        onClick={() => setShowDate((prev) => !prev)}
                        className="text-sm text-gray-400 cursor-pointer hover:opacity-75"
                        title={
                          showDate ? "Show relative time" : "Show exact date"
                        }
                      >
                        {showDate
                          ? formatDate(bookmark.post_created_at)
                          : formatDistanceToNow(
                              new Date(bookmark.post_created_at),
                              {
                                addSuffix: true,
                              }
                            )}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-bold my-6 text-white text-xl cursor-pointer hover:text-gray-200 transition"
                    onClick={() =>
                      navigate({
                        to: "/posts/$postId",
                        params: { postId: bookmark.post_id.toString() },
                      })
                    }
                  >
                    {bookmark.post_title}
                  </h3>

                  {/* Votes */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5 text-green-400">
                      <ThumbsUp size={18} />
                      <span className="font-medium">{upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400">
                      <ThumbsDown size={18} />
                      <span className="font-medium">{downvotes}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Category + Unpin */}
                <div className="flex flex-col justify-between items-start md:items-end gap-4">
                  <div className="flex justify-start md:justify-end items-start">
                    <button
                      onClick={() => handleCategoryClick(bookmark.category_id)}
                      className="relative group"
                    >
                      <span className="text-sm bg-gray-700 text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-full hover:bg-gray-500 transition whitespace-nowrap cursor-pointer">
                        {bookmark.category_name}
                      </span>
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                        Visit {bookmark.category_name}
                      </span>
                    </button>
                  </div>

                  {!selectMode && (
                    <button
                      onClick={() => unpinMutation.mutate(bookmark.post_id)}
                      disabled={unpinMutation.isPending}
                      className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-900/20 px-3 py-2 cursor-pointer rounded-lg transition text-sm font-medium"
                      title="Unpin this post"
                    >
                      <PinOff size={18} />
                      Unpin
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No pinned posts yet.</p>
          <p className="text-gray-500 mt-4">
            Go{" "}
            <Link to="/" search={{ categoryId: 0 }} replace={true}>
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
