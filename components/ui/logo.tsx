import { SquareKanban } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showWordmark = true,
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-offset-4",
        className,
      )}
      aria-label="DevHire Tracker home"
    >
      <span className="relative grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground shadow-sm shadow-accent/30 transition-transform group-hover:-rotate-3">
        <SquareKanban className="size-5" aria-hidden />
      </span>
      {showWordmark ? (
        <span className="text-[15px] font-semibold tracking-tight">
          DevHire
          <span className="ml-1 font-normal text-muted-foreground">Tracker</span>
        </span>
      ) : null}
    </Link>
  );
}
