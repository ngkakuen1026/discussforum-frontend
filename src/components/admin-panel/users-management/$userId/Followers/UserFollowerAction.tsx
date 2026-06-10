import { type FormEvent } from "react";
import TablePagination from "../../TablePagination";
import type { UserFollowerType } from "../../../../../types/userFollowTypes";
import UserFollowersSortingDropdown from "./UserFollowerSortingDropdown";
import ItemsPerPageDropdown from "../../ItemsPerPageDropdown";
import ReactDatePicker from "../Posts/DatePircker";
import { formatDateToString } from "../../../../../utils/dateUtils";
import ExporUserFollowerButton from "./ExporUserFollowerButton";

interface UserFollowerActionProps {
  userFollowers: UserFollowerType[];
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
  registrationStartDate: string;
  setRegistrationStartDate: (value: string) => void;
  registrationEndDate: string;
  setRegistrationEndDate: (value: string) => void;
  lastLoginStartDate: string;
  setLastLoginStartDate: (value: string) => void;
  lastLoginEndDate: string;
  setLastLoginEndDate: (value: string) => void;
  followedStartDate: string;
  setFollowedStartDate: (value: string) => void;
  followedEndDate: string;
  setFollowedEndDate: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  clearAllFilters: () => void;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
}

const UserFollowerAction = ({
  userFollowers,
  userId,
  username,
  search,
  setSearch,
  sort,
  setSort,
  registrationStartDate,
  setRegistrationStartDate,
  registrationEndDate,
  setRegistrationEndDate,
  lastLoginStartDate,
  setLastLoginStartDate,
  lastLoginEndDate,
  setLastLoginEndDate,
  followedStartDate,
  setFollowedStartDate,
  followedEndDate,
  setFollowedEndDate,
  setCurrentPage,
  clearAllFilters,
  itemsPerPage,
  setItemsPerPage,
  pagination,
}: UserFollowerActionProps) => {
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center mb-6 justify-between">
          <h2 className="text-3xl font-bold adminHeading">
            {username}'s Followers (User #{userId})
            {pagination && (
              <span className="ml-3 text-xl text-gray-400 font-normal">
                ({pagination.total}{" "}
                {pagination.total > 1 ? "followers" : "follower"})
              </span>
            )}
          </h2>

          <ExporUserFollowerButton
            followers={userFollowers}
            userId={userId}
            username={username}
            search={search}
            registrationStartDate={registrationStartDate}
            registrationEndDate={registrationEndDate}
            sort={sort}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <label className="text-lg text-gray-200 whitespace-nowrap">
            Sort:
          </label>
          <UserFollowersSortingDropdown
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
          {/* From Registration Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              Registration From
            </label>
            <ReactDatePicker
              selected={
                registrationStartDate ? new Date(registrationStartDate) : null
              }
              onChange={(date) =>
                setRegistrationStartDate(date ? formatDateToString(date) : "")
              }
              placeholderText="From Date"
              maxDate={
                registrationEndDate ? new Date(registrationEndDate) : new Date()
              }
            />
          </div>

          {/* From Registration To Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              Registration To
            </label>
            <ReactDatePicker
              key={registrationStartDate}
              selected={
                registrationEndDate ? new Date(registrationEndDate) : null
              }
              onChange={(date) =>
                setRegistrationEndDate(date ? formatDateToString(date) : "")
              }
              placeholderText="To Date"
              maxDate={new Date()}
              minDate={
                registrationStartDate
                  ? new Date(registrationStartDate)
                  : undefined
              }
            />
          </div>

          {/* Last Login From Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              Last Login From
            </label>
            <ReactDatePicker
              selected={
                lastLoginStartDate ? new Date(lastLoginStartDate) : null
              }
              onChange={(date) =>
                setLastLoginStartDate(date ? formatDateToString(date) : "")
              }
              placeholderText="From Date"
              maxDate={
                lastLoginEndDate ? new Date(lastLoginEndDate) : new Date()
              }
            />
          </div>

          {/* Last Login To Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              Last Login To
            </label>
            <ReactDatePicker
              key={lastLoginStartDate}
              selected={lastLoginEndDate ? new Date(lastLoginEndDate) : null}
              onChange={(date) =>
                setLastLoginEndDate(date ? formatDateToString(date) : "")
              }
              placeholderText="To Date"
              maxDate={new Date()}
              minDate={
                lastLoginStartDate ? new Date(lastLoginStartDate) : undefined
              }
            />
          </div>

          {/* Last Login From Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              Followed From
            </label>
            <ReactDatePicker
              selected={followedStartDate ? new Date(followedStartDate) : null}
              onChange={(date) =>
                setFollowedStartDate(date ? formatDateToString(date) : "")
              }
              placeholderText="From Date"
              maxDate={followedEndDate ? new Date(followedEndDate) : new Date()}
            />
          </div>

          {/* Last Login To Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              Followed To
            </label>
            <ReactDatePicker
              key={followedStartDate}
              selected={followedEndDate ? new Date(followedEndDate) : null}
              onChange={(date) =>
                setFollowedEndDate(date ? formatDateToString(date) : "")
              }
              placeholderText="To Date"
              maxDate={new Date()}
              minDate={
                followedStartDate ? new Date(followedStartDate) : undefined
              }
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
        itemsName="followers"
      />
    </div>
  );
};

export default UserFollowerAction;
