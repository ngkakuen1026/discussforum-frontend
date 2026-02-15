import SearchBar from "./TopNavbar/SearchBar";
import { useEffect, useRef, useState } from "react";
import NavTitle from "./TopNavbar/NavTitle";
import NavIcons from "./TopNavbar/NavIcons";
import { useAuth } from "../context/AuthContext";

const TopNavbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const handleSideNavToggle = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const [showNotiMenu, setShowNotiMenu] = useState(false);
  const notiMenuRef = useRef<HTMLDivElement>(null);
  const [showTranslationMenu, setShowTranslationMenu] = useState(false);
  const translationMenuRef = useRef<HTMLDivElement>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
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
        !userMenuRef.current.contains(e.target as Node) &&
        themeMenuRef.current &&
        !themeMenuRef.current.contains(e.target as Node)
      ) {
        setShowNotiMenu(false);
        setShowTranslationMenu(false);
        setShowThemeMenu(false);
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
        setShowThemeMenu(false);
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
        setShowThemeMenu(false);
      }
      return newState;
    });
  };

  const toggleThemeMenu = () => {
    setShowThemeMenu((prev) => {
      const newState = !prev;
      if (newState) {
        setShowNotiMenu(false);
        setShowTranslationMenu(false);
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
        setShowThemeMenu(false);
      }
      return newState;
    });
  };

  return (
    <div className="px-8 py-2 flex gap-4 items-center justify-evenly bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark border-b border-gray-400 dark:border-gray-800">
      <NavTitle />
      <SearchBar />
      <NavIcons
        handleSideNavToggle={handleSideNavToggle}
        notiMenuRef={notiMenuRef}
        translationMenuRef={translationMenuRef}
        themeMenuRef={themeMenuRef}
        userMenuRef={userMenuRef}
        toggleNotiMenu={toggleNotiMenu}
        toggleTranslationMenu={toggleTranslationMenu}
        toggleThemeMenu={toggleThemeMenu}
        toggleUserMenu={toggleUserMenu}
        showNotiMenu={showNotiMenu}
        showThemeMenu={showThemeMenu}
        showTranslationMenu={showTranslationMenu}
        setShowNotiMenu={setShowNotiMenu}
        setShowThemeMenu={setShowThemeMenu}
        setShowTranslationMenu={setShowTranslationMenu}
        isLoggedIn={isLoggedIn}
        user={user}
        logout={logout}
      />
    </div>
  );
};

export default TopNavbar;
