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

  // Socket.IO client connection to your backend server.
  //CHANGED: http://localhost:5000 to render url  :  https://chat-app-yt-h8bv.onrender.com/
  useEffect(() => {
    if (authUser) {
      const socketInstance = io("https://chat-app-yt-h8bv.onrender.com", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socketInstance);

      // io.emit("getOnlineUsers", Object.keys(userSocketMap)); //keys are authUser._id
      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.close(); //cleanup: The component unmounts [e.g., user logs out or a different user logs in]
      };
    } else {
      //state socket
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
