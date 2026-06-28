import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllUsers } from "@/lib/data/admin";
import { RoleBadge } from "@/components/admin/role-badge";
import { Card } from "@/components/ui/card";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
        <p className="mt-1 text-[var(--color-text-muted)]">{users.length} registered accounts</p>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Activity</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[var(--color-border)] last:border-b-0">
                <td className="px-5 py-3 font-medium">{user.name ?? "—"}</td>
                <td className="px-5 py-3 text-[var(--color-text-muted)]">{user.email}</td>
                <td className="px-5 py-3 text-[var(--color-text-muted)]">
                  {user._count.skills} skills · {user._count.projects} projects · {user._count.roadmaps} roadmaps
                </td>
                <td className="px-5 py-3 text-[var(--color-text-muted)]">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <RoleBadge userId={user.id} role={user.role} isSelf={user.id === session.user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
