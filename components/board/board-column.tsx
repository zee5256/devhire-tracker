"use client";

import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ApplicationStatus } from "@prisma/client";

import { SortableApplicationCard } from "@/components/applications/application-card";
import { STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ApplicationDTO } from "@/types";

export function BoardColumn({
  status,
  applications,
  onOpen,
  onAdd,
  disabled,
  className,
}: {
  status: ApplicationStatus;
  applications: ApplicationDTO[];
  onOpen: (app: ApplicationDTO) => void;
  onAdd: (status: ApplicationStatus) => void;
  disabled?: boolean;
  className?: string;
}) {
  const meta = STATUS_META[status];
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${status}`,
    data: { type: "column", status },
  });

  return (
    <section
      aria-label={`${meta.label} column`}
      className={cn(
        "flex min-h-[16rem] flex-col rounded-2xl border border-border bg-muted/40 lg:h-[calc(100dvh-17rem)]",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-2 px-3 pb-1.5 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("size-2 rounded-full", meta.dot)} aria-hidden />
          <h2 className="truncate text-xs font-semibold uppercase tracking-wider text-foreground/80">
            {meta.label}
          </h2>
          <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground ring-1 ring-border">
            {applications.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(status)}
          aria-label={`Add application to ${meta.label}`}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          "scrollbar-slim flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2 pt-1 transition-colors",
          isOver && !disabled && "bg-accent/[0.04]",
        )}
      >
        <SortableContext
          items={applications.map((app) => app.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((application) => (
            <SortableApplicationCard
              key={application.id}
              application={application}
              disabled={disabled}
              onOpen={() => onOpen(application)}
            />
          ))}
        </SortableContext>

        {applications.length === 0 ? (
          <div
            className={cn(
              "grid flex-1 place-items-center rounded-xl border border-dashed border-border px-3 py-8 text-center text-[11px] leading-relaxed text-muted-foreground",
              isOver && !disabled && "border-accent/40 bg-accent/5 text-accent",
            )}
          >
            {disabled
              ? "No matching applications"
              : isOver
                ? "Drop here"
                : "No applications yet"}
          </div>
        ) : null}
      </div>
    </section>
  );
}
