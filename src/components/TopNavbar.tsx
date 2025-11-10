import { Link } from "@tanstack/react-router";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import {
  Bell,
  CirclePlus,
  Languages,
  LayoutGrid,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";

const TopNavbar = () => {
  // For later theme switch
  const [isOn, setIsOn] = useState(false);
  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="px-8 py-2 flex gap-4 items-center justify-evenly bg-[#0E1113]">
      <div className="flex gap-4">
        <Link to="/" className="flex items-center text-2xl">
          <img src="src\assets\icon.svg" className="w-20 h-20" />
          <span className="text-orange-600 dark:text-white">ChatterNest</span>
        </Link>
      </div>
      <div className="w-full">
        <SearchBar />
      </div>
      <div className="flex gap-4 items-center justify-around">
        <button title="Category List">
          <LayoutGrid className="text-white w-7 h-7 cursor-pointer hover:opacity-75" />
        </button>

        <button title="Add New Post">
          <Link to="/addPost">
            <CirclePlus className="text-white w-7 h-7 cursor-pointer hover:opacity-75" />
          </Link>
        </button>
        <button title="Notifications">
          <Bell className="text-white w-7 h-7 cursor-pointer hover:opacity-75" />
        </button>
        <button
          onClick={handleToggle}
          title={isOn ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isOn ? (
            <Sun className="text-white w-7 h-7 cursor-pointer hover:opacity-75" />
          ) : (
            <Moon className="text-white w-7 h-7 cursor-pointer hover:opacity-75" />
          )}
        </button>
        <button title="Translations">
          <Languages className="text-white w-7 h-7 cursor-pointer hover:opacity-75" />
        </button>
        <Dropdown />
      </div>
    </div>
  );
};

export default TopNavbar;
