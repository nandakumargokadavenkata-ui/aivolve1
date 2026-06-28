import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-surface)] px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-lg font-semibold tracking-tight text-[var(--color-primary)]"
      >
        {APP_NAME}
      </Link>

      <div className="w-full max-w-[400px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-md)]">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>

        {children}
      </div>

      {footer && <div className="mt-6 text-sm text-[var(--color-text-muted)]">{footer}</div>}
    </main>
  );
}
