import type { FormEvent } from "react";
import type {
  ExtendedUserType,
  UserFilterType,
} from "../../../types/userTypes";
import ExportUsersButton from "./ExportUsersButton";
import ItemsPerPageDropdown from "./ItemsPerPageDropdown";
import TablePagination from "./TablePagination";
import UserSortingDropdown from "./UserSortingDropdown";
import NumberInput from "./$userId/Posts/NumberInput";
import ReactDatePicker from "./$userId/Posts/DatePircker";
import { formatDateToString } from "../../../utils/dateUtils";

interface UserFilterAndActionProps {
  users: ExtendedUserType[];
  activeFilter: UserFilterType;
  setActiveFilter: (value: UserFilterType) => void;
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
  userId: string;
  setUserId: (value: string) => void;
  registrationStartDate: string;
  setRegistrationStartDate: (value: string) => void;
  registrationEndDate: string;
  setRegistrationEndDate: (value: string) => void;
  lastLoginStartDate: string;
  setLastLoginStartDate: (value: string) => void;
  lastLoginEndDate: string;
  setLastLoginEndDate: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  clearAllFilters: () => void;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
}

const UserFilterAndAction = ({
  users,
  activeFilter,
  setActiveFilter,
  search,
  setSearch,
  pagination,
  userId,
  setUserId,
  registrationStartDate,
  setRegistrationStartDate,
  registrationEndDate,
  setRegistrationEndDate,
  lastLoginStartDate,
  setLastLoginStartDate,
  lastLoginEndDate,
  setLastLoginEndDate,
  sort,
  setSort,
  clearAllFilters,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
}: UserFilterAndActionProps) => {
  const filters: { label: string; value: UserFilterType; count?: number }[] = [
    { label: "All", value: "all" },
    { label: "Admin", value: "admin" },
    { label: "Member", value: "member" },
    { label: "New", value: "new" },
    { label: "Normal", value: "normal" },
    { label: "Suspended", value: "suspended" },
  ];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <form onSubmit={handleSearch} className="my-8 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-black adminHeading">Users</h1>
        <ExportUsersButton
          users={users}
          activeFilter={activeFilter}
          search={search}
          userId={userId}
          registrationStartDate={registrationStartDate}
          registrationEndDate={registrationEndDate}
          lastLoginStartDate={lastLoginStartDate}
          lastLoginEndDate={lastLoginEndDate}
          sort={sort}
        />
      </div>

      <p className="text-lg text-gray-400 mb-4">
        View, manage users and export user data
      </p>

      <div className="mb-4 border-b border-gray-800">
        <div className="flex gap-12 text-sm">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setActiveFilter(filter.value);
                setCurrentPage(1);
              }}
              className={`pb-4 font-medium transition-colors relative text-lg cursor-pointer ${
                activeFilter === filter.value
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {filter.label}
              {activeFilter === filter.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-3xl font-bold adminHeading">User List</h2>

          <div className="flex items-center gap-4">
            <label className="text-lg text-gray-200 whitespace-nowrap">
              Sort:
            </label>
            <UserSortingDropdown
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
              placeholder="Search by username, name or email..."
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
          {/* User ID */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-400 mb-1">
              User ID
            </label>
            <NumberInput
              value={userId}
              onChange={setUserId}
              placeholder="0"
              min={1}
            />
          </div>

          {/* Registration From Date */}
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

          {/* Registration To Date */}
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
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <TablePagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          totalItems={pagination?.total || 0}
          onPageChange={(page) => setCurrentPage(page)}
          itemsPerPage={itemsPerPage}
          itemsName="users"
        />
      </div>
    </form>
  );
};

export default UserFilterAndAction;
