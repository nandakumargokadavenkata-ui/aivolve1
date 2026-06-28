import { z } from "zod";

export const announcementAudienceEnum = z.enum(["ALL", "STUDENTS", "ADMINS"]);

export const announcementSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(140),
  body: z.string().min(2, "Body is required").max(2000),
  audience: announcementAudienceEnum,
  published: z.boolean(),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
