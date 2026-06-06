import { useState } from "react";
import useConversation from "../zustand/useCoversation";
import toast from "react-hot-toast";

// -----------------------------------------------------------------------
// selectedConversation has the id of clicked user from sidebar
// it gets set in Conversation.jsx

// we send the msg from input (MessageInput.jsx) to backend which inturn pushes it to DB and updates
// with new ._id and sends back as response

// here we update it in messages[] of zustand
//------------------------------------------------------------------
export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  // called from MessageInput.jsx
  // fetch req is handled by sendMessage in message.controller
  // router.post("/send/:id", protectRoute, sendMessage);

  const sendMessage = async (message) => {
    //if a user is clicked from sidebar
    if (!selectedConversation?._id) {
      toast.error("No conversation selected");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        },
      );
      const data = await res.json(); //JS Object

      if (data.error) {
        throw new Error(data.error); //from backend
      }

      setMessages([...messages, data]); //updating with new Message send from backend
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, sendMessage };
};

// --------------------------------------------------------------------------------------------------
// from server.js
// app.use("/api/messages", messageRoutes);

//from message.routes.js
// router.get("/:id", protectRoute, getMessages);
// router.post("/send/:id", protectRoute, sendMessage);
