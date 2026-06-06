import Message from "./Message.jsx";
import MessageSkeleton from "../skeletons/Message.skeleton.jsx";
import { useGetMessages } from "../../hooks/useGetMessage.js";
import { useEffect, useRef } from "react";

// -----------------------------------------------------------------------------------------
// gets called for a particular selectedConversation
// if "loading" display skeleton

// ----------------------------------------------------------------------------
const Messages = () => {
  const { loading, messages } = useGetMessages(); //messages is from useConversation-zustand
  const lastMessageRef = useRef(); //for last msg view

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behaviour: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="flex flex-col px-4 overflow-auto flex-1">
      {/* create 3 instances of skeleton */}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {!loading && messages.length === 0 && (
        <p className="text-center"> Send messages to start a conversation</p>
      )}
    </div>
  );
};

export default Messages;

// --------------------------------------------------------
// messages is an [] of msgs for a selected id

// [...Array(3)] is a JavaScript trick to quickly create an array with 3 undefined elements
// [...Array(3)] // [undefined, undefined, undefined]

//used with .map() when you want to loop a fixed number of times:
// [...Array(3)].map((_, i) => i)
// [0, 1, 2]
