"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";
import type { ActionResult } from "@/types";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
}

function parseTechnologies(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function createProject(input: ProjectInput): Promise<ActionResult<{ id: string }>> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await requireUserId();

  const project = await prisma.project.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      technologies: parseTechnologies(parsed.data.technologies),
      repoUrl: parsed.data.repoUrl || null,
      liveUrl: parsed.data.liveUrl || null,
      userId,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
  return { success: true, data: { id: project.id } };
}

export async function updateProject(
  id: string,
  input: ProjectInput
): Promise<ActionResult<undefined>> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await requireUserId();
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Project not found." };
  }

  await prisma.project.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      technologies: parseTechnologies(parsed.data.technologies),
      repoUrl: parsed.data.repoUrl || null,
      liveUrl: parsed.data.liveUrl || null,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function deleteProject(id: string): Promise<ActionResult<undefined>> {
  const userId = await requireUserId();
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Project not found." };
  }

  await prisma.project.delete({ where: { id } });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}
