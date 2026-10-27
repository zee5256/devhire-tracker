"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { Input, Select } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { APPLICATION_STATUSES, SORT_OPTIONS, STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/types";

export function FilterBar({
  filters,
  onChange,
  onReset,
  hasFilters,
  resultCount,
  showSort = false,
  className,
}: {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  hasFilters: boolean;
  resultCount: number;
  showSort?: boolean;
  className?: string;
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={cn("surface p-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={filters.query}
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder="Search company, role, notes…"
            aria-label="Search applications"
            className="pl-9"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 sm:hidden"
          aria-expanded={showFilters}
          aria-controls="advanced-filters"
          onClick={() => setShowFilters((open) => !open)}
        >
          <SlidersHorizontal className="size-3.5" aria-hidden />
          Filters
          {hasFilters ? (
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          ) : null}
        </Button>

        <div
          id="advanced-filters"
          className={cn(
            "w-full flex-wrap items-center gap-2 sm:contents",
            showFilters ? "flex" : "hidden sm:contents",
          )}
        >
          <Select
            value={filters.status}
            onChange={(event) =>
              onChange({
                status: event.target.value as FilterState["status"],
              })
            }
            aria-label="Filter by status"
            containerClassName="w-full sm:w-36"
          >
            <option value="ALL">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </Select>

          {showSort ? (
            <Select
              value={filters.sort}
              onChange={(event) =>
                onChange({ sort: event.target.value as FilterState["sort"] })
              }
              aria-label="Sort applications"
              containerClassName="w-full sm:w-36"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          ) : null}

          <div className="flex w-full items-center gap-1.5 sm:w-auto">
            <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
              Applied
            </span>
            <Input
              type="date"
              value={filters.from}
              onChange={(event) => onChange({ from: event.target.value })}
              aria-label="Applied from"
              className="min-w-0 flex-1 text-xs [color-scheme:light] sm:w-32 sm:flex-none dark:[color-scheme:dark]"
            />
            <span className="text-xs text-muted-foreground" aria-hidden>
              –
            </span>
            <Input
              type="date"
              value={filters.to}
              onChange={(event) => onChange({ to: event.target.value })}
              aria-label="Applied to"
              className="min-w-0 flex-1 text-xs [color-scheme:light] sm:w-32 sm:flex-none dark:[color-scheme:dark]"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={!hasFilters}
            className="shrink-0"
          >
            <X className="size-3.5" aria-hidden />
            Clear
          </Button>

          <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}
