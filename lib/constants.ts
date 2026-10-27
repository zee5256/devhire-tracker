import type { ApplicationStatus } from "@prisma/client";

export const APPLICATION_STATUSES = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const satisfies readonly ApplicationStatus[];

export type StatusMeta = {
  label: string;
  description: string;
  /** Solid colour used for charts and dots. */
  hex: string;
  dot: string;
  pill: string;
  column: string;
};

export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  WISHLIST: {
    label: "Wishlist",
    description: "Roles you want to apply to",
    hex: "#94a3b8",
    dot: "bg-slate-400",
    pill: "bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:text-slate-300",
    column: "bg-slate-400",
  },
  APPLIED: {
    label: "Applied",
    description: "Applications waiting for a reply",
    hex: "#3b82f6",
    dot: "bg-blue-500",
    pill: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300",
    column: "bg-blue-500",
  },
  INTERVIEW: {
    label: "Interview",
    description: "In conversation with the team",
    hex: "#8b5cf6",
    dot: "bg-violet-500",
    pill: "bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300",
    column: "bg-violet-500",
  },
  OFFER: {
    label: "Offer",
    description: "Offers on the table",
    hex: "#10b981",
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
    column: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    description: "Closed or declined",
    hex: "#f43f5e",
    dot: "bg-rose-500",
    pill: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300",
    column: "bg-rose-500",
  },
};

export const DEMO_EMAIL =
  process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@devhire.app";
export const DEMO_PASSWORD =
  process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "demo1234";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "company", label: "Company A–Z" },
  { value: "follow-up", label: "Follow-up date" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const APP_NAME = "DevHire Tracker";
