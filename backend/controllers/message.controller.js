import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

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

    //socket io  functionality

    // await conversation.save(); // required to update DB as  newMessage._id was pushed
    // await newMessage.save(); //new Message() only creates a Mongoose document instance in memory and requireds to save to DB

    //both will run in ||el
    await Promise.all([conversation.save(), newMessage.save()]);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendmessage controller:", error.message);
    res.status(501).json({ error: "Internal Server Error" });
  }
};

// -----------------------------------------------------------------------------------
export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params; //router.get("/:id", protectRoute, getMessages);
    const senderId = req.user._id;

    //get messages & populate
    //checks that the participants array is exactly [senderId, receiverId] in that order.
    // populate.("messages"): Instead of just message IDs, you get the full message objects with fields
    // like text, senderId, receiverId, createdAt.
    const conversation = await Conversation.findOne({
      participants: [senderId, receiverId],
    }).populate("messages");

    //if no conversation send empty []
    if (!conversation) res.status(201).json([]);

    const messages = conversation.messages;

    res.status(201).json(messages); //we get [] of {}
  } catch (error) {
    console.log("Error in sendmessage controller:", error.message);
    res.status(501).json({ error: "Internal Server Error" });
  }
};
