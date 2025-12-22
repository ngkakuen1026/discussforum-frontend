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
  focusUserId: number | null;
}

const CommentsSection = ({
  comments,
  currentPage,
  COMMENTS_PER_PAGE,
  postId,
  focusUserId,
}: CommentsSectionProps) => {
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const { withAuth } = useAuthAction();

  const hasComments = comments.length > 0;
  const isFocusModeActive = focusUserId !== null;
  const noCommentsFromFocusedUser = isFocusModeActive && !hasComments;

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
          {noCommentsFromFocusedUser ? (
            <>
              <p className="text-lg">
                This user has not commented on this post.
              </p>
              <p className="text-lg mt-2">
                Try viewing comments from other users.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg">No comments on this page.</p>
              <p>
                Be the{" "}
                <button
                  onClick={withAuth(() => setShowCommentPopup(true))}
                  className="text-white font-medium hover:underline focus:underline outline-none cursor-pointer"
                >
                  first
                </button>{" "}
                to comment on this post!
              </p>
            </>
          )}
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
