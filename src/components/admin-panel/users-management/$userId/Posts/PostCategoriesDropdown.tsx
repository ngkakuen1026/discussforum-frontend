import { useState } from "react";
import type { categoryType } from "../../../../../types/categoryTypes";
import ClickOutside from "../../../../../hooks/useClickOutside";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

interface PostCategoriesDropdownProps {
  categoryId: string;
  setCategoryId: (v: string) => void;
  setCurrentPage: (v: number) => void;
  categories: categoryType[];
}

const PostCategoriesDropdown = ({
  categoryId,
  setCategoryId,
  setCurrentPage,
  categories = [],
}: PostCategoriesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find(
    (cat) => categoryId === cat.id.toString(),
  );

  return (
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div className="md:col-span-4 relative ">
        <label className="block font-medium text-gray-400 mb-1">Category</label>
        <button
          type="button"
          className="w-full px-6 py-3 border border-gray-700 bg-gray-900 rounded-lg text-left flex items-center justify-between"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>
            {selectedCategory ? selectedCategory.name : "All Categories"}
          </span>
          <ChevronDown size={18} className="text-gray-400" />
        </button>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute mt-1.5 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 py-1 h-128 overflow-auto scrollbar-thin "
          >
            <div
              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-800 transition flex justify-between ${
                categoryId === ""
                  ? "bg-cyan-600/20 text-cyan-400"
                  : "text-gray-300"
              }`}
              onClick={() => {
                setCategoryId("");
                setCurrentPage(1);
                setIsOpen(false);
              }}
            >
              All Categories
              {categoryId === "" && (
                <Check size={18} className="text-cyan-400 inline ml-2" />
              )}
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  setCategoryId(category.id.toString());
                  setCurrentPage(1);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-800 transition ${
                  categoryId === category.id.toString()
                    ? "bg-cyan-600/20 text-cyan-400"
                    : "text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5">{category.name}</div>
                {categoryId === category.id.toString() && (
                  <Check size={18} className="text-cyan-400" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </ClickOutside>
  );
};

export default PostCategoriesDropdown;
