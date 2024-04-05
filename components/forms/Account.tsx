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
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

  interface Props {
    user: {
      id: string;
      objectId: string;
      username: string;
      name: string;
      bio: string;
      profile_picture: string;
    };
    btnTitle: string;
  }

export default function Account({user}:Props) {
  
  const router = useRouter()
  const pathname = usePathname()
  const [files, setFiles] = useState<File[]>([]);
  const {startUpload} = useUploadThing("media")

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_picture: user?.profile_picture ? user.profile_picture : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },

  })


 async function onSubmit(values: z.infer<typeof UserValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const blob = values.profile_picture
    const checkPictureBase = isBase64Image(blob)
    if (checkPictureBase){
      const imgResponse = await startUpload(files)
      if (imgResponse && imgResponse[0].url){
        values.profile_picture = imgResponse[0].url
      }
    }
    

    console.log(values)

    await updateUser(

{   userId: user.id,
    username: values.username,
     name: values.name,
     bio: values.bio,
     profile_picture: values.profile_picture,
     path: pathname
}    )

if(pathname === '/profile/edit'){
  router.back()
  
}else{
  router.push('/')
}

  }



  function handleProfilePicture(    e: ChangeEvent<HTMLInputElement>,fieldChange: (value: string) => void) {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e?.target?.files && e?.target?.files?.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_picture"
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
{field.value ? (<Image src={field.value} alt='pp' width={96} height={96} priority className='rounded-full object-contain' />) : (<Image src={'/assets/profile.svg'} alt='pp' height={96} width={96} />)}
</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  className='account-form_image-input'
                  placeholder="Upload"
                  onChange={(e) => handleProfilePicture(e, field.onChange)}
                  />
              </FormControl>
            </FormItem>
          )}
        />    
            <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              {/* <FormLabel>Username</FormLabel> */}
              <FormControl>
                <Input

                  type='text'
                  className='account-form_input no-focus'
                  placeholder="username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              {/* <FormLabel>Username</FormLabel> */}
              <FormControl>
                <Input

                  type='text'
                  className='account-form_input no-focus'
                  placeholder="name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              {/* <FormLabel>bio</FormLabel> */}
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  placeholder="bio" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className='bg-primary-500' type="submit">Submit</Button>
      </form>
    </Form>
  )

}
