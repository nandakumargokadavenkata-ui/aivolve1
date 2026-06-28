import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-[var(--color-surface)] text-[var(--color-text-muted)]",
        accent: "bg-cyan-50 text-[var(--color-accent-hover)]",
        success: "bg-[var(--color-success-surface)] text-[var(--color-success)]",
        warning: "bg-[var(--color-warning-surface)] text-[var(--color-warning)]",
        outline: "border border-[var(--color-border)] text-[var(--color-text)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
