import { Link } from "@tanstack/react-router";
import { Tag } from "lucide-react";
import authAxios from "../../../services/authAxios";
import { useQuery } from "@tanstack/react-query";
import { tagsAPI } from "../../../services/http-api";

interface PostTagsProps {
  postId: number;
  pendingTagName?: string | null;
}

const PostTags = ({ postId, pendingTagName }: PostTagsProps) => {
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["post-tags", postId],
    queryFn: async () => {
      const res = await authAxios.get(`${tagsAPI.url}/${postId}/tags`);
      console.log("Post Tag:" + res.data.tags);
      return res.data.tags as { id: number; name: string }[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const displayTags =
    tags.length > 0
      ? tags
      : pendingTagName
        ? [{ id: 0, name: pendingTagName }]
        : [];

  if (isLoading || displayTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {displayTags.map((tag) => {
        const isPending = tag.id === 0;

        return (
          <Link
            key={tag.id}
            to="/posts/tag/$tagName"
            params={{ tagName: tag.name.toLowerCase() }}
            className={`
              inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium 
              transition-all hover:scale-105 hover:shadow-md
              ${
                isPending
                  ? "bg-gray-800 text-gray-400 border border-gray-600"
                  : "bg-white/10 border border-gray-400/50 text-white"
              }
            `}
          >
            <Tag size={12} className={isPending ? "opacity-70" : ""} />
            <span className="text-[10px]">{tag.name}</span>
            {isPending && (
              <span className="text-[10px] opacity-70">(pending)</span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default PostTags;
