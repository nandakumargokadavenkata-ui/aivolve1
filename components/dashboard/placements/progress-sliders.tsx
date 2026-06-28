"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import {
  placementProgressSchema,
  type PlacementProgressInput,
} from "@/lib/validations/placement";
import { updatePlacementProgress } from "@/actions/placement";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const FIELDS: { key: keyof PlacementProgressInput; label: string }[] = [
  { key: "aptitudeProgress", label: "Aptitude" },
  { key: "dsaProgress", label: "DSA" },
  { key: "coreSubjectsProgress", label: "Core subjects" },
  { key: "resumeProgress", label: "Resume" },
];

export function PlacementProgressForm({
  initialValues,
}: {
  initialValues: PlacementProgressInput;
}) {
  const router = useRouter();
  const [isSaved, setIsSaved] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const { register, handleSubmit, watch } = useForm<PlacementProgressInput>({
    resolver: zodResolver(placementProgressSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: PlacementProgressInput) {
    setFormError(null);
    setIsSubmitting(true);
    setIsSaved(false);

    const result = await updatePlacementProgress(values);

    setIsSubmitting(false);
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    setIsSaved(true);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {formError && <Alert variant="error">{formError}</Alert>}
          {isSaved && <Alert variant="success">Progress saved.</Alert>}

          <div className="grid gap-5 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <ProgressSlider key={field.key} label={field.label} fieldKey={field.key} register={register} watch={watch} />
            ))}
          </div>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            <Save className="size-4" aria-hidden="true" />
            Save progress
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ProgressSlider({
  label,
  fieldKey,
  register,
  watch,
}: {
  label: string;
  fieldKey: keyof PlacementProgressInput;
  register: ReturnType<typeof useForm<PlacementProgressInput>>["register"];
  watch: ReturnType<typeof useForm<PlacementProgressInput>>["watch"];
}) {
  const value = watch(fieldKey);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-[var(--color-text-muted)]">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        className="w-full accent-[var(--color-accent)]"
        {...register(fieldKey, { valueAsNumber: true })}
      />
    </div>
  );
}
