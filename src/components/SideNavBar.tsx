import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import type {
  categoryType,
  groupedCategoryType,
  parentCategoryType,
} from "../types/categoryTypes";
import { categoriesAPI, parentCategoriesAPI } from "../services/http-api";

interface SideNavBarProps {
  onClose: () => void;
}

const SideNavBar = ({ onClose }: SideNavBarProps) => {
  const sideNavRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideNavRef.current &&
        !sideNavRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (parentCategoriesQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <div className="fixed inset-0 flex z-50">
        <div className="bg-[#0E1113] w-96 h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="flex-1 bg-black opacity-50" onClick={onClose} />
      </div>
    );
  }

  if (parentCategoriesQuery.isError || categoriesQuery.isError) {
    return (
      <div className="fixed inset-0 flex z-50">
        <div className="bg-[#0E1113] w-96 h-full flex flex-col items-center justify-center p-6 text-center">
          <p className="text-red-400 mb-4">Failed to load categories</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
          >
            Close
          </button>
        </div>
        <div className="flex-1 bg-black opacity-50" onClick={onClose} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex z-50">
      <motion.div
        ref={sideNavRef}
        className="bg-[#0E1113] w-96 h-full shadow-lg divide-y divide-gray-600 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-[#0E1113]"
        initial={{ x: -250, opacity: 0, scale: 0.8 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: -250, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 50 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold">All Categories</h2>
          <button
            onClick={onClose}
            className="text-white hover:opacity-75 transition-opacity"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 px-4 pb-6 text-white">
          {groupedCategories.map((parent) => (
            <div key={parent.id} className="mb-6 last:mb-0">
              <div className="font-black uppercase tracking-widest text-cyan-500 px-2 mb-2">
                {parent.name}
              </div>
              {parent.children.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {parent.children.map((child, index) => (
                    <div
                      key={`${parent.id}-${index}`}
                      className="p-2.5 cursor-pointer rounded-xl text-left text-sm text-white hover:bg-cyan-700 hover:text-gray-300 transition-all"
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
      </motion.div>
      <div className="flex-1 bg-black opacity-50" onClick={onClose} />
    </div>
  );
};

export default SideNavBar;
