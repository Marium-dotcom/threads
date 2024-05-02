"use client"
import { useState, useEffect } from 'react';
import { addLike, getThreadById } from '@/lib/actions/thread.action';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {
    threadId: string;
    userId: string;
    likesBy: string[];
    checkLike:boolean

}

export default function LikeButton({ threadId, userId ,likesBy ,checkLike}: Props) {
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const path = usePathname();

    useEffect(() => {
        async function fetchData() {
            try {
                const thread = await getThreadById(threadId);
                if (thread) {
                    setLikes(thread.likes);
                    setLiked(thread.likesBy.includes(userId));
                }
            } catch (error) {
                console.error('Error fetching thread:', error);
            }
        }
        fetchData(); // Call fetchData once when component mounts
    }, []); // Empty dependency array ensures useEffect runs only once

    async function handleLike() {
        await addLike(threadId, userId, path);
        // setLiked(!liked);
        // setLikes(liked ? likes - 1 : likes + 1);
    }
    console.log("check", checkLike);
    

    return (
        <div>
            <Image
                onClick={handleLike}
                src={checkLike ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
                alt='like'
                width={24}
                height={24}
                className='cursor-pointer object-contain inline'
            />
            <span className=' text-purple-500'>{likesBy.length}</span>
        </div>
    );
}
