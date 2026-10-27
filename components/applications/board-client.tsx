"use client";

import { Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { ApplicationStatus } from "@prisma/client";

import { ApplicationDrawer } from "@/components/applications/application-drawer";
import { ApplicationFormModal } from "@/components/applications/application-form-modal";
import { FilterBar } from "@/components/applications/filter-bar";
import { KanbanBoard } from "@/components/board/kanban-board";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ExportCsvLink } from "@/components/ui/export-csv-link";
import { PageHeader } from "@/components/ui/page-header";
import { useApplications } from "@/hooks/use-applications";
import { filterApplications, useApplicationFilters } from "@/hooks/use-application-filters";
import { isOverdue, pluralize } from "@/lib/utils";
import type { ApplicationDTO } from "@/types";

export function BoardClient() {
  const { applications, deleteApplication } = useApplications();
  const { filters, update, reset, hasFilters } = useApplicationFilters();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ApplicationDTO | null>(null);
  const [formStatus, setFormStatus] = useState<ApplicationStatus>("WISHLIST");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<ApplicationDTO | null>(null);

  const visible = useMemo(
    () => filterApplications(applications, filters),
    [applications, filters],
  );

  const overdueCount = useMemo(
    () =>
      applications.filter(
        (app) => app.status !== "REJECTED" && isOverdue(app.followUpDate),
      ).length,
    [applications],
  );

  const selected = applications.find((app) => app.id === selectedId) ?? null;

  function openCreate(status: ApplicationStatus) {
    setEditing(null);
    setFormStatus(status);
    setFormOpen(true);
  }

  function openEdit(application: ApplicationDTO) {
    setSelectedId(null);
    setEditing(application);
    setFormOpen(true);
  }

  function requestDelete(application: ApplicationDTO) {
    setSelectedId(null);
    setDeleting(application);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pipeline"
        description={`${applications.length} ${pluralize(applications.length, "application")}${
          overdueCount > 0
            ? ` · ${overdueCount} overdue follow-${overdueCount === 1 ? "up" : "ups"}`
            : " · stay on top of every follow-up"
        }`}
        actions={
          <>
            <ExportCsvLink />
            <Button onClick={() => openCreate("WISHLIST")}>
              <Plus className="size-4" aria-hidden />
              Add application
            </Button>
          </>
        }
      />

      {applications.length === 0 ? (
        <div className="surface flex flex-col gap-3 border-dashed p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
              <Sparkles className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">Start your pipeline</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Add the first role you are chasing and drag it through each
                stage as you progress.
              </p>
            </div>
          </div>
          <Button onClick={() => openCreate("WISHLIST")} className="shrink-0">
            <Plus className="size-4" aria-hidden />
            Add application
          </Button>
        </div>
      ) : null}

      <FilterBar
        filters={filters}
        onChange={update}
        onReset={reset}
        hasFilters={hasFilters}
        resultCount={visible.length}
      />

      <KanbanBoard
        applications={visible}
        filtersActive={hasFilters}
        onOpen={(application) => setSelectedId(application.id)}
        onAdd={openCreate}
      />

      <ApplicationFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        application={editing}
        defaultStatus={formStatus}
      />

      <ApplicationDrawer
        application={selected}
        onClose={() => setSelectedId(null)}
        onEdit={openEdit}
        onDelete={requestDelete}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await deleteApplication(deleting.id);
        }}
        title="Delete application?"
        description={
          deleting
            ? `${deleting.role} at ${deleting.company} and its notes will be removed.`
            : ""
        }
      />
    </div>
  );
}
