import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserWithProfile } from "@/lib/data/profile";
import { ProfileForm } from "@/components/dashboard/profile/profile-form";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
        <p className="mt-1 text-[var(--color-text-muted)]">
          This information helps personalize your roadmap and placement prep.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px]" />}>
        <ProfileContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function ProfileContent({ userId }: { userId: string }) {
  const user = await getUserWithProfile(userId);
  if (!user) redirect("/login");

  return <ProfileForm name={user.name} email={user.email} profile={user.profile} />;
}
