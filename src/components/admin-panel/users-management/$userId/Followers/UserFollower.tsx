import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import AdminPanelBreadCrumb from "../../../AdminPanelBreadCrumb";
import UserFollowerAction from "./UserFollowerAction";
import authAxios from "../../../../../services/authAxios";
import { adminAPI } from "../../../../../services/http-api";
import { useQuery } from "@tanstack/react-query";
import UserFollowerList from "./UserFollowerList";

const UserFollower = () => {
  const { userId } = useParams({
    from: "/admin-panel/users-management/$userId",
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [registrationStartDate, setRegistrationStartDate] = useState("");
  const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [lastLoginStartDate, setLastLoginStartDate] = useState("");
  const [lastLoginEndDate, setLastLoginEndDate] = useState("");
  const [followedStartDate, setFollowedStartDate] = useState("");
  const [followedEndDate, setFollowedEndDate] = useState("");

  const { data: userFollowersData, isLoading } = useQuery({
    queryKey: [
      "admin-user-followers",
      userId,
      search,
      sort,
      currentPage,
      registrationStartDate,
      registrationEndDate,
      lastLoginStartDate,
      lastLoginEndDate,
      followedStartDate,
      followedEndDate,
      itemsPerPage,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("query", search);
      if (registrationStartDate)
        params.append("registration_start_date", registrationStartDate);
      if (registrationEndDate)
        params.append("registration_end_date", registrationEndDate);
      if (lastLoginStartDate)
        params.append("last_login_start_date", lastLoginStartDate);
      if (lastLoginEndDate)
        params.append("last_login_end_date", lastLoginEndDate);
      if (followedStartDate)
        params.append("followed_start_date", followedStartDate);
      if (followedEndDate) params.append("followed_end_date", followedEndDate);
      if (userId) params.append("author_id", userId.toString());
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      if (sort) params.append("sort", sort);
      const res = await authAxios.get(
        `${adminAPI.url}/user-following/followers/${userId}/search?${params.toString()}`,
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });

  const { data: userData } = useQuery({
    queryKey: ["admin-user-details", userId],
    queryFn: async () => {
      const res = await authAxios.get(
        `${adminAPI.url}/users/user/profile/${userId}`,
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const clearAllFilters = () => {
    setSearch("");
    setSort("");
    setRegistrationStartDate("");
    setRegistrationEndDate("");
    setLastLoginStartDate("");
    setLastLoginEndDate("");
    setFollowedStartDate("");
    setFollowedEndDate("");
    setItemsPerPage(10);
    setCurrentPage(1);
  };

  const userFollowers = userFollowersData?.userFollowerList || [];
  const username = userData?.user?.username || `User${userId}`;
  const pagination = userFollowersData?.pagination || null;

  return (
    <div>
      {" "}
      <AdminPanelBreadCrumb>
        <Link
          to="/admin-panel/users-management"
          className="hover:text-gray-200 hover:underline"
        >
          Users Management
        </Link>{" "}
        &gt;{" "}
        <Link
          to="/admin-panel/users-management/$userId"
          params={{ userId: userId.toString() }}
          className="hover:text-gray-200 hover:underline"
        >
          Users Detail
        </Link>{" "}
        &gt; User Followers
      </AdminPanelBreadCrumb>
      <div className="p-8 mt-8 border border-gray-800 rounded-2xl">
        <UserFollowerAction
          userFollowers={userFollowers}
          userId={userId}
          username={username}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          registrationStartDate={registrationStartDate}
          setRegistrationStartDate={setRegistrationStartDate}
          registrationEndDate={registrationEndDate}
          setRegistrationEndDate={setRegistrationEndDate}
          lastLoginStartDate={lastLoginStartDate}
          setLastLoginStartDate={setLastLoginStartDate}
          lastLoginEndDate={lastLoginEndDate}
          setLastLoginEndDate={setLastLoginEndDate}
          followedStartDate={followedStartDate}
          setFollowedStartDate={setFollowedStartDate}
          followedEndDate={followedEndDate}
          setFollowedEndDate={setFollowedEndDate}
          clearAllFilters={clearAllFilters}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          pagination={pagination}
        />

        <UserFollowerList
          userFollowers={userFollowers}
          isLoading={isLoading}
          userId={userId}
          username={username}
        />
      </div>
    </div>
  );
};

export default UserFollower;
