import { useQuery } from "@tanstack/react-query";
import { commentsAPI } from "../../../services/http-api";
import authAxios from "../../../services/authAxios";
import CommentList from "./CommentList";
import { useState } from "react";
import CommentPopup from "../CommentPopup";

interface CommentsSectionProps {
  postId: string | number;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [showCommentPopup, setShowCommentPopup] = useState(false);

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await authAxios.get(
        `${commentsAPI.url}/${postId}/all-comments`
      );
      return res.data.comments;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-400">Loading comments...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load comments
      </div>
    );
  }

  return (
    <section className="mt-16">
      {comments.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No comments yet.</p>
          <p className="text-sm mt-2 cursor-pointer hover:underline" onClick={() => setShowCommentPopup(true)}>
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <CommentList comments={comments} />
      )}

      {showCommentPopup && (
        <CommentPopup
          postId={postId}
          onClose={() => setShowCommentPopup(false)}
        />
      )}
    </section>
  );
};

export default CommentsSection;
