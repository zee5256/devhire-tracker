"use client";

import {
  Banknote,
  CalendarDays,
  Clock,
  FileText,
  GripVertical,
  MapPin,
  Pencil,
  Trash,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Badge } from "@/components/ui/badge";
import {
  cn,
  formatDate,
  isDueToday,
  isOverdue,
  relativeDayLabel,
} from "@/lib/utils";
import type { ApplicationDTO } from "@/types";

type CardProps = {
  application: ApplicationDTO;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  isOverlay?: boolean;
  className?: string;
};

export function ApplicationCard({
  application,
  onOpen,
  onEdit,
  onDelete,
  dragHandleProps,
  isDragging,
  isOverlay,
  className,
}: CardProps) {
  const overdue = isOverdue(application.followUpDate);
  const dueToday = isDueToday(application.followUpDate);

  return (
    <article
      onClick={onOpen}
      onKeyDown={(event) => {
        if (!onOpen) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={
        onOpen
          ? `Open ${application.role} at ${application.company}`
          : undefined
      }
      className={cn(
        "group relative rounded-xl border border-border bg-card p-3 text-left shadow-xs transition-[box-shadow,transform,border-color] duration-150",
        onOpen &&
          "cursor-pointer hover:border-accent/35 hover:shadow-md focus-visible:border-accent",
        isDragging && "opacity-40",
        isOverlay && "rotate-2 cursor-grabbing shadow-2xl ring-2 ring-accent/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {application.company}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug">
            {application.role}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {onEdit ? (
            <button
              type="button"
              aria-label={`Edit ${application.company} application`}
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Pencil className="size-3.5" />
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              aria-label={`Delete ${application.company} application`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-danger/10 hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Trash className="size-3.5" />
            </button>
          ) : null}
          {dragHandleProps ? (
            <button
              type="button"
              {...dragHandleProps}
              onClick={(event) => event.stopPropagation()}
              aria-label={`Reorder ${application.company} application`}
              className="grid size-7 cursor-grab touch-none place-items-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
            >
              <GripVertical className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {application.location || application.salary ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {application.location ? (
            <Badge className="max-w-full">
              <MapPin className="size-3" aria-hidden />
              <span className="truncate">{application.location}</span>
            </Badge>
          ) : null}
          {application.salary ? (
            <Badge className="max-w-full">
              <Banknote className="size-3" aria-hidden />
              <span className="truncate">{application.salary}</span>
            </Badge>
          ) : null}
        </div>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3" aria-hidden />
          {application.appliedDate
            ? formatDate(application.appliedDate, {
                month: "short",
                day: "numeric",
              })
            : "No date"}
        </span>

        {application.noteCount > 0 ? (
          <span className="inline-flex items-center gap-1">
            <FileText className="size-3" aria-hidden />
            {application.noteCount}
          </span>
        ) : null}

        {application.followUpDate ? (
          <span
            className={cn(
              "ml-auto inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium",
              overdue
                ? "bg-danger/10 text-danger"
                : dueToday
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  : "bg-muted text-muted-foreground",
            )}
          >
            <Clock className="size-3" aria-hidden />
            {overdue || dueToday
              ? relativeDayLabel(application.followUpDate)
              : formatDate(application.followUpDate, {
                  month: "short",
                  day: "numeric",
                })}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function SortableApplicationCard({
  application,
  disabled,
  ...props
}: Omit<CardProps, "dragHandleProps" | "isDragging"> & { disabled?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    disabled,
    data: { type: "card", status: application.status },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "z-10")}
    >
      <ApplicationCard
        {...props}
        application={application}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
