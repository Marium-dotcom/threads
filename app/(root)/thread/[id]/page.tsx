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
console.log("post thread", post);
console.log("current user", current);

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
  <Comment currentUserImg={current?.profile_picture} userId={current?._id.toString()} threadId={post?._id?.toString()}/>
  </div>

  <div className='mt-10'>
  {post.children.map((comnt: any) => (
          <ThreadCard
            key={comnt._id}
            id={comnt._id}
            currentUserId={user.id}
            parentId={comnt.parentId}
            content={comnt.text}
            author={comnt.author}
            createdAt={comnt.createdAt}
            comments={comnt.children}
            isComment
            // currentUserImg={current?.profile_picture} 
          />
        ))}

  </div>
</div>
  )
}
