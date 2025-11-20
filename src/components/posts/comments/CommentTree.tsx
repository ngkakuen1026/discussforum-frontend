import type {
  CommentType,
  CommentWithRepliesType,
} from "../../../types/commentTypes";
import CommentItem from "./CommentItem";

interface CommentTreeProps {
  comments: CommentType[];
}

const CommentTree = ({ comments }: CommentTreeProps) => {
  const commentMap = new Map<number, CommentWithRepliesType>();
  const roots: CommentWithRepliesType[] = [];

  comments.forEach((comment) => {
    const node = { ...comment, replies: [] };
    commentMap.set(comment.id, node);
    if (comment.parent_comment_id === null) {
      roots.push(node);
    } else {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) parent.replies.push(node);
    }
  });

  roots.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="space-y-12">
      {roots.map((comment, index) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          depth={0}
          floorNumber={index + 2}
        />
      ))}
    </div>
  );
};

export default CommentTree;
