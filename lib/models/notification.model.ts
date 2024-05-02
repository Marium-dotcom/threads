import mongoose, { Schema, models } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      required: true
    },
    threadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread", // Referring to the Thread model
        required: true
    },
    message:{
        type: String,
        required: true
  
    }
    ,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }
);

const Notification = models?.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
