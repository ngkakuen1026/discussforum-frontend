import { Search, X } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import type { PostRouteSearch } from "../../types/routeTypes";
import { useEffect, useState } from "react";

const SearchBar = () => {
  const navigate = useNavigate();
  const router = useRouter();

  const currentSearch =
    router.state.matches.find((m) => m.routeId === "/")?.search || {};
  const currentQuery = (currentSearch as PostRouteSearch).query || "";

  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/",
      search: (prev: PostRouteSearch) => ({
        categoryId: prev.categoryId || 0,
        query: query.trim(),
        page: undefined,
      }),
      replace: false,
    });
  };

  return (
    <form
      className="max-w-md mx-auto w-full"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search size={12} className="text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
          placeholder="Search Posts... (Enter to process)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div
          className="absolute inset-y-0 end-0 flex items-center pr-3 cursor-pointer hover:opacity-75"
          onClick={() => setQuery("")}
        >
          <X size={12} className="text-gray-500 dark:text-gray-400 " />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
