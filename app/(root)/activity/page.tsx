import { getNotifications } from '@/lib/actions/notification.action'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import React from 'react'

export default async function Page() {
  const user = await currentUser()
  if (!user) return null
  const userInfo = await fetchUser(user.id)

 const notify = await getNotifications(userInfo._id)
console.log("Notification", notify);

  return (
    <div><p className='head-text'>activity</p> </div>
  )
}
