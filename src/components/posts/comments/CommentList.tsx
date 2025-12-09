import type { CommentType } from "../../../types/commentTypes";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentType[];
  commentsPerPage: number;
}

const CommentList = ({ comments, commentsPerPage }: CommentListProps) => {
  return (
    <div className="space-y-14">
      {comments.map((comment) => (
        <div key={comment.id} id={`comment-${comment.id}`}>
          <CommentItem comment={comment} commentsPerPage={commentsPerPage} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;