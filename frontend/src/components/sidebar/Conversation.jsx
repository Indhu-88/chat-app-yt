import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useCoversation";

// -------------------------------------------------------------------------------
// functions
// - SIDEBAR DISPLAY with profilePic, name and icon
//  - a user is clciked update selectedConversation
//  - also if already selected User then blue bg

// conversation is list of User Object
// {_id: '6a11f1c7419d58b2ea6ca0bf', fullName: 'Sony', username: 'Sony_123', gender: 'female', profilePic: 'https://avatar.iran.liara.run/public/girl?username=Sony_123', …}

// onlineUsers is an array [] of authUser._id ,basically of online users
// -------------------------------------------------------------------------------

const Conversation = ({ conversation, emoji, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation(); //if this user gets clicked

  //if user already selected then blue bg
  const isSelected = selectedConversation?._id === conversation._id; //if selected keep it blue entire time

  //this helps in getting the online users
  const { onlineUsers } = useSocketContext();
  const online = onlineUsers.includes(conversation._id); //T or F

  return (
    <>
      {/* img + (Name + icon) + divider*/}
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
          ${isSelected ? "bg-sky-500" : null}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${online ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>

        {/* (Name + icon) */}
        <div className="flex flex-col flex-1 ">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{conversation.fullName}</p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>

      {/* no divider under last User; idx becomes true for last element */}
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
