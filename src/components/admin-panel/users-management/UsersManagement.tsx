import { useQuery } from "@tanstack/react-query";
import AdminPanelBreadCrumb from "../AdminPanelBreadCrumb";
import authAxios from "../../../services/authAxios";
import { adminAPI } from "../../../services/http-api";
import { useState } from "react";
import UserFilterAndAction from "./UserFilterAndAction";
import type { UserFilterType } from "../../../types/userTypes";
import UsersList from "./UsersList";

const UsersManagement = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [activeFilter, setActiveFilter] = useState<UserFilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [userId, setUserId] = useState("");
  const [registrationStartDate, setRegistrationStartDate] = useState("");
  const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [lastLoginStartDate, setLastLoginStartDate] = useState("");
  const [lastLoginEndDate, setLastLoginEndDate] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "admin-all-users",
      userId,
      search,
      sort,
      currentPage,
      registrationStartDate,
      registrationEndDate,
      lastLoginStartDate,
      lastLoginEndDate,
      activeFilter,
      itemsPerPage,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("query", search);
      if (userId) params.append("user_id", userId);
      if (registrationStartDate)
        params.append("registration_start_date", registrationStartDate);
      if (registrationEndDate) params.append("registration_end_date", registrationEndDate);
      if (lastLoginStartDate)
        params.append("last_login_start_date", lastLoginStartDate);
      if (lastLoginEndDate) params.append("last_login_end_date", lastLoginEndDate);

      // Filter tabs
      if (activeFilter !== "all") {
        params.append("filter", activeFilter);
      }

      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      if (sort) params.append("sort", sort);
      const res = await authAxios.get(
        `${adminAPI.url}/users/search-users/?${params.toString()}`,
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });

  const clearAllFilters = () => {
    setSearch("");
    setSort("");
    setUserId("");
    setRegistrationStartDate("");
    setRegistrationEndDate("");
    setLastLoginStartDate("");
    setLastLoginEndDate("");
    setItemsPerPage(10);
    setCurrentPage(1);
  };

  const users = data?.users ?? data?.data?.users ?? data ?? [];
  const pagination = data?.pagination ?? data?.data?.pagination ?? null;

  if (isError) {
    return <div className="text-center py-20 ">Error loading users.</div>;
  }

  return (
    <div className="">
      <AdminPanelBreadCrumb>Users Management</AdminPanelBreadCrumb>

      <UserFilterAndAction
        users={users}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        search={search}
        setSearch={setSearch}
        userId={userId}
        setUserId={setUserId}
        registrationStartDate={registrationStartDate}
        setRegistrationStartDate={setRegistrationStartDate}
        registrationEndDate={registrationEndDate}
        setRegistrationEndDate={setRegistrationEndDate}
        lastLoginStartDate={lastLoginStartDate}
        setLastLoginStartDate={setLastLoginStartDate}
        lastLoginEndDate={lastLoginEndDate}
        setLastLoginEndDate={setLastLoginEndDate}
        sort={sort}
        setSort={setSort}
        clearAllFilters={clearAllFilters}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        pagination={pagination}
      />

      <UsersList users={users} isLoading={isLoading} search={search} />
    </div>
  );
};

export default UsersManagement;
