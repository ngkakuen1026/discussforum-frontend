import { Flag, Reply, Share2 } from "lucide-react";

interface CommentActionsProps {
  withAuth: (action: () => void) => () => void;
  onShowReplyPopup: () => void;
  onShowReportPopup: () => void;
}

const CommentActions = ({
  withAuth,
  onShowReplyPopup,
  onShowReportPopup,
}: CommentActionsProps) => {
  return (
    <div className="flex gap-2 text-gray-400">
      <button
        onClick={withAuth(() => onShowReplyPopup())}
        className="relative group"
      >
        <Reply
          size={18}
          className="hover:text-cyan-500 transition cursor-pointer"
        />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          Reply to Comment
        </span>
      </button>
      <button className="relative group">
        <Share2
          size={18}
          className="hover:text-white transition cursor-pointer"
        />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          Share Comment
        </span>
      </button>
      <button onClick={() => onShowReportPopup()} className="relative group">
        <Flag
          size={18}
          className="hover:text-red-500 transition cursor-pointer"
        />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          Report Content
        </span>
      </button>
    </div>
  );
};

export default CommentActions;
