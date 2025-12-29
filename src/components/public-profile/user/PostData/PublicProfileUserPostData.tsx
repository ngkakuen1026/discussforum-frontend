import type { UseQueryResult } from "@tanstack/react-query";
import type { PostType } from "../../../../types/postTypes";
import type { UserType } from "../../../../types/userTypes";
import PostListTitleCard from "./PostListTitleCard";
import UserPostList from "./UserPostList";
import type { VoteType } from "../../../../types/voteType";
import type { CommentType } from "../../../../types/commentTypes";

interface PublicProfileUserPostDataProps {
  publicUser: UserType;
  publicUserPosts: PostType[];
  voteResults: UseQueryResult<VoteType[], Error>[];
  commentResults: UseQueryResult<CommentType[], Error>[];
  handleCategoryClick: (categoryId: number) => void;
}

const PublicProfileUserPostData = ({
  publicUser,
  publicUserPosts,
  voteResults,
  commentResults,
  handleCategoryClick,
}: PublicProfileUserPostDataProps) => {
  return (
    <div>
      <PostListTitleCard publicUser={publicUser} />
      <UserPostList
        publicUserPosts={publicUserPosts}
        voteResults={voteResults}
        commentResults={commentResults}
        handleCategoryClick={handleCategoryClick}
      />
    </div>
  );
};

export default PublicProfileUserPostData;
