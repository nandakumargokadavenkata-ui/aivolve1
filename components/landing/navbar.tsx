"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Roadmaps", href: "#roadmaps" },
  { label: "Placements", href: "#placements" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
      <nav className="container-content flex h-16 items-center justify-between" aria-label="Primary">
        <Link href="/" className="text-base font-semibold tracking-tight text-[var(--color-primary)]">
          {APP_NAME}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/register">Get started</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] p-2 md:hidden"
          aria-expanded={isMobileOpen}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "border-t border-[var(--color-border)] bg-white md:hidden",
          isMobileOpen ? "block" : "hidden"
        )}
      >
        <div className="container-content flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="rounded-[var(--radius-sm)] px-2 py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="primary" className="w-full">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
