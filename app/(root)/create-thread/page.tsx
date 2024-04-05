import Threads from '@/components/forms/Thread';
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Page() {
const user = await currentUser()
console.log(user);
if(!user) return null
const userInfo = await fetchUser(user.id)
let id = userInfo?._id?.toString()
console.log(userInfo._id.toString());


if (userInfo?.onboarded === false) redirect("/");
return (
    <div><p className='head-text'>Post</p>
    
    <Threads userId={id}/>
    </div>
  )
}
