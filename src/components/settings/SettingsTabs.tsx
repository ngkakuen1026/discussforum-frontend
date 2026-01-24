import { Link } from "@tanstack/react-router";

const tabs = [
  { label: "Account", to: "/settings/account" },
  { label: "Profile", to: "/settings/profile" },
  { label: "Privacy", to: "/settings/privacy" },
  { label: "Preferences", to: "/settings/preferences" },
  { label: "Notifications", to: "/settings/notifications" },
  { label: "Posts", to: "/settings/posts" },
];

export default function SettingsTabs() {
  return (
    <nav className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className="pb-4 px-2 text-lg font-medium whitespace-nowrap transition-colors text-gray-400 hover:text-gray-200 hover:border-b-2 hover:border-gray-500"
          activeProps={{
            className: "text-white border-b-2 border-white",
          }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
