import { Link } from "@tanstack/react-router";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import { Bell, CirclePlus, Languages, Moon, Sun } from "lucide-react";
import { useState } from "react";

const TopNavbar = () => {
  // For later theme switch
  const [isOn, setIsOn] = useState(false);
  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="px-8 py-4 flex gap-4 items-center justify-evenly bg-[#0E1113]">
      <div className="flex gap-4">
        <Link to="/" className="flex items-center text-4xl">
          <img src="src\assets\icon.svg" className="w-24 h-24" />
          <span className="text-orange-600 dark:text-white ">ChatterNest</span>
        </Link>
      </div>
      <div className="w-full">
        <SearchBar />
      </div>
      <div className="flex gap-4 items-center justify-around">
        <CirclePlus className="text-white w-8 h-8 cursor-pointer hover:opacity-75" />
        <Bell className="text-white w-8 h-8 cursor-pointer hover:opacity-75" />
        <button onClick={handleToggle}>
          {isOn ? (
            <Sun className="text-white w-8 h-8 cursor-pointer hover:opacity-75" />
          ) : (
            <Moon className="text-white w-8 h-8 cursor-pointer hover:opacity-75" />
          )}
        </button>
        <Languages className="text-white w-8 h-8 cursor-pointer hover:opacity-75" />
        <Dropdown />
      </div>
    </div>
  );
};

export default TopNavbar;
