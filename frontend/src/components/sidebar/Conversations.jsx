import React from "react";
import Conversation from "./Conversation";
import { useGetConversation } from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";

// ---------------------------------------------------------------------------
// conversations - [] of user objects seen in side bar
// {_id: '6a11f1c7419d58b2ea6ca0bf', fullName: 'Sony', username: 'Sony_123', gender: 'female', profilePic: 'https://avatar.iran.liara.run/public/girl?username=Sony_123', …}
// send it to <Conversation />
// ---------------------------------------------------------------------------

const Conversations = () => {
  const { loading, conversations } = useGetConversation(); //conversations has [] of user JS Object

  return (
    <div className="flex flex-col py-2 overflow-auto">
      {loading ? <span className="loading loading-spinner"></span> : null}

      {/*  idx is the index of the current element  */}
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1} //to remove divider below last user 0 === 3(f),3===3(t)
        />
      ))}
    </div>
  );
};

export default Conversations;
