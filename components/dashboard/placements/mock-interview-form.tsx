"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { mockInterviewSchema, type MockInterviewInput } from "@/lib/validations/placement";
import { createMockInterview } from "@/actions/placement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MockInterviewForm() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MockInterviewInput>({
    resolver: zodResolver(mockInterviewSchema),
    defaultValues: { title: "", date: "", feedback: "" },
  });

  async function onSubmit(values: MockInterviewInput) {
    setFormError(null);
    setIsSubmitting(true);

    const result = await createMockInterview(values);

    if (!result.success) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setFormError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Log mock interview
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a mock interview</DialogTitle>
          <DialogDescription>Track who it was with, your score, and what to improve.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {formError && <Alert variant="error">{formError}</Alert>}

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. System design mock — peer"
              invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-[var(--color-danger)]">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" invalid={!!errors.date} {...register("date")} />
              {errors.date && <p className="text-xs text-[var(--color-danger)]">{errors.date.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="score">Score (0–100, optional)</Label>
              <Input id="score" type="number" min={0} max={100} {...register("score", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback">Feedback (optional)</Label>
            <Textarea id="feedback" rows={3} {...register("feedback")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
