import SearchBar from "./TopNavbar/SearchBar";
import SideNavBar from "./SideNavBar";
import { useEffect, useRef, useState } from "react";
import NavTitle from "./TopNavbar/NavTitle";
import NavIcons from "./TopNavbar/NavIcons";
import { useAuth } from "../context/AuthContext";

const TopNavbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [isOn, setIsOn] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  const handleSideNavToggle = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const [showNotiMenu, setShowNotiMenu] = useState(false);
  const notiMenuRef = useRef<HTMLDivElement>(null);
  const [showTranslationMenu, setShowTranslationMenu] = useState(false);
  const translationMenuRef = useRef<HTMLDivElement>(null);
  const [, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notiMenuRef.current &&
        !notiMenuRef.current.contains(e.target as Node) &&
        translationMenuRef.current &&
        !translationMenuRef.current.contains(e.target as Node) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowNotiMenu(false);
        setShowTranslationMenu(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notiMenuRef, translationMenuRef, userMenuRef]);

  const toggleNotiMenu = () => {
    setShowNotiMenu((prev) => {
      const newState = !prev;
      if (newState) {
        setShowTranslationMenu(false);
        setShowUserMenu(false);
      }
      return newState;
    });
  };

  const toggleTranslationMenu = () => {
    setShowTranslationMenu((prev) => {
      const newState = !prev;
      if (newState) {
        setShowNotiMenu(false);
        setShowUserMenu(false);
      }
      return newState;
    });
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => {
      const newState = !prev;
      if (newState) {
        setShowNotiMenu(false);
        setShowTranslationMenu(false);
      }
      return newState;
    });
  };

  return (
    <div className="px-8 py-2 flex gap-4 items-center justify-evenly bg-[#0E1113]">
      <NavTitle />
      <SearchBar />
      <NavIcons
        handleSideNavToggle={handleSideNavToggle}
        handleToggle={handleToggle}
        isOn={isOn}
        notiMenuRef={notiMenuRef}
        translationMenuRef={translationMenuRef}
        userMenuRef={userMenuRef}
        toggleNotiMenu={toggleNotiMenu}
        toggleTranslationMenu={toggleTranslationMenu}
        toggleUserMenu={toggleUserMenu}
        showNotiMenu={showNotiMenu}
        showTranslationMenu={showTranslationMenu}
        setShowNotiMenu={setShowNotiMenu}
        setShowTranslationMenu={setShowTranslationMenu}
        isLoggedIn={isLoggedIn}
        user={user}
        logout={logout}
      />

      {isSideNavOpen && <SideNavBar onClose={handleSideNavToggle} />}
    </div>
  );
};

export default TopNavbar;
