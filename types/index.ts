import type {
  User,
  Profile,
  Skill,
  Roadmap,
  Milestone,
  Project,
  Achievement,
  PlacementPrep,
  MockInterview,
  AnalyticsSnapshot,
  Announcement,
  Role,
  SkillStatus,
  SkillCategory,
  ProjectStatus,
  MilestoneStatus,
  AchievementCategory,
  AnnouncementAudience,
} from "@prisma/client";

export type {
  User,
  Profile,
  Skill,
  Roadmap,
  Milestone,
  Project,
  Achievement,
  PlacementPrep,
  MockInterview,
  AnalyticsSnapshot,
  Announcement,
  Role,
  SkillStatus,
  SkillCategory,
  ProjectStatus,
  MilestoneStatus,
  AchievementCategory,
  AnnouncementAudience,
};

export type RoadmapWithMilestones = Roadmap & { milestones: Milestone[] };

export type PlacementPrepWithInterviews = PlacementPrep & {
  mockInterviews: MockInterview[];
};

/** Generic result shape returned by Server Actions */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
