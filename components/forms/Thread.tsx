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
import { usePathname, useRouter } from 'next/navigation';
import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.action';
interface Props {
    userId: string;
}



export default function Threads({ userId }: Props) {

    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: userId,
        }
    })

console.log("userId: " + userId);

    async function onSubmit(values: z.infer<typeof ThreadValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        await createThread({ text: values.thread, author: userId, path: pathname })
console.log("hello");

        console.log(values)

        router.push("/");

    }

 async   function hello(values: z.infer<typeof ThreadValidation>){
    console.log(values)
    await createThread({ text: values.thread, author: userId, path: pathname })
    console.log("hello");
    
            console.log(values)
    
            router.push("/");
    
        console.log("hello")
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(hello)} className="flex flex-col justify-start gap-10">


                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            {/* <FormLabel>thread</FormLabel> */}
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    className='account-form_input no-focus'
                                    placeholder="thread" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button  className='bg-primary-500' type='submit'>Submit</Button>
            </form>
        </Form>
    )

}
