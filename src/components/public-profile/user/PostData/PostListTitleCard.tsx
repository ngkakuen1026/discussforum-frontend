import PublicUserPostListPagination from "./PublicUserPostListPagination";

interface PostListTitleCardProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PostListTitleCard = ({
  currentPage,
  totalPages,
  onPageChange,
}: PostListTitleCardProps) => {
  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
      <div
        className={`${totalPages > 1 ? "px-8 py-2" : "px-8 py-4"} text-gray-200 flex justify-between items-center cursor-pointer`}
      >
        <h3 className="text-xl font-semibold">Post Information</h3>
        {totalPages > 1 && (
          <PublicUserPostListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default PostListTitleCard;
