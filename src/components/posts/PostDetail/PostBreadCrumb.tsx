import { useRouter } from "@tanstack/react-router";
import { MessageCircleMore, Eye, MoveLeft } from "lucide-react";
import type { PostType } from "../../../types/postTypes";

interface PostBreadCrumbProps {
  post: PostType;
  allCommentsLength: number;
}

const PostBreadCrumb = ({ post, allCommentsLength }: PostBreadCrumbProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-row text-gray-200 items-center gap-2">
      <button
        className="relative group cursor-pointer"
        onClick={() => router.history.back()}
      >
        <MoveLeft size={18} className="hover:opacity-75 transition" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          Go Back
        </span>
      </button>

      <h1 className="text-2xl font-bold text-gray-200 leading-tight">
        {post.title}
      </h1>
      <div className="relative group">
        <div className="flex flex-row gap-1 ">
          <Eye size={18} />
          {post.views}
        </div>
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          {post.views} {post.views > 1 ? "Visits" : "Visit"}
        </span>
      </div>
      <div className="relative group">
        <div className="flex flex-row gap-1 ">
          <MessageCircleMore size={18} />
          {allCommentsLength + 1}
        </div>
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          {allCommentsLength + 1}{" "}
          {allCommentsLength > 1 ? "Comments" : "Comment"}
        </span>
      </div>
    </div>
  );
};

export default PostBreadCrumb;
