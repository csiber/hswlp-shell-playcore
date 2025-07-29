import { z } from "zod"
import { catchaSchema } from "./catcha.schema";

export const signUpSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2).max(255),
  nickname: z.string().min(2).max(255).optional(),
  lastName: z.string().min(2).max(255),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  captchaToken: catchaSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "A jelszavak nem egyeznek",
  path: ["confirmPassword"],
})

export type SignUpSchema = z.infer<typeof signUpSchema>
