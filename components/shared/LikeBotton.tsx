"use client"
import { addLike } from '@/lib/actions/thread.action'
import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React from 'react'
interface Props {
    threadId: string;
    userId: string;}
export default  function LikeBotton({threadId, userId}:Props) {
    // const current = await currentUser()
    // if (!current) return null;
    // console.log(current.id);
    const path = usePathname()

    async function handleLike (){  await addLike(threadId, userId, path)
    }
  return (
    <Image  onClick={handleLike} src={"/assets/heart-gray.svg"}  alt='like' width={24} height={24} className=' cursor-pointer object-contain  '/>
  )
}
