import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { getMessages, sendMessage } from "@/app/lib/https/message.https";
import { useLanguage } from "@/app/contexts/LanguageContext";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

const BookingChatSidebar = ({ open, onClose, booking, currentUser }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  if (!open || !booking || !currentUser) {
    return null;
  }

  useEffect(() => {
    if (!booking) return;
    setLoading(true);
    getMessages(booking._id)
      .then((msgs) => {
        setMessages(msgs || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [booking]);

  useEffect(() => {
    if (!booking || !currentUser) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.emit("setup", currentUser._id);
    socket.emit("joinRoom", {
      roomId: booking._id,
      userId: currentUser._id,
    });

    socket.on("newMessage", (newMsg) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === newMsg._id);
        if (exists) return prev;
        return [...prev, newMsg];
      });
    });

    socket.on("userTyping", ({ userId }) => {
      if (userId !== currentUser._id) {
        setOtherUserTyping(true);
      }
    });

    socket.on("userStoppedTyping", ({ userId }) => {
      if (userId !== currentUser._id) {
        setOtherUserTyping(false);
      }
    });

    socket.on("connect_error", () => {});
    socket.on("messageError", () => {});

    return () => {
      socket.emit("leaveRoom", {
        roomId: booking._id,
        userId: currentUser._id,
      });
      socket.disconnect();
    };
  }, [booking, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!typing) {
      setTyping(true);
      socketRef.current?.emit("typing", {
        bookingId: booking._id,
        userId: currentUser._id,
      });
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socketRef.current?.emit("stopTyping", {
        bookingId: booking._id,
        userId: currentUser._id,
      });
    }, 1000);
  };

  const getOtherUserId = () => {
    const customerId = typeof booking.userId === "object" ? booking.userId._id : booking.userId;
    const vendorId =
      typeof booking.listingId === "object"
        ? booking.listingId?.vendor || booking.vendorId
        : booking.vendorId;

    const isCustomer = currentUser._id === customerId;
    const isVendor = currentUser._id === vendorId;

    if (isCustomer) {
      return vendorId;
    } else if (isVendor) {
      return customerId;
    } else {
      return null;
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const receiverId = getOtherUserId();
    if (!receiverId) {
      alert(t("chat.sendError"));
      return;
    }

    const messageData = {
      bookingId: booking._id,
      content: input.trim(),
      sender: currentUser._id,
      receiver: receiverId,
    };

    try {
      await sendMessage(messageData);
      setInput("");
      if (typing) {
        setTyping(false);
        socketRef.current?.emit("stopTyping", {
          bookingId: booking._id,
          userId: currentUser._id,
        });
      }
    } catch {
      alert(t("chat.sendError"));
    }
  };

  const getOtherUserName = () => {
    if (!booking || !currentUser) return t("chat.unknown");

    if (currentUser.role === "vendor") {
      return (
        booking.userId?.name ||
        booking.userId?.username ||
        booking.customer?.name ||
        booking.customer?.username ||
        t("chat.customer")
      );
    } else {
      return (
        booking.vendorId?.name ||
        booking.vendorId?.username ||
        booking.vendor?.name ||
        booking.vendor?.username ||
        t("chat.vendor")
      );
    }
  };

  const isMyMessage = (msg) => {
    return msg.sender._id === currentUser._id || msg.sender === currentUser._id;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {getOtherUserName().charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-800">
                {getOtherUserName()}
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {t("chat.booking")}: #{booking._id.slice(-8)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100/50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="text-gray-500 font-medium">{t("chat.loading")}</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-gray-600 font-medium mb-1">{t("chat.noMessages")}</div>
                <div className="text-gray-400 text-sm">{t("chat.startConversation")}</div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${isMyMessage(msg) ? "justify-end" : "justify-start"} group`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${
                    isMyMessage(msg)
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                  }`}
                >
                  <div className="break-words leading-relaxed">{msg.content}</div>
                  <div
                    className={`text-xs mt-2 ${
                      isMyMessage(msg) ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}

          {otherUserTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white text-gray-600 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {getOtherUserName()} {t("chat.isTyping")}
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSend} className="space-y-3">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none placeholder-gray-400"
                  value={input}
                  onChange={handleTyping}
                  placeholder={t("chat.placeholder")}
                  disabled={loading}
                  maxLength={1000}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {input.length}/1000
                </div>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-2xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none transform hover:scale-105 disabled:transform-none"
                disabled={loading || !input.trim()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingChatSidebar;