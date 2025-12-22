import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import { bookmarksAPI } from "../services/http-api";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface BookmarkContextType {
  bookmarks: number[];
  isBookmarked: (postId: number) => boolean;
  toggleBookmark: (postId: number) => void;
  isPending: boolean;
  isLoading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery<number[]>({
    queryKey: ["my-bookmarks"],
    queryFn: async () => {
      const res = await authAxios.get(`${bookmarksAPI.url}/bookmark/me`);
      return res.data.bookmarks.map((b: { post_id: number }) => b.post_id);
    },
    staleTime: 1000 * 60 * 5,
  });

  const bookmarkMutation = useMutation({
    mutationFn: (postId: number) =>
      authAxios.post(`${bookmarksAPI.url}/bookmark`, { postId }),
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["my-bookmarks"], (old: number[] = []) => [
        ...old,
        postId,
      ]);
      toast.success("Post pinned!");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.info("Already pinned");
      } else {
        toast.error("Failed to pin");
      }
    },
  });

  const unbookmarkMutation = useMutation({
    mutationFn: (postId: number) =>
      authAxios.delete(`${bookmarksAPI.url}/bookmark/${postId}`),
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["my-bookmarks"], (old: number[] = []) =>
        old.filter((id) => id !== postId)
      );
      toast.success("Post unpinned");
    },
    onError: () => {
      toast.error("Failed to unpin");
    },
  });

  const toggleBookmark = (postId: number) => {
    if (bookmarks.includes(postId)) {
      unbookmarkMutation.mutate(postId);
    } else {
      bookmarkMutation.mutate(postId);
    }
  };

  const isPending = bookmarkMutation.isPending || unbookmarkMutation.isPending;

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        isBookmarked: (postId) => bookmarks.includes(postId),
        toggleBookmark,
        isPending,
        isLoading,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmark must be used within BookmarkProvider");
  }
  return context;
};
