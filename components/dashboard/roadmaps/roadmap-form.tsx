"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { roadmapSchema, type RoadmapInput } from "@/lib/validations/roadmap";
import { createRoadmap } from "@/actions/roadmaps";
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

export function RoadmapForm() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoadmapInput>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: { title: "", description: "", targetDate: "" },
  });

  async function onSubmit(values: RoadmapInput) {
    setFormError(null);
    setIsSubmitting(true);

    const result = await createRoadmap(values);

    if (!result.success) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setOpen(false);
    reset();
    router.push(`/dashboard/roadmaps/${result.data.id}`);
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
        <Button variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New roadmap
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a roadmap</DialogTitle>
          <DialogDescription>Give it a goal-oriented title. Add milestones next.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {formError && <Alert variant="error">{formError}</Alert>}

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Placement readiness"
              invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-[var(--color-danger)]">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="targetDate">Target date (optional)</Label>
            <Input id="targetDate" type="date" {...register("targetDate")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create roadmap
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
