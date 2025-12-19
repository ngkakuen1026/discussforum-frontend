import { useState } from "react";
import { X, Reply, MessageCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { toast } from "sonner";
import { commentsAPI, imagesAPI } from "../../../services/http-api";
import ClickOutside from "../../../hooks/useClickOutside";
import TiptapEditor from "../../TiptapEditor/TiptapEditor";
import SafeHTML from "../../SafeHTML";

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

const CommentPopup = (props: CommentPopupProps) => {
  const { postId, parentComment, onClose, onSuccess } = props;
  const [content, setContent] = useState("");
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [showFullQuote, setShowFullQuote] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      let finalContent = content;
      const uploadedUrls: string[] = [];

      for (const base64 of pendingImages) {
        if (base64.startsWith("http")) {
          uploadedUrls.push(base64);
          continue;
        }
        try {
          const blob = await (await fetch(base64)).blob();
          const file = new File([blob], "image.jpg", { type: blob.type });
          const formData = new FormData();
          formData.append("image", file);
          formData.append("type", "comment");
          const res = await authAxios.post(`${imagesAPI.url}/image`, formData);
          uploadedUrls.push(res.data.url);
        } catch (error) {
          toast.error("Failed to upload image");
          console.error("Error uploading image:" + error);
          return;
        }
      }

      pendingImages.forEach((oldUrl, index) => {
        if (oldUrl.startsWith("data:")) {
          const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(escaped, "g");
          finalContent = finalContent.replace(regex, uploadedUrls[index]);
        }
      });

      const url = parentComment
        ? `${commentsAPI.url}/${parentComment.id}/reply`
        : `${commentsAPI.url}/${postId}/comment`;
      return authAxios.post(url, { content: finalContent });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("Comment cannot be empty");
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-5xl max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3 text-white">
              <MessageCircle />
              <h2 className="text-xl font-bold ">
                {parentComment ? "Reply to Comment" : "Add a Comment"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={24} className="cursor-pointer" />
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
                <div className="pl-6 border-l-4 border-cyan-500/70 ml-2">
                  <SafeHTML
                    html={
                      showFullQuote || parentComment.content.length <= 120
                        ? parentComment.content
                        : parentComment.content.substring(0, 120) + "..."
                    }
                    className="text-gray-400 text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                  />

                  {parentComment.content.length > 120 && (
                    <button
                      onClick={() => setShowFullQuote((prev) => !prev)}
                      className="text-cyan-400 text-xs mt-2 hover:text-cyan-300 transition font-medium cursor-pointer"
                    >
                      {showFullQuote
                        ? "Show less"
                        : "Click to view full comment"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder={
                parentComment
                  ? "Write your reply..."
                  : "What are your thoughts?"
              }
              onAddPendingImage={(base64) => {
                setPendingImages((prev) => [...prev, base64]);
              }}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !content.trim()}
                className="cursor-pointer bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
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
      </ClickOutside>
    </div>
  );
};

export default CommentPopup;
