import { useQueries, useQuery } from "@tanstack/react-query";
import AdminPanelBreadCrumb from "../AdminPanelBreadCrumb";
import type { UserType } from "../../../types/userTypes";
import authAxios from "../../../services/authAxios";
import { adminAPI } from "../../../services/http-api";
import { CircleQuestionMark, ListCollapse } from "lucide-react";
import UserRow from "./UserRow";
import { useEffect, useMemo, useState } from "react";
import UserSortingDropdown from "./UserSortingDropdown";
import ItemsPerPageDropdown from "./ItemsPerPageDropdown";
import TablePagination from "./TablePagination";
import ExportUsersButton from "./ExportUsersButton";

type FilterType = "all" | "normal" | "suspended" | "new" | "admin" | "member";

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery<UserType[]>({
    queryKey: ["admin-all-users"],
    queryFn: async () => {
      const res = await authAxios.get(`${adminAPI.url}/users/all-users`);
      return res.data.users || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Ban Status
  const banQueries = useQueries({
    queries: users.map((user) => ({
      queryKey: ["ban-status", user.id],
      queryFn: async () => {
        const res = await authAxios.get(
          `${adminAPI.url}/users/user/${user.id}/ban-status`,
        );
        return { userId: user.id, ...res.data };
      },
      enabled: users.length > 0,
      staleTime: 30 * 1000,
    })),
  });

  // Enrich users with ban info from banQueries
  const enrichedUsers = useMemo(() => {
    return users.map((user, index) => {
      const banData = banQueries[index]?.data;
      return {
        ...user,
        isBanned: banData?.isBanned ?? false,
        banInfo: banData,
      };
    });
  }, [users, banQueries]);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...enrichedUsers];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (user) =>
          user.username?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          `${user.first_name || ""} ${user.last_name || ""}`
            .toLowerCase()
            .includes(term) ||
          user.id?.toString().includes(term),
      );
    }

    // Filter
    switch (activeFilter) {
      case "normal":
        result = result.filter((user) => !user.isBanned);
        break;
      case "suspended":
        result = result.filter((user) => user.isBanned);
        break;
      case "new": {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        result = result.filter(
          (user) => new Date(user.registration_date) > thirtyDaysAgo,
        );
        break;
      }
      case "admin":
        result = result.filter((user) => user.is_admin === true);
        break;
      case "member":
        result = result.filter((user) => user.is_admin === false);
        break;
    }

    // Sorting
    if (sortOption) {
      result.sort((a, b) => {
        switch (sortOption) {
          case "id_asc":
            return a.id - b.id;
          case "id_des":
            return b.id - a.id;

          case "username_asc":
            return (a.username || "")
              .toLowerCase()
              .localeCompare((b.username || "").toLowerCase());
          case "username_des":
            return (b.username || "")
              .toLowerCase()
              .localeCompare((a.username || "").toLowerCase());

          case "name_asc":
            return `${a.first_name || ""} ${a.last_name || ""}`
              .toLowerCase()
              .localeCompare(
                `${b.first_name || ""} ${b.last_name || ""}`.toLowerCase(),
              );

          case "name_des":
            return `${b.first_name || ""} ${b.last_name || ""}`
              .toLowerCase()
              .localeCompare(
                `${a.first_name || ""} ${a.last_name || ""}`.toLowerCase(),
              );

          case "email_asc":
            return (a.email || "")
              .toLowerCase()
              .localeCompare((b.email || "").toLowerCase());
          case "email_des":
            return (b.email || "")
              .toLowerCase()
              .localeCompare((a.email || "").toLowerCase());

          case "registered_newest":
            return (
              new Date(b.registration_date).getTime() -
              new Date(a.registration_date).getTime()
            );
          case "registered_oldest":
            return (
              new Date(a.registration_date).getTime() -
              new Date(b.registration_date).getTime()
            );

          case "last_login_newest":
            return (
              new Date(b.last_login_at || 0).getTime() -
              new Date(a.last_login_at || 0).getTime()
            );
          case "last_login_oldest":
            return (
              new Date(a.last_login_at || 0).getTime() -
              new Date(b.last_login_at || 0).getTime()
            );

          default:
            return 0;
        }
      });
    }

    return result;
  }, [enrichedUsers, searchTerm, activeFilter, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const displayedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(start, start + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter, sortOption, itemsPerPage]);

  const filters: { label: string; value: FilterType; count?: number }[] = [
    { label: "All", value: "all" },
    { label: "Admin", value: "admin" },
    { label: "Member", value: "member" },
    { label: "New", value: "new" },
    { label: "Normal", value: "normal" },
    { label: "Suspended", value: "suspended" },
  ];

  if (isError) {
    return (
      <div className="p-8 text-red-400">
        Failed to load users: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="">
      <AdminPanelBreadCrumb>Users Management</AdminPanelBreadCrumb>

      <div className="my-12 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-black adminHeading">Users</h1>
          <ExportUsersButton
            users={filteredAndSortedUsers}
            activeFilter={activeFilter}
          />
        </div>

        <p className="text-lg text-gray-400">
          View, manage users and export user data
        </p>
      </div>

      <div className="mb-6 border-b border-gray-800">
        <div className="flex gap-12 text-sm">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
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

      <div className="mb-8 flex flex-col justify-center">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-3xl font-bold adminHeading">User List</h2>

          <div className="flex items-center gap-4">
            <label className="text-lg text-gray-200 whitespace-nowrap">
              Sort:
            </label>
            <UserSortingDropdown value={sortOption} onChange={setSortOption} />

            <label className="text-lg text-gray-200 whitespace-nowrap ml-4">
              Show:
            </label>
            <ItemsPerPageDropdown
              value={itemsPerPage}
              onChange={setItemsPerPage}
            />
          </div>
        </div>
        <div className="flex">
          <input
            className="px-6 py-3 border border-gray-700 bg-gray-900 rounded-lg w-full focus:outline-none focus:border-cyan-500"
            placeholder="Search users by ID, username, fullname or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 mt-4">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalUsers={filteredAndSortedUsers.length}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading users...</div>
      ) : displayedUsers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No users found matching "{searchTerm}"
        </div>
      ) : (
        <div>
          <table className="w-full min-w-full border border-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  <ListCollapse size={16} />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 flex gap-1 items-start">
                  Role
                  <button className="relative group cursor-pointer">
                    <CircleQuestionMark
                      size={14}
                      className="hover:text-white transition"
                    />
                    <p className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                      <span className="text-yellow-600/80">Orange</span> = Admin
                      <br />
                      <span className="text-blue-600/80">Blue</span> = Male
                      <br />
                      <span className="text-pink-600/80">Pink</span> = Female
                      <br />
                      <span className="text-gray-600/80">Gray</span> = No Gender
                      Specified
                    </p>
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Registered
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {displayedUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
