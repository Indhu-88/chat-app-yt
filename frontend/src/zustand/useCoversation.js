import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;

//------------------------------------------------

// messages are set in 2 scenerios
// - in getMessages(FE) when we fetch all messages(using selectedConversation._id) from DB (getMessages in BE).
// - in sendMessage(FE), after sending new msg to backend using fetch ( selectedConversation._id)
//   & we update setMessages with old msgs received [...messages] & new msg[data]

// selectedConversation is set in Conversation.jsx when a user gets clicked from sidebar

// selectedConversation is a JS Object
// {_id: '6a11f1c7419d58b2ea6ca0bf',
//  fullName: 'Sony',
//  username: 'Sony_123',
//  gender: 'female',
//  profilePic: 'https://avatar.iran.liara.run/public/girl?username=Sony_123',
//   …}
