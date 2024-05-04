import mongoose, { Schema, models } from "mongoose";

const threadSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
      },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    parentId: {
      type: String,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    likes: {
      type: Number,
      default: 0 // Default number of likes is 0
    },
    likesBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  }
);

const Thread = models?.Thread || mongoose.model("Thread", threadSchema);
export default Thread;
