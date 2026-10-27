"use client";

import { Inbox, Pencil, Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";

import { ApplicationCard } from "@/components/applications/application-card";
import { ApplicationDrawer } from "@/components/applications/application-drawer";
import { ApplicationFormModal } from "@/components/applications/application-form-modal";
import { FilterBar } from "@/components/applications/filter-bar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ExportCsvLink } from "@/components/ui/export-csv-link";
import { PageHeader } from "@/components/ui/page-header";
import { useApplications } from "@/hooks/use-applications";
import {
  filterApplications,
  useApplicationFilters,
} from "@/hooks/use-application-filters";
import {
  cn,
  formatDate,
  isDueToday,
  isOverdue,
  relativeDayLabel,
} from "@/lib/utils";
import type { ApplicationDTO } from "@/types";

export function ApplicationsClient() {
  const { applications, deleteApplication } = useApplications();
  const { filters, update, reset, hasFilters } = useApplicationFilters();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ApplicationDTO | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<ApplicationDTO | null>(null);

  const visible = useMemo(
    () => filterApplications(applications, filters),
    [applications, filters],
  );

  const selected = applications.find((app) => app.id === selectedId) ?? null;

  function openCreate() {
    setEditing(null);
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
        title="Applications"
        description={`${applications.length} total · search, filter, and export every role you are tracking`}
        actions={
          <>
            <ExportCsvLink />
            <Button onClick={openCreate}>
              <Plus className="size-4" aria-hidden />
              Add application
            </Button>
          </>
        }
      />

      <FilterBar
        filters={filters}
        onChange={update}
        onReset={reset}
        hasFilters={hasFilters}
        resultCount={visible.length}
        showSort
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={hasFilters ? "No matching applications" : "No applications yet"}
          description={
            hasFilters
              ? "Try a different search, widen the date range, or clear the filters."
              : "Add your first application and it will show up here with its status, dates, and notes."
          }
          action={
            hasFilters ? (
              <Button variant="outline" onClick={reset}>
                Clear filters
              </Button>
            ) : (
              <Button onClick={openCreate}>
                <Plus className="size-4" aria-hidden />
                Add application
              </Button>
            )
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="grid gap-2 md:hidden">
            {visible.map((application) => (
              <li key={application.id}>
                <ApplicationCard
                  application={application}
                  onOpen={() => setSelectedId(application.id)}
                  onEdit={() => openEdit(application)}
                  onDelete={() => requestDelete(application)}
                />
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="surface hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  All job applications
                </caption>
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Company / Role
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Location
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Applied
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Follow-up
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((application) => {
                    const overdue = isOverdue(application.followUpDate);
                    const dueToday = isDueToday(application.followUpDate);

                    return (
                      <tr
                        key={application.id}
                        tabIndex={0}
                        onClick={() => setSelectedId(application.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(application.id);
                          }
                        }}
                        aria-label={`Open ${application.role} at ${application.company}`}
                        className="group cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/40 focus-visible:bg-muted/40"
                      >
                        <td className="max-w-[280px] px-4 py-3">
                          <p className="truncate text-xs text-muted-foreground">
                            {application.company}
                          </p>
                          <p className="truncate font-medium">
                            {application.role}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="max-w-[160px] truncate px-4 py-3 text-xs text-muted-foreground">
                          {application.location || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                          {application.appliedDate
                            ? formatDate(application.appliedDate)
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs">
                          {application.followUpDate ? (
                            <span
                              className={cn(
                                overdue
                                  ? "font-medium text-danger"
                                  : dueToday
                                    ? "font-medium text-amber-600 dark:text-amber-300"
                                    : "text-muted-foreground",
                              )}
                            >
                              {relativeDayLabel(application.followUpDate)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              aria-label={`Edit ${application.company} application`}
                              onClick={(event) => {
                                event.stopPropagation();
                                openEdit(application);
                              }}
                              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${application.company} application`}
                              onClick={(event) => {
                                event.stopPropagation();
                                requestDelete(application);
                              }}
                              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                            >
                              <Trash className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ApplicationFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        application={editing}
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
