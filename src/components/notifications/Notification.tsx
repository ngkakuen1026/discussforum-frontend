import NotificationToolbar from "./NotificationToolbar";
import NotificationCard from "./NotificationCard";
import { useNotifications } from "../../context/NotificationContext";
import { useState, useRef, useEffect, useCallback } from "react";

const Notification = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    refetch,
    markAllAsRead,
    deleteNotification,
    isMarkingAll,
  } = useNotifications();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<
    number[]
  >([]);

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(15);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 10, notifications.length));
  }, [notifications.length]);

  useEffect(() => {
    if (visibleCount >= notifications.length) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1 },
    );
    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleLoadMore, visibleCount, notifications.length]);

  if (isLoading) {
    return (
      <div className="container mx-auto pt-6">
        <div className="animate-pulse text-white text-2xl">
          Loading notifications...
        </div>
      </div>
    );
  }

  // Selection mode logic
  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedNotificationIds([]);
  };

  const toggleSelection = (id: number) => {
    setSelectedNotificationIds((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedNotificationIds.length === notifications.length) {
      setSelectedNotificationIds([]);
    } else {
      setSelectedNotificationIds(notifications.map((n) => n.id));
    }
  };

  const deleteSelected = () => {
    if (selectedNotificationIds.length === 0) return;
    const confirmed = window.confirm(
      `Delete ${selectedNotificationIds.length} notification${selectedNotificationIds.length > 1 ? "s" : ""}?\n\nThis action cannot be undone.`,
    );
    if (confirmed) {
      selectedNotificationIds.forEach((id) => deleteNotification(id));
      setSelectedNotificationIds([]);
      setSelectMode(false);
    }
  };

  return (
    <div className="container mx-auto pt-6">
      <NotificationToolbar
        unreadCount={unreadCount}
        isMarkingAll={isMarkingAll}
        refetch={refetch}
        markAllAsRead={markAllAsRead}
        selectMode={selectMode}
        selectedNotificationIds={selectedNotificationIds}
        notifications={notifications}
        toggleSelectMode={toggleSelectMode}
        selectAll={selectAll}
        deleteSelected={deleteSelected}
      />

      <div className="mt-6 space-y-4">
        {isError ? (
          <div>Error loading notifications.</div>
        ) : notifications.length === 0 ? (
          <div>No notifications found.</div>
        ) : (
          <>
            {notifications.slice(0, visibleCount).map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                selectMode={selectMode}
                isSelected={selectedNotificationIds.includes(notification.id)}
                toggleSelection={toggleSelection}
              />
            ))}
            {visibleCount < notifications.length && (
              <div
                ref={observerRef}
                className="text-lg flex items-center justify-center text-gray-400"
              >
                Loading more...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notification;
