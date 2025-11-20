import { useNavigate } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import authAxios from "../../services/authAxios";
import type {
  categoryType,
  groupedCategoryType,
  parentCategoryType,
} from "../../types/categoryTypes";
import { categoriesAPI, parentCategoriesAPI } from "../../services/http-api";

interface CategoryListProps {
  selectedCategoryId: number | 0;
}

const CategoryList = ({ selectedCategoryId }: CategoryListProps) => {
  const navigate = useNavigate({ from: "/" });
  const [parentCategoriesQuery, categoriesQuery] = useQueries({
    queries: [
      {
        queryKey: ["parent-categories"],
        queryFn: async (): Promise<parentCategoryType[]> => {
          const res = await authAxios.get(
            `${parentCategoriesAPI.url}/all-parent-categories`
          );
          return res.data.parentCategories;
        },
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["categories"],
        queryFn: async (): Promise<categoryType[]> => {
          const res = await authAxios.get(
            `${categoriesAPI.url}/all-categories`
          );
          return res.data.categories;
        },
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  const parentCategories = parentCategoriesQuery.data ?? [];
  const allCategories = categoriesQuery.data ?? [];

  const groupedCategories: groupedCategoryType[] = parentCategories.map(
    (parent) => {
      const children = allCategories
        .filter((cat) => cat.parent_id === parent.id)
        .map((cat) => ({ id: cat.id, name: cat.name }));

      return {
        id: parent.id,
        name: parent.name,
        children,
      };
    }
  );

  const handleCategoryClick = (categoryId: number | 0) => {
    console.log("Navigating to category:", categoryId);
    navigate({
      search: { categoryId: categoryId },
      replace: true,
    });
  };

  if (parentCategoriesQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <div className="bg-[#0E1113] h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (parentCategoriesQuery.isError || categoriesQuery.isError) {
    return (
      <div className="bg-[#0E1113] h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 mb-4">Failed to load categories</p>
        <button className="px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col justify-between p-6 border-b border-gray-700">
        <h2 className="text-white text-lg font-semibold">All Categories</h2>
        <p className="text-gray-500 text-sm">
          Select the category's post you like!
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 px-4 pb-6 text-white">
        <div
          onClick={() => handleCategoryClick(0)}
          className={`p-2.5 cursor-pointer rounded-xl text-left text-sm font-semibold transition-all mb-4 ${
            selectedCategoryId === 0
              ? "bg-cyan-700 text-white"
              : "hover:bg-cyan-700 hover:text-gray-300"
          }`}
        >
          All Posts
        </div>

        {groupedCategories.map((parent) => (
          <div key={parent.id} className="mb-6 last:mb-0">
            <div className="font-black uppercase tracking-widest text-cyan-500 px-2 mb-2">
              {parent.name}
            </div>

            {parent.children.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {parent.children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => handleCategoryClick(child.id)}
                    className={`p-2.5 cursor-pointer rounded-xl text-left text-sm transition-all ${
                      selectedCategoryId === child.id
                        ? "bg-cyan-700 text-white"
                        : "hover:bg-cyan-700 hover:text-gray-300"
                    }`}
                  >
                    {child.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm px-2">No subcategories</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
