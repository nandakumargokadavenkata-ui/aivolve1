import { z } from "zod";

export const skillCategoryEnum = z.enum([
  "PROGRAMMING",
  "FRAMEWORK",
  "DATABASE",
  "DEVOPS",
  "DESIGN",
  "SOFT_SKILL",
  "CORE_ENGINEERING",
  "OTHER",
]);

export const skillStatusEnum = z.enum(["NOT_STARTED", "LEARNING", "PRACTICING", "PROFICIENT"]);

export const skillSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  category: skillCategoryEnum,
  status: skillStatusEnum,
  progress: z.number().int().min(0).max(100),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type SkillInput = z.infer<typeof skillSchema>;
