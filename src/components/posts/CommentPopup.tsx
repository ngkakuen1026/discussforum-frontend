import { useState } from "react";
import { X, Reply } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../services/authAxios";
import { toast } from "sonner";
import { commentsAPI } from "../../services/http-api";

interface CommentPopupProps {
  postId: string | number;
  parentComment?: {
    id: number;
    content: string;
    commenter_username: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CommentPopup({
  postId,
  parentComment,
  onClose,
  onSuccess,
}: CommentPopupProps) {
  const [content, setContent] = useState("");
  const [showFullQuote, setShowFullQuote] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const url = parentComment
        ? `${commentsAPI.url}/${parentComment.id}/reply`
        : `${commentsAPI.url}/${postId}/comment`;

      return authAxios.post(url, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success(parentComment ? "Reply posted!" : "Comment posted!");
      onClose();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      let message = "Login failed. Please try again";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };

        const status = axiosError.response?.status;
        const serverMessage = axiosError.response?.data?.message;

        switch (status) {
          case 400:
            message = "Missing required input.";
            break;
          case 500:
            message = "Server error. We're working on it";
            break;
          default:
            message = serverMessage || message;
        }
      }
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("Comment cannot be empty");
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {parentComment ? "Reply to Comment" : "Add a Comment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Quoted Comment */}
        {parentComment && (
          <div className="relative mx-6 mt-6 mb-4">
            {/* Arrow pointing up */}
            <div className="absolute left-8 -top-3 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-cyan-500 -rotate-180" />

            {/* Quoted Box */}
            <div className="bg-gray-800/90 backdrop-blur border border-cyan-500/50 rounded-lg p-5 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Reply size={18} className="text-cyan-400" />
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-medium">
                    {parentComment.commenter_username}
                  </span>
                  <span className="text-gray-500 text-sm">said:</span>
                </div>
              </div>

              {/* Quoted Content */}
              <div className="pl-8 border-l-4 border-cyan-500/70">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-all transition-all duration-300">
                  {showFullQuote
                    ? parentComment.content
                    : parentComment.content.length > 200
                      ? parentComment.content.substring(0, 200) + "..."
                      : parentComment.content}
                </p>
              </div>

              {parentComment.content.length > 200 && (
                <button
                  onClick={() => setShowFullQuote(!showFullQuote)}
                  className="text-cyan-400 text-xs mt-3 pl-8 cursor-pointer hover:text-cyan-300 transition font-medium"
                >
                  {showFullQuote ? "Show less" : "Click to view full comment"}
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              parentComment ? "Write your reply..." : "What are your thoughts?"
            }
            className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            autoFocus
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !content.trim()}
              className="px-8 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {mutation.isPending
                ? "Posting..."
                : parentComment
                  ? "Post Reply"
                  : "Post Comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
