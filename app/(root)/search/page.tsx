import UserCard from '@/components/cards/UserCard';
import Threads from '@/components/forms/Thread';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Page() {
  const user = await currentUser()
  console.log(user);
  if (!user) return null
  const userInfo = await fetchUser(user.id)
  let id = userInfo?._id?.toString()
  console.log(userInfo?._id?.toString());


  if (userInfo?.onboarded === false) redirect("/");
  const searched = await fetchUsers({ userId: user.id, searchString: '', pageNumber: 1, pageSize: 10 })
console.log("Search", searched);

  return (
    <div ><p className='head-text mb-10'>Search</p>
                {searched?.users.map((users:any) => (
              <UserCard
                key={users.id}
                id={users.id}
                name={users.name}
                username={users.username}
                profilePic={users.profile_picture}
                // personType='User'
              />
            ))}

    </div>
  )
}
