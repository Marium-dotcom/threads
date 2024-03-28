import { UserButton } from '@clerk/nextjs'
import React from 'react'

export default function Page() {
  return (
    <>
    <h1 className='head-text'>Threads</h1>
    <UserButton afterSignOutUrl='/'/>
    </>
  )
}
