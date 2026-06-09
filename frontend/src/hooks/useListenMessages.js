import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useCoversation";
import notificationSound from "../assets/sound/notification.mp3";

// -----------------------------------------------------------
// Handles real-time incoming messages from other users.
// Without setMessages here, you’d never see new messages unless you manually refreshed or re-fetched.
// -----------------------------------------------------------

//called in Messages.jsx
export const useListenMessages = () => {
  const { socket } = useSocketContext(); // Socket.IO client connection tied to the logged-in user
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMsg", (newMessage) => {
      newMessage.shouldShake = true; //flag for animation, custom property name, add shakeClass in Message.jsx
      console.log(newMessage);

      const sound = new Audio(notificationSound); //for sound when msg received
      sound.play();

      setMessages([...messages, newMessage]); //real-time incoming messages
    });

    return () => {
      socket?.off("newMsg");
    };
  }, [socket, setMessages]); //add messages
};

// ---------------------------------WHY useEffect()-------------------

// newMessage
// createdAt:"2026-06-08T13:23:18.313Z"
// message:"hi"
// receiverId:"6a11f1e2419d58b2ea6ca0c2"
// senderId:"6a11f1c7419d58b2ea6ca0bf"
// shouldShake:true
// updatedAt:"2026-06-08T13:23:18.313Z"
// __v:0
// _id:"6a26c2461329e7bad6d0fde1"
