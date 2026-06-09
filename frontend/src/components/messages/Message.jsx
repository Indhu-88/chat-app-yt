import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useCoversation";
import { extractTime } from "../../utils/extractTime.js";
import { useListenMessages } from "../../hooks/useListenMessages.js";

// -------------------------------------------------------------------------------
// {message}
// {_id: '6a1bbd298eb5e64b65f67627', senderId: '6a11f1e2419d58b2ea6ca0c2', receiverId: '6a1838426cfbe24289f3c3ad', message: 'hello to john', createdAt: '2026-05-31T04:46:33.409Z', …}

// {authUser}
// {_id: '6a11f1e2419d58b2ea6ca0c2', fullName: 'Tony', username: 'Tony_123', profilePic: 'https://avatar.iran.liara.run/public/boy?username=Tony_123'}
// selectedConversation
// {_id: '6a1891b75ea1320e7d53abbb', fullName: 'holy', username: 'holy_flax', gender: 'female', profilePic: 'https://avatar.iran.liara.run/public/girl?username=holy_flax', …}
// ---------------------------------------------------------------------------------------
const Message = ({ message }) => {
  const { authUser } = useAuthContext(); //logged in user
  const { selectedConversation } = useConversation(); //user from sideBar

  const formatedTime = extractTime(message.createdAt);

  //msg from loggedIn User or other user
  const fromMe = message.senderId === authUser._id;

  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;

  //add bg color
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";

  //add shake class, added from useListenMessages.js, custom JS object property
  const shakeClass = message.shouldShake ? "shake" : "";

  // img + msg (chat-start or chat-end)
  return (
    <div className={`chat ${chatClassName} `}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePic} alt="user avatar" />
        </div>
      </div>
      <div className={`chat-bubble ${bubbleBgColor} ${shakeClass} text-white`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs text-white flex gap-1 items-center pb-2">
        {formatedTime}
      </div>
    </div>
  );
};

export default Message;
