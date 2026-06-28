export const APP_NAME = "AIVolve";
export const APP_DESCRIPTION =
  "AIVolve helps engineering students learn, build, and track their growth — from first principles to placement-ready.";

export const SIDEBAR_NAV = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Skills", href: "/dashboard/skills", icon: "Sparkles" },
  { label: "Roadmaps", href: "/dashboard/roadmaps", icon: "Map" },
  { label: "Projects", href: "/dashboard/projects", icon: "FolderKanban" },
  { label: "Placements", href: "/dashboard/placements", icon: "Briefcase" },
  { label: "Achievements", href: "/dashboard/achievements", icon: "Trophy" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const ADMIN_NAV = [
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Content", href: "/admin/content", icon: "FileText" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Announcements", href: "/admin/announcements", icon: "Megaphone" },
] as const;

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  PROGRAMMING: "Programming",
  FRAMEWORK: "Frameworks",
  DATABASE: "Databases",
  DEVOPS: "DevOps",
  DESIGN: "Design",
  SOFT_SKILL: "Soft Skills",
  CORE_ENGINEERING: "Core Engineering",
  OTHER: "Other",
};

export const SKILL_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not started",
  LEARNING: "Learning",
  PRACTICING: "Practicing",
  PROFICIENT: "Proficient",
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "In review",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};
export const GENERIC_RESET_MESSAGE =
  "If an account exists for that email, a reset link is on its way.";