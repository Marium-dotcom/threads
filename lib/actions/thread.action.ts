"use server"
import Threads from "@/components/forms/Thread";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Notification from "../models/notification.model";

interface Params {
  text: string,
  author: string,
  path: string,
}


export async function createThread(
  { text,
    author, 
    path
    }: Params ): Promise<void> {
  try {
     connectToDB()
    console.log("text: " + text, "author" + author + " path: " + path);
    
    const posted = await Thread.create({ text, author })
await posted.save()
console.log("posted thread", posted);

await User.findByIdAndUpdate(author, {$push:{threads: posted}})

revalidatePath(path);

  } catch (error) {
console.log(error);

  }
}


export async function getThreads(pageNumber=1,pageSize=10){
  try {
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize;

   const postQuery =  Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    }).populate({
      path: "children", 
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image", 
      },
    });

// console.log("postQuery", postQuery);

    const totalMainThreads = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); 

  const posts = await postQuery.exec();
console.log("posts", posts[0].author);

  const isNext = totalMainThreads > skipAmount + posts.length;

  return { posts, isNext };


  } catch (error) {
   console.log(error);
    
  }
}


export async function getThreadById(id: string){
  connectToDB()

  try {
    const threadbyId = await Thread.findById(id).populate({
      path: "author",
      model: User,
      select: "_id id name profile_picture",
    }).populate({
      path: "children", // Populate the children field
      populate: [
        {
          path: "author", // Populate the author field within children
          model: User,
          select: "_id id name parentId profile_picture", // Select only _id and username fields of the author
        },
        {
          path: "children", // Populate the children field within children
          model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
          populate: {
            path: "author", // Populate the author field within nested children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
        },
      ],
    })

console.log("threadbyId", threadbyId);
return threadbyId.toObject(); 

  } catch (error) {
    console.log(error);
    
  }


}



export async function addComment(threadId: string,userId: string,comment: string,path:string) {
  try {
    console.log("comment", comment);
    console.log("threadid", threadId);
    
    console.log("userId", userId);
    console.log("PATH", path);
    
    // connectToDB()
    // check if the thread is already existing
    const originalThread = await Thread.findById(threadId);
   console.log("originalThread", originalThread);
   
    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const text = new Thread({text: comment, author:userId, parentId: threadId})
    const saveComment = await text.save()
    console.log("text", text);
        // Populate the author field with the corresponding User document
        await saveComment.populate("author", "name");

    originalThread.children.push(saveComment._id)
    await originalThread.save();
   const userPop = await saveComment.populate("author", "name");
console.log("userPop,userPop", userPop);

        // Notify the user who owns the thread if it's not the same user adding the comment
        if (originalThread.author.toString() !== userId) {
          await Notification.create({
            userId: originalThread.author,
            type: "comment",
            threadId: threadId,
            senderId: userId,
            message: `${userPop.author.name} commented on your thread: ${comment}`
          });
        }
    
    revalidatePath(path);

  } catch (error) {
    console.log(error);
    
  }




}


export async function addLike(threadId: string, userId: string, path: string) {
  try {
    console.log("threadId", threadId);
    console.log("userId", userId);
    
    // Connect to DB
    // Check if the thread exists
    const thread = await Thread.findById(threadId);
    console.log("threadPopthread", thread);
    
    console.log("thread", thread);
   
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Check if the user has already liked the thread
    const userIndex = thread.likesBy.indexOf(userId);
    if (userIndex !== -1) {
      // User has already liked the thread, so unlike it
      thread.likes -= 1;
      thread.likesBy.splice(userIndex, 1); // Remove user's ID from likesBy array
    } else {
      // User hasn't liked the thread, so like it
      thread.likes += 1;
      thread.likesBy.push(userId); // Add user's ID to likesBy array
    }

    await thread.save();

    // Notify the user who owns the thread if it's not the same user liking the thread
    if (thread.author.toString() !== userId) {
      const user = await User.findById(userId);
      await Notification.create({
        userId: thread.author,
        type: "like",
        threadId: threadId,
        senderId: userId,
        message: `${user.name} ${userIndex !== -1 ? 'unliked' : 'liked'} your thread.`
      });
    }
    
    revalidatePath(path);

  } catch (error) {
    console.log(error);
  }
}

