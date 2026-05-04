import { useAuth } from "../../context/AuthContext";
import { Link } from "@tanstack/react-router";
import { UserRoleTag } from "../UserRoleTag";
import { getUsernameColor } from "../../utils/userUtils";
import {
  Flag,
  House,
  LayoutDashboard,
  LayoutGrid,
  StickyNote,
  Tags,
  UsersRound,
} from "lucide-react";

const AdminPanelTabs = () => {
  const { user } = useAuth();

  const iconStyle = "w-6 h-6";

  const overviewTabs = [
    {
      icon: <LayoutDashboard className={iconStyle} />,
      label: "Dashboard",
      to: "/admin-panel/dashboard",
    },
  ];

  const managementTabs = [
    {
      icon: <UsersRound className={iconStyle} />,
      label: "Users",
      to: "/admin-panel/users-management",
    },
    {
      icon: <StickyNote className={iconStyle} />,
      label: "Posts",
      to: "/admin-panel/posts-management",
    },
    {
      icon: <Tags className={iconStyle} />,
      label: "Tags",
      to: "/admin-panel/tags-management",
    },
    {
      icon: <LayoutGrid className={iconStyle} />,
      label: "Categories",
      to: "/admin-panel/categories-management",
    },
    {
      icon: <Flag className={iconStyle} />,
      label: "Reports",
      to: "/admin-panel/reports-management",
    },
  ];

  return (
    <nav className="flex flex-col h-full min-h-screen px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <img src="/icon.svg" alt="forum-icon" className="w-36 h-36 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Chatter Nest</h1>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <div className="border-2 border-gray-800 rounded-lg p-4 flex mb-8">
        <img
          src={user?.profile_image}
          alt="user-icon"
          className="w-24 h-24 rounded-full object-cover border-2 dark:border-white border-gray-800"
        />
        <div className="text-left gap-2 ml-4">
          <p className={`font-bold text-lg`}>
            {user?.first_name}, {user?.last_name}
          </p>
          <p
            className={`font-bold text-lg ${getUsernameColor({
              author_is_admin: user?.is_admin,
            })}`}
          >
            {user?.username}
          </p>
          <UserRoleTag user={{ author_is_admin: user?.is_admin }} />
        </div>
      </div>
      <div className="flex flex-col space-y-4 overflow-y-auto pb-4 scrollbar-hide">
        <h1 className="px-2 text-lg text-gray-400">Site Overview</h1>
        {overviewTabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className="p-2 text-lg font-medium whitespace-nowrap transition-colors hover:text-gray-500 items-center rounded-xl flex gap-2"
            activeProps={{
              className: "bg-gray-800 border-white",
            }}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col space-y-4 overflow-y-auto pb-4 scrollbar-hide">
        <h1 className="px-2 text-lg text-gray-400">Management</h1>
        {managementTabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className="p-2 text-lg font-medium whitespace-nowrap transition-colors hover:text-gray-500 items-center rounded-xl flex gap-2"
            activeProps={{
              className: "bg-gray-800 border-white",
            }}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </div>

      <Link
        to="/"
        search={{ categoryId: 0 }}
        replace={true}
        className="group flex w-full items-center rounded-md px-2 py-2 hover:opacity-75 cursor-pointer text-lg p-2 gap-2 text-red-400 mt-auto"
      >
        <House className={iconStyle} />
        Exit Admin Panel
      </Link>
    </nav>
  );
};

export default AdminPanelTabs;
