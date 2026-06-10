import { Link, useParams } from "@tanstack/react-router";
import AdminPanelBreadCrumb from "../../../AdminPanelBreadCrumb";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { adminAPI, categoriesAPI } from "../../../../../services/http-api";
import authAxios from "../../../../../services/authAxios";
import UserPostAction from "./UserPostAction";
import UserPostList from "./UserPostList";

const UserPost = () => {
  const { userId } = useParams({
    from: "/admin-panel/users-management/$userId",
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [postId, setPostId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minVotes, setMinVotes] = useState("");

  const { data: userPostsData, isLoading } = useQuery({
    queryKey: [
      "admin-user-posts",
      userId,
      postId,
      search,
      sort,
      currentPage,
      categoryId,
      startDate,
      endDate,
      minVotes,
      itemsPerPage,
    ],
    queryFn: async () => {
      const isAdvanced =
        !!search ||
        !!postId ||
        !!categoryId ||
        !!startDate ||
        !!endDate ||
        !!minVotes ||
        !!sort;
      if (isAdvanced) {
        const params = new URLSearchParams();
        if (search) params.append("query", search);
        if (postId) params.append("post_id", postId);
        if (categoryId) params.append("category_id", categoryId);
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);
        if (minVotes) params.append("min_votes", minVotes);
        if (userId) params.append("author_id", userId.toString());
        params.append("page", currentPage.toString());
        params.append("limit", itemsPerPage.toString());
        if (sort) params.append("sort", sort);
        const res = await authAxios.get(
          `${adminAPI.url}/posts/search-posts?${params.toString()}`,
        );
        return res.data;
      } else {
        const res = await authAxios.get(
          `${adminAPI.url}/posts/user/${userId}?page=${currentPage}&limit=${itemsPerPage}`,
        );
        return res.data;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await authAxios.get(`${categoriesAPI.url}/all-categories`);
      return res.data.categories;
    },
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
    setPostId("");
    setCategoryId("");
    setStartDate("");
    setEndDate("");
    setMinVotes("");
    setItemsPerPage(10);
    setCurrentPage(1);
  };

  const posts = userPostsData?.posts || userPostsData?.publicUserPosts || [];
  const username = userData?.user?.username || `User${userId}`;
  const pagination = userPostsData?.pagination || null;

  return (
    <div>
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
        &gt; User Posts
      </AdminPanelBreadCrumb>

      <div className="p-8 mt-8 border border-gray-800 rounded-2xl">
        <UserPostAction
          posts={posts}
          username={username}
          userId={userId}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          postId={postId}
          setPostId={setPostId}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          minVotes={minVotes}
          setMinVotes={setMinVotes}
          clearAllFilters={clearAllFilters}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          categories={categoriesData}
          pagination={pagination}
        />

        <UserPostList posts={posts} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default UserPost;
