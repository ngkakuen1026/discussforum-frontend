import { formatDistanceToNow } from "date-fns";
import type { notificationType } from "../../types/notiTypes";
import { formatDate } from "../../utils/dateUtils";

interface NotificationCardProps {
  notification: notificationType;
  selectMode: boolean;
  isSelected: boolean;
  toggleSelection: (id: number) => void;
}

const NotificationCard = ({
  notification,
  selectMode,
  isSelected,
  toggleSelection,
}: NotificationCardProps) => {
  return (
    <div
      className={`border-b border-gray-800/80 last:border-b-0 bg-white/5 transition-all duration-200 cursor-pointer px-4 py-6 rounded-lg flex items-center justify-between ${isSelected ? "ring-2 ring-gray-500 ring-opacity-50 bg-gray-850" : ""} hover:bg-white/10`}
    >
      <div className="flex items-center gap-4">
        {selectMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleSelection(notification.id)}
            className="w-5 h-5 text-gray-500 rounded border-gray-600 focus:ring-gray-400 focus:ring-2"
          />
        )}
        <div>
          <div
            className={`font-semibold text-lg mb-1 ${
              notification.read ? "text-gray-400" : "text-white font-medium"
            }`}
          >
            {notification.message}
          </div>
          <div className="text-gray-400 text-xs">
            {formatDate(notification.created_at)} •{" "}
            {formatDistanceToNow(new Date(notification.created_at))}
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
