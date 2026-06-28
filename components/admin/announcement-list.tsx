"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteAnnouncement, toggleAnnouncementPublished } from "@/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnnouncementForm, EditAnnouncementTrigger } from "@/components/admin/announcement-form";
import type { Announcement } from "@/types";

const AUDIENCE_LABELS: Record<string, string> = {
  ALL: "Everyone",
  STUDENTS: "Students",
  ADMINS: "Admins",
};

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    setPendingId(id);
    await deleteAnnouncement(id);
    router.refresh();
    setPendingId(null);
  }

  async function handleTogglePublished(id: string, currentlyPublished: boolean) {
    setPendingId(id);
    await toggleAnnouncementPublished(id, !currentlyPublished);
    router.refresh();
    setPendingId(null);
  }

  return (
    <div className="space-y-2">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium">{announcement.title}</p>
                <Badge variant="outline">{AUDIENCE_LABELS[announcement.audience]}</Badge>
                <Badge variant={announcement.published ? "success" : "neutral"}>
                  {announcement.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{announcement.body}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={pendingId === announcement.id}
                onClick={() => handleTogglePublished(announcement.id, announcement.published)}
              >
                {announcement.published ? "Unpublish" : "Publish"}
              </Button>
              <AnnouncementForm announcement={announcement} trigger={<EditAnnouncementTrigger />} />
              <Button
                variant="ghost"
                size="icon"
                disabled={pendingId === announcement.id}
                onClick={() => handleDelete(announcement.id, announcement.title)}
                aria-label="Delete announcement"
              >
                <Trash2 className="size-4 text-[var(--color-danger)]" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
