import { Trash2, X } from "lucide-react";
import ClickOutside from "../../../../../hooks/useClickOutside";
import type { PostType } from "../../../../../types/postTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../../../services/authAxios";
import { adminAPI } from "../../../../../services/http-api";
import { toast } from "sonner";

interface DeleteUserPostPopupProps {
  post: PostType;
  onClose: () => void;
}

const DeleteUserPostPopup = ({ post, onClose }: DeleteUserPostPopupProps) => {
  const queryClient = useQueryClient();
  // Delete Post Mutation
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      await authAxios.delete(`${adminAPI.url}/posts/post/${post.id}`);
    },
    onSuccess: () => {
      toast.success(`Post ${post.title} has been deleted`);
      queryClient.invalidateQueries({ queryKey: ["admin-user-posts"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deletePostMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Trash2 size={18} />
              <h2 className="text-lg font-bold">Delete Post</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} className="cursor-pointer" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <p className="text-sm text-gray-400 leading-relaxed">
              This will delete post {post.title} by {post.author_username}
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={deletePostMutation.isPending}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={deletePostMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deletePostMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default DeleteUserPostPopup;
