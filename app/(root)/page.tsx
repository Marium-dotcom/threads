import ThreadCard from '@/components/cards/ThreadCard';
import { getThreads } from '@/lib/actions/thread.action'
import { UserButton, currentUser } from '@clerk/nextjs'
import React from 'react'

export default async function Page() {
const user = await currentUser()
if (!user) return null
  const threads = await getThreads()

  console.log(threads);
  
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
                id={post?._id || ""} 
                currentUserId={user?.id || ""}
                parentId={post?.parentId}
                content={post?.text}
                author={post?.author}
                createdAt={post?.createdAt}
                comments={post?.children}
              />
            ))}
          </>
        )}
      </section>


    </>
  )
}
