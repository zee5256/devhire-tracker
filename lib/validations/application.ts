import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
]);

const dateInputSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Use a valid date",
  );

export const applicationFormSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(1, "Company is required")
      .max(120, "Company must be 120 characters or fewer"),
    role: z
      .string()
      .trim()
      .min(1, "Role is required")
      .max(120, "Role must be 120 characters or fewer"),
    status: applicationStatusSchema,
    jobUrl: z
      .string()
      .trim()
      .max(500, "URL is too long")
      .refine(
        (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
        "Enter a full URL starting with http:// or https://",
      ),
    location: z.string().trim().max(120, "Location is too long"),
    salary: z.string().trim().max(120, "Salary is too long"),
    appliedDate: dateInputSchema,
    followUpDate: dateInputSchema,
    notes: z.string().trim().max(4000, "Notes are too long"),
  })
  .refine(
    (values) =>
      !values.appliedDate ||
      !values.followUpDate ||
      values.followUpDate >= values.appliedDate,
    {
      message: "Follow-up date cannot be before the applied date",
      path: ["followUpDate"],
    },
  );

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export const noteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Write something first")
    .max(2000, "Notes must be 2000 characters or fewer"),
});

export type NoteValues = z.infer<typeof noteSchema>;

export const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        status: applicationStatusSchema,
        position: z.number().int().min(0).max(10_000),
      }),
    )
    .min(1, "Nothing to reorder")
    .max(500, "Too many items"),
});

export type ReorderPayload = z.infer<typeof reorderSchema>;

export const applicationUpdateSchema = applicationFormSchema;
