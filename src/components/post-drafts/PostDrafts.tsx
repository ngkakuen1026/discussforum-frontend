// src/routes/post-drafts.tsx
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../services/authAxios";
import { formatDistanceToNow } from "date-fns";
import { postDraftsAPI, categoriesAPI } from "../../services/http-api";
import type { PostDraftType } from "../../types/postTypes";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  CirclePlus,
  Edit,
  ListMinus,
  MousePointer,
  RefreshCcw,
  Trash2,
  X,
} from "lucide-react";
import type { categoryType } from "../../types/categoryTypes";

const PostDrafts = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedDraftIds, setSelectedDraftIds] = useState<number[]>([]);

  const {
    data: drafts = [],
    isLoading,
    isFetching,
  } = useQuery<PostDraftType[]>({
    queryKey: ["post-drafts"],
    queryFn: async () => {
      const res = await authAxios.get(`${postDraftsAPI.url}/post-drafts/me`);
      return res.data.drafts;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await authAxios.get(`${categoriesAPI.url}/all-categories`);
      return res.data.categories;
    },
    staleTime: 10 * 60 * 1000,
  });

  // Map categoryId to category name
  const getCategoryName = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat: categoryType) => {
      map.set(cat.id, cat.name);
    });
    return (id: number) => map.get(id) || `ID ${id}`;
  }, [categories]);

  const deleteMultiplePostDraftsMutation = useMutation({
    mutationFn: (draftIds: number[]) =>
      authAxios.delete(`${postDraftsAPI.url}/post-drafts/me`, {
        data: { draftIds },
      }),
    onSuccess: (_, draftsIds) => {
      queryClient.invalidateQueries({ queryKey: ["post-drafts"] });
      setSelectedDraftIds([]);
      setSelectMode(false);
      toast.success(
        `${draftsIds.length} ${draftsIds.length > 1 ? "post drafts" : "post draft"} deleted`
      );
    },
    onError: () =>
      toast.error(
        `Failed to delete selected ${selectedDraftIds.length > 1 ? "post drafts" : "post draft"}`
      ),
  });

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedDraftIds([]);
  };

  const toggleSelection = (draftId: number) => {
    setSelectedDraftIds((prev) =>
      prev.includes(draftId)
        ? prev.filter((id) => id !== draftId)
        : [...prev, draftId]
    );
  };

  const selectAll = () => {
    if (selectedDraftIds.length === drafts.length) {
      setSelectedDraftIds([]);
    } else {
      setSelectedDraftIds(drafts.map((d) => d.id));
    }
  };

  const refreshPostDrafts = () => {
    queryClient.refetchQueries({ queryKey: ["post-drafts"] });
    toast.success(`Post Drafts Refreshed!`);
  };

  const deleteSelected = () => {
    if (selectedDraftIds.length === 0) return;

    const confirmed = window.confirm(
      `Remove ${selectedDraftIds.length} ${selectedDraftIds.length > 1 ? "post drafts" : "post draft"}?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      deleteMultiplePostDraftsMutation.mutate(selectedDraftIds);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-6">
      <div className="">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-white text-2xl font-bold">
            Your draft ({drafts.length}/10)
          </h1>
          {selectMode ? (
            <div className="flex gap-2 ">
              <button
                onClick={selectAll}
                disabled={deleteMultiplePostDraftsMutation.isPending}
                className="relative group transition-all"
              >
                <MousePointer
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  {selectedDraftIds.length === drafts.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </button>

              <button
                onClick={deleteSelected}
                disabled={
                  deleteMultiplePostDraftsMutation.isPending ||
                  selectedDraftIds.length === 0
                }
                className="relative group transition-all"
              >
                <Trash2
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Delete ({selectedDraftIds.length})
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
                onClick={refreshPostDrafts}
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
              ? `${selectedDraftIds.length} ${selectedDraftIds.length > 1 ? "post drafts" : "post draft"} selected`
              : "The post drafts saved, you can only save up 10 drafts"}
          </h2>
        </div>
      </div>

      {drafts.length ? (
        <div className="space-y-4 mt-4">
          {drafts.map((draft: PostDraftType) => {
            const isSelected = selectedDraftIds.includes(draft.id);
            return (
              <div
                key={draft.id}
                className={`relative flex justify-between p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-500 transition ${isSelected ? "ring-2 ring-cyan-500" : ""}`}
              >
                <div className="flex gap-4 items-center">
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(draft.id)}
                      className="w-5 h-5 text-gray-500 rounded border-gray-600 focus:ring-gray-400 focus:ring-2"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {draft.title || "Untitled Draft"}
                    </h3>
                    {/* Category name */}
                    <div className="flex flex-row mt-2 text-sm gap-2 text-gray-400">
                      <p className="text-sm ">
                        {draft.categoryId
                          ? getCategoryName(Number(draft.categoryId))
                          : "No Categroy Selected"}
                      </p>
                      <span className="">•</span>
                      <p className="text-sm  ">
                        Edited{" "}
                        <span className="text-gray-200">
                          {formatDistanceToNow(new Date(draft.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex text-white items-center justify-between gap-4">
                  <button
                    onClick={() =>
                      navigate({
                        to: "/add-post",
                        search: { draftId: draft.id },
                      })
                    }
                    className="relative group transition-all"
                  >
                    <Edit
                      size={18}
                      className="text-gray-400 hover:opacity-75 cursor-pointer"
                    />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                      Edit selected draft
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No draft yet.</p>
          <p className="text-gray-500 mt-4 ">
            Go to{" "}
            <Link
              to="/add-post"
              className="text-gray-200 hover:opacity-75"
              target="_blank"
            >
              <CirclePlus className="inline" />
              add post
            </Link>{" "}
            and click "Save Draft" to save your work!
          </p>
        </div>
      )}
    </div>
  );
};

export default PostDrafts;
