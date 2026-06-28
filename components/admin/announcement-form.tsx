"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { announcementSchema, type AnnouncementInput } from "@/lib/validations/announcement";
import { createAnnouncement, updateAnnouncement } from "@/actions/admin";
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
import type { Announcement } from "@/types";

const AUDIENCE_LABELS: Record<string, string> = {
  ALL: "Everyone",
  STUDENTS: "Students only",
  ADMINS: "Admins only",
};

export function AnnouncementForm({
  announcement,
  trigger,
}: {
  announcement?: Announcement;
  trigger?: React.ReactNode;
}) {
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
  } = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
    defaultValues: announcement
      ? {
          title: announcement.title,
          body: announcement.body,
          audience: announcement.audience,
          published: announcement.published,
        }
      : { title: "", body: "", audience: "ALL", published: true },
  });

  async function onSubmit(values: AnnouncementInput) {
    setFormError(null);
    setIsSubmitting(true);

    const result = announcement
      ? await updateAnnouncement(announcement.id, values)
      : await createAnnouncement(values);

    if (!result.success) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setOpen(false);
    if (!announcement) reset();
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
            New announcement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{announcement ? "Edit announcement" : "New announcement"}</DialogTitle>
          <DialogDescription>Visible to the audience you choose, once published.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {formError && <Alert variant="error">{formError}</Alert>}

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" invalid={!!errors.title} {...register("title")} />
            {errors.title && <p className="text-xs text-[var(--color-danger)]">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="body">Body</Label>
            <Textarea id="body" rows={4} invalid={!!errors.body} {...register("body")} />
            {errors.body && <p className="text-xs text-[var(--color-danger)]">{errors.body.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="audience">Audience</Label>
            <Controller
              control={control}
              name="audience"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" className="size-4 accent-[var(--color-accent)]" {...register("published")} />
            <Label htmlFor="published" className="cursor-pointer font-normal">
              Publish immediately
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {announcement ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditAnnouncementTrigger() {
  return (
    <Button variant="ghost" size="icon" type="button" aria-label="Edit announcement">
      <Pencil className="size-4" aria-hidden="true" />
    </Button>
  );
}
