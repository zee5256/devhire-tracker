import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "surface relative overflow-hidden p-4",
        accent && "border-accent/25 bg-accent/[0.04]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <span
            className={cn(
              "hidden size-9 shrink-0 place-items-center rounded-xl border border-border bg-muted/50 text-muted-foreground sm:grid",
              accent && "border-accent/20 bg-accent/10 text-accent",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}
      </div>
    </div>
  );
}
