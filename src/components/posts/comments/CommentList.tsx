import type { CommentType } from "../../../types/commentTypes";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentType[];
}

const CommentList = ({ comments }: CommentListProps) => {
  return (
    <div className="space-y-12">
      {comments.map((comment) => (
        <div key={comment.id} id={`comment-${comment.id}`}>
          <CommentItem comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;