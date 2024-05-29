import ProfileHeader from '@/components/shared/ProfileHeader';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from 'react'
import { profileTabs } from '@/constants';
import Image from 'next/image';
import ThreadsTab from '@/components/shared/ThreadsTab';

export default async function Page({params}:{params:{id:string}}) {
  const user = await currentUser()
console.log(user);
if(!user) return null
const userInfo = await fetchUser(params.id)
console.log("users info: " + userInfo?.threads[0]);

let id = userInfo?._id?.toString()
console.log(userInfo?._id?.toString());
if (!userInfo?.onboarded === false) redirect("/");

  return (
    <div><ProfileHeader
          userId={id}
          clerkId={user.id}
          name={userInfo?.name}
          username={userInfo?.username}
          profilePic={userInfo?.profile_picture}
          bio={userInfo?.bio}

    />
    
    <div className='mt-9'>
      <Tabs defaultValue='threads' className='w-full'>
        <TabsList className='tab'>
          {profileTabs.map((e)=>(
          <TabsTrigger key={e.label} value={e.value} className='tab'>
            <Image src={e.icon} alt={e.label} width={24} height={24} className='object-contain' />
            {e.label === "Threads" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo?.threads?.length}
                  </p>
                )}

          </TabsTrigger>))}
        </TabsList>
        {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo._id}
                accountType='User'
              />
            </TabsContent>
          ))}
      </Tabs>
    </div>
    </div>
  )
}
