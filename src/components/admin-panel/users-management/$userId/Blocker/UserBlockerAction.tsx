import { type FormEvent } from "react";
import TablePagination from "../../TablePagination";
import ItemsPerPageDropdown from "../../ItemsPerPageDropdown";
import ReactDatePicker from "../Posts/DatePircker";
import { formatDateToString } from "../../../../../utils/dateUtils";
import type { UserBlockerType } from "../../../../../types/userBlcokedTypes";
import UserBlockerSortingDropdown from "./UserBlockerSortingDropdown";
import ExportUserBlockerButton from "./ExportUserBlockerButton";

interface UserBlockerActionProps {
  userBlockers: UserBlockerType[];
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
  blockedStartDate: string;
  setBlockedStartDate: (value: string) => void;
  blockedEndDate: string;
  setBlockedEndDate: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  clearAllFilters: () => void;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
}

const UserBlockerAction = ({
  userBlockers,
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
  blockedStartDate,
  setBlockedStartDate,
  blockedEndDate,
  setBlockedEndDate,
  setCurrentPage,
  clearAllFilters,
  itemsPerPage,
  setItemsPerPage,
  pagination,
}: UserBlockerActionProps) => {
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center mb-6 justify-between">
          <h2 className="text-3xl font-bold adminHeading">
            Blocked by Users (User #{userId})
            {pagination && (
              <span className="ml-3 text-xl text-gray-400 font-normal">
                ({pagination.total} {pagination.total > 1 ? "users" : "user"})
              </span>
            )}
          </h2>

          <ExportUserBlockerButton
            blockers={userBlockers}
            userId={userId}
            username={username}
            search={search}
            registrationStartDate={registrationStartDate}
            registrationEndDate={registrationEndDate}
            lastLoginStartDate={lastLoginStartDate}
            lastLoginEndDate={lastLoginEndDate}
            blockedStartDate={blockedStartDate}
            blockedEndDate={blockedEndDate}
            sort={sort}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <label className="text-lg text-gray-200 whitespace-nowrap">
            Sort:
          </label>
          <UserBlockerSortingDropdown
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
              Blockeded From
            </label>
            <ReactDatePicker
              selected={blockedStartDate ? new Date(blockedStartDate) : null}
              onChange={(date) =>
                setBlockedStartDate(date ? formatDateToString(date) : "")
              }
              placeholderText="From Date"
              maxDate={blockedEndDate ? new Date(blockedEndDate) : new Date()}
            />
          </div>

          {/* Last Login To Date */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              Blockeded To
            </label>
            <ReactDatePicker
              key={blockedStartDate}
              selected={blockedEndDate ? new Date(blockedEndDate) : null}
              onChange={(date) =>
                setBlockedEndDate(date ? formatDateToString(date) : "")
              }
              placeholderText="To Date"
              maxDate={new Date()}
              minDate={
                blockedStartDate ? new Date(blockedStartDate) : undefined
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
        itemsName="users"
      />
    </div>
  );
};

export default UserBlockerAction;
