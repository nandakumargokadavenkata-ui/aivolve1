import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { SidebarNavList } from "@/components/dashboard/sidebar-nav-list";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-white md:flex">
      <div className="flex h-16 items-center border-b border-[var(--color-border)] px-6">
        <Link href="/dashboard" className="text-base font-semibold tracking-tight">
          {APP_NAME}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <SidebarNavList />
      </div>
    </aside>
  );
}
