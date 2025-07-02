"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, login, refreshToken, register } from "../lib/https/auth.https";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  // Load user from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
        await fetchUserProfile(storedToken);
      }
      setLoading(false);
    };

    const notif = JSON.parse(localStorage.getItem("notifications") || "[]");
    const msgNotif = JSON.parse(localStorage.getItem("messageNotifications") || "[]");
    setNotifications(notif);
    setMessageNotifications(msgNotif);

    initAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem("messageNotifications", JSON.stringify(messageNotifications));
  }, [messageNotifications]);

  const fetchUserProfile = async (token) => {
    console.log("fetchUserProfile called with token:", token);
    try {
      const res = await getCurrentUser();
      console.log("getCurrentUser response:", res);
      if (res && res.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        console.log("User set and stored in localStorage:", res.data);
      } else {
        console.warn("No user data found in response:", res);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      handleLogout();
    }
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const res = await login(credentials);
      if (res.accessToken) {
        setAccessToken(res.accessToken);
        localStorage.setItem("accessToken", res.accessToken);
        await fetchUserProfile(res.accessToken);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      const res = await register(data);
      if (res.accessToken) {
        setAccessToken(res.accessToken);
        await fetchUserProfile(res.accessToken);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setNotifications([]);
    setMessageNotifications([]);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("notifications");
    localStorage.removeItem("messageNotifications");
    window.location.href = "/";
  };

    const addNotification = (notif) => setNotifications((prev) => [notif, ...prev]);
  const addMessageNotification = (notif) => setMessageNotifications((prev) => [notif, ...prev]);
  const clearNotifications = () => setNotifications([]);
  const clearMessageNotifications = () => setMessageNotifications([]);

  const handleRefreshToken = async () => {
    try {
      const newToken = await refreshToken();
      setAccessToken(newToken);
      return newToken;
    } catch (err) {
      handleLogout();
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshToken: handleRefreshToken,
        fetchUserProfile,
        notifications,
        messageNotifications,
        addNotification,
        addMessageNotification,
        clearNotifications,
        clearMessageNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);