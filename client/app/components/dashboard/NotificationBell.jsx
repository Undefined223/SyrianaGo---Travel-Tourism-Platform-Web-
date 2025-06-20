import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import io from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function NotificationBell({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current.emit("setup", user._id);

    socketRef.current.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => socketRef.current.disconnect();
  }, [user]);

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative">
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {notifications.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-4">
          <h4 className="font-bold mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <div className="text-gray-400">No notifications</div>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notif, idx) => (
                <li key={idx} className="text-sm">{notif.text || notif.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}