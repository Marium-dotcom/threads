import * as z from 'zod'

export const ThreadValidation = z.object({
    thread: z.string().min(2).max(250),
    accountId: z.string()

})

export const    CommentValidation = z.object({
    thread: z.string().min(2).max(250),
 
})