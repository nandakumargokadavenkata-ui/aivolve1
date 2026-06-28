"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { APP_NAME } from "@/lib/constants";
import { SidebarNavList } from "@/components/dashboard/sidebar-nav-list";

export function MobileSidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 md:hidden" />
        <Dialog.Content
          className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-[var(--shadow-lg)] md:hidden"
          aria-describedby={undefined}
        >
          <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-5">
            <Dialog.Title asChild>
              <span className="text-base font-semibold tracking-tight">{APP_NAME}</span>
            </Dialog.Title>
            <Dialog.Close className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]">
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <SidebarNavList onNavigate={() => setSidebarOpen(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
