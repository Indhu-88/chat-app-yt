import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useCoversation";
import notificationSound from "../assets/sound/notification.mp3";

// -----------------------------------------------------------
// from BE to send msg : io.to(receiverSocketId).emit("newMsg", newMessage);
// BE send msg to a particular socketId and if this works if its that particular id

// add a custom property name to every new incoming msg, for "shake" effect
// called in Message.jsx  which is used to display msgs

// Handles real-time incoming messages from other users.
// Without setMessages here, you’d never see new messages unless you manually refreshed or re-fetched.
// -----------------------------------------------------------

//called in Message.jsx
export const useListenMessages = () => {
  const { socket } = useSocketContext(); // Socket.IO client connection tied to the logged-in user
  const { messages, setMessages } = useConversation();

  // receiver side to receive msgs
  useEffect(() => {
    if (!socket) return;

    // newMessage-> payload (data object)
    socket?.on("newMsg", (newMessage) => {
      newMessage.shouldShake = true; //flag for animation, custom property name, add shakeClass in Message.jsx

      const sound = new Audio(notificationSound); //for sound when msg received
      sound.play();

      // setMessages([...messages, newMessage]); //new msgs
      setMessages([...messages, newMessage]); //real-time incoming messages
    });

    return () => {
      socket?.off("newMsg");
    };
  }, [socket, setMessages]); //add messages
};

// ---------------------------------WHY useEffect()-------------------

// Render must be pure
// React’s render function should only return JSX. If you attach a socket listener directly in the component body,
// it will re‑attach on every render → causing duplicate listeners and memory leaks.

// Lifecycle alignment
// useEffect runs after React has committed the component to the DOM. That’s the correct time to “wire up” external
// systems like sockets, timers, or subscriptions. It also lets you return a cleanup function so React knows how
// to remove the listener when the component unmounts
