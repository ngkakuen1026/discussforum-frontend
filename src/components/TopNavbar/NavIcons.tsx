import { Link } from "@tanstack/react-router";
import { CirclePlus, LayoutGrid, Moon, Sun } from "lucide-react";
import UserDropdown from "./UserDropdown";
import type { RefObject } from "react";
import NotiMenu from "./NotiMenu/NotiMenu";
import TranslationMenu from "./TranslationMenu/TranslationMenu";
import type { UserType } from "../../types/userTypes";

interface NavIconProps {
  handleSideNavToggle: () => void;
  handleToggle: () => void;
  isOn: boolean;
  notiMenuRef: RefObject<HTMLDivElement | null>;
  translationMenuRef: RefObject<HTMLDivElement | null>;
  userMenuRef: RefObject<HTMLDivElement | null>;
  toggleNotiMenu: () => void;
  toggleTranslationMenu: () => void;
  toggleUserMenu: () => void;
  showNotiMenu: boolean;
  showTranslationMenu: boolean;
  setShowNotiMenu: (value: boolean) => void;
  setShowTranslationMenu: (value: boolean) => void;
  isLoggedIn: boolean;
  user: UserType | null;
  logout: () => void;
}

const NavIcons = ({
  handleSideNavToggle,
  handleToggle,
  isOn,
  notiMenuRef,
  translationMenuRef,
  userMenuRef,
  toggleNotiMenu,
  toggleTranslationMenu,
  toggleUserMenu,
  showNotiMenu,
  showTranslationMenu,
  setShowNotiMenu,
  setShowTranslationMenu,
  isLoggedIn,
  user,
  logout,
}: NavIconProps) => {
  return (
    <div className="flex gap-4 items-center justify-around">
      <button title="Category List" onClick={handleSideNavToggle}>
        <LayoutGrid className="text-white w-7 h-7 cursor-pointer hover:opacity-75" />
      </button>

      {isLoggedIn ? (
        <>
          <button title="Add New Post">
            <Link to="/add-post">
              <CirclePlus className="text-white w-7 h-7 cursor-pointer hover:opacity-75" />
            </Link>
          </button>
          <NotiMenu
            showNotiMenu={showNotiMenu}
            setShowNotiMenu={setShowNotiMenu}
            notiMenuRef={notiMenuRef}
            toggleNotiMenu={toggleNotiMenu}
          />
        </>
      ) : null}

      <TranslationMenu
        showTranslationMenu={showTranslationMenu}
        setShowTranslationMenu={setShowTranslationMenu}
        translationMenuRef={translationMenuRef}
        toggleTranslationMenu={toggleTranslationMenu}
      />

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
      <UserDropdown
        userMenuRef={userMenuRef}
        toggleUserMenu={toggleUserMenu}
        isLoggedIn={isLoggedIn}
        user={user}
        logout={logout}
      />
    </div>
  );
};

export default NavIcons;
