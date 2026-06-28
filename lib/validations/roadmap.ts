import { z } from "zod";

export const milestoneStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);

export const roadmapSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  targetDate: z.string().optional().or(z.literal("")),
});

export type RoadmapInput = z.infer<typeof roadmapSchema>;

export const milestoneSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().max(500).optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
});

export type MilestoneInput = z.infer<typeof milestoneSchema>;
