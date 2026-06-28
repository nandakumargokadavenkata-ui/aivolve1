"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { SIDEBAR_NAV } from "@/lib/constants";
import { UserMenu } from "@/components/dashboard/user-menu";

function useCurrentPageTitle() {
  const pathname = usePathname();
  const match = [...SIDEBAR_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname.startsWith(item.href));
  return match?.label ?? "Dashboard";
}

export function Topbar({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const title = useCurrentPageTitle();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-[var(--radius-sm)] p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      </div>

      <UserMenu name={name} email={email} />
    </header>
  );
}
