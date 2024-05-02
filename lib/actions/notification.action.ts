import Notification from "../models/notification.model";
import User from "../models/user.model";

export async function getNotifications(userId: string) {
    try {
      // Find notifications for the user
      const notifications = await Notification.find({ userId }).populate({
        path: "senderId", // Populate the senderId field with user details
        model: User,
        select: "_id name profile_picture" // Select only necessary fields of the sender
      }).sort({ createdAt: "desc" }); // Sort notifications by creation date in descending order
  
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
  