"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface Params{
    userId: string,
    username: string,
    name: string,
    bio: string,
    profile_picture: string,
    path: string
}

export async function updateUser(
{    userId,
    username,
    name,
    bio,
    profile_picture,
    path
}: Params): Promise<void> {
try {
    connectToDB()
    await User.findOneAndUpdate({id: userId},
        {username: username.toLowerCase(),
            name,
            bio,
            profile_picture,
            onBoarded:true},
        {upsert: true})
   //revalidate cached data 
    if(path === "/profile/edit"){
        revalidatePath(path)
    }
} catch (error) {
    console.log(error);
    
}
}