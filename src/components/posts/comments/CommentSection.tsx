import CommentList from "./CommentList";
import { useState } from "react";
import CommentPopup from "../PostDetail/CommentPopup";
import type { CommentWithRepliesType } from "../../../types/commentTypes";
import { useAuthAction } from "../../../utils/authUtils";

interface CommentsSectionProps {
  comments: CommentWithRepliesType[];
  currentPage: number;
  COMMENTS_PER_PAGE: number;
  postId: string | number;
}

const CommentsSection = ({
  comments,
  currentPage,
  COMMENTS_PER_PAGE,
  postId,
}: CommentsSectionProps) => {
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const { withAuth } = useAuthAction();

  const paginatedComments = (() => {
    if (!comments || comments.length === 0) return [];

    if (currentPage === 1) {
      return comments.slice(0, COMMENTS_PER_PAGE - 1);
    }

    const start =
      (currentPage - 2) * COMMENTS_PER_PAGE + (COMMENTS_PER_PAGE - 1);
    return comments.slice(start, start + COMMENTS_PER_PAGE);
  })();

  return (
    <section>
      {paginatedComments.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No comments on this page.</p>
          Be the{" "}
          <button
            onClick={withAuth(() => setShowCommentPopup(true))}
            className="text-white font-medium hover:underline focus:underline outline-none cursor-pointer"
          >
            first
          </button>{" "}
          to comment on this post!
        </div>
      ) : (
        <CommentList
          comments={paginatedComments}
          commentsPerPage={COMMENTS_PER_PAGE}
        />
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
