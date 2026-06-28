import { z } from "zod";

export const projectStatusEnum = z.enum([
  "PLANNING",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
  "ARCHIVED",
]);

export const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  status: projectStatusEnum,
  technologies: z.string().max(300).optional().or(z.literal("")), // comma-separated in the form, split before saving
  repoUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export type ProjectInput = z.infer<typeof projectSchema>;
