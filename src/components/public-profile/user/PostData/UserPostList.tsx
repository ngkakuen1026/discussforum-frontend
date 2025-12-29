import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { PostType } from "../../../../types/postTypes";
import UserPostCard from "./UserPostCard";
import type { VoteType } from "../../../../types/voteType";
import type { CommentType } from "../../../../types/commentTypes";
import type { categoryType } from "../../../../types/categoryTypes";
import authAxios from "../../../../services/authAxios";
import { categoriesAPI } from "../../../../services/http-api";

interface UserPostListProps {
  publicUserPosts: PostType[];
  voteResults: UseQueryResult<VoteType[], Error>[];
  commentResults: UseQueryResult<CommentType[], Error>[];
  handleCategoryClick: (categoryId: number) => void;
}

const UserPostList = ({
  publicUserPosts,
  voteResults,
  commentResults,
  handleCategoryClick,
}: UserPostListProps) => {
  const { data: categories = [] } = useQuery<categoryType[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await authAxios.get(`${categoriesAPI.url}/all-categories`);
      return res.data.categories;
    },
    staleTime: 10 * 60 * 1000,
  });

  const categoryMap = Object.fromEntries(
    categories.map((cat) => [cat.id, cat.name])
  );

  return (
    <div className="mt-8 space-y-8">
      {publicUserPosts.length === 0 ? (
        <div className="rounded-2xl bg-gray-800/60 border border-gray-800/80 shadow-lg p-6 hover:bg-white/5 transition-all duration-300">
          <span className="text-gray-500 text-lg italic">
            This user hasn't post yet.
          </span>
        </div>
      ) : (
        publicUserPosts.map((publicUserPost, index) => {
          const voteData = voteResults[index]?.data || [];
          const commentData = commentResults[index]?.data || [];
          const categoryName =
            categoryMap[publicUserPost.category_id] || "Uncategorized";

          const upvotes = voteData.filter((v) => v.vote_type === 1).length;
          const downvotes = voteData.filter((v) => v.vote_type === -1).length;
          const commentCount = commentData.length;

          return (
            <UserPostCard
              key={publicUserPost.id}
              publicUserPost={publicUserPost}
              upvotes={upvotes}
              downvotes={downvotes}
              commentLength={commentCount}
              categoryName={categoryName}
              handleCategoryClick={handleCategoryClick}
            />
          );
        })
      )}
    </div>
  );
};

export default UserPostList;
