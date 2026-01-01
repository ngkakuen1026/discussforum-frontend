import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../services/authAxios";
import { postDraftsAPI, categoriesAPI } from "../../services/http-api";
import { CirclePlus } from "lucide-react";
import type { PostDraftType } from "../../types/postTypes";
import type { categoryType } from "../../types/categoryTypes";
import PostDraftToolbar from "./PostDraftToolbar";
import PostDraftCard from "./PostDraftCard";

const PostDrafts = () => {
  const queryClient = useQueryClient();
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
      <PostDraftToolbar
        selectMode={selectMode}
        selectedDraftIds={selectedDraftIds}
        drafts={drafts}
        deleteMultiplePostDraftsMutation={deleteMultiplePostDraftsMutation}
        toggleSelectMode={toggleSelectMode}
        selectAll={selectAll}
        deleteSelected={deleteSelected}
        refreshPostDrafts={refreshPostDrafts}
      />

      {drafts.length ? (
        <div className="space-y-4 mt-4">
          {drafts.map((draft: PostDraftType) => (
            <PostDraftCard
              key={draft.id}
              draft={draft}
              isSelected={selectedDraftIds.includes(draft.id)}
              selectMode={selectMode}
              toggleSelection={toggleSelection}
              getCategoryName={getCategoryName}
            />
          ))}
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
              <CirclePlus className="inline" size={20} />
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
