"use client";

import { LogOut } from "lucide-react";
import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        logoutUser();
      }}
    >
      <LogOut className="size-4" aria-hidden="true" />
      Sign out
    </Button>
  );
}
