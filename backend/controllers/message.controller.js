import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; //router.post("/send/:id", protectRoute, sendMessage);
    const senderId = req.user._id; //protectRoute req.user = user

    if (!receiverId || !senderId) {
      return res.status(400).json({ error: "No sender/receiver" });
    }

    // $all --> checks that the participants array contains both senderId and receiverId, in any order
    // conversation object will usually contain :
    // participants → An array of user IDs who are part of this conversation.
    // messages → An array of message IDs.
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    //create a conversation with empty message[], Immediately saves it to the database
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        // messages: [], // explicitly initialize as empty if no default set in schema
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id); //coz messages is of type:mongoose.Schema.Types.ObjectId
    }

    // conversation.save(); // required to update DB as newMessage._id was pushed
    // newMessage.save(); //new Message() only creates a Mongoose document instance in memory and requireds to save to DB

    //both will run in ||el
    await Promise.all([conversation.save(), newMessage.save()]);

    // socket: to send to receiver id (receiver is the sidebar choosen user, MDB ._id)
    // will capture this in useListenMessages.js in FE
    // use BE socket server io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMsg", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendmessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -----------------------------------------------------------------------------------
// router.get("/:id", protectRoute, getMessages);

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params; //router.get("/:id", protectRoute, getMessages);
    const senderId = req.user._id;

    // get messages & populate
    // checks that the participants array is exactly [senderId, receiverId] in that order.
    // populate.("messages"): Instead of just message IDs, you get the full message objects with fields
    // like text, senderId, receiverId, createdAt.
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    //if no conversation send empty []
    if (!conversation) return res.status(200).json([]);

    return res.status(201).json(conversation.messages); //we get [] of {}
  } catch (error) {
    console.log("Error in sendmessage controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ------------------------------------------------------------------------------
// conversation - {
//   _id: new ObjectId('6a12a2ef5257100bd69bf6a4'),
//   participants: [
//     new ObjectId('6a11f1c7419d58b2ea6ca0bf'),
//     new ObjectId('6a11f1e2419d58b2ea6ca0c2')
//   ],
//   messages: [
//     {
//       _id: new ObjectId('6a1e5d692fa34fc9ee171237'),
//       senderId: new ObjectId('6a11f1c7419d58b2ea6ca0bf'),
//       receiverId: new ObjectId('6a11f1e2419d58b2ea6ca0c2'),
//       message: 'hi Sony...from Tony!!',
//       createdAt: 2026-06-02T04:34:49.870Z,
//       updatedAt: 2026-06-02T04:34:49.870Z,
//       __v: 0
//     }
//   ],
//   createdAt: 2026-05-24T07:04:15.945Z,
//   updatedAt: 2026-06-02T04:34:49.869Z,
//   __v: 8
// }
