import {
  ChartNoAxesCombined,
  Flag,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { ExtendedPostType } from "../../../../../types/postTypes";
import { formatDate } from "../../../../../utils/dateUtils";
import UserPostListActionDropdown from "./UserPostListActionDropdown";
import { useState } from "react";
import { formatNumber } from "../../../../../utils/formatNumberUtils";

interface UserPostListProps {
  posts: ExtendedPostType[];
  isLoading: boolean;
}

const UserPostList = ({ posts, isLoading }: UserPostListProps) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    postId: number;
    type: "upvotes" | "downvotes" | "views" | "comments" | "shares" | "reports";
  } | null>(null);

  return (
    <div>
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No posts found.</div>
      ) : (
        <div className="">
          <table className="w-full min-w-full border border-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Statistics
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Created
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {posts.map((post: ExtendedPostType) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">{post.id}</td>
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4">{post.category_name}</td>

                  {/* Stats */}
                  <td className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Upvotes */}
                      <div
                        className="relative group"
                        onMouseEnter={() =>
                          setActiveTooltip({
                            postId: post.id,
                            type: "upvotes",
                          })
                        }
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <div className="flex items-center gap-1 text-green-400 group-hover:text-green-200 transition">
                          <ThumbsUp size={16} />
                          <span>{formatNumber(post.upvote_count, true)}</span>
                        </div>
                        {activeTooltip?.postId === post.id &&
                          activeTooltip?.type === "upvotes" && (
                            <span className="absolute -top-10 left-1/6 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                              {post.upvote_count}{" "}
                              {post.upvote_count > 1 ? "upvotes" : "upvote"}
                            </span>
                          )}
                      </div>

                      {/* Downvotes */}
                      <div
                        className="relative group"
                        onMouseEnter={() =>
                          setActiveTooltip({
                            postId: post.id,
                            type: "downvotes",
                          })
                        }
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <div className="flex items-center gap-1 text-red-400 group-hover:text-red-200 transition">
                          <ThumbsDown size={16} />
                          <span>{formatNumber(post.downvote_count)}</span>
                        </div>
                        {activeTooltip?.postId === post.id &&
                          activeTooltip?.type === "downvotes" && (
                            <span className="absolute -top-10 left-1/6 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                              {post.downvote_count}{" "}
                              {post.downvote_count > 1
                                ? "downvotes"
                                : "downvote"}
                            </span>
                          )}
                      </div>

                      {/* Comments */}
                      <div
                        className="relative group"
                        onMouseEnter={() =>
                          setActiveTooltip({
                            postId: post.id,
                            type: "comments",
                          })
                        }
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <div className="flex items-center gap-1 text-blue-400 font-medium group-hover:text-blue-200 transition">
                          <MessageCircle size={16} />
                          <span>{formatNumber(post.comment_count, true)}</span>
                        </div>
                        {activeTooltip?.postId === post.id &&
                          activeTooltip?.type === "comments" && (
                            <span className="absolute -top-10 left-1/6 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                              {post.comment_count}{" "}
                              {post.comment_count > 1 ? "Comments" : "Comment"}
                            </span>
                          )}
                      </div>

                      {/* Views */}
                      <div
                        className="relative group"
                        onMouseEnter={() =>
                          setActiveTooltip({
                            postId: post.id,
                            type: "views",
                          })
                        }
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <div className="flex items-center gap-1 text-gray-400 group-hover:text-white transition">
                          <ChartNoAxesCombined size={16} />
                          <span>{formatNumber(post.views, true)}</span>
                        </div>
                        {activeTooltip?.postId === post.id &&
                          activeTooltip?.type === "views" && (
                            <span className="absolute -top-10 left-1/6 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                              {post.views} {post.views > 1 ? "Visits" : "Visit"}
                            </span>
                          )}
                      </div>

                      {/* Shares */}
                      <div
                        className="relative group"
                        onMouseEnter={() =>
                          setActiveTooltip({
                            postId: post.id,
                            type: "shares",
                          })
                        }
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <div className="flex items-center gap-1 text-gray-400 font-medium group-hover:text-blue-200 transition">
                          <Share2 size={16} />
                          <span>{formatNumber(post.share_count, true)}</span>
                        </div>
                        {activeTooltip?.postId === post.id &&
                          activeTooltip?.type === "shares" && (
                            <span className="absolute -top-10 left-1/6 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                              {post.share_count}{" "}
                              {post.share_count > 1 ? "Shares" : "Share"}
                            </span>
                          )}
                      </div>

                      {/* Report */}
                      <div
                        className="relative group"
                        onMouseEnter={() =>
                          setActiveTooltip({
                            postId: post.id,
                            type: "reports",
                          })
                        }
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <div className="flex items-center gap-1 text-yellow-400 font-medium group-hover:text-blue-200 transition">
                          <Flag size={16} />
                          <span>{formatNumber(post.report_count, true)}</span>
                        </div>
                        {activeTooltip?.postId === post.id &&
                          activeTooltip?.type === "reports" && (
                            <span className="absolute -top-10 left-1/6 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                              {post.report_count}{" "}
                              {post.report_count > 1 ? "Reports" : "Report"}
                            </span>
                          )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <UserPostListActionDropdown post={post} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPostList;
