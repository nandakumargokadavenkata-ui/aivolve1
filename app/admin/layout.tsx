import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { APP_NAME, ADMIN_NAV } from "@/lib/constants";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-white px-6 py-3">
        <span className="text-sm font-semibold">{APP_NAME} Admin</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-muted)]">{session?.user?.email}</span>
          <SignOutButton />
        </div>
      </header>
      <div className="flex">
        <nav className="hidden w-56 shrink-0 border-r border-[var(--color-border)] bg-white p-3 md:block">
          <ul className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
