"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { announcementSchema, type AnnouncementInput } from "@/lib/validations/announcement";
import type { ActionResult } from "@/types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session.user.id;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function setUserRole(
  targetUserId: string,
  role: "STUDENT" | "ADMIN"
): Promise<ActionResult<undefined>> {
  const adminId = await requireAdmin();

  if (targetUserId === adminId && role === "STUDENT") {
    return { success: false, error: "You can't remove your own admin access." };
  }

  await prisma.user.update({ where: { id: targetUserId }, data: { role } });

  revalidatePath("/admin/users");
  return { success: true, data: undefined };
}

// ---------------------------------------------------------------------------
// Content moderation (platform-wide projects)
// ---------------------------------------------------------------------------

export async function adminDeleteProject(projectId: string): Promise<ActionResult<undefined>> {
  await requireAdmin();
  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/admin/content");
  return { success: true, data: undefined };
}

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

export async function createAnnouncement(
  input: AnnouncementInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = announcementSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const authorId = await requireAdmin();

  const announcement = await prisma.announcement.create({
    data: { ...parsed.data, authorId },
  });

  revalidatePath("/admin/announcements");
  return { success: true, data: { id: announcement.id } };
}

export async function updateAnnouncement(
  id: string,
  input: AnnouncementInput
): Promise<ActionResult<undefined>> {
  const parsed = announcementSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await requireAdmin();
  await prisma.announcement.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/announcements");
  return { success: true, data: undefined };
}

export async function deleteAnnouncement(id: string): Promise<ActionResult<undefined>> {
  await requireAdmin();
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/announcements");
  return { success: true, data: undefined };
}

export async function toggleAnnouncementPublished(
  id: string,
  published: boolean
): Promise<ActionResult<undefined>> {
  await requireAdmin();
  await prisma.announcement.update({ where: { id }, data: { published } });
  revalidatePath("/admin/announcements");
  return { success: true, data: undefined };
}
