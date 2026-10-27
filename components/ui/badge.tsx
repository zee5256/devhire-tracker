import type { ApplicationStatus } from "@prisma/client";

import { STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
  withDot = true,
}: {
  status: ApplicationStatus;
  className?: string;
  withDot?: boolean;
}) {
  const meta = STATUS_META[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
        meta.pill,
        className,
      )}
    >
      {withDot ? (
        <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
      ) : null}
      {meta.label}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
