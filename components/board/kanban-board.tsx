"use client";

import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { ApplicationStatus } from "@prisma/client";

import { ApplicationCard } from "@/components/applications/application-card";
import { BoardColumn } from "@/components/board/board-column";
import { useApplications, type ReorderItem } from "@/hooks/use-applications";
import { sortByPosition } from "@/hooks/use-application-filters";
import { APPLICATION_STATUSES, STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ApplicationDTO } from "@/types";

export function KanbanBoard({
  applications,
  filtersActive,
  onOpen,
  onAdd,
}: {
  applications: ApplicationDTO[];
  filtersActive: boolean;
  onOpen: (app: ApplicationDTO) => void;
  onAdd: (status: ApplicationStatus) => void;
}) {
  const { applications: allApplications, moveApplications } = useApplications();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileStatus, setMobileStatus] =
    useState<ApplicationStatus>("WISHLIST");
  const touchStartX = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const grouped = useMemo(() => {
    const map = new Map<ApplicationStatus, ApplicationDTO[]>();
    for (const status of APPLICATION_STATUSES) {
      map.set(
        status,
        sortByPosition(applications.filter((app) => app.status === status)),
      );
    }
    return map;
  }, [applications]);

  const activeApplication = activeId
    ? applications.find((app) => app.id === activeId)
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeApp = allApplications.find((app) => app.id === active.id);
    if (!activeApp) return;
    if (active.id === over.id) return;

    const overData = over.data.current as
      | { type?: "card" | "column"; status?: ApplicationStatus }
      | undefined;

    const targetStatus = overData?.status ?? activeApp.status;

    const targetItems = sortByPosition(
      allApplications.filter(
        (app) => app.status === targetStatus && app.id !== activeApp.id,
      ),
    );

    const overIndex = targetItems.findIndex((app) => app.id === over.id);
    const isBelow =
      Boolean(active.rect.current.translated) &&
      Boolean(over.rect) &&
      active.rect.current.translated!.top > over.rect.top + over.rect.height / 2;

    const insertAt =
      overIndex === -1 ? targetItems.length : overIndex + (isBelow ? 1 : 0);

    const nextTarget = [...targetItems];
    nextTarget.splice(insertAt, 0, { ...activeApp, status: targetStatus });

    const updates: ReorderItem[] = nextTarget.map((app, index) => ({
      id: app.id,
      status: targetStatus,
      position: index,
    }));

    if (targetStatus !== activeApp.status) {
      const sourceItems = sortByPosition(
        allApplications.filter(
          (app) => app.status === activeApp.status && app.id !== activeApp.id,
        ),
      );
      sourceItems.forEach((app, index) => {
        updates.push({
          id: app.id,
          status: activeApp.status,
          position: index,
        });
      });
    }

    void moveApplications(updates);
  }

  function switchStatus(direction: 1 | -1) {
    const index = APPLICATION_STATUSES.indexOf(mobileStatus);
    const next = Math.min(
      APPLICATION_STATUSES.length - 1,
      Math.max(0, index + direction),
    );
    setMobileStatus(APPLICATION_STATUSES[next]);
  }

  return (
    <div>
      {/* Mobile status tabs */}
      <div
        role="tablist"
        aria-label="Pipeline stages"
        className="mb-3 flex gap-1.5 overflow-x-auto pb-1 lg:hidden"
      >
        {APPLICATION_STATUSES.map((status) => {
          const count = grouped.get(status)?.length ?? 0;
          const selected = mobileStatus === status;
          return (
            <button
              key={status}
              role="tab"
              aria-selected={selected}
              onClick={() => setMobileStatus(status)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                selected
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted-foreground",
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", STATUS_META[status].dot)}
                aria-hidden
              />
              {STATUS_META[status].label}
              <span className="tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {filtersActive ? (
        <p className="mb-2 text-[11px] text-muted-foreground lg:mb-3">
          Filters are active — clear them to drag and reorder cards.
        </p>
      ) : null}

      <DndContext
        id="application-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div
          className="scrollbar-slim flex items-stretch gap-3 overflow-x-auto pb-2"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const delta =
              (event.changedTouches[0]?.clientX ?? touchStartX.current) -
              touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < 70) return;
            switchStatus(delta < 0 ? 1 : -1);
          }}
        >
          {APPLICATION_STATUSES.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              applications={grouped.get(status) ?? []}
              onOpen={onOpen}
              onAdd={onAdd}
              disabled={filtersActive}
              className={cn(
                "w-full lg:min-w-[184px] lg:flex-1",
                status !== mobileStatus && "hidden lg:flex",
              )}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
          {activeApplication ? (
            <ApplicationCard application={activeApplication} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
