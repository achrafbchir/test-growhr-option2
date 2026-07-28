import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional().default(false),
});

export const likesSchema = z.object({
  photoId: z.string().trim().min(1, "photoId is required"),
});

export const photosQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(30).default(12),
});
