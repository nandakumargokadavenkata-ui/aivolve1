import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
}

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>}
        </div>
        <div className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface)]">
          <Icon className="size-4 text-[var(--color-accent)]" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
