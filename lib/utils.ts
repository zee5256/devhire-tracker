import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Application dates are stored as Postgres `date` values, which Prisma returns
 * as UTC midnight. Formatting them in the browser's local timezone would shift
 * the day for users west of UTC, so all calendar-date helpers work in UTC.
 */
export function toCalendarDate(value: string | Date): Date {
  if (typeof value === "string") {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

/** `YYYY-MM-DD` for `<input type="date">`. */
export function toDateInputValue(value?: string | Date | null): string {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export function formatDate(
  value?: string | Date | null,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  if (!value) return "—";
  const date = toCalendarDate(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** Whole days between today (local calendar) and a stored calendar date. */
export function daysFromToday(value?: string | Date | null): number | null {
  if (!value) return null;
  const target = toCalendarDate(value).getTime();
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86_400_000);
}

export function isOverdue(value?: string | Date | null): boolean {
  const days = daysFromToday(value);
  return days !== null && days < 0;
}

export function isDueToday(value?: string | Date | null): boolean {
  return daysFromToday(value) === 0;
}

export function relativeDayLabel(value?: string | Date | null): string {
  const days = daysFromToday(value);
  if (days === null) return "—";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days === -1) return "1 day overdue";
  if (days < 0) return `${Math.abs(days)} days overdue`;
  return `In ${days} days`;
}

export function initials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }
  return email?.[0]?.toUpperCase() ?? "U";
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
