import { z } from "zod";

export const projectStatusEnum = z.enum([
  "PLANNING",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
  "ARCHIVED",
]);

const urlOrEmpty = z
  .string()
  .max(300)
  .optional()
  .or(z.literal(""))
  .refine((val) => !val || /^https?:\/\/.+/.test(val), {
    message: "Enter a valid URL starting with http:// or https://",
  });

export const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  status: projectStatusEnum,
  technologies: z.string().max(300).optional().or(z.literal("")), // comma-separated input
  repoUrl: urlOrEmpty,
  liveUrl: urlOrEmpty,
});

export type ProjectInput = z.infer<typeof projectSchema>;
