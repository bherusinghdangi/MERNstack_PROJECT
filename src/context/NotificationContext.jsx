import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && user) {
      const userId = user.id || "user_room";
      socket.emit("join", userId);

      socket.on("notification", (notif) => {
        addNotification(notif);
      });

      socket.on("price_update", (data) => {
        addNotification({
          type: data.type,
          message: data.message,
          symbol: data.symbol,
          id: Date.now() + Math.random()
        });
      });

      return () => {
        socket.off("notification");
        socket.off("price_update");
      };
    }
  }, [socket, user]);

  const addNotification = (notif) => {
    const id = notif.id || Date.now();
    setNotifications((prev) => [{ ...notif, id }, ...prev].slice(0, 5));

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
