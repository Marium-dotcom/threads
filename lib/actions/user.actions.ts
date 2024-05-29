"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"
import Community from "../models/community.model"

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
    console.log("backend update user");
    
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


export async function fetchUser(userId: string){
    try {
        connectToDB()
       const user = await User.findOne({id: userId})
        return user
    } catch (error) {
        console.log(error);
        
    }
}

// Function to fetch users from the database
export async function fetchUsers({
    userId, // ID of the user making the request
    searchString = "", // String to search for users (optional, defaults to empty string)
    pageNumber = 1, // Page number of results to fetch (optional, defaults to 1)
    pageSize = 10, // Number of users per page (optional, defaults to 10)
    sortBy = "desc", // How to sort the results (optional, defaults to descending order)
  }: {
    userId: string; // Type check for userId: it should be a string
    searchString?: string; // Type check for searchString: it should be a string or undefined
    pageNumber?: number; // Type check for pageNumber: it should be a number or undefined
    pageSize?: number; // Type check for pageSize: it should be a number or undefined
    sortBy?: SortOrder; // Type check for sortBy: it should be 'asc', 'desc', or undefined
  }) {
try {
    // Connect to the database
    connectToDB();
    
    // Calculate how many users to skip based on the page number and page size
    const skip = (pageNumber - 1) * pageSize;

    // Construct a case-insensitive regular expression for the search string
    const regex = new RegExp(searchString, "i");

    // Set up a query to find users except the one with the provided userId
    const query: FilterQuery<typeof User> = { id: { $ne: userId } };

    // If a search string is provided, add conditions to find users by username or name that match the search string
    if (searchString.trim() !== "") {
        query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
    }

    // Set up sorting options based on the sortBy parameter
    const sortOptions = { createdAt: sortBy };

    // Perform the query with conditions, skipping users and limiting the number of users per page
    const userQuery = User.find(query).sort(sortOptions).skip(skip).limit(pageSize);

    // Count total users matching the query for pagination
    const totalUsers = await User.countDocuments(query);

    // Execute the query to get the users
    const users = await userQuery.exec();

    // Check if there are more users to fetch
    const isNext = totalUsers > skip + users.length;

    // Return the users found and a boolean indicating if there are more users to fetch
    return { users, isNext };
    
} catch (error) {
    // Log any errors to the console
    console.log(error);
    // Uncomment the line below to throw an error
    // throw new Error(error);
}
}



export async function fetchUserPosts(userId: string) {
    try {
      connectToDB();
  
       const threads = await User.findOne({ _id: userId }).populate({
        path: "threads",
        model: Thread,
        populate: [
        //   {
        //     path: "community",
        //     model: Community,
        //     select: "name id  _id", // Select the "name" and "_id" fields from the "Community" model
        //   },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "name profile_picture id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      });

      console.log("threads", threads);
      
      return threads;
    } catch (error) {
      console.error("Error fetching user threads:", error);
      throw error;
    }
  }
  
  