import Account from '@/components/forms/Account'
import { fetchUser } from '@/lib/actions/user.actions';
import { SignOutButton, SignedOut, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'


export default async function Page() {
  const user = await currentUser()
  if (!user) return null; 


  const userInfo = await fetchUser(user.id)
console.log("userInfo", userInfo);

  const userData = {
    id: user.id,
    objectId: userInfo?._id?.toString(),
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ,
    bio: userInfo ? userInfo?.bio : "",
    profile_picture: userInfo ? userInfo?.profile_picture : user.imageUrl,

  };
  console.log(userInfo?.onBoarded);
  
  // if (userInfo?.onBoarded) redirect("/");
console.log(userInfo?._id);

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
    <Account user={userData} btnTitle='Continue'  />
  </section>
</main>

  )
}
