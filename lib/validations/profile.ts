import { z } from "zod";

const urlOrEmpty = z
  .string()
  .max(300)
  .optional()
  .or(z.literal(""))
  .refine((val) => !val || /^https?:\/\/.+/.test(val), {
    message: "Enter a valid URL starting with http:// or https://",
  });

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  bio: z.string().max(300).optional().or(z.literal("")),
  college: z.string().max(120).optional().or(z.literal("")),
  branch: z.string().max(120).optional().or(z.literal("")),
  graduationYear: z
    .number()
    .int()
    .min(2000)
    .max(2100)
    .optional()
    .nullable(),
  location: z.string().max(120).optional().or(z.literal("")),
  careerInterests: z.string().max(300).optional().or(z.literal("")), // comma-separated
  goals: z.string().max(300).optional().or(z.literal("")), // comma-separated
  githubUrl: urlOrEmpty,
  linkedinUrl: urlOrEmpty,
  portfolioUrl: urlOrEmpty,
  avatarUrl: z
    .string()
    .max(2_000_000, "Image is too large")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^https?:\/\/.+/.test(val) || /^data:image\/(png|jpeg|webp);base64,/.test(val), {
      message: "Enter a valid image URL or upload an image.",
    }),
});

export type ProfileInput = z.infer<typeof profileSchema>;
