"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { updateProfile } from "@/actions/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { AvatarUploader } from "@/components/dashboard/profile/avatar-uploader";
import type { Profile } from "@/types";

interface ProfileFormProps {
  name: string | null;
  email: string | null;
  profile: Profile | null;
}

export function ProfileForm({ name, email, profile }: ProfileFormProps) {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name ?? "",
      bio: profile?.bio ?? "",
      college: profile?.college ?? "",
      branch: profile?.branch ?? "",
      graduationYear: profile?.graduationYear ?? undefined,
      location: profile?.location ?? "",
      careerInterests: profile?.careerInterests.join(", ") ?? "",
      goals: profile?.goals.join(", ") ?? "",
      githubUrl: profile?.githubUrl ?? "",
      linkedinUrl: profile?.linkedinUrl ?? "",
      portfolioUrl: profile?.portfolioUrl ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    },
  });

  async function onSubmit(values: ProfileInput) {
    setFormError(null);
    setIsSaved(false);
    setIsSubmitting(true);

    const result = await updateProfile(values);

    setIsSubmitting(false);
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    setIsSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}
      {isSaved && <Alert variant="success">Profile updated.</Alert>}

      <Card>
        <CardContent className="space-y-5 p-6">
          <Controller
            control={control}
            name="avatarUrl"
            render={({ field }) => (
              <AvatarUploader
                name={name}
                currentAvatarUrl={profile?.avatarUrl}
                onChange={(dataUrl) => {
                  field.onChange(dataUrl);
                  setValue("avatarUrl", dataUrl);
                }}
              />
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" invalid={!!errors.name} {...register("name")} />
              {errors.name && <p className="text-xs text-[var(--color-danger)]">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email ?? ""} disabled />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} placeholder="A short introduction" {...register("bio")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-semibold">Education</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="college">College</Label>
              <Input id="college" {...register("college")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" placeholder="e.g. Mechanical Engineering" {...register("branch")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="graduationYear">Graduation year</Label>
              <Input
                id="graduationYear"
                type="number"
                {...register("graduationYear", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="City, Country" {...register("location")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-semibold">Career</p>
          <div className="space-y-1.5">
            <Label htmlFor="careerInterests">Career interests (comma-separated)</Label>
            <Input id="careerInterests" placeholder="Backend, Robotics, ML" {...register("careerInterests")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="goals">Goals (comma-separated)</Label>
            <Input id="goals" placeholder="Land an SDE internship, Learn Rust" {...register("goals")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-semibold">Links</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="githubUrl">GitHub</Label>
              <Input id="githubUrl" invalid={!!errors.githubUrl} {...register("githubUrl")} />
              {errors.githubUrl && (
                <p className="text-xs text-[var(--color-danger)]">{errors.githubUrl.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input id="linkedinUrl" invalid={!!errors.linkedinUrl} {...register("linkedinUrl")} />
              {errors.linkedinUrl && (
                <p className="text-xs text-[var(--color-danger)]">{errors.linkedinUrl.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="portfolioUrl">Portfolio</Label>
              <Input id="portfolioUrl" invalid={!!errors.portfolioUrl} {...register("portfolioUrl")} />
              {errors.portfolioUrl && (
                <p className="text-xs text-[var(--color-danger)]">{errors.portfolioUrl.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" variant="primary" isLoading={isSubmitting}>
        <Save className="size-4" aria-hidden="true" />
        Save profile
      </Button>
    </form>
  );
}
