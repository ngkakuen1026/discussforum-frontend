import { useState } from "react";
import PostListTitleCard from "./PostListTitleCard";
import UserPostList from "./UserPostList";
import type { PostType } from "../../../../types/postTypes";
import type { UseQueryResult } from "@tanstack/react-query";
import type { VoteType } from "../../../../types/voteType";
import type { CommentType } from "../../../../types/commentTypes";

const POSTS_PER_PAGE = 10;

interface PublicProfileUserPostDataProps {
  publicUserPosts: PostType[];
  voteResults: UseQueryResult<VoteType[], Error>[];
  commentResults: UseQueryResult<CommentType[], Error>[];
  handleCategoryClick: (categoryId: number) => void;
}

const PublicProfileUserPostData = ({
  publicUserPosts,
  voteResults,
  commentResults,
  handleCategoryClick,
}: PublicProfileUserPostDataProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(publicUserPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = publicUserPosts.slice(startIndex, endIndex);

  const paginatedVoteResults = voteResults.slice(startIndex, endIndex);
  const paginatedCommentResults = commentResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PostListTitleCard
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <UserPostList
        publicUserPosts={paginatedPosts}
        voteResults={paginatedVoteResults}
        commentResults={paginatedCommentResults}
        handleCategoryClick={handleCategoryClick}
      />
    </div>
  );
};

export default PublicProfileUserPostData;
