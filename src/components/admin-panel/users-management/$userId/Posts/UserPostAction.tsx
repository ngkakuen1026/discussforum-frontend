import React from "react";
import UserPostSortingDropdown from "./UserPostSortingDropdown";
import ItemsPerPageDropdown from "../../ItemsPerPageDropdown";
import TablePagination from "../../TablePagination";
import type { categoryType } from "../../../../../types/categoryTypes";
import PostCategoriesDropdown from "./PostCategoriesDropdown";
import NumberInput from "./NumberInput";
import ReactDatePicker from "./DatePircker";
import { CircleQuestionMark } from "lucide-react";
import { formatDateToString } from "../../../../../utils/dateUtils";
import ExportUserPostsButton from "./ExportUserPostButton";
import type { ExtendedPostType } from "../../../../../types/postTypes";

interface UserPostActionProps {
  posts: ExtendedPostType[];
  userId: string;
  username: string;
  search: string;
  setSearch: (value: string) => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  postId: string;
  setPostId: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  minVotes: string;
  setMinVotes: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  clearAllFilters: () => void;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  categories: categoryType[];
}

const UserPostAction = ({
  posts,
  userId,
  username,
  search,
  setSearch,
  sort,
  setSort,
  postId,
  setPostId,
  categoryId,
  setCategoryId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  minVotes,
  setMinVotes,
  setCurrentPage,
  clearAllFilters,
  itemsPerPage,
  setItemsPerPage,
  pagination,
  categories,
}: UserPostActionProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center mb-6 justify-between">
          <h2 className="text-3xl font-bold adminHeading">
            {username}’s Posts (User #{userId})
            {pagination && (
              <span className="ml-3 text-xl text-gray-400 font-normal">
                ({pagination.total} posts)
              </span>
            )}
          </h2>

          <ExportUserPostsButton
            posts={posts}
            username={username}
            userId={userId}
            search={search}
            postId={postId}
            categoryId={categoryId}
            startDate={startDate}
            endDate={endDate}
            minVotes={minVotes}
            sort={sort}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <label className="text-lg text-gray-200 whitespace-nowrap">
            Sort:
          </label>
          <UserPostSortingDropdown
            value={sort}
            onChange={(newSortValue) => {
              setSort(newSortValue);
              setCurrentPage(1);
            }}
          />

          <label className="text-lg text-gray-200 whitespace-nowrap ml-4">
            Show:
          </label>
          <ItemsPerPageDropdown
            value={itemsPerPage}
            onChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex gap-6 items-end">
          {/* Search Bar */}
          <div className="flex-1">
            <label className="block font-medium text-gray-400 mb-1">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Search by title or content..."
            />
          </div>

          {/* Clear Filters Button */}
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-8 py-3.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium whitespace-nowrap cursor-pointer"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 items-center">
          {/* Post ID */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-400 mb-1">
              Post ID
            </label>
            <NumberInput
              value={postId}
              onChange={setPostId}
              placeholder="0"
              min={1}
            />
          </div>

          {/* Category */}
          <PostCategoriesDropdown
            categoryId={categoryId}
            setCategoryId={(selectedCategoryId) => {
              setCategoryId(selectedCategoryId);
              setCurrentPage(1);
            }}
            setCurrentPage={setCurrentPage}
            categories={categories}
          />

          {/* Min Votes */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-400 mb-1">
              Min Votes
              <button className="relative group cursor-pointer">
                <CircleQuestionMark
                  size={14}
                  className="hover:text-white transition"
                />
                <p className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                  Votes count contains the number of upvotes and downvotes for
                  each post.
                </p>
              </button>
            </label>
            <NumberInput
              value={minVotes}
              onChange={setMinVotes}
              placeholder="0"
              min={0}
            />
          </div>

          {/* From Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              From Date
            </label>
            <ReactDatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(date) =>
                setStartDate(date ? formatDateToString(date) : "")
              }
              placeholderText="From Date"
              maxDate={endDate ? new Date(endDate) : new Date()}
            />
          </div>

          {/* To Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              To Date
            </label>
            <ReactDatePicker
              key={startDate}
              selected={endDate ? new Date(endDate) : null}
              onChange={(date) =>
                setEndDate(date ? formatDateToString(date) : "")
              }
              placeholderText="To Date"
              maxDate={new Date()}
              minDate={startDate ? new Date(startDate) : undefined}
            />
          </div>
        </div>
      </form>

      <TablePagination
        currentPage={pagination?.currentPage || 1}
        totalPages={pagination?.totalPages || 1}
        totalItems={pagination?.total || 0}
        onPageChange={(page) => setCurrentPage(page)}
        itemsPerPage={itemsPerPage}
        itemsName="posts"
      />
    </div>
  );
};

export default UserPostAction;
