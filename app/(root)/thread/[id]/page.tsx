import ThreadCard from '@/components/cards/ThreadCard'
import Comment from '@/components/forms/Comment';
import { getThreadById } from '@/lib/actions/thread.action';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs'
import React from 'react'

export default async function Page({params}:{ params: { id: string }}) {
    const user = await currentUser()
    if (!user) return null;

console.log("params", params.id);
const post = await getThreadById(params.id)
// console.log("get thread", thread);
const current = await fetchUser(user.id)
  return (
    <div>         
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
<div className='mt-10'>
  <Comment userId={current?._id.toString()} threadId={post?._id?.toString()}/>
  </div>
</div>
  )
}
