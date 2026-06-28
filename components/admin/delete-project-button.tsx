"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { adminDeleteProject } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function DeleteProjectButton({ projectId, title }: { projectId: string; title: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    if (!window.confirm(`Remove project "${title}" from the platform? This can't be undone.`)) return;
    setIsDeleting(true);
    await adminDeleteProject(projectId);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} isLoading={isDeleting} aria-label="Remove project">
      <Trash2 className="size-4 text-[var(--color-danger)]" aria-hidden="true" />
    </Button>
  );
}
