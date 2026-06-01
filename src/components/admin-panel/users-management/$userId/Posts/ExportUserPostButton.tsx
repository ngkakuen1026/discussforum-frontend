import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { ExtendedPostType } from "../../../../../types/postTypes";

interface ExportUserPostsButtonProps {
  posts: ExtendedPostType[];
  username?: string;
}

export default function ExportUserPostsButton({
  posts = [],
  username = "UnknownUser",
}: ExportUserPostsButtonProps) {
  const exportToExcel = () => {
    if (posts.length === 0) {
      toast.error("No posts to export");
      return;
    }

    const dateStr = new Date().toISOString().slice(0, 10);

    const exportData = posts.map((post) => ({
      "Post ID": post.id,
      Author: post.author_username || username,
      Title: post.title,
      Category: post.category_name || "Uncategorized",
      "Created At": post.created_at
        ? new Date(post.created_at).toLocaleDateString("en-US")
        : "N/A",
      Upvotes: post.upvote_count || 0,
      Downvotes: post.downvote_count || 0,
      Comments: post.comment_count || 0,
      "Pageviews at export time": post.views || 0,
      Shares: post.share_count || 0,
      Reports: post.report_count || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Posts");

    const fileName = `User_${username}_Posts_${dateStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
    toast.success(
      `Successfully exported ${posts.length} posts for User #${username}`,
    );
  };

  return (
    <button
      onClick={exportToExcel}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors text-white font-medium px-4 py-2 rounded-lg text-sm cursor-pointer border-2 border-gray-700"
    >
      <Download size={18} />
      Export
    </button>
  );
}
