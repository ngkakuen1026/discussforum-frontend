import { formatDistanceToNow } from "date-fns";
import type { notificationType } from "../../types/notiTypes";
import { formatDate } from "../../utils/dateUtils";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate();

  const handleNotificationClick = (noti: notificationType) => {
    if (!noti.related_id) {
      toast.info("This notification has no linked content");
      return;
    }

    switch (noti.type) {
      case "follow":
      case "unfollow":
        navigate({
          to: "/public-profile/user/$userId",
          params: { userId: noti.related_id.toString() },
        });
        break;

      case "post":
      case "mention":
      case "like":
      case "dislike":
        navigate({
          to: "/posts/$postId",
          params: { postId: noti.related_id.toString() },
          search: { page: undefined },
        });
        break;

      case "comment":
      case "comment_reply":
        navigate({
          to: "/posts/$postId",
          params: { postId: noti.related_id.toString() },
          search: { page: undefined },
        });
        break;

      case "admin_post_delete":
      case "admin_comment_delete":
        toast.info("This content was deleted by admin");
        break;

      default:
        toast.info("Cannot navigate to this notification");
    }
  };

  return (
    <div
      className={`border-b border-gray-800/80 last:border-b-0 bg-white/5 transition-all duration-200 cursor-pointer px-4 py-6 rounded-lg flex items-center justify-between ${isSelected ? "ring-2 ring-gray-500 ring-opacity-50 bg-gray-850" : ""} hover:bg-white/10`}
      onClick={() => handleNotificationClick(notification)}
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
