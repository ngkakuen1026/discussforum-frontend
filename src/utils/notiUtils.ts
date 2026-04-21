import type { NavigateOptions } from "@tanstack/react-router";
import { toast } from "sonner";
import type { notificationType } from "../types/notiTypes";

export const handleNotificationClick = (
    noti: notificationType,
    navigate: (options: NavigateOptions) => void,
    setShowNotiMenu?: (value: boolean) => void
) => {
    if (!noti.related_id) {
        toast.info("This notification has no linked content");
        return;
    }

    if (setShowNotiMenu) {
        setShowNotiMenu(false);
    }

    switch (noti.type) {
        case "follow":
        case "unfollow":
            navigate({
                to: "/public-profile/user/$userId",
                params: { userId: noti.related_id.toString() },
                search: undefined,
            });
            break;

        case "post":
        case "mention":
        case "like":
        case "dislike":
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
            toast.info("This content was deleted by an admin");
            break;

        default:
            toast.info("Cannot navigate to this notification");
    }
};