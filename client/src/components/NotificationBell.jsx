import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

export default function NotificationBell() {
  const { state } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { unreadCount } = state;

  useEffect(() => {
    if (!open) return undefined;

    function handleMouseDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.3rem", color: "#fff" }}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        🔔
      </button>
      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute", top: "-0.25rem", right: "-0.4rem",
            minWidth: "1.1rem", padding: "0.1rem 0.25rem", borderRadius: "999px",
            background: "#ef4444", color: "#fff", fontSize: "0.7rem",
            fontWeight: 700, lineHeight: 1.2, textAlign: "center",
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
