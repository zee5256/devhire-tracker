import { Download } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";

/**
 * Links to the CSV route handler. It is a file download rather than an app
 * page, so a plain anchor is intentional (no client-side navigation).
 */
export function ExportCsvLink({
  label = "Export CSV",
  variant = "outline",
  size = "md",
}: {
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <a
      href="/api/applications/export"
      download
      className={buttonStyles({ variant, size })}
    >
      <Download className="size-4" aria-hidden />
      {label}
    </a>
  );
}
