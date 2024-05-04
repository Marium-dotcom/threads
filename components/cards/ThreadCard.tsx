import { addLike } from '@/lib/actions/thread.action';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import LikeBotton from '../shared/LikeBotton';
import { formatDateString } from '@/lib/utils';
interface Props {
  threadId: string;
  currentUserId: string;
  userId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    profile_picture: string;
    id: string;
  };
  likesBy: string[]

  createdAt: string;
  isComment?: boolean;
  checkLike:boolean;
  community: {
    id: string;
    name: string;
  } | null;
}

export default  function ThreadCard({
  threadId,
  currentUserId,
  userId,
  parentId,
  content,
  author,
  createdAt,
  isComment,
  likesBy,
  checkLike,
  community
}:Props) {

console.log("checklikee from card", checkLike);

  return (
    <article className={`mt-5 flex w-full flex-col rounded-xl ${isComment? 'px-0 xs:px-5':'bg-dark-2' }  p-7`}>
      <div className=' flex items-start justify-between'>
        <div className=' flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author?.id}` } className='relative h-11 w-11'>
              <Image src={author?.profile_picture || 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yZUo2WmZDYmxsTEtiZ0s4NVZFUkxWeE5kWkYiLCJyaWQiOiJ1c2VyXzJlZWJPbEFobTNvU2lXNGFpa0YxU0NMaXBmViJ9'} alt='author image' fill className=' cursor-pointer rounded-full'/>
            </Link>
            <div  className='thread-card_bar'/>

          </div>


          <div>
            <Link href={`/profile/${author?.id}`}>
              <h4 className=' cursor-pointer text-base-semibold text-light-1'>{author?.name}</h4>
            </Link>     
                <p className='mt-2 text-small-regular text-light-2'>{content}</p>
<div className='mt-5 flex flex-col gap-3'>
  <div className='flex gap-3.5'>
    <LikeBotton userId={userId.toString()} threadId={threadId.toString() } likesBy={likesBy} checkLike={checkLike} />
    {/* <Image  onClick={handleLike} src={"/assets/heart-gray.svg"}  alt='like' width={24} height={24} className=' cursor-pointer object-contain  '/> */}
   <Link href={`/thread/${threadId}`}><Image src={"/assets/reply.svg"} alt='reply' width={24} height={24} className=' cursor-pointer object-contain'/></Link> 
    <Image src={"/assets/repost.svg"} alt='like' width={24} height={24} className=' cursor-pointer object-contain'/>
    <Image src={"/assets/share.svg"} alt='like' width={24} height={24} className=' cursor-pointer object-contain'/>
  </div>
</div>
          </div>
        </div>
      </div>
      {/* <h2 className=' text-small-regular text-light-2 '>{content}</h2> */}
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-gray-1'>
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={"https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yZUo2WmZDYmxsTEtiZ0s4NVZFUkxWeE5kWkYiLCJyaWQiOiJvcmdfMmZ4akRJVkllcmxYbUw5ZUFlUmlsNEczSnVlIiwiaW5pdGlhbHMiOiJNIn0?width=160"}
            alt={community.name}
            width={14}
            height={14}
            className='ml-1 rounded-full object-cover'
          />
        </Link>
      )}

    </article>
  )
}
