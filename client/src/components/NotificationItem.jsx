import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

function formatTimestamp(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
}

export default function NotificationItem({ notification, onClose }) {
  const { state, dispatch } = useNotifications();
  const markAsRead = useMutation({
    mutationFn: (id) => apiClient.patch(`/api/notifications/${encodeURIComponent(id)}/read`),
    onMutate: (id) => {
      const previousNotification = state.notifications.find((item) => item.id === id);
      dispatch({ type: "MARK_READ", payload: id });
      return { previousNotification };
    },
    onError: (_error, _id, context) => {
      if (context?.previousNotification) {
        dispatch({ type: "RESTORE_NOTIFICATION", payload: context.previousNotification });
      }
    },
    onSuccess: () => onClose(),
  });

  function handleClick() {
    if (notification.isRead) {
      onClose();
      return;
    }
    markAsRead.mutate(notification.id);
  }

  const read = notification.isRead;

  return (
    <div style={{
      padding: "0.85rem 1rem",
      borderBottom: "1px solid #f1f5f9",
      background: read ? "#fff" : "#eef2ff",
    }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={markAsRead.isPending}
        aria-label={`${read ? "Read" : "Mark as read"}: ${notification.message}`}
        style={{
          display: "block", width: "100%", padding: 0, border: 0,
          background: "transparent", color: "inherit", cursor: "pointer",
          textAlign: "left", opacity: markAsRead.isPending ? 0.65 : 1,
        }}
      >
        <span style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
          <span
            aria-hidden="true"
            style={{
              flex: "0 0 auto", width: "0.5rem", height: "0.5rem",
              marginTop: "0.35rem", borderRadius: "50%",
              background: read ? "#cbd5e1" : "#4f46e5",
            }}
          />
          <span style={{ minWidth: 0 }}>
            <span style={{
              display: "block", fontSize: "0.9rem", lineHeight: 1.4,
              fontWeight: read ? 400 : 600,
            }}>
              {notification.message}
            </span>
            <time
              dateTime={notification.createdAt}
              style={{ display: "block", marginTop: "0.35rem", color: "#64748b", fontSize: "0.75rem" }}
            >
              {formatTimestamp(notification.createdAt)}
            </time>
          </span>
        </span>
      </button>
      {markAsRead.isError && (
        <p role="alert" style={{ margin: "0.5rem 0 0 1rem", color: "#b91c1c", fontSize: "0.8rem" }}>
          Could not mark this notification as read. Please try again.
        </p>
      )}
    </div>
  );
}
