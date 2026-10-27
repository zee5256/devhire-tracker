"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Select, Input, Textarea } from "@/components/ui/fields";
import { Modal } from "@/components/ui/modal";
import { useApplications } from "@/hooks/use-applications";
import { toFormValues } from "@/lib/application-form";
import { APPLICATION_STATUSES, STATUS_META } from "@/lib/constants";
import {
  applicationFormSchema,
  type ApplicationFormValues,
} from "@/lib/validations/application";
import type { ApplicationDTO } from "@/types";
import type { ApplicationStatus } from "@prisma/client";

export function ApplicationFormModal({
  open,
  onClose,
  application,
  defaultStatus = "WISHLIST",
}: {
  open: boolean;
  onClose: () => void;
  application?: ApplicationDTO | null;
  defaultStatus?: ApplicationStatus;
}) {
  const { createApplication, updateApplication } = useApplications();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: toFormValues(),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!open) return;
    reset(
      toFormValues(application ?? { status: defaultStatus }),
    );
  }, [open, application, defaultStatus, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const success = application
      ? await updateApplication(application.id, values)
      : await createApplication(values);

    if (success) onClose();
  });

  const isEditing = Boolean(application);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit application" : "New application"}
      description={
        isEditing
          ? "Update the details for this role."
          : "Track a role you have applied to or want to apply for."
      }
      size="lg"
      preventClose={isSubmitting}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="application-form"
            loading={isSubmitting}
          >
            {isEditing ? "Save changes" : "Add application"}
          </Button>
        </>
      }
    >
      <form
        id="application-form"
        onSubmit={onSubmit}
        noValidate
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Company *" htmlFor="company" error={errors.company?.message}>
          <Input
            id="company"
            placeholder="e.g. Vercel"
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            {...register("company")}
          />
        </Field>

        <Field label="Role *" htmlFor="role" error={errors.role?.message}>
          <Input
            id="role"
            placeholder="e.g. Senior Frontend Engineer"
            aria-invalid={Boolean(errors.role)}
            {...register("role")}
          />
        </Field>

        <Field label="Status" htmlFor="status" error={errors.status?.message}>
          <Select id="status" {...register("status")}>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Job URL"
          htmlFor="jobUrl"
          error={errors.jobUrl?.message}
          hint="Optional link to the posting"
        >
          <Input
            id="jobUrl"
            type="url"
            placeholder="https://"
            inputMode="url"
            aria-invalid={Boolean(errors.jobUrl)}
            {...register("jobUrl")}
          />
        </Field>

        <Field
          label="Location"
          htmlFor="location"
          error={errors.location?.message}
        >
          <Input
            id="location"
            placeholder="Remote · EU"
            {...register("location")}
          />
        </Field>

        <Field label="Salary" htmlFor="salary" error={errors.salary?.message}>
          <Input
            id="salary"
            placeholder="$120k – $150k"
            {...register("salary")}
          />
        </Field>

        <Field
          label="Applied on"
          htmlFor="appliedDate"
          error={errors.appliedDate?.message}
        >
          <Input
            id="appliedDate"
            type="date"
            className="[color-scheme:light] dark:[color-scheme:dark]"
            {...register("appliedDate")}
          />
        </Field>

        <Field
          label="Follow-up date"
          htmlFor="followUpDate"
          error={errors.followUpDate?.message}
          hint="We will flag it when it is due"
        >
          <Input
            id="followUpDate"
            type="date"
            className="[color-scheme:light] dark:[color-scheme:dark]"
            {...register("followUpDate")}
          />
        </Field>

        <Field
          label="Notes"
          htmlFor="notes"
          error={errors.notes?.message}
          className="sm:col-span-2"
        >
          <Textarea
            id="notes"
            rows={4}
            placeholder="Recruiter name, referral, interview notes…"
            {...register("notes")}
          />
        </Field>
      </form>
    </Modal>
  );
}
