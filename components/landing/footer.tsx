import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Roadmaps", href: "#roadmaps" },
      { label: "Placements", href: "#placements" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-base font-semibold tracking-tight">{APP_NAME}</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--color-text-muted)]">
            Engineering growth, tracked — skills, roadmaps, projects, and placement prep in one place.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-content flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] py-6 text-xs text-[var(--color-text-muted)] sm:flex-row">
        <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
