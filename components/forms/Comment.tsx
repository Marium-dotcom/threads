"use client"

import React, { ChangeEvent, useState } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"

import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from '@/lib/validations/user';
import { Button } from '../ui/button';
import { z } from "zod"
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { currentUser } from '@clerk/nextjs';
import { isBase64Image } from '@/lib/utils';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/thread';
import { addComment } from '@/lib/actions/thread.action';
import { threadId } from 'worker_threads';
interface Props {
    userId: string,
    threadId: string,
    currentUserImg: string,
}



export default function Comment({ userId, threadId,currentUserImg }: Props) {

    const router = useRouter()
    const pathname = usePathname()
console.log("userId: " + userId);

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        }
    })


    async function onSubmit(values: z.infer<typeof CommentValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        await addComment(threadId ,userId, values.thread,  pathname)

        console.log(values)
console.log(userId);

        // router.push("/");
        form.reset()

    }




    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex  justify-start gap-10">


            <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt='current_user'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  {...field}
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                />
              </FormControl>
            </FormItem>
          )}
        />

                <Button className=' comment-form_btn' type="submit">comment</Button>
            </form>
        </Form>
    )

}
