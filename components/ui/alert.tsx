import * as React from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: "bg-[var(--color-success-surface)] text-[var(--color-success)] border-green-200",
  error: "bg-[var(--color-danger-surface)] text-[var(--color-danger)] border-red-200",
  warning: "bg-[var(--color-warning-surface)] text-[var(--color-warning)] border-amber-200",
  info: "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]",
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof ICONS;
}

function Alert({ variant = "info", className, children, ...props }: AlertProps) {
  const Icon = ICONS[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-[var(--radius-md)] border px-3.5 py-3 text-sm",
        STYLES[variant],
        className
      )}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export { Alert };
