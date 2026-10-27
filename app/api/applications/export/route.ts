import { requireUserId, handleApiError } from "@/lib/api";
import { listApplications } from "@/lib/applications";
import { toCsv } from "@/lib/csv";
import { STATUS_META } from "@/lib/constants";

export async function GET() {
  try {
    const userId = await requireUserId();
    const applications = await listApplications(userId);

    const csv = toCsv(
      [
        "Company",
        "Role",
        "Status",
        "Location",
        "Salary",
        "Job URL",
        "Applied date",
        "Follow-up date",
        "Notes",
        "Created at",
      ],
      applications.map((app) => [
        app.company,
        app.role,
        STATUS_META[app.status].label,
        app.location ?? "",
        app.salary ?? "",
        app.jobUrl ?? "",
        app.appliedDate ?? "",
        app.followUpDate ?? "",
        app.notes ?? "",
        app.createdAt,
      ]),
    );

    const filename = `devhire-applications-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
