import { toDateInputValue } from "@/lib/utils";
import type { ApplicationFormValues } from "@/lib/validations/application";
import type { ApplicationDTO } from "@/types";

/** Turns validated form values into Prisma-ready columns. */
export function toApplicationData(values: ApplicationFormValues) {
  return {
    company: values.company,
    role: values.role,
    status: values.status,
    jobUrl: values.jobUrl || null,
    location: values.location || null,
    salary: values.salary || null,
    appliedDate: values.appliedDate
      ? new Date(`${values.appliedDate}T00:00:00.000Z`)
      : null,
    followUpDate: values.followUpDate
      ? new Date(`${values.followUpDate}T00:00:00.000Z`)
      : null,
    notes: values.notes || null,
  };
}

/** Form defaults for the create / edit flows. */
export function toFormValues(
  application?: Partial<ApplicationDTO>,
): ApplicationFormValues {
  return {
    company: application?.company ?? "",
    role: application?.role ?? "",
    status: application?.status ?? "WISHLIST",
    jobUrl: application?.jobUrl ?? "",
    location: application?.location ?? "",
    salary: application?.salary ?? "",
    appliedDate: toDateInputValue(application?.appliedDate),
    followUpDate: toDateInputValue(application?.followUpDate),
    notes: application?.notes ?? "",
  };
}
