import { z } from "zod";

export const userSettingsSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  nickname: z.string().min(2, {
    message: "Nickname must be at least 2 characters.",
  }).optional(),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
});
