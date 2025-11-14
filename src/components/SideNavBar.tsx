import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

interface SideNavBarProps {
  onClose: () => void;
}

const SideNavBar = ({ onClose }: SideNavBarProps) => {
  const sideNavRef = useRef<HTMLDivElement>(null);

  

  const categories = [
    {
      id: 1,
      name: "Parent Category 1",
      children: [
        "Category 1.1",
        "Category 1.2",
        "Category 1.3",
        "Category 1.3",
        "Category 1.3",
        "Category 1.3",
        "Category 1.3",
        "Category 1.3",
        "Category 1.3",
        "Category 1.3",
        "Category 1.3",
        "Category 1.3",
      ],
    },
    {
      id: 2,
      name: "Parent Category 2",
      children: [
        "Category 2.1",
        "Category 2.2",
        "Category 2.2",
        "Category 2.2",
        "Category 2.2",
        "Category 2.2",
        "Category 2.2",
        "Category 2.2",
        "Category 2.2",
      ],
    },
    {
      id: 3,
      name: "Parent Category 3",
      children: [
        "Category 3.1",
        "Category 3.2",
        "Category 3.3",
        "Category 3.4",
        "Category 3.1",
        "Category 3.2",
        "Category 3.3",
        "Category 3.4",
        "Category 3.1",
        "Category 3.2",
        "Category 3.3",
        "Category 3.4",
      ],
    },
    {
      id: 4,
      name: "Parent Category 4",
      children: [
        "Category 4.1",
        "Category 4.2",
        "Category 4.3",
        "Category 4.4",
        "Category 4.1",
        "Category 4.2",
        "Category 4.3",
        "Category 4.4",
        "Category 4.1",
        "Category 4.2",
        "Category 4.3",
        "Category 4.4",
      ],
    },
    {
      id: 5,
      name: "Parent Category 5",
      children: [
        "Category 5.1",
        "Category 5.2",
        "Category 5.3",
        "Category 5.4",
        "Category 5.1",
        "Category 5.2",
        "Category 5.3",
        "Category 5.4",
      ],
    },
    {
      id: 6,
      name: "Other",
      children: [
        "Category 5.1",
        "Category 5.2",
      ],
    }
  ];

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
        <div className="flex justify-between items-center p-4 ">
          <h2 className="text-white text-lg">All Categories</h2>
          <button
            onClick={onClose}
            className="text-white hover:opacity-75 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
        <div className="mt-4 px-4 text-white">
          {categories.map((parent) => (
            <div key={parent.id} className="mb-4">
              <div className="font-semibold px-2">{parent.name}</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {parent.children.map((child, index) => (
                  <div key={index} className="p-2 cursor-pointer rounded-xl text-left hover:opacity-75 hover:bg-gray-600">
                    {child}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="bg-black opacity-50" onClick={onClose}></div>
    </div>
  );
};

export default SideNavBar;
