import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

const dropdownStyle = {
  position: "absolute",
  top: "calc(100% + 0.75rem)",
  right: 0,
  zIndex: 10,
  width: "min(22rem, calc(100vw - 2rem))",
  maxHeight: "min(28rem, calc(100vh - 6rem))",
  overflowY: "auto",
  background: "#fff",
  color: "#1e293b",
  border: "1px solid #e2e8f0",
  borderRadius: "0.75rem",
  boxShadow: "0 12px 32px rgb(15 23 42 / 18%)",
};

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const notifications = [...state.notifications].sort((first, second) =>
    Date.parse(second.createdAt) - Date.parse(first.createdAt)
  );

  function handleMarkAllRead() {
    dispatch({ type: "MARK_ALL_READ" });
    onClose();
  }

  return (
    <section
      aria-label="Notifications"
      style={dropdownStyle}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.85rem 1rem", borderBottom: "1px solid #e2e8f0",
      }}>
        <h2 style={{ margin: 0, fontSize: "1rem" }}>Notifications</h2>
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={state.unreadCount === 0}
          style={{
            padding: 0, border: 0, background: "none", color: "#4f46e5",
            cursor: state.unreadCount === 0 ? "default" : "pointer",
            fontSize: "0.8rem", opacity: state.unreadCount === 0 ? 0.55 : 1,
          }}
        >
          Mark all as read
        </button>
      </div>
      {notifications.length === 0 ? (
        <p style={{ margin: 0, padding: "1rem", color: "#64748b", fontSize: "0.9rem" }}>
          You&apos;re all caught up.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationItem notification={notification} onClose={onClose} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
