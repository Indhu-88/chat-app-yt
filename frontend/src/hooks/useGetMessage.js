import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useCoversation";

// ----------------------------------------------------------------------
// fetch runs only when selectedConversation._id changes.
// Here we fetch messages of selected user & logged in user from backend using get and update it in zustand messages[]
// this fn needs to be called only once hence useEffect
// called from Messages.jsx
// ----------------------------------------------------------------------
export const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        // calls getMessages from message.controller
        const res = await fetch(`/api/messages/${selectedConversation._id}`); //its get method,
        const data = await res.json(); //we get all msgs for the id

        if (data.error) throw new Error(data.error); //send [] for no msgs
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    //if there is a choosen user from sidebar
    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages]);
  return { loading, messages };
};

// ---------------------------------------------------------------------------------------------
// from server.js
// app.use("/api/messages", messageRoutes);

//from message.routes.js
// router.get("/:id", protectRoute, getMessages);
