"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { projectSchema, type ProjectInput } from "@/lib/validations/projects";
import { createProject, updateProject } from "@/actions/projects";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Project } from "@/types";

interface ProjectFormProps {
  project?: Project;
  trigger?: React.ReactNode;
}

export function ProjectForm({ project, trigger }: ProjectFormProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          title: project.title,
          description: project.description ?? "",
          status: project.status,
          technologies: project.technologies.join(", "),
          repoUrl: project.repoUrl ?? "",
          liveUrl: project.liveUrl ?? "",
        }
      : {
          title: "",
          description: "",
          status: "PLANNING",
          technologies: "",
          repoUrl: "",
          liveUrl: "",
        },
  });

  async function onSubmit(values: ProjectInput) {
    setFormError(null);
    setIsSubmitting(true);

    const result = project ? await updateProject(project.id, values) : await createProject(values);

    if (!result.success) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setOpen(false);
    if (!project) reset();
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
        {trigger ?? (
          <Button variant="primary" size="sm">
            <Plus className="size-4" aria-hidden="true" />
            Add project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "Add a project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update its stage, stack, or links." : "Track a project from idea to ship."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {formError && <Alert variant="error">{formError}</Alert>}

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" invalid={!!errors.title} {...register("title")} />
            {errors.title && <p className="text-xs text-[var(--color-danger)]">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Stage</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              placeholder="Next.js, PostgreSQL, Stripe"
              {...register("technologies")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="repoUrl">Repository URL</Label>
              <Input
                id="repoUrl"
                placeholder="https://github.com/..."
                invalid={!!errors.repoUrl}
                {...register("repoUrl")}
              />
              {errors.repoUrl && <p className="text-xs text-[var(--color-danger)]">{errors.repoUrl.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                placeholder="https://..."
                invalid={!!errors.liveUrl}
                {...register("liveUrl")}
              />
              {errors.liveUrl && <p className="text-xs text-[var(--color-danger)]">{errors.liveUrl.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {project ? "Save changes" : "Add project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditProjectTrigger() {
  return (
    <Button variant="ghost" size="icon" type="button" aria-label="Edit project">
      <Pencil className="size-4" aria-hidden="true" />
    </Button>
  );
}
