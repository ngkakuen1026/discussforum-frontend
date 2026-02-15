import { Link, useNavigate } from "@tanstack/react-router";
import { CirclePlus, User } from "lucide-react";
import UserDropdown from "./UserDropdown";
import type { RefObject } from "react";
import NotiMenu from "./NotiMenu/NotiMenu";
import TranslationMenu from "./TranslationMenu/TranslationMenu";
import type { UserType } from "../../types/userTypes";
import ThemeMenu from "./ThemeMenu/ThemeMenu";

interface NavIconProps {
  handleSideNavToggle: () => void;
  notiMenuRef: RefObject<HTMLDivElement | null>;
  translationMenuRef: RefObject<HTMLDivElement | null>;
  themeMenuRef: RefObject<HTMLDivElement | null>;
  userMenuRef: RefObject<HTMLDivElement | null>;
  toggleNotiMenu: () => void;
  toggleTranslationMenu: () => void;
  toggleThemeMenu: () => void;
  toggleUserMenu: () => void;
  showNotiMenu: boolean;
  showThemeMenu: boolean;
  showTranslationMenu: boolean;
  setShowNotiMenu: (value: boolean) => void;
  setShowThemeMenu: (value: boolean) => void;
  setShowTranslationMenu: (value: boolean) => void;
  isLoggedIn: boolean;
  user: UserType | null;
  logout: () => void;
}

const NavIcons = ({
  notiMenuRef,
  translationMenuRef,
  themeMenuRef,
  userMenuRef,
  toggleNotiMenu,
  toggleTranslationMenu,
  toggleThemeMenu,
  toggleUserMenu,
  showNotiMenu,
  showThemeMenu,
  showTranslationMenu,
  setShowNotiMenu,
  setShowThemeMenu,
  setShowTranslationMenu,
  isLoggedIn,
  user,
  logout,
}: NavIconProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 items-center justify-around">
      {isLoggedIn && (
        <>
          <button title="Add New Post">
            <Link to="/add-post" target="_blank">
              <CirclePlus className=" w-7 h-7 cursor-pointer hover:opacity-75" />
            </Link>
          </button>
          <NotiMenu
            showNotiMenu={showNotiMenu}
            setShowNotiMenu={setShowNotiMenu}
            notiMenuRef={notiMenuRef}
            toggleNotiMenu={toggleNotiMenu}
          />
        </>
      )}

      <TranslationMenu
        showTranslationMenu={showTranslationMenu}
        setShowTranslationMenu={setShowTranslationMenu}
        translationMenuRef={translationMenuRef}
        toggleTranslationMenu={toggleTranslationMenu}
      />

      <ThemeMenu
        showThemeMenu={showThemeMenu}
        setShowThemeMenu={setShowThemeMenu}
        themeMenuRef={themeMenuRef}
        toggleThemeMenu={toggleThemeMenu}
      />

      {isLoggedIn ? (
        <UserDropdown
          userMenuRef={userMenuRef}
          toggleUserMenu={toggleUserMenu}
          user={user}
          logout={logout}
        />
      ) : (
        <button
          onClick={() => navigate({ to: "/login" })}
          className="flex items-center justify-center focus:outline-none"
        >
          <User size={24} className="cursor-pointer hover:opacity-75 " />
        </button>
      )}
    </div>
  );
};

export default NavIcons;
