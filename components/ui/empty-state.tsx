import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="mb-3 grid size-11 place-items-center rounded-2xl bg-accent/10 text-accent">
          <Icon className="size-5" aria-hidden />
        </span>
      ) : null}
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
