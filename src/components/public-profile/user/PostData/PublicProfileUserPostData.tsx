import type { PostType } from "../../../../types/postTypes";
import type { UserType } from "../../../../types/userTypes";
import PostListTitleCard from "./PostListTitleCard";

interface PublicProfileUserPostDataProps {
  publicUser: UserType;
  publicUserPosts: PostType[];
}

const PublicProfileUserPostData = ({
  publicUser,
  publicUserPosts,
}: PublicProfileUserPostDataProps) => {
  return (
    <div>
      <PostListTitleCard publicUser={publicUser} />
    </div>
  );
};

export default PublicProfileUserPostData;
