import { useNavigate } from "@tanstack/react-router";
import { Bell, MoveUpRight, Settings, X } from "lucide-react";
import { type RefObject } from "react";
import { motion } from "framer-motion"; // Import Framer Motion

interface NotiMenuProps {
  showNotiMenu: boolean;
  setShowNotiMenu: (value: boolean) => void;
  notiMenuRef: RefObject<HTMLDivElement | null>;
  toggleNotiMenu: () => void;
}

const NotiMenu = ({
  showNotiMenu,
  setShowNotiMenu,
  notiMenuRef,
  toggleNotiMenu,
}: NotiMenuProps) => {
  const navigate = useNavigate();

  const mockNotiData = [
    { id: 1, message: "Noti 1", created_at: new Date(Date.now()), read: false },
    { id: 2, message: "Noti 2", created_at: new Date(Date.now()), read: true },
    { id: 3, message: "Noti 3", created_at: new Date(Date.now()), read: true },
    { id: 4, message: "Noti 4", created_at: new Date(Date.now()), read: true },
    { id: 5, message: "Noti 5", created_at: new Date(Date.now()), read: false },
    { id: 6, message: "Noti 6", created_at: new Date(Date.now()), read: false },
  ];

  return (
    <div className="relative" ref={notiMenuRef}>
      <button
        onClick={toggleNotiMenu}
        className="flex items-center justify-center focus:outline-none relative cursor-pointer hover:opacity-75"
        title="Notifications"
      >
        <Bell className="text-white w-7 h-7" />
        {mockNotiData.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
            {mockNotiData.length}
          </span>
        )}
      </button>
      {showNotiMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute right-0 top-full mt-8 w-full md:w-96 bg-[#181C1F] text-white rounded-md shadow-lg z-50 divide-y divide-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-semibold text-white">
                Notifications
              </h1>
              <button
                title="Notification Settings"
                onClick={() => {
                  setShowNotiMenu(false);
                  navigate({ to: "/settings/notifications" });
                }}
              >
                <Settings className="w-7 h-7 cursor-pointer hover:opacity-75 transition" />
              </button>
            </div>
            <h2 className="flex  items-center">
              <span className="text-gray-500">
                ({mockNotiData.length}){" "}
                {mockNotiData.length > 1 ? "notifications" : "notification"}
              </span>
            </h2>
          </div>
          <div className="p-4">
            {mockNotiData.length === 0 ? (
              <p className="text-gray-500 text-sm">No Notifications.</p>
            ) : (
              <ul>
                {mockNotiData.slice(0, 8).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 py-2 cursor-pointer hover:bg-gray-800 transition"
                  >
                    <div
                      className={`grow ${item.read ? "text-white" : "text-gray-500"}`}
                    >
                      <p className="">{item.message}</p>
                      <span className="text-sm">{item.created_at.toLocaleString("en-US")}</span>
                    </div>
                    <X size={16} className="hover:opacity-50 cursor-pointer" />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 flex justify-between">
            <span className="py-2 rounded transition flex items-center gap-2 cursor-pointer hover:opacity-75">
              Mark all as read
            </span>
            <span
              className="py-2 rounded transition flex items-center gap-2 cursor-pointer hover:opacity-75 text-white"
              onClick={() => {
                setShowNotiMenu(false);
                navigate({ to: "/notifications" });
              }}
            >
              View More
              <MoveUpRight size={16} />
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NotiMenu;
