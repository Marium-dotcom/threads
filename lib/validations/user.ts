import * as z from 'zod'

export const UserValidation = z.object({
    profile_picture : z.string().url(),
    name: z.string().min(2).max(30),
    username: z.string().min(2).max(30),
    bio: z.string().min(2).max(250)

})