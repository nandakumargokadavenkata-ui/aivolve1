import { redirect } from "next/navigation";
import { Megaphone } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAllAnnouncements } from "@/lib/data/admin";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { AnnouncementList } from "@/components/admin/announcement-list";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AdminAnnouncementsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const announcements = await getAllAnnouncements();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Announcements</h2>
          <p className="mt-1 text-[var(--color-text-muted)]">Broadcast updates to students, admins, or everyone.</p>
        </div>
        <AnnouncementForm />
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Create your first announcement to share updates with students."
          action={<AnnouncementForm />}
        />
      ) : (
        <AnnouncementList announcements={announcements} />
      )}
    </div>
  );
}
