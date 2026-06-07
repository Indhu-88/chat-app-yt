import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); //needed in logout
  const [onlineUsers, setOnlineUsers] = useState([]); //used in Coversation.js
  const { authUser } = useAuthContext(); //logged in user SET in localStorage.setItem()

  // if there is an authenticated user, create connection to BE and send authUser._id
  // run for every change in authUser
  // Socket.IO client connection to your backend server.
  //CHANGED: http:localhost:5000 to render url
  useEffect(() => {
    if (authUser) {
      const socketInstance = io("https://chat-app-yt-h8bv.onrender.com/", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socketInstance);

      // socket.on() is used to listen to events. Can be used on both FE and BE
      // users is an array of strings with authUser._id
      // BE : io.emit("getOnlineUsers", Object.keys(userSocketMap));
      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        setSocket(null); //cleanup: The component unmounts [e.g., user logs out or a different user logs in]
        // socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// --------------------------------------

// socket.disconnect() → closes the actual connection.

// setSocket(null) → clears your React state reference
