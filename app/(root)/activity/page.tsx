import { getNotifications } from '@/lib/actions/notification.action'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function Page() {
  const user = await currentUser()
  if (!user) return null
  const userInfo = await fetchUser(user.id)

 const activity = await getNotifications(userInfo._id)
console.log("Notification", activity);

  return (
    <div><p className='head-text'>activity</p>
    
    
    <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.threadId}`}>
                <article className='activity-card'>
                  <Image
                    src={activity.senderId.profile_picture}
                    alt='user_logo'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    {/* <span className='mr-1 text-primary-500'>
                      {activity.senderId.name}
                    </span>{" "} */}
                    {activity.message}
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>

     </div>
  )
}
