import Account from '@/components/forms/Account'
import { SignOutButton, SignedOut, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'


export default async function Page() {
  const user = await currentUser()
  if (!user) return null; 

  const userInfo = {
    username: user.username , 
    name:user.firstName,
    bio:"bio",
    profile_picture: user?.imageUrl,

  };
  // if (userInfo?.onboarded) redirect("/");

  // const userData = {
  //   id: user.id || "",
  //   objectId: "",
  //   username: userInfo ? userInfo?.username : user.username,
  //   name: userInfo ? userInfo?.name : user.firstName ?? "",
  //   bio: userInfo ? userInfo?.bio : "",
  //   profile_picture: userInfo? userInfo?.profile_picture : ""
  // };


console.log(user.username);

  return (   
    
    <main className='mx-auto flex h-screen bg-black text-white flex-col justify-start px-10 py-20'>
  <h1 className='head-text'>Onboarding</h1>
  <p className='mt-3 text-base-regular text-light-2'>
    Complete your profile now, to use Threds.
  </p>

  <section className='mt-9 bg-dark-2 p-10'>
    <Account user={userInfo} btnTitle='Continue'  />
  </section>
</main>

  )
}
