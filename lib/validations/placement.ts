import { z } from "zod";

export const placementProgressSchema = z.object({
  aptitudeProgress: z.number().int().min(0).max(100),
  dsaProgress: z.number().int().min(0).max(100),
  coreSubjectsProgress: z.number().int().min(0).max(100),
  resumeProgress: z.number().int().min(0).max(100),
});

export type PlacementProgressInput = z.infer<typeof placementProgressSchema>;

export const mockInterviewSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(120),
  date: z.string().min(1, "Date is required"),
  score: z.number().int().min(0).max(100).optional(),
  feedback: z.string().max(500).optional().or(z.literal("")),
});

export type MockInterviewInput = z.infer<typeof mockInterviewSchema>;
