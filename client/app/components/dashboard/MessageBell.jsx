import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import io from "socket.io-client";
import { useUser } from "@/app/contexts/UserContext";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function MessageBell() {
    const { user, messageNotifications, addMessageNotification, clearMessageNotifications } = useUser();
    const [open, setOpen] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
        socketRef.current.emit("setup", user._id);
        console.log("Emitted setup for user", user._id);

        socketRef.current.on("newMessageNotification", (notif) => {
            console.log("Received newMessageNotification", notif);
            addMessageNotification(notif);
        });

        return () => socketRef.current.disconnect();
    }, [user, addMessageNotification]);

    // Optionally clear notifications when dropdown is opened
   const handleOpen = () => {
  setOpen((prev) => !prev);
};


    return (
        <div className="relative">
            <button onClick={handleOpen} className="relative">
                <MessageCircle className="w-6 h-6" />
                {messageNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5">
                        {messageNotifications.length}
                    </span>
                )}
            </button>
          {open && (
  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-4">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-bold">Messages</h4>
      {messageNotifications.length > 0 && (
        <button
          onClick={clearMessageNotifications}
          className="text-xs text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      )}
    </div>

    {messageNotifications.length === 0 ? (
      <div className="text-gray-400">No new messages</div>
    ) : (
      <ul className="space-y-2">
        {messageNotifications.map((msg, idx) => (
          <li key={idx} className="text-sm">
            {msg.text || msg.message?.content}
          </li>
        ))}
      </ul>
    )}
  </div>
)}

        </div>
    );
}