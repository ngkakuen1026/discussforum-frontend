import type { CommentType } from "../../../types/commentTypes";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentType[];
  commentsPerPage: number;
  focusUserId: number | null;
  onFocusUser: (id: number | null) => void;
}

const CommentList = ({
  comments,
  commentsPerPage,
  focusUserId,
  onFocusUser,
}: CommentListProps) => {
  return (
    <div className="space-y-14">
      {comments.map((comment) => (
        <div key={comment.id} id={`comment-${comment.id}`}>
          <CommentItem
            comment={comment}
            commentsPerPage={commentsPerPage}
            focusUserId={focusUserId}
            onFocusUser={onFocusUser}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
