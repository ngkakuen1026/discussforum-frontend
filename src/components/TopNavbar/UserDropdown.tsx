import { Menu, Transition } from "@headlessui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Ban,
  CircleQuestionMark,
  EqualApproximately,
  History,
  House,
  LogOut,
  PencilLine,
  Pin,
  Settings,
  User,
  UserRoundPen,
  UsersRound,
} from "lucide-react";
import { Fragment, type RefObject } from "react";
import type { UserType } from "../../types/userTypes";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";

interface UserDropdownProps {
  userMenuRef: RefObject<HTMLDivElement | null>;
  toggleUserMenu: () => void;
  isLoggedIn: boolean;
  user: UserType | null;
  logout: () => void;
}

export default function UserDropdown({
  userMenuRef,
  toggleUserMenu,
  isLoggedIn,
  user,
  logout,
}: UserDropdownProps) {
  const navigate = useNavigate();

  return (
    <div className="w-24" ref={userMenuRef}>
      {isLoggedIn ? (
        <Menu as="div" className="relative inline-block text-left">
          <div
            onClick={() => {
              toggleUserMenu();
            }}
          >
            <Menu.Button className="cursor-pointer inline-flex w-full justify-center rounded-md px-4 py-2 font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              <img
                src={getUserAvatar(user!)}
                alt="user-icon"
                className="w-12 h-12 rounded-full object-cover border-white border-2"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-4 w-96 divide-y divide-gray-500 origin-top-right rounded-md bg-[#181C1F] shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
              <div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/profile">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <img
                            src={getUserAvatar(user!)}
                            alt="user-icon"
                            className="w-12 h-12 mr-2 rounded-full object-cover border-2"
                          />
                          <div className="grid text-left">
                            <span>Edit Profile</span>
                            <span
                              className={`font-bold ${getUsernameColor(user!)}`}
                            >
                              {user!.username}
                            </span>
                          </div>
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </div>
              <div></div>
              <div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/" search={{ categoryId: 0 }} replace={true}>
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <House className="mr-2 h-5 w-5" aria-hidden="true" />
                          Home
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/public-profile/user/$userId"
                        params={{ userId: user!.id.toString() }}
                      >
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <UserRoundPen
                            className="mr-2 h-5 w-5 hover:text-red"
                            aria-hidden="true"
                          />
                          My Profile
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/user-following">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <UsersRound
                            className="mr-2 h-5 w-5 hover:text-red"
                            aria-hidden="true"
                          />
                          Following
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/blocked-user-list">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <Ban
                            className="mr-2 h-5 w-5 hover:text-red"
                            aria-hidden="true"
                          />
                          Blocked Users
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/post-drafts">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <PencilLine
                            className="mr-2 h-5 w-5 hover:text-red"
                            aria-hidden="true"
                          />
                          Post Drafts
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/browse-history">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <History
                            className="mr-2 h-5 w-5 hover:text-red"
                            aria-hidden="true"
                          />
                          Browse History
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/pins">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <Pin
                            className="mr-2 h-5 w-5 hover:text-red"
                            aria-hidden="true"
                          />
                          Pinned Posts
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </div>
              <div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/about">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <EqualApproximately
                            className="mr-2 h-5 w-5 hover:text-red"
                            aria-hidden="true"
                          />
                          About
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/faq">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <CircleQuestionMark
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          FAQ
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-2 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/setting">
                        <button
                          className={`${
                            active
                              ? "opacity-75 cursor-pointer text-white"
                              : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >
                          <Settings
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          Settings
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </div>
              <div className="px-2 py-4">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active
                          ? "opacity-75 cursor-pointer text-white"
                          : "text-white"
                      } group flex w-full items-center rounded-md px-2 py-2 `}
                      onClick={() => {
                        logout();
                        navigate({ to: "/login" });
                      }}
                    >
                      <LogOut
                        className="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <button
          onClick={() => navigate({ to: "/login" })}
          className="flex items-center justify-center focus:outline-none"
        >
          <User className="w-8 h-8 text-white hover:opacity-75 cursor-pointer" />
        </button>
      )}
    </div>
  );
}
