"use client";

import {
  Banknote,
  CalendarDays,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";

import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplications } from "@/hooks/use-applications";
import { apiRequest } from "@/lib/client-api";
import {
  cn,
  formatDate,
  formatDateTime,
  isDueToday,
  isOverdue,
  relativeDayLabel,
} from "@/lib/utils";
import type { ApplicationDTO, NoteDTO } from "@/types";

export function ApplicationDrawer({
  application,
  onClose,
  onEdit,
  onDelete,
}: {
  application: ApplicationDTO | null;
  onClose: () => void;
  onEdit: (application: ApplicationDTO) => void;
  onDelete: (application: ApplicationDTO) => void;
}) {
  return (
    <Drawer
      open={Boolean(application)}
      onClose={onClose}
      title="Application details"
      footer={
        application ? (
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-danger hover:bg-danger/10 hover:text-danger"
              onClick={() => onDelete(application)}
            >
              <Trash className="size-3.5" aria-hidden />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button size="sm" onClick={() => onEdit(application)}>
                <Pencil className="size-3.5" aria-hidden />
                Edit
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {application ? (
        <DrawerBody key={application.id} application={application} />
      ) : null}
    </Drawer>
  );
}

function DrawerBody({ application }: { application: ApplicationDTO }) {
  const { addNote } = useApplications();
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiRequest<{ notes: NoteDTO[] }>(`/api/applications/${application.id}`)
      .then((data) => {
        if (!cancelled) setNotes(data.notes);
      })
      .catch(() => {
        if (!cancelled) setNoteError("Could not load notes.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [application.id]);

  async function submitNote(event: React.FormEvent) {
    event.preventDefault();

    const content = noteText.trim();
    if (!content) {
      setNoteError("Write something first.");
      return;
    }
    if (content.length > 2000) {
      setNoteError("Notes must be 2000 characters or fewer.");
      return;
    }

    setSavingNote(true);
    setNoteError(null);
    const note = await addNote(application.id, content);
    setSavingNote(false);

    if (note) {
      setNotes((current) => [note, ...current]);
      setNoteText("");
    }
  }

  const overdue = isOverdue(application.followUpDate);
  const dueToday = isDueToday(application.followUpDate);

  return (
    <div className="space-y-6 px-5 py-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {application.company}
        </p>
        <h2 className="mt-1 text-lg font-semibold leading-snug">
          {application.role}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={application.status} />
          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
            >
              View posting
              <ExternalLink className="size-3" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        <Detail icon={MapPin} label="Location" value={application.location} />
        <Detail icon={Banknote} label="Salary" value={application.salary} />
        <Detail
          icon={CalendarDays}
          label="Applied"
          value={
            application.appliedDate ? formatDate(application.appliedDate) : null
          }
        />
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <Clock className="size-3" aria-hidden />
            Follow-up
          </dt>
          <dd
            className={cn(
              "mt-1 text-xs font-medium",
              overdue
                ? "text-danger"
                : dueToday
                  ? "text-amber-600 dark:text-amber-300"
                  : "text-foreground",
            )}
          >
            {application.followUpDate
              ? formatDate(application.followUpDate)
              : "Not set"}
            {application.followUpDate ? (
              <span className="ml-1 font-normal text-muted-foreground">
                · {relativeDayLabel(application.followUpDate)}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      {application.notes ? (
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Overview
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {application.notes}
          </p>
        </section>
      ) : null}

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Timeline
          </h3>
          <span className="text-[10px] text-muted-foreground">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        </div>

        <form onSubmit={submitNote} className="mt-2.5">
          <Textarea
            value={noteText}
            onChange={(event) => {
              setNoteText(event.target.value);
              if (noteError) setNoteError(null);
            }}
            rows={2}
            placeholder="Add a note — recruiter call, next steps…"
            aria-label="New note"
            aria-invalid={Boolean(noteError)}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {noteText.length}/2000
            </span>
            <Button
              type="submit"
              size="sm"
              loading={savingNote}
              disabled={!noteText.trim()}
            >
              <Plus className="size-3.5" aria-hidden />
              Add note
            </Button>
          </div>
          {noteError ? (
            <p role="alert" className="mt-1 text-[11px] text-danger">
              {noteError}
            </p>
          ) : null}
        </form>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-4 text-xs text-muted-foreground">
              <FileText className="size-4" aria-hidden />
              No notes yet. Capture what happens next.
            </div>
          ) : (
            <ol className="relative space-y-4 border-l border-border pl-4">
              {notes.map((note) => (
                <li key={note.id} className="relative">
                  <span
                    className="absolute -left-[21px] top-1 size-2 rounded-full border-2 border-card bg-accent"
                    aria-hidden
                  />
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {note.content}
                  </p>
                  <time
                    dateTime={note.createdAt}
                    className="mt-1 block text-[10px] text-muted-foreground"
                  >
                    {formatDateTime(note.createdAt)}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <p className="border-t border-border pt-3 text-[10px] text-muted-foreground">
        Added {formatDateTime(application.createdAt)} · Last updated{" "}
        {formatDateTime(application.updatedAt)}
      </p>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 truncate text-xs font-medium">{value || "—"}</dd>
    </div>
  );
}
