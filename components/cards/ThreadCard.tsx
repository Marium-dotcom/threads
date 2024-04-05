import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

export default function ThreadCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  createdAt,
  comments,

}:Props) {
  return (
    <article className=' flex w-full flex-col rounded-xl bg-dark-2 p-7'>
      <div className=' flex items-start justify-between'>
        <div className=' flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author?.id}` } className='relative h-11 w-11'>
              <Image src={author?.image || 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yZUo2WmZDYmxsTEtiZ0s4NVZFUkxWeE5kWkYiLCJyaWQiOiJ1c2VyXzJlZWJPbEFobTNvU2lXNGFpa0YxU0NMaXBmViJ9'} alt='author image' fill className=' cursor-pointer rounded-full'/>
            </Link>

            <div  className=' thread-card-bar'></div>
          </div>


          <div>
            <Link href={`/profile/${author?.id}`}>
              <h4 className=' cursor-pointer text-base-semibold text-light-1'>{author?.name}</h4>
            </Link>     
                <p className='mt-2 text-small-regular text-light-2'>{content}</p>

          </div>
        </div>
      </div>
      {/* <h2 className=' text-small-regular text-light-2 '>{content}</h2> */}
    </article>
  )
}
