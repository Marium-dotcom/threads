"use server"
import Threads from "@/components/forms/Thread";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

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

await User.findByIdAndUpdate(author, {$push:{text: posted}})

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


    const totalMainThreads = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); 

  const posts = await postQuery.exec();

  const isNext = totalMainThreads > skipAmount + posts.length;

  return { posts, isNext };


  } catch (error) {
   console.log(error);
    
  }
}


export async function getThreadById(id: string){
  connectToDB()

  try {
    const thread = await Thread.findById(id).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    }).populate({
      path: "children", // Populate the children field
      populate: [
        {
          path: "author", // Populate the author field within children
          model: User,
          select: "_id id name parentId image", // Select only _id and username fields of the author
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

console.log(thread);
return thread;

  } catch (error) {
    
  }


}