"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RoleBadge({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: "STUDENT" | "ADMIN";
  isSelf: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleToggle() {
    const nextRole = role === "ADMIN" ? "STUDENT" : "ADMIN";
    if (
      !window.confirm(
        nextRole === "ADMIN"
          ? "Grant this user admin access?"
          : "Remove admin access from this user?"
      )
    ) {
      return;
    }
    setIsSubmitting(true);
    await setUserRole(userId, nextRole);
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={role === "ADMIN" ? "accent" : "neutral"}>{role}</Badge>
      <Button
        variant="ghost"
        size="sm"
        disabled={isSelf || isSubmitting}
        onClick={handleToggle}
        title={isSelf ? "You can't change your own role" : undefined}
      >
        {role === "ADMIN" ? "Revoke admin" : "Make admin"}
      </Button>
    </div>
  );
}
