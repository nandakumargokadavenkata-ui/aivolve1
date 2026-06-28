"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CameraIcon } from "lucide-react";
import { recordAnalyticsSnapshot } from "@/actions/analytics";
import { Button } from "@/components/ui/button";

export function RecordSnapshotButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleClick() {
    setIsSubmitting(true);
    await recordAnalyticsSnapshot();
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} isLoading={isSubmitting}>
      <CameraIcon className="size-4" aria-hidden="true" />
      Record today&apos;s snapshot
    </Button>
  );
}
