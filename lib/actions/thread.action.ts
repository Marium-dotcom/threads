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