import { redirect } from "next/navigation";


import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts, fetchCommunities, fetchCommunityDetails } from "@/lib/actions/community.action";
import { getThreadById } from "@/lib/actions/thread.action";
import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

interface Result {
    name: string;
    profile_picture: string;
    id: string;
    threads: {
        _id: string;
        text: string;
        parentId: string | null;
        author: {
            name: string;
            profile_picture: string;
            id: string;
        };
        community: {
            id: string;
            name: string;
        } | null;
        createdAt: string;
        likesBy: string[];
    }[];
}

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
    let result: Result;

    if (accountType === "Community") {
        result = await fetchCommunityPosts(accountId);
    } else {
        result = await fetchUserPosts(accountId);
    }
console.log("result: " + result);

//     if (!result) {
// console.log("account iddd", accountId);
//     }
const user = await currentUser()
if (!user) return null

    const current = await fetchUser(user.id)
    const id = current._id

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {result?.threads?.map((post) => (
                <ThreadCard
                key={post?._id}
                threadId={post?._id || ""} 
                currentUserId={user?.id || ""}
                userId= {current?._id}

                parentId={post?.parentId}
                content={post?.text}
                author={accountType === "User"
                ? { name: result?.name, profile_picture: result?.profile_picture, id: result?.id }
                : {
                    name: post?.author?.name,
                    profile_picture: post?.author?.profile_picture,
                    id: post?.author.id,
                  }
  }
                createdAt={post?.createdAt}
                // comments={post?.children}
                likesBy={post?.likesBy}
                checkLike={post?.likesBy.includes(id)}
                community={
                        accountType === "Community"
                            ? { name: result.name, id: result.id }
                            : post.community
                    }
                />
            ))}
        </section>
    );
}

export default ThreadsTab;