import ThreadCard from '@/components/cards/ThreadCard';
import { getThreads } from '@/lib/actions/thread.action'
import { fetchUser } from '@/lib/actions/user.actions';
import { UserButton, currentUser } from '@clerk/nextjs'
import React from 'react'

export default async function Page() {
const user = await currentUser()
if (!user) return null
  const threads = await getThreads()
  const current = await fetchUser(user.id)
  const id = current?._id
  console.log(current?._id);
  // const checkLike:any = threads?.posts.map(e => e.likesBy.includes(id))
  // console.log("checkLike", checkLike);
  // const isLiked = checkLike?.find((e:any) => e === id )
  // console.log("isLiked", isLiked);
  
  
  return (
    <>
    <h1 className='head-text'>Threads</h1>
    <section className='mt-9 flex flex-col gap-10'>
        {threads?.posts?.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {threads?.posts?.map((post) => (
              <ThreadCard
                key={post?._id}
                threadId={post?._id || ""} 
                currentUserId={user?.id || ""}
                userId= {current?._id}

                parentId={post?.parentId}
                content={post?.text}
                author={post?.author}
                createdAt={post?.createdAt}
                // comments={post?.children}
                likesBy={post?.likesBy}
                community={post?.community}
                checkLike={post?.likesBy.includes(id)}
          

              />
            ))}
          </>
        )}
      </section>


    </>
  )
}
