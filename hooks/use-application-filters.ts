"use client";

import { useCallback, useMemo, useState } from "react";

import { EMPTY_FILTERS, type ApplicationDTO, type FilterState } from "@/types";

export function useApplicationFilters(initial?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    ...EMPTY_FILTERS,
    ...initial,
  });

  const update = useCallback((patch: Partial<FilterState>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const hasFilters = useMemo(
    () =>
      filters.query.trim() !== "" ||
      filters.status !== "ALL" ||
      filters.from !== "" ||
      filters.to !== "",
    [filters],
  );

  return { filters, update, reset, hasFilters };
}

export function filterApplications(
  applications: ApplicationDTO[],
  filters: FilterState,
): ApplicationDTO[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = applications.filter((app) => {
    if (filters.status !== "ALL" && app.status !== filters.status) return false;

    if (query) {
      const haystack = [
        app.company,
        app.role,
        app.location ?? "",
        app.salary ?? "",
        app.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    const applied = app.appliedDate ?? app.createdAt.slice(0, 10);
    if (filters.from && applied < filters.from) return false;
    if (filters.to && applied > filters.to) return false;

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "oldest":
        return (a.appliedDate ?? a.createdAt).localeCompare(
          b.appliedDate ?? b.createdAt,
        );
      case "company":
        return a.company.localeCompare(b.company);
      case "follow-up": {
        if (!a.followUpDate && !b.followUpDate) return 0;
        if (!a.followUpDate) return 1;
        if (!b.followUpDate) return -1;
        return a.followUpDate.localeCompare(b.followUpDate);
      }
      case "newest":
      default:
        return (b.appliedDate ?? b.createdAt).localeCompare(
          a.appliedDate ?? a.createdAt,
        );
    }
  });
}

export function sortByPosition(applications: ApplicationDTO[]) {
  return [...applications].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return a.createdAt.localeCompare(b.createdAt);
  });
}
