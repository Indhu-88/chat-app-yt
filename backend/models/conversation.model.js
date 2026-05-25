import mongoose from "mongoose";

//messages can start empty, but participants must exist from the beginning.
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //Since you’re always providing participants explicitly, don’t need a default.
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [], //so this field starts off as an empty array instead of undefined
      },
    ],
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;

// For array fields (like lists of messages, posts, comments), always set default: [].
// Arrays that can start empty but grow later → use default: [] (e.g., messages, comments, likes).

// For string/number fields, set defaults like default: "" or default: 0 to be initialized.
// Arrays that must be set at creation → no default (e.g., participants, owners, admins).
